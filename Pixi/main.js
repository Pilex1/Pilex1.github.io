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
	if (!PIXI.utils.isWebGLSupported()) {
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
document.addEventListener("keydown", function (e) {
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

document.getElementById("canvas").addEventListener("wheel", function (e) {
	if (e.deltaY < 0) {
		zoomIn();
	} else if (e.deltaY > 0) {
		zoomOut();
	}
});

document.getElementById("canvas").addEventListener("mousemove", function (e) {
	return;
	if (e.buttons % 2 === 1) {
		var p = argand.calculateMouseCoordinate(e);
		var z = math.complex(0, 0);
		for (var i = 0; i < 100; i++) {
			var scope = {
				z: z,
				c: p
			};
			z = math.complex(fn.eval(scope));
			var clr = Number("0x" + colorsys.hsv_to_hex(50 * p.abs(), 100, 100).substring(1));
			argand.addCoordinate({ point: z, color: clr });
		}
	}

});

// actual program code

var loopLimit = 1;
var bounds = 1;

var i = 0;
var j = 0;
var loopCtr = 0;
var z = math.complex(0, 0);
var speed = 100;
var delta = 0.05;
var fn = null;

var done = false;

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

	document.getElementById("txtbx_formula").addEventListener("keypress", function (e) {
		if (e.keyCode == 13) {
			document.getElementById("btn_render").onclick();
		}
	});
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	updateGui();

	if (!done) {
		for (var k = 0; k < speed; k++) {
			z = mandelbrot(z, math.complex(i, j), fn);
			loopCtr++;
			if (done) break;

			if (loopCtr >= math.floor(loopLimit)) {
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
			if (i >= loopLimit && j >= loopLimit) {
				done = true;
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
	var p = math.complex(i, j);
	var clr = Number("0x" + colorsys.hsv_to_hex(100 * p.abs(), 100, 100).substring(1));
	//var clr = Number("0x"+colorsys.hsv_to_hex(100*p.abs(),0,100).substring(1));
	//var alpha = (1+loopCtr)/(1+loopLimit);
	var alpha = 0.8;
	// if (loopCtr >= loopLimit - 2) {
	// 	alpha = 1;
	// } else {
	// 	alpha = 0;
	// }
	argand.addCoordinate({ point: zn, color: clr, alpha: alpha });
	return zn;
}

function collatz(z) {
	if (z.re % 2 === 0 && z.im % 2 === 0) {
		z = z.div(2);
	} else {
		z = z.mul(3);
		z = z.add(1);
	}
	return z;
}

function increase(x) {
	var n = x * 1.6;
	if (n - x < 1) {
		n = x + 1;
	}
	return n;
}
function decrease(x) {
	var n = x / 1.6;
	if (x - n < 1) {
		n = x - 1;
	}
	if (n < 1) {
		n = 1;
	}
	return n;
}

function clearScreen() {
	argand.clear();
	done = true;
}

function reset() {
	/*i = 0;
	j = 0;*/
	i = -bounds;
	j = -bounds;
	loopCtr = 0;
	done = false;
}

function increaseSpeed() {
	speed = increase(speed);
}

function decreaseSpeed() {
	speed = decrease(speed);
}

function increaseLoopLimit() {
	loopLimit = increase(loopLimit);
}

function decreaseLoopLimit() {
	loopLimit = decrease(loopLimit);
}

function increaseBounds() {
	bounds = increase(bounds);
}

function decreaseBounds() {
	bounds = decrease(bounds);
}

function increaseDelta() {
	delta *= 1.6;
}

function decreaseDelta() {
	delta /= 1.6;
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