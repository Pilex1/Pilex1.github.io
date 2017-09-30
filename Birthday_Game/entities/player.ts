enum Action {
	Playing, EditPos, EditSize, Removing
}

class Player extends Npc {

	private deaths: number = 0;
	private flying: boolean = false;
	private defaultSpawn: number[];
	private npcRange: number = 300;

	private action: Action = Action.Playing;
	private blocks: string[] = [Platform.name, Checkpoint.name, VBounce.name, HBounce.name, Invisible.name, Phantom.name];
	private editingBlockId: number = 0;
	private guidePos: number[] = [0, 0];
	private guide: GuidePlatform = new GuidePlatform();
	private guideRemoval: GuideRemovalPlatform = new GuideRemovalPlatform();

	private tutorialMove: boolean = false;
	private tutorialTalk: boolean = false;

	private tutorialEdit: boolean = false;
	private tutorialRemove: boolean = false;
	private tutorialTeleport: boolean = false;

	private tutorialText: PIXI.Text;
	private deathText: PIXI.Text;
	private debugText: PIXI.Text;
	private editingBlockText: PIXI.Text;

	constructor() {
		super([150, Manager.Floor], "", new Color(0xFFFFFF));
		this.defaultSpawn = this.hitbox.getPos();

		this.tutorialText = new PIXI.Text("", { fontSize: 24, fontFamily: "Tw Cen MT", fill: "0xffffff" });
		this.tutorialText.anchor.x = 0.5;
		this.tutorialText.anchor.y = 0;
		this.tutorialText.position.x = renderer.view.width / 2;
		this.tutorialText.position.y = 0;
		stage.addChild(this.tutorialText);

		this.debugText = new PIXI.Text("", { fontSize: 24, fontFamily: "Tw Cen MT", fill: "0xffffff" });
		this.debugText.anchor.x = 0;
		this.debugText.anchor.y = 0;
		this.debugText.position.x = 0;
		this.debugText.position.y = 0;
		stage.addChild(this.debugText);

		this.editingBlockText = new PIXI.Text("", { fontSize: 24, fontFamily: "Tw Cen MT", fill: "0xffffff" });
		this.editingBlockText.anchor.x = 0.5;
		this.editingBlockText.anchor.y = 1;
		this.editingBlockText.position.x = renderer.view.width / 2;
		this.editingBlockText.position.y = renderer.view.height;
		stage.addChild(this.editingBlockText);

		this.deathText = new PIXI.Text("", { fontSize: 24, fontFamily: "Tw Cen MT", fill: "0xffffff" });
		this.deathText.anchor.x = 1;
		this.deathText.anchor.y = 1;
		this.deathText.position.x = renderer.view.width;
		this.deathText.position.y = renderer.view.height;
		stage.addChild(this.deathText);
	}

	private isEditing(): boolean {
		if (!edit) return false;
		return this.action === Action.EditPos || this.action === Action.EditSize;
	}
	private isRemoving(): boolean {
		if (!edit) return false;
		return this.action === Action.Removing;
	}

	private setAction(action: Action): void {
		if (this.isEditing()) {
			this.guide.getHitbox().setSize([50, 50]);
		}
		this.action = action;
	}

	get cameraPos(): number[] {
		return [this.hitbox.centerX - renderer.view.width / 2, this.hitbox.centerY - renderer.view.height / 2];
	}

	private checkRespawn(): void {
		if (this.hitbox.centerY >= Manager.Floor + 2000) {
			var c = manager.getActiveCheckpoint();
			if (c === null) {
				this.hitbox.setPos(this.defaultSpawn);
			} else {
				this.hitbox.x1 = c.getHitbox().x1;
				this.hitbox.y2 = c.getHitbox().y2;
			}
			this.velX = 0;
			this.velY = 0;
			manager.resetBlocks();
			this.deaths += 1;
		}
	}

	private getMousePos(): number[] {
		var mx = mouseX + this.hitbox.centerX - renderer.view.width / 2;
		var my = mouseY + this.hitbox.centerY - renderer.view.height / 2;
		return [mx, my];
	}

