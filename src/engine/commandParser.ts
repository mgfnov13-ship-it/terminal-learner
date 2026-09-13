import type { CommandResult } from '../types';
import { COMMANDS } from '../data/commands';
import { splitRedirect, tokenize } from './paths';
import { formatDirListing, formatLs, VirtualFileSystem } from './virtualFileSystem';

const VERSION = 'Terminal Space Virtual Computer [Version 1.0.0]';

export function executeCommand(
  raw: string,
  vfs: VirtualFileSystem,
  cwd: string,
): { result: CommandResult; cwd: string } {
  const line = raw.trim();
  if (!line) return { result: { output: '' }, cwd };

  const { body, redirect } = splitRedirect(line);
  const tokens = tokenize(body);
  const name = (tokens[0] ?? '').toLowerCase();
  const args = tokens.slice(1);

  if (redirect) {
    const out = handleRedirect(name, args, redirect, vfs, cwd, body);
    return { result: { ...out.result, commandName: name, args }, cwd: out.cwd };
  }

  const tagged = (result: CommandResult, nextCwd: string): { result: CommandResult; cwd: string } => ({
    result: { ...result, commandName: name, args },
    cwd: nextCwd,
  });

  switch (name) {
    case 'cd':
      return tagged(...spread(handleCd(args, vfs, cwd)));
    case 'pwd':
      return tagged({ output: cwd }, cwd);
    case 'dir':
      return tagged(...spread(handleDir(args, vfs, cwd, 'dir')));
    case 'ls':
      return tagged(...spread(handleDir(args, vfs, cwd, 'ls')));
    case 'mkdir':
    case 'md':
      return tagged(...spread(handleMkdir(args, vfs, cwd)));
    case 'touch':
      return tagged(...spread(handleTouch(args, vfs, cwd)));
    case 'type':
      return tagged(...spread(handleType(args, vfs, cwd)));
    case 'ren':
    case 'rename':
      return tagged(...spread(handleRen(args, vfs, cwd)));
    case 'copy':
      return tagged(...spread(handleCopy(args, vfs, cwd)));
    case 'move':
      return tagged(...spread(handleMove(args, vfs, cwd)));
    case 'del':
    case 'erase':
      return tagged(...spread(handleDel(args, vfs, cwd)));
    case 'rmdir':
    case 'rd':
      return tagged(...spread(handleRmdir(args, vfs, cwd)));
    case 'cls':
    case 'clear':
      return tagged({ output: '', clear: true }, cwd);
    case 'help':
      return tagged({ output: helpText(args[0]) }, cwd);
    case 'ver':
      return tagged({ output: VERSION }, cwd);
    case 'echo':
      return tagged({ output: args.join(' ') }, cwd);
    case 'exit':
      return tagged({ output: '', exit: true }, cwd);
    default:
      return tagged(
        {
          output: `'${tokens[0]}' is not recognized as an internal or external command,\noperable program or batch file.`,
          error: true,
        },
        cwd,
      );
  }
}

function spread(out: { result: CommandResult; cwd: string }): [CommandResult, string] {
  return [out.result, out.cwd];
}

function handleRedirect(
  name: string,
  args: string[],
  redirect: string,
  vfs: VirtualFileSystem,
  cwd: string,
  body: string,
): { result: CommandResult; cwd: string } {
  const lower = body.toLowerCase();
  let content = '';
  if (name === 'type' && args[0]?.toLowerCase() === 'nul') {
    content = '';
  } else if (name === 'echo') {
    content = args.join(' ');
  } else if (name === 'type' && args[0] && args[0].toLowerCase() !== 'nul') {
    const src = vfs.findByPath(vfs.resolveFrom(cwd, args[0]).path);
    if (!src || src.type !== 'file') {
      return {
        result: { output: `The system cannot find the file specified.`, error: true },
        cwd,
      };
    }
    content = src.content ?? '';
  } else if (!name) {
    return { result: { output: 'The syntax of the command is incorrect.', error: true }, cwd };
  } else {
    return {
      result: {
        output: `'${tokenize(lower)[0]}' is not recognized as an internal or external command,\noperable program or batch file.`,
        error: true,
      },
      cwd,
    };
  }
  const written = vfs.writeFile(cwd, redirect, content);
  if (!written.ok) return { result: { output: written.message, error: true }, cwd };
  return { result: { output: '', createdFile: written.created }, cwd };
}

function handleCd(args: string[], vfs: VirtualFileSystem, cwd: string) {
  if (!args[0]) return { result: { output: cwd }, cwd };
  const next = vfs.cd(cwd, args.join(' '));
  if (!next.ok) return { result: { output: next.message, error: true }, cwd };
  return { result: { output: '' }, cwd: next.path };
}

