class Chunk {
    static get Width() {
        return 400;
    }
    constructor(id) {
        this.platforms = new Set();
        this.entities = new Set();
        this.id = id;
    }
    resetBlocks() {
        for (var p of this.platforms) {
            p.reset();
        }
    }
    getPlatforms() {
        return this.platforms;
    }
    getEntities() {
        return this.entities;
    }
    get x1() {
        return this.id * Chunk.Width;
    }
    get x2() {
        return (this.id + 1) * Chunk.Width;
    }
    addEntity(e) {
        this.entities.add(e);
    }
    removeEntity(e) {
        this.entities.delete(e);
    }
    addPlatform(p) {
        this.platforms.add(p);
    }
    removePlatform(p) {
        this.platforms.delete(p);
    }
}
