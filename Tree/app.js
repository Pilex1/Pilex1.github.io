/*jshint esversion: 6 */

var gl;
var canvas;

var rand;


class App {
    static init() {
        canvas = document.getElementById("gamecanvas");
        gl = canvas.getContext("webgl");
		
        if (!gl) {
			gl = canvas.getContext("experimental-webgl");
		}
        if (!gl) {
			throw "Unable to initialise Web GL.";
		}

        document.addEventListener("contextmenu", event => event.preventDefault());
        
        rand = new SeededRand(14159);

        CooldownTimer.init();
        Renderer.init();
        GameTime.init();
        Input.init();
        Terrain.init();
        Camera.init();

        Terrain.selection_colour = Colour.Brown;
        
        App.cooldown = new CooldownTimer(0);

        requestAnimationFrame(App.mainLoop);
    }

    static mainLoop() {
        GameTime.update();
        CooldownTimer.updateTimers();

        var mvt_speed = GameTime.deltaTime / 50;
        if (Input.curKeys[37]) {
            Camera.position[0] += mvt_speed;
        }
        if (Input.curKeys[38]) {
            Camera.position[1] -= mvt_speed;
        }
        if (Input.curKeys[39]) {
            Camera.position[0] -= mvt_speed;
        }
        if (Input.curKeys[40]) {
            Camera.position[1] += mvt_speed;
        }

        var intersect = Input.terrainIntersect();
    		if (intersect !== "invalid") {
        	if (Input.curMouse[0]) {
        	  if (App.cooldown.isReady()) {
        	    App.cooldown.cooldown = 1 << 62;
          	  var b = new Branch(3, intersect, Math.PI/2, 5);
          	  b.cur_length = b.branch_length;
  	        	Terrain.branches.push(b);
        	  }
    			} else {
    			  App.cooldown.cooldown = 100;
    			}
		    }

        Input.update();
        Terrain.update();
        Renderer.render();

        requestAnimationFrame(App.mainLoop);
    }
}
