function PatchDoubleSide(scene, orderU, orderV, partsU, partsV, control_points) {
	this.scene = scene;
	this.front = new Patch(scene, orderU, orderV, partsU, partsV, control_points, "front");
	this.back = new Patch(scene, orderU, orderV, partsU, partsV, control_points, "back");
}


PatchDoubleSide.prototype.display = function() {
	this.scene.pushMatrix();
		this.front.display();
		this.back.display();
	this.scene.popMatrix();
}

