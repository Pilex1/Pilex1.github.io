class Shader {
    constructor(shaderType, shaderSource) {
        this.id = gl.createShader(shaderType);
        gl.shaderSource(this.id, shaderSource);
        gl.compileShader(this.id);

        if (!gl.getShaderParameter(this.id, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(this.id));
            gl.deleteShader(this.id);
            this.id = null;
        }
    }
}

class ShaderProgram {
    constructor(vertexShader, fragmentShader) {
        this.id = gl.createProgram();

        gl.attachShader(this.id, vertexShader.id);
        gl.attachShader(this.id, fragmentShader.id);
        gl.linkProgram(this.id);

        if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.id));
        }
    }

    use() {
        gl.useProgram(this.id);
    }

    setUniform3f(attribute_name, x,y,z) {
        this.use();
        gl.uniform3fv(gl.getUniformLocation(this.id, attribute_name), [x,y,z]);
    }

}