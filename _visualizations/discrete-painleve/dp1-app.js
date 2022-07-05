import { StereographicVisualizer } from "/assets/js/stereographic-visualizer.js";
import { complexPickerGet } from "/assets/js/components-helper.js"

class DP1Visualizer extends StereographicVisualizer {
    constructor() {
        super(window, "sceneDiv", ["alpha", "beta", "gamma", "w0", "w1"]/*, "linear"*/);
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
        let alpha = complexPickerGet("alpha").getSelected();
        let beta = complexPickerGet("beta").getSelected();
        let gamma = complexPickerGet("gamma").getSelected();

        let result = new Map();
        result.set(0, w0);
        result.set(1, w1);

        let w_prev = w0;
        let w_cur = w1;

        for (let i = 2; i < numIterates; i++) {
            let w_next = math.add(
                math.multiply(alpha, i, w_cur.inverse()),
                math.multiply(beta, w_cur.inverse()),
                gamma,
                math.multiply(-1, w_cur),
                math.multiply(-1, w_prev)
            );
            result.set(i, w_next);

            w_prev = w_cur;
            w_cur = w_next;
        }

		//this.iteratesCache = result;
		return [{
			"data": result,
			"name": "w_n"
		}];
    }

	generateAdditional(iterates) {
		return [
			this.generateMagnitudeData(iterates[0].data, "|w_n|")
		];
	}

    toString() {
        let w0 = this.values.get("w0");
        let w1 = this.values.get("w1");
        let alpha = this.values.get("alpha");
        let beta = this.values.get("beta");
        let gamma = this.values.get("gamma");
        return `dP1_alpha=${alpha}_beta=${beta}_gamma=${gamma}_w0=${w0}_w1=${w1}`;
    }

    randomize() {
        $("#text-alpha").val(this.randomComplex());
        $("#text-beta").val(this.randomComplex());
        $("#text-gamma").val(this.randomComplex());
        $("#text-w0").val(this.randomComplex());
        $("#text-w1").val(this.randomComplex());
    }

	animate() {
		super.animate();

		//for (let point of this.pointsSfu) {
			//this.sceneSfu.remove(point);
		//}
		//this.pointsSfu = [];

		//let iteratesSfu = [];

		//this.rendererSfu.setClearColor("#ffffff", 1);
		//if (math.equal(this.values.get("beta"), 0) && 
			//this.values.get("alpha").im == 0 &&
			//this.values.get("gamma").im == 0 &&
			//this.values.get("w0").im == 0 &&
			//this.values.get("w1").im == 0) {
			//const gamma = this.values.get("gamma");
			//const alpha = this.values.get("alpha");
			//for (let n = 1; n < this.iteratesCache.length; n++) {
				//let s = math.complex(1);
				//s = math.subtract(s, math.divide(gamma, this.iteratesCache[n]));
				//s = math.add(s, math.divide(this.iteratesCache[n-1], this.iteratesCache[n]));

				//let f = math.divide(math.multiply(n, alpha), math.multiply(this.iteratesCache[n], this.iteratesCache[n]));
				//f = math.subtract(f, math.divide(this.iteratesCache[n-1], this.iteratesCache[n]));
				//f = math.complex(f)

				//let u = math.divide(gamma, this.iteratesCache[n]);
				//u = math.complex(u)
				//console.assert(s.im == 0 && f.im == 0 && u.im == 0, s, f, u);
				//iteratesSfu.push({"s": s, "f": f, "u": u})
				//if (math.isNan(s) || math.isNan(f) || math.isNan(u)) continue;

				//let colour = new THREE.Color();
				//colour.setHSL(n / this.iteratesCache.length, 1, 0.5);

				//let geo = new THREE.SphereGeometry(0.005, 4, 4);
				//geo.translate(s.re, f.re, u.re);

				//let point = new THREE.Mesh(
					//geo,
					//new THREE.MeshPhongMaterial({ color: colour, emissive: colour })
				//);

				//this.sceneSfu.add(point);

				//this.pointsSfu.push(point);
			//}
			////console.log(iteratesSfu);
		//}

		//this.rendererSfu.render(this.sceneSfu, this.cameraSfu);
	}
}

$(document).ready(()=>{
    let visualizer = new DP1Visualizer();
    visualizer.startAnimation();
})