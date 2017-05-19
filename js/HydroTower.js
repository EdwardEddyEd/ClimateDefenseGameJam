function HydroTower(state, headPower, bodyFireRate, feetRange, renderTarget = null){
	Tower.call(this, state, headPower, bodyFireRate, feetRange, renderTarget, "hydroTower");
}

HydroTower.constructor = HydroTower;
HydroTower.prototype = Object.create(Tower.prototype);

HydroTower.prototype.fireProjectile = function(){
	let theta = Math.atan2(this.enemyTarget.y - this.y, this.enemyTarget.x - this.x) * 180 / Math.PI;
	let projectile = new HydroProjectile(this.gameState, this.x, this.y, theta, this.headPower, stage, this.enemyTarget);
	this.gameState.addProjectile(projectile);
}

HydroTower.powerArray = [5, 6, 7, 9];
HydroTower.fireRateArray = [1, 2, 3];
HydroTower.rangeArray = [3, 4, 5, 6];

HydroTower.calculatePrice = function(power, rate, range){
	return (power + rate + range) * 10;
}