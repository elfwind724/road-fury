/**
 * 新手引导组件
 */

import { useEffect, useCallback } from 'react'
import { useTutorialStore } from '@/store/tutorialStore'
import { getTutorialStep } from '@/config/tutorial'

interface TutorialProps {
  onOpenInterior?: () => void
}

export function Tutorial({ onOpenInterior }: TutorialProps) {
  const { isActive, currentStep, nextStep, skipTutorial } = useTutorialStore()
  
  const stepData = getTutorialStep(currentStep)

  // 处理点击继续
  const handleContinue = useCallback(() => {
    // 如果是需要打开车内的步骤
    if (currentStep === 'open_interior' && onOpenInterior) {
      onOpenInterior()
    }
    nextStep()
  }, [currentStep, nextStep, onOpenInterior])

  // 处理自动等待
  useEffect(() => {
    if (!isActive || !stepData) return

    if (stepData.action?.type === 'wait' && stepData.action.duration) {
      const timer = setTimeout(() => {
        nextStep()
      }, stepData.action.duration)
      return () => clearTimeout(timer)
    }
  }, [isActive, stepData, nextStep])

  if (!isActive || !stepData) return null

  return (
    <div className="tutorial-overlay">
      {/* 高亮区域遮罩 */}
      {stepData.highlight && (
        <div className={`highlight-mask ${stepData.highlight.type}`} data-target={stepData.highlight.target} />
      )}

      {/* 教程对话框 */}
      <div className={`tutorial-dialog position-${stepData.position}`}>
        <div className="tutorial-emoji">{stepData.emoji}</div>
        <h3 className="tutorial-title">{stepData.title}</h3>
        <p className="tutorial-desc">{stepData.description}</p>
        
        <div className="tutorial-actions">
          {stepData.skipable && currentStep !== 'complete' && (
            <button className="skip-btn" onClick={skipTutorial}>
              跳过教程
            </button>
          )}
          <button className="continue-btn" onClick={handleContinue}>
            {currentStep === 'complete' ? '开始游戏!' : '继续'}
          </button>
        </div>

        {/* 进度指示器 */}
        <div className="tutorial-progress">
          {['welcome', 'movement', 'shooting', 'collect_resources', 'open_interior', 'build_facility', 'upgrade_weapon', 'rescue_survivor', 'wave_system', 'complete'].map((step, idx) => (
            <div 
              key={step} 
              className={`progress-dot ${step === currentStep ? 'active' : ''} ${idx < ['welcome', 'movement', 'shooting', 'collect_resources', 'open_interior', 'build_facility', 'upgrade_weapon', 'rescue_survivor', 'wave_system', 'complete'].indexOf(currentStep) ? 'completed' : ''}`}
            />
          ))}
        </div>
      </div>

      <style>{tutorialStyles}</style>
    </div>
  )
}

// 简化版教程提示（用于游戏中的小提示）
export function TutorialHint() {
  const { isActive, currentStep, skipStep } = useTutorialStore()
  const stepData = getTutorialStep(currentStep)

  if (!isActive || !stepData) return null

  // 只在特定步骤显示小提示
  const showHint = ['movement', 'shooting', 'collect_resources'].includes(currentStep)
  if (!showHint) return null

  return (
    <div className="tutorial-hint">
      <span className="hint-emoji">{stepData.emoji}</span>
      <span className="hint-text">{stepData.title}</span>
      {stepData.skipable && (
        <button className="hint-skip" onClick={skipStep}>✕</button>
      )}
      <style>{hintStyles}</style>
    </div>
  )
}

const tutorialStyles = `
  .tutorial-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .highlight-mask {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .tutorial-dialog {
    position: absolute;
    max-width: 320px;
    background: linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%);
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    color: white;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.1);
    animation: slideUp 0.4s ease;
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tutorial-dialog.position-top {
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
  }

  .tutorial-dialog.position-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .tutorial-dialog.position-bottom {
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
  }

  .tutorial-emoji {
    font-size: 48px;
    margin-bottom: 12px;
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .tutorial-title {
    font-size: 20px;
    font-weight: bold;
    margin: 0 0 12px;
    color: #fff;
  }

  .tutorial-desc {
    font-size: 14px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 20px;
  }

  .tutorial-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .skip-btn {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .skip-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .continue-btn {
    padding: 12px 28px;
    background: linear-gradient(135deg, #4a90d9 0%, #357abd 100%);
    border: none;
    border-radius: 25px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .continue-btn:hover {
    background: linear-gradient(135deg, #5a9fe9 0%, #458acd 100%);
    transform: scale(1.05);
  }

  .continue-btn:active {
    transform: scale(0.98);
  }

  .tutorial-progress {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
  }

  .progress-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
  }

  .progress-dot.active {
    background: #4a90d9;
    transform: scale(1.3);
  }

  .progress-dot.completed {
    background: #4CAF50;
  }
`

const hintStyles = `
  .tutorial-hint {
    position: absolute;
    top: 180px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(74, 144, 217, 0.9);
    padding: 8px 16px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
    font-size: 13px;
    z-index: 100;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4); }
    50% { box-shadow: 0 0 0 10px rgba(74, 144, 217, 0); }
  }

  .hint-emoji {
    font-size: 16px;
  }

  .hint-text {
    font-weight: 500;
  }

  .hint-skip {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hint-skip:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`
