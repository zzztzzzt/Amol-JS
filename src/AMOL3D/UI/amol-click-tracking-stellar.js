import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ClickTrackingStellar {
    constructor(color = 0, boxCount = 10, spaceSize = 15) {
        // 1. Variables
        this.objectType = 'click-tracking';
        this.color = color;
        const colorTypeOne = {
            "object-color-type": './src/AMOL3D/UI/models/torusInCube-pink.glb',
        };
        const colorTypeTwo = {
            "object-color-type": './src/AMOL3D/UI/models/torusInCube-gold.glb',
        };
        let colorCustom = {};
        const colorTypeList = [colorTypeOne, colorTypeTwo, colorCustom];
        this.colorTypeList = colorTypeList;
        let resetTimeout = null;

        // 2. Mesh
        this.boxGalaxyGroup = new THREE.Group();
        this.boxCount = boxCount;
        this.spaceSize = spaceSize;
        this.boxGalaxies = [];

        // 3. Light

        // 4. Event Listener
        function whenMouseOver() {}
        this.whenMouseOver = whenMouseOver;

        function notMouseOver() {}
        this.notMouseOver = notMouseOver;

        this.whenClick = () => {
            if (resetTimeout !== null) {
                clearTimeout(resetTimeout);
            }

            this.resetGalaxies();
            this.initGalaxies();
            resetTimeout = setTimeout(() => {
                this.resetGalaxies();
            }, 5000);
        };

        this.whenMouseMove = (x, y) => {};

        let customizeWhenMouseOver = () => {};
        this.customizeWhenMouseOver = customizeWhenMouseOver;

        let customizeNotMouseOver = () => {};
        this.customizeNotMouseOver = customizeNotMouseOver;

        let customizeWhenClick = () => {};
        this.customizeWhenClick = customizeWhenClick;

        // 5. Animate
        this.animateFunc = () => {
            this.boxGalaxies.forEach((boxGalaxy) => {
                if (boxGalaxy && boxGalaxy.rotationSpeed) {
                    boxGalaxy.rotation.y += boxGalaxy.rotationSpeed.y;
                }
            });

            this.boxGalaxyGroup.position.y += 0.1;
        };
    }

    async initGalaxies() {
        if (!this.isModelLoaded) {
            await this.loadModelAsync(this.colorTypeList[this.color]["object-color-type"]);
        }
        if (!this.boxGalaxy) {
            console.error('Failed to load base model');
            return;
        }

        const minDistance = 5;
        const maxAttempts = 100;

        for (let i = 0; i < this.boxCount; i++) {
            let attempts = 0;
            let validPosition = false;
            let newPosition;

            while (!validPosition && attempts < maxAttempts) {
                newPosition = {
                    x: (Math.random() - 0.5) * this.spaceSize,
                    y: (Math.random() - 0.5) * this.spaceSize,
                    z: (Math.random() - 0.5) * this.spaceSize
                };

                validPosition = true;
                for (const galaxy of this.boxGalaxies) {
                    const dx = newPosition.x - galaxy.position.x;
                    const dy = newPosition.y - galaxy.position.y;
                    const dz = newPosition.z - galaxy.position.z;
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (distance < minDistance) {
                        validPosition = false;
                        break;
                    }
                }
                attempts++;
            }

            if (!validPosition) {
                console.warn(`Could not find valid position for galaxy ${i} after ${maxAttempts} attempts`);
                continue;
            }

            const clonedGalaxy = this.boxGalaxy.clone();
            clonedGalaxy.position.set(newPosition.x, newPosition.y, newPosition.z);
            clonedGalaxy.scale.setScalar(Math.random() * 0.5 + 0.5);
            clonedGalaxy.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.04,
                y: (Math.random() - 0.5) * 0.04,
                z: (Math.random() - 0.5) * 0.04
            };
            // override the raycast method to prevent Raycaster from detecting the Mesh
            clonedGalaxy.traverse(child => {
                if (child.isMesh) {
                    child.raycast = function (raycaster, intersects) {
                        // return directly without doing any operation, preventing Raycaster from detecting
                    };
                }
            });
            this.boxGalaxyGroup.add(clonedGalaxy);
            this.boxGalaxies.push(clonedGalaxy);
        }

        this.boxGalaxyGroup.position.y = -10;
    }

    resetGalaxies() {
        this.boxGalaxies.forEach((galaxy) => {
            if (galaxy) {
                this.boxGalaxyGroup.remove(galaxy);

                galaxy.traverse((child) => {
                    if (child.isMesh) {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach((mat) => mat.dispose());
                            } else {
                                child.material.dispose();
                            }
                        }
                    }
                });
            }
        });
        this.boxGalaxies = [];

        if (this.boxGalaxy) {
            this.boxGalaxy.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((mat) => mat.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                }
            });

            this.boxGalaxy = null;
            this.isModelLoaded = false;
        }
    }

    async loadModelAsync(objectType = this.colorTypeList[this.color]["object-color-type"]) {
        const loader = new GLTFLoader();
        try {
            const gltf = await this.loadModel(loader, objectType);
            this.boxGalaxy = gltf.scene;
            this.isModelLoaded = true;
        } catch (error) {
            console.error('Loading GLTF error', error);
        }
    }

    loadModel(loader, objectType) {
        return new Promise((resolve, reject) => {
            loader.load(
                objectType,
                (gltf) => resolve(gltf),
                (xhr) => {
                    // console.log('GLB model ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => reject(error)
            );
        });
    }

    async getMeshes() {
        await this.loadModelAsync();
        return {
            mainMesh: this.boxGalaxyGroup,
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

    colorSet(color) {
        this.color = color;
        this.whenClick();
    }

    status() {
        console.group("STATUS : amol-click-tracking-stellar.js");

        console.log("objectType:", this.objectType);
        console.log("color:", this.color);
        console.log("colorTypeList:", this.colorTypeList);
        console.log("whenMouseOver:", this.whenMouseOver);
        console.log("notMouseOver:", this.notMouseOver);
        console.log("whenMouseMove:", this.whenMouseMove);
        console.log("customizeWhenMouseOver:", this.customizeWhenMouseOver);
        console.log("customizeNotMouseOver:", this.customizeNotMouseOver);
        console.log("customizeWhenClick:", this.customizeWhenClick);
        console.log("animateFunc:", this.animateFunc);
        console.log("getMeshes:", this.getMeshes);
        console.log("getAnimateFunc:", this.getAnimateFunc);
        console.log("getListenerFunc:", this.getListenerFunc);
        console.log("colorSet:", this.colorSet);
        console.log("boxGalaxyGroup:", this.boxGalaxyGroup);
        console.log("boxCount:", this.boxCount);
        console.log("spaceSize:", this.spaceSize);
        console.log("boxGalaxies:", this.boxGalaxies);
        console.log("initGalaxies:", this.initGalaxies);
        console.log("resetGalaxies:", this.resetGalaxies);
        console.log("loadModelAsyncr:", this.loadModelAsync);
        console.log("loadModel:", this.loadModel);

        console.groupEnd();
    }
}