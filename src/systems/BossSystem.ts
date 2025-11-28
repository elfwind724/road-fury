/**
 * Boss系统
 * 负责Boss的AI行为、移动和技能释放
 */

import type {
    BossState,
    VehicleState,
    BossAbility,
} from '@/types'
import { getBossConfig } from '@/config/waves'

/**
 * 更新Boss行为
 */
export function updateBossBehavior(
    boss: BossState,
    target: VehicleState,
    deltaMs: number,
    _currentTime: number
): BossState {
    if (boss.health <= 0) return boss

    // 1. 更新位置 (简单的悬停/追踪逻辑)
    const newPosition = updateBossMovement(boss, target, deltaMs)

    // 2. 更新技能冷却
    const newCooldowns = new Map(boss.abilityCooldowns)
    for (const [ability, cooldown] of newCooldowns) {
        newCooldowns.set(ability, Math.max(0, cooldown - deltaMs))
    }

    // 3. 检查狂暴状态
    const isEnraged = boss.health <= boss.maxHealth * 0.3

    return {
        ...boss,
        position: newPosition,
        abilityCooldowns: newCooldowns,
        isEnraged,
    }
}

/**
 * 更新Boss移动
 */
function updateBossMovement(
    boss: BossState,
    _target: VehicleState,
    deltaMs: number
): { x: number; y: number } {
    const config = getBossConfig(boss.type)
    if (!config) return boss.position

    const speed = config.speed * (boss.isEnraged ? 1.5 : 1.0)
    const deltaSeconds = deltaMs / 1000

    // 目标位置：车辆上方一定距离
    const targetX = 200 // 屏幕水平中心
    const targetY = 150 // 屏幕上方区域

    // 简单的平滑移动

    // 增加一些随机摆动
    const time = Date.now() / 1000
    const hoverX = Math.sin(time) * 50
    const hoverY = Math.cos(time * 0.5) * 30

    const finalTargetX = targetX + hoverX
    const finalTargetY = targetY + hoverY

    const moveX = (finalTargetX - boss.position.x) * speed * deltaSeconds * 0.05
    const moveY = (finalTargetY - boss.position.y) * speed * deltaSeconds * 0.05

    return {
        x: boss.position.x + moveX,
        y: boss.position.y + moveY,
    }
}

/**
 * 选择Boss技能
 */
export function selectBossAbility(
    boss: BossState,
    _target: VehicleState
): string | null {
    const config = getBossConfig(boss.type)
    if (!config) return null

    // 优先使用高优先级技能
    // 这里简化为随机选择可用技能
    const availableAbilities = config.abilities.filter(ability => {
        const cooldown = boss.abilityCooldowns.get(ability.name) || 0
        return cooldown <= 0
    })

    if (availableAbilities.length === 0) return null

    // 随机选择一个
    const randomIndex = Math.floor(Math.random() * availableAbilities.length)
    return availableAbilities[randomIndex].name
}

/**
 * 获取技能配置
 */
export function getBossAbilityConfig(
    bossType: string,
    abilityName: string
): BossAbility | undefined {
    const config = getBossConfig(bossType)
    return config?.abilities.find(a => a.name === abilityName)
}
