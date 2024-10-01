import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolInputThunder {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'input';
        this.viewOffset = viewOffset;
        const offsetNum = 0.95;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = ['rgba(255, 255, 255, 0.1)', 'rgba(105, 27, 161, 0.3)', 'rgba(105, 27, 161, 1)', 'rgba(105, 27, 161, 1)', 'rgba(255, 255, 255, 1)', '0 4px 15px rgba(56, 18, 117, 0.3)'];
        const colorTypeTwo = ['rgba(255, 255, 255, 0.1)', 'rgba(179, 179, 179, 0.4)', 'rgba(156, 156, 156, 1)', 'rgba(156, 156, 156, 1)', 'rgba(255, 255, 255, 1)', '0 4px 15px rgba(161, 161, 161, 0.3)'];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let time = 0; // noise parameters
        let isFocused = false;
        let turnSideFlag = 1;

        // 2.Scene

        // 3.Camera

        // 4.Renderer

        // 5.Mesh
        // particle parameters
        const rows = 50;
        const cols = 50;
        const particleCount = rows * cols;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const spacingX = 6 / (cols - 1);
        const spacingY = 3 / (rows - 1);

        // initialize vertex positions and colors
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = (j * spacingX) - 3;
                const y = (i * spacingY) - 1.5;
                const z = 0;

                positions[(i * cols + j) * 3] = x;
                positions[(i * cols + j) * 3 + 1] = y;
                positions[(i * cols + j) * 3 + 2] = z;

                // initialize color
                colors[(i * cols + j) * 3] = (Math.random() * 0.5) + 0.5; // R
                colors[(i * cols + j) * 3 + 1] = (Math.random() * 0.5) + 0.5; // G
                colors[(i * cols + j) * 3 + 2] = (Math.random() * 0.5) + 0.5; // B
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.18,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });

        const particles = new THREE.Points(geometry, material);
        this.mainMesh = particles;

        particles.rotation.x = -0.6;

        // 5.Mesh Two
        const inputField = document.createElement('input');
        inputField.value = 'Type here ...';
        inputField.type = 'text';
        inputField.style.width = '360px';
        inputField.style.height = '50px';
        inputField.style.backgroundColor = colorList[chooseColor][0];
        inputField.style.borderRadius = '25px';
        inputField.style.boxShadow = 'none';
        inputField.style.border = '3px solid';
        inputField.style.borderColor = colorList[chooseColor][1];
        inputField.style.outline = 'none';
        inputField.style.background = 'none';
        inputField.style.paddingLeft = '20px';
        inputField.style.paddingRight = '20px';
        inputField.style.fontSize = '18px';
        inputField.style.color = colorList[chooseColor][2];
        inputField.style.transition = '0.3s';

        const cssObject = new CSS3DObject(inputField);
        cssObject.scale.set(0.01, 0.01, 0.01);
        this.cssObject = cssObject;

        // 6.Event Listener
        inputField.addEventListener('mouseout', () => {
            if (!isFocused) {
                inputField.style.backgroundColor = colorList[chooseColor][0];
                inputField.style.boxShadow = 'none';
            }
        });

        inputField.addEventListener('focus', () => {
            isFocused = true;

            if (inputField.value == "Type here ...") inputField.value = "";

            inputField.style.color = colorList[chooseColor][3];
            inputField.style.border = 'none';
            inputField.style.backgroundColor = colorList[chooseColor][4];
            inputField.style.boxShadow = colorList[chooseColor][5];

            cssObject.position.z += 2 * scaleNum;
        });

        inputField.addEventListener('blur', () => {
            isFocused = false;

            if (inputField.value == "") inputField.value = "Type here ...";

            inputField.style.color = colorList[chooseColor][2];
            inputField.style.border = '3px solid';
            inputField.style.borderColor = colorList[chooseColor][1];
            inputField.style.backgroundColor = colorList[chooseColor][0];
            inputField.style.boxShadow = 'none';

            cssObject.position.z -= 2 * scaleNum;
        });

        function whenHover() {}
        this.whenHover = whenHover;

        function notHover() {}
        this.notHover = notHover;

        function whenClick() {}
        this.whenClick = whenClick;

        // 7.Lights

        // 8.Orbit Controls

        // 9.Animate
        function animateFunc() {
            if (isFocused == false) {
                if (viewOffset == 'fix') {
                    if (cssObject.rotation.z >= 0.05 - 0.004 * positionNum[0]) turnSideFlag = -1;
                    if (cssObject.rotation.z <= -0.05 - 0.004 * positionNum[0]) turnSideFlag = 1;
                }
                if (viewOffset == 'none') {
                    if (cssObject.rotation.z >= 0.05 - 0.004 * positionNum[0]) turnSideFlag = -1;
                    if (cssObject.rotation.z <= -0.05 - 0.004 * positionNum[0]) turnSideFlag = 1;
                }

                cssObject.rotation.z += 0.0007 * turnSideFlag;
                cssObject.rotation.y += 0.0015 * turnSideFlag;

                if (viewOffset == 'fix') {
                    cssObject.position.x = positionNum[0];
                    cssObject.position.y = positionNum[1];
                }
            }
            if (isFocused) {
                cssObject.rotation.z = 0;
                cssObject.rotation.y = 0;

                if (viewOffset == 'fix') {
                    cssObject.position.x = positionNum[0] - positionNum[0] * 0.065;
                    cssObject.position.y = positionNum[1] - positionNum[1] * 0.05;
                    cssObject.rotation.z -= 0.005 / 3 * positionNum[0];
                    cssObject.rotation.y -= 0.005 / 3 * positionNum[0];
                }
            }

            updateWaveGeometry(geometry);
        }
        this.animateFunc = animateFunc;

        // 10.Function
        function fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }

        function lerp(a, b, t) {
            return a + t * (b - a);
        }

        function grad(hash, x, y) {
            const h = hash & 3;
            let u = h < 2 ? x : y;
            let v = h < 2 ? y : x;
            return (h & 1 ? -u : u) + (h & 2 ? -v : v);
        }

        // generate a simple random hash table
        const p = [];
        for (let i = 0; i < 2500; i++) {
            p[i] = Math.floor(Math.random() * 2500);
        }

        function perlin(x, y) {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;

            x -= Math.floor(x);
            y -= Math.floor(y);

            const u = fade(x);
            const v = fade(y);

            const aa = p[X] + Y;
            const ab = p[X + 1] + Y;
            const ba = p[X] + Y + 1;
            const bb = p[X + 1] + Y + 1;

            return lerp(
                lerp(grad(p[aa], x, y), grad(p[ba], x, y - 1), v),
                lerp(grad(p[ab], x - 1, y), grad(p[bb], x - 1, y - 1), v),
                u
            );
        }

        // generate smoother fluctuations
        function smoothWave(x, y, time) {
            let amplitude = 0.6; // initial amplitude
            let frequency = 1;   // initial frequency
            let z = 0;

            for (let i = 0; i < 4; i++) {
                z += perlin(x * frequency, y * frequency + time) * amplitude;
                amplitude *= 0.5; // the amplitude is reduced layer by layer
                frequency *= 1.8;   // frequency increases layer by layer
            }

            return z;
        }

        function updateWaveGeometry(geometry) {
            const positions = geometry.attributes.position.array;
            const colors = geometry.attributes.color.array;
            const time = Date.now() * 0.001;

            let minZ = Infinity;
            let maxZ = -Infinity;

            // first, calculate Z values ​​to get minimum and maximum values
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];

                const z = smoothWave(x, y, time) * 2;
                positions[i + 2] = z;

                minZ = Math.min(minZ, z);
                maxZ = Math.max(maxZ, z);
            }

            // second, update color based on Z value
            for (let i = 0; i < positions.length; i += 3) {
                const z = positions[i + 2];
                const color = getColorFromZ(z, minZ, maxZ);
                colors[i] = color[0] / 255; // R
                colors[i + 1] = color[1] / 255; // G
                colors[i + 2] = color[2] / 255; // B
            }

            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.color.needsUpdate = true;
        }

        function getColorFromZ(z, minZ, maxZ) {
            const normalizedZ = (z - minZ) / (maxZ - minZ);
            const clampedZ = Math.min(Math.max(normalizedZ, 0), 1);

            // use HSL to generate colors
            let h = 0;
            let s = 0;
            let l = 0;
            if (chooseColor == 0) {
                h = 210 + (clampedZ * 150); // hue from 210 (blue) to 360 (red)
                s = 100; // saturation
                l = 50 + (clampedZ * 30); // brightness from 50% to 80%
            }
            else {
                h = 20 + (clampedZ * 55); // hue from 20 to 75
                s = 100;
                l = 40 + (clampedZ * 20); // brightness from 40% to 60%
            }

            return hslToRgb(h, s, l);
        }

        function hslToRgb(h, s, l) {
            let r, g, b;

            const C = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
            const X = C * (1 - Math.abs((h / 60) % 2 - 1));
            const m = l / 100 - C / 2;

            if (0 <= h && h < 60) {
                r = C; g = X; b = 0;
            } else if (60 <= h && h < 120) {
                r = X; g = C; b = 0;
            } else if (120 <= h && h < 180) {
                r = 0; g = C; b = X;
            } else if (180 <= h && h < 240) {
                r = 0; g = X; b = C;
            } else if (240 <= h && h < 300) {
                r = X; g = 0; b = C;
            } else {
                r = C; g = 0; b = X;
            }

            return [r + m, g + m, b + m].map(x => Math.floor(x * 255));
        }

        // function for position
        function changePosition(x, y, z) {
            positionNum = [x, y, z];

            this.mainMesh.position.set(x, y, z);
            if (viewOffset == 'fix') {
                this.mainMesh.rotation.y -= 0.04 * x;
                this.mainMesh.rotation.z -= 0.03 * x;
            }

            this.cssObject.position.set(x, y, z);
        }
        this.changePosition = changePosition;

        // function for scale
        function changeScale(scale) {
            scaleNum = scale;
            this.mainMesh.scale.set(scale, scale, scale);
            this.cssObject.scale.set(scale * 0.01, scale * 0.01, scale * 0.01);

            this.mainMesh.material.size = 0.18 * scale;
        }
        this.changeScale = changeScale;

        // function for getValue
        function getValue() {
            return inputField.value;
        }
        this.getValue = getValue;
    }

    // 11.Export
    //tools
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            cssObject: this.cssObject,
        };
    }

    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}