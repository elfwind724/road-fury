/**
 * 波次系统
 * 负责波次触发、丧尸生成和Boss管理
 */

import type {
  WaveState,
  BossState,
  WaveReward,
  ResourceState,
} from '@/types'
import { getWaveConfig, getBossConfig } from '@/config/waves'

/**
 * 生成唯一ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 创建初始波次状态
 */
export function createInitialWaveState(): WaveState {
  return {
    isActive: false,
    currentWave: 0,
    timeRemaining: 0,
    zombiesSpawned: 0,
    zombiesKilled: 0,
    eliteSpawned: false,
    bossSpawned: false,
    bossDefeated: false,
    isWarning: false,
    warningTimeRemaining: 0,
  }
}

/**
 * 检查是否应该触发波次
 */
export function shouldTriggerWave(
  distance: number,
  currentWave: number,
  isWaveActive: boolean
): boolean {
  if (isWaveActive) return false

  const nextWaveNumber = currentWave + 1
  const nextWaveConfig = getWaveConfig(nextWaveNumber)

  return distance >= nextWaveConfig.triggerDistance
}

/**
 * 开始波次警告阶段
 */
export function startWaveWarning(waveNumber: number): WaveState {
  const config = getWaveConfig(waveNumber)

  return {
    isActive: false,
    currentWave: waveNumber,
    timeRemaining: config.duration * 1000,
    zombiesSpawned: 0,
    zombiesKilled: 0,
    eliteSpawned: false,
    bossSpawned: false,
    bossDefeated: false,
    isWarning: true,
    warningTimeRemaining: config.warningTime * 1000,
  }
}

/**
 * 开始波次
 */
export function startWave(waveState: WaveState): WaveState {
  return {
    ...waveState,
    isActive: true,
    isWarning: false,
    warningTimeRemaining: 0,
  }
}

/**
 * 更新波次状态
 */
export function updateWaveState(
  waveState: WaveState,
  deltaMs: number
): WaveState {
  if (!waveState.isActive && !waveState.isWarning) {
    return waveState
  }

  // 警告阶段
  if (waveState.isWarning) {
    const newWarningTime = waveState.warningTimeRemaining - deltaMs
    if (newWarningTime <= 0) {
      return startWave(waveState)
    }
    return {
      ...waveState,
      warningTimeRemaining: newWarningTime,
    }
  }

  // 波次进行中
  const newTimeRemaining = waveState.timeRemaining - deltaMs

  if (newTimeRemaining <= 0) {
    // 波次时间结束
    return {
      ...waveState,
      isActive: false,
      timeRemaining: 0,
    }
  }

  return {
    ...waveState,
    timeRemaining: newTimeRemaining,
  }
}

/**
 * 计算当前应该生成的丧尸数量
 */
export function getZombiesToSpawn(
  waveState: WaveState,
  deltaMs: number
): number {
  if (!waveState.isActive) return 0

  const config = getWaveConfig(waveState.currentWave)
  const zombiesPerMs = config.spawnRate / 1000

  return Math.floor(zombiesPerMs * deltaMs)
}

/**
 * 根据波次配置选择丧尸类型
 */
export function selectWaveZombieType(waveNumber: number): string {
  const config = getWaveConfig(waveNumber)
  const totalWeight = config.zombieTypes.reduce((sum, z) => sum + z.weight, 0)
  let random = Math.random() * totalWeight

  for (const zombieConfig of config.zombieTypes) {
    random -= zombieConfig.weight
    if (random <= 0) {
      return zombieConfig.type
    }
  }

  return config.zombieTypes[0].type
}

/**
 * 检查是否应该生成精英丧尸
 */
export function shouldSpawnElite(waveState: WaveState): boolean {
  if (waveState.eliteSpawned) return false

  const config = getWaveConfig(waveState.currentWave)
  if (!config.hasElite) return false

  // 在波次进行到一半时生成精英
  const halfTime = (config.duration * 1000) / 2
  return waveState.timeRemaining <= halfTime
}

/**
 * 检查是否应该生成Boss
 */
export function shouldSpawnBoss(waveState: WaveState): boolean {
  if (waveState.bossSpawned) return false

  const config = getWaveConfig(waveState.currentWave)
  if (!config.hasBoss) return false

  // 在波次进行到1/3时生成Boss
  const bossTime = (config.duration * 1000) / 3
  return waveState.timeRemaining <= bossTime
}

/**
 * 创建Boss状态
 */
