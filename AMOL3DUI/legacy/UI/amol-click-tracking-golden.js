import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolClickTrackingGolden {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'click-tracking';
        this.viewOffset = viewOffset;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0x000000, 0xeeeeee, 0xff8722];
        const colorTypeTwo = [0x000000, 0xafffa4, 0x45e6ff];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let resetFlag = false;
        let mouseX = 0;
        let mouseY = 0;
        let scaleForBall = 1.0;
        let positionZ = 0;
        let variousType = 0;

        // 2.Scene
        
        // 3.Camera
        
        // 4.Renderer
        
        // 5.Mesh
        const geometryForMain = new THREE.PlaneGeometry(16 + 10, 9 + 5);
        const materialForMain = new THREE.MeshMatcapMaterial({ color: colorList[chooseColor][0], side: THREE.DoubleSide, visible: false });
        const mainMesh = new THREE.Mesh(geometryForMain, materialForMain);
        mainMesh.position.z = -6;
        this.mainMesh = mainMesh;
        
        // 5.Mesh Two
        const geometry = new THREE.SphereGeometry(0.05, 32, 32);
        const material = new THREE.MeshMatcapMaterial();
        // create 200 balls and set color gradient
        const spheres = [];
        const colors = [];
        let sphereGroup = new THREE.Group();
        this.sphereGroup = sphereGroup;
        
        function createSpheres() {
            // clear everytime when call this func
            for (let i = 0; i < spheres.length; i++) {
                const sphere = spheres[i];
                //scene.remove(sphere);
                sphereGroup.remove(sphere);
            }
            spheres.length = 0;
            
            // set color
            for (let i = 0; i < 200; i++) {
                const alpha = i / 200;
                
                const color = new THREE.Color().lerpColors(new THREE.Color( colorList[chooseColor][1] ), new THREE.Color( colorList[chooseColor][2] ), alpha);
                colors.push(color);
            }
        
            for (let i = 0; i < 200; i++) {
                const material = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] }); //loop through colors based on index
                const sphere = new THREE.Mesh(geometry, material);
                const t = Date.now() * 0.0005 + i * 0.05; //use different offsets to differentiate the ball
                const position = (0, 0, 0);
                sphere.position.copy(position);
                sphereGroup.add(sphere);
                spheres.push(sphere);
            }
        }
        
        // 6.Event Listener
        function whenHover() {}
        this.whenHover = whenHover;
        
        function notHover() {}
        this.notHover = notHover;
        
        function whenClick() {
            resetFlag = true;
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            positionZ = 0;
            variousType++;
            if (variousType > 8) variousType = 1;
            createSpheres();
        }
        this.whenClick = whenClick;
        
        // 7.Lights
        
        // 8.Orbit Controls
        
        // 9.Animate
        function animateFunc() {
            positionZ += 0.015;
            
            // update balls position and size
            const time = Date.now() * 0.000005;
            for (let i = 0; i < spheres.length; i++) {
                const sphere = spheres[i];
                const t = time + i * 0.1; // use different offsets to differentiate the ball
                const position = distortPath(t, variousType, mouseX, mouseY, positionZ);
                sphere.position.copy(position);
                
                if (resetFlag == true) {
                    resetFlag = false;
                    scaleForBall = 1.0;
                }
                
                scaleForBall -= 0.01 * 0.003;
                if (scaleForBall <= 0.05) {
                    scaleForBall = 0.05;
                    sphereGroup.remove(sphere);
                    spheres.splice(i, 1);
                    i--; // decrease index to avoid skipping next ball
                } else {
                    sphere.scale.set(scaleForBall, scaleForBall, scaleForBall);
                }
            }
        }
        this.animateFunc = animateFunc;
        
        // 10.Function
        // rose curve function
        function distortPath(t, variousType, mouseX, mouseY, positionZ) {
            let flowerType = [177, 125, 130, 133, 145, 150, 156, 110];
            
            let k = flowerType[variousType - 1];
            
            let r = Math.sin(k * t);
            let x = r * Math.cos(t) * 3 + mouseX * 8;
            let y = r * Math.sin(t) * 3 + mouseY * 4;
            let z = positionZ;
            return new THREE.Vector3(x, y, z);
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
            sphereGroup: this.sphereGroup,
        };
    }
    
    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}