class AutomataUI {
    constructor(canvasId, automata) {
        this.scope = new paper.PaperScope();
        this.scope.setup(canvasId);
        this.canvasId = canvasId;
        this.automata = automata;
        this.cellRadius = 5;
        // one dimensional measure of number of cells
        this.cellQuantity = 10;
        this.cells = {};

        // default colours
        this.cellColorDead = "black";
        this.cellColorAlive = "white";
        this.cellColorStroke = "white";

        // this.cellColorHighlightStroke = "red";
    }

    drawNewSquare() {
        const canvas = document.getElementById(this.canvasId);
        const canvasWidth = canvas.getBoundingClientRect().width;
        const canvasHeight = canvas.getBoundingClientRect().height;

        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        for (let i = -this.cellQuantity; i <= this.cellQuantity; i++) {
            for (let j = -this.cellQuantity; j <= this.cellQuantity; j++) {
                const key = `${i},${j}`;

                let cell = new this.scope.Path.RegularPolygon(new this.scope.Point(2 ** 0.5 * i * this.cellRadius + centerX, 2 ** 0.5 * j * this.cellRadius + centerY), 4, this.cellRadius);

                cell.fillColor = this.automata.getCellValue({ "x": i, "y": j }) === 0 ? this.cellColorDead : this.cellColorAlive;
                cell.strokeWidth = 1;
                cell.strokeColor = this.cellColorStroke;
                // cell.on("mouseenter", () => {
                //     // cell.strokeColor = this.cellColorHighlightStroke;
                // });
                // cell.on("mouseleave", () => {
                //     // cell.strokeColor = this.cellColorStroke;
                // });
                cell.on("click", () => {
                    const val = this.automata.getCellValue({ "x": i, "y": j });
                    const newVal = val === 0 ? 1 : 0;
                    this.automata.setCellValue({ "x": i, "y": j }, newVal);
                    this.cells[key].fillColor = newVal === 0 ? this.cellColorDead : this.cellColorAlive;
                })
                this.cells[key] = cell;
            }
        }
    }

    drawNewTriangle() {
        const canvas = document.getElementById(this.canvasId);
        const canvasWidth = canvas.getBoundingClientRect().width;
        const canvasHeight = canvas.getBoundingClientRect().height;

        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        for (let j = -this.cellQuantity, k = 0; j <= this.cellQuantity; j++, k++) {
            for (let i = -k; i <= k; i++) {
                const key = `${i},${j}`;

                let cell = new this.scope.Path.RegularPolygon(new this.scope.Point(3 ** 0.5 / 2 * i * this.cellRadius + centerX, 1.5 * j * this.cellRadius + centerY), 3, this.cellRadius);
                if ((i + j) % 2 == 0) {
                    // "down" triangle i.e. right side up
                    cell.rotate(0);
                } else {
                    // "up" triangle i.e. upside down
                    cell.rotate(180);
                }

                cell.fillColor = this.automata.getCellValue({ "x": i, "y": j }) === 0 ? this.cellColorDead : this.cellColorAlive;
                cell.strokeWidth = 1;
                cell.strokeColor = this.cellColorStroke;
                // cell.on("mouseenter", () => {
                //     // cell.strokeColor = this.cellColorHighlightStroke;
                // });
                // cell.on("mouseleave", () => {
                //     // cell.strokeColor = this.cellColorStroke;
                // });
                cell.on("click", () => {
                    const val = this.automata.getCellValue({ "x": i, "y": j });
                    const newVal = val === 0 ? 1 : 0;
                    this.automata.setCellValue({ "x": i, "y": j }, newVal);
                    this.cells[key].fillColor = newVal === 0 ? this.cellColorDead : this.cellColorAlive;
                })
                this.cells[key] = cell;
            }
        }
    }

    drawNewHexagon() {
        const canvas = document.getElementById(this.canvasId);
        const canvasWidth = canvas.getBoundingClientRect().width;
        const canvasHeight = canvas.getBoundingClientRect().height;

        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        let iStart = this.cellQuantity;
        for (let j = -this.cellQuantity; j <= this.cellQuantity; j++) {
            for (let i = -iStart; i <= iStart; i += 2) {
                const key = `${i},${j}`;

                let cell = new this.scope.Path.RegularPolygon(new this.scope.Point(3 ** 0.5 / 2 * i * this.cellRadius + centerX, 1.5 * j * this.cellRadius + centerY), 6, this.cellRadius);



                cell.fillColor = this.automata.getCellValue({ "x": i, "y": j }) === 0 ? this.cellColorDead : this.cellColorAlive;
                cell.strokeWidth = 1;
                cell.strokeColor = this.cellColorStroke;
                // cell.on("mouseenter", () => {
                //     // cell.strokeColor = this.cellColorHighlightStroke;
                // });
                // cell.on("mouseleave", () => {
                //     // cell.strokeColor = this.cellColorStroke;
                // });
                cell.on("click", () => {
                    const val = this.automata.getCellValue({ "x": i, "y": j });
                    const newVal = val === 0 ? 1 : 0;
                    this.automata.setCellValue({ "x": i, "y": j }, newVal);
                    this.cells[key].fillColor = newVal === 0 ? this.cellColorDead : this.cellColorAlive;
                })
                this.cells[key] = cell;

            };
            if (j < 0) {
                iStart++;
            } else {
                iStart--;
            }
        }
    }