	private getSelectedPlatform(): Platform {
		var platforms = manager.getActivePlatforms();
		var selected: Platform = null;
		for (var p of platforms) {
			var mousePos = this.getMousePos();
			if (p.getHitbox().inside(mousePos)) {
				selected = p;
				break;
			}
		}
		return selected;
	}

	onMouseClick(e: MouseEvent): void {
		if (this.action === Action.EditPos) {
			this.action = Action.EditSize;
			if (this.blocks[this.editingBlockId] === Checkpoint.name) {
				var pos = this.guide.getHitbox().getPos();
				var y = pos[1] + 50 - (Checkpoint.StickHeight + Checkpoint.FlagHeight - Checkpoint.Offset);
				var x = pos[0];
				manager.addPlatform(new Checkpoint([x, y]));
				this.setAction(Action.EditPos);
			}
		} else if (this.action === Action.EditSize) {
			var rect = this.guide.getHitbox().regularise();
			for (var i = 0; i < rect.width / 50; i++) {
				for (var j = 0; j < rect.height / 50; j++) {
					var pos = rect.getPos();
					pos[0] += i * 50;
					pos[1] += j * 50;
					if (this.blocks[this.editingBlockId] === Platform.name) {
						manager.addPlatform(new Platform(pos));
					} else if (this.blocks[this.editingBlockId] === VBounce.name) {
						manager.addPlatform(new VBounce(pos));
					} else if (this.blocks[this.editingBlockId] === HBounce.name) {
						manager.addPlatform(new HBounce(pos));
					} else if (this.blocks[this.editingBlockId] === Invisible.name) {
						manager.addPlatform(new Invisible(pos));
					} else if (this.blocks[this.editingBlockId] === Phantom.name) {
						manager.addPlatform(new Phantom(pos));
					}
				}
			}
			this.setAction(Action.EditPos);
		}
	}
	onKeyType(e: KeyboardEvent): void {
		if (e.code === "Enter") {
			var npc = manager.getClosestNpc(this);
			if (npc !== null) {
				if (npc.getDistanceTo(this) <= this.npcRange) {
					npc.talk();
					this.tutorialTalk = true;
				}
			}
		}
		if (edit) {
			if (e.code === "KeyE") {
				this.setAction(Action.EditPos);
			}
			if (e.code === "KeyR") {
				this.setAction(Action.Removing);
			}
		}
	}
	onMouseScroll(e: WheelEvent): void {
		if (e.deltaY < 0) {
			this.editingBlockId--;
			if (this.editingBlockId < 0) {
				this.editingBlockId = this.blocks.length - 1;
			}
		} else if (e.deltaY > 0) {
			this.editingBlockId++;
			if (this.editingBlockId >= this.blocks.length - 1) {
				this.editingBlockId = 0;
			}
		}
	}

	private handleInputs(): void {
		if (keys["Escape"]) {
			this.setAction(Action.Playing);
		}
		this.useGravity = edit ? !this.flying : true;
		if (keys["KeyW"]) {
			this.tutorialMove = true;
			if (this.useGravity) {
				this.jump();
			} else {
				this.flyUp();
			}
		}
		if (keys["KeyS"]) {
			this.tutorialMove = true;
			if (this.useGravity) {
			} else {
				this.flyDown();
			}
		}
		if (keys["KeyA"]) {
			this.tutorialMove = true;
			if (this.useGravity) {
				this.strafeLeft();
			} else {
				this.flyLeft();
			}
		}
		if (keys["KeyD"]) {
			this.tutorialMove = true;
			if (this.useGravity) {
				this.strafeRight();
			} else {
				this.flyRight();
			}
		}
	}

	private vectorToString(p: number[]): string {
		return "[" + (<number>math.round(p[0] * 100) / 100).toFixed(2) + ", " + (<number>math.round(p[1] * 100) / 100).toFixed(2) + "]";
	}

