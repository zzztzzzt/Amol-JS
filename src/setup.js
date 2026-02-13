import { AltairScene } from "@altair3d/altair-setup-beta.js";

const setup = {
  jsVer: (divId, cssDivId) => {
    return new AltairScene(divId, cssDivId);
  },
  altairVue: () => {}
};

export { setup, AltairScene };
