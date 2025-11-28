/**
 * 幸存者系统
 * 负责幸存者招募、技能加成、士气管理
 */

import type { SurvivorState, SurvivorSkill, SurvivorPersonality, FacilityType } from '@/types'

// 士气衰减率（每小时）
const MORALE_DECAY_RATE = 2
// 士气离开阈值
const MORALE_LEAVE_THRESHOLD = 20
// 离开概率（每次检查）
const LEAVE_CHANCE = 0.1

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
 * 更新士气
 * 需求未满足时士气下降
 */
export function updateMorale(
  survivor: SurvivorState,
  deltaHours: number
): SurvivorState {
  let moraleChange = 0
  
  // 饥饿低于 30 时士气下降
  if (survivor.hunger < 30) {
    moraleChange -= MORALE_DECAY_RATE * deltaHours
  }
  
  // 口渴低于 30 时士气下降
  if (survivor.thirst < 30) {
    moraleChange -= MORALE_DECAY_RATE * deltaHours
  }
  
  // 健康低于 50 时士气下降
  if (survivor.health < 50) {
    moraleChange -= MORALE_DECAY_RATE * deltaHours
  }
  
  // 性格影响
  if (survivor.personality.includes('optimist')) {
    moraleChange += 1 * deltaHours
  }
  if (survivor.personality.includes('coward')) {
    moraleChange -= 0.5 * deltaHours
  }
  
  const newMorale = Math.max(0, Math.min(100, survivor.morale + moraleChange))
  
  return {
    ...survivor,
    morale: newMorale,
  }
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
