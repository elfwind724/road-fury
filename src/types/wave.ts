/**
 * 波次系统类型定义
 */

import type { ResourceType } from './resource'
import type { ZombieType } from './zombie'

// Boss 类型
export type BossType = 'tank' | 'spitter' | 'screamer' | 'necromancer'

// 波次丧尸配置
export interface WaveZombieConfig {
  type: ZombieType
  weight: number          // 生成权重
  count?: number          // 固定数量（可选）
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
  duration: number        // 波次持续时间（秒）
  spawnRate: number       // 每秒生成丧尸数
  zombieTypes: WaveZombieConfig[]
  hasElite: boolean
  hasBoss: boolean
  bossType?: BossType
  rewards: WaveReward[]
  warningTime: number     // 波次开始前警告时间（秒）
}

// 波次状态
export interface WaveState {
  isActive: boolean
  currentWave: number
  timeRemaining: number   // 剩余时间（毫秒）
  zombiesSpawned: number
  zombiesKilled: number
  eliteSpawned: boolean
  bossSpawned: boolean
  bossDefeated: boolean
  isWarning: boolean      // 是否在警告阶段
  warningTimeRemaining: number
}

// Boss 技能
export interface BossAbility {
  name: string
  description: string
  cooldown: number        // 冷却时间（毫秒）
  effect: 'summon' | 'aoe_damage' | 'buff_zombies' | 'charge' | 'acid_spit'
  value: number           // 效果数值
  radius?: number         // 影响范围
  summonCount?: number    // 召唤数量
}

// Boss 配置
export interface BossConfig {
  type: BossType
  name: string
  description: string
  health: number
  damage: number
  speed: number           // 相对于普通丧尸的速度倍率
  size: number            // 大小倍率
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
  isEnraged: boolean      // 狂暴状态（血量低于30%）
}
