/**
 * 排行榜组件
 */

import { useState, useEffect } from 'react'
import { 
  getLeaderboard, 
  getStats, 
  formatDate, 
  formatDuration,
  type LeaderboardEntry 
} from '@/systems/LeaderboardSystem'

interface LeaderboardProps {
  onClose: () => void
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState({
    totalRuns: 0,
    bestDistance: 0,
    totalDistance: 0,
    totalKills: 0,
    averageDistance: 0
  })

  useEffect(() => {
    setEntries(getLeaderboard())
    setStats(getStats())
  }, [])

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-panel">
        <div className="leaderboard-header">
          <h2>🏆 排行榜</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-value">{stats.totalRuns}</span>
            <span className="stat-label">总游戏次数</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.bestDistance}m</span>
            <span className="stat-label">最远距离</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.totalKills}</span>
            <span className="stat-label">总击杀数</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.averageDistance}m</span>
            <span className="stat-label">平均距离</span>
          </div>
        </div>

        <div className="leaderboard-list">
          {entries.length === 0 ? (
            <div className="no-records">暂无记录，开始游戏吧！</div>
          ) : (
            entries.map((entry, index) => (
              <div key={entry.id} className={`leaderboard-entry rank-${index + 1}`}>
                <div className="rank">
                  {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                </div>
                <div className="entry-info">
                  <div className="entry-main">
                    <span className="player-name">{entry.playerName}</span>
                    <span className="distance">{entry.distance}m</span>
                  </div>
                  <div className="entry-details">
                    <span>🧟 {entry.kills}</span>
                    <span>👥 {entry.survivors}</span>
                    <span>🚗 {entry.vehicleType}</span>
                    <span>⏱️ {formatDuration(entry.duration)}</span>
                  </div>
                </div>
                <div className="entry-date">{formatDate(entry.date)}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .leaderboard-overlay {
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
        }

        .leaderboard-panel {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-radius: 16px;
          padding: 24px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          color: white;
        }

        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .leaderboard-header h2 {
          margin: 0;
          color: #ffd700;
        }

        .close-btn {
          background: none;
          border: none;
          color: #888;
          font-size: 24px;
          cursor: pointer;
        }

        .close-btn:hover {
          color: white;
        }

        .stats-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 20px;
          font-weight: bold;
          color: #4caf50;
        }

        .stat-label {
          font-size: 11px;
          color: #888;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .no-records {
          text-align: center;
          color: #666;
          padding: 40px;
        }

        .leaderboard-entry {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border-left: 3px solid #444;
        }

        .leaderboard-entry.rank-1 { border-left-color: #ffd700; }
        .leaderboard-entry.rank-2 { border-left-color: #c0c0c0; }
        .leaderboard-entry.rank-3 { border-left-color: #cd7f32; }

        .rank {
          width: 40px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
        }

        .entry-info {
          flex: 1;
        }

        .entry-main {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .player-name {
          font-weight: bold;
        }

        .distance {
          color: #4caf50;
          font-weight: bold;
        }

        .entry-details {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #888;
        }

        .entry-date {
          font-size: 11px;
          color: #666;
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}
