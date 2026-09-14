import type { MissionDef, UserProgress } from '../types';
import { HOME } from '../engine/paths';
import type { VirtualFileSystem } from '../engine/virtualFileSystem';
import { lessonById } from './curriculum';

function at(vfs: VirtualFileSystem, path: string) {
  return vfs.findByPath(path);
}

function isFolder(vfs: VirtualFileSystem, path: string) {
  return at(vfs, path)?.type === 'folder';
}

function isFile(vfs: VirtualFileSystem, path: string) {
  return at(vfs, path)?.type === 'file';
}

const DESKTOP = `${HOME}\\Desktop`;
const DOCS = `${HOME}\\Documents`;
const PICS = `${HOME}\\Pictures`;
const DOWN = `${HOME}\\Downloads`;
const PROJ = `${HOME}\\Projects`;

/**
 * Missions apply skills a lesson already taught. Each one drops the learner into a
 * scenario with its own files and checks the finished state, never the keystrokes.
 */
export const MISSIONS: MissionDef[] = [
  {
    id: 'm-messy-desktop',
    order: 1,
    title: 'Messy Desktop',
    difficulty: 'Starter',
    scenario: 'Four loose files have piled up on the Desktop.',
    briefing:
      'Your Desktop has two text files and two images sitting loose. Sort them into a Notes folder and an Images folder so the Desktop is clean.',
    objective: 'Desktop\\Notes holds todo.txt and ideas.txt. Desktop\\Images holds logo.png and screenshot.png.',
    hint: 'mkdir makes the two folders. move puts each file inside one. dir shows what is left.',
    skills: ['dir', 'mkdir', 'move'],
    requiresLessonIds: ['files-2', 'files-3', 'files-9'],
    xp: 80,
    startCwd: DESKTOP,
    setup: [
      { type: 'ensureFile', path: `${DESKTOP}\\todo.txt`, content: 'buy milk' },
      { type: 'ensureFile', path: `${DESKTOP}\\ideas.txt`, content: 'app ideas' },
      { type: 'ensureFile', path: `${DESKTOP}\\logo.png`, content: 'png' },
      { type: 'ensureFile', path: `${DESKTOP}\\screenshot.png`, content: 'png' },
      { type: 'cwd', path: DESKTOP },
    ],
    check: ({ vfs }) =>
      isFile(vfs, `${DESKTOP}\\Notes\\todo.txt`) &&
      isFile(vfs, `${DESKTOP}\\Notes\\ideas.txt`) &&
      isFile(vfs, `${DESKTOP}\\Images\\logo.png`) &&
      isFile(vfs, `${DESKTOP}\\Images\\screenshot.png`),
  },
  {
    id: 'm-school-setup',
    order: 2,
    title: 'School Assignment Setup',
    difficulty: 'Starter',
    scenario: 'A new biology assignment needs somewhere to live.',
    briefing:
      'Set up a folder for a biology assignment inside Documents: a place for notes, plus an empty essay and a sources file ready to write in.',
    objective: 'Documents\\Biology contains a Notes folder, essay.txt, and sources.txt.',
    hint: 'mkdir for the folders, touch for the two files. cd into Biology first if that feels easier.',
    skills: ['mkdir', 'cd', 'touch'],
    requiresLessonIds: ['files-3', 'files-6'],
    xp: 90,
    startCwd: DOCS,
    setup: [
      { type: 'ensureFolder', path: DOCS },
      { type: 'cwd', path: DOCS },
    ],
    check: ({ vfs }) =>
      isFolder(vfs, `${DOCS}\\Biology`) &&
      isFolder(vfs, `${DOCS}\\Biology\\Notes`) &&
      isFile(vfs, `${DOCS}\\Biology\\essay.txt`) &&
      isFile(vfs, `${DOCS}\\Biology\\sources.txt`),
  },
  {
    id: 'm-photo-organizer',
    order: 3,
    title: 'Photo Organizer',
    difficulty: 'Intermediate',
    scenario: 'Pictures is one long list of unsorted images.',
    briefing:
      'Pictures holds two holiday photos, a birthday photo, and a screenshot. Give each kind its own folder so the album makes sense.',
    objective:
      'Pictures\\Holiday holds both holiday photos, Pictures\\Birthday holds birthday.jpg, Pictures\\Screenshots holds capture.png.',
    hint: 'Three folders, then move each file into the right one. Move takes one file at a time.',
    skills: ['mkdir', 'move', 'dir'],
    requiresLessonIds: ['files-3', 'files-9'],
    xp: 120,
    startCwd: PICS,
    setup: [
      { type: 'ensureFile', path: `${PICS}\\holiday-1.jpg`, content: 'jpg' },
      { type: 'ensureFile', path: `${PICS}\\holiday-2.jpg`, content: 'jpg' },
      { type: 'ensureFile', path: `${PICS}\\birthday.jpg`, content: 'jpg' },
      { type: 'ensureFile', path: `${PICS}\\capture.png`, content: 'png' },
      { type: 'cwd', path: PICS },
    ],
    check: ({ vfs }) =>
      isFile(vfs, `${PICS}\\Holiday\\holiday-1.jpg`) &&
      isFile(vfs, `${PICS}\\Holiday\\holiday-2.jpg`) &&
      isFile(vfs, `${PICS}\\Birthday\\birthday.jpg`) &&
      isFile(vfs, `${PICS}\\Screenshots\\capture.png`),
  },
  {
    id: 'm-lost-file',
    order: 4,
    title: 'Lost File',
    difficulty: 'Intermediate',
    scenario: 'Chemistry homework was saved in Downloads under a useless name.',
    briefing:
      'Downloads\\temp holds untitled.txt — it is actually your chemistry homework. Give it a real name and file it under Documents\\School. Nothing should be left in Downloads\\temp.',
    objective: 'Documents\\School\\chemistry.txt exists and Downloads\\temp\\untitled.txt is gone.',
    hint: 'You can cd into Downloads\\temp to look first. ren changes the name, move relocates it, and School has to exist before anything can move into it.',
    skills: ['cd', 'dir', 'ren', 'move'],
    requiresLessonIds: ['files-4', 'files-7', 'files-9'],
    xp: 110,
    startCwd: HOME,
    setup: [
      { type: 'ensureFile', path: `${DOWN}\\temp\\untitled.txt`, content: 'chemistry homework' },
      { type: 'ensureFolder', path: DOCS },
      { type: 'cwd', path: HOME },
    ],
    check: ({ vfs }) =>
      isFile(vfs, `${DOCS}\\School\\chemistry.txt`) && !isFile(vfs, `${DOWN}\\temp\\untitled.txt`),
  },
  {
    id: 'm-dev-workspace',
    order: 5,
    title: 'Developer Workspace',
    difficulty: 'Advanced',
    scenario: 'A new web project starts as an empty folder.',
    briefing:
      'Build the skeleton of a small website project under Projects\\app: a README at the top, a src folder holding index.html and styles.css, and an empty tests folder.',
    objective: 'Projects\\app has README.md, src\\index.html, src\\styles.css, and a tests folder.',
    hint: 'Create folders before the files that go inside them. Full paths like touch src\\styles.css save you a cd.',
    skills: ['mkdir', 'touch', 'cd', 'paths'],
    requiresLessonIds: ['files-5', 'files-6'],
    xp: 150,
    startCwd: HOME,
    setup: [
      { type: 'ensureFolder', path: PROJ },
      { type: 'cwd', path: PROJ },
    ],
    check: ({ vfs }) =>
      isFile(vfs, `${PROJ}\\app\\README.md`) &&
      isFile(vfs, `${PROJ}\\app\\src\\index.html`) &&
      isFile(vfs, `${PROJ}\\app\\src\\styles.css`) &&
      isFolder(vfs, `${PROJ}\\app\\tests`),
  },
  {
    id: 'm-cleanup-duty',
    order: 6,
    title: 'Cleanup Duty',
    difficulty: 'Advanced',
    scenario: 'An old scratch folder is full of junk, but one file matters.',
    briefing:
      'Projects\\old holds two throwaway .tmp files and one file worth keeping. Put a copy of keep.txt somewhere safe in Projects\\Backup, then get rid of Projects\\old entirely.',
    objective: 'Projects\\Backup\\keep.txt exists and Projects\\old no longer exists.',
    hint: 'Copy before you delete. rmdir refuses a folder that still has files in it — empty it first, or use rmdir /s.',
    skills: ['copy', 'del', 'rmdir'],
    requiresLessonIds: ['files-8', 'files-10'],
    xp: 140,
    startCwd: PROJ,
    setup: [
      { type: 'ensureFile', path: `${PROJ}\\old\\keep.txt`, content: 'important' },
      { type: 'ensureFile', path: `${PROJ}\\old\\temp1.tmp`, content: 'junk' },
      { type: 'ensureFile', path: `${PROJ}\\old\\temp2.tmp`, content: 'junk' },
      { type: 'cwd', path: PROJ },
    ],
    check: ({ vfs }) => isFile(vfs, `${PROJ}\\Backup\\keep.txt`) && !isFolder(vfs, `${PROJ}\\old`),
  },
  {
    id: 'm-inbox-sort',
    order: 7,
    title: 'Downloads Triage',
    difficulty: 'Intermediate',
    scenario: 'Downloads is a pile again: a PDF, a photo, and a text dump.',
    briefing:
      'Downloads has invoice.pdf, holiday.jpg, and dump.txt sitting loose. Make Docs, Photos, and Text folders and file each item. dir on Downloads should then show only folders.',
    objective: 'Downloads\\Docs\\invoice.pdf, Downloads\\Photos\\holiday.jpg, and Downloads\\Text\\dump.txt exist.',
    hint: 'mkdir three folders, then move each file. type dump.txt first if you want to be sure it is text.',
    skills: ['mkdir', 'move', 'dir'],
    requiresLessonIds: ['files-17'],
    xp: 130,
    startCwd: DOWN,
    setup: [
      { type: 'ensureFile', path: `${DOWN}\\invoice.pdf`, content: 'pdf' },
      { type: 'ensureFile', path: `${DOWN}\\holiday.jpg`, content: 'jpg' },
      { type: 'ensureFile', path: `${DOWN}\\dump.txt`, content: 'plain text' },
      { type: 'cwd', path: DOWN },
    ],
    check: ({ vfs }) =>
      isFile(vfs, `${DOWN}\\Docs\\invoice.pdf`) &&
      isFile(vfs, `${DOWN}\\Photos\\holiday.jpg`) &&
      isFile(vfs, `${DOWN}\\Text\\dump.txt`),
  },
  {
    id: 'm-read-then-file',
    order: 8,
    title: 'Read Then File',
    difficulty: 'Intermediate',
    scenario: 'A note on the Desktop says where it belongs. Read it, then put it there.',
    briefing:
      'Desktop\\where.txt tells you to store it in Documents\\Filed. Read the file, make Filed if needed, and move the note there.',
    objective: 'Documents\\Filed\\where.txt exists and Desktop\\where.txt does not.',
    hint: 'type Desktop\\where.txt. mkdir Documents\\Filed if it is missing. move the file.',
    skills: ['type', 'mkdir', 'move'],
    requiresLessonIds: ['files-15', 'files-18'],
    xp: 140,
    startCwd: HOME,
    setup: [
      { type: 'ensureFile', path: `${DESKTOP}\\where.txt`, content: 'File me in Documents\\Filed.' },
      { type: 'ensureFolder', path: DOCS },
      { type: 'cwd', path: HOME },
    ],
    check: ({ vfs }) => isFile(vfs, `${DOCS}\\Filed\\where.txt`) && !isFile(vfs, `${DESKTOP}\\where.txt`),
  },
  {
    id: 'm-workspace-label',
    order: 9,
    title: 'Label the Workspace',
    difficulty: 'Advanced',
    scenario: 'A project folder exists. You need a README inside it that you can prove you wrote.',
    briefing:
      'Projects\\Lab already exists. Create readme.txt inside it with any text (echo or a touch plus later edits are fine in this lab — touch an empty file is enough), then prove you can print it with type.',
    objective: 'Projects\\Lab\\readme.txt exists.',
    hint: 'cd into Projects\\Lab or use a full path. touch readme.txt. type readme.txt to inspect it.',
    skills: ['cd', 'touch', 'type', 'pwd'],
    requiresLessonIds: ['files-14', 'files-15', 'files-6'],
    xp: 120,
    startCwd: HOME,
    setup: [
      { type: 'ensureFolder', path: `${PROJ}\\Lab` },
      { type: 'cwd', path: HOME },
    ],
    check: ({ vfs }) => isFile(vfs, `${PROJ}\\Lab\\readme.txt`),
  },
];

export function missionById(id: string | undefined): MissionDef | undefined {
  return MISSIONS.find((m) => m.id === id);
}

/** Lesson titles a learner still needs before a mission is fair. Empty means unlocked. */
export function missingSkillsFor(mission: MissionDef, progress: UserProgress): string[] {
  return mission.requiresLessonIds
    .filter((id) => !progress.completedLessonIds.includes(id))
    .map((id) => lessonById(id)?.title ?? id);
}

export function missionUnlocked(mission: MissionDef, progress: UserProgress): boolean {
  return missingSkillsFor(mission, progress).length === 0;
}

/** The next mission worth suggesting: unlocked, not finished, easiest first. */
export function recommendedMission(progress: UserProgress): MissionDef | undefined {
  return MISSIONS.find((m) => !progress.completedMissionIds.includes(m.id) && missionUnlocked(m, progress));
}
