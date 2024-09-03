# Amol-JS

![logo](https://github.com/zzztzzzt/Amol-JS/blob/main/real-showcase.png)

IMPORTANT : This project is still in the development and testing stages. The code may cause unknown risks and any form of use is not allowed. We are not responsible for any property damage or legal issues caused by the use of this project.

Amol-JS uses Three.js for 3D graphics rendering. Three.js licensed under the MIT License.  
Three.js License : [https://github.com/mrdoob/three.js/blob/dev/LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE)

## Usage Example

```javascript

// 1.Put "amol.js" and "AMOL3DUI folders" into your project folder
import * as AMOL from './amol';

const colorType = 1;
const colorTypeTwo = 0;

// effects
AMOL.create('effect', 'amol-cursor-trail-vanilla', colorType);
AMOL.create('effect2', 'amol-click-tracking-vanilla', colorType);

// UI elements
AMOL.create('myEle-one', 'amol-button-vanilla', colorType);
AMOL.setScale('myEle-one', 0.8);
AMOL.setPosition('myEle-one', -2, 0, 0);

AMOL.create('myEle-two', 'amol-input-golden', colorTypeTwo);
AMOL.setPosition('myEle-two', 2, 0, -2);

// event listener
function onClick() { console.log("You Click!"); }
function onHover() { console.log("You Hover!"); }
AMOL.setListener('myEle-one', 'click', onClick);
AMOL.setListener('myEle-one', 'hover', onHover);

// get input value
setInterval(() => {
    console.log( AMOL.getValue('myEle-two') );
}, 500);

// 2.Don't forget to use Animate Function at the end
AMOL.animate();

```
