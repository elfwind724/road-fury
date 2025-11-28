/**
 * 资源类型定义
 */

export type ResourceType =
  | 'scrap'        // 废铁
  | 'parts'        // 零件
  | 'fabric'       // 布料
  | 'food'         // 食材
  | 'medicine'     // 药品
  | 'fuel'         // 燃料
  | 'electronics'  // 电子元件
  | 'ammo'         // 弹药
  | 'water'        // 水
  | 'energy'       // 电力

export interface ResourceState {
  scrap: number
  parts: number
  fabric: number
  food: number
  medicine: number
  fuel: number
  electronics: number
  ammo: number
  water: number
  energy: number
}

export interface ResourceCapacity {
  base: number
  bonus: number  // 来自仓库等设施
}

export interface ResourceDrop {
  type: ResourceType
  min: number
  max: number
  chance: number  // 0-1
}