	private renderDebug(): void {
		if (edit) {
			var str = "";
			str += "Pos: " + this.vectorToString(this.hitbox.center) + "\n";
			str += "Mouse Pos: " + this.vectorToString(this.getMousePos()) + "\n";
			str += "Vel: " + this.vectorToString(this.vel) + "\n";
			if (this.isEditing()) {
				str += "Edit Pos: " + this.vectorToString(this.guide.getHitbox().getPos()) + "\n";
				str += "Edit Size: " + this.vectorToString(this.guide.getHitbox().getSize()) + "\n";
			} else if (this.isRemoving()) {
				str += "Removal Pos: " + this.vectorToString(this.guideRemoval.getHitbox().getPos()) + "\n";
				str += "Removal Size: " + this.vectorToString(this.guideRemoval.getHitbox().getSize()) + "\n";
			}
			this.debugText.text = str;
		} else {
			this.debugText.text = "";
		}
	}

	private leaveAllTalking(): void {
		for (var npc of manager.getAllNpcs()) {
			npc.leaveTalking();
		}
	}

	private handleNpcs(): void {
		var npc = manager.getClosestNpc(this);
		if (npc !== null && npc.getDistanceTo(this) > this.npcRange) {
			this.leaveAllTalking();
		}
	}

	// returns top left
	private blockify(v: number[], s: number) {
		return [math.sign(v[0]) * math.floor(math.abs(v[0]) / s) * s, math.sign(v[1]) * math.floor(math.abs(v[1]) / s) * s];
	}
	private blockifyCeil(v: number[], s: number) {
		var x = 0;
		if (v[0] < 0) {
			x = math.min(-s, math.floor(v[0] / s) * s);
		} else {
			x = math.max(s, math.ceil(v[0] / s) * s);
		}
		var y = 0;
		if (v[1] < 0) {
			y = math.min(-s, math.floor(v[1] / s) * s);
		} else {
			y = math.max(s, math.ceil(v[1] / s) * s);
		}
		return [x, y];
	}

	private handleEditing(): void {
		if (this.isEditing()) {
			this.editingBlockText.text = this.blocks[this.editingBlockId];
			var mousePos = this.getMousePos();

			if (this.action === Action.EditPos) {
				// top left
				this.guidePos = this.blockify(mousePos, 10);
				this.guide.getHitbox().setPos(this.guidePos);
				this.guide.getHitbox().setSize([50, 50]);
			} else if (this.action == Action.EditSize) {
				var offset = math.subtract(mousePos, this.guidePos);
				if (offset[0] <= 0) {
					// mouse to left of guide
					this.guide.getHitbox().x1 = this.guidePos[0] + 50;
				} else {
					this.guide.getHitbox().x1 = this.guidePos[0];
				}
				if (offset[1] <= 0) {
					// mouse above guide
					this.guide.getHitbox().y1 = this.guidePos[1] + 50;
				} else {
					this.guide.getHitbox().y1 = this.guidePos[1];
				}
				var newOffset = math.subtract(mousePos, this.guidePos);
				if (offset[0] <= 0) {
					newOffset[0] -= 50;
				}
				if (offset[1] <= 0) {
					newOffset[1] -= 50;
				}
				this.guide.getHitbox().setSize(this.blockifyCeil(<number[]>newOffset, 50));
			}
		} else {
			this.editingBlockText.text = "";
			this.guide.getHitbox().setSize([0, 0]);
		}
	}

	private handleRemoving(): void {
		if (this.isRemoving()) {
			var p = this.getSelectedPlatform();
			if (p !== null) {
				this.guideRemoval.getHitbox().setPos(p.getHitbox().getPos());
				this.guideRemoval.getHitbox().setSize(p.getHitbox().getSize());
				if (mouseButtons[0]) {
					manager.removePlatform(p);
				}
			} else {
				this.guideRemoval.getHitbox().setSize([0, 0]);
			}
		} else {
			this.guideRemoval.getHitbox().setSize([0, 0]);
		}
	}

	onUpdate(): void {
		this.handleInputs();
		this.handleNpcs();
		this.checkRespawn();

		this.handleEditing();
		this.handleRemoving();
		this.renderDebug();
	}

	onRender(camera: number[]): void {
		super.onRender(camera);
		if (this.isEditing()) {
			this.guide.onRender(camera);
		} else if (this.isRemoving()) {
			this.guideRemoval.onRender(camera);
		}

		this.deathText.text = "Deaths: " + this.deaths;
	}
}