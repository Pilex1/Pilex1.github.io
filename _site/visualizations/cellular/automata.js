class InfiniteList {
    constructor(values) {
        if (values === undefined) values = [];
        this.values = new Map();
        this.minIndex = null;
        this.maxIndex = null;
        if (values instanceof Map) {
            for (let [key, val] of values.entries()) {
                this.set(key, val);
            }
        } else if (values instanceof Array) {
            for (let i = 0; i < values.length; i++) {
                this.set(i, values[i]);
            }
        } else {
            console.error("invalid value in InfiniteList constructor", values);
        }
    }

    isEmpty() {
        return this.minIndex === null && this.maxIndex === null;
    }

    copy() {
        return new InfiniteList(this.values);
    }

    equals(list) {
        if (list.minIndex !== this.minIndex || list.maxIndex !== this.maxIndex) return false;
        for (let i = this.minIndex + 1; i <= this.maxIndex - 1; i++) {
            if (this.get(i) !== list.get(i)) return false;
        }
        return true;
    }

    equalsRelative(list) {
        if (this.maxIndex - this.minIndex !== list.maxIndex - list.minIndex) return false;
        let offset = list.maxIndex - this.maxIndex;
        for (let i = this.minIndex + 1; i <= this.maxIndex - 1; i++) {
            if (this.get(i) !== list.get(offset + i)) return false;
        }
        return true;
    }

    set(index, val) {
        if (val === 0) {
            this.remove(index);
        } else {
            if (this.maxIndex === null && this.minIndex === null) {
                this.maxIndex = index;
                this.minIndex = index;
            } else {
                if (index > this.maxIndex) this.maxIndex = index;
                if (index < this.minIndex) this.minIndex = index;
            }

            this.values.set(index, val);
        }
    }

    remove(index) {
        if (this.minIndex === null && this.minIndex === null) return;
        if (this.values.delete(index) !== undefined) {
            if (this.values.size === 0) {
                this.minIndex = null;
                this.maxIndex = null;
            } else {
                if (index === this.maxIndex) {
                    let i = index - 1;
                    while (this.values.get(i) === 0) {
                        i--;
                    }
                    this.maxIndex = i;
                }
                if (index === this.minIndex) {
                    let i = index + 1;
                    while (this.values.get(i) === 0) {
                        i++;
                    }
                    this.minIndex = i;
                }
            }
        }
    }

    get(index) {
        return this.values.get(index) || 0;
    }
}

class Infinite2DList {
    constructor(values) {
        this.minIndexX = null;
        this.minIndexY = null;
        this.maxIndexX = null;
        this.maxIndexY = null;
        this.values = new Map();
        if (values === undefined) values = [[]];
        for (let j = 0; j < values.length; j++) {
            for (let i = 0; i < values[j].length; i++) {
                if (values[j][i] !== 0) this.set(i, j, values[j][i]);
            }
        }
    }

    set(indexX, indexY, value) {
        if (value === 0) {
            this.remove(indexX, indexY);
        } else {
            if (this.minIndexX === null && this.minIndexY === null && this.maxIndexX === null && this.maxIndexY === null) {
                this.minIndexX = indexX;
                this.maxIndexX = indexX;
                this.minIndexY = indexY;
                this.maxIndexY = indexY;
            } else {
                if (indexX < this.minIndexX) this.minIndexX = indexX;
                if (indexX > this.maxIndexX) this.maxIndexX = indexX;
                if (indexY < this.minIndexY) this.minIndexY = indexY;
                if (indexY > this.maxIndexY) this.maxIndexY = indexY;
            }
            this.values.set(`${indexX},${indexY}`, value);
        }
    }

