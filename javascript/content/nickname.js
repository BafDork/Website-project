export class Nickname
{
    _angle = 1;
    _params = new function()
    {
        this.spin = 0.023;
        this.radius = 0.012;
        this.turn = 0.023;
    };

    constructor(scene)
    {
        this.initNickname();
        scene.add(this._nickname);
    }

    initNickname()
    {
        this._element = document.getElementById('nickname');
        this._nickname = new THREE.CSS3DObject(this._element);

        this._nickname.position.set(0.5, -0.5, 15);
        this._nickname.rotation.set(-0.5, 2.2, 0);
        this._nickname.scale.set(0.004, 0.004, 0.004);

        let date = new Date();
        let age = date.getUTCFullYear() - 2003;
        if (date.getUTCMonth() === 0 && date.getUTCDate() < 28) age -= 1;
        this._element.innerHTML = "Еугений Чернов " + age + "lvl"
    }

    animate()
    {
        let nickname = this._nickname;
        let params = this._params;

        this._angle += params.spin;
        nickname.rotation.y -= params.turn;

        let coords = polar_to_rectangular(params.radius, this._angle);
        nickname.position.set(nickname.position.x + coords[0], nickname.position.y, nickname.position.z + coords[1]);
        this._element.style.opacity = -Math.cos(this._angle) + 0.7;
    }

    adjust(gui)
    {
        let params = this._params;
        let nickname = this._nickname;

        let nicknameFolder = gui.addFolder("Nickname");
        nicknameFolder.add(params, "radius", 0.001, 0.1);
        nicknameFolder.add(params, "turn", 0.001, 0.1);
        nicknameFolder.add(params, "spin", 0.001, 0.2);
        let positionFolder = gui.addFolder("Nickname position");
        positionFolder.add(nickname.position, "x", -1, 1);
        positionFolder.add(nickname.position, "y", -1, 1);
        positionFolder.add(nickname.position, "z", 13, 16);
        let rotationFolder = gui.addFolder("Nickname rotation");
        rotationFolder.add(nickname.rotation, "x", -1, 1);
        rotationFolder.add(nickname.rotation, "y", -1, 1);
        rotationFolder.add(nickname.rotation, "z", -1, 1);
    }
}

function polar_to_rectangular(radius, angle)
{
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
}