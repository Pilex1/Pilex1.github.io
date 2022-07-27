import { StereographicVisualizer } from "/assets/js/stereographic-visualizer.js";
import { complexPickerGet } from "/assets/js/components-helper.js"

class QP1Visualizer extends StereographicVisualizer {
    constructor() {
        super(window, "sceneDiv", ["a", "q", "w0", "w1"]/*, "linear"*/);
        //this.iteratesCache = null;

        // this.sceneSfu = new THREE.Scene();
        // this.cameraSfu = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        // this.cameraSfu.position.set(0, -0.5, 2);
        // this.cameraSfu.rotation.set(0.3, 0, 0);

        //this.divSfu = document.getElementById('sceneDivSfu');
        //this.rendererSfu = new THREE.WebGLRenderer({ "preserveDrawingBuffer": true });
        //this.rendererSfu.setSize(this.divSfu.clientWidth, this.divSfu.clientWidth);
        //$("#sceneDivSfu")[0].appendChild(this.rendererSfu.domElement);

        //this.pointsSfu = [];
    }

    generateIterates(numIterates) {
        let w0 = complexPickerGet("w0").getSelected();
        let w1 = complexPickerGet("w1").getSelected();
        let a = complexPickerGet("a").getSelected();
        let q = complexPickerGet("q").getSelected();

        let result = new Map();
        result.set(0, w0);
        result.set(1, w1);

        let w_n = w1;
        let w_n_minus_1 = w0;

        for (let n = 1; n < numIterates-1; n++) {
            let w_n_plus_1 = math.subtract(
                math.divide(1, math.multiply(w_n, w_n_minus_1)),
                math.divide(1, math.multiply(a, math.pow(q, n), math.pow(w_n, 2), w_n_minus_1))
            );
            result.set(n + 1, w_n_plus_1);

            w_n_minus_1 = w_n;
            w_n = w_n_plus_1;
        }

		return [{
			"data": result,
			"name": "w_n"
		}];
    }
	generateAdditional(iterates) {
        let data = iterates[0].data;
		let ratios = new Map();
		for (const [n, w_n] of data.entries()) {
			if (data.has(n-2)) {
				ratios.set(n, math.abs(math.divide(w_n, data.get(n-2))));	
			}
		}
		return [
			{"data": ratios, "name": "|w_n/w_{n-2}| "},
			this.generateMagnitudeData(data, "log|w_n|", true)
		];
	}
}
$(document).ready(()=>{
    let visualizer = new QP1Visualizer();
    visualizer.startAnimation();
})