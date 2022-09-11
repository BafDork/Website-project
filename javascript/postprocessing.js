export class Postprocessing
{
	constructor(scene, camera, composer)
	{
		this._scene = scene;
		this._camera = camera;

		let renderPass = new POSTPROCESSING.RenderPass(this._scene, this._camera);
		let effectPass = this.initEffectPass(this._scene, this._camera);

		composer.addPass(renderPass);
		composer.addPass(effectPass);
	}

	initEffectPass(scene, camera)
	{
		let bloomEffect, godraysEffect, smaaEffect;

		bloomEffect = this.initBloomEffect();
		godraysEffect = this.initGodRaysEffect();
		smaaEffect = this.initSmaaEffect();

		let effectPass = new POSTPROCESSING.EffectPass(
			camera,
			bloomEffect,
			godraysEffect,
			smaaEffect
		);
		effectPass.renderToScreen = true;
		return effectPass;
	}

	initBloomEffect()
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

	initGodRaysEffect()
	{
		this.initGodRaysCircle();

		let godraysEffect = new POSTPROCESSING.GodRaysEffect(this._camera, this._GRcircle, {
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

	initGodRaysCircle()
	{
		let circleGeo = new THREE.CircleGeometry(2.2, 6);
		let circleMat = new THREE.MeshBasicMaterial({
			color: 0xffccaa,
			opacity: 0.03
		});

		this._GRcircle = new THREE.Mesh(circleGeo, circleMat);
		this._GRcircle.position.set(0, 0.3, 13.9);

		this._scene.add(this._GRcircle);
	}

	initSmaaEffect()
	{
		let areaImage = new Image();
		areaImage.src = POSTPROCESSING.SMAAEffect.areaImageDataURL;

		let searchImage = new Image();
		searchImage.src = POSTPROCESSING.SMAAEffect.searchImageDataURL;

		let smaaEffect = new POSTPROCESSING.SMAAEffect(searchImage, areaImage, 1);
		return smaaEffect;
	}

	animateGRcircle()
	{
		this._GRcircle.rotation.z += 0.002;
	}
}