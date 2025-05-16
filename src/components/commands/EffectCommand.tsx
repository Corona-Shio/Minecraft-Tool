import React, { useState, useEffect } from 'react';
import { generateEffectCommand } from '../../utils/commandGenerators';
import SelectorInput from '../SelectorInput';
import FilterSelect from '../FilterSelect'; // <--- FilterSelect をインポート
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

  useEffect(() => {
    if (action === 'clear') {
      // clear の場合は effect が指定されていなくてもコマンド発行可能（全エフェクトクリア）
      // ただし、UI上では何かしらのエフェクトが選択されている想定。
      // 特定のエフェクトのみクリアする場合を考慮し、effect を渡す。
      const command = generateEffectCommand('clear', target, effect || undefined); // effectが空文字ならundefined
      onCommandChange(command);
      return;
    }

    // 'give' アクションの場合、有効なエフェクトが選択されているか確認
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
    } else {
      onCommandChange(''); // 有効なエフェクトがない場合は空コマンド
    }
  }, [action, target, effect, duration, amplifier, hideParticles, onCommandChange]);

  return (
    <div className="space-y-4">
      {/* Action selection */}
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

      {/* Target selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Target
        </label>
        <SelectorInput value={target} onChange={setTarget} />
      </div>

      {/* Effect filter and dropdown using FilterSelect */}
      {/* 'clear' アクションで全てのエフェクトをクリアする場合はエフェクト選択は不要かもしれないが、
          特定のEffectをclearする機能も持つため、常に表示する */}
      <FilterSelect
        items={effectTypes}
        selectedItemId={effect}
        onItemSelected={setEffect}
        label="Effect"
        searchPlaceholder="Filter effects"
      />

      {/* Additional options for 'give' action */}
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
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
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
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setAmplifier(Math.max(0, Math.min(255, isNaN(val) ? 0 : val)));
              }}
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded border border-stone-600 transition-colors cursor-pointer">
            <input
              type="checkbox"
              id="hideParticlesEffect" // IDを他のコンポーネントと重複しないように変更
              checked={hideParticles}
              onChange={(e) => setHideParticles(e.target.checked)}
              className="form-checkbox text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="hideParticlesEffect" className="cursor-pointer select-none">
              Hide particles
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default EffectCommand;