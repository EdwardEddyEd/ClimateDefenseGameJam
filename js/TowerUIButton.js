function TowerUIButton(state, menu, x, y, baseName, func_button_up, scaleX = 1, scaleY = 1){
	PIXI.Sprite.call(this, textureManager.getTexture(baseName));

	this.gameState = state;
	this.towerMenu = menu;
	this.baseName = baseName;

	this.x = x;
	this.y = y;
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;

	this.scale.x = scaleX;
	this.scale.y = scaleY;

	this.func_button_up = func_button_up;

	this.pressed = false;
	this.buttonMode = true;
	this.interactive = true;
	this.createInteraction();
}

TowerUIButton.constructor = TowerUIButton;
TowerUIButton.prototype = Object.create(PIXI.Sprite.prototype);

TowerUIButton.prototype.createInteraction = function(){
	function onButtonDown(){
		this.pressed = true;
	}

	function onButtonUp(){
		this.func_button_up();
	}

	function onButtonUpOutside(){
		this.pressed = false;
	}

    this
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUpOutside)
        .on('pointerover', onButtonDown)
        .on('pointerout', onButtonUpOutside);
}

TowerUIButton.prototype.tick = function(delta){
	if(this.pressed)
		this.texture = textureManager.getTexture(this.baseName + "_highlight");
	else
		this.texture = textureManager.getTexture(this.baseName);
}