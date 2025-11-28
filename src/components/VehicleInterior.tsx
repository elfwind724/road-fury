/**
 * 车内场景组件 - 温馨可拖拽的车内布局
 * 建造侧边栏融入车内视图
 */

import { useState, useCallback } from 'react'
import { useGameStore } from '@/store'
import { FACILITY_CONFIGS, getFacilityConfig } from '@/config/facilities'
import { WEAPON_CONFIGS } from '@/config/weapons'
import { ACCESSORY_CONFIGS, getAccessoryConfig } from '@/config/accessories'
import type { FacilityState, SurvivorState, ResourceState, WeaponUpgrades, VehicleUpgrades } from '@/types'

interface VehicleInteriorProps {
  onClose: () => void
}

type TabType = 'interior' | 'upgrade' | 'survivors' | 'storage'

// 设施在车内的位置
interface FacilityPosition {
  x: number
  y: number
  rotation: number
}

export function VehicleInterior({ onClose }: VehicleInteriorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('interior')
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<{ type: 'facility' | 'survivor'; id: string } | null>(null)
  const [facilityPositions, setFacilityPositions] = useState<Map<string, FacilityPosition>>(new Map())
  const [buildCategory, setBuildCategory] = useState('all')
  const [showBuildPanel, setShowBuildPanel] = useState(true)

  const run = useGameStore((state) => state.run)
  const installFacility = useGameStore((state) => state.installFacility)
  const removeFacility = useGameStore((state) => state.removeFacility)
  const upgradeFacility = useGameStore((state) => state.upgradeFacility)
  const assignSurvivorToFacility = useGameStore((state) => state.assignSurvivorToFacility)

  if (!run) return null

  const { vehicle, facilities, survivors, resources } = run

  // 拖拽中的设施ID（已安装的设施）
  const [draggingFacilityId, setDraggingFacilityId] = useState<string | null>(null)

  // 处理拖拽开始
  const handleDragStart = (type: 'facility' | 'survivor', id: string) => {
    setDraggedItem({ type, id })
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggedItem(null)
    setDraggingFacilityId(null)
  }

  // 处理已安装设施的拖拽开始
  const handleFacilityDragStart = (facilityId: string) => {
    setDraggingFacilityId(facilityId)
  }

  // 处理放置到车内
  const handleDropInVehicle = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // 如果是拖动已安装的设施
    if (draggingFacilityId) {
      const facility = facilities.find(f => f.id === draggingFacilityId)
      if (facility) {
        const newPositions = new Map(facilityPositions)
        const currentPos = newPositions.get(facility.slotId) || { x: 50, y: 50, rotation: 0 }
        newPositions.set(facility.slotId, { ...currentPos, x, y })
        setFacilityPositions(newPositions)
      }
      setDraggingFacilityId(null)
      return
    }

    if (!draggedItem) return

    if (draggedItem.type === 'facility') {
      // 安装新设施
      const slotId = `slot_${Date.now()}`
      if (installFacility(draggedItem.id as any, slotId)) {
        // 记录位置
        const newPositions = new Map(facilityPositions)
        newPositions.set(slotId, { x, y, rotation: 0 })
        setFacilityPositions(newPositions)
      }
    }
    setDraggedItem(null)
  }, [draggedItem, draggingFacilityId, installFacility, facilityPositions, facilities])

  // 处理幸存者拖放到设施上
  const handleDropOnFacility = useCallback((facilityId: string) => {
    if (draggedItem?.type === 'survivor') {
      assignSurvivorToFacility(draggedItem.id, facilityId)
      setDraggedItem(null)
    }
  }, [draggedItem, assignSurvivorToFacility])

  // 处理设施点击
  const handleFacilityClick = (facilityId: string) => {
    setSelectedFacility(selectedFacility === facilityId ? null : facilityId)
  }

  // 旋转设施
  const rotateFacility = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId)
    if (!facility) return
    
    const pos = facilityPositions.get(facility.slotId) || { x: 50, y: 50, rotation: 0 }
    const newPositions = new Map(facilityPositions)
    newPositions.set(facility.slotId, { ...pos, rotation: (pos.rotation + 90) % 360 })
    setFacilityPositions(newPositions)
  }

  return (
    <div className="vehicle-interior">
      <div className="interior-header">
        <h2>🚐 {getVehicleName(vehicle.type)} 内部</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="tabs">
        {[
          { id: 'interior', icon: '🏠', label: '车内' },
          { id: 'upgrade', icon: '⚙️', label: '改造' },
          { id: 'survivors', icon: '👥', label: `幸存者(${survivors.length})` },
          { id: 'storage', icon: '📦', label: '仓库' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as TabType)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="interior-content">
        {activeTab === 'interior' && (
          <InteriorWithBuildView
            facilities={facilities}
            survivors={survivors}
            resources={resources}
            facilityPositions={facilityPositions}
            selectedFacility={selectedFacility}
            draggedItem={draggedItem}
            draggingFacilityId={draggingFacilityId}
            buildCategory={buildCategory}
            showBuildPanel={showBuildPanel}
            onFacilityClick={handleFacilityClick}
            onDrop={handleDropInVehicle}
            onDropOnFacility={handleDropOnFacility}
            onRemove={removeFacility}
            onUpgrade={upgradeFacility}
            onRotate={rotateFacility}
            onAssignSurvivor={assignSurvivorToFacility}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onFacilityDragStart={handleFacilityDragStart}
            onCategoryChange={setBuildCategory}
            onToggleBuildPanel={() => setShowBuildPanel(!showBuildPanel)}
          />
        )}
        {activeTab === 'upgrade' && (
          <UpgradeView 
            resources={resources}
            weaponUpgrades={run.weaponUpgrades}
            vehicleUpgrades={run.vehicleUpgrades}
            vehicleType={vehicle.type}
          />
        )}
        {activeTab === 'survivors' && (
          <SurvivorsView
            survivors={survivors}
            facilities={facilities}
            onAssign={assignSurvivorToFacility}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        )}
        {activeTab === 'storage' && <StorageView resources={resources} />}
      </div>
      <style>{vehicleInteriorStyles}</style>
    </div>
  )
}


// 车内视图 + 建造侧边栏融合
function InteriorWithBuildView({
  facilities,
  survivors,
  resources,
  facilityPositions,
  selectedFacility,
  draggedItem,
  draggingFacilityId,
  buildCategory,
  showBuildPanel,
  onFacilityClick,
  onDrop,
  onDropOnFacility,
  onRemove,
  onUpgrade,
  onRotate,
  onAssignSurvivor,
  onDragStart,
  onDragEnd,
  onFacilityDragStart,
  onCategoryChange,
  onToggleBuildPanel,
}: {
  facilities: FacilityState[]
  survivors: SurvivorState[]
  resources: ResourceState
  facilityPositions: Map<string, FacilityPosition>
  selectedFacility: string | null
  draggedItem: { type: 'facility' | 'survivor'; id: string } | null
  draggingFacilityId: string | null
  buildCategory: string
  showBuildPanel: boolean
  onFacilityClick: (id: string) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onDropOnFacility: (facilityId: string) => void
  onRemove: (id: string) => void
  onUpgrade: (id: string) => void
  onRotate: (id: string) => void
  onAssignSurvivor: (survivorId: string, facilityId: string | undefined) => void
  onDragStart: (type: 'facility' | 'survivor', id: string) => void
  onDragEnd: () => void
  onFacilityDragStart: (facilityId: string) => void
  onCategoryChange: (cat: string) => void
  onToggleBuildPanel: () => void
}) {
  const selectedFac = facilities.find(f => f.id === selectedFacility)
  const selectedConfig = selectedFac ? getFacilityConfig(selectedFac.type) : null

  const categories = [
    { id: 'all', name: '全部', icon: '📋' },
    { id: 'survival', name: '生存', icon: '🍖' },
    { id: 'energy', name: '能源', icon: '⚡' },
    { id: 'defense', name: '防御', icon: '🛡️' },
    { id: 'utility', name: '功能', icon: '🔧' },
  ]

  const filteredFacilities = buildCategory === 'all' 
    ? FACILITY_CONFIGS 
    : FACILITY_CONFIGS.filter(f => f.category === buildCategory)

  return (
    <div className="interior-with-build">
      {/* 左侧建造面板 */}
      <div className={`build-sidebar ${showBuildPanel ? 'open' : 'closed'}`}>
        <div className="sidebar-toggle" onClick={onToggleBuildPanel}>
          {showBuildPanel ? '◀' : '▶'}
        </div>
        
        {showBuildPanel && (
          <>
            <div className="sidebar-header">🔧 建造</div>
            <div className="category-pills">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`pill ${buildCategory === cat.id ? 'active' : ''}`}
                  onClick={() => onCategoryChange(cat.id)}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
            <div className="build-list">
              {filteredFacilities.map(config => {
                const canAfford = Object.entries(config.baseCost).every(
                  ([key, value]) => resources[key as keyof ResourceState] >= (value || 0)
                )
                return (
                  <div
                    key={config.type}
                    className={`build-item ${canAfford ? 'available' : 'unavailable'}`}
                    draggable={canAfford}
                    onDragStart={() => canAfford && onDragStart('facility', config.type)}
                    onDragEnd={onDragEnd}
                  >
                    <span className="item-icon">{config.icon}</span>
                    <div className="item-info">
                      <div className="item-name">{config.name}</div>
                      <div className="item-cost">
                        {Object.entries(config.baseCost).slice(0, 2).map(([key, value]) => (
                          <span key={key} className={resources[key as keyof ResourceState] >= (value || 0) ? '' : 'red'}>
                            {getResourceIcon(key)}{value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* 右侧车内场景 */}
      <div className="interior-main">
        <div
          className={`vehicle-scene ${draggedItem ? 'drag-active' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {/* 车内背景装饰 */}
          <div className="vehicle-bg">
            <div className="window window-left">🌅</div>
            <div className="window window-right">🌄</div>
            <div className="floor-pattern" />
          </div>

          {/* 拖拽提示 */}
          {draggedItem && (
            <div className="drop-hint">
              <span>📍 拖到这里安装</span>
            </div>
          )}

          {/* 已安装的设施 - 可拖动 */}
          {facilities.map((facility) => {
            const config = getFacilityConfig(facility.type)
            if (!config) return null
            
            const pos = facilityPositions.get(facility.slotId) || { 
              x: 20 + (facilities.indexOf(facility) % 3) * 30, 
              y: 30 + Math.floor(facilities.indexOf(facility) / 3) * 25,
              rotation: 0 
            }
            const assignedSurvivor = survivors.find(s => s.assignedFacility === facility.id)
            const isDragging = draggingFacilityId === facility.id
            const canReceiveSurvivor = draggedItem?.type === 'survivor' && config.requiresSurvivor

            return (
              <div
                key={facility.id}
                className={`facility-item ${selectedFacility === facility.id ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${canReceiveSurvivor ? 'can-receive' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                  opacity: isDragging ? 0.5 : 1,
                }}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation()
                  onFacilityDragStart(facility.id)
                }}
                onDragEnd={onDragEnd}
                onDragOver={(e) => {
                  if (canReceiveSurvivor) {
                    e.preventDefault()
                    e.stopPropagation()
                  }
                }}
                onDrop={(e) => {
                  if (canReceiveSurvivor) {
                    e.preventDefault()
                    e.stopPropagation()
                    onDropOnFacility(facility.id)
                  }
                }}
                onClick={() => onFacilityClick(facility.id)}
              >
                <div className="facility-icon">{config.icon}</div>
                <div className="facility-level">Lv.{facility.level}</div>
                {assignedSurvivor && (
                  <div className="assigned-survivor-badge" title={`${assignedSurvivor.name} - ${getSkillName(assignedSurvivor.skill)}`}>
                    🧑
                    {config.survivorSkillBonus === assignedSurvivor.skill && <span className="skill-match">⭐</span>}
                  </div>
                )}
                {facility.isActive && <div className="active-indicator">✨</div>}
                {canReceiveSurvivor && <div className="drop-target-hint">拖这里</div>}
              </div>
            )
          })}

          {/* 空闲的幸存者 - 可拖拽到设施上 */}
          {survivors.filter(s => !s.assignedFacility).map((survivor, idx) => (
            <div
              key={survivor.id}
              className={`idle-survivor ${draggedItem?.id === survivor.id ? 'dragging' : ''}`}
              style={{
                left: `${10 + idx * 15}%`,
                bottom: '10%',
              }}
              title={`${survivor.name} - ${getSkillName(survivor.skill)} (拖到设施上分配)`}
              draggable
              onDragStart={() => onDragStart('survivor', survivor.id)}
              onDragEnd={onDragEnd}
            >
              <span className="survivor-emoji">🧑</span>
              <span className="survivor-name">{survivor.name}</span>
              <span className="survivor-skill-tag">{getSkillName(survivor.skill).slice(0, 2)}</span>
            </div>
          ))}

          {/* 提示文字 */}
          {facilities.length === 0 && !draggedItem && (
            <div className="empty-hint">
              <p>🏠 车内空空如也</p>
              <p>从左侧拖拽设施到这里安装</p>
            </div>
          )}
        </div>

        {/* 选中设施的操作面板 */}
        {selectedFac && selectedConfig && (
          <div className="facility-panel">
            <div className="panel-header">
              <span className="panel-icon">{selectedConfig.icon}</span>
              <span className="panel-name">{selectedConfig.name}</span>
              <span className="panel-level">Lv.{selectedFac.level}</span>
            </div>
            <p className="panel-desc">{selectedConfig.description}</p>
            
            {/* 分配幸存者 */}
            {selectedConfig.requiresSurvivor && (
              <div className="assign-section">
                <span>分配幸存者:</span>
                <select
                  value={survivors.find(s => s.assignedFacility === selectedFac.id)?.id || ''}
                  onChange={(e) => {
                    const currentAssigned = survivors.find(s => s.assignedFacility === selectedFac.id)
                    if (currentAssigned) {
                      onAssignSurvivor(currentAssigned.id, undefined)
                    }
                    if (e.target.value) {
                      onAssignSurvivor(e.target.value, selectedFac.id)
                    }
                  }}
                >
                  <option value="">无</option>
                  {survivors.filter(s => !s.assignedFacility || s.assignedFacility === selectedFac.id).map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({getSkillName(s.skill)})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="panel-actions">
              <button className="action-btn rotate" onClick={() => onRotate(selectedFac.id)}>🔄</button>
              {selectedFac.level < 3 && (
                <button className="action-btn upgrade" onClick={() => onUpgrade(selectedFac.id)}>⬆️ 升级</button>
              )}
              <button className="action-btn remove" onClick={() => onRemove(selectedFac.id)}>🗑️</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}




// 幸存者视图
function SurvivorsView({
  survivors,
  facilities,
  onAssign,
  onDragStart,
  onDragEnd,
}: {
  survivors: SurvivorState[]
  facilities: FacilityState[]
  onAssign: (survivorId: string, facilityId: string | undefined) => void
  onDragStart: (type: 'facility' | 'survivor', id: string) => void
  onDragEnd: () => void
}) {
  if (survivors.length === 0) {
    return (
      <div className="empty-survivors">
        <div className="empty-icon">👥</div>
        <p>还没有幸存者</p>
        <p className="hint">在公路上遇到幸存者时撞击救援</p>
      </div>
    )
  }

  return (
    <div className="survivors-view">
      {survivors.map(survivor => {
        const assignedFacility = facilities.find(f => f.id === survivor.assignedFacility)
        const facilityConfig = assignedFacility ? getFacilityConfig(assignedFacility.type) : null
        const rarityColors: Record<string, string> = {
          common: '#9e9e9e',
          rare: '#2196f3',
          epic: '#9c27b0',
          legendary: '#ff9800',
        }
        const rarity = (survivor as any).rarity || 'common'
        const skillLevel = (survivor as any).skillLevel || 1
        const stamina = (survivor as any).stamina || 100
        const loyalty = (survivor as any).loyalty || 50
        const happiness = (survivor as any).happiness || 50
        const personality = (survivor as any).personality || []

        return (
          <div
            key={survivor.id}
            className="survivor-card"
            style={{ borderColor: rarityColors[rarity] }}
            draggable
            onDragStart={() => onDragStart('survivor', survivor.id)}
            onDragEnd={onDragEnd}
          >
            <div className="survivor-header">
              <div className="survivor-avatar">
                <span className="avatar-emoji">🧑</span>
                <div className="survivor-mood" style={{ 
                  background: survivor.morale > 70 ? '#4CAF50' : survivor.morale > 40 ? '#FF9800' : '#f44336' 
                }} />
              </div>
              <div className="survivor-title">
                <div className="survivor-name">{survivor.name}</div>
                <div className="survivor-skill">{getSkillName(survivor.skill)} Lv.{skillLevel}</div>
                {personality.length > 0 && (
                  <div className="survivor-personality">
                    {personality.map((p: string) => (
                      <span key={p} className="personality-tag">{getPersonalityName(p)}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="survivor-rarity" style={{ color: rarityColors[rarity] }}>
                {getRarityName(rarity)}
              </div>
            </div>
            <div className="survivor-stats-grid">
              <div className="stat-row">
                <span title="健康">❤️{Math.floor(survivor.health)}</span>
                <span title="饱食">🍖{Math.floor(survivor.hunger)}</span>
                <span title="口渴">💧{Math.floor(survivor.thirst)}</span>
              </div>
              <div className="stat-row">
                <span title="体力">💪{Math.floor(stamina)}</span>
                <span title="忠诚">🤝{Math.floor(loyalty)}</span>
                <span title="幸福">😊{Math.floor(happiness)}</span>
              </div>
            </div>
            <div className="survivor-assignment">
              <span className="assignment-label">分配到:</span>
              <select
                value={survivor.assignedFacility || ''}
                onChange={(e) => {
                  // 先解除当前分配
                  if (survivor.assignedFacility) {
                    onAssign(survivor.id, undefined)
                  }
                  // 分配到新设施
                  if (e.target.value) {
                    onAssign(survivor.id, e.target.value)
                  }
                }}
                className="assignment-select"
              >
                <option value="">空闲</option>
                {facilities
                  .filter(f => {
                    const config = getFacilityConfig(f.type)
                    // 只显示需要幸存者的设施，或者当前已分配的设施
                    return config?.requiresSurvivor || f.id === survivor.assignedFacility
                  })
                  .map(f => {
                    const config = getFacilityConfig(f.type)
                    if (!config) return null
                    // 检查是否已有其他幸存者分配
                    const hasOtherAssigned = survivors.some(
                      s => s.id !== survivor.id && s.assignedFacility === f.id
                    )
                    // 检查技能是否匹配
                    const skillMatch = config.survivorSkillBonus === survivor.skill
                    return (
                      <option 
                        key={f.id} 
                        value={f.id}
                        disabled={hasOtherAssigned}
                      >
                        {config.icon} {config.name} {skillMatch ? '⭐' : ''} {hasOtherAssigned ? '(已占用)' : ''}
                      </option>
                    )
                  })}
              </select>
              {facilityConfig && (
                <div className="assignment-bonus">
                  {facilityConfig.survivorSkillBonus === survivor.skill ? (
                    <span className="skill-match">⭐ 技能匹配 +40%效率</span>
                  ) : (
                    <span className="skill-basic">+20%效率</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getRarityName(rarity: string): string {
  const names: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  }
  return names[rarity] || '普通'
}

function getPersonalityName(personality: string): string {
  const names: Record<string, string> = {
    optimist: '乐观',
    coward: '胆小',
    glutton: '贪吃',
    loner: '独行',
    hardworker: '勤劳',
    frugal: '节俭',
    leader: '领袖',
  }
  return names[personality] || personality
}

// 改造视图 - 武器升级和车辆改造
function UpgradeView({
  resources,
  weaponUpgrades,
  vehicleUpgrades,
  vehicleType,
}: {
  resources: ResourceState
  weaponUpgrades: WeaponUpgrades
  vehicleUpgrades: VehicleUpgrades
  vehicleType: string
}) {
  const [upgradeTab, setUpgradeTab] = useState<'weapon' | 'vehicle' | 'accessory'>('weapon')
  const upgradeWeapon = useGameStore((state) => state.upgradeWeapon)
  const unlockWeapon = useGameStore((state) => state.unlockWeapon)
  const upgradeVehicleStat = useGameStore((state) => state.upgradeVehicleStat)
  const evolveVehicle = useGameStore((state) => state.evolveVehicle)

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

  // 车辆进化成本
  const evolveCosts: Record<string, { scrap: number; parts: number; electronics: number }> = {
    van: { scrap: 500, parts: 200, electronics: 50 },
    truck: { scrap: 1000, parts: 400, electronics: 100 },
    bus: { scrap: 2000, parts: 800, electronics: 200 },
    fortress: { scrap: 4000, parts: 1500, electronics: 500 },
  }

  const vehicleOrder = ['tricycle', 'van', 'truck', 'bus', 'fortress']
  const currentVehicleIndex = vehicleOrder.indexOf(vehicleType)
  const nextVehicle = currentVehicleIndex < vehicleOrder.length - 1 ? vehicleOrder[currentVehicleIndex + 1] : null

  return (
    <div className="upgrade-view">
      <div className="upgrade-tabs">
        <button 
          className={`upgrade-tab ${upgradeTab === 'weapon' ? 'active' : ''}`}
          onClick={() => setUpgradeTab('weapon')}
        >
          🔫 武器
        </button>
        <button 
          className={`upgrade-tab ${upgradeTab === 'vehicle' ? 'active' : ''}`}
          onClick={() => setUpgradeTab('vehicle')}
        >
          🚗 改造
        </button>
        <button 
          className={`upgrade-tab ${upgradeTab === 'accessory' ? 'active' : ''}`}
          onClick={() => setUpgradeTab('accessory')}
        >
          🔧 配件
        </button>
      </div>

      {upgradeTab === 'weapon' && (
        <div className="weapon-upgrade-list">
          {WEAPON_CONFIGS.map(weapon => {
            const level = weaponUpgrades[weapon.type as keyof WeaponUpgrades] || 0
            const isUnlocked = level > 0
            const isMaxLevel = level >= 5
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

            return (
              <div key={weapon.type} className={`weapon-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className="weapon-icon">{weapon.icon}</div>
                <div className="weapon-info">
                  <div className="weapon-name">{weapon.name}</div>
                  <div className="weapon-desc">{weapon.description}</div>
                  {isUnlocked && (
                    <div className="weapon-level">
                      Lv.{level} / 5
                      <div className="level-bar">
                        <div className="level-fill" style={{ width: `${(level / 5) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="weapon-action">
                  {!isUnlocked && unlockCost && (
                    <button 
                      className={`unlock-btn ${canUnlock ? '' : 'disabled'}`}
                      onClick={() => canUnlock && unlockWeapon(weapon.type)}
                      disabled={!canUnlock}
                    >
                      🔓 解锁
                      <div className="cost-info">
                        🔩{unlockCost.scrap} ⚙️{unlockCost.parts} 📱{unlockCost.electronics}
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
                        🔩{upgradeCost.scrap} ⚙️{upgradeCost.parts} 📱{upgradeCost.electronics}
                      </div>
                    </button>
                  )}
                  {isMaxLevel && <span className="max-level">✅ 满级</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {upgradeTab === 'vehicle' && (
        <div className="vehicle-upgrade-section">
          {/* 车辆属性升级 - 按设计文档 */}
          <div className="stat-upgrades">
            <h3>🔧 属性强化</h3>
            {[
              { key: 'engine', name: '引擎', icon: '🔥', desc: '速度+5%/级', maxLevel: 10, baseCost: { scrap: 30, parts: 10 } },
              { key: 'armor', name: '装甲', icon: '🛡️', desc: '护甲+10/级', maxLevel: 10, baseCost: { scrap: 40, parts: 15 } },
              { key: 'tire', name: '轮胎', icon: '🛞', desc: '碾压伤害+3%/级', maxLevel: 10, baseCost: { scrap: 25, fabric: 10 } },
              { key: 'fuelTank', name: '油箱', icon: '⛽', desc: '能源上限+20/级', maxLevel: 5, baseCost: { scrap: 35, fuel: 5 } },
              { key: 'durability', name: '耐久', icon: '❤️', desc: '耐久+50/级', maxLevel: 10, baseCost: { scrap: 60, parts: 30 } },
            ].map(stat => {
              const level = vehicleUpgrades[stat.key as keyof VehicleUpgrades] || 0
              const isMaxLevel = level >= stat.maxLevel
              // 升级曲线：消耗 = 基础值 × (1.6 ^ 当前等级)
              const multiplier = Math.pow(1.6, level)
              const cost = {
                scrap: Math.floor((stat.baseCost.scrap || 0) * multiplier),
                parts: Math.floor((stat.baseCost.parts || 0) * multiplier),
                fabric: Math.floor((stat.baseCost.fabric || 0) * multiplier),
                fuel: Math.floor((stat.baseCost.fuel || 0) * multiplier),
              }
              const canUpgrade = !isMaxLevel && 
                resources.scrap >= cost.scrap && 
                (!cost.parts || resources.parts >= cost.parts) &&
                (!cost.fabric || resources.fabric >= cost.fabric) &&
                (!cost.fuel || resources.fuel >= cost.fuel)

              // 显示成本
              const costDisplay = []
              if (cost.scrap > 0) costDisplay.push(`🔩${cost.scrap}`)
              if (cost.parts > 0) costDisplay.push(`⚙️${cost.parts}`)
              if (cost.fabric > 0) costDisplay.push(`🧵${cost.fabric}`)
              if (cost.fuel > 0) costDisplay.push(`⛽${cost.fuel}`)

              return (
                <div key={stat.key} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <div className="stat-name">{stat.name}</div>
                    <div className="stat-desc">{stat.desc}</div>
                    <div className="stat-level">
                      Lv.{level} / {stat.maxLevel}
                      <div className="level-bar">
                        <div className="level-fill" style={{ width: `${(level / stat.maxLevel) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <button 
                    className={`stat-upgrade-btn ${canUpgrade ? '' : 'disabled'}`}
                    onClick={() => canUpgrade && upgradeVehicleStat(stat.key as 'engine' | 'armor' | 'tire' | 'fuelTank' | 'durability')}
                    disabled={!canUpgrade || isMaxLevel}
                  >
                    {isMaxLevel ? '✅' : `⬆️ ${costDisplay.join(' ')}`}
                  </button>
                </div>
              )
            })}
          </div>

          {/* 车辆进化 */}
          <div className="vehicle-evolution">
            <h3>🚀 车辆进化</h3>
            <div className="current-vehicle">
              <span className="vehicle-emoji">{getVehicleEmoji(vehicleType)}</span>
              <span className="vehicle-name">{getVehicleName(vehicleType)}</span>
            </div>
            {nextVehicle && (
              <div className="evolution-arrow">
                <span>⬇️</span>
                <div className="next-vehicle">
                  <span className="vehicle-emoji">{getVehicleEmoji(nextVehicle)}</span>
                  <span className="vehicle-name">{getVehicleName(nextVehicle)}</span>
                </div>
                {evolveCosts[nextVehicle] && (
                  <button 
                    className={`evolve-btn ${
                      resources.scrap >= evolveCosts[nextVehicle].scrap &&
                      resources.parts >= evolveCosts[nextVehicle].parts &&
                      resources.electronics >= evolveCosts[nextVehicle].electronics
                        ? '' : 'disabled'
                    }`}
                    onClick={() => evolveVehicle()}
                  >
                    🔄 进化
                    <div className="cost-info">
                      🔩{evolveCosts[nextVehicle].scrap} ⚙️{evolveCosts[nextVehicle].parts} 📱{evolveCosts[nextVehicle].electronics}
                    </div>
                  </button>
                )}
              </div>
            )}
            {!nextVehicle && (
              <div className="max-evolution">🏆 已达到最高级车辆!</div>
            )}
          </div>
        </div>
      )}

      {upgradeTab === 'accessory' && (
        <AccessoryView />
      )}
    </div>
  )
}

function getVehicleEmoji(type: string): string {
  const emojis: Record<string, string> = {
    tricycle: '🛵',
    van: '🚐',
    truck: '🚚',
    bus: '🚌',
    fortress: '🚛',
  }
  return emojis[type] || '🚗'
}

// 配件视图
function AccessoryView() {
  const meta = useGameStore((state) => state.meta)
  const equipAccessory = useGameStore((state) => state.equipAccessory)
  
  // 安全检查 - 兼容旧存档
  const unlockedAccessories = meta.unlockedAccessories || ['spike_ram', 'guardrail', 'standard_tire']
  const equippedAccessories = meta.equippedAccessories || { front: 'spike_ram', side: 'guardrail', tire: 'standard_tire' }
  
  const slots = [
    { id: 'front', name: '前部', icon: '🔱' },
    { id: 'side', name: '侧面', icon: '🛡️' },
    { id: 'tire', name: '轮胎', icon: '🛞' },
  ] as const

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: '#9e9e9e',
      rare: '#2196f3',
      epic: '#9c27b0',
      legendary: '#ff9800',
    }
    return colors[rarity] || '#9e9e9e'
  }

  return (
    <div className="accessory-view">
      <h3>🔧 车辆配件</h3>
      <div className="accessory-slots">
        {slots.map(slot => {
          const equippedId = equippedAccessories[slot.id]
          const equippedConfig = equippedId ? getAccessoryConfig(equippedId) : null
          const availableAccessories = ACCESSORY_CONFIGS.filter(
            acc => acc.slot === slot.id && unlockedAccessories.includes(acc.id)
          )

          return (
            <div key={slot.id} className="accessory-slot">
              <div className="slot-header">
                <span className="slot-icon">{slot.icon}</span>
                <span className="slot-name">{slot.name}</span>
              </div>
              <div className="equipped-accessory" style={{ borderColor: equippedConfig ? getRarityColor(equippedConfig.rarity) : '#444' }}>
                {equippedConfig ? (
                  <>
                    <span className="accessory-icon">{equippedConfig.icon}</span>
                    <span className="accessory-name">{equippedConfig.name}</span>
                  </>
                ) : (
                  <span className="empty-slot">空</span>
                )}
              </div>
              <div className="accessory-options">
                {availableAccessories.map(acc => (
                  <button
                    key={acc.id}
                    className={`accessory-option ${equippedId === acc.id ? 'equipped' : ''}`}
                    style={{ borderColor: getRarityColor(acc.rarity) }}
                    onClick={() => equipAccessory(slot.id, acc.id)}
                    title={acc.description}
                  >
                    <span className="option-icon">{acc.icon}</span>
                    <span className="option-name">{acc.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 仓库视图
function StorageView({ resources }: { resources: ResourceState }) {
  const getResourceCapacity = useGameStore((state) => state.getResourceCapacity)
  const maxCapacity = getResourceCapacity() // 动态计算容量（基础 + 仓库加成）
  const resourceList = [
    { key: 'scrap', name: '废铁', icon: '🔩', color: '#888' },
    { key: 'parts', name: '零件', icon: '⚙️', color: '#666' },
    { key: 'fabric', name: '布料', icon: '🧵', color: '#9c27b0' },
    { key: 'food', name: '食材', icon: '🍖', color: '#ff5722' },
    { key: 'water', name: '水', icon: '💧', color: '#2196f3' },
    { key: 'medicine', name: '药品', icon: '💊', color: '#4caf50' },
    { key: 'fuel', name: '燃料', icon: '⛽', color: '#ff9800' },
    { key: 'electronics', name: '电子', icon: '📱', color: '#00bcd4' },
    { key: 'ammo', name: '弹药', icon: '🔫', color: '#795548' },
    { key: 'energy', name: '电力', icon: '⚡', color: '#ffeb3b' },
  ]

  return (
    <div className="storage-view">
      <div className="storage-grid">
        {resourceList.map(res => {
          const value = resources[res.key as keyof ResourceState]
          const percent = Math.min(100, (value / maxCapacity) * 100)
          
          return (
            <div key={res.key} className="resource-card">
              <div className="resource-header">
                <span className="resource-icon">{res.icon}</span>
                <span className="resource-name">{res.name}</span>
              </div>
              <div className="resource-bar">
                <div 
                  className="resource-fill" 
                  style={{ width: `${percent}%`, background: res.color }}
                />
              </div>
              <div className="resource-value">{Math.floor(value)} / {maxCapacity}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 工具函数
function getVehicleName(type: string): string {
  const names: Record<string, string> = {
    tricycle: '三轮电动车',
    van: '小型面包车',
    truck: '中型货车',
    bus: '大型巴士',
    fortress: '改装卡车',
  }
  return names[type] || type
}

function getSkillName(skill: string): string {
  const names: Record<string, string> = {
    mechanic: '🔧机械师',
    chef: '👨‍🍳厨师',
    doctor: '🩺医生',
    shooter: '🎯射手',
    farmer: '🌾农夫',
    communicator: '📻通讯员',
  }
  return names[skill] || skill
}

function getResourceIcon(type: string): string {
  const icons: Record<string, string> = {
    scrap: '🔩', parts: '⚙️', fabric: '🧵', food: '🍖',
    medicine: '💊', fuel: '⛽', electronics: '📱', ammo: '🔫', water: '💧', energy: '⚡',
  }
  return icons[type] || ''
}


// 样式
const vehicleInteriorStyles = `
  .vehicle-interior {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%);
    z-index: 200;
    display: flex;
    flex-direction: column;
    color: white;
    font-family: 'Segoe UI', Arial, sans-serif;
  }

  .interior-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .interior-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
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
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: rgba(255,100,100,0.3);
  }

  .tabs {
    display: flex;
    background: rgba(0,0,0,0.2);
    padding: 8px;
    gap: 4px;
  }

  .tab {
    flex: 1;
    padding: 10px 8px;
    background: rgba(255,255,255,0.05);
    border: none;
    border-radius: 8px;
    color: rgba(255,255,255,0.6);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab.active {
    background: rgba(74, 144, 217, 0.3);
    color: white;
  }

  .interior-content {
    flex: 1;
    overflow: hidden;
  }

  /* 车内+建造融合视图 */
  .interior-with-build {
    height: 100%;
    display: flex;
  }

  /* 左侧建造侧边栏 */
  .build-sidebar {
    width: 140px;
    background: rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    position: relative;
    transition: width 0.3s;
  }

  .build-sidebar.closed {
    width: 30px;
  }

  .sidebar-toggle {
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 40px;
    background: rgba(74, 144, 217, 0.8);
    border-radius: 0 8px 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    font-size: 12px;
  }

  .sidebar-header {
    padding: 10px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .category-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    justify-content: center;
  }

  .pill {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.1);
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pill.active {
    background: #4a90d9;
  }

  .build-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .build-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    cursor: grab;
    transition: all 0.2s;
  }

  .build-item.available:hover {
    background: rgba(255,255,255,0.15);
    transform: scale(1.02);
  }

  .build-item.unavailable {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .build-item:active {
    cursor: grabbing;
  }

  .item-icon { font-size: 22px; }

  .item-info { flex: 1; min-width: 0; }

  .item-name {
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-cost {
    display: flex;
    gap: 4px;
    font-size: 10px;
    opacity: 0.8;
  }

  .item-cost .red { color: #ff6b6b; }

  /* 右侧车内主区域 */
  .interior-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 12px;
  }

  .vehicle-scene {
    flex: 1;
    min-height: 250px;
    background: linear-gradient(180deg, #4a3728 0%, #3d2d1f 100%);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    border: 3px solid #5d4037;
    transition: border-color 0.3s;
  }

  .vehicle-scene.drag-active {
    border-color: #4a90d9;
    box-shadow: 0 0 20px rgba(74, 144, 217, 0.3);
  }

  .drop-hint {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(74, 144, 217, 0.2);
    font-size: 16px;
    pointer-events: none;
    animation: pulse-hint 1s infinite;
  }

  @keyframes pulse-hint {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }

  .vehicle-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .window {
    position: absolute;
    top: 10px;
    width: 50px;
    height: 35px;
    background: linear-gradient(180deg, #87ceeb 0%, #ffd700 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    border: 2px solid #5d4037;
  }

  .window-left { left: 10px; }
  .window-right { right: 10px; }

  .floor-pattern {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: repeating-linear-gradient(
      90deg,
      #5d4037 0px,
      #5d4037 20px,
      #4e342e 20px,
      #4e342e 40px
    );
    opacity: 0.3;
  }

  .facility-item {
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: grab;
    transition: all 0.2s;
    border: 2px solid transparent;
  }

  .facility-item:hover {
    background: rgba(255,255,255,0.2);
    transform: translate(-50%, -50%) scale(1.05);
  }

  .facility-item:active {
    cursor: grabbing;
  }

  .facility-item.selected {
    border-color: #4a90d9;
    box-shadow: 0 0 20px rgba(74, 144, 217, 0.5);
  }

  .facility-item.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }

  .facility-item.can-receive {
    border-color: #4CAF50;
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
    animation: pulse-green 0.8s infinite;
  }

  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 15px rgba(76, 175, 80, 0.5); }
    50% { box-shadow: 0 0 25px rgba(76, 175, 80, 0.8); }
  }

  .drop-target-hint {
    position: absolute;
    bottom: -18px;
    font-size: 9px;
    color: #4CAF50;
    white-space: nowrap;
  }

  .facility-icon {
    font-size: 28px;
  }

  .facility-level {
    font-size: 9px;
    opacity: 0.7;
  }

  .assigned-survivor-badge {
    position: absolute;
    bottom: -8px;
    right: -8px;
    font-size: 16px;
    background: rgba(0,0,0,0.6);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .skill-match {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 10px;
  }

  .active-indicator {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 10px;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .idle-survivor {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: grab;
    transition: transform 0.2s;
  }

  .idle-survivor:hover {
    transform: scale(1.1);
  }

  .idle-survivor:active {
    cursor: grabbing;
  }

  .idle-survivor.dragging {
    opacity: 0.5;
  }

  .survivor-emoji {
    font-size: 24px;
    animation: idle-bounce 2s infinite;
  }

  @keyframes idle-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .survivor-name {
    font-size: 9px;
    background: rgba(0,0,0,0.5);
    padding: 2px 5px;
    border-radius: 4px;
    margin-top: 2px;
  }

  .survivor-skill-tag {
    font-size: 8px;
    background: #4a90d9;
    padding: 1px 4px;
    border-radius: 3px;
    margin-top: 2px;
  }

  .empty-hint {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    text-align: center;
    font-size: 14px;
  }

  .empty-hint p {
    margin: 4px 0;
  }

  .facility-panel {
    background: rgba(0,0,0,0.3);
    border-radius: 12px;
    padding: 10px;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .panel-icon { font-size: 22px; }
  .panel-name { font-weight: bold; font-size: 14px; }
  .panel-level { opacity: 0.7; font-size: 11px; }

  .panel-desc {
    font-size: 11px;
    opacity: 0.7;
    margin-bottom: 10px;
  }

  .assign-section {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 11px;
  }

  .assign-section select {
    flex: 1;
    padding: 5px;
    border-radius: 6px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    font-size: 11px;
  }

  .panel-actions {
    display: flex;
    gap: 6px;
  }

  .action-btn {
    flex: 1;
    padding: 6px;
    border: none;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn.rotate { background: rgba(255,255,255,0.1); color: white; flex: 0.5; }
  .action-btn.upgrade { background: #4a90d9; color: white; }
  .action-btn.remove { background: rgba(255,100,100,0.3); color: white; flex: 0.5; }

  /* 幸存者视图 */
  .survivors-view {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .empty-survivors {
    text-align: center;
    padding: 40px 20px;
    opacity: 0.6;
  }

  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-survivors .hint { font-size: 12px; margin-top: 8px; }

  .survivor-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    cursor: grab;
  }

  .survivor-avatar {
    position: relative;
  }

  .avatar-emoji { font-size: 36px; }

  .survivor-mood {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #1a1a2e;
  }

  .survivor-info { flex: 1; }

  .survivor-name { font-weight: bold; }

  .survivor-skill {
    font-size: 12px;
    opacity: 0.7;
  }

  .survivor-stats {
    display: flex;
    gap: 8px;
    font-size: 11px;
    margin-top: 4px;
  }

  .survivor-assignment {
    text-align: center;
  }

  .assigned-to {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 20px;
  }

  .assigned-to button {
    background: rgba(255,100,100,0.3);
    border: none;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
  }

  .unassigned {
    font-size: 12px;
    opacity: 0.5;
  }

  /* 仓库视图 */
  .storage-view {
    padding: 8px 0;
  }

  .storage-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .resource-card {
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 12px;
  }

  .resource-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .resource-icon { font-size: 20px; }
  .resource-name { font-size: 13px; }

  .resource-bar {
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .resource-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s;
  }

  .resource-value {
    font-size: 12px;
    text-align: right;
    margin-top: 4px;
    opacity: 0.7;
  }

  /* 改造视图 */
  .upgrade-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
  }

  .upgrade-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .upgrade-tab {
    flex: 1;
    padding: 10px;
    background: rgba(255,255,255,0.05);
    border: none;
    border-radius: 8px;
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .upgrade-tab.active {
    background: rgba(74, 144, 217, 0.3);
    color: white;
  }

  .weapon-upgrade-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .weapon-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    transition: all 0.2s;
  }

  .weapon-card.locked {
    opacity: 0.6;
  }

  .weapon-card.unlocked {
    border-left: 3px solid #4CAF50;
  }

  .weapon-icon {
    font-size: 28px;
    width: 40px;
    text-align: center;
  }

  .weapon-info {
    flex: 1;
    min-width: 0;
  }

  .weapon-name {
    font-weight: bold;
    font-size: 13px;
  }

  .weapon-desc {
    font-size: 10px;
    opacity: 0.6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .weapon-level {
    font-size: 10px;
    margin-top: 4px;
  }

  .level-bar {
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    margin-top: 2px;
    overflow: hidden;
  }

  .level-fill {
    height: 100%;
    background: #4CAF50;
    border-radius: 2px;
    transition: width 0.3s;
  }

  .weapon-action {
    text-align: center;
  }

  .unlock-btn, .upgrade-btn {
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .unlock-btn {
    background: #FF9800;
    color: white;
  }

  .upgrade-btn {
    background: #4a90d9;
    color: white;
  }

  .unlock-btn.disabled, .upgrade-btn.disabled {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
    cursor: not-allowed;
  }

  .cost-info {
    font-size: 9px;
    opacity: 0.8;
  }

  .max-level {
    color: #4CAF50;
    font-size: 12px;
  }

  /* 车辆改造 */
  .vehicle-upgrade-section {
    flex: 1;
    overflow-y: auto;
  }

  .stat-upgrades h3, .vehicle-evolution h3 {
    font-size: 14px;
    margin: 0 0 10px 0;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    margin-bottom: 8px;
  }

  .stat-icon {
    font-size: 24px;
    width: 36px;
    text-align: center;
  }

  .stat-info {
    flex: 1;
  }

  .stat-name {
    font-weight: bold;
    font-size: 13px;
  }

  .stat-desc {
    font-size: 10px;
    opacity: 0.6;
  }

  .stat-level {
    font-size: 10px;
    margin-top: 4px;
  }

  .stat-upgrade-btn {
    padding: 8px 12px;
    background: #4a90d9;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .stat-upgrade-btn.disabled {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
    cursor: not-allowed;
  }

  .vehicle-evolution {
    margin-top: 20px;
  }

  .current-vehicle, .next-vehicle {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
  }

  .vehicle-emoji {
    font-size: 32px;
  }

  .evolution-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
  }

  .evolve-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, #FF9800, #F44336);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
  }

  .evolve-btn.disabled {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
    cursor: not-allowed;
  }

  .max-evolution {
    text-align: center;
    padding: 20px;
    color: #FFD700;
    font-size: 14px;
  }

  /* 配件视图 */
  .accessory-view {
    padding: 16px;
    overflow-y: auto;
    height: 100%;
  }

  .accessory-view h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
  }

  .accessory-slots {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .accessory-slot {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 12px;
  }

  .slot-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-weight: bold;
  }

  .slot-icon {
    font-size: 20px;
  }

  .equipped-accessory {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: rgba(0,0,0,0.3);
    border-radius: 8px;
    border: 2px solid #444;
    margin-bottom: 8px;
  }

  .accessory-icon {
    font-size: 24px;
  }

  .empty-slot {
    color: rgba(255,255,255,0.4);
  }

  .accessory-options {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .accessory-option {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: rgba(255,255,255,0.1);
    border: 2px solid #666;
    border-radius: 6px;
    color: white;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .accessory-option:hover {
    background: rgba(255,255,255,0.2);
  }

  .accessory-option.equipped {
    background: rgba(74, 144, 217, 0.3);
  }

  .option-icon {
    font-size: 14px;
  }

  /* 幸存者视图 */
  .survivors-view {
    padding: 12px;
    overflow-y: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .survivor-card {
    background: rgba(255,255,255,0.05);
    border: 2px solid #444;
    border-radius: 12px;
    padding: 12px;
    transition: all 0.2s;
  }

  .survivor-header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
  }

  .survivor-avatar {
    position: relative;
    width: 40px;
    height: 40px;
  }

  .avatar-emoji {
    font-size: 32px;
  }

  .survivor-mood {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #1a1a2e;
  }

  .survivor-title {
    flex: 1;
  }

  .survivor-name {
    font-weight: bold;
    font-size: 14px;
  }

  .survivor-skill {
    font-size: 11px;
    color: #4a90d9;
    margin-top: 2px;
  }

  .survivor-personality {
    display: flex;
    gap: 4px;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .personality-tag {
    font-size: 9px;
    padding: 2px 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    color: #aaa;
  }

  .survivor-rarity {
    font-size: 10px;
    font-weight: bold;
  }

  .survivor-stats-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 10px;
  }

  .stat-row {
    display: flex;
    gap: 12px;
    font-size: 11px;
  }

  .stat-row span {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .survivor-assignment {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .assignment-label {
    font-size: 11px;
    color: #888;
  }

  .assignment-select {
    width: 100%;
    padding: 6px 10px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    color: white;
    font-size: 12px;
    cursor: pointer;
  }

  .assignment-select:focus {
    outline: none;
    border-color: #4a90d9;
  }

  .assignment-select option {
    background: #1a1a2e;
    color: white;
  }

  .assignment-select option:disabled {
    color: #666;
  }

  .assignment-bonus {
    font-size: 10px;
    text-align: right;
  }

  .skill-match {
    color: #ffd700;
  }

  .skill-basic {
    color: #4caf50;
  }

  .assigned-to {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    background: rgba(74, 144, 217, 0.2);
    padding: 4px 10px;
    border-radius: 6px;
  }

  .assigned-to button {
    background: none;
    border: none;
    color: #ff6666;
    cursor: pointer;
    font-size: 14px;
  }

  .unassigned {
    font-size: 11px;
    color: #888;
    padding: 4px 10px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
  }

  .empty-survivors {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: #888;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-survivors .hint {
    font-size: 12px;
    opacity: 0.6;
    margin-top: 8px;
  }
`
