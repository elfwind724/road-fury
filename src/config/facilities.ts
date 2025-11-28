/**
 * 设施配置表 - 增强版
 */

import type { FacilityConfig } from '@/types'

export const FACILITY_CONFIGS: FacilityConfig[] = [
  // ========== 生存类设施 ==========
  {
    type: 'bed',
    name: '床铺',
    description: '提供休息空间，恢复幸存者体力',
    category: 'survival',
    slotTypes: ['universal', 'survival'],
    icon: '🛏️',
    baseCost: { scrap: 50, fabric: 30 },
    effects: [
      { type: 'survivor_capacity', value: 1 },
      { type: 'morale_boost', value: 5 },
    ],
    maxLevel: 3,
  },
  {
    type: 'kitchen',
    name: '厨房',
    description: '烹饪食物，恢复饱食度',
    category: 'survival',
    slotTypes: ['universal', 'survival'],
    icon: '🍳',
    baseCost: { scrap: 100, parts: 50 },
    baseConsumption: { food: 2, energy: 5 },
    effects: [{ type: 'hunger_restore', value: 30 }],
    maxLevel: 3,
    requiresSurvivor: true,
    survivorSkillBonus: 'chef',
  },
  {
    type: 'water_tank',
    name: '水箱',
    description: '存储饮用水',
    category: 'survival',
    slotTypes: ['universal', 'survival'],
    icon: '🚰',
    baseCost: { scrap: 80 },
    effects: [
      { type: 'storage', value: 50 },
      { type: 'thirst_restore', value: 20 },
    ],
    maxLevel: 3,
  },
  {
    type: 'rain_collector',
    name: '雨水收集器',
    description: '雨天自动收集水资源',
    category: 'survival',
    slotTypes: ['universal', 'survival'],
    icon: '🌧️',
    baseCost: { scrap: 120, parts: 30 },
    baseProduction: { water: 5 }, // 雨天时产出
    maxLevel: 3,
  },
  {
    type: 'planter',
    name: '种植箱',
    description: '种植蔬菜，持续产出食物',
    category: 'survival',
    slotTypes: ['universal', 'survival'],
    icon: '🌱',
    baseCost: { scrap: 100, fabric: 20 },
    baseProduction: { food: 3 },
    maxLevel: 3,
    requiresSurvivor: true,
    survivorSkillBonus: 'farmer',
  },
  {
    type: 'animal_cage',
    name: '动物笼',
    description: '饲养小动物，产出肉类',
    category: 'survival',
    slotTypes: ['universal', 'survival'],
    icon: '🐔',
    baseCost: { scrap: 150, fabric: 50 },
    baseProduction: { food: 2 },
    baseConsumption: { food: 1 },
    maxLevel: 3,
    requiresSurvivor: true,
    survivorSkillBonus: 'farmer',
  },

  // ========== 能源类设施 ==========
  {
    type: 'solar_panel',
    name: '太阳能板',
    description: '白天产生电力',
    category: 'energy',
    slotTypes: ['universal', 'energy'],
    icon: '☀️',
    baseCost: { scrap: 150, electronics: 100 },
    baseProduction: { energy: 10 },
    maxLevel: 3,
  },
  {
    type: 'battery',
    name: '电池组',
    description: '扩大电力存储上限',
    category: 'energy',
    slotTypes: ['universal', 'energy'],
    icon: '🔋',
    baseCost: { scrap: 100, electronics: 80 },
    effects: [{ type: 'storage', value: 100 }],
    maxLevel: 3,
  },
  {
    type: 'wind_turbine',
    name: '风力发电机',
    description: '行驶时产生电力',
    category: 'energy',
    slotTypes: ['universal', 'energy'],
    icon: '🌀',
    baseCost: { scrap: 200, parts: 100, electronics: 50 },
    baseProduction: { energy: 8 },
    maxLevel: 3,
  },
  {
    type: 'fuel_generator',
    name: '燃油发电机',
    description: '消耗燃料产生大量电力',
    category: 'energy',
    slotTypes: ['universal', 'energy'],
    icon: '⛽',
    baseCost: { scrap: 180, parts: 80 },
    baseProduction: { energy: 20 },
    baseConsumption: { fuel: 2 },
    maxLevel: 3,
    requiresSurvivor: true,
    survivorSkillBonus: 'mechanic',
  },

  // ========== 防御类设施 ==========
  {
    type: 'turret',
    name: '自动炮台',
    description: '自动攻击靠近的丧尸',
    category: 'defense',
    slotTypes: ['universal', 'weapon'],
    icon: '🔫',
    baseCost: { scrap: 200, parts: 150 },
    baseConsumption: { ammo: 1, energy: 3 },
    effects: [{ type: 'damage', value: 5 }],
    maxLevel: 3,
    requiresSurvivor: true,
    survivorSkillBonus: 'shooter',
  },
  {
    type: 'electric_fence',
    name: '电击护栏',
    description: '电击靠近的丧尸',
    category: 'defense',
    slotTypes: ['universal', 'weapon'],
    icon: '⚡',
    baseCost: { scrap: 180, electronics: 100 },
    baseConsumption: { energy: 10 },
    effects: [{ type: 'damage', value: 3 }],
    maxLevel: 3,
  },
  {
    type: 'armor_plate',
    name: '装甲板',
    description: '增加车辆护甲',
    category: 'defense',
    slotTypes: ['universal', 'weapon'],
    icon: '🛡️',
    baseCost: { scrap: 250, parts: 100 },
    effects: [{ type: 'armor', value: 20 }],
    maxLevel: 3,
  },

  // ========== 功能类设施 ==========
  {
    type: 'workbench',
    name: '工作台',
    description: '制作和维修物品',
    category: 'utility',
    slotTypes: ['universal'],
    icon: '🔨',
    baseCost: { scrap: 120, parts: 60 },
    maxLevel: 3,
    requiresSurvivor: true,
    survivorSkillBonus: 'mechanic',
  },
  {
    type: 'medical_bay',
    name: '医疗室',
    description: '治疗伤病',
    category: 'utility',
    slotTypes: ['universal'],
    icon: '🏥',
    baseCost: { scrap: 150, parts: 50, medicine: 20 },
    baseConsumption: { medicine: 1, energy: 5 },
    effects: [{ type: 'health_restore', value: 20 }],
    maxLevel: 3,
    requiresSurvivor: true,
    survivorSkillBonus: 'doctor',
  },
  {
    type: 'radio',
    name: '无线电台',
    description: '增加发现幸存者的几率',
    category: 'utility',
    slotTypes: ['universal'],
    icon: '📻',
    baseCost: { scrap: 100, electronics: 80 },
    baseConsumption: { energy: 3 },
    effects: [{ type: 'survivor_discovery', value: 20 }],
    maxLevel: 3,
    requiresSurvivor: true,
    survivorSkillBonus: 'communicator',
  },
  {
    type: 'recreation',
    name: '娱乐室',
    description: '提升幸存者士气',
    category: 'utility',
    slotTypes: ['universal'],
    icon: '🎮',
    baseCost: { scrap: 80, fabric: 40 },
    effects: [{ type: 'morale_boost', value: 15 }],
    maxLevel: 3,
  },
  {
    type: 'storage',
    name: '仓库',
    description: '增加资源存储上限',
    category: 'utility',
    slotTypes: ['universal'],
    icon: '📦',
    baseCost: { scrap: 100 },
    effects: [{ type: 'storage', value: 50 }],
    maxLevel: 3,
  },
  {
    type: 'repair_shop',
    name: '维修间',
    description: '自动修复车辆耐久',
    category: 'utility',
    slotTypes: ['universal'],
    icon: '🔧',
    baseCost: { scrap: 200, parts: 100 },
    baseConsumption: { parts: 1, energy: 5 },
    maxLevel: 3,
    requiresSurvivor: true,
    survivorSkillBonus: 'mechanic',
  },
  {
    type: 'auto_pilot',
    name: '自动驾驶模块',
    description: '解锁自动巡航模式',
    category: 'utility',
    slotTypes: ['special'],
    icon: '🤖',
    baseCost: { scrap: 500, electronics: 300, parts: 200 },
    effects: [{ type: 'auto_drive', value: 1 }],
    maxLevel: 1,
  },
]

export function getFacilityConfig(type: string): FacilityConfig | undefined {
  return FACILITY_CONFIGS.find((f) => f.type === type)
}

// 按类别分组
export function getFacilitiesByCategory(
  category: string
): FacilityConfig[] {
  return FACILITY_CONFIGS.filter((f) => f.category === category)
}

// 获取可安装到指定槽位类型的设施
export function getFacilitiesForSlot(
  slotType: string
): FacilityConfig[] {
  return FACILITY_CONFIGS.filter((f) => f.slotTypes.includes(slotType))
}
