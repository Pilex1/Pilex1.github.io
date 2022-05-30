import { ComplexDiagram } from "./complex-diagram.js";

export { ComplexPicker };

// lets the user pick points on the complex diagram
class ComplexPicker extends ComplexDiagram {
	constructor(canvasId, onChange) {
		super(canvasId, 2.5, 2.5);

		this.selectedPos = math.complex(0, 0);
		this.mouseComplex = math.complex(0, 0);
		this.mouseDown = false;
		this.selectedComplex = math.complex(0, 0);

		this.onChange = onChange;

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

	setValue(z) {
		this.selectedComplex = this.snap(z);
		this.render();
		this.onChange();
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

