/**
 * 丧尸类型定义
 */

import type { ResourceDrop } from './resource'

export type ZombieType = 'normal' | 'runner' | 'fat' | 'explosive' | 'elite' | 'doctor' | 'boss'

export type BossType = 'tank' | 'screamer' | 'horde_leader'

export interface ZombieConfig {
  type: ZombieType
  name?: string  // 可选名称，用于Boss等特殊丧尸
  health: number
  damage: number
  speed: number
  drops: ResourceDrop[]
  spawnWeight: number
  minDistance: number  // 最小出现里程
  damageModifier: number  // 碾压伤害修正
}

export interface BossConfig {
  type: BossType
  health: number
  damage: number
  specialAbility: string
  triggerDistance: number
  rewards: Reward[]
}

export interface Reward {
  type: 'resource' | 'blueprint' | 'survivor'
  value: string | number
}
