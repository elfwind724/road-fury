/**
 * 永久升级技能树配置
 */

import type { SkillNode, SkillTreeBranch, SkillTreeState } from '@/types/skillTree'

export const SKILL_NODES: SkillNode[] = [
  // ========== 战斗分支 ==========
  {
    id: 'combat_1_damage',
    name: '强化碾压',
    description: '增加碾压伤害',
    icon: '💥',
    branch: 'combat',
    tier: 1,
    maxLevel: 5,
    costPerLevel: 10,
    prerequisites: [],
    effects: [{ type: 'crush_damage', value: 5, isPercent: true }],
  },
  {
    id: 'combat_1_weapon',
    name: '武器强化',
    description: '增加武器伤害',
    icon: '🔫',
    branch: 'combat',
    tier: 1,
    maxLevel: 5,
    costPerLevel: 10,
    prerequisites: [],
    effects: [{ type: 'weapon_damage', value: 5, isPercent: true }],
  },
  {
    id: 'combat_2_armor',
    name: '装甲强化',
    description: '增加基础护甲',
    icon: '🛡️',
    branch: 'combat',
    tier: 2,
    maxLevel: 5,
    costPerLevel: 20,
    prerequisites: ['combat_1_damage'],
    effects: [{ type: 'armor', value: 10, isPercent: false }],
  },
  {
    id: 'combat_3_durability',
    name: '钢铁意志',
    description: '增加车辆最大耐久',
    icon: '❤️',
    branch: 'combat',
    tier: 3,
    maxLevel: 3,
    costPerLevel: 30,
    prerequisites: ['combat_2_armor'],
    effects: [{ type: 'durability', value: 50, isPercent: false }],
  },

  // ========== 生存分支 ==========
  {
    id: 'survival_1_food',
    name: '节约粮食',
    description: '减少食物消耗',
    icon: '🍖',
    branch: 'survival',
    tier: 1,
    maxLevel: 5,
    costPerLevel: 10,
    prerequisites: [],
    effects: [{ type: 'food_consumption', value: -5, isPercent: true }],
  },
  {
    id: 'survival_1_water',
    name: '节约用水',
    description: '减少水消耗',
    icon: '💧',
    branch: 'survival',
    tier: 1,
    maxLevel: 5,
    costPerLevel: 10,
    prerequisites: [],
    effects: [{ type: 'water_consumption', value: -5, isPercent: true }],
  },
  {
    id: 'survival_2_capacity',
    name: '扩展仓储',
    description: '增加资源容量',
    icon: '📦',
    branch: 'survival',
    tier: 2,
    maxLevel: 5,
    costPerLevel: 20,
    prerequisites: ['survival_1_food', 'survival_1_water'],
    effects: [{ type: 'resource_capacity', value: 50, isPercent: false }],
  },
  {
    id: 'survival_3_morale',
    name: '乐观精神',
    description: '减少士气衰减',
    icon: '😊',
    branch: 'survival',
    tier: 3,
    maxLevel: 3,
    costPerLevel: 30,
    prerequisites: ['survival_2_capacity'],
    effects: [{ type: 'morale_decay', value: -10, isPercent: true }],
  },

  // ========== 工程分支 ==========
  {
    id: 'engineering_1_energy',
    name: '能源效率',
    description: '增加能源产出',
    icon: '⚡',
    branch: 'engineering',
    tier: 1,
    maxLevel: 5,
    costPerLevel: 10,
    prerequisites: [],
    effects: [{ type: 'energy_production', value: 10, isPercent: true }],
  },
  {
    id: 'engineering_2_facility',
    name: '设施优化',
    description: '增加设施效率',
    icon: '🔧',
    branch: 'engineering',
    tier: 2,
    maxLevel: 5,
    costPerLevel: 20,
    prerequisites: ['engineering_1_energy'],
    effects: [{ type: 'facility_efficiency', value: 5, isPercent: true }],
  },

  // ========== 领导分支 ==========
  {
    id: 'leadership_1_survivor',
    name: '领袖魅力',
    description: '增加幸存者发现几率',
    icon: '👥',
    branch: 'leadership',
    tier: 1,
    maxLevel: 5,
    costPerLevel: 15,
    prerequisites: [],
    effects: [{ type: 'survivor_discovery', value: 5, isPercent: true }],
  },
  {
    id: 'leadership_2_capacity',
    name: '团队扩展',
    description: '增加幸存者容量',
    icon: '🏠',
    branch: 'leadership',
    tier: 2,
    maxLevel: 3,
    costPerLevel: 30,
    prerequisites: ['leadership_1_survivor'],
    effects: [{ type: 'survivor_capacity', value: 1, isPercent: false }],
  },

  // ========== 搜刮分支 ==========
  {
    id: 'scavenging_1_drop',
    name: '搜刮专家',
    description: '增加资源掉落',
    icon: '🔍',
    branch: 'scavenging',
    tier: 1,
    maxLevel: 5,
    costPerLevel: 10,
    prerequisites: [],
    effects: [{ type: 'resource_drop', value: 10, isPercent: true }],
  },
  {
    id: 'scavenging_1_start',
    name: '物资储备',
    description: '增加初始资源',
    icon: '📋',
    branch: 'scavenging',
    tier: 1,
    maxLevel: 5,
    costPerLevel: 10,
    prerequisites: [],
    effects: [{ type: 'starting_resource', value: 20, isPercent: true }],
  },
  {
    id: 'scavenging_2_points',
    name: '末世智慧',
    description: '增加末世点数获取',
    icon: '⭐',
    branch: 'scavenging',
    tier: 2,
    maxLevel: 5,
    costPerLevel: 25,
    prerequisites: ['scavenging_1_drop'],
    effects: [{ type: 'apocalypse_points', value: 10, isPercent: true }],
  },
]

