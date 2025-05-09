import React, { useState, useEffect } from 'react';
import { CommandType, CommandOption } from './types/commandTypes';
import { commandOptions } from './data/commandOptions';
import GiveCommand from './components/commands/GiveCommand';
import EffectCommand from './components/commands/EffectCommand';
import SummonCommand from './components/commands/SummonCommand';
import TeleportCommand from './components/commands/TeleportCommand';
import SetBlockCommand from './components/commands/SetBlockCommand';
import ParticleCommand from './components/commands/ParticleCommand';
import ExecuteCommand from './components/commands/ExecuteCommand';
import FillCommand from './components/commands/FillCommand';
import SkinCommand from './components/commands/SkinCommand';
import CommandOutput from './components/CommandOutput';
import CommandHistory from './components/CommandHistory';


interface CommandHistory {
  id: string;
  command: string;
  type: CommandType;
  timestamp: number;
}

const App: React.FC = () => {
  const [commandType, setCommandType] = useState<CommandType>('skin');
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [commandError, setCommandError] = useState<string | null>(null);

  // Initialize history from localStorage if available
  useEffect(() => {
    const savedHistory = localStorage.getItem('mcCommandHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse saved history:', e);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mcCommandHistory', JSON.stringify(history));
  }, [history]);

  const handleCommandChange = (newCommand: string) => {
    setCommand(newCommand);
    setCommandError(null);
  };

  const saveToHistory = () => {
    if (!command) {
      setCommandError('Cannot save empty command');
      return;
    }

    const historyItem: CommandHistory = {
      id: Math.random().toString(36).substr(2, 9),
      command,
      type: commandType,
      timestamp: Date.now()
    };

    setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
    setCommandError(null);
  };

  const selectFromHistory = (selectedCommand: string) => {
    setCommand(selectedCommand);
    setActiveTab('form');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const renderCommandForm = () => {
    switch (commandType) {
      case 'give':
        return <GiveCommand onCommandChange={handleCommandChange} />;
      case 'effect':
        return <EffectCommand onCommandChange={handleCommandChange} />;
      case 'summon':
        return <SummonCommand onCommandChange={handleCommandChange} />;
      case 'tp':
      case 'teleport':
        return <TeleportCommand onCommandChange={handleCommandChange} />;
      case 'setblock':
        return <SetBlockCommand onCommandChange={handleCommandChange} />;
      case 'particle':
        return <ParticleCommand onCommandChange={handleCommandChange} />;
      case 'execute':
        return <ExecuteCommand onCommandChange={handleCommandChange} />;
      case 'fill':
        return <FillCommand onCommandChange={handleCommandChange} />;
      case 'skin':
        return <SkinCommand onCommandChange={handleCommandChange} />;
      default:
        return <div>Select a command type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white font-sans">
      <header className="bg-stone-800 border-b border-stone-700 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-minecraft text-emerald-400 tracking-wider">
              Minecraft Command Generator
            </h1>
            <div className="text-sm text-stone-400">
              <span className="bg-stone-700 px-2 py-1 rounded">Forge 1.19.2</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 max-w-screen-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 space-y-6">
            <div className="bg-stone-800 rounded-lg border border-stone-700 p-4 shadow-lg">
              <h2 className="text-xl font-minecraft mb-4 text-stone-200">Command Type</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2">
                {commandOptions.map((option: CommandOption) => (
                  <button
                    key={option.value}
                    onClick={() => setCommandType(option.value)}
                    className={`text-left p-3 rounded border transition-colors ${
                      commandType === option.value
                        ? 'bg-emerald-900 border-emerald-700 text-emerald-100'
                        : 'bg-stone-700 border-stone-600 hover:bg-stone-600 text-stone-200'
                    }`}
                  >
                    <div className="font-medium">{option.name}</div>
                    <div className="text-xs opacity-80 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 bg-stone-800 rounded-lg border border-stone-700 p-4 shadow-lg">
            <div className="flex border-b border-stone-700 mb-4">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'form'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                onClick={() => setActiveTab('form')}
              >
                Command Builder
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'history'
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
            </div>

            {activeTab === 'form' ? (
              <div className="space-y-6">
                {renderCommandForm()}
                
                <CommandOutput 
                  command={command} 
                  onSave={saveToHistory} 
                />
                
                {commandError && (
                  <div className="bg-red-900/50 border border-red-700 text-red-200 p-2 rounded text-sm">
                    {commandError}
                  </div>
                )}
              </div>
            ) : (
              <CommandHistory 
                history={history} 
                onSelect={selectFromHistory} 
                onClear={clearHistory} 
              />
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 bg-stone-800 border-t border-stone-700 p-4 text-center text-stone-400 text-sm">
        <div className="container mx-auto">
          <p>Minecraft Command Generator for Forge 1.19.2</p>
          <p className="mt-1">
            This tool is not affiliated with Mojang Studios or Microsoft.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;