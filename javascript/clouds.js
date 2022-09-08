export class Clouds
{
	_params = new function() 
	{
		this.count = 10;
		this.radius = 10;
		this.size = 10;
		this.position = 10;
		this.color = new THREE.Color(0xFF7400);
	};

	constructor()
	{
		this.setParams(...arguments)
		this._clouds = this.initClouds(this._params);
		this._scene = arguments[arguments.length - 1];
		this.addToScene();
	}

	initClouds(params)
	{
		let clouds = [];
		let texture = new tex_loader.load('data/smoke.png');
		let cloudGeo = new THREE.PlaneBufferGeometry(params.size, params.size);
		let cloudMaterial = new THREE.MeshLambertMaterial(
		{
			map: texture,
			color: params.color,
			opacity: 0.8,
			transparent: true
		});

		let period = 2 * Math.PI / params.count;
		for (let angle = 0; angle < 2 * Math.PI; angle += period)
		{
			let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
			let coords = polar_to_rectangular(params.radius, angle)

			cloud.position.set(...coords, params.position);
			cloud.rotation.z = Math.random() * 2 * Math.PI;
		
			clouds.push(cloud);
		}
		return clouds;
	}

	adjust(gui, name) 
	{
		let folder = gui.addFolder(name);
		let controllerCount = folder.add(this._params, "count", 0, 100);
		let controllerRadius = folder.add(this._params, "radius", 0, 50);
		let controllerSize = folder.add(this._params, "size", 0, 30);
		let controllerPosition = folder.add(this._params, "position", -50, 20);
		let controllerColor = folder.addColor(this._params, "color");

		let scene = this._scene;
		let clouds = this._clouds;
		let params = this._params;
		let init = this.initClouds;

		let func = function(value)
		{
			clouds.forEach(i => scene.remove(i));
			clouds.length = 0;

			let new_clouds = init(params);
			clouds.push(...new_clouds);

			clouds.forEach(i => scene.add(i));
		};

		controllerCount.onChange(func);
		controllerRadius.onChange(func);
		controllerSize.onChange(func);
		controllerPosition.onChange(func);
		controllerColor.onChange(func);
	}

	animate(angle)
	{
		this._clouds.forEach(i => 
		{
			i.rotation.z += angle;
		});
	}

	addToScene()
	{
		this._clouds.forEach(i => 
		{
			this._scene.add(i);
		});
	}

	setParams(count, radius, size, position, color)
	{
		this._params.count = count;
		this._params.radius = radius;
		this._params.size = size;
		this._params.position = position;
		this._params.color = color;
	}
}

let tex_loader = new THREE.TextureLoader();

function polar_to_rectangular(radius, angle)
{
	return [radius * Math.cos(angle), radius * Math.sin(angle)];
}