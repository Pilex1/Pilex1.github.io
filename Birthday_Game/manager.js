class Manager {
    static get Floor() {
        return 10000;
    }
    constructor() {
        this.chunks = [];
        for (let i = 0; i < 2000; i++) {
            this.chunks.push(new Chunk(i));
        }
        this.player = new Player();
        this.addEntity(new Guide());
        var file = document.getElementById("terrainFile").import;
        var content = file.querySelector("body").innerHTML;
        var lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            var p = Platform.loadString(lines[i]);
            if (p !== null) {
                this.addPlatform(p);
            }
        }
    }
    getAllNpcs() {
        var npcs = new Set();
        for (var i = 0; i < this.chunks.length; i++) {
            for (var e of this.chunks[i].getEntities()) {
                if (e instanceof Npc) {
                    npcs.add(e);
                }
            }
        }
        return npcs;
    }
    getClosestNpc(e) {
        var minDist = Number.MAX_VALUE;
        var closestNpc = null;
        var chunks = this.getActiveChunks();
        for (var i = 0; i < chunks.length; i++) {
            for (var en of chunks[i].getEntities()) {
                if (en === e)
                    continue;
                if (!(en instanceof Npc))
                    continue;
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
    addEntity(e) {
        var left = e.hitbox.x1;
        var right = e.hitbox.x2;
        var idLeft = math.floor(left / Chunk.Width);
        var idRight = math.floor(right / Chunk.Width);
        for (var i = idLeft; i <= idRight; i++) {
            this.chunks[i].addEntity(e);
        }
    }
    resetBlocks() {
        for (var i = 0; i < this.chunks.length; i++) {
            this.chunks[i].resetBlocks();
        }
    }
    getPlayer() {
        return this.player;
    }
    getActiveCheckpoint() {
        for (var c of this.getAllCheckpoints()) {
            if (c.isChecked())
                return c;
        }
        return null;
    }
    getAllCheckpoints() {
        var checkpoints = new Set();
        for (var p of this.getAllPlatforms()) {
            if (p instanceof Checkpoint) {
                checkpoints.add(p);
            }
        }
        return checkpoints;
    }
    addPlatform(p) {
        var left = p.leftBoundary;
        var right = p.rightBoundary;
        var idLeft = math.floor(left / Chunk.Width);
        var idRight = math.floor(right / Chunk.Width);
        for (var i = idLeft; i <= idRight; i++) {
            this.chunks[i].addPlatform(p);
        }
    }
    get chunkCurId() {
        return math.floor(this.player.hitbox.centerX / Chunk.Width) + 1;
    }
    get chunkRadius() {
        return math.floor(renderer.view.width / 2 / Chunk.Width) + 2;
    }
    getActiveChunks() {
        var chunkMin = this.chunkCurId - this.chunkRadius;
        chunkMin = math.max(0, chunkMin);
        var chunkMax = this.chunkCurId + this.chunkRadius;
        chunkMax = math.min(this.chunks.length - 1, chunkMax);
        var active = [];
        for (var i = chunkMin; i <= chunkMax; i++) {
            active.push(this.chunks[i]);
        }
        return active;
    }
    getActiveEntities() {
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
    getAllPlatforms() {
        var platforms = new Set();
        for (var i = 0; i < this.chunks.length; i++) {
            var c = this.chunks[i];
            var ps = c.getPlatforms();
            for (var p of ps) {
                platforms.add(p);
            }
        }
        return platforms;
    }
    getActivePlatforms() {
        var chunks = this.getActiveChunks();
        var platforms = new Set();
        for (var i = 0; i < chunks.length; i++) {
            var c = chunks[i];
            for (let p of c.getPlatforms()) {
                platforms.add(p);
            }
        }
        return platforms;
    }
    getCollidingNotSolidPlatforms(e) {
        var colliding = new Set();
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
    getCollidingPlatforms(e) {
        var colliding = new Set();
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
    update() {
        var platforms = this.getActivePlatforms();
        for (var p of platforms) {
            p.onUpdate();
        }
        var entities = this.getActiveEntities();
        for (var e of entities) {
            e.update();
        }
    }
    render() {
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