    drawNew() {
        this.scope.activate();

        // delete existing cells if they exist
        for (const [key, val] of Object.entries(this.cells)) {
            val.remove();
        }
        this.cells = new Map();

        switch (this.automata.rule.tilingType) {
            case "Square":
                this.drawNewSquare();
                break;
            case "Triangle":
                this.drawNewTriangle();
                break;
            case "Hexagon":
                this.drawNewHexagon();
                break;
        }

        // for (let i = 0; i < this.automata.width; i++) {
        //     for (let j = 0; j < this.automata.height; j++) {
        //         const key = `${i},${j}`;
        //         if (!this.automata.cells.has(key)) continue;
        //         let cell;
        //         switch (this.automata.rule.tilingType) {
        //             case "Square":
        //                 cell = new this.scope.Path.RegularPolygon(new this.scope.Point(2 ** 0.5 * (i - 0.5) * this.cellRadius, 2 ** 0.5 * (j - 0.5) * this.cellRadius), 4, this.cellRadius);
        //                 break;
        //             case "Triangle":
        //                 cell = new this.scope.Path.RegularPolygon(new this.scope.Point(3 ** 0.5 / 2 * (i - 0.5) * this.cellRadius, 1.5 * (j - 0.5) * this.cellRadius), 3, this.cellRadius);
        //                 if ((i + j) % 2 == 0) {
        //                     // "down" triangle i.e. right side up
        //                     cell.rotate(0);
        //                 } else {
        //                     // "up" triangle i.e. upside down
        //                     cell.rotate(180);
        //                 }
        //                 break;
        //             case "Hexagon":
        //                 cell = new this.scope.Path.RegularPolygon(new this.scope.Point(3 ** 0.5 / 2 * (i - 0.5) * this.cellRadius, 1.5 * (j - 0.5) * this.cellRadius), 6, this.cellRadius);
        //                 break;
        //         }
        //         cell.fillColor = this.automata.getCellValue({ "x": i, "y": j }) === 0 ? this.cellColorDead : this.cellColorAlive;
        //         cell.strokeWidth = 1;
        //         cell.strokeColor = this.cellColorStroke;
        //         cell.on("mouseenter", () => {
        //             // cell.strokeColor = this.cellColorHighlightStroke;
        //         });
        //         cell.on("mouseleave", () => {
        //             // cell.strokeColor = this.cellColorStroke;
        //         });
        //         cell.on("click", () => {
        //             const val = this.automata.getCellValue({ "x": i, "y": j });
        //             const newVal = val === 0 ? 1 : 0;
        //             this.automata.setCellValue({ "x": i, "y": j }, newVal);
        //             this.cells[key].fillColor = newVal === 0 ? this.cellColorDead : this.cellColorAlive;
        //         })
        //         this.cells[key] = cell;
        //     }
        // }
    }

