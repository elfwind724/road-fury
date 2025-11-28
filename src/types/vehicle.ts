/**
 * 车辆类型定义 - 增强版
 */

export type VehicleType =
  | 'tricycle'
  | 'van'
  | 'truck'
  | 'bus'
  | 'fortress'
  | 'trailer'

export interface VehicleStats {
  power: number // 马力，影响碾压伤害和速度
  armor: number // 装甲，减少受到的伤害
  energy: number // 能耗，影响续航
  capacity: number // 载重，影响幸存者和物资上限
  speed: number // 速度
  crushDamage: number // 碾压伤害
}

export interface VehiclePosition {
  x: number
  y: number
  lane: number
}

export interface VehicleState {
  type: VehicleType
  stats: VehicleStats
  durability: number
  maxDurability: number
  position: VehiclePosition
  facilitySlots: FacilitySlot[]
  accessories: VehicleAccessories
}

// 槽位类型
export type SlotType = 'universal' | 'survival' | 'energy' | 'weapon' | 'special'

// 设施槽位
export interface FacilitySlot {
  id: string
  type: SlotType
  position: { row: number; col: number } // 车内网格位置
  installedFacilityId?: string
}

// 车辆配件
export interface VehicleAccessories {
  front?: AccessoryItem // 前部配件（撞角等）
  side?: AccessoryItem // 侧面配件（护栏等）
  tire?: AccessoryItem // 轮胎
}

export interface AccessoryItem {
  id: string
  name: string
  type: 'front' | 'side' | 'tire'
  effects: AccessoryEffect[]
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface AccessoryEffect {
  stat: keyof VehicleStats | 'crushDamagePercent' | 'armorPercent'
  value: number
}

export interface ResourceCost {
  scrap?: number
  parts?: number
  fabric?: number
  food?: number
  medicine?: number
  fuel?: number
  electronics?: number
  ammo?: number
  water?: number
}

export interface VehicleTierConfig {
  type: VehicleType
  name: string
  slots: FacilitySlot[]
  armor: number
  power: number
  speed: number
  capacity: number
  maxDurability: number
  upgradeCost: ResourceCost | null
  gridSize: { rows: number; cols: number } // 车内网格大小
}
