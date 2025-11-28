/**
 * 事件弹窗组件
 */

import type { GameEvent, EventChoice } from '@/types/event'
import type { ResourceState } from '@/types'

interface EventPopupProps {
  event: GameEvent
  resources: ResourceState
  survivors: number
  facilities: string[]
  onChoice: (choice: EventChoice) => void
}

export function EventPopup({ 
  event, 
  resources, 
  survivors, 
  facilities,
  onChoice 
}: EventPopupProps) {
  
  const isChoiceAvailable = (choice: EventChoice): boolean => {
    if (!choice.requirements) return true
    
    const req = choice.requirements
    
    if (req.resources) {
      for (const [key, value] of Object.entries(req.resources)) {
        if (resources[key as keyof ResourceState] < value) {
          return false
        }
      }
    }
    
    if (req.survivors && survivors < req.survivors) {
      return false
    }
    
    if (req.facility && !facilities.includes(req.facility)) {
      return false
    }
    
    return true
  }

  const getRequirementText = (choice: EventChoice): string | null => {
    if (!choice.requirements) return null
    
    const parts: string[] = []
    const req = choice.requirements
    
    if (req.resources) {
      for (const [key, value] of Object.entries(req.resources)) {
        parts.push(`${key}: ${value}`)
      }
    }
    
    if (req.survivors) {
      parts.push(`幸存者: ${req.survivors}`)
    }
    
    if (req.facility) {
      parts.push(`需要: ${req.facility}`)
    }
    
    return parts.length > 0 ? `需要: ${parts.join(', ')}` : null
  }

  const rarityColors: Record<string, string> = {
    common: '#9e9e9e',
    uncommon: '#4caf50',
    rare: '#2196f3',
    epic: '#9c27b0'
  }

  return (
    <div className="event-popup-overlay">
      <div className="event-popup">
        <div 
          className="event-header"
          style={{ borderColor: rarityColors[event.rarity] }}
        >
          <span className="event-icon">{event.icon}</span>
          <h2>{event.title}</h2>
        </div>
        
        <p className="event-description">{event.description}</p>
        
        <div className="event-choices">
          {event.choices.map(choice => {
            const available = isChoiceAvailable(choice)
            const reqText = getRequirementText(choice)
            
            return (
              <button
                key={choice.id}
                className={`event-choice ${available ? '' : 'disabled'}`}
                onClick={() => available && onChoice(choice)}
                disabled={!available}
              >
                <span className="choice-icon">{choice.icon}</span>
                <div className="choice-content">
                  <span className="choice-text">{choice.text}</span>
                  {reqText && (
                    <span className="choice-requirement">{reqText}</span>
                  )}
                  {choice.successChance && (
                    <span className="choice-chance">
                      成功率: {choice.successChance}%
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <style>{`
        .event-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .event-popup {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-radius: 16px;
          padding: 24px;
          max-width: 450px;
          width: 90%;
          color: white;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .event-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #444;
        }

        .event-icon {
          font-size: 36px;
        }

        .event-header h2 {
          margin: 0;
          font-size: 22px;
          color: #fff;
        }

        .event-description {
          color: #ccc;
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .event-choices {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .event-choice {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          color: white;
        }

        .event-choice:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateX(5px);
        }

        .event-choice.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .choice-icon {
          font-size: 24px;
          width: 36px;
          text-align: center;
        }

        .choice-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .choice-text {
          font-size: 15px;
          font-weight: 500;
        }

        .choice-requirement {
          font-size: 11px;
          color: #f44336;
        }

        .choice-chance {
          font-size: 11px;
          color: #ffc107;
        }
      `}</style>
    </div>
  )
}
