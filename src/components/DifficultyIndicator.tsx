/**
 * 难度指示器组件
 */

import { getDifficultyLevel, type RandomModifier } from '@/systems/EndlessSystem'

interface DifficultyIndicatorProps {
  distance: number
  activeModifiers: RandomModifier[]
}

export function DifficultyIndicator({ distance, activeModifiers }: DifficultyIndicatorProps) {
  const difficulty = getDifficultyLevel(distance)
  
  const difficultyColors: Record<number, string> = {
    1: '#4caf50',  // 新手 - 绿色
    2: '#8bc34a',  // 普通 - 浅绿
    3: '#ffc107',  // 困难 - 黄色
    4: '#ff9800',  // 噩梦 - 橙色
    5: '#f44336'   // 地狱 - 红色
  }

  return (
    <div className="difficulty-indicator">
      <div 
        className="difficulty-badge"
        style={{ backgroundColor: difficultyColors[difficulty.level] }}
      >
        <span className="difficulty-level">Lv.{difficulty.level}</span>
        <span className="difficulty-name">{difficulty.name}</span>
      </div>
      
      {activeModifiers.length > 0 && (
        <div className="active-modifiers">
          {activeModifiers.map((mod, index) => (
            <div key={index} className="modifier-badge" title={mod.description}>
              <span className="modifier-icon">{mod.icon}</span>
              <span className="modifier-name">{mod.name}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .difficulty-indicator {
          position: fixed;
          top: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          z-index: 100;
        }

        .difficulty-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .difficulty-level {
          font-size: 12px;
          opacity: 0.9;
        }

        .difficulty-name {
          font-size: 14px;
        }

        .active-modifiers {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
        }

        .modifier-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 12px;
          color: white;
          font-size: 12px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .modifier-icon {
          font-size: 14px;
        }

        .modifier-name {
          font-size: 11px;
        }
      `}</style>
    </div>
  )
}
