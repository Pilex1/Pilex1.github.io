class Platform {

	static get Id(): string {
		return "P";
	}

	protected strokeColor: Color = null;
	protected fillColor: Color = new Color(0x264270);
	protected strokeWidth: number = 1;

	protected hitbox: Rectangle;
	protected friction: number = 0.85;
	protected solid: boolean = true;

	constructor(pos: number[]) {
		this.hitbox = new Rectangle(pos, [50, 50]);
	}

	reset(): void { }

	getFriction(): number {
		return this.friction;
	}

	get leftBoundary(): number {
		return this.hitbox.x1;
	}
	get rightBoundary(): number {
		return this.hitbox.x2;
	}

	getHitbox(): Rectangle {
		return this.hitbox;
	}
	isSolid(): boolean {
		return this.solid;
	}

	isIntersecting(e: Entity): boolean {
		return this.hitbox.isIntersecting(e.hitbox);
	}

	onCollisionUp(e: Entity): void {
		if (!this.solid) {
			return;
		}
		e.velY = 0;
	}
	onCollisionDown(e: Entity): void {
		if (!this.solid) {
			return;
		}
		e.velY = 0;
	}
	onCollisionLeft(e: Entity): void {
		if (!this.solid) {
			return;
		}
		e.velX = 0;
	}
	onCollisionRight(e: Entity): void {
		if (!this.solid) {
			return;
		}
		e.velX = 0;
	}

	onUpdate(): void {
	}

	onRender(camera: number[]): void {
		if (this.strokeColor === null) {
			graphics.lineStyle(this.strokeWidth, this.fillColor.value, this.fillColor.alpha);
		} else {
			graphics.lineStyle(this.strokeWidth, this.strokeColor.value, this.strokeColor.alpha);
		}
		graphics.beginFill(this.fillColor.value, this.fillColor.alpha);
		graphics.drawRect(this.hitbox.x1 - camera[0], this.hitbox.y1 - camera[1], this.hitbox.width, this.hitbox.height);
	}

	static loadString(s): Platform {
		var arr = s.split(" ");
		var pos = [parseFloat(arr[1]), parseFloat(arr[2])];
		if (arr[0] === Platform.Id) {
			return new Platform(pos);
		} else if (arr[0] === Checkpoint.Id) {
			return new Checkpoint(pos);
		} else if (arr[0] === HBounce.Id) {
			return new HBounce(pos);
		} else if (arr[0] === VBounce.Id) {
			return new VBounce(pos);
		} else if (arr[0] === Invisible.Id) {
			return new Invisible(pos);
		} else if (arr[0] === Phantom.Id) {
			return new Phantom(pos);
		} else {
			return null;
		}
	}

}