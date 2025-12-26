import * as THREE from "three";
import * as AMOL from "./amol-beta";


const basicScene = AMOL.setup.jsVer("three-area", "three-area-css");

const envMap = await basicScene.loadEnvironment('/AMOL3D/UI/hdr/example_puresky_1k.hdr', 0, Math.PI * 5 / 9, 0);

const ocean = new AMOL.MovieWater(basicScene, envMap);
basicScene.create(ocean);

//const ruin1 = new AMOL.MovieRuinOne();
//basicScene.create(ruin1);