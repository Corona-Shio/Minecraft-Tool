import React, { useState, useEffect } from 'react';
import { generateExecuteCommand } from '../../utils/commandGenerators';
import SelectorInput from '../SelectorInput';
import PositionInput from '../PositionInput';
import { Position } from '../../types/commandTypes';

interface ExecuteCommandProps {
  onCommandChange: (command: string) => void;
}

const ExecuteCommand: React.FC<ExecuteCommandProps> = ({ onCommandChange }) => {
  const [conditions, setConditions] = useState<string[]>(['as @p']);
  const [command, setCommand] = useState('say Hello');
  const [newCondition, setNewCondition] = useState('');
  const [conditionType, setConditionType] = useState('as');
  const [entitySelector, setEntitySelector] = useState('@p');
  const [position, setPosition] = useState<Position>({ x: '~', y: '~', z: '~' });
  const [blockPosition, setBlockPosition] = useState<Position>({ x: '~', y: '~', z: '~' });
  const [block, setBlock] = useState('minecraft:stone');
  const [scoreTarget, setScoreTarget] = useState('@p');
  const [scoreObjective, setScoreObjective] = useState('objective');
  const [scoreOperation, setScoreOperation] = useState('=');
  const [scoreValue, setScoreValue] = useState('1');

  useEffect(() => {
    const generatedCommand = generateExecuteCommand(conditions, command);
    onCommandChange(generatedCommand);
  }, [conditions, command, onCommandChange]);

  const handleAddCondition = () => {
    if (newCondition) {
      setConditions([...conditions, newCondition]);
      setNewCondition('');
      return;
    }

    let condition = '';
    
    switch (conditionType) {
      case 'as':
      case 'at':
        condition = `${conditionType} ${entitySelector}`;
        break;
      case 'positioned':
        condition = `positioned ${position.x} ${position.y} ${position.z}`;
        break;
      case 'if block':
      case 'unless block':
        condition = `${conditionType} ${blockPosition.x} ${blockPosition.y} ${blockPosition.z} ${block}`;
        break;
      case 'if score':
      case 'unless score':
        condition = `${conditionType} ${scoreTarget} ${scoreObjective} ${scoreOperation} ${scoreValue}`;
        break;
      default:
        condition = conditionType;
    }
    
    setConditions([...conditions, condition]);
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Conditions
        </label>
        <div className="bg-stone-800 p-3 rounded border border-stone-700">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center justify-between mb-2 p-2 bg-stone-700 rounded">
              <span className="text-white font-mono">{condition}</span>
              <button
                type="button"
                onClick={() => handleRemoveCondition(index)}
                className="ml-2 text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="space-y-3 mt-4">
            <select
              value={conditionType}
              onChange={(e) => setConditionType(e.target.value)}
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            >
              <option value="as">as (entity)</option>
              <option value="at">at (entity)</option>
              <option value="positioned">positioned (x y z)</option>
              <option value="if block">if block (x y z)</option>
              <option value="unless block">unless block (x y z)</option>
              <option value="if score">if score (entity objective)</option>
              <option value="unless score">unless score (entity objective)</option>
              <option value="custom">custom condition</option>
            </select>

            {conditionType === 'custom' ? (
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Enter custom condition"
                className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 font-mono"
              />
            ) : conditionType === 'as' || conditionType === 'at' ? (
              <SelectorInput value={entitySelector} onChange={setEntitySelector} />
            ) : conditionType === 'positioned' ? (
              <PositionInput position={position} onChange={setPosition} showLabel={false} />
            ) : (conditionType === 'if block' || conditionType === 'unless block') ? (
              <div className="space-y-3">
                <PositionInput position={blockPosition} onChange={setBlockPosition} label="Block Position" />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-300">Block ID</label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="minecraft:block_id"
                    className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (conditionType === 'if score' || conditionType === 'unless score') ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-300">Target</label>
                  <SelectorInput value={scoreTarget} onChange={setScoreTarget} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-300">Objective</label>
                  <input
                    type="text"
                    value={scoreObjective}
                    onChange={(e) => setScoreObjective(e.target.value)}
                    placeholder="Objective name"
                    className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-300">Operation</label>
                    <select
                      value={scoreOperation}
                      onChange={(e) => setScoreOperation(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
                    >
                      <option value="=">=</option>
                      <option value="<">&lt;</option>
                      <option value="<=">&lt;=</option>
                      <option value=">">&gt;</option>
                      <option value=">=">&gt;=</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-300">Value</label>
                    <input
                      type="text"
                      value={scoreValue}
                      onChange={(e) => setScoreValue(e.target.value)}
                      placeholder="Score/value"
                      className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleAddCondition}
              className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
            >
              Add Condition
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Command to Execute
        </label>
        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Command to run (without slash)"
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 font-mono text-sm h-20"
        />
      </div>
    </div>
  );
};

export default ExecuteCommand;