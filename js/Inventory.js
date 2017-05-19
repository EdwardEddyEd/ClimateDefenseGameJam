function Inventory(state, y, renderTarget){
	this.gameState = state;
	this.renderTarget = renderTarget;
	this.towerInventory = [];
	this.length = 0;
	this.currentPage = 0;
	this.maxSize = 6;

	this.buttonPosY = [];
	this.spacingY = 90;
	this.width = 325;
	for(let i = 0; i < this.maxSize; i++)
		this.buttonPosY.push(y + this.spacingY * i);

	this.leftPageArrow = new InventoryArrow(state, this, renderTarget, -100, 250, "left_arrow", this.leftArrowPress, 0.5, 0.5);
	this.rightPageArrow = new InventoryArrow(state, this, renderTarget, 100, 250, "right_arrow", this.rightArrowPress, 0.5, 0.5);
	this.leftPageArrow.disableButton();
	this.rightPageArrow.disableButton();

	this.pageText = new PIXI.Text("Page " + (this.currentPage + 1), {
        font: "bold underline 35px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 5, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    });
    this.pageText.anchor.x = 0.5;
    this.pageText.anchor.y = 0.5;
    this.pageText.y = 250;
    this.renderTarget.addChild(this.pageText);
}

Inventory.constructor = Inventory;

Inventory.prototype.tick = function(delta){
	this.leftPageArrow.tick(delta);
	this.rightPageArrow.tick(delta);
}

Inventory.prototype.addTowerToInventory = function(tower){
	let hash = this.towerHash(tower);
	if (this.towerInventory.hasOwnProperty(hash)) {
		if(this.towerInventory[hash].maxCount < this.towerInventory[hash].count + 1){
			return;
		}
    	this.towerInventory[hash].addTower();
	}
	else{
		let button = new InventoryButton(this.gameState, 
										 tower, 
										 0, 
										 this.buttonPosY[this.length % this.maxSize], 
										 this.width, 
										 this.spacingY - 10, 
										 this.renderTarget);

		this.length++;
		this.towerInventory[hash] = button;

		// Determine if button should be visible
		let numButton = (this.currentPage + 1) * this.maxSize - this.length;
		if(numButton < 0 || numButton >= 6)
			this.towerInventory[hash].visible = false;

		// If right arrow button should be enabled
		if(this.length / this.maxSize > this.currentPage + 1)
			this.rightPageArrow.enableButton();
	}
}

Inventory.prototype.towerHash = function(tower){
	return tower.towerType + "." + tower.headPower + "." + tower.bodyFireRate + "." + tower.feetRange;
}

Inventory.prototype.removeTowerFromInventory = function(tower){
	let hash = this.towerHash(tower);
	this.towerInventory[hash].subtractTower();
	if(this.towerInventory[hash].count == 0){
		this.length--;
		this.towerInventory[hash].deleteButton();
		delete this.towerInventory[hash];
		this.recalibrateInventory();
	}
}

Inventory.prototype.recalibrateInventory = function(){
	let i = 0;
	let page = 0;
	for (let key in this.towerInventory) {
 		if (this.towerInventory.hasOwnProperty(key))
 			this.towerInventory[key].y = this.buttonPosY[i % this.maxSize];
 			i++;

 			// Tower visibility
 			if(page == this.currentPage)
 				this.towerInventory[key].visible = true;
 			else
 				this.towerInventory[key].visible = false;

 			if(i%6 == 0)
 				page++;
	}

	// TODO: If length is below 7, disable page arrows
	if(this.length < 7){
		this.leftPageArrow.disableButton();
		this.rightPageArrow.disableButton();
	}

	// If current page runs out of towers, change page to prev and call recalibrateInventory again
	if(this.currentPage * this.maxSize >= this.length && this.length != 0){
		this.currentPage--;
		this.recalibrateInventory();
		this.rightPageArrow.disableButton();
	}

	this.changePageText();
}

Inventory.prototype.leftArrowPress = function() {
	this.inventory.currentPage--;
	if(this.inventory.currentPage == 0)
		this.disableButton();

	this.inventory.recalibrateInventory();
	this.inventory.rightPageArrow.enableButton();
}

Inventory.prototype.rightArrowPress = function() {
	this.inventory.currentPage++;
	if((this.inventory.currentPage + 1) * this.inventory.maxSize >= this.inventory.length)
		this.disableButton();

	this.inventory.recalibrateInventory();
	this.inventory.leftPageArrow.enableButton();
}

Inventory.prototype.changePageText = function(){
	this.pageText.text = "Page " + (this.currentPage + 1);
}

Inventory.prototype.activateButtons = function(){
	for (let key in this.towerInventory) {
 		if (this.towerInventory.hasOwnProperty(key))
 			this.towerInventory[key].activate();
	}
}

Inventory.prototype.deactivateButtons = function(){
	for (let key in this.towerInventory) {
 		if (this.towerInventory.hasOwnProperty(key))
 			this.towerInventory[key].deactivate();
	} 
}