import type { LastCommand, StepEvents, TutorialStep, ValidateContext, Validator } from '../types/tutorial';
import { canonicalize, resolvePath, samePath } from './paths';

export const EMPTY_EVENTS: StepEvents = { commands: [], listed: false };

export function recordCommand(events: StepEvents, cmd: LastCommand): StepEvents {
  const name = cmd.name.toLowerCase();
  const commands = name && !events.commands.includes(name) ? [...events.commands, name] : events.commands;
  return {
    commands,
    listed: events.listed || Boolean(cmd.listed),
  };
}

export function validateOne(v: Validator, ctx: ValidateContext): boolean {
  switch (v.type) {
    case 'filesystemExists': {
      const node = ctx.vfs.findByPath(v.path);
      if (!node) return false;
      if (v.entityType === 'directory') return node.type === 'folder';
      if (v.entityType === 'file') return node.type === 'file';
      return true;
    }
    case 'filesystemNotExists':
      return !ctx.vfs.findByPath(v.path);
    case 'currentDirectory':
      return samePath(ctx.cwd, v.path);
    case 'fileContent': {
      const node = ctx.vfs.findByPath(v.path);
      if (!node || node.type !== 'file') return false;
      const content = node.content ?? '';
      if (v.equals !== undefined) return content === v.equals;
      if (v.contains) return content.toLowerCase().includes(v.contains.toLowerCase());
      return true;
    }
    case 'commandExecuted': {
      const want = v.command.toLowerCase();
      const lastIs = ctx.lastCommand?.name.toLowerCase() === want;
      const ran = ctx.events.commands.includes(want) || lastIs;
      if (!ran) return false;
      if (!v.argsInclude?.length) return true;
      if (!lastIs) return true;
      const args = (ctx.lastCommand?.args ?? []).map((a) => a.toLowerCase());
      return v.argsInclude.every((a) => args.some((got) => got.includes(a.toLowerCase())));
    }
    case 'outputContains':
      return (ctx.lastCommand?.output ?? '').toLowerCase().includes(v.substring.toLowerCase());
    case 'multipleConditions': {
      const mode = v.mode ?? 'all';
      if (mode === 'any') return v.conditions.some((c) => validateOne(c, ctx));
      return v.conditions.every((c) => validateOne(c, ctx));
    }
    default:
      return false;
  }
}

export function validateAll(validators: Validator[] | undefined, ctx: ValidateContext): boolean {
  if (!validators?.length) return false;
  return validators.every((v) => validateOne(v, ctx));
}

function filesystemGoals(validators: Validator[] | undefined): { path: string }[] {
  return (validators ?? []).flatMap((v) => {
    if (v.type === 'filesystemExists' || v.type === 'filesystemNotExists') return [{ path: v.path }];
    if (v.type === 'multipleConditions') {
      return v.conditions.flatMap((c) =>
        c.type === 'filesystemExists' || c.type === 'filesystemNotExists' ? [{ path: c.path }] : [],
      );
    }
    return [];
  });
}

function commandTouchesGoals(cmd: LastCommand, goals: { path: string }[]): boolean {
  if (!goals.length) return true;
  const resolved = cmd.args.map((a) => canonicalize(resolvePath(cmd.cwdBefore, a)).toLowerCase());
  if (cmd.args.length) {
    resolved.push(canonicalize(resolvePath(cmd.cwdBefore, cmd.args.join(' '))).toLowerCase());
  }
  const names = cmd.args.map((a) => a.split(/[\\/]/).pop()?.toLowerCase() ?? '');
  return goals.some((g) => {
    const goal = canonicalize(g.path).toLowerCase();
    const base = goal.split('\\').pop() ?? '';
    return resolved.some((a) => a === goal || a.endsWith(`\\${base}`)) || names.includes(base);
  });
}

export function interactiveSatisfied(step: TutorialStep, ctx: ValidateContext): boolean {
  if (!validateAll(step.validators, ctx)) return false;
  if (step.kind === 'mission' || step.kind === 'check') return true;
  const goals = filesystemGoals(step.validators);
  if (!goals.length) return true;
  const cmd = ctx.lastCommand;
  if (!cmd) return false;
  const mutated = Boolean(
    cmd.createdFolder || cmd.createdFile || cmd.renamed || cmd.copied || cmd.moved || cmd.deleted,
  );
  const already = Boolean(cmd.error && /already exists/i.test(cmd.output));
  if (!mutated && !already) return false;
  return commandTouchesGoals(cmd, goals);
}

export function pathLooksLike(a: string, b: string): boolean {
  return canonicalize(a).toLowerCase() === canonicalize(b).toLowerCase();
}
