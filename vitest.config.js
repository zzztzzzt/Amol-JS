import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Simulate a browser environment to test the UI
    environment: 'jsdom', 
    // Can directly use describe, it, expect instead of importing every time
    globals: true, 
  },
})