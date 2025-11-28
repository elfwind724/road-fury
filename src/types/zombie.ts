/**
 * 丧尸类型定义 - 扩展版
 */

import type { ResourceDrop } from './resource'

// 扩展丧尸类型
export type ZombieType = 
  | 'normal'    // 普通丧尸
  | 'runner'    // 跑者
  | 'fat'       // 胖子
  | 'explosive' // 爆炸
  | 'elite'     // 精英
  | 'doctor'    // 医生
  | 'boss'      // Boss
  | 'crawler'   // 爬行者
  | 'armored'   // 装甲
  | 'exploder'  // 自爆
  | 'spitter'   // 喷吐者
  | 'giant'     // 巨人
  | 'shadow'    // 暗影
  | 'toxic'     // 毒素

// 扩展Boss类型
export type BossType = 
  | 'tank'        // 坦克
  | 'screamer'    // 尖啸者
  | 'horde_leader'// 尸群领袖
  | 'spitter'     // 喷吐者Boss
  | 'necromancer' // 死灵法师
  | 'juggernaut'  // 毁灭者
  | 'hunter'      // 猎手
  | 'hive_queen'  // 蜂巢女王
  | 'titan'       // 泰坦

// Boss技能效果类型
export type BossAbilityEffect = 
  | 'charge'          // 冲撞
  | 'acid_spit'       // 酸液喷射
  | 'summon'          // 召唤
  | 'aoe_damage'      // 范围伤害
  | 'buff_zombies'    // 强化丧尸
  | 'damage_reduction'// 伤害减免
  | 'teleport_attack' // 闪现攻击
  | 'critical_strike' // 致命一击
  | 'poison_cloud'    // 毒雾
  | 'beam_attack'     // 光束攻击
  | 'enrage'          // 狂暴

export interface ZombieConfig {
  type: ZombieType
  name?: string
  health: number
  damage: number
  speed: number
  drops: ResourceDrop[]
  spawnWeight: number
  minDistance: number
  damageModifier: number
}

export interface BossConfig {
  type: BossType
  health: number
  damage: number
  specialAbility?: string
  triggerDistance?: number
  rewards?: Reward[]
}

export interface Reward {
  type: 'resource' | 'blueprint' | 'survivor'
  value: string | number
}
