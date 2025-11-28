/**
 * 外观定制系统类型定义
 */

// 车辆涂装
export interface VehicleSkin {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  primaryColor: string
  secondaryColor: string
  pattern?: 'solid' | 'stripe' | 'camo' | 'flame' | 'skull' | 'tribal'
  unlockCondition?: {
    type: 'distance' | 'kills' | 'boss' | 'achievement' | 'purchase'
    value: number | string
  }
}

// 车辆贴纸
export interface VehicleDecal {
  id: string
  name: string
  icon: string
  position: 'front' | 'side' | 'rear' | 'roof'
  unlockCondition?: {
    type: 'distance' | 'kills' | 'boss' | 'achievement' | 'purchase'
    value: number | string
  }
}

// 车辆装饰物
export interface VehicleOrnament {
  id: string
  name: string
  icon: string
  description: string
  position: 'antenna' | 'hood' | 'mirror'
  unlockCondition?: {
    type: 'distance' | 'kills' | 'boss' | 'achievement' | 'purchase'
    value: number | string
  }
}

// 幸存者外观
export interface SurvivorAppearance {
  id: string
  name: string
  icon: string
  type: 'outfit' | 'hat' | 'accessory'
  rarity: 'common' | 'rare' | 'epic'
  unlockCondition?: {
    type: 'distance' | 'kills' | 'boss' | 'achievement' | 'purchase'
    value: number | string
  }
}

// 玩家自定义配置
export interface CustomizationState {
  // 车辆外观
  vehicleSkin: string | null
  vehicleDecals: string[]
  vehicleOrnament: string | null
  
  // 已解锁的外观
  unlockedSkins: string[]
  unlockedDecals: string[]
  unlockedOrnaments: string[]
  unlockedOutfits: string[]
}
