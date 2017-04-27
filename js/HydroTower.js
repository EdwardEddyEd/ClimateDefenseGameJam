function HydroTower(state, headPower, bodyFireRate, feetRange, renderTarget = null){
	PIXI.Sprite.call(this, textureManager.getTexture("hydroTower_Idle"));

	// Tower Variables
	this.gameState = state;
	this.towerType = "hydroTower";
	this.renderTarget = renderTarget;

	// Asynchronous Safe Variable
	this.setForDeath = false;

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.x = 0;
	this.y = 0;

	this.scale = new PIXI.Point(2, 2);

	this.headPower = headPower;
	this.bodyFireRate = bodyFireRate;
	this.feetRange = feetRange;

	// TODO: Add interactivity when on the board
}

HydroTower.constructor = HydroTower;
HydroTower.prototype = Object.create(PIXI.Sprite.prototype);

HydroTower.prototype.tick = function(delta){

}

HydroTower.prototype.getInfo = function(){

}

HydroTower.prototype.fireProjectile = function(){

}

HydroTower.prototype.moveToNewRenderTarget = function(renderTarget){
	renderTarget.addChild(this);
	this.visible = true;
}

HydroTower.prototype.setLocation = function(point){
	this.x = point.x;
	this.y = point.y;
}

HydroTower.prototype.addToRenderTarget = function(){
	this.renderTarget.addChild(this);
}

HydroTower.prototype.removeFromRenderTarget = function(){
	this.renderTarget.removeChild(this);
}