/**
 * Phaser 游戏配置
 */

import Phaser from 'phaser'
import { MainScene } from './scenes/MainScene'
import { BootScene } from './scenes/BootScene'

// 竖屏配置 - 适合手机
export const GAME_WIDTH = 400
export const GAME_HEIGHT = 700

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}