    remove(indexX, indexY) {
        if (this.minIndexX === null && this.minIndexY === null && this.maxIndexX === null && this.maxIndexY === null) return;
        if (this.values.delete(`${indexX},${indexY}`) !== undefined) {
            if (this.values.size === 0) {
                this.minIndexX = null;
                this.maxIndexX = null;
                this.minIndexY = null;
                this.maxIndexY = null;
            } else {
                if (indexX === this.maxIndexX) {
                    let i = indexX;
                    let found = false;
                    while (true) {
                        for (let j = this.minIndexY; j <= this.maxIndexY; j++) {
                            if (this.get(i, j) !== 0) {
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                        i--;
                    }
                    this.maxIndexX = i;
                }
                if (indexX === this.minIndexX) {
                    let i = indexX;
                    let found = false;
                    while (true) {
                        for (let j = this.minIndexY; j <= this.maxIndexY; j++) {
                            if (this.get(i, j) !== 0) {
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                        i++;
                    }
                    this.minIndexX = i;
                }
                if (indexY === this.maxIndexY) {
                    let j = indexY;
                    let found = false;
                    while (true) {
                        for (let i = this.minIndexX; i <= this.maxIndexX; i++) {
                            if (this.get(i, j) !== 0) {
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                        j--;
                    }
                    this.maxIndexY = j;
                }
                if (indexY === this.minIndexY) {
                    let j = indexY;
                    let found = false;
                    while (true) {
                        for (let i = this.minIndexX; i <= this.maxIndexX; i++) {
                            if (this.get(i, j) !== 0) {
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                        j++;
                    }
                    this.minIndexY = j;
                }
            }
        }
    }

    get(indexX, indexY) {
        return this.values.get(`${indexX},${indexY}`) || 0;
    }
}


// LEGACY CODE FROM HERE ONWARDS

class Rule {
    // args should contain the following fields:
    //  - tilingType where tilingType is one of "Triangle", "Square", "Hexagon"
    //  - ruleType where ruleTypeEnum is one of "Explicit" or "GameOfLife"
    //      - Explicit indicates the iteration rule is explicitly given
    //      - GameOfLife indicates a cell becomes alive based on the NUMBER of surrounding alive cells,
    //        or stays alive based on the NUMBER of surrounding alive cells
    // if ruleType is GameOfLife then we also expect:
    //  - neighbourhoodType where neighbourhoodType is one of "Point" or "Edge"
    //  - deadValue which specifies the value representing a dead cell
    //  - aliveValue which specifies the value representing an alive cell
    //  - keepAlive = [c_1, ... c_k] indicating an alive cell needs c_i neighbouring alive cells to remain alive
    //  - resurrect = [c_1, ... c_k] indiciating a dead cell needs c_i neighbouring alive cells to resurrect
    // if ruleType is Explicit then we also expect:
    //  - iterateFunction
    constructor(args) {
        this.tilingType = args.tilingType;
        this.ruleType = args.ruleType;
        this.args = args;

    }
    applyRule(cells, cellInfo) {
        if (this.ruleType === "Explicit") {
            return this.args.iterateFunction(cells, cellInfo);
        } else if (this.ruleType === "GameOfLife") {
            let neighbourVals = [];
            let aliveNeighbours = 0;
            const x = cellInfo.location.x;
            const y = cellInfo.location.y;
            if (this.tilingType === "Triangle") {
                const triangleType = (x + y) % 2;
                if (this.args.neighbourhoodType === "Edge") {
                    neighbourVals.push(cells.get(`${x - 1},${y}`));
                    neighbourVals.push(cells.get(`${x + 1},${y}`));
                    if (triangleType === 0) {
                        neighbourVals.push(cells.get(`${x},${y + 1}`));
                    } else {
                        neighbourVals.push(cells.get(`${x},${y - 1}`));
                    }
                } else if (this.args.neighbourhoodType === "Point") {
                    neighbourVals.push(cells.get(`${x - 1},${y - 1}`));
                    neighbourVals.push(cells.get(`${x},${y - 1}`));
                    neighbourVals.push(cells.get(`${x + 1},${y - 1}`));
                    neighbourVals.push(cells.get(`${x - 2},${y}`));
                    neighbourVals.push(cells.get(`${x - 1},${y}`));
                    neighbourVals.push(cells.get(`${x + 1},${y}`));
                    neighbourVals.push(cells.get(`${x + 2},${y}`));
                    neighbourVals.push(cells.get(`${x - 1},${y + 1}`));
                    neighbourVals.push(cells.get(`${x},${y + 1}`));
                    neighbourVals.push(cells.get(`${x + 1},${y + 1}`));

                    if (triangleType === 0) {
                        neighbourVals.push(cells.get(`${x - 2},${y + 1}`));
                        neighbourVals.push(cells.get(`${x + 2},${y + 1}`))
                    } else {
                        neighbourVals.push(cells.get(`${x - 2},${y - 1}`));
                        neighbourVals.push(cells.get(`${x + 2},${y - 1}`));
                    }
                }
            } else if (this.tilingType === "Hexagon") {
                neighbourVals.push(cells.get(`${x - 1},${y - 1}`));
                neighbourVals.push(cells.get(`${x + 1},${y - 1}`));
                neighbourVals.push(cells.get(`${x - 2},${y}`));
                neighbourVals.push(cells.get(`${x + 2},${y}`));
                neighbourVals.push(cells.get(`${x - 1},${y + 1}`));
                neighbourVals.push(cells.get(`${x + 1},${y + 1}`));
            } else if (this.tilingType === "Square") {
                neighbourVals.push(cells.get(`${x - 1},${y}`));
                neighbourVals.push(cells.get(`${x + 1},${y}`));
                neighbourVals.push(cells.get(`${x},${y - 1}`));
                neighbourVals.push(cells.get(`${x},${y + 1}`));
                if (this.args.neighbourhoodType === "Point") {
                    neighbourVals.push(cells.get(`${x - 1},${y - 1}`));
                    neighbourVals.push(cells.get(`${x + 1},${y - 1}`));
                    neighbourVals.push(cells.get(`${x - 1},${y + 1}`));
                    neighbourVals.push(cells.get(`${x + 1},${y + 1}`));
                }
            }

            neighbourVals.forEach(info => {
                if (info === undefined) return;
                if (info.value === this.args.aliveValue) aliveNeighbours++;
            });

            // if (aliveNeighbours > 0)
            // console.log(x, y, aliveNeighbours);

            if (cellInfo.value === this.args.aliveValue && this.args.keepAlive.includes(aliveNeighbours)) return this.args.aliveValue;
            if (cellInfo.value === this.args.deadValue && this.args.resurrect.includes(aliveNeighbours)) return this.args.aliveValue;

            return this.args.deadValue;
        }
    }
}

class CellInfo {
    // location: {x: x_val, y: y_val}
    // val represents the current value of the node (usually 0,1)
    constructor(location, value) {
        this.location = location;
        this.value = value;
    }
}

class Automata {
    // iterate_fn: node_val, {left: left_val, right: right_val, ... } --> next node_val
    // width and height of null to indicate infinite automata
    constructor(rule, quantity, initialValue = 0) {
        this.rule = rule;

        this.initialValue = initialValue;
        this.updateSize(quantity);

        // cells: "x,y" --> CellInfo
        // this.cells = new Map();
        // for (let i = 0; i < width; i++) {
        //     for (let j = 0; j < height; j++) {
        //         if (this.rule.tilingType === "Hexagon" && (i+j)%2 === 1) continue;
        //         const cellInfo = new CellInfo({ x: i, y: j }, initialValue);
        //         this.cells.set(`${i},${j}`, cellInfo);
        //     }
        // }

    }

    updateSize(quantity) {

        // todo: instead of clearing each time, update based on previous cell info
        this.cells = new Map();

        this.quantity = quantity;
        if (this.rule.tilingType === "Square") {
            for (let i = -this.quantity; i <= this.quantity; i++) {
                for (let j = -this.quantity; j <= this.quantity; j++) {
                    const cellInfo = new CellInfo({ x: i, y: j }, this.initialValue);
                    this.cells.set(`${i},${j}`, cellInfo);
                }
            }
        } else if (this.rule.tilingType === "Triangle") {
            /*
            let k = Math.floor(this.quantity/2);
            let layerOfCenter = Math.round(2/3 * (4**k - 1));
            let height = 2**this.quantity;

            let numTriangles;

            if (this.quantity % 2 == 0) {
                numTriangles = 0;
            } else {
                numTriangles = height-1;
            }

            for (let j = -layerOfCenter, h=0; h < height; j++, h++) {
                for (let i = -numTriangles; i <= numTriangles; i++) {
                    const cellInfo = new CellInfo({ x: i, y: j }, this.initialValue);
                    this.cells.set(`${i},${j}`, cellInfo);
                }
                if (this.quantity % 2 == 0) {
                    numTriangles++;
                } else {
                    numTriangles--;
                }
            }
            */

            for (let j = -this.quantity,k=0; j <= this.quantity; j++,k++) {
                for (let i = -k; i <= k; i++) {
                    const cellInfo = new CellInfo({ x: i, y: j }, this.initialValue);
                    this.cells.set(`${i},${j}`, cellInfo);
                }
            }

        } else if (this.rule.tilingType === "Hexagon") {
            let iStart = this.quantity;
            for (let j = -this.quantity; j <= this.quantity; j++) {
                for (let i = -iStart; i <= iStart; i += 2) {
                    const cellInfo = new CellInfo({ x: i, y: j }, this.initialValue);
                    this.cells.set(`${i},${j}`, cellInfo);
                };
                if (j < 0) {
                    iStart++;
                } else {
                    iStart--;
                }
            }
        }
    }

    iterate() {
        let newCells = new Map();
        for (const [location, cellInfo] of this.cells.entries()) {
            let newVal = this.rule.applyRule(this.cells, cellInfo);
            newCells.set(location, new CellInfo(cellInfo.location, newVal));
        }

        this.cells = newCells;
    }

    // coords = {x: x_val, y: y_val}
    // returns the cellInfo at the given coordinate
    // if the coords are out of bounds, returns null
    getCellValue(coord) {
        const cellInfo = this.getCell(coord);
        if (cellInfo !== null) return cellInfo.value;
        console.log("null value at: " + coord);
        return null;
    }

    // coords = {x: x_val, y: y_val}
    // returns the cellInfo at the given coordinate
    // if the coords are out of bounds, return null
    getCell(coord) {
        const x = coord.x;
        const y = coord.y;
        const cellInfo = this.cells.get(`${x},${y}`);
        // console.log(cellInfo)
        if (cellInfo !== undefined) return cellInfo;
        console.log("null value at: " + coord);

        return null;
    }

    setCellValue(coord, val) {
        const x = coord.x;
        const y = coord.y;
        const key = `${x},${y}`;
        if (!this.cells.has(key)) return;
        this.cells.get(key).value = val;
    }

    clear(clearValue = 0) {
        for (const key of this.cells.keys()) {
            this.cells.get(key).value = clearValue;
        }
    }

    randomize(randomFunction) {
        for (const key of this.cells.keys()) {
            this.cells.get(key).value = randomFunction();
        }
    }
}