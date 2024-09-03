import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolButtonGolden {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'button';
        this.viewOffset = viewOffset;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0xffffff, 0xffca33, 0xff9760, 0xc3c3c3, 0xf6e58d, 0xffdb5f];
        const colorTypeTwo = [0xffffff, 0x9bf1d9, 0x00905b, 0x8fcbc9, 0x1fa068, 0x5bc1a5];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let cubeStatus = "origin";
        const rotationAxis = new THREE.Vector3(1, 1, 0).normalize();
        const quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, Math.PI / 180);
        
        // 2.Scene

        // 3.Camera
        
        // 4.Renderer
        
        // 5.Mesh
        const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const sphereMaterial = new THREE.MeshMatcapMaterial({ color: colorList[chooseColor][0], visible: false });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.mainMesh = sphere;
        
        // 5.Mesh Two
        const geometry = new THREE.TorusGeometry(1.5, 0.015, 64, 100);
        const material = new THREE.MeshPhongMaterial({ color: colorList[chooseColor][1] });
        const ring = new THREE.Mesh(geometry, material);
        this.ring = ring;
        
        // 5.Mesh Three
        const geometryTwo = new THREE.TorusGeometry(1.5, 0.005, 64, 100);
        const materialTwo = new THREE.MeshPhongMaterial({ color: colorList[chooseColor][2] });
        const ringTwo = new THREE.Mesh(geometryTwo, materialTwo);
        ringTwo.rotation.y = Math.PI / 2;
        this.ringTwo = ringTwo;
        
        // 5.Mesh Four
        const geometryThree = new THREE.TorusGeometry(1.5, 0.0075, 64, 100);
        const materialThree = new THREE.MeshPhongMaterial({ color: colorList[chooseColor][3] });
        const ringThree = new THREE.Mesh(geometryThree, materialThree);
        ringThree.rotation.x = Math.PI / 2;
        this.ringThree = ringThree;
        
        // 5.Mesh Five
        let cubeSize = 1.2;
        
        // generate particles
        let particleCount = 350;
        let particles = new THREE.Group();
        
        // define start color and end color
        let colorStart = new THREE.Color( colorList[chooseColor][4] );
        let colorEnd = new THREE.Color( colorList[chooseColor][5] );
        // color interpolation step size
        let colorStep = 1 / (particleCount / 10); // interpolate every 10 particles
        
        for (let i = 0; i < particleCount; i++) {
            // calculate the color that the current particle should use
            let color = new THREE.Color().lerpColors(colorStart, colorEnd, i * colorStep);
            
            let particleMaterial = new THREE.MeshBasicMaterial({ color: color });
            
            let particle = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 16), particleMaterial);
        
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
        
        // 6.Event Listener
        function whenHover() {
            if (cubeStatus != "max" && cubeStatus != "smaller") cubeStatus = "bigger";
        }
        this.whenHover = whenHover;
        
        function notHover() {
            if (cubeStatus != "max" && cubeStatus != "smaller") {
                cubeSize = 1.2;
                cubeStatus = "origin";
            }
        }
        this.notHover = notHover;
        
        function whenClick() {
            cubeSize = 0.6;
            startScaling();
        }
        this.whenClick = whenClick;

        // 7.Lights
        
        // 8.Orbit Controls
        
        // 9.Animate
        function animateFunc() {
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
        }
        this.animateFunc = animateFunc;
        
        // 10.Function
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
        function changeScale(scale) {
            scaleNum = scale;
            this.mainMesh.scale.set(scale, scale, scale);
            this.ring.scale.set(scale, scale, scale);
            this.ringTwo.scale.set(scale, scale, scale);
            this.ringThree.scale.set(scale, scale, scale);
            this.particles.scale.set(scale, scale, scale);
        }
        this.changeScale = changeScale;
    }
    
    // 11.Export
    //tools
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            ring: this.ring,
            ringTwo: this.ringTwo,
            ringThree: this.ringThree,
            particles: this.particles,
        };
    }
    
    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}