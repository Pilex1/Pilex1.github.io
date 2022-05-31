class Ebo {
    constructor(data) {
        this.id = gl.createBuffer();
        this.data = data;

        this.bind();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int32Array(this.data), gl.STATIC_DRAW);
        this.unbind();
    }
    updateData(data) {
        if (data.length !== this.data.length) throw Error();
        this.bind();
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Int32Array(data));
        this.data = data;
        this.unbind();
    }
    bind() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
    }
    unbind() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    getLength() {
        return this.data.length;
    }
}