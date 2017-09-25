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
	renderer = PIXI.autoDetectRenderer(800, 450);
	var main = document.getElementById("divCanvas");
	renderer.view.style.width = "800px";
	renderer.view.style.height = "450px";
	renderer.view.style.paddingLeft = "0px";
	renderer.view.style.paddingRight = "0px";
	renderer.view.style.marginLeft = "auto";
	renderer.view.style.marginRight = "auto";
	renderer.view.style.display = "inline-block";
	renderer.view.tabIndex = "1";
	renderer.view.id = "canvas";
	// inserts into the first position
	main.insertBefore(renderer.view, main.firstChild);
	stage = new PIXI.Container();
}
initPixi();

var graphics = new PIXI.Graphics();
stage.addChild(graphics);

// events
document.addEventListener("keydown", function(e) {
	if (document.activeElement !== document.getElementById("canvas")) {
		return;
	}
	if (e.key === 'a' || e.key === '37') {
		panLeft();
	} else if (e.key === 'd' || e.key === '39') {
		panRight();
	} else if (e.key === 'w' || e.key === '38') {
		panUp();
	} else if (e.key === 's' || e.key === '40') {
		panDown();
	}
});

document.getElementById("canvas").addEventListener("wheel", function(e) {
	if (e.deltaY < 0) {
		zoomIn();
	} else if (e.deltaY > 0) {
		zoomOut();
	}
});

document.getElementById("canvas").addEventListener("mousemove", function(e) {
	return;
	if (e.buttons%2 === 1) {
		var p = argand.calculateMouseCoordinate(e);
		var z = math.complex(0, 0);
		for (var i = 0; i < 100; i++) {
			var scope = {
				z: z,
				c: p
			};
			z = math.complex(fn.eval(scope));
			var clr = Number("0x"+colorsys.rgb_to_hex(255*z.abs(), 255*(p.re+1)/2, 255*(p.im+1)/2).substring(1));
			argand.addCoordinate({point: z, color: clr});
		}	
	}

});

// actual program code

var loopLimit = 200;
var bounds = 1;

var i = 0;
var j = 0;
var loopCtr = 0;
var z = math.complex(0, 0);
var speed = 100;
var delta = 0.05;
var fn = null;

var argand = new Argand();

function updateGui() {
	
	document.getElementById("btn_incrloop").value = "Increase loop limit [" + Math.round(loopLimit) + "]";
	document.getElementById("btn_decrloop").value = "Decrease loop limit [" + Math.round(loopLimit) + "]";
	document.getElementById("btn_incrbounds").value = "Increase bounds [" + bounds.toFixed(4) + "]";
	document.getElementById("btn_decrbounds").value = "Decrease bounds [" + bounds.toFixed(4) + "]";
	document.getElementById("btn_incrdelta").value = "Increase delta [" + delta.toFixed(4) + "]";
	document.getElementById("btn_decrdelta").value = "Decrease delta [" + delta.toFixed(4) + "]";
	
	document.getElementById("btn_zoomin").value = "Zoom in [" + Math.round(argand.zoom) + "]";
	document.getElementById("btn_zoomout").value = "Zoom out [" + Math.round(argand.zoom) + "]";
	document.getElementById("btn_incrspeed").value = "Increase speed [" + Math.round(speed) + "]";
	document.getElementById("btn_decrspeed").value = "Decrease speed [" + Math.round(speed) + "]";
}

function gameLoop() {
	requestAnimationFrame(gameLoop);
	
	updateGui();
	
	for (var k = 0; k < speed; k++) {
		z = mandelbrot(z, math.complex(i, j), fn);
		loopCtr++;

		if (loopCtr === loopLimit) {
			loopCtr = 0;
			z = math.complex(0, 0);

			/*if (i < bounds) {
				i *= -1;
				if (i === 0) {
					i += delta;
				} else {
					i += math.sign(i)*delta;
				}
			} else if (j < bounds) {
				j *= -1;
				if (j === 0) {
					j += delta;
				} else {
					j += math.sign(j)*delta;
				}
				i = 0;
			}*/
			
			if (i < bounds) {
				i += delta;
			} else if (j < bounds) {
				j += delta;
				i = -bounds;
			}

		}
	}
	
	argand.render();
	
	renderer.render(stage);
	frameCount++;
}

function mandelbrot(z, c, fn) {
	var scope = {
		z: z,
		c: c
	};
	var zn = math.complex(fn.eval(scope));
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
	speed *= 1.2;
}

function decreaseSpeed() {
	speed /= 1.2;
}

function reset() {
	/*i = 0;
	j = 0;*/
	i = -bounds;
	j = -bounds;
	loopCtr = 0;
}

function increaseLoopLimit() {
	loopLimit += 100;
}

function decreaseLoopLimit() {
	loopLimit = math.max(loopLimit-100, 100);
}

function increaseBounds() {
	bounds *= 1.2;
}

function decreaseBounds() {
	bounds /= 1.2;
}

function increaseDelta() {
	delta *= 1.2;
}	

function decreaseDelta() {
	delta /= 1.2;
}

function zoomIn() {
	argand.zoomIn();
}

function zoomOut() {
	argand.zoomOut();
}

function panLeft() {
	argand.panLeft();
}

function panRight() {
	argand.panRight();
}

function panUp() {
	argand.panUp();
}

function panDown() {
	argand.panDown();
}

function relaunch() {
	var text = document.getElementById("txtbx_formula").value;
	fn = math.compile(text);
	argand.clear();
	reset();
}

relaunch();
gameLoop();