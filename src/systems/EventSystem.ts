/**
 * 事件系统
 * 负责随机事件的触发、处理和效果应用
 */

import type { GameEvent, EventChoice, EventEffect, EventState } from '@/types/event'
import type { ResourceState, SurvivorState } from '@/types'
import { getAvailableEvents, selectRandomEvent } from '@/config/events'

// 事件触发间隔（毫秒）
const EVENT_INTERVAL_MIN = 60000   // 最少1分钟
const EVENT_INTERVAL_MAX = 180000  // 最多3分钟

// 初始事件状态
export function createInitialEventState(): EventState {
  return {
    currentEvent: null,
    eventHistory: [],
    lastEventTime: Date.now(),
    eventCooldowns: {}
  }
}

// 检查是否应该触发事件
export function shouldTriggerEvent(
  lastEventTime: number,
  currentTime: number,
  isRunning: boolean
): boolean {
  if (!isRunning) return false
  
  const timeSinceLastEvent = currentTime - lastEventTime
  const minInterval = EVENT_INTERVAL_MIN
  
  if (timeSinceLastEvent < minInterval) return false
  
  // 随时间增加触发概率
  const probability = Math.min(0.8, (timeSinceLastEvent - minInterval) / EVENT_INTERVAL_MAX)
  return Math.random() < probability
}

// 触发随机事件
export function triggerRandomEvent(
  distance: number,
  survivors: SurvivorState[],
  weather: string,
  facilities: string[],
  eventState: EventState
): GameEvent | null {
  const currentTime = Date.now()
  
  const availableEvents = getAvailableEvents(
    distance,
    survivors.length,
    weather,
    facilities,
    eventState.eventHistory,
    eventState.eventCooldowns,
    currentTime
  )
  
  return selectRandomEvent(availableEvents)
}

// 检查选项是否可用
export function isChoiceAvailable(
  choice: EventChoice,
  resources: ResourceState,
  survivors: number,
  facilities: string[]
): boolean {
  if (!choice.requirements) return true
  
  const req = choice.requirements
  
  // 检查资源需求
  if (req.resources) {
    for (const [key, value] of Object.entries(req.resources)) {
      if (resources[key as keyof ResourceState] < value) {
        return false
      }
    }
  }
  
  // 检查幸存者数量
  if (req.survivors && survivors < req.survivors) {
    return false
  }
  
  // 检查设施需求
  if (req.facility && !facilities.includes(req.facility)) {
    return false
  }
  
  return true
}

// 应用事件效果
export function applyEventEffects(
  effects: EventEffect[],
  resources: ResourceState,
  vehicleDurability: number,
  survivors: SurvivorState[]
): {
  resources: ResourceState
  vehicleDurability: number
  survivors: SurvivorState[]
  moraleChange: number
  spawnZombies: number
  weatherChange: string | null
} {
  const newResources = { ...resources }
  let newDurability = vehicleDurability
  let newSurvivors = [...survivors]
  let moraleChange = 0
  let spawnZombies = 0
  let weatherChange: string | null = null
  
  for (const effect of effects) {
    // 检查概率
    if (effect.probability && Math.random() * 100 > effect.probability) {
      continue
    }
    
    switch (effect.type) {
      case 'resource':
        if (effect.target) {
          const key = effect.target as keyof ResourceState
          newResources[key] = Math.max(0, newResources[key] + effect.value)
        }
        break
        
      case 'damage':
        newDurability = Math.max(0, newDurability - effect.value)
        break
        
      case 'health':
        // 对所有幸存者造成伤害
        newSurvivors = newSurvivors.map(s => ({
          ...s,
          health: Math.max(0, Math.min(100, s.health + effect.value))
        }))
        break
        
      case 'morale':
        moraleChange += effect.value
        break
        
      case 'survivor':
        // 添加幸存者的逻辑在外部处理
        break
        
      case 'spawn_zombie':
        spawnZombies += effect.value
        break
        
      case 'weather':
        weatherChange = effect.target || null
        break
    }
  }
  
  // 应用士气变化
  if (moraleChange !== 0) {
    newSurvivors = newSurvivors.map(s => ({
      ...s,
      morale: Math.max(0, Math.min(100, s.morale + moraleChange))
    }))
  }
  
  return {
    resources: newResources,
    vehicleDurability: newDurability,
    survivors: newSurvivors,
    moraleChange,
    spawnZombies,
    weatherChange
  }
}

// 处理选择结果
export function processChoice(
  _event: GameEvent,
  choice: EventChoice,
  resources: ResourceState,
  vehicleDurability: number,
  survivors: SurvivorState[]
): {
  resources: ResourceState
  vehicleDurability: number
  survivors: SurvivorState[]
  moraleChange: number
  spawnZombies: number
  weatherChange: string | null
  success: boolean
} {
  // 检查是否有成功/失败分支
  if (choice.successChance !== undefined) {
    const success = Math.random() * 100 < choice.successChance
    const effects = success ? (choice.successEffects || []) : (choice.failEffects || [])
    
    return {
      ...applyEventEffects(effects, resources, vehicleDurability, survivors),
      success
    }
  }
  
  // 普通效果
  return {
    ...applyEventEffects(choice.effects, resources, vehicleDurability, survivors),
    success: true
  }
}

// 更新事件状态
export function updateEventState(
  eventState: EventState,
  event: GameEvent,
  currentTime: number
): EventState {
  const newHistory = event.oneTime 
    ? [...eventState.eventHistory, event.id]
    : eventState.eventHistory
    
  const newCooldowns = event.cooldown
    ? { ...eventState.eventCooldowns, [event.id]: currentTime }
    : eventState.eventCooldowns
    
  return {
    currentEvent: null,
    eventHistory: newHistory,
    lastEventTime: currentTime,
    eventCooldowns: newCooldowns
  }
}
