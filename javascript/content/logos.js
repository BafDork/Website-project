export class Logos
{
    constructor(scene)
    {
        this._scene = scene;

        this.initLogos();
    }

    initLogos()
    {
        let element4 = document.getElementById('c');
        this._c = new THREE.CSS3DObject(element4)
        this._c.scale.set(0.00017, 0.00017, 0.00017);
        this._c.position.set(-0.97, -0.99, 15);
        this._c.rotation.y = -0.36;
        this._scene.add(this._c);

        let element = document.getElementById('python');
        this._python = new THREE.CSS3DObject(element);
        this._python.scale.set(0.00045, 0.00045, 0.00045);
        this._python.position.set(-0.5, -1.12, 15);
        this._python.rotation.y = -0.25;
        this._scene.add(this._python);

        let element2 = document.getElementById('javascript');
        this._javascript = new THREE.CSS3DObject(element2);
        this._javascript.scale.set(0.00045, 0.00045, 0.00045);
        this._javascript.position.set(0.012, -1.17, 15);
        this._scene.add(this._javascript);

        let element1 = document.getElementById('java');
        this._java = new THREE.CSS3DObject(element1);
        this._java.scale.set(0.0009, 0.0009, 0.0009);
        this._java.position.set(0.5, -1.075, 15);
        this._java.rotation.y = 0.25;
        this._scene.add(this._java);


        let element3 = document.getElementById('dart');
        this._dart = new THREE.CSS3DObject(element3);
        this._dart.scale.set(0.0005, 0.0005, 0.0005);
        this._dart.position.set(0.97, -1, 15);
        this._dart.rotation.y = 0.36;
        this._scene.add(this._dart);
    }

    adjust(gui)
    {
        let logo = this._c;

        let positionFolder = gui.addFolder("Logo position");
        positionFolder.add(logo.position, "x", -1, 1);
        positionFolder.add(logo.position, "y", -1.5, 1);
        positionFolder.add(logo.position, "z", 13, 16);
        let rotationFolder = gui.addFolder("Logo rotation");
        rotationFolder.add(logo.rotation, "x", -1, 1);
        rotationFolder.add(logo.rotation, "y", -1, 1);
        rotationFolder.add(logo.rotation, "z", -1, 1);
    }
}