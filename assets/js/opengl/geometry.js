/**
 *
 * @param heights 2d array
 *
 * output includes texture UV
 */
function plane(heights) {
    let vertices = [];
    let elements = [];

    let sizeY = heights.length;
    let sizeX = heights[0].length;

    for (let j = 0; j < sizeY; j++) {
        for (let i  = 0; i < sizeX; i++) {
            vertices.push(i, heights[j][i], j, i, j);
        }
    }
    for (let j = 0; j < sizeY-1; j++) {
        for (let i = 0; i < sizeX-1; i++) {
            let ind = j * sizeX + i;
            let indNext = (j+1) * sizeX + i;
            elements.push(ind, indNext, indNext+1);
            elements.push(indNext+1, ind+1, ind);
        }
    }
    return {
        vertices: vertices,
        elements: elements
    };
}

function square() {
    return {
        vertices: [
            -1, 1,
            -1, -1,
            1, -1,
            1, 1
        ],
        elements: [
            0,1,2,2,3,0
        ]
    }
}

function square_z(centerX, centerY, r, z) {
    return {
        vertices: [
            centerX-r, centerY+r, z,
            centerX-r, centerY-r, z,
            centerX+r, centerY-r, z,
            centerX+r, centerY+r, z
        ],
        elements: [
            0,1,2,2,3,0
        ]
    }
}

// wip
function cube(r, numRings) {
    let vertices = [];
    let elements = [];

    // north pole triangles
    vertices.push(0);
    vertices.push(r);
    vertices.push(0);
    for (let i = 0; i < numRings + 1; i++) {
        elements.push(0);
        elements.push(offset + ((i + 1) % (numRings + 1)));
        elements.push(offset + i);
    }

    let offset = 1;
    // non-degenerate rectangles
    for (let i = 1; i < numRings + 1; i++) {
        let phi = Math.PI * (i / (numRings + 1));
        // go around the ring horizontally
        for (let j = 0; j < (numRings + 1); j++) {
            let theta = 2 * Math.PI * (j / (numRings + 1));
            vertices.push(r * Math.cos(phi) * Math.cos(theta));
            vertices.push(r * Math.sin(phi));
            vertices.push(r * Math.cos(phi) * Math.sin(theta));
        }
        if (i > 1) {
            // for (let j = 0; )
            let topLeft = offset - (numRings + 1);
            let topRight = topLeft + 1;
            let bottomLeft =
                elements.push()
        }
        offset += numRings + 1;
    }

    // south pole triangles
    vertices.push(0);
    vertices.push(-r);
    vertices.push(0);
}

function icosphere(radius) {
    const H_ANGLE = Math.PI / 180 * 72;
    const V_ANGLE = Math.atan(0.5);

    let hAngle1 = -Math.PI / 2 - H_ANGLE / 2;
    let hAngle2 = -Math.PI / 2;

    let vertices = new Array(12 * 3);
    vertices[0] = 0;
    vertices[1] = radius;
    vertices[2] = 0;

    for (let i = 1; i <= 5; i++) {
        let i1 = i * 3;
        let i2 = (i + 5) * 3;

        let y = radius * Math.sin(V_ANGLE); // elevation
        let xz = radius * Math.cos(V_ANGLE); // length on xz plane

        // x
        vertices[i1] = xz * Math.cos(hAngle1);
        vertices[i2] = xz * Math.cos(hAngle2);

        // z
        vertices[i1 + 2] = xz * Math.sin(hAngle1);
        vertices[i2 + 2] = xz * Math.sin(hAngle2);

        // y
        vertices[i1 + 1] = y;
        vertices[i2 + 1] = -y;

        hAngle1 += H_ANGLE;
        hAngle2 += H_ANGLE;
    }

    vertices[11 * 3 + 0] = 0;
    vertices[11 * 3 + 1] = -radius;
    vertices[11 * 3 + 2] = 0;

    let elements = [];
    for (let i = 1; i <= 5; i++) {
        elements.push(0, i, i % 5 + 1);
    }
    // elements.push(0,5,1);
    for (let i = 1; i <= 5; i++) {
        elements.push(i, 5 + i, i % 5 + 1);
        elements.push(i % 5 + 1, 5 + i, 5 + i % 5 + 1);
    }
    for (let i = 1; i <= 5; i++) {
        elements.push(5 + i, 11, 5 + i % 5 + 1);
    }
    return {
        vertices: vertices,
        elements: elements
    };
}

