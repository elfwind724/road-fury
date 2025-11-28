/**
 * 事件配置 - 丰富的故事事件
 */

import type { GameEvent } from '@/types/event'

export const GAME_EVENTS: GameEvent[] = [
  // ========== 遭遇事件 ==========
  {
    id: 'lone_survivor',
    title: '孤独的幸存者',
    description: '你发现路边有一个疲惫的幸存者正在向你招手。他看起来饥肠辘辘，但眼神中透着希望。',
    icon: '🧑',
    type: 'encounter',
    rarity: 'common',
    choices: [
      {
        id: 'rescue',
        text: '救助他',
        icon: '🤝',
        requirements: { resources: { food: 10, water: 10 } },
        effects: [
          { type: 'resource', target: 'food', value: -10 },
          { type: 'resource', target: 'water', value: -10 },
          { type: 'survivor', value: 1, probability: 80 },
          { type: 'morale', value: 10 }
        ]
      },
      {
        id: 'ignore',
        text: '继续前进',
        icon: '🚗',
        effects: [
          { type: 'morale', value: -5 }
        ]
      }
    ],
    triggerConditions: { minDistance: 100 }
  },
  {
    id: 'wandering_merchant',
    title: '流浪商人',
    description: '一个推着小车的商人拦住了你的去路。"朋友，要不要看看我的货物？都是好东西！"',
    icon: '🛒',
    type: 'encounter',
    rarity: 'uncommon',
    choices: [
      {
        id: 'trade_food',
        text: '用废料换食物',
        icon: '🍖',
        requirements: { resources: { scrap: 50 } },
        effects: [
          { type: 'resource', target: 'scrap', value: -50 },
          { type: 'resource', target: 'food', value: 30 },
          { type: 'resource', target: 'water', value: 20 }
        ]
      },
      {
        id: 'trade_parts',
        text: '用废料换零件',
        icon: '🔧',
        requirements: { resources: { scrap: 80 } },
        effects: [
          { type: 'resource', target: 'scrap', value: -80 },
          { type: 'resource', target: 'parts', value: 40 },
          { type: 'resource', target: 'electronics', value: 15 }
        ]
      },
      {
        id: 'decline',
        text: '婉拒离开',
        icon: '👋',
        effects: []
      }
    ],
    triggerConditions: { minDistance: 300 },
    cooldown: 600000  // 10分钟冷却
  },

  // ========== 资源事件 ==========
  {
    id: 'abandoned_car',
    title: '废弃车辆',
    description: '路边有一辆废弃的汽车，看起来还有些可用的零件。',
    icon: '🚙',
    type: 'resource',
    rarity: 'common',
    choices: [
      {
        id: 'search',
        text: '搜索车辆',
        icon: '🔍',
        effects: [
          { type: 'resource', target: 'scrap', value: 30, probability: 90 },
          { type: 'resource', target: 'parts', value: 15, probability: 60 },
          { type: 'resource', target: 'fuel', value: 10, probability: 40 }
        ]
      },
      {
        id: 'skip',
        text: '跳过',
        icon: '⏭️',
        effects: []
      }
    ]
  },
  {
    id: 'supply_cache',
    title: '物资藏匿点',
    description: '你发现了一个隐蔽的物资藏匿点，里面似乎有不少好东西！',
    icon: '📦',
    type: 'resource',
    rarity: 'rare',
    choices: [
      {
        id: 'loot_all',
        text: '全部拿走',
        icon: '💰',
        effects: [
          { type: 'resource', target: 'food', value: 50 },
          { type: 'resource', target: 'water', value: 40 },
          { type: 'resource', target: 'medicine', value: 20 },
          { type: 'resource', target: 'ammo', value: 30 }
        ]
      }
    ],
    triggerConditions: { minDistance: 500 },
    oneTime: true
  },
  {
    id: 'gas_station',
    title: '废弃加油站',
    description: '一个废弃的加油站出现在前方，油罐里可能还有燃料。',
    icon: '⛽',
    type: 'resource',
    rarity: 'uncommon',
    choices: [
      {
        id: 'siphon_fuel',
        text: '抽取燃料',
        icon: '🛢️',
        requirements: { resources: { parts: 5 } },
        effects: [
          { type: 'resource', target: 'parts', value: -5 },
          { type: 'resource', target: 'fuel', value: 40, probability: 80 }
        ]
      },
      {
        id: 'search_store',
        text: '搜索便利店',
        icon: '🏪',
        effects: [
          { type: 'resource', target: 'food', value: 25, probability: 70 },
          { type: 'resource', target: 'medicine', value: 10, probability: 50 },
          { type: 'spawn_zombie', value: 3, probability: 40 }
        ]
      }
    ],
    triggerConditions: { minDistance: 200 },
    cooldown: 900000  // 15分钟冷却
  },

  // ========== 危险事件 ==========
  {
    id: 'zombie_horde',
    title: '丧尸群',
    description: '前方道路上聚集了一大群丧尸！必须做出选择。',
    icon: '🧟',
    type: 'danger',
    rarity: 'common',
    choices: [
      {
        id: 'charge_through',
        text: '冲过去！',
        icon: '💥',
        effects: [
          { type: 'damage', value: 20, probability: 60 },
          { type: 'resource', target: 'scrap', value: 20 }
        ]
      },
      {
        id: 'detour',
        text: '绕道而行',
        icon: '🔄',
        effects: [
          { type: 'resource', target: 'fuel', value: -15 }
        ]
      },
      {
        id: 'fight',
        text: '停车战斗',
        icon: '⚔️',
        requirements: { resources: { ammo: 20 } },
        effects: [
          { type: 'resource', target: 'ammo', value: -20 },
          { type: 'resource', target: 'scrap', value: 40 },
          { type: 'morale', value: 5 }
        ]
      }
    ],
    triggerConditions: { minDistance: 150 }
  },
  {
    id: 'bandit_ambush',
    title: '强盗伏击',
    description: '一群强盗从路障后跳出来，要求你交出物资！',
    icon: '🏴‍☠️',
    type: 'danger',
    rarity: 'rare',
    choices: [
      {
        id: 'pay_tribute',
        text: '交出物资',
        icon: '💸',
        effects: [
          { type: 'resource', target: 'scrap', value: -100 },
          { type: 'resource', target: 'food', value: -30 }
        ]
      },
      {
        id: 'fight_back',
        text: '反击！',
        icon: '🔫',
        requirements: { resources: { ammo: 30 }, survivors: 2 },
        successChance: 60,
        successEffects: [
          { type: 'resource', target: 'ammo', value: -30 },
          { type: 'resource', target: 'scrap', value: 150 },
          { type: 'resource', target: 'parts', value: 50 },
          { type: 'morale', value: 15 }
        ],
        failEffects: [
          { type: 'resource', target: 'ammo', value: -30 },
          { type: 'damage', value: 50 },
          { type: 'health', value: -30 },
          { type: 'morale', value: -20 }
        ],
        effects: []
      },
      {
        id: 'ram_through',
        text: '加速冲撞',
        icon: '🚗💨',
        effects: [
          { type: 'damage', value: 30 },
          { type: 'resource', target: 'fuel', value: -20 }
        ]
      }
    ],
    triggerConditions: { minDistance: 800 },
    cooldown: 1800000  // 30分钟冷却
  },


  // ========== 故事事件 ==========
  {
    id: 'radio_signal',
    title: '神秘电台信号',
    description: '你的收音机突然收到一段微弱的信号："...安全区...北方50公里...幸存者聚集地..."',
    icon: '📻',
    type: 'story',
    rarity: 'epic',
    choices: [
      {
        id: 'follow_signal',
        text: '追踪信号',
        icon: '📡',
        requirements: { facility: 'radio' },
        effects: [
          { type: 'morale', value: 20 },
          { type: 'survivor', value: 1, probability: 50 }
        ]
      },
      {
        id: 'ignore_signal',
        text: '可能是陷阱',
        icon: '🤔',
        effects: []
      }
    ],
    triggerConditions: { minDistance: 1000, hasFacility: 'radio' },
    oneTime: true
  },
  {
    id: 'child_survivor',
    title: '迷路的孩子',
    description: '一个小女孩躲在废墟后面哭泣，她说她和家人走散了。',
    icon: '👧',
    type: 'story',
    rarity: 'rare',
    choices: [
      {
        id: 'take_in',
        text: '收留她',
        icon: '🏠',
        effects: [
          { type: 'resource', target: 'food', value: -20 },
          { type: 'morale', value: 15 },
          { type: 'survivor', value: 1 }
        ]
      },
      {
        id: 'give_supplies',
        text: '给她物资让她自己找',
        icon: '🎒',
        effects: [
          { type: 'resource', target: 'food', value: -30 },
          { type: 'resource', target: 'water', value: -20 },
          { type: 'morale', value: -5 }
        ]
      }
    ],
    triggerConditions: { minDistance: 400 },
    oneTime: true
  },
  {
    id: 'military_convoy',
    title: '军方车队残骸',
    description: '你发现了一支被摧毁的军方车队，周围散落着武器和装备。',
    icon: '🎖️',
    type: 'story',
    rarity: 'epic',
    choices: [
      {
        id: 'thorough_search',
        text: '仔细搜索',
        icon: '🔎',
        effects: [
          { type: 'resource', target: 'ammo', value: 80 },
          { type: 'resource', target: 'parts', value: 60 },
          { type: 'resource', target: 'electronics', value: 40 },
          { type: 'resource', target: 'medicine', value: 30 },
          { type: 'spawn_zombie', value: 8, probability: 70 }
        ]
      },
      {
        id: 'quick_grab',
        text: '快速拿取',
        icon: '🏃',
        effects: [
          { type: 'resource', target: 'ammo', value: 40 },
          { type: 'resource', target: 'parts', value: 30 }
        ]
      }
    ],
    triggerConditions: { minDistance: 1500 },
    oneTime: true
  },

  // ========== 天气事件 ==========
  {
    id: 'incoming_storm',
    title: '暴风雨来袭',
    description: '天空变得阴沉，一场暴风雨即将来临。',
    icon: '⛈️',
    type: 'weather',
    rarity: 'uncommon',
    choices: [
      {
        id: 'find_shelter',
        text: '寻找避难所',
        icon: '🏚️',
        effects: [
          { type: 'resource', target: 'fuel', value: -10 },
          { type: 'weather', target: 'rainy', value: 1 }
        ]
      },
      {
        id: 'push_through',
        text: '继续前进',
        icon: '🌧️',
        effects: [
          { type: 'damage', value: 15, probability: 50 },
          { type: 'morale', value: -10 },
          { type: 'weather', target: 'rainy', value: 1 }
        ]
      }
    ],
    triggerConditions: { minDistance: 200 },
    cooldown: 1200000  // 20分钟冷却
  },
  {
    id: 'sandstorm_warning',
    title: '沙尘暴预警',
    description: '远处扬起了巨大的沙尘，沙尘暴正在逼近！',
    icon: '🌪️',
    type: 'weather',
    rarity: 'rare',
    choices: [
      {
        id: 'take_cover',
        text: '停车躲避',
        icon: '🛑',
        effects: [
          { type: 'weather', target: 'sandstorm', value: 1 }
        ]
      },
      {
        id: 'race_storm',
        text: '加速逃离',
        icon: '💨',
        effects: [
          { type: 'resource', target: 'fuel', value: -25 },
          { type: 'damage', value: 20, probability: 40 }
        ]
      }
    ],
    triggerConditions: { minDistance: 600 },
    cooldown: 1800000  // 30分钟冷却
  },

  // ========== 选择事件 ==========
  {
    id: 'fork_in_road',
    title: '岔路口',
    description: '前方道路分成两条：一条是平坦的主路，另一条是崎岖的小路但似乎有物资标记。',
    icon: '🔀',
    type: 'choice',
    rarity: 'common',
    choices: [
      {
        id: 'main_road',
        text: '走主路',
        icon: '🛣️',
        effects: []
      },
      {
        id: 'side_path',
        text: '走小路',
        icon: '🏔️',
        effects: [
          { type: 'damage', value: 10, probability: 30 },
          { type: 'resource', target: 'scrap', value: 50, probability: 70 },
          { type: 'resource', target: 'parts', value: 25, probability: 50 }
        ]
      }
    ],
    triggerConditions: { minDistance: 100 }
  },
  {
    id: 'mysterious_bunker',
    title: '神秘地堡',
    description: '你发现了一个隐蔽的地下掩体入口，门上有警告标志。',
    icon: '🚪',
    type: 'choice',
    rarity: 'rare',
    choices: [
      {
        id: 'enter_bunker',
        text: '进入探索',
        icon: '🔦',
        requirements: { survivors: 1 },
        successChance: 50,
        successEffects: [
          { type: 'resource', target: 'electronics', value: 80 },
          { type: 'resource', target: 'medicine', value: 50 },
          { type: 'resource', target: 'ammo', value: 60 }
        ],
        failEffects: [
          { type: 'health', value: -40 },
          { type: 'morale', value: -15 }
        ],
        effects: []
      },
      {
        id: 'leave_bunker',
        text: '太危险了',
        icon: '🚶',
        effects: []
      }
    ],
    triggerConditions: { minDistance: 700 },
    oneTime: true
  },
  {
    id: 'survivor_conflict',
    title: '幸存者冲突',
    description: '两个幸存者因为物资分配问题发生了激烈争吵，需要你来调解。',
    icon: '😤',
    type: 'choice',
    rarity: 'uncommon',
    choices: [
      {
        id: 'side_with_a',
        text: '支持甲方',
        icon: '👈',
        effects: [
          { type: 'morale', value: -10 }
        ]
      },
      {
        id: 'side_with_b',
        text: '支持乙方',
        icon: '👉',
        effects: [
          { type: 'morale', value: -10 }
        ]
      },
      {
        id: 'fair_split',
        text: '公平分配',
        icon: '⚖️',
        requirements: { resources: { food: 20 } },
        effects: [
          { type: 'resource', target: 'food', value: -20 },
          { type: 'morale', value: 10 }
        ]
      }
    ],
    triggerConditions: { minSurvivors: 3 }
  }
]

