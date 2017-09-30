class Platform {
    constructor(pos) {
        this.strokeColor = null;
        this.fillColor = new Color(0x264270);
        this.strokeWidth = 1;
        this.friction = 0.85;
        this.solid = true;
        this.hitbox = new Rectangle(pos, [50, 50]);
    }
    static get Id() {
        return "P";
    }
    reset() { }
    getFriction() {
        return this.friction;
    }
    get leftBoundary() {
        return this.hitbox.x1;
    }
    get rightBoundary() {
        return this.hitbox.x2;
    }
    getHitbox() {
        return this.hitbox;
    }
    isSolid() {
        return this.solid;
    }
    isIntersecting(e) {
        return this.hitbox.isIntersecting(e.hitbox);
    }
    onCollisionUp(e) {
        if (!this.solid) {
            return;
        }
        e.velY = 0;
    }
    onCollisionDown(e) {
        if (!this.solid) {
            return;
        }
        e.velY = 0;
    }
    onCollisionLeft(e) {
        if (!this.solid) {
            return;
        }
        e.velX = 0;
    }
    onCollisionRight(e) {
        if (!this.solid) {
            return;
        }
        e.velX = 0;
    }
    onUpdate() {
    }
    onRender(camera) {
        if (this.strokeColor === null) {
            graphics.lineStyle(this.strokeWidth, this.fillColor.value, this.fillColor.alpha);
        }
        else {
            graphics.lineStyle(this.strokeWidth, this.strokeColor.value, this.strokeColor.alpha);
        }
        graphics.beginFill(this.fillColor.value, this.fillColor.alpha);
        graphics.drawRect(this.hitbox.x1 - camera[0], this.hitbox.y1 - camera[1], this.hitbox.width, this.hitbox.height);
    }
    static loadString(s) {
        var arr = s.split(" ");
        var pos = [parseFloat(arr[1]), parseFloat(arr[2])];
        if (arr[0] === Platform.Id) {
            return new Platform(pos);
        }
        else if (arr[0] === Checkpoint.Id) {
            return new Checkpoint(pos);
        }
        else if (arr[0] === HBounce.Id) {
            return new HBounce(pos);
        }
        else if (arr[0] === VBounce.Id) {
            return new VBounce(pos);
        }
        else if (arr[0] === Invisible.Id) {
            return new Invisible(pos);
        }
        else if (arr[0] === Phantom.Id) {
            return new Phantom(pos);
        }
        else {
            return null;
        }
    }
}
