import * as THREE from 'three';

export class ButtonGolden {
    constructor(color = 0) {
        // 1. Variables
        this.objectType = 'button';

        this.color = color;
        const colorTypeOne = [0xffffff, 0xffca33, 0xff9760, 0xc3c3c3, 0xf6e58d, 0xffdb5f];
        const colorTypeTwo = [0xffffff, 0x9bf1d9, 0x00905b, 0x8fcbc9, 0x1fa068, 0x5bc1a5];
        let colorCustom = {};
        this.colorTypeList = [colorTypeOne, colorTypeTwo, colorCustom];

        let scaleNum = 1.0;
        let cubeStatus = "origin";
        const rotationAxis = new THREE.Vector3(1, 1, 0).normalize();
        const quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, Math.PI / 180);

        // 2. Meshes
        const sphereGeometry = new THREE.SphereGeometry(1.6, 32, 32);
        const sphereMaterial = new THREE.MeshMatcapMaterial({ color: this.colorTypeList[color][0], visible: false });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.mainMesh = sphere;

        const geometry = new THREE.TorusGeometry(1.5, 0.015, 64, 100);
        const material = new THREE.MeshPhongMaterial({ color: this.colorTypeList[color][1] });
        const ring = new THREE.Mesh(geometry, material);
        this.ring = ring;

        const geometryTwo = new THREE.TorusGeometry(1.5, 0.005, 64, 100);
        const materialTwo = new THREE.MeshPhongMaterial({ color: this.colorTypeList[color][2] });
        const ringTwo = new THREE.Mesh(geometryTwo, materialTwo);
        ringTwo.rotation.y = Math.PI / 2;
        this.ringTwo = ringTwo;

        const geometryThree = new THREE.TorusGeometry(1.5, 0.0075, 64, 100);
        const materialThree = new THREE.MeshPhongMaterial({ color: this.colorTypeList[color][3] });
        const ringThree = new THREE.Mesh(geometryThree, materialThree);
        ringThree.rotation.x = Math.PI / 2;
        this.ringThree = ringThree;

        let cubeSize = 1.2;

        // generate particles
        let particleCount = 350;
        let particles = new THREE.Group();

        // define start color and end color
        let colorStart = new THREE.Color( this.colorTypeList[color][4] );
        let colorEnd = new THREE.Color( this.colorTypeList[color][5] );
        // color interpolation step size
        let colorStep = 1 / (particleCount / 10); // interpolate every 10 particles

