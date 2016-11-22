function Vehicle(scene, parts) {
	this.scene = scene;
	this.parts = parts;
	this.primitives = [];
	this.transformations = [];
	this.materials = [];
}

Vehicle.prototype.init = function() {
	for (var i = 0; i < this.parts.length; i++) {
		for (var j = 0; j < this.scene.graph.primitives.length; j++) {
			if (this.parts[i][0] == this.scene.graph.primitives[j].id) {
				this.primitives[i] = this.scene.graph.primitives[j].primitive;
			}
		}

		for (var j = 0; j < this.scene.graph.transformations.length; j++) {
			if (this.parts[i][1] == this.scene.graph.transformations[j].id) {
				this.transformations[i] = this.scene.graph.transformations[j].transformations;
			}
		}

		for (var j = 0; j < this.scene.graph.materials.length; j++) {
			if (this.parts[i][2] == this.scene.graph.materials[j].id) {
				var m = this.scene.graph.materials[j];
				var material = new CGFappearance(this.scene);       
				material.setAmbient(m.ambient.r, m.ambient.g, m.ambient.b, m.ambient.a); 
				material.setEmission(m.emission.r, m.emission.g, m.emission.b, m.emission.a);
				material.setDiffuse(m.diffuse.r, m.diffuse.g, m.diffuse.b, m.diffuse.a);
				material.setSpecular(m.specular.r, m.specular.g, m.specular.b, m.specular.a);

				this.materials[i] = material;
			}
		}

		for (var j = 0; j < this.scene.graph.textures.length; j++) {
			if (this.parts[i][3] == this.scene.graph.textures[j].id) {
				this.materials[i].loadTexture(this.scene.graph.textures[j].file);
			}
		}
	}
}


Vehicle.prototype.display = function() {
	for (var i = 0; i < this.primitives.length; i++) {
		this.scene.pushMatrix();
		this.materials[i].apply();
		var m = this.createTransformationMatrix(i);
		this.scene.multMatrix(m);
		this.primitives[i].display();
		this.scene.popMatrix();	
	}
}

Vehicle.prototype.createTransformationMatrix = function(n) {
	var matrix = mat4.create();

	for (var i = 0; i < this.transformations[n].length; i++) {
		var m = this.createMatrix(this.transformations[n][i]);
        
		mat4.multiply(matrix,m,matrix);
	}

	return matrix;
}


Vehicle.prototype.createMatrix = function(transformation) {
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


