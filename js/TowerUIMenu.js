function TowerUIMenu(state, x, y, width, height){
	this.gameState = state;

	this.towerMenuContainer = new PIXI.Container();
	this.towerMenuContainer.x = x;
	this.towerMenuContainer.y = y;
	this.towerMenuContainer.width = width;
	this.towerMenuContainer.height = height;
	stage.addChild(this.towerMenuContainer);

	this.containerGraphic = new PIXI.Sprite(this.createContainerTexture(width, height));
	this.containerGraphic.anchor.x = 0.5;
	this.containerGraphic.anchor.y = 0.5;
	this.containerGraphic.x = 0;
	this.containerGraphic.y = 0;
	this.towerMenuContainer.addChild(this.containerGraphic);

	this.exitText = new PIXI.Text("X", {
        font: "bold 40px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'right', // Center align the text
        strokeThickness: 3, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.exitText.x = width / 2 - 40;
    this.exitText.y = -height / 2 + 5;
    this.exitText.buttonMode = true;
    this.exitText.interactive = true;
    this.exitText.on('pointerup', function(){this.parent.visible = false;});
    this.towerMenuContainer.addChild(this.exitText);

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
	graphics.beginFill(0x000022, 0.8);
	graphics.lineStyle(3, 0xAAAAFF);		
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
