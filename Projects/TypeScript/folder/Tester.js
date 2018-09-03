var Tester = /** @class */ (function () {
    function Tester() {
        this.x = 0;
    }
    Tester.prototype.render = function () {
        graphics.beginFill(0xffffff);
        graphics.drawRect(this.x, 0, 100, 100);
        this.x += 1;
    };
    return Tester;
}());
//# sourceMappingURL=Tester.js.map