let tex_loader = new THREE.TextureLoader();

export function initClouds(scene, clouds, count, radius, size, position, color)
{
	tex_loader.load("data/smoke.png", function(texture) 
	{
		let cloudGeo = new THREE.PlaneBufferGeometry(size, size);
		let cloudMaterial = new THREE.MeshLambertMaterial(
		{
			color: color,
			map: texture,
			transparent: true
		});


		for (let angle = 0; angle < 2 * Math.PI; angle += 2 * Math.PI / count)
		{
			let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
			let coord = polar_to_rectangular(radius, angle)

			cloud.position.set(coord[0], coord[1], position);
			cloud.rotation.z = Math.random() * 2 * Math.PI;
			
			cloud.material.opacity = 0.8;
			clouds.push(cloud);
			scene.add(cloud);
		}
	});
}

export function animateClouds(clouds, angle)
{
	clouds.forEach(i => 
	{
		i.rotation.z += angle;
	});
}


function polar_to_rectangular(radius, angle)
{
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
}