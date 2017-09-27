class VBounce extends Platform {

    static get Id(): string {
        return "V";
    }

    private hBounceStrength: number = 1.05;
    private vBounceStrength: number = -1.5;
    private maxVel: number = -20;

    constructor(pos: number[]) {
        super(pos);
        this.fillColor = 0x6e38ff;
    }

    onCollisionUp(e: Entity) {
        if (e.velY >= 0) return;
        e.velX *= this.hBounceStrength;    
        e.velY *= this.vBounceStrength;
    }

    onCollisionDown(e: Entity) {
        if (e.velY <= 0) return;
        e.velX *= this.hBounceStrength;    
        e.velY *= this.vBounceStrength;
    }

}