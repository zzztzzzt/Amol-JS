import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolClickTrackingVanilla {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'click-tracking';
        this.viewOffset = viewOffset;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0x000000, 0xFFD4DE];
        const colorTypeTwo = [0x000000, 0xF8D4CD];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let removeFlag = false;

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
        const triangleGroup = new THREE.Group();
        this.triangleGroup = triangleGroup;
        
        // 6.Event Listener
        function whenHover() {}
        this.whenHover = whenHover;
        
        function notHover() {}
        this.notHover = notHover;
        
        function whenClick() {
            if (!removeFlag) {
                removeFlag = true;
                createTriangles(event.clientX, event.clientY);
                triangleGroup.rotation.y = 0;
                setTimeout(removeTriangles, 2000);
            }
        }
        this.whenClick = whenClick;
        
        // 7.Lights
        
        // 8.Orbit Controls
        
        // 9.Animate
        function animateFunc() {
            // apply rotation and movement to each triangle
            triangleGroup.children.forEach(function(child) {
                if (child instanceof THREE.Mesh) {
                    // Update rotation
                    child.rotation.x += child.rotationSpeedX;
                    child.rotation.y += child.rotationSpeedY;
                    child.rotation.z += child.rotationSpeedZ;
        
                    // update position
                    child.position.add(child.velocity);
                    
                    // decrease opacity gradually
                    child.material.opacity -= 0.005;
                }
            });
            
            // apply movement to each triangle
            triangleGroup.children.forEach(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.position.add(child.velocity);
                }
            });
        }
        this.animateFunc = animateFunc;
        
        // 10.Function
        function createTriangles(targetX, targetY) {
            for (let i = 0; i < 300; i++) {
                const geometry = new THREE.BufferGeometry();
                const material = new THREE.MeshBasicMaterial({ color: colorList[chooseColor][1], transparent: true, opacity: 0.5 });
                const vertices = new Float32Array([
                    0, 0, 0,
                    1.2, 0, 0,
                    0, 1.2, 0
                ]);
                geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
                const triangle = new THREE.Mesh(geometry, material);
        
                triangle.position.x = Math.random() * 20 - 10;
                triangle.position.y = Math.random() * 12 - 6;
                triangle.position.z = Math.random() * 16 - 8;
        
                // calculate direction towards the click position
                const directionX = (targetX / window.innerWidth) * 2 - 1;
                const directionY = -(targetY / window.innerHeight) * 2 + 1;
                const directionZ = 0;
        
                // set velocity towards the click position
                triangle.velocity = new THREE.Vector3(directionX, directionY, directionZ).normalize().multiplyScalar(0.03);
                
                // add random rotation speeds
                triangle.rotationSpeedX = Math.random() * 0.1 - 0.05;
                triangle.rotationSpeedY = Math.random() * 0.1 - 0.05;
                triangle.rotationSpeedZ = Math.random() * 0.1 - 0.05;
                
                triangleGroup.add(triangle);
            }
        }
        
        function removeTriangles() {
            triangleGroup.children.forEach(mesh => triangleGroup.remove(mesh));
            removeFlag = false;
        }
        
        // function for position
        function changePosition(x, y, z) {}
        this.changePosition = changePosition;
        
        // function for scale
        function changeScale(scale) {}
        this.changeScale = changeScale;
    }
    
    // 11.Export
    //tools
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            triangleGroup: this.triangleGroup,
        };
    }
    
    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}