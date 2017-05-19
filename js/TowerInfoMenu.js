function TowerInfoMenu(state, width, height){
	PIXI.Container.call(this);
	this.gameState = state;

	this.x = CANVAS_WIDTH / 2;
	this.y = CANVAS_HEIGHT / 2;
	this.width = width;
	this.height = height;
	stage.addChild(this);

	this.towerSelected = null;

	// PIXI Graphics Container Background
	this.containerGraphic = new PIXI.Sprite(this.createContainerTexture(width, height));
	this.containerGraphic.anchor.x = 0.5;
	this.containerGraphic.anchor.y = 0.5;
	this.containerGraphic.x = 0;
	this.containerGraphic.y = 0;
	this.addChild(this.containerGraphic);

	// Tower Selection Sprite
	let graphics = new PIXI.Graphics();
	graphics.beginFill(0x000000, 0.75);
	graphics.lineStyle(6, 0x005577);	
	graphics.drawRoundedRect(0, 0, 75, 80, 5);
	this.towerSelectedSpriteContainer = new PIXI.Sprite(graphics.generateCanvasTexture());
	this.towerSelectedSpriteContainer.x = -width/2;
	this.towerSelectedSpriteContainer.y = -height/2;
	this.addChild(this.towerSelectedSpriteContainer);

	this.towerSelectedSprite = new PIXI.Sprite(textureManager.getTexture("windTower_Idle"));
	this.towerSelectedSprite.anchor.x = 0.5;
	this.towerSelectedSprite.anchor.y = 0.5;
	this.towerSelectedSprite.x = -width/2 + 42;
	this.towerSelectedSprite.y = -height/2 + 40;
	this.towerSelectedSprite.scale.x = 2;
	this.towerSelectedSprite.scale.y = 2;
	this.addChild(this.towerSelectedSprite);

	// PIXI Title Text of the Menu
    this.titleText = new PIXI.Text("Tower Info Menu", {
        font: "bold 50px 'Press Start 2P'", // Set style, size and font
        fill: ['#00AAFF', '#AAEEFF', '#00AAFF'], // Set fill color to white
        align: 'right', // Center align the text
        strokeThickness: 10, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.titleText.x = -width / 2 + 100;
    this.titleText.y = -height / 2 + 5;
    this.addChild(this.titleText);

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
    this.exitText.on('pointerup', function(){this.parent.closeStore();});
    this.addChild(this.exitText);

    let infoTextOption = {
        font: "bold 32px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 6, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    };

    // Tower Type Text
    this.towerTypeText = new PIXI.Text("Tower Type: windTower", infoTextOption);
    this.towerTypeText.y = TowerInfoMenu.yLocations[0];
    this.towerTypeText.anchor.x = 0.5;
    this.towerTypeText.anchor.y = 0.5;
    this.addChild(this.towerTypeText);

    this.powerStatText = new PIXI.Text("Power per bullet: 1", infoTextOption);
    this.powerStatText.y = TowerInfoMenu.yLocations[1];
    this.powerStatText.anchor.x = 0.5;
    this.powerStatText.anchor.y = 0.5;
    this.addChild(this.powerStatText);

    this.rateStatText = new PIXI.Text("Fire Rate: 1", infoTextOption);
    this.rateStatText.y = TowerInfoMenu.yLocations[2];
    this.rateStatText.anchor.x = 0.5;
    this.rateStatText.anchor.y = 0.5;
    this.addChild(this.rateStatText);

    this.rangeStatText = new PIXI.Text("Tower Range: 1", infoTextOption);
    this.rangeStatText.y = TowerInfoMenu.yLocations[3];
    this.rangeStatText.anchor.x = 0.5;
    this.rangeStatText.anchor.y = 0.5;
    this.addChild(this.rangeStatText);

    // Tower Mode Title Text
    this.towerModeTitleText = new PIXI.Text("ATTACK TOWER MODE:", infoTextOption);
    this.towerModeTitleText.anchor.x = 0.5;
    this.towerModeTitleText.anchor.y = 0.5;
    this.towerModeTitleText.y = TowerInfoMenu.yLocations[4];
    this.addChild(this.towerModeTitleText);

    // Tower Mode Arrow Buttons
	this.modeLeftArrow  = new TowerUIButton(state, this, -width/2 + 60, TowerInfoMenu.yLocations[5],  "left_arrow", this.modeLeftPressed, 0.6, 0.6);
	this.modeRightArrow = new TowerUIButton(state, this,  width/2 - 60, TowerInfoMenu.yLocations[5], "right_arrow", this.modeRightPressed, 0.6, 0.6);
    this.addChild(this.modeLeftArrow);
    this.addChild(this.modeRightArrow);

    // Tower Mode Text
    infoTextOption.font = "bold 28px Arial";
    this.towerModeText = new PIXI.Text("Further Distance Travelled", infoTextOption);
    this.towerModeText.anchor.x = 0.5;
    this.towerModeText.anchor.y = 0.5;
    this.towerModeText.y = TowerInfoMenu.yLocations[5];
    this.addChild(this.towerModeText);

	this.towerRangeMultiplier = 64;

    // Interactive variables
	this.prevPoint = new PIXI.Point();
	this.currentPoint = new PIXI.Point();
	this.dragging = false;
	this.buttonMode  = true;
	this.interactive = true;
	this.createInteraction();
}

TowerInfoMenu.constructor = TowerInfoMenu;
TowerInfoMenu.prototype = Object.create(PIXI.Container.prototype);

TowerInfoMenu.yLocations = [-140, -90, -40, 10, 75, 125];

TowerInfoMenu.prototype.createContainerTexture = function(width, height){
	var graphics = new PIXI.Graphics();
	graphics.beginFill(0xCCCCFF, 0.8);
	graphics.lineStyle(3, 0x003355);		
	graphics.drawRect(0, 0, width, height);
	return graphics.generateCanvasTexture();
}

TowerInfoMenu.prototype.createUpgradeButtonTexture = function(width, height){
	// TODO: Create this
}

TowerInfoMenu.prototype.createSellButtonTexture = function(width, height){

}

TowerInfoMenu.prototype.tick = function(delta){
	this.bringToFront();
	if(this.dragging){
		let globalPoint = renderer.plugins.interaction.mouse.global;
		let localPoint = stage.toLocal(globalPoint);
		this.currentPoint.x = localPoint.x;
		this.currentPoint.y = localPoint.y;

		let deltaX = this.currentPoint.x - this.prevPoint.x;
		let deltaY = this.currentPoint.y - this.prevPoint.y;

		this.x += deltaX;
		this.y += deltaY;
		this.prevPoint.x = this.currentPoint.x;
		this.prevPoint.y = this.currentPoint.y;
	}

	this.modeLeftArrow.tick(delta);
	this.modeRightArrow.tick(delta);
}

TowerInfoMenu.prototype.createInteraction = function(){
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

    this
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp);
}

TowerInfoMenu.prototype.bringToFront = function(){
	stage.removeChild(this);
	stage.addChild(this);
}

TowerInfoMenu.prototype.updateTowerInfo = function(){
	// Get information from tower
    this.towerTypeText.text = "Tower Type: " + this.towerSelected.towerType;
    this.powerStatText.text = "Power: " + this.towerSelected.headPower + " dmg/bullet";
    this.rateStatText.text  = "Fire Rate: " + this.towerSelected.bodyFireRate + "/s";
    this.rangeStatText.text = "Tower Range: " + this.towerSelected.feetRange + " px";
    this.towerModeText.text = this.towerSelected.getAttackTowerMode();

    // Change Sprite
	this.towerSelectedSprite.texture = textureManager.getTexture(this.towerSelected.towerType + "_Idle");
}

TowerInfoMenu.prototype.modeLeftPressed = function(){
	this.towerMenu.towerSelected.decrementAttackTowerMode();
	this.towerMenu.updateTowerInfo();
}

TowerInfoMenu.prototype.modeRightPressed = function(){
	this.towerMenu.towerSelected.incrementAttackTowerMode();
	this.towerMenu.updateTowerInfo();
}

TowerInfoMenu.prototype.openStore = function(tower){
	if(!this.visible){
		this.x = CANVAS_WIDTH / 2;
		this.y = CANVAS_HEIGHT / 2;
	}
	if(this.towerSelected != null)
		this.towerSelected.hasBeenDeselected();
	this.towerSelected = tower;
	this.towerSelected.hasBeenSelected();
	this.updateTowerInfo();
	this.visible = true;
}

TowerInfoMenu.prototype.closeStore = function(){
	this.visible = false;
	if(this.towerSelected != null)
		this.towerSelected.hasBeenDeselected();
}