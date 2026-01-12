import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { noise } from '../utils/perlinNoise.js';

export class ButtonFlowerRing {
    constructor(color = 0) {
        // 1. Variables
        this.objectType = 'button';

        this.color = color;
        let colorTypeOne = {
            "model-ring-flower-path": './AMOL3D/UI/models/ring-flower-pink.glb',
        };
        let colorTypeTwo = {};
        let colorCustom = {};
        this.colorTypeList = [colorTypeOne, colorTypeTwo, colorCustom];

        // 2. Meshes
        let glbModel = null;
        this.mainMesh = glbModel;

        let mistGroup = new THREE.Group();
        this.mistGroup = mistGroup;
        const geometry = new THREE.BufferGeometry();
        const particleCount = 2000;
        // cylinder particles
        const radius = 0.1;
        const height = 10;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            // Random angle
            const theta = Math.random() * Math.PI * 2;
            
            // Random radius (use Math.sqrt to make the distribution more uniform)
            const r = Math.sqrt(Math.random()) * radius;
            
            // Random height
            const y = Math.random() * height;

            // change to Cartesian coordinates
            positions[i * 3] = r * Math.cos(theta); // x
            positions[i * 3 + 1] = y; // y
            positions[i * 3 + 2] = r * Math.sin(theta); // z

            // Let the starting position of y be symmetrically distributed around 0 (e.g., from -5 to 5)
            const initialY = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = initialY;

            const direction = Math.random() > 0.5 ? 1 : -1;
            velocities.push({
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() * 0.01 + 0.005) * direction,
                z: (Math.random() - 0.5) * 0.005
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            color: "#000000",
            transparent: false,
            opacity: 0.6,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        const points = new THREE.Points(geometry, material);
        mistGroup.add(points);

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
        const clock = new THREE.Clock();
        const spiralStrength = 0.05;
        const upwardSpeed = 0.02;
        const limit = 5; // upper and lower boundaries

        this.animateFunc = () => {
            const time = clock.getElapsedTime();
            const posAttribute = points.geometry.attributes.position;
            
            for (let i = 0; i < particleCount; i++) {
                let x = posAttribute.getX(i);
                let y = posAttribute.getY(i);
                let z = posAttribute.getZ(i);

                // When y approaches 5, the spread increases exponentially
                // Use Math.pow to concentrate the widening effect at the top
                // Regardless of whether y is 5 or -5, progress will approach 1
                const heightProgress = Math.abs(y) / limit; 
                const spread = Math.pow(heightProgress, 3) * 2.5; // The cube makes the bottom thinner and the top suddenly wider

                // Use noise to generate disturbances
                // The scaling factor (0.5, 0.5, 0.5) determines the "frequency" of the noise. the smaller the number, the smoother the smoke fluctuations
                // time * 0.2 allows the noise to evolve over time
                const noiseX = noise(x * 0.5, y * 0.5, time * 0.2);
                const noiseZ = noise(z * 0.5, y * 0.5, time * 0.2);

                y += velocities[i].y;
                x += (noiseX * 0.02 + velocities[i].x) * (1 + spread) * 2;
                z += (noiseZ * 0.02 + velocities[i].z) * (1 + spread);

                // Boundary check: If the smoke rises too high, reset back to the bottom
                if (y > limit || y < -limit) {
                    y = 0;
                    x = (Math.random() - 0.5) * 0.2;
                    z = (Math.random() - 0.5) * 0.2;
                }

                posAttribute.setXYZ(i, x, y, z);
            }
            
            posAttribute.needsUpdate = true;
        };

        // 6. Functions
    }

    async loadModelAsync(GlbPath = this.colorTypeList[this.color]["model-ring-flower-path"]) {
        const loader = new GLTFLoader();
        try {
            const gltf = await this.loadModel(loader, GlbPath);
            this.mainMesh = gltf.scene;
            this.mainMesh.scale.set(0.4, 0.4, 0.4);

            // if model's surface is still transparent
            //this.fixBackfaceCulling(this.mainMesh);

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
            mistGroup: this.mistGroup,
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

    scaleSet(x, y, z) {}

    positionSet(x, y, z) {}

    rotationSet(x, y, z) {}
}