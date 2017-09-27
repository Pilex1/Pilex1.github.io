class Checkpoint extends Platform {
    constructor(pos) {
        super(pos);
        this.checked = false;
        this.hitbox.width = Checkpoint.FlagWidth;
        this.hitbox.height = Checkpoint.FlagHeight + Checkpoint.StickHeight - Checkpoint.Offset;
        this.solid = false;
    }
    static get Id() {
        return "C";
    }
    static get StickHeight() {
        return 120;
    }
    static get StickWidth() {
        return 20;
    }
    static get FlagHeight() {
        return 60;
    }
    static get FlagWidth() {
        return 60;
    }
    static get Offset() {
        return 20;
    }
    isChecked() {
        return this.checked;
    }
    onRender(camera) {
        graphics.lineStyle(1, 0x000000);
        graphics.beginFill(0x14141e);
        graphics.drawRect(this.hitbox.x1 - camera[0], this.hitbox.y2 - Checkpoint.StickHeight - camera[1], Checkpoint.StickWidth, Checkpoint.StickHeight);
        if (this.checked) {
            graphics.beginFill(0x25da65);
        }
        else {
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