    // drawNew() {
    //     this.scope.activate();
    //     for (let i = 0; i < this.automata.width; i++) {
    //         for (let j = 0; j < this.automata.height; j++) {
    //             const key = `${i},${j}`;
    //             if (!this.automata.cells.has(key)) continue;
    //             let cell;
    //             switch (this.automata.rule.tilingType) {
    //                 case "Square":
    //                     cell = new this.scope.Path.RegularPolygon(new this.scope.Point(2**0.5 * (i-0.5) * this.cellRadius, 2**0.5 * (j-0.5) * this.cellRadius), 4, this.cellRadius);
    //                     break;
    //                 case "Triangle":
    //                     cell = new this.scope.Path.RegularPolygon(new this.scope.Point(3 ** 0.5 / 2 * (i-0.5) * this.cellRadius, 1.5 * (j-0.5) * this.cellRadius), 3, this.cellRadius);
    //                     if ((i + j) % 2 == 0) {
    //                         // "down" triangle i.e. right side up
    //                         cell.rotate(0);
    //                     } else {
    //                         // "up" triangle i.e. upside down
    //                         cell.rotate(180);
    //                     }
    //                     break;
    //                 case "Hexagon":
    //                     cell = new this.scope.Path.RegularPolygon(new this.scope.Point(3 ** 0.5 / 2 * (i-0.5) * this.cellRadius, 1.5 * (j-0.5) * this.cellRadius), 6, this.cellRadius);
    //                     break;
    //             }
    //             cell.fillColor = this.automata.getCellValue({"x": i, "y": j}) === 0 ? this.cellColorDead : this.cellColorAlive;
    //             cell.strokeWidth = 1;
    //             cell.strokeColor = this.cellColorStroke;
    //             cell.on("mouseenter", () => {
    //                 // cell.strokeColor = this.cellColorHighlightStroke;
    //             });
    //             cell.on("mouseleave", () => {
    //                 // cell.strokeColor = this.cellColorStroke;
    //             });
    //             cell.on("click", () => {
    //                 const val = this.automata.getCellValue({"x": i, "y": j});
    //                 const newVal = val === 0 ? 1 : 0;
    //                 this.automata.setCellValue({"x": i, "y": j}, newVal);
    //                 this.cells[key].fillColor = newVal === 0 ? this.cellColorDead : this.cellColorAlive;
    //             })
    //             this.cells[key] = cell;
    //         }
    //     }
    // }
    draw() {
        this.scope.activate();

        if (this.automata.rule.tilingType === "Square") {
            for (let i = -this.cellQuantity; i <= this.cellQuantity; i++) {
                for (let j = -this.cellQuantity; j <= this.cellQuantity; j++) {
                    const key = `${i},${j}`;
                    let cell = this.cells[key];
                    cell.fillColor = this.automata.getCellValue({ "x": i, "y": j }) === 0 ? this.cellColorDead : this.cellColorAlive;
                    cell.strokeColor = this.cellColorStroke;
                }
            }
        } else if (this.automata.rule.tilingType === "Hexagon") {
            let iStart = this.cellQuantity;
            for (let j = -this.cellQuantity; j <= this.cellQuantity; j++) {
                for (let i = -iStart; i <= iStart; i += 2) {
                    const key = `${i},${j}`;
                    let cell = this.cells[key];
                    cell.fillColor = this.automata.getCellValue({ "x": i, "y": j }) === 0 ? this.cellColorDead : this.cellColorAlive;
                    cell.strokeColor = this.cellColorStroke;
                };
                if (j < 0) {
                    iStart++;
                } else {
                    iStart--;
                }
            }

        } else if (this.automata.rule.tilingType === "Triangle") {
            /*let k = Math.floor(this.cellQuantity / 2);
            let layerOfCenter = Math.round(2 / 3 * (4 ** k - 1));
            let height = 2 ** this.cellQuantity;

            let numTriangles;

            if (this.cellQuantity % 2 == 0) {
                numTriangles = 0;
            } else {
                numTriangles = height - 1;
            }

            console.log(this.cells);

            for (let j = -layerOfCenter, h = 0; h < height; j++, h++) {
                for (let i = -numTriangles; i <= numTriangles; i++) {
                    const key = `${i},${j}`;
                    console.log(key);
                    let cell = this.cells[key];
                    cell.fillColor = this.automata.getCellValue({ "x": i, "y": j }) === 0 ? this.cellColorDead : this.cellColorAlive;
                    cell.strokeColor = this.cellColorStroke;
                }
                if (this.cellQuantity % 2 == 0) {
                    numTriangles++;
                } else {
                    numTriangles--;
                }
            }*/

            for (let j = -this.cellQuantity, k = 0; j <= this.cellQuantity; j++, k++) {
                for (let i = -k; i <= k; i++) {
                    const key = `${i},${j}`;
                    let cell = this.cells[key];
                    cell.fillColor = this.automata.getCellValue({ "x": i, "y": j }) === 0 ? this.cellColorDead : this.cellColorAlive;
                    cell.strokeColor = this.cellColorStroke;
                }
            }
        }

        // for (let i = 0; i < this.automata.width; i++) {
        //     for (let j = 0; j < this.automata.height; j++) {
        //         const key = `${i},${j}`;
        //         if (this.automata.cells.has(key)) {
        //             let cell = this.cells[key];
        //             cell.fillColor = this.automata.getCellValue({ "x": i, "y": j }) === 0 ? this.cellColorDead : this.cellColorAlive;
        //             cell.strokeColor = this.cellColorStroke;
        //             // cell.on("mouseenter", () => {
        //             //     cell.strokeColor = this.cellColorHighlightStroke;
        //             // });
        //             // cell.on("mouseleave", () => {
        //             //     cell.strokeColor = this.cellColorStroke;
        //             // });
        //         }
        //     }
        // }
    }
    iterate() {
        this.automata.iterate();
        this.draw();
    }
    clear() {
        this.automata.clear();
        this.draw();
    }
    clearInitializeCenter() {
        this.automata.clear();
        this.automata.setCellValue({x:"0",y:"0"}, 1);
        this.draw();
    }
    randomize() {
        this.automata.randomize(() => Math.random() < 0.5 ? 0 : 1);
        this.draw();
    }
    resizeCanvas() {
        const canvas = document.getElementById(this.canvasId);
        const factor = canvas.clientWidth / canvas.width;
        canvas.width *= factor;
        canvas.height = canvas.width;
        this.scope.view.viewSize = new this.scope.Size(canvas.width, canvas.height);
    }
}