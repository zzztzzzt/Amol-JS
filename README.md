# Amol-JS
<br>
<img src="https://github.com/zzztzzzt/Amol-JS/blob/main/logo/logo.png" alt="amol-logo" style="width: 300px; min-height: 187px;" />

### Amol-JS is a package for creating 3D UI Interaction & Beautiful 3D Scene.

IMPORTANT : This project is still in the development and testing stages, licensing terms may be updated in the future. Please don't do any commercial usage currently.

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

npm install three

```
```cmd

npm install --save-dev vite

```

3. Run `npx vite` in terminal and then open the URL that Vite gives you.
```cmd

npx vite

```

4. You'll see a URL in your terminal. You can open this URL in your browser.

### Embed Amol-JS to your project ( for quick use ignore this )
1. Install Node.js and git clone this project.

2. Install Three.js using terminal in your project folder.
```cmd

npm install three

```

3. Put `amol-beta.js` and `AMOL3D folder` into your project folder.

4. import Amol-JS to your javascript / Three-js code
```javascript

import * as AMOL from "./amol-beta";

```

5. for detail usage please see below steps.

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

## API Usage & Tools ( for pure Three.js usage, jump to next step )
### 1. create basic 3D Space
add 2 `div`, one for 3D render and one for CSS3D
```html

<div id="three-area"></div>
<div id="three-area-css"></div>

```
setup basic scene in javascript
```javascript

import * as AMOL from "./amol-beta";
const basicScene = AMOL.setup.jsVer("three-area", "three-area-css");

```

### 2. add 3D UI Conponent
```javascript

const movieRuin = new AMOL.MovieRuinOne();
basicScene.create(movieRuin);

```

### 3. set the 3D UI Components position, rotation & scaling
```javascript

ruin1.scaleSet(13, 13, 13);
ruin1.positionSet(8, -3.5, -50);
ruin1.rotationSet(0, Math.PI / 12, 0);

```
( wip : color-setting & clean self-removing )

## Directly use with Three.js ( for API usage ignore this )
### 1. import Amol-JS & new a 3D UI Component
```javascript

import * as AMOL from "./amol-beta";
const movieRuin = new AMOL.MovieRuinOne();

```

### 2. add Components to your Three.js scene
```javascript

// get all meshes ( JS object format )
const meshes = await movieRuin.getMeshes();
Object.values(meshes).forEach(mesh => {
    scene.add(mesh);
});

```

### 3. add their anmations to your Three.js code
```javascript

// add this to animate function
const animateFunc = movieRuin.getAnimateFunc();

// add these to your Event Listener
// please setup Three.js RayCaster first, to judge the mouse intersects
const clickAnimate = movieRuin.getListenerFunc("click");
const mouseInAnimate = movieRuin.getListenerFunc("mouseover");
const mouseOutAnimate = movieRuin.getListenerFunc("notmouseover");
const mouseMoveAnimate = movieRuin.getListenerFunc("mousemove");

```

## Version History

#### V 1.3 - more beautiful 3D interactions. (2025.07)
![1.3showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-four.webp)

#### V 1.2 - now can add GLB files. (2024.11)
![1.2showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-three.webp)

#### V 1.1 - now can be mixed with 2D web design. (2024.10)
![1.1showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-two.webp)

#### V 1.0 - AMOL.js was founded. (2024.09)
![1.0showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase.webp)
