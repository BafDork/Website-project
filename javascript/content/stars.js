export class Stars
{
    constructor(scene)
    {
        this.initStars();
        scene.add(this._stars);
    }

    initStars()
    {
        let texLoader = new THREE.TextureLoader();
        this._starGeo = new THREE.Geometry();

        for (let i = 0; i < 1000; i++)
        {
            let x = Math.random() * 100 - 50;
            if (-7 > x || x > 7)
            {
                let star = new THREE.Vector3(
                    x,
                    Math.random() * 100 - 50,
                    Math.random() * 1000
                );
                this._starGeo.vertices.push(star);
            }
        }

        let sprite = texLoader.load('data/star.png');
        let starMaterial = new THREE.PointsMaterial({
            size: 0.5,
            map: sprite,
            transparent: true
            });
        this._stars = new THREE.Points(this._starGeo, starMaterial);
    }

    animate()
    {
        this._starGeo.vertices.forEach(p => {
            p.z -= 0.5;
            if (p.z < -200) p.z = 200;
        });

        this._starGeo.verticesNeedUpdate = true;
        this._stars.rotation.z += 0.005;
    }
}