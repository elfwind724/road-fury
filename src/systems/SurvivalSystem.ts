/**
 * 生存需求系统
 * 负责饥饿、口渴、健康值的管理
 */

import type { SurvivorState } from '@/types'

// 每小时衰减率
const HUNGER_DECAY_PER_HOUR = 10
const THIRST_DECAY_PER_HOUR = 15
const HEALTH_DECAY_AT_ZERO_HUNGER = 5
const HEALTH_DECAY_AT_ZERO_THIRST = 10

/**
 * 更新单个幸存者的需求值
 */
export function updateSurvivorNeeds(
  survivor: SurvivorState,
  deltaHours: number
): SurvivorState {
  // 计算饥饿衰减
  const hungerDecay = HUNGER_DECAY_PER_HOUR * deltaHours
  const newHunger = Math.max(0, survivor.hunger - hungerDecay)
  
  // 计算口渴衰减
  const thirstDecay = THIRST_DECAY_PER_HOUR * deltaHours
  const newThirst = Math.max(0, survivor.thirst - thirstDecay)
  
  return {
    ...survivor,
    hunger: newHunger,
    thirst: newThirst,
  }
}

/**
 * 根据需求状态更新健康值
 */
export function updateSurvivorHealth(
  survivor: SurvivorState,
  deltaHours: number
): SurvivorState {
  let healthDecay = 0
  
  // 饥饿为零时健康衰减
  if (survivor.hunger <= 0) {
    healthDecay += HEALTH_DECAY_AT_ZERO_HUNGER * deltaHours
  }
  
  // 口渴为零时健康衰减
  if (survivor.thirst <= 0) {
    healthDecay += HEALTH_DECAY_AT_ZERO_THIRST * deltaHours
  }
  
  const newHealth = Math.max(0, survivor.health - healthDecay)
  
  return {
    ...survivor,
    health: newHealth,
  }
}

/**
 * 完整更新幸存者状态（需求 + 健康）
 */
export function updateSurvivor(
  survivor: SurvivorState,
  deltaHours: number
): SurvivorState {
  const afterNeeds = updateSurvivorNeeds(survivor, deltaHours)
  return updateSurvivorHealth(afterNeeds, deltaHours)
}

/**
 * 批量更新所有幸存者
 */
export function updateAllSurvivors(
  survivors: SurvivorState[],
  deltaHours: number
): SurvivorState[] {
  return survivors.map(s => updateSurvivor(s, deltaHours))
}

/**
 * 检查是否游戏结束（所有幸存者死亡）
 */
export function checkGameOver(survivors: SurvivorState[]): boolean {
  if (survivors.length === 0) return false
  return survivors.every(s => s.health <= 0)
}

/**
 * 获取存活的幸存者
 */
export function getAliveSurvivors(survivors: SurvivorState[]): SurvivorState[] {
  return survivors.filter(s => s.health > 0)
}

/**
 * 恢复饥饿值
 */
export function restoreHunger(survivor: SurvivorState, amount: number): SurvivorState {
  return {
    ...survivor,
    hunger: Math.min(100, survivor.hunger + amount),
  }
}

/**
 * 恢复口渴值
 */
export function restoreThirst(survivor: SurvivorState, amount: number): SurvivorState {
  return {
    ...survivor,
    thirst: Math.min(100, survivor.thirst + amount),
  }
}

/**
 * 恢复健康值
 */
export function restoreHealth(survivor: SurvivorState, amount: number): SurvivorState {
  return {
    ...survivor,
    health: Math.min(100, survivor.health + amount),
  }
}

/**
 * 获取衰减常量（用于测试）
 */
export const DECAY_RATES = {
  HUNGER_DECAY_PER_HOUR,
  THIRST_DECAY_PER_HOUR,
  HEALTH_DECAY_AT_ZERO_HUNGER,
  HEALTH_DECAY_AT_ZERO_THIRST,
}
