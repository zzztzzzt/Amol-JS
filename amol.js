import { addObject, removeObject, returnValue, addListener, removeListener, addPosition, addScale, animateAll } from './AMOL3DUI/amol-default-setup';
import { AmolButtonGolden } from './AMOL3DUI/UI/amol-button-golden';
import { AmolClickTrackingGolden } from './AMOL3DUI/UI/amol-click-tracking-golden';
import { AmolInputGolden } from './AMOL3DUI/UI/amol-input-golden';
import { AmolCursorTrailGolden } from './AMOL3DUI/UI/amol-cursor-trail-golden';
import { AmolButtonVanilla } from './AMOL3DUI/UI/amol-button-vanilla';
import { AmolClickTrackingVanilla } from './AMOL3DUI/UI/amol-click-tracking-vanilla';
import { AmolInputVanilla } from './AMOL3DUI/UI/amol-input-vanilla';
import { AmolCursorTrailVanilla } from './AMOL3DUI/UI/amol-cursor-trail-vanilla';

/*
All Tools :
AMOL.create(Name, 3D-object-Name, color-type, view-offset)
AMOL.remove(Name)
AMOL.getValue(Name)
AMOL.setListener(Name, event, function)
AMOL.setPosition(Name, position-X, position-Y, position-Z)
AMOL.setScale(Name, scale)
AMOL.animate()
*/

// 1.AMOL.create()
export function create(name, objectName, colorType = 0, viewOffset = 'fix') {
    if (objectName == 'amol-button-vanilla') {
        let object = new AmolButtonVanilla(name, colorType, viewOffset);
        addObject(object);
    }
    if (objectName == 'amol-button-golden') {
        let object = new AmolButtonGolden(name, colorType, viewOffset);
        addObject(object);
    }
    if (objectName == 'amol-click-tracking-vanilla') {
        let object = new AmolClickTrackingVanilla(name, colorType, viewOffset);
        addObject(object);
    }
    if (objectName == 'amol-click-tracking-golden') {
        let object = new AmolClickTrackingGolden(name, colorType, viewOffset);
        addObject(object);
    }
    if (objectName == 'amol-input-vanilla') {
        let object = new AmolInputVanilla(name, colorType, viewOffset);
        addObject(object);
    }
    if (objectName == 'amol-input-golden') {
        let object = new AmolInputGolden(name, colorType, viewOffset);
        addObject(object);
    }
    if (objectName == 'amol-cursor-trail-vanilla') {
        let object = new AmolCursorTrailVanilla(name, colorType, viewOffset);
        addObject(object);
    }
    if (objectName == 'amol-cursor-trail-golden') {
        let object = new AmolCursorTrailGolden(name, colorType, viewOffset);
        addObject(object);
    }
}

// 2.AMOL.remove()
export function remove(name) {
    removeObject(name);
    removeListener(name);
}

// 3.AMOL.getValue()
export function getValue(name) {
    const value = returnValue(name);
    return value;
}

// 4.AMOL.setListener()
export function setListener(name, event, func) {
    addListener(event, func, name);
}

// 5.AMOL.setPosition()
export function setPosition(name, posX = 0, posY = 0, posZ = 0) {
    addPosition(posX, posY, posZ, name);
}

// 6.AMOL.setScale()
export function setScale(name, scale = 1.0) {
    addScale(scale, name);
}

// 7.AMOL.animate()
export function animate() {
    animateAll();
}