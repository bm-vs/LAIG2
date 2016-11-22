function Patch(scene, orderU, orderV, partsU, partsV, control_points, side) {
	var knots1 = getKnotsVector(orderU);
	var knots2 = getKnotsVector(orderV);

	var controlvertexes = [];
	var count = 0;
	for (var i = 0; i <= orderU; i++) {
		var vectorU = [];		

		for (var j = 0; j <= orderV; j++) {
			var vectorV = [];
			vectorV[0] = control_points[count].x;
			vectorV[1] = control_points[count].y;
			vectorV[2] = control_points[count].z;
			vectorV[3] = 1;
			vectorU.push(vectorV);

			count++;
		}

		controlvertexes.push(vectorU);
	}

	var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knots1, knots2, controlvertexes);
	
	getSurfacePoint = function(u, v) {
		if (side == "back") {
			return nurbsSurface.getPoint(u, v);
		}
		else {
			return nurbsSurface.getPoint(v, u);
		}
	};

	CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);
}


Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor=Patch;


