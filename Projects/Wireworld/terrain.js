
class Colour {
   constructor(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this. a = a;
   }

   clone() {
      return new Colour(this.r, this.g, this.b, this.a);
   }
   
   static equals(c1, c2) {
      return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && c1.a === c2.a;
   }
}

Colour.Black = new Colour(0, 0, 0, 1);
Colour.White = new Colour(1, 1, 1, 1);
Colour.Gray = new Colour(0.5, 0.5, 0.5, 1);

Colour.Red = new Colour(1, 0, 0, 1);
Colour.Green = new Colour(0, 1, 0, 1);
Colour.Blue = new Colour(0, 0, 1, 1);

Colour.Yellow = new Colour(1, 1, 0, 1);
Colour.Magenta = new Colour(1, 0, 1, 1);
Colour.Cyan = new Colour(0, 1, 1, 1);

Colour.Orange = new Colour(1, 0.5, 0, 1);

class Tile {
   constructor(colour, id) {
      this.colour = colour;
      this.id = id;
   }

   clone() {
    return new Tile(this.colour, this.id);
   }
}

Tile.Empty = new Tile(new Colour(0.2, 0.2, 0.2, 1), 0);
Tile.Electron_Head = new Tile(Colour.Blue, 1);
Tile.Electron_Tail = new Tile(Colour.Red, 2);
Tile.Conductor = new Tile(Colour.Yellow, 3);
Tile.Initialiser = new Tile(Colour.Green, 4);
Tile.Toggle_Conductor = new Tile(Colour.Orange, 5);

class Terrain {

  static init() {
    this.update_cooldown = new CooldownTimer(100);
    this.activate_initialisers = false;
    this.activate_toggleConductors = false;
  }

  static cleanWorlds() {
    var names = Object.getOwnPropertyNames(localStorage);
    for (var i = 0; i < names.length; i++) {
      var t = this.fromJSON(localStorage.names[i]);
      if (!t) this.delete(names[i]);
    }
  }

