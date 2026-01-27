import { defineConfig } from 'vite';

/**
 * Performance Optimization Configuration for Vite
 * 
 * This configuration enhances the build and runtime performance
 * of the application by optimizing chunk splitting, compression,
 * and build settings.
 */

export default defineConfig({
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'sonner'],
          // Separate large components
          'dashboard': [
            './src/pages/donor/DonorDashboard.tsx',
            './src/pages/hospital/HospitalDashboard.tsx',
            './src/pages/bloodbank/BloodBankDashboard.tsx'
          ]
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Source maps for debugging (disable in production for better performance)
    sourcemap: false
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'sonner'
    ],
    // Force pre-bundling of these dependencies
    force: true
  },
  
  // Server configuration for development
  server: {
    // Enable HTTP/2 for better performance
    https: false,
    // Optimize HMR
    hmr: {
      overlay: true
    }
  }
});