# Amol-JS
<br>
<img src="https://github.com/zzztzzzt/Amol-JS/blob/main/logo/logo.png" alt="amol-logo" style="width: 300px; min-height: 187px;" />

### Amol-JS is a package for creating 3D UI animations and effects.

IMPORTANT : This project is still in the development and testing stages. Any form of use is not allowed. We are not responsible for any property damage or legal issues caused by the use of this project.

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

3. Run "npx vite" in terminal and then open the URL that Vite gives you.
```cmd

npx vite

```

## Example Code

```javascript

const basicScene = AMOL.setup.jsVer("three-area", "three-area-css");
//basicScene.status();

let colorCounter = 0;

const trackingOne = new AMOL.ClickTrackingStellar();
//trackingOne.status();
basicScene.create(trackingOne);
const changeTrackingColor = () => {
  trackingOne.colorSet(colorCounter % 2);
};

const cursorOne = new AMOL.CursorTrailStellar;
//cursorOne.status();
basicScene.create(cursorOne);
const changeCubeColor = () => {
  cursorOne.colorSet(colorCounter % 2);
};

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

### Tools ( Beta ) : 
AMOL.setup.jsVer("div-id-for-threejs", "div-id-for-threejs-css3d")

new AMOL.3DObjectOrEffects()
( example : new AMOL.ClickTrackingStellar() )


### Art Versions :
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

### Art Versions ( Beta ) :
AMOL.ClickTrackingStellar  
AMOL.CursorTrailStellar  

## History

#### V 1.3 - more beautiful 3D interactions. (2025.07)
![1.3showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-four.webp)

#### V 1.2 - now can add GLB files. (2024.11)
![1.2showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-three.webp)

#### V 1.1 - now can be mixed with 2D web design. (2024.10)
![1.1showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase-two.webp)

#### V 1.0 - AMOL.js was founded. (2024.09)
![1.0showcase](https://github.com/zzztzzzt/Amol-JS/blob/main/showcase/real-showcase.webp)
