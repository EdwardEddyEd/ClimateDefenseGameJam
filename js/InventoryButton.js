function InventoryButton(state, tower, x, y, width, height, renderTarget){
	if(!InventoryButton.texturesCreated){
		this.createButtonTexture(width, height);
		InventoryButton.texturesCreated = true;
	}
	PIXI.Sprite.call(this, textureManager.getTexture("inventoryButton_Up"));
	renderTarget.addChild(this);

	this.anchor.x = 0.5;
	this.x = x;
	this.y = y;
	this.renderTarget = renderTarget;

	this.count = 1;
	this.maxCount = 99;

	this.gameState = state;
	this.tower = tower;

	// Tower Variables
	this.towerSprite = new PIXI.Sprite(tower.texture);
	this.towerSprite.anchor.x = 0.5;
	this.towerSprite.anchor.y = 0;
	this.towerSprite.x = -125;
	this.towerSprite.y = 8;
	this.towerSprite.scale = new PIXI.Point(2, 2);
	this.addChild(this.towerSprite);

	// Tower Information listed on the button
	this.buttonTextInfo = new PIXI.Text("Power: " + this.tower.headPower + "\nFireRate: " + this.tower.bodyFireRate + "\/s\nRange: " + this.tower.feetRange + " px", {
        font: "bold 18px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'left', // Center align the text
        strokeThickness: 4, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.buttonTextInfo.x = -80;
    this.buttonTextInfo.y = 4;
    this.addChild(this.buttonTextInfo);

    // The number of towers on this button
	this.buttonCountText = new PIXI.Text("x" + this.count, {
        font: "bold 50px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'right', // Center align the text
        strokeThickness: 8, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.buttonCountText.anchor.x = 1;
    this.buttonCountText.x = 155;
    this.buttonCountText.y = 10;
    this.addChild(this.buttonCountText);

	this.buttonMode = true;
	this.interactive = true;
	this.createInteraction();
}

InventoryButton.constructor = InventoryButton;
InventoryButton.prototype = Object.create(PIXI.Sprite.prototype);

InventoryButton.texturesCreated = false;

InventoryButton.prototype.createButtonTexture = function(width, height){
	let graphicsUp = new PIXI.Graphics();
	graphicsUp.beginFill(0xFFFFFF, 0.5);
	graphicsUp.lineStyle(5, 0x5555FF);		
	graphicsUp.drawRoundedRect(0, 0, width, height, 5);

	graphicsUp.beginFill(0x000000, 0.75);
	graphicsUp.drawRoundedRect(0, 0, 75, height, 5);
	textureManager.loadTexture("inventoryButton_Up", graphicsUp.generateCanvasTexture());


	let graphicsHover = new PIXI.Graphics();
	graphicsHover.beginFill(0xFFFFFF, 0.80);
	graphicsHover.lineStyle(5, 0xAAAAFF);		
	graphicsHover.drawRoundedRect(0, 0, width, height, 5);

	graphicsHover.beginFill(0x000000, 0.90);
	graphicsHover.drawRoundedRect(0, 0, 75, height, 5);
	textureManager.loadTexture("inventoryButton_Hover", graphicsHover.generateCanvasTexture());


	let graphicsDown = new PIXI.Graphics();
	graphicsDown.beginFill(0xFFFFFF, 0.80);
	graphicsDown.lineStyle(5, 0xFFDD00);		
	graphicsDown.drawRoundedRect(0, 0, width, height, 5);

	graphicsDown.beginFill(0x000000, 0.90);
	graphicsDown.drawRoundedRect(0, 0, 75, height, 5);
	textureManager.loadTexture("inventoryButton_Down", graphicsDown.generateCanvasTexture());
}

InventoryButton.prototype.createInteraction = function(){
	function onButtonDown(){
		this.texture = textureManager.getTexture("inventoryButton_Down");
	}

	function onButtonUp(){
		this.gameState.selectionModeOn(this.tower, this);
	}

	function onButtonUpOutside(){
		onButtonOut();
	}

	function onButtonOver(){
		this.texture = textureManager.getTexture("inventoryButton_Hover");
	}

	function onButtonOut(){
		this.texture = textureManager.getTexture("inventoryButton_Up");
	}

    this
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUpOutside)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);
}

InventoryButton.prototype.subtractTower = function(){
	this.count--;
	this.buttonCountText.text = "x" + this.count;
}

InventoryButton.prototype.addTower = function(){
	this.count++;
	this.buttonCountText.text = "x" + this.count;
}

InventoryButton.prototype.deleteButton = function(){
	this.renderTarget.removeChild(this);
}

InventoryButton.prototype.tick = function(delta){

}