let canvas = document.getElementById("canvas-z");
let factor = canvas.clientWidth / canvas.width;
canvas.width *= factor;
canvas.height = canvas.width;

let gl = canvas.getContext("webgl2");
if (!gl) {
    alert("webgl2 not supported");
}

$("#rangeZ1").on("input", ()=>{
    z1 = parseFloat($("#rangeZ1").val());
    $("#labelZ1").html("<svg width=\"20px\" height=\"20px\"><rect width=\"20px\" height=\"20px\" fill=\"rgb(0,255,128)\"/></svg> NDC: z = " + z1.toFixed(2));
});

$("#rangeZ2").on("input", ()=>{
    z2 = parseFloat($("#rangeZ2").val());
    $("#labelZ2").html("<svg width=\"20px\" height=\"20px\"><rect width=\"20px\" height=\"20px\" fill=\"rgb(255,128,0)\"/></svg> NDC: z = " + z2.toFixed(2));
});

$("#rangeZ1").trigger("input");
$("#rangeZ2").trigger("input");

$.get("/computer-graphics/ndc-z-app.frag", (fragmentSource) => {
    $.get("/computer-graphics/ndc-z-app.vert", (vertexSource) => {
        let shader = new ShaderProgram(new Shader(gl.VERTEX_SHADER, vertexSource), new Shader(gl.FRAGMENT_SHADER, fragmentSource));
        let sq = square_z(0,0,0.5,0);
        let vbo = new Vbo(sq.vertices);
        let ebo = new Ebo(sq.elements);
        let vao = new Vao();

        vao.bind();
        vbo.bind();
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);
        gl.enableVertexAttribArray(0);
        vbo.unbind();
        ebo.bind();
        vao.unbind();
        ebo.unbind();

        gl.enable(gl.DEPTH_TEST);
        let mainLoop = function () {
            gl.clearColor(1,1,1, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            shader.use();
            shader.setUniform3f("pos", 0, 0, z1);
            shader.setUniform3f("color", 0, 1, 0.5);
            vao.bind();
            gl.drawElements(gl.TRIANGLES, ebo.getLength(), gl.UNSIGNED_INT, 0);

            shader.setUniform3f("pos", 0.2, 0.2, z2);
            shader.setUniform3f("color", 1, 0.5,0);
            gl.drawElements(gl.TRIANGLES, ebo.getLength(), gl.UNSIGNED_INT, 0);
            
            requestAnimationFrame(mainLoop);
        };
        requestAnimationFrame(mainLoop);
    })
})
