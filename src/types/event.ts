/**
 * 事件系统类型定义
 */

// 事件类型
export type EventType = 
  | 'encounter'     // 遭遇事件（幸存者、商人等）
  | 'resource'      // 资源事件（发现物资）
  | 'danger'        // 危险事件（陷阱、伏击）
  | 'weather'       // 天气事件
  | 'story'         // 故事事件（剧情推进）
  | 'choice'        // 选择事件（多选项）

// 事件稀有度
export type EventRarity = 'common' | 'uncommon' | 'rare' | 'epic'

// 事件选项效果
export interface EventEffect {
  type: 'resource' | 'survivor' | 'morale' | 'health' | 'damage' | 'weather' | 'spawn_zombie'
  target?: string           // 资源类型或目标
  value: number             // 效果值（正负）
  probability?: number      // 触发概率 0-100
}

// 事件选项
export interface EventChoice {
  id: string
  text: string
  icon: string
  requirements?: {
    resources?: Record<string, number>
    survivors?: number
    facility?: string
  }
  effects: EventEffect[]
  successChance?: number    // 成功概率 0-100
  successEffects?: EventEffect[]
  failEffects?: EventEffect[]
}

// 事件配置
export interface GameEvent {
  id: string
  title: string
  description: string
  icon: string
  type: EventType
  rarity: EventRarity
  choices: EventChoice[]
  triggerConditions?: {
    minDistance?: number
    maxDistance?: number
    minSurvivors?: number
    weather?: string
    hasResource?: string
    hasFacility?: string
  }
  cooldown?: number         // 冷却时间（毫秒）
  oneTime?: boolean         // 是否一次性事件
}

// 事件状态
export interface EventState {
  currentEvent: GameEvent | null
  eventHistory: string[]    // 已触发事件ID
  lastEventTime: number
  eventCooldowns: Record<string, number>
}
