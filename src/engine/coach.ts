import type { CoachMessage, TutorialStep, ValidateContext } from '../types/tutorial';
import { COMMANDS } from '../data/commands';
import { L } from '../lib/i18n';
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
        title: L('Unknown command', 'أمر غير معروف'),
        body: L(
          `It looks like you typed '${cmd.name}'. The command for this step is '${mapped}'.`,
          `يبدو أنك كتبت '${cmd.name}'. أمر هذه الخطوة هو '${mapped}'.`,
        ),
      };
    }
    if (expect) {
      return {
        tone: 'try',
        title: L('Unknown command', 'أمر غير معروف'),
        body: L(
          `'${cmd.name}' is not a command this terminal knows. For this step, start with ${expect}.`,
          `'${cmd.name}' ليس أمراً تعرفه هذه الطرفية. لهذه الخطوة ابدأ بـ ${expect}.`,
        ),
      };
    }
  }

  if ((typed === 'mkdir' || typed === 'md') && !cmd.args.length) {
    return {
      tone: 'try',
      title: L('mkdir needs a name', 'mkdir يحتاج اسماً'),
      body: L(
        'mkdir needs a name. Try giving the new directory a name after the command.',
        'mkdir يحتاج اسماً. اكتب اسم المجلد الجديد بعد الأمر.',
      ),
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
          title: L('Folder created — wrong name', 'أُنشئ المجلد — الاسم خطأ'),
          body: L(
            `You created a folder successfully, but this step needs one named '${wantName}'.`,
            `أنشأت مجلداً بنجاح، لكن هذه الخطوة تحتاج مجلداً اسمه '${wantName}'.`,
          ),
        };
      }
      if (!existsWanted && namesMatch(given, wantName) && createdPath.toLowerCase() !== path.toLowerCase()) {
        return {
          tone: 'try',
          title: L('Right folder, wrong place', 'المجلد صحيح، المكان خطأ'),
          body: L(
            `You created ${wantName} inside ${cmd.cwdAfter}, but this step wants ${path}. Use cd to move there, or type the full path.`,
            `أنشأت ${wantName} داخل ${cmd.cwdAfter}، لكن هذه الخطوة تريد ${path}. استخدم cd للانتقال إلى هناك، أو اكتب المسار كاملاً.`,
          ),
        };
      }
    }
  }

  if (expect === 'echo' && typed && typed !== 'echo') {
    return {
      tone: 'try',
      title: L('Try echo', 'جرّب echo'),
      body: L('echo prints whatever you type after it. Example: echo Hello', 'echo يطبع ما تكتبه بعده. مثال: echo Hello'),
    };
  }

  if (expect && typed && typed !== expect && knownCommand(typed) && expect !== typed) {
    const aliases = COMMANDS.find((c) => c.name === expect)?.aliases ?? [];
    if (!aliases.includes(typed)) {
      return {
        tone: 'try',
        title: L('Different command', 'أمر مختلف'),
        body: L(`That ran ${typed}. This step is about ${expect}.`, `هذا شغّل ${typed}. هذه الخطوة عن ${expect}.`),
      };
    }
  }

  if (cmd.error && cmd.output) {
    return {
      tone: 'try',
      title: L('The terminal reported an error', 'الطرفية أبلغت عن خطأ'),
      body: explainGeneric(cmd.output, expect),
    };
  }

  if (step.kind === 'try' || step.kind === 'mission' || step.kind === 'check') {
    return {
      tone: 'info',
      title: L('Not there yet', 'لم تصل بعد'),
      body:
        step.guidance === 'independent'
          ? L(
              'The lab is watching the folders and files, not a single exact command. Keep going.',
              'المختبر يراقب المجلدات والملفات، لا أمراً واحداً حرفياً. واصل.',
            )
          : L('Try again in the Terminal. Use a hint if you want a nudge.', 'أعد المحاولة في الطرفية. استخدم تلميحاً إن أردت دفعة.'),
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
    const kind = node?.type === 'file' ? L('file', 'ملف') : L('directory', 'مجلد');
    return {
      tone: 'ok',
      title: L(
        `${baseName(made)} ${node ? 'created' : 'complete'}`,
        `${baseName(made)} ${node ? 'أُنشئ' : 'اكتمل'}`,
      ),
      body: node
        ? L(`You now have a ${kind} at ${made}.`, `صار لديك ${kind} عند ${made}.`)
        : L('That matches the objective.', 'هذا يطابق الهدف.'),
    };
  }
  if (ctx.lastCommand?.name === 'echo') {
    return {
      tone: 'ok',
      title: L('Command completed', 'اكتمل الأمر'),
      body: L('The terminal printed your text. That is all echo does.', 'الطرفية طبعت نصك. هذا كل ما يفعله echo.'),
    };
  }
  if (ctx.lastCommand?.listed) {
    return {
      tone: 'ok',
      title: L('Listing complete', 'اكتمل العرض'),
      body: L(
        'Those names are the files and folders in your current directory.',
        'هذه الأسماء هي الملفات والمجلدات في مجلدك الحالي.',
      ),
    };
  }
  return { tone: 'ok', title: L('Correct', 'صحيح'), body: step.successBody ?? L('That matches the objective.', 'هذا يطابق الهدف.') };
}

function explainGeneric(output: string, expect: string | null): string {
  if (/not recognized/i.test(output) && expect) {
    return L(
      `The terminal did not recognize that command. This step uses ${expect}.`,
      `الطرفية لم تتعرف على ذلك الأمر. هذه الخطوة تستخدم ${expect}.`,
    );
  }
  if (/cannot find the path/i.test(output)) {
    return L(
      'That path is not there from where you are. Check the prompt — the text before > is your current directory.',
      'ذلك المسار غير موجود من موقعك الحالي. انظر إلى الموجّه — النص قبل > هو مجلدك الحالي.',
    );
  }
  if (/already exists/i.test(output)) {
    return L(
      'That name is already taken in this folder. If it is the one the lesson wants, you are done.',
      'هذا الاسم مستخدم في هذا المجلد. إن كان هو ما يريده الدرس، فقد انتهيت.',
    );
  }
  if (/syntax of the command is incorrect/i.test(output)) {
    return expect
      ? L(`${expect} is missing something after the command name.`, `${expect} ينقصه شيء بعد اسم الأمر.`)
      : L('The command is missing an argument.', 'الأمر ينقصه وسيط.');
  }
  return output.split('\n')[0];
}
