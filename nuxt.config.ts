// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['normalize.css'],
  build: {
    transpile: ['element-plus/es']
  },
  // 配置nuxt3的扩展模块
  modules: ['@pinia/nuxt', '@element-plus/nuxt', '@nuxtjs/eslint-module'],
  types: {
    marked: '@types/marked'
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://127.0.0.1:7001/',
        prependPath: true,
        changeOrigin: true
      }
    }
  },
  app: {
    head: {
      script: [
        {
          src: '/spark-md5.min.js'
        },
        {
          src: '/hash.js'
        }
      ]
    }
  }
})
