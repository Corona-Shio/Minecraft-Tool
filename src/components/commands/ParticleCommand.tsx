import React, { useState, useEffect } from 'react';
import { generateParticleCommand } from '../../utils/commandGenerators';
import PositionInput from '../PositionInput';
import SelectorInput from '../SelectorInput';
import { Position } from '../../types/commandTypes';
import { particleTypes } from '../../data/commandOptions';

interface ParticleCommandProps {
  onCommandChange: (command: string) => void;
}

const ParticleCommand: React.FC<ParticleCommandProps> = ({ onCommandChange }) => {
  const [particle, setParticle] = useState(particleTypes[0].id);
  const [position, setPosition] = useState<Position>({ x: '~', y: '~', z: '~' });
  const [delta, setDelta] = useState<Position>({ x: '0', y: '0', z: '0' });
  const [syncDelta, setSyncDelta] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<'normal' | 'force'>('normal');
  const [viewers, setViewers] = useState('@a');
  const [showViewers, setShowViewers] = useState(false);
  const [customParticle, setCustomParticle] = useState('');
  const [isCustomParticle, setIsCustomParticle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParticles = particleTypes.filter(particle => {
    const searchLower = searchQuery.toLowerCase();
    return particle.name.toLowerCase().includes(searchLower) || 
           particle.id.toLowerCase().includes(searchLower);
  });

  const handleDeltaChange = (axis: keyof Position, value: string) => {
    const minecraftValue = (parseFloat(value) || 0) / 8;
    if (syncDelta) {
      setDelta({ x: minecraftValue.toString(), y: minecraftValue.toString(), z: minecraftValue.toString() });
    } else {
      setDelta({ ...delta, [axis]: minecraftValue.toString() });
    }
  };

  const getBlockValue = (value: string) => {
    return (parseFloat(value) || 0) * 8;
  };

  useEffect(() => {
    const selectedParticle = isCustomParticle ? customParticle : particle;
    if (selectedParticle) {
      const command = generateParticleCommand(
        selectedParticle,
        position,
        delta,
        speed,
        count,
        mode,
        showViewers ? viewers : undefined
      );
      onCommandChange(command);
    }
  }, [
    particle, 
    customParticle, 
    isCustomParticle, 
    position, 
    delta, 
    speed, 
    count, 
    mode, 
    viewers, 
    showViewers, 
    onCommandChange
  ]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Particle Type
        </label>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            {isCustomParticle ? (
              <input
                type="text"
                value={customParticle}
                onChange={(e) => setCustomParticle(e.target.value)}
                placeholder="minecraft:particle_id"
                className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              />
            ) : (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter"
                  className="w-32 px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <select
                    value={particle}
                    onChange={(e) => setParticle(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 truncate min-h-[42px]"
                  >
                    {filteredParticles.map((p) => (
                      <option key={p.id} value={p.id} className="truncate">
                        {p.name} ({p.id.replace('minecraft:', '')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsCustomParticle(!isCustomParticle)}
            className="px-3 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded border border-stone-500 transition-colors whitespace-nowrap"
          >
            {isCustomParticle ? 'Common Particles' : 'Custom Particle'}
          </button>
        </div>
      </div>

      <PositionInput 
        position={position}
        onChange={setPosition}
        label="Position"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Delta (spread) <span className="text-xs text-stone-400">(ブロック単位)</span>
        </label>
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
          <div className="space-y-1">
            <label className="text-xs text-stone-400">X</label>
            <input
              type="number"
              value={getBlockValue(delta.x)}
              onChange={(e) => handleDeltaChange('x', e.target.value)}
              placeholder="X spread"
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              min="0"
              step="1"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-stone-400">Y</label>
            <input
              type="number"
              value={getBlockValue(delta.y)}
              onChange={(e) => handleDeltaChange('y', e.target.value)}
              placeholder="Y spread"
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              min="0"
              step="1"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-stone-400">Z</label>
            <input
              type="number"
              value={getBlockValue(delta.z)}
              onChange={(e) => handleDeltaChange('z', e.target.value)}
              placeholder="Z spread"
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              min="0"
              step="1"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setSyncDelta(!syncDelta)}
              className={`px-3 py-2 rounded border transition-colors whitespace-nowrap ${
                syncDelta 
                  ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500' 
                  : 'bg-stone-600 hover:bg-stone-500 border-stone-500'
              }`}
            >
              値の同期
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Speed
        </label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Count
        </label>
        <input
          type="number"
          min="0"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Mode
        </label>
        <div className="flex gap-3">
          <label className="flex items-center space-x-2 cursor-pointer px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded border border-stone-600 transition-colors">
            <input
              type="radio"
              checked={mode === 'normal'}
              onChange={() => setMode('normal')}
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span>Normal</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded border border-stone-600 transition-colors">
            <input
              type="radio"
              checked={mode === 'force'}
              onChange={() => setMode('force')}
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span>Force</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded border border-stone-600 transition-colors">
          <input
            type="checkbox"
            id="showViewers"
            checked={showViewers}
            onChange={(e) => setShowViewers(e.target.checked)}
            className="form-checkbox text-emerald-500 focus:ring-emerald-500"
          />
          <label htmlFor="showViewers" className="cursor-pointer">
            Specify viewers
          </label>
        </div>
      </div>

      {showViewers && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-300">
            Viewers
          </label>
          <SelectorInput value={viewers} onChange={setViewers} />
        </div>
      )}
    </div>
  );
};

export default ParticleCommand;