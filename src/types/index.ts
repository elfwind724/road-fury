/**
 * 类型定义统一导出
 */

export * from './vehicle'
export * from './facility'
export * from './resource'
export * from './zombie'
export * from './survivor'
export * from './game'
export * from './weapon'
export * from './wave'
export * from './tutorial'
export * from './weather'
export * from './accessory'
export * from './skillTree'
export * from './event'
export * from './customization'

// 重新导出常用类型
export type { FacilitySlot, SlotType, VehicleAccessories, AccessoryItem } from './vehicle'
export type { WeaponType, BulletType, WeaponConfig, BulletInstance, WeaponState, BulletEffect } from './weapon'
export type { WaveConfig, WaveState, BossConfig, BossState, BossType } from './wave'
export type { TutorialStep, TutorialStepId, TutorialState } from './tutorial'
export type { WeatherType, WeatherConfig, WeatherEffect, WeatherState } from './weather'
export type { SkillConfig, PersonalityConfig, SurvivorRarity } from './survivor'
export type { GameEvent, EventType, EventRarity, EventChoice, EventEffect, EventState } from './event'
export type { VehicleSkin, VehicleDecal, VehicleOrnament, SurvivorAppearance, CustomizationState } from './customization'
