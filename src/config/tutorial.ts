/**
 * 新手引导配置
 */

import type { TutorialStep, TutorialStepId } from '@/types/tutorial'

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: '欢迎来到末路狂飙!',
    description: '在这个末日世界中，你需要驾驶车辆穿越丧尸横行的公路，收集资源，建造设施，拯救幸存者。',
    emoji: '🚗',
    position: 'center',
    action: { type: 'click' },
    nextStep: 'movement',
    skipable: true,
  },
  {
    id: 'movement',
    title: '移动车辆',
    description: '点击屏幕左侧或右侧来切换车道，躲避障碍物或撞击丧尸！',
    emoji: '👈👉',
    position: 'bottom',
    highlight: { type: 'area', target: 'game-screen' },
    action: { type: 'swipe' },
    condition: { type: 'distance', value: 50 },
    nextStep: 'shooting',
    skipable: true,
  },
  {
    id: 'shooting',
    title: '自动射击',
    description: '你的车辆会自动向前方射击，消灭靠近的丧尸。升级武器可以增加伤害！',
    emoji: '🔫',
    position: 'top',
    action: { type: 'wait', duration: 3000 },
    condition: { type: 'kills', value: 3 },
    nextStep: 'collect_resources',
    skipable: true,
  },
  {
    id: 'collect_resources',
    title: '收集资源',
    description: '撞击路上的资源箱可以获得废铁、零件等材料，用于建造和升级。',
    emoji: '📦',
    position: 'center',
    action: { type: 'wait', duration: 5000 },
    nextStep: 'open_interior',
    skipable: true,
  },
  {
    id: 'open_interior',
    title: '进入车内',
    description: '点击右下角的"车内"按钮，可以管理你的移动堡垒！',
    emoji: '🏠',
    position: 'bottom',
    highlight: { type: 'button', target: 'interior-btn' },
    action: { type: 'click', target: 'interior-btn' },
    nextStep: 'build_facility',
    skipable: true,
  },
  {
    id: 'build_facility',
    title: '建造设施',
    description: '从左侧面板拖拽设施到车内安装。不同设施有不同功能：生产资源、提供防御、增加容量等。',
    emoji: '🔨',
    position: 'center',
    highlight: { type: 'element', target: 'build-panel' },
    action: { type: 'click' },
    condition: { type: 'facility', value: 1 },
    nextStep: 'upgrade_weapon',
    skipable: true,
  },
  {
    id: 'upgrade_weapon',
    title: '升级武器',
    description: '在"改造"标签页中，你可以升级武器和车辆属性，让你的战车更加强大！',
    emoji: '⚙️',
    position: 'center',
    highlight: { type: 'element', target: 'upgrade-tab' },
    action: { type: 'click' },
    nextStep: 'rescue_survivor',
    skipable: true,
  },
  {
    id: 'rescue_survivor',
    title: '拯救幸存者',
    description: '路上会出现幸存者，撞击他们可以将其救上车。幸存者可以分配到设施中提高效率！',
    emoji: '👥',
    position: 'center',
    action: { type: 'wait', duration: 3000 },
    nextStep: 'wave_system',
    skipable: true,
  },
  {
    id: 'wave_system',
    title: '波次系统',
    description: '每隔一段时间会出现丧尸潮，每7波会出现血月之夜和强大的Boss！做好准备！',
    emoji: '🌊',
    position: 'center',
    action: { type: 'click' },
    nextStep: 'complete',
    skipable: true,
  },
  {
    id: 'complete',
    title: '教程完成!',
    description: '你已经掌握了基本操作。现在开始你的末日生存之旅吧！祝你好运！',
    emoji: '🎉',
    position: 'center',
    action: { type: 'click' },
    skipable: false,
  },
]

export function getTutorialStep(id: TutorialStepId): TutorialStep | undefined {
  return TUTORIAL_STEPS.find(step => step.id === id)
}

export function getNextStep(currentId: TutorialStepId): TutorialStep | undefined {
  const current = getTutorialStep(currentId)
  if (!current?.nextStep) return undefined
  return getTutorialStep(current.nextStep)
}
