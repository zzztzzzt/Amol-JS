import * as THREE from 'three';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class CursorTrailStellar {
    constructor(color = 0) {
        // 1. Variables
        this.objectType = 'cursor-trail';
        this.color = color;
        const colorTypeOne = {
            "cube-color": ["#38b6ff", "#a259ff", "#ffa3fd"],
            "points-color": [0xf599ff, 0x0ab7ff],
        };
        const colorTypeTwo = {
            "cube-color": ["#ffc72b", "#ffb778", "#ffac38"],
            "points-color": [0xff4d4f, 0xffd942],
        };
        let colorCustom = {};
        const colorTypeList = [colorTypeOne, colorTypeTwo, colorCustom];
        this.colorTypeList = colorTypeList;
        let mainMeshX;
        let mainMeshY;
        let ballGroup = new THREE.Group();
        this.ballGroup = ballGroup;
        let balls = [];
        this.balls = balls;
        let rotationAngle = 0;
        this.targetBallGroupPos = new THREE.Vector3();
        this.targetCubePos = new THREE.Vector3();
        this.elapsedTime = 0;
        let opacityDir = 1;

        // 2. Mesh
        const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const material = new THREE.MeshMatcapMaterial({ color: 0x38b6ff, transparent: true, opacity: 0.25 });
        const cube = new THREE.Mesh(geometry, material);
        this.cube = cube;
        // override the raycast method to prevent Raycaster from detecting the Mesh
        cube.raycast = function (raycaster, intersects) {
            // return directly without doing any operation, preventing Raycaster from detecting
        };
        const cubeColors = [
            new THREE.Color(colorTypeList[color]["cube-color"][0]),
            new THREE.Color(colorTypeList[color]["cube-color"][1]),
            new THREE.Color(colorTypeList[color]["cube-color"][2])
        ];
        this.cubeColors = cubeColors;
        let currentColorIndex = 0;
        let nextColorIndex = 1;
        let colorLerpT = 0;

        this.generateBall(colorTypeList[color]);
        this.ballGroup = ballGroup;

        // 3. Light

        // 4. Event Listener
        function whenMouseOver() {}
        this.whenMouseOver = whenMouseOver;

        function notMouseOver() {}
        this.notMouseOver = notMouseOver;

        this.whenClick = () => {

        };

        this.whenMouseMove = (x, y) => {
            mainMeshX = x * 5;
            mainMeshY = y * 5;

            this.targetCubePos.set(mainMeshX, mainMeshY, 0);
            this.targetBallGroupPos.set(mainMeshX, mainMeshY, 0);
        };

        let customizeWhenMouseOver = () => {};
        this.customizeWhenMouseOver = customizeWhenMouseOver;

        let customizeNotMouseOver = () => {};
        this.customizeNotMouseOver = customizeNotMouseOver;

        let customizeWhenClick = () => {};
        this.customizeWhenClick = customizeWhenClick;

        // 5. Animate
        this.animateFunc = () => {
            if (cube.material.opacity <= 0.15) {
                opacityDir = -1;
            }
            if (cube.material.opacity >= 0.3) {
                opacityDir = 1;
            }
            cube.material.opacity -= 0.001 * opacityDir;
            colorLerpT += 0.005;
            if (colorLerpT > 1) {
                colorLerpT = 0;
                currentColorIndex = nextColorIndex;
                nextColorIndex = (nextColorIndex + 1) % cubeColors.length;
            }

            const currentColor = this.cubeColors[currentColorIndex];
            const targetColor = this.cubeColors[nextColorIndex];
            cube.material.color.lerpColors(currentColor, targetColor, colorLerpT);

            this.elapsedTime += 0.019;

            const zOscillation = (Math.sin(this.elapsedTime) + 1) / 2 * 3;

            cube.position.z = zOscillation;
            ballGroup.position.z = zOscillation;

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            ballGroup.rotation.x -= 0.01;
            ballGroup.rotation.y -= 0.01;

            balls.forEach(ballData => {
                const { pivot, axis, speed, mesh, targetColor, currentColor } = ballData;

                if (axis === 'x') {
                    pivot.rotation.x += speed;
                } else if (axis === 'y') {
                    pivot.rotation.y += speed;
                } else {
                    pivot.rotation.z += speed;
                }

                mesh.rotation.y += 0.02;

                currentColor.lerp(targetColor, 0.02);
                mesh.material.color.copy(currentColor);
            });

            cube.position.lerp(this.targetCubePos, 0.15);
            ballGroup.position.lerp(this.targetBallGroupPos, 0.075);
        };

        // 6. Function
    }

    generateBall = (colorType) => {
        const ballCount = 50;
        const minRadius = 1.5;
        const maxRadius = 1.75;
        const startColor = new THREE.Color(colorType["points-color"][0]);
        const targetColor = new THREE.Color(colorType["points-color"][1]);

        for (let i = 0; i < ballCount; i++) {
            const radius = minRadius + Math.random() * (maxRadius - minRadius);
            const orbitSpeed = 0.01 + Math.random() * 0.02;
            const ballSize = Math.round(0.09 * Math.random() * 10000) / 10000;

            const geometry = new THREE.SphereGeometry(ballSize, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: 0x0ab7ff });
            const ball = new THREE.Mesh(geometry, material);
            // override the raycast method to prevent Raycaster from detecting the Mesh
            ball.raycast = function (raycaster, intersects) {
                // return directly without doing any operation, preventing Raycaster from detecting
            };

            const axisOptions = ['x', 'y', 'z'];
            const axis = axisOptions[Math.floor(Math.random() * axisOptions.length)];

            const pivot = new THREE.Group();

            const angle = Math.random() * Math.PI * 2;
            let x = 0, y = 0, z = 0;

            if (axis === 'x') {
                y = Math.cos(angle) * radius;
                z = Math.sin(angle) * radius;
            } else if (axis === 'y') {
                x = Math.cos(angle) * radius;
                z = Math.sin(angle) * radius;
            } else {
                x = Math.cos(angle) * radius;
                y = Math.sin(angle) * radius;
            }

            ball.position.set(x, y, z);
            pivot.add(ball);
            this.ballGroup.add(pivot);

            this.balls.push({
                mesh: ball,
                pivot: pivot,
                axis: axis,
                speed: orbitSpeed,
                currentColor: startColor.clone(),
                targetColor: targetColor.clone()
            });
        }

        let index = 0;
        let direction = 'toDirOne';
        const newColors = colorType["points-color"];

        this.ballColorInterval = setInterval(() => {
          if (index < this.balls.length) {
            const ballData = this.balls[index];
            ballData.targetColor.set(direction === 'toDirOne' ? newColors[0] : newColors[1]);
            index++;
          } else {
            index = 0;
            direction = direction === 'toDirOne' ? 'toDirTwo' : 'toDirOne';
          }
        }, 30);
    };

    async getMeshes() {
        //await this.loadModelAsync();
        return {
            mainMesh: this.cube,
            ballGroup: this.ballGroup,
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

        const cubeColors = [
            new THREE.Color(this.colorTypeList[color]["cube-color"][0]),
            new THREE.Color(this.colorTypeList[color]["cube-color"][1]),
            new THREE.Color(this.colorTypeList[color]["cube-color"][2])
        ];
        this.cubeColors = cubeColors;

        const newStartColor = new THREE.Color(this.colorTypeList[color]["points-color"][0]);
        const newTargetColor = new THREE.Color(this.colorTypeList[color]["points-color"][1]);

        this.balls.forEach(ballData => {
            ballData.currentColor = newStartColor.clone();
            ballData.targetColor = newTargetColor.clone();
            ballData.mesh.material.color.set(newStartColor);
        });

        if (this.ballColorInterval) {
            clearInterval(this.ballColorInterval);
        }

        let index = 0;
        let direction = 'toDirOne';
        const newColors = this.colorTypeList[this.color]["points-color"];

        this.ballColorInterval = setInterval(() => {
            if (index < this.balls.length) {
                const ballData = this.balls[index];
                ballData.targetColor.set(direction === 'toDirOne' ? newColors[0] : newColors[1]);
                index++;
            } else {
                index = 0;
                direction = direction === 'toDirOne' ? 'toDirTwo' : 'toDirOne';
            }
        }, 30);
    }

    status() {
        console.group("STATUS : altair-cursor-trail-stellar.js");

        console.log("objectType:", this.objectType);
        console.log("color:", this.color);
        console.log("colorTypeList:", this.colorTypeList);
        console.log("ballGroup:", this.ballGroup);
        console.log("balls:", this.balls);
        console.log("targetBallGroupPos:", this.targetBallGroupPos);
        console.log("targetCubePos:", this.targetCubePos);
        console.log("elapsedTime:", this.elapsedTime);
        console.log("cube:", this.cube);
        console.log("cubeColors:", this.cubeColors);
        console.log("generateBall:", this.generateBall);
        console.log("ballGroup:", this.ballGroup);
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

        console.groupEnd();
    }
}