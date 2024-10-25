# Amol-JS

![logo](https://github.com/zzztzzzt/Amol-JS/blob/main/real-showcase.png)

IMPORTANT : This project is still in the development and testing stages. Any form of use is not allowed. We are not responsible for any property damage or legal issues caused by the use of this project.

Amol-JS uses Three.js for 3D graphics rendering. Three.js licensed under the MIT License.  
Three.js License : [https://github.com/mrdoob/three.js/blob/dev/LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE)

## How To Use
1. Install Node.js.

2. Install Three.js and Vite using terminal in your project folder.
```cmd

npm install --save three

```
```cmd

npm install --save-dev vite

```

**For quick use** just run "npx vite" in terminal and then open the URL that Vite gives you, **ignore the 3. 4. 5. 6. step below**.
```cmd

npx vite

```

### Use in other project (for quick use ignore this)
3. Put "amol.js" and "AMOL3DUI folder" into your project folder.

4. Create "index.html" and your JS files.

5. Open terminal in your project folder and run :
```cmd

npx vite

```

6. You'll see a URL in your terminal. You can open this URL in your browser.

## Usage Example

```javascript

// 1.Put "amol.js" and "AMOL3DUI folder" into your project folder
import * as AMOL from './amol';

// effects
const cursorTrail = AMOL.create('amol-cursor-trail-vanilla', 1);
const clickTracking = AMOL.create('amol-click-tracking-vanilla', 0);

// input element
const myInput = AMOL.create('amol-input-thunder', 0);
myInput.setScale( 0.72 );
myInput.setPosition( -1, 0, 0 );

setInterval(() => {
    console.log(`Hello : ${ myInput.getValue() }`);
}, 500);

// button element, with simple animate control
const myButton = AMOL.create('amol-button-thunder', 0);
let direction = 1;
let currentX = 2;
let currentY = 0;
setInterval(() => {
    myButton.setPosition( currentX, currentY, -2 );
    if (currentX >= 4) direction = -1;
    if (currentX <= 2.5) direction = 1;
    currentX += 0.003 * direction;
}, 10);

myButton.setListener('click', () => { console.log('You click !'); });
myButton.setListener('hover', () => { console.log('You hover !'); });

// 2.Don't forget to use Animate Function at the end
AMOL.animate();

```

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

![1.0logo](https://github.com/zzztzzzt/Amol-JS/blob/main/real-showcase.png)
