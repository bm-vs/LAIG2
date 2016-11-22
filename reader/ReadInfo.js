//==============================================================================================================================================================

// PerspectiveInfo
function PerspectiveInfo() {
    this.id; 
    this.near;
    this.far;
    this.angle;
    this.from = new Vector();
    this.to = new Vector();
}


//==============================================================================================================================================================
/*
IlluminationInfo
*/
function IlluminationInfo() {
    this.doublesided;
    this.local;
    this.ambient = new Color();
    this.background = new Color();
}

//==============================================================================================================================================================
/*
LightsInfo
*/


// OmniLightsInfo
function OmniLightsInfo() {
    this.id;
    this.enabled;
    this.location = new Vector();
    this.ambient = new Color();
    this.diffuse = new Color();
    this.specular = new Color();
}

// SpotLightsInfo
function SpotLightsInfo() {
    this.id;
    this.enabled;
    this.angle;
    this.exponent;
    this.target = new Vector();
    this.location = new Vector();
    this.ambient = new Color();
    this.diffuse = new Color();
    this.specular = new Color();
}

//==============================================================================================================================================================

/*
TextureInfo
*/

function TextureInfo() {
	this.id;
	this.file;
	this.length_s;
	this.length_t;
}

//==============================================================================================================================================================
/*
MaterialInfo
*/

function MaterialInfo() {
	this.id;
	this.emission = new Color();
	this.ambient = new Color();
	this.diffuse = new Color();
	this.specular = new Color();
	this.shininess;

}

//==============================================================================================================================================================
/*
TranformationInfo
*/

function TransformationInfo() {
	this.id;
	this.transformations = [];
}

/*
Translation
*/
function Translation() {
	this.vector = new Vector();
}

/*
Rotation
*/
function Rotation() {
	this.axis;
	this.angle;
}

/*
Scaling
*/
function Scaling() {
	this.vector = new Vector();
}


//==============================================================================================================================================================
/*
PrimitiveInfo
*/

function PrimitiveInfo() {
	this.id;
	this.primitive;
}

//==============================================================================================================================================================
/*
ComponentInfo
*/

function ComponentInfo() {
	this.id;
	this.transformationref = null;
	this.transformations = [];
	this.animations = [];
	this.materials = [];
	this.texture;
	this.children_components = [];
	this.children_primitives = [];
}


//==============================================================================================================================================================
/*
AnimationInfo
*/


function Animation(id, span) {
	if (this.constructor === Animation) {
		throw new Error("Can't instantiate Animation - abstract class");
	}

	this.id = id;
	this.span = span;
}

function LinearAnimation(id, span) {
	Animation.call(this, id, span);	
	this.control_points = [];
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.display = function() {
	console.log(this.id);
	console.log(this.span);
	for (var i = 0; i < this.control_points.length; i++) {
		console.log(this.control_points[i].x, this.control_points[i].y, this.control_points[i].z);
	}
}

LinearAnimation.prototype.decompose = function(simple_linear_animations) {
	var move = [];
	var dist = [];
	var total_dist = 0;

	for (var i = 0; i < this.control_points.length - 1; i++) {
		var m = new Vector();
		m.x = this.control_points[i+1].x - this.control_points[i].x;
		m.y = this.control_points[i+1].y - this.control_points[i].y;
		m.z = this.control_points[i+1].z - this.control_points[i].z; 

		dist[i] = Math.sqrt(m.x*m.x+m.y*m.y+m.z*m.z);
		move[i] = m;
		total_dist += dist[i];
	}

	var speed = total_dist/this.span;
	var updateTime = 0.1;

	for (var i = 0; i < move.length; i++) {
		var simple_span = dist[i]/speed;

		var simple_animation = new SimpleLinearAnimation();
		simple_animation.x = move[i].x/simple_span*updateTime;
		simple_animation.y = move[i].y/simple_span*updateTime;
		simple_animation.z = move[i].z/simple_span*updateTime;
		simple_animation.span = simple_span;

		simple_linear_animations[i] = simple_animation;
	}
}

function SimpleLinearAnimation() {
	this.x;
	this.y;
	this.z;
	this.span;
}



function CircularAnimation(id, span) {
	Animation.call(this, id, span);
	this.center;
	this.radius;
	this.startang;
	this.rotang;
	this.delta_ang;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.setDelta = function() {
	var updateTime = 0.1;
	this.delta_ang = this.rotang/this.span*updateTime;
}

CircularAnimation.prototype.display = function() {
	console.log(this.id);
	console.log(this.span);
	console.log(this.center.x, this.center.y, this.center.z);
	console.log(this.radius);
	console.log(this.startang);
	console.log(this.rotang);
}