function handleDir(args: string[], vfs: VirtualFileSystem, cwd: string, style: 'dir' | 'ls') {
  const target = args[0] ? vfs.resolveFrom(cwd, args[0]).path : cwd;
  const node = vfs.findByPath(target);
  if (!node || node.type !== 'folder') {
    return { result: { output: 'File Not Found', error: true, listed: true }, cwd };
  }
  const output = style === 'dir' ? formatDirListing(vfs, target) : formatLs(vfs, target);
  return { result: { output, listed: true }, cwd };
}

function handleMkdir(args: string[], vfs: VirtualFileSystem, cwd: string) {
  if (!args[0]) return { result: { output: 'The syntax of the command is incorrect.', error: true }, cwd };
  const made = vfs.mkdir(cwd, args.join(' '));
  if (!made.ok) return { result: { output: made.message, error: true }, cwd };
  return { result: { output: '', createdFolder: true }, cwd };
}

function handleTouch(args: string[], vfs: VirtualFileSystem, cwd: string) {
  if (!args[0]) return { result: { output: 'The syntax of the command is incorrect.', error: true }, cwd };
  const written = vfs.writeFile(cwd, args.join(' '), '');
  if (!written.ok) return { result: { output: written.message, error: true }, cwd };
  return { result: { output: '', createdFile: written.created }, cwd };
}

function handleType(args: string[], vfs: VirtualFileSystem, cwd: string) {
  if (!args[0]) return { result: { output: 'The syntax of the command is incorrect.', error: true }, cwd };
  if (args[0].toLowerCase() === 'nul') {
    return { result: { output: '' }, cwd };
  }
  const found = vfs.resolveFrom(cwd, args.join(' '));
  if (!found.node || found.node.type !== 'file') {
    return { result: { output: 'The system cannot find the file specified.', error: true }, cwd };
  }
  return { result: { output: found.node.content ?? '' }, cwd };
}

function handleRen(args: string[], vfs: VirtualFileSystem, cwd: string) {
  if (args.length < 2) {
    return { result: { output: 'The syntax of the command is incorrect.', error: true }, cwd };
  }
  const renamed = vfs.rename(cwd, args[0], args[1]);
  if (!renamed.ok) return { result: { output: renamed.message, error: true }, cwd };
  return { result: { output: '', renamed: true }, cwd };
}

function handleCopy(args: string[], vfs: VirtualFileSystem, cwd: string) {
  if (args.length < 2) {
    return { result: { output: 'The syntax of the command is incorrect.', error: true }, cwd };
  }
  const copied = vfs.copy(cwd, args[0], args[1]);
  if (!copied.ok) return { result: { output: copied.message, error: true }, cwd };
  return { result: { output: `        1 file(s) copied.`, copied: true }, cwd };
}

function handleMove(args: string[], vfs: VirtualFileSystem, cwd: string) {
  if (args.length < 2) {
    return { result: { output: 'The syntax of the command is incorrect.', error: true }, cwd };
  }
  const moved = vfs.move(cwd, args[0], args[1]);
  if (!moved.ok) return { result: { output: moved.message, error: true }, cwd };
  return { result: { output: `        1 file(s) moved.`, moved: true }, cwd };
}

function handleDel(args: string[], vfs: VirtualFileSystem, cwd: string) {
  if (!args[0]) return { result: { output: 'The syntax of the command is incorrect.', error: true }, cwd };
  const deleted = vfs.deletePath(cwd, args.join(' '));
  if (!deleted.ok) return { result: { output: deleted.message, error: true }, cwd };
  return { result: { output: '', deleted: true }, cwd };
}

function handleRmdir(args: string[], vfs: VirtualFileSystem, cwd: string) {
  const flags = args.filter((a) => a.startsWith('/'));
  const rest = args.filter((a) => !a.startsWith('/'));
  if (!rest[0]) return { result: { output: 'The syntax of the command is incorrect.', error: true }, cwd };
  const recursive = flags.some((f) => f.toLowerCase() === '/s');
  const deleted = vfs.deletePath(cwd, rest.join(' '), { folder: true, recursive });
  if (!deleted.ok) return { result: { output: deleted.message, error: true }, cwd };
  return { result: { output: '', deleted: true }, cwd };
}

function helpText(topic?: string): string {
  if (topic) {
    const cmd = COMMANDS.find(
      (c) => c.name === topic.toLowerCase() || c.aliases?.includes(topic.toLowerCase()),
    );
    if (!cmd) return `This command is not supported by the help utility.`;
    return [
      cmd.name,
      cmd.summary,
      '',
      'Usage:',
      cmd.usage,
      '',
      'Example:',
      cmd.example,
    ].join('\n');
  }
  const lines = [
    'AVAILABLE COMMANDS',
    '',
    'For help on one command, type: help <name>',
    '',
    ...COMMANDS.map((c) => `${c.name.padEnd(12, ' ')}${c.summary}`),
  ];
  return lines.join('\n');
}

export const COMMAND_NAMES = [
  ...new Set(COMMANDS.flatMap((c) => [c.name, ...(c.aliases ?? [])])),
];
