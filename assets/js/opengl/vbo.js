class Vbo {
    constructor(data) {
        this.data = data;
        this.id = gl.createBuffer();
        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        this.unbind();
    }
    updateData(data) {
        if (data.length !== this.data.length) throw Error();
        this.bind();
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(data));
        this.data = data;
        this.unbind();
    }
    bind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    }
    unbind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}