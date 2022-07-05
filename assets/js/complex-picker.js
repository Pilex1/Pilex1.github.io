import { ComplexDiagram } from "./complex-diagram.js";

export { ComplexPicker };

let shiftKeyPressed = false;
document.addEventListener("keydown", e => {
	shiftKeyPressed = e.shiftKey;
}, false);
document.addEventListener("keyup", e => {
	shiftKeyPressed = e.shiftKey;
}, false);

// lets the user pick points on the complex diagram
class ComplexPicker extends ComplexDiagram {
	constructor(canvasId, snap="always", range=2.5) {
		super(canvasId, range, range);

		this.doSnap = snap;
		this.selectedPos = math.complex(0, 0);
		this.mouseComplex = math.complex(0, 0);
		this.mouseDown = false;
		this.selectedComplex = math.complex(0, 0);


		this.onChangeFunc = [];

		this.canvas.addEventListener("mousemove", e => {
			let mouseX = e.offsetX;
			let mouseY = e.offsetY;
			this.mouseComplex = this.windowToComplexCoords(mouseX, mouseY);
			if (this.mouseDown) {
				this.setValue(this.mouseComplex);
			}
		});
		this.canvas.addEventListener("mousedown", e => {
			this.mouseDown = true;
		});
		this.canvas.addEventListener("mouseup", e => {
			this.mouseDown = false;
		});
		this.canvas.addEventListener("click", e => {
			let mouseX = e.offsetX;
			let mouseY = e.offsetY;
			this.mouseComplex = this.windowToComplexCoords(mouseX, mouseY);
			this.setValue(this.mouseComplex);
		});
		

		this.render();
	}

	onChange(onChangeFunc) {
		this.onChangeFunc.push(onChangeFunc);
	}

	setValue(z) {
		z = math.complex(z);
		this.selectedComplex = ((this.doSnap==="always") || (this.doSnap == "onshift" && shiftKeyPressed)) ? this.snap(z) : z;
		this.render();
		for (let func of this.onChangeFunc) {
			func(this.selectedComplex);
		}

	}

	snap(z) {
		let x = z.re;
		let y = z.im;
		let options = [];

		let markerSpacing = this.getMarkerSpacing();
		let i = Math.floor(x / markerSpacing.x);
		let j = Math.floor(y / markerSpacing.y);
		
		options.push(math.complex(i * markerSpacing.x, j * markerSpacing.y));
		options.push(math.complex((i+1) * markerSpacing.x, j * markerSpacing.y));
		options.push(math.complex(i * markerSpacing.x, (j+1) * markerSpacing.y));
		options.push(math.complex((i+1) * markerSpacing.x, (j+1) * markerSpacing.y));

		let minDist = Infinity;
		let minOption = null;
		for (let i = 0; i < options.length; i++) {
			let xNorm = (z.re - options[i].re) / this.radiusRe;
			let yNorm = (z.im - options[i].im) / this.radiusIm;
			let dist = Math.pow(xNorm, 2) + Math.pow(yNorm, 2);
			if (dist < minDist) {
				minDist = dist;
				minOption = options[i];
			}
		}
		if (minDist < 0.005) return minOption;
		return z;
	}

	render() {
		super.render();

		// draw the selection as a dot
		let selectedMouse = this.complexToWindowCoords(this.selectedComplex);

		this.ctx.beginPath();
		this.ctx.arc(selectedMouse.x, selectedMouse.y, 8, 0, 2 * Math.PI);
		this.ctx.strokeStyle = 'cyan';
		this.ctx.stroke();
	}

	// returns the selected complex number
	getSelected() {
		return this.selectedComplex;
	}

}

