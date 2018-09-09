k = 0;
size = 0;
vals = [];
centers = []
state = "none";

adj = []

function reset() {
    vals = [size]
    for (i = 0; i < size; i++) {
        vals[i] = [size];
        for (j = 0; j < size; j++) {
            vals[i][j] = 0;
        }
    }
    vals[0][0] = Math.random() * 0.5 + 0.5;
    vals[size - 1][0] = Math.random() * 0.5 + 0.5;
    vals[0][size - 1] = Math.random() * 0.5 + 0.5;
    vals[size - 1][size - 1] = Math.random() * 0.5 + 0.5;

    centers.push({
        x: (size - 1) / 2,
        y: (size - 1) / 2
    });

    console.log(vals)
    console.log(centers)
}

function setK(_k) {
    k = _k;
    size = (1 << k) + 1;
}

function iterate() {
    newCenters = []
    if (state == "none" || state == "square") {
        // diamond

        for (center in centers) {
            sum = 0;

        }
    } else if (state == "diamond") {
        // square
    }
}

setK(5);
reset();
