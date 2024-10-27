import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class AdditionalScene {
    constructor(canvasDivName, cssCanvasDivName, zIndexValue = 2, widthValue = 400, heightValue = 400, topValue = 0, leftValue = 15) {
        // 1.Variables
        const canvas = document.createElement('div');
        canvas.id = canvasDivName;
        canvas.style.zIndex = zIndexValue.toString();
        canvas.style.width = widthValue.toString() + "px";
        canvas.style.height = heightValue.toString() + "px";
        canvas.style.position = 'absolute';
        canvas.style.top = topValue.toString() + "%";
        canvas.style.left = leftValue.toString() + "%";
        document.body.appendChild(canvas);

        const canvasTwo = document.createElement('div');
        canvasTwo.id = cssCanvasDivName;
        canvasTwo.style.zIndex = zIndexValue.toString();
        canvasTwo.style.width = widthValue.toString() + "px";
        canvasTwo.style.height = heightValue.toString() + "px";
        canvasTwo.style.position = 'absolute';
        canvasTwo.style.top = topValue.toString() + "%";
        canvasTwo.style.left = leftValue.toString() + "%";
        document.body.appendChild(canvasTwo);

        const objectList = [];
        const listForListener = [];
        const funcListForAnimate = [];
        let currentObject = null;

        class ListenerFunc {
            constructor(eventName, func, name) {
                this.eventName = eventName;
                this.func = func;
                this.name = name;
            }
        }

        // 2.Scene
        const scene = new THREE.Scene();

        // 3.Camera
        const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 20;
        // ajust camera because renderer size has changed in this virtual scene
        camera.aspect = widthValue / heightValue;
        camera.updateProjectionMatrix();

        // 4.Renderer
        const container = document.getElementById(canvasDivName);
        const containerTwo = document.getElementById(cssCanvasDivName);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(widthValue, heightValue);
        container.appendChild(renderer.domElement);

        const cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(widthValue, heightValue);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.top = '0';
        containerTwo.appendChild(cssRenderer.domElement);

        // 5.Mesh

        // 6.Event Listener
        let raycaster = new THREE.Raycaster();
        function onMouseMove(event) {
            let mouse = new THREE.Vector2();
            mouse.x = ((event.clientX - (leftValue / 100) * window.innerWidth) / widthValue) * 2 - 1;
            mouse.y = -((event.clientY - (topValue / 100) * window.innerHeight) / heightValue) * 2 + 1;

            // update the start point and direction of the ray
            raycaster.setFromCamera(mouse, camera);

            // detect intersection of ray and object
            let intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                for (const key in objectList) {
                    if (intersects[0].object.uuid === objectList[key].mainMesh.uuid) {
                        currentObject = objectList[key];
                        if (objectList[key].objectType != 'click-tracking' && objectList[key].objectType != 'input' && objectList[key].objectType != 'cursor-trail') document.body.style.cursor = 'pointer';
                        //else document.body.style.cursor = 'auto';

                        objectList[key].whenHover();
                        scanListForListener('hover', objectList[key]);

                        break;
                    }
                    else {
                        objectList[key].notHover();
                        //document.body.style.cursor = 'auto';
                    }
                }
            }
            else {
                if (currentObject != null) currentObject.notHover();
                //document.body.style.cursor = 'auto';
            }
        }
        document.addEventListener('mousemove', onMouseMove, false);

        function onClick(event) {
            let mouse = new THREE.Vector2();
            mouse.x = ((event.clientX - (leftValue / 100) * window.innerWidth) / widthValue) * 2 - 1;
            mouse.y = -((event.clientY - (topValue / 100) * window.innerHeight) / heightValue) * 2 + 1;

            // update the start point and direction of the ray
            raycaster.setFromCamera(mouse, camera);

            // detect intersection of ray and object
            let intersects = raycaster.intersectObjects(scene.children, true);

            for (const key in objectList) {
                if (intersects.length > 0 && intersects[0].object === objectList[key].mainMesh) {
                    objectList[key].whenClick();
                    scanListForListener('click', objectList[key]);
                }
            }
        }
        document.addEventListener('click', onClick, false);

        // Logically, the following code region should not make any difference to amol-default-setup.js

        // 7.Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        scene.add(ambientLight);

        const light = new THREE.PointLight(0xffffff, 200, 50);
        light.position.set(0, 5, 0);
        scene.add(light);

        // 8.Orbit Controls
        //const controls = new OrbitControls(camera, cssRenderer.domElement);

        // 9.Animate
        function animate() {
            requestAnimationFrame(animate);

            for (let i = 0; i < funcListForAnimate.length; i++) {
                funcListForAnimate[i]();
            }

            light.position.x = Math.sin(Date.now() * 0.00025) * 10;
            light.position.z = Math.abs(Math.cos(Date.now() * 0.00025)) * 10;

            //controls.update();

            renderer.render(scene, camera);
            cssRenderer.render(scene, camera);
        }

        // 10.Function
        function addMesh(object) {
            const meshes = object.getMeshes();
            for (const key in meshes) {
                scene.add(meshes[key]);
            }
        }

        function removeMesh(object) {
            const meshes = object.getMeshes();
            for (const key in meshes) {
                scene.remove(meshes[key]);
                if (meshes[key].geometry) meshes[key].geometry.dispose();
                if (meshes[key].material) meshes[key].material.dispose();
            }
        }

        function addFunction(object) {
            const methods = object.getMethods();
            for (const key in methods) funcListForAnimate.push(methods[key]);
        }

        function removeFunction(object) {
            const methods = object.getMethods();
            for (const key in methods) {
                const index = funcListForAnimate.findIndex(func => func === methods[key]);
                if (index !== -1) {
                    funcListForAnimate.splice(index, 1);
                }
            }
        }

        function scanListForListener(eventName, object) {
            for (const key in listForListener) {
                if (listForListener[key].eventName === eventName && listForListener[key].name === object.name) listForListener[key].func();
            }
        }

        this.addObject = function addObject(object) {
            objectList.push(object);
            addMesh(object);
            addFunction(object);
        }

        this.removeObject = function removeObject(objectName) {
            for (const key in objectList) {
                if (objectList[key].name == objectName) {
                    removeMesh(objectList[key]);
                    removeFunction(objectList[key]);
                    objectList.splice(key, 1);
                }
            }
        }

        this.returnValue = function returnValue(objectName) {
            for (const key in objectList) {
                if (objectList[key].name == objectName && objectList[key].objectType == 'input') {
                    return objectList[key].getValue();
                }
            }
        }

        this.addListener = function addListener(eventName, func, objectName) {
            const listenerFuncInstance = new ListenerFunc(eventName, func, objectName);
            listForListener.push(listenerFuncInstance);
        }

        this.removeListener = function removeListener(objectName) {
            for (const key in listForListener) {
                if (listForListener[key].name === objectName) listForListener.splice(key, 1);
            }
        }

        this.addPosition = function addPosition(x, y, z, objectName) {
            for (const key in objectList) {
                if (objectList[key].name == objectName) objectList[key].changePosition(x, y, z);
            }
        }

        this.addScale = function addScale(scale, objectName) {
            for (const key in objectList) {
                if (objectList[key].name == objectName) objectList[key].changeScale(scale);
            }
        }

        this.animateAll = function animateAll() {
            animate();
        }
    }
}