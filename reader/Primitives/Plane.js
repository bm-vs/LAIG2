function Plane(scene, dimX, dimY, partsX, partsY) {
	var knots1 = getKnotsVector(1);
	var knots2 = getKnotsVector(1);

	var controlvertexes = [];
	controlvertexes.push([[-dimX/2,-dimY/2,0,1], [-dimX/2,dimY/2,0,1]]);
	controlvertexes.push([[dimX/2,-dimY/2,0,1],[dimX/2,dimY/2,0,1]]);


	var nurbsSurface = new CGFnurbsSurface(1, 1, knots1, knots2, controlvertexes);
	
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);
}


Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor=Plane;
