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