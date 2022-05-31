attribute vec3 vertexPos;

uniform vec3 pos;

void main() {
    gl_Position = vec4(vertexPos + pos, 1.0);
}