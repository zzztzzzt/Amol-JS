import { AmolScene } from "@amol3d/amol-setup-beta.js";

const setup = {
  jsVer: (divId, cssDivId) => {
    return new AmolScene(divId, cssDivId);
  },
  amolVue: () => {}
};

export { setup, AmolScene };
