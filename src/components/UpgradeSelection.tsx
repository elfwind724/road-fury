/**
 * Roguelike升级选择界面
 */

import { useState } from 'react'
import { 
  selectRandomUpgrades, 
  RARITY_COLORS, 
  RARITY_NAMES,
  type UpgradeOption 
} from '@/systems/RoguelikeSystem'

interface UpgradeSelectionProps {
  distance: number
  currentUpgrades: Record<string, number>
  onSelect: (upgrade: UpgradeOption) => void
  onSkip: () => void
}

export function UpgradeSelection({ 
  distance, 
  currentUpgrades, 
  onSelect, 
  onSkip 
}: UpgradeSelectionProps) {
  const [options] = useState(() => 
    selectRandomUpgrades(3, currentUpgrades, distance)
  )

  return (
    <div className="upgrade-selection-overlay">
      <div className="upgrade-selection-panel">
        <h2>🎁 选择升级</h2>
        <p className="upgrade-hint">击败Boss后获得的奖励</p>
        
        <div className="upgrade-options">
          {options.map(option => (
            <div 
              key={option.id}
              className={`upgrade-card rarity-${option.rarity}`}
              onClick={() => onSelect(option)}
              style={{ borderColor: RARITY_COLORS[option.rarity] }}
            >
              <div className="upgrade-icon">{option.icon}</div>
              <div className="upgrade-rarity" style={{ color: RARITY_COLORS[option.rarity] }}>
                {RARITY_NAMES[option.rarity]}
              </div>
              <div className="upgrade-name">{option.name}</div>
              <div className="upgrade-description">{option.description}</div>
              <div className="upgrade-stacks">
                已拥有: {currentUpgrades[option.id] || 0}/{option.maxStacks}
              </div>
            </div>
          ))}
        </div>

        <button className="skip-button" onClick={onSkip}>
          跳过
        </button>
      </div>

      <style>{`
        .upgrade-selection-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .upgrade-selection-panel {
          text-align: center;
          color: white;
        }

        .upgrade-selection-panel h2 {
          font-size: 28px;
          margin-bottom: 8px;
          color: #ffd700;
        }

        .upgrade-hint {
          color: #888;
          margin-bottom: 24px;
        }

        .upgrade-options {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .upgrade-card {
          width: 180px;
          padding: 20px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: 3px solid #444;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .upgrade-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .upgrade-rarity {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .upgrade-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #fff;
        }

        .upgrade-description {
          font-size: 13px;
          color: #aaa;
          margin-bottom: 12px;
          min-height: 36px;
        }

        .upgrade-stacks {
          font-size: 11px;
          color: #666;
        }

        .rarity-common { background: linear-gradient(135deg, #2a2a3e, #1a1a2e); }
        .rarity-rare { background: linear-gradient(135deg, #1a2a4e, #0a1a3e); }
        .rarity-epic { background: linear-gradient(135deg, #2a1a4e, #1a0a3e); }
        .rarity-legendary { background: linear-gradient(135deg, #3a2a1e, #2a1a0e); }

        .skip-button {
          margin-top: 24px;
          padding: 10px 30px;
          background: transparent;
          border: 2px solid #666;
          color: #888;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .skip-button:hover {
          border-color: #888;
          color: #aaa;
        }
      `}</style>
    </div>
  )
}
