class Invisible extends Platform {

    static get Id(): string {
        return "I";
    }

    private activated: boolean = false;

    constructor(pos: number[]) {
        super(pos);
        this.solid = false;
    }

    onCollisionUp(e: Entity) {
        this.activated = true;
        this.solid = true;
        super.onCollisionUp(e);
    }

    onRender(camera: number[]) {
        if (this.activated) {
            super.onRender(camera);
        }
    }

    reset() {
        this.activated = false;
        this.solid = false;
    }
}