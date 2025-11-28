/**
 * 车辆配置表 - 增强版
 */

import type { VehicleTierConfig, FacilitySlot } from '@/types'

// 生成槽位辅助函数
function createSlots(config: {
  universal: number
  survival: number
  energy: number
  weapon: number
  special: number
  gridSize: { rows: number; cols: number }
}): FacilitySlot[] {
  const slots: FacilitySlot[] = []
  let id = 0
  const { cols } = config.gridSize

  // 按类型分配槽位到网格
  const types: Array<{ type: FacilitySlot['type']; count: number }> = [
    { type: 'universal', count: config.universal },
    { type: 'survival', count: config.survival },
    { type: 'energy', count: config.energy },
    { type: 'weapon', count: config.weapon },
    { type: 'special', count: config.special },
  ]

  let row = 0
  let col = 0

  for (const { type, count } of types) {
    for (let i = 0; i < count; i++) {
      slots.push({
        id: `slot_${id++}`,
        type,
        position: { row, col },
      })
      col++
      if (col >= cols) {
        col = 0
        row++
      }
    }
  }

  return slots
}

export const VEHICLE_CONFIGS: VehicleTierConfig[] = [
  {
    type: 'tricycle',
    name: '三轮电动车',
    gridSize: { rows: 2, cols: 1 },
    slots: createSlots({
      universal: 1,
      survival: 1,
      energy: 0,
      weapon: 0,
      special: 0,
      gridSize: { rows: 2, cols: 1 },
    }),
    armor: 10,
    power: 5,
    speed: 30,
    capacity: 1,
    maxDurability: 100,
    upgradeCost: null,
  },
  {
    type: 'van',
    name: '小型面包车',
    gridSize: { rows: 2, cols: 2 },
    slots: createSlots({
      universal: 2,
      survival: 1,
      energy: 1,
      weapon: 0,
      special: 0,
      gridSize: { rows: 2, cols: 2 },
    }),
    armor: 25,
    power: 15,
    speed: 40,
    capacity: 2,
    maxDurability: 200,
    upgradeCost: {
      scrap: 500,
      parts: 100,
    },
  },
  {
    type: 'truck',
    name: '中型货车',
    gridSize: { rows: 3, cols: 2 },
    slots: createSlots({
      universal: 2,
      survival: 2,
      energy: 1,
      weapon: 1,
      special: 0,
      gridSize: { rows: 3, cols: 2 },
    }),
    armor: 50,
    power: 30,
    speed: 35,
    capacity: 4,
    maxDurability: 350,
    upgradeCost: {
      scrap: 1500,
      parts: 300,
    },
  },
  {
    type: 'bus',
    name: '大型巴士',
    gridSize: { rows: 4, cols: 2 },
    slots: createSlots({
      universal: 3,
      survival: 2,
      energy: 2,
      weapon: 1,
      special: 0,
      gridSize: { rows: 4, cols: 2 },
    }),
    armor: 70,
    power: 40,
    speed: 30,
    capacity: 6,
    maxDurability: 500,
    upgradeCost: {
      scrap: 3000,
      parts: 600,
      electronics: 100,
    },
  },
  {
    type: 'fortress',
    name: '改装卡车',
    gridSize: { rows: 4, cols: 3 },
    slots: createSlots({
      universal: 3,
      survival: 3,
      energy: 2,
      weapon: 2,
      special: 1,
      gridSize: { rows: 4, cols: 3 },
    }),
    armor: 100,
    power: 60,
    speed: 25,
    capacity: 8,
    maxDurability: 800,
    upgradeCost: {
      scrap: 6000,
      parts: 1200,
      electronics: 300,
    },
  },
]

export function getVehicleConfig(
  type: string
): VehicleTierConfig | undefined {
  return VEHICLE_CONFIGS.find((v) => v.type === type)
}

export function getNextVehicleTier(
  currentType: string
): VehicleTierConfig | undefined {
  const currentIndex = VEHICLE_CONFIGS.findIndex((v) => v.type === currentType)
  if (currentIndex === -1 || currentIndex >= VEHICLE_CONFIGS.length - 1) {
    return undefined
  }
  return VEHICLE_CONFIGS[currentIndex + 1]
}

// 槽位类型颜色
export const SLOT_COLORS: Record<string, string> = {
  universal: '#888888',
  survival: '#4CAF50',
  energy: '#FFC107',
  weapon: '#F44336',
  special: '#9C27B0',
}

// 槽位类型名称
export const SLOT_NAMES: Record<string, string> = {
  universal: '通用槽',
  survival: '生存槽',
  energy: '能源槽',
  weapon: '武器槽',
  special: '特殊槽',
}
