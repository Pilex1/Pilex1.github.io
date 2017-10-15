var keys = {};
var mouseButtons = {};
var mouseX, mouseY;
var edit = false;
var stage;
var renderer;
var graphics;
function initCanvas() {
    renderer = PIXI.autoDetectRenderer(1200, 675);
    var main = $("#canvas1")[0];
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
    });
    main.addEventListener("click", function (e) {
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
    });
}
function updateGui() {
}
function loop() {
    requestAnimationFrame(loop);
    graphics.clear();
    graphics.beginFill(0xffffff);
    graphics.drawRect(100, 100, 50, 50);
    updateGui();
    renderer.render(stage);
}
