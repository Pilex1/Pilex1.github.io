class LogicTest {

	static test(type) {

		var test_cases;
		var update_limit;

		var x;
		var y;

		var found = [];

		var test_specific;

		switch (type) {
			case "diode":

				test_cases = 1000;
				update_limit = 100;

				x = 6;
				y = 6;

				test_specific = function(tiles) {

					var input_x = 0;
					var input_y = 3;
					var output_x = 5;
					var output_y = 3;

					var test_instance = function() {

						var update_cooldown_cache = Terrain.update_cooldown.cooldown;
						var tiles_cache = Terrain.tiles.slice();
						Terrain.update_cooldown.cooldown = 0;

						//returns true if the input is given one electron and the output produces exactly one electron
						var test_forward = function() {

							Terrain.tiles = tiles.slice();
							Terrain.tiles[input_x][input_y] = Tile.Electron_Head;
							Terrain.tiles[output_x][output_y] = Tile.Conductor;

							var passes = 0;
							for (var i = 0; i < update_limit; i++) {
								Terrain.update();
								if (Terrain.tiles[output_x][output_y].id === 1) {
									passes++;
								}
							}
							return passes === 1;
						}

						//returns true if the output is given one electron and the input produces zero electrons
						var test_backward = function() {

							Terrain.tiles = tiles.slice();
							Terrain.tiles[input_x][input_y] = Tile.Conductor;
							Terrain.tiles[output_x][output_y] = Tile.Electron_Head;

							for (var i = 0; i < update_limit; i++) {
								Terrain.update();
								if (Terrain.tiles[input_x][input_y].id === 1) {
									return false;
								}
							}
							return true;
						}

						var valid = test_forward() && test_backward();

						Terrain.update_cooldown.cooldown = update_cooldown_cache;
						Terrain.tiles = tiles_cache;

						return valid;
					}
					
					return test_instance();
				}
				break;
			case "and":

				test_cases = 20000;
				update_limit = 100;

				x = 11;
				y = 11;

				test_specific = function(tiles) {

					var input1_x = 0;
					var input1_y = (y-1)/2-2;
					var input2_x = 0;
					var input2_y = (y-1)/2+2;

					var output_x = x-1;
					var output_y = (y-1)/2;

					var test_instance = function() {

						var update_cooldown_cache = Terrain.update_cooldown.cooldown;
						var tiles_cache = Terrain.tiles.slice();
						Terrain.update_cooldown.cooldown = 0;

						var test_0_0 = function() {
							return true;
						}

						var test_1_0 = function() {

							Terrain.tiles = tiles.slice();
							Terrain.tiles[input1_x][input1_y] = Tile.Electron_Head;
							Terrain.tiles[input2_x][input2_y] = Tile.Empty;
							Terrain.tiles[output_x][output_y] = Tile.Conductor;

							for (var i = 0; i < update_limit; i++) {
								Terrain.update();
								if (Terrain.tiles[output_x][output_y].id === 1) {
									return false;
								}
							}

							if (Terrain.search(Tile.Electron_Head)) return false;
							return true;
						}

						var test_0_1 = function() {

							Terrain.tiles = tiles.slice();
							Terrain.tiles[input1_x][input1_y] = Tile.Empty;
							Terrain.tiles[input2_x][input2_y] = Tile.Electron_Head;
							Terrain.tiles[output_x][output_y] = Tile.Conductor;

							for (var i = 0; i < update_limit; i++) {
								Terrain.update();
								if (Terrain.tiles[output_x][output_y].id === 1) {
									return false;
								}
							}

							if (Terrain.search(Tile.Electron_Head)) return false;
							return true;
						}

						var test_1_1 = function() {

							Terrain.tiles = tiles.slice();
							Terrain.tiles[input1_x][input1_y] = Tile.Electron_Head;
							Terrain.tiles[input2_x][input2_y] = Tile.Electron_Head;
							Terrain.tiles[output_x][output_y] = Tile.Conductor;

							var passes = 0;

							for (var i = 0; i < update_limit; i++) {
								Terrain.update();
								if (Terrain.tiles[output_x][output_y].id === 1) {
									passes++;
								}
							}

							if (Terrain.search(Tile.Electron_Head)) return false;
							return passes === 1;
						}

						var valid = test_0_0() && test_1_0() && test_0_1() && test_1_1();

						Terrain.update_cooldown.cooldown = update_cooldown_cache;
						Terrain.tiles = tiles_cache;

						return valid;
					}
					
					return test_instance();
				}
				break;
		}

		for (var i = 0; i < test_cases; i++) {
			var t = LogicTest.gen_randomconfiguration(x, y);
			if (test_specific(t)) {
				found.push(t);
			}
		}

		var found_json = [];
		for (var i = 0; i < found.length; i++) {
			var f = found[i];
			var tiles_cache = Terrain.tiles;
			Terrain.tiles = f;
			found_json.push(Terrain.toJSON());
			Terrain.tiles = tiles_cache;
		}
		return found_json;
	}

	static gen_randomconfiguration(x, y) {
		var a = [];
		for (var i = 0; i < x; i++) {
			var b = [];
			for (var j = 0; j < y; j++) {
				b.push(Tile.Empty);
			}
			a.push(b);
		}

		//randomly filled with a 1 wide empty border for inputs/outputs
		for (var i = 1; i < a.length-1; i++) {
			for (var j = 1; j < a[0].length-1; j++) {
				a[i][j] = Util.randBool() ? Tile.Conductor : Tile.Empty;
			}
		}
		return a;
	}


}