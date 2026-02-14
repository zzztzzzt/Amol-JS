import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { AltairScene } from '@altair3d/altair-setup-beta';

// Simulate a WebGL Context (to prevent Three.js from throwing errors)
vi.mock('three', async () => {
  const actual = await vi.importActual('three');
    
  class MockWebGLRenderer {
    constructor() {
      this.domElement = document.createElement('canvas');
    }
    setSize() {}
    render() {}
    dispose() {}
  }
  
  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  };
});
  
vi.mock('three/examples/jsm/renderers/CSS3DRenderer.js', () => {
  return {
    CSS3DRenderer: class {
      constructor() {
        this.domElement = document.createElement('div');
      }
      setSize() {}
      render() {}
    }
  };
});

vi.mock('three/addons/loaders/RGBELoader.js', () => ({
  RGBELoader: class {
    load(path, onLoad) {
      if (onLoad) onLoad({});
    }
  },
}));

describe('AltairScene Core Functionality Testing', () => {
  // Prepare the HTML container before each test begins
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="webgl-container" style="width: 800px; height: 600px;"></div>
      <div id="css-container" style="width: 800px; height: 600px;"></div>
    `;
    
    // Simulate getBoundingClientRect, because Three.js uses width and height during initialization
    window.HTMLElement.prototype.getBoundingClientRect = function() {
      return { width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600 };
    };
  });

  it('Basic components should be declared', () => {
    const basicScene = new AltairScene('webgl-container', 'css-container');

    expect(basicScene.scene).toBeInstanceOf(THREE.Scene);
    expect(basicScene.camera).toBeInstanceOf(THREE.PerspectiveCamera);
    
    expect(basicScene.ambientLight).toBeDefined();
    expect(basicScene.scene.children).toContain(basicScene.ambientLight);
    expect(basicScene.scene.children).toContain(basicScene.light);

    expect(basicScene.renderer).toBeDefined();
    expect(basicScene.cssRenderer).toBeDefined();
  });

  it('renderer should be correctly mounted into DOM container', () => {
    new AltairScene('webgl-container', 'css-container');

    const webglDiv = document.getElementById('webgl-container');
    const cssDiv = document.getElementById('css-container');

    expect(webglDiv.querySelector('canvas')).not.toBeNull();
    
    expect(cssDiv.children.length).toBeGreaterThan(0);
  });

  it('create-method should be able to create and register objects', async () => {
    const basicScene = new AltairScene('webgl-container', 'css-container');
    
    const mockMesh = new THREE.Mesh();
    mockMesh.uuid = 'test-mesh-uuid';

    const mockAltairObject = {
        objectType: 'button',
        getMeshes: async () => ({ mainMesh: mockMesh }),
        getAnimateFunc: () => () => {},
        getListenerFunc: (type) => () => `handler-${type}`
    };

    await basicScene.create(mockAltairObject);

    expect(basicScene.altairObjectList).toContain(mockAltairObject);

    expect(basicScene.scene.children).toContain(mockMesh);

    expect(basicScene.interactiveMeshes).toContain(mockMesh);

    expect(basicScene.animateFuncList.length).toBe(1);

    expect(basicScene.listenerFuncMapClick.has('test-mesh-uuid')).toBe(true);

    expect(basicScene.listenerFuncListMouseMove.length).toBe(1);

    expect(basicScene.listenerFuncMapMouseOver.has('test-mesh-uuid')).toBe(true);

    expect(basicScene.listenerFuncMapNotMouseOver.has('test-mesh-uuid')).toBe(true);
  });

  it('create-method with click-tracking should use listenerFuncListClick not map', async () => {
    const basicScene = new AltairScene('webgl-container', 'css-container');
    const mockMesh = new THREE.Mesh();
    mockMesh.uuid = 'tracking-uuid';
    const clickHandler = vi.fn();
    const mockAltairObject = {
      objectType: 'click-tracking',
      getMeshes: async () => ({ mainMesh: mockMesh }),
      getAnimateFunc: () => () => {},
      getListenerFunc: (type) => (type === 'click' ? clickHandler : () => {}),
    };

    await basicScene.create(mockAltairObject);

    expect(basicScene.listenerFuncMapClick.has('tracking-uuid')).toBe(false);
    expect(basicScene.listenerFuncListClick).toContain(clickHandler);
  });

  it('create-method should reject object-type and invalid objectType', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const basicScene = new AltairScene('webgl-container', 'css-container');

    const objectTypeObj = {
      objectType: 'object-type',
      getMeshes: async () => ({}),
      getAnimateFunc: () => () => {},
      getListenerFunc: () => () => {},
      constructor: { name: 'FakeObject' },
    };
    await basicScene.create(objectTypeObj);
    expect(basicScene.altairObjectList).not.toContain(objectTypeObj);
    expect(consoleSpy).toHaveBeenCalled();

    const invalidObj = {
      objectType: 'invalid',
      getMeshes: async () => ({}),
      getAnimateFunc: () => () => {},
      getListenerFunc: () => () => {},
      constructor: { name: 'FakeObject' },
    };
    await basicScene.create(invalidObj);
    expect(basicScene.altairObjectList).not.toContain(invalidObj);

    consoleSpy.mockRestore();
  });

  it('loadEnvironment should set scene environment and background on success', async () => {
    const basicScene = new AltairScene('webgl-container', 'css-container');
    const result = await basicScene.loadEnvironment('/fake.hdr', 0, 0, 0);
    expect(result).toBeDefined();
    expect(basicScene.scene.environment).toBeDefined();
    expect(basicScene.scene.background).toBeDefined();
  });
});