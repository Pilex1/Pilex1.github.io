class Player extends Npc {

	private deaths: number = 0;
	private flying: boolean = false;
	private defaultSpawn: number[];
	private npcRange: number = 300;

	private tutorialMove: boolean = false;
	private tutorialTalk: boolean = false;

	constructor() {
		super([150, Manager.Floor], "", 0xFFFFFF);
		this.defaultSpawn = this.hitbox.getPos();
	}

	get cameraPos(): number[] {
		return [this.hitbox.centerX - renderer.view.width / 2, this.hitbox.centerY - renderer.view.height / 2];
	}

	private checkRespawn() {
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
	}

	private handleInputs(): void {
		this.useGravity = !this.flying;
		if (keys["KeyW"]) {
			this.tutorialMove = true;
			if (this.flying) {
				this.flyUp();
			} else {
				this.jump();
			}
		}
		if (keys["KeyS"]) {
			this.tutorialMove = true;
			if (this.flying) {
				this.flyDown();
			}
		}
		if (keys["KeyA"]) {
			this.tutorialMove = true;
			if (this.flying) {
				this.flyLeft();
			} else {
				this.strafeLeft();
			}
		}
		if (keys["KeyD"]) {
			this.tutorialMove = true;
			if (this.flying) {
				this.flyRight();
			} else {
				this.strafeRight();
			}
		}
	}

	private renderDebug(): void {

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

	onUpdate(): void {
		this.handleInputs();
		this.handleNpcs();
		this.checkRespawn();
	}
}