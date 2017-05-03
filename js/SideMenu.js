function SideMenu(state, x, y, width, height){
	this.gameState = state;

	this.sideMenuContainer = new PIXI.Container();
	this.sideMenuContainer.x = x;
	this.sideMenuContainer.y = y;
	this.sideMenuContainer.width = width;
	this.sideMenuContainer.height = height;
	stage.addChild(this.sideMenuContainer);

	this.UIContainer = new PIXI.Sprite(this.createContainerTexture(width, height));
	this.UIContainer.anchor.x = 0.5;
	this.UIContainer.anchor.y = 0.5;
	this.UIContainer.x = 0;
	this.UIContainer.y = 0;
	this.sideMenuContainer.addChild(this.UIContainer);

	this.iceCountText = new PIXI.Text("ICE: " + this.gameState.iceAmount, {
        font: "bold 50px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 10, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.iceCountText.visible = true;
    this.iceCountText.anchor.x = 0;
    this.iceCountText.anchor.y = 0.5;
    this.iceCountText.x = -width / 2 + 20;
    this.iceCountText.y = -height / 2 + 50;
    this.sideMenuContainer.addChild(this.iceCountText);

	this.inventoryText = new PIXI.Text("INVENTORY:", {
        font: "bold underline 30px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 10, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.inventoryText.visible = true;
    this.inventoryText.anchor.x = 0;
    this.inventoryText.anchor.y = 0.5;
    this.inventoryText.x = -width / 2 + 20;
    this.inventoryText.y = -height / 2 + 120;
    this.sideMenuContainer.addChild(this.inventoryText);

    this.inventory = new Inventory(this.gameState, -height / 2 + 150, this.sideMenuContainer);

    // Store Button
    this.openStoreText = new PIXI.Text("Open Store", {
        font: "bold 45px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'right', // Center align the text
        strokeThickness: 10, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.openStoreText.gameState = state;
    this.openStoreText.x = -width / 2 + 30;
    this.openStoreText.y = height / 2 - 100;
    this.openStoreText.buttonMode = true;
    this.openStoreText.interactive = true;
    this.openStoreText.on('pointerup', function(){this.gameState.bringUpTowerMenu();});
    this.sideMenuContainer.addChild(this.openStoreText);
}

SideMenu.constructor = SideMenu;

SideMenu.prototype.createContainerTexture = function(width, height){
	var graphics = new PIXI.Graphics();
	graphics.beginFill(0x00AAFF);
	graphics.lineStyle(5, 0x0066FF);		
	graphics.drawRect(0, 0, width, height);
	return graphics.generateCanvasTexture();
}