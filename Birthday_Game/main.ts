var keys = {};
var mouseButtons = {};
var mouseX: number, mouseY: number;
var edit: boolean = false;

var stage: PIXI.Container;
var renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
var graphics: PIXI.Graphics;
var manager: Manager;

function init(): void {
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

	main.addEventListener("keydown", function (e: KeyboardEvent): void {
		keys[e.code] = true;
	});
	main.addEventListener("keyup", function (e: KeyboardEvent): void {
		keys[e.code] = false;
	});
	main.addEventListener("keypress", function (e: KeyboardEvent): void {
		manager.getPlayer().onKeyType(e);
	});
	main.addEventListener("click", function (e: MouseEvent): void {
		manager.getPlayer().onMouseClick(e);
	});
	main.addEventListener("mousedown", function (e: MouseEvent): void {
		mouseButtons[e.button] = true;
	});
	main.addEventListener("mouseup", function (e: MouseEvent): void {
		mouseButtons[e.button] = false;
	});
	main.addEventListener("mousemove", function (e: MouseEvent): void {
		mouseX = e.pageX - renderer.view.offsetLeft;
		mouseY = e.pageY - renderer.view.offsetTop;
	});
	renderer.view.addEventListener("wheel", function (e: WheelEvent) {
		e.preventDefault();
		manager.getPlayer().onMouseScroll(e);
	});
}

function updateGui(): void {
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

init();
loop();