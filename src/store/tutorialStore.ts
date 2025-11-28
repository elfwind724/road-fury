/**
 * 新手引导状态管理
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TutorialState } from '@/types/tutorial'
import { getTutorialStep, getNextStep } from '@/config/tutorial'

interface TutorialActions {
  startTutorial: () => void
  nextStep: () => void
  skipStep: () => void
  skipTutorial: () => void
  completeTutorial: () => void
  resetTutorial: () => void
  checkCondition: (type: string, value: number) => void
}

type TutorialStore = TutorialState & TutorialActions

const initialState: TutorialState = {
  isActive: false,
  currentStep: 'welcome',
  completedSteps: [],
  hasCompletedTutorial: false,
}

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 开始教程
      startTutorial: () => {
        const { hasCompletedTutorial } = get()
        // 如果已完成过教程，不自动开始
        if (hasCompletedTutorial) return
        
        set({
          isActive: true,
          currentStep: 'welcome',
          completedSteps: [],
        })
      },

      // 进入下一步
      nextStep: () => {
        const { currentStep, completedSteps } = get()
        const nextStepData = getNextStep(currentStep)
        
        if (nextStepData) {
          set({
            currentStep: nextStepData.id,
            completedSteps: [...completedSteps, currentStep],
          })
        } else {
          // 没有下一步，完成教程
          get().completeTutorial()
        }
      },

      // 跳过当前步骤
      skipStep: () => {
        const { currentStep } = get()
        const currentStepData = getTutorialStep(currentStep)
        
        if (currentStepData?.skipable) {
          get().nextStep()
        }
      },

      // 跳过整个教程
      skipTutorial: () => {
        set({
          isActive: false,
          hasCompletedTutorial: true,
        })
      },

      // 完成教程
      completeTutorial: () => {
        const { completedSteps, currentStep } = get()
        set({
          isActive: false,
          completedSteps: [...completedSteps, currentStep],
          hasCompletedTutorial: true,
        })
      },

      // 重置教程（用于测试或重新学习）
      resetTutorial: () => {
        set({
          ...initialState,
          hasCompletedTutorial: false,
        })
      },

      // 检查条件是否满足
      checkCondition: (type: string, value: number) => {
        const { currentStep, isActive } = get()
        if (!isActive) return

        const stepData = getTutorialStep(currentStep)
        if (!stepData?.condition) return

        if (stepData.condition.type === type && value >= stepData.condition.value) {
          get().nextStep()
        }
      },
    }),
    {
      name: 'road-fury-tutorial',
    }
  )
)
