function InventoryArrow(state, inventory, renderTarget, x, y, baseName, func_button_up, scaleX = 1, scaleY = 1){
	PIXI.Sprite.call(this, textureManager.getTexture(baseName));
	renderTarget.addChild(this);

	this.gameState = state;
	this.inventory = inventory;
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

	this.disabled = false;
}

InventoryArrow.constructor = InventoryArrow;
InventoryArrow.prototype = Object.create(PIXI.Sprite.prototype);

InventoryArrow.prototype.createInteraction = function(){
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

InventoryArrow.prototype.tick = function(delta){
	if(this.pressed)
		this.texture = textureManager.getTexture(this.baseName + "_highlight");
	else
		this.texture = textureManager.getTexture(this.baseName);
}

InventoryArrow.prototype.enableButton = function(){
	this.interactive = true;
	this.alpha = 1.0;
}

InventoryArrow.prototype.disableButton = function(){
	this.interactive = false;
	this.alpha = 0.5;
}