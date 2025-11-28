/**
 * 车辆系统
 * 负责车辆状态管理、变道、伤害处理
 */

import type { VehicleState, VehicleType } from '@/types'
import { getVehicleConfig } from '@/config'

const DEFAULT_MAX_LANES = 3

/**
 * 创建初始车辆状态
 */
export function createVehicle(type: VehicleType): VehicleState {
  const config = getVehicleConfig(type)
  if (!config) {
    throw new Error(`Unknown vehicle type: ${type}`)
  }
  
  return {
    type: config.type,
    stats: {
      power: config.power,
      armor: config.armor,
      energy: 0,
      capacity: config.capacity,
      speed: config.speed,
      crushDamage: config.power * 2,
    },
    durability: config.maxDurability,
    maxDurability: config.maxDurability,
    position: { x: 100, y: 300, lane: 1 },
    facilitySlots: config.slots,
    accessories: {},
  }
}

/**
 * 变道
 */
export function changeLane(
  vehicle: VehicleState,
  direction: 'up' | 'down',
  maxLanes: number = DEFAULT_MAX_LANES
): VehicleState {
  const { lane } = vehicle.position
  let newLane = lane
  
  if (direction === 'up' && lane > 0) {
    newLane = lane - 1
  } else if (direction === 'down' && lane < maxLanes - 1) {
    newLane = lane + 1
  }
  
  if (newLane === lane) {
    return vehicle
  }
  
  return {
    ...vehicle,
    position: {
      ...vehicle.position,
      lane: newLane,
    },
  }
}

/**
 * 受到伤害
 */
export function takeDamage(vehicle: VehicleState, damage: number): VehicleState {
  const actualDamage = Math.max(0, damage)
  const newDurability = Math.max(0, vehicle.durability - actualDamage)
  
  return {
    ...vehicle,
    durability: newDurability,
  }
}

/**
 * 受到丧尸攻击（考虑护甲减伤）
 */
export function takeZombieAttack(vehicle: VehicleState, zombieDamage: number): VehicleState {
  const actualDamage = Math.max(0, zombieDamage - vehicle.stats.armor)
  return takeDamage(vehicle, actualDamage)
}

/**
 * 修复车辆
 */
export function repair(vehicle: VehicleState, amount: number): VehicleState {
  const newDurability = Math.min(vehicle.maxDurability, vehicle.durability + amount)
  
  return {
    ...vehicle,
    durability: newDurability,
  }
}

/**
 * 检查车辆是否损坏
 */
export function isDestroyed(vehicle: VehicleState): boolean {
  return vehicle.durability <= 0
}

/**
 * 获取车辆耐久百分比
 */
export function getDurabilityPercent(vehicle: VehicleState): number {
  return (vehicle.durability / vehicle.maxDurability) * 100
}

/**
 * 计算碾压伤害
 */
export function calculateCrushDamage(vehiclePower: number, damageModifier: number): number {
  return vehiclePower * damageModifier
}
