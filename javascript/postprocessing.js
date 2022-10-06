export class Postprocessing
{
	constructor(scene, camera, composer)
	{
		this._camera = camera;
		let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
		let effectPass = this.initEffectPass();
		scene.add(this._GodRaysCircle);

		composer.addPass(renderPass);
		composer.addPass(effectPass);
	}

	initEffectPass()
	{
		this.initBloomEffect();
		this.initGodRaysEffect();
		this.initSmaaEffect();

		let effectPass = new POSTPROCESSING.EffectPass(
			this._camera,
			this._bloomEffect,
			this._godRaysEffect,
			this._smaaEffect
		);
		effectPass.renderToScreen = true;
		return effectPass;
	}

	initBloomEffect()
	{
		this._bloomEffect = new POSTPROCESSING.BloomEffect({
			blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
			kernelSize: POSTPROCESSING.KernelSize.SMALL,
			useLuminanceFilter: true,
			luminanceThreshold: 0.3,
			luminanceSmoothing: 0.75
		});
		this._bloomEffect.blendMode.opacity.value = 1.5;
	}

	initGodRaysEffect()
	{
		this.initGodRaysCircle();

		this._godRaysEffect = new POSTPROCESSING.GodRaysEffect(this._camera, this._GodRaysCircle, {
			blurriness: 1, // размытость 1
			//density: 7, // плотность 7
			decay: 0.8, // распад 0.8
			weight: 8, // 0.8
			exposure: 1, // воздействие 1
			//clampMax: 0.9,
			samples: 50, // 100
			//opacity: 0.01 // непрозрачность
		});
	}

	initGodRaysCircle()
	{
		let circleGeo = new THREE.CircleGeometry(2.2, 6);
		let circleMat = new THREE.MeshBasicMaterial({
			color: 0xffccaa,
			opacity: 0.03
		});

		this._GodRaysCircle = new THREE.Mesh(circleGeo, circleMat);
		this._GodRaysCircle.position.set(0, 0.3, 13.9);
	}

	initSmaaEffect()
	{
		let areaImage = new Image();
		areaImage.src = POSTPROCESSING.SMAAEffect.areaImageDataURL;

		let searchImage = new Image();
		searchImage.src = POSTPROCESSING.SMAAEffect.searchImageDataURL;

		this._smaaEffect = new POSTPROCESSING.SMAAEffect(searchImage, areaImage, 1);
	}

	animateGodRaysCircle()
	{
		this._GodRaysCircle.rotation.z += 0.002;
	}
}