// 获取可触发的事件
export function getAvailableEvents(
  distance: number,
  survivors: number,
  weather: string,
  facilities: string[],
  eventHistory: string[],
  eventCooldowns: Record<string, number>,
  currentTime: number
): GameEvent[] {
  return GAME_EVENTS.filter(event => {
    // 检查一次性事件
    if (event.oneTime && eventHistory.includes(event.id)) {
      return false
    }
    
    // 检查冷却
    if (event.cooldown && eventCooldowns[event.id]) {
      if (currentTime - eventCooldowns[event.id] < event.cooldown) {
        return false
      }
    }
    
    // 检查触发条件
    const cond = event.triggerConditions
    if (cond) {
      if (cond.minDistance && distance < cond.minDistance) return false
      if (cond.maxDistance && distance > cond.maxDistance) return false
      if (cond.minSurvivors && survivors < cond.minSurvivors) return false
      if (cond.weather && weather !== cond.weather) return false
      if (cond.hasFacility && !facilities.includes(cond.hasFacility)) return false
    }
    
    return true
  })
}

// 根据稀有度随机选择事件
export function selectRandomEvent(events: GameEvent[]): GameEvent | null {
  if (events.length === 0) return null
  
  // 稀有度权重
  const weights: Record<string, number> = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 5
  }
  
  const weightedEvents = events.map(e => ({
    event: e,
    weight: weights[e.rarity] || 10
  }))
  
  const totalWeight = weightedEvents.reduce((sum, e) => sum + e.weight, 0)
  let random = Math.random() * totalWeight
  
  for (const { event, weight } of weightedEvents) {
    random -= weight
    if (random <= 0) return event
  }
  
  return events[0]
}
