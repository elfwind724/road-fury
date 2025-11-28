/**
 * 武器系统类型定义
 */

// 武器类型
export type WeaponType =
  | 'machine_gun'      // 机枪 - 高射速低伤害
  | 'shotgun'          // 霰弹枪 - 扇形散射
  | 'sniper'           // 狙击枪 - 低射速高伤害穿透
  | 'rocket_launcher'  // 火箭筒 - 爆炸伤害
  | 'flamethrower'     // 火焰喷射器 - 持续燃烧
  | 'tesla_coil'       // 特斯拉线圈 - 链式闪电
  | 'freeze_ray'       // 冷冻射线 - 减速效果
  | 'laser_turret'     // 激光炮塔 - 持续光束

// 子弹类型
export type BulletType =
  | 'standard'         // 标准子弹
  | 'piercing'         // 穿甲弹 - 穿透多个目标
  | 'explosive'        // 爆炸弹 - 范围伤害
  | 'incendiary'       // 燃烧弹 - 持续伤害
  | 'freezing'         // 冷冻弹 - 减速效果
  | 'chain_lightning'  // 链式闪电 - 弹跳攻击
  | 'homing'           // 追踪弹 - 自动追踪
  | 'scatter'          // 散射弹 - 分裂成多个

// 子弹特效类型
export type BulletEffectType = 
  | 'burn'     // 燃烧
  | 'slow'     // 减速
  | 'pierce'   // 穿透
  | 'explode'  // 爆炸
  | 'chain'    // 链式
  | 'split'    // 分裂

// 子弹特效
export interface BulletEffect {
  type: BulletEffectType
  duration?: number       // 效果持续时间（毫秒）
  value: number           // 效果数值（伤害/减速百分比等）
  radius?: number         // 影响范围
  maxTargets?: number     // 最大影响目标数
  damagePerTick?: number  // 每tick伤害（用于燃烧等）
  tickInterval?: number   // tick间隔（毫秒）
}

// 武器配置
export interface WeaponConfig {
  type: WeaponType
  name: string
  description: string
  icon: string
  baseDamage: number
  fireRate: number        // 每秒射击次数
  range: number           // 射程（像素）
  bulletType: BulletType
  bulletSpeed: number     // 子弹速度
  bulletSize: number      // 子弹大小
  ammoPerShot: number     // 每次射击消耗弹药
  energyPerShot: number   // 每次射击消耗能量
  maxLevel: number
  specialEffect?: BulletEffect
  // 升级加成
  damagePerLevel: number
  fireRatePerLevel: number
  // 散射相关
  pelletCount?: number    // 散射弹数量
  spreadAngle?: number    // 散射角度
}

// 子弹实例
export interface BulletInstance {
  id: string
  type: BulletType
  weaponType: WeaponType
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  damage: number
  effect?: BulletEffect
  pierceCount: number     // 剩余穿透次数
  lifetime: number        // 剩余生命时间（毫秒）
  targetId?: string       // 追踪目标ID
  hitTargets: string[]    // 已命中的目标ID列表
}

// 武器状态
export interface WeaponState {
  id: string
  type: WeaponType
  level: number
  isActive: boolean
  lastFireTime: number
  currentTargetId?: string
  facilityId: string      // 关联的设施ID
}

// 丧尸状态效果
export interface ZombieStatusEffect {
  type: BulletEffectType
  remainingDuration: number
  value: number
  damagePerTick?: number
  tickInterval?: number
  lastTickTime?: number
}

// 扩展丧尸实例，添加状态效果
export interface ZombieInstanceWithEffects {
  id: string
  type: string
  health: number
  maxHealth: number
  position: { x: number; y: number; lane: number }
  speed: number
  baseSpeed: number
  statusEffects: ZombieStatusEffect[]
  isBoss: boolean
  bossType?: string
}
