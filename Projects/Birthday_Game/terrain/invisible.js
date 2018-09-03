class Invisible extends Platform {
    constructor(pos) {
        super(pos);
        this.activated = false;
        this.solid = false;
    }
    static get Id() {
        return "I";
    }
    toString() {
        return this.saveString(Invisible.Id);
    }
    onCollisionUp(e) {
        this.activated = true;
        this.solid = true;
        super.onCollisionUp(e);
    }
    onRender(camera) {
        if (this.activated) {
            super.onRender(camera);
        }
    }
    reset() {
        this.activated = false;
        this.solid = false;
    }
}
