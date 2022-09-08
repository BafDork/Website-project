export class Camera
{
	constructor() 
	{
		this._camera = new THREE.PerspectiveCamera(...arguments);
	}

	animate()
	{
		// const curve = new THREE.CubicBezierCurve3(
	 //      new THREE.Vector3(0, 0, 18),
	 //      new THREE.Vector3(1, 0, 27),
	 //      new THREE.Vector3(2, 0, 29),
	 //      new THREE.Vector3(12, 0, 30)
	 //    );
	 //    const points = curve.getPoints(50);
	 //    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
	 //    const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
	 //    let line = new THREE.Line(lineGeo, lineMat);
	 //    scene.add(line);
	}

	setPosition(position) 
	{
		this._camera.position.set(...position);
	}

	setAspect(aspect) 
	{
		this._camera.aspect = aspect;
		this._camera.updateProjectionMatrix();
	}

	getCamera() 
	{
		return this._camera;
	}
}