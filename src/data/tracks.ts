import type { LessonDef } from '../types/tutorial';
import { FILES_LESSONS, lessonById } from './curriculum';

export type TrackStatus = 'available' | 'planned';

export interface UnitDef {
  id: string;
  name: string;
  summary: string;
  /** Lesson ids in teaching order. Empty means the unit is written but not built yet. */
  lessonIds: string[];
}

export interface TrackDef {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  status: TrackStatus;
  units: UnitDef[];
}

export const FILES_TRACK: TrackDef = {
  id: 'files',
  name: 'Files',
  tagline: 'Control files and directories from the terminal.',
  blurb:
    'Read the prompt, move between folders, and create, rename, copy, move, and delete things without touching a mouse.',
  status: 'available',
  units: [
    {
      id: 'files-u1',
      name: 'Terminal Rookie',
      summary: 'Read the prompt, run your first command, list a folder.',
      lessonIds: ['files-1', 'files-2'],
    },
    {
      id: 'files-u2',
      name: 'Finding Your Way',
      summary: 'Move between directories and name places with paths.',
      lessonIds: ['files-4', 'files-5'],
    },
    {
      id: 'files-u3',
      name: 'Building Things',
      summary: 'Create directories and files exactly where you want them.',
      lessonIds: ['files-3', 'files-6'],
    },
    {
      id: 'files-u4',
      name: 'File Management',
      summary: 'Rename, copy, move, and delete safely.',
      lessonIds: ['files-7', 'files-8', 'files-9', 'files-10'],
    },
    {
      id: 'files-u5',
      name: 'Working Efficiently',
      summary: 'History, tab completion, and the habits that make you fast.',
      lessonIds: [],
    },
    {
      id: 'files-u6',
      name: 'Search & Inspect',
      summary: 'Find files and read what is inside them from the terminal.',
      lessonIds: [],
    },
    {
      id: 'files-u7',
      name: 'Real Terminal Tasks',
      summary: 'Longer jobs modelled on work people actually do.',
      lessonIds: [],
    },
    {
      id: 'files-u8',
      name: 'Files Mastery',
      summary: 'One independent challenge. No step-by-step answers.',
      lessonIds: ['files-11'],
    },
  ],
};

export const PLANNED_TRACKS: TrackDef[] = [
  {
    id: 'systems',
    name: 'Systems',
    tagline: 'Processes, machine info, and system settings.',
    blurb: 'Not written yet.',
    status: 'planned',
    units: [],
  },
  {
    id: 'networking',
    name: 'Networking',
    tagline: 'Simulated ping, ipconfig, and host lookups.',
    blurb: 'Not written yet.',
    status: 'planned',
    units: [],
  },
  {
    id: 'git',
    name: 'Git',
    tagline: 'Version control from the command line.',
    blurb: 'Not written yet.',
    status: 'planned',
    units: [],
  },
  {
    id: 'development',
    name: 'Development',
    tagline: 'Build tools, scripts, and package managers.',
    blurb: 'Not written yet.',
    status: 'planned',
    units: [],
  },
  {
    id: 'servers',
    name: 'Servers',
    tagline: 'Remote machines, permissions, and services.',
    blurb: 'Not written yet.',
    status: 'planned',
    units: [],
  },
];

export const TRACKS: TrackDef[] = [FILES_TRACK, ...PLANNED_TRACKS];

export function trackById(id: string | undefined): TrackDef | undefined {
  return TRACKS.find((t) => t.id === id);
}

/** Every built lesson of a track, in unit order. This is the real teaching sequence. */
export function trackLessons(track: TrackDef = FILES_TRACK): LessonDef[] {
  return track.units.flatMap((u) => u.lessonIds.map((id) => lessonById(id)).filter((l): l is LessonDef => Boolean(l)));
}

export function unitOfLesson(lessonId: string, track: TrackDef = FILES_TRACK): UnitDef | undefined {
  return track.units.find((u) => u.lessonIds.includes(lessonId));
}

export function unitNumber(unitId: string, track: TrackDef = FILES_TRACK): number {
  return track.units.findIndex((u) => u.id === unitId) + 1;
}

/** 1-based position of a lesson within the whole track. */
export function lessonNumber(lessonId: string, track: TrackDef = FILES_TRACK): number {
  return trackLessons(track).findIndex((l) => l.id === lessonId) + 1;
}

export function lessonAfter(lessonId: string, track: TrackDef = FILES_TRACK): LessonDef | undefined {
  const lessons = trackLessons(track);
  const i = lessons.findIndex((l) => l.id === lessonId);
  if (i < 0) return lessons[0];
  return lessons[i + 1];
}

/** Lessons that exist in curriculum but no unit claims. Guards against orphaned content. */
export function unassignedLessons(): LessonDef[] {
  const claimed = new Set(FILES_TRACK.units.flatMap((u) => u.lessonIds));
  return FILES_LESSONS.filter((l) => !claimed.has(l.id));
}
