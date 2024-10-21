import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolButtonRipple {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'button';
        this.viewOffset = viewOffset;
        const offsetNum = 0.95;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0x0077ff, 0x83c8ee, 0x83c8ee, 0xe77e8f, 0xffb5a9, 0x83c8ee, 0xf5f5f5, 0x83c8ee, 0xffb5a9];
        const colorTypeTwo = [0x0077ff, 0x00629a, 0xff6664, 0xab0e91, 0x6ab4e0, 0x00629a, 0xf5f5f5, 0x58aadc, 0xf03331];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let moveControl = 1;
        let moveControlTwo = 1;
        let moveControlThree = 1;
        let moveControlFour = 1;
        let randomBoxs = [];
        let rotateYFlag = false;
        let clickLock = true;

        // 2.Scene

        // 3.Camera

        // 4.Renderer

        // 5.Mesh
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshBasicMaterial({ color: colorList[chooseColor][0], visible: false, transparent: true, opacity: 0.5});
        const box = new THREE.Mesh(geometry, material);
        this.mainMesh = box;

        // 5.Mesh Two
        const group = new THREE.Group();

        const coneGeometry = new THREE.ConeGeometry(0.6, 2, 3, 6);
        const coneMaterial = new THREE.MeshPhysicalMaterial({ color: colorList[chooseColor][1], roughness: 0.7, metalness: 0.3, wireframe: true });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.rotation.z = Math.PI;
        group.add(cone);

        const ringOneGeometry = new THREE.TorusGeometry( 1.2, 0.012, 16, 100 );
        const ringOneMaterial = new THREE.MeshPhysicalMaterial({ color: colorList[chooseColor][2], roughness: 0.7, metalness: 0.3 });
        const ringOne = new THREE.Mesh(ringOneGeometry, ringOneMaterial);
        ringOne.rotation.x = Math.PI / 2;
        // override raycast method
        ringOne.raycast = function () {
            // leave the function blank so raycaster cannot detect the mesh
        };
        group.add(ringOne);

        const ringTwoGeometry = new THREE.TorusGeometry( 1.5, 0.006, 16, 100 );
        const ringTwoMaterial = new THREE.MeshPhysicalMaterial({ color: colorList[chooseColor][3], roughness: 0.7, metalness: 0.3 });
        const ringTwo = new THREE.Mesh(ringTwoGeometry, ringTwoMaterial);
        ringTwo.rotation.x = Math.PI / 2;
        // override raycast method
        ringTwo.raycast = function () {
            // leave the function blank so raycaster cannot detect the mesh
        };
        group.add(ringTwo);

        const ringThreeGeometry = new THREE.TorusGeometry( 0.8, 0.012, 16, 100 );
        const ringThreeMaterial = new THREE.MeshPhysicalMaterial({ color: colorList[chooseColor][4], roughness: 0.7, metalness: 0.3 });
        const ringThree = new THREE.Mesh(ringThreeGeometry, ringThreeMaterial);
        ringThree.rotation.x = Math.PI / 2;
        // override raycast method
        ringThree.raycast = function () {
            // leave the function blank so raycaster cannot detect the mesh
        };
        group.add(ringThree);

        const ringFourGeometry = new THREE.TorusGeometry( 0.6, 0.006, 16, 100 );
        const ringFourMaterial = new THREE.MeshPhysicalMaterial({ color: colorList[chooseColor][5], roughness: 0.7, metalness: 0.3 });
        const ringFour = new THREE.Mesh(ringFourGeometry, ringFourMaterial);
        ringFour.rotation.x = Math.PI / 2;
        ringFour.position.y = -0.5;
        // override raycast method
        ringFour.raycast = function () {
            // leave the function blank so raycaster cannot detect the mesh
        };
        group.add(ringFour);

        this.group = group;
        group.rotation.x = Math.PI / 24;
        group.rotation.z = -Math.PI / 24;

        // 6.Event Listener
        function whenHover() {
            cone.material.color.set(colorList[chooseColor][6]);
        }
        this.whenHover = whenHover;

        function notHover() {
            cone.material.color.set(colorList[chooseColor][1]);
        }
        this.notHover = notHover;

        function whenClick() {
            if (randomBoxs.length < 30 && clickLock) {
                createRandomBoxsInSphere();
                clickLock = false;
                setTimeout(() => {
                    randomBoxs.forEach(box => {
                        group.remove(box);
                        box.geometry.dispose();
                        box.material.dispose();
                    });

                    randomBoxs = [];
                    rotateYFlag = false;
                }, 2000);

                setTimeout(() => {
                    group.rotation.y = 0;
                    clickLock = true;
                }, 4000);

                rotateYFlag = true;
            }
        }
        this.whenClick = whenClick;

        // 7.Lights

        // 8.Orbit Controls

        // 9.Animate
        function animateFunc() {
            cone.rotation.y += 0.01;

            ringOne.position.y += 0.003 * moveControl;
            if (ringOne.position.y >= 0.6) moveControl *= -1;
            if (ringOne.position.y <= -0.2) moveControl *= -1;

            ringTwo.position.y -= 0.002 * moveControlTwo;
            if (ringTwo.position.y >= 0.6) moveControlTwo *= -1;
            if (ringTwo.position.y <= -0.4) moveControlTwo *= -1;

            ringThree.position.y += 0.001 * moveControlThree;
            if (ringThree.position.y >= 0.2) moveControlThree *= -1;
            if (ringThree.position.y <= -0.1) moveControlThree *= -1;

            ringFour.position.y -= 0.001 * moveControlFour;
            if (ringFour.position.y >= -0.4) moveControlFour *= -1;
            if (ringFour.position.y <= -0.6) moveControlFour *= -1;

            if (randomBoxs.length > 0) {
                randomBoxs.forEach(box => {
                    box.position.y += box.userData.thisSpeed;
                    box.material.opacity -= 0.015;
                    box.scale.set(box.scale.x * 1.015, box.scale.y * 1.015, box.scale.z * 1.015);
                });
            }

            if (rotateYFlag) {
                group.rotation.y += 0.03;
            }
            else {
                if (group.rotation.y > 0) group.rotation.y -= 0.03;
            }
        }
        this.animateFunc = animateFunc;

        // 10.Function
        function createRandomBoxsInSphere(scene) {
            const numBoxs = 30;
            const radius = 1.3;

            // randomly generate cubes on the sphere
            for (let i = 0; i < numBoxs; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);

                const color = new THREE.Color().lerpColors(
                    new THREE.Color(colorList[chooseColor][7]),
                    new THREE.Color(colorList[chooseColor][8]),
                    i / (numBoxs - 1)
                );

                const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
                const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, wireframe: true });
                const box = new THREE.Mesh(geometry, material);
                box.userData.thisSpeed = Math.random() * (0.03 - 0.005) + 0.005; // 0.005 to 0.03

                box.position.set(x, y, z);

                group.add(box);
                randomBoxs.push(box);
            }
        }

        //function for position
        function changePosition(x, y, z) {
            this.mainMesh.position.set(x, y, z);
            this.group.position.set(x, y, z);
        }
        this.changePosition = changePosition;

        //function for scale
        function changeScale(scale) {
            this.mainMesh.scale.set(scale, scale, scale);
            this.group.scale.set(scale, scale, scale);
        }
        this.changeScale = changeScale;

        // function for getValue
        function getValue() {

        }
        this.getValue = getValue;
    }

    // 11.Export
    //tools
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            group: this.group,
        };
    }

    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}