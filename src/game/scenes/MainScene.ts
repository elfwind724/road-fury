/**
 * 主游戏场景 - 纵版布局 + 武器弹幕系统
 */

import Phaser from 'phaser'
import { useGameStore, generateId } from '@/store'
import { GAME_HEIGHT, GAME_WIDTH } from '../config'
import { getAvailableZombies, selectZombieByWeight, ZOMBIE_CONFIGS } from '@/config/zombies'
import { getWeaponConfig, getWeaponStatsAtLevel, getFireInterval } from '@/config/weapons'
import { getWaveConfig } from '@/config/waves'
import { getAccessoryConfig } from '@/config/accessories'
import { SKILL_NODES } from '@/config/skillTree'
import { getBossConfig, getBossForWave } from '@/config/bosses'
import type { ZombieConfig, SurvivorState, BulletInstance } from '@/types'
import type { BossType } from '@/types/wave'

const LANE_POSITIONS = [80, 200, 320]
const BASE_ZOMBIE_SPAWN_INTERVAL = 800 // 更快的基础生成间隔
const ROAD_SCROLL_SPEED = 150 // 降低车速，让游戏更舒适
const SURVIVOR_SPAWN_CHANCE = 0.02
const BLOOD_MOON_INTERVAL = 7 // 每7波一次血月

interface ZombieSprite extends Phaser.Physics.Arcade.Sprite {
  zombieConfig: ZombieConfig
  zombieId: string
  currentHealth: number
  statusEffects: Array<{ type: string; remainingTime: number; value: number }>
  speedMultiplier: number
}

interface BulletSprite extends Phaser.Physics.Arcade.Sprite {
  bulletData: BulletInstance
}

interface BossSprite extends Phaser.Physics.Arcade.Sprite {
  bossConfig: import('@/types/wave').BossConfig
  bossId: string
  currentHealth: number
  maxHealth: number
  abilityCooldowns: Map<string, number>
  isEnraged: boolean
  speedMultiplier: number
}

export class MainScene extends Phaser.Scene {
  private vehicle!: Phaser.GameObjects.Sprite
  private zombies!: Phaser.Physics.Arcade.Group
  private bullets!: Phaser.Physics.Arcade.Group
  private roadTile!: Phaser.GameObjects.TileSprite
  private distanceText!: Phaser.GameObjects.Text
  private durabilityBar!: Phaser.GameObjects.Graphics
  private comboText!: Phaser.GameObjects.Text
  private waveText!: Phaser.GameObjects.Text
  private ammoText!: Phaser.GameObjects.Text

  private lastZombieSpawn = 0
  private targetLane = 1
  private isChangingLane = false
  private comboCount = 0
  private lastComboTime = 0
  private gameUpdateTimer = 0
  private weaponTimers: Map<string, number> = new Map()
  
  // Boss相关
  private currentBoss: BossSprite | null = null
  private bossHealthBar: Phaser.GameObjects.Graphics | null = null
  private bossNameText: Phaser.GameObjects.Text | null = null
  private zombieIdCounter = 0
  private lastBossAbilityTime = 0

  constructor() {
    super({ key: 'MainScene' })
  }

  create(): void {
    this.createRoad()
    this.createVehicle()
    this.zombies = this.physics.add.group()
    this.bullets = this.physics.add.group()
    this.createUI()
    this.createBulletTextures()

    this.physics.add.overlap(
      this.vehicle,
      this.zombies,
      this.handleCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.bullets,
      this.zombies,
      this.handleBulletHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )

    this.setupInput()
  }

  private createBulletTextures(): void {
    // 标准子弹
    const bulletGfx = this.make.graphics({ x: 0, y: 0 })
    bulletGfx.fillStyle(0xffff00)
    bulletGfx.fillCircle(4, 4, 4)
    bulletGfx.generateTexture('bullet_standard', 8, 8)
    
    // 穿甲弹
    bulletGfx.clear()
    bulletGfx.fillStyle(0x00ffff)
    bulletGfx.fillRect(0, 0, 6, 12)
    bulletGfx.generateTexture('bullet_piercing', 6, 12)
    
    // 爆炸弹
    bulletGfx.clear()
    bulletGfx.fillStyle(0xff6600)
    bulletGfx.fillCircle(6, 6, 6)
    bulletGfx.generateTexture('bullet_explosive', 12, 12)
    
    // 燃烧弹
    bulletGfx.clear()
    bulletGfx.fillStyle(0xff3300)
    bulletGfx.fillCircle(5, 5, 5)
    bulletGfx.generateTexture('bullet_incendiary', 10, 10)
    
    // 冷冻弹
    bulletGfx.clear()
    bulletGfx.fillStyle(0x66ccff)
    bulletGfx.fillCircle(5, 5, 5)
    bulletGfx.generateTexture('bullet_freezing', 10, 10)
    
    // 闪电
    bulletGfx.clear()
    bulletGfx.fillStyle(0xffff00)
    bulletGfx.fillRect(0, 0, 4, 16)
    bulletGfx.generateTexture('bullet_lightning', 4, 16)
    
    bulletGfx.destroy()
  }

  update(time: number, delta: number): void {
    const store = useGameStore.getState()
    if (!store.run?.isRunning) return

    this.scrollRoad(delta)
    this.updateDistance(delta)

    // 游戏系统更新
    this.gameUpdateTimer += delta
    if (this.gameUpdateTimer >= 1000) {
      store.gameUpdate(this.gameUpdateTimer)
      this.updateWeather(this.gameUpdateTimer)
      this.gameUpdateTimer = 0
    }

    // 波次系统检查
    this.checkWaveSystem(delta)

    // 丧尸生成 - 根据波次、血月和天气调整
    const isBloodMoon = this.isBloodMoonWave(store.run.wave.currentWave)
    const weather = store.run.weather.current
    let spawnInterval = BASE_ZOMBIE_SPAWN_INTERVAL
    
    if (store.run.wave.isActive) {
      spawnInterval = isBloodMoon ? 300 : 500 // 血月时更快
    }
    
    // 天气影响丧尸生成
    // 夜晚：丧尸减少20%（生成间隔增加）
    // 沙尘暴：丧尸减少30%
    if (weather === 'night') {
      spawnInterval *= 1.2
    } else if (weather === 'sandstorm') {
      spawnInterval *= 1.3
    }
    
    // 根据距离逐渐增加难度
    const distanceMultiplier = Math.max(0.5, 1 - store.run.distance / 5000)
    spawnInterval *= distanceMultiplier
    
    if (time - this.lastZombieSpawn > spawnInterval) {
      this.spawnZombie()
      // 血月期间有概率同时生成多只
      if (isBloodMoon && store.run.wave.isActive && Math.random() < 0.3) {
        this.spawnZombie()
      }
      this.lastZombieSpawn = time
    }

    // 武器系统更新
    this.updateWeapons(time, delta)
    this.updateBullets(delta)

    this.updateZombies(delta)
    this.updateVehiclePosition(delta)
    this.updateBoss(time, delta)
    this.updateUI()
    this.updateCombo(time)
  }

