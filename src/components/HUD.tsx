/**
 * 游戏 HUD 组件 - 竖屏适配 + 完整信息
 */

import { useGameStore } from '@/store'

const BLOOD_MOON_INTERVAL = 7

export function HUD() {
  const run = useGameStore((state) => state.run)

  if (!run) return null

  // 检查是否有幸存者需要关注
  const hungryCount = run.survivors.filter((s) => s.hunger < 30).length
  const thirstyCount = run.survivors.filter((s) => s.thirst < 30).length
  
  // 检查是否是血月
  const isBloodMoon = run.wave.currentWave > 0 && run.wave.currentWave % BLOOD_MOON_INTERVAL === 0

  return (
    <div className="hud">
      {/* 顶部资源栏 */}
      <div className="hud-top">
        <ResourceItem icon="🔩" value={run.resources.scrap} />
        <ResourceItem icon="🍖" value={run.resources.food} />
        <ResourceItem icon="💧" value={run.resources.water} />
        <ResourceItem icon="⚙️" value={run.resources.parts} />
      </div>

      {/* 波次提示 */}
      {run.wave.isActive && (
        <div className={`wave-indicator ${isBloodMoon ? 'blood-moon' : ''}`}>
          {isBloodMoon ? '🌑 血月之夜!' : `🌊 第 ${run.wave.currentWave} 波`}
          <div className="wave-progress">
            <div 
              className="wave-progress-fill" 
              style={{ 
                width: `${Math.max(0, 100 - (run.wave.timeRemaining / 60000) * 100)}%`,
                background: isBloodMoon ? '#ff0000' : '#fff'
              }}
            />
          </div>
        </div>
      )}

      {/* 幸存者警告 */}
      {(hungryCount > 0 || thirstyCount > 0) && (
        <div className="warning-bar">
          {hungryCount > 0 && <span>🍖 {hungryCount}人饥饿</span>}
          {thirstyCount > 0 && <span>💧 {thirstyCount}人口渴</span>}
        </div>
      )}

      {/* 幸存者数量 */}
      {run.survivors.length > 0 && (
        <div className="survivor-count">
          👥 {run.survivors.length}
        </div>
      )}

      {/* 天气显示 */}
      <div className="weather-indicator">
        <span className="weather-icon">{getWeatherIcon(run.weather.current)}</span>
        <span className="weather-name">{getWeatherName(run.weather.current)}</span>
      </div>

      {/* 弹药显示 */}
      <div className="ammo-indicator">
        <span className="ammo-icon">🔫</span>
        <span className="ammo-value">{Math.floor(run.resources.ammo)}</span>
        {run.resources.ammo < 10 && <span className="ammo-warning">!</span>}
      </div>

      {/* 武器等级显示 */}
      <div className="weapon-level">
        <span>🎯 Lv.{run.weaponUpgrades?.machine_gun || 1}</span>
      </div>

      {/* 底部操作提示 */}
      <div className="hud-bottom">
        <div className="lane-hint">
          <span className="hint-arrow">👈</span>
          <span className="hint-text">点击换道</span>
          <span className="hint-arrow">👉</span>
        </div>
      </div>

      <style>{`
        .hud {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          font-family: Arial, sans-serif;
          color: white;
        }

        .hud-top {
          position: absolute;
          top: 70px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 0 8px;
        }

        .resource-item {
          background: rgba(0, 0, 0, 0.6);
          padding: 4px 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
        }

        .resource-item .icon {
          font-size: 14px;
        }

        .resource-item .value {
          font-weight: bold;
          min-width: 24px;
          text-align: right;
        }

        .warning-bar {
          position: absolute;
          top: 110px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 100, 100, 0.8);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          display: flex;
          gap: 12px;
        }

        .survivor-count {
          position: absolute;
          top: 100px;
          left: 10px;
          background: rgba(0, 0, 0, 0.6);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 14px;
        }

        .hud-bottom {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
        }

        .lane-hint {
          background: rgba(0, 0, 0, 0.4);
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          opacity: 0.7;
        }

        .hint-arrow {
          font-size: 16px;
        }

        .hint-text {
          color: #ccc;
        }

        .wave-indicator {
          position: absolute;
          top: 140px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 50, 50, 0.8);
          padding: 6px 16px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
        }

        .wave-indicator.blood-moon {
          background: rgba(139, 0, 0, 0.9);
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
          animation: blood-pulse 1s infinite;
        }

        @keyframes blood-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); }
          50% { box-shadow: 0 0 30px rgba(255, 0, 0, 0.8); }
        }

        .wave-progress {
          width: 100px;
          height: 4px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 2px;
          margin-top: 4px;
        }

        .wave-progress-fill {
          height: 100%;
          background: #fff;
          border-radius: 2px;
          transition: width 0.3s;
        }

        .weather-indicator {
          position: absolute;
          top: 100px;
          right: 10px;
          background: rgba(0, 0, 0, 0.6);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .weather-icon {
          font-size: 16px;
        }

        .weather-name {
          color: #ccc;
        }

        .ammo-indicator {
          position: absolute;
          top: 130px;
          right: 10px;
          background: rgba(0, 0, 0, 0.6);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ammo-icon {
          font-size: 14px;
        }

        .ammo-value {
          font-weight: bold;
          min-width: 24px;
        }

        .ammo-warning {
          color: #ff4444;
          font-weight: bold;
          animation: blink 0.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .weapon-level {
          position: absolute;
          top: 160px;
          right: 10px;
          background: rgba(0, 0, 0, 0.6);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
        }
      `}</style>
    </div>
  )
}

function ResourceItem({ icon, value }: { icon: string; value: number }) {
  return (
    <div className="resource-item">
      <span className="icon">{icon}</span>
      <span className="value">{Math.floor(value)}</span>
    </div>
  )
}

function getWeatherIcon(weather: string): string {
  const icons: Record<string, string> = {
    sunny: '☀️',
    rainy: '🌧️',
    night: '🌙',
    sandstorm: '🌪️',
  }
  return icons[weather] || '☀️'
}

function getWeatherName(weather: string): string {
  const names: Record<string, string> = {
    sunny: '晴天',
    rainy: '雨天',
    night: '夜晚',
    sandstorm: '沙尘暴',
  }
  return names[weather] || '晴天'
}
