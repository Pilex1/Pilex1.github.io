class GameTime {
   
   static init() {
      this.curTime = performance.now();
      this.deltaTime = 0;
   }
   
   static update() {
      var c = performance.now();
      this.deltaTime = c - GameTime.curTime;
      this.curTime = c;
   }
}

class CooldownTimer {
   
   static init() {
      this.timers = [];
   }
   
   static updateTimers() {
      for (var i = 0; i < CooldownTimer.timers.length; i++) {
         CooldownTimer.timers[i].curTime += GameTime.deltaTime;
      }
   }
   
   constructor(cooldown) {
      this.cooldown = cooldown;
      this.curTime = 0;
      CooldownTimer.timers.push(this);
   }
   
   reset() {
      this.curTime = 0;
   }
   
   isReady() {
      return this.curTime >= this.cooldown;
   }
   
}