export function createBoss(bossType: string): BossState | null {
  const config = getBossConfig(bossType)
  if (!config) return null

  return {
    id: generateId('boss'),
    type: config.type,
    health: config.health,
    maxHealth: config.health,
    position: { x: 200, y: -100 }, // 从屏幕上方生成
    abilityCooldowns: new Map(),
    isEnraged: false,
  }
}

/**
 * 更新Boss状态
 */
export function updateBoss(
  boss: BossState,
  deltaMs: number,
  _currentTime: number
): BossState {
  // 更新技能冷却
  const newCooldowns = new Map(boss.abilityCooldowns)
  for (const [ability, cooldown] of newCooldowns) {
    newCooldowns.set(ability, Math.max(0, cooldown - deltaMs))
  }

  // 检查狂暴状态
  const isEnraged = boss.health <= boss.maxHealth * 0.3

  return {
    ...boss,
    abilityCooldowns: newCooldowns,
    isEnraged,
  }
}

/**
 * 检查Boss是否可以使用技能
 */
export function canUseBossAbility(
  boss: BossState,
  abilityName: string
): boolean {
  const cooldown = boss.abilityCooldowns.get(abilityName) || 0
  return cooldown <= 0
}

/**
 * 使用Boss技能
 */
export function useBossAbility(
  boss: BossState,
  abilityName: string,
  cooldown: number
): BossState {
  const newCooldowns = new Map(boss.abilityCooldowns)
  newCooldowns.set(abilityName, cooldown)

  return {
    ...boss,
    abilityCooldowns: newCooldowns,
  }
}

/**
 * 对Boss造成伤害
 */
export function damageBoss(boss: BossState, damage: number): BossState {
  return {
    ...boss,
    health: Math.max(0, boss.health - damage),
  }
}

/**
 * 检查Boss是否被击败
 */
export function isBossDefeated(boss: BossState): boolean {
  return boss.health <= 0
}

/**
 * 检查波次是否完成
 */
export function isWaveComplete(waveState: WaveState): boolean {
  if (waveState.isActive) return false
  if (waveState.isWarning) return false
  if (waveState.currentWave === 0) return false

  const config = getWaveConfig(waveState.currentWave)

  // 如果有Boss，需要击败Boss
  if (config.hasBoss && !waveState.bossDefeated) {
    return false
  }

  return waveState.timeRemaining <= 0
}

/**
 * 获取波次奖励
 */
export function getWaveRewards(waveNumber: number): WaveReward[] {
  const config = getWaveConfig(waveNumber)
  return config.rewards
}

/**
 * 应用波次奖励到资源
 */
export function applyWaveRewards(
  resources: ResourceState,
  rewards: WaveReward[],
  capacity: number = 100
): { resources: ResourceState; apocalypsePoints: number } {
  let newResources = { ...resources }
  let apocalypsePoints = 0

  for (const reward of rewards) {
    if (reward.type === 'resource' && reward.resourceType) {
      const key = reward.resourceType as keyof ResourceState
      newResources[key] = Math.min(capacity, newResources[key] + reward.amount)
    } else if (reward.type === 'apocalypse_points') {
      apocalypsePoints += reward.amount
    }
  }

  return { resources: newResources, apocalypsePoints }
}

/**
 * 记录击杀丧尸
 */
export function recordZombieKill(waveState: WaveState): WaveState {
  return {
    ...waveState,
    zombiesKilled: waveState.zombiesKilled + 1,
  }
}

/**
 * 记录生成丧尸
 */
export function recordZombieSpawn(waveState: WaveState): WaveState {
  return {
    ...waveState,
    zombiesSpawned: waveState.zombiesSpawned + 1,
  }
}

/**
 * 标记精英已生成
 */
export function markEliteSpawned(waveState: WaveState): WaveState {
  return {
    ...waveState,
    eliteSpawned: true,
  }
}

/**
 * 标记Boss已生成
 */
export function markBossSpawned(waveState: WaveState): WaveState {
  return {
    ...waveState,
    bossSpawned: true,
  }
}

/**
 * 标记Boss已击败
 */
export function markBossDefeated(waveState: WaveState): WaveState {
  return {
    ...waveState,
    bossDefeated: true,
  }
}

/**
 * 获取波次进度百分比
 */
export function getWaveProgress(waveState: WaveState): number {
  if (!waveState.isActive) return 0

  const config = getWaveConfig(waveState.currentWave)
  const totalTime = config.duration * 1000
  const elapsed = totalTime - waveState.timeRemaining

  return Math.min(100, (elapsed / totalTime) * 100)
}
