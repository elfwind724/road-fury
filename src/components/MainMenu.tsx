/**
 * 主菜单组件
 */

import { useState } from 'react'
import { useGameStore, useTutorialStore } from '@/store'
import { SKILL_NODES } from '@/config/skillTree'
import type { SkillNode, SkillTreeBranch } from '@/types/skillTree'

interface MainMenuProps {
  onStartGame: () => void
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  const [showSkillTree, setShowSkillTree] = useState(false)
  const meta = useGameStore((state) => state.meta)
  const startNewRun = useGameStore((state) => state.startNewRun)
  const upgradeSkill = useGameStore((state) => state.upgradeSkill)
  const { hasCompletedTutorial, resetTutorial } = useTutorialStore()
  
  const handleNewGame = () => {
    startNewRun('tricycle')
    onStartGame()
  }

  const handleResetTutorial = () => {
    resetTutorial()
  }

  if (showSkillTree) {
    return (
      <SkillTreeView 
        meta={meta} 
        onUpgrade={upgradeSkill}
        onClose={() => setShowSkillTree(false)} 
      />
    )
  }
  
  return (
    <div className="main-menu">
      <div className="menu-content">
        <h1 className="title">末路狂飙</h1>
        <p className="subtitle">Road Fury: Rolling Shelter</p>
        
        <div className="stats">
          <div className="stat">
            <span className="stat-label">总里程</span>
            <span className="stat-value">{Math.floor(meta.totalDistance)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">游戏次数</span>
            <span className="stat-value">{meta.totalRuns}</span>
          </div>
          <div className="stat">
            <span className="stat-label">末世点数</span>
            <span className="stat-value">🔮 {meta.apocalypsePoints}</span>
          </div>
        </div>
        
        <div className="menu-buttons">
          <button className="menu-btn primary" onClick={handleNewGame}>
            {hasCompletedTutorial ? '🚗 开始游戏' : '🎮 开始游戏'}
          </button>
          <button className="menu-btn skill-tree" onClick={() => setShowSkillTree(true)}>
            🌳 永久升级
          </button>
          {hasCompletedTutorial && (
            <button className="menu-btn tutorial" onClick={handleResetTutorial}>
              📖 重新学习
            </button>
          )}
          <button className="menu-btn" disabled>
            🏆 成就
          </button>
        </div>
      </div>
      
      <style>{`
        .main-menu {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        
        .menu-content {
          text-align: center;
          color: white;
          max-width: 360px;
          width: 100%;
        }
        
        .title {
          font-size: 36px;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .subtitle {
          font-size: 14px;
          opacity: 0.7;
          margin: 8px 0 24px;
        }
        
        .stats {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        
        .stat {
          background: rgba(255, 255, 255, 0.1);
          padding: 10px 16px;
          border-radius: 8px;
          min-width: 80px;
        }
        
        .stat-label {
          display: block;
          font-size: 11px;
          opacity: 0.7;
          margin-bottom: 4px;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: bold;
        }
        
        .menu-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        
        .menu-btn {
          width: 100%;
          max-width: 240px;
          padding: 14px 24px;
          font-size: 16px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .menu-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.02);
        }
        
        .menu-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        
        .menu-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .menu-btn.primary {
          background: linear-gradient(135deg, #4a90d9 0%, #357abd 100%);
          font-size: 18px;
          padding: 16px 24px;
        }
        
        .menu-btn.primary:hover {
          background: linear-gradient(135deg, #5a9fe9 0%, #458acd 100%);
        }

        .menu-btn.tutorial {
          background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
        }

        .menu-btn.tutorial:hover {
          background: linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%);
        }

        .menu-btn.skill-tree {
          background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
        }

        .menu-btn.skill-tree:hover {
          background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
        }
      `}</style>
    </div>
  )
}

// 技能树分支配置
const SKILL_BRANCHES: Record<SkillTreeBranch, { name: string; icon: string; color: string; description: string }> = {
  combat: { name: '战斗', icon: '⚔️', color: '#ff4444', description: '提升战斗能力和伤害输出' },
  survival: { name: '生存', icon: '🛡️', color: '#44ff44', description: '增强生存能力和资源管理' },
  engineering: { name: '工程', icon: '⚙️', color: '#4444ff', description: '提升设施效率和科技水平' },
  leadership: { name: '领导', icon: '👑', color: '#ffaa00', description: '增强幸存者管理和团队效率' },
  scavenging: { name: '搜刮', icon: '🔍', color: '#aa44ff', description: '提升资源获取和探索效率' },
}

// 技能树视图
function SkillTreeView({ 
  meta, 
  onUpgrade,
  onClose 
}: { 
  meta: any
  onUpgrade: (skillId: string) => boolean
  onClose: () => void 
}) {
  const [selectedBranch, setSelectedBranch] = useState<SkillTreeBranch>('combat')
  const skillTree = meta.skillTree || {}
  
  const branches = Object.entries(SKILL_BRANCHES).map(([id, config]) => ({
    id: id as SkillTreeBranch,
    ...config
  }))

  const branchSkills = SKILL_NODES.filter((node: SkillNode) => node.branch === selectedBranch)
  const currentBranch = SKILL_BRANCHES[selectedBranch]

  return (
    <div className="skill-tree-view">
      <div className="skill-tree-header">
        <h2>🌳 永久升级</h2>
        <div className="points-display">
          🔮 {meta.apocalypsePoints} 末世点数
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="branch-tabs">
        {branches.map(branch => (
          <button
            key={branch.id}
            className={`branch-tab ${selectedBranch === branch.id ? 'active' : ''}`}
            style={{ 
              borderColor: selectedBranch === branch.id ? branch.color : 'transparent',
              color: selectedBranch === branch.id ? branch.color : '#888'
            }}
            onClick={() => setSelectedBranch(branch.id)}
          >
            {branch.icon} {branch.name}
          </button>
        ))}
      </div>

      <div className="branch-description" style={{ color: currentBranch?.color }}>
        {currentBranch?.description}
      </div>

      <div className="skills-grid">
        {branchSkills.map((skill: SkillNode) => {
          const currentLevel = skillTree[skill.id] || 0
          const isMaxLevel = currentLevel >= skill.maxLevel
          const cost = skill.costPerLevel * (currentLevel + 1)
          const canAfford = meta.apocalypsePoints >= cost
          const hasPrereqs = skill.prerequisites.every((prereq: string) => (skillTree[prereq] || 0) > 0)
          const canUpgrade = !isMaxLevel && canAfford && hasPrereqs

          return (
            <div 
              key={skill.id} 
              className={`skill-card ${currentLevel > 0 ? 'unlocked' : ''} ${!hasPrereqs ? 'locked' : ''}`}
              style={{ borderColor: currentLevel > 0 ? currentBranch?.color : '#444' }}
            >
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-info">
                <div className="skill-name">{skill.name}</div>
                <div className="skill-desc">{skill.description}</div>
                <div className="skill-level">
                  Lv.{currentLevel} / {skill.maxLevel}
                </div>
              </div>
              <button
                className={`upgrade-btn ${canUpgrade ? '' : 'disabled'}`}
                onClick={() => canUpgrade && onUpgrade(skill.id)}
                disabled={!canUpgrade}
              >
                {isMaxLevel ? '✅' : `🔮${cost}`}
              </button>
            </div>
          )
        })}
      </div>

      <style>{`
        .skill-tree-view {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          padding: 16px;
          font-family: Arial, sans-serif;
        }

        .skill-tree-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .skill-tree-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .points-display {
          background: rgba(255,255,255,0.1);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
        }

        .close-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          font-size: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
        }

        .branch-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .branch-tab {
          padding: 8px 12px;
          background: rgba(255,255,255,0.05);
          border: 2px solid transparent;
          border-radius: 8px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .branch-tab.active {
          background: rgba(255,255,255,0.1);
        }

        .branch-description {
          font-size: 12px;
          margin-bottom: 16px;
          opacity: 0.8;
        }

        .skills-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skill-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border: 2px solid #444;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .skill-card.unlocked {
          background: rgba(255,255,255,0.1);
        }

        .skill-card.locked {
          opacity: 0.5;
        }

        .skill-icon {
          font-size: 28px;
          width: 40px;
          text-align: center;
        }

        .skill-info {
          flex: 1;
        }

        .skill-name {
          font-weight: bold;
          font-size: 14px;
        }

        .skill-desc {
          font-size: 11px;
          opacity: 0.7;
          margin: 2px 0;
        }

        .skill-level {
          font-size: 10px;
          color: #4a90d9;
        }

        .upgrade-btn {
          padding: 8px 14px;
          background: #4a90d9;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upgrade-btn.disabled {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