        for (let i = 0; i < particleCount; i++) {
            // calculate the color that the current particle should use
            let color = new THREE.Color().lerpColors(colorStart, colorEnd, i * colorStep);

            let particleMaterial = new THREE.MeshBasicMaterial({ color: color });

            let particle = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 16), particleMaterial);
            // override the raycast method to prevent Raycaster from detecting the Mesh
            particle.raycast = function (raycaster, intersects) {
                // return directly without doing any operation, preventing Raycaster from detecting
            };

            // random position
            let posX = Math.random() * cubeSize - cubeSize / 2;
            let posY = Math.random() * cubeSize - cubeSize / 2;
            let posZ = Math.random() * cubeSize - cubeSize / 2;

            particle.position.set(posX, posY, posZ);

            // random speed
            particle.velocity = new THREE.Vector3(
                Math.random() * 0.02 - 0.01, // random X speed (-0.01 to 0.01)
                Math.random() * 0.02 - 0.01, // random Y speed (-0.01 to 0.01)
                Math.random() * 0.02 - 0.01  // random Z speed (-0.01 to 0.01)
            );

            particles.add(particle);
        }
        this.particles = particles;

        // 3. Lights

        // 4. Event Listeners
        this.whenMouseOver = () => {
            if (cubeStatus != "max" && cubeStatus != "smaller") cubeStatus = "bigger";
        };

        this.notMouseOver = () => {
            if (cubeStatus != "max" && cubeStatus != "smaller") {
                cubeSize = 1.2;
                cubeStatus = "origin";
            }
        };

        this.whenClick = () => {
            cubeSize = 0.6;
            startScaling();
        };

        this.whenMouseMove = (x, y) => {};

        this.customizeWhenMouseOver = () => {};

        this.customizeNotMouseOver = () => {};

        this.customizeWhenClick = () => {};

        // 5. Animation
        this.animateFunc = () => {
            ring.quaternion.multiplyQuaternions(quaternion, ring.quaternion);
            ringTwo.rotation.y += 0.01;
            ringThree.rotation.x -= 0.01;

            if (cubeStatus == "max") {
                cubeSize += 0.05;
                if (cubeSize >= 5) cubeSize = 5;
            }
            if (cubeStatus == "bigger") {
                cubeSize += 0.05;
                if (cubeSize >= 1.8) cubeSize = 1.8;
            }
            if (cubeStatus == "smaller") {
                cubeSize -= 0.025;
                if (cubeSize <= 1.2) {
                    cubeSize = 1.2;
                    cubeStatus = "origin";
                }
            }

            particles.children.forEach(function(particle) {
                // update particle position
                particle.position.add(particle.velocity);

                // boundary detection, if the particle exceeds the cube space, reset the position
                if (particle.position.x < -cubeSize / 2 || particle.position.x > cubeSize / 2 ||
                    particle.position.y < -cubeSize / 2 || particle.position.y > cubeSize / 2 ||
                    particle.position.z < -cubeSize / 2 || particle.position.z > cubeSize / 2) {

                    particle.position.set(
                        Math.random() * cubeSize - cubeSize / 2,
                        Math.random() * cubeSize - cubeSize / 2,
                        Math.random() * cubeSize - cubeSize / 2
                    );

                    // reset random speed
                    particle.velocity.set(
                        Math.random() * 0.02 - 0.01,
                        Math.random() * 0.02 - 0.01,
                        Math.random() * 0.02 - 0.01
                    );
                }
            });
        };

        // 6. Functions
        function startScaling() {
            setTimeout(() => {
                cubeStatus = "max";
            }, 480);
            scaleGeometry(new THREE.Vector3(0.5 * scaleNum, 0.5 * scaleNum, 0.5 * scaleNum), 75);
            setTimeout(() => {
                scaleGeometry(new THREE.Vector3(1 * scaleNum, 1 * scaleNum, 1 * scaleNum), 2000);
                setTimeout(() => {
                    cubeStatus = "smaller";
                }, 2500);
            }, 100);
        }

        function scaleGeometry(targetScale, speed) {
            let initialScale = ring.scale.clone(); // initial scale
            let initialScaleTwo = ringTwo.scale.clone();
            let initialScaleThree = ringThree.scale.clone();
            let duration = speed; // unit : ms

            let startTime = Date.now(); // record the start timing

            function update() {
                let now = Date.now(); // get the time from now
                let elapsedTime = now - startTime; // calculate how much the time has past

                if (elapsedTime < duration) {
                    // if time isnt reach the request, then keep update
                    let t = elapsedTime / duration; // calculate the coefficients of interpolation. 0 to 1
                    ring.scale.lerpVectors(initialScale, targetScale, t); // interpolation using lerp function
                    ringTwo.scale.lerpVectors(initialScaleTwo, targetScale, t);
                    ringThree.scale.lerpVectors(initialScaleThree, targetScale, t);

                    requestAnimationFrame(update); // request another frame
                }
                else {
                    // if time has reached the request, set directly to the target scaling value
                    ring.scale.copy(targetScale);
                    ringTwo.scale.copy(targetScale);
                    ringThree.scale.copy(targetScale);
                }
            }

            update();
        }

        //function for position
        function changePosition(x, y, z) {
            this.mainMesh.position.set(x, y, z);
            this.ring.position.set(x, y, z);
            this.ringTwo.position.set(x, y, z);
            this.ringThree.position.set(x, y, z);
            this.particles.position.set(x, y, z);
        }
        this.changePosition = changePosition;

        //function for scale
        function changeScale(x, y, z) {
            if ( x === y && y === z ) scaleNum = x;

            this.mainMesh.scale.set(x, y, z);
            this.ring.scale.set(x, y, z);
            this.ringTwo.scale.set(x, y, z);
            this.ringThree.scale.set(x, y, z);
            this.particles.scale.set(x, y, z);
        }
        this.changeScale = changeScale;
    }
    
    async getMeshes() {
        //await this.loadModelAsync();
        return {
            // main mesh must be named "this.mainMesh", for raycaster judging.
            mainMesh: this.mainMesh,
            ring: this.ring,
            ringTwo: this.ringTwo,
            ringThree: this.ringThree,
            particles: this.particles,
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

    scaleSet(x, y, z) {
        this.changeScale(x, y, z);
    }

    positionSet(x, y, z) {
        this.changePosition(x, y,z);
    }

    rotationSet(x, y, z) {}
}