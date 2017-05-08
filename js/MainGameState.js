function MainGameState(){
	// GameState variables
	this.tickBottomState = false;

	// Variables for selectionMode
	this.buttonSelected = null;
	this.towerToBeAdded = null;

	// Variable about current round
	this.roundInSession = false;
	this.roundNumber = 1;
	this.roundReward = 0;

	// Variables specific to this GameState
	this.towers =[];
	this.enemies =[];
	this.projectiles =[];

	this.map = new OverworldMap(this, 64, 64, 2);

	this.path1X = [7, 7, 8, 8, 6, 6, 12, 12, 6, 6, 9,  9,  8,  8];
	this.path1Y = [0, 2, 2, 3, 3, 7,  7,  3, 3, 7, 7, 13, 13, 14];
	this.path2X = [7, 7, 5, 5, 4, 4, 3, 3, 2,  2,  1,  1,  0];
	this.path2Y = [0, 3, 3, 5, 5, 8, 8, 9, 9, 10, 10, 11, 11];
	this.path3X = [7, 7, 12, 12, 11, 11, 10, 10,  9,  9];
	this.path3Y = [0, 3,  3, 11, 11, 12, 12, 13, 13, 14];
	this.path1 = new EnemyPath(this, this.map, this.path1X, this.path1Y);
	this.path2 = new EnemyPath(this, this.map, this.path2X, this.path2Y);
	this.path3 = new EnemyPath(this, this.map, this.path3X, this.path3Y);

	this.iceAmount = 160;
	this.sideUIMenu = new SideMenu(this, CANVAS_WIDTH - 200, CANVAS_HEIGHT / 2 + 4, 350, CANVAS_HEIGHT - 120);
	this.sideUIMenu.startRoundText.deactivate();

	this.towerUIMenu = new TowerUIMenu(this, 350, 600);
	this.towerUIMenu.closeStore();

	this.loadRound();
}

// Set MainGameState as the constructor 
MainGameState.constructor = MainGameState;

MainGameState.prototype.tick = function(delta){
	this.map.tick(delta);
	for(let i = 0; i < this.towers.length; i++)
		this.towers[i].tick(delta);
	for(let i = 0; i < this.projectiles.length; i++)
		this.projectiles[i].tick(delta);

	// Determine enemies movement
	if(this.roundInSession){
		this.enemies.sort(this.sortEnemies);
		if(this.enemies.length > 0){
			for(let i = 0; i < this.enemies.length; i++)
				this.enemies[i].tick(delta);
		}
		else{
			this.roundInSession = false;
			this.endRound();
		}
	}

	this.sideUIMenu.tick(delta);
	if(this.towerUIMenu.towerMenuContainer.visible)
		this.towerUIMenu.tick(delta);
}

MainGameState.prototype.selectionModeOn = function(tower, button){
	this.sideUIMenu.inventory.deactivateButtons();
	this.buttonSelected = button;
	this.towerToBeAdded = tower;

	this.buttonSelected.interactive = false;
	this.map.activateSelection();
	this.deactivateTowerSelection();
}

MainGameState.prototype.selectionModeCancel = function(){
	this.map.deactivateSelection();
	this.activateTowerSelection();
	this.sideUIMenu.inventory.activateButtons();

	this.buttonSelected.interactive = true;
	this.buttonSelected.texture = textureManager.getTexture("inventoryButton_Up");

	this.buttonSelected = null;
	this.towerToBeAdded = null;
}

MainGameState.prototype.selectionModeComplete = function(square){
	this.map.deactivateSelection();
	this.activateTowerSelection();
	this.sideUIMenu.inventory.activateButtons();
	
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

MainGameState.prototype.purchaseTower = function(towerType, power, firerate, range, price){
	if(price > this.iceAmount)
		return;		// TODO: Give feedback saying that purchase could not be made
	else
		this.takeAwayIce(price);

	switch(towerType){
		case "windTower":
			this.sideUIMenu.inventory.addTowerToInventory(new WindTower(this, power, firerate, range));
			break;
		case "hydroTower":
			this.sideUIMenu.inventory.addTowerToInventory(new HydroTower(this, power, firerate, range));
			break;
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

MainGameState.prototype.startRound = function(){
	this.roundInSession = true;
	this.sideUIMenu.startRoundText.deactivate();
}

MainGameState.prototype.loadRound = function(){
	// Get info about next round
	let selfRef = this;
	$.getJSON("rounds/Round_" + this.roundNumber + ".json", function(data){
		selfRef.parseRoundJson(data);
		selfRef.sideUIMenu.startRoundText.activate();
	});
}

MainGameState.prototype.parseRoundJson = function(enemyObj){
	for(let i = 0; i < enemyObj.enemies.length; i++){
		let enemy = enemyObj.enemies[i];

		for(let j = enemy.delayRender; j < (enemy.delayRender + enemy.howMany * enemy.delaySeparate); j += enemy.delaySeparate){	// (3000, 300), (10000, 200), (50000, 100)
			let pathNum = enemy.pathes[Math.floor(Math.random() * enemy.pathes.length)];
			let path;

			switch(pathNum){
				case 1:
					path = this.path1;
					break;
				case 2:
					path = this.path2;
					break;
				case 3:
					path = this.path3;
					break;
			};

			switch(enemy.type){
				case "CO2Enemy":
					this.addEnemy(new CO2Enemy(this, 
						  		  enemy.health, 
						  		  enemy.reward, 
						  		  enemy.damage, 
						  		  enemy.speed, 
						  		  j, 
						  		  stage, 
						  		  path));
				default:
					console.log("ERROR: Round " + this.roundNumber + ": Enemy Index " + i);
			};
		}
	}

	this.roundReward = enemyObj.roundReward;
}

MainGameState.prototype.endRound = function(){
	this.addIce(this.roundReward);
	this.roundNumber++;
	this.sideUIMenu.roundText.nextRound();
	this.loadRound();
}

MainGameState.prototype.bringUpTowerMenu = function(){
	this.towerUIMenu.openStore();
}

MainGameState.prototype.sortEnemies = function(a, b){
	if(a.distanceDelta > b.distanceDelta)
		return -1;
	if(a.distanceDelta < b.distanceDelta)
		return 1;
	return 0;
}