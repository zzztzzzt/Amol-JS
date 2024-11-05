import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

export class MovieForgotten {
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

        let cameraLock = true;
        let cameraLockRotate = true;
        let cameraSpeedArr = [0, 0, 0];
        let cameraSpeedArrRotate = [0, 0, 0];
        let startCheckCamera = false;
        let cameraStopPoint = [0, 0, 0];

        let maxFps = 60;
        let frameDelay = 1000 / maxFps;
        let lastFrameTime = 0;

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
        const loader = new GLTFLoader();
        let model, model2, model3, model4, model5;
        loader.load('AMOL3DUI/legacy/stone-one.glb', (gltf) => {
            model = gltf.scene;
            scene.add(model);
            model.position.set(-3.5, -1, 0);
            model.scale.set(0.7, 0.7, 0.7);
        }, undefined, (error) => {
            console.error(error);
        });

        loader.load('AMOL3DUI/legacy/stone-one.glb', (gltf) => {
            model2 = gltf.scene;
            scene.add(model2);
            model2.position.set(3.5, -1, 0);
            model2.scale.set(0.7, 0.7, 0.7);
        }, undefined, (error) => {
            console.error(error);
        });

        loader.load('AMOL3DUI/legacy/stone-one.glb', (gltf) => {
            model3 = gltf.scene;
            scene.add(model3);
            model3.position.set(-2.5, -1, -10);
            model3.scale.set(0.7, 0.7, 0.7);
        }, undefined, (error) => {
            console.error(error);
        });

        loader.load('AMOL3DUI/legacy/stone-one.glb', (gltf) => {
            model4 = gltf.scene;
            scene.add(model4);
            model4.position.set(2.5, -1, -10);
            model4.scale.set(0.7, 0.7, 0.7);
        }, undefined, (error) => {
            console.error(error);
        });

        loader.load('AMOL3DUI/legacy/dragon-one.glb', (gltf) => {
            model5 = gltf.scene;
            scene.add(model5);
            model5.scale.set(0.4, 0.4, 0.4);
            model5.rotation.y = -Math.PI / 2 - 0.2;
            model5.rotation.x = 0.1;
            model5.position.x = -2.5;
            model5.position.y = -3;
            model5.position.z = 2;
        }, undefined, (error) => {
            console.error(error);
        });

        let geometry = new THREE.CircleGeometry( 15, 64 );
        let groundMirror = new Reflector( geometry, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0xffffff,
            } );
        groundMirror.position.y = -2.5;
        groundMirror.rotateX( - Math.PI / 2 );
        scene.add( groundMirror );

        let ceilingGeometry = new THREE.CircleGeometry( 500, 64 );
        const texture = new THREE.TextureLoader().load('AMOL3DUI/legacy/white-texture-one.png', function (texture) {
            let ceilingMaterial = new THREE.MeshBasicMaterial({ map: texture });
            let ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
            ceiling.position.y = 30;
            ceiling.rotateX( Math.PI / 2 );
            scene.add(ceiling);
        });

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

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            groundMirror.getRenderTarget().setSize(
                window.innerWidth * window.devicePixelRatio,
                window.innerHeight * window.devicePixelRatio
            );
        });

        // 7.Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        scene.add(ambientLight);

        const light = new THREE.PointLight(0xffffff, 200, 50);
        light.position.set(0, 5, 0);
        scene.add(light);

        const pointLight = new THREE.PointLight(0xff00f7, 8, 30);
        pointLight.position.set(0, 0, -8);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xff00f7, 8, 30);
        pointLight2.position.set(3, 0, 3);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xff00f7, 8, 30);
        pointLight3.position.set(-3, 0, 3);
        scene.add(pointLight3);

        // 8.Orbit Controls
        //const controls = new OrbitControls(camera, cssRenderer.domElement);

        // 9.Animate
        let timeCounterForModel = 0;
        const amplitude = 0.12;
        const speed = 0.3;
        function animate(time) {
            if (time - lastFrameTime >= frameDelay) {
                lastFrameTime = time - (time - lastFrameTime) % frameDelay;

                for (let i = 0; i < funcListForAnimate.length; i++) {
                    funcListForAnimate[i]();
                }

                if (model) {
                    timeCounterForModel += 0.01;
                    model.position.y = amplitude * Math.sin(timeCounterForModel * speed) - 1.5;
                    model.rotation.y += 0.0018;
                }
                if (model2) {
                    timeCounterForModel += 0.01;
                    model2.position.y = amplitude * Math.cos(timeCounterForModel * speed) - 1.5;
                    model2.rotation.y += 0.0018;
                }
                if (model3) {
                    timeCounterForModel += 0.01;
                    model3.position.y = amplitude * Math.cos(timeCounterForModel * speed) - 1.5;
                    model3.rotation.y -= 0.0018;
                }
                if (model4) {
                    timeCounterForModel += 0.01;
                    model4.position.y = amplitude * Math.sin(timeCounterForModel * speed) - 1.5;
                    model4.rotation.y -= 0.0018;
                }
                if (model5) {
                    timeCounterForModel += 0.01;
                    model5.position.y = amplitude * Math.sin(timeCounterForModel * speed) - 3;
                }

                light.position.x = Math.sin(Date.now() * 0.00025) * 10;
                light.position.z = Math.abs(Math.cos(Date.now() * 0.00025)) * 10;

                //controls.update();

                if (!cameraLock) {
                    camera.position.x += cameraSpeedArr[0];
                    camera.position.y += cameraSpeedArr[1];
                    camera.position.z += cameraSpeedArr[2];
                }

                if (!cameraLockRotate) {
                    camera.rotation.x += cameraSpeedArrRotate[0];
                    camera.rotation.y += cameraSpeedArrRotate[1];
                    camera.rotation.z += cameraSpeedArrRotate[2];
                }

                if (startCheckCamera) {
                    if (camera.position.x == cameraStopPoint[0] && camera.position.y == cameraStopPoint[1] && camera.position.z == cameraStopPoint[2]) {
                        cameraLock = true;
                        startCheckCamera = false;
                    }
                }

                renderer.render(scene, camera);
                cssRenderer.render(scene, camera);
            }

            requestAnimationFrame(animate);
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

        this.cameraSpeed =  function cameraSpeed(speedX, speedY, speedZ) {
            cameraLock = false;
            cameraSpeedArr[0] = speedX;
            cameraSpeedArr[1] = speedY;
            cameraSpeedArr[2] = speedZ;
        }

        this.cameraSpeedRotate =  function cameraSpeedRotate(rotateSpeedX, rotateSpeedY, rotateSpeedZ) {
            cameraLockRotate = false;
            cameraSpeedArrRotate[0] = rotateSpeedX;
            cameraSpeedArrRotate[1] = rotateSpeedY;
            cameraSpeedArrRotate[2] = rotateSpeedZ;
        }

        this.stopCamera =  function stopCamera() {
            cameraLock = true;
        }

        this.stopCameraRotate =  function stopCameraRotate() {
            cameraLockRotate = true;
        }

        this.stopCameraAt =  function stopCameraAt(x, y, z) {
            startCheckCamera = true;
            cameraStopPoint[0] = x;
            cameraStopPoint[1] = y;
            cameraStopPoint[2] = z;
        }
    }
}