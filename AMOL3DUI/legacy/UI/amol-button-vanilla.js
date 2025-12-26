import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolButtonVanilla {
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

        // 2.Scene
        
        // 3.Camera
        
        // 4.Renderer
        
        // 5.Mesh
        const arrowGeometry = new THREE.CylinderGeometry(0, 0.5, 1, 6, 1);
        const arrowMaterial = new THREE.MeshPhongMaterial({ color: colorList[chooseColor][0] });
        let arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.arrow = arrow;
        
        // 5.Mesh Two
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshMatcapMaterial({ color: colorList[chooseColor][1], visible: false });
        const sphere = new THREE.Mesh(geometry, material);
        this.mainMesh = sphere;
        
        // 5.Mesh Three
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
        this.particleSystem = particleSystem;
        
        // record initial position before dispersion
        for (let i = 0; i < particleCount; i++) {
            initialPositions.push({
                x: particles[i * 3],
                y: particles[i * 3 + 1],
                z: particles[i * 3 + 2]
            });
        }
        
        // 6.Event Listener
        function whenHover() {
            arrow.material.color.setHex( colorList[chooseColor][3] );
        }
        this.whenHover = whenHover;
        
        function notHover() {
            arrow.material.color.setHex( colorList[chooseColor][0] );
        }
        this.notHover = notHover;
        
        function whenClick() {
            clickDetect = true;
            elapsedTime = 0;
        }
        this.whenClick = whenClick;
        
        // 7.Lights
        
        // 8.Orbit Controls
        
        // 9.Animate
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
        function noise(x, y, z) {
            const p = new Array(512);
            const permutation = [151, 160, 137, 91, 90, 15,
                                131, 13, 201, 95, 96, 53, 194, 233, 7,
                                225, 140, 36, 103, 30, 69, 142, 8, 99, 37,
                                240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
                                75, 0, 26, 197, 62, 94, 252, 219, 203, 117,
                                35, 11, 32, 57, 177, 33, 88, 237, 149, 56,
                                87, 174, 20, 125, 136, 171, 168, 68, 175, 74,
                                165, 71, 134, 139, 48, 27, 166, 77, 146, 158,
                                231, 83, 111, 229, 122, 60, 211, 133, 230, 220,
                                105, 92, 41, 55, 46, 245, 40, 244, 102, 143,
                                54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76,
                                132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
                                116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
                                3, 64, 52, 217, 226, 250, 124, 123, 5, 202,
                                38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
                                59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
                                223, 183, 170, 213, 119, 248, 152, 2, 44, 154,
                                163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
                                129, 22, 39, 253, 19, 98, 108, 110, 79, 113,
                                224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
                                251, 34, 242, 193, 238, 210, 144, 12, 191, 179,
                                162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
                                49, 192, 214, 31, 181, 199, 106, 157, 184, 84,
                                204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
                                138, 236, 205, 93, 222, 114, 67, 29, 24, 72,
                                243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
            for (let i = 0; i < 256 ; i++) {
                p[256 + i] = p[i] = permutation[i];
            }
        
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            const Z = Math.floor(z) & 255;
        
            x -= Math.floor(x);
            y -= Math.floor(y);
            z -= Math.floor(z);
        
            const u = fade(x);
            const v = fade(y);
            const w = fade(z);
        
            const A = p[X] + Y;
            const AA = p[A] + Z;
            const AB = p[A + 1] + Z;
            const B = p[X + 1] + Y;
            const BA = p[B] + Z;
            const BB = p[B + 1] + Z;
        
            return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)), lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))), lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)), lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))));
        }
        
        function negativeNoise(x, y, z) {
            const p = new Array(512);
            const permutation = [151, 160, 137, 91, 90, 15,
                                131, 13, 201, 95, 96, 53, 194, 233, 7,
                                225, 140, 36, 103, 30, 69, 142, 8, 99, 37,
                                240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
                                75, 0, 26, 197, 62, 94, 252, 219, 203, 117,
                                35, 11, 32, 57, 177, 33, 88, 237, 149, 56,
                                87, 174, 20, 125, 136, 171, 168, 68, 175, 74,
                                165, 71, 134, 139, 48, 27, 166, 77, 146, 158,
                                231, 83, 111, 229, 122, 60, 211, 133, 230, 220,
                                105, 92, 41, 55, 46, 245, 40, 244, 102, 143,
                                54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76,
                                132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
                                116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
                                3, 64, 52, 217, 226, 250, 124, 123, 5, 202,
                                38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
                                59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
                                223, 183, 170, 213, 119, 248, 152, 2, 44, 154,
                                163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
                                129, 22, 39, 253, 19, 98, 108, 110, 79, 113,
                                224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
                                251, 34, 242, 193, 238, 210, 144, 12, 191, 179,
                                162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
                                49, 192, 214, 31, 181, 199, 106, 157, 184, 84,
                                204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
                                138, 236, 205, 93, 222, 114, 67, 29, 24, 72,
                                243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
            for (let i = 0; i < 256 ; i++) {
                p[256 + i] = p[i] = permutation[i];
            }
        
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            const Z = Math.floor(z) & 255;
        
            x -= Math.floor(x);
            y -= Math.floor(y);
            z -= Math.floor(z);
        
            // take negative u, v, and w values
            const u = 1 - fade(x);
            const v = 1 - fade(y);
            const w = 1 - fade(z);
        
            const A = p[X] + Y;
            const AA = p[A] + Z;
            const AB = p[A + 1] + Z;
            const B = p[X + 1] + Y;
            const BA = p[B] + Z;
            const BB = p[B + 1] + Z;
        
            return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)), lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))), lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)), lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))));
        }
        
        function fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }
        
        function lerp(t, a, b) {
            return a + t * (b - a);
        }
        
        function grad(hash, x, y, z) {
            const h = hash & 15;
            const u = h < 8 ? x : y;
            const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
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
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            arrow: this.arrow,
            particleSystem: this.particleSystem,
        };
    }
    
    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}