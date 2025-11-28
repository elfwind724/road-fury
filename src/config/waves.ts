/**
 * 波次和Boss配置表
 */

import type { WaveConfig, BossConfig } from '@/types'

// Boss 配置 - 扩展版
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
        value: 1.5,
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
  // 新增Boss
  {
    type: 'juggernaut',
    name: '毁灭者',
    description: '装甲覆盖的巨型变异体，几乎刀枪不入',
    health: 1000,
    damage: 80,
    speed: 0.3,
    size: 3.0,
    abilities: [
      {
        name: '地震践踏',
        description: '跳跃后重击地面，造成范围伤害',
        cooldown: 10000,
        effect: 'aoe_damage',
        value: 60,
        radius: 120,
      },
      {
        name: '护甲强化',
        description: '短时间内减少受到的伤害',
        cooldown: 20000,
        effect: 'damage_reduction',
        value: 0.5,
      },
    ],
    drops: [
      { type: 'scrap', min: 100, max: 200, chance: 1 },
      { type: 'parts', min: 50, max: 100, chance: 1 },
      { type: 'electronics', min: 30, max: 60, chance: 0.8 },
    ],
    apocalypsePoints: 100,
  },
  {
    type: 'hunter',
    name: '猎手',
    description: '极速移动的变异体，擅长突袭',
    health: 250,
    damage: 60,
    speed: 2.5,
    size: 1.5,
    abilities: [
      {
        name: '闪现突袭',
        description: '瞬间移动到目标身边发动攻击',
        cooldown: 6000,
        effect: 'teleport_attack',
        value: 80,
      },
      {
        name: '致命一击',
        description: '蓄力后发动高伤害攻击',
        cooldown: 15000,
        effect: 'critical_strike',
        value: 150,
      },
    ],
    drops: [
      { type: 'scrap', min: 40, max: 80, chance: 1 },
      { type: 'ammo', min: 30, max: 50, chance: 0.9 },
    ],
    apocalypsePoints: 55,
  },
  {
    type: 'hive_queen',
    name: '蜂巢女王',
    description: '能够持续产生小型丧尸的变异母体',
    health: 600,
    damage: 30,
    speed: 0.6,
    size: 2.5,
    abilities: [
      {
        name: '产卵',
        description: '持续产生小型丧尸',
        cooldown: 5000,
        effect: 'summon',
        value: 3,
        summonCount: 3,
      },
      {
        name: '毒雾',
        description: '释放毒雾造成持续伤害',
        cooldown: 12000,
        effect: 'poison_cloud',
        value: 10,
        radius: 100,
      },
    ],
    drops: [
      { type: 'medicine', min: 30, max: 60, chance: 1 },
      { type: 'food', min: 40, max: 80, chance: 0.8 },
      { type: 'scrap', min: 60, max: 120, chance: 1 },
    ],
    apocalypsePoints: 70,
  },
  {
    type: 'titan',
    name: '泰坦',
    description: '传说中的巨型变异体，末日的化身',
    health: 2000,
    damage: 120,
    speed: 0.2,
    size: 4.0,
    abilities: [
      {
        name: '毁灭光束',
        description: '发射毁灭性光束',
        cooldown: 15000,
        effect: 'beam_attack',
        value: 200,
      },
      {
        name: '召唤精英',
        description: '召唤精英丧尸护卫',
        cooldown: 20000,
        effect: 'summon',
        value: 5,
        summonCount: 5,
      },
      {
        name: '狂暴',
        description: '血量低于50%时进入狂暴状态',
        cooldown: 0,
        effect: 'enrage',
        value: 2.0,
      },
    ],
    drops: [
      { type: 'scrap', min: 200, max: 400, chance: 1 },
      { type: 'parts', min: 100, max: 200, chance: 1 },
      { type: 'electronics', min: 80, max: 150, chance: 1 },
      { type: 'medicine', min: 50, max: 100, chance: 0.8 },
    ],
    apocalypsePoints: 200,
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
 * 获取指定波次配置 - 无尽模式支持
 */
export function getWaveConfig(waveNumber: number): WaveConfig {
  // 如果有预设配置，返回预设
  const preset = WAVE_CONFIGS.find((w) => w.waveNumber === waveNumber)
  if (preset) return preset

  // 无尽模式动态配置（波次6+）
  const baseWave = WAVE_CONFIGS[WAVE_CONFIGS.length - 1]
  const extraWaves = waveNumber - baseWave.waveNumber
  
  // 所有Boss类型循环
  const bossTypes: Array<'tank' | 'spitter' | 'screamer' | 'necromancer' | 'juggernaut' | 'hunter' | 'hive_queen' | 'titan'> = 
    ['tank', 'spitter', 'screamer', 'necromancer', 'juggernaut', 'hunter', 'hive_queen', 'titan']
  
  // 难度递增系数
  const difficultyScale = 1 + extraWaves * 0.15
  
  // 每10波出现泰坦Boss
  const isTitanWave = waveNumber % 10 === 0
  // 每5波出现双Boss
  const isDoubleBossWave = waveNumber % 5 === 0 && !isTitanWave
  
  // 丧尸类型权重随波次变化
  const zombieTypes = [
    { type: 'normal', weight: Math.max(5, 30 - extraWaves * 3) },
    { type: 'fat', weight: Math.max(10, 35 - extraWaves * 2) },
    { type: 'elite', weight: Math.min(40, 20 + extraWaves * 2) },
    { type: 'crawler', weight: Math.min(15, 5 + extraWaves) },
    { type: 'armored', weight: Math.min(15, extraWaves * 2) },
  ]
  
  // 高波次添加更多丧尸类型
  if (waveNumber >= 8) {
    zombieTypes.push({ type: 'exploder', weight: Math.min(10, extraWaves) })
  }
  if (waveNumber >= 10) {
    zombieTypes.push({ type: 'spitter', weight: Math.min(10, extraWaves - 2) })
  }
  if (waveNumber >= 15) {
    zombieTypes.push({ type: 'giant', weight: Math.min(8, extraWaves - 5) })
  }
  if (waveNumber >= 20) {
    zombieTypes.push({ type: 'shadow', weight: Math.min(8, extraWaves - 10) })
    zombieTypes.push({ type: 'toxic', weight: Math.min(8, extraWaves - 10) })
  }
  
  return {
    waveNumber,
    triggerDistance: baseWave.triggerDistance + extraWaves * 2500,
    duration: Math.min(180, 90 + extraWaves * 10),  // 最长3分钟
    spawnRate: Math.min(15, baseWave.spawnRate + extraWaves * 0.8),
    zombieTypes,
    hasElite: true,
    hasBoss: true,
    bossType: isTitanWave ? 'titan' : bossTypes[(waveNumber - 1) % (bossTypes.length - 1)],
    rewards: [
      { type: 'resource', resourceType: 'scrap', amount: Math.round((300 + extraWaves * 100) * difficultyScale) },
      { type: 'resource', resourceType: 'parts', amount: Math.round((120 + extraWaves * 40) * difficultyScale) },
      { type: 'resource', resourceType: 'electronics', amount: Math.round((60 + extraWaves * 20) * difficultyScale) },
      { type: 'apocalypse_points', amount: Math.round((40 + extraWaves * 15) * difficultyScale) },
    ],
    warningTime: 5,
    // 无尽模式特殊标记
    isDoubleBoss: isDoubleBossWave,
    isTitanWave,
  } as WaveConfig
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
