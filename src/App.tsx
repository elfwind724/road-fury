/**
 * 主应用组件 - 支持公路/车内场景切换
 */

import { useState, useEffect } from 'react'
import { useGameStore, useTutorialStore } from '@/store'
import { MainMenu, GameContainer, Tutorial, TutorialHint } from '@/components'
import { VehicleInterior } from '@/components/VehicleInterior'

type GameScreen = 'menu' | 'road' | 'interior'

function App() {
  const [screen, setScreen] = useState<GameScreen>('menu')
  const run = useGameStore((state) => state.run)
  const { isActive: tutorialActive, startTutorial, currentStep, nextStep } = useTutorialStore()

  // 如果有进行中的游戏，根据状态显示对应界面
  const currentScreen = run ? screen : 'menu'

  const handleStartGame = () => {
    setScreen('road')
    // 开始新手引导
    startTutorial()
  }

  const handleOpenInterior = () => {
    setScreen('interior')
    // 如果在教程的"进入车内"步骤，自动进入下一步
    if (tutorialActive && currentStep === 'open_interior') {
      nextStep()
    }
  }

  const handleCloseInterior = () => {
    setScreen('road')
  }

  // 监听教程步骤变化，处理特定步骤的逻辑
  useEffect(() => {
    if (tutorialActive && currentStep === 'build_facility' && screen !== 'interior') {
      // 如果在建造设施步骤但不在车内，提示用户
    }
  }, [tutorialActive, currentStep, screen])

  return (
    <div className="app">
      {currentScreen === 'menu' && <MainMenu onStartGame={handleStartGame} />}

      {currentScreen === 'road' && (
        <>
          <GameContainer onOpenInterior={handleOpenInterior} />
          {/* 游戏中的教程小提示 */}
          {tutorialActive && <TutorialHint />}
        </>
      )}

      {currentScreen === 'interior' && (
        <VehicleInterior onClose={handleCloseInterior} />
      )}

      {/* 新手引导弹窗 - 在公路和车内场景都显示 */}
      {tutorialActive && (currentScreen === 'road' || currentScreen === 'interior') && (
        <Tutorial onOpenInterior={handleOpenInterior} />
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          background: #1a1a2e;
          overflow: hidden;
        }
        
        .app {
          width: 100vw;
          height: 100vh;
        }
      `}</style>
    </div>
  )
}

export default App
