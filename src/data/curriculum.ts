import type { CommandAnatomy, LessonDef, TutorialStep } from '../types/tutorial';
import { HOME } from '../engine/paths';

const P = `${HOME}\\Projects`;
const DOCS = `${HOME}\\Documents`;

function anatomy(line: string, parts: CommandAnatomy['parts']): CommandAnatomy {
  return { line, parts };
}

function filesLesson(
  order: number,
  id: string,
  title: string,
  subtitle: string,
  xp: number,
  startCwd: string,
  setup: LessonDef['setup'],
  steps: TutorialStep[],
): LessonDef {
  return { id, trackId: 'files', levelId: 1, order, title, subtitle, xp, startCwd, setup, steps };
}

export const FILES_LESSONS: LessonDef[] = [
  filesLesson(
    1,
    'files-1',
    'Meet the Terminal',
    'Prompt, cursor, Enter, and your first command.',
    10,
    HOME,
    [{ type: 'cwd', path: HOME }],
    [
      {
        id: 'f1-intro',
        kind: 'intro',
        title: 'This is a terminal',
        body: 'A terminal is a text window for talking to a computer. You type a command, press Enter, and the computer replies with text. Nothing you type here reaches your real machine.',
      },
      {
        id: 'f1-prompt',
        kind: 'concept',
        title: 'The prompt is your location',
        body: 'The text before > is the current directory — the folder the terminal is standing in. The blinking cursor is where the next character will appear. Press Enter to run whatever you typed.',
        highlightTerminal: true,
      },
      {
        id: 'f1-echo',
        kind: 'try',
        title: 'Your first command',
        body: 'echo prints the words that follow it. It does not create a file. It just repeats the text so you can see that the terminal is listening.',
        anatomy: anatomy('echo Hello', [
          { text: 'echo', role: 'command' },
          { text: 'Hello', role: 'argument' },
        ]),
        prompt: 'Type echo Hello in the Terminal, then press Enter.',
        example: 'echo Hello',
        answer: {
          command: 'echo Hello',
          parts: [
            { text: 'echo', role: 'command' },
            { text: 'Hello', role: 'argument' },
          ],
          explanation: 'echo prints whatever text follows it. Hello is the text you are asking it to print back.',
        },
        guidance: 'guided',
        highlightTerminal: true,
        hints: [
          'You need the command that prints text back to the screen.',
          'The command begins with e.',
          'Type echo followed by a space and Hello.',
        ],
        validators: [{ type: 'commandExecuted', command: 'echo' }],
        xp: 10,
        successTitle: 'Command completed',
        successBody: 'The terminal printed your text. echo always talks; it does not change folders or files.',
      },
      {
        id: 'f1-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'The prompt shows where you are. You type a command, press Enter, and read the reply. Next you will look inside the folder you are standing in.',
      },
    ],
  ),

  filesLesson(
    2,
    'files-2',
    'Look Around',
    'dir lists the files and folders in front of you.',
    10,
    HOME,
    [{ type: 'cwd', path: HOME }],
    [
      {
        id: 'f2-intro',
        kind: 'concept',
        title: 'Folders already exist',
        body: 'Your home directory already holds Desktop, Documents, Downloads, and Pictures. The terminal can list them. Windows uses dir for that listing. ls works here too.',
      },
      {
        id: 'f2-demo',
        kind: 'demo',
        title: 'Meet dir',
        body: 'dir means “directory listing.” Run it with no extra words and it lists the current directory — the one shown in the prompt.',
        anatomy: anatomy('dir', [{ text: 'dir', role: 'command' }]),
      },
      {
        id: 'f2-try',
        kind: 'try',
        title: 'List this folder',
        body: 'You are in C:\\Users\\Student. Ask the terminal what is inside.',
        prompt: 'List the current directory.',
        example: 'dir',
        answer: {
          command: 'dir',
          parts: [{ text: 'dir', role: 'command' }],
          explanation: 'dir on its own lists the directory named in the prompt. ls does the same thing in this lab.',
        },
        guidance: 'guided',
        highlightTerminal: true,
        hints: [
          'You need the command that lists files and folders.',
          'The Windows command is three letters.',
          'Type dir and press Enter. ls also works here.',
        ],
        validators: [
          {
            type: 'multipleConditions',
            mode: 'any',
            conditions: [
              { type: 'commandExecuted', command: 'dir' },
              { type: 'commandExecuted', command: 'ls' },
            ],
          },
        ],
        xp: 10,
        successTitle: 'Listing complete',
        successBody: 'Each name is something inside Student. <DIR> means a folder. A number is a file size.',
      },
      {
        id: 'f2-q',
        kind: 'question',
        title: 'Check your reading',
        body: 'The listing you just saw belongs to the folder in the prompt.',
        question: {
          prompt: 'You are at C:\\Users\\Student> and you run dir. What does the list show?',
          choices: [
            { id: 'a', label: 'Every file on the C: drive' },
            { id: 'b', label: 'Only the files and folders inside C:\\Users\\Student' },
            { id: 'c', label: 'Only files on your real computer' },
            { id: 'd', label: 'The contents of Desktop' },
          ],
          correctId: 'b',
          explanation:
            'dir lists the current directory. The prompt said Student, so you saw Student’s contents — not the whole disk, and not Desktop unless you were inside it.',
        },
        xp: 10,
      },
      {
        id: 'f2-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'dir (or ls) lists the current directory. Read the prompt first so you know whose listing you are looking at.',
      },
    ],
  ),

  filesLesson(
    3,
    'files-3',
    'Create Directories',
    'mkdir makes a folder in the directory you are standing in.',
    10,
    HOME,
    [{ type: 'cwd', path: HOME }],
    [
      {
        id: 'f3-intro',
        kind: 'intro',
        title: 'Folders & directories',
        body: 'A directory is a place used to organize files. Windows usually calls these folders. In a terminal you will hear directory just as often. They are the same idea.',
      },
      {
        id: 'f3-home',
        kind: 'concept',
        title: 'Home directory',
        body: 'C:\\Users\\Student is your home directory in this lab — the folder that belongs to you. Desktop, Documents, and Downloads live inside it. New work often starts here so it is easy to find.',
      },
      {
        id: 'f3-demo',
        kind: 'demo',
        title: 'Meet mkdir',
        body: 'mkdir means “make directory.” When you press Enter, the terminal creates a folder with that name inside your current directory. A successful mkdir prints nothing — no news is good news.',
        anatomy: anatomy('mkdir Projects', [
          { text: 'mkdir', role: 'command' },
          { text: 'Projects', role: 'argument' },
        ]),
      },
      {
        id: 'f3-try',
        kind: 'try',
        title: 'Your turn',
        body: 'Create a folder named Projects in your home directory. You are already in C:\\Users\\Student. The lab checks the disk, so mkdir Projects and mkdir C:\\Users\\Student\\Projects both count.',
        prompt: 'Create a directory named Projects.',
        example: 'mkdir Projects',
        answer: {
          command: 'mkdir Projects',
          parts: [
            { text: 'mkdir', role: 'command' },
            { text: 'Projects', role: 'argument' },
          ],
          explanation: 'mkdir creates a directory inside your current location. Projects is the name it gets.',
        },
        guidance: 'guided',
        highlightTerminal: true,
        hints: [
          'You need the command used to make a directory.',
          'The command begins with m.',
          'Use mkdir followed by the directory name Projects.',
        ],
        validators: [{ type: 'filesystemExists', path: P, entityType: 'directory' }],
        xp: 10,
        successTitle: 'Projects created',
        successBody: 'You just created your first directory. It now exists at C:\\Users\\Student\\Projects.',
      },
      {
        id: 'f3-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'mkdir <name> creates a new directory inside your current location. If you need it somewhere else, change directory first or type a full path.',
      },
    ],
  ),

  filesLesson(
    4,
    'files-4',
    'Move Around',
    'cd changes the current directory. The prompt follows you.',
    10,
    HOME,
    [
      { type: 'ensureFolder', path: DOCS },
      { type: 'cwd', path: HOME },
    ],
    [
      {
        id: 'f4-intro',
        kind: 'concept',
        title: 'Standing still vs moving',
        body: 'mkdir builds a folder where you already are. cd (change directory) walks you into a folder so the next commands happen there. After a successful cd, the prompt changes.',
      },
      {
        id: 'f4-demo',
        kind: 'demo',
        title: 'cd into a folder',
        body: 'Documents already exists in your home directory. cd Documents steps into it. The prompt should then read C:\\Users\\Student\\Documents>',
        anatomy: anatomy('cd Documents', [
          { text: 'cd', role: 'command' },
          { text: 'Documents', role: 'path' },
        ]),
      },
      {
        id: 'f4-try-in',
        kind: 'try',
        title: 'Enter Documents',
        body: 'Move into Documents. Watch the prompt. When it ends with Documents>, you are there.',
        prompt: 'Change into the Documents folder.',
        example: 'cd Documents',
        answer: {
          command: 'cd Documents',
          parts: [
            { text: 'cd', role: 'command' },
            { text: 'Documents', role: 'path' },
          ],
          explanation: 'cd changes the current directory. Documents is the folder you step into, so the prompt changes with you.',
        },
        guidance: 'guided',
        highlightTerminal: true,
        hints: [
          'You need the command that changes the current directory.',
          'The command is two letters.',
          'Type cd Documents and press Enter.',
        ],
        validators: [{ type: 'currentDirectory', path: DOCS }],
        xp: 10,
        successTitle: 'You are in Documents',
        successBody: 'The prompt is the map. You are now at C:\\Users\\Student\\Documents.',
      },
      {
        id: 'f4-up',
        kind: 'demo',
        title: 'Climb out with cd ..',
        body: '.. means the parent folder — one step up. From Documents, cd .. returns you to Student. cd \\ (or cd C:\\) jumps to the drive root.',
        anatomy: anatomy('cd ..', [
          { text: 'cd', role: 'command' },
          { text: '..', role: 'path' },
        ]),
      },
      {
        id: 'f4-try-out',
        kind: 'try',
        title: 'Back to Student',
        body: 'Return to your home directory. cd .. from Documents is enough. cd C:\\Users\\Student also works.',
        prompt: 'Go back to C:\\Users\\Student.',
        example: 'cd ..',
        answer: {
          command: 'cd ..',
          parts: [
            { text: 'cd', role: 'command' },
            { text: '..', role: 'path' },
          ],
          explanation: '.. means the folder that contains this one, so cd .. steps up from Documents back to Student.',
        },
        guidance: 'semi',
        highlightTerminal: true,
        hints: [
          'You need to leave Documents and return to its parent.',
          '.. means “the folder that contains this one.”',
          'Type cd .. or cd C:\\Users\\Student.',
        ],
        validators: [{ type: 'currentDirectory', path: HOME }],
        xp: 10,
        successTitle: 'Back home',
        successBody: 'You are at C:\\Users\\Student again. cd moves you; it does not create or delete folders.',
      },
      {
        id: 'f4-q',
        kind: 'question',
        title: 'Where does mkdir land?',
        body: 'mkdir always uses your current directory unless you type a full path.',
        question: {
          prompt: 'You are at C:\\Users\\Student\\Documents> and you run mkdir School. Where is School created?',
          choices: [
            { id: 'a', label: 'C:\\' },
            { id: 'b', label: 'C:\\Users' },
            { id: 'c', label: 'C:\\Users\\Student\\Documents' },
            { id: 'd', label: 'C:\\Users\\Student\\Desktop' },
          ],
          correctId: 'c',
          explanation:
            'mkdir School has no path, so School is created inside the current directory: Documents.',
        },
        xp: 10,
      },
      {
        id: 'f4-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'cd <folder> enters a folder. cd .. goes up one. cd \\ goes to C:\\. The prompt always tells you where you are.',
      },
    ],
  ),

  filesLesson(
    5,
    'files-5',
    'Paths',
    'A short name is relative. A full path starts at the drive.',
    10,
    HOME,
    [
      { type: 'ensureFolder', path: P },
      { type: 'cwd', path: HOME },
    ],
    [
      {
        id: 'f5-intro',
        kind: 'concept',
        title: 'Two ways to name a place',
        body: 'Documents is a relative path — it means “Documents inside where I am now.” C:\\Users\\Student\\Documents is an absolute path. It starts at the drive, so it works from anywhere.',
      },
      {
        id: 'f5-demo',
        kind: 'demo',
        title: 'Same folder, two spellings',
        body: 'From C:\\Users\\Student, cd Documents and cd C:\\Users\\Student\\Documents both enter Documents. The second form still works if you were standing in Pictures.',
        anatomy: anatomy('cd C:\\Users\\Student\\Documents', [
          { text: 'cd', role: 'command' },
          { text: 'C:\\Users\\Student\\Documents', role: 'path' },
        ]),
      },
      {
        id: 'f5-try',
        kind: 'try',
        title: 'Create with a full path',
        body: 'Stay in your home directory. Create a folder named Lab inside Projects using an absolute path. You should not need to cd first.',
        prompt: 'Create C:\\Users\\Student\\Projects\\Lab without changing directory.',
        example: 'mkdir C:\\Users\\Student\\Projects\\Lab',
        answer: {
          command: 'mkdir C:\\Users\\Student\\Projects\\Lab',
          parts: [
            { text: 'mkdir', role: 'command' },
            { text: 'C:\\Users\\Student\\Projects\\Lab', role: 'path' },
          ],
          explanation:
            'An absolute path starts at the drive, so mkdir ignores where you are standing and builds Lab inside Projects.',
        },
        guidance: 'semi',
        highlightTerminal: true,
        hints: [
          'You can give mkdir a full path, not just a short name.',
          'Absolute paths on this lab start with C:\\',
          'Type mkdir C:\\Users\\Student\\Projects\\Lab',
        ],
        validators: [{ type: 'filesystemExists', path: `${P}\\Lab`, entityType: 'directory' }],
        xp: 10,
        successTitle: 'Lab created',
        successBody: 'Projects\\Lab exists even though you never stepped into Projects. Full paths ignore the current directory.',
      },
      {
        id: 'f5-q',
        kind: 'question',
        title: 'Relative or absolute?',
        body: 'Look at the first characters of a path.',
        question: {
          prompt: 'Which of these is an absolute path?',
          choices: [
            { id: 'a', label: 'Documents' },
            { id: 'b', label: 'Projects\\Lab' },
            { id: 'c', label: 'C:\\Users\\Student\\Documents' },
            { id: 'd', label: '..' },
          ],
          correctId: 'c',
          explanation:
            'Absolute paths start at the drive (C:\\). The others are relative to wherever you currently are.',
        },
        xp: 10,
      },
      {
        id: 'f5-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'Relative names start from here. Absolute paths start from C:\\. Use whichever is clearer for the job.',
      },
    ],
  ),

  filesLesson(
    6,
    'files-6',
    'Create Files',
    'touch makes an empty text file in the current directory.',
    10,
    P,
    [
      { type: 'ensureFolder', path: P },
      { type: 'cwd', path: P },
    ],
    [
      {
        id: 'f6-intro',
        kind: 'concept',
        title: 'Files live inside folders',
        body: 'A file holds content. A folder holds names. You are inside Projects for this lesson so a new file lands there. On a real Windows machine people often write type nul > notes.txt. Here, touch notes.txt is the simple lab command. Both create an empty file.',
      },
      {
        id: 'f6-demo',
        kind: 'demo',
        title: 'Meet touch',
        body: 'touch notes.txt creates notes.txt if it is missing. If the file already exists, it stays. echo Hello > notes.txt would create the file and put Hello inside it.',
        anatomy: anatomy('touch notes.txt', [
          { text: 'touch', role: 'command' },
          { text: 'notes.txt', role: 'argument' },
        ]),
      },
      {
        id: 'f6-try',
        kind: 'try',
        title: 'Leave a file in Projects',
        body: 'Create notes.txt in Projects. You are already in that folder.',
        prompt: 'Create a file named notes.txt.',
        example: 'touch notes.txt',
        answer: {
          command: 'touch notes.txt',
          parts: [
            { text: 'touch', role: 'command' },
            { text: 'notes.txt', role: 'argument' },
          ],
          explanation: 'touch creates an empty file in the current directory. notes.txt is the file name, extension included.',
        },
        guidance: 'guided',
        highlightTerminal: true,
        hints: [
          'You need a command that creates a file.',
          'The simple lab command is touch.',
          'Type touch notes.txt. type nul > notes.txt also counts.',
        ],
        validators: [{ type: 'filesystemExists', path: `${P}\\notes.txt`, entityType: 'file' }],
        xp: 10,
        successTitle: 'notes.txt created',
        successBody: 'Projects now holds a file. dir will show it without <DIR>.',
      },
      {
        id: 'f6-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'touch <name> creates an empty file in the current directory. echo text > file.txt creates a file and writes the text.',
      },
    ],
  ),

  filesLesson(
    7,
    'files-7',
    'Rename',
    'ren changes a name without moving the file to another folder.',
    10,
    P,
    [
      { type: 'ensureFolder', path: P },
      { type: 'ensureFile', path: `${P}\\ideas.txt`, content: '' },
      { type: 'cwd', path: P },
    ],
    [
      {
        id: 'f7-intro',
        kind: 'concept',
        title: 'A clearer name',
        body: 'Rename keeps the file where it is and changes only the name. The Windows command is ren (rename also works). You give the current name, then the new name.',
      },
      {
        id: 'f7-demo',
        kind: 'demo',
        title: 'Meet ren',
        body: 'ideas.txt is already in Projects. Give it a name that says what it is.',
        anatomy: anatomy('ren ideas.txt project-ideas.txt', [
          { text: 'ren', role: 'command' },
          { text: 'ideas.txt', role: 'source' },
          { text: 'project-ideas.txt', role: 'destination' },
        ]),
      },
      {
        id: 'f7-try',
        kind: 'try',
        title: 'Rename ideas.txt',
        body: 'Rename ideas.txt to project-ideas.txt. The old name should disappear.',
        prompt: 'ideas.txt should become project-ideas.txt.',
        example: 'ren ideas.txt project-ideas.txt',
        answer: {
          command: 'ren ideas.txt project-ideas.txt',
          parts: [
            { text: 'ren', role: 'command' },
            { text: 'ideas.txt', role: 'source' },
            { text: 'project-ideas.txt', role: 'destination' },
          ],
          explanation: 'ren takes the current name first, then the new name. The file stays in Projects.',
        },
        guidance: 'semi',
        highlightTerminal: true,
        hints: [
          'You need the command that changes a name.',
          'It is three letters on Windows.',
          'Type ren ideas.txt project-ideas.txt',
        ],
        validators: [
          { type: 'filesystemExists', path: `${P}\\project-ideas.txt`, entityType: 'file' },
          { type: 'filesystemNotExists', path: `${P}\\ideas.txt` },
        ],
        xp: 10,
        successTitle: 'Renamed',
        successBody: 'The file is the same object with a new name. It never left Projects.',
      },
      {
        id: 'f7-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'ren old.txt new.txt changes a name in the current directory. The file does not move.',
      },
    ],
  ),

  filesLesson(
    8,
    'files-8',
    'Copy',
    'copy duplicates a file. The original stays put.',
    10,
    P,
    [
      { type: 'ensureFolder', path: P },
      { type: 'ensureFile', path: `${P}\\game.txt`, content: 'save' },
      { type: 'cwd', path: P },
    ],
    [
      {
        id: 'f8-intro',
        kind: 'concept',
        title: 'A spare copy',
        body: 'copy reads a file and writes a second one. After a copy you have two files. That is different from rename, which leaves only one.',
      },
      {
        id: 'f8-demo',
        kind: 'demo',
        title: 'Meet copy',
        body: 'The first name is the source. The second is the destination. If the destination is a folder, the file keeps its original name inside that folder.',
        anatomy: anatomy('copy game.txt game-copy.txt', [
          { text: 'copy', role: 'command' },
          { text: 'game.txt', role: 'source' },
          { text: 'game-copy.txt', role: 'destination' },
        ]),
      },
      {
        id: 'f8-try',
        kind: 'try',
        title: 'Duplicate game.txt',
        body: 'Keep game.txt and also create game-copy.txt in Projects.',
        prompt: 'Copy game.txt to game-copy.txt.',
        example: 'copy game.txt game-copy.txt',
        answer: {
          command: 'copy game.txt game-copy.txt',
          parts: [
            { text: 'copy', role: 'command' },
            { text: 'game.txt', role: 'source' },
            { text: 'game-copy.txt', role: 'destination' },
          ],
          explanation: 'The first name is the file to read, the second is the new file to write. Both end up in Projects.',
        },
        guidance: 'semi',
        highlightTerminal: true,
        hints: [
          'You need the command that duplicates a file.',
          'It starts with c.',
          'Type copy game.txt game-copy.txt',
        ],
        validators: [
          { type: 'filesystemExists', path: `${P}\\game.txt`, entityType: 'file' },
          { type: 'filesystemExists', path: `${P}\\game-copy.txt`, entityType: 'file' },
        ],
        xp: 10,
        successTitle: 'Copied',
        successBody: 'game.txt is still there. game-copy.txt is the spare.',
      },
      {
        id: 'f8-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'copy source destination makes a second file. The source is not removed.',
      },
    ],
  ),

  filesLesson(
    9,
    'files-9',
    'Move',
    'move relocates a file. The original path goes away.',
    10,
    P,
    [
      { type: 'ensureFolder', path: P },
      { type: 'ensureFile', path: `${P}\\game.txt`, content: 'save' },
      { type: 'cwd', path: P },
    ],
    [
      {
        id: 'f9-intro',
        kind: 'concept',
        title: 'Move vs copy',
        body: 'move takes a file (or folder) from one place and puts it in another. After a move, the old path is empty. You will often mkdir a destination folder first.',
      },
      {
        id: 'f9-demo',
        kind: 'demo',
        title: 'Meet move',
        body: 'If the second argument is a folder, the file keeps its name inside that folder. You still need the folder to exist.',
        anatomy: anatomy('move game.txt Games', [
          { text: 'move', role: 'command' },
          { text: 'game.txt', role: 'source' },
          { text: 'Games', role: 'destination' },
        ]),
      },
      {
        id: 'f9-try',
        kind: 'mission',
        title: 'Put the game away',
        body: 'Create a Games folder inside Projects if you need it, then put game.txt in it. The lab checks the result, not the order of commands.',
        prompt: 'Projects\\Games should exist and contain game.txt.',
        guidance: 'semi',
        highlightTerminal: true,
        hints: [
          'Remember: mkdir creates directories, move relocates files.',
          'Make Games first if it is not there, then move the file into it.',
          'mkdir Games then move game.txt Games',
        ],
        answer: {
          command: 'mkdir Games\nmove game.txt Games',
          explanation:
            'Two commands, run one after the other: mkdir Games creates the destination, then move game.txt Games puts the file inside it.',
        },
        validators: [
          { type: 'filesystemExists', path: `${P}\\Games`, entityType: 'directory' },
          { type: 'filesystemExists', path: `${P}\\Games\\game.txt`, entityType: 'file' },
        ],
        xp: 30,
        successTitle: 'Moved',
        successBody: 'game.txt now lives in Projects\\Games. The old Projects\\game.txt path is gone.',
      },
      {
        id: 'f9-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'move source destination relocates. mkdir first if the destination folder does not exist.',
      },
    ],
  ),

  filesLesson(
    10,
    'files-10',
    'Delete Safely',
    'del removes a file. In this lab it goes to Recycle Bin.',
    10,
    P,
    [
      { type: 'ensureFolder', path: P },
      { type: 'ensureFile', path: `${P}\\school.txt`, content: 'draft' },
      { type: 'cwd', path: P },
    ],
    [
      {
        id: 'f10-intro',
        kind: 'concept',
        title: 'Deleting is serious',
        body: 'del removes a file. On a real machine that can be hard to undo. In this lab, deleted items go to Recycle Bin so you can restore them. Still treat delete as a command you mean.',
      },
      {
        id: 'f10-demo',
        kind: 'demo',
        title: 'Meet del',
        body: 'school.txt is leftover practice. del school.txt removes that file. rmdir removes an empty folder. rmdir /s removes a folder and its contents.',
        anatomy: anatomy('del school.txt', [
          { text: 'del', role: 'command' },
          { text: 'school.txt', role: 'argument' },
        ]),
      },
      {
        id: 'f10-try',
        kind: 'try',
        title: 'Remove school.txt',
        body: 'Delete school.txt from Projects. That is the only file this step asks you to remove.',
        prompt: 'school.txt should no longer exist in Projects.',
        example: 'del school.txt',
        answer: {
          command: 'del school.txt',
          parts: [
            { text: 'del', role: 'command' },
            { text: 'school.txt', role: 'argument' },
          ],
          explanation: 'del removes the named file from the current directory. In this lab it lands in Recycle Bin.',
        },
        guidance: 'semi',
        highlightTerminal: true,
        hints: [
          'You need the command that deletes a file.',
          'The Windows command is three letters.',
          'Type del school.txt',
        ],
        validators: [{ type: 'filesystemNotExists', path: `${P}\\school.txt` }],
        xp: 10,
        successTitle: 'Deleted',
        successBody: 'school.txt is gone from Projects. In this lab you can still find it in Recycle Bin.',
      },
      {
        id: 'f10-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'del <file> removes a file. rmdir removes a folder. Pause before you delete anything you still need.',
      },
    ],
  ),

  filesLesson(
    18,
    'files-11',
    'Files Challenge',
    'Build a small project tree from memory. No step-by-step answers.',
    20,
    HOME,
    [{ type: 'cwd', path: HOME }],
    [
      {
        id: 'f11-intro',
        kind: 'intro',
        title: 'Practical exam',
        body: 'Use what you learned. Create this tree somewhere under your home directory. The lab checks the folders and files, not the exact commands or the order you use.',
      },
      {
        id: 'f11-mission',
        kind: 'mission',
        title: 'Build the project',
        body: 'Create this structure:\n\nC:\\Users\\Student\\Projects\n    Website\n        index.html\n    Notes\n        ideas.txt\n\nYou may cd around, use full paths, or mix both. dir is fair if you need to look.',
        prompt: 'Projects should contain Website\\index.html and Notes\\ideas.txt.',
        guidance: 'independent',
        highlightTerminal: true,
        hints: [
          'Start by making sure a Projects folder exists in your home directory.',
          'Website and Notes are folders inside Projects. index.html and ideas.txt are files inside those folders.',
          'Create the folders first, then the files. touch creates a file. mkdir creates a directory.',
        ],
        answer: {
          command:
            'mkdir Projects\ncd Projects\nmkdir Website\ntouch Website\\index.html\nmkdir Notes\ntouch Notes\\ideas.txt',
          explanation:
            'Folders before the files that go inside them. Any order or path style is accepted as long as the finished tree matches.',
        },
        validators: [
          { type: 'filesystemExists', path: P, entityType: 'directory' },
          { type: 'filesystemExists', path: `${P}\\Website`, entityType: 'directory' },
          { type: 'filesystemExists', path: `${P}\\Website\\index.html`, entityType: 'file' },
          { type: 'filesystemExists', path: `${P}\\Notes`, entityType: 'directory' },
          { type: 'filesystemExists', path: `${P}\\Notes\\ideas.txt`, entityType: 'file' },
        ],
        xp: 80,
        successTitle: 'Tree complete',
        successBody: 'Projects holds Website and Notes, with the two files in the right places. That is a real workspace.',
      },
      {
        id: 'f11-summary',
        kind: 'summary',
        title: 'What you learned',
        body: 'You can list, create, navigate, name paths, make files, rename, copy, move, delete, recall commands, complete names with Tab, print files, and ask for help. That is the Files track.',
      },
    ],
  ),

  filesLesson(
    11,
    'files-12',
    'Command History',
    'Arrow Up recalls what you already typed.',
    10,
    HOME,
    [{ type: 'cwd', path: HOME }],
    [
      {
        id: 'f12-intro',
        kind: 'concept',
        title: 'You do not retype everything',
        body: 'The terminal remembers commands you already ran in this session. Arrow Up walks backward through that list. Arrow Down walks forward. This is how people stay fast without memorizing long lines.',
      },
      {
        id: 'f12-try',
        kind: 'try',
        title: 'Leave a command to recall',
        body: 'Run echo History so the terminal has something to remember.',
        prompt: 'Type echo History and press Enter.',
        example: 'echo History',
        answer: {
          command: 'echo History',
          explanation: 'This prints History and stores the line so Arrow Up can bring it back.',
        },
        guidance: 'guided',
        highlightTerminal: true,
        hints: ['The command that prints text is echo.', 'Type echo History.'],
        validators: [{ type: 'commandExecuted', command: 'echo', argsInclude: ['History'] }],
        xp: 5,
        successTitle: 'Stored',
        successBody: 'That line is now in this session’s history.',
      },
      {
        id: 'f12-recall',
        kind: 'try',
        title: 'Recall with Arrow Up',
        body: 'Click the Terminal. Press Arrow Up until you see echo History, then press Enter. Do not retype it if you can avoid it.',
        prompt: 'Recall echo History with Arrow Up and run it again.',
        example: 'echo History',
        answer: {
          command: 'echo History',
          explanation: 'Arrow Up fills the input with a previous line. Enter runs it again.',
        },
        guidance: 'semi',
        highlightTerminal: true,
        hints: ['Use the Up arrow key, not a mouse menu.', 'Stop when the line reads echo History, then Enter.'],
        validators: [{ type: 'commandExecuted', command: 'echo' }],
        xp: 5,
        successTitle: 'Recalled',
        successBody: 'History is a list, not a file. Closing the Terminal window clears this session’s list.',
      },
    ],
  ),

  filesLesson(
    12,
    'files-13',
    'Tab Completion',
    'Tab finishes a name so you type less and misspell less.',
    10,
    HOME,
    [
      { type: 'ensureFolder', path: `${HOME}\\Documents` },
      { type: 'cwd', path: HOME },
    ],
    [
      {
        id: 'f13-intro',
        kind: 'concept',
        title: 'The terminal can finish the word',
        body: 'Type the start of a command or a folder name, then press Tab. If only one match exists, the rest of the name appears. If several match, Tab fills the shared prefix.',
      },
      {
        id: 'f13-try',
        kind: 'try',
        title: 'Complete dir',
        body: 'Type di and press Tab. The command should become dir. Then press Enter to list this folder.',
        prompt: 'Use Tab to turn di into dir, then run it.',
        example: 'dir',
        answer: {
          command: 'dir',
          explanation: 'Tab completed di to dir because dir is the only command that starts that way here.',
        },
        guidance: 'guided',
        highlightTerminal: true,
        hints: ['Type the first two letters, then Tab, then Enter.', 'ls also lists, but this step wants dir.'],
        validators: [{ type: 'commandExecuted', command: 'dir' }],
        xp: 10,
        successTitle: 'Completed',
        successBody: 'Tab is for names on disk too: cd Doc then Tab usually becomes Documents.',
      },
    ],
  ),

  filesLesson(
    13,
    'files-14',
    'Print Working Directory',
    'pwd names the folder in the prompt, in case the prompt is hard to read.',
    10,
    `${HOME}\\Documents`,
    [
      { type: 'ensureFolder', path: `${HOME}\\Documents` },
      { type: 'cwd', path: `${HOME}\\Documents` },
    ],
    [
      {
        id: 'f14-intro',
        kind: 'concept',
        title: 'Where am I?',
        body: 'The prompt already shows the current directory. pwd prints that same path as output, which is useful when the prompt is clipped or you want to copy the path.',
      },
      {
        id: 'f14-try',
        kind: 'try',
        title: 'Ask for the path',
        body: 'You are inside Documents. Print the working directory.',
        prompt: 'Run pwd.',
        example: 'pwd',
        answer: {
          command: 'pwd',
          explanation: 'pwd means print working directory. It does not move you.',
        },
        guidance: 'guided',
        highlightTerminal: true,
        hints: ['Three letters. Starts with p.', 'Type pwd and press Enter.'],
        validators: [{ type: 'commandExecuted', command: 'pwd' }],
        xp: 10,
        successTitle: 'Located',
        successBody: 'The printed path should match the text before > in the prompt.',
      },
    ],
  ),

  filesLesson(
    14,
    'files-15',
    'Read a File',
    'type prints a file’s text without opening an editor.',
    10,
    `${HOME}\\Documents`,
    [
      { type: 'ensureFile', path: `${HOME}\\Documents\\note.txt`, content: 'Ship the Files track.' },
      { type: 'cwd', path: `${HOME}\\Documents` },
    ],
    [
      {
        id: 'f15-intro',
        kind: 'concept',
        title: 'Look inside without leaving',
        body: 'type filename prints the file to the terminal. It does not change the file. Windows uses type; some systems use cat. This lab teaches type.',
      },
      {
        id: 'f15-try',
        kind: 'try',
        title: 'Read note.txt',
        body: 'Documents holds note.txt. Print its contents.',
        prompt: 'Read note.txt with type.',
        example: 'type note.txt',
        anatomy: anatomy('type note.txt', [
          { text: 'type', role: 'command' },
          { text: 'note.txt', role: 'argument' },
        ]),
        answer: {
          command: 'type note.txt',
          explanation: 'type followed by the file name prints the text stored in that file.',
        },
        guidance: 'guided',
        highlightTerminal: true,
        hints: ['The command is type.', 'The file is note.txt in the current directory.'],
        validators: [{ type: 'commandExecuted', command: 'type', argsInclude: ['note.txt'] }],
        xp: 10,
        successTitle: 'Read',
        successBody: 'You should see: Ship the Files track.',
      },
    ],
  ),

  filesLesson(
    15,
    'files-16',
    'Ask for Help',
    'help lists commands. help name describes one command.',
    10,
    HOME,
    [{ type: 'cwd', path: HOME }],
    [
      {
        id: 'f16-intro',
        kind: 'concept',
        title: 'The lab can describe itself',
        body: 'help with no extra words lists the commands this terminal knows. help dir describes dir. Use it when you remember a name but not the shape.',
      },
      {
        id: 'f16-try',
        kind: 'try',
        title: 'Open the catalog',
        body: 'Ask the terminal for the command list.',
        prompt: 'Run help.',
        example: 'help',
        answer: { command: 'help', explanation: 'help on its own prints the catalog.' },
        guidance: 'guided',
        highlightTerminal: true,
        hints: ['Four letters.', 'Type help and press Enter.'],
        validators: [{ type: 'commandExecuted', command: 'help' }],
        xp: 10,
        successTitle: 'Catalog open',
        successBody: 'You can also run help type or help mkdir for a single command.',
      },
    ],
  ),

  filesLesson(
    16,
    'files-17',
    'Sort the Downloads',
    'A short real job: folders, moves, and a check with dir.',
    15,
    `${HOME}\\Downloads`,
    [
      { type: 'ensureFile', path: `${HOME}\\Downloads\\report.docx`, content: 'doc' },
      { type: 'ensureFile', path: `${HOME}\\Downloads\\shot.png`, content: 'png' },
      { type: 'ensureFile', path: `${HOME}\\Downloads\\notes.txt`, content: 'notes' },
      { type: 'cwd', path: `${HOME}\\Downloads` },
    ],
    [
      {
        id: 'f17-brief',
        kind: 'intro',
        title: 'A pile on Downloads',
        body: 'Three files are sitting loose in Downloads: a document, an image, and a text file. Put them into Docs, Images, and Text folders. dir should show only those three folders when you are done.',
      },
      {
        id: 'f17-job',
        kind: 'mission',
        title: 'Sort the three files',
        body: 'Make Docs, Images, and Text. Move report.docx, shot.png, and notes.txt into the matching folder.',
        prompt: 'Finish with Downloads\\Docs\\report.docx, Downloads\\Images\\shot.png, and Downloads\\Text\\notes.txt.',
        guidance: 'independent',
        highlightTerminal: true,
        hints: [
          'mkdir makes the folders. move puts each file inside one.',
          'dir checks what is left in Downloads.',
        ],
        answer: {
          command:
            'mkdir Docs\nmkdir Images\nmkdir Text\nmove report.docx Docs\nmove shot.png Images\nmove notes.txt Text',
          explanation: 'Folders first, then each file into the folder that matches its kind.',
        },
        validators: [
          { type: 'filesystemExists', path: `${HOME}\\Downloads\\Docs\\report.docx`, entityType: 'file' },
          { type: 'filesystemExists', path: `${HOME}\\Downloads\\Images\\shot.png`, entityType: 'file' },
          { type: 'filesystemExists', path: `${HOME}\\Downloads\\Text\\notes.txt`, entityType: 'file' },
        ],
        xp: 15,
        successTitle: 'Sorted',
        successBody: 'Downloads is a set of folders instead of a pile. That is a real terminal job.',
      },
    ],
  ),

  filesLesson(
    17,
    'files-18',
    'Read then Relocate',
    'Inspect a file, then put it where it belongs.',
    15,
    HOME,
    [
      { type: 'ensureFile', path: `${HOME}\\Desktop\\readme.txt`, content: 'Put this in Documents.' },
      { type: 'ensureFolder', path: `${HOME}\\Documents` },
      { type: 'cwd', path: HOME },
    ],
    [
      {
        id: 'f18-brief',
        kind: 'intro',
        title: 'Do not move it blindly',
        body: 'Desktop has readme.txt. Read it with type, then move it into Documents. This is how people check a file before they file it.',
      },
      {
        id: 'f18-job',
        kind: 'mission',
        title: 'Read, then move',
        body: 'type the file so you know what it is. Then move Desktop\\readme.txt into Documents.',
        prompt: 'Documents\\readme.txt should exist. Desktop\\readme.txt should not.',
        guidance: 'independent',
        highlightTerminal: true,
        hints: ['cd Desktop then type readme.txt. Then move it to ..\\Documents.', 'From home: type Desktop\\readme.txt then move Desktop\\readme.txt Documents.'],
        answer: {
          command: 'type Desktop\\readme.txt\nmove Desktop\\readme.txt Documents',
          explanation: 'Read first so you know it belongs in Documents. move then files it.',
        },
        validators: [
          { type: 'commandExecuted', command: 'type' },
          { type: 'filesystemExists', path: `${HOME}\\Documents\\readme.txt`, entityType: 'file' },
          { type: 'filesystemNotExists', path: `${HOME}\\Desktop\\readme.txt` },
        ],
        xp: 15,
        successTitle: 'Filed',
        successBody: 'You inspected the file, then put it in the right folder. That is the habit unit 7 is for.',
      },
    ],
  ),
];

export function lessonById(id: string): LessonDef | undefined {
  return FILES_LESSONS.find((l) => l.id === id);
}

export function nextLesson(id: string): LessonDef | undefined {
  const cur = lessonById(id);
  if (!cur) return FILES_LESSONS[0];
  return FILES_LESSONS.find((l) => l.order === cur.order + 1);
}

export function firstLesson(): LessonDef {
  return FILES_LESSONS[0];
}

export function isInteractiveKind(kind: TutorialStep['kind']): boolean {
  return kind === 'try' || kind === 'check' || kind === 'mission';
}
