import React from 'react';
import { Position } from '../types/commandTypes';

interface PositionInputProps {
  position: Position;
  onChange: (position: Position) => void;
  label?: string;
  showLabel?: boolean;
}

const PositionInput: React.FC<PositionInputProps> = ({
  position,
  onChange,
  label = 'Position',
  showLabel = true
}) => {
  const handleChange = (axis: 'x' | 'y' | 'z', value: string) => {
    onChange({
      ...position,
      [axis]: value
    });
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <label className="text-sm font-medium text-stone-300">
          {label}
        </label>
      )}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-stone-400">X</label>
          <input
            type="text"
            value={position.x}
            onChange={(e) => handleChange('x', e.target.value)}
            placeholder="X"
            className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-stone-400">Y</label>
          <input
            type="text"
            value={position.y}
            onChange={(e) => handleChange('y', e.target.value)}
            placeholder="Y"
            className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-stone-400">Z</label>
          <input
            type="text"
            value={position.z}
            onChange={(e) => handleChange('z', e.target.value)}
            placeholder="Z"
            className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PositionInput;