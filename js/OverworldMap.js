function OverworldMap(state, x, y, scaling){
	PIXI.Sprite.call(this, textureManager.getTexture("overworldMap"));
	stage.addChild(this);

	this.gameState = state;
	this.x = x;
	this.y = y;
	this.scale = new PIXI.Point(scaling, scaling);

	// Create squares for map
	this.squares = [];
	for(let x = 0; x < 22; x++){
		let col = [];
		for(let y = 0; y < 15; y++){
			col.push(new MapSquare(state, 64 * (x + 1), 64 * (y + 1), 64, 64, x, y));
		}
		this.squares.push(col);
	}

	// Get info about each square
	let selfRef = this;
	$.getJSON("res/isWater.json", function(data){
		for(let x = 0; x < selfRef.squares.length; x++){
			for(let y = 0; y < selfRef.squares[0].length; y++){
				if (data.isWater[x][y]){
					selfRef.squares[x][y].isWater = true;
					selfRef.squares[x][y].rotateHue = 260;
				}
			}
		}
	});
}

OverworldMap.constructor = OverworldMap;
OverworldMap.prototype = Object.create(PIXI.Sprite.prototype);

OverworldMap.prototype.tick = function(delta){
	for(let x = 0; x < this.squares.length; x++){
		for(let y = 0; y < this.squares[0].length; y++){
			this.squares[x][y].tick(delta);
		}
	}
}

OverworldMap.prototype.activateSelection = function(){
	for(let x = 0; x < this.squares.length; x++){
		for(let y = 0; y < this.squares[0].length; y++){
			this.squares[x][y].activate();
		}
	}
}

OverworldMap.prototype.deactivateSelection = function(){
	for(let x = 0; x < this.squares.length; x++){
		for(let y = 0; y < this.squares[0].length; y++){
			this.squares[x][y].deactivate();
		}
	}
}