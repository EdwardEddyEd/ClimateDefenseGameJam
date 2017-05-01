function CO2Enemy(state, health, reward, damage, speed, delayRender, renderTarget, path){
	PIXI.Sprite.call(this, textureManager.getTexture("enemyCO2_Move1"));	

	// Enemy Variables
	this.gameState = state;
	this.towerType = "windTower";
	this.renderTarget = renderTarget;
	this.addToRenderTarget();

	this.path = path;
	
	// Animation
	this.isDone = false;		// Reached the end of its path
	this.isHit = false;			// Has been hit by projectile
	this.deathFrames = 16;
	this.moveFrames = 0;

	// TODO: Starting position
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.x = 544;
	this.y = 96;

	// Tower Detection Collision Points
	this.leftTop     = new PIXI.Point(this.x - 32, this.y - 32);
	this.rightTop    = new PIXI.Point(this.x + 32, this.y - 32);
	this.leftBottom  = new PIXI.Point(this.x - 32, this.y + 32);
	this.rightBottom = new PIXI.Point(this.x + 32, this.y + 32);

	this.scalingDelta = 0;
	this.scale = new PIXI.Point(2, 2);

	this.health      = health;
	this.reward      = reward;
	this.damage      = damage;
	this.speed       = speed;
	this.delayRender = delayRender;
	this.distanceDelta = 0;

	if(this.delayRender == 0){
		this.alpha = 1.0;
	}
}

CO2Enemy.constructor = CO2Enemy;
CO2Enemy.prototype = Object.create(PIXI.Sprite.prototype);

CO2Enemy.prototype.tick = function(delta){
	// Warping effect
	this.scale.x = 2 + (0.2 * Math.sin(this.scalingDelta * (Math.PI / 180) * (360 / 1000)));
	this.scale.y = 2 + (0.2 * Math.sin(this.scalingDelta * (Math.PI / 180) * (360 / 1000)));

	if(this.delayRender > 0){
		this.delayRender -= delta;
		this.delayRender = (this.delayRender < 0) ? 0 : this.delayRender;
		this.alpha = (this.delayRender < 250) ? ((250 - this.delayRender) / 250.0) : (0);
	}
	else if(!this.isHit){
		this.scalingDelta += delta;
		switch(this.moveFrames){
			case 0:
				this.texture = textureManager.getTexture("enemyCO2_Move1");
				break;
			case 12:
				this.texture = textureManager.getTexture("enemyCO2_Move2");
				break;
			case 23:
				this.moveFrames = -1;
				break;
		}
		this.moveFrames++;

		this.distanceDelta += delta;
		this.isDone = this.path.calcLocation(this.distanceDelta, this.speed, this);
		this.calcCollisionPoints();

		if(this.isDone){
			this.gameState.takeAwayIce(this.damage);
			this.deleteSelf();
		}
	}
	else{
		switch(this.deathFrames){
			case 16:
				this.texture = textureManager.getTexture("enemyCO2_Death1");
				break;
			case 8:
				this.texture = textureManager.getTexture("enemyCO2_Death2");
				break;
			case 4:
				this.texture = textureManager.getTexture("enemyCO2_Death3");
				break;
			case 0:
				this.deleteSelf();
				break;
		}
		this.deathFrames--;
	}
}

CO2Enemy.prototype.enemyIsHit = function(projectile){
	this.health -= projectile.damage;
	if(this.health <= 0 && !this.isHit){
		this.isHit = true;
		this.gameState.addIce(this.reward);
	}
}

CO2Enemy.prototype.checkCollision = function(projectile){
	if(projectile.x > this.leftTop.x && 
	   projectile.x < this.rightTop.x && 
	   projectile.y > this.leftTop.y &&
	   projectile.y < this.rightBottom.y){
		return true;
	}
	else
		return false;
}

CO2Enemy.prototype.setLocation = function(x, y){
	this.x = x;
	this.y = y;
}

CO2Enemy.prototype.calcCollisionPoints = function(){
	this.leftTop     = new PIXI.Point(this.x - 32, this.y - 32);
	this.rightTop    = new PIXI.Point(this.x + 32, this.y - 32);
	this.leftBottom  = new PIXI.Point(this.x - 32, this.y + 32);
	this.rightBottom = new PIXI.Point(this.x + 32, this.y + 32);
}

CO2Enemy.prototype.addToRenderTarget = function(){
	this.renderTarget.addChild(this);
}

CO2Enemy.prototype.deleteSelf = function(){
	this.isDone = true;
	this.renderTarget.removeChild(this);
	this.gameState.deleteEnemy(this);
}