/**
 * 外观定制配置
 */

import type { VehicleSkin, VehicleDecal, VehicleOrnament, SurvivorAppearance } from '@/types/customization'

// 车辆涂装配置
export const VEHICLE_SKINS: VehicleSkin[] = [
  // 基础涂装
  {
    id: 'default',
    name: '原始涂装',
    description: '朴素但实用的原始外观',
    icon: '🚗',
    rarity: 'common',
    primaryColor: '#666666',
    secondaryColor: '#444444',
    pattern: 'solid'
  },
  {
    id: 'rust_red',
    name: '锈红战车',
    description: '末世风格的锈红色涂装',
    icon: '🔴',
    rarity: 'common',
    primaryColor: '#8B4513',
    secondaryColor: '#A0522D',
    pattern: 'solid',
    unlockCondition: { type: 'distance', value: 500 }
  },
  {
    id: 'desert_camo',
    name: '沙漠迷彩',
    description: '适合荒漠环境的迷彩涂装',
    icon: '🏜️',
    rarity: 'rare',
    primaryColor: '#D2B48C',
    secondaryColor: '#8B7355',
    pattern: 'camo',
    unlockCondition: { type: 'distance', value: 2000 }
  },
  {
    id: 'midnight_black',
    name: '午夜黑影',
    description: '深邃的黑色涂装，夜间行动更隐蔽',
    icon: '🌑',
    rarity: 'rare',
    primaryColor: '#1a1a1a',
    secondaryColor: '#333333',
    pattern: 'solid',
    unlockCondition: { type: 'kills', value: 1000 }
  },
  {
    id: 'flame_fury',
    name: '烈焰狂怒',
    description: '燃烧的火焰图案，展示你的狂野',
    icon: '🔥',
    rarity: 'epic',
    primaryColor: '#FF4500',
    secondaryColor: '#FFD700',
    pattern: 'flame',
    unlockCondition: { type: 'kills', value: 5000 }
  },
  {
    id: 'skull_rider',
    name: '骷髅骑士',
    description: '恐怖的骷髅图案，让敌人闻风丧胆',
    icon: '💀',
    rarity: 'epic',
    primaryColor: '#2F4F4F',
    secondaryColor: '#FFFFFF',
    pattern: 'skull',
    unlockCondition: { type: 'boss', value: 'all' }
  },
  {
    id: 'golden_survivor',
    name: '黄金幸存者',
    description: '传说中的黄金涂装，只有真正的幸存者才能拥有',
    icon: '👑',
    rarity: 'legendary',
    primaryColor: '#FFD700',
    secondaryColor: '#DAA520',
    pattern: 'solid',
    unlockCondition: { type: 'distance', value: 10000 }
  },
  {
    id: 'tribal_warrior',
    name: '部落战士',
    description: '原始部落风格的图腾涂装',
    icon: '🏹',
    rarity: 'epic',
    primaryColor: '#8B0000',
    secondaryColor: '#000000',
    pattern: 'tribal',
    unlockCondition: { type: 'achievement', value: 'tribal_master' }
  }
]

// 车辆贴纸配置
export const VEHICLE_DECALS: VehicleDecal[] = [
  {
    id: 'warning_zombie',
    name: '丧尸警告',
    icon: '⚠️',
    position: 'side',
    unlockCondition: { type: 'kills', value: 100 }
  },
  {
    id: 'survivor_count',
    name: '幸存者计数',
    icon: '👥',
    position: 'rear',
    unlockCondition: { type: 'distance', value: 1000 }
  },
  {
    id: 'road_fury_logo',
    name: 'Road Fury标志',
    icon: '🛣️',
    position: 'front'
  },
  {
    id: 'skull_crossbones',
    name: '骷髅交叉骨',
    icon: '☠️',
    position: 'side',
    unlockCondition: { type: 'kills', value: 2000 }
  },
  {
    id: 'racing_stripes',
    name: '赛车条纹',
    icon: '🏁',
    position: 'roof',
    unlockCondition: { type: 'distance', value: 3000 }
  },
  {
    id: 'biohazard',
    name: '生化危险',
    icon: '☣️',
    position: 'side',
    unlockCondition: { type: 'boss', value: 'mutant_giant' }
  }
]

