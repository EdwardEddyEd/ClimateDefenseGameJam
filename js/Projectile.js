function Projectile(state, x, y, theta, damage, renderTarget, enemyTarget, towerType){
	PIXI.Sprite.call(this, textureManager.getTexture(towerType + "_Proj_Horiz"));	

	// Tower Variables
	this.gameState = state;
	this.towerType = towerType;
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
}

Projectile.constructor = Projectile;
Projectile.prototype = Object.create(PIXI.Sprite.prototype);

Projectile.prototype.tick = function(delta){
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
				this.texture = textureManager.getTexture(this.towerType + "_Proj_Break1");
				break;
			case 4:
				this.texture = textureManager.getTexture(this.towerType + "_Proj_Break2");
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

Projectile.prototype.checkCollision = function(){
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

Projectile.prototype.deleteSelf = function(){
	this.renderTarget.removeChild(this);
	this.gameState.deleteProjectile(this);
}