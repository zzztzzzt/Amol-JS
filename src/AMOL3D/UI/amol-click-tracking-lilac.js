import * as THREE from 'three';

export class ClickTrackingLilac {
    constructor(color = 0) {
        // 1. Variables
        this.objectType = 'click-tracking';

        let colorTypeOne = {};
        let colorTypeTwo = {};
        let colorCustom = {};
        this.colorTypeList = [colorTypeOne, colorTypeTwo, colorCustom];
        this.groundY = -2;
        this.bounceDamping = 0.78;
        this.clickLock = false;

        // 2. Mesh
        this.ballGroup = new THREE.Group();

        // 3. Light

        // 4. Event Listener
        this.whenMouseOver = () => {};

        this.notMouseOver = () => {};

        this.whenClick = () => {
            if (this.clickLock) return;
            spawnBalls(100);
        };

        this.whenMouseMove = (x, y) => {};

        this.customizeWhenMouseOver = () => {};

        this.customizeNotMouseOver = () => {};

        this.customizeWhenClick = () => {};

        // 5. Animate
        this.animateFunc = () => {
            const time = performance.now() * 0.001;

            this.ballGroup.children.forEach(ball => {

                ball.userData.velocity.y -= 0.0005;

                ball.position.add(ball.userData.velocity);

                ball.rotation.x += ball.userData.spin.x;
                ball.rotation.y += ball.userData.spin.y;

                ball.material.emissiveIntensity = Math.abs(Math.sin(time * 4 + ball.userData.seed)) * 0.6 + 0.2;

                if (ball.position.y <= this.groundY) {
                    ball.position.y = this.groundY;
                    ball.userData.velocity.y *= -this.bounceDamping;

                    ball.userData.velocity.x *= 0.96;
                    ball.userData.velocity.z *= 0.96;
                }
            });

            this.ballGroup.rotation.y -= 0.015;
        };

        // 6. Functions
        const spawnBalls = (count = 180) => {
            clearBalls();

            this.clickLock = true;

            const points = [];
            for (let i = 0; i < 10; i++) {
            points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
            }
            const segments = 30;
            const phiLength = 1.5707963705062866;

            for (let i = 0; i < count; i++) {
                const phiStart = (i / count) * Math.PI * 2;

                const size = THREE.MathUtils.randFloat(0.01, 0.08);
                const geometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
                const material = new THREE.MeshStandardMaterial({
                    color: randomPurpleColor(),
                    emissive: new THREE.Color(randomPurpleColor()),
                    emissiveIntensity: 0.4,
                    roughness: 0.25,
                    metalness: 0.35
                });

                const ball = new THREE.Mesh(geometry, material);
                ball.scale.set(0.01, 0.01, 0.01);
                // override the raycast method to prevent Raycaster from detecting the Mesh
                ball.raycast = function (raycaster, intersects) {
                    // return directly without doing any operation, preventing Raycaster from detecting
                };

                ball.position.set(
                    (Math.random() - 0.5) * 18,   // X
                    Math.random() * 3 + 1.5,     // Y
                    (Math.random() - 0.5) * 6    // Z
                );

                ball.userData.velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.12,
                    (Math.random() * 0.07 * -1),
                    (Math.random() - 0.5) * 0.12
                );

                ball.userData.spin = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    0
                );

                ball.userData.seed = Math.random() * 10;

                this.ballGroup.add(ball);
            }

            setTimeout(clearBalls, 4500);
        }

        function randomPurpleColor() {
            const hue = THREE.MathUtils.randFloat(260, 330) / 360;
            const sat = THREE.MathUtils.randFloat(0.5, 0.9);
            const light = THREE.MathUtils.randFloat(0.4, 0.7);
            const color = new THREE.Color();
            color.setHSL(hue, sat, light);
            return color;
        }

        const clearBalls = () => {
            while (this.ballGroup.children.length > 0) {
                const ball = this.ballGroup.children[0];
                this.ballGroup.remove(ball);
                ball.geometry.dispose();
                ball.material.dispose();
            }
            this.clickLock = false;
        }
    }

    async getMeshes() {
        return {
            mainMesh: this.ballGroup,
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

    positionSet(x, y, z) {}
}