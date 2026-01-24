/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.exr'],
  resolve: {
    alias: {
      '@amol3d': fileURLToPath(new URL('./src/AMOL3D', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/AMOL3D/utils', import.meta.url)),
      '@hdr': fileURLToPath(new URL('./src/AMOL3D/UI/hdr', import.meta.url)),
      '@models': fileURLToPath(new URL('./src/AMOL3D/UI/models', import.meta.url)),
      '@textures': fileURLToPath(new URL('./src/AMOL3D/UI/textures', import.meta.url))
    }
  },
  test: {
    // Simulate a browser environment to test the UI
    environment: 'jsdom',
    // Can directly use describe, it, expect instead of importing every time
    globals: true,
  }
})