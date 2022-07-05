import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js';
import { complexPickerGet } from "./components-helper.js"

export { StereographicVisualizer };

class StereographicVisualizer {

    constructor(window, divId, guiParameters) {
        this.initialCameraPos = new THREE.Vector3(0, -0.5, 2);
        this.initialCameraRot = new THREE.Vector3(0.3, 0, 0);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.resetCamera();

        this.div = document.getElementById(divId);
        this.renderer = new THREE.WebGLRenderer({ "preserveDrawingBuffer": true });
        this.renderer.setSize(this.div.clientWidth, this.div.clientWidth);
        $("#" + divId)[0].appendChild(this.renderer.domElement);

        for (let guiParam of guiParameters) {
            let picker = complexPickerGet(guiParam);
            picker.onChange((selectedValue) => {
                this.updateIterates();
            })
        }

        // this.guiInputs = guiInputs;
        // this.values = new Map();
        // for (let x of this.guiInputs) {
        //     let valName = x[0];
        //     let valLatex = x[1];
        //     $("#text-" + valName).on("change", () => {
        //         this.updateValuesFromGui();
        //         this.updateIterates();
        //     });
        //     $("#btn-" + valName).on("click", () => {
        //         this.updateValuesFromGui();
        //         this.updateIterates();
        //     });
        // }

        // sphere geometry
        let geometry = new THREE.SphereGeometry(1, 32, 32);
        let lineMaterial = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.2 });
        let meshMaterial = new THREE.MeshPhongMaterial({ color: 0x38abe0, emissive: 0, side: THREE.DoubleSide, flatShading: true });
        this.sphere = new THREE.Mesh(geometry, meshMaterial);
        this.sphere.rotation.x = Math.PI / 2;
        this.scene.add(this.sphere);

        // sphere wireframe
        let wireframe = new THREE.WireframeGeometry(new THREE.SphereGeometry(1.01, 32, 16));
        let line = new THREE.LineSegments(wireframe, lineMaterial);
        line.rotation.x = Math.PI / 2;
        this.scene.add(line);

        // orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;

        // lights
        let lights = [];
        let lightColour = 0x333333;
        lights[0] = new THREE.PointLight(lightColour, 1, 0);
        lights[1] = new THREE.PointLight(lightColour, 1, 0);
        lights[2] = new THREE.PointLight(lightColour, 1, 0);
        lights[3] = new THREE.PointLight(lightColour, 1, 0);
        lights[4] = new THREE.PointLight(lightColour, 1, 0);

        lights[0].position.set(100, -200, 100);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(- 100, - 200, - 100);
        lights[3].position.set(- 100, 200, -100);
        lights[4].position.set(-100, 0, 100);

        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);
        this.scene.add(lights[3]);
        this.scene.add(lights[4]);

        // misc variables
        this.line = null;

        this.points = [];
        this.numIterates = 0;
		this.plotlyData = [];
		this.plotlyMagnitudeLayout = {
			xaxis: {
				type: "linear",
				autorange: true,
				title: "n"
			},
			yaxis: {
				//type: this.plotType,
				type: "linear",
				autorange: true
			}
		}
		Plotly.newPlot("plotMagnitude", this.plotlyData, this.plotlyMagnitudeLayout);

        // mouse listener
        this.mouse = new THREE.Vector2();

        window.addEventListener("mousemove", event => {
            const div = document.getElementById(divId);
            let rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / div.clientWidth) * 2 - 1;
            this.mouse.y = - ((event.clientY - rect.top) / div.clientWidth) * 2 + 1;
        }, false);

        // colour
		$("#range-colour-brightness").on("input", () => {
			this.updateFromGui();
			this.updateIterates();
		})
        $("#colorSphere").on("input", () => this.updateFromGui());
        $("#colorEmissionSphere").on("input", () => this.updateFromGui());
        $("#colorBackground").on("input", () => this.updateFromGui());
        $("#range-iterations").on("input", () => {
            this.updateFromGui();
            this.updateIterates();
        });

        // reset camera
        $("#btnResetCamera").on("click", () => this.resetCamera());

        // save image
        $("#btnSaveImage").on("click", () => {
            const link = document.createElement('a');
            link.setAttribute('download', this.toString() + ".png");
            link.setAttribute('href', this.renderer.domElement.toDataURL("image/png").replace("image/png", "image/octet-stream"));
            link.click();
        });

        // randomization
        this.randomizeRange = 1;
        this.randomizeDecimals = 1;
        $("#btn-randomize").on("click", () => {
            this.randomize();
            this.updateValuesFromGui();
            this.updateIterates();
        });

		// import params
		// $("#btn-params").on("click", () => {
		// 	let oldValues = new Map();
		// 	for (let x of this.guiInputs) {
		// 		oldValues.set(x[0], this.values.get(x[0]));
		// 	}

		// 	const params = $("#text-params").val();
		// 	const arr = params.split("_");
		// 	try {
		// 		for (let i = 1; i < arr.length; i++) {
		// 			const arr2 = arr[i].split("=");
		// 			const paramName = arr2[0];
		// 			const paramVal = arr2[1];

		// 			// update gui to match
		// 			$("#text-" + paramName).val(paramVal);
		// 		}
		// 		if (!this.updateValuesFromGui()) throw "invalid import";
		// 		this.updateIterates();
		// 	} catch (error) {
		// 		//console.log(error);
		// 		this.values = oldValues;
		// 		for (let [key, val] of this.values) {
		// 			$("#text-" + key).val(val);
		// 		}
		// 	}
		// });
    }

    randomAbsReal() {
        return (this.randomizeRange * Math.random()).toFixed(this.randomizeDecimals);
    }

    randomReal() {
        return (Math.random() < 0.5 ? "" : "-") + this.randomAbsReal();
    }

    randomComplex() {
        let sign1 = Math.random() < 0.5;
        let sign2 = Math.random() < 0.5;

        return (sign1 ? "" : "-") + this.randomAbsReal() + (sign2 ? "+" : "-") + this.randomAbsReal() + "i";
    }

    randomize() {
        throw new Error("abstract method");
    }

    formatComplex(z, precision) {
        z = math.complex(z);
        let s = Math.sign(z.re) == -1 ? "-" : "";
        s += Math.abs(z.re).toFixed(precision);
        s += Math.sign(z.im) == -1? " - " : " + ";
        s += Math.abs(z.im).toFixed(precision);
        s += "i";
        return s;
    }

    toString() {
        throw new Error("abstract method");
    }

	importParams() {
		throw new Error("abstract method");
	}

    resetCamera() {
        this.camera.position.set(this.initialCameraPos.x, this.initialCameraPos.y, this.initialCameraPos.z);
        this.camera.rotation.set(this.initialCameraRot.x, this.initialCameraRot.y, this.initialCameraRot.z);
    }

    updateFromGui() {
        // colours
        this.renderer.setClearColor($("#colorBackground").val(), 1);
        this.sphere.material.color = new THREE.Color($("#colorSphere").val());
        this.sphere.material.emissive = new THREE.Color($("#colorEmissionSphere").val());

        // numIterates
        this.numIterates = parseInt(math.pow(2, parseInt($("#range-iterations").val())));
        $("#label-iterations").text("Number of iterations: " + this.numIterates);

    }

    updateValuesFromGui(typeset = true) {
        // let oldValues = new Map();
        // for (let x of this.guiInputs) {
        //     oldValues.set(x[0], this.values.get(x[0]));
        // }

        // try {
        //     this.values = new Map();
        //     for (let x of this.guiInputs) {
        //         let valName = x[0];
        //         let valLatex = x[1];
        //         this.values.set(valName, math.complex(math.parse($("#text-" + valName).val()).compile().eval()));
        //         $("#label-" + valName).text(`\\( ${valLatex} = ${this.values.get(valName)} \\)`);
        //     }
		// 	// param import/export
		// 	$("#text-params").val(this.toString());

        //     if (typeset) MathJax.typeset();
		// 	return true;
        // } catch (error) {
        //     this.values = oldValues;
		// 	return false;
        // }
    }

    generateIterates(numIterates) {
        throw new Error("abstract method");
    }

	generateAdditional(iterates) {
		return [];
	}

    updateIterates() {
        // clear any existing points
        for (let point of this.points) {
            this.scene.remove(point);
        }
        this.points = [];
        if (this.line != null) {
            this.scene.remove(this.line);
        }

        // clear table
        $("#tableValues").empty();

        // add iterate points
        this.numIterates = 100;
        let iterates = this.generateIterates(this.numIterates);
        // console.debug(iterates);

		//let iteratesListLength = Array.isArray(iterates.get(0)) ? iterates.get(0).length : 1;

		//let magnitudeData = [];
		//for (let i = 0; i < iteratesListLength; i++) {
			//let curMagnitudeData = {
				//x: [],
				//y: [],
				//mode: "markers",
				//type: "scatter",
				//name: iteratesListLength > 1 ? "Iterate " + i : "Iterates"
			//};
			//magnitudeData.push(curMagnitudeData);
			//this.plotlyData.push(curMagnitudeData);
		//}



		//for (let i = 0; i < iteratesListLength; i++) {
			//let threeProductData = {
				//x: [],
				//y: [],
				//mode: "markers",
				//type: "scatter",
				//name: iteratesListLength > 1 ? "Product of iterate " + i : "Product of iterates"
				////name : iteratesListLength > 1 ? "Product of iterate " + i + ": w_{n-1}w_{n}w_{n+1}" :
				////"Product of iterates: w_{n-1}w_{n}w_{n+1}"
			//};
			//this.plotlyData.push(threeProductData);
		//}
		
		for (const iterateObj of iterates) {
			const data = iterateObj.data;
			const name = iterateObj.name;

            let pointsVec3 = [];

			for (const [n, x] of data.entries()) {
				let st = this.stereographic(x);
				if (!(isFinite(st.x) && isFinite(st.y) && isFinite(st.z))) continue;

				let colour = new THREE.Color();
				let colourBrightness = parseFloat($("#range-colour-brightness").val());
				colour.setHSL(Math.abs(n) / this.numIterates, 1, colourBrightness);

				let geo = new THREE.SphereGeometry(0.005, 4, 4);
				geo.translate(st.x, st.y, st.z);

				let point = new THREE.Mesh(
					geo,
					new THREE.MeshPhongMaterial({ color: colour, emissive: colour })
				);

                if (n % 4 == 0)
                pointsVec3.push(new THREE.Vector3(-st.x, -st.y, -st.z));

				this.scene.add(point);

				this.points.push(point);

				// add to table
				let precision = 4;
				let iteratesString = this.formatComplex(x, precision);
				// yes this is reversed because of the threejs coordinate system
				let projectionString = `x: ${st.x.toFixed(precision)}, y: ${st.z.toFixed(precision)}, z: ${st.y.toFixed(precision)}`;

				let tableData = `<tr><th scope="row">${n}</th><td>${iteratesString}</td><td>${projectionString}</td></tr>`;
				$("#tableValues").append(tableData);
			}	

            // pointsVec3 = [];
            // pointsVec3.push( new THREE.Vector3( 0, 2, 0 ) );
            // pointsVec3.push( new THREE.Vector3( 0.5, -2, 0 ) );
            // pointsVec3.push( new THREE.Vector3( 1, 2, 0 ) );

            this.line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(pointsVec3),
                new THREE.LineBasicMaterial({color: 0x0000ff})
            );
            this.scene.add(this.line);

		}

		this.plotlyData.length = 0;
		let additionalData = this.generateAdditional(iterates);
		for (let x of additionalData) {
			let curData = {
				"x": [],
				"y": [],
				"mode": "markers",
				"type": "scatter",
				"name": x.name
			};
			for (const [n, y] of x.data.entries()) {
				curData.x.push(n);
				curData.y.push(y);
			}
			this.plotlyData.push(curData);
		}

		Plotly.redraw("plotMagnitude");
    }

	generateMagnitudeData(iteratesMap, name, log=false) {
		let data = new Map();
		for (const [n, w_n] of iteratesMap.entries()) {
			if (log) data.set(n, math.log(math.abs(w_n)));
			else data.set(n, math.abs(w_n));
		}
		return {
			"data": data,
			"name": name
		};
	}

    stereographic(z) {
        z = math.complex(z);
        let x = z.re;
        let y = z.im;
        let original = {
            "x": 2 * x / (1 + x * x + y * y),
            "y": 2 * y / (1 + x * x + y * y),
            "z": (x * x + y * y - 1) / (1 + x * x + y * y)
        };

        let theta = -Math.PI / 2;

        return {
            "x": original.x,
            "y": Math.cos(theta) * original.y - Math.sin(theta) * original.z,
            "z": Math.sin(theta) * original.y + Math.cos(theta) * original.z,
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // make the camera autorotate if the checkRotate checkbox is checked
        this.controls.autoRotate = $("#checkRotate").is(":checked");
        this.controls.update();

        for (let point of this.points) {
            point.rotation.x = this.sphere.rotation.x;
            point.rotation.y = this.sphere.rotation.y;
        }

        let mouseRaycaster = new THREE.Raycaster();
        mouseRaycaster.setFromCamera(this.mouse, this.camera);
        const intersect = mouseRaycaster.intersectObject(this.sphere);

        let posMsg = "Looking at: ";

        if (intersect.length > 0) {
            let intersectPoint = intersect[0].point;

            const re = intersectPoint.x / (1 - intersectPoint.z);
            const im = intersectPoint.y / (1 - intersectPoint.z);

            if (re * re + im * im >= 412) {
                posMsg += "Infinity"
            } else {
                posMsg += `${re.toFixed(2)} ${im >= 0 ? "+" : "-"} ${Math.abs(im).toFixed(2)}i`;

            }
        }
        $("#lbl-pos").text(posMsg);
        // MathJax.typeset();

        this.renderer.render(this.scene, this.camera);

    }

    startAnimation() {
        this.updateFromGui();
        this.updateValuesFromGui();
        this.updateIterates();

        this.animate();
    }
}


