let scene, camera, renderer, composer, flash, mouse;
let tex_loader, obj_loader, mtl_loader;
let starGeo, stars;
let cloudParticles = [];

function init()
 {
	initScene();
	initCamera();
	initRenderer();
	initPostprocessing();

	initLoaders();
	initEventListeners();
	initControls();

	let axesHelper = new THREE.AxesHelper(500);
	scene.add(axesHelper);
	scene.fog = new THREE.FogExp2(0x03544e, 0.001);
	renderer.setClearColor(scene.fog.color);

	initLights();
	loadModel();
	initStars();
	initClouds();

	document.body.appendChild(renderer.domElement);

	render();
}

function render()
{
	animateClouds();
	animateStars();

	composer.render(0.1);
	requestAnimationFrame(render);
}

function animateClouds()
{
	cloudParticles.forEach(p => 
	{
		p.rotation.z -= 0.001;
	});

	if (Math.random() > 0.95 || flash.power > 200)
	{
		if (flash.power < 100) flash.position.set(
			Math.random() * 400,
			300 + Math.random() * 200,
			100
			);
		flash.power = 50 + Math.random() * 500;
	}
}

function animateStars()
{
	starGeo.vertices.forEach(p => 
	{
		p.velocity += p.acceleration
		p.y -= p.velocity;
		
		if (p.y < -200)
		{
			p.y = 200;
			p.velocity = 0;
		}
	});
	starGeo.verticesNeedUpdate = true;
	stars.rotation.y += 0.002;
}

function initScene() 
{
	scene = new THREE.Scene();
}

function initCamera() 
{
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 1;
	camera.rotation.x = 1.16;
	camera.rotation.y = -0.12;
	camera.rotation.z = 0.27;
}

function initRenderer()
{
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function initPostprocessing()
{
	const bloomEffect = new POSTPROCESSING.BloomEffect(
	{
		blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
		kernelSize: POSTPROCESSING.KernelSize.SMALL,
		useLuminanceFilter: true,
		luminanceThreshold: 0.3,
		luminanceSmoothing: 0.75
	});
	bloomEffect.blendMode.opacity.value = 1.5;

	let effectPass = new POSTPROCESSING.EffectPass(
		camera,
		bloomEffect
	);
	effectPass.renderToScreen = true;

	composer = new POSTPROCESSING.EffectComposer(renderer);
	composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));
	composer.addPass(effectPass);
}

function initLights()
{
	let ambient = new THREE.AmbientLight(0x555555);
	scene.add(ambient);

	let directionalLight = new THREE.DirectionalLight(0xff8c19);
	directionalLight.position.set(0, 0, 1);
	scene.add(directionalLight);

	// const helper = new THREE.DirectionalLightHelper(directionalLight);
	// scene.add(helper);

	let orangeLight = new THREE.PointLight(0xcc6600, 50, 450, 1.7);
	orangeLight.position.set(200, 300, 100);
	scene.add(orangeLight);

	let redLight = new THREE.PointLight(0xd8547e, 50, 450, 1.7);
	redLight.position.set(100, 300, 100);
	scene.add(redLight);

	let blueLight = new THREE.PointLight(0x3677ac, 50, 450, 1.7);
	blueLight.position.set(300, 300, 200);
	scene.add(blueLight);

	flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
	flash.position.set(200, 300, 100);
	scene.add(flash);
}

function initLoaders() 
{
	tex_loader = new THREE.TextureLoader();
	let loading_manager = new THREE.LoadingManager();
	obj_loader = new THREE.OBJLoader(loading_manager);
	mtl_loader = new THREE.MTLLoader();
}

function loadModel()
{
	mtl_loader.load("data/model/new_obj.mtl", function (materials) 
	{
		materials.preload();
		obj_loader.setMaterials(materials);
		obj_loader.load("data/model/new_obj.obj", function (object) 
		{
			// object.traverse(part => { 
			// 	if (part.isMesh) 
			// 	{
			// 		part.castShadow = true; 
			// 		part.receiveShadow = true;
			// 		if (part.material.map) part.material.map.anisotropy = 16;
 
			// 	}
			// });
			object.scale.set(0.01, 0.01, 0.01);
			object.position.x = 0.5;
			object.position.y = 1;
			object.position.z = -1;
			object.rotation.x = 0.9;
			scene.add(object);
		});
	});
}

function initStars()
{
	starGeo = new THREE.Geometry();
	for (let i = 0; i < 6000; i++)
	{
		let star = new THREE.Vector3(
			Math.random() * 600 - 300,
			Math.random() * 600 - 300,
			Math.random() * 600 - 300
			);
		star.velocity = 0;
		star.acceleration = 0.02;
		starGeo.vertices.push(star);
	}
	/*
	let sprite = new THREE.TextureLoader().load("data/star.png");
	let starMaterial = new THREE.PointsMaterial({
		color: 0xaaaaaa,
		size: 0.7,
		map: sprite});
	*/
	let starMaterial = new THREE.PointsMaterial(
	{
		color: 0xaaaaaa,
		size: 0.3,
		transparent: true
	});

	stars = new THREE.Points(starGeo, starMaterial);
	scene.add(stars);
}

function initClouds()
{
	tex_loader.load("data/smoke.png", function(texture) 
	{
		let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
		let cloudMaterial = new THREE.MeshLambertMaterial(
		{
			map: texture,
			transparent: true
		});

		for (let p = 0; p < 50; p++) 
		{
			let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
			cloud.position.set(
				Math.random() * 800 - 400,
				500,
				Math.random() * 500 - 500
				);
			cloud.rotation.x = 1.16;
			cloud.rotation.y = -0.12;
			cloud.rotation.z = Math.random() * 2 * Math.PI;
			cloud.material.opacity = 0.55;
			cloudParticles.push(cloud);
			scene.add(cloud);
		}
	});
}

function initEventListeners() 
{
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    onWindowResize();
}

function initControls() 
{
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    mouse = new THREE.Vector2();
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function onMouseMove(event) 
{
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

init();