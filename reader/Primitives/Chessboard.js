function Chessboard(scene, du, dv, texture, su, sv, c1, c2, cs) {
	CGFobject.call(this,scene);

	this.scene = scene;
	this.plane = new Plane(scene, 1.0, 1.0, du, dv);
	var color1 = [c1.r, c1.g, c1.b];
	var color2 = [c2.r, c2.g, c2.b];
	var colors = [cs.r, cs.g, cs.b];
	this.texture = new CGFtexture(scene, texture.file);
	this.shader = new CGFshader(scene.gl, "shaders/default.vert", "shaders/default.frag");
	this.shader.setUniformsValues({uSampler:1, du:du, dv:dv, color1:color1, color2:color2, colors:colors, su:su, sv:sv, height: 0.075});
}

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor=Chessboard;

Chessboard.prototype.display = function() {
	this.scene.pushMatrix();	
	this.scene.setActiveShader(this.shader);
	this.texture.bind(1);
	this.plane.display();
	this.scene.setActiveShader(this.scene.defaultShader);
	this.scene.popMatrix();
}
