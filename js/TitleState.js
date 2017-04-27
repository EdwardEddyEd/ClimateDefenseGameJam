function TitleState(){
	this.title = this.createTitle("CLIMATE DEFENSE");
	this.titleCenterX = this.title.x;
	this.titleCenterY = this.title.y;
	this.titleDeltaSum = 0;

	this.playButtonTexture = [];

	this.playButton = this.createPlayButton();
}

// Set TitleState as the constructor
TitleState.constructor = TitleState;

TitleState.prototype.createTitle = function(title){
	var textOptions = {
        font: "bold 180px Arial", // Set style, size and font
        fill: '#ffffff', // Set fill color to white
        align: 'center', // Center align the text
        strokeThickness: 20, // Set stroke thickness to 20
        lineJoin: 'round' // Set the lineJoin to round instead of 'miter'
    }

	var titleText = new PIXI.Text(title, textOptions);
	titleText.anchor.x = 0.5;
	titleText.anchor.y = 0.5;
	titleText.x = CANVAS_WIDTH/2;
	titleText.y = 200;

	stage.addChild(titleText);
	return titleText;
}

TitleState.prototype.createPlayButton = function(){
	var graphics_alone = new PIXI.Graphics();

	graphics_alone.beginFill(0xffffff);
	graphics_alone.drawRoundedRect(0, 0, 400, 200, 20);
	graphics_alone.endFill();

	var sprite_alone = new PIXI.Sprite(graphics_alone.generateCanvasTexture());
	sprite_alone.anchor.x = 0.5;
	sprite_alone.anchor.y = 0.5;

	var playContainer = new PIXI.Container();
	playContainer.pivot.x = 0.5;
	playContainer.pivot.y = 0.5;
	playContainer.x = CANVAS_WIDTH/2;
	playContainer.y = CANVAS_HEIGHT/2;
	playContainer.addChild(sprite_alone);
	stage.addChild(playContainer);

	return playContainer;
}

TitleState.prototype.tick = function(delta){
	// Floating Title 
	this.titleDeltaSum += delta;
	this.title.y = this.titleCenterY + 40 * Math.sin(this.titleDeltaSum / 200.0);
}

TitleState.prototype.activateState = function(){

}

TitleState.prototype.deactivateState = function(){

}

TitleState.prototype.deleteState = function(){

}