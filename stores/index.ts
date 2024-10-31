import { defineStore } from 'pinia'
import type { Record } from '../drizzle/schemas/record.schema'

interface AppState {
  ready: boolean
  record?: Record
}

function createAppState(): AppState {
  return {
    ready: false,
  }
}
export const useStore = defineStore('app', {
  state: createAppState,
  getters: {
    batches: (state) => {
      return state.record?.batches.map(x => x.batchId)
    },
  },
  actions: {
    /**
     * 更新系统状态
     */
    setReady() {
      this.ready = true
    },
    updateRecord(value: Record) {
      this.record = value
    },
  },
})
