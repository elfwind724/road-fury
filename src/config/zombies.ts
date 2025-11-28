/**
 * 丧尸配置表 (MVP: normal, fat, elite)
 */

import type { ZombieConfig } from '@/types'

export const ZOMBIE_CONFIGS: ZombieConfig[] = [
  {
    type: 'normal',
    health: 10,
    damage: 15,  // 提高基础伤害
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
    damage: 30,  // 提高伤害
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
    health: 100,
    damage: 50,  // 提高伤害
    speed: 1.5,
    damageModifier: 1.2,
    spawnWeight: 10,
    minDistance: 500,
    drops: [
      { type: 'electronics', min: 5, max: 10, chance: 1.0 },
      { type: 'parts', min: 10, max: 20, chance: 0.7 },
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
