import * as AMOL from './amol';

const CameraStatus = {
    GO: 'go',
    BACK: 'back',
};
let cameraStatus = CameraStatus.GO;

// cameraSpeedRotate() and stopCameraRotate() can only run in movie scene currently.
const myMovie = AMOL.movie('forgotten', -1, window.innerWidth, window.innerHeight, 0, 0);

const adjustCamera = (speedX, speedY, speedZ, rotateX, rotateY, rotateZ, newStatus, delay = 3000, frameDelay = (1000 / 60)) => {
    let lastFrameTime = 0;
    const startTime = performance.now();

    // Use requestAnimationFrame() to replaces setTimeout( ()=>{}, 3000 )
    const animate = (time) => {
        if (time - lastFrameTime >= frameDelay) {
            lastFrameTime = time - (time - lastFrameTime) % frameDelay;

            const elapsedTime = time - startTime;

            myMovie.cameraSpeed(speedX, speedY, speedZ);
            myMovie.cameraSpeedRotate(rotateX, rotateY, rotateZ);

            if (elapsedTime >= delay) {
                myMovie.stopCamera();
                myMovie.stopCameraRotate();
                cameraStatus = newStatus;
            }
        }
        requestAnimationFrame(animate);
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