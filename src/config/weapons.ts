/**
 * 武器配置表
 */

import type { WeaponConfig, BulletEffect } from '@/types'

// 子弹特效预设
export const BULLET_EFFECTS: Record<string, BulletEffect> = {
  pierce: {
    type: 'pierce',
    value: 3,
    maxTargets: 3,
  },
  explode: {
    type: 'explode',
    value: 0.5, // 50% 伤害
    radius: 80,
  },
  burn: {
    type: 'burn',
    duration: 3000,
    value: 5, // 每秒5点伤害
    damagePerTick: 5,
    tickInterval: 500,
  },
  slow: {
    type: 'slow',
    duration: 2000,
    value: 0.5, // 减速50%
  },
  chain: {
    type: 'chain',
    value: 0.8, // 每次弹跳伤害衰减20%
    maxTargets: 3,
  },
  split: {
    type: 'split',
    value: 3, // 分裂成3个子弹
    maxTargets: 3,
  },
}

// 武器配置
export const WEAPON_CONFIGS: WeaponConfig[] = [
  {
    type: 'machine_gun',
    name: '机枪',
    description: '高射速低伤害，适合清理小型丧尸',
    icon: '🔫',
    baseDamage: 5,
    fireRate: 8,
    range: 300,
    bulletType: 'standard',
    bulletSpeed: 800,
    bulletSize: 4,
    ammoPerShot: 1,
    energyPerShot: 0.5,
    maxLevel: 5,
    damagePerLevel: 2,
    fireRatePerLevel: 1,
  },
  {
    type: 'shotgun',
    name: '霰弹枪',
    description: '近距离扇形散射，一次发射多颗弹丸',
    icon: '🎯',
    baseDamage: 3,
    fireRate: 1.5,
    range: 200,
    bulletType: 'scatter',
    bulletSpeed: 600,
    bulletSize: 3,
    ammoPerShot: 3,
    energyPerShot: 1,
    maxLevel: 5,
    damagePerLevel: 1,
    fireRatePerLevel: 0.2,
    pelletCount: 5,
    spreadAngle: 30,
    specialEffect: BULLET_EFFECTS.split,
  },
  {
    type: 'sniper',
    name: '狙击枪',
    description: '低射速高伤害，子弹可穿透多个目标',
    icon: '🎯',
    baseDamage: 50,
    fireRate: 0.5,
    range: 500,
    bulletType: 'piercing',
    bulletSpeed: 1200,
    bulletSize: 6,
    ammoPerShot: 1,
    energyPerShot: 2,
    maxLevel: 5,
    damagePerLevel: 15,
    fireRatePerLevel: 0.1,
    specialEffect: BULLET_EFFECTS.pierce,
  },
  {
    type: 'rocket_launcher',
    name: '火箭筒',
    description: '发射爆炸弹头，造成范围伤害',
    icon: '🚀',
    baseDamage: 30,
    fireRate: 0.3,
    range: 400,
    bulletType: 'explosive',
    bulletSpeed: 400,
    bulletSize: 12,
    ammoPerShot: 5,
    energyPerShot: 3,
    maxLevel: 5,
    damagePerLevel: 10,
    fireRatePerLevel: 0.05,
    specialEffect: BULLET_EFFECTS.explode,
  },
  {
    type: 'flamethrower',
    name: '火焰喷射器',
    description: '喷射火焰，使敌人持续燃烧',
    icon: '🔥',
    baseDamage: 2,
    fireRate: 10,
    range: 150,
    bulletType: 'incendiary',
    bulletSpeed: 300,
    bulletSize: 8,
    ammoPerShot: 0.5,
    energyPerShot: 0.3,
    maxLevel: 5,
    damagePerLevel: 1,
    fireRatePerLevel: 2,
    specialEffect: BULLET_EFFECTS.burn,
  },
  {
    type: 'tesla_coil',
    name: '特斯拉线圈',
    description: '释放链式闪电，在多个目标间弹跳',
    icon: '⚡',
    baseDamage: 15,
    fireRate: 2,
    range: 250,
    bulletType: 'chain_lightning',
    bulletSpeed: 1000,
    bulletSize: 6,
    ammoPerShot: 2,
    energyPerShot: 5,
    maxLevel: 5,
    damagePerLevel: 5,
    fireRatePerLevel: 0.3,
    specialEffect: BULLET_EFFECTS.chain,
  },
  {
    type: 'freeze_ray',
    name: '冷冻射线',
    description: '发射冷冻光束，减缓敌人移动速度',
    icon: '❄️',
    baseDamage: 8,
    fireRate: 3,
    range: 200,
    bulletType: 'freezing',
    bulletSpeed: 700,
    bulletSize: 5,
    ammoPerShot: 1,
    energyPerShot: 2,
    maxLevel: 5,
    damagePerLevel: 3,
    fireRatePerLevel: 0.5,
    specialEffect: BULLET_EFFECTS.slow,
  },
  {
    type: 'laser_turret',
    name: '激光炮塔',
    description: '持续发射激光束，消耗能量而非弹药',
    icon: '💥',
    baseDamage: 20,
    fireRate: 60, // 每秒60次 = 持续伤害
    range: 350,
    bulletType: 'standard',
    bulletSpeed: 2000,
    bulletSize: 3,
    ammoPerShot: 0,
    energyPerShot: 0.1,
    maxLevel: 5,
    damagePerLevel: 5,
    fireRatePerLevel: 0,
  },
]

/**
 * 获取武器配置
 */
export function getWeaponConfig(type: string): WeaponConfig | undefined {
  return WEAPON_CONFIGS.find((w) => w.type === type)
}

/**
 * 计算武器在指定等级的属性
 */
export function getWeaponStatsAtLevel(config: WeaponConfig, level: number): {
  damage: number
  fireRate: number
} {
  const levelBonus = level - 1
  return {
    damage: config.baseDamage + config.damagePerLevel * levelBonus,
    fireRate: config.fireRate + config.fireRatePerLevel * levelBonus,
  }
}

/**
 * 获取武器射击间隔（毫秒）
 */
export function getFireInterval(fireRate: number): number {
  return 1000 / fireRate
}
