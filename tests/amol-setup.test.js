import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { AmolScene } from '@amol3d/amol-setup-beta';

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

describe('AmolScene Core Functionality Testing', () => {
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
    const basicScene = new AmolScene('webgl-container', 'css-container');

    expect(basicScene.scene).toBeInstanceOf(THREE.Scene);
    expect(basicScene.camera).toBeInstanceOf(THREE.PerspectiveCamera);
    
    expect(basicScene.ambientLight).toBeDefined();
    expect(basicScene.scene.children).toContain(basicScene.ambientLight);
    expect(basicScene.scene.children).toContain(basicScene.light);

    expect(basicScene.renderer).toBeDefined();
    expect(basicScene.cssRenderer).toBeDefined();
  });

  it('renderer should be correctly mounted into DOM container', () => {
    new AmolScene('webgl-container', 'css-container');

    const webglDiv = document.getElementById('webgl-container');
    const cssDiv = document.getElementById('css-container');

    expect(webglDiv.querySelector('canvas')).not.toBeNull();
    
    expect(cssDiv.children.length).toBeGreaterThan(0);
  });

  it('create-method should be able to create and register objects', async () => {
    const basicScene = new AmolScene('webgl-container', 'css-container');
    
    const mockMesh = new THREE.Mesh();
    mockMesh.uuid = 'test-mesh-uuid';

    const mockAmolObject = {
        objectType: 'button',
        getMeshes: async () => ({ mainMesh: mockMesh }),
        getAnimateFunc: () => () => {},
        getListenerFunc: (type) => () => `handler-${type}`
    };

    await basicScene.create(mockAmolObject);

    expect(basicScene.amolObjectList).toContain(mockAmolObject);

    expect(basicScene.scene.children).toContain(mockMesh);

    expect(basicScene.interactiveMeshes).toContain(mockMesh);

    expect(basicScene.animateFuncList.length).toBe(1);

    expect(basicScene.listenerFuncMapClick.has('test-mesh-uuid')).toBe(true);

    expect(basicScene.listenerFuncListMouseMove.length).toBe(1);

    expect(basicScene.listenerFuncMapMouseOver.has('test-mesh-uuid')).toBe(true);

    expect(basicScene.listenerFuncMapNotMouseOver.has('test-mesh-uuid')).toBe(true);
  });
});