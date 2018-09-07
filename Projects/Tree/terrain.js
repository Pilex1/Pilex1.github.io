/*jshint esversion: 6 */

class Branch {
   constructor(offspring_branches, position, rotation, branch_length) {
      this.offspring_branches = offspring_branches;
      this.branch_length = branch_length;
      this.position = position;
      this.rotation = rotation;
      
      this.cur_length = 0;
      this.growing = true;
      
      this.id = "branch";
      this.colour = Colour.Brown;
   }
}

class Leaf {
  constructor(position, rotation, branch_length) {
    
    this.branch_length = branch_length;
    this.position = position;
    this.rotation = rotation;
    
    this.id = "leaf";
    this.colour = Colour.Green;
  }
}

class Terrain {

  static init() {
    this.update_cooldown = new CooldownTimer(200);
    this.branches = [];
    this.leaves = [];
    
    this.rot_min = -Math.PI / 16;
    this.rot_max = Math.PI / 16;
    this.length_min = 0.75;
    this.length_max = 1;
    this.offspring_min = 0.5;
    this.offspring_max = 1;
    this.branch_min = 0.5;
    this.branch_max = 1;
  }
   
  static update() {
       
    if (!this.update_cooldown.isReady()) return;
    this.update_cooldown.reset();
       
    for (var i = 0; i < this.branches.length; i++) {
      var b = this.branches[i];
      if (!b.growing) continue;
      if (b.cur_length >= b.branch_length) {
        b.growing = false;
        for (var j = 0; j < b.offspring_branches; j++) {
          var offspring_branches = b.offspring_branches * rand.randFloat(this.offspring_min, this.offspring_max);
          var position = vec2.fromValues(b.position[0] + b.branch_length * Math.cos(b.rotation), b.position[1] + b.branch_length * Math.sin(b.rotation));
          console.log(b.position);
          var rotation = b.rotation + rand.randFloat(this.rot_min, this.rot_max);
          var branch_length = b.branch_length * rand.randFloat(this.branch_min, this.branch_max);
          
          if (offspring_branches < 1 && branch_length < 1) {
            this.leaves.push(new Leaf(position, rotation, branch_length));
          } else {
            this.branches.push(new Branch(offspring_branches, position, rotation, branch_length));
          }
        }
      } else {
        b.cur_length++;
      }
      
    }
       
   }

   
  static generate() {
     
      var vertices = [];
      var colours = [];
      var elements = [];

      var models = [];
      
      var ptr = 0;
        
      var addData = function(pos, rot, length, colour) {

        if (colours.length + 16 >= 131072) {
          models.push(new Model(vertices, elements, colours, gl.LINES));
          vertices = [];
          colours = [];
          elements = [];
          ptr = 0;
        }

         //vertices
         vertices.push(pos[0]);
         vertices.push(pos[1]);
         
         vertices.push(pos[0] + Math.cos(rot) * length);
         vertices.push(pos[1] + Math.sin(rot) * length);
         
         for (var k = 0; k < 4; k++) {
            colours.push(colour.r);
            colours.push(colour.g);
            colours.push(colour.b);
            colours.push(colour.a);
         }
         
         //elemnts
         elements.push(ptr + 0);
         elements.push(ptr + 1);
         
         ptr += 2;
      }
      
      
      
      for (var i = 0; i < this.branches.length; i++) {
        if (i > 10000) break;
        var b = this.branches[i];
        addData(b.position, b.rotation, b.cur_length, b.colour);
      }
      
      for (var i = 0; i < this.leaves.length; i++) {
        if (i > 10000) break;
        var l = this.leaves[i];
        addData(l.position, l.rotation, l.cur_length, l.colour);
      }
  
      if (vertices.length > 0) {
        models.push(new Model(vertices, elements, colours, gl.LINES));
      }

      return models;
   }
  static getModelMatrix() {
       var m = mat4.create();
       mat4.fromRotationTranslationScale(m, quat.create(), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1));
       return m;
   }
}

