/**
 * 存档管理系统
 * 负责游戏状态的序列化、反序列化、验证和导入导出
 */

import type { SaveData, RunState, MetaState } from '@/types'

const SAVE_KEY = 'road-fury-save'
const SAVE_VERSION = '1.0.0'

/**
 * 计算简单校验和
 */
function calculateChecksum(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

/**
 * 验证 SaveData 结构
 */
export function validateSaveData(data: unknown): data is SaveData {
  if (!data || typeof data !== 'object') return false
  
  const save = data as Record<string, unknown>
  
  // 检查必需字段
  if (typeof save.version !== 'string') return false
  if (typeof save.timestamp !== 'number') return false
  if (typeof save.checksum !== 'string') return false
  
  // meta 必须存在
  if (!save.meta || typeof save.meta !== 'object') return false
  
  const meta = save.meta as Record<string, unknown>
  if (typeof meta.apocalypsePoints !== 'number') return false
  if (!Array.isArray(meta.unlockedVehicles)) return false
  if (!Array.isArray(meta.unlockedFacilities)) return false
  if (typeof meta.totalDistance !== 'number') return false
  if (typeof meta.totalRuns !== 'number') return false
  
  // run 可以为 null
  if (save.run !== null) {
    if (typeof save.run !== 'object') return false
    const run = save.run as Record<string, unknown>
    if (typeof run.distance !== 'number') return false
    if (typeof run.isRunning !== 'boolean') return false
    if (!run.vehicle || typeof run.vehicle !== 'object') return false
    if (!run.resources || typeof run.resources !== 'object') return false
  }
  
  return true
}

/**
 * 验证校验和
 */
export function verifyChecksum(data: SaveData): boolean {
  const { checksum, ...rest } = data
  const dataString = JSON.stringify(rest)
  return calculateChecksum(dataString) === checksum
}


/**
 * SaveManager 类
 */
export class SaveManager {
  private storageKey: string

  constructor(storageKey: string = SAVE_KEY) {
    this.storageKey = storageKey
  }

  /**
   * 保存游戏状态到 LocalStorage
   */
  save(run: RunState | null, meta: MetaState): void {
    const dataWithoutChecksum = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      run,
      meta,
    }
    
    const checksum = calculateChecksum(JSON.stringify(dataWithoutChecksum))
    
    const saveData: SaveData = {
      ...dataWithoutChecksum,
      checksum,
    }
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(saveData))
    } catch (error) {
      console.error('Failed to save game:', error)
      throw new Error('存档保存失败')
    }
  }

  /**
   * 从 LocalStorage 加载游戏状态
   */
  load(): SaveData | null {
    try {
      const raw = localStorage.getItem(this.storageKey)
      if (!raw) return null
      
      const data = JSON.parse(raw)
      
      if (!validateSaveData(data)) {
        console.warn('Invalid save data structure')
        return null
      }
      
      if (!verifyChecksum(data)) {
        console.warn('Save data checksum mismatch')
        return null
      }
      
      return data
    } catch (error) {
      console.error('Failed to load game:', error)
      return null
    }
  }

  /**
   * 验证存档数据
   */
  validate(data: unknown): data is SaveData {
    return validateSaveData(data)
  }

  /**
   * 导出存档为 JSON 字符串
   */
  export(): string {
    const raw = localStorage.getItem(this.storageKey)
    if (!raw) {
      throw new Error('没有可导出的存档')
    }
    return raw
  }

  /**
   * 从 JSON 字符串导入存档
   */
  import(json: string): SaveData {
    try {
      const data = JSON.parse(json)
      
      if (!validateSaveData(data)) {
        throw new Error('存档格式无效')
      }
      
      if (!verifyChecksum(data)) {
        throw new Error('存档校验失败')
      }
      
      localStorage.setItem(this.storageKey, json)
      return data
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('JSON 格式错误')
      }
      throw error
    }
  }

  /**
   * 删除存档
   */
  delete(): void {
    localStorage.removeItem(this.storageKey)
  }

  /**
   * 检查是否存在存档
   */
  exists(): boolean {
    return localStorage.getItem(this.storageKey) !== null
  }
}

// 默认实例
export const saveManager = new SaveManager()
