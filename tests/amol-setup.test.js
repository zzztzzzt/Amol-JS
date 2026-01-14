import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { AmolScene } from '../AMOL3D/amol-setup-beta';

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

  it('scene and camera should be successfully set up', () => {
    const basicScene = new AmolScene('webgl-container', 'css-container');

    expect(basicScene.scene).toBeDefined();
    
    expect(basicScene.camera.fov).toBe(20);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('create-method should add AmolObject to ObjectList', async () => {
    const basicScene = new AmolScene('webgl-container', 'css-container');
  
    const mockObject = {
      objectType: 'button',
      getMeshes: async () => ({ 
        mainMesh: new THREE.Mesh() 
      }),
      getAnimateFunc: () => () => {},
      getListenerFunc: () => () => {},
    };
  
    await basicScene.create(mockObject);
    
    expect(basicScene.amolObjectList.length).toBe(1);
  });
});