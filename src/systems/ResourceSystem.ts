/**
 * 资源管理系统
 * 负责资源的添加、消耗和容量管理
 */

import type { ResourceState, ResourceType, ResourceDrop } from '@/types'

const DEFAULT_CAPACITY = 100

/**
 * 创建空资源状态
 */
export function createEmptyResources(): ResourceState {
  return {
    scrap: 0,
    parts: 0,
    fabric: 0,
    food: 0,
    medicine: 0,
    fuel: 0,
    electronics: 0,
    ammo: 0,
    water: 0,
    energy: 0,
  }
}

/**
 * 添加资源（带容量上限）
 */
export function addResource(
  resources: ResourceState,
  type: ResourceType,
  amount: number,
  capacity: number = DEFAULT_CAPACITY
): ResourceState {
  const newAmount = Math.min(capacity, resources[type] + amount)
  return {
    ...resources,
    [type]: newAmount,
  }
}

/**
 * 消耗资源
 * 返回 [新状态, 是否成功]
 */
export function consumeResource(
  resources: ResourceState,
  type: ResourceType,
  amount: number
): [ResourceState, boolean] {
  if (resources[type] < amount) {
    return [resources, false]
  }
  
  return [
    {
      ...resources,
      [type]: Math.max(0, resources[type] - amount),
    },
    true,
  ]
}

/**
 * 批量消耗资源
 * 返回 [新状态, 是否成功]
 */
export function consumeResources(
  resources: ResourceState,
  costs: Partial<ResourceState>
): [ResourceState, boolean] {
  // 先检查是否所有资源都足够
  for (const [type, amount] of Object.entries(costs)) {
    if (amount && resources[type as ResourceType] < amount) {
      return [resources, false]
    }
  }
  
  // 执行消耗
  const newResources = { ...resources }
  for (const [type, amount] of Object.entries(costs)) {
    if (amount) {
      newResources[type as ResourceType] -= amount
    }
  }
  
  return [newResources, true]
}

/**
 * 检查是否有足够资源
 */
export function hasEnoughResources(
  resources: ResourceState,
  costs: Partial<ResourceState>
): boolean {
  for (const [type, amount] of Object.entries(costs)) {
    if (amount && resources[type as ResourceType] < amount) {
      return false
    }
  }
  return true
}

/**
 * 获取资源容量（基础 + 加成）
 */
export function getCapacity(baseCapacity: number, bonus: number = 0): number {
  return baseCapacity + bonus
}

/**
 * 处理资源掉落
 */
export function processDrops(
  resources: ResourceState,
  drops: ResourceDrop[],
  capacity: number = DEFAULT_CAPACITY
): ResourceState {
  let newResources = { ...resources }
  
  for (const drop of drops) {
    if (Math.random() <= drop.chance) {
      const amount = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min
      newResources = addResource(newResources, drop.type, amount, capacity)
    }
  }
  
  return newResources
}

/**
 * 计算资源产出/消耗速率
 */
export interface ResourceRate {
  production: Partial<ResourceState>
  consumption: Partial<ResourceState>
  net: Partial<ResourceState>
}

export function calculateResourceRates(
  production: Partial<ResourceState>,
  consumption: Partial<ResourceState>
): ResourceRate {
  const net: Partial<ResourceState> = {}
  const allTypes = new Set([
    ...Object.keys(production),
    ...Object.keys(consumption),
  ]) as Set<ResourceType>
  
  for (const type of allTypes) {
    const prod = production[type] || 0
    const cons = consumption[type] || 0
    net[type] = prod - cons
  }
  
  return { production, consumption, net }
}
