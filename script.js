import * as THREE from "three";
import * as AMOL from "./amol-beta";


const basicScene = AMOL.setup.jsVer("three-area", "three-area-css");

/*const envMap = await basicScene.loadEnvironment('/AMOL3D/UI/hdr/example_puresky_1k.hdr', 0, Math.PI * 5 / 9, 0);

const ocean = new AMOL.MovieWater(basicScene, envMap);
basicScene.create(ocean);

const movieObjOne = new AMOL.MovieRuinOne();
movieObjOne.scaleSet(13, 13, 13);
movieObjOne.positionSet(8, -3.5, -50);
movieObjOne.rotationSet(0, Math.PI / 12, 0);

basicScene.create(movieObjOne);
*/

const btn3d = new AMOL.ButtonVanilla();
basicScene.create(btn3d);