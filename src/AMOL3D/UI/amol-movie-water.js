import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

export class MovieWater {
    constructor(amolScene, hdrTexture, color = 0) {
        // 1. Variables
        this.objectType = 'movie';

        let colorTypeOne = {};
        let colorTypeTwo = {};
        let colorCustom = {};
        this.colorTypeList = [colorTypeOne, colorTypeTwo, colorCustom];

        // generate CubeCamera to make real-time water reflection
        this.scene = amolScene.scene;
        this.renderer = amolScene.renderer;

        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1536, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
            magFilter: THREE.LinearFilter
        });

        this.cubeCamera = new THREE.CubeCamera(0.1, 5000, cubeRenderTarget);
        // used to crop reflections below the water surface
        this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        // 2. Mesh
        hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
        hdrTexture.colorSpace = THREE.NoColorSpace;
        hdrTexture.needsUpdate = true;

        const uniforms = {
            uDispMap0: { value: null },
            uDispMap1: { value: null },
            uMix: { value: 0.0 },
            uHeight: { value: 2.0 },
        
            uLightDir: { value: amolScene.light.position.clone().normalize() },
            uCameraPos: { value: amolScene.camera.position.clone() },
        
            uEnvMap: { value: hdrTexture },
            uDynamicEnvMap: { value: cubeRenderTarget.texture },
            uReflectionMix: { value: 0.7 }, // controlling the blending ratio of static HDR vs dynamic reflections

            uEnvRotation: { value: Math.PI * 5 / 9 }
        };

        const vertexShader = /* glsl */`
        varying vec2 vUv;
        varying float vHeight;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        uniform sampler2D uDispMap0;
        uniform sampler2D uDispMap1;
        uniform float uMix;
        uniform float uHeight;

        void main() {
            vUv = uv;

            float h0 = texture2D(uDispMap0, uv).r;
            float h1 = texture2D(uDispMap1, uv).r;
            float h  = mix(h0, h1, uMix);

            vHeight = h;

            vec3 pos = position;
            pos.y += h * uHeight;

            vPosition = pos;
            vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
        `;

        const fragmentShader = /* glsl */`
        precision highp float;

        uniform vec3 uLightDir;
        uniform vec3 uCameraPos;
        uniform float uHeight;
        uniform sampler2D uEnvMap;
        uniform samplerCube uDynamicEnvMap;
        uniform float uReflectionMix;

        varying float vHeight;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        const float PI = 3.14159265359;

        uniform float uEnvRotation;

        vec2 dirToEquirectUV(vec3 dir) {
            float cosA = cos(uEnvRotation);
            float sinA = sin(uEnvRotation);
            
            vec3 rotatedDir;
            rotatedDir.x = dir.x * cosA - dir.z * sinA;
            rotatedDir.y = dir.y;
            rotatedDir.z = dir.x * sinA + dir.z * cosA;
            
            vec2 uv;
            uv.x = atan(rotatedDir.z, rotatedDir.x) / (2.0 * PI) + 0.5;
            uv.y = asin(clamp(rotatedDir.y, -1.0, 1.0)) / PI + 0.5;
            return uv;
        }

        void main() {

            // ===== Normal (From displacement)
            float dx = dFdx(vHeight);
            float dy = dFdy(vHeight);
            vec3 normal = normalize(vec3(-dx * uHeight, 1.0, -dy * uHeight));

            // ===== View / Light
            vec3 viewDir = normalize(uCameraPos - vWorldPosition);
            vec3 lightDir = normalize(uLightDir);

            // ===== Diffuse
            float diffuse = max(dot(normal, lightDir), 0.0);

            // ===== Specular
            vec3 halfDir = normalize(lightDir + viewDir);
            float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);

            // ===== Fresnel
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

            // ===== Environment Reflection
            vec3 reflectDir = reflect(-viewDir, normal);
            
            // ===== Static HDR Reflection
            vec2 envUV = dirToEquirectUV(reflectDir);
            vec3 staticEnvColor = texture2D(uEnvMap, envUV).rgb;
            
            // ===== Dynamic Scene Reflection
            vec3 dynamicEnvColor = textureCube(uDynamicEnvMap, reflectDir).rgb;
            
            // ===== Mixed Static And Dynamic Reflections
            vec3 envColor = mix(staticEnvColor, dynamicEnvColor, uReflectionMix);

            // ===== Water Color
            vec3 waterColor = vec3(0.0, 0.35, 0.6);
            vec3 baseColor = waterColor * (0.4 + diffuse * 0.6);

            // ===== Mix Reflection
            vec3 color = mix(baseColor, envColor, fresnel * 0.8)
                    + vec3(1.0) * spec * 0.3;

            gl_FragColor = vec4(color, 1.0);
        }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            wireframe: false
        });
        this.material = material;

        const geometry = new THREE.PlaneGeometry(
            200, 200,
            200, 200
        );
        geometry.rotateX(-Math.PI / 2);

        const ocean = new THREE.Mesh(geometry, material);
        ocean.position.y -= 4.5;
        this.mainMesh = ocean;
        // override the raycast method to prevent Raycaster from detecting the Mesh
        ocean.raycast = function (raycaster, intersects) {
            // return directly without doing any operation, preventing Raycaster from detecting
        };

        // 3. Light

        // 4. Event Listener
        this.whenMouseOver = () => {};

        this.notMouseOver = () => {};

        this.whenClick = () => {};

        this.whenMouseMove = (x, y) => {};

        this.customizeWhenMouseOver = () => {};

        this.customizeNotMouseOver = () => {};

        this.customizeWhenClick = () => {};

        // 5. Animate
        const FRAME_COUNT = 240;
        const FPS = 24;

        const dispTextures = [];
        const exrLoader = new EXRLoader();

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const index = String(i).padStart(4, '0');
            const url = `./src/AMOL3D/UI/textures/ocean/disp_${index}.exr`;

            exrLoader.load(url, (tex) => {
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                tex.colorSpace = THREE.NoColorSpace;

                dispTextures[i - 1] = tex;
            });
        }

        let frameCount = 0;
        const UPDATE_EVERY = 1;

        const clock = new THREE.Clock();

        this.animateFunc = () => {
            const t = clock.getElapsedTime() * FPS;

            const max = FRAME_COUNT - 1;
            const cycle = max * 2;

            // triangle-wave ping-pong
            const f = max - Math.abs((t % cycle) - max);

            const i0 = Math.floor(f);
            const i1 = Math.min(i0 + 1, max);
            const mix = f - i0;

            if (dispTextures[i0] && dispTextures[i1]) {
                uniforms.uDispMap0.value = dispTextures[i0];
                uniforms.uDispMap1.value = dispTextures[i1];
                uniforms.uMix.value = mix;
            }

            uniforms.uCameraPos.value.copy(amolScene.camera.position);

            // update CubeCamera to capture instant reflections
            if (this.scene && this.renderer) {
                this.cubeCamera.position.x = amolScene.camera.position.x;
                this.cubeCamera.position.z = amolScene.camera.position.z;

                // calculate the camera's height relative to the water surface, then mirror it below the water surface
                const waterY = this.mainMesh.position.y;
                const cameraHeightAboveWater = amolScene.camera.position.y - waterY;
                this.cubeCamera.position.y = waterY - cameraHeightAboveWater;

                // Temporarily hide water surface, to avoid reflecting itself
                this.mainMesh.visible = false;
                
                // update cube texture
                if (frameCount % UPDATE_EVERY === 0) {
                    this.mainMesh.visible = false;
                    
                    // only render the part above the water surface
                    this.clippingPlane.constant = -waterY;
                    this.renderer.clippingPlanes = [this.clippingPlane];
                    this.renderer.localClippingEnabled = true;
                    
                    this.cubeCamera.update(this.renderer, this.scene);
                    
                    // close clipping planes
                    this.renderer.clippingPlanes = [];
                    this.renderer.localClippingEnabled = false;
                    
                    this.mainMesh.visible = true;
                }
                frameCount++;
                
                this.mainMesh.visible = true;
            }
        };

        // 6. Functions
    }

    async getMeshes() {
        return {
            mainMesh: this.mainMesh,
        };
    }

    getAnimateFunc() {
        return this.animateFunc;
    }

    getListenerFunc(listenerType) {
        if (listenerType === "click") {
            return this.whenClick;
        }
        if (listenerType === "mousemove") {
            return this.whenMouseMove;
        }
        if (listenerType === "mouseover") {
            return this.whenMouseOver;
        }
        if (listenerType === "notmouseover") {
            return this.notMouseOver;
        }
    }

    colorSet(color) {}

    positionSet(x, y, z) {}
}