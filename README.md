# Amol-JS
<br>
<img src="https://github.com/zzztzzzt/Amol-JS/blob/main/logo/logo.png" alt="amol-logo" style="width: 300px; min-height: 187px;" />

### Amol-JS is a package for creating 3D UI animations and effects.

IMPORTANT : This project is still in the development and testing stages, licensing terms may be updated in the future.

Amol-JS uses Three.js for 3D graphics rendering. Three.js licensed under the MIT License.  
Three.js License : [https://github.com/mrdoob/three.js/blob/dev/LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE)  
<br>

![1.3showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-four.webp)
<br><br>

## How To Use

### Quick Use - No Need Coding !
1. Install Node.js and git clone this project.

2. Install Three.js and Vite using terminal in this project folder.
```cmd

npm install --save three

```
```cmd

npm install --save-dev vite

```

3. Run `npx vite` in terminal and then open the URL that Vite gives you.
```cmd

npx vite

```

4. You'll see a URL in your terminal. You can open this URL in your browser.

## Example Code

```javascript

import * as AMOL from "./amol-beta";


const basicScene = AMOL.setup.jsVer("three-area", "three-area-css");

const envMap = await basicScene.loadEnvironment('/AMOL3D/UI/hdr/example_puresky_1k.hdr', 0, Math.PI * 5 / 9, 0);

const ocean = new AMOL.MovieWater(basicScene, envMap);
basicScene.create(ocean);

const ruin1 = new AMOL.MovieRuinOne();
ruin1.scaleSet(13, 13, 13);
ruin1.positionSet(8, -3.5, -50);
ruin1.rotationSet(0, Math.PI / 12, 0);

basicScene.create(ruin1);

```

## Embed Amol-JS to your project ( for quick use ignore this )
1. Install Node.js and git clone this project.

2. Install Three.js and Vite using terminal in your project folder.
```cmd

npm install --save three

```
```cmd

npm install --save-dev vite

```

3. Put `amol-beta.js` and `AMOL3D folder` into your project folder.

4. import Amol-JS to your javascript : `import * as AMOL from "./amol-beta";`

## All Tools
AMOL.create(3D-object-Name, color-type, view-offset)  
getValue()  
setListener(event, function)  
setPosition(position-X, position-Y, position-Z)  
setScale(scale)  
removeSelf()  

AMOL.animate()  
AMOL.cameraSpeed(speed-X, speed-Y, speed-Z)  
AMOL.stopCamera()  
AMOL.stopCameraAt(position-X, position-Y, position-Z)  
AMOL.virtualScene(z-index, width, height, top, left)  
AMOL.movie(Movie-Name, z-index, width, height, top, left)  

### Tools ( Beta ) : 
AMOL.setup.jsVer("div-id-for-threejs", "div-id-for-threejs-css3d")

new AMOL.3DObjectOrEffects()
( example : new AMOL.ClickTrackingStellar() )

## History

#### V 1.3 - more beautiful 3D interactions. (2025.07)
![1.3showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-four.webp)

#### V 1.2 - now can add GLB files. (2024.11)
![1.2showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-three.webp)

#### V 1.1 - now can be mixed with 2D web design. (2024.10)
![1.1showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-two.webp)

#### V 1.0 - AMOL.js was founded. (2024.09)
![1.0showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase.webp)
