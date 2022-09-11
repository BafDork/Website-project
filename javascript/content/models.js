export class Models
{
    constructor(scene) 
    {
        this._scene = scene;
        
        this.initLoaders();

        this.loadMenModel(this);
        this.initWings();
    }

    initLoaders()
    {
        let loading_manager = new THREE.LoadingManager();
        this._objLoader = new THREE.OBJLoader(loading_manager);
        this._mtlLoader = new THREE.MTLLoader();
    }

    loadMenModel(self)
    {
        self._mtlLoader.load("data/model/new_obj.mtl", function (materials) {
            materials.preload();
            self._objLoader.setMaterials(materials);

            self._objLoader.load("data/model/new_obj.obj", function (object) {
                object.traverse(part => {
                    if (part.isMesh) {
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

                self._scene.add(object);
            });
        });
    }

    initWings()
    {
        let material = new THREE.MeshPhysicalMaterial(
            {
                transparent: true,
                transmission: 1
            });

        this.loadWingModel(this, "data/wings/right_wing.obj", material, [-2.2, 0.7, 14]);
        this.loadWingModel(this, "data/wings/left_wing.obj", material, [-3.8, 0.7, 14]);
    }
    
    loadWingModel(self, file, material, position)
    {
        self._objLoader.load(file, function (object) {
            object.traverse(part => {
                part.material = material;
            });
            
            object.scale.set(0.8, 0.8, 0.8);
            object.rotation.x = Math.PI / 2;
            object.position.set(...position);

            self._scene.add(object);
        });
    }
}