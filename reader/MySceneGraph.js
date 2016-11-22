
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);
	
	// <scene>
	this.root_id;
	this.axis_length;

	// <views>
	this.default_view = -1;
	this.views = [];
	
	// <illumination>
	this.illumination_info = new IlluminationInfo();

	// <lights>
	this.omni_lights = [];
	this.spot_lights = [];

	// <textures>
	this.textures = [];

	// <materials>
	this.materials = [];

	// <transformations>
	this.transformations = [];

	// <primitives>
	this.primitives = [];

	// <components>
	this.components = [];

	// <animations>
	this.animations = [];

	this.root;
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseDSX(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Parses elements of one block and stores information in a specific data structure
 */

MySceneGraph.prototype.parseDSX= function(rootElement) {

	var scene_reader = new SceneReader(rootElement, this);
	
	scene_reader.checkNodes();
	scene_reader.readScene();
	scene_reader.readViews();
	scene_reader.readIllumination(this.illumination_info);
	scene_reader.readLights();
	scene_reader.readTextures();
	scene_reader.readMaterials();
	scene_reader.readTransformations();
	scene_reader.readAnimations();
	scene_reader.readPrimitives();
	scene_reader.readComponents();
	this.initVehicles();
	scene_reader.addChildrenToComponents();

	this.root = new Node(null, this.searchComponentByID(this.root_id), this.scene);
};



	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


MySceneGraph.prototype.searchComponentByID=function(id) {	
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].id == id) {
            return this.components[i];
        }
    }
}

MySceneGraph.prototype.display = function() {
    this.root.display();
}

MySceneGraph.prototype.changeMaterials = function() {
	this.root.changeMaterial();
}

MySceneGraph.prototype.updateTime = function(delta) {
	this.root.updateTime(delta);
}

MySceneGraph.prototype.initVehicles = function() {
	for (var i = 0; i < this.primitives.length; i++) {
		if (this.primitives[i].primitive instanceof Vehicle) {
			this.primitives[i].primitive.init();
		}
	}
}