  private checkWaveSystem(delta: number): void {
    const store = useGameStore.getState()
    if (!store.run) return

    const { wave, distance } = store.run

    // 检查是否应该触发新波次
    // currentWave 已经是下一波的波次号（在completeWave中递增）
    if (!wave.isActive && !wave.isWarning) {
      const nextWave = wave.currentWave > 0 ? wave.currentWave : 1
      const waveConfig = getWaveConfig(nextWave)
      if (distance >= waveConfig.triggerDistance) {
        this.startWaveWarning(nextWave)
        // 开始波次
        store.startWave(nextWave)
        
        // 检查是否需要生成Boss
        const bossType = getBossForWave(nextWave)
        if (bossType && !this.currentBoss) {
          // 延迟生成Boss
          this.time.delayedCall(3000, () => {
            this.spawnBoss(bossType)
          })
        }
      }
    }

    // 更新波次时间
    if (wave.isActive) {
      store.updateWave(delta)
      this.updateActiveWave(delta)
    }
  }

  private isBloodMoonWave(waveNumber: number): boolean {
    return waveNumber > 0 && waveNumber % BLOOD_MOON_INTERVAL === 0
  }

  private startWaveWarning(waveNumber: number): void {
    const waveConfig = getWaveConfig(waveNumber)
    const isBloodMoon = this.isBloodMoonWave(waveNumber)
    
    if (isBloodMoon) {
      this.waveText.setText(`🌑 血月之夜! 第 ${waveNumber} 波!`)
      this.waveText.setColor('#ff0000')
      // 血月背景变红
      this.cameras.main.setBackgroundColor(0x330000)
    } else {
      this.waveText.setText(`⚠️ 第 ${waveNumber} 波来袭!`)
      this.waveText.setColor('#ff4444')
    }
    this.waveText.setAlpha(1)
    
    // 闪烁效果
    this.tweens.add({
      targets: this.waveText,
      alpha: { from: 1, to: 0.3 },
      duration: 300,
      yoyo: true,
      repeat: Math.floor(waveConfig.warningTime * 1000 / 600),
    })
  }

  // 波次警告逻辑由store处理，此方法保留用于未来扩展

  private updateActiveWave(_delta: number): void {
    const store = useGameStore.getState()
    if (!store.run?.wave.isActive) return
    
    const progress = Math.floor((1 - store.run.wave.timeRemaining / (getWaveConfig(store.run.wave.currentWave).duration * 1000)) * 100)
    this.waveText.setText(`🌊 第 ${store.run.wave.currentWave} 波 ${progress}%`)
  }

  private updateWeapons(time: number, _delta: number): void {
    const store = useGameStore.getState()
    if (!store.run) return

    // 获取武器升级等级
    const weaponUpgrades = store.run.weaponUpgrades || { machine_gun: 1 }

    // 默认车载武器 - 使用升级等级
    const defaultWeaponType = 'machine_gun'
    const defaultConfig = getWeaponConfig(defaultWeaponType)
    const machineGunLevel = weaponUpgrades.machine_gun || 1
    
    if (defaultConfig && machineGunLevel > 0) {
      const defaultStats = getWeaponStatsAtLevel(defaultConfig, machineGunLevel)
      const defaultFireInterval = getFireInterval(defaultStats.fireRate)
      const defaultLastFire = this.weaponTimers.get('default_weapon') || 0

      if (time - defaultLastFire >= defaultFireInterval) {
        const target = this.findNearestZombie(defaultConfig.range)
        if (target) {
          this.fireWeapon('default_weapon', defaultWeaponType, target, defaultStats.damage)
          this.weaponTimers.set('default_weapon', time)
        }
      }
    }

    // 检查其他已解锁的武器
    const unlockedWeapons = Object.entries(weaponUpgrades)
      .filter(([type, level]) => level > 0 && type !== 'machine_gun')
    
    for (const [weaponType, level] of unlockedWeapons) {
      const config = getWeaponConfig(weaponType)
      if (!config) continue

      const stats = getWeaponStatsAtLevel(config, level)
      const fireInterval = getFireInterval(stats.fireRate)
      const lastFire = this.weaponTimers.get(`weapon_${weaponType}`) || 0

      if (time - lastFire >= fireInterval) {
        const target = this.findNearestZombie(config.range)
        if (target) {
          this.fireWeapon(`weapon_${weaponType}`, weaponType, target, stats.damage)
          this.weaponTimers.set(`weapon_${weaponType}`, time)
        }
      }
    }

    // 额外炮台设施 - 提供额外火力
    const turrets = store.run.facilities.filter(f => f.type === 'turret' && f.isActive)
    
    for (const turret of turrets) {
      const weaponType = 'machine_gun'
      const config = getWeaponConfig(weaponType)
      if (!config) continue

      // 炮台等级 + 武器升级等级
      const totalLevel = turret.level + machineGunLevel
      const stats = getWeaponStatsAtLevel(config, totalLevel)
      const fireInterval = getFireInterval(stats.fireRate)
      const lastFire = this.weaponTimers.get(turret.id) || 0

      if (time - lastFire >= fireInterval) {
        const target = this.findNearestZombie(config.range)
        if (target) {
          this.fireWeapon(turret.id, weaponType, target, stats.damage)
          this.weaponTimers.set(turret.id, time)
        }
      }
    }
  }

  private findNearestZombie(range: number): ZombieSprite | null {
    let nearest: ZombieSprite | null = null
    let nearestDist = Infinity
    const vehiclePos = { x: this.vehicle.x, y: this.vehicle.y }

    this.zombies.getChildren().forEach((z) => {
      const zombie = z as ZombieSprite
      const dx = zombie.x - vehiclePos.x
      const dy = zombie.y - vehiclePos.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < range && dist < nearestDist) {
        nearest = zombie
        nearestDist = dist
      }
    })

