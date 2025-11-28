/**
 * 天气系统类型定义 - 按设计文档
 */

export type WeatherType = 'sunny' | 'rainy' | 'night' | 'sandstorm'

export interface WeatherConfig {
  type: WeatherType
  name: string
  icon: string
  duration: { min: number; max: number }  // 持续时间范围（小时）
  effects: WeatherEffect[]
}

export interface WeatherEffect {
  type: 
    | 'solar_efficiency'      // 太阳能效率
    | 'rain_collection'       // 雨水收集
    | 'water_consumption'     // 水分消耗
    | 'speed_modifier'        // 速度修正
    | 'visibility'            // 能见度
    | 'zombie_spawn'          // 丧尸生成
  value: number               // 百分比修正，如 -50 表示 -50%
}

export interface WeatherState {
  current: WeatherType
  timeRemaining: number       // 剩余时间（毫秒）
  nextWeather?: WeatherType   // 下一个天气（可选预告）
}
