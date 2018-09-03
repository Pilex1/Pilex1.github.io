var stage;
var renderer;
var graphics;
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.main = function () {
        renderer = PIXI.autoDetectRenderer(1200, 675);
        var main = document.getElementById("divCanvas");
        renderer.view.style.paddingLeft = "0px";
        renderer.view.style.paddingRight = "0px";
        renderer.view.style.marginLeft = "auto";
        renderer.view.style.marginRight = "auto";
        renderer.view.style.display = "block";
        main.insertBefore(renderer.view, main.firstChild);
        stage = new PIXI.Container();
        graphics = new PIXI.Graphics();
        stage.addChild(graphics);
        Main.tester = new Tester();
        Main.loop();
    };
    Main.loop = function () {
        requestAnimationFrame(Main.loop);
        graphics.clear();
        Main.tester.render();
        renderer.render(stage);
    };
    return Main;
}());
Main.main();
//# sourceMappingURL=HelloWorld.js.map