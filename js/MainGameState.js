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

	this.path1X = [7, 7, 8, 8, 6, 6, 12, 12, 6, 6, 9,  9,  8,  8];
	this.path1Y = [0, 2, 2, 3, 3, 7,  7,  3, 3, 7, 7, 13, 13, 14];
	this.path1 = new EnemyPath(this, this.map, this.path1X, this.path1Y);

	this.iceAmount = 320;	// 160; 400; 700;
	this.sideUIMenu = new SideMenu(this, CANVAS_WIDTH - 200, CANVAS_HEIGHT / 2 + 4, 350, CANVAS_HEIGHT - 120);

	for(let i = 0; i < 10000; i += 200){	// (3000, 300), (10000, 200), (50000, 100)
		this.enemies.push(new CO2Enemy(this, 10, 10, 10, 100, i, stage, this.path1));
	}

	this.towerUIMenu = new TowerUIMenu(this, 400, 400, 350, 600);
}

// Set MainGameState as the constructor 
MainGameState.constructor = MainGameState;

MainGameState.prototype.tick = function(delta){
	this.map.tick(delta);
	for(let i = 0; i < this.towers.length; i++)
		this.towers[i].tick(delta);
	for(let i = 0; i < this.projectiles.length; i++)
		this.projectiles[i].tick(delta);
	for(let i = 0; i < this.enemies.length; i++)
		this.enemies[i].tick(delta);

	if(this.towerUIMenu.towerMenuContainer.visible)
		this.towerUIMenu.tick(delta);
}

// TODO:
// For selection Mode, turn on tower interactivity when selectionMode is off. Else, turn off.
// TODO:

MainGameState.prototype.selectionModeOn = function(tower, button){
	this.sideUIMenu.inventory.deactivateButtons();			// TODO: Doesn't work like it should and should be placed after map.activateSelection();
	this.buttonSelected = button;
	this.towerToBeAdded = tower;

	this.buttonSelected.interactive = false;
	this.map.activateSelection();
	this.deactivateTowerSelection();
}

MainGameState.prototype.selectionModeCancel = function(){
	this.map.deactivateSelection();
	this.activateTowerSelection();
	this.sideUIMenu.inventory.activateButtons();			// TODO: Doesn't work like it should

	this.buttonSelected.interactive = true;
	this.buttonSelected.texture = textureManager.getTexture("inventoryButton_Up");

	this.buttonSelected = null;
	this.towerToBeAdded = null;
}

MainGameState.prototype.selectionModeComplete = function(square){
	this.map.deactivateSelection();
	this.activateTowerSelection();
	this.sideUIMenu.inventory.activateButtons();			// TODO: Doesn't work like it should

	// CODE FOR BUYING TOWER - FIXME
/*	let buttonTower = this.buttonSelected.tower;
	let buttonSum = (buttonTower.headPower + buttonTower.bodyFireRate + (buttonTower.feetRange/64)) * 10;
	if(buttonSum > this.iceAmount){
		this.selectionModeCancel();
		return;
	}
	this.takeAwayIce(buttonSum);*/
	// CODE FOR BUYING TOWER - FIXME
	

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

MainGameState.prototype.takeAwayIce = function(damage){
	this.iceAmount -= damage;
	this.sideUIMenu.iceCountText.text = "ICE: " + this.iceAmount;
}

MainGameState.prototype.addIce = function(addition){
	this.iceAmount += addition;
	this.sideUIMenu.iceCountText.text = "ICE: " + this.iceAmount;
}

MainGameState.prototype.addTower = function(tower){
	this.towers.push(tower);
	tower.addToRenderTarget();
}

MainGameState.prototype.deleteTower = function(tower){

}

MainGameState.prototype.addEnemy = function(enemy){
	this.enemies.push(enemy);
}

MainGameState.prototype.deleteEnemy = function(enemy){
	this.enemies.splice(this.enemies.indexOf(enemy), 1);
}

MainGameState.prototype.addProjectile = function(projectile){
	this.projectiles.push(projectile);
}

MainGameState.prototype.deleteProjectile = function(projectile){
	this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
}

MainGameState.prototype.activateTowerSelection = function(){
	for(let i = 0; i < this.towers.length; i++)
		this.towers[i].interactive = true;
}

MainGameState.prototype.deactivateTowerSelection = function(){
	for(let i = 0; i < this.towers.length; i++)
		this.towers[i].interactive = false;
}

MainGameState.prototype.bringUpTowerMenu = function(){
	this.towerUIMenu.openStore();
}