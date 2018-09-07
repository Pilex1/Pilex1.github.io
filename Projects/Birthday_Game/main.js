var keys = {};
var mouseButtons = {};
var mouseX, mouseY;
var edit = false;
var stage;
var renderer;
var graphics;
var manager;
function init() {
    var width = $(window).width() - 700;
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
    manager = new Manager();
    main.addEventListener("keydown", function (e) {
        keys[e.code] = true;
    });
    main.addEventListener("keyup", function (e) {
        keys[e.code] = false;
    });
    main.addEventListener("keypress", function (e) {
        manager.getPlayer().onKeyType(e);
    });
    main.addEventListener("click", function (e) {
        manager.getPlayer().onMouseClick(e);
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
        manager.getPlayer().onMouseScroll(e);
    });
}
function updateGui() {
    var btn = document.getElementById("btn_toggleEdit");
    if (edit) {
        btn.value = "Disable Edit Mode";
    }
    else {
        btn.value = "Enable Edit Mode";
    }
}
function loop() {
    requestAnimationFrame(loop);
    graphics.clear();
    manager.update();
    manager.render();
    updateGui();
    renderer.render(stage);
}
init();
loop();
