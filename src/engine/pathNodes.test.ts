import { describe, expect, it } from 'vitest';
import { normalizeProgress } from './tutorial';
import {
  completedNodeIds,
  evaluateProgressState,
  filesCompletionLevel,
  filesPathNodes,
  publishedCompletion,
} from './pathNodes';

describe('filesPathNodes', () => {
  it('projects every authored lesson and mission, and nothing from planned units', () => {
    const nodes = filesPathNodes();
    expect(nodes.filter((n) => n.type === 'lesson')).toHaveLength(18);
    expect(nodes.filter((n) => n.type === 'mission')).toHaveLength(9);
    expect(nodes.some((n) => n.unitId === 'files-u5' || n.unitId === 'files-u6' || n.unitId === 'files-u7')).toBe(
      true,
    );
  });

  it('chains lesson prerequisites across unit boundaries, matching the existing path order', () => {
    const nodes = filesPathNodes();
    const first = nodes.find((n) => n.type === 'lesson');
    expect(first?.prerequisiteIds).toEqual([]);
    const secondUnitFirstLesson = nodes.find((n) => n.id === 'files-4'); // Unit 2's first built lesson
    expect(secondUnitFirstLesson?.prerequisiteIds).toEqual(['files-2']); // Unit 1 ends at files-2 (files-u1: [files-1, files-2])
  });

  it('gives every mission its real prerequisite lessons, not a per-id special case', () => {
    const nodes = filesPathNodes();
    const messyDesktop = nodes.find((n) => n.id === 'm-messy-desktop');
    expect(messyDesktop?.prerequisiteIds).toEqual(['files-2', 'files-3', 'files-9']);
  });
});

describe('evaluateProgressState', () => {
  it('is locked until every prerequisite is in the completed set', () => {
    const node = { id: 'b', prerequisiteIds: ['a'] };
    expect(evaluateProgressState(node, new Set(), null)).toBe('locked');
    expect(evaluateProgressState(node, new Set(['a']), null)).toBe('available');
  });

  it('reports current and completed independently of the prerequisite chain', () => {
    const node = { id: 'b', prerequisiteIds: ['a'] };
    expect(evaluateProgressState(node, new Set(['a']), 'b')).toBe('current');
    expect(evaluateProgressState(node, new Set(['a', 'b']), 'b')).toBe('completed');
  });

  it('a node with no prerequisites is available from the start', () => {
    expect(evaluateProgressState({ id: 'a', prerequisiteIds: [] }, new Set(), null)).toBe('available');
  });
});

describe('publishedCompletion / filesCompletionLevel', () => {
  it('counts only published nodes, never a future full-curriculum denominator', () => {
    const { total } = publishedCompletion(normalizeProgress({}));
    expect(total).toBe(27); // 18 lessons + 9 missions
  });

  it('stays "in-progress" until every published node is done', () => {
    expect(filesCompletionLevel(normalizeProgress({}))).toBe('in-progress');
  });

  it('reports "mastered" once every published node is done and no unit is planned', () => {
    const allNodeIds = filesPathNodes().map((n) => n.id);
    const progress = normalizeProgress({
      completedLessonIds: allNodeIds.filter((id) => id.startsWith('files-')),
      completedMissionIds: allNodeIds.filter((id) => id.startsWith('m-')),
    });
    expect(publishedCompletion(progress).done).toBe(publishedCompletion(progress).total);
    expect(filesCompletionLevel(progress)).toBe('mastered');
  });
});

describe('completedNodeIds', () => {
  it('merges completed lessons and missions into one set', () => {
    const progress = normalizeProgress({ completedLessonIds: ['files-1'], completedMissionIds: ['m-a'] });
    expect(completedNodeIds(progress)).toEqual(new Set(['files-1', 'm-a']));
  });
});
