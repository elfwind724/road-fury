/**
 * Meta 永久进度系统
 * 负责末世点数计算、永久升级、解锁管理
 */

import type { MetaState, PermanentUpgrade, VehicleType, FacilityType } from '@/types'

// 末世点数计算参数
const POINTS_PER_DISTANCE = 0.1
const POINTS_PER_ZOMBIE_KILL = 1
const ACHIEVEMENT_BONUS_MULTIPLIER = 1.5

/**
 * 计算末世点数
 */
export function calculateApocalypsePoints(
  distance: number,
  zombieKills: number = 0,
  achievements: string[] = []
): number {
  const basePoints = distance * POINTS_PER_DISTANCE + zombieKills * POINTS_PER_ZOMBIE_KILL
  const achievementBonus = achievements.length * ACHIEVEMENT_BONUS_MULTIPLIER
  return Math.floor(basePoints + achievementBonus)
}

/**
 * 应用永久升级
 */
export function applyPermanentUpgrade(
  meta: MetaState,
  upgradeId: string,
  cost: number
): { meta: MetaState; success: boolean; error?: string } {
  if (meta.apocalypsePoints < cost) {
    return { meta, success: false, error: '末世点数不足' }
  }
  
  const upgradeIndex = meta.permanentUpgrades.findIndex(u => u.id === upgradeId)
  
  if (upgradeIndex === -1) {
    return { meta, success: false, error: '升级项不存在' }
  }
  
  const upgrade = meta.permanentUpgrades[upgradeIndex]
  
  if (upgrade.level >= upgrade.maxLevel) {
    return { meta, success: false, error: '已达到最高等级' }
  }
  
  const newUpgrades = [...meta.permanentUpgrades]
  newUpgrades[upgradeIndex] = {
    ...upgrade,
    level: upgrade.level + 1,
  }
  
  return {
    meta: {
      ...meta,
      apocalypsePoints: meta.apocalypsePoints - cost,
      permanentUpgrades: newUpgrades,
    },
    success: true,
  }
}

/**
 * 解锁图纸
 */
export function unlockBlueprint(
  meta: MetaState,
  facilityType: FacilityType
): MetaState {
  if (meta.unlockedFacilities.includes(facilityType)) {
    return meta
  }
  
  return {
    ...meta,
    unlockedFacilities: [...meta.unlockedFacilities, facilityType],
  }
}

/**
 * 解锁车辆
 */
export function unlockVehicle(
  meta: MetaState,
  vehicleType: VehicleType
): MetaState {
  if (meta.unlockedVehicles.includes(vehicleType)) {
    return meta
  }
  
  return {
    ...meta,
    unlockedVehicles: [...meta.unlockedVehicles, vehicleType],
  }
}

/**
 * 添加成就
 */
export function addAchievement(
  meta: MetaState,
  achievementId: string
): MetaState {
  if (meta.achievements.includes(achievementId)) {
    return meta
  }
  
  return {
    ...meta,
    achievements: [...meta.achievements, achievementId],
  }
}

/**
 * 获取永久升级效果值
 */
export function getUpgradeEffect(
  meta: MetaState,
  upgradeId: string
): number {
  const upgrade = meta.permanentUpgrades.find(u => u.id === upgradeId)
  if (!upgrade || upgrade.level === 0) return 0
  return upgrade.effect.value * upgrade.level
}

/**
 * 检查设施是否已解锁
 */
export function isFacilityUnlocked(
  meta: MetaState,
  facilityType: FacilityType
): boolean {
  return meta.unlockedFacilities.includes(facilityType)
}

/**
 * 检查车辆是否已解锁
 */
export function isVehicleUnlocked(
  meta: MetaState,
  vehicleType: VehicleType
): boolean {
  return meta.unlockedVehicles.includes(vehicleType)
}

/**
 * 创建默认永久升级列表
 */
export function createDefaultUpgrades(): PermanentUpgrade[] {
  return [
    {
      id: 'starting_scrap',
      name: '初始废铁',
      description: '增加每局开始时的废铁数量',
      level: 0,
      maxLevel: 5,
      effect: { type: 'starting_resource', value: 20 },
    },
    {
      id: 'vehicle_armor',
      name: '车辆护甲',
      description: '增加车辆基础护甲',
      level: 0,
      maxLevel: 5,
      effect: { type: 'armor_bonus', value: 5 },
    },
    {
      id: 'resource_capacity',
      name: '资源容量',
      description: '增加资源存储上限',
      level: 0,
      maxLevel: 5,
      effect: { type: 'capacity_bonus', value: 20 },
    },
  ]
}

/**
 * 获取常量（用于测试）
 */
export const META_CONSTANTS = {
  POINTS_PER_DISTANCE,
  POINTS_PER_ZOMBIE_KILL,
  ACHIEVEMENT_BONUS_MULTIPLIER,
}
