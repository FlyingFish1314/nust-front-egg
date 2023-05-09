import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: (): any => {
    return {
      // text
      test: '111'
    }
  },
  actions: {}
})
