class Input {
   
   static init() {
      document.onkeydown = Input.onKeyDown;
      document.onkeyup = Input.onKeyUp;
      
      document.onmousedown = Input.onMouseDown;
      document.onmouseup = Input.onMouseUp;
      document.onmousemove = Input.onMouseMove;

      document.onwheel = Input.onWheel;
      
      Input.curKeys = [];
      Input.curMouse = [];
      
      Input.mousedx = 0;
      Input.mousedy = 0;
      Input.mousex = 0;
      Input.mousey = 0;

      Input.mousewheeldx = 0;
   }

   static update() {
   	Input.mousewheeldx = 0;
   }

   static onWheel(event) {
   	Input.mousewheeldx = event.deltaY;
   }
   
   static onKeyDown(event) {
      if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
          event.preventDefault();
      }
      Input.curKeys[String.fromCharCode(event.keyCode).toLowerCase()] = true;
      Input.curKeys[event.keyCode] = true;
   }
   
   static onKeyUp(event) {
      Input.curKeys[String.fromCharCode(event.keyCode).toLowerCase()] = false;
      Input.curKeys[event.keyCode] = false;
   }

   static onMouseDown(event) {
      Input.curMouse[event.button] = true;
   }
   static onMouseUp(event) {
      Input.curMouse[event.button] = false;
   }
   static onMouseMove(event) {
      Input.mousedx = event.clientX - Input.mousex;
      Input.mousedy = event.clientY - Input.mousey;
      Input.mousex = event.clientX;
      Input.mousey = event.clientY;
   }
   
   static mouse_ndc() {
      var b = gamecanvas.getBoundingClientRect();
      if (Input.mousex < b.left || Input.mousex > b.right || Input.mousey < b.top - 5 || Input.mousey > b.bottom) {
         return;
      }
      var x = -1 + (2 * (Input.mousex - gamecanvas.getBoundingClientRect().left)) / canvas.width;
      var y = 1 - (2 * (Input.mousey - gamecanvas.getBoundingClientRect().top - 5)) / canvas.height;
      return vec2.fromValues(x, y);
   }
   
   static raycast() {
      var ndc = Input.mouse_ndc();
      if (!ndc) return;
      var clip = vec4.fromValues(ndc[0], ndc[1], -1, 1);
      var inverseProjection = mat4.create();
      mat4.invert(inverseProjection, Renderer.projectionMatrix);
      var eyeCoords = mat4.create();
      mat4.multiply(eyeCoords, inverseProjection, clip);
      eyeCoords[2] = -1;
      eyeCoords[3] = 0;
      var inverseView = mat4.create();
      mat4.invert(inverseView, Renderer.viewMatrix);
      var ray = mat4.create();
      mat4.multiply(ray, inverseView, eyeCoords);
      return vec2.fromValues(ray[0], ray[1]);
   }
   
   static terrainIntersect() {
      var ray = Input.raycast();
      if (!ray) return;
      var intersect = vec2.fromValues(Camera.position[0], Camera.position[1]);
      intersect[0] += ray[0] * Camera.position[2];
      intersect[1] += ray[1] * Camera.position[2];
      intersect[0] *= -1;
      intersect[1] *= -1;
      return vec2.fromValues(Math.floor(intersect[0]), Math.floor(intersect[1] - 0.5));
   }
}