class Model {
   constructor(vertices, elements, colours, drawmode) {
      //vertices
     	this.verticesVBO = gl.createBuffer();
   	this.vertexAttribLocation = gl.getAttribLocation(Renderer.program, "vertexPosition");
   	this.vertices = vertices;
   
   	//elements
   	this.elementsVBO = gl.createBuffer();
   	this.elements = elements;
   
   	//colours
   	this.coloursVBO = gl.createBuffer();
   	this.colourAttribLocation = gl.getAttribLocation(Renderer.program, "vertexColour");
      this.colours = colours;
      
      this.drawmode = drawmode;
   }
}