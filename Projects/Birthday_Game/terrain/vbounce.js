class VBounce extends Platform {
    constructor(pos) {
        super(pos);
        this.hBounceStrength = 1.05;
        this.vBounceStrength = -1.5;
        this.maxVel = -20;
        this.fillColor = new Color(0x6e38ff);
    }
    static get Id() {
        return "V";
    }
    toString() {
        return this.saveString(VBounce.Id);
    }
    onCollisionUp(e) {
        if (e.velY >= 0)
            return;
        e.velX *= this.hBounceStrength;
        e.velY *= this.vBounceStrength;
    }
    onCollisionDown(e) {
        if (e.velY <= 0)
            return;
        e.velX *= this.hBounceStrength;
        e.velY *= this.vBounceStrength;
    }
}
