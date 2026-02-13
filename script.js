import * as THREE from "three";
import { setup } from "./src/setup";
import { ButtonFlowerRing } from "./src/components";
import { MovieNebula } from "./src/components";

//import examplePureSky from '@hdr/example_puresky_1k.hdr';
//import { MovieWater } from "./src/components";

const basicScene = setup.jsVer("three-area", "three-area-css");

/*
const envMap = await basicScene.loadEnvironment(examplePureSky, 0, Math.PI * 5 / 9, 0);

const ocean = new MovieWater(basicScene, envMap);
basicScene.create(ocean);
*/

const btn3d = new ButtonFlowerRing();
//basicScene.create(btn3d);

const nebula = new MovieNebula();
basicScene.create(nebula);