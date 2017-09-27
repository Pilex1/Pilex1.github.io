class Player extends Npc {
    constructor() {
        super([150, Manager.Floor], "", 0xFFFFFF);
        this.deaths = 0;
        this.flying = false;
        this.npcRange = 300;
        this.tutorialMove = false;
        this.tutorialTalk = false;
        this.defaultSpawn = this.hitbox.getPos();
    }
    get cameraPos() {
        return [this.hitbox.centerX - renderer.view.width / 2, this.hitbox.centerY - renderer.view.height / 2];
    }
    checkRespawn() {
        if (this.hitbox.centerY >= Manager.Floor + 2000) {
            var c = manager.getActiveCheckpoint();
            if (c === null) {
                this.hitbox.setPos(this.defaultSpawn);
            }
            else {
                this.hitbox.x1 = c.getHitbox().x1;
                this.hitbox.y2 = c.getHitbox().y2;
            }
            this.velX = 0;
            this.velY = 0;
            manager.resetBlocks();
            this.deaths += 1;
        }
    }
    onKeyType(e) {
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
    handleInputs() {
        this.useGravity = !this.flying;
        if (keys["KeyW"]) {
            this.tutorialMove = true;
            if (this.flying) {
                this.flyUp();
            }
            else {
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
            }
            else {
                this.strafeLeft();
            }
        }
        if (keys["KeyD"]) {
            this.tutorialMove = true;
            if (this.flying) {
                this.flyRight();
            }
            else {
                this.strafeRight();
            }
        }
    }
    renderDebug() {
    }
    leaveAllTalking() {
        for (var npc of manager.getAllNpcs()) {
            npc.leaveTalking();
        }
    }
    handleNpcs() {
        var npc = manager.getClosestNpc(this);
        if (npc !== null && npc.getDistanceTo(this) > this.npcRange) {
            this.leaveAllTalking();
        }
    }
    onUpdate() {
        this.handleInputs();
        this.handleNpcs();
        this.checkRespawn();
    }
}
