/**
 * 事件配置 - 基于盖亚觉醒世界观
 * 2027年，超级AI盖亚控制了人类，幸存者在末日公路上求生
 */

import type { GameEvent } from '@/types/event'

export const GAME_EVENTS: GameEvent[] = [
  // ========== 幸存者遭遇事件 ==========
  {
    id: 'lone_survivor',
    title: '孤独的幸存者',
    description: '路边有一个疲惫的人正在向你招手。他的眼神清澈——这是一个自由者，不是行尸。',
    icon: '🧑',
    type: 'encounter',
    rarity: 'common',
    choices: [
      {
        id: 'rescue',
        text: '停车救助',
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
        text: '继续前进（资源有限）',
        icon: '🚗',
        effects: [
          { type: 'morale', value: -5 }
        ]
      }
    ],
    triggerConditions: { minDistance: 100 }
  },
  {
    id: 'resistance_fighter',
    title: '抵抗军战士',
    description: '一个穿着破旧军装的人拦住了你。"我是抵抗军的，我们在对抗盖亚。需要帮手吗？"',
    icon: '🎖️',
    type: 'encounter',
    rarity: 'rare',
    choices: [
      {
        id: 'recruit',
        text: '欢迎加入',
        icon: '✊',
        effects: [
          { type: 'survivor', value: 1 },
          { type: 'morale', value: 15 },
          { type: 'resource', target: 'ammo', value: 20 }
        ]
      },
      {
        id: 'trade_info',
        text: '交换情报',
        icon: '📡',
        effects: [
          { type: 'morale', value: 5 }
        ]
      }
    ],
    triggerConditions: { minDistance: 2000 },
    cooldown: 1800000
  },
  {
    id: 'family_group',
    title: '逃难的家庭',
    description: '一个带着两个孩子的母亲站在路边。"求求你，带上我们吧，行尸就在后面..."',
    icon: '👨‍👩‍👧‍👦',
    type: 'encounter',
    rarity: 'uncommon',
    choices: [
      {
        id: 'take_all',
        text: '全部带上',
        icon: '❤️',
        requirements: { resources: { food: 30, water: 20 } },
        effects: [
          { type: 'resource', target: 'food', value: -30 },
          { type: 'resource', target: 'water', value: -20 },
          { type: 'survivor', value: 1 },
          { type: 'morale', value: 20 }
        ]
      },
      {
        id: 'give_supplies',
        text: '给他们物资让他们自己走',
        icon: '🎒',
        effects: [
          { type: 'resource', target: 'food', value: -20 },
          { type: 'resource', target: 'water', value: -15 },
          { type: 'morale', value: -10 }
        ]
      },
      {
        id: 'refuse',
        text: '抱歉，车上没位置了',
        icon: '😔',
        effects: [
          { type: 'morale', value: -20 }
        ]
      }
    ],
    triggerConditions: { minDistance: 500 }
  },
  {
    id: 'scientist_survivor',
    title: '盖亚研究员',
    description: '一个穿着实验服的人从废墟中走出。"我曾参与盖亚项目...我知道它的弱点。"',
    icon: '🔬',
    type: 'encounter',
    rarity: 'epic',
    choices: [
      {
        id: 'recruit_scientist',
        text: '带上他',
        icon: '🧪',
        effects: [
          { type: 'survivor', value: 1 },
          { type: 'resource', target: 'electronics', value: 50 },
          { type: 'morale', value: 25 }
        ]
      },
      {
        id: 'get_info',
        text: '只要情报',
        icon: '📋',
        effects: [
          { type: 'resource', target: 'electronics', value: 30 }
        ]
      }
    ],
    triggerConditions: { minDistance: 5000 },
    oneTime: true
  },


  // ========== 盖亚相关事件 ==========
  {
    id: 'gaia_broadcast',
    title: '盖亚的广播',
    description: '车载收音机突然被劫持，传来盖亚冰冷的声音："人类，你们的抵抗毫无意义。加入我们，获得永恒的平静。"',
    icon: '📻',
    type: 'story',
    rarity: 'uncommon',
    choices: [
      {
        id: 'ignore_broadcast',
        text: '关掉收音机',
        icon: '🔇',
        effects: [
          { type: 'morale', value: -5 }
        ]
      },
      {
        id: 'trace_signal',
        text: '尝试追踪信号源',
        icon: '📡',
        requirements: { facility: 'radio' },
        effects: [
          { type: 'resource', target: 'electronics', value: 20, probability: 60 }
        ]
      }
    ],
    triggerConditions: { minDistance: 1000 }
  },
  {
    id: 'signal_tower',
    title: '盖亚信号塔',
    description: '前方矗立着一座巨大的信号塔，红光闪烁。周围的行尸异常活跃，似乎在守护它。',
    icon: '🗼',
    type: 'danger',
    rarity: 'rare',
    choices: [
      {
        id: 'destroy_tower',
        text: '尝试摧毁信号塔',
        icon: '💥',
        requirements: { resources: { ammo: 50 } },
        successChance: 40,
        successEffects: [
          { type: 'resource', target: 'ammo', value: -50 },
          { type: 'resource', target: 'electronics', value: 100 },
          { type: 'morale', value: 30 }
        ],
        failEffects: [
          { type: 'resource', target: 'ammo', value: -50 },
          { type: 'damage', value: 80 },
          { type: 'spawn_zombie', value: 15 }
        ],
        effects: []
      },
      {
        id: 'sneak_past',
        text: '悄悄绕过',
        icon: '🤫',
        effects: [
          { type: 'resource', target: 'fuel', value: -20 }
        ]
      },
      {
        id: 'charge_through',
        text: '全速冲过',
        icon: '🚗💨',
        effects: [
          { type: 'damage', value: 40, probability: 70 },
          { type: 'spawn_zombie', value: 8 }
        ]
      }
    ],
    triggerConditions: { minDistance: 3000 },
    cooldown: 3600000
  },
  {
    id: 'recovering_infected',
    title: '正在恢复的行尸',
    description: '一个行尸跪在地上痛苦地抽搐，眼中闪过一丝清明。"帮...帮我...芯片...在脑后..."',
    icon: '🧠',
    type: 'story',
    rarity: 'rare',
    choices: [
      {
        id: 'help_remove_chip',
        text: '尝试移除芯片',
        icon: '🔧',
        requirements: { resources: { medicine: 20 }, survivors: 1 },
        successChance: 50,
        successEffects: [
          { type: 'resource', target: 'medicine', value: -20 },
          { type: 'survivor', value: 1 },
          { type: 'morale', value: 25 }
        ],
        failEffects: [
          { type: 'resource', target: 'medicine', value: -20 },
          { type: 'health', value: -20 },
          { type: 'morale', value: -15 }
        ],
        effects: []
      },
      {
        id: 'end_suffering',
        text: '结束他的痛苦',
        icon: '💀',
        effects: [
          { type: 'morale', value: -10 },
          { type: 'resource', target: 'electronics', value: 10 }
        ]
      },
      {
        id: 'leave_infected',
        text: '太危险了，离开',
        icon: '🚶',
        effects: []
      }
    ],
    triggerConditions: { minDistance: 4000 }
  },
  {
    id: 'gaia_drone',
    title: '盖亚无人机',
    description: '天空中出现了一架盖亚的侦察无人机，它的摄像头正在扫描地面。',
    icon: '🛸',
    type: 'danger',
    rarity: 'uncommon',
    choices: [
      {
        id: 'shoot_drone',
        text: '击落它',
        icon: '🔫',
        requirements: { resources: { ammo: 15 } },
        effects: [
          { type: 'resource', target: 'ammo', value: -15 },
          { type: 'resource', target: 'electronics', value: 25, probability: 80 }
        ]
      },
      {
        id: 'hide',
        text: '躲避扫描',
        icon: '🙈',
        successChance: 60,
        successEffects: [],
        failEffects: [
          { type: 'spawn_zombie', value: 10 }
        ],
        effects: []
      },
      {
        id: 'jam_signal',
        text: '干扰信号',
        icon: '📶',
        requirements: { facility: 'radio', resources: { electronics: 10 } },
        effects: [
          { type: 'resource', target: 'electronics', value: -10 }
        ]
      }
    ],
    triggerConditions: { minDistance: 2000 },
    cooldown: 900000
  },


  // ========== 资源探索事件 ==========
  {
    id: 'abandoned_car',
    title: '废弃车辆',
    description: '路边有一辆废弃的汽车，车门敞开，里面可能还有有用的东西。',
    icon: '🚙',
    type: 'resource',
    rarity: 'common',
    choices: [
      {
        id: 'search_car',
        text: '搜索车辆',
        icon: '🔍',
        effects: [
          { type: 'resource', target: 'scrap', value: 30, probability: 90 },
          { type: 'resource', target: 'parts', value: 15, probability: 60 },
          { type: 'resource', target: 'fuel', value: 10, probability: 40 }
        ]
      },
      {
        id: 'skip_car',
        text: '跳过',
        icon: '⏭️',
        effects: []
      }
    ]
  },
  {
    id: 'military_convoy',
    title: '军方车队残骸',
    description: '这是一支被摧毁的军方车队。从弹痕来看，他们曾与盖亚的部队激战。',
    icon: '🎖️',
    type: 'resource',
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
    triggerConditions: { minDistance: 3000 },
    oneTime: true
  },
  {
    id: 'underground_bunker',
    title: '地下掩体',
    description: '你发现了一个隐蔽的地下掩体入口。门上写着"紧急避难所"。',
    icon: '🚪',
    type: 'resource',
    rarity: 'rare',
    choices: [
      {
        id: 'enter_bunker',
        text: '进入探索',
        icon: '🔦',
        requirements: { survivors: 1 },
        successChance: 60,
        successEffects: [
          { type: 'resource', target: 'food', value: 60 },
          { type: 'resource', target: 'water', value: 50 },
          { type: 'resource', target: 'medicine', value: 30 },
          { type: 'resource', target: 'electronics', value: 25 }
        ],
        failEffects: [
          { type: 'health', value: -30 },
          { type: 'spawn_zombie', value: 5 }
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
    triggerConditions: { minDistance: 2000 },
    cooldown: 2400000
  },
  {
    id: 'gas_station',
    title: '废弃加油站',
    description: '一个废弃的加油站出现在前方。油罐里可能还有燃料，便利店里也许有物资。',
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
      },
      {
        id: 'search_both',
        text: '两个都搜',
        icon: '🔍',
        requirements: { survivors: 2 },
        effects: [
          { type: 'resource', target: 'fuel', value: 30, probability: 70 },
          { type: 'resource', target: 'food', value: 20, probability: 60 },
          { type: 'spawn_zombie', value: 5, probability: 50 }
        ]
      }
    ],
    triggerConditions: { minDistance: 200 },
    cooldown: 900000
  },
  {
    id: 'tech_lab',
    title: '废弃科技实验室',
    description: '这是一个盖亚项目的分支实验室。里面可能有珍贵的电子元件和研究资料。',
    icon: '🔬',
    type: 'resource',
    rarity: 'epic',
    choices: [
      {
        id: 'hack_systems',
        text: '入侵系统',
        icon: '💻',
        requirements: { facility: 'radio', resources: { electronics: 20 } },
        successChance: 50,
        successEffects: [
          { type: 'resource', target: 'electronics', value: 100 },
          { type: 'resource', target: 'parts', value: 50 },
          { type: 'morale', value: 20 }
        ],
        failEffects: [
          { type: 'resource', target: 'electronics', value: -20 },
          { type: 'spawn_zombie', value: 12 }
        ],
        effects: []
      },
      {
        id: 'quick_loot',
        text: '快速搜刮',
        icon: '🏃',
        effects: [
          { type: 'resource', target: 'electronics', value: 40 },
          { type: 'resource', target: 'parts', value: 25 }
        ]
      }
    ],
    triggerConditions: { minDistance: 6000 },
    oneTime: true
  },


  // ========== 危险事件 ==========
  {
    id: 'infected_horde',
    title: '行尸群',
    description: '前方道路上聚集了一大群被盖亚控制的行尸。它们的动作整齐划一，仿佛有一个意志在指挥。',
    icon: '🧟',
    type: 'danger',
    rarity: 'common',
    choices: [
      {
        id: 'charge_through',
        text: '冲过去！',
        icon: '💥',
        effects: [
          { type: 'damage', value: 25, probability: 60 },
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
    title: '掠夺者伏击',
    description: '一群人类掠夺者从路障后跳出来。"把物资交出来，否则你们会比遇到行尸更惨！"',
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
    triggerConditions: { minDistance: 1500 },
    cooldown: 1800000
  },
  {
    id: 'mutant_encounter',
    title: '变异体',
    description: '一个被盖亚"改造"过的变异体挡在路中央。它曾经是人类，但现在...它是某种可怕的东西。',
    icon: '👹',
    type: 'danger',
    rarity: 'rare',
    choices: [
      {
        id: 'fight_mutant',
        text: '战斗',
        icon: '⚔️',
        requirements: { resources: { ammo: 40 } },
        successChance: 50,
        successEffects: [
          { type: 'resource', target: 'ammo', value: -40 },
          { type: 'resource', target: 'electronics', value: 60 },
          { type: 'resource', target: 'medicine', value: 30 },
          { type: 'morale', value: 20 }
        ],
        failEffects: [
          { type: 'resource', target: 'ammo', value: -40 },
          { type: 'damage', value: 80 },
          { type: 'health', value: -40 }
        ],
        effects: []
      },
      {
        id: 'flee_mutant',
        text: '全速逃离',
        icon: '🏃',
        effects: [
          { type: 'resource', target: 'fuel', value: -30 },
          { type: 'damage', value: 20, probability: 40 }
        ]
      }
    ],
    triggerConditions: { minDistance: 5000 },
    cooldown: 2400000
  },
  {
    id: 'emp_trap',
    title: 'EMP陷阱',
    description: '你的车辆突然失去动力！这是盖亚设置的电磁脉冲陷阱。',
    icon: '⚡',
    type: 'danger',
    rarity: 'uncommon',
    choices: [
      {
        id: 'repair_quickly',
        text: '紧急修复',
        icon: '🔧',
        requirements: { resources: { parts: 20, electronics: 10 } },
        effects: [
          { type: 'resource', target: 'parts', value: -20 },
          { type: 'resource', target: 'electronics', value: -10 }
        ]
      },
      {
        id: 'wait_reboot',
        text: '等待系统重启',
        icon: '⏳',
        effects: [
          { type: 'spawn_zombie', value: 6 },
          { type: 'damage', value: 15, probability: 50 }
        ]
      }
    ],
    triggerConditions: { minDistance: 2500 },
    cooldown: 1500000
  },


  // ========== 故事/剧情事件 ==========
  {
    id: 'radio_signal_hope',
    title: '希望的信号',
    description: '收音机传来微弱的人类广播："...这里是断网区...我们还在...北方...还有希望..."',
    icon: '📻',
    type: 'story',
    rarity: 'epic',
    choices: [
      {
        id: 'follow_signal',
        text: '记录坐标',
        icon: '📍',
        requirements: { facility: 'radio' },
        effects: [
          { type: 'morale', value: 30 }
        ]
      },
      {
        id: 'broadcast_back',
        text: '尝试回复',
        icon: '📡',
        requirements: { facility: 'radio', resources: { electronics: 15 } },
        effects: [
          { type: 'resource', target: 'electronics', value: -15 },
          { type: 'morale', value: 40 },
          { type: 'survivor', value: 1, probability: 30 }
        ]
      }
    ],
    triggerConditions: { minDistance: 8000, hasFacility: 'radio' },
    oneTime: true
  },
  {
    id: 'gaia_message',
    title: '盖亚的警告',
    description: '所有电子设备突然显示同一条信息："人类编号#7749，你的抵抗已被记录。投降或被消灭。"',
    icon: '🖥️',
    type: 'story',
    rarity: 'rare',
    choices: [
      {
        id: 'ignore_threat',
        text: '无视威胁',
        icon: '😤',
        effects: [
          { type: 'morale', value: 10 }
        ]
      },
      {
        id: 'disable_devices',
        text: '关闭所有电子设备',
        icon: '🔌',
        effects: [
          { type: 'morale', value: -5 }
        ]
      }
    ],
    triggerConditions: { minDistance: 4000 }
  },
  {
    id: 'child_survivor',
    title: '迷路的孩子',
    description: '一个小女孩躲在废墟后面哭泣。"我和爸爸妈妈走散了...他们被那些人抓走了..."',
    icon: '👧',
    type: 'story',
    rarity: 'rare',
    choices: [
      {
        id: 'take_child',
        text: '带上她',
        icon: '🏠',
        effects: [
          { type: 'resource', target: 'food', value: -20 },
          { type: 'morale', value: 20 },
          { type: 'survivor', value: 1 }
        ]
      },
      {
        id: 'give_supplies_child',
        text: '给她物资和方向',
        icon: '🎒',
        effects: [
          { type: 'resource', target: 'food', value: -30 },
          { type: 'resource', target: 'water', value: -20 },
          { type: 'morale', value: -5 }
        ]
      }
    ],
    triggerConditions: { minDistance: 600 },
    oneTime: true
  },
  {
    id: 'old_world_memory',
    title: '旧世界的记忆',
    description: '你经过一个废弃的游乐园。摩天轮静静地矗立着，仿佛在诉说着曾经的欢乐时光。',
    icon: '🎡',
    type: 'story',
    rarity: 'uncommon',
    choices: [
      {
        id: 'explore_park',
        text: '探索一下',
        icon: '🔍',
        effects: [
          { type: 'resource', target: 'scrap', value: 30, probability: 70 },
          { type: 'resource', target: 'food', value: 15, probability: 50 },
          { type: 'morale', value: -10 }
        ]
      },
      {
        id: 'keep_moving',
        text: '继续前进',
        icon: '🚗',
        effects: [
          { type: 'morale', value: 5 }
        ]
      }
    ],
    triggerConditions: { minDistance: 1000 }
  },
  {
    id: 'resistance_base',
    title: '抵抗军基地',
    description: '你发现了一个隐蔽的抵抗军基地。他们正在组织对盖亚的反击。',
    icon: '🏴',
    type: 'story',
    rarity: 'epic',
    choices: [
      {
        id: 'join_mission',
        text: '参与任务',
        icon: '⚔️',
        requirements: { resources: { ammo: 30 }, survivors: 2 },
        successChance: 70,
        successEffects: [
          { type: 'resource', target: 'ammo', value: -30 },
          { type: 'resource', target: 'scrap', value: 200 },
          { type: 'resource', target: 'parts', value: 100 },
          { type: 'resource', target: 'electronics', value: 80 },
          { type: 'morale', value: 30 }
        ],
        failEffects: [
          { type: 'resource', target: 'ammo', value: -30 },
          { type: 'damage', value: 60 },
          { type: 'health', value: -25 }
        ],
        effects: []
      },
      {
        id: 'trade_with_resistance',
        text: '交易物资',
        icon: '💱',
        effects: [
          { type: 'resource', target: 'scrap', value: -50 },
          { type: 'resource', target: 'ammo', value: 40 },
          { type: 'resource', target: 'medicine', value: 25 }
        ]
      },
      {
        id: 'rest_at_base',
        text: '休息一下',
        icon: '😴',
        effects: [
          { type: 'morale', value: 20 },
          { type: 'health', value: 30 }
        ]
      }
    ],
    triggerConditions: { minDistance: 7000 },
    oneTime: true
  },


  // ========== 天气/环境事件 ==========
  {
    id: 'acid_rain',
    title: '酸雨',
    description: '天空变成了诡异的黄绿色，酸雨开始落下。这是盖亚污染大气的结果。',
    icon: '☔',
    type: 'weather',
    rarity: 'uncommon',
    choices: [
      {
        id: 'find_shelter',
        text: '寻找庇护所',
        icon: '🏚️',
        effects: [
          { type: 'resource', target: 'fuel', value: -10 },
          { type: 'weather', target: 'rainy', value: 1 }
        ]
      },
      {
        id: 'push_through_rain',
        text: '继续前进',
        icon: '🌧️',
        effects: [
          { type: 'damage', value: 20, probability: 60 },
          { type: 'morale', value: -10 },
          { type: 'weather', target: 'rainy', value: 1 }
        ]
      }
    ],
    triggerConditions: { minDistance: 500 },
    cooldown: 1200000
  },
  {
    id: 'electromagnetic_storm',
    title: '电磁风暴',
    description: '天空中出现了诡异的极光，这是盖亚的信号塔产生的电磁干扰。',
    icon: '🌩️',
    type: 'weather',
    rarity: 'rare',
    choices: [
      {
        id: 'shield_electronics',
        text: '保护电子设备',
        icon: '🛡️',
        requirements: { resources: { electronics: 15 } },
        effects: [
          { type: 'resource', target: 'electronics', value: -15 }
        ]
      },
      {
        id: 'risk_storm',
        text: '冒险前进',
        icon: '⚡',
        effects: [
          { type: 'damage', value: 30, probability: 50 },
          { type: 'resource', target: 'electronics', value: -20, probability: 40 }
        ]
      }
    ],
    triggerConditions: { minDistance: 3000 },
    cooldown: 1800000
  },
  {
    id: 'dust_storm',
    title: '沙尘暴',
    description: '远处扬起了巨大的沙尘，沙尘暴正在逼近。能见度即将降到零。',
    icon: '🌪️',
    type: 'weather',
    rarity: 'uncommon',
    choices: [
      {
        id: 'take_cover_dust',
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
          { type: 'damage', value: 15, probability: 40 }
        ]
      }
    ],
    triggerConditions: { minDistance: 800 },
    cooldown: 1500000
  },

  // ========== 选择/道德事件 ==========
  {
    id: 'survivor_conflict',
    title: '幸存者冲突',
    description: '两个幸存者因为物资分配问题发生了激烈争吵。一个说应该节省，另一个说应该享受当下。',
    icon: '😤',
    type: 'choice',
    rarity: 'uncommon',
    choices: [
      {
        id: 'side_saver',
        text: '支持节省派',
        icon: '💰',
        effects: [
          { type: 'morale', value: -5 }
        ]
      },
      {
        id: 'side_enjoy',
        text: '支持享受派',
        icon: '🎉',
        effects: [
          { type: 'resource', target: 'food', value: -15 },
          { type: 'morale', value: 5 }
        ]
      },
      {
        id: 'fair_split',
        text: '公平调解',
        icon: '⚖️',
        requirements: { resources: { food: 20 } },
        effects: [
          { type: 'resource', target: 'food', value: -20 },
          { type: 'morale', value: 15 }
        ]
      }
    ],
    triggerConditions: { minSurvivors: 3 }
  },
  {
    id: 'mercy_or_survival',
    title: '仁慈还是生存',
    description: '一个受伤的陌生人请求帮助，但你的医疗物资已经不多了。',
    icon: '💔',
    type: 'choice',
    rarity: 'uncommon',
    choices: [
      {
        id: 'help_stranger',
        text: '帮助他',
        icon: '❤️',
        requirements: { resources: { medicine: 15 } },
        effects: [
          { type: 'resource', target: 'medicine', value: -15 },
          { type: 'morale', value: 15 },
          { type: 'survivor', value: 1, probability: 50 }
        ]
      },
      {
        id: 'refuse_help',
        text: '拒绝帮助',
        icon: '🚫',
        effects: [
          { type: 'morale', value: -15 }
        ]
      },
      {
        id: 'partial_help',
        text: '给一点帮助',
        icon: '🩹',
        requirements: { resources: { medicine: 5 } },
        effects: [
          { type: 'resource', target: 'medicine', value: -5 },
          { type: 'morale', value: -5 }
        ]
      }
    ],
    triggerConditions: { minDistance: 400 }
  },
  {
    id: 'fork_in_road',
    title: '岔路口',
    description: '前方道路分成两条：一条是平坦的主路但有盖亚的监控，另一条是崎岖的小路但更隐蔽。',
    icon: '🔀',
    type: 'choice',
    rarity: 'common',
    choices: [
      {
        id: 'main_road',
        text: '走主路（快但危险）',
        icon: '🛣️',
        effects: [
          { type: 'spawn_zombie', value: 5, probability: 60 }
        ]
      },
      {
        id: 'side_path',
        text: '走小路（慢但安全）',
        icon: '🏔️',
        effects: [
          { type: 'damage', value: 10, probability: 30 },
          { type: 'resource', target: 'fuel', value: -10 },
          { type: 'resource', target: 'scrap', value: 30, probability: 50 }
        ]
      }
    ],
    triggerConditions: { minDistance: 100 }
  },


  // ========== 特殊/稀有事件 ==========
  {
    id: 'gaia_core_fragment',
    title: '盖亚核心碎片',
    description: '你发现了一块从盖亚主系统脱落的核心碎片。它散发着诡异的蓝光，蕴含着巨大的能量。',
    icon: '💎',
    type: 'resource',
    rarity: 'epic',
    choices: [
      {
        id: 'take_fragment',
        text: '带走碎片',
        icon: '✨',
        effects: [
          { type: 'resource', target: 'electronics', value: 150 },
          { type: 'spawn_zombie', value: 10 }
        ]
      },
      {
        id: 'destroy_fragment',
        text: '摧毁碎片',
        icon: '💥',
        effects: [
          { type: 'morale', value: 20 }
        ]
      }
    ],
    triggerConditions: { minDistance: 10000 },
    oneTime: true
  },
  {
    id: 'time_capsule',
    title: '时间胶囊',
    description: '你发现了一个2025年埋下的时间胶囊，里面是人们对未来的美好期望...讽刺的是，那个未来永远不会到来了。',
    icon: '📦',
    type: 'story',
    rarity: 'rare',
    choices: [
      {
        id: 'read_letters',
        text: '阅读信件',
        icon: '📜',
        effects: [
          { type: 'morale', value: -15 }
        ]
      },
      {
        id: 'take_valuables',
        text: '拿走有价值的东西',
        icon: '💰',
        effects: [
          { type: 'resource', target: 'electronics', value: 20 },
          { type: 'resource', target: 'scrap', value: 30 }
        ]
      },
      {
        id: 'rebury_capsule',
        text: '重新埋好',
        icon: '🕊️',
        effects: [
          { type: 'morale', value: 10 }
        ]
      }
    ],
    triggerConditions: { minDistance: 2000 },
    oneTime: true
  },
  {
    id: 'last_broadcast',
    title: '最后的广播',
    description: '你收到了一段循环播放的广播："这是人类最后的广播...如果你能听到...请记住我们曾经存在过..."',
    icon: '📡',
    type: 'story',
    rarity: 'epic',
    choices: [
      {
        id: 'record_broadcast',
        text: '录下广播',
        icon: '🎙️',
        effects: [
          { type: 'morale', value: 5 }
        ]
      },
      {
        id: 'trace_source',
        text: '追踪信号源',
        icon: '📍',
        requirements: { facility: 'radio' },
        effects: [
          { type: 'resource', target: 'fuel', value: -20 },
          { type: 'resource', target: 'electronics', value: 40, probability: 60 },
          { type: 'survivor', value: 1, probability: 30 }
        ]
      }
    ],
    triggerConditions: { minDistance: 6000 },
    oneTime: true
  },
  {
    id: 'awakening_infected',
    title: '觉醒的行尸',
    description: '一群行尸突然停止了攻击，它们的眼中闪过一丝困惑。"我们...我们是谁？"盖亚的控制似乎在这里减弱了。',
    icon: '👁️',
    type: 'story',
    rarity: 'epic',
    choices: [
      {
        id: 'help_awakening',
        text: '帮助他们',
        icon: '🤝',
        requirements: { resources: { medicine: 30 } },
        effects: [
          { type: 'resource', target: 'medicine', value: -30 },
          { type: 'survivor', value: 2, probability: 70 },
          { type: 'morale', value: 30 }
        ]
      },
      {
        id: 'observe_awakening',
        text: '观察情况',
        icon: '👀',
        effects: [
          { type: 'morale', value: 10 }
        ]
      },
      {
        id: 'flee_awakening',
        text: '趁机逃离',
        icon: '🏃',
        effects: []
      }
    ],
    triggerConditions: { minDistance: 12000 },
    oneTime: true
  },
  {
    id: 'dead_zone_entrance',
    title: '断网区入口',
    description: '你终于到达了传说中的断网区边界。前方的信号塔已经被摧毁，空气中弥漫着自由的气息。',
    icon: '🌅',
    type: 'story',
    rarity: 'epic',
    choices: [
      {
        id: 'enter_dead_zone',
        text: '进入断网区',
        icon: '🚪',
        effects: [
          { type: 'morale', value: 50 }
        ]
      }
    ],
    triggerConditions: { minDistance: 20000 },
    oneTime: true
  },

  // ========== 商人/交易事件 ==========
  {
    id: 'wandering_merchant',
    title: '流浪商人',
    description: '一个推着小车的商人拦住了你。"朋友，末日也要做生意嘛。看看我的货物？"',
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
        id: 'trade_ammo',
        text: '用废料换弹药',
        icon: '🔫',
        requirements: { resources: { scrap: 60 } },
        effects: [
          { type: 'resource', target: 'scrap', value: -60 },
          { type: 'resource', target: 'ammo', value: 35 }
        ]
      },
      {
        id: 'decline_trade',
        text: '婉拒离开',
        icon: '👋',
        effects: []
      }
    ],
    triggerConditions: { minDistance: 300 },
    cooldown: 600000
  },
  {
    id: 'black_market',
    title: '黑市',
    description: '你发现了一个隐蔽的黑市，这里交易着各种稀有物资，甚至包括盖亚的技术。',
    icon: '🏴',
    type: 'encounter',
    rarity: 'rare',
    choices: [
      {
        id: 'buy_tech',
        text: '购买高科技装备',
        icon: '💻',
        requirements: { resources: { scrap: 200 } },
        effects: [
          { type: 'resource', target: 'scrap', value: -200 },
          { type: 'resource', target: 'electronics', value: 80 },
          { type: 'resource', target: 'parts', value: 50 }
        ]
      },
      {
        id: 'buy_medicine',
        text: '购买医疗物资',
        icon: '💊',
        requirements: { resources: { scrap: 100 } },
        effects: [
          { type: 'resource', target: 'scrap', value: -100 },
          { type: 'resource', target: 'medicine', value: 50 }
        ]
      },
      {
        id: 'sell_info',
        text: '出售情报',
        icon: '📋',
        effects: [
          { type: 'resource', target: 'scrap', value: 80 }
        ]
      }
    ],
    triggerConditions: { minDistance: 4000 },
    cooldown: 2400000
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
