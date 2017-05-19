function TowerUIMenu(state, width, height){
	this.gameState = state;

	// PIXI Object Container
	this.towerMenuContainer = new PIXI.Container();
	this.towerMenuContainer.x = CANVAS_WIDTH / 2;
	this.towerMenuContainer.y = CANVAS_HEIGHT / 2;
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
    this.titleText = new PIXI.Text("Tower Store", {
        font: "bold 48px Arial", // Set style, size and font
        fill: ['#00AAFF', '#AAEEFF', '#00AAFF'], // Set fill color to white
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
    this.leftTowerArrow  = new TowerUIButton(state, this, -width/2 + 30, TowerUIMenu.y_coordinate_layer[0],  "left_arrow",  this.leftTowerPressed, 0.5, 0.5);
    this.rightTowerArrow = new TowerUIButton(state, this,  width/2 - 30, TowerUIMenu.y_coordinate_layer[0], "right_arrow", this.rightTowerPressed, 0.5, 0.5);
    this.towerMenuContainer.addChild(this.leftTowerArrow);
    this.towerMenuContainer.addChild(this.rightTowerArrow);

    // Upgrade/Downgrade Arrow Buttons
	this.topLeftArrow     = new TowerUIButton(state, this, -width/2 + 60, TowerUIMenu.y_coordinate_layer[2],  "left_arrow", this.topLeftPressed);
	this.middleLeftArrow  = new TowerUIButton(state, this, -width/2 + 60, TowerUIMenu.y_coordinate_layer[4],  "left_arrow", this.middleLeftPressed);
	this.bottomLeftArrow  = new TowerUIButton(state, this, -width/2 + 60,  TowerUIMenu.y_coordinate_layer[6],  "left_arrow", this.bottomLeftPressed);
	this.topRightArrow    = new TowerUIButton(state, this,  width/2 - 60, TowerUIMenu.y_coordinate_layer[2], "right_arrow", this.topRightPressed);
	this.middleRightArrow = new TowerUIButton(state, this,  width/2 - 60, TowerUIMenu.y_coordinate_layer[4], "right_arrow", this.middleRightPressed);
	this.bottomRightArrow = new TowerUIButton(state, this,  width/2 - 60,  TowerUIMenu.y_coordinate_layer[6], "right_arrow", this.bottomRightPressed);
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
    this.headSprite.y = TowerUIMenu.y_coordinate_layer[2];
    this.bodySprite = new PIXI.Sprite(textureManager.getTexture("single_fusion"));
    this.bodySprite.anchor.x = 0.5;
    this.bodySprite.anchor.y = 0.5;
    this.bodySprite.x = -25;
    this.bodySprite.y = TowerUIMenu.y_coordinate_layer[4];
    this.feetSprite = new PIXI.Sprite(textureManager.getTexture("grid_power_range_3"));
    this.feetSprite.anchor.x = 0.5;
    this.feetSprite.anchor.y = 0.5;
    this.feetSprite.x = -25;
    this.feetSprite.y = TowerUIMenu.y_coordinate_layer[6];
    this.towerMenuContainer.addChild(this.headSprite, this.bodySprite, this.feetSprite);

	// Tower-Store variables
	this.towerTypesArray = ["windTower", "hydroTower"];

	this.windPowerArray = WindTower.powerArray;
	this.windFireRateArray = WindTower.fireRateArray;
	this.windRangeArray = WindTower.rangeArray;

	this.hydroPowerArray = HydroTower.powerArray;
	this.hydroFireRateArray = HydroTower.fireRateArray;
	this.hydroRangeArray = HydroTower.rangeArray;

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
        font: "bold 46px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 5, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    };
    this.upgradePowerText = new PIXI.Text(this.windPowerArray[0], towerTextOption);
    this.upgradePowerText.anchor.x = 0.5;
    this.upgradePowerText.anchor.y = 0.5;
    this.upgradePowerText.x = 55;
    this.upgradePowerText.y = TowerUIMenu.y_coordinate_layer[2];
    this.towerMenuContainer.addChild(this.upgradePowerText);
    this.upgradeFireRateText = new PIXI.Text(this.windFireRateArray[0], towerTextOption);
    this.upgradeFireRateText.anchor.x = 0.5;
    this.upgradeFireRateText.anchor.y = 0.5;
    this.upgradeFireRateText.x = 55;
    this.upgradeFireRateText.y = TowerUIMenu.y_coordinate_layer[4];
    this.towerMenuContainer.addChild(this.upgradeFireRateText);
	this.upgradeRangeText = new PIXI.Text((this.windRangeArray[0] * this.towerRangeMultiplier), towerTextOption);
    this.upgradeRangeText.anchor.x = 0.5;
    this.upgradeRangeText.anchor.y = 0.5;
    this.upgradeRangeText.x = 55;
    this.upgradeRangeText.y = TowerUIMenu.y_coordinate_layer[6];
    this.towerMenuContainer.addChild(this.upgradeRangeText);

    // Text UI for upgrade description
    towerTextOption.font = "bold 24px Arial";
    this.infoPowerText = new PIXI.Text("Attack Power (dmg/bullet)", towerTextOption);
    this.infoPowerText.anchor.x = 0.5;
    this.infoPowerText.anchor.y = 0.5;
    this.infoPowerText.y = TowerUIMenu.y_coordinate_layer[1];
    this.towerMenuContainer.addChild(this.infoPowerText);
    this.infoFireRateText = new PIXI.Text("Fire Rate (per sec)", towerTextOption);
    this.infoFireRateText.anchor.x = 0.5;
    this.infoFireRateText.anchor.y = 0.5;
    this.infoFireRateText.y = TowerUIMenu.y_coordinate_layer[3];
    this.towerMenuContainer.addChild(this.infoFireRateText);
	this.infoRangeText = new PIXI.Text("Range (in pixels)", towerTextOption);
    this.infoRangeText.anchor.x = 0.5;
    this.infoRangeText.anchor.y = 0.5;
    this.infoRangeText.y = TowerUIMenu.y_coordinate_layer[5];
    this.towerMenuContainer.addChild(this.infoRangeText);

    // Tower Type Text
    this.towerTypeText = new PIXI.Text(this.towerTypesArray[0], {
        font: "bold 32px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 5, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.towerTypeText.x = 0;
    this.towerTypeText.y = TowerUIMenu.y_coordinate_layer[0];
    this.towerTypeText.anchor.x = 0.5;
    this.towerTypeText.anchor.y = 0.5;
    this.towerMenuContainer.addChild(this.towerTypeText);

	// Price Text
	this.price = 0;
    this.priceText = new PIXI.Text("PRICE:\n" + this.price + " ICE", {
        font: "bold 40px Arial", // Set style, size and font
        fill: ['#00AAFF', '#AAEEFF', '#00AAFF'], // Set fill color to white
        align: 'left', // Center align the text
        strokeThickness: 8, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.priceText.x = -width/2 + 25;
    this.priceText.y = height/2 - 60;
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
TowerUIMenu.y_coordinate_layer = [-250, -190, -120, -40, 30, 110, 180, ];

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
	let tower    = this.towerMenu.towerTypesArray[this.towerMenu.towerTypeSelected];
	let power    = this.towerMenu.currentPowerArray[this.towerMenu.headIndexSelected];
	let firerate = this.towerMenu.currentFireRateArray[this.towerMenu.bodyIndexSelected];
	let range    = this.towerMenu.currentRangeArray[this.towerMenu.feetIndexSelected] * this.towerMenu.towerRangeMultiplier;
	let price    = this.towerMenu.price;
	this.gameState.purchaseTower(tower, power, firerate, range, price);
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
			this.towerTypeSelected = 0;
			this.towerTypeText.text = towerType;
			head = this.windPowerArray[0];
			body = this.windFireRateArray[0];
			feet = this.windRangeArray[0] * this.towerRangeMultiplier;
			this.currentPowerArray = this.windPowerArray;
			this.currentFireRateArray = this.windFireRateArray;
			this.currentRangeArray = this.windRangeArray;
			break;
		case this.towerTypesArray[1]:
			this.towerTypeSelected = 1;
			this.towerTypeText.text = towerType;
			head = this.hydroPowerArray[0];
			body = this.hydroFireRateArray[0];
			feet = this.hydroRangeArray[0] * this.towerRangeMultiplier;
			this.currentPowerArray = this.hydroPowerArray;
			this.currentFireRateArray = this.hydroFireRateArray;
			this.currentRangeArray = this.hydroRangeArray;
			break;
	}

	this.upgradePowerText.text = head;
	this.upgradeFireRateText.text = body;
	this.upgradeRangeText.text = feet;
	this.calculateCost();
}

TowerUIMenu.prototype.topLeftPressed = function(){
	this.towerMenu.headIndexSelected = ((this.towerMenu.headIndexSelected - 1) + this.towerMenu.currentPowerArray.length) % this.towerMenu.currentPowerArray.length;
	this.towerMenu.upgradePowerText.text = this.towerMenu.currentPowerArray[this.towerMenu.headIndexSelected];
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.topRightPressed = function(){
	this.towerMenu.headIndexSelected = ((this.towerMenu.headIndexSelected + 1) + this.towerMenu.currentPowerArray.length) % this.towerMenu.currentPowerArray.length;
	this.towerMenu.upgradePowerText.text = this.towerMenu.currentPowerArray[this.towerMenu.headIndexSelected];
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.middleLeftPressed = function(){
	this.towerMenu.bodyIndexSelected = ((this.towerMenu.bodyIndexSelected - 1) + this.towerMenu.currentFireRateArray.length) % this.towerMenu.currentFireRateArray.length;
	this.towerMenu.upgradeFireRateText.text = this.towerMenu.currentFireRateArray[this.towerMenu.bodyIndexSelected];
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.middleRightPressed = function(){
	this.towerMenu.bodyIndexSelected = ((this.towerMenu.bodyIndexSelected + 1) + this.towerMenu.currentFireRateArray.length) % this.towerMenu.currentFireRateArray.length;
	this.towerMenu.upgradeFireRateText.text = this.towerMenu.currentFireRateArray[this.towerMenu.bodyIndexSelected];
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.bottomLeftPressed = function(){
	this.towerMenu.feetIndexSelected = ((this.towerMenu.feetIndexSelected - 1) + this.towerMenu.currentRangeArray.length) % this.towerMenu.currentRangeArray.length;
	this.towerMenu.upgradeRangeText.text = (this.towerMenu.currentRangeArray[this.towerMenu.feetIndexSelected] * this.towerMenu.towerRangeMultiplier);
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.bottomRightPressed = function(){
	this.towerMenu.feetIndexSelected = ((this.towerMenu.feetIndexSelected + 1) + this.towerMenu.currentRangeArray.length) % this.towerMenu.currentRangeArray.length;
	this.towerMenu.upgradeRangeText.text = (this.towerMenu.currentRangeArray[this.towerMenu.feetIndexSelected] * this.towerMenu.towerRangeMultiplier);
	this.towerMenu.calculateCost();
}

TowerUIMenu.prototype.calculateCost = function(){
	let power = this.currentPowerArray[this.headIndexSelected];
	let rate = this.currentFireRateArray[this.bodyIndexSelected];
	let range = this.currentRangeArray[this.feetIndexSelected];
	switch(this.towerTypeSelected){
		case 0:
			this.price = WindTower.calculatePrice(power, rate, range);
			break;
		case 1:
			this.price = HydroTower.calculatePrice(power, rate, range);
			break;
	}
	this.priceText.text = "PRICE:\n" + this.price + " ICE";
}

TowerUIMenu.prototype.openStore = function(){
	if(!this.towerMenuContainer.visible){
		this.changeToBaseStats(this.towerTypesArray[0]);
		this.towerMenuContainer.x = CANVAS_WIDTH / 2;
		this.towerMenuContainer.y = CANVAS_HEIGHT / 2;
	}
	this.towerMenuContainer.visible = true;
}

TowerUIMenu.prototype.closeStore = function(){
	this.towerMenuContainer.visible = false;
}