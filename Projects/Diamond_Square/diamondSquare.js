function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// PIXI code

canv = $("#mainCanvasArea");
width = canv.width();
height = width;
renderer = PIXI.autoDetectRenderer(width, width);
renderer.clearBeforeRender = false
canv.get(0).insertBefore(renderer.view, canv.get(0).firstChild);
stage = new PIXI.Container();
graphics = new PIXI.Graphics();
stage.addChild(graphics);

// Diamond Square algorithm

adj = [[-1, 0], [1, 0], [0, -1], [0, 1]];
diag = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

k = 7;
h = 0.5;

size = 0;
vals = [];

radius = 0;
centers = [];
state = "none";

function reset() {
    size = (1 << k) + 1;
    radius = (1 << (k - 1));

    vals = [size]
    for (i = 0; i < size; i++) {
        vals[i] = [size];
        for (j = 0; j < size; j++) {
            vals[i][j] = 0;
        }
    }
    vals[0][0] = rand(0.25, 0.75);
    vals[size - 1][0] = rand(0.25, 0.75);
    vals[0][size - 1] = rand(0.25, 0.75);
    vals[size - 1][size - 1] = rand(0.25, 0.75);

    centers.push([(size - 1) / 2, (size - 1) / 2]);
}

function iterate() {
    if (radius < 1) {
        return;
    }

    if (state == "none" || state == "square") {
        // diamond step
        for (i = 0; i < centers.length; i++) {
            center = centers[i];
            sum = 0;
            for (j = 0; j < diag.length; j++) {
                x = diag[j];
                coord = [center[0] + radius * x[0], center[1] + radius * x[1]];
                sum += vals[coord[0]][coord[1]];
            }
            vals[center[0]][center[1]] = sum / 4 + rand(-0.5 * h, 0.5 * h);
        }

        state = "diamond";
    } else if (state == "diamond") {
        // square step

        squareCenters = [];
        for (i = 0; i < centers.length; i++) {
            center = centers[i];
            for (j = 0; j < adj.length; j++) {
                x = adj[j];
                coord = [center[0] + radius * x[0], center[1] + radius * x[1]];
                squareCenters.push(coord);
            }
        }

        for (i = 0; i < squareCenters.length; i++) {
            center = squareCenters[i];
            sum = 0;
            count = 0;
            for (j = 0; j < adj.length; j++) {
                x = adj[j];
                coord = [center[0] + radius * x[0], center[1] + radius * x[1]];
                if (coord[0] >= 0 && coord[0] < size && coord[1] >= 0 && coord[1] < size) {
                    sum += vals[coord[0]][coord[1]];
                    count += 1;
                }
            }
            vals[center[0]][center[1]] = sum / count + rand(-0.5 * h, 0.5 * h);
        }

        // calculate new centers in the diamond step
        newCenters = [];

        radius /= 2;
        h /= 2;

        for (i = 0; i < centers.length; i++) {
            center = centers[i];
            for (j = 0; j < diag.length; j++) {
                x = diag[j];
                coord = [center[0] + radius * x[0], center[1] + radius * x[1]];
                newCenters.push(coord);
            }
        }

        centers = newCenters;
        state = "square";
    }

}

function iterateFull() {
    while (radius >= 1) {
        iterate();
    }
}

reset();

// Main loop
function render(offset) {

    convert = function (r, g, b) {
        return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
    }

    gridWidth = width / size;
    gridHeight = height / size;
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            x = vals[i][j];
            x = Math.max(0, Math.min(1, x))
            hex = colorsys.hsv2Rgb(x * 360 + offset, 360, 360);
            graphics.beginFill(convert(hex.r, hex.g, hex.b));
            graphics.drawRect(i * gridWidth, j * gridHeight, gridWidth, gridHeight);
        }
    }
}

iterateFull();

frames = 0;
function loop() {
    requestAnimationFrame(loop);
    graphics.clear();

    render(frames / 8);

    renderer.render(stage);
    frames++;
}
loop();