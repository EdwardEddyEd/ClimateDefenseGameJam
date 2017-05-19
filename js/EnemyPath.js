function EnemyPath(state, map, sqLocX, sqLocY, pathNumber){
	this.state = state;
	this.pathSquares = [];
	this.pathMarkers = [];

	this.pathNumber = pathNumber;

	this.totalDistance = 0;

	let startPoint = map.squares[sqLocX[0]][sqLocY[0]].getCenter();
	let endPoint;
	this.pathSquares.push(startPoint);
	this.pathMarkers.push(this.totalDistance);

	for(let i = 0; i < sqLocX.length - 1; i++){
		endPoint = map.squares[sqLocX[i + 1]][sqLocY[i + 1]].getCenter();
		let distance = this.distanceBetween(startPoint, endPoint);
		this.totalDistance += distance;

		this.pathSquares.push(endPoint);
		this.pathMarkers.push(this.totalDistance);
		startPoint = endPoint;
	}
}

EnemyPath.constructor = EnemyPath;

EnemyPath.prototype.distanceBetween = function(start, end) {
	return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));	
}

EnemyPath.prototype.calcLocation = function(distanceDelta, speed, enemy){
	enemy.distanceTraveled = (distanceDelta / 1000.0) * speed;
	for(let i = 0; i < this.pathMarkers.length; i++){
		if(enemy.distanceTraveled >= this.pathMarkers[i])
			continue;
		else{
			let distanceTraveledBetween = enemy.distanceTraveled - this.pathMarkers[i - 1];
			let distanceBetweenPoints   = this.pathMarkers[i] - this.pathMarkers[i - 1];
			this.lerp(distanceTraveledBetween / distanceBetweenPoints,
					  this.pathSquares[i - 1], 
					  this.pathSquares[i], 
					  enemy);
			return false;
		}
	}

	return true;
}

EnemyPath.prototype.lerp = function(ratio, start, end, enemy){
	let x = end.x * ratio + (1 - ratio) * start.x;
	let y = end.y * ratio + (1 - ratio) * start.y;
	enemy.setLocation(x, y);
}

EnemyPath.prototype.getPathNumber = function(){
	return this.pathNumber;
}