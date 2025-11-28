/**
 * 武器系统
 * 负责武器管理、自动瞄准、射击和子弹处理
 */

import type {
  WeaponState,
  BulletInstance,
  ZombieInstanceWithEffects,
} from '@/types'
import { getWeaponConfig, getWeaponStatsAtLevel, getFireInterval } from '@/config/weapons'

/**
 * 生成唯一ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 创建武器状态
 */
export function createWeapon(type: string, facilityId: string): WeaponState | null {
  const config = getWeaponConfig(type)
  if (!config) return null

  return {
    id: generateId('weapon'),
    type: config.type,
    level: 1,
    isActive: true,
    lastFireTime: 0,
    facilityId,
  }
}

/**
 * 升级武器
 */
export function upgradeWeapon(weapon: WeaponState): WeaponState {
  const config = getWeaponConfig(weapon.type)
  if (!config || weapon.level >= config.maxLevel) {
    return weapon
  }

  return {
    ...weapon,
    level: weapon.level + 1,
  }
}

/**
 * 计算两点之间的距离
 */
function getDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * 寻找最近的目标
 */
export function findNearestTarget(
  weaponPosition: { x: number; y: number },
  zombies: ZombieInstanceWithEffects[],
  range: number
): ZombieInstanceWithEffects | null {
  let nearest: ZombieInstanceWithEffects | null = null
  let nearestDistance = Infinity

  for (const zombie of zombies) {
    if (zombie.health <= 0) continue
    
    const distance = getDistance(weaponPosition, zombie.position)
    if (distance <= range && distance < nearestDistance) {
      nearest = zombie
      nearestDistance = distance
    }
  }

  return nearest
}

/**
 * 检查武器是否可以射击
 */
export function canFire(
  weapon: WeaponState,
  currentTime: number,
  ammo: number,
  energy: number
): boolean {
  if (!weapon.isActive) return false

  const config = getWeaponConfig(weapon.type)
  if (!config) return false

  const stats = getWeaponStatsAtLevel(config, weapon.level)
  const fireInterval = getFireInterval(stats.fireRate)

  // 检查冷却
  if (currentTime - weapon.lastFireTime < fireInterval) return false

  // 检查弹药
  if (config.ammoPerShot > 0 && ammo < config.ammoPerShot) return false

  // 检查能量
  if (config.energyPerShot > 0 && energy < config.energyPerShot) return false

  return true
}

/**
 * 创建子弹
 */
export function createBullet(
  weapon: WeaponState,
  weaponPosition: { x: number; y: number },
  target: { x: number; y: number },
  bulletId?: string
): BulletInstance | null {
  const config = getWeaponConfig(weapon.type)
  if (!config) return null

  const stats = getWeaponStatsAtLevel(config, weapon.level)

  // 计算方向
  const dx = target.x - weaponPosition.x
  const dy = target.y - weaponPosition.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance === 0) return null

  const dirX = dx / distance
  const dirY = dy / distance

  return {
    id: bulletId || generateId('bullet'),
    type: config.bulletType,
    weaponType: config.type,
    position: { ...weaponPosition },
    velocity: {
      x: dirX * config.bulletSpeed,
      y: dirY * config.bulletSpeed,
    },
    damage: stats.damage,
    effect: config.specialEffect,
    pierceCount: config.specialEffect?.type === 'pierce' 
      ? (config.specialEffect.maxTargets || 1) 
      : 0,
    lifetime: 3000, // 3秒生命周期
    hitTargets: [],
  }
}

/**
 * 创建散射子弹
 */
export function createScatterBullets(
  weapon: WeaponState,
  weaponPosition: { x: number; y: number },
  target: { x: number; y: number }
): BulletInstance[] {
  const config = getWeaponConfig(weapon.type)
  if (!config || !config.pelletCount || !config.spreadAngle) {
    const bullet = createBullet(weapon, weaponPosition, target)
    return bullet ? [bullet] : []
  }

  const bullets: BulletInstance[] = []
  const stats = getWeaponStatsAtLevel(config, weapon.level)

  // 计算基础方向角度
  const dx = target.x - weaponPosition.x
  const dy = target.y - weaponPosition.y
  const baseAngle = Math.atan2(dy, dx)

  // 散射角度范围
  const spreadRad = (config.spreadAngle * Math.PI) / 180
  const angleStep = spreadRad / (config.pelletCount - 1)
  const startAngle = baseAngle - spreadRad / 2

  for (let i = 0; i < config.pelletCount; i++) {
    const angle = startAngle + angleStep * i
    const dirX = Math.cos(angle)
    const dirY = Math.sin(angle)

    bullets.push({
      id: generateId('bullet'),
      type: config.bulletType,
      weaponType: config.type,
      position: { ...weaponPosition },
      velocity: {
        x: dirX * config.bulletSpeed,
        y: dirY * config.bulletSpeed,
      },
      damage: stats.damage,
      effect: config.specialEffect,
      pierceCount: 0,
      lifetime: 2000,
      hitTargets: [],
    })
  }

  return bullets
}

