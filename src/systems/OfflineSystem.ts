/**
 * 离线收益系统
 * 负责计算和应用离线期间的资源收益
 */

import type { ResourceState, RunState } from '@/types'
import { addResource } from './ResourceSystem'

// 离线收益参数
const OFFLINE_RATE_MULTIPLIER = 0.5  // 离线收益为在线的 50%
const MAX_OFFLINE_HOURS = 8          // 最大离线时间 8 小时

// 基础资源产出率（每小时）
const BASE_RESOURCE_RATES: Partial<ResourceState> = {
  scrap: 10,
  food: 5,
  water: 5,
}

export interface OfflineRewards {
  resources: Partial<ResourceState>
  distance: number
  duration: number  // 实际计算的时长（小时）
}

/**
 * 计算离线收益
 */
export function calculateOfflineRewards(
  lastUpdateTime: number,
  currentTime: number = Date.now(),
  baseRates: Partial<ResourceState> = BASE_RESOURCE_RATES
): OfflineRewards {
  // 计算离线时长（小时）
  const offlineMs = currentTime - lastUpdateTime
  const offlineHours = offlineMs / (1000 * 60 * 60)
  
  // 应用最大时长限制
  const effectiveHours = Math.min(offlineHours, MAX_OFFLINE_HOURS)
  
  // 计算资源收益
  const resources: Partial<ResourceState> = {}
  for (const [type, rate] of Object.entries(baseRates)) {
    if (rate) {
      resources[type as keyof ResourceState] = Math.floor(
        rate * effectiveHours * OFFLINE_RATE_MULTIPLIER
      )
    }
  }
  
  // 计算距离增长（假设基础速度为每小时 100）
  const distance = Math.floor(100 * effectiveHours * OFFLINE_RATE_MULTIPLIER)
  
  return {
    resources,
    distance,
    duration: effectiveHours,
  }
}

/**
 * 应用离线收益到游戏状态
 */
export function applyOfflineRewards(
  run: RunState,
  rewards: OfflineRewards,
  capacity: number = 100
): RunState {
  let newResources = { ...run.resources }
  
  // 应用资源收益
  for (const [type, amount] of Object.entries(rewards.resources)) {
    if (amount) {
      newResources = addResource(
        newResources,
        type as keyof ResourceState,
        amount,
        capacity
      )
    }
  }
  
  return {
    ...run,
    resources: newResources,
    distance: run.distance + rewards.distance,
    lastUpdateTime: Date.now(),
  }
}

/**
 * 检查是否有离线收益
 */
export function hasOfflineRewards(
  lastUpdateTime: number,
  minOfflineMinutes: number = 1
): boolean {
  const offlineMs = Date.now() - lastUpdateTime
  const offlineMinutes = offlineMs / (1000 * 60)
  return offlineMinutes >= minOfflineMinutes
}

/**
 * 格式化离线时长显示
 */
export function formatOfflineDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.floor(hours * 60)
    return `${minutes} 分钟`
  }
  
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  
  if (m === 0) {
    return `${h} 小时`
  }
  
  return `${h} 小时 ${m} 分钟`
}

/**
 * 获取常量（用于测试）
 */
export const OFFLINE_CONSTANTS = {
  OFFLINE_RATE_MULTIPLIER,
  MAX_OFFLINE_HOURS,
  BASE_RESOURCE_RATES,
}
