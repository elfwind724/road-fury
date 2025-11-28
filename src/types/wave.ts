/**
 * 波次系统类型定义 - 扩展版
 */

import type { ResourceType } from './resource'
import type { ZombieType, BossAbilityEffect } from './zombie'

// Boss 类型 - 扩展
export type BossType =
  | 'tank'
  | 'spitter'
  | 'screamer'
  | 'necromancer'
  | 'juggernaut'
  | 'hunter'
  | 'hive_queen'
  | 'titan'

// 波次丧尸配置
export interface WaveZombieConfig {
  type: ZombieType | string  // 允许字符串以支持动态类型
  weight: number
  count?: number
}

// 波次奖励
export interface WaveReward {
  type: 'resource' | 'blueprint' | 'apocalypse_points'
  resourceType?: ResourceType
  amount: number
}

// 波次配置
export interface WaveConfig {
  waveNumber: number
  triggerDistance: number
  duration: number
  spawnRate: number
  zombieTypes: WaveZombieConfig[]
  hasElite: boolean
  hasBoss: boolean
  bossType?: BossType
  rewards: WaveReward[]
  warningTime: number
  // 无尽模式扩展
  isDoubleBoss?: boolean
  isTitanWave?: boolean
}

// 波次状态
export interface WaveState {
  isActive: boolean
  currentWave: number
  timeRemaining: number
  zombiesSpawned: number
  zombiesKilled: number
  eliteSpawned: boolean
  bossSpawned: boolean
  bossDefeated: boolean
  bossState?: BossState
  isWarning: boolean
  warningTimeRemaining: number
}

// Boss 技能
export interface BossAbility {
  name: string
  description: string
  cooldown: number
  effect: BossAbilityEffect
  value: number
  radius?: number
  summonCount?: number
}

// Boss 配置
export interface BossConfig {
  type: BossType
  name: string
  description: string
  health: number
  damage: number
  speed: number
  size: number
  abilities: BossAbility[]
  drops: { type: ResourceType; min: number; max: number; chance: number }[]
  apocalypsePoints: number
}

// Boss 状态
export interface BossState {
  id: string
  type: BossType
  health: number
  maxHealth: number
  position: { x: number; y: number }
  abilityCooldowns: Map<string, number>
  isEnraged: boolean
}
