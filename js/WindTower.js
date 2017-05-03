function WindTower(state, headPower, bodyFireRate, feetRange, renderTarget = null){
	PIXI.Sprite.call(this, textureManager.getTexture("windTower_Idle"));	

	// Tower Variables
	this.gameState = state;
	this.towerType = "windTower";
	this.renderTarget = renderTarget;

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.x = 0;
	this.y = 0;

	this.scale = new PIXI.Point(2, 2);

	this.headPower = headPower;
	this.bodyFireRate = bodyFireRate;
	this.feetRange = feetRange;

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

WindTower.constructor = WindTower;
WindTower.prototype = Object.create(PIXI.Sprite.prototype);

WindTower.prototype.createRangeCircle = function(radius){
	var graphics = new PIXI.Graphics();
	graphics.beginFill(0x00FF00, .50);
	graphics.lineStyle(2, 0x006600);		
	graphics.drawCircle(0, 0, radius);
	return graphics.generateCanvasTexture();
}

WindTower.prototype.createInteraction = function(){
	function onButtonDown(){
		this.hovering = true;
		this.rangeCircle.visible = true;
	}

	function onButtonUp(){
		// Turn Brightness back down
		this.filters[0].brightness(1);
		this.hovering = false;
	}

	function onButtonUpOutside(){
		// Turn Brightness back down
		this.filters[0].brightness(1);
		this.hovering = false;
		this.hoveringDelta = 0;
		this.rangeCircle.visible = false;
	}

	function onButtonOver(){
		// Turn Brightness half up
		this.filters[0].brightness(1.25);
		this.hovering = true;
		this.rangeCircle.visible = true;
	}

	function onButtonOut(){
		// Turn brightness back down
		this.filters[0].brightness(1);
		this.hovering = false;
		this.hoveringDelta = 0;
		this.rangeCircle.visible = false;
	}

    this
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUpOutside)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);
}

WindTower.prototype.tick = function(delta){
	if(this.hovering){
		this.hoveringDelta += delta;
		let brightness = 1.25 - (0.25 * Math.cos(this.hoveringDelta * (Math.PI / 180) * (540 / 1000)));
		this.filters[0].brightness(brightness);
	}

	// Check for nearby enemies
	this.getEnemy();
	if(this.deltaDelayFire > 0)
		this.deltaDelayFire -= delta;

	if(this.enemyTarget != null){
		// Animation
		switch(this.moveFrames){
			case 0:
				this.texture = textureManager.getTexture("windTower_Active1");
				break;
			case 4:
				this.texture = textureManager.getTexture("windTower_Active2");
				break;
			case 12:
				this.texture = textureManager.getTexture("windTower_Idle");
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
		this.texture = textureManager.getTexture("windTower_Idle");
		this.moveFrames = 0;
	}
}

WindTower.prototype.getEnemy = function(){
	if(this.enemyTarget != null){
		if(this.distanceBetween(this, this.enemyTarget) > this.feetRange || this.enemyTarget.isDone)
			this.enemyTarget = null;
		else
			return;
	}

	for(let i = 0; i < this.gameState.enemies.length; i++){
		let enemy = this.gameState.enemies[i];
		if(this.distanceBetween(this, enemy) <= this.feetRange){
			this.enemyTarget = enemy;
			break;
		}
	}
}

WindTower.prototype.distanceBetween = function(start, end) {
	return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));	
}

WindTower.prototype.fireProjectile = function(){
	let theta = Math.atan2(this.enemyTarget.y - this.y, this.enemyTarget.x - this.x) * 180 / Math.PI;
	let projectile = new WindProjectile(this.gameState, this.x, this.y, theta, this.headPower, stage, this.enemyTarget);
	this.gameState.addProjectile(projectile);
}

WindTower.prototype.activateInteractive = function(){
	this.interactive = true;
}

WindTower.prototype.deactivateInteractive = function(){
	this.interactive = false;
}

WindTower.prototype.setLocation = function(point){
	this.x = point.x;
	this.y = point.y;
}

WindTower.prototype.addToRenderTarget = function(){
	this.rangeCircle.anchor.x = 0.5;
	this.rangeCircle.anchor.y = 0.5;
	this.rangeCircle.x = this.x;
	this.rangeCircle.y = this.y;
	this.renderTarget.addChild(this.rangeCircle);
	this.renderTarget.addChild(this);
}

WindTower.prototype.removeFromRenderTarget = function(){
	this.renderTarget.removeChild(this.rangeCircle);
	this.renderTarget.removeChild(this);
}