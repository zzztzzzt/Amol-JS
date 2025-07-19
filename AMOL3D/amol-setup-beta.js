import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolScene {
    constructor(divId, cssDivId) {
        const div = document.getElementById(divId);
        this.div = div;
        const cssDiv = document.getElementById(cssDivId);
        this.cssDiv = cssDiv;

        // 1.Variables
        let amolObjectList = [];
        this.amolObjectList = amolObjectList;
        let listenerFuncListClick = [];
        this.listenerFuncListClick = listenerFuncListClick;
        let listenerFuncListMouseMove = [];
        this.listenerFuncListMouseMove = listenerFuncListMouseMove;
        let listenerFuncListMouseOver = [];
        this.listenerFuncListMouseOver = listenerFuncListMouseOver;
        let listenerFuncListNotMouseOver = [];
        this.listenerFuncListNotMouseOver = listenerFuncListNotMouseOver;
        let animateFuncList = [];
        this.animateFuncList = animateFuncList;

        // 2.Scene
        const scene = new THREE.Scene();
        this.scene = scene;

        // 3.Clock
        const clock = new THREE.Clock();
        this.clock = clock;

        // 4.Camera
        let camera = new THREE.PerspectiveCamera(20, div.getBoundingClientRect().width / div.getBoundingClientRect().height, 0.1, 1000);
        camera.position.z = 20;
        this.camera = camera;

        // 5.Renderer
        let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(div.getBoundingClientRect().width, div.getBoundingClientRect().height);
        div.appendChild(renderer.domElement);
        this.renderer = renderer;

        let cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(cssDiv.getBoundingClientRect().width, cssDiv.getBoundingClientRect().height);
        cssDiv.appendChild(cssRenderer.domElement);
        this.cssRenderer = cssRenderer;

        // 6.Mesh

        // 7.Light
        let ambientLight = new THREE.AmbientLight(0xffffff, 3);
        scene.add(ambientLight);
        this.ambientLight = ambientLight;

        let light = new THREE.PointLight(0xffffff, 200, 50);
        light.position.set(0, 5, 0);
        scene.add(light);
        this.light = light;

        // 8.Event Listener
        window.addEventListener('resize', () => {
            camera.aspect = div.getBoundingClientRect().width / div.getBoundingClientRect().height;
            camera.updateProjectionMatrix();
            renderer.setSize(div.getBoundingClientRect().width, div.getBoundingClientRect().height);
            cssRenderer.setSize(cssDiv.getBoundingClientRect().width, cssDiv.getBoundingClientRect().height);
        });

        window.addEventListener('click', () => {
            listenerFuncListClick.forEach(func => {
                func();
            });
        });

        window.addEventListener('mousemove', () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const currentX = (event.clientX / screenWidth) * 2 - 1;
            const currentY = -((event.clientY / screenHeight) * 2 - 1);
            listenerFuncListMouseMove.forEach(func => {
                func(currentX, currentY);
            });
        });

        // 9.Orbit Controls
        //const controls = new OrbitControls(camera, cssRenderer.domElement);
        //this.controls = controls;

        // 10.Animate
        function animate() {
            animateFuncList.forEach(func => {
                func();
            });

            light.position.x = Math.sin(Date.now() * 0.00025) * 10;
            light.position.z = Math.abs(Math.cos(Date.now() * 0.00025)) * 10;

            //controls.update();

            renderer.render(scene, camera);
            cssRenderer.render(scene, camera);

            requestAnimationFrame(animate);
        }
        animate();
    }

    async create(amolObject) {
        this.amolObjectList.push(amolObject);

        const meshes = await amolObject.getMeshes();
        //console.log(meshes);
        if (meshes) {
            Object.values(meshes).forEach(mesh => {
                this.scene.add(mesh);
            });
        }

        this.animateFuncList.push(amolObject.getAnimateFunc());
        this.listenerFuncListClick.push(amolObject.getListenerFunc("click"));
        this.listenerFuncListMouseMove.push(amolObject.getListenerFunc("mousemove"));
    }

    status() {
        console.group("STATUS : amol-setup.js");

        console.log("div:", this.div);
        console.log("cssDiv:", this.cssDiv);
        console.log("amolObjectList:", this.amolObjectList);
        console.log("scene:", this.scene);
        console.log("clock:", this.clock);
        console.log("camera:", this.camera);
        console.log("renderer:", this.renderer);
        console.log("cssRenderer:", this.cssRenderer);
        console.log("ambientLight:", this.ambientLight);
        console.log("light:", this.light);
        //console.log("controls", this.controls);
        console.log("animateFuncList:", this.animateFuncList);
        console.log("listenerFuncListClick:", this.listenerFuncListClick);
        console.log("listenerFuncListMouseMove:", this.listenerFuncListMouseMove);
        console.log("listenerFuncListMouseOver:", this.listenerFuncListMouseOver);
        console.log("listenerFuncListNotMouseOver:", this.listenerFuncListNotMouseOver);

        console.groupEnd();
    }
}