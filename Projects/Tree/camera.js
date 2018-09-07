/*jshint esversion: 6 */

class Camera {
   
   static init() {
      this.position = vec3.fromValues(0, 0, -1 * slider_zoom.value);
      this.rotation = vec3.fromValues(0, 0, 0);
   }
   
   static getViewMatrix() {
      var q = quat.create();
      quat.rotateX(q, q, this.rotation[0]);
      quat.rotateY(q, q, this.rotation[1]);
      quat.rotateZ(q, q, this.rotation[2]);
      
      var viewMatrix = mat4.create();
      mat4.fromRotationTranslationScale(viewMatrix, q, this.position, [1,1,1]);
      
      return viewMatrix;
  }
}