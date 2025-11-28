import { useGameStore } from '@/store'
import { WEAPON_CONFIGS, getWeaponStatsAtLevel } from '@/config/weapons'
import type { WeaponUpgrades, ResourceState } from '@/types'

interface WeaponPanelProps {
    resources: ResourceState
    weaponUpgrades: WeaponUpgrades
}

export function WeaponPanel({ resources, weaponUpgrades }: WeaponPanelProps) {
    const upgradeWeapon = useGameStore((state) => state.upgradeWeapon)
    const unlockWeapon = useGameStore((state) => state.unlockWeapon)

    // 武器解锁成本
    const unlockCosts: Record<string, { scrap: number; parts: number; electronics: number }> = {
        shotgun: { scrap: 100, parts: 50, electronics: 20 },
        sniper: { scrap: 150, parts: 80, electronics: 40 },
        rocket_launcher: { scrap: 200, parts: 100, electronics: 60 },
        flamethrower: { scrap: 180, parts: 90, electronics: 50 },
        tesla_coil: { scrap: 250, parts: 120, electronics: 100 },
        freeze_ray: { scrap: 200, parts: 100, electronics: 80 },
        laser_turret: { scrap: 300, parts: 150, electronics: 150 },
    }

    return (
        <div className="weapon-panel">
            <div className="weapon-list">
                {WEAPON_CONFIGS.map((weapon) => {
                    const level = weaponUpgrades[weapon.type as keyof WeaponUpgrades] || 0
                    const isUnlocked = level > 0
                    const isMaxLevel = level >= weapon.maxLevel
                    const unlockCost = unlockCosts[weapon.type]
                    const upgradeCost = isUnlocked ? {
                        scrap: 50 * level,
                        parts: 30 * level,
                        electronics: 10 * level,
                    } : null

                    const canUnlock = !isUnlocked && unlockCost &&
                        resources.scrap >= unlockCost.scrap &&
                        resources.parts >= unlockCost.parts &&
                        resources.electronics >= unlockCost.electronics

                    const canUpgrade = isUnlocked && !isMaxLevel && upgradeCost &&
                        resources.scrap >= upgradeCost.scrap &&
                        resources.parts >= upgradeCost.parts &&
                        resources.electronics >= upgradeCost.electronics

                    const currentStats = isUnlocked ? getWeaponStatsAtLevel(weapon, level) : null
                    const nextStats = isUnlocked && !isMaxLevel ? getWeaponStatsAtLevel(weapon, level + 1) : null

                    return (
                        <div key={weapon.type} className={`weapon-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                            <div className="weapon-header">
                                <div className="weapon-icon">{weapon.icon}</div>
                                <div className="weapon-title">
                                    <div className="weapon-name">{weapon.name}</div>
                                    <div className="weapon-level">
                                        {isUnlocked ? `Lv.${level} / ${weapon.maxLevel}` : '未解锁'}
                                    </div>
                                </div>
                            </div>

                            <div className="weapon-desc">{weapon.description}</div>

                            {isUnlocked && currentStats && (
                                <div className="weapon-stats">
                                    <div className="stat-row">
                                        <span className="stat-label">伤害:</span>
                                        <span className="stat-value">{Math.floor(currentStats.damage)}</span>
                                        {nextStats && (
                                            <span className="stat-next">⮕ {Math.floor(nextStats.damage)}</span>
                                        )}
                                    </div>
                                    <div className="stat-row">
                                        <span className="stat-label">射速:</span>
                                        <span className="stat-value">{currentStats.fireRate.toFixed(1)}/s</span>
                                        {nextStats && (
                                            <span className="stat-next">⮕ {nextStats.fireRate.toFixed(1)}/s</span>
                                        )}
                                    </div>
                                    <div className="stat-row">
                                        <span className="stat-label">弹耗:</span>
                                        <span className="stat-value">{weapon.ammoPerShot > 0 ? `${weapon.ammoPerShot} 弹药` : `${weapon.energyPerShot} 能量`}</span>
                                    </div>
                                </div>
                            )}

                            <div className="weapon-action">
                                {!isUnlocked && unlockCost && (
                                    <button
                                        className={`unlock-btn ${canUnlock ? '' : 'disabled'}`}
                                        onClick={() => canUnlock && unlockWeapon(weapon.type)}
                                        disabled={!canUnlock}
                                    >
                                        🔓 解锁
                                        <div className="cost-info">
                                            {unlockCost.scrap > 0 && <span>🔩{unlockCost.scrap} </span>}
                                            {unlockCost.parts > 0 && <span>⚙️{unlockCost.parts} </span>}
                                            {unlockCost.electronics > 0 && <span>📱{unlockCost.electronics}</span>}
                                        </div>
                                    </button>
                                )}
                                {isUnlocked && !isMaxLevel && upgradeCost && (
                                    <button
                                        className={`upgrade-btn ${canUpgrade ? '' : 'disabled'}`}
                                        onClick={() => canUpgrade && upgradeWeapon(weapon.type)}
                                        disabled={!canUpgrade}
                                    >
                                        ⬆️ 升级
                                        <div className="cost-info">
                                            {upgradeCost.scrap > 0 && <span>🔩{upgradeCost.scrap} </span>}
                                            {upgradeCost.parts > 0 && <span>⚙️{upgradeCost.parts} </span>}
                                            {upgradeCost.electronics > 0 && <span>📱{upgradeCost.electronics}</span>}
                                        </div>
                                    </button>
                                )}
                                {isMaxLevel && <div className="max-level-badge">✅ 已满级</div>}
                            </div>
                        </div>
                    )
                })}
            </div>

            <style>{`
        .weapon-panel {
          height: 100%;
          overflow-y: auto;
          padding: 10px;
        }
        
        .weapon-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .weapon-card {
          background: rgba(30, 30, 40, 0.9);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 12px;
          transition: all 0.2s;
        }
        
        .weapon-card.unlocked {
          border-color: #4CAF50;
          background: rgba(30, 40, 30, 0.9);
        }
        
        .weapon-card.locked {
          opacity: 0.8;
          filter: grayscale(0.5);
        }
        
        .weapon-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        
        .weapon-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .weapon-title {
          flex: 1;
        }
        
        .weapon-name {
          font-weight: bold;
          font-size: 16px;
          color: #fff;
        }
        
        .weapon-level {
          font-size: 12px;
          color: #aaa;
        }
        
        .weapon-desc {
          font-size: 12px;
          color: #ccc;
          margin-bottom: 10px;
          line-height: 1.4;
        }
        
        .weapon-stats {
          background: rgba(0,0,0,0.2);
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 10px;
          font-size: 12px;
        }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        
        .stat-label {
          color: #888;
        }
        
        .stat-value {
          color: #fff;
          font-weight: bold;
        }
        
        .stat-next {
          color: #4CAF50;
          margin-left: 5px;
        }
        
        .weapon-action {
          display: flex;
          justify-content: flex-end;
        }
        
        .unlock-btn, .upgrade-btn {
          background: #2196F3;
          border: none;
          border-radius: 4px;
          color: white;
          padding: 6px 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
        }
        
        .upgrade-btn {
          background: #4CAF50;
        }
        
        .unlock-btn.disabled, .upgrade-btn.disabled {
          background: #555;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .cost-info {
          font-size: 10px;
          margin-top: 2px;
          opacity: 0.9;
        }
        
        .max-level-badge {
          background: #FFD700;
          color: #000;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
        }
      `}</style>
        </div>
    )
}
