import * as THREE from "three";
import * as AMOL from "./amol-beta";



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



const glassCard2 = document.getElementById('glass-card-2');
const roundImgCover = document.getElementById('round-img-cover');

glassCard2.addEventListener('mouseenter', () => {
  roundImgCover.style.top = '-500px';
  roundImgCover.style.left = '-500px';
  roundImgCover.style.width = '1030px';
  roundImgCover.style.height = '1030px';
});

glassCard2.addEventListener('mouseleave', () => {
  roundImgCover.style.top = '-300px';
  roundImgCover.style.left = '-300px';
  roundImgCover.style.width = '600px';
  roundImgCover.style.height = '600px';
});


const glassCard3 = document.getElementById('glass-card-3');
const codeExample = document.getElementById('code-example');
const codeExampleText = document.getElementById('code-example-text');

glassCard2.addEventListener('mouseenter', () => {
  codeExample.style.opacity = '0';
  codeExampleText.style.opacity = '0';
});
glassCard2.addEventListener('mouseleave', () => {
  codeExample.style.opacity = '1';
  codeExampleText.style.opacity = '1';
});
glassCard3.addEventListener('mouseenter', () => {
  codeExample.style.opacity = '0';
  codeExampleText.style.opacity = '0';
});
glassCard3.addEventListener('mouseleave', () => {
  codeExample.style.opacity = '1';
  codeExampleText.style.opacity = '1';
});


const roundImg = document.getElementById('round-img');
const offset = -50;
document.addEventListener('mousemove', () => {
  const x = event.clientX / 30;
  const y = event.clientY / 25;

  roundImg.style.left = `${-405-x}px`;
  roundImg.style.top = `${-405-y}px`;
});


const clickText = document.getElementById('click-text');
function moveClickTextRandomly() {
  const maxX = window.innerWidth - clickText.offsetWidth;
  const maxY = window.innerHeight - clickText.offsetHeight;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  clickText.style.left = `${randomX}px`;
  clickText.style.top = `${randomY}px`;
}
function flashAndMove() {
  clickText.style.opacity = 1;

  setTimeout(() => {
    clickText.style.opacity = 0;
  }, 1500);

  setTimeout(() => {
    moveClickTextRandomly();
  }, 3000);
}
setInterval(flashAndMove, 3000);
moveClickTextRandomly();

const rotateBtn = document.getElementById("rotate-btn");
rotateBtn.style.setProperty('--conic-colors', 'transparent 75%, #ed4aff, #b647ff, #8f87ff');
const rotateBtnSpan = document.getElementById("rotate-btn-span");
const glassCard1 = document.getElementById('glass-card-1');
let rotateBtnFlag = 0;

rotateBtn.addEventListener("click", () => {
  if (rotateBtnFlag == 0) {
    rotateBtnFlag = 1;

    transitionAnimate();

    setTimeout(() => {
      colorCounter += 1;
      changeCubeColor();
      changeTrackingColor();

      document.body.style.backgroundImage = "url('logo/logo.png')";
      document.body.style.backgroundSize = "18%";

      roundImg.src="example-img/please-dont-use-ONLY-FOR-EXAMPLE-photo-by-waro-photos.webp"

      rotateBtn.style.backgroundImage = 'linear-gradient(45deg, #ffbf00, #fff585)';
      rotateBtn.style.setProperty('--conic-colors', 'transparent 75%, #ffb491, #ffa759, #ff874f');

      glassCard1.style.display = "none";
      glassCard2.style.display = "none";
      glassCard3.style.display = "none";
      codeExample.style.display = "none";
      codeExampleText.style.display = "none";
      clickText.style.display = 'block';

      rotateBtnSpan.innerText = "Web Mix Mode";
    }, 400);
  }
  else {
    rotateBtnFlag = 0;

    transitionAnimate();

    setTimeout(() => {
      colorCounter += 1;
      changeCubeColor();
      changeTrackingColor();

      document.body.style.backgroundImage = "url('logo/amoljs.jpg')";
      document.body.style.backgroundSize = "36%";

      roundImg.src="example-img/please-dont-use-ONLY-FOR-EXAMPLE-photo-by-conrad-crawford.webp"

      rotateBtn.style.backgroundImage = 'linear-gradient(45deg, #000000, #1000bd)';
      rotateBtn.style.setProperty('--conic-colors', 'transparent 75%, #ed4aff, #b647ff, #8f87ff');

      glassCard1.style.display = "flex";
      glassCard2.style.display = "flex";
      glassCard3.style.display = "flex";
      codeExample.style.display = "block";
      codeExampleText.style.display = "block";
      clickText.style.display = 'none';

      rotateBtnSpan.innerText = "Pure 3d Mode";
    }, 400);
  }
});

const fullCover = document.getElementById("full-cover");
function transitionAnimate() {
  fullCover.style.display = "block";

  requestAnimationFrame(() => {
    fullCover.style.opacity = "1";

    setTimeout(() => {
      fullCover.style.opacity = "0";

      setTimeout(() => {
        fullCover.style.display = "none";
      }, 300);
    }, 600);
  });
}
