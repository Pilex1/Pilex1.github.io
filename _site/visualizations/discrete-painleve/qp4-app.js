import { StereographicVisualizer } from "/assets/js/stereographic-visualizer.js";
import { complexPickerGet } from "/assets/js/components-helper.js"

class QP4Visualizer extends StereographicVisualizer {
    constructor() {
        super(window, "sceneDiv", ["a0", "a1", "a2", "f0", "f1", "f2"]/*, "linear"*/);
    }

    generateIterates(numIterates) {
        let a0 = complexPickerGet("a0").getSelected();
        let a1 = complexPickerGet("a1").getSelected();
        let a2 = complexPickerGet("a2").getSelected();
        let f0 = complexPickerGet("f0").getSelected();
        let f1 = complexPickerGet("f1").getSelected();
        let f2 = complexPickerGet("f2").getSelected();

        let f0_cur = f0;
        let f1_cur = f1;
        let f2_cur = f2;

		let result_f0 = new Map();
		let result_f1 = new Map();
		let result_f2 = new Map();

		result_f0.set(0, f0);
		result_f1.set(0, f1);
		result_f2.set(0, f2);

		for (let i = 1; i < numIterates; i++) {
            let g0 = math.add(1, math.multiply(a0, f0_cur, math.add(1, math.multiply(a1, f1_cur))));
            let g1 = math.add(1, math.multiply(a1, f1_cur, math.add(1, math.multiply(a2, f2_cur))));
            let g2 = math.add(1, math.multiply(a2, f2_cur, math.add(1, math.multiply(a0, f0_cur))));

            let f0_next = math.divide(math.multiply(a0, a1, f1_cur, g2), g0);
            let f1_next = math.divide(math.multiply(a1, a2, f2_cur, g0), g1);
            let f2_next = math.divide(math.multiply(a2, a0, f0_cur, g1), g2);

			result_f0.set(i, f0_cur);
			result_f1.set(i, f1_cur);
			result_f2.set(i, f2_cur);

            f0_cur = f0_next;
            f1_cur = f1_next;
            f2_cur = f2_next;
		}


		// negative iterates
		// cur_f = [f0, f1, this.f2()];
		// for (let i = -1; i > -numIterates; i--) {
		// 	cur_f = this.prevIterate(cur_f);

		// 	result_f0.set(i, cur_f[0]);
		// 	result_f1.set(i, cur_f[1]);
		// }

		// test that if you apply nextIterate then prevIterate you get back what you started with and vice versa
		//let test_f = [f0, f1, this.f2()];
		//let actual = this.prevIterate(this.nextIterate(test_f));
		//let actual2 = this.nextIterate(this.prevIterate(test_f));
		//console.log(test_f);
		//console.log(actual);
		//console.log(actual2);

		return [
			{
				"data": result_f0,
				"name": "f_0(q^n * t_0)"
			},
			{
				"data": result_f1,
				"name": "f_1(q^n * t_1)"
			},
			{
				"data": result_f2,
				"name": "f_2(q^n * t_2)"
			}

		];
    }
	generateAdditional(iterates) {
        let result_f0 = iterates[0].data;
        let result_f1 = iterates[1].data;
        let result_f2 = iterates[2].data;
        return [
            this.generateMagnitudeData(result_f0, "log|f_0(q^n * t_0)|", true),
            this.generateMagnitudeData(result_f1, "log|f_1(q^n * t_0)|", true),
            this.generateMagnitudeData(result_f2, "log|f_2(q^n * t_0)|", true)
        ]
	}
}
$(document).ready(()=>{
    let visualizer = new QP4Visualizer();
    visualizer.startAnimation();
})