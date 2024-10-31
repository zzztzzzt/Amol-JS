import * as AMOL from './amol';

const myMovie = AMOL.movie('forgotten', -1, window.innerWidth, window.innerHeight, 0, 0);

const myButton = myMovie.create('amol-button-golden', 0);
myButton.setPosition(2.5, -1, -3);

const myButton2 = myMovie.create('amol-button-golden', 0);
myButton2.setPosition(-2.5, -1, -3);
myButton2.setScale(0.8);

myMovie.animate();