/**
 *
 * @param n
 * @param f
 * @param r
 * @param t
 * @param x0 mouse NDC x
 * @param y0 mouse NDC y
 * @param X sphere x
 * @param Y sphere y
 * @param Z sphere z
 * @param R sphere radius
 */
function intersectSphere(n, f, r, t, x0, y0, X, Y, Z, R) {


    // let distSqDerivative = function(z) {
    //     return (4*f*(f-n)*(n*(2*f*n+(f+n-f*z+n*z)*Z)+r*X*(f*(-1+z)-n*(1+z))*x0+2*f*r**2*x0**2+t*y0*(f*Y*(-1+z)-n*Y*(1+z)+2*f*t*y0))) / ((f+n-f*z+n*z)**3)
    // };

    if (sphereDistSq(1, n,r,t,x0,y0,X,Y,Z) <= R**2 || sphereDistSq(f/n, n,r,t,x0,y0,X,Y,Z) <= R**2) {
        return true;
    } else {
        let l_crit = lambda_crit(n,r,t,x0,y0,X,Y,Z);
        return 1 <= l_crit && l_crit <= f/n && sphereDistSq(l_crit,n,r,t,x0,y0,X,Y,Z) <= R**2;
    }

    // let distNear = sphereDistSq(n, f, r, t, x0, y0, X, Y, Z, -1);
    // let distFar = sphereDistSq(n, f, r, t, x0, y0, X, Y, Z, 1);
    // if (distNear <= R ** 2 || distFar <= R ** 2) {
    //     return true;
    // } else {
    //     let critPt = (n * (2 * f * n + (f + n) * Z) - (f + n) * r * X * x0 + 2 * f * r ** 2 * x0 ** 2 + t * y0 * (-(f + n) * Y + 2 * f * t * y0)) / ((f - n) * (n * Z - r * X * x0 - t * Y * y0));
    //     return -1 <= critPt && critPt <= 1 && sphereDistSq(n, f, r, t, x0, y0, X, Y, Z, critPt) <= R ** 2;
    //     // return Math.sign(distSqDerivative(-1)) !== Math.sign(distSqDerivative(-1)) && ()
    //
    // }
    // if (distN <= R) {
    //     console.log(1);
    //     return true;
    // } else {
    //     console.log(2);
    //     // console.log(distSqConcav(-f), distSqConcav(-n));
    //     return Math.sign(distSqConcav(1)) !== Math.sign(distSqConcav(-1));
    // }

    // let between = function(a, b, x) {
    //     let min = Math.min(a,b), max = Math.max(a,b);
    //     return min <= x && x <= max;
    // };
    //
    // console.log( between(alpha_1, alpha_2, sphereRadius ** 2));


    /*
     let distSqConcav = function(z) {
         return (8*f*(f-n)**2*(n*(3*f*n+(f+n-f*z+n*z)*Z)+r*X*(f*(-1+z)-n*(1+z))*x0+3*f*r**2*x0**2+t*y0*(f*Y*(-1+z)-n*Y*(1+z)+3*f*t*y0))) / ((f+n-f*z+n*z)**4)
     };*/


    /*console.log(x0, y0);
    console.log(distSq(-n), distSq(-f));



    }*/


    /*let minimumDistSq = (n**2 * (X**2+Y**2)
        + r**2 * (Y**2+Z**2)*x0**2
        +2*r*X*x0*(n*Z-t*Y*y0)
        +t*y0*(2*n*Y*Z+t*(X**2+Z**2)*y0))
        /(n**2+r**2*x0**2+t**2*y0**2);
    console.log(minimumDistSq);*/
}

