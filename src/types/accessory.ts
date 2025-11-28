/**
 * 配件系统类型定义 - 按设计文档
 */

export type AccessorySlot = 'front' | 'side' | 'tire'
export type AccessoryRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface AccessoryConfig {
  id: string
  name: string
  icon: string
  description: string
  slot: AccessorySlot
  rarity: AccessoryRarity
  effects: AccessoryEffectConfig[]
  unlockCondition: {
    type: 'default' | 'distance' | 'boss' | 'craft' | 'achievement' | 'blueprint' | 'boss_drop'
    value?: number | string
    bossType?: string
  }
  craftCost?: {
    scrap?: number
    parts?: number
    electronics?: number
  }
}

export interface AccessoryEffectConfig {
  type: 
    | 'crush_damage'       // 碾压伤害
    | 'speed'              // 速度
    | 'armor'              // 护甲
    | 'energy_consumption' // 能源消耗
    | 'power_consumption'  // 电力消耗
    | 'zombie_damage'      // 对近身丧尸造成伤害
    | 'flat_tire_resist'   // 爆胎抵抗
    | 'tire_resistance'    // 爆胎抗性
    | 'terrain_speed'      // 恶劣路况速度
    | 'weather_resistance' // 天气抗性
  value: number            // 百分比或固定值
  isPercent?: boolean
  isPercentage?: boolean
}

export interface AccessoryState {
  front?: string          // 前部配件ID
  side?: string           // 侧面配件ID
  tire?: string           // 轮胎配件ID
}

export interface UnlockedAccessories {
  [accessoryId: string]: boolean
}
