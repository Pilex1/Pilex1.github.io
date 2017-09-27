declare var math: any;

class Rectangle {

	private pos: number[];
	private size: number[];

	constructor(pos: number[], size: number[]) {
		this.pos = pos;
		this.size = size;
	}

	regularise(): Rectangle {
		var pos = math.clone(this.pos);
		var size = math.clone(this.size);
		if (size[0] < 0) {
			pos[0] += size[0];
			size[0] *= -1;
		}
		if (size[1] < 0) {
			pos[1] += size[1];
			size[1] *= -1;
		}
		return new Rectangle(pos, size);
	}

	incrX(x: number) {
		this.pos[0] += x;
	}
	incrY(y: number) {
		this.pos[1] += y;
	}
	decrX(x: number) {
		this.pos[0] -= x;
	}
	decrY(y: number) {
		this.pos[1] -= y;
	}

	set x1(x: number) {
		this.pos[0] = x;
	}
	set x2(x: number) {
		this.pos[0] = x - this.size[0];
	}
	set y1(y: number) {
		this.pos[1] = y;
	}
	set y2(y: number) {
		this.pos[1] = y - this.size[1];
	}
	set width(w: number) {
		this.size[0] = w;
	}
	set height(h: number) {
		this.size[1] = h;
	}

	get x1(): number {
		return this.pos[0];
	}
	get x2(): number {
		return this.pos[0] + this.size[0];
	}
	get y1(): number {
		return this.pos[1];
	}
	get y2(): number {
		return this.pos[1] + this.size[1];
	}
	get width(): number {
		return this.size[0];
	}
	get height(): number {
		return this.size[1];
	}
	get centerX(): number {
		return (this.x1 + this.x2) / 2;
	}
	get centerY(): number {
		return (this.y1 + this.y2) / 2;
	}
	get center(): number[] {
		return [this.centerX, this.centerY];
	}

	isIntersecting(that): boolean {
		if (this.x1 < that.x2 && this.x2 > that.x1 && this.y2 > that.y1 && this.y1 < that.y2) {
			return true;
		}
		return false;
	}

	getPos(): number[] {
		return [this.pos[0], this.pos[1]];
	}
	getSize(): number[] {
		return [this.size[0], this.size[1]];
	}
	setPos(pos: number[]): void {
		this.pos = [pos[0], pos[1]];
	}
	setSize(size: number[]): void {
		this.size = [size[0], size[1]];
	}

	copy(): Rectangle {
		return new Rectangle([this.pos[0], this.pos[1]], [this.size[0], this.size[1]]);
	}

}