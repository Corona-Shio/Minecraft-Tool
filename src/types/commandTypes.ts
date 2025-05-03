export type MinecraftSelector = '@p' | '@a' | '@r' | '@e' | '@s' | string;

export type SelectorOptions = {
  type?: string;
  name?: string;
  distance?: string;
  x?: number;
  y?: number;
  z?: number;
  scores?: Record<string, string>;
  tag?: string;
  team?: string;
  limit?: number;
  sort?: 'nearest' | 'furthest' | 'random' | 'arbitrary';
};

export type CommandType = 
  | 'give' 
  | 'effect' 
  | 'summon' 
  | 'tp' 
  | 'teleport' 
  | 'setblock' 
  | 'particle' 
  | 'execute' 
  | 'fill';

export interface CommandOption {
  name: string;
  value: CommandType;
  description: string;
  icon: string;
}

export interface CommandHistory {
  id: string;
  command: string;
  type: CommandType;
  timestamp: number;
}

export interface Position {
  x: string;
  y: string;
  z: string;
}