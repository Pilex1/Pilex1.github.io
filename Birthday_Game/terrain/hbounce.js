class HBounce extends Platform {
    constructor(pos) {
        super(pos);
        this.hBounceStrength = 70;
        this.vBounceStrength = -8;
        this.fillColor = new Color(0x16b84f);
    }
    static get Id() {
        return "H";
    }
    onCollisionLeft(e) {
        if (e.velX >= 0)
            return;
        e.velX = this.hBounceStrength;
        e.velY = this.vBounceStrength;
    }
    onCollisionRight(e) {
        if (e.velX <= 0)
            return;
        e.velX = -this.hBounceStrength;
        e.velY = this.vBounceStrength;
    }
}
