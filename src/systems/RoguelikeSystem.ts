/**
 * Roguelike系统
 * 提供随机升级、词条、祝福等Roguelike元素
 */

// 随机升级选项
export interface UpgradeOption {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'offense' | 'defense' | 'utility' | 'survival' | 'special'
  effect: {
    type: string
    value: number
    duration?: number  // 0表示永久
  }
  stackable: boolean
  maxStacks: number
}

// 升级选项配置
export const UPGRADE_OPTIONS: UpgradeOption[] = [
  // 攻击类
  {
    id: 'damage_boost',
    name: '伤害强化',
    description: '武器伤害+15%',
    icon: '⚔️',
    rarity: 'common',
    category: 'offense',
    effect: { type: 'weapon_damage', value: 0.15 },
    stackable: true,
    maxStacks: 5
  },
  {
    id: 'fire_rate',
    name: '射速提升',
    description: '武器射速+20%',
    icon: '🔫',
    rarity: 'common',
    category: 'offense',
    effect: { type: 'fire_rate', value: 0.2 },
    stackable: true,
    maxStacks: 4
  },
  {
    id: 'crush_damage',
    name: '碾压强化',
    description: '碾压伤害+25%',
    icon: '🚗',
    rarity: 'common',
    category: 'offense',
    effect: { type: 'crush_damage', value: 0.25 },
    stackable: true,
    maxStacks: 5
  },
  {
    id: 'critical_hit',
    name: '暴击几率',
    description: '10%几率造成双倍伤害',
    icon: '💥',
    rarity: 'rare',
    category: 'offense',
    effect: { type: 'critical_chance', value: 0.1 },
    stackable: true,
    maxStacks: 3
  },
  {
    id: 'piercing',
    name: '穿透弹',
    description: '子弹可穿透1个额外目标',
    icon: '🎯',
    rarity: 'rare',
    category: 'offense',
    effect: { type: 'pierce', value: 1 },
    stackable: true,
    maxStacks: 3
  },
  {
    id: 'explosive_rounds',
    name: '爆炸弹',
    description: '子弹命中时造成范围伤害',
    icon: '💣',
    rarity: 'epic',
    category: 'offense',
    effect: { type: 'explosive', value: 30 },
    stackable: false,
    maxStacks: 1
  },
  
  // 防御类
  {
    id: 'armor_boost',
    name: '护甲强化',
    description: '护甲+20',
    icon: '🛡️',
    rarity: 'common',
    category: 'defense',
    effect: { type: 'armor', value: 20 },
    stackable: true,
    maxStacks: 5
  },
  {
    id: 'durability_boost',
    name: '耐久强化',
    description: '最大耐久+50',
    icon: '❤️',
    rarity: 'common',
    category: 'defense',
    effect: { type: 'max_durability', value: 50 },
    stackable: true,
    maxStacks: 5
  },
  {
    id: 'damage_reduction',
    name: '伤害减免',
    description: '受到的伤害-10%',
    icon: '🔰',
    rarity: 'rare',
    category: 'defense',
    effect: { type: 'damage_reduction', value: 0.1 },
    stackable: true,
    maxStacks: 4
  },
  {
    id: 'regeneration',
    name: '自动修复',
    description: '每秒恢复1点耐久',
    icon: '🔧',
    rarity: 'rare',
    category: 'defense',
    effect: { type: 'regen', value: 1 },
    stackable: true,
    maxStacks: 3
  },
  {
    id: 'shield',
    name: '能量护盾',
    description: '获得50点护盾，吸收伤害',
    icon: '🔮',
    rarity: 'epic',
    category: 'defense',
    effect: { type: 'shield', value: 50 },
    stackable: true,
    maxStacks: 3
  },
  
  // 实用类
  {
    id: 'speed_boost',
    name: '速度提升',
    description: '移动速度+10%',
    icon: '💨',
    rarity: 'common',
    category: 'utility',
    effect: { type: 'speed', value: 0.1 },
    stackable: true,
    maxStacks: 5
  },
  {
    id: 'resource_magnet',
    name: '资源磁铁',
    description: '资源拾取范围+50%',
    icon: '🧲',
    rarity: 'common',
    category: 'utility',
    effect: { type: 'pickup_range', value: 0.5 },
    stackable: true,
    maxStacks: 3
  },
  {
    id: 'lucky',
    name: '幸运',
    description: '资源掉落+20%',
    icon: '🍀',
    rarity: 'rare',
    category: 'utility',
    effect: { type: 'drop_rate', value: 0.2 },
    stackable: true,
    maxStacks: 4
  },
  {
    id: 'scavenger',
    name: '拾荒者',
    description: '击杀丧尸额外获得废料',
    icon: '🔍',
    rarity: 'rare',
    category: 'utility',
    effect: { type: 'bonus_scrap', value: 5 },
    stackable: true,
    maxStacks: 3
  },
  
  // 生存类
  {
    id: 'fuel_efficiency',
    name: '燃油效率',
    description: '燃油消耗-15%',
    icon: '⛽',
    rarity: 'common',
    category: 'survival',
    effect: { type: 'fuel_efficiency', value: 0.15 },
    stackable: true,
    maxStacks: 4
  },
  {
    id: 'food_efficiency',
    name: '食物效率',
    description: '食物消耗-15%',
    icon: '🍖',
    rarity: 'common',
    category: 'survival',
    effect: { type: 'food_efficiency', value: 0.15 },
    stackable: true,
    maxStacks: 4
  },
  {
    id: 'morale_boost',
    name: '士气提升',
    description: '幸存者士气+20',
    icon: '😊',
    rarity: 'rare',
    category: 'survival',
    effect: { type: 'morale', value: 20 },
    stackable: true,
    maxStacks: 3
  },
  {
    id: 'facility_boost',
    name: '设施效率',
    description: '设施产出+25%',
    icon: '🏭',
    rarity: 'rare',
    category: 'survival',
    effect: { type: 'facility_efficiency', value: 0.25 },
    stackable: true,
    maxStacks: 3
  },
  
  // 特殊类
  {
    id: 'vampire',
    name: '吸血',
    description: '击杀丧尸恢复1点耐久',
    icon: '🧛',
    rarity: 'epic',
    category: 'special',
    effect: { type: 'lifesteal', value: 1 },
    stackable: true,
    maxStacks: 3
  },
  {
    id: 'berserker',
    name: '狂战士',
    description: '耐久越低，伤害越高（最高+50%）',
    icon: '😤',
    rarity: 'epic',
    category: 'special',
    effect: { type: 'berserker', value: 0.5 },
    stackable: false,
    maxStacks: 1
  },
  {
    id: 'second_chance',
    name: '第二次机会',
    description: '致命伤害时恢复50%耐久（一次性）',
    icon: '💫',
    rarity: 'legendary',
    category: 'special',
    effect: { type: 'revive', value: 0.5 },
    stackable: false,
    maxStacks: 1
  },
  {
    id: 'apocalypse_mode',
    name: '末日模式',
    description: '伤害+100%，但受到的伤害也+50%',
    icon: '☠️',
    rarity: 'legendary',
    category: 'special',
    effect: { type: 'glass_cannon', value: 1 },
    stackable: false,
    maxStacks: 1
  }
]

