/**
 * 永久升级技能树类型定义
 */

export type SkillTreeBranch = 
  | 'combat'      // 战斗分支
  | 'survival'    // 生存分支
  | 'engineering' // 工程分支
  | 'leadership'  // 领导分支
  | 'scavenging'  // 搜刮分支

export interface SkillNode {
  id: string
  name: string
  description: string
  icon: string
  branch: SkillTreeBranch
  tier: number              // 层级 1-5
  maxLevel: number          // 最大等级
  costPerLevel: number      // 每级消耗末世点数
  prerequisites: string[]   // 前置技能ID
  effects: SkillEffect[]
}

export interface SkillEffect {
  type: 
    | 'crush_damage'        // 碾压伤害
    | 'weapon_damage'       // 武器伤害
    | 'armor'               // 护甲
    | 'durability'          // 耐久
    | 'resource_capacity'   // 资源容量
    | 'food_consumption'    // 食物消耗
    | 'water_consumption'   // 水消耗
    | 'energy_production'   // 能源产出
    | 'facility_efficiency' // 设施效率
    | 'survivor_capacity'   // 幸存者容量
    | 'morale_decay'        // 士气衰减
    | 'resource_drop'       // 资源掉落
    | 'survivor_discovery'  // 幸存者发现
    | 'starting_resource'   // 初始资源
    | 'apocalypse_points'   // 末世点数获取
  value: number             // 每级效果值
  isPercent: boolean
}

export interface SkillTreeState {
  [skillId: string]: number // 技能ID -> 当前等级
}
