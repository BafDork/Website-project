import {initContent, animateContent} from './content.js';
import {getEffectPass, animateCircle} from './postprocessing.js';
import {AmbientLight, SpotLight} from './light.js';
import {Camera} from './camera.js';

let scene, camera, renderer, cssRenderer, composer, stats, gui;

function init()
{
	initGui();

	initScene();
	initCamera();
	initRenderer();
	initCssRenderer();
	initPostprocessing();

	initControls();
	initEventListeners();

	initAxesHelper();
	initStats();

	initLights();
	initContent(scene, gui);

	removeLoading();
	render();
}

function initScene()
{
	scene = new THREE.Scene();
}

function initCamera()
{
	camera = new Camera(60, window.innerWidth / window.innerHeight, 1, 1000);
	camera.setPosition([0, 0, 17.3]);
}

function initRenderer()
{
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.querySelector('#scene').appendChild(renderer.domElement);
}

function initCssRenderer()
{
	cssRenderer = new THREE.CSS3DRenderer();
	cssRenderer.setSize(window.innerWidth, window.innerHeight);
	cssRenderer.domElement.style.position = 'absolute';
	cssRenderer.domElement.style.top = '0';
	document.querySelector('#scene').appendChild(cssRenderer.domElement);
}

function initPostprocessing()
{
	let renderPass = new POSTPROCESSING.RenderPass(scene, camera.getCamera());
	let effectPass = getEffectPass(scene, camera.getCamera());
	composer = new POSTPROCESSING.EffectComposer(renderer);
	composer.addPass(renderPass);
	composer.addPass(effectPass);
}

function initControls()
{
	let controls = new THREE.OrbitControls(camera.getCamera(), document.querySelector("#scene")); //!!!!!!!!!!!!!!!!!
	controls.update();
}

function initEventListeners()
{
	window.addEventListener('resize', onWindowResize);
	onWindowResize();
}

function onWindowResize()
{
	camera.setAspect(window.innerWidth / window.innerHeight);
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
	document.querySelector('#stats').appendChild(stats.domElement);
}

let clouds_light, model_light1, model_light2;

function initLights()
{
	let ambient = new AmbientLight(0xFFFFFF, 0.7);
	//ambient.adjust(gui, "AmbientLight");
	scene.add(ambient.getLight());

	clouds_light = new SpotLight(0xFFFFFF, 10, 10, Math.PI / 2);
	clouds_light.setLightPosition([0, 0, 14]);
	scene.add(clouds_light.getLight());
	//scene.add(clouds_light.getTarget());
	//scene.add(clouds_light.getHelper());
	//clouds_light.adjust(gui, "Clouds Light");

	model_light1 = new SpotLight(0xFFFFFF, 4.2, 10.1, 0.095);
	model_light1.setLightPosition([0, 0.66, 20]);
	model_light1.setTargetPosition([0, -3, 0]);
	//scene.add(model_light1.getLight());
	//scene.add(model_light1.getTarget());
	//scene.add(model_light1.getHelper());
	//model_light1.adjust(gui, "Model Light 1");

	model_light2 = new SpotLight(0xFFFFFF, 1, 11, 0.21);
	model_light2.setLightPosition([4, 7, 20]);
	model_light2.setTargetPosition([-8, -20, 5]);
	//scene.add(model_light2.getLight());
	//scene.add(model_light2.getTarget());
	//scene.add(model_light2.getHelper());
	//model_light2.adjust(gui, "Model Light 2");
}

function initGui()
{
	gui = new dat.GUI();
}

function updateLights()
{
	clouds_light.update();
	model_light1.update();
	model_light2.update();
}

function removeLoading()
{
	document.getElementById('loading').style.display = 'none';
}

//---------------------------------------------------------

function render()
{
	stats.update();

	updateLights();
	animateContent();
	animateCircle();

	cssRenderer.render(scene, camera.getCamera());
	requestAnimationFrame(render);
	composer.render(0.1);
}

init();