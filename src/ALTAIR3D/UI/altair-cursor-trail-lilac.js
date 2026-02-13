import * as THREE from 'three';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class CursorTrailLilac {
    constructor(color = 0) {
        // 1. Variables
        this.objectType = 'cursor-trail';
        this.color = color;
        const colorTypeOne = {

        };
        const colorTypeTwo = {

        };
        let colorCustom = {};
        const colorTypeList = [colorTypeOne, colorTypeTwo, colorCustom];
        this.colorTypeList = colorTypeList;
        this.targetRingOnePos = new THREE.Vector3();
        this.targetRingTwoPos = new THREE.Vector3();
        this.targetRingThreePos = new THREE.Vector3();
        this.targetRingFourPos = new THREE.Vector3();
        this.targetRingFivePos = new THREE.Vector3();
        this.targetRingSixPos = new THREE.Vector3();
        let mainMeshX;
        let mainMeshY;

        // 2. Mesh
        const ringGroup = new THREE.Group();
        this.mainMesh = ringGroup;

        this.ringOne = createRing(1, 0.015, 0xd9b9fa, 0.3, 0.4);
        ringGroup.add(this.ringOne);

        this.ringTwo = createRing(1, 0.01, 0xd9b9fa, 0.4, 0.4);
        ringGroup.add(this.ringTwo);

        this.ringThree = createRing(1, 0.01, 0xd9b9fa, 0.4, 0.4);
        ringGroup.add(this.ringThree);

        this.ringFour = createRing(0.45, 0.005, 0xb2babf, 0.3, 0.4);
        ringGroup.add(this.ringFour);

        this.ringFive = createRing(0.35, 0.01, 0xb2babf, 0.3, 0.1);
        ringGroup.add(this.ringFive);

        this.ringSix = createRing(0.1, 0.005, 0xb2babf, 0.3, 0.4);
        ringGroup.add(this.ringSix);

        this.ringOne.rotation.x = Math.PI / 4;
        this.ringTwo.rotation.y = Math.PI / 6;
        this.ringThree.rotation.z = Math.PI / 8;

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

            this.targetRingOnePos.set(mainMeshX, mainMeshY, 0);
            this.targetRingTwoPos.set(mainMeshX, mainMeshY, 0);
            this.targetRingThreePos.set(mainMeshX, mainMeshY, 0);
            this.targetRingFourPos.set(mainMeshX, mainMeshY, 0);
            this.targetRingFivePos.set(mainMeshX, mainMeshY, 0);
            this.targetRingSixPos.set(mainMeshX, mainMeshY, 0);
        };

        let customizeWhenMouseOver = () => {};
        this.customizeWhenMouseOver = customizeWhenMouseOver;

        let customizeNotMouseOver = () => {};
        this.customizeNotMouseOver = customizeNotMouseOver;

        let customizeWhenClick = () => {};
        this.customizeWhenClick = customizeWhenClick;

        // 5. Animate
        let t = 0;
        this.animateFunc = () => {
            t += 0.02;

            this.ringOne.rotation.y += 0.01 + fakeNoise(t) * 0.01;
            this.ringTwo.rotation.x += 0.015 + Math.sin(t * 1.5) * 0.01;
            this.ringThree.rotation.z += 0.02 + fakeNoise(t * 1.3) * 0.015;
            this.ringFour.rotation.y += 0.005 + fakeNoise(t) * 0.01;
            this.ringFive.rotation.x += 0.01 + Math.sin(t * 1.5) * 0.01;
            this.ringSix.rotation.z += 0.01 + fakeNoise(t * 1.3) * 0.015;

            this.ringOne.position.lerp(this.targetRingOnePos, 0.06);
            this.ringTwo.position.lerp(this.targetRingTwoPos, 0.08);
            this.ringThree.position.lerp(this.targetRingThreePos, 0.10);
            this.ringFour.position.lerp(this.targetRingThreePos, 0.12);
            this.ringFive.position.lerp(this.targetRingFivePos, 0.14);
            this.ringSix.position.lerp(this.targetRingSixPos, 0.16);
        };

        // 6. Function
        function createRing(radius, tube, color, metalness, roughness) {
            const geometry = new THREE.TorusGeometry(radius, tube, 64, 128);
            const material = new THREE.MeshStandardMaterial({
                color,
                metalness,
                roughness,
            });
            const mesh = new THREE.Mesh(geometry, material);

            // override the raycast method to prevent Raycaster from detecting the Mesh
            mesh.raycast = function (raycaster, intersects) {
                // return directly without doing any operation, preventing Raycaster from detecting
            };

            return mesh;
        }

        function fakeNoise(t) {
            return Math.sin(t) * Math.cos(t * 1.7) * Math.sin(t * 0.47);
        }
    }

    async getMeshes() {
        //await this.loadModelAsync();
        return {
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

    colorSet(color) {

    }

    status() {
        console.group("STATUS : altair-cursor-trail-lilac.js");



        console.groupEnd();
    }
}