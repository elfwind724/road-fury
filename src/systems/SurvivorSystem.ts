/**
 * 幸存者系统
 * 负责幸存者招募、技能加成、士气管理、性格互动
 */

import type { SurvivorState, SurvivorSkill, SurvivorPersonality, FacilityType } from '@/types'

// 士气衰减率（每小时）
const MORALE_DECAY_RATE = 2
// 士气离开阈值
const MORALE_LEAVE_THRESHOLD = 20
// 离开概率（每次检查）
const LEAVE_CHANCE = 0.1

// 性格效果配置
export const PERSONALITY_EFFECTS: Record<SurvivorPersonality, {
  moraleModifier: number        // 士气变化率修正（每小时）
  efficiencyModifier: number    // 工作效率修正
  consumptionModifier: {        // 消耗修正
    food?: number
    water?: number
    stamina?: number
  }
  socialModifier: number        // 社交影响（对其他幸存者士气的影响）
  specialEffect?: string        // 特殊效果描述
}> = {
  optimist: {
    moraleModifier: 2,
    efficiencyModifier: 0,
    consumptionModifier: {},
    socialModifier: 5,          // 乐观者提升周围人士气
    specialEffect: '全队士气+10%'
  },
  hardworker: {
    moraleModifier: 0,
    efficiencyModifier: 0.15,
    consumptionModifier: { stamina: 0.1 },
    socialModifier: 0,
    specialEffect: '工作效率+15%, 体力消耗+10%'
  },
  frugal: {
    moraleModifier: 0,
    efficiencyModifier: 0,
    consumptionModifier: { food: -0.1, water: -0.1 },
    socialModifier: 0,
    specialEffect: '资源消耗-10%'
  },
  coward: {
    moraleModifier: -1,
    efficiencyModifier: 0,
    consumptionModifier: {},
    socialModifier: -3,         // 胆小者降低周围人士气
    specialEffect: '遇Boss士气-30'
  },
  glutton: {
    moraleModifier: 1,          // 吃得多但开心
    efficiencyModifier: 0,
    consumptionModifier: { food: 0.3 },
    socialModifier: 0,
    specialEffect: '食物消耗+30%'
  },
  loner: {
    moraleModifier: 0,
    efficiencyModifier: 0,      // 基础效率在calculateEfficiency中处理
    consumptionModifier: {},
    socialModifier: -2,
    specialEffect: '单独工作效率+20%, 与他人共处时效率-10%'
  },
  leader: {
    moraleModifier: 1,
    efficiencyModifier: 0,
    consumptionModifier: {},
    socialModifier: 8,          // 领袖大幅提升团队士气
    specialEffect: '相邻设施效率+10%'
  }
}

// 技能与设施匹配表
const SKILL_FACILITY_MAP: Record<SurvivorSkill, FacilityType[]> = {
  mechanic: ['workbench', 'repair_shop'],
  chef: ['kitchen', 'planter'],
  doctor: ['medical_bay'],
  shooter: ['turret'],
  farmer: ['planter', 'animal_cage'],
  communicator: ['radio'],
  engineer: ['solar_panel', 'battery', 'wind_turbine', 'fuel_generator'],
  soldier: ['turret', 'electric_fence', 'armor_plate'],
}

// 技能加成值
const SKILL_BONUS = 0.25

// 随机名字池
const NAMES = [
  '小明', '小红', '阿强', '小芳', '大壮', '小丽',
  '老王', '小张', '阿华', '小美', '大刚', '小燕',
]

/**
 * 生成幸存者 ID
 */
