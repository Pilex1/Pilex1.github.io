class Checkpoint extends Platform {

    static get Id(): string {
        return "C";
    }

    static get StickHeight(): number {
        return 120;
    }
    static get StickWidth(): number {
        return 20;
    }
    static get FlagHeight(): number {
        return 60;
    }
    static get FlagWidth(): number {
        return 60;
    }
    static get Offset(): number {
        return 20;
    }

    private checked: boolean = false;

    constructor(pos: number[]) {
        super(pos);
        this.hitbox.width = Checkpoint.FlagWidth;
        this.hitbox.height = Checkpoint.FlagHeight + Checkpoint.StickHeight - Checkpoint.Offset;
        this.solid = false;
    }

    isChecked(): boolean {
        return this.checked;
    }

    onRender(camera: number[]) {
        graphics.lineStyle(1, 0x000000);
        graphics.beginFill(0x14141e);
        graphics.drawRect(this.hitbox.x1 - camera[0], this.hitbox.y2 - Checkpoint.StickHeight - camera[1], Checkpoint.StickWidth, Checkpoint.StickHeight);

        if (this.checked) {
            graphics.beginFill(0x25da65);
        } else {
            graphics.beginFill(0xff3a68);
        }
        graphics.drawPolygon([this.hitbox.x1 - camera[0], this.hitbox.y1 - camera[1], this.hitbox.x1 + Checkpoint.FlagWidth - camera[0],
        this.hitbox.y1 + Checkpoint.FlagHeight / 2 - camera[1], this.hitbox.x1 - camera[0],
        this.hitbox.y1 + Checkpoint.FlagHeight - camera[1]]);
    }

    onUpdate() {
        if (this.isIntersecting(manager.getPlayer())) {
            for (var c of manager.getAllCheckpoints()) {
                c.checked = false;
            }
            this.checked = true;
        }
    }

}