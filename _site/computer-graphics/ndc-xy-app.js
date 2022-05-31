let xyCanvas = document.getElementById("canvas-xy");
let mouseX = 0;
let mouseY = 0;
xyCanvas.addEventListener("mousemove", e => {
    xyCanvasUpdate(e);
});
function xyCanvasUpdate(e) {
    let ctx = xyCanvas.getContext("2d");
    ctx.clearRect(0, 0, xyCanvas.width, xyCanvas.height);
    ctx.beginPath();
    ctx.moveTo(xyCanvas.width / 2, 0);
    ctx.lineTo(xyCanvas.width / 2, xyCanvas.height);
    ctx.strokeStyle = "rgb(0,128,255)";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, xyCanvas.height / 2);
    ctx.lineTo(xyCanvas.width, xyCanvas.height / 2);
    ctx.stroke();

    ctx.beginPath();
    let rect = xyCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    ctx.arc(mouseX, mouseY, 4, 0, 2 * Math.PI, true);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.lineWidth = 0;
    ctx.fill();

    let x = (mouseX / xyCanvas.width - 0.5) * 2;
    let y = -(mouseY / xyCanvas.height - 0.5) * 2;
    $("#labelCoord").text(e.clientX == null ? "Hover your mouse over the canvas above to get started" : `NDC: x = ${x.toFixed(2)}, y = ${y.toFixed(2)}`);
}

xyCanvas.setAttribute('width', parseInt($(xyCanvas).css('width')))
xyCanvas.setAttribute('height', parseInt($(xyCanvas).css('width')))
xyCanvasUpdate({"clientX":null,"clientY":null});