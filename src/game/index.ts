/**
 * Phaser 游戏入口
 */

import Phaser from 'phaser'
import { gameConfig } from './config'

export function createGame(): Phaser.Game {
  return new Phaser.Game(gameConfig)
}

export { gameConfig }
export { MainScene } from './scenes/MainScene'
export { BootScene } from './scenes/BootScene'
