import type { CoachMessage, TutorialStep, ValidateContext } from '../types/tutorial';
import { COMMANDS } from '../data/commands';
import { baseName, resolvePath } from './paths';

const TYPOS: Record<string, string> = {
  mk: 'mkdir',
  mdir: 'mkdir',
  makdir: 'mkdir',
  makedir: 'mkdir',
  dc: 'cd',
  ddir: 'dir',
  list: 'dir',
  rn: 'ren',
  cp: 'copy',
  mv: 'move',
  rm: 'del',
  delete: 'del',
};

function expectedCommand(step: TutorialStep): string | null {
  const fromExample = step.example?.trim().split(/\s+/)[0];
  const fromAnswer = step.answer?.command?.trim().split(/\s+/)[0];
  const fromAnatomy = step.anatomy?.parts.find((p) => p.role === 'command')?.text;
  return (fromExample || fromAnswer || fromAnatomy || '').toLowerCase() || null;
}

function wantedPaths(step: TutorialStep): string[] {
  return (step.validators ?? []).flatMap((v) => {
    if (v.type === 'filesystemExists') return [v.path];
    if (v.type === 'multipleConditions') {
      return v.conditions.flatMap((c) => (c.type === 'filesystemExists' ? [c.path] : []));
    }
    return [];
  });
}

function knownCommand(name: string): boolean {
  return COMMANDS.some((c) => c.name === name || c.aliases?.includes(name));
}

function namesMatch(a: string, b: string): boolean {
  return baseName(a).toLowerCase() === b.toLowerCase();
}

export function coachForStep(step: TutorialStep, ctx: ValidateContext): CoachMessage | null {
  const cmd = ctx.lastCommand;
  if (!cmd) return null;

  const expect = expectedCommand(step);
  const typed = cmd.name.toLowerCase();

  if (cmd.error && typed && !knownCommand(typed)) {
    const mapped = TYPOS[typed];
    if (mapped) {
      return {
        tone: 'try',
        title: 'Unknown command',
        body: `It looks like you typed '${cmd.name}'. The command for this step is '${mapped}'.`,
      };
    }
    if (expect) {
      return {
        tone: 'try',
        title: 'Unknown command',
        body: `'${cmd.name}' is not a command this terminal knows. For this step, start with ${expect}.`,
      };
    }
  }

  if ((typed === 'mkdir' || typed === 'md') && !cmd.args.length) {
    return {
      tone: 'try',
      title: 'mkdir needs a name',
      body: 'mkdir needs a name. Try giving the new directory a name after the command.',
    };
  }

  if ((typed === 'mkdir' || typed === 'md') && cmd.args.length) {
    const given = cmd.args.join(' ');
    for (const path of wantedPaths(step)) {
      const wantName = baseName(path);
      const createdPath = resolvePath(cmd.cwdBefore, given);
      const existsWanted = Boolean(ctx.vfs.findByPath(path));
      const existsGiven = Boolean(ctx.vfs.findByPath(createdPath));
      if (!existsWanted && existsGiven && !namesMatch(given, wantName) && cmd.createdFolder) {
        return {
          tone: 'try',
          title: 'Folder created — wrong name',
          body: `You created a folder successfully, but this step needs one named '${wantName}'.`,
        };
      }
      if (!existsWanted && namesMatch(given, wantName) && createdPath.toLowerCase() !== path.toLowerCase()) {
        return {
          tone: 'try',
          title: 'Right folder, wrong place',
          body: `You created ${wantName} inside ${cmd.cwdAfter}, but this step wants ${path}. Use cd to move there, or type the full path.`,
        };
      }
    }
  }

  if (expect === 'echo' && typed && typed !== 'echo') {
    return {
      tone: 'try',
      title: 'Try echo',
      body: 'echo prints whatever you type after it. Example: echo Hello',
    };
  }

  if (expect && typed && typed !== expect && knownCommand(typed) && expect !== typed) {
    const aliases = COMMANDS.find((c) => c.name === expect)?.aliases ?? [];
    if (!aliases.includes(typed)) {
      return {
        tone: 'try',
        title: 'Different command',
        body: `That ran ${typed}. This step is about ${expect}.`,
      };
    }
  }

  if (cmd.error && cmd.output) {
    return {
      tone: 'try',
      title: 'The terminal reported an error',
      body: explainGeneric(cmd.output, expect),
    };
  }

  if (step.kind === 'try' || step.kind === 'mission' || step.kind === 'check') {
    return {
      tone: 'info',
      title: 'Not there yet',
      body:
        step.guidance === 'independent'
          ? 'The lab is watching the folders and files, not a single exact command. Keep going.'
          : 'Try again in the Terminal. Use a hint if you want a nudge.',
    };
  }

  return null;
}

export function successCoach(step: TutorialStep, ctx: ValidateContext): CoachMessage {
  if (step.successTitle) {
    return { tone: 'ok', title: step.successTitle, body: step.successBody ?? '' };
  }
  const made = wantedPaths(step)[0];
  if (made) {
    const node = ctx.vfs.findByPath(made);
    const kind = node?.type === 'file' ? 'file' : 'directory';
    return {
      tone: 'ok',
      title: `${baseName(made)} ${node ? 'created' : 'complete'}`,
      body: node ? `You now have a ${kind} at ${made}.` : 'That matches the objective.',
    };
  }
  if (ctx.lastCommand?.name === 'echo') {
    return {
      tone: 'ok',
      title: 'Command completed',
      body: 'The terminal printed your text. That is all echo does.',
    };
  }
  if (ctx.lastCommand?.listed) {
    return {
      tone: 'ok',
      title: 'Listing complete',
      body: 'Those names are the files and folders in your current directory.',
    };
  }
  return { tone: 'ok', title: 'Correct', body: step.successBody ?? 'That matches the objective.' };
}

function explainGeneric(output: string, expect: string | null): string {
  if (/not recognized/i.test(output) && expect) {
    return `The terminal did not recognize that command. This step uses ${expect}.`;
  }
  if (/cannot find the path/i.test(output)) {
    return 'That path is not there from where you are. Check the prompt — the text before > is your current directory.';
  }
  if (/already exists/i.test(output)) {
    return 'That name is already taken in this folder. If it is the one the lesson wants, you are done.';
  }
  if (/syntax of the command is incorrect/i.test(output)) {
    return expect
      ? `${expect} is missing something after the command name.`
      : 'The command is missing an argument.';
  }
  return output.split('\n')[0];
}
