import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default defineNuxtPlugin((NuxtApp) => {
  // nuxtApp包含的属性可看文档 https://nuxt.com/docs/guide/going-further/internals

  // 全局组件引入
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    NuxtApp.vueApp.component(key, component)
  }
})

// 作者：iwhitney
// 链接：https://juejin.cn/post/7205875185740103736
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
