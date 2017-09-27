class Phantom extends Platform {
    
        static get Id(): string {
            return "PH";
        }
    
        private activated: boolean = false;
    
        constructor(pos: number[]) {
            super(pos);
            this.solid = false;
        }
    
        onCollisionUp(e: Entity) {
            this.activated = true;
        }

        onCollisionDown(e: Entity) {
            this.activated = true;
        }
    
        onRender(camera: number[]) {
            if (!this.activated) {
                super.onRender(camera);
            }
        }
    
        reset() {
            this.activated = false;
            this.solid = false;
        }
    }