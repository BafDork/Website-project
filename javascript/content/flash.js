export class Flash
{
	_flag = false;
	_params = new function() 
	{
  		this.v1 = 0.985;
  		this.v2 = 70;
  		this.v3 = 150;
  		this.v4 = 300;
  		this.v5 = 0.7;
	};

	constructor(scene)
	{
		this._flash = new THREE.PointLight(0xFFFFFF, 10, 500, 1.7);
		this._flash.position.set(200, 300, 100);
		this._flash.power = 0;

		scene.add(this._flash);
	}

	animate()
	{
		let flash = this._flash;
		let par = this._params;

		if (Math.random() > par.v1) this._flag = true;
		if (this._flag) 
		{
			if (Math.random() < par.v5) flash.power = flash.power / 1.1;
			else flash.power += (par.v2 + Math.random() * par.v3);

			if (flash.power > par.v4) this._flag = false;
			if (Math.random() > par.v5) flash.position.set(
				50 + Math.random() * 100,
				300 + Math.random() * 100,
				100
			);
		}
		else flash.power -= 10 + flash.power * 0.1;
		if (flash.power < 0) flash.power = 0;
	 }

	adjust(gui)
	{
		let folder = gui.addFolder("Flash");
		folder.add(this._params, "v1", 0, 1);
		folder.add(this._params, "v2", 0, 1000);
		folder.add(this._params, "v3", 0, 1000);
		folder.add(this._params, "v4", 0, 10000);
		folder.add(this._params, "v5", 0, 1);
	}
}