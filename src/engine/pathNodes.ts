import { MISSIONS } from '../data/missions';
import { FILES_TRACK, lessonNumber, trackLessons, unitOfLesson, type UnitDef } from '../data/tracks';
import type { UserProgress } from '../types';

export type NodeType = 'lesson' | 'practice' | 'mission' | 'checkpoint' | 'challenge';

/** Whether a node has been authored at all — independent of whether a learner can start it yet. */
export type NodeAvailability = 'available' | 'planned';

/** Whether a learner can act on an *authored* node right now. Never applies to a planned node. */
export type NodeProgressState = 'locked' | 'available' | 'current' | 'completed';

export interface PathNode {
  id: string;
  type: NodeType;
  unitId: string;
  title: string;
  subtitle: string;
  xp: number;
  /** Ids of other PathNodes that must be completed first — evaluated generically, never per-id `if`s. */
  prerequisiteIds: string[];
  availability: NodeAvailability;
}

/**
 * Generic prerequisite/progress evaluator (Non-negotiable #7 in the implementation plan): a
 * node's state is derived purely from its declared `prerequisiteIds` against what's actually
 * completed, never from a hardcoded per-node branch. Planned nodes never reach this function with
 * a meaningful answer — check `availability` first.
 */
export function evaluateProgressState(
  node: Pick<PathNode, 'id' | 'prerequisiteIds'>,
  completedIds: ReadonlySet<string>,
  currentId: string | null,
): NodeProgressState {
  if (completedIds.has(node.id)) return 'completed';
  if (node.id === currentId) return 'current';
  const unmet = node.prerequisiteIds.some((id) => !completedIds.has(id));
  return unmet ? 'locked' : 'available';
}

/** Every node id a learner has actually finished, across all node types — the evaluator's one input. */
export function completedNodeIds(progress: UserProgress): Set<string> {
  return new Set<string>([...progress.completedLessonIds, ...progress.completedMissionIds]);
}

function missionUnit(requiresLessonIds: string[]): UnitDef | undefined {
  const sorted = [...requiresLessonIds].sort((a, b) => lessonNumber(a) - lessonNumber(b));
  const last = sorted[sorted.length - 1];
  return last ? unitOfLesson(last) : undefined;
}

/**
 * Projects the Files track's existing lesson/mission data into the unified node model. This is
 * additive — LessonDef/MissionDef/tracks.ts are unchanged — so nothing about the existing lesson
 * path or mission library engine changes; this is purely a read-side view for the path UI and
 * for "Files Foundations vs Files Mastered" completion logic.
 */
export function filesPathNodes(): PathNode[] {
  const nodes: PathNode[] = [];

  // Chained across unit boundaries in overall teaching order (matches the existing
  // lessonState()/trackLessons() behavior: unit 2's first lesson requires unit 1's last, not
  // just "the previous lesson in this unit").
  let previousLessonId: string | null = null;
  for (const lesson of trackLessons(FILES_TRACK)) {
    const unit = unitOfLesson(lesson.id);
    nodes.push({
      id: lesson.id,
      type: 'lesson',
      unitId: unit?.id ?? '',
      title: lesson.title,
      subtitle: lesson.subtitle,
      xp: lesson.xp,
      prerequisiteIds: previousLessonId ? [previousLessonId] : [],
      availability: 'available',
    });
    previousLessonId = lesson.id;
  }

  for (const mission of MISSIONS) {
    const unit = missionUnit(mission.requiresLessonIds);
    nodes.push({
      id: mission.id,
      type: 'mission',
      unitId: unit?.id ?? '',
      title: mission.title,
      subtitle: mission.scenario,
      xp: mission.xp,
      prerequisiteIds: mission.requiresLessonIds,
      availability: 'available',
    });
  }

  return nodes;
}

/** Published-content completion — the denominator only ever counts authored (non-planned) nodes. */
export function publishedCompletion(progress: UserProgress): { done: number; total: number } {
  const nodes = filesPathNodes().filter((n) => n.availability === 'available');
  const completed = completedNodeIds(progress);
  return { done: nodes.filter((n) => completed.has(n.id)).length, total: nodes.length };
}

/**
 * "Files Foundations complete" (every published node done, while planned units remain) vs.
 * "Files mastered" (reserved for when the full intended curriculum has actually shipped) —
 * Non-negotiable #8. Never the stronger claim while any unit is still `planned`.
 */
export function filesCompletionLevel(progress: UserProgress): 'in-progress' | 'foundations-complete' | 'mastered' {
  const { done, total } = publishedCompletion(progress);
  if (total === 0 || done < total) return 'in-progress';
  const hasPlannedUnits = FILES_TRACK.units.some((u) => u.lessonIds.length === 0);
  return hasPlannedUnits ? 'foundations-complete' : 'mastered';
}
