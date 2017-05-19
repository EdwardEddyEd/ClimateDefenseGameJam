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
        fill: ['#00AAFF', '#AAEEFF', '#00AAFF'], // Set fill color to white
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
        font: "bold 35px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'right', // Center align the text
        stroke: '#000000', // Set stroke color
        strokeThickness: 10, // Set stroke thickness to 10
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.openStoreText.gameState = state;
    this.openStoreText.anchor.x = 0.5;
    this.openStoreText.x = 0;
    this.openStoreText.y = height / 2 - 125;
    this.openStoreText.buttonMode = true;
    this.openStoreText.interactive = true;
    this.openStoreText.on('pointerup', function(){this.gameState.bringUpTowerMenu("towerStore"); this.style.fill = '#ffffff'; this.style.stroke = '#000000';});
    this.openStoreText.on('pointerover', function(){this.style.fill = '#FFFF00'; this.style.stroke = '#000000';});
    this.openStoreText.on('pointerout', function(){this.style.fill = '#FFFFFF'; this.style.stroke = '#000000';});
    this.openStoreText.on('pointerdown', function(){this.style.fill = '#000000'; this.style.stroke = '#FFFF00';});
    this.sideMenuContainer.addChild(this.openStoreText);  

    // Store Button
    this.startRoundText = new PIXI.Text("Start Round", {
        font: "bold 35px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'right', // Center align the text
        stroke: '#000000', // Set stroke color
        strokeThickness: 10, // Set stroke thickness to 10
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.startRoundText.gameState = state;
    this.startRoundText.anchor.x = 0.5;
    this.startRoundText.y = height / 2 - 175;
    this.startRoundText.buttonMode = true;
    this.startRoundText.interactive = true;
    this.startRoundText.on('pointerup', function(){this.gameState.startRound(); this.style.fill = '#ffffff'; this.style.stroke = '#000000';});
    this.startRoundText.on('pointerover', function(){this.style.fill = '#FFFF00'; this.style.stroke = '#000000';});
    this.startRoundText.on('pointerout', function(){this.style.fill = '#FFFFFF'; this.style.stroke = '#000000';});
    this.startRoundText.on('pointerdown', function(){this.style.fill = '#000000'; this.style.stroke = '#FFFF00';});
    this.startRoundText.deactivate = function(){this.alpha = 0.5; this.interactive = false; this.style.fill = '#ffffff'; this.style.stroke = '#000000';};
    this.startRoundText.activate = function(){this.alpha = 1.0; this.interactive = true;};
    this.sideMenuContainer.addChild(this.startRoundText);  
 
    this.roundText = new PIXI.Text("Round " + this.gameState.roundNumber, {
        font: "bold 35px Arial",
        fill: ['#00AAFF', '#AAAAFF', '#00AAFF'],
        align: 'right',
        stroke: '#000000',
        strokeThickness: 10,
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.roundText.gameState = state;
    this.roundText.anchor.x = 0.5;
    this.roundText.y = height / 2 - 70;
    this.roundText.filters = [new PIXI.filters.ColorMatrixFilter()];
    this.sideMenuContainer.addChild(this.roundText);
    this.roundText.hueNumber = 0;
    this.roundText.hueMin = -220;
    this.roundText.hueDecrement = -5;
    this.roundText.nextRound = function(){
        if(this.hueNumber > this.hueMin)
            this.hueNumber += this.hueDecrement;
        this.filters[0].hue(this.hueNumber);
        this.text = "Round " + this.gameState.roundNumber;
    };
}

SideMenu.constructor = SideMenu;

SideMenu.prototype.createContainerTexture = function(width, height){
	var graphics = new PIXI.Graphics();
	graphics.beginFill(0xAAAACC);
	graphics.lineStyle(5, 0x0033AA);		
	graphics.drawRect(0, 0, width, height);
	return graphics.generateCanvasTexture();
}

SideMenu.prototype.tick = function(delta){
    this.inventory.tick(delta);
    this.bringToFront();
}

SideMenu.prototype.bringToFront = function(){
    stage.removeChild(this.sideMenuContainer);
    stage.addChild(this.sideMenuContainer);
}