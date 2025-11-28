/**
 * 游戏状态类型定义
 */

import type { VehicleState, VehicleType, VehicleTierConfig } from './vehicle'
import type { FacilityState, FacilityConfig } from './facility'
import type { ResourceState } from './resource'
import type { SurvivorState } from './survivor'
import type { ZombieConfig } from './zombie'
import type { WeaponConfig, WeaponState, BulletInstance } from './weapon'
import type { WaveConfig, WaveState, BossConfig, BossState } from './wave'
import type { WeatherState } from './weather'

// 武器升级状态
export interface WeaponUpgrades {
  machine_gun: number
  shotgun: number
  sniper: number
  rocket_launcher: number
  flamethrower: number
  tesla_coil: number
  freeze_ray: number
  laser_turret: number
}

// 车辆改造状态 - 按设计文档
export interface VehicleUpgrades {
  engine: number      // 引擎等级 (速度+5%/级) - 上限10级
  armor: number       // 装甲等级 (护甲+10/级) - 上限10级
  tire: number        // 轮胎等级 (碾压伤害+3%/级) - 上限10级
  fuelTank: number    // 油箱等级 (能源上限+20/级) - 上限5级
  durability: number  // 耐久等级 (增加最大耐久) - 上限10级
}

// 单局游戏状态
export interface RunState {
  vehicle: VehicleState
  facilities: FacilityState[]
  resources: ResourceState
  survivors: SurvivorState[]
  weapons: WeaponState[]
  bullets: BulletInstance[]
  wave: WaveState
  boss: BossState | null
  weather: WeatherState           // 天气状态
  distance: number
  isRunning: boolean
  gameSpeed: number
  lastUpdateTime: number
  weaponUpgrades: WeaponUpgrades
  vehicleUpgrades: VehicleUpgrades
}

// 永久升级
export interface PermanentUpgrade {
  id: string
  name: string
  description: string
  level: number
  maxLevel: number
  effect: {
    type: string
    value: number
  }
}

// 永久进度状态
export interface MetaState {
  apocalypsePoints: number
  unlockedVehicles: VehicleType[]
  unlockedFacilities: string[]
  permanentUpgrades: PermanentUpgrade[]
  skillTree: { [skillId: string]: number }  // 技能树状态
  unlockedAccessories: string[]             // 已解锁配件
  equippedAccessories: {                    // 当前装备的配件
    front?: string
    side?: string
    tire?: string
  }
  defeatedBosses: string[]                  // 已击败的Boss类型
  totalDistance: number
  totalRuns: number
  achievements: string[]
}

// 游戏配置
export interface GameConfig {
  vehicles: VehicleTierConfig[]
  facilities: FacilityConfig[]
  zombies: ZombieConfig[]
  weapons: WeaponConfig[]
  waves: WaveConfig[]
  bosses: BossConfig[]
  maxLanes: number
  baseResourceCapacity: number
}

// 完整游戏状态
export interface GameState {
  run: RunState | null
  meta: MetaState
  config: GameConfig
}

// 存档数据
export interface SaveData {
  version: string
  timestamp: number
  run: RunState | null
  meta: MetaState
  checksum: string
}
