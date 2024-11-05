import * as AMOL from './amol';

let cameraStaus = "go";

const myMovie = AMOL.movie('forgotten', -1, window.innerWidth, window.innerHeight, 0, 0);

// cameraSpeedRotate() and stopCameraRotate() can only run in movie scene currently.
const myButton = myMovie.create('amol-button-golden', 0);
myButton.setPosition(2.5, -1, -3);
myButton.setListener('click', () => {
    if (cameraStaus == "go") {
        myMovie.cameraSpeed(0.04, 0, -0.06);
        myMovie.cameraSpeedRotate(0, 0.004, 0);
        setTimeout(() => {
            myMovie.stopCamera();
            myMovie.stopCameraRotate();
            cameraStaus = "back";
        }, 3000);
    }
});

// cameraSpeedRotate() and stopCameraRotate() can only run in movie scene currently.
const myButton2 = myMovie.create('amol-button-golden', 0);
myButton2.setPosition(-2.5, -1, -3);
myButton2.setScale(0.8);
myButton2.setListener('click', () => {
    if (cameraStaus == "back") {
        myMovie.cameraSpeed(-0.04, 0, 0.06);
        myMovie.cameraSpeedRotate(0, -0.004, 0);
        setTimeout(() => {
            myMovie.stopCamera();
            myMovie.stopCameraRotate();
            cameraStaus = "go";
        }, 3000);
    }
});

myMovie.animate();