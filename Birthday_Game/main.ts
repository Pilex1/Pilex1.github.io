var keys = {};
var edit: boolean = false;

var stage: PIXI.Container;
var renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
var graphics: PIXI.Graphics;
var manager: Manager;

function initPixi(): void {
	renderer = PIXI.autoDetectRenderer(1200, 675);
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

	main.addEventListener("keydown", function (e: KeyboardEvent) {
		keys[e.code] = true;
	});
	main.addEventListener("keyup", function (e: KeyboardEvent) {
		keys[e.code] = false;
	});
	main.addEventListener("keypress", function (e: KeyboardEvent) {
		manager.getPlayer().onKeyType(e);
	});
}
initPixi();

function updateGui():void{
	var btn = <HTMLInputElement>document.getElementById("btn_toggleEdit");
	if (edit) {
		btn.value = "Disable Edit Mode";
	} else {
		btn.value = "Enable Edit Mode";
	}
}

function loop(): void {
	requestAnimationFrame(loop);

	graphics.clear();

	manager.update();
	manager.render();

	updateGui();

	renderer.render(stage);
}

loop();