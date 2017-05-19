function WindProjectile(state, x, y, theta, damage, renderTarget, enemyTarget){
	Projectile.call(this, state, x, y, theta, damage, renderTarget, enemyTarget, "windTower");	
	this.speed = 1000;
}

WindProjectile.constructor = WindProjectile;
WindProjectile.prototype = Object.create(Projectile.prototype);

WindProjectile.prototype.tick = function(delta){
	Projectile.prototype.tick.call(this, delta);	// Call to superclass
	// this.speed -= delta * 0.7;
}