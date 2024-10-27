import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolInputVanilla {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'input';
        this.viewOffset = viewOffset;
        const offsetNum = 0.95;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0xfba6ff, '#f8d4fa', 'rgba(220, 172, 232, 0.6)', '#fff', '#cccccc', 'rgba(230, 200, 230, 0.9)'];
        const colorTypeTwo = [0xec7878, '#eeb1ab', 'rgba(220, 172, 232, 0.6)', '#fff', '#cccccc', 'rgba(230, 200, 230, 0.9)'];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let changeState = "notInput";

        // 2.Scene
        
        // 3.Camera
        
        // 4.Renderer
        
        // 5.Mesh
        const geometry = new THREE.BufferGeometry();

        const gridSize = 15;
        const halfSize = (gridSize - 1) / 2; // center aligned
        
        const positions = [];
        const indices = [];
        
        // front face
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                let xPos = x - halfSize;
                let yPos = y - halfSize;
                positions.push(xPos, yPos, halfSize);
            }
        }
        // back face
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                let xPos = x - halfSize;
                let yPos = y - halfSize;
                positions.push(xPos, yPos, -halfSize);
            }
        }
        // bottom face
        for (let z = 0; z < gridSize; z++) {
            for (let x = 0; x < gridSize; x++) {
                let xPos = x - halfSize;
                let zPos = z - halfSize;
                positions.push(xPos, -halfSize, zPos);
            }
        }
        // top face
        for (let z = 0; z < gridSize; z++) {
            for (let x = 0; x < gridSize; x++) {
                let xPos = x - halfSize;
                let zPos = z - halfSize;
                positions.push(xPos, halfSize, zPos);
            }
        }
        // right face
        for (let z = 0; z < gridSize; z++) {
            for (let y = 0; y < gridSize; y++) {
                let yPos = y - halfSize;
                let zPos = z - halfSize;
                positions.push(halfSize, -yPos, zPos);
            }
        }
        // left face
        for (let z = 0; z < gridSize; z++) {
            for (let y = 0; y < gridSize; y++) {
                let yPos = y - halfSize;
                let zPos = z - halfSize;
                positions.push(-halfSize, -yPos, zPos);
            }
        }
        
        // define indices for all faces
        const totalVerticesPerFace = gridSize * gridSize;
        
        // indice front face
        for (let y = 0; y < gridSize - 1; y++) {
            for (let x = 0; x < gridSize - 1; x++) {
                let start = y * gridSize + x;
                indices.push(
                    start, start + 1, start + gridSize,
                    start + 1, start + gridSize + 1, start + gridSize
                );
            }
        }
        // indice back face
        const offsetBack = totalVerticesPerFace;
        for (let y = 0; y < gridSize - 1; y++) {
            for (let x = 0; x < gridSize - 1; x++) {
                let start = offsetBack + y * gridSize + x;
                indices.push(
                    start, start + gridSize, start + 1,
                    start + 1, start + gridSize, start + gridSize + 1
                );
            }
        }
        // indice top face
        const offsetTop = 2 * totalVerticesPerFace;
        for (let z = 0; z < gridSize - 1; z++) {
            for (let x = 0; x < gridSize - 1; x++) {
                let start = offsetTop + z * gridSize + x;
                indices.push(
                    start, start + 1, start + gridSize,
                    start + 1, start + gridSize + 1, start + gridSize
                );
            }
        }
        // indice bottom face
        const offsetBottom = 3 * totalVerticesPerFace;
        for (let z = 0; z < gridSize - 1; z++) {
            for (let x = 0; x < gridSize - 1; x++) {
                let start = offsetBottom + z * gridSize + x;
                indices.push(
                    start, start + gridSize, start + 1,
                    start + 1, start + gridSize, start + gridSize + 1
                );
            }
        }
        // indice right face
        const offsetRight = 4 * totalVerticesPerFace;
        for (let z = 0; z < gridSize - 1; z++) {
            for (let y = 0; y < gridSize - 1; y++) {
                let start = offsetRight + z * gridSize + y;
                indices.push(
                    start, start + gridSize, start + 1,
                    start + 1, start + gridSize, start + gridSize + 1
                );
            }
        }
        // indice left face
        const offsetLeft = 5 * totalVerticesPerFace;
        for (let z = 0; z < gridSize - 1; z++) {
            for (let y = 0; y < gridSize - 1; y++) {
                let start = offsetLeft + z * gridSize + y;
                indices.push(
                    start, start + 1, start + gridSize,
                    start + 1, start + gridSize + 1, start + gridSize
                );
            }
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.setIndex(indices);
        
        geometry.computeVertexNormals(); // calculate vertex normals for correct lighting and shading
        
        const material = new THREE.MeshPhongMaterial({ color: colorList[chooseColor][0], wireframe: true });
        const cube = new THREE.Mesh(geometry, material);
        cube.scale.set(0.08, 0.08, 0.08);
        cube.rotation.y = -Math.PI / 4;
        this.mainMesh = cube;
        
        // store initial vertex positions relative to cube center
        const initialPositions = [];
        let endPositions = [];
        let startPositions = [];
        
        const maxY = halfSize;
        
        geometry.attributes.position.array.forEach((value, index) => {
            initialPositions[index] = value;
        });
        
        // define angular speeds for each vertex based on y-coordinate
        const angularSpeeds = [];
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const y = initialPositions[i * 3 + 1]; // get y-coordinate of the vertex
        
            // calculate angular speed based on y-coordinate
            angularSpeeds[i] = (1.0 - y / maxY) * 0.1; // adjust the coefficient as needed
        }
        
        // define a variable to control animation speed
        let time = 0;
        // define a new array to store the rotation angles
        const rotationAngles = [];
        let startTime = Date.now(); // start time for the animation
        let animationPhase = 'distort'; // can be 'distort' or 'return'
        const phaseDuration = 3000; // duration for each phase in milliseconds
        
        // call initializeRotationAngles once
        initializeRotationAngles();
        
        let firstTimeLock = false;
        let storeValueLock = false;
        initialPositions.forEach((value, index) => {
            startPositions[index] = value;
        });
        
        // 5.Mesh Two
        let inputElement = document.createElement('input');
        inputElement.value = 'Type here ...';
        inputElement.style.position = 'relative';
        inputElement.style.padding = '10px';
        inputElement.style.width = '300px';
        inputElement.style.height = '25px';
        inputElement.style.border = '2px solid ' + colorList[chooseColor][1];
        inputElement.style.backgroundColor = colorList[chooseColor][2];
        inputElement.style.color = colorList[chooseColor][3];
        inputElement.style.fontSize = '18px';
        inputElement.style.fontFamily = 'Arial, sans-serif';
        inputElement.style.transition = 'border-color 0.3s ease, background-color 0.3s ease';
        inputElement.id = 'input';
        let cssObject = new CSS3DObject(inputElement);
        cssObject.scale.set(0.01, 0.01, 0.01);
        cssObject.rotation.z = Math.PI / 4 * 6;
        this.cssObject = cssObject;
        
        // 6.Event Listener
        inputElement.addEventListener('mouseover', function() {
            inputElement.style.borderColor = colorList[chooseColor][4];
            inputElement.style.backgroundColor = colorList[chooseColor][5];
        });
        
        inputElement.addEventListener('mouseout', function() {
            inputElement.style.borderColor = colorList[chooseColor][1];
            inputElement.style.backgroundColor = colorList[chooseColor][2];
        });
        
        inputElement.addEventListener('focus', function() {
            changeState = "input";
            
            if (inputElement.value == 'Type here ...') inputElement.value = '';
            inputElement.style.borderColor = colorList[chooseColor][4];
            inputElement.style.backgroundColor = colorList[chooseColor][5];
            inputElement.style.outline = 'none';
        });
        
        inputElement.addEventListener('blur', function() {
            changeState = "notInput";
            
            if (inputElement.value == '') inputElement.value = 'Type here ...';
            inputElement.style.borderColor = colorList[chooseColor][1];
            inputElement.style.backgroundColor = colorList[chooseColor][2];
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
            updateVertices();
    
            if (changeState == "notInput") {
                cube.rotation.y = -Math.PI / 4;
                cube.rotation.z = 0;
                cube.rotation.x = Math.sin(Date.now() * 0.0005) * 0.5;
                
                cssObject.rotation.z = Math.PI / 4 * 6;
                cssObject.rotation.x = Math.sin(Date.now() * 0.0005) * 0.5;
            }
            if (changeState == "input") {
                cube.rotation.x = 0;
                cube.rotation.y += 0.01;
                if (cube.rotation.y >= 0) cube.rotation.y = 0;
                cube.rotation.z -= 0.01;
                if (cube.rotation.z <= -Math.PI / 4 * 2) cube.rotation.z = -Math.PI / 4 * 2;
                
                cssObject.rotation.x = 0;
                cssObject.position.y = 0 + positionNum[1];
                cssObject.rotation.z += 0.01;
                if (cssObject.rotation.z >= Math.PI / 4 * 8) cssObject.rotation.z = Math.PI / 4 * 8;
            }
        }
        this.animateFunc = animateFunc;
        
        // 10.Function
        // initialize rotationAngles based on initial positions
        function initializeRotationAngles() {
            const positionArray = geometry.attributes.position.array;
            rotationAngles.length = positionArray.length / 3; // ensure the array has correct length
            for (let i = 0; i < rotationAngles.length; i++) {
                const index = i * 3;
                const x = initialPositions[index];
                const z = initialPositions[index + 2];
                // calculate the initial angle in the XZ plane
                const angle = Math.atan2(z, x);
                rotationAngles[i] = angle;
            }
        }
        
        function updateVertices() {
            const positionAttribute = geometry.attributes.position;
            const array = positionAttribute.array;
            const elapsedTime = Date.now() - startTime;
        
            if (animationPhase === 'distort') {
                // apply distortion animation
                for (let i = 0; i < positionAttribute.count; i++) {
                    const index = i * 3;
        
                    // get the initial position of the vertex
                    const x = startPositions[index];
                    const y = startPositions[index + 1];
                    const z = startPositions[index + 2];
        
                    const angularSpeed = angularSpeeds[i];
                    const angle = angularSpeed * time;
        
                    // update vertex position
                    array[index] = x * Math.cos(angle) - z * Math.sin(angle);
                    if (firstTimeLock == false) {
                        array[index + 1] = y;
                    }
                    else {
                        array[index + 1] = y - initialPositions[index + 1] * time / 20;
                    }
                    
                    array[index + 2] = x * Math.sin(angle) + z * Math.cos(angle);
                    
                }
        
                // check if 3 seconds have passed and switch to 'return' phase
                if (elapsedTime > phaseDuration) {
                    firstTimeLock = true;
                    time = 0;
                    if (storeValueLock == false) {
                        array.forEach((value, index) => {
                            endPositions[index] = value;
                        });
                    }
                    
                    startTime = Date.now(); // reset start time
                    animationPhase = 'return'; // switch to return phase
                }
            } else if (animationPhase === 'return') {
                // apply distortion animation
                for (let i = 0; i < positionAttribute.count; i++) {
                    const index = i * 3;
                    
                    // get the initial position of the vertex
                    const x = endPositions[index];
                    const y = endPositions[index + 1];
                    const z = endPositions[index + 2];
        
                    const angularSpeed = angularSpeeds[i];
                    const angle = -angularSpeed * time;
        
                    // update vertex position
                    array[index] = x * Math.cos(angle) - z * Math.sin(angle);
                    array[index + 1] = y + y * time / 20;
                    array[index + 2] = x * Math.sin(angle) + z * Math.cos(angle);
                }
        
                // check if the return phase is complete
                if (elapsedTime > phaseDuration) {
                    startTime = Date.now(); // reset start time
                    animationPhase = 'distort'; // switch back to distort phase
                    time = 0; // reset time for the next distortion phase
                    if (storeValueLock == false) {
                        array.forEach((value, index) => {
                            startPositions[index] = value;
                        });
                        
                        storeValueLock = true;
                    }
                }
            }
        
            // update time for next frame
            time += 0.1;
        
            // mark the attribute as needing update
            positionAttribute.needsUpdate = true;
            
            cube.geometry.computeVertexNormals();
        }
        
        // function for position
        function changePosition(x, y, z) {
            for (const key in positionNum) {
                if (key == 0) positionNum[key] = x;
                if (key == 1) positionNum[key] = y;
                if (key == 2) positionNum[key] = z;
            }
            this.mainMesh.position.set(x, y, z);
            if (viewOffset == 'none') this.cssObject.position.set(x, y, z + 1.2 * scaleNum);
            if (viewOffset == 'fix') this.cssObject.position.set(x, y, z);
        }
        this.changePosition = changePosition;
        
        // function for scale
        function changeScale(scale) {
            scaleNum = scale;
            this.mainMesh.scale.set(0.08 * scale, 0.08 * scale, 0.08 * scale);
            this.cssObject.scale.set(0.01 * scale, 0.01 * scale, 0.01 * scale);
            if (viewOffset == 'none') this.cssObject.position.z = this.cssObject.position.z - 1.2 + 1.2 * scaleNum;
        }
        this.changeScale = changeScale;
        
        // function for getValue
        function getValue() {
            return inputElement.value;
        }
        this.getValue = getValue;
    }
    
    // 11.Export
    // tools
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