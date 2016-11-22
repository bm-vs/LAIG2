
function XMLscene() {
    CGFscene.call(this);
    this.interface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);
    this.initCameras();
	this.axis=new CGFaxis(this);

	this.setUpdatePeriod(100);
};


XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    this.view_number;
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.axis=new CGFaxis(this,this.graph.axis_length);
	
	this.gl.clearColor(this.graph.illumination_info.background.r,this.graph.illumination_info.background.g,this.graph.illumination_info.background.b,this.graph.illumination_info.background.a);
	this.setGlobalAmbientLight(this.graph.illumination_info.ambient.r,this.graph.illumination_info.ambient.g,this.graph.illumination_info.ambient.b,this.graph.illumination_info.ambient.a);

	// Camera
	this.setCamera("default");
	
	// Lights
	this.setLights();

	this.interface.onGraphLoaded();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.updateLights();
		
		for (var i = 0; i < this.lights.length; i++) {
			this.lights[i].update();
		}

		this.graph.display();
	};	
};

XMLscene.prototype.update = function () {
	if (this.graph.loadedOk) {
		this.graph.updateTime(0.1);
	}
}


XMLscene.prototype.setCamera = function(action) {
	if (action == "change") {
		this.view_number = (this.view_number + 1) % this.graph.views.length;
	}
	else if (action == "default") {
		this.view_number = this.graph.default_view;
	}

	var perspective = this.graph.views[this.view_number];

	var fov = degToRad(perspective.angle);
	var near = perspective.near;
	var far = perspective.far;
	var positionx = perspective.from.x;
	var positiony = perspective.from.y;
	var positionz = perspective.from.z;
	var targetx = perspective.to.x;
	var targety = perspective.to.y;
	var targetz = perspective.to.z;

	this.camera = new CGFcamera(fov, near, far, vec3.fromValues(positionx, positiony, positionz), vec3.fromValues(targetx, targety, targetz));
}


XMLscene.prototype.setLights = function() {
	this.light1 = null; this.light2 = null; this.light3 = null; this.light4 = null; this.light5 = null; this.light6 = null; this.light7 = null; this.light8 = null;
	this.lights_ids = [];
	var n = 0;

	for (var i = 0; i < this.graph.omni_lights.length; i++) {
		var light = this.graph.omni_lights[i];

		this.lights_ids[n] = this.graph.omni_lights[i].id;

		this.lights[n].setPosition(light.location.x, light.location.y, light.location.z, light.location.w);
		this.lights[n].setAmbient(light.ambient.r,light.ambient.g,light.ambient.b,light.ambient.a);
		this.lights[n].setDiffuse(light.diffuse.r,light.diffuse.g,light.diffuse.b,light.diffuse.a);
		this.lights[n].setSpecular(light.specular.r,light.specular.g,light.specular.b,light.specular.a);
		this.lights[n].update();
		this.lights[n].setVisible(true);

		if (light.enabled) {
			this.lights[n].enable();
		}

		switch(n) {
			case 0:
				this.light1 = light.enabled;
				break;
			case 1:
				this.light2 = light.enabled;
				break;
			case 2:
				this.light3 = light.enabled;
				break;
			case 3:
				this.light4 = light.enabled;
				break;
			case 4:
				this.light5 = light.enabled;
				break;
			case 5:
				this.light6 = light.enabled;
				break;
			case 6:
				this.light7 = light.enabled;
				break;
			case 7:
				this.light8 = light.enabled;
				break;
		}

		n++;
	}

	for (var i = 0; i < this.graph.spot_lights.length; i++) {
		var light = this.graph.spot_lights[i];

		this.lights_ids[n] = this.graph.spot_lights[i].id;

		this.lights[n].setSpotCutOff(light.angle);
		this.lights[n].setSpotDirection(light.target.x, light.target.y, light.target.z);
		this.lights[n].setSpotExponent(light.exponent);
		this.lights[n].setPosition(light.location.x, light.location.y, light.location.z, light.location.w);
		this.lights[n].setAmbient(light.ambient.r,light.ambient.g,light.ambient.b,light.ambient.a);
		this.lights[n].setDiffuse(light.diffuse.r,light.diffuse.g,light.diffuse.b,light.diffuse.a);
		this.lights[n].setSpecular(light.specular.r,light.specular.g,light.specular.b,light.specular.a);
		this.lights[n].update();
		this.lights[n].setVisible(true);

		if (light.enabled) {
			this.lights[n].enable();
		}

		switch(n) {
			case 0:
				this.light1 = light.enabled;
				break;
			case 1:
				this.light2 = light.enabled;
				break;
			case 2:
				this.light3 = light.enabled;
				break;
			case 3:
				this.light4 = light.enabled;
				break;
			case 4:
				this.light5 = light.enabled;
				break;
			case 5:
				this.light6 = light.enabled;
				break;
			case 6:
				this.light7 = light.enabled;
				break;
			case 7:
				this.light8 = light.enabled;
				break;
		}

		n++;
	}
}

XMLscene.prototype.changeMaterials = function() {
	this.graph.changeMaterials();
}


XMLscene.prototype.updateLights = function() {
	if (this.light1) { this.lights[0].enable(); }
	else { this.lights[0].disable(); }

	if (this.light2) { this.lights[1].enable(); }
	else { this.lights[1].disable(); }

	if (this.light3) { this.lights[2].enable(); }
	else { this.lights[2].disable(); }

	if (this.light4) { this.lights[3].enable(); }
	else { this.lights[3].disable(); }

	if (this.light5) { this.lights[4].enable(); }
	else { this.lights[4].disable(); }

	if (this.light6) { this.lights[5].enable(); }
	else { this.lights[5].disable(); }

	if (this.light7) { this.lights[6].enable(); }
	else { this.lights[6].disable(); }

	if (this.light8) { this.lights[7].enable(); }
	else { this.lights[7].disable(); }
}
