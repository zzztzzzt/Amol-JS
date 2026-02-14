import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { ButtonGolden } from '@altair3d/UI/altair-button-golden.js';

describe('ButtonGolden Core Functionality Testing', () => {
  it('basic components should be declared', () => {
    const button = new ButtonGolden(0);

    expect(button.objectType).toBe('button');

    expect(button.mainMesh).toBeInstanceOf(THREE.Mesh);
    expect(button.ring).toBeInstanceOf(THREE.Mesh);
    expect(button.ringTwo).toBeInstanceOf(THREE.Mesh);
    expect(button.ringThree).toBeInstanceOf(THREE.Mesh);
    expect(button.particles).toBeInstanceOf(THREE.Group);
  });

  it('constructor with color 1 uses second color set', () => {
    const button = new ButtonGolden(1);
    expect(button.objectType).toBe('button');
    expect(button.mainMesh).toBeInstanceOf(THREE.Mesh);
    expect(button.colorTypeList[1]).toBeDefined();
  });

  it('getMeshes should return all mesh references', async () => {
    const button = new ButtonGolden(0);
    const meshes = await button.getMeshes();

    expect(meshes.mainMesh).toBe(button.mainMesh);
    expect(meshes.ring).toBe(button.ring);
    expect(meshes.ringTwo).toBe(button.ringTwo);
    expect(meshes.ringThree).toBe(button.ringThree);
    expect(meshes.particles).toBe(button.particles);
  });

  it('changePosition should move all visual objects together', () => {
    const button = new ButtonGolden(0);

    button.changePosition(1, 2, 3);

    expect(button.mainMesh.position.toArray()).toEqual([1, 2, 3]);
    expect(button.ring.position.toArray()).toEqual([1, 2, 3]);
    expect(button.ringTwo.position.toArray()).toEqual([1, 2, 3]);
    expect(button.ringThree.position.toArray()).toEqual([1, 2, 3]);
    expect(button.particles.position.toArray()).toEqual([1, 2, 3]);
  });

  it('changeScale should scale all visual objects together', () => {
    const button = new ButtonGolden(0);

    button.changeScale(2, 2, 2);

    expect(button.mainMesh.scale.toArray()).toEqual([2, 2, 2]);
    expect(button.ring.scale.toArray()).toEqual([2, 2, 2]);
    expect(button.ringTwo.scale.toArray()).toEqual([2, 2, 2]);
    expect(button.ringThree.scale.toArray()).toEqual([2, 2, 2]);
    expect(button.particles.scale.toArray()).toEqual([2, 2, 2]);
  });

  it('scaleSet and positionSet should delegate to changeScale/changePosition', () => {
    const button = new ButtonGolden(0);
    button.positionSet(10, 20, 30);
    expect(button.mainMesh.position.toArray()).toEqual([10, 20, 30]);
    button.scaleSet(3, 3, 3);
    expect(button.mainMesh.scale.toArray()).toEqual([3, 3, 3]);
  });

  it('listener getters should return expected handlers', () => {
    const button = new ButtonGolden(0);

    expect(button.getListenerFunc('click')).toBe(button.whenClick);
    expect(button.getListenerFunc('mousemove')).toBe(button.whenMouseMove);
    expect(button.getListenerFunc('mouseover')).toBe(button.whenMouseOver);
    expect(button.getListenerFunc('notmouseover')).toBe(button.notMouseOver);
    expect(button.getListenerFunc('unknown')).toBeUndefined();
  });

  it('getAnimateFunc should return animateFunc', () => {
    const button = new ButtonGolden(0);

    expect(button.getAnimateFunc()).toBe(button.animateFunc);
    expect(typeof button.getAnimateFunc()).toBe('function');
  });
});
