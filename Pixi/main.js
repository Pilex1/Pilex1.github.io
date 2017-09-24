/*global PIXI*/
/*global Argand*/
/*global math*/
/*global colorsys*/

"use strict";

var stage;
var renderer;

var frameCount = 0;

function initPixi() {
	var type = "WebGL";
	if(!PIXI.utils.isWebGLSupported()){
	  type = "canvas";
	}
	PIXI.utils.sayHello(type);

	//Create the renderer
	renderer = PIXI.autoDetectRenderer(800, 450);

	//Add the canvas to the HTML document
	var main = document.getElementById("canvas");
	console.log(main);

	renderer.view.style.paddingLeft = "0px";
	renderer.view.style.paddingRight = "0px";
	renderer.view.style.marginLeft = "auto";
	renderer.view.style.marginRight = "auto";
	renderer.view.style.display = "inline";
	// inserts into the first position
	main.insertBefore(renderer.view, main.firstChild);


	//Create a container object called the `stage`
	stage = new PIXI.Container();
}
initPixi();

var graphics = new PIXI.Graphics();
stage.addChild(graphics);

// mouse events

function onMouseClick(e) {
	var m = argand.calculateMouseCoordinate(e);
}

// actual program code

var i = -1;
var j = -1;
var loopCtr = 0;
var z = math.complex(0, 0);
var speed = 30;

var loopLimit = 200;

var argand = new Argand();

function gameLoop() {
	requestAnimationFrame(gameLoop);
	
	for (var k = 0; k < speed; k++) {
		z = mandelbrot(z, math.complex(i, j));
		loopCtr++;

		if (loopCtr === loopLimit) {
			loopCtr = 0;
			z = math.complex(0, 0);

			if (i < 1) {
				i += 0.05;
			} else if (j < 1) {
				j += 0.05;
				i = -1;
			}

		}
	}
	
	
	argand.render();
	
	renderer.render(stage);
	frameCount++;
}

function mandelbrot(z, c) {
	var zn = z.mul(z).add(c);
	var clr = Number("0x"+colorsys.rgb_to_hex(255*zn.abs(), 255*(i+1)/2, 255*(j+1)/2).substring(1));
	argand.addCoordinate({point: zn, color: clr});
	return zn;
}

function collatz(z) {
	if (z.re%2===0 && z.im%2===0) {
		z = z.div(2);
	} else {
		z = z.mul(3);
		z = z.add(1);
	}
	return z;
}

function increaseSpeed() {
	speed += 10;
}

function decreaseSpeed() {
	speed -= 10;
	speed = math.max(speed, 10);
}

gameLoop();