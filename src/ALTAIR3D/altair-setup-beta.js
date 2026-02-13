import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export class AltairScene {
    constructor(divId, cssDivId) {
        const div = document.getElementById(divId);
        this.div = div;
        const cssDiv = document.getElementById(cssDivId);
        this.cssDiv = cssDiv;

        // 1. Variables
        let altairObjectList = [];
        this.altairObjectList = altairObjectList;
        let listenerFuncMapClick = new Map();
        this.listenerFuncMapClick = listenerFuncMapClick;
        let listenerFuncListClick = [];
        this.listenerFuncListClick = listenerFuncListClick;
        let listenerFuncListMouseMove = [];
        this.listenerFuncListMouseMove = listenerFuncListMouseMove;
        let listenerFuncMapMouseOver = new Map();
        this.listenerFuncMapMouseOver = listenerFuncMapMouseOver;
        let listenerFuncMapNotMouseOver = new Map();
        this.listenerFuncMapNotMouseOver = listenerFuncMapNotMouseOver;
        let animateFuncList = [];
        this.animateFuncList = animateFuncList;
        let currentObject = null;
        this.currentObject = currentObject;
        let interactiveMeshes = [];
        this.interactiveMeshes = interactiveMeshes;

        // 2. Scene
        const scene = new THREE.Scene();
        this.scene = scene;

        // 3. Clock
        const clock = new THREE.Clock();
        this.clock = clock;

        // 4. Camera
        let camera = new THREE.PerspectiveCamera(20, div.getBoundingClientRect().width / div.getBoundingClientRect().height, 0.1, 1000);
        camera.position.z = 20;
        this.camera = camera;

        // 5. Renderer
        let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(div.getBoundingClientRect().width, div.getBoundingClientRect().height);
        div.appendChild(renderer.domElement);
        this.renderer = renderer;

        let cssRenderer = new CSS3DRenderer();
        cssRenderer.setSize(cssDiv.getBoundingClientRect().width, cssDiv.getBoundingClientRect().height);
        cssDiv.appendChild(cssRenderer.domElement);
        this.cssRenderer = cssRenderer;

        // 6. Meshes

        // 7. Lights
        let ambientLight = new THREE.AmbientLight(0xffffff, 3);
        scene.add(ambientLight);
        this.ambientLight = ambientLight;

        let light = new THREE.PointLight(0xffffff, 200, 50);
        light.position.set(0, 5, 0);
        scene.add(light);
        this.light = light;

        // 8. Event Listeners
        let mouse = new THREE.Vector2();
        let raycaster = new THREE.Raycaster();

        window.addEventListener('resize', () => {
            camera.aspect = div.getBoundingClientRect().width / div.getBoundingClientRect().height;
            camera.updateProjectionMatrix();
            renderer.setSize(div.getBoundingClientRect().width, div.getBoundingClientRect().height);
            cssRenderer.setSize(cssDiv.getBoundingClientRect().width, cssDiv.getBoundingClientRect().height);
        });

        window.addEventListener('click', () => {
            let intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0 && currentObject != null) listenerFuncMapClick.get(currentObject.mainMesh.uuid)();
            else {
                listenerFuncListClick.forEach(func => {
                    func();
                });
            }
        });

        window.addEventListener('mousemove', (event) => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const currentX = (event.clientX / screenWidth) * 2 - 1;
            const currentY = -((event.clientY / screenHeight) * 2 - 1);
            listenerFuncListMouseMove.forEach(func => {
                func(currentX, currentY);
            });

            mouse.x = currentX;
            mouse.y = currentY;

            // update the start point and direction of the ray
            raycaster.setFromCamera(mouse, camera);

            // detect intersection of ray and object
            let intersects = raycaster.intersectObjects(interactiveMeshes, true);

            if (intersects.length > 0) {
                // prevent the program from not executing notHover() when intersects.length > 0
                if (currentObject != null)  listenerFuncMapNotMouseOver.get(currentObject.mainMesh.uuid)();

                for (const key in altairObjectList) {
                    if (findRoot(intersects[0].object, altairObjectList[key].mainMesh)) {
                        currentObject = altairObjectList[key];
                        if (altairObjectList[key].objectType != 'click-tracking' && altairObjectList[key].objectType != 'input' && altairObjectList[key].objectType != 'cursor-trail') document.body.style.cursor = 'pointer';
                        else document.body.style.cursor = 'auto';

                        listenerFuncMapMouseOver.get(currentObject.mainMesh.uuid)();

                        break;
                    }
                    else {
                        if (currentObject != null) listenerFuncMapNotMouseOver.get(currentObject.mainMesh.uuid)();
                        document.body.style.cursor = 'auto';
                    }
                }
            }
            else {
                if (currentObject != null)  listenerFuncMapNotMouseOver.get(currentObject.mainMesh.uuid)();
                document.body.style.cursor = 'auto';
            }
        });

        // 9. Orbit Controls
        const controls = new OrbitControls(camera, cssRenderer.domElement);
        this.controls = controls;

        // 10. Animation
        function animate() {
            animateFuncList.forEach(func => {
                func();
            });

            light.position.x = Math.sin(Date.now() * 0.00025) * 10;
            light.position.z = Math.abs(Math.cos(Date.now() * 0.00025)) * 10;

            controls.update();

            renderer.render(scene, camera);
            cssRenderer.render(scene, camera);

            requestAnimationFrame(animate);
        }
        animate();

        // 11. Functions
        function findRoot(object, root) {
            let o = object;
            while (o && o !== root) {
                o = o.parent;
            }
            return o === root;
        }
    }

    loadEnvironment(hdrPath, rotationX, rotationY, rotationZ) {
        return new Promise((resolve, reject) => {
            new RGBELoader().load(
                hdrPath,
                (hdr) => {
                    hdr.mapping = THREE.EquirectangularReflectionMapping;
                    
                    this.scene.environment = hdr;
                    this.scene.background = hdr;
                    this.scene.environmentRotation.set(rotationX, rotationY, rotationZ);
                    this.scene.backgroundRotation.set(rotationX, rotationY, rotationZ);

                    resolve(hdr);
                },
                undefined,
                (err) => reject(err)
            );
        });
    }

    async create(altairObject) {
        if (altairObject.objectType === "object-type") {
            console.error(`ERROR : you forgot to change ${ altairObject.constructor.name }.objectType after copying from base-template!`);
            return;
        }

        const VALID_TYPES = new Set(["button", "click-tracking", "cursor-trail", "movie"]);
        if (!VALID_TYPES.has(altairObject.objectType)) {
            console.error(`ERROR : ${ altairObject.constructor.name }.objectType not valid!`);
            return;
        }

        this.altairObjectList.push(altairObject);

        const meshes = await altairObject.getMeshes();
        let mainMeshUuid = meshes.mainMesh?.uuid;
        //console.log(meshes);
        if (meshes) {
            Object.values(meshes).forEach(mesh => {
                this.scene.add(mesh);
            });
        }
        if (meshes?.mainMesh) {
            this.interactiveMeshes.push(meshes.mainMesh);
        }

        this.animateFuncList.push(altairObject.getAnimateFunc());

        if (altairObject.objectType === "button" || altairObject.objectType === "movie") {
            this.listenerFuncMapClick.set(mainMeshUuid, altairObject.getListenerFunc("click"));
        }
        else {
            this.listenerFuncListClick.push(altairObject.getListenerFunc("click"));
        }
        this.listenerFuncListMouseMove.push(altairObject.getListenerFunc("mousemove"));
        if (altairObject.objectType === "button" || altairObject.objectType === "movie") this.listenerFuncMapMouseOver.set(mainMeshUuid, altairObject.getListenerFunc("mouseover"));
        if (altairObject.objectType === "button" || altairObject.objectType === "movie") this.listenerFuncMapNotMouseOver.set(mainMeshUuid, altairObject.getListenerFunc("notmouseover"));
    }
}