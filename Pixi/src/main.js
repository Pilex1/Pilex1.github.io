var keys = {};

var stage;
var renderer;

var frameCount = 0;

function initPixi() {
	renderer = PIXI.autoDetectRenderer({ width: 1280, height: 720 });
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
}
initPixi();

var graphics = new PIXI.Graphics();
stage.addChild(graphics);

// events
document.querySelectorAll(".sectionDiv>[type=text]").forEach(element => {
	element.addEventListener("keypress", event => {
		if (event.keyCode === 13) {
			updateGui();
			if (element.id!=="txtbx_speed"){
				render();
			}
		}
	});
})

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
	/* if (e.buttons % 2 === 1) {
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
	} */
});

// actual program code

var loopLimit;
var bound;

var i;
var j;
var loopCtr = 0;
var z = math.complex(0, 0);
var speed;
var delta;
var fn = null;
var color;
var alpha;

var colorCache;

var done = false;
var storePointsInMemory = false;

var argand = new Argand();

deserializeUrl();
updateGui();
render();
gameLoop();

function updateGui() {

	fn = math.compile(document.getElementById("txtbx_formula").value);
	loopLimit = Number(document.getElementById("txtbx_loopLimit").value);
	bound = Number(document.getElementById("txtbx_bound").value);
	delta = Number(document.getElementById("txtbx_delta").value);
	speed = Number(document.getElementById("txtbx_speed").value);
	argand.zoom = Number(document.getElementById("txtbx_zoom").value);
	color = Number(document.getElementById("txtbx_color").value);
	alpha = Number(document.getElementById("txtbx_alpha").value);

	var url = getSerializedUrl();
	document.getElementById("exportedLink").text = url;
	document.getElementById("exportedLink").href = url;
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

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

			if (loopCtr >= math.floor(loopLimit)) {
				loopCtr = 0;
				z.re = 0;
				z.im = 0;
				if (i < bound) {
					i += delta;
				} else if (j < bound) {
					j += delta;
					i = -bound;
				}
				colorCache = Number("0x" + colorsys.hsv_to_hex(color * 360 * math.cos(math.complex(i, j).abs() / bound), 100, 100).substring(1));
			}
			if (i >= bound && j >= bound) {
				done = true;
				break;
			}
		}
	}

	argand.render();

	renderer.render(stage);
	frameCount++;
}

function mandelbrot(z) {
	var scope = {
		z: z,
		c: math.complex(i, j)
	};
	var zn = math.complex(fn.eval(scope));

	argand.addCoordinate({ point: zn, color: colorCache, alpha: alpha });
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

var multiplier = 1.2;

function increase(x) {
	var n = x * multiplier;
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

function increaseSpeed() {
	speed = increase(speed);
	document.getElementById("txtbx_speed").value = speed;
	updateGui();
}

function decreaseSpeed() {
	speed = decrease(speed);
	document.getElementById("txtbx_speed").value = speed;
	updateGui();
}

function increaseLoopLimit() {
	loopLimit = increase(loopLimit);
	document.getElementById("txtbx_loopLimit").value = loopLimit;
	updateGui();
	render();
}

function decreaseLoopLimit() {
	loopLimit = decrease(loopLimit);
	document.getElementById("txtbx_loopLimit").value = loopLimit;
	updateGui();
	render();
}

function increaseBound() {
	bound *= multiplier;
	document.getElementById("txtbx_bound").value = bound;
	updateGui();
	render();
}

function decreaseBound() {
	bound /= multiplier;
	document.getElementById("txtbx_bound").value = bound;
	updateGui();
	render();
}

function increaseDelta() {
	delta *= multiplier;
	document.getElementById("txtbx_delta").value = delta;
	updateGui();
	render();
}

function decreaseDelta() {
	delta /= multiplier;
	document.getElementById("txtbx_delta").value = delta;
	updateGui();
	render();
}

function increaseColor() {
	color *= multiplier;
	document.getElementById("txtbx_color").value = color;
	updateGui();
	render();
}

function decreaseColor() {
	color /= multiplier;
	document.getElementById("txtbx_color").value = color;
	updateGui();
	render();
}

function increaseAlpha() {
	alpha *= multiplier;
	alpha = math.min(alpha, 1);
	document.getElementById("txtbx_alpha").value = alpha;
	updateGui();
	render();
}

function decreaseAlpha() {
	alpha /= multiplier;
	document.getElementById("txtbx_alpha").value = alpha;
	updateGui();
	render();
}

function zoomIn() {
	argand.zoomIn();
	document.getElementById("txtbx_zoom").value = argand.zoom;
	updateGui();
	render();
}

function zoomOut() {
	argand.zoomOut();
	document.getElementById("txtbx_zoom").value = argand.zoom;
	updateGui();
	render();
}

function panLeft() {
	argand.panLeft();
	render();
}

function panRight() {
	argand.panRight();
	render();
	updateGui();
}

function panUp() {
	argand.panUp();
	render();
}

function panDown() {
	argand.panDown();
	render();
}

function reset() {
	i = -bound;
	j = -bound;
	loopCtr = 0;
	done = false;
}

function render() {
	argand.clear();
	reset();
}

function deserializeUrl() {
	var _fn = getParameterByName("fn");
	var _loopLimit = getParameterByName("loopLimit");
	var _bound = getParameterByName("bound");
	var _delta = getParameterByName("delta");
	var _zoom = getParameterByName("zoom");
	var _speed = getParameterByName("speed");
	var _re = getParameterByName("re");
	var _im = getParameterByName("im");
	var _color = getParameterByName("color");
	var _alpha = getParameterByName("alpha");

	if (_fn !== null) document.getElementById("txtbx_formula").value = _fn;
	if (_loopLimit !== null) document.getElementById("txtbx_loopLimit").value = _loopLimit;
	if (_bound !== null) document.getElementById("txtbx_bound").value = _bound;
	if (_delta !== null) document.getElementById("txtbx_delta").value = _delta;
	if (_zoom !== null) document.getElementById("txtbx_zoom").value = _zoom;
	if (_speed !== null) document.getElementById("txtbx_speed").value = _speed;
	if (_re !== null) argand.center.re = _re;
	if (_im !== null) argand.center.im = _im;
	if (_color !== null) document.getElementById("txtbx_color").value = _color;
	if (_alpha !== null) document.getElementById("txtbx_alpha").value = _alpha;
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
	var obj = { fn: document.getElementById("txtbx_formula").value, loopLimit: loopLimit, bound: bound, delta: delta, zoom: argand.zoom, speed: speed, re: argand.center.re, im: argand.center.im };
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