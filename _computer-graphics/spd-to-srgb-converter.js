let freqLow = 380, freqHigh = 780, freqDelta = 5;
let yLow = 0, yHigh = 150;
const a_min = -10, a_max = 10, a_step = 0.1;
const c_min = 1, c_max = 100, c_step = 1;
const lambda_min = freqLow, lambda_max = freqHigh, lambda_step = freqDelta;

let x = [], y = [];

let d65_Y;
let d65_λ = [];
let d65_f_λ = [];
let canv = $("#canvas")[0];
let ctx = canv.getContext("2d");

let gamut_canv = $("#gamut-canvas")[0];
let gamut_ctx = gamut_canv.getContext("2d");

let gamut_img;

// a exp(-(x-b)^2/(2c^2))
function modifyHistogram(a,b,c) {
    let ctr = 0;
    for (let i = freqLow; i <= freqHigh; i += freqDelta) {
        y[ctr] += a * Math.exp(((i-b)*(i-b))/(-2*c*c));
        y[ctr] = Math.max(y[ctr], yLow);
        y[ctr] = Math.min(y[ctr], yHigh);
        ctr++;
    }
}

function updateVisuals() {
    Plotly.restyle("plotly-div", {
        y: [y]
    });

    let XYZ = toXyz(x, y);
    let srgb = xyzToSrgb(XYZ.X, XYZ.Y, XYZ.Z, d65_Y);
    ctx.fillStyle = `rgb(${255*srgb.r}, ${255*srgb.g}, ${255*srgb.b})`;
    ctx.fillRect(0,0,canv.clientWidth,canv.clientHeight);

    let chrom_x = XYZ.X / (XYZ.X + XYZ.Y + XYZ.Z);
    let chrom_y = XYZ.Y / (XYZ.X + XYZ.Y + XYZ.Z);
    $('#chromaticity').text(`$ (x,y)=(${Number.parseFloat(chrom_x).toFixed(2)},${Number.parseFloat(chrom_y).toFixed(2)})$`);
    $('#luminance').text(`$ Y=${Number.parseFloat(XYZ.Y/d65_Y).toFixed(2)}$`);
    $('#srgb').text(`$ (r,g,b)=(${Math.round(255*srgb.r)}, ${Math.round(255*srgb.g)}, ${Math.round(255*srgb.b)})$`);

    let epsilon = 1e-3;
    if (srgb.r < -epsilon || srgb.g < -epsilon  || srgb.b < -epsilon) {
        $('#warning-gamut').show();
    } else {
        $('#warning-gamut').hide();
    }
    if (srgb.r > 1 + epsilon || srgb.g > 1+epsilon || srgb.b > 1+epsilon) {
        $('#warning-luminance').show();
    } else {
        $('#warning-luminance').hide();
    }

  


    MathJax.typeset();

    let wrh = gamut_img.width/gamut_img.height;
    gamut_canv.width = gamut_canv.clientWidth;
    gamut_canv.height =  gamut_canv.clientWidth/wrh;
   
    let newWidth = gamut_canv.width;
    let newHeight = gamut_canv.height;
    gamut_ctx.fillStyle = "rgb(255,255,255)";
    gamut_ctx.fillRect(0,0,gamut_canv.width,gamut_canv.height);
    gamut_ctx.drawImage(gamut_img, 0, 0,newWidth,newHeight);

    let image_pos_x = 48 + chrom_x * 409.0 / 0.8;
    let image_pos_y = gamut_img.height - (49 + chrom_y * 459.0 / 0.9);
    // console.log(image_pos_x,image_pos_y);

    image_pos_x /= gamut_img.width;
    image_pos_y /= gamut_img.height;

    // console.log(image_pos_x,image_pos_y);

    gamut_ctx.strokeStyle = "rgb(0,0,0)";
    gamut_ctx.fillStyle = "rgb(255,255,255)";
    gamut_ctx.arc(image_pos_x * gamut_canv.width, image_pos_y * gamut_canv.height, 6,0,2*Math.PI,true);
    gamut_ctx.fill();
    gamut_ctx.stroke();

}

function gaussian(x, α, μ, σ1, σ2) {
    let t = (x - μ) / (x < μ ? σ1 : σ2);
    return α * Math.exp(-(t * t) / 2);
}

function toXyz(λ,f_λ) {
    let xyz_x = 0, xyz_y = 0, xyz_z = 0;
    for (let i = 0; i < λ.length; i++) {
        xyz_x += f_λ[i] * (gaussian(λ[i]*10,  1.056, 5998, 379, 310) +
        gaussian(λ[i]*10,  0.362, 4420, 160, 267) +
        gaussian(λ[i]*10, -0.065, 5011, 204, 262));

        xyz_y += f_λ[i] * (gaussian(λ[i]*10,  0.821, 5688, 469, 405) +
        gaussian(λ[i]*10,  0.286, 5309, 163, 311));

        xyz_z += f_λ[i] * (gaussian(λ[i]*10,  1.217, 4370, 118, 360) +
        gaussian(λ[i]*10,  0.681, 4590, 260, 138));
    }
    return {X:xyz_x,Y:xyz_y,Z:xyz_z};
}

