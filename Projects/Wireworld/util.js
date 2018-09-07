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

