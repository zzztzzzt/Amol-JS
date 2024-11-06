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

// cameraSpeedRotate() and stopCameraRotate() can only run in movie scene currently.
import * as AMOL from './amol';

const CameraStatus = {
    GO: 'go',
    BACK: 'back',
};
let cameraStatus = CameraStatus.GO;

const myMovie = AMOL.movie('forgotten', -1, window.innerWidth, window.innerHeight, 0, 0);

const adjustCamera = (speedX, speedY, speedZ, rotateX, rotateY, rotateZ, newStatus, delay = 3000) => {
    myMovie.cameraSpeed(speedX, speedY, speedZ);
    myMovie.cameraSpeedRotate(rotateX, rotateY, rotateZ);

    // use RequestAnimationFrame replaces SetTimeout( () => {}, 3000 )
    const startTime = performance.now();
    const animate = (time) => {
        if (time - startTime >= delay) {
            myMovie.stopCamera();
            myMovie.stopCameraRotate();
            cameraStatus = newStatus;
            cancelAnimationFrame(animate);
        }
        else {
            requestAnimationFrame(animate);
        }
    };
    requestAnimationFrame(animate);
};

const myButton = myMovie.create('amol-button-golden', 0);
myButton.setPosition(2.5, -1, -3);
myButton.setListener("click", () => {
    if (cameraStatus === CameraStatus.GO) {
        adjustCamera(0.04, 0, -0.06, 0, 0.004, 0, CameraStatus.BACK);
    }
});

const myButton2 = myMovie.create('amol-button-golden', 0);
myButton2.setPosition(-2.5, -1, -3);
myButton2.setListener("click", () => {
    if (cameraStatus === CameraStatus.BACK) {
        adjustCamera(-0.04, 0, 0.06, 0, -0.004, 0, CameraStatus.GO);
    }
});

myMovie.animate();

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

amol-movie-forgotten  

## Old Versions 1.1
![1.1logo](https://github.com/zzztzzzt/Amol-JS/blob/main/logo/real-showcase-two.png)

## Old Versions 1.0
![1.0logo](https://github.com/zzztzzzt/Amol-JS/blob/main/logo/real-showcase.png)
