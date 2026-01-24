import * as THREE from 'three';
//import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { noise, negativeNoise } from '../utils/perlinNoise.js';

export class ButtonVanilla {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'button';
        this.viewOffset = viewOffset;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0x8CD5FF, 0xFFFFFF, 0x339CFF, 0xDCDCDC];
        const colorTypeTwo = [0xDA7272, 0xFFFFFF, 0xD765FF, 0xDCDCDC];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let clickDetect = false;
        const initialPositions = []; // store particle initial position

        // 2.Mesh
        const arrowGeometry = new THREE.CylinderGeometry(0, 0.5, 1, 6, 1);
        const arrowMaterial = new THREE.MeshPhongMaterial({ color: colorList[chooseColor][0] });
        let arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.arrow = arrow;

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshMatcapMaterial({ color: colorList[chooseColor][1], visible: false });
        const sphere = new THREE.Mesh(geometry, material);
        this.mainMesh = sphere;

        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({ color: colorList[chooseColor][2], size: 0.1 });
        const particleCount = 2000;
        const particles = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const u = Math.random() * Math.PI * 2;
            const v = Math.random() * Math.PI * 2;
            const R = 1.5;
            const r = 0.5;
            const x = (R + r * Math.cos(v)) * Math.cos(u);
            const y = (R + r * Math.cos(v)) * Math.sin(u);
            const z = r * Math.sin(v);

            particles[i * 3] = x;
            particles[i * 3 + 1] = y;
            particles[i * 3 + 2] = z;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        // override the raycast method to prevent Raycaster from detecting the Mesh
        particleSystem.raycast = function (raycaster, intersects) {
            // return directly without doing any operation, preventing Raycaster from detecting
        };
        this.particleSystem = particleSystem;

        // record initial position before dispersion
        for (let i = 0; i < particleCount; i++) {
            initialPositions.push({
                x: particles[i * 3],
                y: particles[i * 3 + 1],
                z: particles[i * 3 + 2]
            });
        }

        // 3.Light

        // 4.Event Listener
        function whenMouseOver() {
            arrow.material.color.setHex( colorList[chooseColor][3] );
        }
        this.whenMouseOver = whenMouseOver;

        function notMouseOver() {
            arrow.material.color.setHex( colorList[chooseColor][0] );
        }
        this.notMouseOver = notMouseOver;

        function whenClick() {
            clickDetect = true;
            elapsedTime = 0;
        }
        this.whenClick = whenClick;

        this.whenMouseMove = (x, y) => {};

        let customizeWhenMouseOver = () => {};
        this.customizeWhenMouseOver = customizeWhenMouseOver;

        let customizeNotMouseOver = () => {};
        this.customizeNotMouseOver = customizeNotMouseOver;

        let customizeWhenClick = () => {};
        this.customizeWhenClick = customizeWhenClick;

        // 5.Animate
        let returnDuration = 10;
        const returnSpeed = 0.1;
        let elapsedTime = 0;
        function animateFunc() {
            arrow.rotation.x += 0.01;
            arrow.rotation.y += 0.01;

            if (clickDetect == true) {
                returnDuration = 3;
            }
            else {
                returnDuration = 1;
            }

            const time = Date.now() * 0.001;
            const positions = particleGeometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                const index = i * 3;
                const x = positions[index];
                const y = positions[index + 1];
                const z = positions[index + 2];

                // select different noises according to the status
                let noiseX, noiseY, noiseZ;

                if (clickDetect == true) {
                    noiseX = negativeNoise(x * 2, y * 2, z * 2);
                    noiseY = negativeNoise(y * 2, z * 2, x * 2);
                    noiseZ = negativeNoise(z * 2, x * 2, y * 2);
                    if (elapsedTime > returnDuration / 100) {
                        noiseX = noise(x * 0.02, y * 0.02, z * 0.02);
                        noiseY = noise(y * 0.02, z * 0.02, x * 0.02);
                        noiseZ = noise(z * 0.02, x * 0.02, y * 0.02);
                    }

                    positions[index] += noiseX * 0.1;
                    positions[index + 1] += noiseY * 0.1;
                    positions[index + 2] += noiseZ * 0.1;
                }

                if (clickDetect == false) {
                    noiseX = negativeNoise(x * 1.6, y * 1.6, z * 1.6);
                    noiseY = negativeNoise(y * 1.6, z * 1.6, x * 1.6);
                    noiseZ = negativeNoise(z * 1.6, x * 1.6, y * 1.6);
                    if (elapsedTime > returnDuration / 1000) {
                        noiseX = noise(x * -2, y * -2, z * -2);
                        noiseY = noise(y * -2, z * -2, x * -2);
                        noiseZ = noise(z * -2, x * -2, y * -2);
                    }

                    positions[index] += noiseX * 0.01;
                    positions[index + 1] += noiseY * 0.01;
                    positions[index + 2] += noiseZ * 0.01;
                }
            }

            elapsedTime += 0.0167;

            if (elapsedTime > returnDuration) {
                // gradually move the particle back to its original position
                const t = (elapsedTime - returnDuration) * returnSpeed;
                for (let i = 0; i < particleCount; i++) {
                    const index = i * 3;
                    particles[index] = lerp(t, particles[index], initialPositions[i].x);
                    particles[index + 1] = lerp(t, particles[index + 1], initialPositions[i].y);
                    particles[index + 2] = lerp(t, particles[index + 2], initialPositions[i].z);
                }
            }
            if (clickDetect == false && elapsedTime > 2.5) {
                elapsedTime = 0;
            }
            if (clickDetect == true && elapsedTime > 5) {
                clickDetect = false;
            }

            if (clickDetect == false) {
                for (let i = 0; i < particleCount; i++) {
                    const index = i * 3;
                    let x = positions[index];
                    let y = positions[index + 1];
                    let z = positions[index + 2];

                    // calculate the polar coordinates of the particle relative to the center of the system
                    const radius = Math.sqrt(x * x + y * y + z * z);
                    let theta = Math.atan2(y, x);
                    let phi = Math.acos(z / radius);

                    // increase the rotation angle, here use time to control the rotation speed
                    theta += 0.01; // angle increment to control the rotation speed

                    // convert polar coordinates back to Cartesian coordinates
                    x = radius * Math.sin(phi) * Math.cos(theta);
                    y = radius * Math.sin(phi) * Math.sin(theta);
                    z = radius * Math.cos(phi);

                    positions[index] = x;
                    positions[index + 1] = y;
                    positions[index + 2] = z;

                    // update the initial position array at the same time
                    const { x: initialX, y: initialY, z: initialZ } = initialPositions[i];
                    const newInitialX = initialX * Math.cos(0.01) - initialY * Math.sin(0.01);
                    const newInitialY = initialX * Math.sin(0.01) + initialY * Math.cos(0.01);
                    initialPositions[i] = { x: newInitialX, y: newInitialY, z: initialZ };
                }
            }

            particleGeometry.attributes.position.needsUpdate = true;
        }
        this.animateFunc = animateFunc;

        // 10.Function
        function lerp(t, a, b) {
            return a + t * (b - a);
        }

        //function for position
        function changePosition(x, y, z) {
            this.mainMesh.position.set(x, y, z);
            this.arrow.position.set(x, y, z);
            this.particleSystem.position.set(x, y, z);
        }
        this.changePosition = changePosition;

        //function for scale
        function changeScale(scale) {
            scaleNum = scale;
            this.mainMesh.scale.set(scale, scale, scale);
            this.arrow.scale.set(scale, scale, scale);
            this.particleSystem.scale.set(scale, scale, scale);
            this.particleSystem.material.size = 0.1 * scaleNum;
        }
        this.changeScale = changeScale;
    }

    // 11.Export
    //tools
    async getMeshes() {
        return {
            mainMesh: this.mainMesh,
            arrow: this.arrow,
            particleSystem: this.particleSystem,
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
}