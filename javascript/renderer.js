import {Postprocessing} from './postprocessing.js';

export class Renderer
{
    constructor(scene, camera)
    {
        this._scene = scene;
        this._camera = camera;
        this._element = document.getElementById('scene');

        this.initWebGLRenderer();
        this.initCssRenderer();
        this.initPostprocessing();
    }

    initWebGLRenderer()
    {
        this._webGLRenderer = new THREE.WebGLRenderer({antialias: true});
        this._webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        this._webGLRenderer.setPixelRatio(window.devicePixelRatio);
        this._element.appendChild(this._webGLRenderer.domElement);
    }

    initCssRenderer()
    {
        this._cssRenderer = new THREE.CSS3DRenderer();
        this._cssRenderer.setSize(window.innerWidth, window.innerHeight);
        this._cssRenderer.domElement.style.position = 'absolute';
        this._cssRenderer.domElement.style.top = '0';
        this._element.appendChild(this._cssRenderer.domElement);
    }

    initPostprocessing()
    {
        this._composer = new POSTPROCESSING.EffectComposer(this._webGLRenderer);
        this._postprocessing = new Postprocessing(this._scene, this._camera, this._composer);
    }

    render()
    {
        this._postprocessing.animateGodRaysCircle();
        this._cssRenderer.render(this._scene, this._camera);
        this._composer.render(0.1);
    }

    webGLRendererSetSize(width, height)
    {
        this._webGLRenderer.setSize(width, height);
    }

    cssRendererSetSize(width, height)
    {
        this._cssRenderer.setSize(width, height);
    }

    getWebGLRenderer()
    {
        return this._webGLRenderer;
    }

    getCssRenderer()
    {
        return this._cssRenderer;
    }
}