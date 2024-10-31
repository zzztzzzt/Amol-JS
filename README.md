# Amol-JS

![1.2logo](https://github.com/zzztzzzt/Amol-JS/blob/main/logo/real-showcase-three.png)

IMPORTANT : This project is still in the development and testing stages. Any form of use is not allowed. We are not responsible for any property damage or legal issues caused by the use of this project.

Amol-JS uses Three.js for 3D graphics rendering. Three.js licensed under the MIT License.  
Three.js License : [https://github.com/mrdoob/three.js/blob/dev/LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE)

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

3. Run "npx vite" in terminal and then open the URL that Vite gives you.
```cmd

npx vite

```

## Example Code

```javascript

import * as AMOL from './amol';

const myEffect = AMOL.create('amol-cursor-trail-ripple', 1);

const btn1 = AMOL.create('amol-button-thunder', 0, 'none');
btn1.setPosition(1.8, -1.8, 0);
btn1.setScale(1.2);
let nextMove = 'up';
btn1.setListener('click', () => {
    if (nextMove == 'up') {
        btn1.setPosition(1.8, 1.8, 0);
        nextMove = 'down';
    }
    else {
        btn1.setPosition(1.8, -1.8, 0);
        nextMove = 'up';
    }
});

AMOL.animate();

const myScene = AMOL.virtualScene(2, 400, 400, 0, 22);

const btn2 = myScene.create('amol-button-vanilla', 0);
btn2.setScale(1.5);
let nextStatus = 'go';
btn2.setListener('click', () => {
    if (nextStatus == 'go') {
        AMOL.cameraSpeed(0, 0, -0.1);
        setTimeout(() => { AMOL.stopCamera(); }, 1000);
        nextStatus = 'back';
    }
    else {
        AMOL.cameraSpeed(0, 0, 0.1);
        AMOL.stopCameraAt(0, 0, 20);
        nextStatus = 'go';
    }
});

myScene.animate();

```

## Use in Other Project ( for quick use ignore this )
1. Install Node.js and git clone this project.

2. Install Three.js and Vite using terminal in your project folder.
```cmd

npm install --save three

```
```cmd

npm install --save-dev vite

```

3. Put "amol.js" and "AMOL3DUI folder" into your project folder.

4. Create "index.html" and your JS files.

5. Open terminal in your project folder and run :
```cmd

npx vite

```

6. You'll see a URL in your terminal. You can open this URL in your browser.

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

### The Art Versions we currently provide :
amol-button-vanilla  
amol-button-golden  
amol-button-thunder  
amol-button-ripple  

amol-click-tracking-vanilla  
amol-click-tracking-golden  

amol-input-vanilla  
amol-input-golden  
amol-input-thunder  

amol-cursor-trail-vanilla  
amol-cursor-trail-golden  
amol-cursor-trail-ripple  

## Old Versions

![1.0logo](https://github.com/zzztzzzt/Amol-JS/blob/main/logo/real-showcase.png)

![1.1logo](https://github.com/zzztzzzt/Amol-JS/blob/main/logo/real-showcase-two.png)
