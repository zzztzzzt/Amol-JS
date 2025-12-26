import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class MovieRuinOne {
    constructor(color = 0) {
        // 1. Variables
        this.objectType = 'movie';

        let colorTypeOne = {};
        let colorTypeTwo = {};
        let colorCustom = {};
        this.colorTypeList = [colorTypeOne, colorTypeTwo, colorCustom];

        // 2. Meshes
        let glbModel = null;
        this.mainMesh = glbModel;

        // 3. Lights

        // 4. Event Listeners
        this.whenMouseOver = () => {};

        this.notMouseOver = () => {};

        this.whenClick = () => {};

        this.whenMouseMove = (x, y) => {};

        this.customizeWhenMouseOver = () => {};

        this.customizeNotMouseOver = () => {};

        this.customizeWhenClick = () => {};

        // 5. Animation
        this.animateFunc = () => {};

        // 6. Functions
    }

    async loadModelAsync(GlbPath = "./AMOL3D/UI/models/sci-fi-tube-one.glb") {
        const loader = new GLTFLoader();
        try {
            const gltf = await this.loadModel(loader, GlbPath);
            this.mainMesh = gltf.scene;

            // if model's surface is still transparent : traverse all mesh settings for double-sided rendering
            this.fixBackfaceCulling(this.mainMesh);

            this.isModelLoaded = true;
        } catch (error) {
            console.error('Loading GLTF error', error);
        }
    }

    loadModel(loader, GlbPath) {
        return new Promise((resolve, reject) => {
            loader.load(
                GlbPath,
                (gltf) => resolve(gltf),
                (xhr) => {
                    // console.log('GLB model ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => reject(error)
            );
        });
    }

    // traverse all mesh settings for double-sided rendering
    fixBackfaceCulling(mesh) {
        mesh.traverse((child) => {
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.side = THREE.DoubleSide);
                }
            }
        });
    }

    async getMeshes() {
        await this.loadModelAsync();
        return {
            // main mesh must be named "this.mainMesh", for raycaster judging.
            mainMesh: this.mainMesh,
        };
    }

    getAnimateFunc() {
        return this.animateFunc;
    }

    getListenerFunc(listenerType) {
        if (listenerType === "click") {
            return this.whenClick;
        }
        if (listenerType === "mousemove") {
            return this.whenMouseMove;
        }
        if (listenerType === "mouseover") {
            return this.whenMouseOver;
        }
        if (listenerType === "notmouseover") {
            return this.notMouseOver;
        }
    }

    colorSet(color) {}

    positionSet(x, y, z) {}

    rotationSet(x, y, z) {}
}