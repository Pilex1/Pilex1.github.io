class HBounce extends Platform {

    static get Id(): string {
        return "H";
    }

    private hBounceStrength: number = 70;
    private vBounceStrength: number = -8;

    constructor(pos: number[]) {
        super(pos);
        this.fillColor = new Color(0x16b84f);
    }

    onCollisionLeft(e: Entity) {
        if (e.velX >= 0) return;
        e.velX = this.hBounceStrength;
        e.velY = this.vBounceStrength;
    }

    onCollisionRight(e: Entity) {
        if (e.velX <= 0) return;
        e.velX = -this.hBounceStrength;
        e.velY = this.vBounceStrength;
    }

}