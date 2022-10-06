export class AmbientLight
{
	constructor(scene, color, intensity)
	{
		this._light = new THREE.AmbientLight(color, intensity);
		scene.add(this._light);
	}

  	adjustLight(gui, name) 
	{
		let folder = gui.addFolder(name);
		folder.add(this._light, "intensity", 0, 5);
		folder.addColor(new ColorGUIHelper(this._light, "color"), "value").name("color");
	}
}


export class SpotLight
{
	constructor(scene, color, intensity, distance, angle, penumbra, decay)
	{
		this._scene = scene;

		this._light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
		scene.add(this._light);
	}

 	 adjust(gui, name) 
	{
		let light = this._light;
		let target = this._light.target;

		let helper = new THREE.SpotLightHelper(this._light);
		this._scene.add(helper);

		let lightFolder = gui.addFolder(name);
		lightFolder.add(light, "intensity", 0, 10);
		lightFolder.add(light, "distance", 0, 30);
		lightFolder.add(light, "angle", 0, Math.PI / 2);
		lightFolder.addColor(new ColorGUIHelper(light, "color"), "value").name("color");

		let lightPosition = gui.addFolder(name + " Light Position");
		lightPosition.add(light.position, "x", -20, 20);
		lightPosition.add(light.position, "y", -20, 20);
		lightPosition.add(light.position, "z", -20, 20);

		let targetPosition = gui.addFolder(name + " Target Position");
		targetPosition.add(target.position, "x", -20, 20);
		targetPosition.add(target.position, "y", -20, 20);
		targetPosition.add(target.position, "z", -20, 20);
	}

	update() 
	{
		this._light.target.updateMatrixWorld();
		this._helper.update();
	}

	setLightPosition(position)
	{
		this._light.position.set(...position);
	}

	setTargetPosition(position)
	{
		this._light.target.position.set(...position);
	}

	getLight()
	{
		return this._light;
	}

	getTarget()
	{
		return this._light.target;
	}

	getHelper()
	{
		return this._helper;
	}
}

class ColorGUIHelper 
{
    constructor(object, prop) 
    {
      	this.object = object;
      	this.prop = prop;
    }

    get value() 
    {
      return `#${this.object[this.prop].getHexString()}`;
    }

    set value(hexString) 
    {
      this.object[this.prop].set(hexString);
    }
}

// const helper = new THREE.PointLightHelper(light);
// const helper = new THREE.DirectionalLightHelper(directionalLight);