import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AmolCursorTrailRipple {
    constructor(name, color = 0, viewOffset = 'none') {
        // 1.Variables
        this.name = name;
        this.objectType = 'cursor-trail';
        this.viewOffset = viewOffset;
        const offsetNum = 0.95;
        let positionNum = [0, 0, 0];
        let scaleNum = 1.0;
        let chooseColor = color;
        const colorTypeOne = [0x000000, 0x00a0ff, 0xff7569];
        const colorTypeTwo = [0x000000, 0x124061, 0xef0e08];
        const colorTypeThree = [];
        const colorList = [colorTypeOne, colorTypeTwo, colorTypeThree];
        let polygons = [];
        let oldGeneratPosition = new THREE.Vector3(0, 0, 0);

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
        const polygonGroup = new THREE.Group();
        this.polygonGroup = polygonGroup;

        // 6.Event Listener
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
            polygons.forEach(polygon => {
                polygon.position.x += polygon.userData.velocity.x;
                polygon.position.y += polygon.userData.velocity.y;
                polygon.position.z += polygon.userData.velocity.z;

                polygon.material.opacity -= 0.005;
                polygon.rotation.y += 0.03;
                polygon.rotation.x += 0.03;
                polygon.scale.set(polygon.scale.x * 1.018, polygon.scale.y * 1.018, polygon.scale.z * 1.018);
            });
        }
        this.animateFunc = animateFunc;

        // 10.Function
        function lerpColor(color1, color2, t) {
            const r = Math.round(((color1 >> 16) & 0xff) * (1 - t) + ((color2 >> 16) & 0xff) * t);
            const g = Math.round(((color1 >> 8) & 0xff) * (1 - t) + ((color2 >> 8) & 0xff) * t);
            const b = Math.round((color1 & 0xff) * (1 - t) + (color2 & 0xff) * t);
            return (r << 16) | (g << 8) | b;
        }

        function createPolygon(radius, sides) {
            const geometry = new THREE.OctahedronGeometry(radius, 0);

            // calculate color gradient
            const color1 = colorList[chooseColor][1];
            const color2 = colorList[chooseColor][2];
            const t = Math.random(); // randomly generate proportions of color gradients
            const color = lerpColor(color1, color2, t);

            const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, wireframe: true });
            return new THREE.Mesh(geometry, material);
        }

        function onMouseMove(event) {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            //console.log(mouseX, mouseY);
            const newGeneratPosition = new THREE.Vector3(mouseX * 8, mouseY * 4, 0);
            const distance = oldGeneratPosition.distanceTo(newGeneratPosition);
            if (distance >= 0.5) {
                oldGeneratPosition.copy(newGeneratPosition);

                for (let i = 0; i < 2; i++) {
                    const polygon = createPolygon(0.2);
                    polygon.material.opacity = 0.3;

                    // new object's position
                    const newPolygonPosition = new THREE.Vector3(mouseX * 8, mouseY * 4, 0);

                    // set position and use mouseX and mouseY as reference
                    polygon.position.copy(newPolygonPosition);
                    // override the raycast method to prevent Raycaster from detecting the Mesh
                    polygon.raycast = function (raycaster, intersects) {
                        // return directly without doing any operation, preventing Raycaster from detecting
                    };
                    polygon.userData = {
                        velocity: {
                            x: Math.random() * 0.05 - 0.025,
                            y: Math.random() * 0.05 - 0.025,
                            z: Math.random() * 0.05 - 0.025
                        }
                    };
                    polygonGroup.add(polygon);
                    polygons.push(polygon);
                }
            }

            // check length of polygons array
            if (polygons.length > 60) {
                for (let i = 0; i < 3; i++) {
                    const removedPolygon = polygons.shift(); // delete the first polygon
                    polygonGroup.remove(removedPolygon);

                    // free memory
                    removedPolygon.geometry.dispose();
                    removedPolygon.material.dispose();
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

        }
        this.getValue = getValue;
    }

    // 11.Export
    //tools
    getMeshes() {
        return {
            mainMesh: this.mainMesh,
            polygonGroup: this.polygonGroup,
        };
    }

    getMethods() {
        return {
            animateFunc: this.animateFunc.bind(this),
        };
    }
}