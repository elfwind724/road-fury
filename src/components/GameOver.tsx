/**
 * 游戏结束界面
 */

import { useGameStore } from '@/store'

interface GameOverProps {
  onRestart: () => void
  onMainMenu: () => void
}

export function GameOver({ onRestart, onMainMenu }: GameOverProps) {
  const run = useGameStore((state) => state.run)
  const meta = useGameStore((state) => state.meta)
  const endRun = useGameStore((state) => state.endRun)

  if (!run) return null

  const distance = Math.floor(run.distance)
  const earnedPoints = Math.floor(distance * 0.1)
  const zombiesKilled = run.wave.zombiesKilled || 0
  const wavesCompleted = run.wave.currentWave > 0 ? run.wave.currentWave - 1 : 0

  const handleRestart = () => {
    endRun()
    onRestart()
  }

  const handleMainMenu = () => {
    endRun()
    onMainMenu()
  }

  return (
    <div className="game-over-overlay">
      <div className="game-over-panel">
        <div className="game-over-title">
          <span className="skull">💀</span>
          <h1>末路狂飙</h1>
          <span className="subtitle">旅程结束</span>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-icon">🛣️</span>
            <span className="stat-label">行驶距离</span>
            <span className="stat-value">{distance} m</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💀</span>
            <span className="stat-label">击杀丧尸</span>
            <span className="stat-value">{zombiesKilled}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🌊</span>
            <span className="stat-label">完成波次</span>
            <span className="stat-value">{wavesCompleted}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-label">幸存者</span>
            <span className="stat-value">{run.survivors.length}</span>
          </div>
        </div>

        <div className="reward-section">
          <div className="reward-title">🏆 获得奖励</div>
          <div className="reward-item">
            <span className="reward-icon">⭐</span>
            <span className="reward-label">末日点数</span>
            <span className="reward-value">+{earnedPoints}</span>
          </div>
          <div className="total-points">
            总计: {meta.apocalypsePoints + earnedPoints} 点
          </div>
        </div>

        <div className="actions">
          <button className="action-btn restart" onClick={handleRestart}>
            🔄 再来一局
          </button>
          <button className="action-btn menu" onClick={handleMainMenu}>
            🏠 返回主菜单
          </button>
        </div>
      </div>

      <style>{`
        .game-over-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .game-over-panel {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 3px solid #ff4444;
          border-radius: 20px;
          padding: 30px;
          max-width: 360px;
          width: 100%;
          color: white;
          font-family: Arial, sans-serif;
          text-align: center;
        }

        .game-over-title {
          margin-bottom: 24px;
        }

        .skull {
          font-size: 48px;
          display: block;
          margin-bottom: 8px;
        }

        .game-over-title h1 {
          font-size: 28px;
          margin: 0;
          color: #ff4444;
        }

        .subtitle {
          font-size: 14px;
          color: #888;
        }

        .stats-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-label {
          font-size: 11px;
          color: #888;
        }

        .stat-value {
          font-size: 18px;
          font-weight: bold;
        }

        .reward-section {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .reward-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #ffd700;
        }

        .reward-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 18px;
        }

        .reward-icon {
          font-size: 24px;
        }

        .reward-value {
          color: #4caf50;
          font-weight: bold;
        }

        .total-points {
          margin-top: 8px;
          font-size: 12px;
          color: #888;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.restart {
          background: linear-gradient(135deg, #4caf50, #45a049);
          color: white;
        }

        .action-btn.restart:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
        }

        .action-btn.menu {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .action-btn.menu:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  )
}
