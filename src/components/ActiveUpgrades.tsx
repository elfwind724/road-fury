/**
 * 当前升级显示组件
 */

import { getUpgradeConfig, RARITY_COLORS } from '@/systems/RoguelikeSystem'

interface ActiveUpgradesProps {
  upgrades: Record<string, number>
  compact?: boolean
}

export function ActiveUpgrades({ upgrades, compact = false }: ActiveUpgradesProps) {
  const upgradeList = Object.entries(upgrades)
    .filter(([_, stacks]) => stacks > 0)
    .map(([id, stacks]) => ({
      id,
      stacks,
      config: getUpgradeConfig(id)
    }))
    .filter(u => u.config)

  if (upgradeList.length === 0) return null

  if (compact) {
    return (
      <div className="active-upgrades-compact">
        {upgradeList.map(({ id, stacks, config }) => (
          <div 
            key={id} 
            className="upgrade-icon-compact"
            title={`${config!.name} x${stacks}`}
            style={{ borderColor: RARITY_COLORS[config!.rarity] }}
          >
            <span>{config!.icon}</span>
            {stacks > 1 && <span className="stack-count">{stacks}</span>}
          </div>
        ))}

        <style>{`
          .active-upgrades-compact {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }

          .upgrade-icon-compact {
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.6);
            border: 2px solid #444;
            border-radius: 6px;
            font-size: 18px;
          }

          .stack-count {
            position: absolute;
            bottom: -4px;
            right: -4px;
            background: #f44336;
            color: white;
            font-size: 10px;
            font-weight: bold;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="active-upgrades">
      <h4>当前升级</h4>
      <div className="upgrade-list">
        {upgradeList.map(({ id, stacks, config }) => (
          <div 
            key={id} 
            className="upgrade-item"
            style={{ borderLeftColor: RARITY_COLORS[config!.rarity] }}
          >
            <span className="upgrade-icon">{config!.icon}</span>
            <div className="upgrade-info">
              <span className="upgrade-name">{config!.name}</span>
              <span className="upgrade-stacks">x{stacks}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .active-upgrades {
          background: rgba(0, 0, 0, 0.7);
          border-radius: 8px;
          padding: 12px;
          color: white;
        }

        .active-upgrades h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #ffd700;
        }

        .upgrade-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .upgrade-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.05);
          border-left: 3px solid #444;
          border-radius: 4px;
        }

        .upgrade-icon {
          font-size: 18px;
        }

        .upgrade-info {
          display: flex;
          justify-content: space-between;
          flex: 1;
        }

        .upgrade-name {
          font-size: 13px;
        }

        .upgrade-stacks {
          font-size: 12px;
          color: #888;
        }
      `}</style>
    </div>
  )
}
