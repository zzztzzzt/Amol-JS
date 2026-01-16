import { AmolScene } from "./AMOL3D/amol-setup-beta";
export { ButtonVanilla } from "./AMOL3D/UI/amol-button-vanilla";
export { ButtonGolden } from "./AMOL3D/UI/amol-button-golden";
export { ButtonFlowerRing } from "./AMOL3D/UI/amol-button-flower-ring";
export { ClickTrackingStellar } from "./AMOL3D/UI/amol-click-tracking-stellar";
export { ClickTrackingLilac } from "./AMOL3D/UI/amol-click-tracking-lilac";
export { CursorTrailStellar } from "./AMOL3D/UI/amol-cursor-trail-stellar";
export { CursorTrailLilac } from "./AMOL3D/UI/amol-cursor-trail-lilac";
export { MovieWater } from "./AMOL3D/UI/amol-movie-water";
export { MovieRuinOne } from "./AMOL3D/UI/amol-movie-ruin-one";

const setup = {
    jsVer: (divId, cssDivId) => {
        return new AmolScene(divId, cssDivId);
    },
    amolVue: () => {

    }
};
export { setup };

console.group("amol -v");

console.log(
    "%c🔭 You are using Amol.js\n⚖️ Version - 1.4 .251228",
    "font-weight: bold; font-size: 18px; background: linear-gradient(to right, #94d8ff, #70ffc4); color: transparent; background-clip: text; -webkit-background-clip: text;"
);

console.groupEnd();