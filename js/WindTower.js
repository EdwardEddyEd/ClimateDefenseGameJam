function WindTower(state, headPower, bodyFireRate, feetRange, renderTarget = null){
	Tower.call(this, state, headPower, bodyFireRate, feetRange, renderTarget, "windTower");
}

WindTower.constructor = WindTower;
WindTower.prototype = Object.create(Tower.prototype);

WindTower.prototype.fireProjectile = function(){
	let theta = Math.atan2(this.enemyTarget.y - this.y, this.enemyTarget.x - this.x) * 180 / Math.PI;
	let projectile = new WindProjectile(this.gameState, this.x, this.y, theta, this.headPower, stage, this.enemyTarget);
	this.gameState.addProjectile(projectile);
}

WindTower.powerArray = [1, 2, 3, 4];
WindTower.fireRateArray = [3, 4, 5];
WindTower.rangeArray = [3, 4, 5, 6, 7, 8];

WindTower.calculatePrice = function(power, rate, range){
	return (power + rate + range) * 10;
}