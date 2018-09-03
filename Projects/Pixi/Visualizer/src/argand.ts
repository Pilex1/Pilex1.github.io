class Argand {

    public center: mathjs.Complex = math.complex(1, 1);

    // distance from center to right edge
    public zoom: number = 3;

    private points: mathjs.Complex[] = [];

    private gridSize: number = 150;

    constructor() {

    }

    addPoint(z: mathjs.Complex) {
        this.points.push(z);
    }

    zoomIn(): void {
        this.zoom /= 1.5;
    }

    zoomOut(): void {
        this.zoom *= 1.5;
    }

    update() {
        var amt = 0.04;
        if (keys["ArrowLeft"] || keys["KeyA"]) {
            this.center.re -= amt * this.zoom;
        }
        if (keys["ArrowRight"] || keys["KeyD"]) {
            this.center.re += amt * this.zoom;
        }
        if (keys["ArrowUp"] || keys["KeyW"]) {
            this.center.im -= amt * this.zoom;
        }
        if (keys["ArrowDown"] || keys["KeyS"]) {
            this.center.im += amt * this.zoom;
        }
    }

    render() {
        // render axes
        graphics.lineStyle(1, 0x888888, 0.5);

        var gx = this.gridSize / (width / 2);
        var sx = gx * this.zoom;
        //console.log(sx);

        graphics.moveTo(-this.center.re * width / 2 / this.zoom + width / 2, 0);
        graphics.lineTo(-this.center.re * width / 2 / this.zoom + width / 2, height);

        graphics.moveTo(0, -this.center.im * width / 2 / this.zoom + height / 2);
        graphics.lineTo(width, -this.center.im * width / 2 / this.zoom + height / 2);

        for (var i = 0; i < this.points.length; i++) {
            var p = this.points[i];
            var x = (p.re - this.center.re) * width / 2 / this.zoom + width / 2;
            var y = (-p.im - this.center.im) * width / 2 / this.zoom + height / 2;
            graphics.beginFill(0xffffff);
            graphics.drawRect(x, y, 5, 5);
        }
    }

}