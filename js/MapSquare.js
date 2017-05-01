function MapSquare(state, x, y, width, height, locX, locY){
	let texture = this.createMapSquareSprite(width, height);
	PIXI.Sprite.call(this, texture);
	stage.addChild(this);

	this.gameState = state;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.alpha = 0.00;

	this.tower = null;		// Holds ref to tower on the tile
	this.isOccupied = false;

	this.isWater = false;
	this.rotateHue = 0;

	this.filters = [new PIXI.filters.ColorMatrixFilter()];

	this.buttonMode = true;
	this.interactive = false;
	this.createInteraction();

	// NOTE: DEBUGGING PURPOSES
	this.text = new PIXI.Text("(" + locX + ", " + locY + ")", {
        font: "bold 20px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 10, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.text.visible = false;
    this.addChild(this.text);
}

MapSquare.constructor = MapSquare;
MapSquare.prototype = Object.create(PIXI.Sprite.prototype);

MapSquare.prototype.createMapSquareSprite = function(width, height){
	var graphics = new PIXI.Graphics();
	graphics.beginFill(0x00FF00);
	graphics.lineStyle(5, 0x006600);		
	graphics.drawRect(0, 0, width, height);
	return graphics.generateCanvasTexture();
}

MapSquare.prototype.createInteraction = function(){
	function onButtonDown(){
		this.alpha = 1.0;
		this.text.visible = true;
	}

	function onButtonUp(){
		if(this.isOccupied || this.isWater)
			this.gameState.selectionModeCancel();
		else
			this.gameState.selectionModeComplete(this);

		this.alpha = 0.0;
		this.text.visible = false;
	}

	function onButtonUpOutside(){
		this.alpha = 0.0;
		this.text.visible = false;
	}

	function onButtonOver(){
		this.alpha = 0.5;
		this.text.visible = true;
	}

	function onButtonOut(){
		this.alpha = 0.0;
		this.text.visible = false;
	}

    this
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUpOutside)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);
}

MapSquare.prototype.tick = function(delta){
	this.filters[0].hue(this.rotateHue);
}

MapSquare.prototype.addTower = function(tower){
	this.tower = tower;
	this.isOccupied = true;
	this.rotateHue = 260;
}

MapSquare.prototype.removeTower = function(){
	this.tower = null;
	this.isOccupied = false;
	this.rotateHue = 0;
}

MapSquare.prototype.activate = function(){
	this.interactive = true;
}

MapSquare.prototype.deactivate = function(){
	this.interactive = false;
}

MapSquare.prototype.getCenter = function(){
	return new PIXI.Point(this.x + this.width / 2, this.y + this.height / 2);
}