/**
 * 更新子弹位置
 */
export function updateBullet(
  bullet: BulletInstance,
  deltaMs: number
): BulletInstance {
  const deltaSeconds = deltaMs / 1000

  return {
    ...bullet,
    position: {
      x: bullet.position.x + bullet.velocity.x * deltaSeconds,
      y: bullet.position.y + bullet.velocity.y * deltaSeconds,
    },
    lifetime: bullet.lifetime - deltaMs,
  }
}

/**
 * 检查子弹是否命中目标
 */
export function checkBulletHit(
  bullet: BulletInstance,
  zombie: ZombieInstanceWithEffects,
  bulletSize: number = 5,
  zombieSize: number = 18
): boolean {
  // 已经命中过的目标不再命中
  if (bullet.hitTargets.includes(zombie.id)) return false

  const distance = getDistance(bullet.position, zombie.position)
  return distance < bulletSize + zombieSize
}

/**
 * 应用子弹伤害和效果
 */
export function applyBulletDamage(
  zombie: ZombieInstanceWithEffects,
  bullet: BulletInstance
): ZombieInstanceWithEffects {
  let newHealth = zombie.health - bullet.damage
  const newEffects = [...zombie.statusEffects]

  // 应用特殊效果
  if (bullet.effect) {
    const existingEffectIndex = newEffects.findIndex(
      (e) => e.type === bullet.effect!.type
    )

    const newEffect = {
      type: bullet.effect.type,
      remainingDuration: bullet.effect.duration || 0,
      value: bullet.effect.value,
      damagePerTick: bullet.effect.damagePerTick,
      tickInterval: bullet.effect.tickInterval,
      lastTickTime: Date.now(),
    }

    if (existingEffectIndex >= 0) {
      // 刷新效果持续时间
      newEffects[existingEffectIndex] = newEffect
    } else {
      newEffects.push(newEffect)
    }
  }

  return {
    ...zombie,
    health: Math.max(0, newHealth),
    statusEffects: newEffects,
  }
}

/**
 * 获取爆炸范围内的目标
 */
export function getExplosionTargets(
  position: { x: number; y: number },
  zombies: ZombieInstanceWithEffects[],
  radius: number
): ZombieInstanceWithEffects[] {
  return zombies.filter((zombie) => {
    if (zombie.health <= 0) return false
    const distance = getDistance(position, zombie.position)
    return distance <= radius
  })
}

/**
 * 获取链式闪电的下一个目标
 */
export function getChainTarget(
  currentPosition: { x: number; y: number },
  zombies: ZombieInstanceWithEffects[],
  hitTargets: string[],
  maxRange: number = 100
): ZombieInstanceWithEffects | null {
  let nearest: ZombieInstanceWithEffects | null = null
  let nearestDistance = Infinity

  for (const zombie of zombies) {
    if (zombie.health <= 0) continue
    if (hitTargets.includes(zombie.id)) continue

    const distance = getDistance(currentPosition, zombie.position)
    if (distance <= maxRange && distance < nearestDistance) {
      nearest = zombie
      nearestDistance = distance
    }
  }

  return nearest
}

/**
 * 更新丧尸状态效果
 */
export function updateZombieEffects(
  zombie: ZombieInstanceWithEffects,
  deltaMs: number,
  currentTime: number
): ZombieInstanceWithEffects {
  let health = zombie.health
  let speed = zombie.baseSpeed
  const activeEffects: typeof zombie.statusEffects = []

  for (const effect of zombie.statusEffects) {
    const newDuration = effect.remainingDuration - deltaMs

    if (newDuration > 0) {
      // 效果仍然有效
      activeEffects.push({
        ...effect,
        remainingDuration: newDuration,
      })

      // 应用效果
      switch (effect.type) {
        case 'slow':
          speed *= effect.value // value 是速度倍率，如 0.5 表示减速50%
          break
        case 'burn':
          // 燃烧伤害
          if (effect.damagePerTick && effect.tickInterval) {
            const timeSinceLastTick = currentTime - (effect.lastTickTime || 0)
            if (timeSinceLastTick >= effect.tickInterval) {
              health -= effect.damagePerTick
              activeEffects[activeEffects.length - 1].lastTickTime = currentTime
            }
          }
          break
      }
    }
  }

  return {
    ...zombie,
    health: Math.max(0, health),
    speed,
    statusEffects: activeEffects,
  }
}

/**
 * 获取武器消耗
 */
export function getWeaponConsumption(weaponType: string): {
  ammo: number
  energy: number
} {
  const config = getWeaponConfig(weaponType)
  if (!config) return { ammo: 0, energy: 0 }

  return {
    ammo: config.ammoPerShot,
    energy: config.energyPerShot,
  }
}
