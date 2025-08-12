import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Configurações de produção
  mode: 'production',
  
  // Build otimizado
  build: {
    outDir: 'dist',
    sourcemap: false, // Desabilitar sourcemaps em produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    },
    
    // Otimizações de chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
          utils: ['axios', 'react-hook-form', 'react-hot-toast']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // Otimizações de assets
    assetsInlineLimit: 4096, // 4KB
    chunkSizeWarningLimit: 1000
  },
  
  // Configurações de servidor
  server: {
    port: 3000,
    host: true
  },
  
  // Preview (para testar build)
  preview: {
    port: 4173,
    host: true
  },
  
  // Resolução de módulos
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  // Variáveis de ambiente
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // Otimizações de CSS
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default', {
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: true,
            colormin: true,
            minifyFontValues: true,
            minifySelectors: true
          }]
        })
      ]
    }
  }
}) 