import { addObject, removeObject, returnValue, addListener, removeListener, addPosition, addScale, animateAll, cameraSpeed, stopCamera, stopCameraAt } from './AMOL3DUI/legacy/amol-default-setup';
import { AdditionalScene } from './AMOL3DUI/legacy/amol-additional-scene';
import { AmolButtonGolden } from './AMOL3DUI/legacy/UI/amol-button-golden';
import { AmolClickTrackingGolden } from './AMOL3DUI/legacy/UI/amol-click-tracking-golden';
import { AmolInputGolden } from './AMOL3DUI/legacy/UI/amol-input-golden';
import { AmolCursorTrailGolden } from './AMOL3DUI/legacy/UI/amol-cursor-trail-golden';
import { AmolButtonVanilla } from './AMOL3DUI/legacy/UI/amol-button-vanilla';
import { AmolClickTrackingVanilla } from './AMOL3DUI/legacy/UI/amol-click-tracking-vanilla';
import { AmolInputVanilla } from './AMOL3DUI/legacy/UI/amol-input-vanilla';
import { AmolCursorTrailVanilla } from './AMOL3DUI/legacy/UI/amol-cursor-trail-vanilla';
import { AmolButtonThunder } from './AMOL3DUI/legacy/UI/amol-button-thunder';
import { AmolInputThunder } from './AMOL3DUI/legacy/UI/amol-input-thunder';
import { AmolButtonRipple } from './AMOL3DUI/legacy/UI/amol-button-ripple';
import { AmolCursorTrailRipple } from './AMOL3DUI/legacy/UI/amol-cursor-trail-ripple';
import { MovieForgotten } from './AMOL3DUI/legacy/amol-movie-forgotten';

/*
All Tools :
AMOL.create(3D-object-Name, color-type, view-offset)
.getValue()
.setListener(event, function)
.setPosition(position-X, position-Y, position-Z)
.setScale(scale)
.removeSelf()

AMOL.animate()
AMOL.cameraSpeed(speed-X, speed-Y, speed-Z)
AMOL.stopCamera()
AMOL.stopCameraAt(position-X, position-Y, position-Z)
AMOL.virtualScene(z-index, width, height, top, left)
AMOL.movie(Movie-Name, z-index, width, height, top, left)
*/

let uniqueObjectID = 1;

const objectMap = {
    'amol-button-vanilla': AmolButtonVanilla,
    'amol-button-golden': AmolButtonGolden,
    'amol-button-thunder': AmolButtonThunder,
    'amol-button-ripple': AmolButtonRipple,
    'amol-click-tracking-vanilla': AmolClickTrackingVanilla,
    'amol-click-tracking-golden': AmolClickTrackingGolden,
    'amol-input-vanilla': AmolInputVanilla,
    'amol-input-golden': AmolInputGolden,
    'amol-input-thunder': AmolInputThunder,
    'amol-cursor-trail-vanilla': AmolCursorTrailVanilla,
    'amol-cursor-trail-golden': AmolCursorTrailGolden,
    'amol-cursor-trail-ripple': AmolCursorTrailRipple,
};

class AmolObject {
    constructor(name, objectName, colorType, viewOffset) {
        this.name = name;
        this.objectName = objectName;
        this.colorType = colorType;
        this.viewOffset = viewOffset;

        const ObjectClass = objectMap[objectName];
        if (ObjectClass) {
            this.object = new ObjectClass(name, colorType, viewOffset);
            addObject(this.object);
        }
    }

    getValue() {
        return returnValue(this.name);
    }

    setListener(event, func) {
        addListener(event, func, this.name);
    }

    setPosition(posX = 0, posY = 0, posZ = 0) {
        addPosition(posX, posY, posZ, this.name);
    }

    setScale(scale = 1.0) {
        addScale(scale, this.name);
    }

    removeSelf() {
        removeObject(this.name);
        removeListener(this.name);
    }
}

export function create(objectName, colorType = 0, viewOffset = 'fix') {
    uniqueObjectID++;
    const name = `object-${uniqueObjectID}`;
    return new AmolObject(name, objectName, colorType, viewOffset);
}

export function animate() {
    animateAll();
}

export { cameraSpeed };

export { stopCamera };

