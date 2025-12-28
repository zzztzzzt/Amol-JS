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

        let rotationLock = false;

        // define vibration state variables
        const vibration = {
            active: false,
            amplitude: 0, // current amplitude
            baseAmplitude: 0.015,
            amplitudeInit: 0.015,
            frequency: 50,
            decay: 0.95, // the lower the rate, the faster it stops
            startTime: 0,
            originPosY: 0,
            originPosX: 0,
        };
        this.vibration = vibration;

        // 2. Meshes
        let glbModel = null;
        this.glbModel = glbModel;

        const sciFiTube = new THREE.Group();
        this.mainMesh = sciFiTube;

        const octGroup = new THREE.Group();
        this.mainMesh.add(octGroup);

        const oct1 = this.createOct({ radius: 0.15, detail: 0, color: '#171717' });
        oct1.position.x += 0.65;
        octGroup.add(oct1);
        // override the raycast method to prevent Raycaster from detecting the Mesh
        oct1.raycast = function (raycaster, intersects) {
            // return directly without doing any operation, preventing Raycaster from detecting
        };

        const oct2 = this.createOct({ radius: 0.15, detail: 0, color: '#171717' });
        oct2.position.x -= 0.65;
        octGroup.add(oct2);
        // override the raycast method to prevent Raycaster from detecting the Mesh
        oct2.raycast = function (raycaster, intersects) {
            // return directly without doing any operation, preventing Raycaster from detecting
        };

        octGroup.position.z += 4;

        const octGroup2 = octGroup.clone();
        this.mainMesh.add(octGroup2);
        octGroup2.children.forEach(mesh => {
            mesh.scale.set(0.5, 0.5, 0.5);
        });
        octGroup2.position.z = -2;


        for (let i = 0; i < 2; i++) {
            const ring = this.createRing({
              size: 1 + i * 0.001,
              thickness: 0.0025,
              color: '#171717',
            });
          
            ring.position.z = (i - 1.5) * 0.4;

            // override the raycast method to prevent Raycaster from detecting the Mesh
            ring.raycast = function (raycaster, intersects) {
                // return directly without doing any operation, preventing Raycaster from detecting
            };

            this.mainMesh.add(ring);
        }

        // 3. Lights

        // 4. Event Listeners
        this.whenMouseOver = () => {
            rotationLock = true;
        };

        this.notMouseOver = () => {
            rotationLock = false;
        };

        this.whenClick = () => {
            triggerVibration();
        };

        this.whenMouseMove = (x, y) => {};

        this.customizeWhenMouseOver = () => {};

        this.customizeNotMouseOver = () => {};

        this.customizeWhenClick = () => {};

        // 5. Animation
        this.animateFunc = () => {
            octGroup.rotation.z += 0.025;
            octGroup.position.z -= 0.0125;

            octGroup2.rotation.z -= 0.025;

            if (octGroup.position.z <= -2) {
                octGroup.position.z = 4;
            }

            if (rotationLock) {
                this.mainMesh.rotation.z += 0.02;
            }

            const time = performance.now() * 0.001; // convert to seconds

            if (vibration.active) {
                // Amplitude * sin(Time * Frequency)
                const offset = vibration.amplitude * Math.sin(time * vibration.frequency);
                
                this.mainMesh.position.x = vibration.originPosX + offset;
                this.mainMesh.position.y = vibration.originPosY + offset;

                vibration.amplitude *= vibration.decay;

                if (vibration.amplitude < 0.001) {
                    vibration.active = false;
                    this.mainMesh.position.x = vibration.originPosX;
                    this.mainMesh.position.y = vibration.originPosY;
                }
            }
        };

        // 6. Functions
        function triggerVibration() {
            vibration.active = true;
            vibration.amplitude = vibration.amplitudeInit; // initial strength
            vibration.startTime = performance.now();
        }
    }

    createMarbleMaterial(hexColor) {
        return new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(hexColor),
    
            metalness: 0.0,
            roughness: 0.35,
    
            clearcoat: 0.4,
            clearcoatRoughness: 0.15,
    
            reflectivity: 0.5,
            ior: 1.5,
    
            side: THREE.DoubleSide
        });
    }

    createRing({ size = 1, thickness = 0.3, color='#000000' }) {
        const geometry = new THREE.TorusGeometry(size, thickness, 64, 256);
        const material = this.createMarbleMaterial(color).clone();
        return new THREE.Mesh(geometry, material);
    }

    createOct({ radius = 0.5, detail = 0, color = '#000000' }) {
        const geometry = new THREE.OctahedronGeometry(radius, detail);
        const material = this.createMarbleMaterial(color).clone();
        return new THREE.Mesh(geometry, material);
    }

    async loadModelAsync(GlbPath = "./AMOL3D/UI/models/sci-fi-tube-one.glb") {
        const loader = new GLTFLoader();
        try {
            const gltf = await this.loadModel(loader, GlbPath);
            this.glbModel = gltf.scene;
            this.mainMesh.add(this.glbModel);

            const marbleMaterial = this.createMarbleMaterial('#171717');

            this.glbModel.traverse((child) => {
                if (child.isMesh) {
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map(() =>
                            marbleMaterial.clone()
                        );
                    } else {
                        child.material = marbleMaterial.clone();
                    }
    
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

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

    scaleSet(x, y, z) {
        this.mainMesh.scale.set(x, y, z);
        this.vibration.amplitudeInit = this.vibration.baseAmplitude * (x + y + z) / 3;
    }

    positionSet(x, y, z) {
        this.mainMesh.position.set(x, y, z);
        this.vibration.originPosX = x;
        this.vibration.originPosY = y;
    }

    rotationSet(x, y, z) {
        this.mainMesh.rotation.set(x, y, z);
    }
}