/**
 * 游戏系统统一导出
 */

export * from './SaveManager'
export * from './ResourceSystem'
export * from './VehicleSystem'
export * from './VehicleUpgradeSystem'
export * from './FacilitySystem'
export * from './SurvivalSystem'
export {
  spawnZombie,
  calculateZombieAttack,
  processCollision,
  getDrops,
  canSpawnAtDistance,
  getSpawnWeights,
  type ZombieInstance,
  type CollisionResult
} from './CombatSystem'
export * from './SurvivorSystem'
export * from './MetaSystem'
export * from './OfflineSystem'
export * from './EventSystem'
export * from './WeaponSystem'
export * from './BossSystem'
export * from './WaveSystem'
export * from './LeaderboardSystem'
export * from './EndlessSystem'
export * from './RoguelikeSystem'
