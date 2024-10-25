import { defineStore } from 'pinia'

interface AppState {
  ready: boolean
}

function createAppState(): AppState {
  return {
    ready: false,
  }
}

export const useAppStore = defineStore('app', {
  state: createAppState,
  actions: {
    /**
     * 更新系统状态
     */
    setReady() {
      this.ready = true
    },
  },
})
