import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lightbulb,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { missionById, missingSkillsFor } from '../../data/missions';
import { levelFromXp, nextThreshold } from '../../data/player';
import { FILES_TRACK, lessonNumber, trackLessons, unitNumber } from '../../data/tracks';
import {
  activeLesson,
  activeStep,
  answerForStep,
  currentUnit,
  filesLessonProgress,
  hintLevel,
  isAnswerRevealed,
  isInteractiveKind,
  isLessonCompleteView,
  nextLesson,
  stepSupportsAnswer,
} from '../../engine/tutorial';
import { lessonXpEarned } from '../../engine/xp';
import { useOS, useOSApi } from '../../hooks/useOS';
import { CommandAnatomy } from './CommandAnatomy';
import { LabMotif } from './LabMotif';

export function AcademyApp() {
  const snap = useOS();
  const { progress, settings, cwd, coach, awaitingInput, onboardingPage, questionWrong } = snap;
  const api = useOSApi();
  const navigate = useNavigate();

  const lesson = activeLesson(progress);
  const step = activeStep(progress);
  const unit = currentUnit(progress);
  const completeView = isLessonCompleteView(progress);
  const missionMode = progress.academyTab === 'missions' && Boolean(progress.activeMissionId);
  const mission = missionById(progress.activeMissionId ?? undefined);

  const level = levelFromXp(progress.xp);
  const next = nextThreshold(progress.xp);
  const levelPct = next ? Math.min(100, Math.round((progress.xp / next) * 100)) : 100;

  const lessonMode = progress.onboardingComplete && !missionMode && !completeView;
  const answer = step ? answerForStep(step) : null;
  const revealed = step ? isAnswerRevealed(progress, step) : false;
  const stepDone = step ? progress.completedStepIds.includes(step.id) : false;
  const hintsLeft = step ? (step.hints?.length ?? 0) - hintLevel(progress, step) : 0;
  const lastStep = progress.currentStepIndex >= lesson.steps.length - 1;

  return (
    <div className="academy">
      <header className="academy-hero">
        <div className="academy-hero-row">
          <div className="academy-hero-main">
            <p className="kicker">
              {missionMode ? 'Mission' : `${FILES_TRACK.name} track · Unit ${unitNumber(unit?.id ?? '')}`}
            </p>
            <h2>{missionMode ? (mission?.title ?? 'Mission') : lesson.title}</h2>
            <p className="academy-sub">
              {missionMode
                ? mission?.scenario
                : `Lesson ${lessonNumber(lesson.id)} of ${trackLessons().length} · ${unit?.name}`}
            </p>
          </div>
          <div className="academy-hero-side">
            <button
              type="button"
              className="hints-toggle"
              aria-pressed={settings.showHints}
              onClick={() => api.patchSettings({ showHints: !settings.showHints })}
            >
              {settings.showHints ? 'Hide hints' : 'Show hints'} <kbd>⌘2</kbd>
            </button>
            <LabMotif caption="Small commands. Big progress." />
          </div>
        </div>
        <div className="xp-line">
          <span>Player level {level}</span>
          <span>{next ? `${next - progress.xp} XP to level ${level + 1}` : `${progress.xp} XP`}</span>
        </div>
        <div
          className="xp-bar"
          role="progressbar"
          aria-valuenow={levelPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="XP toward next player level"
        >
          <span style={{ width: `${levelPct}%` }} />
        </div>
        <p className="academy-where">
          <span>Current directory:</span>
          <strong>{cwd}</strong>
        </p>
      </header>

      <div className={`academy-main${lessonMode ? ' has-rail' : ''}`}>
        {lessonMode && <StepRail />}
        <div className="academy-body">
          {!progress.onboardingComplete ? (
            <Onboarding page={onboardingPage} />
          ) : missionMode ? (
            <MissionPane />
          ) : completeView ? (
            <LessonCompleteCard />
          ) : (
            <LearnPane />
          )}
        </div>
      </div>

      <footer className="academy-footer">
        {lessonMode && (
          <>
            <button
              type="button"
              className="act"
              disabled={hintsLeft <= 0 || stepDone}
              title={hintsLeft <= 0 ? 'No hints left for this step' : undefined}
              onClick={() => {
                if (!settings.showHints) api.patchSettings({ showHints: true });
                api.revealHint();
              }}
            >
              <Lightbulb size={14} strokeWidth={1.7} />
              Need a hint
            </button>
            <button
              type="button"
              className="act"
              disabled={!step || !stepSupportsAnswer(step) || stepDone || !answer}
              title={step && stepSupportsAnswer(step) ? undefined : 'This step has nothing to type yet'}
              onClick={() => (revealed ? api.hideAnswer() : api.showAnswer())}
            >
              {revealed ? <EyeOff size={14} strokeWidth={1.7} /> : <Eye size={14} strokeWidth={1.7} />}
              {revealed ? 'Hide answer' : 'Show answer'}
            </button>
            <button type="button" className="act" onClick={() => api.retryStep()}>
              <RotateCcw size={14} strokeWidth={1.7} />
              Retry step
            </button>
            <button
              type="button"
              className="act"
              onClick={() =>
                api.askConfirm({
                  title: 'Restart this lesson?',
                  body: 'The simulated disk returns to this lesson’s starting folders and steps start again. XP you already earned stays.',
                  confirmLabel: 'Restart lesson',
                  danger: true,
                  onConfirm: () => api.restartLesson(),
                })
              }
            >
              <RefreshCw size={14} strokeWidth={1.7} />
              Restart lesson
            </button>
          </>
        )}
        {missionMode && (
          <>
            <button type="button" className="act" onClick={() => api.restartMission()}>
              <RefreshCw size={14} strokeWidth={1.7} />
              Reset scenario
            </button>
            <button type="button" className="act" onClick={() => navigate('/missions')}>
              Leave mission
            </button>
          </>
        )}
        {!missionMode && !completeView && (
          <button
            type="button"
            className="btn-primary act-next"
            disabled={!canContinue(progress, step, completeView, missionMode)}
            title={canContinue(progress, step, completeView, missionMode) ? undefined : 'Finish this step first'}
            onClick={() => api.continueTutorial()}
          >
            {!progress.onboardingComplete ? 'Continue' : lastStep ? 'Finish lesson' : 'Next step'}
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        )}
      </footer>
    </div>
  );

  function StepRail() {
    return (
      <nav className="step-rail" aria-label="Lesson steps">
        <ol>
          {lesson.steps.map((s, i) => {
            const done = progress.completedStepIds.includes(s.id) || i < progress.currentStepIndex;
            const now = i === progress.currentStepIndex;
            return (
              <li key={s.id} className={done ? 'is-done' : now ? 'is-now' : 'is-next'}>
                <span className="rail-dot" aria-hidden>
                  {done ? <Check size={12} strokeWidth={2.6} /> : i + 1}
                </span>
                <span className="rail-label">{s.title}</span>
                {now && <span className="sr-only">(current step)</span>}
              </li>
            );
          })}
        </ol>
        <p className="rail-quote">“Same tools. New possibilities.”</p>
      </nav>
    );
  }

  function LearnPane() {
    if (!step) return null;
    const satisfied = progress.completedStepIds.includes(step.id);
    const waiting = (isInteractiveKind(step.kind) || step.kind === 'question') && !satisfied;
    const hintsShown = settings.showHints ? hintLevel(progress, step) : 0;
    const totalHints = step.hints?.length ?? 0;
    const answer = answerForStep(step);
    const revealed = isAnswerRevealed(progress, step);
    const canAsk = stepSupportsAnswer(step) && waiting;

    return (
      <article className="lesson-card">
        <p className="lesson-kicker">
          {kindLabel(step.kind)} · Step {progress.currentStepIndex + 1} of {lesson.steps.length}
        </p>
        <h3>{step.title}</h3>

        {step.body.split('\n').map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}

        {step.anatomy && <CommandAnatomy anatomy={step.anatomy} />}

        {step.prompt && (
          <p className="objective">
            <strong>{waiting ? 'Your turn.' : 'Objective.'}</strong> {step.prompt}
          </p>
        )}

        {/* Guided steps used to print the command for free. The answer panel covers that
            now, so the ladder is objective → hint → answer. */}
        {step.example && !satisfied && !step.anatomy && !answer && (
          <p className="cmd-example">
            <code>{step.example}</code>
          </p>
        )}

        {step.kind === 'question' && step.question && (
          <div className="quiz" role="group" aria-label="Knowledge check">
            <p className="objective">{step.question.prompt}</p>
            {step.question.choices.map((c) => {
              const selectedWrong = questionWrong === c.id;
              const correct = satisfied && c.id === step.question?.correctId;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`quiz-choice${selectedWrong ? ' is-bad' : ''}${correct ? ' is-ok' : ''}`}
                  disabled={satisfied}
                  onClick={() => api.answerQuestion(c.id)}
                >
                  <span className="quiz-id">{c.id.toUpperCase()}</span>
                  <span className="quiz-label">{c.label}</span>
                  {correct && (
                    <span className="quiz-mark" aria-hidden>
                      <Check size={13} strokeWidth={2.6} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback sits under the task, the way it reads on paper: question, then verdict. */}
        <div className="coach-slot" role="status" aria-live="polite">
          {satisfied && (coach?.tone === 'ok' || !coach) && (
            <div className="coach is-ok">
              <span className="coach-mark" aria-hidden>
                <Check size={13} strokeWidth={2.6} />
              </span>
              <div>
                <p>
                  <strong>{coach?.title ?? step.successTitle ?? 'Correct'}</strong>
                </p>
                <p>{coach?.body ?? step.successBody}</p>
              </div>
            </div>
          )}
          {waiting && awaitingInput && !coach && <p className="waiting-line">Waiting for you to use the Terminal…</p>}
          {!satisfied && coach && coach.tone !== 'ok' && (
            <div className={`coach is-${coach.tone}`}>
              <p>
                <strong>
                  {coach.tone === 'try' ? '! Try again' : 'Note'} · {coach.title}
                </strong>
              </p>
              <p>{coach.body}</p>
            </div>
          )}
        </div>

        {waiting && settings.showHints && hintsShown > 0 && (
          <div className="hint-stack">
            {step.hints?.slice(0, hintsShown).map((h, i) => (
              <p key={h} className="hint">
                Hint {i + 1}. {h}
              </p>
            ))}
            {hintsShown < totalHints && <p className="hint-more">More hints available below.</p>}
          </div>
        )}

        {/* Revealed by the footer's Show answer button. Never auto-runs anything. */}
        {canAsk && answer && revealed && (
          <div className="answer-card">
            <p className="brief-label">Answer</p>
            {answer.command && (
              <pre className="answer-command">
                <code>{answer.command}</code>
              </pre>
            )}
            {answer.label && <p className="answer-label">Correct answer: {answer.label}</p>}
            {answer.parts && <CommandAnatomy anatomy={{ line: answer.command ?? '', parts: answer.parts }} />}
            <p className="answer-explain">{answer.explanation}</p>
            {step.kind === 'question' ? (
              <p className="hint">Pick that choice above to record it.</p>
            ) : (
              <>
                <p className="hint">Now try it in Terminal. Any command that produces the same result counts.</p>
                <div className="row-actions">
                  <button type="button" className="btn-primary" onClick={() => api.focusTerminal()}>
                    Focus Terminal
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </article>
    );
  }

  function MissionPane() {
    if (!mission) return null;
    const done = progress.completedMissionIds.includes(mission.id);
    const missing = missingSkillsFor(mission, progress);
    return (
      <article className="lesson-card">
        <p className="lesson-kicker">{mission.difficulty} mission</p>
        <h3>{mission.title}</h3>
        <div className="coach-slot" role="status" aria-live="polite">
          {done && (
            <div className="coach is-ok">
              <p>
                <strong>✓ Mission complete</strong>
              </p>
              <p>The finished state matches the objective.</p>
            </div>
          )}
          {!done && coach && (
            <div className={`coach is-${coach.tone}`}>
              <p>
                <strong>{coach.title}</strong>
              </p>
              <p>{coach.body}</p>
            </div>
          )}
          {!done && !coach && <p className="waiting-line">Waiting for you to use the Terminal…</p>}
        </div>
        <p>{mission.briefing}</p>
        <p className="objective">
          <strong>Objective.</strong> {mission.objective}
        </p>
        {missing.length > 0 && (
          <p className="hint">
            This mission expects skills from: {missing.join(', ')}. You can still try it.
          </p>
        )}
        {settings.showHints && <p className="hint">{mission.hint}</p>}
        <p className="reward">{mission.xp} XP</p>
        {done && (
          <div className="row-actions">
            <button type="button" className="btn-primary" onClick={() => navigate('/missions')}>
              Back to missions
            </button>
          </div>
        )}
      </article>
    );
  }

  function LessonCompleteCard() {
    const earned = lessonXpEarned(progress, lesson);
    const upcoming = nextLesson(lesson.id);
    const commands = [...new Set(lesson.steps.map((s) => s.anatomy?.line).filter((x): x is string => Boolean(x)))];
    return (
      <article className="lesson-card is-complete">
        <p className="brief-label">Lesson complete</p>
        <h3>{lesson.title}</h3>
        {commands.length > 0 && (
          <>
            <p>You learned:</p>
            <ul className="learned-list">
              {commands.map((c) => (
                <li key={c}>
                  <code>{c}</code>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="reward">XP earned: {earned}</p>
        <p className="lesson-meta">
          {filesLessonProgress(progress).done} of {filesLessonProgress(progress).total} Files lessons complete
        </p>
        <div className="row-actions">
          {upcoming ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                api.goNextLesson();
                navigate(`/academy/files/${upcoming.id}`);
              }}
            >
              Continue to next lesson
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={() => navigate('/missions')}>
              Try a mission
            </button>
          )}
          <button type="button" onClick={() => navigate('/learn/files')}>
            Back to path
          </button>
        </div>
      </article>
    );
  }
}

function Onboarding({ page }: { page: number }) {
  if (page === 0) {
    return (
      <article className="lesson-card">
        <p className="brief-label">Welcome</p>
        <h3>This is the lab</h3>
        <p>
          Academy is this panel: it explains one step at a time. The Terminal beside it is a real simulated command
          prompt. Nothing you type reaches your own computer, so experiment freely.
        </p>
      </article>
    );
  }
  return (
    <article className="lesson-card">
      <p className="brief-label">How a step works</p>
      <h3>Read, then type</h3>
      <p>
        Each step explains a command and then asks you to run it. The lab watches the simulated filesystem, so any
        command that produces the right result counts — there is no single exact line to guess.
      </p>
      <p>Stuck? Ask for a hint, or reveal the answer. You still type it yourself.</p>
    </article>
  );
}

function kindLabel(kind: string): string {
  if (kind === 'try' || kind === 'check') return 'Your turn';
  if (kind === 'mission') return 'Challenge';
  if (kind === 'question') return 'Checkpoint';
  if (kind === 'demo') return 'Command';
  if (kind === 'summary') return 'Review';
  return 'Lesson';
}

function canContinue(
  progress: ReturnType<typeof useOS>['progress'],
  step: ReturnType<typeof activeStep>,
  completeView: boolean,
  missionMode: boolean,
): boolean {
  if (!progress.onboardingComplete) return true;
  if (missionMode) return false;
  if (completeView) return false;
  if (!step) return false;
  if (isInteractiveKind(step.kind) || step.kind === 'question') return progress.completedStepIds.includes(step.id);
  return true;
}
