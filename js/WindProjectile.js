function WindProjectile(state, x, y, theta, damage, renderTarget, enemyTarget){
	PIXI.Sprite.call(this, textureManager.getTexture("windTower_Proj_0"));	

	// Tower Variables
	this.gameState = state;
	this.renderTarget = renderTarget;
	this.renderTarget.addChild(this);
	this.enemyTarget = enemyTarget;

	this.isCollided = false;
	this.deathFrames = 8;
	this.aliveFrames = 90;

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.x = x;
	this.y = y;
	this.theta = theta;
	this.rotation = theta * Math.PI / 180;

	this.scale = new PIXI.Point(2, 2);

	this.damage = damage;
	this.speed = 1000;
}

WindProjectile.constructor = WindProjectile;
WindProjectile.prototype = Object.create(PIXI.Sprite.prototype);

WindProjectile.prototype.tick = function(delta){
	if(!this.isCollided)
		this.checkCollision();

	if(!this.isCollided){
		let deltaX = this.speed * (delta / 1000.0) * Math.cos(this.theta * (Math.PI/180));
		let deltaY = this.speed * (delta / 1000.0) * Math.sin(this.theta * (Math.PI/180));

		this.x += deltaX;
		this.y += deltaY;
	}
	else{
		switch(this.deathFrames){
			case 8:
				this.texture = textureManager.getTexture("windTower_Proj_Break1");
				break;
			case 4:
				this.texture = textureManager.getTexture("windTower_Proj_Break2");
				break;
			case 0:
				this.deleteSelf();
				break;
		}
		this.deathFrames--;
	}

	if(this.aliveFrames > 0)
		this.aliveFrames--;
	else
		this.deleteSelf();
}

WindProjectile.prototype.checkCollision = function(){
	if(this.enemyTarget.checkCollision(this)){
		this.enemyTarget.enemyIsHit(this);
		this.isCollided = true;
	}
	else{
		for(let i = 0; i < this.gameState.enemies.length; i++){
			let enemy = this.gameState.enemies[i];
			if(enemy.checkCollision(this)){
				enemy.enemyIsHit(this);
				this.isCollided = true;
				break;
			}
		}
	}
}

WindProjectile.prototype.deleteSelf = function(){
	this.renderTarget.removeChild(this);
	this.gameState.deleteProjectile(this);
}