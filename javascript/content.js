import {AmbientLight, SpotLight} from "./content/light.js";
import {Particles} from "./content/particle_system/particles.js";
import {Background} from "./content/background.js";
import {Nickname} from './content/nickname.js';
import {Clouds} from './content/clouds.js';
import {Models} from "./content/models.js";
import {Flash} from './content/flash.js';
import {Stars} from "./content/stars.js";
import {Logos} from "./content/logos.js";

export class Content
{
	constructor(scene, renderer, gui)
	{
		this.initContent(scene, renderer, gui);
	}

	initContent(scene, renderer, gui)
	{
		this.initLights(scene, gui);

		this._particles = new Particles(scene, renderer);
		this._background = new Background(scene);
		this._stars = new Stars(scene);
		this._nickname = new Nickname(scene);
		this._flash = new Flash(scene);
		new Models(scene);
		new Logos(scene);

		this._cloud1 = new Clouds(20, 8, 6.7, 10, 0xFFA733, scene);
		this._cloud2 = new Clouds(30, 6, 5.5, 9.9, 0xFF7400, scene);
		this._cloud3 = new Clouds(35, 5, 6, 7.4, 0xED5500, scene);
	}

	initLights(scene, gui)
	{
		let ambient = new AmbientLight(scene, 0xFFFFFF, 0.7);

		this._clouds_light = new SpotLight(scene,0xFFFFFF, 10, 10, Math.PI / 2);
		this._clouds_light.setLightPosition([0, 0, 14]);

		// this._model_light1 = new SpotLight(scene, 0xFFFFFF, 4.2, 10.1, 0.095);
		// this._model_light1.setLightPosition([0, 0.66, 20]);
		// this._model_light1.setTargetPosition([0, -3, 0]);
		//
		// this._model_light2 = new SpotLight(scene, 0xFFFFFF, 1, 11, 0.21);
		// this._model_light2.setLightPosition([4, 7, 20]);
		// this._model_light2.setTargetPosition([-8, -20, 5]);
	}

	updateLights()
	{
		this._clouds_light.update();
		// this._model_light1.update();
		// this._model_light2.update();
	}

	animateContent()
	{
		//this.updateLights();
		this._stars.animate();
		this._flash.animate();
		this._nickname.animate();
		this._background.animate();
		this._cloud1.animate(-0.001);
		this._cloud2.animate(0.0015);
		this._cloud3.animate(-0.002);
		this._particles.animate();
	}

	eventListener(event)
	{
		switch (event.type)
		{
			case "resize":
			{
				this._particles.resizeEvent();
				break;
			}
			case "pointermove":
			{
				this._particles.pointerMoveEvent(event);
				break;
			}
		}
	}
}