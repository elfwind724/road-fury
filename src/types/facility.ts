/**
 * 设施类型定义 - 增强版
 */

import type { ResourceCost } from './vehicle'

export type FacilityType =
  // 生存类
  | 'bed'
  | 'kitchen'
  | 'water_tank'
  | 'rain_collector'
  | 'planter'
  | 'animal_cage'
  // 能源类
  | 'solar_panel'
  | 'battery'
  | 'wind_turbine'
  | 'fuel_generator'
  // 防御类
  | 'ram'
  | 'turret'
  | 'electric_fence'
  | 'armor_plate'
  // 功能类
  | 'workbench'
  | 'medical_bay'
  | 'radio'
  | 'recreation'
  | 'storage'
  | 'repair_shop'
  | 'auto_pilot'

export type FacilityCategory = 'survival' | 'energy' | 'defense' | 'utility'

export interface FacilityState {
  id: string
  type: FacilityType
  level: number // 1-3
  slotId: string // 安装的槽位ID
  isActive: boolean
  assignedSurvivorId?: string
  lastProductionTime?: number
}

export interface ResourceProduction {
  scrap?: number
  parts?: number
  fabric?: number
  food?: number
  medicine?: number
  fuel?: number
  electronics?: number
  ammo?: number
  water?: number
  energy?: number
}

export interface ResourceConsumption {
  scrap?: number
  parts?: number
  fabric?: number
  food?: number
  medicine?: number
  fuel?: number
  electronics?: number
  ammo?: number
  water?: number
  energy?: number
}

export interface FacilityEffect {
  type:
    | 'hunger_restore'
    | 'thirst_restore'
    | 'health_restore'
    | 'morale_boost'
    | 'damage'
    | 'storage'
    | 'survivor_capacity'
    | 'armor'
    | 'speed'
    | 'survivor_discovery'
    | 'auto_drive'
  value: number
}

export interface FacilityConfig {
  type: FacilityType
  name: string
  description: string
  category: FacilityCategory
  slotTypes: string[] // 可安装的槽位类型
  baseCost: ResourceCost
  baseProduction?: ResourceProduction
  baseConsumption?: ResourceConsumption
  effects?: FacilityEffect[]
  maxLevel: number
  icon: string
  requiresSurvivor?: boolean // 是否需要幸存者操作
  survivorSkillBonus?: string // 匹配的幸存者技能
}