    return nearest
  }

  private fireWeapon(_facilityId: string, weaponType: string, target: ZombieSprite, damage: number): void {
    const config = getWeaponConfig(weaponType)
    if (!config) return

    const bulletTexture = `bullet_${config.bulletType}`
    const bullet = this.bullets.create(this.vehicle.x, this.vehicle.y - 40, bulletTexture) as BulletSprite
    
    // 计算方向
    const dx = target.x - bullet.x
    const dy = target.y - bullet.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const dirX = dx / dist
    const dirY = dy / dist

    bullet.setVelocity(dirX * config.bulletSpeed, dirY * config.bulletSpeed)
    bullet.bulletData = {
      id: `bullet_${Date.now()}_${Math.random()}`,
      type: config.bulletType,
      weaponType: config.type,
      position: { x: bullet.x, y: bullet.y },
      velocity: { x: dirX * config.bulletSpeed, y: dirY * config.bulletSpeed },
      damage,
      effect: config.specialEffect,
      pierceCount: config.specialEffect?.type === 'pierce' ? (config.specialEffect.maxTargets || 1) : 0,
      lifetime: 3000,
      hitTargets: [],
    }

    // 枪口闪光
    this.showMuzzleFlash(this.vehicle.x, this.vehicle.y - 40)
  }

  private showMuzzleFlash(x: number, y: number): void {
    const flash = this.add.circle(x, y, 8, 0xffff00, 1)
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 100,
      onComplete: () => flash.destroy(),
    })
  }

  private updateBullets(delta: number): void {
    this.bullets.getChildren().forEach((b) => {
      const bullet = b as BulletSprite
      bullet.bulletData.lifetime -= delta
      
      // 超出屏幕或生命周期结束
      if (bullet.y < -50 || bullet.y > GAME_HEIGHT + 50 || 
          bullet.x < -50 || bullet.x > GAME_WIDTH + 50 ||
          bullet.bulletData.lifetime <= 0) {
        bullet.destroy()
      }
    })
  }

  private handleBulletHit(bulletObj: Phaser.GameObjects.GameObject, zombieObj: Phaser.GameObjects.GameObject): void {
    const bullet = bulletObj as BulletSprite
    const zombie = zombieObj as ZombieSprite
    
    if (!bullet.bulletData || bullet.bulletData.hitTargets.includes(zombie.zombieId)) return

    // 记录命中
    bullet.bulletData.hitTargets.push(zombie.zombieId)

    // 应用伤害
    zombie.currentHealth -= bullet.bulletData.damage
    this.showFloatingText(zombie.x, zombie.y, `-${Math.floor(bullet.bulletData.damage)}`, '#ffff00')

    // 应用特效
    if (bullet.bulletData.effect) {
      this.applyBulletEffect(zombie, bullet.bulletData.effect)
    }

    // 检查击杀
    if (zombie.currentHealth <= 0) {
      this.killZombie(zombie, zombie.zombieConfig)
    }

    // 处理穿透
    if (bullet.bulletData.pierceCount > 0) {
      bullet.bulletData.pierceCount--
      bullet.bulletData.damage *= 0.8 // 穿透伤害衰减
    } else if (bullet.bulletData.effect?.type !== 'pierce') {
      // 爆炸效果
      if (bullet.bulletData.effect?.type === 'explode') {
        this.createExplosion(bullet.x, bullet.y, bullet.bulletData.effect.radius || 80, bullet.bulletData.damage * 0.5)
      }
      bullet.destroy()
    }
  }

  private applyBulletEffect(zombie: ZombieSprite, effect: { type: string; duration?: number; value: number }): void {
    switch (effect.type) {
      case 'slow':
        zombie.speedMultiplier = effect.value
        zombie.setTint(0x66ccff) // 冷冻效果
        this.time.delayedCall(effect.duration || 2000, () => {
          if (zombie.active) {
            zombie.speedMultiplier = 1
            zombie.clearTint()
          }
        })
        break
      case 'burn':
        zombie.setTint(0xff6600)
        const burnDamage = effect.value || 5
        const burnTicks = Math.floor((effect.duration || 3000) / 500)
        for (let i = 0; i < burnTicks; i++) {
          this.time.delayedCall(500 * (i + 1), () => {
            if (zombie.active && zombie.currentHealth > 0) {
              zombie.currentHealth -= burnDamage
              this.showFloatingText(zombie.x, zombie.y, `🔥${burnDamage}`, '#ff6600')
              if (zombie.currentHealth <= 0) {
                this.killZombie(zombie, zombie.zombieConfig)
              }
            }
          })
        }
        break
    }
  }

  private createExplosion(x: number, y: number, radius: number, damage: number): void {
    // 爆炸视觉效果
    const explosion = this.add.circle(x, y, 10, 0xff6600, 0.8)
    this.tweens.add({
      targets: explosion,
      scale: radius / 10,
      alpha: 0,
      duration: 300,
      onComplete: () => explosion.destroy(),
    })

    // 对范围内丧尸造成伤害
    this.zombies.getChildren().forEach((z) => {
      const zombie = z as ZombieSprite
      const dx = zombie.x - x
      const dy = zombie.y - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= radius) {
        zombie.currentHealth -= damage
        this.showFloatingText(zombie.x, zombie.y, `-${Math.floor(damage)}`, '#ff6600')
        if (zombie.currentHealth <= 0) {
          this.killZombie(zombie, zombie.zombieConfig)
        }
      }
    })

    this.cameras.main.shake(100, 0.01)
  }

  private createRoad(): void {
    this.roadTile = this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'road')
  }

  private createVehicle(): void {
    this.vehicle = this.add.sprite(LANE_POSITIONS[1], GAME_HEIGHT - 120, 'vehicle')
    this.physics.add.existing(this.vehicle)
  }

  private createUI(): void {
    this.distanceText = this.add.text(16, 16, '0 m', {
      font: 'bold 24px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    })

    this.durabilityBar = this.add.graphics()
    this.drawDurabilityBar(100)

    this.comboText = this.add.text(GAME_WIDTH / 2, 100, '', {
      font: 'bold 32px Arial',
      color: '#ff6600',
      stroke: '#000000',
      strokeThickness: 4,
    })
    this.comboText.setOrigin(0.5)
    this.comboText.setAlpha(0)

    // 波次提示
    this.waveText = this.add.text(GAME_WIDTH / 2, 140, '', {
      font: 'bold 20px Arial',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 3,
    })
    this.waveText.setOrigin(0.5)
    this.waveText.setAlpha(0)

    // 弹药显示
    this.ammoText = this.add.text(GAME_WIDTH - 16, 16, '🔫 0', {
      font: 'bold 18px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    })
    this.ammoText.setOrigin(1, 0)
  }

  private drawDurabilityBar(percent: number): void {
    this.durabilityBar.clear()
    const barWidth = GAME_WIDTH - 32
    const barHeight = 12
    const x = 16
    const y = 50

    this.durabilityBar.fillStyle(0x333333, 0.8)
    this.durabilityBar.fillRoundedRect(x, y, barWidth, barHeight, 6)

    const fillWidth = (barWidth - 4) * (percent / 100)
    const color = percent > 50 ? 0x44ff44 : percent > 25 ? 0xffaa00 : 0xff4444
    this.durabilityBar.fillStyle(color, 1)
    this.durabilityBar.fillRoundedRect(x + 2, y + 2, fillWidth, barHeight - 4, 4)
  }

  private setupInput(): void {
    this.input.keyboard?.on('keydown-LEFT', () => this.changeLane('up'))
    this.input.keyboard?.on('keydown-RIGHT', () => this.changeLane('down'))
    this.input.keyboard?.on('keydown-A', () => this.changeLane('up'))
    this.input.keyboard?.on('keydown-D', () => this.changeLane('down'))

    let startX = 0
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      startX = pointer.x
    })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const diff = pointer.x - startX
      if (Math.abs(diff) > 30) {
        this.changeLane(diff < 0 ? 'up' : 'down')
      } else if (pointer.x < GAME_WIDTH / 2) {
        this.changeLane('up')
      } else {
        this.changeLane('down')
      }
    })
  }

  private changeLane(direction: 'up' | 'down'): void {
    if (this.isChangingLane) return
    const store = useGameStore.getState()
    store.changeLane(direction)
    const newLane = store.run?.vehicle.position.lane ?? 1
    this.targetLane = newLane
    this.isChangingLane = true
  }

  private scrollRoad(delta: number): void {
    this.roadTile.tilePositionY -= (ROAD_SCROLL_SPEED * delta) / 1000
  }

  private updateDistance(delta: number): void {
    const store = useGameStore.getState()
    const distanceDelta = (ROAD_SCROLL_SPEED * delta) / 1000 / 10
    store.updateDistance(distanceDelta)
  }

  private spawnZombie(): void {
    const store = useGameStore.getState()
    if (!store.run) return

    const distance = store.run.distance
    const availableZombies = getAvailableZombies(distance)
    if (availableZombies.length === 0) return

    const isBloodMoon = this.isBloodMoonWave(store.run.wave.currentWave)
    const config = selectZombieByWeight(availableZombies)
    const lane = Phaser.Math.Between(0, 2)

    const zombie = this.zombies.create(LANE_POSITIONS[lane], -30, 'zombie') as ZombieSprite
    zombie.zombieConfig = config
    zombie.zombieId = `zombie_${this.zombieIdCounter++}`
    zombie.currentHealth = config.health
    zombie.statusEffects = []
    zombie.speedMultiplier = 1

    // 根据丧尸类型调整大小和颜色
    if (config.type === 'fat') {
      zombie.setScale(1.5)
      zombie.setTint(0x8B4513)
    } else if (config.type === 'elite') {
      zombie.setScale(1.2)
      zombie.setTint(0x800080)
    }

    // 波次期间增加丧尸强度
    if (store.run.wave.isActive) {
      const waveBonus = 1 + store.run.wave.currentWave * 0.15
      zombie.currentHealth *= waveBonus
      
      // 血月期间丧尸更强更快
      if (isBloodMoon) {
        zombie.currentHealth *= 1.5
        zombie.speedMultiplier = 1.3
        zombie.setTint(0xff0000) // 血红色
        
        // 血月Boss - 每波生成一个大Boss
        if (!store.run.wave.bossSpawned && Math.random() < 0.1) {
          this.spawnBloodMoonBoss()
        }
      }
    }

    // 随机生成幸存者
    if (Math.random() < SURVIVOR_SPAWN_CHANCE) {
      this.spawnSurvivor()
    }
  }

  private spawnBloodMoonBoss(): void {
    const store = useGameStore.getState()
    if (!store.run) return

    const lane = 1 // Boss在中间车道
    const boss = this.zombies.create(LANE_POSITIONS[lane], -50, 'zombie') as ZombieSprite
    
    boss.zombieConfig = {
      type: 'boss',
      name: '血月巨兽',
      health: 500 + store.run.wave.currentWave * 100,
      speed: 80,
      damage: 30,
      damageModifier: 0.3,
      spawnWeight: 0,
      minDistance: 0,
      drops: [
        { type: 'scrap', min: 50, max: 100, chance: 1 },
        { type: 'parts', min: 20, max: 50, chance: 1 },
        { type: 'electronics', min: 10, max: 30, chance: 0.8 },
        { type: 'medicine', min: 10, max: 20, chance: 0.5 },
      ],
    }
    boss.zombieId = `boss_${this.zombieIdCounter++}`
    boss.currentHealth = boss.zombieConfig.health
    boss.statusEffects = []
    boss.speedMultiplier = 0.6 // Boss移动较慢
    boss.setScale(2.5)
    boss.setTint(0x8B0000) // 深红色

    // 标记Boss已生成
    store.run.wave.bossSpawned = true

    this.showFloatingText(boss.x, boss.y, '💀 血月巨兽出现!', '#ff0000')
  }

  private spawnSurvivor(): void {
    const lane = Phaser.Math.Between(0, 2)
    const survivor = this.add.text(LANE_POSITIONS[lane], -30, '🙋', { font: '32px Arial' })
    survivor.setOrigin(0.5)
    survivor.setData('isSurvivor', true)

    this.tweens.add({
      targets: survivor,
      y: GAME_HEIGHT + 50,
      duration: 4000,
      onUpdate: () => {
        // 检测与车辆碰撞
        if (Math.abs(survivor.x - this.vehicle.x) < 40 && Math.abs(survivor.y - this.vehicle.y) < 50) {
          this.rescueSurvivor(survivor)
        }
      },
      onComplete: () => survivor.destroy(),
    })
  }

  private rescueSurvivor(sprite: Phaser.GameObjects.Text): void {
    if (sprite.getData('rescued')) return
    sprite.setData('rescued', true)

    const store = useGameStore.getState()
    const skills = ['mechanic', 'chef', 'doctor', 'shooter', 'farmer', 'communicator', 'engineer', 'soldier'] as const
    const personalities = ['optimist', 'coward', 'glutton', 'loner', 'hardworker', 'frugal', 'leader'] as const
    const names = ['小明', '小红', '阿强', '小芳', '大壮', '小丽', '老王', '小张']

    // 随机1-2个性格
    const personalityCount = Math.random() > 0.5 ? 2 : 1
    const shuffledPersonalities = [...personalities].sort(() => Math.random() - 0.5)
    const selectedPersonalities = shuffledPersonalities.slice(0, personalityCount)

    const newSurvivor: SurvivorState = {
      id: generateId('survivor'),
      name: names[Math.floor(Math.random() * names.length)],
      skill: skills[Math.floor(Math.random() * skills.length)],
      skillLevel: 1 + Math.floor(Math.random() * 3),
      personality: selectedPersonalities,
      rarity: Math.random() > 0.9 ? 'epic' : Math.random() > 0.6 ? 'rare' : 'common',
      morale: 70 + Math.random() * 30,
      health: 80 + Math.random() * 20,
      hunger: 60 + Math.random() * 40,
      thirst: 60 + Math.random() * 40,
      stamina: 70 + Math.random() * 30,
      loyalty: 50 + Math.random() * 30,
      happiness: 60 + Math.random() * 30,
    }

    store.addSurvivor(newSurvivor)
    this.showFloatingText(sprite.x, sprite.y, `🎉 救援 ${newSurvivor.name}!`, '#00ff00')
    sprite.destroy()
  }

  private updateZombies(delta: number): void {
    const baseSpeed = ROAD_SCROLL_SPEED + 100
    this.zombies.getChildren().forEach((z) => {
      const zombie = z as ZombieSprite
      const speed = baseSpeed * (zombie.speedMultiplier || 1)
      zombie.y += (speed * delta) / 1000
      if (zombie.y > GAME_HEIGHT + 50) {
        zombie.destroy()
      }
    })
  }

  private updateVehiclePosition(delta: number): void {
    const targetX = LANE_POSITIONS[this.targetLane]
    const currentX = this.vehicle.x
    const diff = targetX - currentX

    if (Math.abs(diff) < 5) {
      this.vehicle.x = targetX
      this.isChangingLane = false
    } else {
      const moveSpeed = 600
      const move = Math.sign(diff) * Math.min(Math.abs(diff), (moveSpeed * delta) / 1000)
      this.vehicle.x += move
    }
  }

  private handleCollision(_vehicle: Phaser.GameObjects.GameObject, zombie: Phaser.GameObjects.GameObject): void {
    const store = useGameStore.getState()
    if (!store.run) return

    const zombieSprite = zombie as ZombieSprite
    const config = zombieSprite.zombieConfig || ZOMBIE_CONFIGS[0]

    // 计算配件加成
    const accessoryEffects = this.calculateAccessoryEffects()
    const skillEffects = this.calculateSkillEffects()

    // 计算伤害 = 基础碾压伤害 * (1 + 配件加成% + 技能加成%)
    const baseCrushDamage = store.run.vehicle.stats.crushDamage
    const crushBonus = (accessoryEffects.crushDamageBonus + skillEffects.crushDamageBonus) / 100
    const vehiclePower = baseCrushDamage * (1 + crushBonus)
    const damage = vehiclePower * config.damageModifier

    if (damage >= zombieSprite.currentHealth) {
      // 击杀成功
      this.killZombie(zombieSprite, config)
    } else {
      // 未击杀，车辆受伤
      const baseArmor = store.run.vehicle.stats.armor
      const armorBonus = accessoryEffects.armorBonus + skillEffects.armorBonus
      const totalArmor = baseArmor + armorBonus
      // 护甲减伤公式：伤害 = 基础伤害 * (100 / (100 + 护甲))
      // 这样护甲不会完全免疫伤害，但会显著减少
      const damageReduction = 100 / (100 + totalArmor)
      const vehicleDamage = Math.max(1, Math.floor(config.damage * damageReduction))
      store.takeDamage(vehicleDamage)
      this.showFloatingText(zombieSprite.x, zombieSprite.y, `-${vehicleDamage}`, '#ff4444')
      zombieSprite.destroy()
    }
  }

  // 计算配件效果
  private calculateAccessoryEffects(): {
    crushDamageBonus: number
    armorBonus: number
    speedBonus: number
    zombieDamage: number
  } {
    const store = useGameStore.getState()
    const equipped = store.meta.equippedAccessories || {}
    
    let crushDamageBonus = 0
    let armorBonus = 0
    let speedBonus = 0
    let zombieDamage = 0

    const accessoryIds = [equipped.front, equipped.side, equipped.tire].filter(Boolean)
    
    for (const id of accessoryIds) {
      const config = getAccessoryConfig(id as string)
      if (!config) continue

      for (const effect of config.effects) {
        switch (effect.type) {
          case 'crush_damage':
            crushDamageBonus += effect.value
            break
          case 'armor':
            armorBonus += effect.value
            break
          case 'speed':
            speedBonus += effect.value
            break
          case 'zombie_damage':
            zombieDamage += effect.value
            break
        }
      }
    }

    return { crushDamageBonus, armorBonus, speedBonus, zombieDamage }
  }

  // 计算技能树效果
  private calculateSkillEffects(): {
    crushDamageBonus: number
    armorBonus: number
    weaponDamageBonus: number
  } {
    const store = useGameStore.getState()
    const skillTree = store.meta.skillTree || {}
    
    let crushDamageBonus = 0
    let armorBonus = 0
    let weaponDamageBonus = 0

    // 遍历技能树计算效果
    for (const [skillId, level] of Object.entries(skillTree)) {
      if (level === 0) continue
      
      const skill = SKILL_NODES.find(s => s.id === skillId)
      if (!skill) continue

      for (const effect of skill.effects) {
        const value = effect.value * (level as number)
        switch (effect.type) {
          case 'crush_damage':
            crushDamageBonus += value
            break
          case 'armor':
            armorBonus += value
            break
          case 'weapon_damage':
            weaponDamageBonus += value
            break
        }
      }
    }

    return { crushDamageBonus, armorBonus, weaponDamageBonus }
  }

  private killZombie(zombie: ZombieSprite, config: ZombieConfig): void {
    const store = useGameStore.getState()

    // 屏幕震动
    this.cameras.main.shake(50, 0.005)

    // 增加连击
    this.comboCount++
    this.lastComboTime = this.time.now

    // 计算掉落
    const drops: Record<string, number> = {}
    config.drops.forEach((drop) => {
      if (Math.random() <= drop.chance) {
        const amount = Phaser.Math.Between(drop.min, drop.max)
        drops[drop.type] = (drops[drop.type] || 0) + amount
      }
    })

    // 添加资源
    store.addMultipleResources(drops)

    // 显示掉落
    let yOffset = 0
    for (const [type, amount] of Object.entries(drops)) {
      this.showFloatingText(zombie.x, zombie.y - yOffset, `+${amount} ${getResourceIcon(type)}`, '#ffff00')
      yOffset += 25
    }

    // 丧尸弹飞动画
    this.tweens.add({
      targets: zombie,
      y: zombie.y - 100,
      x: zombie.x + Phaser.Math.Between(-50, 50),
      angle: Phaser.Math.Between(-180, 180),
      alpha: 0,
      scale: 0.5,
      duration: 300,
      onComplete: () => zombie.destroy(),
    })
  }

  private showFloatingText(x: number, y: number, text: string, color: string): void {
    const floatText = this.add.text(x, y, text, {
      font: 'bold 18px Arial',
      color: color,
      stroke: '#000000',
      strokeThickness: 2,
    })
    floatText.setOrigin(0.5)

    this.tweens.add({
      targets: floatText,
      y: y - 60,
      alpha: 0,
      duration: 800,
      onComplete: () => floatText.destroy(),
    })
  }

  private updateCombo(time: number): void {
    if (this.comboCount > 1 && time - this.lastComboTime < 2000) {
      this.comboText.setText(`${this.comboCount}x COMBO!`)
      this.comboText.setAlpha(1)
    } else if (time - this.lastComboTime >= 2000) {
      this.comboCount = 0
      this.comboText.setAlpha(0)
    }
  }

  private updateUI(): void {
    const store = useGameStore.getState()
    if (!store.run) return

    this.distanceText.setText(`${Math.floor(store.run.distance)} m`)
    this.ammoText.setText(`🔫 ${Math.floor(store.run.resources.ammo)}`)

    const durabilityPercent = Math.floor(
      (store.run.vehicle.durability / store.run.vehicle.maxDurability) * 100
    )
    this.drawDurabilityBar(durabilityPercent)

    // 波次完成检查
    if (store.run.wave.isActive && store.run.wave.timeRemaining <= 0) {
      this.onWaveComplete()
    }

    // 检查游戏结束
    if (store.run.vehicle.durability <= 0) {
      store.endRun()
      this.scene.start('BootScene')
    }
  }

  // Boss战系统
  private spawnBoss(bossType: BossType): void {
    const config = getBossConfig(bossType)
    if (!config) return

    const store = useGameStore.getState()
    if (!store.run) return

    // 在屏幕上方中央生成Boss
    const boss = this.physics.add.sprite(GAME_WIDTH / 2, -100, 'zombie') as unknown as BossSprite
    boss.bossConfig = config
    boss.bossId = `boss_${Date.now()}`
    boss.currentHealth = config.health
    boss.maxHealth = config.health
    boss.abilityCooldowns = new Map()
    boss.isEnraged = false
    boss.speedMultiplier = config.speed

    // 设置Boss外观
    boss.setScale(config.size)
    boss.setTint(this.getBossTint(bossType))

    this.currentBoss = boss

    // 创建Boss血条
    this.createBossHealthBar(config.name)

    // Boss入场动画
    this.tweens.add({
      targets: boss,
      y: 150,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        this.showFloatingText(boss.x, boss.y - 50, `💀 ${config.name} 出现!`, '#ff0000')
      }
    })

    // 添加碰撞检测
    this.physics.add.overlap(
      this.vehicle,
      boss,
      this.handleBossCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.bullets,
      boss,
      this.handleBossBulletHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )
  }

  private getBossTint(bossType: BossType): number {
    const tints: Record<BossType, number> = {
      tank: 0x8B4513,      // 棕色
      spitter: 0x00FF00,   // 绿色
      screamer: 0xFF00FF,  // 紫色
      necromancer: 0x4B0082 // 靛蓝色
    }
    return tints[bossType] || 0xFF0000
  }

  private createBossHealthBar(bossName: string): void {
    // Boss名称
    this.bossNameText = this.add.text(GAME_WIDTH / 2, 70, bossName, {
      font: 'bold 16px Arial',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 3,
    })
    this.bossNameText.setOrigin(0.5)

    // Boss血条
    this.bossHealthBar = this.add.graphics()
    this.updateBossHealthBar()
  }

  private updateBossHealthBar(): void {
    if (!this.bossHealthBar || !this.currentBoss) return

    this.bossHealthBar.clear()
    const barWidth = 200
    const barHeight = 16
    const x = (GAME_WIDTH - barWidth) / 2
    const y = 90

    // 背景
    this.bossHealthBar.fillStyle(0x333333, 0.8)
    this.bossHealthBar.fillRoundedRect(x, y, barWidth, barHeight, 8)

    // 血量
    const healthPercent = this.currentBoss.currentHealth / this.currentBoss.maxHealth
    const fillWidth = (barWidth - 4) * healthPercent
    const color = healthPercent > 0.3 ? 0xff4444 : 0xff0000
    this.bossHealthBar.fillStyle(color, 1)
    this.bossHealthBar.fillRoundedRect(x + 2, y + 2, fillWidth, barHeight - 4, 6)

    // 狂暴状态指示
    if (this.currentBoss.isEnraged) {
      this.bossHealthBar.lineStyle(2, 0xffff00)
      this.bossHealthBar.strokeRoundedRect(x, y, barWidth, barHeight, 8)
    }
  }

  private updateBoss(time: number, delta: number): void {
    if (!this.currentBoss) return

    const boss = this.currentBoss

    // Boss移动 - 缓慢向下移动
    boss.y += (50 * boss.speedMultiplier * delta) / 1000

    // 检查狂暴状态
    if (!boss.isEnraged && boss.currentHealth / boss.maxHealth <= 0.3) {
      boss.isEnraged = true
      boss.speedMultiplier *= 1.5
      this.showFloatingText(boss.x, boss.y, '💢 狂暴!', '#ff0000')
      this.cameras.main.shake(200, 0.02)
    }

    // 执行Boss技能
    if (time - this.lastBossAbilityTime > 3000) {
      this.executeBossAbility(boss, time)
    }

    // 更新血条
    this.updateBossHealthBar()

    // Boss超出屏幕
    if (boss.y > GAME_HEIGHT + 100) {
      this.onBossEscape()
    }
  }

  private executeBossAbility(boss: BossSprite, time: number): void {
    const config = boss.bossConfig
    
    for (const ability of config.abilities) {
      const lastUse = boss.abilityCooldowns.get(ability.name) || 0
      if (time - lastUse < ability.cooldown) continue

      boss.abilityCooldowns.set(ability.name, time)
      this.lastBossAbilityTime = time

      switch (ability.effect) {
        case 'charge':
          this.bossCharge(boss, ability.value)
          break
        case 'acid_spit':
          this.bossAcidSpit(boss, ability.value, ability.radius || 60)
          break
        case 'summon':
          this.bossSummon(ability.summonCount || 3)
          break
        case 'aoe_damage':
          this.bossAoeDamage(boss, ability.value, ability.radius || 100)
          break
        case 'buff_zombies':
          this.bossBuffZombies(ability.value, ability.radius || 150)
          break
      }
      break // 每次只执行一个技能
    }
  }

  private bossCharge(boss: BossSprite, damage: number): void {
    this.showFloatingText(boss.x, boss.y - 30, '⚡ 冲锋!', '#ffff00')
    
    const targetY = this.vehicle.y - 50
    this.tweens.add({
      targets: boss,
      y: targetY,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        // 检查是否命中
        if (Math.abs(boss.x - this.vehicle.x) < 80) {
          const store = useGameStore.getState()
          store.takeDamage(damage)
          this.showFloatingText(this.vehicle.x, this.vehicle.y, `-${damage}`, '#ff0000')
          this.cameras.main.shake(200, 0.03)
        }
        // 返回原位
        this.tweens.add({
          targets: boss,
          y: 150,
          duration: 1000,
          ease: 'Power2'
        })
      }
    })
  }

  private bossAcidSpit(boss: BossSprite, damage: number, radius: number): void {
    this.showFloatingText(boss.x, boss.y - 30, '💚 酸液!', '#00ff00')
    
    // 创建酸液弹
    const acid = this.add.circle(boss.x, boss.y, 15, 0x00ff00, 0.8)
    
    this.tweens.add({
      targets: acid,
      x: this.vehicle.x,
      y: this.vehicle.y,
      duration: 800,
      onComplete: () => {
        // 酸液爆炸
        const explosion = this.add.circle(acid.x, acid.y, 10, 0x00ff00, 0.6)
        this.tweens.add({
          targets: explosion,
          scale: radius / 10,
          alpha: 0,
          duration: 500,
          onComplete: () => explosion.destroy()
        })
        
        // 检查是否命中
        const dx = acid.x - this.vehicle.x
        const dy = acid.y - this.vehicle.y
        if (Math.sqrt(dx * dx + dy * dy) < radius) {
          const store = useGameStore.getState()
          store.takeDamage(damage)
          this.showFloatingText(this.vehicle.x, this.vehicle.y, `-${damage}`, '#00ff00')
        }
        
        acid.destroy()
      }
    })
  }

  private bossSummon(count: number): void {
    this.showFloatingText(GAME_WIDTH / 2, 200, `👻 召唤 ${count} 只丧尸!`, '#ff00ff')
    
    for (let i = 0; i < count; i++) {
      this.time.delayedCall(i * 200, () => {
        this.spawnZombie()
      })
    }
  }

  private bossAoeDamage(boss: BossSprite, damage: number, radius: number): void {
    this.showFloatingText(boss.x, boss.y - 30, '💀 死亡光环!', '#4B0082')
    
    // 视觉效果
    const aoe = this.add.circle(boss.x, boss.y, 10, 0x4B0082, 0.5)
    this.tweens.add({
      targets: aoe,
      scale: radius / 10,
      alpha: 0,
      duration: 1000,
      onComplete: () => aoe.destroy()
    })
    
    // 检查玩家是否在范围内
    const dx = boss.x - this.vehicle.x
    const dy = boss.y - this.vehicle.y
    if (Math.sqrt(dx * dx + dy * dy) < radius) {
      const store = useGameStore.getState()
      store.takeDamage(damage)
      this.showFloatingText(this.vehicle.x, this.vehicle.y, `-${damage}`, '#4B0082')
    }
  }

  private bossBuffZombies(buffPercent: number, radius: number): void {
    this.showFloatingText(GAME_WIDTH / 2, 200, '🔥 狂暴嚎叫!', '#ff6600')
    
    // 增强范围内所有丧尸
    this.zombies.getChildren().forEach((z) => {
      const zombie = z as ZombieSprite
      if (!this.currentBoss) return
      
      const dx = zombie.x - this.currentBoss.x
      const dy = zombie.y - this.currentBoss.y
      if (Math.sqrt(dx * dx + dy * dy) < radius) {
        zombie.speedMultiplier *= (1 + buffPercent / 100)
        zombie.setTint(0xff6600)
      }
    })
  }

  private handleBossCollision(_vehicle: Phaser.GameObjects.GameObject, bossObj: Phaser.GameObjects.GameObject): void {
    const boss = bossObj as unknown as BossSprite
    const store = useGameStore.getState()
    if (!store.run) return

    // Boss碰撞造成大量伤害
    const damage = boss.bossConfig.damage
    store.takeDamage(damage)
    this.showFloatingText(this.vehicle.x, this.vehicle.y, `-${damage}`, '#ff0000')
    this.cameras.main.shake(150, 0.02)
  }

  private handleBossBulletHit(bulletObj: Phaser.GameObjects.GameObject, bossObj: Phaser.GameObjects.GameObject): void {
    const bullet = bulletObj as BulletSprite
    const boss = bossObj as unknown as BossSprite
    
    if (!bullet.bulletData) return

    // 应用伤害
    boss.currentHealth -= bullet.bulletData.damage
    this.showFloatingText(boss.x, boss.y, `-${Math.floor(bullet.bulletData.damage)}`, '#ffff00')

    // 检查击杀
    if (boss.currentHealth <= 0) {
      this.onBossDefeated(boss)
    }

    bullet.destroy()
  }

  private onBossDefeated(boss: BossSprite): void {
    const store = useGameStore.getState()
    if (!store.run) return

    const config = boss.bossConfig

    // 显示击杀信息
    this.showFloatingText(boss.x, boss.y, `🎉 击败 ${config.name}!`, '#00ff00')
    this.cameras.main.shake(300, 0.03)

    // 发放掉落
    const drops: Record<string, number> = {}
    config.drops.forEach((drop) => {
      if (Math.random() <= drop.chance) {
        const amount = Phaser.Math.Between(drop.min, drop.max)
        drops[drop.type] = (drops[drop.type] || 0) + amount
      }
    })
    store.addMultipleResources(drops)

    // 显示掉落
    let yOffset = 0
    for (const [type, amount] of Object.entries(drops)) {
      this.showFloatingText(boss.x, boss.y - yOffset - 30, `+${amount} ${getResourceIcon(type)}`, '#ffff00')
      yOffset += 25
    }

    // 添加末日点数
    store.addApocalypsePoints(config.apocalypsePoints)
    this.showFloatingText(boss.x, boss.y - yOffset - 30, `+${config.apocalypsePoints} 末日点数`, '#ff6600')

    // 清理Boss
    this.cleanupBoss()

    // Boss击杀动画
    this.tweens.add({
      targets: boss,
      scale: 0,
      angle: 720,
      alpha: 0,
      duration: 1000,
      onComplete: () => boss.destroy()
    })
  }

  private onBossEscape(): void {
    this.showFloatingText(GAME_WIDTH / 2, GAME_HEIGHT / 2, '💨 Boss逃跑了!', '#888888')
    this.cleanupBoss()
  }

  private cleanupBoss(): void {
    if (this.bossHealthBar) {
      this.bossHealthBar.destroy()
      this.bossHealthBar = null
    }
    if (this.bossNameText) {
      this.bossNameText.destroy()
      this.bossNameText = null
    }
    this.currentBoss = null
  }

  private onWaveComplete(): void {
    const store = useGameStore.getState()
    if (!store.run) return

    const waveNumber = store.run.wave.currentWave
    const waveConfig = getWaveConfig(waveNumber)
    const isBloodMoon = this.isBloodMoonWave(waveNumber)
    
    // 恢复正常背景色
    this.cameras.main.setBackgroundColor(0x000000)
    this.waveText.setColor('#ffffff')
    
    // 显示完成提示
    if (isBloodMoon) {
      this.waveText.setText(`🎉 血月之夜结束! 丰厚奖励!`)
    } else {
      this.waveText.setText(`✅ 第 ${waveNumber} 波完成!`)
    }
    this.waveText.setAlpha(1)
    this.tweens.add({
      targets: this.waveText,
      alpha: 0,
      delay: 2000,
      duration: 500,
    })

    // 发放奖励 - 血月奖励翻倍
    const rewardMultiplier = isBloodMoon ? 3 : 1
    
    for (const reward of waveConfig.rewards) {
      const amount = reward.amount * rewardMultiplier
      if (reward.type === 'resource' && reward.resourceType) {
        store.addResource(reward.resourceType as any, amount)
        this.showFloatingText(GAME_WIDTH / 2, 200, `+${amount} ${reward.resourceType}`, '#00ff00')
      } else if (reward.type === 'apocalypse_points') {
        store.addApocalypsePoints(amount)
      }
    }

    // 血月额外奖励
    if (isBloodMoon) {
      store.addResource('electronics', 20)
      store.addResource('medicine', 15)
      store.addResource('parts', 30)
      this.showFloatingText(GAME_WIDTH / 2, 230, '🌙 血月额外奖励!', '#ff6600')
    }

    // 完成当前波次并准备下一波
    store.completeWave()
    
    // 显示下一波预告
    const nextWave = waveNumber + 1
    setTimeout(() => {
      this.waveText.setText(`下一波: 第 ${nextWave} 波`)
      this.waveText.setAlpha(0.7)
      this.tweens.add({
        targets: this.waveText,
        alpha: 0,
        delay: 3000,
        duration: 500,
      })
    }, 2500)
  }

  private updateWeather(deltaMs: number): void {
    const store = useGameStore.getState()
    if (!store.run) return

    // 更新天气时间
    store.updateWeatherTime(deltaMs)

    // 检查是否需要切换天气
    if (store.run.weather.timeRemaining <= 0) {
      const currentWeather = store.run.weather.current
      const nextWeather = this.getNextWeather(currentWeather)
      store.changeWeather(nextWeather)
      this.onWeatherChange(nextWeather)
    }
  }

  private getNextWeather(current: string): 'sunny' | 'rainy' | 'night' | 'sandstorm' {
    // 天气转换概率
    const transitions: Record<string, { type: 'sunny' | 'rainy' | 'night' | 'sandstorm'; weight: number }[]> = {
      sunny: [
        { type: 'sunny', weight: 40 },
        { type: 'rainy', weight: 30 },
        { type: 'night', weight: 25 },
        { type: 'sandstorm', weight: 5 },
      ],
      rainy: [
        { type: 'sunny', weight: 50 },
        { type: 'rainy', weight: 20 },
        { type: 'night', weight: 25 },
        { type: 'sandstorm', weight: 5 },
      ],
      night: [
        { type: 'sunny', weight: 60 },
        { type: 'rainy', weight: 20 },
        { type: 'night', weight: 10 },
        { type: 'sandstorm', weight: 10 },
      ],
      sandstorm: [
        { type: 'sunny', weight: 60 },
        { type: 'rainy', weight: 20 },
        { type: 'night', weight: 15 },
        { type: 'sandstorm', weight: 5 },
      ],
    }

    const options = transitions[current] || transitions.sunny
    const totalWeight = options.reduce((sum, o) => sum + o.weight, 0)
    let random = Math.random() * totalWeight

    for (const option of options) {
      random -= option.weight
      if (random <= 0) {
        return option.type
      }
    }

    return 'sunny'
  }

  private onWeatherChange(weather: string): void {
    const weatherNames: Record<string, string> = {
      sunny: '☀️ 晴天',
      rainy: '🌧️ 雨天',
      night: '🌙 夜晚',
      sandstorm: '🌪️ 沙尘暴',
    }

    // 显示天气变化提示
    this.showFloatingText(GAME_WIDTH / 2, 80, `天气变化: ${weatherNames[weather] || weather}`, '#ffffff')

    // 应用天气视觉效果
    switch (weather) {
      case 'sunny':
        this.cameras.main.setBackgroundColor(0x87CEEB)
        break
      case 'rainy':
        this.cameras.main.setBackgroundColor(0x4a5568)
        break
      case 'night':
        this.cameras.main.setBackgroundColor(0x1a1a2e)
        break
      case 'sandstorm':
        this.cameras.main.setBackgroundColor(0xc4a35a)
        break
    }
  }
}

function getResourceIcon(type: string): string {
  const icons: Record<string, string> = {
    scrap: '🔩', parts: '⚙️', fabric: '🧵', food: '🍖',
    medicine: '💊', fuel: '⛽', electronics: '📱', ammo: '🔫', water: '💧',
  }
  return icons[type] || type
}
