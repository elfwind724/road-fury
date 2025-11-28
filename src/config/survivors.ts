/**
 * 幸存者配置 - 按设计文档
 */

import type { SkillConfig, PersonalityConfig, SurvivorSkill, SurvivorPersonality, SurvivorRarity } from '@/types/survivor'

// 职业配置表
export const SKILL_CONFIGS: SkillConfig[] = [
  {
    skill: 'mechanic',
    name: '机械师',
    icon: '🔧',
    rarity: 'common',
    mainBonus: '维修效率+50%',
    subBonus: '建造时间-20%',
    facilityTypes: ['workbench', 'repair_shop', 'fuel_generator'],
    bonusMultiplier: 1.5,
  },
  {
    skill: 'chef',
    name: '厨师',
    icon: '👨‍🍳',
    rarity: 'common',
    mainBonus: '烹饪产出+30%',
    subBonus: '解锁特殊食谱',
    facilityTypes: ['kitchen'],
    bonusMultiplier: 1.3,
  },
  {
    skill: 'doctor',
    name: '医生',
    icon: '🩺',
    rarity: 'rare',
    mainBonus: '治疗效果×2',
    subBonus: '疾病预防+30%',
    facilityTypes: ['medical_bay'],
    bonusMultiplier: 2.0,
  },
  {
    skill: 'shooter',
    name: '射手',
    icon: '🎯',
    rarity: 'rare',
    mainBonus: '炮台伤害+25%',
    subBonus: '弹药消耗-15%',
    facilityTypes: ['turret'],
    bonusMultiplier: 1.25,
  },
  {
    skill: 'farmer',
    name: '农夫',
    icon: '🌾',
    rarity: 'common',
    mainBonus: '种植产出+40%',
    subBonus: '动物产出+20%',
    facilityTypes: ['planter', 'animal_cage'],
    bonusMultiplier: 1.4,
  },
  {
    skill: 'communicator',
    name: '通讯员',
    icon: '📻',
    rarity: 'rare',
    mainBonus: '幸存者发现+20%',
    subBonus: '事件预警',
    facilityTypes: ['radio'],
    bonusMultiplier: 1.2,
  },
  {
    skill: 'engineer',
    name: '工程师',
    icon: '⚙️',
    rarity: 'epic',
    mainBonus: '电力效率+30%',
    subBonus: '设施升级-30%材料',
    facilityTypes: ['solar_panel', 'battery', 'wind_turbine', 'fuel_generator'],
    bonusMultiplier: 1.3,
  },
  {
    skill: 'soldier',
    name: '军人',
    icon: '🎖️',
    rarity: 'epic',
    mainBonus: '全队防御+15%',
    subBonus: '碾压伤害+10%',
    facilityTypes: ['turret', 'electric_fence', 'armor_plate'],
    bonusMultiplier: 1.15,
  },
]

// 性格配置表
export const PERSONALITY_CONFIGS: PersonalityConfig[] = [
  {
    type: 'optimist',
    name: '乐观',
    category: 'positive',
    positiveEffect: '全队士气+10%',
  },
  {
    type: 'hardworker',
    name: '勤劳',
    category: 'positive',
    positiveEffect: '工作效率+15%',
    negativeEffect: '体力消耗+10%',
  },
  {
    type: 'frugal',
    name: '节俭',
    category: 'positive',
    positiveEffect: '资源消耗-10%',
  },
  {
    type: 'coward',
    name: '胆小',
    category: 'negative',
    negativeEffect: '遇Boss士气-30',
  },
  {
    type: 'glutton',
    name: '贪吃',
    category: 'negative',
    negativeEffect: '食物消耗+30%',
  },
  {
    type: 'loner',
    name: '孤僻',
    category: 'neutral',
    positiveEffect: '单独工作效率+20%',
    negativeEffect: '与他人共处时效率-10%',
  },
  {
    type: 'leader',
    name: '领袖',
    category: 'special',
    positiveEffect: '相邻设施效率+10%',
  },
]

