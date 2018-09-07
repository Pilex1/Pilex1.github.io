var keys = {};
var mouseButtons = {};
var mouseX: number, mouseY: number;
var edit: boolean = false;

var stage: PIXI.Container;
var renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
var graphics: PIXI.Graphics;

function init(): void {
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

  main.addEventListener("keydown", function(e: KeyboardEvent): void {
    keys[e.code] = true;
  });
  main.addEventListener("keyup", function(e: KeyboardEvent): void {
    keys[e.code] = false;
  });
  main.addEventListener("keypress", function(e: KeyboardEvent): void {
    //	manager.getPlayer().onKeyType(e);
  });
  main.addEventListener("click", function(e: MouseEvent): void {
    //	manager.getPlayer().onMouseClick(e);
  });
  main.addEventListener("mousedown", function(e: MouseEvent): void {
    mouseButtons[e.button] = true;
  });
  main.addEventListener("mouseup", function(e: MouseEvent): void {
    mouseButtons[e.button] = false;
  });
  main.addEventListener("mousemove", function(e: MouseEvent): void {
    mouseX = e.pageX - renderer.view.offsetLeft;
    mouseY = e.pageY - renderer.view.offsetTop;
  });
  renderer.view.addEventListener("wheel", function(e: WheelEvent) {
    e.preventDefault();
    //	manager.getPlayer().onMouseScroll(e);
  });
}

function loop(): void {
  requestAnimationFrame(loop);

  graphics.clear();

  graphics.beginFill(0xff0000);
  graphics.drawRect(100,100,200,200);

  console.log(1);

  //manager.update();
  //manager.render();
  renderer.render(stage);
}

init();
loop();
