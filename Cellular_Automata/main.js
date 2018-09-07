var keys = {};
var mouseButtons = {};
var mouseX, mouseY;
var edit = false;
var stage;
var renderer;
var graphics;
function init() {
    var width = $(window).width() - 200;
    var height = width * 9 / 16;
    renderer = PIXI.autoDetectRenderer(width, height);
    var main = document.getElementById("divCanvas");
    renderer.view.style.paddingLeft = "0px";
    renderer.view.style.paddingRight = "0px";
    renderer.view.style.marginLeft = "auto";
    renderer.view.style.marginRight = "auto";
    renderer.view.style.display = "block";
    renderer.view.tabIndex = 1;
    main.insertBefore(renderer.view, main.firstChild);
    stage = new PIXI.Container();
    graphics = new PIXI.Graphics();
    stage.addChild(graphics);
    main.addEventListener("keydown", function (e) {
        keys[e.code] = true;
    });
    main.addEventListener("keyup", function (e) {
        keys[e.code] = false;
    });
    main.addEventListener("keypress", function (e) {
        //	manager.getPlayer().onKeyType(e);
    });
    main.addEventListener("click", function (e) {
        //	manager.getPlayer().onMouseClick(e);
    });
    main.addEventListener("mousedown", function (e) {
        mouseButtons[e.button] = true;
    });
    main.addEventListener("mouseup", function (e) {
        mouseButtons[e.button] = false;
    });
    main.addEventListener("mousemove", function (e) {
        mouseX = e.pageX - renderer.view.offsetLeft;
        mouseY = e.pageY - renderer.view.offsetTop;
    });
    renderer.view.addEventListener("wheel", function (e) {
        e.preventDefault();
        //	manager.getPlayer().onMouseScroll(e);
    });
}
function loop() {
    requestAnimationFrame(loop);
    graphics.clear();
    graphics.beginFill(0xff0000);
    graphics.drawRect(100, 100, 200, 200);
    console.log(1);
    //manager.update();
    //manager.render();
    renderer.render(stage);
}
init();
loop();
System.register("graphics/IKeyTyped", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("graphics/GraphicsComponent", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var GraphicsComponent;
    return {
        setters: [],
        execute: function () {
            GraphicsComponent = class GraphicsComponent {
                constructor() {
                    this.defaultActive = true;
                }
            };
            exports_2("GraphicsComponent", GraphicsComponent);
        }
    };
});
class Gui {
}
//# sourceMappingURL=main.js.map