function lambda(n,f,z) {
    return 2*f/(n+f+(n-f)*z);
}

function lambda_crit(n,r,t,x0,y0,X,Y,Z) {
    return (-n*Z+r*x0*X+t*y0*Y)/(n**2+r**2*x0**2+t**2*y0**2);
}


// function sphereDistSq(n, f, r, t, x0, y0, X, Y, Z, z) {
//     let lambda = 2 * f / ((n + f) + (n - f) * z);
//     return (lambda * r * x0 - X) ** 2 + (lambda * t * y0 - Y) ** 2 + (lambda * (-n) - Z) ** 2;
// }

function sphereDistSq(lambda, n, r, t, x0, y0, X, Y, Z) {
    return (lambda * r * x0 - X) ** 2 + (lambda * t * y0 - Y) ** 2 + (lambda * (-n) - Z) ** 2;
}


function sphereDistSqPlotly(n, f, r, t, x0, y0, X, Y, Z, R) {
    const numPoints = 100;
    let x = [], y = [];
    for (let i = 0; i <= numPoints; i++) {
        let lambdaCur = 1 + (f/n-1)*(i/numPoints);
        let yCur = sphereDistSq(lambdaCur, n,r,t,x0,y0,X,Y,Z);
        x.push(lambdaCur);
        if (x0 == null || y0 == null) {
            y.push(null);
        } else {
            y.push(yCur);
        }
    }
    // console.log(x,y);
    return [{
        x: x,
        y: y,
        mode: "lines",
        name: 'd(λ)',
    }, {
        x: [1,f/n],
        y: [R*R, R*R],
        mode: "lines",
        name: 'R^2',
    }];
}


function matrixMult(a, b) {
    let result = [];
    for (let r = 0; r <= 3; r++) {
        for (let c = 0; c <= 3; c++) {
            let entry = 0;
            for (let i = 0; i <= 3; i++) {
                // a[r][i] * b[i][c]
                entry += a[4 * r + i] * b[4 * i + c];
            }
            result.push(entry);
        }
    }
    return result;
}

function getCenteredProjectionMatrix(n, f, r, t) {
    return getProjectionMatrix(n, f, -r, r, -t, t);
}

function getProjectionMatrix(n, f, l, r, b, t) {
    return [
        2 * n / (r - l), 0, (r + l) / (r - l), 0,
        0, 2 * n / (t - b), (t + b) / (t - b), 0,
        0, 0, -(f + n) / (f - n), -2 * f * n / (f - n),
        0, 0, -1, 0
    ];
}

function getTranslationMatrix(x, y, z) {
    return [
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1
    ]
}

function getScalingMatrix(a,b,c) {
    if (b == null && c == null) {
        b = a;
        c = a;
    }
    return [
        a, 0, 0, 0,
        0, b, 0, 0,
        0, 0, c, 0,
        0, 0, 0, 1
    ]
}

function getRotationYMatrix(theta) {
    return [
        Math.cos(theta), 0, Math.sin(theta), 0,
        0, 1, 0, 0,
        -Math.sin(theta), 0, Math.cos(theta), 0,
        0, 0, 0, 1
    ]
}

function getFrustum() {
    let r_prime = f / n * r;
    let t_prime = f / n * t;
    return {
        vertices: [
            // front face
            -r, t, n,
            -r, -t, n,
            r, -t, n,
            r, t, n,
            // back face
            r_prime, t_prime, f,
            r_prime, -t_prime, f,
            -r_prime, -t_prime, f,
            -r_prime, t_prime, f
        ],
        elements: [
            // front
            0, 1, 2, 2, 3, 0,
            //back
            4, 5, 6, 6, 7, 4,
            // left
            7, 6, 1, 1, 0, 7,
            // right
            3, 2, 5, 5, 4, 3,
            // top
            7, 0, 3, 3, 4, 7,
            // bottom
            1, 6, 5, 5, 2, 1
        ]
    }
}