// 获取技能节点
export function getSkillNode(id: string): SkillNode | undefined {
  return SKILL_NODES.find(s => s.id === id)
}

// 获取分支的所有技能
export function getSkillsByBranch(branch: SkillTreeBranch): SkillNode[] {
  return SKILL_NODES.filter(s => s.branch === branch)
}

// 检查技能是否可以升级
export function canUpgradeSkill(
  skillId: string,
  currentState: SkillTreeState,
  apocalypsePoints: number
): { canUpgrade: boolean; reason?: string } {
  const skill = getSkillNode(skillId)
  if (!skill) return { canUpgrade: false, reason: '技能不存在' }

  const currentLevel = currentState[skillId] || 0
  if (currentLevel >= skill.maxLevel) {
    return { canUpgrade: false, reason: '已达最大等级' }
  }

  // 检查前置技能
  for (const prereq of skill.prerequisites) {
    const prereqLevel = currentState[prereq] || 0
    const prereqSkill = getSkillNode(prereq)
    if (!prereqSkill || prereqLevel < 1) {
      return { canUpgrade: false, reason: `需要先解锁 ${prereqSkill?.name || prereq}` }
    }
  }

  // 检查点数
  if (apocalypsePoints < skill.costPerLevel) {
    return { canUpgrade: false, reason: `需要 ${skill.costPerLevel} 末世点数` }
  }

  return { canUpgrade: true }
}

// 计算技能树总效果
export function calculateSkillTreeEffects(state: SkillTreeState): {
  crushDamageBonus: number
  weaponDamageBonus: number
  armorBonus: number
  durabilityBonus: number
  resourceCapacityBonus: number
  foodConsumptionBonus: number
  waterConsumptionBonus: number
  energyProductionBonus: number
  facilityEfficiencyBonus: number
  survivorCapacityBonus: number
  moraleDecayBonus: number
  resourceDropBonus: number
  survivorDiscoveryBonus: number
  startingResourceBonus: number
  apocalypsePointsBonus: number
} {
  const result = {
    crushDamageBonus: 0,
    weaponDamageBonus: 0,
    armorBonus: 0,
    durabilityBonus: 0,
    resourceCapacityBonus: 0,
    foodConsumptionBonus: 0,
    waterConsumptionBonus: 0,
    energyProductionBonus: 0,
    facilityEfficiencyBonus: 0,
    survivorCapacityBonus: 0,
    moraleDecayBonus: 0,
    resourceDropBonus: 0,
    survivorDiscoveryBonus: 0,
    startingResourceBonus: 0,
    apocalypsePointsBonus: 0,
  }

  for (const [skillId, level] of Object.entries(state)) {
    if (level <= 0) continue
    const skill = getSkillNode(skillId)
    if (!skill) continue

    for (const effect of skill.effects) {
      const totalValue = effect.value * level
      switch (effect.type) {
        case 'crush_damage': result.crushDamageBonus += totalValue; break
        case 'weapon_damage': result.weaponDamageBonus += totalValue; break
        case 'armor': result.armorBonus += totalValue; break
        case 'durability': result.durabilityBonus += totalValue; break
        case 'resource_capacity': result.resourceCapacityBonus += totalValue; break
        case 'food_consumption': result.foodConsumptionBonus += totalValue; break
        case 'water_consumption': result.waterConsumptionBonus += totalValue; break
        case 'energy_production': result.energyProductionBonus += totalValue; break
        case 'facility_efficiency': result.facilityEfficiencyBonus += totalValue; break
        case 'survivor_capacity': result.survivorCapacityBonus += totalValue; break
        case 'morale_decay': result.moraleDecayBonus += totalValue; break
        case 'resource_drop': result.resourceDropBonus += totalValue; break
        case 'survivor_discovery': result.survivorDiscoveryBonus += totalValue; break
        case 'starting_resource': result.startingResourceBonus += totalValue; break
        case 'apocalypse_points': result.apocalypsePointsBonus += totalValue; break
      }
    }
  }

  return result
}

// 获取分支信息
export const BRANCH_INFO: Record<SkillTreeBranch, { name: string; icon: string; color: string }> = {
  combat: { name: '战斗', icon: '⚔️', color: '#f44336' },
  survival: { name: '生存', icon: '🏕️', color: '#4caf50' },
  engineering: { name: '工程', icon: '⚙️', color: '#2196f3' },
  leadership: { name: '领导', icon: '👑', color: '#ff9800' },
  scavenging: { name: '搜刮', icon: '🔍', color: '#9c27b0' },
}
