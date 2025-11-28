/**
 * 游戏容器组件 - React-Phaser 桥接
 */

import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '@/game/config'
import { HUD } from './HUD'
import { QuickActions } from './QuickActions'

interface GameContainerProps {
  onOpenInterior?: () => void
}

export function GameContainer({ onOpenInterior }: GameContainerProps) {
  const gameRef = useRef<Phaser.Game | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    // 创建 Phaser 游戏实例
    gameRef.current = new Phaser.Game({
      ...gameConfig,
      parent: containerRef.current,
    })

    gameRef.current.events.on('ready', () => {
      setIsReady(true)
    })

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div className="game-wrapper">
      <div ref={containerRef} id="game-container" />
      {isReady && (
        <>
          <HUD />
          <QuickActions onOpenInterior={onOpenInterior} />
        </>
      )}
      
      <style>{`
        .game-wrapper {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        #game-container {
          width: 100%;
          max-height: 100vh;
          aspect-ratio: 4 / 7;
        }
        
        #game-container canvas {
          display: block;
          width: 100% !important;
          height: auto !important;
          max-height: 100vh;
        }
        
        @media (max-width: 420px) {
          .game-wrapper {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
