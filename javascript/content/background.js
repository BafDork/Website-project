export class Background
{
    constructor(scene)
    {
        this.initLoaders();
        this.initBackground();

        scene.add(this._background);
    }

    initLoaders()
    {
        this._texLoader = new THREE.TextureLoader();
    }

    initBackground()
    {
        let texture = this._texLoader.load("data/background.jpeg");
        let sphere = new THREE.SphereGeometry(100, 64, 64);
        let material = new THREE.MeshBasicMaterial(
            {
                map: texture,
                side: THREE.BackSide
            });
        this._background = new THREE.Mesh(sphere, material);
        this._background.rotation.set(1.7, -0.1, 0);

    }

    animate()
    {
        this._background.rotation.z -= 0.0005;
    }

    adjust(gui)
    {
        let rotationFolder = gui.addFolder("Background rotation");
        rotationFolder.add(this._background.rotation, "x", -5, 5);
        rotationFolder.add(this._background.rotation, "y", -5, 5);
        rotationFolder.add(this._background.rotation, "z", -5, 5);
    }
}