function generateSurvivorId(): string {
  return `survivor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 随机选择数组元素
 */
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 招募新幸存者
 */
export function recruitSurvivor(): SurvivorState {
  const skills: SurvivorSkill[] = ['mechanic', 'chef', 'doctor', 'shooter', 'farmer', 'communicator', 'engineer', 'soldier']
  const personalities: SurvivorPersonality[] = ['optimist', 'coward', 'glutton', 'loner', 'hardworker', 'frugal', 'leader']
  
  // 随机1-2个性格
  const personalityCount = Math.random() > 0.5 ? 2 : 1
  const shuffledPersonalities = [...personalities].sort(() => Math.random() - 0.5)
  const selectedPersonalities = shuffledPersonalities.slice(0, personalityCount)
  
  return {
    id: generateSurvivorId(),
    name: randomChoice(NAMES),
    skill: randomChoice(skills),
    skillLevel: 1 + Math.floor(Math.random() * 3), // 1-3级
    personality: selectedPersonalities,
    rarity: Math.random() > 0.9 ? 'epic' : Math.random() > 0.6 ? 'rare' : 'common',
    morale: 80,
    health: 100,
    hunger: 100,
    thirst: 100,
    stamina: 80,
    loyalty: 60,
    happiness: 70,
  }
}

/**
 * 分配幸存者到设施
 */
export function assignToFacility(
  survivors: SurvivorState[],
  survivorId: string,
  facilityId: string | undefined
): SurvivorState[] {
  return survivors.map(s =>
    s.id === survivorId
      ? { ...s, assignedFacility: facilityId }
      : s
  )
}

/**
 * 获取技能加成
 */
export function getSkillBonus(
  skill: SurvivorSkill,
  facilityType: FacilityType
): number {
  const matchingFacilities = SKILL_FACILITY_MAP[skill]
  if (matchingFacilities.includes(facilityType)) {
    return SKILL_BONUS
  }
  return 0
}

/**
 * 检查技能是否匹配设施
 */
export function isSkillMatchingFacility(
  skill: SurvivorSkill,
  facilityType: FacilityType
): boolean {
  return SKILL_FACILITY_MAP[skill].includes(facilityType)
}


/**
 * 更新士气 - 完善版
 * 考虑需求、性格、社交互动
 */
export function updateMorale(
  survivor: SurvivorState,
  deltaHours: number,
  allSurvivors?: SurvivorState[]
): SurvivorState {
  let moraleChange = 0
  
  // 基础需求影响
  if (survivor.hunger < 30) {
    moraleChange -= MORALE_DECAY_RATE * deltaHours
  }
  if (survivor.thirst < 30) {
    moraleChange -= MORALE_DECAY_RATE * deltaHours
  }
  if (survivor.health < 50) {
    moraleChange -= MORALE_DECAY_RATE * deltaHours
  }
  if (survivor.stamina < 20) {
    moraleChange -= MORALE_DECAY_RATE * 0.5 * deltaHours
  }
  
  // 性格自身士气修正
  for (const personality of survivor.personality) {
    const effect = PERSONALITY_EFFECTS[personality]
    if (effect) {
      moraleChange += effect.moraleModifier * deltaHours
    }
  }
  
  // 社交互动影响（其他幸存者的性格对自己的影响）
  if (allSurvivors && allSurvivors.length > 1) {
    for (const other of allSurvivors) {
      if (other.id === survivor.id) continue
      
      for (const personality of other.personality) {
        const effect = PERSONALITY_EFFECTS[personality]
        if (effect) {
          // 社交影响按人数分摊
          moraleChange += (effect.socialModifier / allSurvivors.length) * deltaHours
        }
      }
    }
    
    // 孤僻者在人多时士气下降
    if (survivor.personality.includes('loner') && allSurvivors.length > 2) {
      moraleChange -= 2 * deltaHours
    }
  }
  
  // 幸福感影响士气
  if (survivor.happiness > 70) {
    moraleChange += 1 * deltaHours
  } else if (survivor.happiness < 30) {
    moraleChange -= 1 * deltaHours
  }
  
  const newMorale = Math.max(0, Math.min(100, survivor.morale + moraleChange))
  
  return {
    ...survivor,
    morale: newMorale,
  }
}

/**
 * 计算幸存者消耗修正
 */
export function getConsumptionModifier(survivor: SurvivorState): {
  food: number
  water: number
  stamina: number
} {
  let foodMod = 1
  let waterMod = 1
  let staminaMod = 1
  
  for (const personality of survivor.personality) {
    const effect = PERSONALITY_EFFECTS[personality]
    if (effect?.consumptionModifier) {
      if (effect.consumptionModifier.food) {
        foodMod += effect.consumptionModifier.food
      }
      if (effect.consumptionModifier.water) {
        waterMod += effect.consumptionModifier.water
      }
      if (effect.consumptionModifier.stamina) {
        staminaMod += effect.consumptionModifier.stamina
      }
    }
  }
  
  return { food: foodMod, water: waterMod, stamina: staminaMod }
}

/**
 * 计算幸存者工作效率（考虑性格）
 */
export function calculateEfficiency(
  survivor: SurvivorState,
  hasCoworker: boolean
): number {
  let efficiency = 1.0
  
  // 技能等级加成
  efficiency += survivor.skillLevel * 0.1
  
  // 士气影响
  const moraleCoeff = Math.max(0.5, Math.min(1.5, survivor.morale / 100))
  efficiency *= moraleCoeff
  
  // 体力影响
  if (survivor.stamina < 20) {
    efficiency *= 0.5
  }
  
  // 性格效率修正
  for (const personality of survivor.personality) {
    const effect = PERSONALITY_EFFECTS[personality]
    if (effect) {
      efficiency *= (1 + effect.efficiencyModifier)
    }
    
    // 孤僻者特殊处理
    if (personality === 'loner') {
      efficiency *= hasCoworker ? 0.9 : 1.2
    }
  }
  
  return efficiency
}

/**
 * Boss战时性格影响
 */
export function applyBossEncounterEffect(survivors: SurvivorState[]): SurvivorState[] {
  return survivors.map(survivor => {
    let moraleChange = 0
    
    if (survivor.personality.includes('coward')) {
      moraleChange -= 30  // 胆小者遇Boss士气-30
    }
    if (survivor.personality.includes('leader')) {
      moraleChange += 10  // 领袖稳定军心
    }
    
    return {
      ...survivor,
      morale: Math.max(0, Math.min(100, survivor.morale + moraleChange))
    }
  })
}

/**
 * 检查幸存者是否离开
 */
export function checkLeave(survivor: SurvivorState): boolean {
  if (survivor.morale >= MORALE_LEAVE_THRESHOLD) {
    return false
  }
  
  // 士气越低，离开概率越高
  const leaveChance = LEAVE_CHANCE * (1 - survivor.morale / MORALE_LEAVE_THRESHOLD)
  return Math.random() < leaveChance
}

/**
 * 批量更新幸存者士气
 */
export function updateAllMorale(
  survivors: SurvivorState[],
  deltaHours: number
): SurvivorState[] {
  return survivors.map(s => updateMorale(s, deltaHours))
}

/**
 * 处理幸存者离开
 */
export function processLeaving(survivors: SurvivorState[]): {
  remaining: SurvivorState[]
  left: SurvivorState[]
} {
  const remaining: SurvivorState[] = []
  const left: SurvivorState[] = []
  
  for (const survivor of survivors) {
    if (checkLeave(survivor)) {
      left.push(survivor)
    } else {
      remaining.push(survivor)
    }
  }
  
  return { remaining, left }
}

/**
 * 恢复士气
 */
export function restoreMorale(survivor: SurvivorState, amount: number): SurvivorState {
  return {
    ...survivor,
    morale: Math.min(100, survivor.morale + amount),
  }
}

/**
 * 获取常量（用于测试）
 */
export const SURVIVOR_CONSTANTS = {
  MORALE_DECAY_RATE,
  MORALE_LEAVE_THRESHOLD,
  LEAVE_CHANCE,
  SKILL_BONUS,
}
