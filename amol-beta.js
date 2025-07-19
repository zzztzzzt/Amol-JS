import { AmolScene } from "./AMOL3D/amol-setup-beta";
export { ClickTrackingStellar } from "./AMOL3D/UI/amol-click-tracking-stellar";
export { CursorTrailStellar } from "./AMOL3D/UI/amol-cursor-trail-stellar";

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
    "%c🔭 You are using Amol.js\n⚖️ Version - 1.3 Beta .250706",
    "font-weight: bold; font-size: 18px; background: linear-gradient(to right, #94d8ff, #70ffc4); color: transparent; background-clip: text; -webkit-background-clip: text;"
);
console.log("%cWelcome", "font-weight: bold; color: gray;");
console.log("%c您好", "font-weight: bold; color: gray;");
console.log("%cالسلام عليكم", "font-weight: bold; color: gray;");
console.log("%cChào mừng", "font-weight: bold; color: gray;");
console.log("%cいらっしゃいませ", "font-weight: bold; color: gray;");
console.log(
    "%cGitHub: github.com/zzztzzzt/Amol-JS",
    "font-weight: bold; color: lightGray;"
);
console.log(
    "%c🏹 Explore the places we've never been.",
    "font-weight: bold; background-color: #94d8ff; color: transparent; background-clip: text; -webkit-background-clip: text;"
);

console.groupEnd();