class Renderer {
   
   static init() {
      var vertexShaderText =
      [
      "precision mediump float;",
      
      "attribute vec2 vertexPosition;",
      "attribute vec4 vertexColour;",
      "uniform mat4 modelMatrix;",
      "uniform mat4 viewMatrix;",
      "uniform mat4 projectionMatrix;",
      "varying vec4 fragmentColour;",
      "void main() {",
      "	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 0.0, 1.0);",
      "	fragmentColour = vertexColour;",
      "}"
      ].join("\n");
      
      var fragmentShaderText =
      [
      "precision mediump float;",
      "varying vec4 fragmentColour;",
      "void main() {",
      	"gl_FragColor = fragmentColour;",
      "}"
      ].join("\n");
      
      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
   	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
   
   	gl.shaderSource(vertexShader, vertexShaderText);
   	gl.shaderSource(fragmentShader, fragmentShaderText);
   
   	gl.compileShader(vertexShader);
   	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
   		console.error("Error compiling vertex shader", gl.getShaderInfoLog(vertexShader));
   		return;
   	}
   
   	gl.compileShader(fragmentShader);
   	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
   		console.error("Error compiling fragment shader", gl.getShaderInfoLog(fragmentShader));
   		return;
   	}
   
   	this.program = gl.createProgram();
   	gl.attachShader(this.program, vertexShader);
   	gl.attachShader(this.program, fragmentShader);
   	gl.linkProgram(this.program);
   	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
   		console.error("Error linking program", gl.getProgramInfoLog(this.program));
   		return;
   	}
   	gl.validateProgram(this.program);
   	if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
   		console.error("Error validating program", gl.getProgramInfoLog(this.program));
   		return;
   	}
   	
   	gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.frontFace(gl.CCW);
      gl.cullFace(gl.BACK);
      
      this.modelMatrixUniformLocation = gl.getUniformLocation(this.program, "modelMatrix");
      this.viewMatrixUniformLocation = gl.getUniformLocation(this.program, "viewMatrix");
      this.projectionMatrixUniformLocation = gl.getUniformLocation(this.program, "projectionMatrix");
      
      this.entities = [];
      
      this.fov = 0.45;
      this.near = 0.1;
      this.far = 1000;
      
      this.projectionMatrix = mat4.create();
      mat4.perspective(this.projectionMatrix, this.fov, canvas.width/canvas.height, this.near, this.far);
      
      this.viewMatrix = mat4.create();
   }
   
   static render() {
      
      gl.clearColor(0, 0, 0.2, 1);
   	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   	
      gl.useProgram(this.program);
      
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      
      //load view matrix
      mat4.fromTranslation(this.viewMatrix, Camera.position);
      
      gl.uniformMatrix4fv(this.viewMatrixUniformLocation, gl.FALSE, this.viewMatrix);
      gl.uniformMatrix4fv(this.projectionMatrixUniformLocation, gl.FALSE, this.projectionMatrix);
      gl.uniformMatrix4fv(this.modelMatrixUniformLocation, gl.FALSE, Terrain.getModelMatrix());
      
      this.renderInstance = function(model) {
   	   
   	   //vertices
      	gl.enableVertexAttribArray(model.vertexAttribLocation);
      	gl.bindBuffer(gl.ARRAY_BUFFER, model.verticesVBO);
      	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
      	gl.vertexAttribPointer(model.vertexAttribLocation, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
      	
      	//colours
      	gl.enableVertexAttribArray(model.colourAttribLocation);
      	gl.bindBuffer(gl.ARRAY_BUFFER, model.coloursVBO);
      	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colours), gl.STATIC_DRAW);
   	   gl.vertexAttribPointer(model.colourAttribLocation, 4, gl.FLOAT, gl.FALSE, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
   
      	//elements
      	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.elementsVBO);
      	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.elements), gl.STATIC_DRAW);
   
      	//render
      	gl.drawElements(model.drawmode, model.elements.length, gl.UNSIGNED_SHORT, 0);
   
      	//unbind data
      	gl.disableVertexAttribArray(model.vertexAttribLocation);
      	gl.disableVertexAttribArray(model.colourAttribLocation);
      	gl.bindBuffer(gl.ARRAY_BUFFER, null);
      	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      }

      var models = Terrain.generate();

      for (var i = 0; i < models.length; i++) {
         this.renderInstance(models[i]);
      }
      
     gl.useProgram(null);
   }
   
}