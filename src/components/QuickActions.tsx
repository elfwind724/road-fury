/**
 * 快捷操作按钮组件 - 竖屏适配
 */

import { useGameStore } from '@/store'

interface QuickActionsProps {
  onOpenInterior?: () => void
}

export function QuickActions({ onOpenInterior }: QuickActionsProps) {
  const run = useGameStore((state) => state.run)
  const pauseRun = useGameStore((state) => state.pauseRun)
  const resumeRun = useGameStore((state) => state.resumeRun)
  
  if (!run) return null
  
  const handlePause = () => {
    if (run.isRunning) {
      pauseRun()
    } else {
      resumeRun()
    }
  }
  
  return (
    <div className="quick-actions">
      <button className="action-btn" onClick={handlePause} title={run.isRunning ? '暂停' : '继续'}>
        {run.isRunning ? '⏸️' : '▶️'}
      </button>
      <button className="action-btn interior-btn" onClick={onOpenInterior} title="进入车内">
        🚐
      </button>
      
      <style>{`
        .quick-actions {
          position: absolute;
          top: 100px;
          right: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .action-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }
        
        .action-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        
        .action-btn:active {
          transform: scale(0.9);
        }
      `}</style>
    </div>
  )
}