// 随机名字池
const SURVIVOR_NAMES = [
  '小明', '小红', '阿强', '小芳', '大壮', '小丽',
  '老王', '小张', '阿华', '小美', '大刚', '小燕',
  '老李', '小陈', '阿杰', '小玲', '大勇', '小霞',
  '老赵', '小周', '阿伟', '小娟', '大海', '小云',
]

// 获取职业配置
export function getSkillConfig(skill: SurvivorSkill): SkillConfig | undefined {
  return SKILL_CONFIGS.find(s => s.skill === skill)
}

// 获取性格配置
export function getPersonalityConfig(type: SurvivorPersonality): PersonalityConfig | undefined {
  return PERSONALITY_CONFIGS.find(p => p.type === type)
}

// 按稀有度获取职业
export function getSkillsByRarity(rarity: SurvivorRarity): SkillConfig[] {
  return SKILL_CONFIGS.filter(s => s.rarity === rarity)
}

// 随机生成幸存者
export function generateRandomSurvivor(id: string): {
  id: string
  name: string
  skill: SurvivorSkill
  skillLevel: number
  personality: SurvivorPersonality[]
  rarity: SurvivorRarity
  morale: number
  health: number
  hunger: number
  thirst: number
  stamina: number
  loyalty: number
  happiness: number
} {
  // 稀有度权重：普通60%，稀有30%，史诗10%
  const rarityRoll = Math.random()
  let rarity: SurvivorRarity = 'common'
  if (rarityRoll > 0.9) rarity = 'epic'
  else if (rarityRoll > 0.6) rarity = 'rare'

  // 根据稀有度选择职业
  const availableSkills = getSkillsByRarity(rarity)
  const skillConfig = availableSkills[Math.floor(Math.random() * availableSkills.length)]

  // 随机1-2个性格
  const personalityCount = Math.random() > 0.5 ? 2 : 1
  const shuffledPersonalities = [...PERSONALITY_CONFIGS]
    .filter(p => p.category !== 'special' || Math.random() < 0.1) // 特殊性格10%几率
    .sort(() => Math.random() - 0.5)
  const personalities = shuffledPersonalities
    .slice(0, personalityCount)
    .map(p => p.type)

  // 技能等级：普通1-2，稀有2-3，史诗3-4
  const baseLevel = rarity === 'epic' ? 3 : rarity === 'rare' ? 2 : 1
  const skillLevel = baseLevel + Math.floor(Math.random() * 2)

  return {
    id,
    name: SURVIVOR_NAMES[Math.floor(Math.random() * SURVIVOR_NAMES.length)],
    skill: skillConfig.skill,
    skillLevel: Math.min(5, skillLevel),
    personality: personalities,
    rarity,
    morale: 70 + Math.floor(Math.random() * 30),
    health: 80 + Math.floor(Math.random() * 20),
    hunger: 60 + Math.floor(Math.random() * 40),
    thirst: 60 + Math.floor(Math.random() * 40),
    stamina: 70 + Math.floor(Math.random() * 30),
    loyalty: 50 + Math.floor(Math.random() * 30),
    happiness: 60 + Math.floor(Math.random() * 30),
  }
}

// 计算幸存者工作效率
export function calculateSurvivorEfficiency(survivor: {
  skillLevel: number
  personality: SurvivorPersonality[]
  morale: number
  stamina: number
  happiness: number
}, _facilityType: string, hasCoworker: boolean): number {
  let efficiency = 1.0

  // 技能等级加成：1 + 技能等级 × 0.1
  efficiency += survivor.skillLevel * 0.1

  // 士气系数：士气/100（最低0.5，最高1.5）
  const moraleCoeff = Math.max(0.5, Math.min(1.5, survivor.morale / 100))
  efficiency *= moraleCoeff

  // 体力影响：低于20时效率减半
  if (survivor.stamina < 20) {
    efficiency *= 0.5
  }

  // 性格效果
  for (const personality of survivor.personality) {
    switch (personality) {
      case 'hardworker':
        efficiency *= 1.15
        break
      case 'loner':
        efficiency *= hasCoworker ? 0.9 : 1.2
        break
      case 'frugal':
        // 资源消耗减少，不影响效率
        break
    }
  }

  return efficiency
}
