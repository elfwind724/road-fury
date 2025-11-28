/**
 * Zustand 游戏状态管理 - 完整版
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type {
  GameState,
  RunState,
  MetaState,
  VehicleState,
  ResourceState,
  FacilityType,
  SurvivorState,
} from '@/types'
import { GAME_CONFIG, getVehicleConfig, getFacilityConfig } from '@/config'
import { SKILL_NODES } from '@/config/skillTree'
import { updateBossBehavior } from '@/systems/BossSystem'
import { createBoss } from '@/systems/WaveSystem'

// 初始资源状态
const createInitialResources = (): ResourceState => ({
  scrap: 100,
  parts: 20,
  fabric: 30,
  food: 50,
  medicine: 10,
  fuel: 10,
  electronics: 5,
  ammo: 20,
  water: 50,
  energy: 30,
})

// 创建初始车辆状态
const createInitialVehicle = (type: string = 'tricycle'): VehicleState => {
  const config = getVehicleConfig(type)
  if (!config) {
    throw new Error(`Unknown vehicle type: ${type}`)
  }
  return {
    type: config.type,
    stats: {
      power: config.power,
      armor: config.armor,
      energy: 0,
      capacity: config.capacity,
      speed: config.speed,
      crushDamage: config.power * 2,
    },
    durability: config.maxDurability,
    maxDurability: config.maxDurability,
    position: { x: 100, y: 300, lane: 1 },
    facilitySlots: config.slots,
    accessories: {},
  }
}

// 创建初始波次状态
const createInitialWaveState = () => ({
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
})

// 创建初始天气状态
const createInitialWeatherState = () => ({
  current: 'sunny' as const,
  timeRemaining: 4 * 60 * 60 * 1000, // 4小时
})

// 创建初始武器升级状态
const createInitialWeaponUpgrades = () => ({
  machine_gun: 1,  // 默认武器等级1
  shotgun: 0,      // 0表示未解锁
  sniper: 0,
  rocket_launcher: 0,
  flamethrower: 0,
  tesla_coil: 0,
  freeze_ray: 0,
  laser_turret: 0,
})

// 创建初始车辆改造状态 - 按设计文档：上限10级
const createInitialVehicleUpgrades = () => ({
  engine: 0,       // 引擎等级 (速度+5%/级) - 上限10级
  armor: 0,        // 装甲等级 (护甲+10/级) - 上限10级
  tire: 0,         // 轮胎等级 (碾压伤害+3%/级) - 上限10级
  fuelTank: 0,     // 油箱等级 (能源上限+20/级) - 上限5级
  durability: 0,   // 耐久等级 (增加最大耐久) - 上限10级
})

// 创建初始单局状态
const createInitialRunState = (): RunState => ({
  vehicle: createInitialVehicle('tricycle'),
  facilities: [],
  resources: createInitialResources(),
  survivors: [],
  weapons: [],
  bullets: [],
  wave: createInitialWaveState(),
  weather: createInitialWeatherState(),
  boss: null,
  distance: 0,
  isRunning: false,
  gameSpeed: 1,
  lastUpdateTime: Date.now(),
  weaponUpgrades: createInitialWeaponUpgrades(),
  vehicleUpgrades: createInitialVehicleUpgrades(),
})

// 初始永久进度状态
const createInitialMetaState = (): MetaState => ({
  apocalypsePoints: 0,
  unlockedVehicles: ['tricycle'],
  unlockedFacilities: [
    'bed',
    'kitchen',
    'water_tank',
    'solar_panel',
    'turret',
    'storage',
    'rain_collector',
    'planter',
    'battery',
    'workbench',
    'medical_bay',
    'recreation',
  ],
  permanentUpgrades: [],
  skillTree: {},                              // 技能树状态
  unlockedAccessories: ['spike_ram', 'guardrail', 'standard_tire'], // 默认配件
  equippedAccessories: {                      // 默认装备
    front: 'spike_ram',
    side: 'guardrail',
    tire: 'standard_tire',
  },
  defeatedBosses: [],
  totalDistance: 0,
  totalRuns: 0,
  achievements: [],
})

// 生成唯一ID
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

// 幸存者技能与设施匹配
function getSurvivorSkillMatch(skill: string, facilityType: string): boolean {
  const skillFacilityMap: Record<string, string[]> = {
    mechanic: ['workbench', 'turret', 'battery'],      // 机械师 -> 工作台、炮台、电池
    chef: ['kitchen', 'planter'],                       // 厨师 -> 厨房、种植箱
    doctor: ['medical_bay', 'bed'],                     // 医生 -> 医疗舱、床铺
    shooter: ['turret'],                                // 射手 -> 炮台
    farmer: ['planter', 'rain_collector'],              // 农夫 -> 种植箱、雨水收集器
    communicator: ['recreation'],                       // 通讯员 -> 娱乐设施
    engineer: ['solar_panel', 'battery', 'workbench'],  // 工程师 -> 太阳能、电池、工作台
    soldier: ['turret', 'storage'],                     // 军人 -> 炮台、仓库
  }

  const matchingFacilities = skillFacilityMap[skill] || []
  return matchingFacilities.includes(facilityType)
}

// 计算实际资源容量（基础容量 + 仓库设施加成）
function calculateResourceCapacity(baseCapacity: number, facilities: { type: string; level: number; isActive: boolean }[]): number {
  let bonusCapacity = 0

  for (const facility of facilities) {
    if (!facility.isActive) continue

    const config = getFacilityConfig(facility.type)
    if (!config?.effects) continue

    for (const effect of config.effects) {
      if (effect.type === 'storage') {
        // 仓库效果随等级提升：基础值 * (1 + 0.5 * (等级-1))
        const efficiency = 1 + 0.5 * (facility.level - 1)
        bonusCapacity += effect.value * efficiency
      }
    }
  }

  return baseCapacity + bonusCapacity
}


// Store Actions 接口
interface GameActions {
  // Run 管理
  startNewRun: (vehicleType?: string) => void
  endRun: () => void
  pauseRun: () => void
  resumeRun: () => void

  // 车辆操作
  changeLane: (direction: 'up' | 'down') => void
  takeDamage: (amount: number) => void
  repair: (amount: number) => void

  // 资源操作
  addResource: (type: keyof ResourceState, amount: number) => void
  consumeResource: (type: keyof ResourceState, amount: number) => boolean
  addMultipleResources: (resources: Partial<ResourceState>) => void

  // 设施操作
  installFacility: (type: FacilityType, slotId: string) => boolean
  removeFacility: (facilityId: string) => void
  upgradeFacility: (facilityId: string) => boolean

  // 幸存者操作
  addSurvivor: (survivor: SurvivorState) => void
  removeSurvivor: (survivorId: string) => void
  assignSurvivorToFacility: (survivorId: string, facilityId: string | undefined) => void
  updateSurvivorNeeds: (deltaHours: number) => void

  // 距离更新
  updateDistance: (delta: number) => void

  // 游戏循环更新
  gameUpdate: (deltaMs: number) => void

  // Meta 进度
  addApocalypsePoints: (points: number) => void

  // 波次系统
  startWave: (waveNumber: number) => void
  updateWave: (deltaMs: number) => void
  completeWave: () => void
  spawnBoss: (bossType: string) => void

  // 武器升级系统
  upgradeWeapon: (weaponType: string) => boolean
  unlockWeapon: (weaponType: string) => boolean
  getWeaponLevel: (weaponType: string) => number

  // 资源容量
  getResourceCapacity: () => number

  // 车辆改造系统
  upgradeVehicleStat: (stat: 'engine' | 'armor' | 'tire' | 'fuelTank' | 'durability') => boolean
  evolveVehicle: () => boolean

  // 技能树系统
  upgradeSkill: (skillId: string) => boolean
  getSkillLevel: (skillId: string) => number

  // 配件系统
  equipAccessory: (slot: 'front' | 'side' | 'tire', accessoryId: string) => boolean
  unlockAccessory: (accessoryId: string) => void
  craftAccessory: (accessoryId: string) => boolean

  // 天气系统
  updateWeatherTime: (deltaMs: number) => void
  changeWeather: (newWeather: 'sunny' | 'rainy' | 'night' | 'sandstorm') => void

  // 重置
  resetGame: () => void
}

type GameStore = GameState & GameActions

export const useGameStore = create<GameStore>()(
  persist(
    immer((set, get) => ({
      // 初始状态
      run: null,
      meta: createInitialMetaState(),
      config: GAME_CONFIG,

      // 开始新游戏
      startNewRun: (vehicleType = 'tricycle') => {
        set((state) => {
          state.run = createInitialRunState()
          state.run.vehicle = createInitialVehicle(vehicleType)
          state.run.isRunning = true
          state.run.lastUpdateTime = Date.now()
          state.meta.totalRuns += 1
        })
      },

      // 结束游戏
      endRun: () => {
        const { run } = get()
        if (!run) return

        set((state) => {
          state.meta.totalDistance += run.distance
          // 计算末世点数
          const points = Math.floor(run.distance * 0.1)
          state.meta.apocalypsePoints += points
          state.run = null
        })
      },

      // 暂停游戏
      pauseRun: () => {
        set((state) => {
          if (state.run) {
            state.run.isRunning = false
          }
        })
      },

      // 恢复游戏
      resumeRun: () => {
        set((state) => {
          if (state.run) {
            state.run.isRunning = true
            state.run.lastUpdateTime = Date.now()
          }
        })
      },

      // 变道
      changeLane: (direction) => {
        set((state) => {
          if (!state.run) return
          const { lane } = state.run.vehicle.position
          const maxLanes = state.config.maxLanes

          if (direction === 'up' && lane > 0) {
            state.run.vehicle.position.lane = lane - 1
          } else if (direction === 'down' && lane < maxLanes - 1) {
            state.run.vehicle.position.lane = lane + 1
          }
        })
      },

      // 受到伤害
      takeDamage: (amount) => {
        set((state) => {
          if (!state.run) return
          state.run.vehicle.durability = Math.max(
            0,
            state.run.vehicle.durability - amount
          )
        })
      },

      // 修复
      repair: (amount) => {
        set((state) => {
          if (!state.run) return
          const { maxDurability } = state.run.vehicle
          state.run.vehicle.durability = Math.min(
            maxDurability,
            state.run.vehicle.durability + amount
          )
        })
      },

      // 添加资源
      addResource: (type, amount) => {
        set((state) => {
          if (!state.run) return
          // 计算实际容量（基础 + 仓库加成）
          const capacity = calculateResourceCapacity(
            state.config.baseResourceCapacity,
            state.run.facilities
          )
          state.run.resources[type] = Math.min(
            capacity,
            state.run.resources[type] + amount
          )
        })
      },

      // 消耗资源
      consumeResource: (type, amount) => {
        const { run } = get()
        if (!run || run.resources[type] < amount) return false

        set((state) => {
          if (!state.run) return
          state.run.resources[type] = Math.max(
            0,
            state.run.resources[type] - amount
          )
        })
        return true
      },

      // 批量添加资源
      addMultipleResources: (resources) => {
        set((state) => {
          if (!state.run) return
          // 计算实际容量（基础 + 仓库加成）
          const capacity = calculateResourceCapacity(
            state.config.baseResourceCapacity,
            state.run.facilities
          )
          for (const [type, amount] of Object.entries(resources)) {
            if (amount) {
              const key = type as keyof ResourceState
              state.run.resources[key] = Math.min(
                capacity,
                state.run.resources[key] + amount
              )
            }
          }
        })
      },

      // 安装设施
      installFacility: (type, slotId) => {
        const { run } = get()
        if (!run) return false

        const config = getFacilityConfig(type)
        if (!config) return false

        // 检查槽位是否已被占用
        if (run.facilities.some((f) => f.slotId === slotId)) return false

        // 检查资源
        for (const [key, value] of Object.entries(config.baseCost)) {
          if (value && run.resources[key as keyof ResourceState] < value) {
            return false
          }
        }

        set((state) => {
          if (!state.run) return
          // 消耗资源
          for (const [key, value] of Object.entries(config.baseCost)) {
            if (value) {
              state.run.resources[key as keyof ResourceState] -= value
            }
          }
          // 添加设施
          state.run.facilities.push({
            id: generateId('facility'),
            type,
            level: 1,
            slotId,
            isActive: true,
          })
        })
        return true
      },

      // 移除设施
      removeFacility: (facilityId) => {
        set((state) => {
          if (!state.run) return
          const facility = state.run.facilities.find((f) => f.id === facilityId)
          if (facility) {
            // 返还50%资源
            const config = getFacilityConfig(facility.type)
            if (config) {
              for (const [key, value] of Object.entries(config.baseCost)) {
                if (value) {
                  state.run.resources[key as keyof ResourceState] += Math.floor(
                    value * 0.5
                  )
                }
              }
            }
            // 解除幸存者分配
            state.run.survivors.forEach((s) => {
              if (s.assignedFacility === facilityId) {
                s.assignedFacility = undefined
              }
            })
            // 移除设施
            state.run.facilities = state.run.facilities.filter(
              (f) => f.id !== facilityId
            )
          }
        })
      },

      // 升级设施
      upgradeFacility: (facilityId) => {
        const { run } = get()
        if (!run) return false

        const facility = run.facilities.find((f) => f.id === facilityId)
        if (!facility || facility.level >= 3) return false

        const config = getFacilityConfig(facility.type)
        if (!config) return false

        // 升级成本 = 基础成本 * 当前等级
        const upgradeCost: Partial<ResourceState> = {}
        for (const [key, value] of Object.entries(config.baseCost)) {
          if (value) {
            upgradeCost[key as keyof ResourceState] = value * facility.level
          }
        }

        // 检查资源
        for (const [key, value] of Object.entries(upgradeCost)) {
          if (value && run.resources[key as keyof ResourceState] < value) {
            return false
          }
        }

        set((state) => {
          if (!state.run) return
          // 消耗资源
          for (const [key, value] of Object.entries(upgradeCost)) {
            if (value) {
              state.run.resources[key as keyof ResourceState] -= value
            }
          }
          // 升级
          const f = state.run.facilities.find((f) => f.id === facilityId)
          if (f) f.level += 1
        })
        return true
      },

      // 添加幸存者
      addSurvivor: (survivor) => {
        set((state) => {
          if (!state.run) return
          state.run.survivors.push(survivor)
        })
      },

      // 移除幸存者
      removeSurvivor: (survivorId) => {
        set((state) => {
          if (!state.run) return
          state.run.survivors = state.run.survivors.filter(
            (s) => s.id !== survivorId
          )
        })
      },

      // 分配幸存者到设施
      assignSurvivorToFacility: (survivorId, facilityId) => {
        set((state) => {
          if (!state.run) return
          // 先解除其他幸存者对该设施的分配
          if (facilityId) {
            state.run.survivors.forEach((s) => {
              if (s.assignedFacility === facilityId) {
                s.assignedFacility = undefined
              }
            })
          }
          // 分配
          const survivor = state.run.survivors.find((s) => s.id === survivorId)
          if (survivor) {
            survivor.assignedFacility = facilityId
          }
        })
      },

      // 更新幸存者需求
      updateSurvivorNeeds: (deltaHours) => {
        set((state) => {
          if (!state.run) return
          state.run.survivors.forEach((s) => {
            // 饥饿衰减
            s.hunger = Math.max(0, s.hunger - 10 * deltaHours)
            // 口渴衰减
            s.thirst = Math.max(0, s.thirst - 15 * deltaHours)
            // 健康衰减
            if (s.hunger <= 0) {
              s.health = Math.max(0, s.health - 5 * deltaHours)
            }
            if (s.thirst <= 0) {
              s.health = Math.max(0, s.health - 10 * deltaHours)
            }
            // 士气衰减
            if (s.hunger < 30 || s.thirst < 30) {
              s.morale = Math.max(0, s.morale - 5 * deltaHours)
            }
          })
        })
      },

      // 更新距离
      updateDistance: (delta) => {
        set((state) => {
          if (!state.run) return
          state.run.distance += delta
        })
      },

      // 游戏循环更新
      gameUpdate: (deltaMs) => {
        const { run } = get()
        if (!run || !run.isRunning) return

        const deltaHours = deltaMs / (1000 * 60 * 60)

        set((state) => {
          if (!state.run) return

          // 获取当前天气
          const currentWeather = state.run.weather.current

          // 更新设施产出
          state.run.facilities.forEach((facility) => {
            if (!facility.isActive) return
            const config = getFacilityConfig(facility.type)
            if (!config) return

            // 基础效率 = 1 + 0.5 * (等级-1)
            let efficiency = 1 + 0.5 * (facility.level - 1)

            // 天气对设施的影响
            if (facility.type === 'solar_panel') {
              // 太阳能板受天气影响
              if (currentWeather === 'rainy' || currentWeather === 'night') {
                efficiency *= 0 // 雨天/夜晚太阳能失效
              } else if (currentWeather === 'sandstorm') {
                efficiency *= 0.5 // 沙尘暴效率减半
              }
            } else if (facility.type === 'rain_collector') {
              // 雨水收集器在雨天效率提升
              if (currentWeather === 'rainy') {
                efficiency *= 3 // 雨天效率300%
              }
            }

            // 幸存者加成
            const assignedSurvivor = state.run?.survivors.find(s => s.assignedFacility === facility.id)
            if (assignedSurvivor) {
              // 基础幸存者加成 20%
              let survivorBonus = 0.2

              // 技能匹配加成
              const skillMatch = getSurvivorSkillMatch(assignedSurvivor.skill, facility.type)
              if (skillMatch) {
                // 技能匹配额外加成 30% + 技能等级 * 10%
                const skillLevel = (assignedSurvivor as any).skillLevel || 1
                survivorBonus += 0.3 + skillLevel * 0.1
              }

              // 士气影响效率
              const moraleMultiplier = assignedSurvivor.morale / 100
              survivorBonus *= moraleMultiplier

              efficiency *= (1 + survivorBonus)
            }

            // 产出
            if (config.baseProduction && state.run) {
              // 计算实际容量（基础 + 仓库加成）
              const capacity = calculateResourceCapacity(
                state.config.baseResourceCapacity,
                state.run.facilities
              )
              for (const [key, value] of Object.entries(config.baseProduction)) {
                if (value && state.run) {
                  const amount = value * efficiency * deltaHours
                  const k = key as keyof ResourceState
                  state.run.resources[k] = Math.min(
                    capacity,
                    state.run.resources[k] + amount
                  )
                }
              }
            }

            // 消耗
            if (config.baseConsumption && state.run) {
              for (const [key, value] of Object.entries(config.baseConsumption)) {
                if (value && state.run) {
                  const k = key as keyof ResourceState
                  state.run.resources[k] = Math.max(
                    0,
                    state.run.resources[k] - value * deltaHours
                  )
                }
              }
            }
          })

          // 更新幸存者需求
          if (!state.run) return
          state.run.survivors.forEach((s) => {
            s.hunger = Math.max(0, s.hunger - 10 * deltaHours)
            s.thirst = Math.max(0, s.thirst - 15 * deltaHours)
            if (s.hunger <= 0) s.health = Math.max(0, s.health - 5 * deltaHours)
            if (s.thirst <= 0) s.health = Math.max(0, s.health - 10 * deltaHours)
          })

          // 更新Boss行为
          if (state.run.wave.bossSpawned && !state.run.wave.bossDefeated && state.run.wave.bossState) {
            // 构建临时的 vehicleState
            const vehicleState = state.run.vehicle

            state.run.wave.bossState = updateBossBehavior(
              state.run.wave.bossState,
              vehicleState,
              deltaMs,
              Date.now()
            )
          }

          state.run.lastUpdateTime = Date.now()
        })
      },

      // 添加末世点数
      addApocalypsePoints: (points) => {
        set((state) => {
          state.meta.apocalypsePoints += points
        })
      },

      // 开始波次
      startWave: (waveNumber) => {
        set((state) => {
          if (!state.run) return
          state.run.wave = {
            isActive: true,
            currentWave: waveNumber,
            timeRemaining: 60000, // 60秒
            zombiesSpawned: 0,
            zombiesKilled: 0,
            eliteSpawned: false,
            bossSpawned: false,
            bossDefeated: false,
            isWarning: false,
            warningTimeRemaining: 0,
          }
        })
      },

      // 更新波次
      updateWave: (deltaMs) => {
        set((state) => {
          if (!state.run?.wave.isActive) return
          state.run.wave.timeRemaining = Math.max(0, state.run.wave.timeRemaining - deltaMs)
        })
      },

      // 完成波次 - 递增波次号
      completeWave: () => {
        set((state) => {
          if (!state.run) return
          const currentWave = state.run.wave.currentWave
          state.run.wave.isActive = false
          state.run.wave.timeRemaining = 0
          // 波次号递增，为下一波做准备
          state.run.wave.currentWave = currentWave + 1
          // 重置波次状态
          state.run.wave.zombiesSpawned = 0
          state.run.wave.zombiesKilled = 0
          state.run.wave.eliteSpawned = false
          state.run.wave.bossSpawned = false
          state.run.wave.bossDefeated = false
          state.run.wave.bossState = undefined
        })
      },

      // 生成Boss
      spawnBoss: (bossType: string) => {
        set((state) => {
          if (!state.run) return

          const bossState = createBoss(bossType)
          if (bossState) {
            state.run.wave.bossState = bossState
            state.run.wave.bossSpawned = true
            state.run.wave.bossDefeated = false
          }
        })
      },

      // 武器升级
      upgradeWeapon: (weaponType: string) => {
        const { run } = get()
        if (!run) return false

        const currentLevel = run.weaponUpgrades[weaponType as keyof typeof run.weaponUpgrades] || 0
        if (currentLevel <= 0 || currentLevel >= 5) return false // 未解锁或已满级

        // 升级成本：等级 * 基础成本
        const baseCost = { scrap: 50, parts: 30, electronics: 10 }
        const cost = {
          scrap: baseCost.scrap * currentLevel,
          parts: baseCost.parts * currentLevel,
          electronics: baseCost.electronics * currentLevel,
        }

        // 检查资源
        if (run.resources.scrap < cost.scrap ||
          run.resources.parts < cost.parts ||
          run.resources.electronics < cost.electronics) {
          return false
        }

        set((state) => {
          if (!state.run) return
          state.run.resources.scrap -= cost.scrap
          state.run.resources.parts -= cost.parts
          state.run.resources.electronics -= cost.electronics
            ; (state.run.weaponUpgrades as Record<string, number>)[weaponType] = currentLevel + 1
        })
        return true
      },

      // 解锁武器
      unlockWeapon: (weaponType: string) => {
        const { run } = get()
        if (!run) return false

        const currentLevel = run.weaponUpgrades[weaponType as keyof typeof run.weaponUpgrades] || 0
        if (currentLevel > 0) return false // 已解锁

        // 解锁成本
        const unlockCosts: Record<string, { scrap: number; parts: number; electronics: number }> = {
          shotgun: { scrap: 100, parts: 50, electronics: 20 },
          sniper: { scrap: 150, parts: 80, electronics: 40 },
          rocket_launcher: { scrap: 200, parts: 100, electronics: 60 },
          flamethrower: { scrap: 180, parts: 90, electronics: 50 },
          tesla_coil: { scrap: 250, parts: 120, electronics: 100 },
          freeze_ray: { scrap: 200, parts: 100, electronics: 80 },
          laser_turret: { scrap: 300, parts: 150, electronics: 150 },
        }

        const cost = unlockCosts[weaponType]
        if (!cost) return false

        if (run.resources.scrap < cost.scrap ||
          run.resources.parts < cost.parts ||
          run.resources.electronics < cost.electronics) {
          return false
        }

        set((state) => {
          if (!state.run) return
          state.run.resources.scrap -= cost.scrap
          state.run.resources.parts -= cost.parts
          state.run.resources.electronics -= cost.electronics
            ; (state.run.weaponUpgrades as Record<string, number>)[weaponType] = 1
        })
        return true
      },

      // 获取武器等级
      getWeaponLevel: (weaponType: string) => {
        const { run } = get()
        if (!run) return 0
        return run.weaponUpgrades[weaponType as keyof typeof run.weaponUpgrades] || 0
      },

      // 获取当前资源容量（基础 + 仓库加成）
      getResourceCapacity: () => {
        const { run, config } = get()
        if (!run) return config.baseResourceCapacity
        return calculateResourceCapacity(config.baseResourceCapacity, run.facilities)
      },

      // 车辆属性升级 - 按设计文档实现
      // 升级曲线：消耗 = 基础值 × (1.6 ^ (当前等级 - 1))
      upgradeVehicleStat: (stat) => {
        const { run } = get()
        if (!run) return false

        const currentLevel = run.vehicleUpgrades[stat as keyof typeof run.vehicleUpgrades] || 0

        // 各属性上限
        const maxLevels: Record<string, number> = {
          engine: 10,      // 速度+5%/级
          armor: 10,       // 护甲+10/级
          tire: 10,        // 碾压伤害+3%/级
          fuelTank: 5,     // 能源上限+20/级
          durability: 10,  // 耐久+50/级
        }

        if (currentLevel >= (maxLevels[stat] || 10)) return false // 已满级

        // 基础成本 - 按设计文档
        const baseCosts: Record<string, { scrap: number; parts?: number; fabric?: number; fuel?: number }> = {
          engine: { scrap: 30, parts: 10 },      // 引擎强化
          armor: { scrap: 40, parts: 15 },       // 装甲强化
          tire: { scrap: 25, fabric: 10 },       // 轮胎强化
          fuelTank: { scrap: 35, fuel: 5 },      // 油箱扩容
          durability: { scrap: 60, parts: 30 },  // 耐久强化
        }

        const base = baseCosts[stat]
        if (!base) return false

        // 升级曲线：消耗 = 基础值 × (1.6 ^ (当前等级))
        const multiplier = Math.pow(1.6, currentLevel)
        const cost = {
          scrap: Math.floor((base.scrap || 0) * multiplier),
          parts: Math.floor((base.parts || 0) * multiplier),
          fabric: Math.floor((base.fabric || 0) * multiplier),
          fuel: Math.floor((base.fuel || 0) * multiplier),
        }

        // 检查资源
        if (run.resources.scrap < cost.scrap) return false
        if (cost.parts > 0 && run.resources.parts < cost.parts) return false
        if (cost.fabric > 0 && run.resources.fabric < cost.fabric) return false
        if (cost.fuel > 0 && run.resources.fuel < cost.fuel) return false

        set((state) => {
          if (!state.run) return

          // 消耗资源
          state.run.resources.scrap -= cost.scrap
          if (cost.parts > 0) state.run.resources.parts -= cost.parts
          if (cost.fabric > 0) state.run.resources.fabric -= cost.fabric
          if (cost.fuel > 0) state.run.resources.fuel -= cost.fuel

            // 升级等级
            ; (state.run.vehicleUpgrades as Record<string, number>)[stat] = currentLevel + 1

          // 应用升级效果 - 按设计文档
          switch (stat) {
            case 'engine':
              // 速度+5%/级
              state.run.vehicle.stats.speed = Math.floor(state.run.vehicle.stats.speed * 1.05)
              break
            case 'armor':
              // 护甲+10/级
              state.run.vehicle.stats.armor += 10
              break
            case 'tire':
              // 碾压伤害+3%/级
              state.run.vehicle.stats.crushDamage = Math.floor(state.run.vehicle.stats.crushDamage * 1.03)
              break
            case 'fuelTank':
              // 能源上限+20/级
              state.run.vehicle.stats.energy += 20
              break
            case 'durability':
              // 耐久+50/级
              state.run.vehicle.maxDurability += 50
              state.run.vehicle.durability += 50
              break
          }
        })
        return true
      },

      // 车辆进化
      evolveVehicle: () => {
        const { run } = get()
        if (!run) return false

        const vehicleOrder = ['tricycle', 'van', 'truck', 'bus', 'fortress']
        const currentIndex = vehicleOrder.indexOf(run.vehicle.type)
        if (currentIndex === -1 || currentIndex >= vehicleOrder.length - 1) return false

        const nextType = vehicleOrder[currentIndex + 1]

        // 进化成本
        const evolveCosts: Record<string, { scrap: number; parts: number; electronics: number }> = {
          van: { scrap: 500, parts: 200, electronics: 50 },
          truck: { scrap: 1000, parts: 400, electronics: 100 },
          bus: { scrap: 2000, parts: 800, electronics: 200 },
          fortress: { scrap: 4000, parts: 1500, electronics: 500 },
        }

        const cost = evolveCosts[nextType]
        if (!cost) return false

        if (run.resources.scrap < cost.scrap ||
          run.resources.parts < cost.parts ||
          run.resources.electronics < cost.electronics) {
          return false
        }

        set((state) => {
          if (!state.run) return
          state.run.resources.scrap -= cost.scrap
          state.run.resources.parts -= cost.parts
          state.run.resources.electronics -= cost.electronics

          // 保留当前耐久百分比
          const durabilityPercent = state.run.vehicle.durability / state.run.vehicle.maxDurability

          // 更新车辆类型
          const newVehicle = createInitialVehicle(nextType)
          state.run.vehicle = {
            ...newVehicle,
            durability: Math.floor(newVehicle.maxDurability * durabilityPercent),
            position: state.run.vehicle.position,
          }
        })
        return true
      },

      // 技能树升级
      upgradeSkill: (skillId: string) => {
        const { meta } = get()
        const currentLevel = meta.skillTree[skillId] || 0

        // 从技能配置获取成本和最大等级
        const skill = SKILL_NODES.find(s => s.id === skillId)
        if (!skill) return false

        const cost = skill.costPerLevel
        if (meta.apocalypsePoints < cost) return false
        if (currentLevel >= skill.maxLevel) return false

        // 检查前置技能
        for (const prereq of skill.prerequisites) {
          const prereqLevel = meta.skillTree[prereq] || 0
          if (prereqLevel < 1) return false
        }

        set((state) => {
          state.meta.apocalypsePoints -= cost
          state.meta.skillTree[skillId] = currentLevel + 1
        })
        return true
      },

      // 获取技能等级
      getSkillLevel: (skillId: string) => {
        const { meta } = get()
        return meta.skillTree[skillId] || 0
      },

      // 装备配件
      equipAccessory: (slot, accessoryId) => {
        const { meta } = get()
        if (!meta.unlockedAccessories.includes(accessoryId)) return false

        set((state) => {
          state.meta.equippedAccessories[slot] = accessoryId
        })
        return true
      },

      // 解锁配件
      unlockAccessory: (accessoryId) => {
        set((state) => {
          if (!state.meta.unlockedAccessories.includes(accessoryId)) {
            state.meta.unlockedAccessories.push(accessoryId)
          }
        })
      },

      // 制作配件
      craftAccessory: (accessoryId: string) => {
        const { run, meta } = get()
        if (!run) return false
        if (meta.unlockedAccessories.includes(accessoryId)) return false

        // 简化的制作成本
        const craftCosts: Record<string, { scrap: number; parts?: number; electronics?: number }> = {
          electric_fence: { scrap: 200, electronics: 100 },
          armored_tire: { scrap: 300, parts: 150 },
        }

        const cost = craftCosts[accessoryId]
        if (!cost) return false

        if (run.resources.scrap < cost.scrap) return false
        if (cost.parts && run.resources.parts < cost.parts) return false
        if (cost.electronics && run.resources.electronics < cost.electronics) return false

        set((state) => {
          if (!state.run) return
          state.run.resources.scrap -= cost.scrap
          if (cost.parts) state.run.resources.parts -= cost.parts
          if (cost.electronics) state.run.resources.electronics -= cost.electronics
          state.meta.unlockedAccessories.push(accessoryId)
        })
        return true
      },

      // 天气系统
      updateWeatherTime: (deltaMs: number) => {
        set((state) => {
          if (!state.run) return
          state.run.weather.timeRemaining = Math.max(0, state.run.weather.timeRemaining - deltaMs)
        })
      },

      changeWeather: (newWeather) => {
        set((state) => {
          if (!state.run) return
          // 计算新天气持续时间
          const durations: Record<string, { min: number; max: number }> = {
            sunny: { min: 4, max: 8 },
            rainy: { min: 2, max: 4 },
            night: { min: 6, max: 6 },
            sandstorm: { min: 1, max: 2 },
          }
          const dur = durations[newWeather] || { min: 4, max: 4 }
          const hours = dur.min + Math.random() * (dur.max - dur.min)

          state.run.weather.current = newWeather
          state.run.weather.timeRemaining = hours * 60 * 60 * 1000
        })
      },

      // 重置游戏
      resetGame: () => {
        set((state) => {
          state.run = null
          state.meta = createInitialMetaState()
        })
      },
    })),
    {
      name: 'road-fury-save',
      partialize: (state) => ({
        run: state.run,
        meta: state.meta,
      }),
    }
  )
)

// 导出工具函数
export {
  createInitialRunState,
  createInitialMetaState,
  createInitialVehicle,
  createInitialResources,
  generateId,
}
