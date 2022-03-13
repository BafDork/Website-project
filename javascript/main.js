let scene, camera, renderer, composer, stats;
let tex_loader, background;

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
	camera.position.set(0, 0, 2);
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

function removeLoading() 
{
   document.getElementById('loading').style.display = 'none';
}

//---------------------------------------------------------

function render()
{
	stats.update();

	animateBackground();

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

init();