// 车辆装饰物配置
export const VEHICLE_ORNAMENTS: VehicleOrnament[] = [
  {
    id: 'antenna_flag',
    name: '天线旗帜',
    icon: '🚩',
    description: '在天线上飘扬的小旗',
    position: 'antenna'
  },
  {
    id: 'hood_skull',
    name: '引擎盖骷髅',
    icon: '💀',
    description: '威慑敌人的骷髅装饰',
    position: 'hood',
    unlockCondition: { type: 'kills', value: 500 }
  },
  {
    id: 'mirror_dice',
    name: '后视镜骰子',
    icon: '🎲',
    description: '幸运骰子挂件',
    position: 'mirror',
    unlockCondition: { type: 'distance', value: 800 }
  },
  {
    id: 'hood_eagle',
    name: '引擎盖雄鹰',
    icon: '🦅',
    description: '展翅高飞的雄鹰',
    position: 'hood',
    unlockCondition: { type: 'distance', value: 5000 }
  },
  {
    id: 'antenna_teddy',
    name: '天线小熊',
    icon: '🧸',
    description: '可爱的泰迪熊挂件',
    position: 'antenna',
    unlockCondition: { type: 'achievement', value: 'rescue_child' }
  }
]

// 幸存者外观配置
export const SURVIVOR_APPEARANCES: SurvivorAppearance[] = [
  // 服装
  {
    id: 'outfit_default',
    name: '普通服装',
    icon: '👕',
    type: 'outfit',
    rarity: 'common'
  },
  {
    id: 'outfit_military',
    name: '军装',
    icon: '🎖️',
    type: 'outfit',
    rarity: 'rare',
    unlockCondition: { type: 'distance', value: 2000 }
  },
  {
    id: 'outfit_hazmat',
    name: '防护服',
    icon: '🥼',
    type: 'outfit',
    rarity: 'epic',
    unlockCondition: { type: 'boss', value: 'toxic_behemoth' }
  },
  // 帽子
  {
    id: 'hat_cap',
    name: '棒球帽',
    icon: '🧢',
    type: 'hat',
    rarity: 'common'
  },
  {
    id: 'hat_helmet',
    name: '头盔',
    icon: '⛑️',
    type: 'hat',
    rarity: 'rare',
    unlockCondition: { type: 'kills', value: 1000 }
  },
  {
    id: 'hat_crown',
    name: '王冠',
    icon: '👑',
    type: 'hat',
    rarity: 'epic',
    unlockCondition: { type: 'distance', value: 10000 }
  },
  // 配饰
  {
    id: 'acc_sunglasses',
    name: '墨镜',
    icon: '🕶️',
    type: 'accessory',
    rarity: 'common',
    unlockCondition: { type: 'distance', value: 500 }
  },
  {
    id: 'acc_mask',
    name: '防毒面具',
    icon: '😷',
    type: 'accessory',
    rarity: 'rare',
    unlockCondition: { type: 'boss', value: 'toxic_behemoth' }
  }
]

// 获取已解锁的涂装
export function getUnlockedSkins(
  totalDistance: number,
  totalKills: number,
  defeatedBosses: string[],
  achievements: string[]
): VehicleSkin[] {
  return VEHICLE_SKINS.filter(skin => {
    if (!skin.unlockCondition) return true
    
    const { type, value } = skin.unlockCondition
    switch (type) {
      case 'distance':
        return totalDistance >= (value as number)
      case 'kills':
        return totalKills >= (value as number)
      case 'boss':
        if (value === 'all') {
          return defeatedBosses.length >= 5  // 假设有5个Boss
        }
        return defeatedBosses.includes(value as string)
      case 'achievement':
        return achievements.includes(value as string)
      default:
        return false
    }
  })
}

// 获取涂装配置
export function getSkinConfig(skinId: string): VehicleSkin | undefined {
  return VEHICLE_SKINS.find(s => s.id === skinId)
}

// 获取贴纸配置
export function getDecalConfig(decalId: string): VehicleDecal | undefined {
  return VEHICLE_DECALS.find(d => d.id === decalId)
}

// 获取装饰物配置
export function getOrnamentConfig(ornamentId: string): VehicleOrnament | undefined {
  return VEHICLE_ORNAMENTS.find(o => o.id === ornamentId)
}
