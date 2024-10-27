import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolCursorTrailGolden {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'cursor-trail';
        this.viewOffset = viewOffset;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0x000000, "./AMOL3DUI/UI/moon-one.png", "./AMOL3DUI/UI/moon-two.png", "./AMOL3DUI/UI/moon-three.png"];
        const colorTypeTwo = [0x000000, "./AMOL3DUI/UI/moon-four.png", "./AMOL3DUI/UI/moon-five.png", "./AMOL3DUI/UI/moon-six.png"];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];

        // 2.Scene
        
        // 3.Camera
        
        // 4.Renderer
        
        // 5.Mesh
        const geometryForMain = new THREE.PlaneGeometry(16 + 10, 9 + 5);
        const materialForMain = new THREE.MeshMatcapMaterial({ color: colorList[chooseColor][0], side: THREE.DoubleSide, visible: false });
        const mainMesh = new THREE.Mesh(geometryForMain, materialForMain);
        mainMesh.position.z = -6 - 1;
        this.mainMesh = mainMesh;
        
        // 5.Mesh Two
        const moonGroup = new THREE.Group();
        this.moonGroup = moonGroup;
        const numberOfMoons = 100;
        const moons = [];
        const moonTextures = [colorList[chooseColor][1], colorList[chooseColor][2], colorList[chooseColor][3]];
        let textureIndex = 0;
        
        createMoon();
        
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
        let lastUpdateTime = Date.now(); // use date.now() as initial time
        const interval = 5000;
        
        function animateFunc() {
            const currentTime = Date.now();
            
            // calculate the difference between the current time and the last updated time
            const timeElapsed = currentTime - lastUpdateTime;
            
            if (timeElapsed >= interval) {
                // five seconds have passed
                moons.forEach(moonObject => {
                    moonObject.element.style.opacity = "0";
                    clearInterval(moonObject.rotationInterval);
                    moonObject.element.style.pointerEvents = 'auto';
                    
                    moonObject.position.x = Math.random() * 32 - 16; // -16 ~ 16
                    moonObject.position.y = Math.random() * 18 - 9; // -9 ~ 9
                    moonObject.position.z = Math.random() * 20 - 30; // -30 ~ -10
                });
        
                // update lastUpdateTime to the current time
                lastUpdateTime = currentTime;
            }
        }
        this.animateFunc = animateFunc;
        
        // 10.Function
        function createMoon() {
            // create a moon object and add it to the group
            for (let i = 0; i < numberOfMoons; i++) {
                const element = document.createElement('img');
                element.src = moonTextures[textureIndex];
                element.setAttribute("id", "moon" + i);
                const moon = new CSS3DObject(element);
                moon.scale.set(0.005, 0.005, 0.005);
                moon.position.x = Math.random() * 32 - 16; // -16 ~ 16
                moon.position.y = Math.random() * 18 - 9; // -9 ~ 9
                moon.position.z = Math.random() * 20 - 30; // -30 ~ -10
                moon.element.style.opacity = "0";
                moons.push(moon);
                moonGroup.add(moon);
            
                // update texture index to rotate through different moon images
                textureIndex = (textureIndex + 1) % moonTextures.length;
            }
            
            // add event listeners for each moon object
            moons.forEach(moonObject => {
                moonObject.element.addEventListener('mouseover', function() {
                    onMouseOver(moonObject);
                });
                moonObject.element.addEventListener('mouseout', function() {
                    onMouseOut(moonObject);
                });
            });
        }
        
        function onMouseOver(object) {
            clearInterval(object.rotationInterval); // clear any existing rotation intervals
        
            const center = { x: object.position.x, y: object.position.y, z: object.position.z }; // circle center coordinates
            const radius = 3;
            let angleSpeed = 0.01;
        
            let angle = 0;
        
            const duration = 5000; // animation duration (milliseconds)
            
            const startTime = Date.now(); // get animation start time
        
            object.rotationInterval = setInterval(function() {
                const currentTime = Date.now();
                const elapsedTime = currentTime - startTime;
        
                if (elapsedTime >= duration) {
                    clearInterval(object.rotationInterval);
                } else {
                    const progress = elapsedTime / duration; // animation progress (from 0 to 1)
                    angleSpeed = (1 - progress) * 0.01; // gradually decrease the angule speed according to the progress
        
                    const x = center.x + radius * Math.cos(angle);
                    const z = center.z + radius * Math.sin(angle);
                    object.position.set(x, center.y, z);
                    angle += angleSpeed;
                }
            }, 10);
            
            object.element.style.pointerEvents = 'none';
        }
        
        function onMouseOut(object) {
            let opacity = 0;
            let fadingIn = true;
            
            const fadeInterval = setInterval(() => {
                if (fadingIn) {
                    opacity += 0.006;
                    if (opacity >= 0.6) {
                        opacity = 0.6;
                        fadingIn = false; // entering the fade phase
                    }
                } else {
                    opacity -= 0.006;
                    if (opacity <= 0) {
                        opacity = 0;
                        clearInterval(fadeInterval); // stop timer when finished
                    }
                }
                object.element.style.opacity = opacity.toString();
            }, 5);
        }
        
        //function for position
        function changePosition(x, y, z) {}
        this.changePosition = changePosition;
        
        //function for scale
        function changeScale(scale) {}
        this.changeScale = changeScale;
    }
    
    // 11.Export
    //tools
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            moonGroup: this.moonGroup,
        };
    }
    
    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}