import {Camera} from './camera.js';
import {Renderer} from './renderer.js';
import {Content} from "./content.js";

let scene, camera, renderer, content, stats, gui;

function init()
{
	initScene();
	initCamera();
	initRenderer();

	initControls();
	initEventListeners();

	initGui();
	initStats();
	initAxesHelper();

	initContent();
	update();

	removeLoading();
}

//---------------------------------------------------------

function initScene()
{
	scene = new THREE.Scene();
}

function initCamera()
{
	camera = new Camera(60, window.innerWidth / window.innerHeight, 1, 1000);
	camera.setPosition(0, 0, 17.3);
}

function initRenderer()
{
	renderer = new Renderer(scene, camera.getCamera());
}

//---------------------------------------------------------

function initControls()
{
	window.controls = new THREE.OrbitControls(camera.getCamera(), document.getElementById("scene"));
}

function initEventListeners()
{
	window.addEventListener('resize', onWindowResize);
	document.addEventListener('pointermove', pointerMove);
}

function onWindowResize(event)
{
	camera.setAspect(window.innerWidth / window.innerHeight);
	camera.updateProjectionMatrix();

	renderer.webGLRendererSetSize(window.innerWidth, window.innerHeight);
	renderer.cssRendererSetSize(window.innerWidth, window.innerHeight);

	content.eventListener(event);
}

function pointerMove(event)
{
	content.eventListener(event);
}

//---------------------------------------------------------

function initGui()
{
	gui = new dat.GUI();
}

function initStats()
{
	stats = new Stats();
	document.getElementById('stats').appendChild(stats.domElement);
}

function initAxesHelper()
{
	// red - x; yellow - y; blue - z
	let axesHelper = new THREE.AxesHelper(500);
	scene.add(axesHelper);
}

function removeLoading()
{
	document.getElementById('loading').style.display = 'none';
}

//---------------------------------------------------------

function initContent()
{
	content = new Content(scene, renderer.getWebGLRenderer(), gui);
}

function update()
{
	requestAnimationFrame(update);

	stats.update();
	content.animateContent();

	renderer.render();
}

init();