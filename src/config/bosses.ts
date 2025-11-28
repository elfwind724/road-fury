/**
 * Boss配置 - 按设计文档
 */

import type { BossConfig, BossType } from '@/types/wave'

export const BOSS_CONFIGS: BossConfig[] = [
  {
    type: 'tank',
    name: '坦克',
    description: '巨大的变异丧尸，拥有极高的生命值和护甲',
    health: 500,
    damage: 30,
    speed: 0.6,
    size: 2.5,
    abilities: [
      {
        name: '冲锋',
        description: '向玩家冲锋，造成大量伤害',
        cooldown: 8000,
        effect: 'charge',
        value: 50,
      },
    ],
    drops: [
      { type: 'scrap', min: 100, max: 200, chance: 1 },
      { type: 'parts', min: 50, max: 100, chance: 1 },
      { type: 'electronics', min: 20, max: 50, chance: 0.8 },
    ],
    apocalypsePoints: 50,
  },
  {
    type: 'spitter',
    name: '喷吐者',
    description: '远程攻击型Boss，喷射腐蚀性酸液',
    health: 300,
    damage: 20,
    speed: 0.8,
    size: 1.8,
    abilities: [
      {
        name: '酸液喷射',
        description: '喷射酸液，造成持续伤害',
        cooldown: 5000,
        effect: 'acid_spit',
        value: 15,
        radius: 60,
      },
    ],
    drops: [
      { type: 'scrap', min: 80, max: 150, chance: 1 },
      { type: 'medicine', min: 20, max: 40, chance: 0.9 },
      { type: 'electronics', min: 15, max: 30, chance: 0.7 },
    ],
    apocalypsePoints: 40,
  },
  {
    type: 'screamer',
    name: '尖啸者',
    description: '能够召唤其他丧尸的Boss',
    health: 250,
    damage: 15,
    speed: 1.0,
    size: 1.5,
    abilities: [
      {
        name: '召唤',
        description: '召唤一群普通丧尸',
        cooldown: 10000,
        effect: 'summon',
        value: 0,
        summonCount: 5,
      },
      {
        name: '狂暴嚎叫',
        description: '增强周围丧尸的攻击力',
        cooldown: 15000,
        effect: 'buff_zombies',
        value: 50,
        radius: 150,
      },
    ],
    drops: [
      { type: 'scrap', min: 60, max: 120, chance: 1 },
      { type: 'fabric', min: 30, max: 60, chance: 0.8 },
      { type: 'ammo', min: 20, max: 40, chance: 0.7 },
    ],
    apocalypsePoints: 35,
  },
  {
    type: 'necromancer',
    name: '死灵法师',
    description: '最强大的Boss，能够复活被击杀的丧尸',
    health: 400,
    damage: 25,
    speed: 0.7,
    size: 2.0,
    abilities: [
      {
        name: '死灵召唤',
        description: '复活周围被击杀的丧尸',
        cooldown: 12000,
        effect: 'summon',
        value: 0,
        summonCount: 3,
      },
      {
        name: '死亡光环',
        description: '对周围造成范围伤害',
        cooldown: 8000,
        effect: 'aoe_damage',
        value: 20,
        radius: 100,
      },
    ],
    drops: [
      { type: 'scrap', min: 150, max: 250, chance: 1 },
      { type: 'parts', min: 80, max: 150, chance: 1 },
      { type: 'electronics', min: 40, max: 80, chance: 0.9 },
      { type: 'medicine', min: 30, max: 60, chance: 0.8 },
    ],
    apocalypsePoints: 80,
  },
]

// 获取Boss配置
export function getBossConfig(type: BossType): BossConfig | undefined {
  return BOSS_CONFIGS.find(b => b.type === type)
}

// 根据波次获取Boss类型
export function getBossForWave(waveNumber: number): BossType | null {
  // 每7波出现Boss
  if (waveNumber % 7 !== 0) return null
  
  // 根据波次选择Boss
  const bossIndex = Math.floor(waveNumber / 7) % BOSS_CONFIGS.length
  return BOSS_CONFIGS[bossIndex].type
}
