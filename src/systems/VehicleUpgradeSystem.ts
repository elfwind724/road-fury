/**
 * 车辆升级系统
 * 负责车辆升级、属性提升和设施迁移
 */

import type { VehicleState, FacilityState, ResourceState, VehicleTierConfig, FacilitySlot } from '@/types'
import { getNextVehicleTier } from '@/config'
import { hasEnoughResources, consumeResources } from './ResourceSystem'

export interface UpgradeResult {
  success: boolean
  vehicle?: VehicleState
  facilities?: FacilityState[]
  resources?: ResourceState
  error?: string
}

/**
 * 检查是否可以升级到下一级车辆
 */
export function canUpgrade(
  vehicle: VehicleState,
  resources: ResourceState
): { canUpgrade: boolean; nextTier?: VehicleTierConfig; reason?: string } {
  const nextTier = getNextVehicleTier(vehicle.type)
  
  if (!nextTier) {
    return { canUpgrade: false, reason: '已达到最高级别' }
  }
  
  if (!nextTier.upgradeCost) {
    return { canUpgrade: false, reason: '升级配置错误' }
  }
  
  if (!hasEnoughResources(resources, nextTier.upgradeCost)) {
    return { canUpgrade: false, nextTier, reason: '资源不足' }
  }
  
  return { canUpgrade: true, nextTier }
}

/**
 * 执行车辆升级
 */
export function upgrade(
  vehicle: VehicleState,
  facilities: FacilityState[],
  resources: ResourceState
): UpgradeResult {
  const { canUpgrade: able, nextTier, reason } = canUpgrade(vehicle, resources)
  
  if (!able || !nextTier) {
    return { success: false, error: reason }
  }
  
  // 消耗资源
  const [newResources, consumed] = consumeResources(resources, nextTier.upgradeCost!)
  if (!consumed) {
    return { success: false, error: '资源消耗失败' }
  }
  
  // 创建新车辆
  const newVehicle: VehicleState = {
    type: nextTier.type,
    stats: {
      power: nextTier.power,
      armor: nextTier.armor,
      energy: vehicle.stats.energy,
      capacity: nextTier.capacity,
      speed: nextTier.speed,
      crushDamage: nextTier.power * 2,
    },
    durability: nextTier.maxDurability,
    maxDurability: nextTier.maxDurability,
    position: vehicle.position,
    facilitySlots: nextTier.slots,
    accessories: vehicle.accessories,
  }
  
  // 迁移设施
  const migratedFacilities = migrateFacilities(facilities, nextTier.slots)
  
  return {
    success: true,
    vehicle: newVehicle,
    facilities: migratedFacilities,
    resources: newResources,
  }
}

/**
 * 迁移设施到新车辆
 */
export function migrateFacilities(
  facilities: FacilityState[],
  newSlots: FacilitySlot[]
): FacilityState[] {
  const newSlotIds = newSlots.map(s => s.id)
  const migrated: FacilityState[] = []
  
  // 保留能放下的设施（按原顺序）
  for (let i = 0; i < Math.min(facilities.length, newSlots.length); i++) {
    migrated.push({
      ...facilities[i],
      slotId: newSlotIds[i],
    })
  }
  
  return migrated
}

/**
 * 升级单个属性
 */
export function upgradeAttribute(
  vehicle: VehicleState,
  attribute: 'power' | 'armor' | 'capacity' | 'speed',
  amount: number
): VehicleState {
  return {
    ...vehicle,
    stats: {
      ...vehicle.stats,
      [attribute]: vehicle.stats[attribute] + amount,
    },
  }
}

/**
 * 获取升级所需资源
 */
export function getUpgradeCost(vehicleType: string): Partial<ResourceState> | null {
  const nextTier = getNextVehicleTier(vehicleType)
  return nextTier?.upgradeCost || null
}
