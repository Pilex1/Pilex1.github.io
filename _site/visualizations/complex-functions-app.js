import { ComplexDiagram } from "/assets/js/complex-diagram.js";
import { ComplexPicker } from "/assets/js/complex-picker.js";
import { sliderOnUpdate, sliderGetMax, sliderGetValue } from "/assets/js/components-helper.js";

let canvas = document.getElementById("main-canvas");
// make the canvas square
canvas.width = canvas.clientWidth;
canvas.height = canvas.width;

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}
class CircleDiagram extends ComplexDiagram {

	constructor() {
		super("main-canvas", 4.5, 4.5);
		this.maxRadiusRe = 500;
		this.maxRadiusIm = 500;
	}

	render() {
		super.render();

		const delta = 0.005;
		let points = [];
		let pointsOriginal = [];
		for (let theta = 0; theta < 2 * Math.PI; theta += delta) {
			let n = sliderGetValue("ngon").val;
			let x = Math.cos(theta);
			let y = Math.sin(theta);
			let r = null;
			if (n == Infinity) r = 1;
			else r = Math.cos(Math.PI / n) / Math.cos((theta % (2 * Math.PI / n)) - Math.PI / n);

			let z = math.complex(r * sliderGetValue("radius").val * x, r * sliderGetValue("radius").val * y);
			let f_z = f(z);

			// transform into window coordinates
			let canvCoords = this.complexToWindowCoords(f_z);
			// update the pixel in the canvas
			let rgb = hslToRgb(theta / (2 * Math.PI), 1, 0.5);		

			points.push({
				"x": canvCoords.x,
				"y": canvCoords.y,
				"rgb": rgb
			});

			let canvOriginalCoords = this.complexToWindowCoords(z);
			let originalRgb = hslToRgb(theta / (2 * Math.PI), 0.5, 0.2);
			pointsOriginal.push({
				"x": canvOriginalCoords.x,
				"y": canvOriginalCoords.y,
				"rgb": originalRgb
			});
		}

		for (let i = 0; i < points.length - 1; i++) {
			let p = points[i];
			let q = points[i+1];
			this.ctx.beginPath();
			this.ctx.strokeStyle = `rgb(${p.rgb[0]}, ${p.rgb[1]}, ${p.rgb[2]})`;
			this.ctx.moveTo(p.x, p.y);
			this.ctx.lineTo(q.x, q.y);
			this.ctx.stroke();

			p = pointsOriginal[i];
			q = pointsOriginal[i+1];
			this.ctx.beginPath();
			this.ctx.strokeStyle = `rgb(${p.rgb[0]}, ${p.rgb[1]}, ${p.rgb[2]})`;
			this.ctx.moveTo(p.x, p.y);
			this.ctx.lineTo(q.x, q.y);
			this.ctx.stroke();
		}
	}
}

function f(z) {
	let running_sum = math.complex(0, 0);
	for (let d = 0; d <= sliderGetValue("poly-degree").val; d++) {
		let coeff = complexPickers.get(d).getSelected();
		let term = math.multiply(coeff, math.pow(z, d));
		running_sum = math.add(running_sum, term)
	}
	return running_sum;
}

function formatComplex(z, precision) {
	z = math.complex(z);
	let s = Math.sign(z.re) == -1 ? "-" : "";
	s += Math.abs(z.re).toFixed(precision);
	s += Math.sign(z.im) == -1? " - " : " + ";
	s += Math.abs(z.im).toFixed(precision);
	s += "i";
	return s;
}

function updateUi() {
    let newDegree = sliderGetValue("poly-degree").val;
	for (let d = 0; d <= maxDegree; d++) {
		if (d <= newDegree) {
			$(`#div-degree-${d}`).show();
		} else {
			$(`#div-degree-${d}`).hide();
		}
		// update labels
		let coeff = complexPickers.get(d).getSelected();
		$(`#label-select-${d}`).text(formatComplex(coeff, 2));
	}
	curDegree = newDegree;
}

sliderOnUpdate("poly-degree", () => {
    updateUi();
    diagram.render();
});

sliderOnUpdate("ngon", () => {
    updateUi();
    diagram.render();
});

sliderOnUpdate("radius", () => {
    updateUi();
    diagram.render();
});

let diagram = new CircleDiagram();

let complexPickers = new Map();

let maxDegree = sliderGetMax("poly-degree").val;
let curDegree = 0;
for (let d = 0; d <= maxDegree; d++) {
	let s = `<button class="btn btn-primary my-2 w-100" type="button" data-bs-toggle="collapse" data-bs-target="#div-select-${d}">Degree ${d} coefficient</button>
		<div class="collapse" id="div-select-${d}">
		$a_${d}=$
		<label id="label-select-${d}"></label>
		<canvas id="canvas-select-${d}"></canvas>
		</div>`;
	let wrapper = `<div id="div-degree-${d}">${s}</div>`;
	$("#div-dynamic-ui").append($.parseHTML(wrapper));
	$(`#div-degree-${d}`).hide();

	let picker = new ComplexPicker(`canvas-select-${d}`);
	picker.onChange(() => {
		updateUi();
		diagram.render();
	});
	complexPickers.set(d, picker);
}
complexPickers.get(0).setValue(math.complex(0, 0));
complexPickers.get(1).setValue(math.complex(0, 1));
complexPickers.get(2).setValue(math.complex(0, 0));
complexPickers.get(3).setValue(math.complex(1, 0));

updateUi();