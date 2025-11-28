/**
 * 战斗系统
 * 负责丧尸生成、碾压伤害计算、掉落处理
 */

import type { ZombieConfig, VehicleState, ResourceState, ResourceDrop } from '@/types'
import { getAvailableZombies, selectZombieByWeight, getZombieConfig } from '@/config'
import { processDrops } from './ResourceSystem'

export interface ZombieInstance {
  id: string
  config: ZombieConfig
  health: number
  position: { x: number; y: number; lane: number }
}

export interface CollisionResult {
  zombieKilled: boolean
  vehicleDamage: number
  drops: ResourceDrop[]
}

/**
 * 生成丧尸 ID
 */
function generateZombieId(): string {
  return `zombie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 根据当前里程生成丧尸
 */
export function spawnZombie(
  distance: number,
  lane: number,
  x: number = 800
): ZombieInstance | null {
  const availableZombies = getAvailableZombies(distance)
  if (availableZombies.length === 0) return null
  
  const config = selectZombieByWeight(availableZombies)
  
  return {
    id: generateZombieId(),
    config,
    health: config.health,
    position: { x, y: 0, lane },
  }
}

/**
 * 计算碾压伤害
 * 伤害 = 车辆马力 * 丧尸伤害修正
 */
export function calculateCrushDamage(
  vehiclePower: number,
  damageModifier: number
): number {
  return vehiclePower * damageModifier
}

/**
 * 计算丧尸对车辆的攻击伤害
 * 实际伤害 = max(0, 丧尸攻击 - 车辆护甲)
 */
export function calculateZombieAttack(
  zombieDamage: number,
  vehicleArmor: number
): number {
  return Math.max(0, zombieDamage - vehicleArmor)
}

/**
 * 处理碰撞
 */
export function processCollision(
  zombie: ZombieInstance,
  vehicle: VehicleState
): CollisionResult {
  // 计算碾压伤害
  const crushDamage = calculateCrushDamage(
    vehicle.stats.power,
    zombie.config.damageModifier
  )
  
  // 判断丧尸是否被击杀
  const zombieKilled = crushDamage >= zombie.health
  
  // 计算车辆受到的伤害
  const vehicleDamage = zombieKilled
    ? 0  // 一击必杀不受伤
    : calculateZombieAttack(zombie.config.damage, vehicle.stats.armor)
  
  // 获取掉落（只有击杀才有掉落）
  const drops = zombieKilled ? zombie.config.drops : []
  
  return {
    zombieKilled,
    vehicleDamage,
    drops,
  }
}

/**
 * 处理丧尸掉落并更新资源
 */
export function getDrops(
  resources: ResourceState,
  drops: ResourceDrop[],
  capacity: number = 100
): ResourceState {
  return processDrops(resources, drops, capacity)
}

/**
 * 检查丧尸是否可以在指定里程生成
 */
export function canSpawnAtDistance(zombieType: string, distance: number): boolean {
  const config = getZombieConfig(zombieType)
  if (!config) return false
  return config.minDistance <= distance
}

/**
 * 获取丧尸生成权重（用于测试）
 */
export function getSpawnWeights(distance: number): Map<string, number> {
  const available = getAvailableZombies(distance)
  const weights = new Map<string, number>()
  
  for (const zombie of available) {
    weights.set(zombie.type, zombie.spawnWeight)
  }
  
  return weights
}
