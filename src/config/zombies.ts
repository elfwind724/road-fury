/**
 * 丧尸配置表 - 扩展版
 */

import type { ZombieConfig } from '@/types'

export const ZOMBIE_CONFIGS: ZombieConfig[] = [
  // 基础丧尸
  {
    type: 'normal',
    health: 10,
    damage: 15,
    speed: 1,
    damageModifier: 1.0,
    spawnWeight: 70,
    minDistance: 0,
    drops: [
      { type: 'scrap', min: 5, max: 10, chance: 1.0 },
      { type: 'fabric', min: 2, max: 5, chance: 0.5 },
    ],
  },
  {
    type: 'fat',
    health: 50,
    damage: 30,
    speed: 0.5,
    damageModifier: 0.8,
    spawnWeight: 20,
    minDistance: 100,
    drops: [
      { type: 'food', min: 10, max: 20, chance: 1.0 },
    ],
  },
  {
    type: 'elite',
    health: 60,           // 降低血量 100->60，更容易击杀
    damage: 40,           // 稍微降低伤害 50->40
    speed: 1.3,           // 稍微降低速度 1.5->1.3
    damageModifier: 1.2,
    spawnWeight: 8,       // 降低生成权重 10->8
    minDistance: 800,     // 提高出现距离 500->800
    drops: [
      { type: 'electronics', min: 5, max: 10, chance: 1.0 },
      { type: 'parts', min: 10, max: 20, chance: 0.7 },
    ],
  },
  // 新增丧尸类型
  {
    type: 'crawler',
    health: 15,
    damage: 20,
    speed: 2.0,
    damageModifier: 0.9,
    spawnWeight: 15,
    minDistance: 300,
    drops: [
      { type: 'scrap', min: 8, max: 15, chance: 1.0 },
    ],
  },
  {
    type: 'armored',
    health: 150,
    damage: 40,
    speed: 0.7,
    damageModifier: 0.5,  // 受到的碾压伤害减半
    spawnWeight: 8,
    minDistance: 1000,
    drops: [
      { type: 'parts', min: 15, max: 30, chance: 1.0 },
      { type: 'scrap', min: 20, max: 40, chance: 0.8 },
    ],
  },
  {
    type: 'exploder',
    health: 30,
    damage: 80,  // 爆炸伤害高
    speed: 0.8,
    damageModifier: 1.0,
    spawnWeight: 5,
    minDistance: 1500,
    drops: [
      { type: 'fuel', min: 10, max: 20, chance: 0.8 },
      { type: 'scrap', min: 15, max: 25, chance: 1.0 },
    ],
  },
  {
    type: 'spitter',
    health: 40,
    damage: 25,
    speed: 1.0,
    damageModifier: 1.0,
    spawnWeight: 8,
    minDistance: 2000,
    drops: [
      { type: 'medicine', min: 5, max: 15, chance: 0.7 },
      { type: 'scrap', min: 10, max: 20, chance: 1.0 },
    ],
  },
  {
    type: 'giant',
    health: 300,
    damage: 100,
    speed: 0.4,
    damageModifier: 0.6,
    spawnWeight: 3,
    minDistance: 3000,
    drops: [
      { type: 'parts', min: 30, max: 60, chance: 1.0 },
      { type: 'electronics', min: 15, max: 30, chance: 0.8 },
      { type: 'scrap', min: 50, max: 100, chance: 1.0 },
    ],
  },
  {
    type: 'shadow',
    health: 60,
    damage: 35,
    speed: 2.5,
    damageModifier: 1.5,
    spawnWeight: 5,
    minDistance: 4000,
    drops: [
      { type: 'electronics', min: 10, max: 25, chance: 1.0 },
      { type: 'fabric', min: 10, max: 20, chance: 0.6 },
    ],
  },
  {
    type: 'toxic',
    health: 80,
    damage: 30,
    speed: 1.0,
    damageModifier: 1.0,
    spawnWeight: 6,
    minDistance: 5000,
    drops: [
      { type: 'medicine', min: 15, max: 30, chance: 1.0 },
      { type: 'fuel', min: 5, max: 15, chance: 0.5 },
    ],
  },
]

export function getZombieConfig(type: string): ZombieConfig | undefined {
  return ZOMBIE_CONFIGS.find(z => z.type === type)
}

/**
 * 根据当前里程获取可生成的丧尸类型
 */
export function getAvailableZombies(distance: number): ZombieConfig[] {
  return ZOMBIE_CONFIGS.filter(z => z.minDistance <= distance)
}

/**
 * 根据权重随机选择丧尸类型
 */
export function selectZombieByWeight(availableZombies: ZombieConfig[]): ZombieConfig {
  const totalWeight = availableZombies.reduce((sum, z) => sum + z.spawnWeight, 0)
  let random = Math.random() * totalWeight
  
  for (const zombie of availableZombies) {
    random -= zombie.spawnWeight
    if (random <= 0) {
      return zombie
    }
  }
  
  return availableZombies[0]
}
