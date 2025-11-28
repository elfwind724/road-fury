/**
 * 新手引导系统类型定义
 */

export type TutorialStepId = 
  | 'welcome'
  | 'start_game'
  | 'movement'
  | 'shooting'
  | 'collect_resources'
  | 'open_interior'
  | 'build_facility'
  | 'upgrade_weapon'
  | 'rescue_survivor'
  | 'wave_system'
  | 'complete'

export interface TutorialStep {
  id: TutorialStepId
  title: string
  description: string
  emoji: string
  position: 'top' | 'center' | 'bottom'
  highlight?: {
    type: 'button' | 'area' | 'element'
    target: string
  }
  action?: {
    type: 'click' | 'swipe' | 'wait' | 'auto'
    target?: string
    duration?: number
  }
  condition?: {
    type: 'distance' | 'kills' | 'resources' | 'facility' | 'wave'
    value: number
  }
  nextStep?: TutorialStepId
  skipable?: boolean
}

export interface TutorialState {
  isActive: boolean
  currentStep: TutorialStepId
  completedSteps: TutorialStepId[]
  hasCompletedTutorial: boolean
}
