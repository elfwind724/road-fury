/**
 * 无尽模式系统
 * 提供无限难度递增的Roguelike体验
 */

import type { ZombieConfig, BossConfig } from '@/types'

// 难度等级配置
export interface DifficultyLevel {
  level: number
  name: string
  description: string
  healthMultiplier: number      // 敌人血量倍率
  damageMultiplier: number      // 敌人伤害倍率
  spawnRateMultiplier: number   // 生成速度倍率
  rewardMultiplier: number      // 奖励倍率
  specialModifiers: string[]    // 特殊修改器
}

// 难度等级定义
export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    level: 1,
    name: '新手',
    description: '刚刚开始的旅程',
    healthMultiplier: 1.0,
    damageMultiplier: 1.0,
    spawnRateMultiplier: 1.0,
    rewardMultiplier: 1.0,
    specialModifiers: []
  },
  {
    level: 2,
    name: '普通',
    description: '丧尸开始变得更强',
    healthMultiplier: 1.3,
    damageMultiplier: 1.2,
    spawnRateMultiplier: 1.2,
    rewardMultiplier: 1.2,
    specialModifiers: ['faster_zombies']
  },
  {
    level: 3,
    name: '困难',
    description: '只有强者才能生存',
    healthMultiplier: 1.6,
    damageMultiplier: 1.5,
    spawnRateMultiplier: 1.5,
    rewardMultiplier: 1.5,
    specialModifiers: ['faster_zombies', 'elite_swarm']
  },
  {
    level: 4,
    name: '噩梦',
    description: '末日的真正面貌',
    healthMultiplier: 2.0,
    damageMultiplier: 2.0,
    spawnRateMultiplier: 2.0,
    rewardMultiplier: 2.0,
    specialModifiers: ['faster_zombies', 'elite_swarm', 'boss_rage']
  },
  {
    level: 5,
    name: '地狱',
    description: '只有传说中的幸存者才能到达',
    healthMultiplier: 3.0,
    damageMultiplier: 2.5,
    spawnRateMultiplier: 2.5,
    rewardMultiplier: 3.0,
    specialModifiers: ['faster_zombies', 'elite_swarm', 'boss_rage', 'double_boss']
  }
]

// 根据距离计算难度等级
export function getDifficultyLevel(distance: number): DifficultyLevel {
  // 每5000米提升一个难度等级
  const levelIndex = Math.min(
    DIFFICULTY_LEVELS.length - 1,
    Math.floor(distance / 5000)
  )
  return DIFFICULTY_LEVELS[levelIndex]
}

// 计算无尽模式的难度缩放
export function getEndlessScaling(distance: number): {
  healthScale: number
  damageScale: number
  spawnScale: number
  rewardScale: number
} {
  const baseLevel = getDifficultyLevel(distance)
  
  // 在每个难度等级内继续线性增长
  const distanceInLevel = distance % 5000
  const progressInLevel = distanceInLevel / 5000
  const extraScale = 1 + progressInLevel * 0.5  // 每个等级内额外增长50%
  
  return {
    healthScale: baseLevel.healthMultiplier * extraScale,
    damageScale: baseLevel.damageMultiplier * extraScale,
    spawnScale: baseLevel.spawnRateMultiplier * (1 + progressInLevel * 0.3),
    rewardScale: baseLevel.rewardMultiplier * extraScale
  }
}

// 应用难度缩放到丧尸
export function scaleZombie(
  config: ZombieConfig,
  distance: number
): ZombieConfig {
  const scaling = getEndlessScaling(distance)
  
  return {
    ...config,
    health: Math.round(config.health * scaling.healthScale),
    damage: Math.round(config.damage * scaling.damageScale),
    speed: config.speed * (1 + Math.min(0.5, distance / 20000)), // 速度最多增加50%
    drops: config.drops.map(drop => ({
      ...drop,
      min: Math.round(drop.min * scaling.rewardScale),
      max: Math.round(drop.max * scaling.rewardScale)
    }))
  }
}

// 应用难度缩放到Boss
export function scaleBoss(
  config: BossConfig,
  distance: number
): BossConfig {
  const scaling = getEndlessScaling(distance)
  const difficulty = getDifficultyLevel(distance)
  
  // Boss额外强化
  const bossExtraScale = 1 + Math.floor(distance / 10000) * 0.3
  
  return {
    ...config,
    health: Math.round(config.health * scaling.healthScale * bossExtraScale),
    damage: Math.round(config.damage * scaling.damageScale * bossExtraScale),
    speed: config.speed * (difficulty.specialModifiers.includes('boss_rage') ? 1.3 : 1),
    drops: config.drops.map(drop => ({
      ...drop,
      min: Math.round(drop.min * scaling.rewardScale * bossExtraScale),
      max: Math.round(drop.max * scaling.rewardScale * bossExtraScale)
    })),
    apocalypsePoints: Math.round(config.apocalypsePoints * scaling.rewardScale * bossExtraScale)
  }
}

// 随机事件修改器
export interface RandomModifier {
  id: string
  name: string
  description: string
  icon: string
  duration: number  // 持续时间（毫秒），0表示永久
  effect: {
    type: 'zombie_health' | 'zombie_damage' | 'zombie_speed' | 'spawn_rate' | 
          'resource_drop' | 'vehicle_damage' | 'survivor_morale'
    value: number
  }
}

export const RANDOM_MODIFIERS: RandomModifier[] = [
  {
    id: 'blood_moon',
    name: '血月',
    description: '丧尸变得更加狂暴',
    icon: '🌑',
    duration: 120000,
    effect: { type: 'zombie_damage', value: 1.5 }
  },
  {
    id: 'fog',
    name: '浓雾',
    description: '能见度降低，丧尸更难发现',
    icon: '🌫️',
    duration: 90000,
    effect: { type: 'spawn_rate', value: 0.7 }
  },
  {
    id: 'mutation',
    name: '变异潮',
    description: '丧尸发生变异，更加强壮',
    icon: '☣️',
    duration: 60000,
    effect: { type: 'zombie_health', value: 2.0 }
  },
  {
    id: 'frenzy',
    name: '狂暴',
    description: '丧尸移动速度大幅提升',
    icon: '💨',
    duration: 45000,
    effect: { type: 'zombie_speed', value: 1.5 }
  },
  {
    id: 'scavenger',
    name: '拾荒者',
    description: '资源掉落增加',
    icon: '💰',
    duration: 120000,
    effect: { type: 'resource_drop', value: 2.0 }
  },
  {
    id: 'hope',
    name: '希望之光',
    description: '幸存者士气提升',
    icon: '✨',
    duration: 180000,
    effect: { type: 'survivor_morale', value: 1.3 }
  },
  {
    id: 'swarm',
    name: '尸潮',
    description: '丧尸生成速度翻倍',
    icon: '🧟',
    duration: 60000,
    effect: { type: 'spawn_rate', value: 2.0 }
  },
  {
    id: 'armor_break',
    name: '腐蚀',
    description: '车辆受到的伤害增加',
    icon: '💀',
    duration: 90000,
    effect: { type: 'vehicle_damage', value: 1.5 }
  }
]

// 随机选择修改器
export function selectRandomModifier(): RandomModifier {
  return RANDOM_MODIFIERS[Math.floor(Math.random() * RANDOM_MODIFIERS.length)]
}

// 检查是否应该触发随机修改器
export function shouldTriggerModifier(
  distance: number,
  lastModifierDistance: number
): boolean {
  // 每1000米有30%概率触发
  if (distance - lastModifierDistance < 1000) return false
  return Math.random() < 0.3
}
