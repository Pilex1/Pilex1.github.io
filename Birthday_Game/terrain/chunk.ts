class Chunk {

	static get Width(): number {
		return 400;
	}

	private id: number;
	private platforms: Set<Platform>;
	private entities: Set<Entity>;

	constructor(id: number) {
		this.platforms = new Set();
		this.entities = new Set();
		this.id = id;
	}

	removeAllPlatforms():void{
		this.platforms.clear();
	}

	resetBlocks():void{
		for (var p of this.platforms){
			p.reset();
		}
	}

	getPlatforms(): Set<Platform> {
		return this.platforms;
	}

	getEntities(): Set<Entity> {
		return this.entities;
	}

	get x1(): number {
		return this.id * Chunk.Width;
	}
	get x2(): number {
		return (this.id + 1) * Chunk.Width;
	}

	addEntity(e): void {
		this.entities.add(e);
	}
	removeEntity(e): void {
		this.entities.delete(e);
	}
	addPlatform(p): void {
		this.platforms.add(p);
	}
	removePlatform(p): void {
		this.platforms.delete(p);
	}
}