function CO2Enemy(state, health, reward, damage, speed, delayRender, renderTarget, path){
	Enemy.call(this, state, health, reward, damage, speed, delayRender, renderTarget, path, "enemyCO2");	
}

CO2Enemy.constructor = CO2Enemy;
CO2Enemy.prototype = Object.create(Enemy.prototype);
