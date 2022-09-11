import {AmbientLight, SpotLight} from "./content/light.js";
import {Flash} from './content/flash.js';
import {Clouds} from './content/clouds.js';
import {Nickname} from './content/nickname.js';
import {Models} from "./content/models.js";
import {Stars} from "./content/stars.js";
import {Background} from "./content/background.js";
import {Logos} from "./content/logos.js";

export class Content
{
	constructor(scene, gui)
	{
		this._scene = scene;
		this._gui = gui;

		this.initContent();
	}

	initContent()
	{
		this.initLights();

		this._models = new Models(this._scene);
		this._stars = new Stars(this._scene);
		this._nickname = new Nickname(this._scene);
		this._flash = new Flash(this._scene);
		this._background = new Background(this._scene);
		this._logos = new Logos(this._scene);

		this._cloud1 = new Clouds(20, 8, 6.7, 10, 0xFFA733, this._scene);
		this._cloud2 = new Clouds(30, 6, 5.5, 9.9, 0xFF7400, this._scene);
		this._cloud3 = new Clouds(35, 5, 6, 7.4, 0xED5500, this._scene);
	}

	initLights()
	{
		let ambient = new AmbientLight(0xFFFFFF, 0.7);
		//ambient.adjust(gui, "AmbientLight");
		this._scene.add(ambient.getLight());

		this._clouds_light = new SpotLight(0xFFFFFF, 10, 10, Math.PI / 2);
		this._clouds_light.setLightPosition([0, 0, 14]);
		this._scene.add(this._clouds_light.getLight());
		//this._scene.add(this._clouds_light.getTarget());
		//this._scene.add(this._clouds_light.getHelper());
		//this._clouds_light.adjust(gui, "Clouds Light");

		this._model_light1 = new SpotLight(0xFFFFFF, 4.2, 10.1, 0.095);
		this._model_light1.setLightPosition([0, 0.66, 20]);
		this._model_light1.setTargetPosition([0, -3, 0]);
		//this._scene.add(this._model_light1.getLight());
		//this._scene.add(this._model_light1.getTarget());
		//this._scene.add(this._model_light1.getHelper());
		//this._model_light1.adjust(gui, "Models Light 1");

		this._model_light2 = new SpotLight(0xFFFFFF, 1, 11, 0.21);
		this._model_light2.setLightPosition([4, 7, 20]);
		this._model_light2.setTargetPosition([-8, -20, 5]);
		//this._scene.add(this._model_light2.getLight());
		//this._scene.add(this._model_light2.getTarget());
		//this._scene.add(this._model_light2.getHelper());
		//this._model_light2.adjust(gui, "Models Light 2");
	}

	updateLights()
	{
		this._clouds_light.update();
		this._model_light1.update();
		this._model_light2.update();
	}

	animateContent()
	{
		this.updateLights();
		this._stars.animate();
		this._flash.animate();
		this._nickname.animate();
		this._background.animate();
		this._cloud1.animate(-0.001);
		this._cloud2.animate(0.0015);
		this._cloud3.animate(-0.002);
	}
}