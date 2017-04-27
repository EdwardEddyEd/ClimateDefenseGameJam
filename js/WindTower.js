function WindTower(state, headPower, bodyFireRate, feetRange, renderTarget = null){
	PIXI.Sprite.call(this, textureManager.getTexture("windTower_Idle"));	

	// Tower Variables
	this.gameState = state;
	this.towerType = "windTower";
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

WindTower.constructor = WindTower;
WindTower.prototype = Object.create(PIXI.Sprite.prototype);

WindTower.prototype.tick = function(delta){

}

WindTower.prototype.fireProjectile = function(){

}

WindTower.prototype.moveToNewRenderTarget = function(renderTarget){
	renderTarget.addChild(this);
	this.visible = true;
}

WindTower.prototype.setLocation = function(point){
	this.x = point.x;
	this.y = point.y;
}

WindTower.prototype.addToRenderTarget = function(){
	this.renderTarget.addChild(this);
}

WindTower.prototype.removeFromRenderTarget = function(){
	this.renderTarget.removeChild(this);
}