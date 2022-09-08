let tex_loader, obj_loader, mtl_loader;
let background, stars, starGeo, flash, nickname;
let cloud1, cloud2, cloud3;

import {Flash} from './flash.js';
import {Clouds} from './clouds.js';
import {Nickname} from './nickname.js';

export function initContent(scene, gui)
{
	initLoaders();
	loadModel(scene);
	initStars(scene);

	nickname = new Nickname();
	//nickname.adjust(gui);
	scene.add(nickname.getNickname());

	flash = new Flash();
	scene.add(flash.getFlash());
	initBackground(scene);

	cloud1 = new Clouds(20, 8, 6.7, 10, 0xFFA733, scene);
	//cloud1.adjust(gui, "cloud1");
	cloud2 = new Clouds(30, 6, 5.5, 9.9, 0xFF7400, scene);
	cloud3 = new Clouds(40, 3.8, 5, 9.8, 0xE60042, scene);
}

function initLoaders() 
{
	tex_loader = new THREE.TextureLoader();
	let loading_manager = new THREE.LoadingManager();
	obj_loader = new THREE.OBJLoader(loading_manager);
	mtl_loader = new THREE.MTLLoader();
}

function loadModel(scene)
{
	mtl_loader.load("data/model/new_obj.mtl", function (materials) 
	{
		materials.preload();
		obj_loader.setMaterials(materials);
		obj_loader.load("data/model/new_obj.obj", function (object) 
		{
			object.traverse(part => {
				if (part.isMesh) 
				{
					part.castShadow = true; 
					part.receiveShadow = true;
					if (part.material.map) {
						part.material.map.anisotropy = 16;
						//part.material.shininess = 10;
					}
				}
			});
			object.scale.set(0.01, 0.01, 0.01);
			object.position.set(0, -1.35, 15);
			scene.add(object);
		});
	});

	const material = new THREE.MeshPhysicalMaterial(
	{  
  		transparent: true,  
  		transmission: 1
	});

	obj_loader.load("data/wings/right_wing.obj", function (object) 
		{
	
			object.traverse(part => {
				part.material = material;
			});
			object.scale.set(0.8, 0.8, 0.8);
			object.rotation.x = Math.PI / 2;
			object.position.set(-2.2, 0.7, 14);
			scene.add(object);
		});
	obj_loader.load("data/wings/left_wing.obj", function (object) 
		{
			object.traverse(part => {
				part.material = material;
			});
			object.scale.set(0.8, 0.8, 0.8);
			object.rotation.x = Math.PI / 2;
			object.position.set(-3.8, 0.7, 14);
			scene.add(object);
		});
}

//---------------------------------------------------------

function initStars(scene)
{
	starGeo = new THREE.Geometry();
    for(let i = 0; i < 1000; i++) 
    {
    	let x = Math.random() * 100 - 50;
    	if (-7 > x || x > 7) 
    	{        
    		let star = new THREE.Vector3(
          	x,
          	Math.random() * 100 - 50,
          	Math.random() * 1000
        	);
        	starGeo.vertices.push(star);
    	}
    }

    let sprite = new tex_loader.load('data/star.png');
    let starMaterial = new THREE.PointsMaterial(
    {
        size: 0.5,
        map: sprite,
        transparent: true
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);
}

function animateStars()
{
	starGeo.vertices.forEach(p => 
	{
        p.z -= 0.5;
        
        if (p.z < -200)
        {
          	p.z = 200;
        }
    });
    starGeo.verticesNeedUpdate = true;
    stars.rotation.z +=0.005;
}

function initBackground(scene)
{
	let texture = tex_loader.load("data/background.jpg");
	let sphere = new THREE.SphereGeometry(100, 64, 64);
	let material = new THREE.MeshBasicMaterial(
		{
			map: texture,
			side: THREE.BackSide
		});
	background = new THREE.Mesh(sphere, material);
	scene.add(background);
}

function animateBackground()
{
	background.rotation.y -= 0.0005;
}

//---------------------------------------------------------
export function animateContent()
{
	animateStars();
	flash.animate();
	nickname.animate();
	animateBackground();
	cloud1.animate(-0.001);
	cloud2.animate(0.0015);
	cloud3.animate(-0.002);
}