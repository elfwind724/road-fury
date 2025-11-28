/**
 * 天气系统配置 - 按设计文档
 */

import type { WeatherConfig, WeatherType } from '@/types/weather'

export const WEATHER_CONFIGS: WeatherConfig[] = [
  {
    type: 'sunny',
    name: '晴天',
    icon: '☀️',
    duration: { min: 4, max: 8 },  // 4-8小时
    effects: [
      { type: 'solar_efficiency', value: 100 },    // 太阳能满效
      { type: 'visibility', value: 100 },          // 视野清晰
      { type: 'water_consumption', value: 20 },    // 水分消耗+20%
    ],
  },
  {
    type: 'rainy',
    name: '雨天',
    icon: '🌧️',
    duration: { min: 2, max: 4 },  // 2-4小时
    effects: [
      { type: 'solar_efficiency', value: -100 },   // 太阳能失效
      { type: 'rain_collection', value: 200 },     // 雨水收集+200%
      { type: 'speed_modifier', value: -10 },      // 路滑，速度-10%
    ],
  },
  {
    type: 'night',
    name: '夜晚',
    icon: '🌙',
    duration: { min: 6, max: 6 },  // 固定6小时
    effects: [
      { type: 'solar_efficiency', value: -100 },   // 太阳能失效
      { type: 'visibility', value: -50 },          // 视野-50%
      { type: 'zombie_spawn', value: -20 },        // 某些丧尸减少
    ],
  },
  {
    type: 'sandstorm',
    name: '沙尘暴',
    icon: '🌪️',
    duration: { min: 1, max: 2 },  // 1-2小时
    effects: [
      { type: 'speed_modifier', value: -30 },      // 速度-30%
      { type: 'visibility', value: -80 },          // 能见度极低
      { type: 'solar_efficiency', value: -50 },    // 太阳能效率-50%
    ],
  },
]

// 获取天气配置
export function getWeatherConfig(type: WeatherType): WeatherConfig | undefined {
  return WEATHER_CONFIGS.find(w => w.type === type)
}

// 随机选择下一个天气
export function getRandomWeather(currentWeather?: WeatherType): WeatherType {
  // 天气转换概率
  const transitions: Record<WeatherType, { type: WeatherType; weight: number }[]> = {
    sunny: [
      { type: 'sunny', weight: 40 },
      { type: 'rainy', weight: 30 },
      { type: 'night', weight: 25 },
      { type: 'sandstorm', weight: 5 },
    ],
    rainy: [
      { type: 'sunny', weight: 50 },
      { type: 'rainy', weight: 20 },
      { type: 'night', weight: 25 },
      { type: 'sandstorm', weight: 5 },
    ],
    night: [
      { type: 'sunny', weight: 60 },
      { type: 'rainy', weight: 20 },
      { type: 'night', weight: 10 },
      { type: 'sandstorm', weight: 10 },
    ],
    sandstorm: [
      { type: 'sunny', weight: 60 },
      { type: 'rainy', weight: 20 },
      { type: 'night', weight: 15 },
      { type: 'sandstorm', weight: 5 },
    ],
  }

  const options = currentWeather ? transitions[currentWeather] : transitions.sunny
  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0)
  let random = Math.random() * totalWeight

  for (const option of options) {
    random -= option.weight
    if (random <= 0) {
      return option.type
    }
  }

  return 'sunny'
}

// 计算天气持续时间（毫秒）
export function getWeatherDuration(type: WeatherType): number {
  const config = getWeatherConfig(type)
  if (!config) return 4 * 60 * 60 * 1000 // 默认4小时

  const hours = config.duration.min + Math.random() * (config.duration.max - config.duration.min)
  return hours * 60 * 60 * 1000
}

// 获取天气效果值
export function getWeatherEffectValue(type: WeatherType, effectType: string): number {
  const config = getWeatherConfig(type)
  if (!config) return 0

  const effect = config.effects.find(e => e.type === effectType)
  return effect?.value || 0
}
