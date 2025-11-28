/**
 * 路况事件系统
 * 负责随机事件触发、天气效果、路障处理
 */

import type { ResourceState } from '@/types'

// 天气类型
export type WeatherType = 'sunny' | 'rainy' | 'foggy' | 'stormy'

// 事件类型
export type EventType = 'encounter' | 'loot' | 'danger' | 'weather' | 'roadblock'

// 事件配置
export interface GameEvent {
  id: string
  type: EventType
  name: string
  description: string
  minDistance: number
  weight: number
  options: EventOption[]
}

export interface EventOption {
  id: string
  text: string
  outcome: EventOutcome
}

export interface EventOutcome {
  type: 'resource' | 'damage' | 'survivor' | 'nothing'
  value?: number | Partial<ResourceState>
  message: string
}

// 天气效果
export interface WeatherEffect {
  weather: WeatherType
  facilityModifiers: Record<string, number>
  description: string
}

// 路障配置
export interface Roadblock {
  id: string
  name: string
  requiredPower: number
  alternativeAction?: string
  reward?: Partial<ResourceState>
}

// 天气效果表
const WEATHER_EFFECTS: WeatherEffect[] = [
  {
    weather: 'sunny',
    facilityModifiers: { solar_panel: 1.5 },
    description: '晴天，太阳能板效率提升',
  },
  {
    weather: 'rainy',
    facilityModifiers: { solar_panel: 0.5, rain_collector: 2.0 },
    description: '雨天，太阳能板效率降低，雨水收集器效率提升',
  },
  {
    weather: 'foggy',
    facilityModifiers: {},
    description: '雾天，视野受限',
  },
  {
    weather: 'stormy',
    facilityModifiers: { solar_panel: 0, wind_turbine: 2.0 },
    description: '暴风雨，太阳能板停止工作，风力发电机效率提升',
  },
]

// 默认事件池
const DEFAULT_EVENTS: GameEvent[] = [
  {
    id: 'abandoned_car',
    type: 'loot',
    name: '废弃车辆',
    description: '路边有一辆废弃的车辆，看起来还有些零件可以拆卸。',
    minDistance: 0,
    weight: 30,
    options: [
      {
        id: 'search',
        text: '搜索车辆',
        outcome: { type: 'resource', value: { scrap: 20, parts: 10 }, message: '你找到了一些有用的零件！' },
      },
      {
        id: 'ignore',
        text: '继续前进',
        outcome: { type: 'nothing', message: '你决定不浪费时间。' },
      },
    ],
  },
  {
    id: 'survivor_signal',
    type: 'encounter',
    name: '求救信号',
    description: '你收到了附近的求救信号。',
    minDistance: 100,
    weight: 20,
    options: [
      {
        id: 'help',
        text: '前去救援',
        outcome: { type: 'survivor', value: 1, message: '你救下了一名幸存者！' },
      },
      {
        id: 'ignore',
        text: '忽略信号',
        outcome: { type: 'nothing', message: '你选择了安全第一。' },
      },
    ],
  },
]


/**
 * 从事件池中选择事件
 */
export function selectEvent(
  distance: number,
  events: GameEvent[] = DEFAULT_EVENTS
): GameEvent | null {
  // 过滤可用事件
  const availableEvents = events.filter(e => e.minDistance <= distance)
  if (availableEvents.length === 0) return null
  
  // 按权重随机选择
  const totalWeight = availableEvents.reduce((sum, e) => sum + e.weight, 0)
  let random = Math.random() * totalWeight
  
  for (const event of availableEvents) {
    random -= event.weight
    if (random <= 0) {
      return event
    }
  }
  
  return availableEvents[0]
}

/**
 * 触发事件
 */
export function triggerEvent(
  distance: number,
  events?: GameEvent[]
): GameEvent | null {
  return selectEvent(distance, events)
}

/**
 * 应用事件结果
 */
export function applyEventOutcome(
  outcome: EventOutcome,
  resources: ResourceState
): { resources: ResourceState; message: string } {
  if (outcome.type === 'resource' && outcome.value) {
    const newResources = { ...resources }
    const resourceValue = outcome.value as Partial<ResourceState>
    
    for (const [key, value] of Object.entries(resourceValue)) {
      if (value) {
        newResources[key as keyof ResourceState] += value
      }
    }
    
    return { resources: newResources, message: outcome.message }
  }
  
  return { resources, message: outcome.message }
}

/**
 * 获取天气效果
 */
export function getWeatherEffect(weather: WeatherType): WeatherEffect | undefined {
  return WEATHER_EFFECTS.find(w => w.weather === weather)
}

/**
 * 应用天气效果到设施效率
 */
export function applyWeatherToFacility(
  facilityType: string,
  baseEfficiency: number,
  weather: WeatherType
): number {
  const effect = getWeatherEffect(weather)
  if (!effect) return baseEfficiency
  
  const modifier = effect.facilityModifiers[facilityType]
  if (modifier === undefined) return baseEfficiency
  
  return baseEfficiency * modifier
}

/**
 * 检查是否能通过路障
 */
export function canPassRoadblock(
  vehiclePower: number,
  requiredPower: number
): boolean {
  return vehiclePower >= requiredPower
}

/**
 * 处理路障
 */
export function processRoadblock(
  roadblock: Roadblock,
  vehiclePower: number
): { passed: boolean; reward?: Partial<ResourceState> } {
  const passed = canPassRoadblock(vehiclePower, roadblock.requiredPower)
  
  return {
    passed,
    reward: passed ? roadblock.reward : undefined,
  }
}

/**
 * 随机天气变化
 */
export function randomWeather(): WeatherType {
  const weathers: WeatherType[] = ['sunny', 'rainy', 'foggy', 'stormy']
  const weights = [50, 25, 15, 10]
  
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight
  
  for (let i = 0; i < weathers.length; i++) {
    random -= weights[i]
    if (random <= 0) {
      return weathers[i]
    }
  }
  
  return 'sunny'
}

/**
 * 获取默认事件池（用于测试）
 */
export function getDefaultEvents(): GameEvent[] {
  return [...DEFAULT_EVENTS]
}

/**
 * 获取天气效果表（用于测试）
 */
export function getWeatherEffects(): WeatherEffect[] {
  return [...WEATHER_EFFECTS]
}
