/*global PIXI*/
"use strict";

var stage;
var renderer;

function initPixi() {
	var type = "WebGL";
	if(!PIXI.utils.isWebGLSupported()){
	  type = "canvas";
	}
	PIXI.utils.sayHello(type);

	//Create the renderer
	renderer = PIXI.autoDetectRenderer(800, 450);

	//Add the canvas to the HTML document
	var main = document.children[0].children[1].children[2];

	renderer.view.style.paddingLeft = "0px";
	renderer.view.style.paddingRight = "0px";
	renderer.view.style.marginLeft = "auto";
	renderer.view.style.marginRight = "auto";
	renderer.view.style.display = "block";
	// inserts into the first position
	main.insertBefore(renderer.view, main.firstChild);


	//Create a container object called the `stage`
	stage = new PIXI.Container();
}
initPixi();




/* 
 * Actual program code
 */


var x = 0;
var rectangle = new PIXI.Graphics();
stage.addChild(rectangle);


function gameLoop() {
	requestAnimationFrame(gameLoop);
	
	rectangle.beginFill(0x66CCFF);
	rectangle.drawRect(x, 0, 100, 100);
	rectangle.endFill();
	rectangle.x += 1;
	
	renderer.render(stage);
	
}
gameLoop();