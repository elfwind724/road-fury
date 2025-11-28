/**
 * 设施系统
 * 负责设施的安装、移除、升级和效率计算
 */

import type { FacilityState, FacilityType, ResourceState, FacilityConfig } from '@/types'
import { getFacilityConfig } from '@/config'
import { hasEnoughResources, consumeResources } from './ResourceSystem'

const MAX_FACILITY_LEVEL = 3
const EFFICIENCY_BONUS_PER_LEVEL = 0.5

/**
 * 生成唯一设施 ID
 */
function generateFacilityId(): string {
  return `facility_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 安装设施到指定槽位
 */
export function installFacility(
  facilities: FacilityState[],
  resources: ResourceState,
  type: FacilityType,
  slotId: string
): { facilities: FacilityState[]; resources: ResourceState; success: boolean; error?: string } {
  // 检查槽位是否已被占用
  if (facilities.some(f => f.slotId === slotId)) {
    return { facilities, resources, success: false, error: '槽位已被占用' }
  }
  
  // 获取设施配置
  const config = getFacilityConfig(type)
  if (!config) {
    return { facilities, resources, success: false, error: '未知的设施类型' }
  }
  
  // 检查资源是否足够
  if (!hasEnoughResources(resources, config.baseCost)) {
    return { facilities, resources, success: false, error: '资源不足' }
  }
  
  // 消耗资源
  const [newResources, consumed] = consumeResources(resources, config.baseCost)
  if (!consumed) {
    return { facilities, resources, success: false, error: '资源消耗失败' }
  }
  
  // 创建新设施
  const newFacility: FacilityState = {
    id: generateFacilityId(),
    type,
    level: 1,
    slotId,
    isActive: true,
  }
  
  return {
    facilities: [...facilities, newFacility],
    resources: newResources,
    success: true,
  }
}

/**
 * 移除设施
 */
export function removeFacility(
  facilities: FacilityState[],
  facilityId: string
): FacilityState[] {
  return facilities.filter(f => f.id !== facilityId)
}

/**
 * 升级设施
 */
export function upgradeFacility(
  facilities: FacilityState[],
  resources: ResourceState,
  facilityId: string
): { facilities: FacilityState[]; resources: ResourceState; success: boolean; error?: string } {
  const facilityIndex = facilities.findIndex(f => f.id === facilityId)
  if (facilityIndex === -1) {
    return { facilities, resources, success: false, error: '设施不存在' }
  }
  
  const facility = facilities[facilityIndex]
  if (facility.level >= MAX_FACILITY_LEVEL) {
    return { facilities, resources, success: false, error: '已达到最高等级' }
  }
  
  const config = getFacilityConfig(facility.type)
  if (!config) {
    return { facilities, resources, success: false, error: '设施配置错误' }
  }
  
  // 升级成本为基础成本的 level 倍
  const upgradeCost: Partial<ResourceState> = {}
  for (const [key, value] of Object.entries(config.baseCost)) {
    if (value) {
      upgradeCost[key as keyof ResourceState] = value * facility.level
    }
  }
  
  if (!hasEnoughResources(resources, upgradeCost)) {
    return { facilities, resources, success: false, error: '资源不足' }
  }
  
  const [newResources, consumed] = consumeResources(resources, upgradeCost)
  if (!consumed) {
    return { facilities, resources, success: false, error: '资源消耗失败' }
  }
  
  const newFacilities = [...facilities]
  newFacilities[facilityIndex] = {
    ...facility,
    level: facility.level + 1,
  }
  
  return {
    facilities: newFacilities,
    resources: newResources,
    success: true,
  }
}

/**
 * 计算设施效率
 */
export function getEfficiency(level: number): number {
  return 1 + EFFICIENCY_BONUS_PER_LEVEL * (level - 1)
}

/**
 * 获取设施的实际产出
 */
export function getFacilityProduction(
  facility: FacilityState,
  config: FacilityConfig
): Partial<ResourceState> {
  if (!config.baseProduction) return {}
  
  const efficiency = getEfficiency(facility.level)
  const production: Partial<ResourceState> = {}
  
  for (const [key, value] of Object.entries(config.baseProduction)) {
    if (value) {
      production[key as keyof ResourceState] = Math.floor(value * efficiency)
    }
  }
  
  return production
}

/**
 * 获取设施的实际消耗
 */
export function getFacilityConsumption(
  _facility: FacilityState,
  config: FacilityConfig
): Partial<ResourceState> {
  if (!config.baseConsumption) return {}
  return { ...config.baseConsumption }
}

/**
 * 序列化设施状态
 */
export function serializeFacilities(facilities: FacilityState[]): string {
  return JSON.stringify(facilities)
}

/**
 * 反序列化设施状态
 */
export function deserializeFacilities(json: string): FacilityState[] {
  try {
    const data = JSON.parse(json)
    if (!Array.isArray(data)) {
      throw new Error('Invalid facility data')
    }
    return data as FacilityState[]
  } catch {
    return []
  }
}

/**
 * 获取空闲槽位ID列表
 */
export function getEmptySlotIds(
  facilities: FacilityState[],
  allSlotIds: string[]
): string[] {
  const occupiedSlots = new Set(facilities.map(f => f.slotId))
  return allSlotIds.filter(id => !occupiedSlots.has(id))
}

/**
 * 切换设施激活状态
 */
export function toggleFacility(
  facilities: FacilityState[],
  facilityId: string
): FacilityState[] {
  return facilities.map(f =>
    f.id === facilityId ? { ...f, isActive: !f.isActive } : f
  )
}
