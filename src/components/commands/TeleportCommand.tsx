import React, { useState, useEffect } from 'react';
import { generateTeleportCommand } from '../../utils/commandGenerators';
import SelectorInput from '../SelectorInput';
import PositionInput from '../PositionInput';
import { Position } from '../../types/commandTypes';

interface TeleportCommandProps {
  onCommandChange: (command: string) => void;
}

const TeleportCommand: React.FC<TeleportCommandProps> = ({ onCommandChange }) => {
  const [target, setTarget] = useState('@p');
  const [destinationType, setDestinationType] = useState<'entity' | 'position'>('position');
  const [destinationEntity, setDestinationEntity] = useState('@s');
  const [destinationPosition, setDestinationPosition] = useState<Position>({ x: '~', y: '~', z: '~' });
  const [hasFacing, setHasFacing] = useState(false);
  const [facingType, setFacingType] = useState<'entity' | 'position'>('position');
  const [facingEntity, setFacingEntity] = useState('@s');
  const [facingPosition, setFacingPosition] = useState<Position>({ x: '~', y: '~', z: '~' });

  useEffect(() => {
    let command: string;
    
    if (destinationType === 'entity') {
      if (hasFacing) {
        command = generateTeleportCommand(
          target,
          destinationEntity,
          facingType,
          facingType === 'entity' ? facingEntity : facingPosition
        );
      } else {
        command = generateTeleportCommand(target, destinationEntity);
      }
    } else {
      if (hasFacing) {
        command = generateTeleportCommand(
          target,
          destinationPosition,
          facingType,
          facingType === 'entity' ? facingEntity : facingPosition
        );
      } else {
        command = generateTeleportCommand(target, destinationPosition);
      }
    }
    
    onCommandChange(command);
  }, [
    target, 
    destinationType, 
    destinationEntity, 
    destinationPosition, 
    hasFacing, 
    facingType, 
    facingEntity, 
    facingPosition, 
    onCommandChange
  ]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Target
        </label>
        <SelectorInput value={target} onChange={setTarget} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Destination Type
        </label>
        <div className="flex gap-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              checked={destinationType === 'position'}
              onChange={() => setDestinationType('position')}
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-white">Position</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              checked={destinationType === 'entity'}
              onChange={() => setDestinationType('entity')}
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-white">Entity</span>
          </label>
        </div>
      </div>

      {destinationType === 'position' ? (
        <PositionInput 
          position={destinationPosition}
          onChange={setDestinationPosition}
          label="Destination Position"
        />
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-300">
            Destination Entity
          </label>
          <SelectorInput value={destinationEntity} onChange={setDestinationEntity} />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasFacing"
            checked={hasFacing}
            onChange={(e) => setHasFacing(e.target.checked)}
            className="form-checkbox text-emerald-500 focus:ring-emerald-500"
          />
          <label htmlFor="hasFacing" className="text-sm font-medium text-stone-300 cursor-pointer">
            Face specific direction
          </label>
        </div>
      </div>

      {hasFacing && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-300">
              Facing Type
            </label>
            <div className="flex gap-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={facingType === 'position'}
                  onChange={() => setFacingType('position')}
                  className="form-radio text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-white">Position</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={facingType === 'entity'}
                  onChange={() => setFacingType('entity')}
                  className="form-radio text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-white">Entity</span>
              </label>
            </div>
          </div>

          {facingType === 'position' ? (
            <PositionInput 
              position={facingPosition}
              onChange={setFacingPosition}
              label="Facing Position"
            />
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-300">
                Facing Entity
              </label>
              <SelectorInput value={facingEntity} onChange={setFacingEntity} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeleportCommand;