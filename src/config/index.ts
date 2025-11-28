/**
 * 游戏配置统一导出
 */

export * from './vehicles'
export * from './facilities'
export * from './zombies'
export * from './weapons'
export * from './waves'
export * from './survivors'
export * from './weather'
export * from './tutorial'
export * from './accessories'
export * from './skillTree'

import { VEHICLE_CONFIGS } from './vehicles'
import { FACILITY_CONFIGS } from './facilities'
import { ZOMBIE_CONFIGS } from './zombies'
import { WEAPON_CONFIGS } from './weapons'
import { WAVE_CONFIGS, BOSS_CONFIGS } from './waves'
import type { GameConfig } from '@/types'

export const GAME_CONFIG: GameConfig = {
  vehicles: VEHICLE_CONFIGS,
  facilities: FACILITY_CONFIGS,
  zombies: ZOMBIE_CONFIGS,
  weapons: WEAPON_CONFIGS,
  waves: WAVE_CONFIGS,
  bosses: BOSS_CONFIGS,
  maxLanes: 3,
  baseResourceCapacity: 500, // 提高资源上限
}
