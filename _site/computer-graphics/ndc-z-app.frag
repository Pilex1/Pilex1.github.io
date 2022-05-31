precision lowp float;

varying lowp vec3 clipVertexPos;
uniform vec3 color;

void main() {
    //gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0);

    // float r = (clipVertexPos.x + 1.0) / 2.0;
    // float g = (clipVertexPos.y + 1.0) / 2.0;
    // float b = (clipVertexPos.z + 1.0) / 2.0;

    float r = 0.0;
    float g = 1.0;
    float b = 0.5;

    // gl_FragColor = vec4(1.0, 0.5, 0.2, 0.3);
    gl_FragColor = vec4(color.xyz, 1);
}