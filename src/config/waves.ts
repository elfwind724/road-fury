/**
 * 波次和Boss配置表
 */

import type { WaveConfig, BossConfig } from '@/types'

// Boss 配置
export const BOSS_CONFIGS: BossConfig[] = [
  {
    type: 'tank',
    name: '坦克丧尸',
    description: '巨大的变异丧尸，拥有极高的生命值和冲撞攻击',
    health: 500,
    damage: 50,
    speed: 0.5,
    size: 2.5,
    abilities: [
      {
        name: '冲撞',
        description: '向前冲撞，造成大量伤害',
        cooldown: 8000,
        effect: 'charge',
        value: 100,
      },
    ],
    drops: [
      { type: 'scrap', min: 50, max: 100, chance: 1 },
      { type: 'parts', min: 20, max: 40, chance: 1 },
      { type: 'electronics', min: 10, max: 20, chance: 0.5 },
    ],
    apocalypsePoints: 50,
  },
  {
    type: 'spitter',
    name: '喷吐者',
    description: '远程攻击型丧尸，喷射腐蚀性酸液',
    health: 300,
    damage: 20,
    speed: 1,
    size: 1.8,
    abilities: [
      {
        name: '酸液喷射',
        description: '喷射酸液造成范围伤害',
        cooldown: 5000,
        effect: 'acid_spit',
        value: 30,
        radius: 60,
      },
    ],
    drops: [
      { type: 'scrap', min: 30, max: 60, chance: 1 },
      { type: 'medicine', min: 10, max: 20, chance: 0.8 },
    ],
    apocalypsePoints: 40,
  },
  {
    type: 'screamer',
    name: '尖啸者',
    description: '发出刺耳尖叫召唤更多丧尸',
    health: 200,
    damage: 15,
    speed: 1.5,
    size: 1.5,
    abilities: [
      {
        name: '召唤',
        description: '尖叫召唤丧尸',
        cooldown: 10000,
        effect: 'summon',
        value: 5,
        summonCount: 5,
      },
    ],
    drops: [
      { type: 'scrap', min: 20, max: 40, chance: 1 },
      { type: 'fabric', min: 15, max: 30, chance: 0.8 },
    ],
    apocalypsePoints: 35,
  },
  {
    type: 'necromancer',
    name: '死灵法师',
    description: '神秘的变异体，能够复活倒下的丧尸',
    health: 400,
    damage: 25,
    speed: 0.8,
    size: 2,
    abilities: [
      {
        name: '复活',
        description: '复活附近死亡的丧尸',
        cooldown: 12000,
        effect: 'summon',
        value: 3,
        summonCount: 3,
        radius: 150,
      },
      {
        name: '强化',
        description: '强化附近丧尸',
        cooldown: 15000,
        effect: 'buff_zombies',
        value: 1.5, // 伤害提升50%
        radius: 200,
      },
    ],
    drops: [
      { type: 'scrap', min: 40, max: 80, chance: 1 },
      { type: 'electronics', min: 15, max: 30, chance: 0.7 },
      { type: 'medicine', min: 10, max: 20, chance: 0.5 },
    ],
    apocalypsePoints: 60,
  },
]

