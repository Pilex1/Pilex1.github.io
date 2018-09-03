/*jshint esversion: 6 */

class Util {
   static rand(min, max) {
      return Math.random() * (max - min) + min;
   }
   static randInt(min, max) {
      return Math.floor(rand(min, max + 1));
   }
   static randBool() {
      return Math.random() < 0.5;
   }
   static randvec2(min, max) {
      var theta = Util.rand(0, 2 * Math.PI);
      var x = Math.cos(theta);
      var y = Math.sin(theta);
      x = x * (max - min) + min;
      y = y * (max - min) + min;
      return vec2.fromValues(x, y);
   }
}

class SeededRand {
  constructor(seed) {
    this.seed = seed;
  }
  rand() {
    var x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  randFloat(min, max) {
      return this.rand() * (max - min) + min;
   }
  randInt(min, max) {
      return Math.floor(this.randFloat(min, max + 1));
   }
  randBool() {
      return this.rand() < 0.5;
   }
}

class Colour {
   constructor(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
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

Colour.Brown = new Colour(0.5, 0.25, 0, 1);
