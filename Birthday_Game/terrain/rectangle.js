class Rectangle {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }
    regularise() {
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
    incrX(x) {
        this.pos[0] += x;
    }
    incrY(y) {
        this.pos[1] += y;
    }
    decrX(x) {
        this.pos[0] -= x;
    }
    decrY(y) {
        this.pos[1] -= y;
    }
    set x1(x) {
        this.pos[0] = x;
    }
    set x2(x) {
        this.pos[0] = x - this.size[0];
    }
    set y1(y) {
        this.pos[1] = y;
    }
    set y2(y) {
        this.pos[1] = y - this.size[1];
    }
    set width(w) {
        this.size[0] = w;
    }
    set height(h) {
        this.size[1] = h;
    }
    get x1() {
        return this.pos[0];
    }
    get x2() {
        return this.pos[0] + this.size[0];
    }
    get y1() {
        return this.pos[1];
    }
    get y2() {
        return this.pos[1] + this.size[1];
    }
    get width() {
        return this.size[0];
    }
    get height() {
        return this.size[1];
    }
    get centerX() {
        return (this.x1 + this.x2) / 2;
    }
    get centerY() {
        return (this.y1 + this.y2) / 2;
    }
    get center() {
        return [this.centerX, this.centerY];
    }
    isIntersecting(that) {
        if (this.x1 < that.x2 && this.x2 > that.x1 && this.y2 > that.y1 && this.y1 < that.y2) {
            return true;
        }
        return false;
    }
    getPos() {
        return [this.pos[0], this.pos[1]];
    }
    getSize() {
        return [this.size[0], this.size[1]];
    }
    setPos(pos) {
        this.pos = [pos[0], pos[1]];
    }
    setSize(size) {
        this.size = [size[0], size[1]];
    }
    copy() {
        return new Rectangle([this.pos[0], this.pos[1]], [this.size[0], this.size[1]]);
    }
}
