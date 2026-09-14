import { Link } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { DASH_COPY, missionOpensAfter, missionReady, PROGRESS_COPY } from '../../data/pageCopy';
import { achievementById } from '../../data/achievements';
import { MISSIONS, missingSkillsFor, recommendedMission } from '../../data/missions';
import { levelFromXp, levelProgress, nextThreshold } from '../../data/player';
import { FILES_TRACK, lessonNumber, unitNumber } from '../../data/tracks';
import { activeLesson, commandsLearned, currentUnit, filesLessonProgress, unitProgress } from '../../engine/tutorial';
import { useAuth } from '../../features/auth/useAuth';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { useOS } from '../../hooks/useOS';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  achievementTitle,
  lessonSubtitle,
  lessonTitle,
  missionField,
  missionTitle,
  trackName,
  unitName,
  achievementDescription,
  commandSummary,
} from '../../lib/localizeContent';

export function DashboardPage() {
  const { t, bi, language } = usePreferences();
  usePageTitle(t('dashboard'));
  const { profile, user } = useAuth();
  const { progress } = useOS();
  const files = filesLessonProgress(progress);
  const lesson = activeLesson(progress);
  const unit = currentUnit(progress);
  const unitStats = unit ? unitProgress(unit, progress) : { done: 0, total: 0 };
  const level = levelFromXp(progress.xp);
  const next = nextThreshold(progress.xp);
  const pct = Math.round(levelProgress(progress.xp) * 100);
  const recent = progress.unlockedAchievementIds.slice(-3).reverse().map(achievementById).filter(Boolean);
  const mission = recommendedMission(progress);
  const fresh = files.done === 0 && !progress.onboardingComplete;
  const commands = commandsLearned(progress).slice(-6).reverse();

  return (
    <>
      <section className="dash-head">
        <p className="kicker">{fresh ? t('startLearning') : t('welcomeBack')}</p>
        <h1>
          {profile?.display_name || user?.email
            ? bi({
                en: fresh
                  ? `Hello, ${profile?.display_name ?? 'there'}. Your first lesson is ready.`
                  : `Hello, ${profile?.display_name ?? 'there'}.`,
                ar: fresh
                  ? `مرحباً ${profile?.display_name ?? ''}، درسك الأول جاهز.`
                  : `مرحباً ${profile?.display_name ?? ''}.`,
              })
            : fresh
              ? bi({ en: 'Your first lesson is ready.', ar: 'درسك الأول جاهز.' })
              : `${t('unit')} ${unitNumber(unit?.id ?? '')} · ${unitName(unit?.id ?? '', language, unit?.name ?? '')}`}
        </h1>
        <p className="dash-lesson">
          {t('lesson')} {lessonNumber(lesson.id)} · {lessonTitle(lesson.id, language)}
        </p>
        <p className="lede">{lessonSubtitle(lesson.id, language)}</p>
        <div className="cta-row">
          <Link className="btn-primary" to={`/app/lab/files/${lesson.id}`}>
            {files.done === 0 && progress.currentStepIndex === 0 ? t('startLesson') : t('continueLesson')}
          </Link>
          <Link className="btn-secondary" to="/app/learn/files">
            {t('viewPath')}
          </Link>
          <Link className="btn-secondary" to="/app/settings">
            {t('settings')}
          </Link>
        </div>
      </section>

      <section className="dash-split">
        <article className="panel">
          <p className="section-index">{t('courseProgress')}</p>
          <h2>
            {trackName(FILES_TRACK.id, language)} · {files.percent}%
          </h2>
          <div
            className="meter"
            role="progressbar"
            aria-valuenow={files.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={bi(PROGRESS_COPY.completionAria)}
          >
            <span style={{ width: `${files.percent}%` }} />
          </div>
          <dl className="stat-rows">
            <div>
              <dt>{bi({ en: 'Lessons', ar: 'الدروس' })}</dt>
              <dd>
                {files.done} / {files.total}
              </dd>
            </div>
            <div>
              <dt>{t('unit')}</dt>
              <dd>
                {unitNumber(unit?.id ?? '')} {t('of')} {FILES_TRACK.units.length}
              </dd>
            </div>
            <div>
              <dt>{bi({ en: 'This unit', ar: 'هذه الوحدة' })}</dt>
              <dd>
                {unitStats.done} / {unitStats.total}
              </dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <p className="section-index">{t('player')}</p>
          <h2>
            {t('level')} {level}
          </h2>
          <div
            className="meter"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={bi(DASH_COPY.xpTowardLevel)}
          >
            <span style={{ width: `${pct}%` }} />
          </div>
          <dl className="stat-rows">
            <div>
              <dt>XP</dt>
              <dd>{progress.xp.toLocaleString(language === 'ar' ? 'ar' : 'en')}</dd>
            </div>
            <div>
              <dt>{next ? t('nextLevelAt') : t('status')}</dt>
              <dd>{next ? `${next.toLocaleString(language === 'ar' ? 'ar' : 'en')} XP` : t('maxLevel')}</dd>
            </div>
            <div>
              <dt>{t('commandsRun')}</dt>
              <dd>{progress.commandCount}</dd>
            </div>
          </dl>
          <p className="panel-note">{t('playerLevelNote')}</p>
        </article>
      </section>

      <section className="dash-split">
        <article className="panel">
          <p className="section-index">{t('recentAchievements')}</p>
          {recent.length === 0 ? (
            <p className="empty-copy">{bi(DASH_COPY.emptyAchievements)}</p>
          ) : (
            <ul className="mini-list">
              {recent.map((a) => (
                <li key={a!.id}>
                  <strong>{achievementTitle(a!.id, language, a!.title)}</strong>
                  <span>{achievementDescription(a!.id, language, a!.description)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link className="text-link" to="/app/achievements">
            {t('allAchievements')} <DirArrow />
          </Link>
        </article>

        <article className="panel">
          <p className="section-index">{t('recommendedMission')}</p>
          {mission ? (
            <>
              <h2>{missionTitle(mission.id, language, mission.title)}</h2>
              <p>{missionField(mission.id, 'scenario', language, mission.scenario)}</p>
              <p className="chip-row">
                <span className="chip">{missionField(mission.id, 'difficulty', language, mission.difficulty)}</span>
                {mission.skills.map((s) => (
                  <span key={s} className="chip is-mono">
                    {s}
                  </span>
                ))}
              </p>
              <p className="reward">{mission.xp} XP</p>
              <Link className="btn-secondary" to={`/app/missions/${mission.id}`}>
                {t('viewMission')}
              </Link>
            </>
          ) : (
            <>
              <p className="empty-copy">
                {progress.completedMissionIds.length > 0
                  ? bi(DASH_COPY.allMissionsDone)
                  : missionLockNote(progress, language, bi)}
              </p>
              <Link className="text-link" to="/app/missions">
                {t('seeAllMissions')} <DirArrow />
              </Link>
            </>
          )}
        </article>
      </section>

      <section className="panel">
          <p className="section-index">{t('recentlyLearned')}</p>
        {commands.length === 0 ? (
          <p className="empty-copy">{bi(PROGRESS_COPY.emptyCommands)}</p>
        ) : (
          <ul className="mini-list is-grid">
            {commands.map((c) => (
              <li key={c.name}>
                <strong>
                  <code>{c.name}</code>
                </strong>
                <span>{commandSummary(c.name, language, c.summary)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/** Explains, in lesson terms, what stands between the learner and their first mission. */
function missionLockNote(
  progress: Parameters<typeof missingSkillsFor>[1],
  language: 'ar' | 'en',
  bi: (value: { en: string; ar: string }) => string,
): string {
  const mission = MISSIONS.find((m) => !progress.completedMissionIds.includes(m.id));
  if (!mission) return bi(DASH_COPY.missionsUnlock);
  const missing = missingSkillsFor(mission, progress);
  const title = missionTitle(mission.id, language, mission.title);
  if (!missing.length) return bi(missionReady(title));
  return bi(missionOpensAfter(title, missing.join(', ')));
}
