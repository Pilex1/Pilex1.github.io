var gl;
var canvas;

class App {
    static init() {
        canvas = document.getElementById("gamecanvas");
        gl = canvas.getContext("webgl");
        if (!gl) gl = canvas.getContext("experimental-webgl");
        if (!gl) throw "Unable to initialise Web GL.";

        document.addEventListener("contextmenu", event => event.preventDefault());


        CooldownTimer.init();
        Renderer.init();
        GameTime.init();
        Input.init();
        Terrain.init();
        Terrain.new(150, 150);
        Camera.init();

        App.state = 0;
        App.selection_pressed = "none";
        Terrain.selection_colour = Colour.Black;


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

        if (Input.curKeys["1"]) {
            App.state = 0;
        }
        if (Input.curKeys["2"]) {
            App.state = 1;
        }
        if (Input.curKeys["3"]) {
            App.state = 2;
        }
        if (Input.curKeys["4"]) {
        	App.state = 3;
        }
        if (Input.curKeys["5"]) {
        	App.state = 4;
        }

        if (Input.mousewheeldx < 0) {
            App.state--;
            if (App.state < 0) App.state += 5;
        }
        if (Input.mousewheeldx > 0) {
            App.state++;
            if (App.state >= 5) App.state -= 5;
        }

        var intersect = Input.terrainIntersect();
        if (!intersect) intersect = "invalid";

    	switch (App.selection_pressed) {
    		case "multi":
    			if (Input.curMouse[0]) {
    				App.selection_pressed = "multi_down";
    			}
    			if (intersect === "invalid") break;
    			Terrain.setSelection(intersect[0], intersect[1], intersect[0], intersect[1], new Colour(0, 0.2, 0.4, 1));
    			break;
    		case "multi_down":
    			if (intersect === "invalid") break;
    			Terrain.setSelection(Terrain.selection_x1, Terrain.selection_y1, intersect[0], intersect[1], Terrain.selection_colour);
    			if (!Input.curMouse[0]) {
    				App.selection_pressed = "multi_confirmed";
    			}
    			break;
    		case "multi_confirmed":
    			if (intersect === "invalid") break;
    			Terrain.setSelection(Terrain.selection_x1, Terrain.selection_y1, Terrain.selection_x2, Terrain.selection_y2, new Colour(0.5, 0.5, 0.5, 1));
    			document.getElementById("btn_copy").disabled = false;
    			document.getElementById("btn_move").disabled = false;
    			document.getElementById("btn_delete").disabled = false;
                document.getElementById("btn_exportSelection").disabled = false;
    			if (Input.curMouse[0]) {
    				App.selection_pressed = "copied";
    				Terrain.removeSelection();
    			}
    			break;
    		case "copy":
    			if (intersect === "invalid") break;
    			Terrain.setSelection(intersect[0], intersect[1], intersect[0], intersect[1], new Colour(0, 0, 0, 0));
    			if (Input.curMouse[0]) {
    				Terrain.placeSelection(intersect[0], intersect[1]);
    				App.selection_pressed = "copied";
    			}
    			break;
    		case "copied":
    			document.getElementById("btn_copy").disabled = true;
    			document.getElementById("btn_move").disabled = true;
    			document.getElementById("btn_delete").disabled = true;
                document.getElementById("btn_exportSelection").disabled = true;
    			if (!Input.curMouse[0]) {
    				App.selection_pressed = "none";
    			}
    			break;
    		case "move":
    			if (intersect === "invalid") break;
    			Terrain.setSelection(intersect[0], intersect[1], intersect[0], intersect[1], new Colour(0, 0, 0, 0));
    			if (Input.curMouse[0]) {
    				Terrain.placeSelection(intersect[0], intersect[1]);
    				App.selection_pressed = "copied";
    			}
    			break;
			case "delete":
				document.getElementById("btn_copy").disabled = true;
    			document.getElementById("btn_move").disabled = true;
    			document.getElementById("btn_delete").disabled = true;
                document.getElementById("btn_exportSelection").disabled = true;
    			App.selection_pressed = "none";
    			Terrain.setSelection(null, null, null, null, new Colour(0, 0, 0, 0));
                Terrain.removeSelection();
				break;
    		case "none":
    			if (intersect === "invalid") break;
        		switch (App.state) {
		            case 0:
		                Terrain.setSelection(intersect[0], intersect[1], intersect[0], intersect[1], Tile.Conductor.colour.clone());
		                break;
		            case 1:
		                Terrain.setSelection(intersect[0], intersect[1], intersect[0], intersect[1], Tile.Electron_Head.colour.clone());
		                break;
		            case 2:
		                Terrain.setSelection(intersect[0], intersect[1], intersect[0], intersect[1], Tile.Initialiser.colour.clone());
		                break;
		            case 3:
		            	Terrain.setSelection(intersect[0], intersect[1], intersect[0], intersect[1], Tile.Toggle_Conductor.colour.clone());
		            	break;
		        	case 4:
		        		Terrain.setSelection(intersect[0], intersect[1], intersect[0], intersect[1], Tile.Empty.colour.clone());
		        		break;
		        }

		        if (Input.curMouse[2]) {
		            Terrain.setTile(intersect[0], intersect[1], Tile.Empty);
		        }

		        if (Input.curMouse[0]) {
	        		switch (App.state) {
	        		    case 0:
	        		        Terrain.setTile(intersect[0], intersect[1], Tile.Conductor);
	        		        break;
	        		    case 1:
	        		        Terrain.setTile(intersect[0], intersect[1], Tile.Electron_Head);
	        		        break;
	        		    case 2:
	        		        Terrain.setTile(intersect[0], intersect[1], Tile.Initialiser);
	        		        break;
	        		    case 3:
	        		    	Terrain.setTile(intersect[0], intersect[1], Tile.Toggle_Conductor);
	        		    	break;
	        		    case 4:
	        		    	Terrain.setTile(intersect[0], intersect[1], Tile.Empty);
	        		    	break;
	        		} 
	            }
	        	break;
	    }        			
        		
    	
        
        

        Input.update();
        Terrain.update();
        Renderer.render();

        requestAnimationFrame(App.mainLoop);
    }

    static cleanUp() {
        Serialization.saveTerrain();
    }
}
