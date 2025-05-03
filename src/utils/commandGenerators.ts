import { CommandType, MinecraftSelector, Position, SelectorOptions } from '../types/commandTypes';

export function formatSelector(selector: MinecraftSelector, options?: SelectorOptions): string {
  if (!options || Object.keys(options).length === 0) {
    return selector;
  }

  const formattedOptions = Object.entries(options)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      if (key === 'scores' && typeof value === 'object') {
        const scores = Object.entries(value)
          .filter(([_, score]) => score !== undefined && score !== '')
          .map(([objective, score]) => `${objective}=${score}`)
          .join(',');
        return scores ? `scores={${scores}}` : '';
      }
      return `${key}=${value}`;
    })
    .filter(Boolean)
    .join(',');

  return formattedOptions ? `${selector}[${formattedOptions}]` : selector;
}

export function formatPosition(position: Position): string {
  return `${position.x} ${position.y} ${position.z}`;
}

export function generateGiveCommand(
  target: string,
  item: string,
  count: number,
  nbt?: string
): string {
  let command = `/give ${target} ${item}`;
  
  if (count > 1) {
    command += ` ${count}`;
  }
  
  if (nbt && nbt.trim() !== '') {
    command += ` ${nbt}`;
  }
  
  return command;
}

export function generateEffectCommand(
  action: 'give' | 'clear',
  target: string,
  effect?: string,
  duration?: number,
  amplifier?: number,
  hideParticles?: boolean
): string {
  if (action === 'clear') {
    return `/effect clear ${target}${effect ? ` ${effect}` : ''}`;
  }
  
  let command = `/effect give ${target} ${effect}`;
  
  if (duration !== undefined) {
    command += ` ${duration}`;
    
    if (amplifier !== undefined) {
      command += ` ${amplifier}`;
      
      if (hideParticles) {
        command += ' true';
      }
    }
  }
  
  return command;
}

export function generateSummonCommand(
  entity: string,
  position?: Position,
  nbt?: string
): string {
  let command = `/summon ${entity}`;
  
  if (position) {
    command += ` ${formatPosition(position)}`;
  }
  
  if (nbt && nbt.trim() !== '') {
    command += ` ${nbt}`;
  }
  
  return command;
}

export function generateTeleportCommand(
  target: string,
  destination: string | Position,
  facing?: 'entity' | 'position',
  facingTarget?: string | Position
): string {
  let command = `/tp ${target} `;
  
  if (typeof destination === 'string') {
    command += destination;
  } else {
    command += formatPosition(destination);
  }
  
  if (facing && facingTarget) {
    command += ` facing ${facing === 'entity' ? 'entity ' : ''}`;
    
    if (typeof facingTarget === 'string') {
      command += facingTarget;
    } else {
      command += formatPosition(facingTarget);
    }
  }
  
  return command;
}

export function generateSetBlockCommand(
  position: Position,
  block: string,
  state?: string,
  nbt?: string
): string {
  let command = `/setblock ${formatPosition(position)} ${block}`;
  
  if (state && state !== 'replace') {
    command += ` ${state}`;
  }
  
  if (nbt && nbt.trim() !== '') {
    command += ` ${nbt}`;
  }
  
  return command;
}

export function generateParticleCommand(
  particle: string,
  position: Position,
  delta?: Position,
  speed?: number,
  count?: number,
  mode?: 'normal' | 'force',
  viewers?: string
): string {
  let command = `/particle ${particle} ${formatPosition(position)}`;
  
  if (delta) {
    command += ` ${delta.x} ${delta.y} ${delta.z}`;
    
    if (speed !== undefined) {
      command += ` ${speed}`;
      
      if (count !== undefined) {
        command += ` ${count}`;
        
        if (mode) {
          command += ` ${mode}`;
          
          if (viewers) {
            command += ` ${viewers}`;
          }
        }
      }
    }
  }
  
  return command;
}

export function generateExecuteCommand(
  conditions: string[],
  run: string
): string {
  return `/execute ${conditions.join(' ')} run ${run}`;
}

export function generateFillCommand(
  from: Position,
  to: Position,
  block: string,
  mode?: string,
  filter?: string
): string {
  let command = `/fill ${formatPosition(from)} ${formatPosition(to)} ${block}`;
  
  if (mode && mode !== 'replace') {
    command += ` ${mode}`;
    
    if (filter && mode === 'replace') {
      command += ` ${filter}`;
    }
  }
  
  return command;
}

export function generateCommand(
  type: CommandType,
  params: Record<string, any>
): string {
  switch (type) {
    case 'give':
      return generateGiveCommand(
        params.target,
        params.item,
        params.count,
        params.nbt
      );
    case 'effect':
      return generateEffectCommand(
        params.action,
        params.target,
        params.effect,
        params.duration,
        params.amplifier,
        params.hideParticles
      );
    case 'summon':
      return generateSummonCommand(
        params.entity,
        params.position,
        params.nbt
      );
    case 'tp':
    case 'teleport':
      return generateTeleportCommand(
        params.target,
        params.destination,
        params.facing,
        params.facingTarget
      );
    case 'setblock':
      return generateSetBlockCommand(
        params.position,
        params.block,
        params.state,
        params.nbt
      );
    case 'particle':
      return generateParticleCommand(
        params.particle,
        params.position,
        params.delta,
        params.speed,
        params.count,
        params.mode,
        params.viewers
      );
    case 'execute':
      return generateExecuteCommand(
        params.conditions,
        params.run
      );
    case 'fill':
      return generateFillCommand(
        params.from,
        params.to,
        params.block,
        params.mode,
        params.filter
      );
    default:
      return '';
  }
}