function MyInterface() {
    CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();

    this.lights=this.gui.addFolder("Lights");

    return true;
}


MyInterface.prototype.processKeyboard = function(event) {
    CGFinterface.prototype.processKeyboard.call(this,event);

    switch(event.keyCode) {
        case(86):
        case(118):
            this.scene.setCamera("change");
            break;


        case(77):
        case(109):
            this.scene.changeMaterials();
            break;
    }


}

MyInterface.prototype.onGraphLoaded = function () 
{
    if (this.scene.light1 != null) { this.lights.add(this.scene, 'light1').name(this.scene.lights_ids[0]); }
    else { this.scene.light1 = false; }

    if (this.scene.light2 != null) { this.lights.add(this.scene, 'light2').name(this.scene.lights_ids[1]); }
    else { this.scene.light2 = false; }

    if (this.scene.light3 != null) { this.lights.add(this.scene, 'light3').name(this.scene.lights_ids[2]); }
    else { this.scene.light3 = false; }

    if (this.scene.light4 != null) { this.lights.add(this.scene, 'light4').name(this.scene.lights_ids[3]); }
    else { this.scene.light4 = false; }

    if (this.scene.light5 != null) { this.lights.add(this.scene, 'light5').name(this.scene.lights_ids[4]); }
    else { this.scene.light5 = false; }

    if (this.scene.light6 != null) { this.lights.add(this.scene, 'light6').name(this.scene.lights_ids[5]); }
    else { this.scene.light6 = false; }

    if (this.scene.light7 != null) { this.lights.add(this.scene, 'light7').name(this.scene.lights_ids[6]); }
    else { this.scene.light7 = false; }

    if (this.scene.light8 != null) { this.lights.add(this.scene, 'light8').name(this.scene.lights_ids[7]); }
    else { this.scene.light8 = false; }
}