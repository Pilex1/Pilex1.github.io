class Phantom extends Platform {
    constructor(pos) {
        super(pos);
        this.activated = false;
        this.solid = false;
    }
    static get Id() {
        return "PH";
    }
    toString() {
        return this.saveString(Phantom.Id);
    }
    onCollisionUp(e) {
        this.activated = true;
    }
    onCollisionDown(e) {
        this.activated = true;
    }
    onRender(camera) {
        if (!this.activated) {
            super.onRender(camera);
        }
    }
    reset() {
        this.activated = false;
        this.solid = false;
    }
}
