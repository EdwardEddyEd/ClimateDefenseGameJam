function MainGameState(){
	// GameState variables
	this.tickBottomState = false;

	// Variables for selectionMode
	this.buttonSelected = null;
	this.towerToBeAdded = null;

	// Variables specific to this GameState
	this.towers =[];
	this.enemies =[];
	this.projectiles =[];

	this.map = new OverworldMap(this, 64, 64, 2);
	// this.map.activateSelection();

	this.iceAmount = 160;
	this.sideUIMenu = new SideMenu(this, CANVAS_WIDTH - 200, CANVAS_HEIGHT / 2 + 4, 350, CANVAS_HEIGHT - 120);
}

// Set MainGameState as the constructor 
MainGameState.constructor = MainGameState;

MainGameState.prototype.tick = function(delta){
	this.map.tick(delta);
}

// TODO:
// For selection Mode, turn on tower interactivity when selectionMode is off. Else, turn off.
// TODO:

MainGameState.prototype.selectionModeOn = function(tower, button){
	this.buttonSelected = button;
	this.towerToBeAdded = tower;

	this.buttonSelected.interactive = false;
	this.map.activateSelection();
}

MainGameState.prototype.selectionModeCancel = function(){
	this.map.deactivateSelection();
	this.buttonSelected.interactive = true;
	this.buttonSelected.texture = textureManager.getTexture("inventoryButton_Up");

	this.buttonSelected = null;
	this.towerToBeAdded = null;
}

MainGameState.prototype.selectionModeComplete = function(square){
	this.map.deactivateSelection();

	let newTower = this.copyTower(this.towerToBeAdded);
	newTower.setLocation(square.getCenter());

	this.sideUIMenu.inventory.removeTowerFromInventory(this.towerToBeAdded);
	square.addTower(newTower);
	this.addTower(newTower);

	this.buttonSelected.interactive = true;
	this.buttonSelected.texture = textureManager.getTexture("inventoryButton_Up");
	this.buttonSelected = null;
	this.towerToBeAdded = null;
}

MainGameState.prototype.copyTower = function(tower){
	switch(tower.towerType){
		case "windTower":
			return new WindTower(this, tower.headPower, tower.bodyFireRate, tower.feetRange, stage);
		case "hydroTower":
			return new HydroTower(this, tower.headPower, tower.bodyFireRate, tower.feetRange, stage);
	}
}

MainGameState.prototype.addTower = function(tower){
	this.towers.push(tower);
	tower.addToRenderTarget();
}

MainGameState.prototype.deleteTower = function(tower){

}

MainGameState.prototype.addEnemy = function(){

}

MainGameState.prototype.deleteEnemy = function(){

}

MainGameState.prototype.addProjectile = function(){

}

MainGameState.prototype.deleteProjectile = function(){

}

// TODO:
MainGameState.prototype.activateTowerSelection = function(){

}

// TODO: 
MainGameState.prototype.deactivateTowerSelection = function(){

}