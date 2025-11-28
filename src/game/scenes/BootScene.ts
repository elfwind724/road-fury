/**
 * 启动场景 - 加载资源
 */

import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
    // 显示加载进度
    const width = this.cameras.main.width
    const height = this.cameras.main.height
    
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, '加载中...', {
      font: '20px Arial',
      color: '#ffffff',
    })
    loadingText.setOrigin(0.5, 0.5)
    
    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0x00ff00, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30)
    })
    
    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
    })
    
    // 创建占位符纹理
    this.createPlaceholderTextures()
  }

  create(): void {
    this.scene.start('MainScene')
  }

  private createPlaceholderTextures(): void {
    // 车辆占位符 - 纵版（车头朝上）
    const vehicleGraphics = this.make.graphics({ x: 0, y: 0 })
    vehicleGraphics.fillStyle(0x4a90d9)
    vehicleGraphics.fillRoundedRect(0, 0, 50, 80, 8)
    // 车窗
    vehicleGraphics.fillStyle(0x87ceeb)
    vehicleGraphics.fillRoundedRect(8, 8, 34, 20, 4)
    // 车轮
    vehicleGraphics.fillStyle(0x222222)
    vehicleGraphics.fillRect(2, 15, 8, 20)
    vehicleGraphics.fillRect(40, 15, 8, 20)
    vehicleGraphics.fillRect(2, 55, 8, 20)
    vehicleGraphics.fillRect(40, 55, 8, 20)
    vehicleGraphics.generateTexture('vehicle', 50, 80)
    vehicleGraphics.destroy()
    
    // 丧尸占位符
    const zombieGraphics = this.make.graphics({ x: 0, y: 0 })
    zombieGraphics.fillStyle(0x556b2f)
    zombieGraphics.fillCircle(18, 18, 18)
    // 眼睛
    zombieGraphics.fillStyle(0xff0000)
    zombieGraphics.fillCircle(12, 14, 4)
    zombieGraphics.fillCircle(24, 14, 4)
    zombieGraphics.generateTexture('zombie', 36, 36)
    zombieGraphics.destroy()
    
    // 纵版公路背景
    const roadGraphics = this.make.graphics({ x: 0, y: 0 })
    // 路面
    roadGraphics.fillStyle(0x3a3a3a)
    roadGraphics.fillRect(0, 0, 400, 700)
    // 路肩
    roadGraphics.fillStyle(0x2a2a2a)
    roadGraphics.fillRect(0, 0, 30, 700)
    roadGraphics.fillRect(370, 0, 30, 700)
    // 车道分隔线（虚线效果通过多段实现）
    roadGraphics.lineStyle(3, 0xffffff, 0.6)
    for (let y = 0; y < 700; y += 40) {
      roadGraphics.lineBetween(140, y, 140, y + 25)
      roadGraphics.lineBetween(260, y, 260, y + 25)
    }
    roadGraphics.generateTexture('road', 400, 700)
    roadGraphics.destroy()
  }
}