export { stopCameraAt };

// Virtual Scene and Movie Area
let uniqueDivName = 1;
let uniqueVirtualObjectID = 1;

export function virtualScene(zIndexValue = 2, widthValue = 400, heightValue = 400, topValue = 0, leftValue = 15) {
    uniqueDivName++;
    const divID = `div-id-${uniqueDivName}`;
    const cssDivID = `css-div-id-${uniqueDivName}`;
    const additionalScene = new AdditionalScene(divID, cssDivID, zIndexValue, widthValue, heightValue, topValue, leftValue);

    class AmolVirtualObject {
        constructor(name, objectName, colorType, viewOffset) {
            this.name = name;
            this.objectName = objectName;
            this.colorType = colorType;
            this.viewOffset = viewOffset;

            const ObjectClass = objectMap[objectName];
            if (ObjectClass) {
                this.object = new ObjectClass(name, colorType, viewOffset);
                additionalScene.addObject(this.object);
            }
        }

        getValue() {
            return additionalScene.returnValue(this.name);
        }

        setListener(event, func) {
            additionalScene.addListener(event, func, this.name);
        }

        setPosition(posX = 0, posY = 0, posZ = 0) {
            additionalScene.addPosition(posX, posY, posZ, this.name);
        }

        setScale(scale = 1.0) {
            additionalScene.addScale(scale, this.name);
        }

        removeSelf() {
            additionalScene.removeObject(this.name);
            additionalScene.removeListener(this.name);
        }
    }

    class AmolAdditionalScene {
        constructor() {

        }
        create(objectName, colorType = 0, viewOffset = 'fix') {
            uniqueVirtualObjectID++;
            const name = `virtual-object-${uniqueVirtualObjectID}`;
            return new AmolVirtualObject(name, objectName, colorType, viewOffset);
        }
        animate() {
            additionalScene.animateAll();
        }
    }

    return new AmolAdditionalScene();
}

export function movie(movieName = 'forgotten', zIndexValue = 2, widthValue = 400, heightValue = 400, topValue = 0, leftValue = 15) {
    uniqueDivName++;
    const divID = `div-id-${uniqueDivName}`;
    const cssDivID = `css-div-id-${uniqueDivName}`;
    let additionalScene;
    if (movieName == "forgotten") additionalScene = new MovieForgotten(divID, cssDivID, zIndexValue, widthValue, heightValue, topValue, leftValue);

    class AmolVirtualObject {
        constructor(name, objectName, colorType, viewOffset) {
            this.name = name;
            this.objectName = objectName;
            this.colorType = colorType;
            this.viewOffset = viewOffset;

            const ObjectClass = objectMap[objectName];
            if (ObjectClass) {
                this.object = new ObjectClass(name, colorType, viewOffset);
                additionalScene.addObject(this.object);
            }
        }

        getValue() {
            return additionalScene.returnValue(this.name);
        }

        setListener(event, func) {
            additionalScene.addListener(event, func, this.name);
        }

        setPosition(posX = 0, posY = 0, posZ = 0) {
            additionalScene.addPosition(posX, posY, posZ, this.name);
        }

        setScale(scale = 1.0) {
            additionalScene.addScale(scale, this.name);
        }

        removeSelf() {
            additionalScene.removeObject(this.name);
            additionalScene.removeListener(this.name);
        }
    }

    class AmolMovieScene {
        constructor() {

        }
        create(objectName, colorType = 0, viewOffset = 'fix') {
            uniqueVirtualObjectID++;
            const name = `virtual-object-${uniqueVirtualObjectID}`;
            return new AmolVirtualObject(name, objectName, colorType, viewOffset);
        }
        animate() {
            additionalScene.animateAll();
        }
        cameraSpeed(x, y, z) {
            additionalScene.cameraSpeed(x, y, z);
        }
        cameraSpeedRotate(x, y, z) {
            additionalScene.cameraSpeedRotate(x, y, z);
        }
        stopCamera() {
            additionalScene.stopCamera();
        }
        stopCameraRotate() {
            additionalScene.stopCameraRotate();
        }
        stopCameraAt(x, y, z) {
            additionalScene.stopCameraAt(x, y, z);
        }
    }

    return new AmolMovieScene();
}