  static fromJSON(json) {
    try {
      var a = JSON.parse(json);
    } catch (e) {
      console.error(e);
      return null;
    }
    
    var t = [];
    for (var i = 0; i < a.length; i++) {
      var t_1 = [];
      t_1.length = a[0].length;
      t.push(t_1);
    }

    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < a[0].length; j++) {
        switch (a[i][j]) {
          case 0:
            t[i][j] = Tile.Empty;
            break;
          case 1:
            t[i][j] = Tile.Electron_Head;
            break;
          case 2:
            t[i][j] = Tile.Electron_Tail;
            break;
          case 3:
            t[i][j] = Tile.Conductor;
            break;
          case 4:
            t[i][j] = Tile.Initialiser;
            break;
          case 5:
            t[i][j] = Tile.Toggle_Conductor;
            break;
        }
      }
    }
    return t;
  }

  static loadJSON(json) {
    var t;
    try {
      t = this.fromJSON(json);
    } catch (e) {
      console.error(e);
      return;
    }
    this.tiles = t;
    Camera.init();
  }
   
   static load(filename) {
    console.log("Loading terrain: " + filename);
    this.loadJSON(localStorage.getItem(filename));
   }

   static new(x, y) {
     console.log("New terrain: "+x+" x "+y);
     this.tiles = [];
     for (var i = 0; i < x; i++) {
         var a = [];
         for (var j = 0; j < y; j++) {
             a.push(Tile.Empty);
         }
         this.tiles.push(a);
     }
     
     for (var i = 0; i < this.tiles.length; i++) {
        for (var j = 0; j < this.tiles[i].length; j++) {
           this.tiles[i][j] = Tile.Empty;
        }
     }

     Camera.init();
   }

   static toJSON(tiles) {
    var a = [];
    for (var i = 0; i < tiles.length; i++) {
      var b = [];
      b.length = tiles[0].length;
      a.push(b);
    }

    for (var i = 0; i < tiles.length; i++) {
      for (var j = 0; j < tiles[0].length; j++) {
        a[i][j] = tiles[i][j].id;
      }
    }
    return JSON.stringify(a);
   }

   static save(filename) {
      console.log("Saving terrain: " + filename);
      try {
        localStorage.setItem(filename, this.toJSON(this.tiles));
      } catch (e) {
        console.error(e);
      }
   }

   static delete(filename) {
    console.log("Deleting terrain: " + filename);
    try {
      localStorage.removeItem(filename);
    } catch (e) {
      console.log(e);
    }
   }
   
   static update() {
       
       if (!this.update_cooldown.isReady()) return;
       this.update_cooldown.reset();
       
       var tiles_copy = [];
       for (var i = 0; i < this.tiles.length; i++) {
           var a = [];
           for (var j = 0; j < this.tiles[i].length; j++) {
               a.push(Tile.Empty);
           }
           tiles_copy.push(a);
       }

       for (var i = 0; i < this.tiles.length; i++) {
           for (var j = 0; j < this.tiles[i].length; j++) {
               switch (this.tiles[i][j].id) {
                   case 0:
                     tiles_copy[i][j] = Tile.Empty;
                     break;
                  case 1:
                    if (this.tiles[i][j].toggle_conductor) {
                      var t = Tile.Electron_Tail.clone();
                      t.toggle_conductor = true;
                      tiles_copy[i][j] = t;
                    } else {
                     tiles_copy[i][j] = Tile.Electron_Tail;
                    }
                    break;
                   case 2:
                     if (this.tiles[i][j].toggle_conductor) {
                        tiles_copy[i][j] = Tile.Toggle_Conductor;
                      } else {
                       tiles_copy[i][j] = Tile.Conductor;
                      }
                     break;
                   case 3:
                       var n = this.count_moore(i, j, 1);
                       var m = this.activate_initialisers ? this.count_moore(i, j, 4) : 0;
                       if (n === 1 || n === 2 || m > 0) {
                           tiles_copy[i][j] = Tile.Electron_Head;
                       } else {
                           tiles_copy[i][j] = Tile.Conductor;
                       }
                       break;
                    case 4:
                      tiles_copy[i][j] = Tile.Initialiser;
                      break;
                    case 5:
                      if (this.activate_toggleConductors) {
                        var n = this.count_moore(i, j, 1);
                         var m = this.activate_initialisers ? this.count_moore(i, j, 4) : 0;
                         if (n === 1 || n === 2 || m > 0) {
                            var t = Tile.Electron_Head.clone();
                            t.toggle_conductor = true;
                             tiles_copy[i][j] = t;
                         } else {
                             tiles_copy[i][j] = Tile.Toggle_Conductor;
                         }
                      } else {
                        tiles_copy[i][j] = Tile.Toggle_Conductor;
                      }
                      break;
               }
           }
       }

       if (this.activate_initialisers) {
        this.activate_initialisers = false;
       }
       
       this.tiles = tiles_copy;
   }
   
   static count_moore(x, y, state) {
       var count = 0;
       count += this.tileAt(x-1, y-1).id === state ? 1 : 0;
       count += this.tileAt(x, y-1).id === state ? 1 : 0;
       count += this.tileAt(x+1, y-1).id === state ? 1 : 0;
       count += this.tileAt(x-1, y).id === state ? 1 : 0;
       count += this.tileAt(x+1, y).id === state ? 1 : 0;
       count += this.tileAt(x-1, y+1).id === state ? 1 : 0;
       count += this.tileAt(x, y+1).id === state ? 1 : 0;
       count += this.tileAt(x+1, y+1).id === state ? 1 : 0;
       return count;
   }

   static stabilise() {
    for (var i = 0; i < this.tiles.length; i++) {
      for (var j = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j].id === 1 || this.tiles[i][j].id === 2) {
          this.tiles[i][j] = this.tiles[i][j].toggle_conductor ? Tile.Toggle_Conductor : Tile.Conductor;
        }
      }
    }
   }

   static search(tile) {
    for (var i = 0; i < this.tiles.length; i++) {
      for (var j = 0; j < this.tiles[i].length; j++) {
        if (this.tiles[i][j].id === tile.id) {
          return true;
        }
      }
    }
    return false;
   }

   static setSelection(x1, y1, x2, y2, colour) {
    this.selection_x1 = x1;
    this.selection_x2 = x2;
    this.selection_y1 = y1;
    this.selection_y2 = y2;
    this.selection_colour = colour;
    this.selection_colour.a = 0.4;
   }
   
   static setTile(x, y, tile) {
      if (x < 0 || x >= this.tiles.length || y < 0 || y >= this.tiles[x].length) return;
      this.tiles[x][y] = tile;
   }
   
   static tileAt(x, y) {
      if (x < 0 || x >= this.tiles.length || y < 0 || y >= this.tiles[x].length) return "invalid";
      return this.tiles[x][y];
   }

   static copySelection() {
    if (!this.selection_x1) return;
    this.selection_copy = [];
    for (var i = Math.max(Math.min(this.selection_x1, this.selection_x2), 0); i <= Math.min(Math.max(this.selection_x1, this.selection_x2), this.tiles.length); i++) {
      var b = [];
      for (var j = Math.max(Math.min(this.selection_y1, this.selection_y2), 0); j <= Math.min(Math.max(this.selection_y1, this.selection_y2), this.tiles[0].length); j++) {
        b.push(this.tiles[i][j]);
      }
      this.selection_copy.push(b);
    }
   }

   static cutSelection() {
    this.copySelection();
    this.deleteSelection();
   }

   static deleteSelection() {
    for (var i = Math.min(this.selection_x1, this.selection_x2); i <= Math.max(this.selection_x1, this.selection_x2); i++) {
      for (var j = Math.min(this.selection_y1, this.selection_y2); j <= Math.max(this.selection_y1, this.selection_y2); j++) {
        this.setTile(i, j, Tile.Empty);
      }
    }
   }

   static placeSelection(x, y) {
    for (var i = 0; i < this.selection_copy.length; i++) {
      for (var j = 0; j < this.selection_copy[0].length; j++) {
        if (this.selection_copy[i][j].id === 0) continue;
        this.setTile(x+i, y+j, this.selection_copy[i][j]);
      }
    }
    this.removeSelection();
   }

   static removeSelection() {
    this.selection_copy = null;
   }
   
   static generate() {
     
      var vertices = [];
      var colours = [];
      var elements = [];

      var models = [];
      
      var ptr = 0;
        
      var addData = function(i, j, colour) {

        if (colours.length + 16 >= 131072) {
          models.push(new Model(vertices, elements, colours, gl.TRIANGLES));
          vertices = [];
          colours = [];
          elements = [];
          ptr = 0;
        }

         //vertices
         vertices.push(i);
         vertices.push(j + 1);
         
         vertices.push(i);
         vertices.push(j);
         
         vertices.push(i + 1);
         vertices.push(j);
         
         vertices.push(i + 1);
         vertices.push(j + 1);
         
         for (var k = 0; k < 4; k++) {
            colours.push(colour.r);
            colours.push(colour.g);
            colours.push(colour.b);
            colours.push(colour.a);
         }
         
         //elemnts
         elements.push(ptr + 0);
         elements.push(ptr + 1);
         elements.push(ptr + 2);
         elements.push(ptr + 2);
         elements.push(ptr + 3);
         elements.push(ptr + 0);
         
         ptr += 4;
      }
      
      for (var i = 0; i < this.tiles.length; i++) {
         for (var j = 0; j < this.tiles[i].length; j++) {
            var colour = this.tiles[i][j].colour;
            if (this.activate_toggleConductors && this.tiles[i][j].id === 5) {
              colour = Tile.Conductor.colour;
            }
            addData(i, j, colour);
         }
      }
      
      if (this.selection_copy) {
        for (var i = 0; i < this.selection_copy.length; i++) {
          for (var j = 0; j < this.selection_copy[0].length; j++) {
            var x = i + this.selection_x1;
            var y = j + this.selection_y1;
            if (x < 0 || x >= this.tiles.length || y < 0 || y >= this.tiles[0].length) continue;
            var colour_copy = this.selection_copy[i][j].colour.clone();
            colour_copy.a = 0.4;
            addData(x, y, colour_copy);
          }
        }
      } else {
        for (var i = Math.min(this.selection_x1, this.selection_x2); i <= Math.max(this.selection_x1, this.selection_x2); i++) {
          for (var j = Math.min(this.selection_y1, this.selection_y2); j <= Math.max(this.selection_y1, this.selection_y2); j++) {
            if (i < 0 || i >= this.tiles.length || j < 0 || j >= this.tiles[0].length) continue;
            addData(i, j, this.selection_colour);
          }
        }
      }

      if (vertices.length > 0) {
        models.push(new Model(vertices, elements, colours, gl.TRIANGLES));
      }

      return models;
   }
   
   static getModelMatrix() {
       var m = mat4.create();
       mat4.fromRotationTranslationScale(m, quat.create(), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1));
       return m;
   }
}

