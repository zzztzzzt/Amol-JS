import * as AMOL from './amol';

const myEffect = AMOL.create('amol-cursor-trail-ripple', 1);

const btn1 = AMOL.create('amol-button-thunder', 0, 'none');
btn1.setPosition(1.8, -1.8, 0);
btn1.setScale(1.2);

AMOL.animate();

const myScene = AMOL.virtualScene(2, 400, 400, 0, 22);

const btn2 = myScene.create('amol-button-vanilla', 0);
btn2.setScale(1.5);

myScene.animate();