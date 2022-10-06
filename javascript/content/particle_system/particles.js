import {GPUComputationRenderer} from "./GPUComputationRenderer.js";
import {particleFrag} from "./fragmentShaderParticle.js";
import {velocityFrag} from "./fragmentShaderVelocity.js";
import {positionFrag} from "./fragmentShaderPosition.js";
import {particleVert} from "./vertexShaderParticle.js";

export class Particles
{
    _then = 0

    constructor(scene, renderer)
    {
        this.initCloudObject(scene);
        this.initGpuComputationRenderer(renderer);
    }

    initCloudObject(scene)
    {
        const textureSize = 1024;
        const particles = textureSize * textureSize;

        let vertices = new Float32Array(particles * 3).fill(0);
        let references = new Float32Array(particles * 2);

        for (let i = 0; i < references.length; i += 2)
        {
            let index = i / 2;
            references[i] = index % textureSize / textureSize;
            references[i + 1] = Math.floor(index / textureSize) / textureSize;
        }

        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.addAttribute('reference', new THREE.BufferAttribute(references, 2));

        let loader = new THREE.TextureLoader();
        let texture = loader.load("data/noise.png");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;

        this._uniforms = {
            u_time: {type: "f", value: 1.0},
            u_resolution: {type: "v2", value: new THREE.Vector2()},
            u_noise: {type: "t", value: texture},
            u_mouse: {type: "v2", value: new THREE.Vector2()},
            u_texturePosition: {value: null},
        };

        let particleMaterial = new THREE.ShaderMaterial({
            uniforms: this._uniforms,
            vertexShader: particleVert,
            fragmentShader: particleFrag,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            transparent: false
        });
        particleMaterial.extensions.derivatives = true;

        let cloud_obj = new THREE.Points(geometry, particleMaterial);
        cloud_obj.position.z = -80;
        scene.add(cloud_obj);
    }

    initGpuComputationRenderer(renderer)
    {
        const textureSize = 1024;
        const textureArraySize = textureSize * textureSize * 4.;

        this.gpuComputationRenderer = new GPUComputationRenderer(textureSize, textureSize, renderer);
        let dataPos_orig = this.gpuComputationRenderer.createTexture();
        let dataPos = this.gpuComputationRenderer.createTexture();
        let dataVel = this.gpuComputationRenderer.createTexture();

        for (let i = 0; i < textureArraySize; i += 4) {
            let radius = 2.;
            let phi = Math.random() * Math.PI * 2.;
            let costheta = Math.random() * 2. - 1.;
            let u = Math.random();

            let theta = Math.acos(costheta);
            let r = radius * Math.cbrt(u);

            let x = r * Math.sin(theta) * Math.cos(phi);
            let y = r * Math.sin(theta) * Math.sin(phi);
            let z = r * Math.cos(theta);

            dataPos.image.data[i] = x;
            dataPos.image.data[i + 1] = y;
            dataPos.image.data[i + 2] = z;
            dataPos.image.data[i + 3] = 1;

            dataPos_orig.image.data[i] = x;
            dataPos_orig.image.data[i + 1] = y;
            dataPos_orig.image.data[i + 2] = z;
            dataPos_orig.image.data[i + 3] = 1;

            dataVel.image.data[i] = x * 3.;
            dataVel.image.data[i + 1] = y * 3.;
            dataVel.image.data[i + 2] = z * 3.;
            dataVel.image.data[i + 3] = 1;
        }

        this.textureVelocity = this.gpuComputationRenderer.addVariable('v_samplerVelocity', velocityFrag, dataVel);
        this.texturePosition = this.gpuComputationRenderer.addVariable('v_samplerPosition', positionFrag, dataPos);

        this.texturePosition.material.uniforms.v_samplerPosition_orig = {type: "t", value: dataPos_orig};
        this.textureVelocity.material.uniforms.u_time = {value: -1000};
        this.textureVelocity.material.uniforms.u_mousex = {value: 0};
        this.texturePosition.material.uniforms.u_time = {value: 0};
        this.texturePosition.material.uniforms.delta = {value: 0};

        this.gpuComputationRenderer.setVariableDependencies(this.textureVelocity, [this.textureVelocity, this.texturePosition]);
        this.gpuComputationRenderer.setVariableDependencies(this.texturePosition, [this.textureVelocity, this.texturePosition]);

        this.texturePosition.wrapS = THREE.RepeatWrapping;
        this.texturePosition.wrapT = THREE.RepeatWrapping;
        this.textureVelocity.wrapS = THREE.RepeatWrapping;
        this.textureVelocity.wrapT = THREE.RepeatWrapping;

        let gpuComputationRendererError = this.gpuComputationRenderer.init();
        if (gpuComputationRendererError) console.error('ERROR', gpuComputationRendererError);
    }

    animate()
    {
        let now = Date.now() / 1000;
        let _delta = now - this._then;
        this._then = now;

        this.gpuComputationRenderer.compute();

        this.texturePosition.material.uniforms.delta.value = Math.min(_delta, 0.5);
        this.textureVelocity.material.uniforms.u_time.value += .0005;
        this.texturePosition.material.uniforms.u_time.value += _delta;

        this._uniforms.u_time.value += _delta;
        this._uniforms.u_texturePosition.value = this.gpuComputationRenderer.getCurrentRenderTarget(this.texturePosition).texture;

        window.pos = this.gpuComputationRenderer.getCurrentRenderTarget(this.texturePosition);
    }

    resizeEvent()
    {
        this._uniforms.u_resolution.value.x = window.innerWidth;
        this._uniforms.u_resolution.value.y = window.innerHeight;
    }

    pointerMoveEvent(event)
    {
        let ratio = window.innerHeight / window.innerWidth;
        this.textureVelocity.material.uniforms.u_mousex.value = event.pageX;
        this._uniforms.u_mouse.value.x = (event.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
        this._uniforms.u_mouse.value.y = (event.pageY - window.innerHeight / 2) / window.innerHeight * -1;

        event.preventDefault();
    }
}