function TextureManager(){
	this.textures = [];
	this.length = 0;
}

TextureManager.constructor = TextureManager;

TextureManager.prototype.loadTextureFromImage = function(key, source){
	let texture = PIXI.Texture.fromImage(source);
	this.textures[key] = texture;
	this.length++;
}

TextureManager.prototype.loadTexture = function(key, texture){
	this.textures[key] = texture;
	this.length++;
}

TextureManager.prototype.getTexture = function(key){
	return this.textures[key];
}