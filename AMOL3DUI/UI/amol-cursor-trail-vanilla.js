import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolCursorTrailVanilla {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'cursor-trail';
        this.viewOffset = viewOffset;
        const offsetNum = 0.95;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0x000000, 0x2e71e5, 0x00aaff, 0x88ccff, 0xddddff, 0xf2f2f2];
        const colorTypeTwo = [0x000000, 0xff736c, 0xffad9b, 0xfbcfff, 0xcf96ff, 0xf2f2f2];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let index = 0; // for mouse move listener
        let lastSpherePosition = new THREE.Vector3(); // create a variable to store the position of the last generated object at the top
        
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
        const sphereGroup = new THREE.Group();
        this.sphereGroup = sphereGroup;
        const sphereGeometry = new THREE.SphereGeometry(0.8, 10, 10);
        const spheres = [];
        
        const colorMap = {
            0: { scale: 0.5, color: colorList[chooseColor][1] },
            5: { scale: 0.5, color: colorList[chooseColor][2] },
            10: { scale: 0.5, color: colorList[chooseColor][3] },
            15: { scale: 0.5, color: colorList[chooseColor][4] },
            20: { scale: 0.5, color: colorList[chooseColor][5] },
            25: { scale: 0.5, color: colorList[chooseColor][1] },
            30: { scale: 0.5, color: colorList[chooseColor][2] },
            35: { scale: 0.5, color: colorList[chooseColor][3] },
            40: { scale: 0.5, color: colorList[chooseColor][4] },
            45: { scale: 0.5, color: colorList[chooseColor][5] },
            50: { scale: 0.5, color: colorList[chooseColor][1] }
        };
        
        // 6.Event Listener
        
        // mouse Move Listener
        function onMouseMove(event) {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
            // new object's position
            const newSpherePosition = new THREE.Vector3(mouseX * 8, mouseY * 4, 0);
        
            // distance between the new object and the last object
            const distance = newSpherePosition.distanceTo(lastSpherePosition);
        
            // logic
            if (distance >= 0.7) { // You can adjust the distance threshold as needed
                if (index > 50) index -= 50;
                else index++;
                
                // create new object
                const sphereMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                // override the raycast method to prevent Raycaster from detecting the Mesh
                sphere.raycast = function (raycaster, intersects) {
                    // return directly without doing any operation, preventing Raycaster from detecting
                };
        
                const { scale, color } = getScaleAndColor(index);
                sphere.scale.set(scale, scale, scale);
                sphere.material.color.set(color);
        
                sphere.position.copy(newSpherePosition);
                
                sphereGroup.add(sphere);
                spheres.push(sphere);
        
                // control the number of objects
                if (spheres.length > 50) {
                    const removedSphere = spheres.shift();
                    sphereGroup.remove(removedSphere);
                }
        
                // update the position of the last object
                lastSpherePosition.copy(newSpherePosition);
            }
        }
        window.addEventListener('mousemove', onMouseMove);
        
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
            // iterate through each sphere and update its position
            spheres.forEach((sphere) => {
                sphere.position.z += 0.2;
            });
        }
        this.animateFunc = animateFunc;
        
        // 10.Function
        function getScaleAndColor(index) {
            for (let key in colorMap) {
                if (index % 50 <= key) {
                    return colorMap[key];
                }
            }
        }
        
        //function for position
        function changePosition(x, y, z) {}
        this.changePosition = changePosition;
        
        //function for scale
        function changeScale(scale) {}
        this.changeScale = changeScale;
        
        // function for getValue
        function getValue() {
            return 'cursor-trail';
        }
        this.getValue = getValue;
    }
    
    // 11.Export
    //tools
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            sphereGroup: this.sphereGroup,
        };
    }
    
    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}