function xyzToSrgb(X,Y,Z, Y_w) {
    X /= Y_w;
    Y /= Y_w;
    Z /= Y_w;

    let r_linear = 3.24096994 * X -1.53738318 * Y-0.49861076*Z;
    let g_linear = -0.96924364*X+1.8759675*Y+0.04155506*Z;
    let b_linear = 0.05563008*X-0.20397696*Y+1.05697151*Z;

    let gamma_correct = function(u) {
        return u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u,1.0/2.4)-0.055
    }
    return {
        r: gamma_correct(r_linear),
        g: gamma_correct(g_linear),
        b: gamma_correct(b_linear)
    }
}

function updateSliders() {
    let a = parseFloat($("#range-a").val());
    let c = parseFloat($("#range-c").val());
    let lambda = parseInt($("#range-lambda").val());

    $('label[for="range-a"]').text(`\\( a=${Number.parseFloat(a).toFixed(2)} \\)`);
    $('label[for="range-c"]').text(`\\( \\sigma=${Number.parseFloat(c).toFixed(2)} \\)`);
    $('label[for="range-lambda"]').text(`\\( \\lambda_0=${Number.parseInt(lambda)} \\)`);

    MathJax.typeset();

     
}



$("#range-a")
    .attr({
        "min": a_min,
        "max": a_max,
        "step": a_step
    })
    .val(5)
    .on("input", () => updateSliders());
$("#range-c")
    .attr({
        "min": c_min,
        "max": c_max,
        "step": c_step
    })
    .val(50)
    .on("input", () => updateSliders());
$("#range-lambda")
    .attr({
        "min": lambda_min,
        "max": lambda_max,
        "step": lambda_step
    })
    .val((lambda_min+lambda_max)/2)
    .on("input", () => updateSliders());

$('#freq-update').on('click', function (e) {

    let a = parseFloat($("#range-a").val());
    let c = parseFloat($("#range-c").val());
    let lambda = parseInt($("#range-lambda").val());

    modifyHistogram(a,lambda,c);

    // calculate rgb values from frequency
    updateVisuals();
})

$("#zero").on("click", function (e) {
    for (let i = 0; i < y.length; i++) {
        y[i] = 0;
        
    }
    updateVisuals();
});

$("#white").on("click", function (e) {
    for (let i = 0; i < y.length; i++) {
        y[i] = d65_f_λ[i];
        
    }
    updateVisuals();
});

gamut_img = new Image();
gamut_img.onload = function() {

    $.get("d65-spd.csv", (d65_data) => {
        
        let s = d65_data.split(/\r?\n/);
        for (let i in s) {
            let line = s[i];
            let res = line.split(",");
            let freq = parseInt(res[0]);
            let freq_amt = parseInt(res[1]);
            if (freq >= freqLow && freq <= freqHigh) {
            d65_λ.push(freq);
            d65_f_λ.push(freq_amt);
            }
        }
        d65_xyz = toXyz(d65_λ, d65_f_λ);
        d65_Y = d65_xyz.Y;

        for (let i = freqLow; i <= freqHigh; i += freqDelta) {
            x.push(i);
            y.push(50 * Math.exp(-Math.pow(i-700,2)/10000) + 40 * Math.exp(-Math.pow(i-400,2)/5000));
        }
    
        Plotly.newPlot("plotly-div", [
            {
                x: x,
                y: y,
                type: "bar"
            }
        ], {
            xaxis: {
                range: [freqLow,freqHigh],
                title: {
                    text: "Wavelength λ (nanometres)",
                    font: {
                        family: 'Courier New, monospace',
                        size: 16
                    }
                }
            },
            yaxis: {
                range: [yLow, yHigh],
                title: {
                    text: "Relative intensity (no units)",
                    font: {
                        family: 'Courier New, monospace',
                        size: 16
                    }
                }
            },
            title: {
                text: "Spectral power distribution",
                font: {
                    family: 'Courier New, monospace',
                    size: 24
                }
            },
        });
    
        
    
        // Plotly.newPlot("colour-gamut-div", [
    
        // ], {
        //     images: [
        //         {
        //             "source": "/images/opengl/colour-gamut.png",
        //             "xref": "x",
        //             "yref": "y",
        //             "sizex": 1,
        //             "sizey": 1,
        //             "x": 0,
        //             "y": 0,
        //             "layer": "below"
        //         }
        //     ]
        // })
    
        
        updateVisuals();
        updateSliders();
    
    
    });
    
}

gamut_img.src = "/assets/img/colour-gamut.png";