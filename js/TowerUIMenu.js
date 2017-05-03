function TowerUIMenu(state, x, y, width, height){
	this.gameState = state;

	// PIXI Object Container
	this.towerMenuContainer = new PIXI.Container();
	this.towerMenuContainer.x = x;
	this.towerMenuContainer.y = y;
	this.towerMenuContainer.width = width;
	this.towerMenuContainer.height = height;
	stage.addChild(this.towerMenuContainer);

	// PIXI Graphics Container Background
	this.containerGraphic = new PIXI.Sprite(this.createContainerTexture(width, height));
	this.containerGraphic.anchor.x = 0.5;
	this.containerGraphic.anchor.y = 0.5;
	this.containerGraphic.x = 0;
	this.containerGraphic.y = 0;
	this.towerMenuContainer.addChild(this.containerGraphic);

	// PIXI Title Text of the Menu
    this.titleText = new PIXI.Text("Tower Menu", {
        font: "bold 40px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'right', // Center align the text
        strokeThickness: 10, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.titleText.x = -width / 2 + 20;
    this.titleText.y = -height / 2 + 5;
    this.towerMenuContainer.addChild(this.titleText);

	// Exit Button
	this.exitText = new PIXI.Text("X", {
        font: "bold 30px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'right', // Center align the text
        strokeThickness: 3, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.exitText.x = width / 2 - 30;
    this.exitText.y = -height / 2 + 5;
    this.exitText.buttonMode = true;
    this.exitText.interactive = true;
    this.exitText.on('pointerup', function(){this.parent.visible = false;});
    this.towerMenuContainer.addChild(this.exitText);

    // Buy Button
    this.buyButton = new TowerUIButton(state, this, width/2 - 70, height/2 - 50, "buy", this.buyPressed);
    this.towerMenuContainer.addChild(this.buyButton);

    // Tower Type Buttons
    this.leftTowerArrow  = new TowerUIButton(state, this, -width/2 + 30, -200,  "left_arrow",  this.leftTowerPressed, 0.5, 0.5);
    this.rightTowerArrow = new TowerUIButton(state, this,  width/2 - 30, -200, "right_arrow", this.rightTowerPressed, 0.5, 0.5);
    this.towerMenuContainer.addChild(this.leftTowerArrow);
    this.towerMenuContainer.addChild(this.rightTowerArrow);

    // Upgrade/Downgrade Arrow Buttons
	this.topLeftArrow     = new TowerUIButton(state, this, -width/2 + 60, -100,  "left_arrow", this.topLeftPressed);
	this.middleLeftArrow  = new TowerUIButton(state, this, -width/2 + 60,    0,  "left_arrow", this.middleLeftPressed);
	this.bottomLeftArrow  = new TowerUIButton(state, this, -width/2 + 60,  100,  "left_arrow", this.bottomLeftPressed);
	this.topRightArrow    = new TowerUIButton(state, this,  width/2 - 60, -100, "right_arrow", this.topRightPressed);
	this.middleRightArrow = new TowerUIButton(state, this,  width/2 - 60,    0, "right_arrow", this.middleRightPressed);
	this.bottomRightArrow = new TowerUIButton(state, this,  width/2 - 60,  100, "right_arrow", this.bottomRightPressed);
    this.towerMenuContainer.addChild(this.topLeftArrow);
    this.towerMenuContainer.addChild(this.middleLeftArrow);
    this.towerMenuContainer.addChild(this.bottomLeftArrow);
    this.towerMenuContainer.addChild(this.topRightArrow);
    this.towerMenuContainer.addChild(this.middleRightArrow);
    this.towerMenuContainer.addChild(this.bottomRightArrow);

    // Tower Sprites
    this.headSprite = new PIXI.Sprite(textureManager.getTexture("windmill_damage_2"));
    this.headSprite.anchor.x = 0.5;
    this.headSprite.anchor.y = 0.5;
    this.headSprite.x = -25;
    this.headSprite.y = -100;
    this.bodySprite = new PIXI.Sprite(textureManager.getTexture("single_fusion"));
    this.bodySprite.anchor.x = 0.5;
    this.bodySprite.anchor.y = 0.5;
    this.bodySprite.x = -25;
    this.bodySprite.y = 0;
    this.feetSprite = new PIXI.Sprite(textureManager.getTexture("grid_power_range_3"));
    this.feetSprite.anchor.x = 0.5;
    this.feetSprite.anchor.y = 0.5;
    this.feetSprite.x = -25;
    this.feetSprite.y = 100;
    this.towerMenuContainer.addChild(this.headSprite, this.bodySprite, this.feetSprite);

	// Tower-Store variables
	this.towerTypesArray = ["windTower", "hydroTower"];

	this.windPowerArray = [2, 3, 4];
	this.windFireRateArray = [1, 2, 3];
	this.windRangeArray = [3, 6, 8];

	this.hydroPowerArray = [5, 7, 9];
	this.hydroFireRateArray = [1, 2, 3];
	this.hydroRangeArray = [3, 6, 8];

	this.currentPowerArray = this.windPowerArray;
	this.currentFireRateArray = this.windFireRateArray;
	this.currentRangeArray = this.windRangeArray;

	this.towerRangeMultiplier = 64;

    // Tower variables
    this.towerTypeSelected = 0;
   	this.headIndexSelected = 0;
   	this.bodyIndexSelected = 0;
   	this.feetIndexSelected = 0;

	// Tower Upgrade Text
	let towerTextOption = {
        font: "bold 24px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 5, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    };
    this.towerPowerText = new PIXI.Text(this.windPowerArray[0] + "\ndmg", towerTextOption);
    this.towerPowerText.anchor.x = 0.5;
    this.towerPowerText.anchor.y = 0.5;
    this.towerPowerText.x = 55;
    this.towerPowerText.y = -100;
    this.towerMenuContainer.addChild(this.towerPowerText);
    this.towerFireRateText = new PIXI.Text(this.windFireRateArray[0] + "\nper s", towerTextOption);
    this.towerFireRateText.anchor.x = 0.5;
    this.towerFireRateText.anchor.y = 0.5;
    this.towerFireRateText.x = 55;
    this.towerFireRateText.y = 0;
    this.towerMenuContainer.addChild(this.towerFireRateText);
	this.towerRangeText = new PIXI.Text((this.windRangeArray[0] * this.towerRangeMultiplier) + "\npx", towerTextOption);
    this.towerRangeText.anchor.x = 0.5;
    this.towerRangeText.anchor.y = 0.5;
    this.towerRangeText.x = 55;
    this.towerRangeText.y = 100;
    this.towerMenuContainer.addChild(this.towerRangeText);

    // Tower Type Text
    this.towerTypeText = new PIXI.Text(this.towerTypesArray[0], {
        font: "bold 32px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 5, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.towerTypeText.x = 0;
    this.towerTypeText.y = -200;
    this.towerTypeText.anchor.x = 0.5;
    this.towerTypeText.anchor.y = 0.5;
    this.towerMenuContainer.addChild(this.towerTypeText);

	// Price Text
	this.price = 60;
    this.priceText = new PIXI.Text("PRICE:\n" + this.price + " ICE", {
        font: "bold 40px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 8, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.priceText.x = -width/2 + 25;
    this.priceText.y = 240;
    this.priceText.anchor.y = 0.5;
    this.towerMenuContainer.addChild(this.priceText);

    // Interactive variables
	this.towerMenuContainer.prevPoint = new PIXI.Point();
	this.towerMenuContainer.currentPoint = new PIXI.Point();
	this.towerMenuContainer.dragging = false;
	this.towerMenuContainer.buttonMode  = true;
	this.towerMenuContainer.interactive = true;
	this.createInteraction(this.towerMenuContainer);
}

TowerUIMenu.constructor = TowerUIMenu;

TowerUIMenu.prototype.createContainerTexture = function(width, height){
	var graphics = new PIXI.Graphics();
	graphics.beginFill(0xCCCCFF, 0.8);
	graphics.lineStyle(3, 0x003355);		
	graphics.drawRect(0, 0, width, height);
	return graphics.generateCanvasTexture();
}

TowerUIMenu.prototype.tick = function(delta){
	this.bringToFront();
	if(this.towerMenuContainer.dragging){
		let globalPoint = renderer.plugins.interaction.mouse.global;
		let localPoint = stage.toLocal(globalPoint);
		this.towerMenuContainer.currentPoint.x = localPoint.x;
		this.towerMenuContainer.currentPoint.y = localPoint.y;

		let deltaX = this.towerMenuContainer.currentPoint.x - this.towerMenuContainer.prevPoint.x;		// TODO: Fix deltaX and deltaY Issue; then add X button to it
		let deltaY = this.towerMenuContainer.currentPoint.y - this.towerMenuContainer.prevPoint.y;

		this.towerMenuContainer.x += deltaX;
		this.towerMenuContainer.y += deltaY;
		this.towerMenuContainer.prevPoint.x = this.towerMenuContainer.currentPoint.x;
		this.towerMenuContainer.prevPoint.y = this.towerMenuContainer.currentPoint.y;
	}

	this.buyButton.tick(delta);

	this.leftTowerArrow.tick(delta);
	this.rightTowerArrow.tick(delta);

	this.topLeftArrow.tick(delta);
	this.middleLeftArrow.tick(delta);
	this.bottomLeftArrow.tick(delta);
	this.topRightArrow.tick(delta);
	this.middleRightArrow.tick(delta);
	this.bottomRightArrow.tick(delta);
}

TowerUIMenu.prototype.createInteraction = function(container){
	function onButtonDown(){
		this.dragging = true;
		let globalPoint = renderer.plugins.interaction.mouse.global;
		let localPoint = stage.toLocal(globalPoint);
		this.prevPoint.x = localPoint.x;
		this.prevPoint.y = localPoint.y;
	}

	function onButtonUp(){
		this.dragging = false;
	}

    container
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp);
}

TowerUIMenu.prototype.bringToFront = function(){
	stage.removeChild(this.towerMenuContainer);
	stage.addChild(this.towerMenuContainer);
}

TowerUIMenu.prototype.buyPressed = function(){
	console.log("BUY TOWER");

	// TODO: Get the buying towers to work
}

TowerUIMenu.prototype.leftTowerPressed = function(){
	this.towerMenu.towerTypeSelected = ((this.towerMenu.towerTypeSelected - 1) + this.towerMenu.towerTypesArray.length) % this.towerMenu.towerTypesArray.length;
	this.towerMenu.towerTypeText.text = this.towerMenu.towerTypesArray[this.towerMenu.towerTypeSelected];

	this.towerMenu.changeToBaseStats(this.towerMenu.towerTypesArray[this.towerMenu.towerTypeSelected]);
}

TowerUIMenu.prototype.rightTowerPressed = function(){
	this.towerMenu.towerTypeSelected = ((this.towerMenu.towerTypeSelected + 1) + this.towerMenu.towerTypesArray.length) % this.towerMenu.towerTypesArray.length;
	this.towerMenu.towerTypeText.text = this.towerMenu.towerTypesArray[this.towerMenu.towerTypeSelected];

	this.towerMenu.changeToBaseStats(this.towerMenu.towerTypesArray[this.towerMenu.towerTypeSelected]);
}

TowerUIMenu.prototype.changeToBaseStats = function(towerType){
	this.headIndexSelected = 0;
   	this.bodyIndexSelected = 0;
   	this.feetIndexSelected = 0;

   	var head, body, feet;

	switch(towerType){
		case this.towerTypesArray[0]:
			head = this.windPowerArray[0];
			body = this.windFireRateArray[0];
			feet = this.windRangeArray[0] * this.towerRangeMultiplier;
			this.currentPowerArray = this.windPowerArray;
			this.currentFireRateArray = this.windFireRateArray;
			this.currentRangeArray = this.windRangeArray;
			break;
		case this.towerTypesArray[1]:
			head = this.hydroPowerArray[0];
			body = this.hydroFireRateArray[0];
			feet = this.hydroRangeArray[0] * this.towerRangeMultiplier;
			this.currentPowerArray = this.hydroPowerArray;
			this.currentFireRateArray = this.hydroFireRateArray;
			this.currentRangeArray = this.hydroRangeArray;
			break;
	}

	this.towerPowerText.text = head + "\ndmg";
	this.towerFireRateText.text = body + "\nper s";
	this.towerRangeText.text = feet + "\npx";
	this.calculateCost();
}

TowerUIMenu.prototype.topLeftPressed = function(){
	this.towerMenu.headIndexSelected = ((this.towerMenu.headIndexSelected - 1) + this.towerMenu.currentPowerArray.length) % this.towerMenu.currentPowerArray.length;
	this.towerMenu.towerPowerText.text = this.towerMenu.currentPowerArray[this.towerMenu.headIndexSelected] + "\ndmg";
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.topRightPressed = function(){
	this.towerMenu.headIndexSelected = ((this.towerMenu.headIndexSelected + 1) + this.towerMenu.currentPowerArray.length) % this.towerMenu.currentPowerArray.length;
	this.towerMenu.towerPowerText.text = this.towerMenu.currentPowerArray[this.towerMenu.headIndexSelected] + "\ndmg";
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.middleLeftPressed = function(){
	this.towerMenu.bodyIndexSelected = ((this.towerMenu.bodyIndexSelected - 1) + this.towerMenu.currentFireRateArray.length) % this.towerMenu.currentFireRateArray.length;
	this.towerMenu.towerFireRateText.text = this.towerMenu.currentFireRateArray[this.towerMenu.bodyIndexSelected] + "\nper s";
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.middleRightPressed = function(){
	this.towerMenu.bodyIndexSelected = ((this.towerMenu.bodyIndexSelected + 1) + this.towerMenu.currentFireRateArray.length) % this.towerMenu.currentFireRateArray.length;
	this.towerMenu.towerFireRateText.text = this.towerMenu.currentFireRateArray[this.towerMenu.bodyIndexSelected] + "\nper s";
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.bottomLeftPressed = function(){
	this.towerMenu.feetIndexSelected = ((this.towerMenu.feetIndexSelected - 1) + this.towerMenu.currentRangeArray.length) % this.towerMenu.currentRangeArray.length;
	this.towerMenu.towerRangeText.text = (this.towerMenu.currentRangeArray[this.towerMenu.feetIndexSelected] * this.towerMenu.towerRangeMultiplier) + "\npx";
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.bottomRightPressed = function(){
	this.towerMenu.feetIndexSelected = ((this.towerMenu.feetIndexSelected + 1) + this.towerMenu.currentRangeArray.length) % this.towerMenu.currentRangeArray.length;
	this.towerMenu.towerRangeText.text = (this.towerMenu.currentRangeArray[this.towerMenu.feetIndexSelected] * this.towerMenu.towerRangeMultiplier) + "\npx";
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.calculateCost = function(){
	let cost = (this.currentPowerArray[this.headIndexSelected] + this.currentFireRateArray[this.bodyIndexSelected] + this.currentRangeArray[this.feetIndexSelected]) * 10;
	this.price = cost;
	this.priceText.text = "PRICE:\n" + this.price + " ICE";

}

TowerUIMenu.prototype.openStore = function(){
	if(!this.towerMenuContainer.visible)
		this.changeToBaseStats(this.towerTypesArray[0]);
	this.towerMenuContainer.visible = true;
}