import {getEffectPass} from "./postprocessing";

export class Renderer
{
    constructor(scene, camera)
    {
        this._scene = scene;
        this._camera = camera;
        this.initWebGLRenderer();
        this.initCssRenderer();
    }

    initWebGLRenderer()
    {
        this._webGLRenderer = new THREE.WebGLRenderer({antialias: true});
        this._webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector('#scene').appendChild(this._webGLRenderer.domElement);
    }

    initCssRenderer()
    {
        this._cssRenderer = new THREE.CSS3DRenderer();
        this._cssRenderer.setSize(window.innerWidth, window.innerHeight);
        this._cssRenderer.domElement.style.position = 'absolute';
        this._cssRenderer.domElement.style.top = '0';
        document.querySelector('#scene').appendChild(this._cssRenderer.domElement);
    }

    initPostprocessing()
    {
        let renderPass = new POSTPROCESSING.RenderPass(this._scene, this._camera);
        let effectPass = getEffectPass(this._scene, this._camera);
        this._composer = new POSTPROCESSING.EffectComposer(this._webGLRenderer);
        this._composer.addPass(renderPass);
        this._composer.addPass(effectPass);
    }

    render()
    {
        this._cssRenderer.render(this._scene, this._camera);
        requestAnimationFrame(this.render);
        this._composer.render(0.1);
    }
}