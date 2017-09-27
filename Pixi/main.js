/*global PIXI*/
/*global Argand*/
/*global math*/
/*global colorsys*/

"use strict";

var keys = {};

var stage;
var renderer;

var frameCount = 0;

function initPixi() {
	var type = "WebGL";
	if (!PIXI.utils.isWebGLSupported()) {
		type = "canvas";
	}
	PIXI.utils.sayHello(type);
	renderer = PIXI.autoDetectRenderer(1280, 720);
	var main = document.getElementById("divCanvas");
	renderer.view.style.width = "auto";
	renderer.view.style.height = "auto";
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

	// deserialize data in url
	var url = window.location.href;
}
initPixi();

var graphics = new PIXI.Graphics();
stage.addChild(graphics);

// events
document.getElementById("canvas").addEventListener("keydown", function (e) {
	keys[e.code] = true;
});
document.getElementById("canvas").addEventListener("keyup", function (e) {
	keys[e.code] = false;
});

document.getElementById("canvas").addEventListener("wheel", function (e) {
	e.preventDefault();
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

var loopLimit = 60;
var bounds = 0.8;

var i = 0;
var j = 0;
var loopCtr = 0;
var z = math.complex(0, 0);
var speed = 50;
var delta = 0.1;
var fn = null;
var colorFactor = 0.8;

var done = false;

var argand = new Argand();

deserializeUrl();

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

	var url = getSerializedUrl();
	document.getElementById("exportedLink").text = url;
	document.getElementById("exportedLink").href = url;
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	updateGui();

	if (document.activeElement === document.getElementById("canvas")) {
		if (keys["KeyA"] || keys["ArrowLeft"]) {
			panLeft();
		} else if (keys["KeyD"] || keys["ArrowRight"]) {
			panRight();
		} else if (keys["KeyW"] || keys["ArrowUp"]) {
			panUp();
		} else if (keys["KeyS"] || keys["ArrowDown"]) {
			panDown();
		}
	}
	

	if (!done) {
		for (var k = 0; k < speed; k++) {
			z = mandelbrot(z);
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
			if (i >= bounds && j >= bounds) {
				done = true;
			}
		}
	}

	argand.render();

	renderer.render(stage);
	frameCount++;
}

function mandelbrot(z) {
	var c = math.complex(i, j);
	var scope = {
		z: z,
		c: c
	};
	var zn = math.complex(fn.eval(scope));
	//var clr = Number("0x" + colorsys.hsv_to_hex(100 * p.abs(), 100, 100).substring(1));
	//var clr = Number("0x"+colorsys.hsv_to_hex(100*p.abs(),0,100).substring(1));
	var clr = Number("0x" + colorsys.hsv_to_hex(colorFactor*360 * math.cos(c.abs() / bounds), 100, 100).substring(1));
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

var multiplier = 1.4;

function increase(x) {
	var n = x *multiplier;
	if (n - x < 1) {
		n = x + 1;
	}
	return n;
}
function decrease(x) {
	var n = x / multiplier;
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
	bounds *= multiplier;
}

function decreaseBounds() {
	bounds /= multiplier;
}

function increaseDelta() {
	delta *= multiplier;
}

function decreaseDelta() {
	delta /= multiplier;
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

function deserializeUrl() {
	var _fn = getParameterByName("fn");
	var _loopLimit = getParameterByName("loopLimit");
	var _bounds = getParameterByName("bounds");
	var _delta = getParameterByName("delta");
	var _zoom = getParameterByName("zoom");
	var _speed = getParameterByName("speed");
	var _re = getParameterByName("re");
	var _im = getParameterByName("im");

	if (_fn === null) return;
	if (_loopLimit === null) return;
	if (_bounds === null) return;
	if (_delta === null) return;
	if (_zoom === null) return;
	if (_speed === null) return;
	if (_re === null) return;
	if (_im === null) return;

	console.log("deserialization succeeded");

	fn = math.compile(_fn);
	document.getElementById("txtbx_formula").value = _fn;
	loopLimit = Number(_loopLimit);
	bounds = Number(_bounds);
	delta = Number(_delta);
	argand.zoom = Number(_zoom);
	speed = Number(_speed);
	argand.center.re = Number(_re);
	argand.center.im = Number(_im);

	updateGui();
}

function getParameterByName(name) {
	var url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	var results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getSerializedUrl() {
	var obj = { fn: document.getElementById("txtbx_formula").value, loopLimit: loopLimit, bounds: bounds, delta: delta, zoom: argand.zoom, speed: speed, re: argand.center.re, im: argand.center.im };
	//console.log(obj);
	var url = window.location.href;
	var index = url.indexOf("?");
	if (index != -1) {
		url = url.substring(0, index);
	}
	var serialized = url + "?" + serialize(obj);
	return serialized;
}

function serialize(obj) {
	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	return str.join("&");
}