// 根据稀有度获取升级选项
export function getUpgradesByRarity(rarity: string): UpgradeOption[] {
  return UPGRADE_OPTIONS.filter(u => u.rarity === rarity)
}

// 随机选择升级选项
export function selectRandomUpgrades(
  count: number,
  currentUpgrades: Record<string, number>,
  distance: number
): UpgradeOption[] {
  // 根据距离调整稀有度权重
  const distanceBonus = Math.min(0.3, distance / 30000)
  const weights = {
    common: 50 - distanceBonus * 30,
    rare: 35 + distanceBonus * 10,
    epic: 12 + distanceBonus * 15,
    legendary: 3 + distanceBonus * 5
  }
  
  // 过滤已达上限的升级
  const available = UPGRADE_OPTIONS.filter(u => {
    const currentStacks = currentUpgrades[u.id] || 0
    return currentStacks < u.maxStacks
  })
  
  if (available.length === 0) return []
  
  // 按权重选择
  const selected: UpgradeOption[] = []
  const used = new Set<string>()
  
  while (selected.length < count && selected.length < available.length) {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight
    let selectedRarity = 'common'
    
    for (const [rarity, weight] of Object.entries(weights)) {
      random -= weight
      if (random <= 0) {
        selectedRarity = rarity
        break
      }
    }
    
    const rarityOptions = available.filter(u => 
      u.rarity === selectedRarity && !used.has(u.id)
    )
    
    if (rarityOptions.length > 0) {
      const option = rarityOptions[Math.floor(Math.random() * rarityOptions.length)]
      selected.push(option)
      used.add(option.id)
    }
  }
  
  return selected
}

// 计算升级效果
export function calculateUpgradeEffects(
  upgrades: Record<string, number>
): Record<string, number> {
  const effects: Record<string, number> = {}
  
  for (const [upgradeId, stacks] of Object.entries(upgrades)) {
    const upgrade = UPGRADE_OPTIONS.find(u => u.id === upgradeId)
    if (!upgrade) continue
    
    const effectType = upgrade.effect.type
    const effectValue = upgrade.effect.value * stacks
    
    effects[effectType] = (effects[effectType] || 0) + effectValue
  }
  
  return effects
}

// 获取升级配置
export function getUpgradeConfig(upgradeId: string): UpgradeOption | undefined {
  return UPGRADE_OPTIONS.find(u => u.id === upgradeId)
}

// 稀有度颜色
export const RARITY_COLORS: Record<string, string> = {
  common: '#9e9e9e',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800'
}

// 稀有度名称
export const RARITY_NAMES: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
}
