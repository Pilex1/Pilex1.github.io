class Manager {

	public static get Floor(): number {
		return 10000;
	}

	private chunks: Chunk[];
	private player: Player;

	constructor() {

		this.chunks = [];
		for (let i = 0; i < 2000; i++) {
			this.chunks.push(new Chunk(i));
		}

		this.player = new Player();
		this.addEntity(new Guide());

		var file = (<HTMLLinkElement>document.getElementById("terrainFile")).import;
		var content = file.querySelector("body").innerHTML;
		this.loadWorld(content);
	}

	removeWorld(): void {
		for (var i = 0; i < this.chunks.length; i++) {
			this.chunks[i].removeAllPlatforms();
		}
	}

	loadWorld(content: string): void {
		this.removeWorld();
		var lines = content.split("\n");
		for (let i = 0; i < lines.length; i++) {
			var p = Platform.loadString(lines[i]);
			if (p !== null) {
				this.addPlatform(p);
			}
		}
	}

	saveWorld(): string {
		var s = "";
		var platforms = this.getAllPlatforms();
		for (var p of platforms) {
			s += p.toString() + "\n";
		}
		return s;
	}

	getAllEntities(): Set<Entity> {
		var entities = new Set<Entity>();
		for (var i = 0; i < this.chunks.length; i++) {
			for (var e of this.chunks[i].getEntities()) {
				entities.add(e);
			}
		}
		return entities;
	}

	getAllNpcs(): Set<Npc> {
		var npcs = new Set<Npc>();
		for (var i = 0; i < this.chunks.length; i++) {
			for (var e of this.chunks[i].getEntities()) {
				if (e instanceof Npc) {
					npcs.add(e);
				}
			}
		}
		return npcs;
	}

	getClosestNpc(e: Entity): Npc {
		var minDist = Number.MAX_VALUE;
		var closestNpc = null;
		var chunks = this.getActiveChunks();
		for (var i = 0; i < chunks.length; i++) {
			for (var en of chunks[i].getEntities()) {
				if (en === e) continue;
				if (!(en instanceof Npc)) continue;
				var dist = en.getDistanceTo(e);
				if (dist < minDist) {
					minDist = dist;
					closestNpc = en;
				}
			}
		}
		return closestNpc;
	}

	// entity must not move
	addEntity(e: Entity): void {
		var left = e.hitbox.x1;
		var right = e.hitbox.x2;
		var idLeft = math.floor(left / Chunk.Width);
		var idRight = math.floor(right / Chunk.Width);
		for (var i = idLeft; i <= idRight; i++) {
			this.chunks[i].addEntity(e);
		}
	}

	resetBlocks(): void {
		for (var i = 0; i < this.chunks.length; i++) {
			this.chunks[i].resetBlocks();
		}
	}

	getPlayer(): Player {
		return this.player;
	}

	getPreviousCheckpoint(e: Entity): Checkpoint {
		var next: Checkpoint = null;
		var ex = e.hitbox.x1;
		for (var c of this.getAllCheckpoints()) {
			var x = c.getHitbox().x1;
			if (x >= ex) continue;
			if (next == null) {
				next = c;
			} else {
				var cx = next.getHitbox().x1;
				if (x > cx) {
					next = c;
				}
			}
		}
		return next;
	}

	getNextCheckpoint(e: Entity): Checkpoint {
		var next: Checkpoint = null;
		var ex = e.hitbox.x1;
		for (var c of this.getAllCheckpoints()) {
			var x = c.getHitbox().x1;
			if (x <= ex) continue;
			if (next == null) {
				next = c;
			} else {
				var cx = next.getHitbox().x1;
				if (x < cx) {
					next = c;
				}
			}
		}
		return next;
	}

	getActiveCheckpoint(): Checkpoint {
		for (var c of this.getAllCheckpoints()) {
			if (c.isChecked()) return c;
		}
		return null;
	}
	getAllCheckpoints(): Set<Checkpoint> {
		var checkpoints = new Set<Checkpoint>();
		for (var p of this.getAllPlatforms()) {
			if (p instanceof Checkpoint) {
				checkpoints.add(p);
			}
		}
		return checkpoints;
	}

	addPlatform(p: Platform): void {
		var left = p.leftBoundary;
		var right = p.rightBoundary;
		var idLeft = math.floor(left / Chunk.Width);
		var idRight = math.floor(right / Chunk.Width);
		for (var i = idLeft; i <= idRight; i++) {
			this.chunks[i].addPlatform(p);
		}
	}
	removePlatform(p: Platform): void {
		for (var i = 0; i < this.chunks.length; i++) {
			this.chunks[i].removePlatform(p);
		}
	}

	get chunkCurId(): number {
		return math.floor(this.player.hitbox.centerX / Chunk.Width) + 1;
	}
	get chunkRadius(): number {
		return math.floor(renderer.view.width / 2 / Chunk.Width) + 2;
	}
	getActiveChunks(): Chunk[] {
		var chunkMin = this.chunkCurId - this.chunkRadius;
		chunkMin = math.max(0, chunkMin);
		var chunkMax = this.chunkCurId + this.chunkRadius;
		chunkMax = math.min(this.chunks.length - 1, chunkMax);
		var active: Chunk[] = [];
		for (var i = chunkMin; i <= chunkMax; i++) {
			active.push(this.chunks[i]);
		}
		return active;
	}
	getActiveEntities(): Set<Entity> {
		var chunks = this.getActiveChunks();
		var entities = new Set();
		for (var i = 0; i < chunks.length; i++) {
			var c = chunks[i];
			for (let e of c.getEntities()) {
				entities.add(e);
			}
		}
		entities.add(this.player);
		return entities;
	}
	getAllPlatforms(): Set<Platform> {
		var platforms = new Set<Platform>();
		for (var i = 0; i < this.chunks.length; i++) {
			var c = this.chunks[i];
			var ps = c.getPlatforms();
			for (var p of ps) {
				platforms.add(p);
			}
		}
		return platforms;
	}
	getActivePlatforms(): Set<Platform> {
		var chunks = this.getActiveChunks();
		var platforms = new Set<Platform>();
		for (var i = 0; i < chunks.length; i++) {
			var c = chunks[i];
			for (let p of c.getPlatforms()) {
				platforms.add(p);
			}
		}
		return platforms;
	}
	getCollidingNotSolidPlatforms(e: Entity): Set<Platform> {
		var colliding = new Set<Platform>();
		var c = this.getActiveChunks();
		for (var i = 0; i < c.length; i++) {
			var ps = c[i].getPlatforms();
			for (var p of ps) {
				if (p.isIntersecting(e) && !p.isSolid()) {
					colliding.add(p);
				}
			}
		}
		return colliding;
	}
	getCollidingPlatforms(e: Entity): Set<Platform> {
		var colliding = new Set<Platform>();
		var c = this.getActiveChunks();
		for (var i = 0; i < c.length; i++) {
			var ps = c[i].getPlatforms();
			for (var p of ps) {
				if (p.isIntersecting(e) && p.isSolid()) {
					colliding.add(p);
				}
			}
		}
		return colliding;
	}

	update(): void {
		var platforms = this.getActivePlatforms();
		for (var p of platforms) {
			p.onUpdate();
		}

		var entities = this.getActiveEntities();
		for (var e of entities) {
			e.update();
		}
	}

	render(): void {

		graphics.beginFill(0x7896d2);
		graphics.drawRect(0, 0, renderer.view.width, renderer.view.height);

		var cameraPos = this.player.cameraPos;
		var platforms = this.getActivePlatforms();
		for (var p of platforms) {
			p.onRender(cameraPos);
		}

		var entities = this.getActiveEntities();
		for (var e of entities) {
			e.onRender(cameraPos);
		}
	}

}