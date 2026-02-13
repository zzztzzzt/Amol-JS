# Altair-JS

![GitHub last commit](https://img.shields.io/github/last-commit/zzztzzzt/Altair-JS.svg)
![CodeQL](https://github.com/zzztzzzt/Altair-JS/actions/workflows/codeql.yml/badge.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/zzztzzzt/Altair-JS.svg)
[![codecov](https://codecov.io/github/zzztzzzt/Altair-JS/branch/main/graph/badge.svg?token=K607N4E6EZ)](https://codecov.io/github/zzztzzzt/Altair-JS)
[![Lyra](https://img.shields.io/badge/Designed_with-Lyra-FFC6EC?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEzMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTMwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iNzUiIHk9Ijc1IiB3aWR0aD0iNjUwIiBoZWlnaHQ9IjExNTAiIHN0cm9rZT0idXJsKCNwYWludDBfbGluZWFyXzIxNjVfNykiIHN0cm9rZS13aWR0aD0iMTUwIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjE2NV83IiB4MT0iNDAwIiB5MT0iMCIgeDI9IjQwMCIgeTI9IjEzMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0JCRkZFRCIvPgo8c3RvcCBvZmZzZXQ9IjAuNjk3MTE1IiBzdG9wLWNvbG9yPSIjRkZFQ0Y0Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+)](https://github.com/zzztzzzt/Lyra-AI)

<br>

<img src="https://github.com/zzztzzzt/Altair-JS/blob/main/logo/logo.png" alt="altair-logo" style="height: 280px; width: auto;" />

### Altair-JS is a package for creating 3D UI Interaction & Beautiful 3D Scene.

IMPORTANT : This project is still in the development and testing stages, licensing terms may be updated in the future. Please don't do any commercial usage currently.

## Project Dependencies Guide

![three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![vitest](https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

Altair-JS uses Three.js for 3D graphics rendering, Vite for development and bundling, and Vitest for unit testing. Three.js, Vite & Vitest licensed under the MIT License.

![1.3showcase](https://github.com/zzztzzzt/Altair-JS/blob/main/showcase/real-showcase-four.webp)
<br><br>

## Installation

### Quick Start - No Need Coding !
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

### Embed Altair-JS to your project ( for quick use ignore this )
1. Install Node.js and git clone this project.

2. Install Three.js using terminal in your project folder.
```cmd
npm install three
```

3. Put `altair-beta.js` and `ALTAIR3D folder` into your project folder.

4. Import Altair-JS to your javascript / Three-js code
```javascript
import * as ALTAIR from "./altair-beta";
```

5. For detail usage please see below steps.

## How To Use

### ( for pure Three.js usage, jump to next step )

### 1. create basic 3D Space
add 2 `div`, one for 3D render and one for CSS3D
```html
<div id="three-area"></div>
<div id="three-area-css"></div>
```
setup basic scene in javascript
```javascript
import * as ALTAIR from "./altair-beta";
const basicScene = ALTAIR.setup.jsVer("three-area", "three-area-css");
```

### 2. add 3D UI Conponent
```javascript
const movieRuin = new ALTAIR.MovieRuinOne();
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
### 1. import Altair-JS & new a 3D UI Component
```javascript
import * as ALTAIR from "./altair-beta";
const movieRuin = new ALTAIR.MovieRuinOne();
```

### 2. add Components to your Three.js scene
```javascript
// get all meshes ( JS object format )
const meshes = await movieRuin.getMeshes();
Object.values(meshes).forEach(mesh => {
    scene.add(mesh);
});
```

### 3. add component's animations to your Three.js code
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

## Example Code

```javascript
import * as ALTAIR from "./altair-beta";

const basicScene = ALTAIR.setup.jsVer("three-area", "three-area-css");

const envMap = await basicScene.loadEnvironment('/ALTAIR3D/UI/hdr/example_puresky_1k.hdr', 0, Math.PI * 5 / 9, 0);

const ocean = new ALTAIR.MovieWater(basicScene, envMap);
basicScene.create(ocean);

const movieObjOne = new ALTAIR.MovieRuinOne();
movieObjOne.scaleSet(13, 13, 13);
movieObjOne.positionSet(8, -3.5, -50);
movieObjOne.rotationSet(0, Math.PI / 12, 0);

basicScene.create(movieObjOne);
```

## Version History

#### V 1.3 (2025.07) - A consolidation of previous features. An expanded library of pre-built 3D UI components & Animations for faster development.
![1.3showcase](https://github.com/zzztzzzt/Altair-JS/blob/main/showcase/real-showcase-four.webp?v=2)

#### V 1.2 (2024.11) - GLB/glTF Support. A modular template system that allows developers to deploy GLB-based UI components and environments instantly.
![1.2showcase](https://github.com/zzztzzzt/Altair-JS/blob/main/showcase/real-showcase-three.webp?v=2)

#### V 1.1 (2024.10) - Layered Web Design Support, Multi-Scene Architecture, can mixed with 2D elements via z-index. Native Responsive Handling.
![1.1showcase](https://github.com/zzztzzzt/Altair-JS/blob/main/showcase/real-showcase-two.webp)

#### V 1.0 (2024.09) - The start of ALTAIR.js Project. High-level Three.js Wrapper, support hybrid development with Three.js. Intuitive method for 3D Scene & UI component creation.
![1.0showcase](https://github.com/zzztzzzt/Altair-JS/blob/main/showcase/real-showcase.webp)

## Project Dependencies Details

Three.js License : [https://github.com/mrdoob/three.js/blob/dev/LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE)
<br>

Vite License : [https://github.com/vitejs/vite/blob/main/LICENSE](https://github.com/vitejs/vite/blob/main/LICENSE)
<br>

Vitest License : [https://github.com/vitest-dev/vitest/blob/main/LICENSE](https://github.com/vitest-dev/vitest/blob/main/LICENSE)