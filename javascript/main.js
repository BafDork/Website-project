import {initClouds, animateClouds} from './cloud_sys.js';

let scene, camera, renderer, composer, stats;
let tex_loader, background, flash;
let clouds1 = [], clouds2 = [], clouds3 = [];

function init()
{
	initScene();
	initCamera();
	initRenderer();
	initPostprocessing();

	initLoaders();
	initControls();
	initEventListeners();

	initAxesHelper();
	initStats();
	
	initBackground();

	initLights();
	initClouds(scene, clouds1, 50, 1.2, 1, 10, 0xFFA733);
	initClouds(scene, clouds2, 40, 0.8, 0.8, 9.9, 0xFF7400);
	initClouds(scene, clouds3, 30, 0.6, 1, 9.8, 0xE60042);

	removeLoading();
	render();
}

function initScene() 
{
	scene = new THREE.Scene();
}

function initCamera() 
{
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 0, 11);
}

function initRenderer()
{
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
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

function initLoaders() 
{
	tex_loader = new THREE.TextureLoader();
}

function initControls() 
{
	let controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function initEventListeners() 
{
	window.addEventListener('resize', onWindowResize);
	onWindowResize();
}

function onWindowResize() 
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function initAxesHelper()
{
	// red - x; yellow - y; blue - z
	let axesHelper = new THREE.AxesHelper(500);
	scene.add(axesHelper);
}

function initStats() 
{
	stats = new Stats();
	document.body.appendChild(stats.domElement);
}

function initBackground()
{
	tex_loader.load("data/background.jpg", function(texture) 
	{
		let sphere = new THREE.SphereGeometry(100, 64, 64);
		let material = new THREE.MeshBasicMaterial(
			{
				map: texture,
				side: THREE.BackSide
			});
		background = new THREE.Mesh(sphere, material);
		scene.add(background);
	});
}

function initLights()
{
	let ambient = new THREE.AmbientLight(0xFFFFFF);
	scene.add(ambient);

	const light = new THREE.SpotLight(0xFFFFFF, 2, 12)
	light.position.set(0, 0, 12);

	scene.add(light);
	scene.add(light.target);

	const helper = new THREE.SpotLightHelper(light);
	// const helper = new THREE.PointLightHelper(light);
	// const helper = new THREE.DirectionalLightHelper(directionalLight);
	scene.add(helper);

	function updateLight() {
		// directionalLight.target.updateMatrixWorld();
	  	light.target.updateMatrixWorld();
	  	helper.update();
	}
	updateLight();

	flash = new THREE.PointLight(0xFFFFFF, 30, 500, 1.7);
	flash.position.set(200, 300, 100);
	scene.add(flash);
}

function removeLoading() 
{
   document.getElementById('loading').style.display = 'none';
}

//---------------------------------------------------------

function render()
{
	stats.update();

	animateFlash();
	animateBackground();
	animateClouds(clouds1, -0.001);
	animateClouds(clouds2, 0.0015);
	animateClouds(clouds3, -0.002);

	requestAnimationFrame(render);
	composer.render(0.1);
}

function animateBackground()
{
	if (background) 
	{
		background.rotation.y -= 0.0005;
	}
}

function animateFlash()
{
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

init();