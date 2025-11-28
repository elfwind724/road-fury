/**
 * 幸存者类型定义 - 按设计文档完善
 */

// 职业类型 - 8种职业
export type SurvivorSkill = 
  | 'mechanic'      // 🔧 机械师 - 维修效率+50%, 建造时间-20%
  | 'chef'          // 👨‍🍳 厨师 - 烹饪产出+30%, 解锁特殊食谱
  | 'doctor'        // 🩺 医生 - 治疗效果×2, 疾病预防+30%
  | 'shooter'       // 🎯 射手 - 炮台伤害+25%, 弹药消耗-15%
  | 'farmer'        // 🌾 农夫 - 种植产出+40%, 动物产出+20%
  | 'communicator'  // 📻 通讯员 - 幸存者发现+20%, 事件预警
  | 'engineer'      // ⚙️ 工程师 - 电力效率+30%, 设施升级-30%材料
  | 'soldier'       // 🎖️ 军人 - 全队防御+15%, 碾压伤害+10%

// 稀有度
export type SurvivorRarity = 'common' | 'rare' | 'epic'

// 性格类型 - 按设计文档
export type SurvivorPersonality = 
  | 'optimist'      // 乐观 - 全队士气+10%
  | 'hardworker'    // 勤劳 - 工作效率+15%, 体力消耗+10%
  | 'frugal'        // 节俭 - 资源消耗-10%
  | 'coward'        // 胆小 - 遇Boss士气-30
  | 'glutton'       // 贪吃 - 食物消耗+30%
  | 'loner'         // 孤僻 - 单独工作效率+20%, 与他人共处时效率-10%
  | 'leader'        // 领袖 - 相邻设施效率+10% (稀有性格)

export interface SurvivorState {
  id: string
  name: string
  skill: SurvivorSkill
  skillLevel: number           // 技能等级 1-5级，影响效果加成倍率
  personality: SurvivorPersonality[]  // 可以有1-2个性格特征
  rarity: SurvivorRarity
  
  // 基础属性
  morale: number               // 士气 0-100，-5/小时，低于50效率下降
  health: number               // 健康值 0-100，归零死亡
  hunger: number               // 饱食度 0-100，-10/小时
  thirst: number               // 口渴度 0-100，-15/小时
  
  // 新增属性 - 按设计文档
  stamina: number              // 体力 50-100，低于20时效率减半
  loyalty: number              // 忠诚度 0-100，低于30时可能离开
  happiness: number            // 幸福感 0-100，影响工作效率
  
  assignedFacility?: string
  
  // 背景故事（可选）
  backstory?: string
}

// 职业配置
export interface SkillConfig {
  skill: SurvivorSkill
  name: string
  icon: string
  rarity: SurvivorRarity
  mainBonus: string
  subBonus: string
  facilityTypes: string[]      // 适合的设施类型
  bonusMultiplier: number      // 基础加成倍率
}

// 性格配置
export interface PersonalityConfig {
  type: SurvivorPersonality
  name: string
  category: 'positive' | 'negative' | 'neutral' | 'special'
  positiveEffect?: string
  negativeEffect?: string
}

// 职业技能加成
export interface SkillBonus {
  skill: SurvivorSkill
  facilityTypes: string[]
  bonusMultiplier: number
}
