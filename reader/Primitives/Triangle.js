function Triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    this.initBuffers();
}

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor=Triangle;

Triangle.prototype.initBuffers = function() {
    this.vertices = [
        this.x1, this.y1, this.z1,
        this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3,

	this.x1, this.y1, this.z1,
        this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3
    ];

    this.indices = [
        0, 1, 2,
	3, 5, 4
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

	0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.calcText();

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}


Triangle.prototype.calcText = function() {
    var a = Math.sqrt((this.x2-this.x1)*(this.x2-this.x1)+(this.y2-this.y1)*(this.y2-this.y1)+(this.z2-this.z1)*(this.z2-this.z1));
    var b = Math.sqrt((this.x3-this.x2)*(this.x3-this.x2)+(this.y3-this.y2)*(this.y3-this.y2)+(this.z3-this.z2)*(this.z3-this.z2));
    var c = Math.sqrt((this.x1-this.x3)*(this.x1-this.x3)+(this.y1-this.y3)*(this.y1-this.y3)+(this.z1-this.z3)*(this.z1-this.z3));

    var cosb = (a*a-b*b+c*c)/(2*a*c);
    var sinb = Math.sqrt(1-cosb*cosb);

    this.texCoords = [
        c-a*cosb,a*sinb,
        0,0,
        c,0
    ];
}

// Updates texCoords according to the length_t/length_s of the texture
Triangle.prototype.setTexCoords = function(ls,lt) {
    var a = Math.sqrt((this.x2-this.x1)*(this.x2-this.x1)+(this.y2-this.y1)*(this.y2-this.y1)+(this.z2-this.z1)*(this.z2-this.z1));
    var b = Math.sqrt((this.x3-this.x2)*(this.x3-this.x2)+(this.y3-this.y2)*(this.y3-this.y2)+(this.z3-this.z2)*(this.z3-this.z2));
    var c = Math.sqrt((this.x1-this.x3)*(this.x1-this.x3)+(this.y1-this.y3)*(this.y1-this.y3)+(this.z1-this.z3)*(this.z1-this.z3));

    var cosb = (a*a-b*b+c*c)/(2*a*c);
    var sinb = Math.sqrt(1-cosb*cosb);
    
    this.texCoords = [
        (c-a*cosb)/ls,(a*sinb)/lt,
        0,0,
        c/ls,0
    ];

    this.updateTexCoordsGLBuffers();
}