// 波次配置
export const WAVE_CONFIGS: WaveConfig[] = [
  {
    waveNumber: 1,
    triggerDistance: 500,
    duration: 30,
    spawnRate: 2,
    zombieTypes: [
      { type: 'normal', weight: 100 },
    ],
    hasElite: false,
    hasBoss: false,
    rewards: [
      { type: 'resource', resourceType: 'scrap', amount: 50 },
      { type: 'apocalypse_points', amount: 5 },
    ],
    warningTime: 3,
  },
  {
    waveNumber: 2,
    triggerDistance: 1500,
    duration: 45,
    spawnRate: 3,
    zombieTypes: [
      { type: 'normal', weight: 70 },
      { type: 'fat', weight: 30 },
    ],
    hasElite: true,
    hasBoss: false,
    rewards: [
      { type: 'resource', resourceType: 'scrap', amount: 100 },
      { type: 'resource', resourceType: 'parts', amount: 30 },
      { type: 'apocalypse_points', amount: 10 },
    ],
    warningTime: 3,
  },
  {
    waveNumber: 3,
    triggerDistance: 3000,
    duration: 60,
    spawnRate: 4,
    zombieTypes: [
      { type: 'normal', weight: 50 },
      { type: 'fat', weight: 30 },
      { type: 'elite', weight: 20 },
    ],
    hasElite: true,
    hasBoss: false,
    rewards: [
      { type: 'resource', resourceType: 'scrap', amount: 150 },
      { type: 'resource', resourceType: 'parts', amount: 50 },
      { type: 'resource', resourceType: 'electronics', amount: 20 },
      { type: 'apocalypse_points', amount: 15 },
    ],
    warningTime: 5,
  },
  {
    waveNumber: 4,
    triggerDistance: 5000,
    duration: 60,
    spawnRate: 5,
    zombieTypes: [
      { type: 'normal', weight: 40 },
      { type: 'fat', weight: 35 },
      { type: 'elite', weight: 25 },
    ],
    hasElite: true,
    hasBoss: true,
    bossType: 'tank',
    rewards: [
      { type: 'resource', resourceType: 'scrap', amount: 200 },
      { type: 'resource', resourceType: 'parts', amount: 80 },
      { type: 'resource', resourceType: 'electronics', amount: 40 },
      { type: 'apocalypse_points', amount: 25 },
    ],
    warningTime: 5,
  },
  {
    waveNumber: 5,
    triggerDistance: 8000,
    duration: 90,
    spawnRate: 6,
    zombieTypes: [
      { type: 'normal', weight: 30 },
      { type: 'fat', weight: 35 },
      { type: 'elite', weight: 35 },
    ],
    hasElite: true,
    hasBoss: true,
    bossType: 'spitter',
    rewards: [
      { type: 'resource', resourceType: 'scrap', amount: 300 },
      { type: 'resource', resourceType: 'parts', amount: 120 },
      { type: 'resource', resourceType: 'electronics', amount: 60 },
      { type: 'apocalypse_points', amount: 40 },
    ],
    warningTime: 5,
  },
]

/**
 * 获取指定波次配置
 */
export function getWaveConfig(waveNumber: number): WaveConfig {
  // 如果有预设配置，返回预设
  const preset = WAVE_CONFIGS.find((w) => w.waveNumber === waveNumber)
  if (preset) return preset

  // 否则生成动态配置（波次6+）
  const baseWave = WAVE_CONFIGS[WAVE_CONFIGS.length - 1]
  const extraWaves = waveNumber - baseWave.waveNumber
  
  const bossTypes: Array<'tank' | 'spitter' | 'screamer' | 'necromancer'> = 
    ['tank', 'spitter', 'screamer', 'necromancer']
  
  return {
    waveNumber,
    triggerDistance: baseWave.triggerDistance + extraWaves * 3000,
    duration: 90,
    spawnRate: Math.min(10, baseWave.spawnRate + extraWaves),
    zombieTypes: [
      { type: 'normal', weight: Math.max(10, 30 - extraWaves * 5) },
      { type: 'fat', weight: 35 },
      { type: 'elite', weight: Math.min(55, 35 + extraWaves * 5) },
    ],
    hasElite: true,
    hasBoss: true,
    bossType: bossTypes[(waveNumber - 1) % bossTypes.length],
    rewards: [
      { type: 'resource', resourceType: 'scrap', amount: 300 + extraWaves * 100 },
      { type: 'resource', resourceType: 'parts', amount: 120 + extraWaves * 40 },
      { type: 'resource', resourceType: 'electronics', amount: 60 + extraWaves * 20 },
      { type: 'apocalypse_points', amount: 40 + extraWaves * 15 },
    ],
    warningTime: 5,
  }
}

/**
 * 获取Boss配置
 */
export function getBossConfig(type: string): BossConfig | undefined {
  return BOSS_CONFIGS.find((b) => b.type === type)
}

/**
 * 根据距离获取当前应该触发的波次
 */
export function getWaveForDistance(distance: number): WaveConfig | null {
  // 找到最近的未触发波次
  for (let i = 1; i <= 100; i++) {
    const wave = getWaveConfig(i)
    if (wave.triggerDistance > distance) {
      return i > 1 ? getWaveConfig(i - 1) : null
    }
  }
  return null
}
