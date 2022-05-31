class Vao {
    constructor() {
        this.id = gl.createVertexArray();
    }
    bind() {
        gl.bindVertexArray(this.id);
    }
    unbind() {
        gl.bindVertexArray(null);
    }
}