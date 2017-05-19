function HydroProjectile(state, x, y, theta, damage, renderTarget, enemyTarget){
	Projectile.call(this, state, x, y, theta, damage, renderTarget, enemyTarget, "hydroTower");	
	this.speed = 1000;
}

HydroProjectile.constructor = HydroProjectile;
HydroProjectile.prototype = Object.create(Projectile.prototype);

HydroProjectile.prototype.tick = function(delta){
	Projectile.prototype.tick.call(this, delta);	// Call to superclass
}