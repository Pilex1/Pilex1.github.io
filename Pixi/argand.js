/*global PIXI*/
/*global math*/
/*global graphics*/
/*global renderer*/

/*jshint esversion: 6 */

class Argand {
	
	constructor() {
		this.center = math.complex(0, 0);	
		this.zoom = 200;
		this.frameCount = 0;
		this.gridSize = 1;
		
		this.storePoints = true;
		this.points = [];
		this.refresh = true;
		
		this.pan = 10;
	}
	
	renderCoordinate(z) {
		graphics.beginFill(z.color, z.alpha);
		graphics.lineStyle(0);
		var relx = z.point.re - this.center.re;
		var rely = z.point.im - this.center.im;

		var posx = renderer.view.width/2 + relx * this.zoom - this.gridSize/2;
		var posy = renderer.view.height/2 - rely * this.zoom + this.gridSize/2;
		
		if (posx+this.gridSize < 0) return;
		if (posx > renderer.view.width) return;
		if (posy < 0) return;
		if (posy-this.gridSize > renderer.view.height) return;

		graphics.drawRect(posx, posy, this.gridSize, -this.gridSize);
		graphics.endFill();		
	}
	
	renderAxes() {
		
		graphics.lineStyle(1, 0x888888, 0.5);

		graphics.moveTo(renderer.view.width/2 - this.center.re*this.zoom, 0);
		graphics.lineTo(renderer.view.width/2 - this.center.re*this.zoom, renderer.view.height);

		graphics.moveTo(0, renderer.view.height/2 + this.center.im * this.zoom);
		graphics.lineTo(renderer.view.width, renderer.view.height/2 + this.center.im * this.zoom);
		
	}
	
	render() {
		if (this.refresh) {
			graphics.clear();
			this.renderAxes();
			if (this.storePoints) {
				for (var i = 0; i < this.points.length; i++) {
					this.renderCoordinate(this.points[i]);
				}
			}
			this.refresh = false;
		}
		
		this.frameCount += 1;
	}
	
	calculateMouseCoordinate(z) {
		var x = z.clientX - document.getElementById("canvas").offsetLeft;
		var y = z.clientY - document.getElementById("canvas").offsetTop;
		
		var re = this.center.re + (2*x + this.gridSize - renderer.view.width)/(2*this.zoom);
		var im = this.center.im - (2*y - this.gridSize - renderer.view.height)/(2*this.zoom);
		return math.complex(re, im);
	}
	
	addCoordinate(z) {
		if (this.storePoints) {
			this.points.push(z);
		}
		this.renderCoordinate(z);
	}
	
	setzoom(zoom) {
		this.zoom = zoom;
	}
	
	zoomOut() {
		this.zoom /= 1.2;
		if (this.zoom < 0.0001) {
			this.zoom = 0.0001;
		}
		this.refresh = true;
	}
	
	zoomIn() {
		this.zoom *= 1.2;
		this.refresh = true;
	}
	
	clear() {
		this.points = [];
		graphics.clear();
		this.refresh = true;
	}
	
	panLeft() {
		this.center.re -= this.pan/this.zoom;
		this.refresh = true;
	}
	
	panRight() {
		this.center.re += this.pan/this.zoom;
		this.refresh = true;
	}
	
	panUp() {
		this.center.im += this.pan/this.zoom;
		this.refresh = true;
	}
	
	panDown() {
		this.center.im -= this.pan/this.zoom;
		this.refresh = true;
	}
	
}