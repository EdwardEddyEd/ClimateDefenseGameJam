function Inventory(state, y, renderTarget){
	this.gameState = state;
	this.renderTarget = renderTarget;
	this.towerInventory = [];
	this.length = 0;
	this.maxSize = 6;

	this.buttonPosY = [];
	this.spacingY = 90;
	this.width = 325;
	for(let i = 0; i < this.maxSize; i++)
		this.buttonPosY.push(y + this.spacingY * i);

	this.addTowerToInventory(new WindTower(this.gameState, 2, 1, 192));
	this.addTowerToInventory(new WindTower(this.gameState, 2, 2, 384));
	this.addTowerToInventory(new HydroTower(this.gameState, 5, 1, 192));
	this.addTowerToInventory(new HydroTower(this.gameState, 5, 2, 384));
	this.addTowerToInventory(new WindTower(this.gameState, 10, 10, 384));
	this.addTowerToInventory(new WindTower(this.gameState, 20, 5, 640));
}

Inventory.constructor = Inventory;

Inventory.prototype.tick = function(delta){

}

Inventory.prototype.addTowerToInventory = function(tower){
	let hash = this.towerHash(tower);
	if (this.towerInventory.hasOwnProperty(hash)) {
		if(this.towerInventory[hash].maxCount < this.towerInventory[hash].count + 1)
			return;
    	this.towerInventory[hash].addTower();
	}
	else{
		let button = new InventoryButton(this.gameState, 
										 tower, 
										 0, 
										 this.buttonPosY[this.length], 
										 this.width, 
										 this.spacingY - 10, 
										 this.renderTarget);
		this.length++;
		this.towerInventory[hash] = button;
	}
}

Inventory.prototype.towerHash = function(tower){
	return tower.towerType + "." + tower.headPower + "." + tower.bodyFireRate + "." + tower.feetRange;
}

Inventory.prototype.removeTowerFromInventory = function(tower){
	let hash = this.towerHash(tower);
	this.towerInventory[hash].subtractTower();
	if(this.towerInventory[hash].count == 0){
		this.towerInventory[hash].deleteButton();
		delete this.towerInventory[hash];
		this.recalibrateInventory();
	}
}

Inventory.prototype.recalibrateInventory = function(){
	let i = 0;
	for (let key in this.towerInventory) {
 		if (this.towerInventory.hasOwnProperty(key))
 			this.towerInventory[key].y = this.buttonPosY[i];
 			i++;
	}
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
