export { ComplexDiagram };

class ComplexDiagram {
	constructor(canvasId, radiusRe, radiusIm) {
		this.radiusRe = radiusRe;
		this.radiusIm = radiusIm;
		this.canvas = document.getElementById(canvasId);
		// make the canvas square
		this.canvas.height = this.canvas.width;
		this.ctx = this.canvas.getContext("2d");

		this.maxMarkers = 8;
		this.zoomFactor = 1.1;

		this.maxRadiusRe = 5;
		this.minRadiusRe = 0.5;
		this.maxRadiusIm = this.maxRadiusRe;
		this.minRadiusIm = this.minRadiusRe;

		this.epsilon = 1e-6;

		this.canvas.addEventListener("wheel", e => {
			if (e.deltaY > 0) {
				this.zoomOut();
			} else {
				this.zoomIn();
			}
			e.preventDefault();
		}, false);
	}

	getMarkerSpacing() {

		let helper = (radius) => {
			let placeValue = Math.floor(Math.log10(radius / this.maxMarkers));
			let firstDigit = Math.round((radius / this.maxMarkers) / Math.pow(10, placeValue));
			console.assert(firstDigit >= 1 && firstDigit <= 9);
			let markerSpacing = null;
			if (firstDigit <= 1) markerSpacing = 2 * Math.pow(10, placeValue);
			else if (firstDigit <= 4) markerSpacing = 5 * Math.pow(10, placeValue);
			else markerSpacing = Math.pow(10, placeValue + 1);
			return markerSpacing;
		};
		
		return {
			"x": helper(this.radiusRe),
			"y": helper(this.radiusIm)
		};
	}

	setRadius(radiusRe, radiusIm) {
		this.radiusRe = Math.max(this.minRadiusRe, Math.min(this.maxRadiusRe, radiusRe));
		this.radiusIm = Math.max(this.minRadiusIm, Math.min(this.maxRadiusIm, radiusIm));
		this.render();
	}

	zoomIn() {
		this.setRadius(this.radiusRe / this.zoomFactor, this.radiusIm / this.zoomFactor);
	}

	zoomOut() {
		this.setRadius(this.radiusRe * this.zoomFactor, this.radiusIm * this.zoomFactor);
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// draw axes
		this.ctx.strokeStyle = "white";
		this.ctx.fillStyle = "white";
		this.ctx.font = "16px serif";
		this.drawLine(math.complex(-this.radiusRe, 0), math.complex(this.radiusRe, 0));
		this.drawLine(math.complex(0, this.radiusIm), math.complex(0, -this.radiusIm));

		let markerSize = 7;

		let markerSpacing = this.getMarkerSpacing();
		let markerSpacingX = markerSpacing.x;
		let markerSpacingY = markerSpacing.y;

		for (let re = Math.ceil(-this.radiusRe / markerSpacingX) * markerSpacingX; re <= this.radiusRe; re += markerSpacingX) {
			let x = this.complexToWindowCoords(math.complex(re, 0)).x;	
			let y1 = this.canvas.height / 2 - markerSize;
			let y2 = this.canvas.height / 2 + markerSize;

			this.ctx.beginPath();
			this.ctx.moveTo(x, y1);
			this.ctx.lineTo(x, y2);
			this.ctx.stroke();

			// text
			if (Math.abs(re) > this.epsilon) {
				this.ctx.textAlign = "center";
				this.ctx.fillText(`${re == Math.round(re) ? re : re.toFixed(1)}`, x, y1 - 10);
			}
		}

		for (let im = Math.ceil(-this.radiusIm / markerSpacingY) * markerSpacingY; im <= this.radiusIm; im += markerSpacingY) {
			let x1 = this.canvas.width / 2 - markerSize;
			let x2 = this.canvas.width / 2 + markerSize;
			let y = this.complexToWindowCoords(math.complex(0, im)).y;	

			this.ctx.beginPath();
			this.ctx.moveTo(x1, y);
			this.ctx.lineTo(x2, y);
			this.ctx.stroke();

			// text
			if (Math.abs(im) > this.epsilon) {
				this.ctx.textAlign = "left";
				let t = "";
				if (im == 1) t = "i";
				else if (im == -1) t = "-i";
				else t = `${im == Math.round(im) ? im : im.toFixed(1)}i`;
				this.ctx.fillText(t, x2 + 10, y);
			}
		}
	}

	drawLine(z1, z2) {
		let z1Window = this.complexToWindowCoords(z1);
		let z2Window = this.complexToWindowCoords(z2);

		this.ctx.beginPath();
		this.ctx.moveTo(z1Window.x, z1Window.y);
		this.ctx.lineTo(z2Window.x, z2Window.y);
		this.ctx.stroke();
	}

	complexToWindowCoords(z) {
		let re = z.re;
		let im = z.im;

		let x = 0.5 * (re / this.radiusRe + 1) * this.canvas.width;
		let y = 0.5 * (-im / this.radiusIm + 1) * this.canvas.height;
		return {
			"x": x,
			"y": y
		};
	}

	windowToComplexCoords(mouseX, mouseY) {
		let re = this.radiusRe * (2 * mouseX / this.canvas.width - 1);
		let im = this.radiusIm * -1 * (2 * mouseY / this.canvas.height - 1);
		return math.complex(re, im);
	}

}

