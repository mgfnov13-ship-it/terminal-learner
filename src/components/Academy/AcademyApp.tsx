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
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { useOS, useOSApi } from '../../hooks/useOS';
import {
  lessonTitle,
  localizeLesson,
  missionField,
  missionTitle,
  trackName,
  unitName,
} from '../../lib/localizeContent';
import { CommandAnatomy } from './CommandAnatomy';
import { LabMotif } from './LabMotif';

export function AcademyApp() {
  const snap = useOS();
  const { progress, settings, cwd, coach, awaitingInput, onboardingPage, questionWrong } = snap;
  const api = useOSApi();
  const navigate = useNavigate();
  const { t, bi, language } = usePreferences();

  const rawLesson = activeLesson(progress);
  const lesson = localizeLesson(rawLesson, language);
  const step = lesson.steps[progress.currentStepIndex] ?? activeStep(progress);
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
              {missionMode
                ? t('mission')
                : `${trackName(FILES_TRACK.id, language)} · ${t('unit')} ${unitNumber(unit?.id ?? '')}`}
            </p>
            <h2>
              {missionMode
                ? missionTitle(mission?.id ?? '', language, mission?.title ?? t('mission'))
                : lesson.title}
            </h2>
            <p className="academy-sub">
              {missionMode
                ? missionField(mission?.id ?? '', 'scenario', language, mission?.scenario ?? '')
                : `${t('lesson')} ${lessonNumber(lesson.id)} ${bi({ en: 'of', ar: 'من' })} ${trackLessons().length} · ${unitName(unit?.id ?? '', language, unit?.name ?? '')}`}
            </p>
          </div>
          <div className="academy-hero-side">
            <button
              type="button"
              className="hints-toggle"
              aria-pressed={settings.showHints}
              onClick={() => api.patchSettings({ showHints: !settings.showHints })}
            >
              {settings.showHints ? t('hideHints') : t('showHints')} <kbd>⌘2</kbd>
            </button>
            <LabMotif caption={bi({ en: 'Small commands. Big progress.', ar: 'أوامر صغيرة. تقدّم كبير.' })} />
          </div>
        </div>
        <div className="xp-line">
          <span>
            {t('player')} {t('level')} {level}
          </span>
          <span>{next ? `${next - progress.xp} XP ${bi({ en: 'to level', ar: 'حتى المستوى' })} ${level + 1}` : `${progress.xp} XP`}</span>
        </div>
        <div
          className="xp-bar"
          role="progressbar"
          aria-valuenow={levelPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('xpTowardLevel')}
        >
          <span style={{ width: `${levelPct}%` }} />
        </div>
        <p className="academy-where">
          <span>{t('currentDirectory')}</span>
          <strong dir="ltr" lang="en">{cwd}</strong>
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
              title={hintsLeft <= 0 ? bi({ en: 'No hints left for this step', ar: 'لا تلميحات متبقية لهذه الخطوة' }) : undefined}
              onClick={() => {
                if (!settings.showHints) api.patchSettings({ showHints: true });
                api.revealHint();
              }}
            >
              <Lightbulb size={14} strokeWidth={1.7} />
              {t('needHint')}
            </button>
            <button
              type="button"
              className="act"
              disabled={!step || !stepSupportsAnswer(step) || stepDone || !answer}
              title={step && stepSupportsAnswer(step) ? undefined : bi({ en: 'This step has nothing to type yet', ar: 'هذه الخطوة ليس فيها ما يُكتب بعد' })}
              onClick={() => (revealed ? api.hideAnswer() : api.showAnswer())}
            >
              {revealed ? <EyeOff size={14} strokeWidth={1.7} /> : <Eye size={14} strokeWidth={1.7} />}
              {revealed ? t('hideAnswer') : t('showAnswer')}
            </button>
            <button type="button" className="act" onClick={() => api.retryStep()}>
              <RotateCcw size={14} strokeWidth={1.7} />
              {t('retryStep')}
            </button>
            <button
              type="button"
              className="act"
              onClick={() =>
                api.askConfirm({
                  title: bi({ en: 'Restart this lesson?', ar: 'إعادة هذا الدرس؟' }),
                  body: bi({
                    en: 'The simulated disk returns to this lesson’s starting folders and steps start again. XP you already earned stays.',
                    ar: 'يعود القرص المحاكى إلى مجلدات بداية هذا الدرس وتبدأ الخطوات من جديد. نقاط الخبرة التي كسبتها تبقى.',
                  }),
                  confirmLabel: t('restartLesson'),
                  danger: true,
                  onConfirm: () => api.restartLesson(),
                })
              }
            >
              <RefreshCw size={14} strokeWidth={1.7} />
              {t('restartLesson')}
            </button>
          </>
        )}
        {missionMode && (
          <>
            <button type="button" className="act" onClick={() => api.restartMission()}>
              <RefreshCw size={14} strokeWidth={1.7} />
              {t('resetScenario')}
            </button>
            <button type="button" className="act" onClick={() => navigate('/app/missions')}>
              {t('leaveMission')}
            </button>
          </>
        )}
        {!missionMode && !completeView && (
            <button
              type="button"
              className="btn-primary act-next"
              disabled={!canContinue(progress, step, completeView, missionMode)}
              title={canContinue(progress, step, completeView, missionMode) ? undefined : t('finishStepFirst')}
              onClick={() => api.continueTutorial()}
            >
            {!progress.onboardingComplete ? t('continue') : lastStep ? t('finishLesson') : t('nextStep')}
            <ArrowRight className="dir-arrow" size={14} strokeWidth={2} />
          </button>
        )}
      </footer>
    </div>
  );

  function StepRail() {
    return (
      <nav className="step-rail" aria-label={t('lessonSteps')}>
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
                {now && <span className="sr-only">({t('currentStep')})</span>}
              </li>
            );
          })}
        </ol>
        <p className="rail-quote">{bi({ en: 'Same tools. New possibilities.', ar: 'الأدوات نفسها. إمكانات جديدة.' })}</p>
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
          {kindLabel(step.kind, language)} · {bi({ en: 'Step', ar: 'خطوة' })} {progress.currentStepIndex + 1}{' '}
          {bi({ en: 'of', ar: 'من' })} {lesson.steps.length}
        </p>
        <h3>{step.title}</h3>

        {step.body.split('\n').map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}

        {step.anatomy && <CommandAnatomy anatomy={step.anatomy} />}

        {step.prompt && (
          <p className="objective">
            <strong>{waiting ? t('yourTurn') : `${t('objective')}.`}</strong> {step.prompt}
          </p>
        )}

        {/* Guided steps used to print the command for free. The answer panel covers that
            now, so the ladder is objective → hint → answer. */}
        {step.example && !satisfied && !step.anatomy && !answer && (
          <p className="cmd-example">
            <code dir="ltr" lang="en">{step.example}</code>
          </p>
        )}

        {step.kind === 'question' && step.question && (
          <div className="quiz" role="group" aria-label={t('knowledgeCheck')}>
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
                  <strong>{coach?.title ?? step.successTitle ?? bi({ en: 'Correct', ar: 'صحيح' })}</strong>
                </p>
                <p>{coach?.body ?? step.successBody}</p>
              </div>
            </div>
          )}
          {waiting && awaitingInput && !coach && (
            <p className="waiting-line">{bi({ en: 'Waiting for you to use the Terminal…', ar: 'بانتظار أن تستخدم الطرفية…' })}</p>
          )}
          {!satisfied && coach && coach.tone !== 'ok' && (
            <div className={`coach is-${coach.tone}`}>
              <p>
                <strong>
                  {coach.tone === 'try' ? bi({ en: '! Try again', ar: '! أعد المحاولة' }) : bi({ en: 'Note', ar: 'ملاحظة' })} · {coach.title}
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
                {bi({ en: 'Hint', ar: 'تلميح' })} {i + 1}. {h}
              </p>
            ))}
            {hintsShown < totalHints && (
              <p className="hint-more">{bi({ en: 'More hints available below.', ar: 'المزيد من التلميحات متاح أدناه.' })}</p>
            )}
          </div>
        )}

        {/* Revealed by the footer's Show answer button. Never auto-runs anything. */}
        {canAsk && answer && revealed && (
          <div className="answer-card">
            <p className="brief-label">{bi({ en: 'Answer', ar: 'الإجابة' })}</p>
            {answer.command && (
              <pre className="answer-command">
                <code dir="ltr" lang="en">{answer.command}</code>
              </pre>
            )}
            {answer.label && (
              <p className="answer-label">
                {bi({ en: 'Correct answer:', ar: 'الإجابة الصحيحة:' })} {answer.label}
              </p>
            )}
            {answer.parts && <CommandAnatomy anatomy={{ line: answer.command ?? '', parts: answer.parts }} />}
            <p className="answer-explain">{answer.explanation}</p>
            {step.kind === 'question' ? (
              <p className="hint">{bi({ en: 'Pick that choice above to record it.', ar: 'اختر ذلك الخيار أعلاه لتسجيله.' })}</p>
            ) : (
              <>
                <p className="hint">
                  {bi({
                    en: 'Now try it in Terminal. Any command that produces the same result counts.',
                    ar: 'جرّبه الآن في الطرفية. أي أمر ينتج النتيجة نفسها يُحتسب.',
                  })}
                </p>
                <div className="row-actions">
                  <button type="button" className="btn-primary" onClick={() => api.focusTerminal()}>
                    {t('focusTerminal')}
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
    const missing = missingSkillsFor(mission, progress).map((title) => {
      const match = trackLessons().find((l) => l.title === title);
      return match ? lessonTitle(match.id, language) : title;
    });
    return (
      <article className="lesson-card">
        <p className="lesson-kicker">
          {missionField(mission.id, 'difficulty', language, mission.difficulty)} {t('mission')}
        </p>
        <h3>{missionTitle(mission.id, language, mission.title)}</h3>
        <div className="coach-slot" role="status" aria-live="polite">
          {done && (
            <div className="coach is-ok">
              <p>
                <strong>✓ {bi({ en: 'Mission complete', ar: 'اكتملت المهمة' })}</strong>
              </p>
              <p>{bi({ en: 'The finished state matches the objective.', ar: 'الحالة النهائية تطابق الهدف.' })}</p>
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
          {!done && !coach && (
            <p className="waiting-line">{bi({ en: 'Waiting for you to use the Terminal…', ar: 'بانتظار أن تستخدم الطرفية…' })}</p>
          )}
        </div>
        <p>{missionField(mission.id, 'briefing', language, mission.briefing)}</p>
        <p className="objective">
          <strong>{t('objective')}.</strong> {missionField(mission.id, 'objective', language, mission.objective)}
        </p>
        {missing.length > 0 && (
          <p className="hint">
            {bi({ en: 'This mission expects skills from:', ar: 'هذه المهمة تتوقع مهارات من:' })} {missing.join(', ')}.
            {bi({ en: ' You can still try it.', ar: ' يمكنك المحاولة رغم ذلك.' })}
          </p>
        )}
        {settings.showHints && <p className="hint">{missionField(mission.id, 'hint', language, mission.hint)}</p>}
        <p className="reward">{mission.xp} XP</p>
        {done && (
          <div className="row-actions">
            <button type="button" className="btn-primary" onClick={() => navigate('/app/missions')}>
              {bi({ en: 'Back to missions', ar: 'العودة إلى المهام' })}
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
        <p className="brief-label">{bi({ en: 'Lesson complete', ar: 'اكتمل الدرس' })}</p>
        <h3>{lesson.title}</h3>
        {commands.length > 0 && (
          <>
            <p>{bi({ en: 'You learned:', ar: 'تعلّمت:' })}</p>
            <ul className="learned-list">
              {commands.map((c) => (
                <li key={c}>
                  <code dir="ltr" lang="en">{c}</code>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="reward">
          {bi({ en: 'XP earned:', ar: 'نقاط الخبرة المكتسبة:' })} {earned}
        </p>
        <p className="lesson-meta">
          {filesLessonProgress(progress).done} {bi({ en: 'of', ar: 'من' })} {filesLessonProgress(progress).total}{' '}
          {bi({ en: 'Files lessons complete', ar: 'دروس الملفات مكتملة' })}
        </p>
        <div className="row-actions">
          {upcoming ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                api.goNextLesson();
                navigate(`/app/lab/files/${upcoming.id}`);
              }}
            >
              {bi({ en: 'Continue to next lesson', ar: 'المتابعة إلى الدرس التالي' })}
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={() => navigate('/app/missions')}>
              {bi({ en: 'Try a mission', ar: 'جرّب مهمة' })}
            </button>
          )}
          <button type="button" onClick={() => navigate('/app/learn/files')}>
            {bi({ en: 'Back to path', ar: 'العودة إلى المسار' })}
          </button>
        </div>
      </article>
    );
  }
}

function Onboarding({ page }: { page: number }) {
  const { bi } = usePreferences();
  if (page === 0) {
    return (
      <article className="lesson-card">
        <p className="brief-label">{bi({ en: 'Welcome', ar: 'مرحباً' })}</p>
        <h3>{bi({ en: 'This is the lab', ar: 'هذا هو المختبر' })}</h3>
        <p>
          {bi({
            en: 'The Guide is this panel: it explains one step at a time. The Terminal beside it is a real simulated command prompt. Nothing you type reaches your own computer, so experiment freely.',
            ar: 'المرشد هو هذه اللوحة: يشرح خطوة واحدة في كل مرة. الطرفية بجانبها موجّه أوامر محاكى حقيقي. لا شيء مما تكتبه يصل إلى حاسوبك، فجرّب بحرية.',
          })}
        </p>
      </article>
    );
  }
  return (
    <article className="lesson-card">
      <p className="brief-label">{bi({ en: 'How a step works', ar: 'كيف تعمل الخطوة' })}</p>
      <h3>{bi({ en: 'Read, then type', ar: 'اقرأ ثم اكتب' })}</h3>
      <p>
        {bi({
          en: 'Each step explains a command and then asks you to run it. The lab watches the simulated filesystem, so any command that produces the right result counts — there is no single exact line to guess.',
          ar: 'كل خطوة تشرح أمراً ثم تطلب منك تشغيله. المختبر يراقب نظام الملفات المحاكى، لذلك أي أمر ينتج النتيجة الصحيحة يُحتسب — لا يوجد سطر واحد للتخمين.',
        })}
      </p>
      <p>
        {bi({
          en: 'Stuck? Ask for a hint, or reveal the answer. You still type it yourself.',
          ar: 'علقت؟ اطلب تلميحاً أو اكشف الإجابة. ما زلت تكتبها بنفسك.',
        })}
      </p>
    </article>
  );
}

function kindLabel(kind: string, language: 'ar' | 'en'): string {
  const ar = language === 'ar';
  if (kind === 'try' || kind === 'check') return ar ? 'دورك' : 'Your turn';
  if (kind === 'mission') return ar ? 'تحدٍ' : 'Challenge';
  if (kind === 'question') return ar ? 'محطة' : 'Checkpoint';
  if (kind === 'demo') return ar ? 'أمر' : 'Command';
  if (kind === 'summary') return ar ? 'مراجعة' : 'Review';
  return ar ? 'درس' : 'Lesson';
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
