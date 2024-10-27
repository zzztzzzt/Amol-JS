import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1.Variables
const canvas = document.createElement('div');
canvas.id = 'canvas-container';
//canvas.style.zIndex = '-1';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
document.body.appendChild(canvas);

const canvasTwo = document.createElement('div');
canvasTwo.id = 'canvas-container-two';
//canvasTwo.style.zIndex = '-1';
canvasTwo.style.width = '100%';
canvasTwo.style.height = '100%';
canvasTwo.style.position = 'absolute';
canvasTwo.style.top = '0';
canvasTwo.style.left = '0';
document.body.appendChild(canvasTwo);

const objectList = [];
const listForListener = [];
const funcListForAnimate = [];
let currentObject = null;
let cameraLock = true;
let cameraSpeedArr = [0, 0, 0];
let startCheckCamera = false;
let cameraStopPoint = [0, 0, 0];

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

// 4.Renderer
const container = document.getElementById('canvas-container');
const containerTwo = document.getElementById('canvas-container-two');

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = 0;
containerTwo.appendChild(cssRenderer.domElement);

// 5.Mesh

// 6.Event Listener
let raycaster = new THREE.Raycaster();
function onMouseMove(event) {
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the start point and direction of the ray
    raycaster.setFromCamera(mouse, camera);

    // detect intersection of ray and object
    let intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // prevent the program from not executing notHover() when intersects.length > 0
        if (currentObject != null) currentObject.notHover();

        for (const key in objectList) {
            if (intersects[0].object.uuid === objectList[key].mainMesh.uuid) {
                currentObject = objectList[key];
                if (objectList[key].objectType != 'click-tracking' && objectList[key].objectType != 'input' && objectList[key].objectType != 'cursor-trail') document.body.style.cursor = 'pointer';
                else document.body.style.cursor = 'auto';

                objectList[key].whenHover();
                scanListForListener('hover', objectList[key]);

                break;
            }
            else {
                objectList[key].notHover();
                document.body.style.cursor = 'auto';
            }
        }
    }
    else {
        if (currentObject != null) currentObject.notHover();
        document.body.style.cursor = 'auto';
    }
}
document.addEventListener('mousemove', onMouseMove, false);

function onClick(event) {
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the start point and direction of the ray
    raycaster.setFromCamera(mouse, camera);

    // detect intersection of ray and object
    var intersects = raycaster.intersectObjects(scene.children, true);

    for (const key in objectList) {
        if (intersects.length > 0 && intersects[0].object === objectList[key].mainMesh) {
            objectList[key].whenClick();
            scanListForListener('click', objectList[key]);
        }
    }
}
document.addEventListener('click', onClick, false);

window.addEventListener('resize', onWindowResize);

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

    if (!cameraLock) {
        camera.position.x += cameraSpeedArr[0];
        camera.position.y += cameraSpeedArr[1];
        camera.position.z += cameraSpeedArr[2];
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
}

// 11.Export
export function addObject(object) {
    objectList.push(object);
    addMesh(object);
    addFunction(object);
}

export function removeObject(objectName) {
    for (const key in objectList) {
        if (objectList[key].name == objectName) {
            removeMesh(objectList[key]);
            removeFunction(objectList[key]);
            objectList.splice(key, 1);
        }
    }
}

export function returnValue(objectName) {
    for (const key in objectList) {
        if (objectList[key].name == objectName && objectList[key].objectType == 'input') {
            return objectList[key].getValue();
        }
    }
}

export function addListener(eventName, func, objectName) {
    const listenerFuncInstance = new ListenerFunc(eventName, func, objectName);
    listForListener.push(listenerFuncInstance);
}

export function removeListener(objectName) {
    for (const key in listForListener) {
        if (listForListener[key].name === objectName) listForListener.splice(key, 1);
    }
}

export function addPosition(x, y, z, objectName) {
    for (const key in objectList) {
        if (objectList[key].name == objectName) objectList[key].changePosition(x, y, z);
    }
}

export function addScale(scale, objectName) {
    for (const key in objectList) {
        if (objectList[key].name == objectName) objectList[key].changeScale(scale);
    }
}

export function animateAll() {
    animate();
}

export function cameraSpeed(speedX, speedY, speedZ) {
    cameraLock = false;
    cameraSpeedArr[0] = speedX;
    cameraSpeedArr[1] = speedY;
    cameraSpeedArr[2] = speedZ;
}

export function stopCamera() {
    cameraLock = true;
}

export function stopCameraAt(x, y, z) {
    startCheckCamera = true;
    cameraStopPoint[0] = x;
    cameraStopPoint[1] = y;
    cameraStopPoint[2] = z;
}