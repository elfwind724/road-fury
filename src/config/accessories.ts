/**
 * 配件配置 - 按设计文档
 */

import type { AccessoryConfig, AccessorySlot } from '@/types/accessory'

export const ACCESSORY_CONFIGS: AccessoryConfig[] = [
  // ========== 前部配件 ==========
  {
    id: 'spike_ram',
    name: '尖刺撞角',
    description: '基础的前部防护，增加碾压伤害',
    icon: '🔱',
    slot: 'front',
    rarity: 'common',
    effects: [
      { type: 'crush_damage', value: 30, isPercent: true },
    ],
    unlockCondition: { type: 'default' },
  },
  {
    id: 'bulldozer',
    name: '推土铲',
    description: '重型推土铲，大幅增加碾压伤害但降低速度',
    icon: '🚜',
    slot: 'front',
    rarity: 'rare',
    effects: [
      { type: 'crush_damage', value: 50, isPercent: true },
      { type: 'speed', value: -10, isPercent: true },
    ],
    unlockCondition: { type: 'distance', value: 100 },
  },
  {
    id: 'chainsaw_array',
    name: '电锯阵列',
    description: '电动链锯阵列，极高碾压伤害但消耗电力',
    icon: '🪚',
    slot: 'front',
    rarity: 'epic',
    effects: [
      { type: 'crush_damage', value: 100, isPercent: true },
      { type: 'energy_consumption', value: 5, isPercent: false },
    ],
    unlockCondition: { type: 'boss', bossType: 'tank' },
  },

  // ========== 侧面配件 ==========
  {
    id: 'guardrail',
    name: '护栏',
    description: '基础侧面防护',
    icon: '🛡️',
    slot: 'side',
    rarity: 'common',
    effects: [
      { type: 'armor', value: 20, isPercent: false },
    ],
    unlockCondition: { type: 'default' },
  },
  {
    id: 'electric_fence',
    name: '电击护栏',
    description: '电击护栏，近身丧尸会受到伤害',
    icon: '⚡',
    slot: 'side',
    rarity: 'rare',
    effects: [
      { type: 'armor', value: 15, isPercent: false },
      { type: 'zombie_damage', value: 10, isPercent: false },
    ],
    unlockCondition: { type: 'craft' },
    craftCost: { scrap: 200, electronics: 100 },
  },
  {
    id: 'spike_wall',
    name: '尖刺护墙',
    description: '尖刺护墙，提供护甲并对近身丧尸造成伤害',
    icon: '🗡️',
    slot: 'side',
    rarity: 'epic',
    effects: [
      { type: 'armor', value: 30, isPercent: false },
      { type: 'zombie_damage', value: 25, isPercent: false },
    ],
    unlockCondition: { type: 'boss', bossType: 'spitter' },
  },

  // ========== 轮胎配件 ==========
  {
    id: 'standard_tire',
    name: '标准轮胎',
    description: '基础轮胎，无特殊效果',
    icon: '🛞',
    slot: 'tire',
    rarity: 'common',
    effects: [],
    unlockCondition: { type: 'default' },
  },
  {
    id: 'offroad_tire',
    name: '越野轮胎',
    description: '在恶劣路况下速度不受影响',
    icon: '🏔️',
    slot: 'tire',
    rarity: 'rare',
    effects: [
      { type: 'terrain_speed', value: 20, isPercent: true },
    ],
    unlockCondition: { type: 'distance', value: 200 },
  },
  {
    id: 'armored_tire',
    name: '装甲轮胎',
    description: '防爆轮胎，大幅降低爆胎几率',
    icon: '🔒',
    slot: 'tire',
    rarity: 'epic',
    effects: [
      { type: 'flat_tire_resist', value: 80, isPercent: true },
      { type: 'speed', value: -5, isPercent: true },
    ],
    unlockCondition: { type: 'craft' },
    craftCost: { scrap: 300, parts: 150 },
  },
]

// 获取配件配置
export function getAccessoryConfig(id: string): AccessoryConfig | undefined {
  return ACCESSORY_CONFIGS.find(a => a.id === id)
}

// 获取指定槽位的配件
export function getAccessoriesForSlot(slot: AccessorySlot): AccessoryConfig[] {
  return ACCESSORY_CONFIGS.filter(a => a.slot === slot)
}

// 获取默认解锁的配件
export function getDefaultAccessories(): string[] {
  return ACCESSORY_CONFIGS
    .filter(a => a.unlockCondition.type === 'default')
    .map(a => a.id)
}

// 检查配件是否可解锁
export function checkAccessoryUnlock(
  accessory: AccessoryConfig,
  totalDistance: number,
  defeatedBosses: string[]
): boolean {
  switch (accessory.unlockCondition.type) {
    case 'default':
      return true
    case 'distance':
      return totalDistance >= Number(accessory.unlockCondition.value || 0)
    case 'boss':
      return defeatedBosses.includes(accessory.unlockCondition.bossType || '')
    case 'craft':
      return true // 制作类配件需要资源，但始终可见
    default:
      return false
  }
}

// 计算配件效果
export function calculateAccessoryEffects(
  equippedAccessories: { front?: string; side?: string; tire?: string }
): {
  crushDamageBonus: number
  speedBonus: number
  armorBonus: number
  energyConsumption: number
  zombieDamage: number
  flatTireResist: number
  terrainSpeedBonus: number
} {
  const result = {
    crushDamageBonus: 0,
    speedBonus: 0,
    armorBonus: 0,
    energyConsumption: 0,
    zombieDamage: 0,
    flatTireResist: 0,
    terrainSpeedBonus: 0,
  }

  const accessoryIds = [
    equippedAccessories.front,
    equippedAccessories.side,
    equippedAccessories.tire,
  ].filter(Boolean) as string[]

  for (const id of accessoryIds) {
    const config = getAccessoryConfig(id)
    if (!config) continue

    for (const effect of config.effects) {
      switch (effect.type) {
        case 'crush_damage':
          result.crushDamageBonus += effect.value
          break
        case 'speed':
          result.speedBonus += effect.value
          break
        case 'armor':
          result.armorBonus += effect.value
          break
        case 'energy_consumption':
          result.energyConsumption += effect.value
          break
        case 'zombie_damage':
          result.zombieDamage += effect.value
          break
        case 'flat_tire_resist':
          result.flatTireResist += effect.value
          break
        case 'terrain_speed':
          result.terrainSpeedBonus += effect.value
          break
      }
    }
  }

  return result
}
