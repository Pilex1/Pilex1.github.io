class Texture {
    constructor(filename, interpolate=true) {
        this.id = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.id);

        // Because images have to be download over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

        this.image = new Image();
        let image = this.image;
        let id = this.id;
        this.image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, id);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.generateMipmap(gl.TEXTURE_2D);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            if (interpolate === false) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,  gl.NEAREST);
            }


        }
        this.image.src = filename;
    }
}

class FrameBuffer {

}