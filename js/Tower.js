function Tower(state, headPower, bodyFireRate, feetRange, renderTarget = null, towerType){
	PIXI.Sprite.call(this, textureManager.getTexture(towerType + "_Idle"));	

	// Tower Variables
	this.gameState = state;
	this.towerType = towerType;
	this.renderTarget = renderTarget;

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.x = 0;
	this.y = 0;

	this.scale = new PIXI.Point(2, 2);

	this.headPower = headPower;
	this.bodyFireRate = bodyFireRate;
	this.feetRange = feetRange;

	this.attackTowerModeIndex = 0;

	this.beenSelected = false;

	this.moveFrames = 0;
	this.deltaDelayFire = 0;

	this.rangeCircle = new PIXI.Sprite(this.createRangeCircle(this.feetRange));
	this.rangeCircle.visible = false;

	this.enemyTarget = null;

	this.filters = [new PIXI.filters.ColorMatrixFilter()];

	// TODO: Add interactivity when on the board
	this.hovering = false;
	this.hoveringDelta = 0;
	this.buttonMode = true;
	this.interactive = true;
	this.createInteraction();
}

Tower.constructor = Tower;
Tower.prototype = Object.create(PIXI.Sprite.prototype);

Tower.attackTowerModes = ["Furthest Distance Travelled", "Only Path 1", "Only Path 2", "Only Path 3"];

Tower.prototype.createRangeCircle = function(radius){
	var graphics = new PIXI.Graphics();
	graphics.beginFill(0x00FF00, .50);
	graphics.lineStyle(2, 0x006600);		
	graphics.drawCircle(0, 0, radius);
	return graphics.generateCanvasTexture();
}

Tower.prototype.createInteraction = function(){
	function onButtonDown(){
		this.hovering = true;
	}

	function onButtonUp(){
		this.hovering = false;
		this.gameState.bringUpTowerMenu("towerInfo", this);
	}

	function onButtonUpOutside(){
		// Turn Brightness back down
		this.filters[0].brightness(1);
		this.hovering = false;
		this.hoveringDelta = 0;
	}

	function onButtonOver(){
		// Turn Brightness half up
		this.filters[0].brightness(1.25);
		this.hovering = true;
	}

	function onButtonOut(){
		// Turn brightness back down
		this.filters[0].brightness(1);
		this.hovering = false;
		this.hoveringDelta = 0;
	}

    this
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUpOutside)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);
}

Tower.prototype.tick = function(delta){
	if(this.hovering || this.beenSelected){
		this.hoveringDelta += delta;
		let brightness = 1.25 - (0.25 * Math.cos(this.hoveringDelta * (Math.PI / 180) * (540 / 1000)));
		this.filters[0].brightness(brightness);
	}

	// Do not proceed if round is not in session
	if(!this.gameState.roundInSession)
		return;

	// Check for nearby enemies
	this.getEnemy();
	if(this.deltaDelayFire > 0)
		this.deltaDelayFire -= delta;

	if(this.enemyTarget != null){
		// Animation
		switch(this.moveFrames){
			case 0:
				this.texture = textureManager.getTexture(this.towerType + "_Active1");
				break;
			case 4:
				this.texture = textureManager.getTexture(this.towerType + "_Active2");
				break;
			case 12:
				this.texture = textureManager.getTexture(this.towerType + "_Idle");
				break;
			case 15:
				this.moveFrames = -1;
				break;
		}
		this.moveFrames++;

		// Firing
		if(this.deltaDelayFire <= 0){
			this.fireProjectile();
			this.deltaDelayFire = 1000.0 / this.bodyFireRate;
		}
	}
	else{
		this.texture = textureManager.getTexture(this.towerType + "_Idle");
		this.moveFrames = 0;
	}
}

Tower.prototype.getEnemy = function(){
	if(this.attackTowerModeIndex >= 0 && this.attackTowerModeIndex <= 3){
		for(let i = 0; i < this.gameState.enemies.length; i++){
			let enemy = this.gameState.enemies[i];
			if(this.distanceBetween(this, enemy) <= this.feetRange && enemy.isMoving){
				if(this.attackTowerModeIndex == 0){
					this.enemyTarget = enemy;
					return;
				}
				else if(this.attackTowerModeIndex == 1 && enemy.path.getPathNumber() == 1){
					this.enemyTarget = enemy;
					return;
				}
				else if(this.attackTowerModeIndex == 2 && enemy.path.getPathNumber() == 2){
					this.enemyTarget = enemy;
					return;
				}
				else if(this.attackTowerModeIndex == 3 && enemy.path.getPathNumber() == 3){
					this.enemyTarget = enemy;
					return;
				}
			}
		}
	}

	this.enemyTarget = null;
}

Tower.prototype.distanceBetween = function(start, end) {
	return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));	
}

Tower.prototype.activateInteractive = function(){
	this.interactive = true;
}

Tower.prototype.deactivateInteractive = function(){
	this.interactive = false;
}

Tower.prototype.setLocation = function(point){
	this.x = point.x;
	this.y = point.y;
}

Tower.prototype.addToRenderTarget = function(){
	this.rangeCircle.anchor.x = 0.5;
	this.rangeCircle.anchor.y = 0.5;
	this.rangeCircle.x = this.x;
	this.rangeCircle.y = this.y;
	this.renderTarget.addChild(this.rangeCircle);
	this.renderTarget.addChild(this);
}

Tower.prototype.removeFromRenderTarget = function(){
	this.renderTarget.removeChild(this.rangeCircle);
	this.renderTarget.removeChild(this);
}

Tower.prototype.bringToFront = function(){
	this.removeFromRenderTarget();
	this.addToRenderTarget();
}

Tower.prototype.getAttackTowerMode = function(){
	return Tower.attackTowerModes[this.attackTowerModeIndex];
}

Tower.prototype.decrementAttackTowerMode = function(){
	this.attackTowerModeIndex = (this.attackTowerModeIndex + Tower.attackTowerModes.length - 1) % Tower.attackTowerModes.length;
}

Tower.prototype.incrementAttackTowerMode = function(){
	this.attackTowerModeIndex = (this.attackTowerModeIndex + Tower.attackTowerModes.length + 1) % Tower.attackTowerModes.length;
}

Tower.prototype.hasBeenSelected = function(){
	this.rangeCircle.visible = true;
	this.beenSelected = true;
}

Tower.prototype.hasBeenDeselected = function(){
	this.rangeCircle.visible = false;
	this.beenSelected = false;
	this.filters[0].brightness(1);
}