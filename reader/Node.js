function Node(parent, component_info, scene) {
    this.scene = scene;
    this.component_info = component_info;
    this.parent = parent;
    this.matrix = mat4.create();
    this.transformation_matrix = mat4.create();
    this.animation_matrix = mat4.create();

    /*==================================================================================*/
    /* TRANSFORMATIONS */

    this.createTransformationMatrix();

    /*==================================================================================*/
    /* ANIMATIONS */

    this.animations = [];


    for (var i = 0; i < component_info.animations.length; i++) {
	if (component_info.animations[i] instanceof LinearAnimation) {
		var simple_linear_animations = [];
		component_info.animations[i].decompose(simple_linear_animations);

		this.animations = this.animations.concat(simple_linear_animations);
	}
	else {
		component_info.animations[i].setDelta();
		this.animations.push(component_info.animations[i]);
	}
    }

    this.time = 0;
    this.current_animation = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.angle = 0;
    this.orientation = 0;

    /*==================================================================================*/
    /* MATERIAL */


    this.texture;
    if (component_info.texture == "inherit") {
        this.texture = parent.texture;
    }
    else {
        this.texture = component_info.texture;
    }

    this.materials = [];
    for (var i = 0; i < component_info.materials.length; i++) {
        this.materials[i] = component_info.materials[i];
    }

    this.current_material_pos = 0;
    this.active_material;

    this.setActiveMaterial();

    this.children = [];
    for (var i = 0; i < component_info.children_components.length; i++) {
        this.children[i] = new Node(this, component_info.children_components[i], scene);
    }
}


Node.prototype.createTransformationMatrix = function() {
    //for (var i = component_info.transformations.length - 1; i >= 0; i--) {
    for (var i = 0; i < this.component_info.transformations.length; i++) {
        var m = this.createMatrix(this.component_info.transformations[i]);
        
        mat4.multiply(this.transformation_matrix,m,this.transformation_matrix);
    }
}


Node.prototype.createMatrix = function(transformation) {
    var m = mat4.create();

    if (transformation instanceof Translation) {
        mat4.translate(m,m,vec3.fromValues(transformation.vector.x, transformation.vector.y, transformation.vector.z));
    }
    else if (transformation instanceof Rotation) {
        if (transformation.axis == "x") {
            mat4.rotateX(m,m,transformation.angle);
        }
        else if (transformation.axis == "y") {
            mat4.rotateY(m,m,transformation.angle);
        }
        else if (transformation.axis == "z") {
            mat4.rotateZ(m,m,transformation.angle);
        }

    }
    else if (transformation instanceof Scaling) {
        mat4.scale(m,m,vec3.fromValues(transformation.vector.x, transformation.vector.y, transformation.vector.z));
    }

    return m;
}

Node.prototype.display = function() {    
    this.scene.pushMatrix();
    this.scene.multMatrix(this.matrix);
    this.scene.rotate(this.orientation, 0, 1, 0);  
    this.active_material.apply();

    for (var i = 0; i < this.component_info.children_primitives.length; i++) {
        if (this.component_info.children_primitives[i].primitive instanceof Rectangle || this.component_info.children_primitives[i].primitive instanceof Triangle) {
            this.component_info.children_primitives[i].primitive.setTexCoords(this.texture.length_s, this.texture.length_t);
        }
        this.component_info.children_primitives[i].primitive.display();
    }
    
    this.scene.popMatrix();
    
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].display();
    }
}

Node.prototype.setActiveMaterial = function() {
    if (this.materials[this.current_material_pos] == "inherit") {
        var m = this.parent.active_material;
        this.active_material = new CGFappearance(this.scene);
        
        this.active_material.setAmbient(m.ambient[0], m.ambient[1], m.ambient[2], m.ambient[3]); 
        this.active_material.setEmission(m.emission[0], m.emission[1], m.emission[2], m.emission[3]);
        this.active_material.setDiffuse(m.diffuse[0], m.diffuse[1], m.diffuse[2], m.diffuse[3]);
        this.active_material.setSpecular(m.specular[0], m.specular[1], m.specular[2], m.specular[3]);
        //this.active_material.setTextureWrap(,);       
    }
    else {
        var m = this.component_info.materials[this.current_material_pos];  
            
        this.active_material = new CGFappearance(this.scene);
        
        this.active_material.setAmbient(m.ambient.r, m.ambient.g, m.ambient.b, m.ambient.a); 
        this.active_material.setEmission(m.emission.r, m.emission.g, m.emission.b, m.emission.a);
        this.active_material.setDiffuse(m.diffuse.r, m.diffuse.g, m.diffuse.b, m.diffuse.a);
        this.active_material.setSpecular(m.specular.r, m.specular.g, m.specular.b, m.specular.a);
        //this.active_material.setTextureWrap(,);
    }

    if (this.texture == "none") {
        this.active_material.setTexture(null);
    }
    else {
        this.active_material.loadTexture(this.texture.file);
    }
}

Node.prototype.changeMaterial = function() {
    this.current_material_pos = (this.current_material_pos+1)%this.materials.length;
    this.setActiveMaterial();

    for (var i = 0; i < this.children.length; i++) {
        this.children[i].changeMaterial();
    }
}

Node.prototype.getNumberOfNodes = function() {
    sum = 0;

    for (var i = 0; i < this.children.length; i++) {
        sum += this.children[i].getNumberOfNodes();
    }

    return sum + 1;
}

Node.prototype.printTree = function(string) {
    console.log(string+this.component_info.id+" ");

    for (var i = 0; i < this.children.length; i++) {
        this.children[i].printTree(string+"    ");
    }
}

Node.prototype.updateTime = function(delta) {
    this.time += delta;

    if (this.parent != null) {
	mat4.multiply(this.matrix, this.parent.matrix, this.transformation_matrix);
    }
    else {
	this.matrix = this.transformation_matrix;
    }
    

    if (this.current_animation < this.animations.length) {
	    var deltax, deltay, deltaz;	

	    if (this.animations[this.current_animation] instanceof SimpleLinearAnimation) {
	    	deltax = this.animations[this.current_animation].x;
	        deltay = this.animations[this.current_animation].y;
	    	deltaz = this.animations[this.current_animation].z;

	        mat4.translate(this.animation_matrix, this.animation_matrix, vec3.fromValues(deltax, deltay, deltaz));

		
		if (deltaz == 0 && deltax == 0) {
	        // do nothing
		}
		else if (deltaz < 0) {
			this.orientation = Math.PI+Math.atan(deltax/deltaz);
		}
		else {
			this.orientation = Math.atan(deltax/deltaz);
		}
	    }
	    else {
		deltaz = 0;
		deltax = 0;

		var a = this.animations[this.current_animation];
		this.angle += a.delta_ang;
		var m = mat4.create();

		mat4.translate(m, m, vec3.fromValues(a.center.x, a.center.y, a.center.z));
		mat4.rotateY(m, m, degToRad(a.delta_ang));
		mat4.translate(m, m, vec3.fromValues(0, 0, a.radius));
		mat4.translate(m, m, vec3.fromValues(-a.center.x, -a.center.y, -a.center.z));

		mat4.multiply(this.animation_matrix, this.animation_matrix, m);
	    }

	    if (this.time > this.animations[this.current_animation].span) {
			this.time = 0;
			this.current_animation++;
	    }
    }

    mat4.multiply(this.matrix, this.matrix, this.animation_matrix);


    for (var i = 0; i < this.children.length; i++) {
        this.children[i].updateTime(delta);
    }
}
