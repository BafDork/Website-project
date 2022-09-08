function getBloomEffect()
{
	let bloomEffect = new POSTPROCESSING.BloomEffect(
	{
		blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
		kernelSize: POSTPROCESSING.KernelSize.SMALL,
		useLuminanceFilter: true,
		luminanceThreshold: 0.3,
		luminanceSmoothing: 0.75
	});
	bloomEffect.blendMode.opacity.value = 1.5;

	return bloomEffect;
}

function getGodRaysEffect(camera)
{
	getGodRaysCircle();
	let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, circle, {
		blurriness: 1, // размытость 1
		//density: 7, // плотность 7
		decay: 0.8, // распад 0.8
		weight: 8, // 0.8
		exposure: 1, // воздействие 1
		//clampMax: 0.9,
		samples: 50, // 100
		//opacity: 0.01 // непрозрачность
	});

	return godraysEffect;
}

function getSmaaEffect()
{
	let areaImage = new Image();
	areaImage.src = POSTPROCESSING.SMAAEffect.areaImageDataURL;
	let searchImage = new Image();
	searchImage.src = POSTPROCESSING.SMAAEffect.searchImageDataURL;
	let smaaEffect = new POSTPROCESSING.SMAAEffect(searchImage, areaImage, 1);
	return smaaEffect;
}

function getGodRaysCircle()
{
	let circleGeo = new THREE.CircleGeometry(2.2, 6);
	let circleMat = new THREE.MeshBasicMaterial({
		color: 0xffccaa,
		opacity: 0.03
	});
	circle = new THREE.Mesh(circleGeo, circleMat);
	circle.position.set(0, 0.3, 13.9);
}

let circle;

export function getEffectPass(scene, camera)
{
	let bloomEffect, godraysEffect, smaaEffect;

	bloomEffect = getBloomEffect();
	godraysEffect = getGodRaysEffect(camera);
	smaaEffect = getSmaaEffect();

	let effectPass = new POSTPROCESSING.EffectPass(
		camera,
		bloomEffect,
		godraysEffect,
		smaaEffect
	);
	effectPass.renderToScreen = true;

	scene.add(circle);
	return effectPass;
}

export function animateCircle()
{
	circle.rotation.z += 0.002;
}