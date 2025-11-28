/**
 * 本地排行榜系统
 * 存储在localStorage中的个人最佳记录
 */

export interface LeaderboardEntry {
  id: string
  playerName: string
  distance: number
  kills: number
  survivors: number
  vehicleType: string
  date: number
  duration: number  // 游戏时长（秒）
}

const LEADERBOARD_KEY = 'road_fury_leaderboard'
const MAX_ENTRIES = 20

// 获取排行榜
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY)
    if (!data) return []
    return JSON.parse(data) as LeaderboardEntry[]
  } catch {
    return []
  }
}

// 添加新记录
export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry {
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: Date.now()
  }
  
  const leaderboard = getLeaderboard()
  leaderboard.push(newEntry)
  
  // 按距离排序，保留前N条
  leaderboard.sort((a, b) => b.distance - a.distance)
  const trimmed = leaderboard.slice(0, MAX_ENTRIES)
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed))
  
  return newEntry
}

// 获取玩家排名
export function getPlayerRank(distance: number): number {
  const leaderboard = getLeaderboard()
  const rank = leaderboard.filter(e => e.distance > distance).length + 1
  return rank
}

// 获取最佳记录
export function getBestRecord(): LeaderboardEntry | null {
  const leaderboard = getLeaderboard()
  return leaderboard.length > 0 ? leaderboard[0] : null
}

// 检查是否是新纪录
export function isNewRecord(distance: number): boolean {
  const best = getBestRecord()
  return !best || distance > best.distance
}

// 获取统计数据
export function getStats(): {
  totalRuns: number
  bestDistance: number
  totalDistance: number
  totalKills: number
  averageDistance: number
} {
  const leaderboard = getLeaderboard()
  
  if (leaderboard.length === 0) {
    return {
      totalRuns: 0,
      bestDistance: 0,
      totalDistance: 0,
      totalKills: 0,
      averageDistance: 0
    }
  }
  
  const totalDistance = leaderboard.reduce((sum, e) => sum + e.distance, 0)
  const totalKills = leaderboard.reduce((sum, e) => sum + e.kills, 0)
  
  return {
    totalRuns: leaderboard.length,
    bestDistance: leaderboard[0].distance,
    totalDistance,
    totalKills,
    averageDistance: Math.round(totalDistance / leaderboard.length)
  }
}

// 清除排行榜
export function clearLeaderboard(): void {
  localStorage.removeItem(LEADERBOARD_KEY)
}

// 格式化日期
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化时长
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
