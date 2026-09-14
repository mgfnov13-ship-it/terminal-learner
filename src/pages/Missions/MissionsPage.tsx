import { Link, useNavigate } from 'react-router-dom';
import { DirArrow } from '../../components/UI/Primitives';
import { MISSIONS, missingSkillsFor } from '../../data/missions';
import { trackLessons } from '../../data/tracks';
import { useOS } from '../../hooks/useOS';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePreferences } from '../../features/preferences/PreferencesProvider';
import { lessonTitle, missionField, missionTitle } from '../../lib/localizeContent';

export function MissionsPage() {
  const { t, bi, language } = usePreferences();
  usePageTitle(t('missions'));
  const navigate = useNavigate();
  const { progress } = useOS();
  const done = progress.completedMissionIds.length;
  const anyOpen = MISSIONS.some((m) => missingSkillsFor(m, progress).length === 0);

  return (
    <>
      <section className="path-head">
        <p className="kicker">{t('missions')}</p>
        <h1>{bi({ en: 'Apply it to something messy', ar: 'طبّقه على شيء فوضوي' })}</h1>
        <p className="lede">
          {bi({
            en: 'A lesson teaches one command. A mission drops you into a situation and checks the result: no steps, no prompts, no hand-holding. Each one gives the simulated disk its own starting mess.',
            ar: 'الدرس يعلّم أمراً واحداً. المهمة تضعك في موقف وتتحقق من النتيجة: بلا خطوات ولا موجّهات ولا إمساك باليد. كل واحدة تعطي القرص المحاكى فوضاه الخاصة.',
          })}
        </p>
        <p className="hero-note">
          {done} {bi({ en: 'of', ar: 'من' })} {MISSIONS.length} {t('complete')}
        </p>
        {!anyOpen && (
          <p className="empty-copy">
            {bi({
              en: 'Every mission is still locked. Missions ask only for commands a lesson has already taught you — finish a couple of lessons and the first one opens.',
              ar: 'كل المهام ما زالت مقفلة. المهام تطلب فقط أوامر سبق أن علّمها درس — أنهِ درسين وستُفتح الأولى.',
            })}
          </p>
        )}
      </section>

      <ul className="mission-rows">
        {MISSIONS.map((m) => {
          const complete = progress.completedMissionIds.includes(m.id);
          const missingIds = missingSkillsFor(m, progress);
          const missing = missingIds.map((title) => {
            const match = trackLessons().find((l) => l.title === title);
            return match ? lessonTitle(match.id, language) : title;
          });
          const locked = missingIds.length > 0;
          return (
            <li key={m.id} className={`mission-row${complete ? ' is-done' : ''}${locked ? ' is-lock' : ''}`}>
              <div className="mission-main">
                <p className="unit-index">
                  {missionField(m.id, 'difficulty', language, m.difficulty)} · {m.xp} XP
                </p>
                <h2>{missionTitle(m.id, language, m.title)}</h2>
                <p>{missionField(m.id, 'scenario', language, m.scenario)}</p>
                <p className="chip-row">
                  {m.skills.map((s) => (
                    <span key={s} className="chip is-mono">
                      {s}
                    </span>
                  ))}
                </p>
              </div>
              <div className="mission-side">
                {complete && <p className="status is-open">{t('complete')}</p>}
                {locked ? (
                  <p className="lock-reason">
                    {bi({ en: 'Needs first:', ar: 'يحتاج أولاً:' })} <strong>{missing.join(', ')}</strong>
                  </p>
                ) : (
                  <button type="button" className="btn-secondary" onClick={() => navigate(`/app/missions/${m.id}`)}>
                    {complete ? t('replayMission') : t('viewMission')}
                  </button>
                )}
                {locked && (
                  <Link className="text-link" to="/app/learn/files">
                    {bi({ en: 'Go to those lessons', ar: 'اذهب إلى تلك الدروس' })} <DirArrow />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
