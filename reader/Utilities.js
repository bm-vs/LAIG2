/*
Vector
*/

function Vector() {
    this.x;
    this.y;
    this.z;
    this.w;
}


/*
Color
*/

function Color() {
    this.r;
    this.g;
    this.b;
    this.a;
}

/*
DegToRad
*/

function degToRad(deg) {
    return deg*Math.PI/180.0;
}

/*
From NURBS example
*/
function getKnotsVector(degree) {
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}
