import React, { useState, useEffect } from 'react';
import { generateEffectCommand } from '../../utils/commandGenerators';
import SelectorInput from '../SelectorInput';
import { effectTypes } from '../../data/commandOptions';

interface EffectCommandProps {
  onCommandChange: (command: string) => void;
}

const EffectCommand: React.FC<EffectCommandProps> = ({ onCommandChange }) => {
  const [action, setAction] = useState<'give' | 'clear'>('give');
  const [target, setTarget] = useState('@p');
  const [effect, setEffect] = useState(effectTypes[0].id);
  const [duration, setDuration] = useState(1000000);
  const [amplifier, setAmplifier] = useState(0);
  const [hideParticles, setHideParticles] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEffects = effectTypes.filter(effect => {
    const searchLower = searchQuery.toLowerCase();
    return effect.name.toLowerCase().includes(searchLower) || 
           effect.id.toLowerCase().includes(searchLower);
  });

  useEffect(() => {
    if (action === 'clear') {
      const command = generateEffectCommand('clear', target, effect);
      onCommandChange(command);
      return;
    }

    if (effect) {
      const command = generateEffectCommand(
        'give', 
        target, 
        effect, 
        duration, 
        amplifier, 
        hideParticles
      );
      onCommandChange(command);
    }
  }, [action, target, effect, duration, amplifier, hideParticles, onCommandChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Action
        </label>
        <div className="flex gap-3">
          <label className="flex items-center space-x-2 cursor-pointer px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded border border-stone-600 transition-colors">
            <input
              type="radio"
              checked={action === 'give'}
              onChange={() => setAction('give')}
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span>Give Effect</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded border border-stone-600 transition-colors">
            <input
              type="radio"
              checked={action === 'clear'}
              onChange={() => setAction('clear')}
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span>Clear Effect</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Target
        </label>
        <SelectorInput value={target} onChange={setTarget} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Effect
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter"
              className="w-32 px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            />
            <select
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              className="flex-1 px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            >
              {filteredEffects.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.id.replace('minecraft:', '')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {action === 'give' && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-300">
              Duration (seconds)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-300">
              Amplifier (0 = level I)
            </label>
            <input
              type="number"
              min="0"
              max="255"
              value={amplifier}
              onChange={(e) => setAmplifier(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded border border-stone-600 transition-colors">
            <input
              type="checkbox"
              id="hideParticles"
              checked={hideParticles}
              onChange={(e) => setHideParticles(e.target.checked)}
              className="form-checkbox text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="hideParticles" className="cursor-pointer">
              Hide particles
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default EffectCommand;