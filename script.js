import * as THREE from "three";
import { setup } from "./src/setup";
import { ButtonFlowerRing } from "./src/components";
//import { MovieWater } from "./src/components";
//import { MovieRuinOne } from "./src/components";

const basicScene = setup.jsVer("three-area", "three-area-css");

/*
const envMap = await basicScene.loadEnvironment('./src/AMOL3D/UI/hdr/example_puresky_1k.hdr', 0, Math.PI * 5 / 9, 0);

const ocean = new MovieWater(basicScene, envMap);
basicScene.create(ocean);

const movieObjOne = new MovieRuinOne();
movieObjOne.scaleSet(13, 13, 13);
movieObjOne.positionSet(8, -3.5, -50);
movieObjOne.rotationSet(0, Math.PI / 12, 0);

basicScene.create(movieObjOne);
*/


const btn3d = new ButtonFlowerRing();
basicScene.create(btn3d);