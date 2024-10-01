import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolButtonThunder {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'button';
        this.viewOffset = viewOffset;
        const offsetNum = 0.95;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0xffffff, 0xeccfff, 0xff69b4, 0xFFB6C1, 0xDDA0DD, 0xE6E6FA, 0xF5F5F5, 0xce72ed, 0xffffff, 0xffbafd, 0xaa42f5];
        const colorTypeTwo = [0xffffff, 0xffea00, 0xe6e6e6, 0xffe600, 0xffd500, 0xcccccc, 0xadadad, 0xffffff, 0xffec94, 0xfff8ab, 0xbfbfbf];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let hoverFlag = false;
        let resetFlag = false;
        let retuenSizeFinish = true;

        // 2.Scene

        // 3.Camera

        // 4.Renderer

        // 5.Mesh
        const mainGeometry = new THREE.SphereGeometry(1, 32, 32);
        const mainMaterial = new THREE.MeshMatcapMaterial({ color: colorList[chooseColor][0], visible: false });
        const sphere = new THREE.Mesh(mainGeometry, mainMaterial);
        sphere.position.z = 1.5;
        this.mainMesh = sphere;

        // 5.Mesh Two
        // set gradient color
        const colorStart = new THREE.Color(colorList[chooseColor][1]);
        const colorEnd = new THREE.Color(colorList[chooseColor][2]);

        const sphereGeometry = new THREE.SphereGeometry(0.06, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial();

        const group = new THREE.Group();
        const spheres = [];

        // randomly generate 20 spheres and set color and position
        for (let i = 0; i < 20; i++) {
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial.clone()); // use clone() to ensure each sphere has its own material

            sphere.position.set(
                Math.random() * 3 - 1.5, // x coordinate
                Math.random() * 3 - 1.5, // y coordinate
                Math.random() * 3 - 1.5  // z coordinate
            );

            // calculate color gradient
            const ratio = i / 19;
            const color = colorStart.clone().lerp(colorEnd, ratio);
            sphere.material.color.set(color);

            // set random speed
            sphere.userData = {
                velocity: new THREE.Vector3(
                    Math.random() * 0.02 - 0.01, // x speed
                    Math.random() * 0.02 - 0.01, // y speed
                    Math.random() * 0.02 - 0.01  // z speed
                )
            };

            // override the raycast method to prevent Raycaster from detecting the Mesh
            sphere.raycast = function (raycaster, intersects) {
                // return directly without doing any operation, preventing Raycaster from detecting
            };

            group.add(sphere);
            spheres.push(sphere);
        }
        this.group = group;

        // 5.Mesh Three
        const distanceThreshold = 1.5;

        function getRandomPinkPurpleColor() {
            const colors = [colorList[chooseColor][3], colorList[chooseColor][4], colorList[chooseColor][5], colorList[chooseColor][6]];
            const randomIndex = Math.floor(Math.random() * colors.length);
            return colors[randomIndex];
        }

        const linesGroup = new THREE.Group();

        // stores a reference to the connection object for subsequent updates
        let lineObjects = [];

        // track the number of connections to each node
        const connectionCount = {};

        // initialize the number of connections
        spheres.forEach((sphere, index) => {
            connectionCount[index] = 0;
        });

        function createLineBetweenSpheres(sphereA, indexA, sphereB, indexB) {
            const positionA = sphereA.position.clone();
            const positionB = sphereB.position.clone();
            const distance = positionA.distanceTo(positionB);

            // a connection is only created if the distance is less than the threshold and each node has less than three connections
            if (distance < distanceThreshold &&
                connectionCount[indexA] < 4 &&
                connectionCount[indexB] < 4) {

                const lineMaterial = new THREE.LineBasicMaterial({ color: getRandomPinkPurpleColor() });
                const geometry = new THREE.BufferGeometry().setFromPoints([positionA, positionB]);
                const line = new THREE.Line(geometry, lineMaterial);

                // store the sphere index for subsequent updates
                line.userData = { indexA: indexA, indexB: indexB };

                linesGroup.add(line);

                lineObjects.push(line);

                // update number of connections
                connectionCount[indexA]++;
                connectionCount[indexB]++;
            }
        }

        // traverse each pair of spheres and create a connection
        for (let i = 0; i < spheres.length; i++) {
            for (let j = i + 1; j < spheres.length; j++) {
                createLineBetweenSpheres(spheres[i], i, spheres[j], j);
            }
        }

        group.add(linesGroup);

        // set the connection to be updated every 2 seconds
        setInterval(updateLines, 500);

        // 5.Mesh Four
        const purpleGeometry = new THREE.IcosahedronGeometry(0.9, 2);
        const purpleMaterial = new THREE.MeshBasicMaterial({
            color: colorList[chooseColor][7],
            transparent: true,
            opacity: 0.3,
        });
        const purpleMesh = new THREE.Mesh(purpleGeometry, purpleMaterial);
        this.purpleMesh = purpleMesh;

        // 5.Mesh Five
        const edgesGeometry = new THREE.EdgesGeometry(purpleGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: colorList[chooseColor][8],
            linewidth: 2
        });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        this.edges = edges;

        // 5.Mesh Six
        const pinkGeometry = new THREE.IcosahedronGeometry(0.54, 2);
        const pinkMaterial = new THREE.MeshBasicMaterial({
            color: colorList[chooseColor][9],
            transparent: false,
            opacity: 0.3,
        });
        const pinkMesh = new THREE.Mesh(pinkGeometry, pinkMaterial);
        this.pinkMesh = pinkMesh;

        // 6.Event Listener
        function whenHover() {
            hoverFlag = true;
            pinkMesh.material.color.set(colorList[chooseColor][10]);
        }
        this.whenHover = whenHover;

        function notHover() {
            hoverFlag = false;
            pinkMesh.material.color.set(colorList[chooseColor][9]);
        }
        this.notHover = notHover;

        function whenClick() {
            if (retuenSizeFinish) {
                pinkMesh.scale.set(pinkMesh.scale.x * 0.6, pinkMesh.scale.y * 0.6, pinkMesh.scale.z * 0.6);
                sizeBack(pinkMesh);

                purpleMesh.scale.set(purpleMesh.scale.x * 1.2, purpleMesh.scale.y * 1.2, purpleMesh.scale.z * 1.2);
                sizeBack(purpleMesh);

                edges.scale.set(edges.scale.x * 1.2, edges.scale.y * 1.2, edges.scale.z * 1.2);
                sizeBack(edges);
            }
        }
        this.whenClick = whenClick;

        // 7.Lights

        // 8.Orbit Controls

        // 9.Animate
        function animateFunc() {
            pinkMesh.rotation.y += 0.003;
            if (hoverFlag == true) pinkMesh.rotation.y += 0.006;
            pinkMesh.rotation.x += 0.003;
            if (hoverFlag == true) pinkMesh.rotation.x += 0.006;

            purpleMesh.rotation.y += 0.003;
            if (hoverFlag == true) purpleMesh.rotation.y += 0.006;
            edges.rotation.y += 0.003;
            if (hoverFlag == true) edges.rotation.y += 0.006;
            purpleMesh.rotation.x += 0.003;
            if (hoverFlag == true) purpleMesh.rotation.x += 0.006;
            edges.rotation.x += 0.003;
            if (hoverFlag == true) edges.rotation.x += 0.006;

            // update sphere position
            spheres.forEach(sphere => {
                // use velocity from userData to update position
                sphere.position.add(sphere.userData.velocity);

                // collision bounds check
                if (sphere.position.x < -1.5 || sphere.position.x > 1.5) {
                    sphere.userData.velocity.x *= -1;
                }
                if (sphere.position.y < -1.5 || sphere.position.y > 1.5) {
                    sphere.userData.velocity.y *= -1;
                }
                if (sphere.position.z < -1.5 || sphere.position.z > 1.5) {
                    sphere.userData.velocity.z *= -1;
                }
            });

            // update the positions of the lines
            lineObjects.forEach(line => {
                const positions = line.geometry.attributes.position.array;
                const sphereA = spheres[line.userData.indexA];
                const sphereB = spheres[line.userData.indexB];

                if (sphereA && sphereB) {
                    positions[0] = sphereA.position.x;
                    positions[1] = sphereA.position.y;
                    positions[2] = sphereA.position.z;
                    positions[3] = sphereB.position.x;
                    positions[4] = sphereB.position.y;
                    positions[5] = sphereB.position.z;
                    line.geometry.attributes.position.needsUpdate = true;
                }
            });

            if (hoverFlag == true) group.rotation.y += 0.012;
            group.rotation.y += 0.012;
        }
        this.animateFunc = animateFunc;

        // 10.Function
        function updateLines() {
            // remove all old connections
            lineObjects.forEach(line => linesGroup.remove(line));
            lineObjects = [];

            // track the number of connections to each node
            const connectionCount = {};
            spheres.forEach((_, index) => {
                connectionCount[index] = 0;
            });

            // create a new connection based on the distance threshold
            for (let i = 0; i < spheres.length; i++) {
                for (let j = i + 1; j < spheres.length; j++) {
                    const positionA = spheres[i].position;
                    const positionB = spheres[j].position;
                    const distance = positionA.distanceTo(positionB);

                    // a connection is only created if the distance is less than the threshold and each node has less than three connections
                    if (distance < distanceThreshold &&
                        connectionCount[i] < 4 &&
                        connectionCount[j] < 4) {

                        const lineMaterial = new THREE.LineBasicMaterial({ color: getRandomPinkPurpleColor() });
                        const geometry = new THREE.BufferGeometry().setFromPoints([positionA.clone(), positionB.clone()]);
                        const line = new THREE.Line(geometry, lineMaterial);

                        // store the sphere index for subsequent updates
                        line.userData = { indexA: i, indexB: j };

                        linesGroup.add(line);

                        lineObjects.push(line);

                        // update number of connections
                        connectionCount[i]++;
                        connectionCount[j]++;
                    }
                }
            }
        }

        function sizeBack(mesh) {
            retuenSizeFinish = false;

            const targetScale = new THREE.Vector3(scaleNum, scaleNum, scaleNum);

            const startScale = mesh.scale.clone();

            const duration = 0.2;

            // update every 10 milliseconds
            const interval = 10;

            // calculate the delta for each update
            const totalSteps = Math.floor(duration * 1000 / interval);
            let currentStep = 0;

            const intervalId = setInterval(() => {
                currentStep++;
                // calculate progress (0 to 1)
                const progress = Math.min(currentStep / totalSteps, 1);

                // linear interpolation calculates new scaling values
                mesh.scale.lerpVectors(startScale, targetScale, progress);

                // if the animation is completed, clear the timer
                if (progress >= 1) {
                    clearInterval(intervalId);
                    retuenSizeFinish = true;
                }
            }, interval);
        }

        //function for position
        function changePosition(x, y, z) {
            if (this.viewOffset == 'fix') this.mainMesh.position.set(x * offsetNum, y * offsetNum, z + 1.5);
            else this.mainMesh.position.set(x, y, z + 1.5);
            this.group.position.set(x, y, z);
            this.purpleMesh.position.set(x, y, z);
            this.edges.position.set(x, y, z);
            this.pinkMesh.position.set(x, y, z);
        }
        this.changePosition = changePosition;

        //function for scale
        function changeScale(scale) {
            scaleNum = scale;
            this.mainMesh.scale.set(scale, scale, scale);
            this.group.scale.set(scale, scale, scale);
            this.purpleMesh.scale.set(scale, scale, scale);
            this.edges.scale.set(scale, scale, scale);
            this.pinkMesh.scale.set(scale, scale, scale);

            this.mainMesh.position.z = this.mainMesh.position.z - 1.5 + 1.5 * scaleNum;
        }
        this.changeScale = changeScale;

        // function for getValue
        function getValue() {
            return 'Warning : Try to get value on button - AmolButtonThunder';
        }
        this.getValue = getValue;
    }

    // 11.Export
    //tools
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            group: this.group,
            purpleMesh: this.purpleMesh,
            edges: this.edges,
            pinkMesh: this.pinkMesh,
        };
    }

    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}