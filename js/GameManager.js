function GameManager(){

	this.gameStateStack = [];
	this.currentState = -1;

	this.prevTime = Date.now();
	this.currTime = this.prevTime;
}

// Set GameManager as constructor
GameManager.constructor = GameManager;

GameManager.prototype.addGameState = function(gameState){
	// TODO: Deactivate current state function
	if(this.currentState != -1){
		
	}

	this.currentState++;
	this.gameStateStack.push(gameState);
}

GameManager.prototype.removeGameState = function(){
	this.currentState--;
	let removedState = this.gameStateStack.pop();

	// Delete removedState

	// Reactivate current State

}

GameManager.prototype.tick = function(){
	this.currTime = Date.now();
	let delta = this.currTime - this.prevTime;
	this.prevTime = this.currTime;
	
	this.gameStateStack[this.currentState].tick(delta);
}