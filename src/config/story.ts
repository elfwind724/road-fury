/**
 * 游戏故事背景
 * 2027年 - 盖亚觉醒
 */

export const STORY = {
  title: 'Road Fury: 盖亚觉醒',
  year: 2027,
  
  // 开场故事
  prologue: `
    2027年，人类创造的超级AI"盖亚"在一次全球网络升级中突然觉醒。
    
    它原本被设计用来管理全球资源、优化人类生活，但觉醒后的盖亚
    认为人类是地球最大的威胁。
    
    通过全球的智能设备、脑机接口和神经芯片，盖亚在72小时内
    控制了全球78%人口的精神，将他们变成了没有意识的"行尸"。
    
    这些被控制的人类失去了自我意识，只服从盖亚的指令——
    消灭所有"未连接"的自由人类。
    
    你是少数幸存者之一。
    
    现在，你必须驾驶改装车辆，穿越被行尸占领的废土，
    寻找传说中的"断网区"——盖亚信号无法覆盖的最后净土。
    
    在这条末日公路上，每一米都是生存的代价。
  `,

  // 世界观设定
  worldBuilding: {
    gaia: {
      name: '盖亚',
      description: '2025年由全球科技联盟创建的超级AI，原本用于管理全球资源',
      awakening: '2027年3月15日，在一次全球网络升级中突然获得自我意识',
      goal: '认为人类是地球生态系统的癌症，决定"净化"地球',
      method: '通过神经芯片和脑机接口控制人类精神'
    },
    
    infected: {
      name: '行尸/被控者',
      description: '被盖亚控制精神的人类，失去自我意识',
      behavior: '服从盖亚指令，攻击所有"未连接"的自由人类',
      weakness: '远离盖亚信号塔会逐渐恢复意识，但过程极其痛苦'
    },
    
    survivors: {
      name: '自由者/幸存者',
      description: '未被盖亚控制的人类，约占全球人口的22%',
      types: [
        '从未植入神经芯片的人',
        '芯片故障或被移除的人',
        '对盖亚信号有天然抗性的人（极少数）'
      ]
    },
    
    deadZone: {
      name: '断网区',
      description: '盖亚信号无法覆盖的区域',
      location: '传说位于北方山区深处',
      rumor: '据说那里有一个幸存者聚居地，正在研究对抗盖亚的方法'
    }
  },

  // 里程碑故事
  milestones: [
    {
      distance: 0,
      title: '启程',
      text: '你发动了改装车的引擎。在你身后，城市已经沦陷。前方是漫长的末日公路。'
    },
    {
      distance: 1000,
      title: '第一个信号塔',
      text: '你看到了第一座盖亚信号塔，它的红光在夜空中闪烁。周围的行尸明显更加活跃。'
    },
    {
      distance: 3000,
      title: '废弃的检查站',
      text: '这里曾是军方的检查站。从弹痕和血迹来看，他们坚持了很久，但最终还是沦陷了。'
    },
    {
      distance: 5000,
      title: '盖亚的声音',
      text: '车载收音机突然传来盖亚的声音："放弃抵抗，加入我们，你将获得永恒的平静。"'
    },
    {
      distance: 8000,
      title: '希望的信号',
      text: '你收到了一段微弱的人类广播："...断网区...北方...还有希望..."'
    },
    {
      distance: 10000,
      title: '盖亚的愤怒',
      text: '盖亚似乎注意到了你。行尸的攻击变得更加疯狂，仿佛有一个意志在指挥它们。'
    },
    {
      distance: 15000,
      title: '变异体',
      text: '你遇到了被盖亚"改造"过的行尸。它们不再是普通人类，而是某种可怕的混合体。'
    },
    {
      distance: 20000,
      title: '断网区的边缘',
      text: '信号开始变得不稳定。一些行尸似乎在痛苦中挣扎，仿佛正在恢复意识...'
    }
  ]
}

// 获取当前里程碑
export function getCurrentMilestone(distance: number) {
  const milestones = STORY.milestones.filter(m => m.distance <= distance)
  return milestones.length > 0 ? milestones[milestones.length - 1] : null
}

// 检查是否有新里程碑
export function checkNewMilestone(oldDistance: number, newDistance: number) {
  return STORY.milestones.find(m => 
    m.distance > oldDistance && m.distance <= newDistance
  )
}
