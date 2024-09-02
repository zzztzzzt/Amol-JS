import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolInputGolden {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'input';
        this.viewOffset = viewOffset;
        const offsetNum = 0.95;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = ['./AMOL3DUI/UI/water-one.jpg', 'rgba(255, 200, 150, 0.3)'];
        const colorTypeTwo = ['./AMOL3DUI/UI/water-two.jpg', 'rgba(117, 245, 229, 0.25)'];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];

        // 2.Scene
        
        // 3.Camera
        
        // 4.Renderer
        
        // 5.Mesh
        // create sphere geometry using BufferGeometry
        const geometry = new THREE.BufferGeometry();
        
        const numSegments = 48;
        const positions = [];
        const indices = [];
        const radius = 1;
        
        for (let phiIndex = 0; phiIndex <= numSegments; phiIndex++) {
            const phi = phiIndex * Math.PI / numSegments;
            const y = radius * Math.cos(phi);
        
            for (let thetaIndex = 0; thetaIndex <= numSegments; thetaIndex++) {
                const theta = thetaIndex * 2 * Math.PI / numSegments;
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const z = radius * Math.sin(phi) * Math.sin(theta);
        
                positions.push(x, y, z);
            }
        }
        
        const numVertices = numSegments + 1;
        for (let phiIndex = 0; phiIndex < numSegments; phiIndex++) {
            for (let thetaIndex = 0; thetaIndex < numSegments; thetaIndex++) {
                const first = phiIndex * numVertices + thetaIndex;
                const second = first + numVertices;
        
                // push indices in clockwise order
                indices.push(first, first + 1, second);
                indices.push(second, first + 1, second + 1);
            }
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.setIndex(indices);
        
        geometry.computeVertexNormals(); // calculate vertex normals for correct lighting and shading
        
        // add UV coordinates
        const uvs = [];
        const uv = new THREE.Vector2();
        
        for (let i = 0; i <= numSegments; i++) {
            const phi = i / numSegments;
            for (let j = 0; j <= numSegments; j++) {
                const theta = j / numSegments;
                    
                uv.x = 1 - theta;
                uv.y = phi;
                
                uvs.push(uv.x, uv.y);
            }
        }
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        
        // load texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.flipY = false; // ensure texture is not flipped vertically
        const texture = textureLoader.load(colorList[chooseColor][0]);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.scale.set(0.9, 0.9, 0.9);
        this.mainMesh = sphere;
        
        // 5.Mesh Two
        // create input element
        const customInput = document.createElement('input');
        
        // set input style
        customInput.setAttribute('type', 'text');
        customInput.setAttribute('placeholder', 'Type here ...');
        customInput.style.fontFamily = 'Arial, sans-serif';
        customInput.style.fontSize = '15px';
        customInput.style.padding = '25px';
        customInput.style.border = '2.5px solid #ffffff';
        customInput.style.borderRadius = '10px';
        customInput.style.backgroundColor = colorList[chooseColor][1];
        customInput.style.color = '#6e6e6e';
        customInput.style.outline = 'none';
        customInput.style.width = '270px';
        
        // wrap input element into CSS3D object
        const inputObject = new CSS3DObject(customInput);
        inputObject.position.set(0, 0, 0);
        inputObject.scale.set(0.01, 0.01, 0.01);
        this.inputObject = inputObject;
        
        let checkFocus = false;
        customInput.addEventListener("focus", () => {
            checkFocus = true;
        });
        customInput.addEventListener("blur", () => {
            checkFocus = false;
            
            // reset value in animate function
            totalStep = 350;
            step = 0;
        });
        
        // 6.Event Listener
        function whenHover() {}
        this.whenHover = whenHover;
        
        function notHover() {}
        this.notHover = notHover;
        
        function whenClick() {}
        this.whenClick = whenClick;
        
        // 7.Lights
        
        // 8.Orbit Controls
        
        // 9.Animate
        let turnSideFlag = "left"; // control sphere rotation
        // these values is for input element
        let totalStep = 350;
        let step = 0;
        
        function animateFunc() {
            const positions = geometry.attributes.position.array;
            const time = Date.now() * 0.0001;
            const timeForWave = performance.now() * 0.001;
            const timeForInput = performance.now() * 0.0002;
            const radiusForInput = 1.5 * scaleNum;
            
            let index = 0; // index for position array count
            for (let phiIndex = 0; phiIndex <= numSegments; phiIndex++) {
                const phi = phiIndex * Math.PI / numSegments;
            
                for (let thetaIndex = 0; thetaIndex <= numSegments; thetaIndex++) {
                    const theta = thetaIndex * 2 * Math.PI / numSegments;
            
                    const x = radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.cos(phi);
                    const z = radius * Math.sin(phi) * Math.sin(theta);
            
                    // calculate noise offset based on vertex position
                    const noiseFactor = Date.now() * 0.0035; // adjust this value to control noise intensity
                    const noiseOffset = noise(x * 0.65 * noiseFactor, y * 0.65 * noiseFactor, z * 0.65 * noiseFactor);
            
                    // calculate y position with wave effect
                    let waveFrequency = 20.0; // adjust frequency of the wave effect
                    let waveSpeed = 2.0; // adjust speed of the wave effect
                    let waveAmplitude = 0.025; // adjust amplitude of the wave effect
            
                    let yWithWave = y + Math.sin(phi * waveFrequency + timeForWave * waveSpeed) * waveAmplitude;
            
                    // update vertex positions with noise and wave effect
                    positions[index++] = x + noiseOffset.x * 0.06;
                    positions[index++] = yWithWave + noiseOffset.y * 0.06;
                    positions[index++] = z + noiseOffset.z * 0.06;
                }
            }
            
            geometry.attributes.position.needsUpdate = true; // notify Three.js to update positions
            
            if (sphere.rotation.y < Math.PI * 2 / 4 * 2 && turnSideFlag == "left") {
                sphere.rotation.y += 0.003;
            }
            else {
                turnSideFlag = "right";
                sphere.rotation.y -= 0.003;
                
                if (sphere.rotation.y < 0) turnSideFlag = "left";
            }
            
            // this region for input element
            if (!checkFocus) {
                let x = radiusForInput * Math.cos(timeForInput * 2);
                let z = radiusForInput * Math.sin(timeForInput * 2 % Math.PI);
                
                inputObject.position.x = x + positionNum[0];
                inputObject.position.z = z + positionNum[2];
            
                // calculate rotation to face center
                let angleForInput = Math.atan2(-x, z);
                inputObject.rotation.y = -angleForInput;
            }
            else {
                if (viewOffset == 'none') {
                    inputObject.position.x = lerp(step / totalStep, inputObject.position.x, 0 + positionNum[0]);
                    inputObject.position.z = lerp(step / totalStep, inputObject.position.z, radiusForInput + positionNum[2]);
                    inputObject.rotation.y = lerp(step / totalStep, inputObject.rotation.y, 0);
                }
                if (viewOffset == 'fix') {
                    inputObject.position.x = lerp(step / totalStep, inputObject.position.x, 0 + positionNum[0] * offsetNum);
                    inputObject.position.z = lerp(step / totalStep, inputObject.position.z, radiusForInput + positionNum[2]);
                    inputObject.rotation.y = lerp(step / totalStep, inputObject.rotation.y, 0);
                }
                //console.log(radiusForInput);
                    
                step += 1;
            }
        }
        this.animateFunc = animateFunc;
        
        // 10.Function
        // noise Function
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
            
            return new THREE.Vector3(
                lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)), lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))), lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)), lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))))
            );
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
        
        // function for position
        function changePosition(x, y, z) {
            this.mainMesh.position.set(x, y, z);
            if (viewOffset == 'none') this.inputObject.position.set(x, y, z);
            if (viewOffset == 'fix') this.inputObject.position.set(x * offsetNum, y * offsetNum, z * offsetNum);
            for (const key in positionNum) {
                if (key == 0) positionNum[key] = x;
                if (key == 1) positionNum[key] = y;
                if (key == 2) positionNum[key] = z;
            }
        }
        this.changePosition = changePosition;
        
        // function for scale
        function changeScale(scale) {
            scaleNum = scale;
            this.mainMesh.scale.set(scale, scale, scale);
            this.inputObject.scale.set(scale * 0.01, scale * 0.01, scale * 0.01);
        }
        this.changeScale = changeScale;
        
        // function for getValue
        function getValue() {
            return customInput.value;
        }
        this.getValue = getValue;
    }
    
    // 11.Export
    // tools
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            inputObject: this.inputObject,
        };
    }
    
    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}