import type { LocalizedText } from '../lib/i18n';
import { tx } from '../lib/i18n';

export const SITE_META = {
  description: tx(
    'Learn the terminal by actually using it. A safe simulated computer, real command-line practice, no installation.',
    'تعلّم الطرفية بالممارسة. حاسوب محاكى آمن، تمرين حقيقي على سطر الأوامر، بلا تثبيت.',
  ),
};

export const HOME_COPY = {
  titleSuffix: tx('Learn the Terminal by Using It', 'تعلّم الطرفية بالممارسة'),
  heroLine1: tx('Learn the terminal by', 'تعلّم الطرفية'),
  heroLine2: tx('actually using one.', 'بأن تستخدمها فعلاً.'),
  lede: tx(
    'Master files, navigation, and the everyday commands inside a safe simulated computer. You get a lesson on one side, a working command prompt on the other, and honest feedback on whatever you type.',
    'أتقن الملفات والتنقّل وأوامر العمل اليومي داخل حاسوب محاكى آمن. درس في جهة، وموجّه أوامر يعمل في الأخرى، وتصحيح واضح على ما تكتبه.',
  ),
  seeFiles: tx('See the Files track', 'شاهد مسار الملفات'),
  heroNote: tx(
    'Runs in your browser · Safe simulated filesystem · Progress saved to your account',
    'يعمل في متصفحك · نظام ملفات محاكى وآمن · يُحفظ التقدّم في حسابك',
  ),
  transcriptAria: tx('Example terminal session', 'جلسة طرفية نموذجية'),
  transcriptLabel: tx('Terminal · simulated', 'الطرفية · محاكاة'),
  briefLabel: tx('Guide · step 3 of 5', 'المرشد · الخطوة 3 من 5'),
  proofTitle: tx('Create directories', 'إنشاء المجلدات'),
  proofBody: tx('Create a directory named Projects.', 'أنشئ مجلداً اسمه Projects.'),
  proofNote: tx('The Guide teaches you. Terminal lets you try it.', 'المرشد يشرح. الطرفية تتيح لك التجربة.'),
  howIndex: tx('01 — How it works', '01 — كيف تعمل'),
  howTitle: tx('Four things happen in every lesson.', 'أربعة أشياء تحدث في كل درس.'),
  tracksIndex: tx('02 — Tracks', '02 — المسارات'),
  tracksTitle: tx('One track is built. The rest are honest plans.', 'مسار واحد مبني. الباقي خطط صريحة.'),
  plannedNote: tx(
    'Planned tracks are not clickable, because there is nothing behind them yet.',
    'المسارات المخططة غير قابلة للنقر، لأنه لا يوجد شيء خلفها بعد.',
  ),
  whyIndex: tx('03 — Why this and not a video', '03 — لماذا هذا وليس فيديو'),
  whyTitle: tx("You don't just read commands. You use them.", 'لا تقرأ الأوامر فحسب. بل تستخدمها.'),
  ready: tx('Ready when you are', 'ابدأ متى شئت'),
  startUnit1: tx('Start with unit 1', 'ابدأ بالوحدة 1'),
  firstLessonNote: tx(
    'First lesson: the prompt, the cursor, and your first command. It takes a couple of minutes.',
    'الدرس الأول: الموجّه، المؤشر، وأمرك الأول. يستغرق دقائق.',
  ),
  stages: [
    {
      step: '1.0',
      title: tx('Learn', 'تعلّم'),
      body: tx(
        'The Guide explains one idea at a time — what a command is for, and what each part of it means.',
        'المرشد يشرح فكرة واحدة في كل مرة: لماذا يُستخدم الأمر، وما معنى كل جزء منه.',
      ),
    },
    {
      step: '2.0',
      title: tx('Try', 'جرّب'),
      body: tx(
        'You type the command into a real simulated terminal. Nothing is pre-filled and nothing runs itself.',
        'تكتب الأمر بنفسك في طرفية محاكية تعمل فعلياً. لا شيء مملوء مسبقاً ولا شيء يعمل من تلقاء نفسه.',
      ),
    },
    {
      step: '3.0',
      title: tx('Feedback', 'تصحيح'),
      body: tx(
        'The lab reads the filesystem afterwards. Any command that produces the right result is accepted; typos get explained.',
        'المختبر يقرأ نظام الملفات بعد الأمر. أي أمر يعطي النتيجة الصحيحة يُقبل؛ والأخطاء تُشرح.',
      ),
    },
    {
      step: '4.0',
      title: tx('Master', 'أتقن'),
      body: tx(
        'Hints disappear as you go, then missions drop you into a messy scenario with no step-by-step guidance.',
        'التلميحات تتراجع تدريجياً، ثم تضعك المهام في سيناريو فوضوي بلا توجيه خطوة بخطوة.',
      ),
    },
  ],
  reasons: [
    [
      tx('An interactive terminal', 'طرفية تتفاعل معك'),
      tx('You type every command yourself. Reading is not practising.', 'تكتب كل أمر بنفسك. القراءة ليست تمريناً.'),
    ],
    [
      tx('A real virtual filesystem', 'نظام ملفات افتراضي حقيقي'),
      tx(
        'Folders and files persist between commands, so mistakes have consequences you can see.',
        'المجلدات والملفات تبقى بين الأوامر، فالخطأ له أثر تراه بعينك.',
      ),
    ],
    [
      tx('Result-based checking', 'التحقق من النتيجة'),
      tx(
        'mkdir Projects and mkdir C:\\Users\\Student\\Projects both pass. There is no magic phrase to guess.',
        'mkdir Projects وmkdir C:\\Users\\Student\\Projects كلاهما يُقبل. لا عبارة سحرية تخمّنها.',
      ),
    ],
    [
      tx('Progressive hints', 'تلميحات متدرجة'),
      tx('Ask for a nudge, or reveal the answer. You still have to run it.', 'اطلب دفعة، أو اكشف الإجابة. ما زلت تشغّلها بنفسك.'),
    ],
    [
      tx('Practical missions', 'مهام عملية'),
      tx(
        'Sort a messy desktop, recover a lost file, scaffold a project.',
        'رتّب سطحاً فوضوياً، استرجع ملفاً ضائعاً، جهّز مشروعاً.',
      ),
    ],
    [
      tx('A safe sandbox', 'بيئة آمنة'),
      tx('Nothing reaches your own machine. Delete anything you like.', 'لا شيء يصل إلى جهازك. احذف ما شئت.'),
    ],
  ],
};

export function lessonsUnitsBuilt(lessons: number, built: number, total: number): LocalizedText {
  return tx(
    `${lessons} lessons · ${built} of ${total} units built`,
    `${lessons} درساً · ${built} من ${total} وحدات مبنية`,
  );
}

export const TRACKS_COPY = {
  kicker: tx('Tracks', 'المسارات'),
  title: tx('One track is built. The rest are honest plans.', 'مسار واحد مبني. الباقي خطط صريحة.'),
  lede: tx(
    'Terminal Space is built one finished track at a time, not a wide list of half-written ones.',
    'تيرمنال سبيس يُبنى مساراً مكتملاً تلو الآخر، لا قائمة واسعة من مسارات نصف مكتوبة.',
  ),
  plannedNote: HOME_COPY.plannedNote,
};

export const TRACKS_FILES_COPY = {
  kicker: tx('Track', 'مسار'),
  start: tx('Start Files', 'ابدأ مسار الملفات'),
  continue: tx('Continue Files', 'متابعة مسار الملفات'),
  whoIndex: tx('Who this is for', 'لمن هذا المسار'),
  whoTitle: tx(
    'Anyone who has never opened a terminal on purpose.',
    'لمن لم يفتح طرفية عمداً من قبل.',
  ),
  whoBody: tx(
    "No prior command-line experience assumed. You'll learn what a prompt is before you're asked to use one.",
    'لا نفترض خبرة سابقة بسطر الأوامر. ستتعلّم ما هو الموجّه قبل أن يُطلب منك استخدامه.',
  ),
  skillsIndex: tx('Key skills', 'مهارات أساسية'),
  skillsTitle: tx("What you'll learn", 'ماذا ستتعلّم'),
  curriculumIndex: tx('Curriculum', 'المنهج'),
  howIndex: tx('How it works', 'كيف يعمل'),
  howTitle: tx('Lessons teach. Missions apply.', 'الدروس تعلّم. المهام تطبّق.'),
  howBody: tx(
    'Each lesson teaches one idea, then asks you to run the command yourself in a real simulated terminal. Missions come after — no step-by-step guidance, just a scenario and a result to reach.',
    'كل درس يعلّم فكرة واحدة، ثم يطلب منك تشغيل الأمر بنفسك في طرفية محاكاة حقيقية. المهام تأتي بعد ذلك: بلا توجيه خطوة بخطوة، سيناريو ونتيجة تصل إليها.',
  ),
  ready: HOME_COPY.ready,
  allTracks: tx('All tracks', 'كل المسارات'),
  skills: [
    tx('Reading a prompt and knowing where you are', 'قراءة الموجّه ومعرفة موقعك'),
    tx('Moving between folders with cd and paths', 'التنقّل بين المجلدات بـ cd والمسارات'),
    tx('Creating folders and files exactly where you want them', 'إنشاء المجلدات والملفات في المكان الذي تريده'),
    tx('Renaming, copying, moving, and deleting safely', 'إعادة التسمية والنسخ والنقل والحذف بأمان'),
  ],
};

export function publishedLessonsNote(lessons: number, built: number, total: number): LocalizedText {
  return tx(
    `${lessons} published lessons · ${built} of ${total} units available`,
    `${lessons} درساً منشوراً · ${built} من ${total} وحدات متاحة`,
  );
}

export function startWithUnit(unitName: string): LocalizedText {
  return tx(`Start with unit 1 · ${unitName}`, `ابدأ بالوحدة 1 · ${unitName}`);
}

export const HOW_COPY = {
  kicker: tx('How it works', 'كيف تعمل'),
  title: HOME_COPY.howTitle,
  lede: tx(
    'Learn the terminal by actually using it, not by watching someone else use it.',
    'تعلّم الطرفية باستخدامها، لا بمشاهدة شخص آخر يستخدمها.',
  ),
  whyIndex: tx('Why Terminal Space', 'لماذا تيرمنال سبيس'),
  whyTitle: tx('Not a video. Not a cheat sheet.', 'ليست فيديو. وليست ورقة غش.'),
  seeKicker: tx('See it for yourself', 'جرّبه بنفسك'),
  seeTitle: tx('Try one command, no account needed.', 'جرّب أمراً واحداً، بلا حساب.'),
  tryDemo: tx('Try the demo', 'جرّب العرض'),
  stages: [
    HOME_COPY.stages[0],
    HOME_COPY.stages[1],
    {
      step: '3.0',
      title: tx('Feedback', 'تصحيح'),
      body: tx(
        'Terminal Space watches the simulated filesystem afterward. Any command that produces the right result is accepted; mistakes get explained.',
        'تيرمنال سبيس يراقب نظام الملفات المحاكى بعد الأمر. أي أمر يعطي النتيجة الصحيحة يُقبل؛ والأخطاء تُشرح.',
      ),
    },
    {
      step: '4.0',
      title: tx('Apply', 'طبّق'),
      body: HOME_COPY.stages[3].body,
    },
  ],
  difference: [
    [tx('Real practice', 'تمرين حقيقي'), tx("Don't just watch commands. Run them.", 'لا تشاهد الأوامر فحسب. شغّلها.')],
    [
      tx('Safe environment', 'بيئة آمنة'),
      tx(
        'Everything happens inside a simulated computer. Your real files are untouched.',
        'كل شيء يحدث داخل حاسوب محاكى. ملفاتك الحقيقية لا تُمس.',
      ),
    ],
    [
      tx("Understand, don't memorize", 'افهم، لا تحفظ'),
      tx(
        'Terminal Space explains what a command does and why, not just what to type.',
        'تيرمنال سبيس يشرح ماذا يفعل الأمر ولماذا، لا ماذا تكتب فحسب.',
      ),
    ],
    [
      tx('Real missions', 'مهام حقيقية'),
      tx(
        'Apply several commands to an actual scenario, without a script to follow.',
        'طبّق عدة أوامر على سيناريو فعلي، بلا نص تتبعه حرفياً.',
      ),
    ],
    [
      tx('Instant feedback', 'تصحيح فوري'),
      tx(
        'Mistakes become teaching moments instead of dead ends.',
        'الخطأ يصير لحظة تعليم لا طريقاً مسدوداً.',
      ),
    ],
    [
      tx('Progressive difficulty', 'صعوبة متدرجة'),
      tx(
        'Guidance gradually disappears as your confidence grows.',
        'التوجيه يتراجع تدريجياً كلما ازدادت ثقتك.',
      ),
    ],
  ],
};

export const DEMO_COPY = {
  kicker: tx('Demo', 'تجربة'),
  title: tx('Try it yourself — no account needed', 'جرّبه بنفسك — بلا حساب'),
  lede: tx(
    'This is a real, isolated simulated computer. Nothing you do here touches an account or saves anywhere — reload the page for a clean disk.',
    'هذا حاسوب محاكى معزول وحقيقي. لا شيء مما تفعله هنا يمس حساباً أو يُحفظ في أي مكان — أعد تحميل الصفحة لقرص نظيف.',
  ),
  hint: tx(
    'Try typing dir and press Enter to see what’s here.',
    'اكتب dir ثم اضغط Enter لترى ما هنا.',
  ),
  inputAria: tx('Demo terminal input', 'إدخال طرفية التجربة'),
  briefLabel: tx('Guide · try it', 'المرشد · جرّب'),
  proofTitle: tx('List a folder', 'اعرض محتويات مجلد'),
  proofBody: tx('Type dir and press Enter.', 'اكتب dir ثم اضغط Enter.'),
  before: tx('dir lists the contents of your current directory.', 'dir يعرض محتويات مجلدك الحالي.'),
  after: tx(
    "dir lists the contents of your current directory. That's the whole loop — read, try, see what changed.",
    'dir يعرض محتويات مجلدك الحالي. هذه الحلقة كلها: اقرأ، جرّب، انظر ماذا تغيّر.',
  ),
  closingKicker: tx('Want the full learning path?', 'تريد المسار كاملاً؟'),
  closingTitle: tx('Files teaches this and a lot more.', 'مسار الملفات يعلّم هذا وأكثر.'),
  createAccount: tx('Create free account', 'أنشئ حساباً مجانياً'),
};

export const ABOUT_COPY = {
  kicker: tx('About', 'عن المنصة'),
  title: tx('Why Terminal Space exists', 'لماذا وُجد تيرمنال سبيس'),
  lede: tx(
    'Terminal learning is usually passive. People watch a tutorial or copy a command from a cheat sheet without understanding where they are, what changed, or why the command worked.',
    'تعلّم الطرفية غالباً سلبي. يشاهد الناس درساً أو ينسخون أمراً من ورقة غش دون أن يفهموا أين هم، وماذا تغيّر، ولماذا نجح الأمر.',
  ),
  philIndex: tx('Philosophy', 'المنهج'),
  philTitle: tx('Learn. Try. Understand. Apply.', 'تعلّم. جرّب. افهم. طبّق.'),
  philBody: tx(
    'Terminal Space teaches through interaction. Every lesson pairs an explanation with a real simulated terminal, so the idea and the practice happen in the same breath. Missions then remove the guidance and ask you to apply what you’ve learned to an actual scenario.',
    'تيرمنال سبيس يعلّم بالتفاعل. كل درس يقرن الشرح بطرفية محاكاة حقيقية، فالفكرة والتطبيق يحدثان معاً. ثم ترفع المهام التوجيه وتطلب منك تطبيق ما تعلّمته على سيناريو فعلي.',
  ),
  notIndex: tx('What it is not', 'ما ليس هو'),
  notTitle: tx('Not a game. Not a video course.', 'ليست لعبة. وليست دورة فيديو.'),
  notBody: tx(
    "The simulated computer exists to teach, not to entertain. Terminal Space doesn't touch your real machine, doesn't need an install, and doesn't pretend to be more finished than it is — planned content is labeled planned, not hidden behind a fake progress bar.",
    'الحاسوب المحاكى موجود ليعلّم، لا ليسلّي. تيرمنال سبيس لا يمس جهازك الحقيقي، ولا يحتاج تثبيتاً، ولا يدّعي أنه اكتمل أكثر مما هو — المحتوى المخطط يُوسم بالمخطط، لا يُخفى خلف شريط تقدّم زائف.',
  ),
  ready: tx('Ready to try it', 'جاهز للتجربة'),
  startFiles: tx('Start with the Files track.', 'ابدأ بمسار الملفات.'),
  seeFiles: HOME_COPY.seeFiles,
};

export const HELP_PUBLIC = {
  kicker: tx('Help', 'المساعدة'),
  title: tx('Frequently asked questions', 'أسئلة شائعة'),
  still: tx('Still have a question?', 'ما زال لديك سؤال؟'),
  faq: [
    [
      tx('What is Terminal Space?', 'ما تيرمنال سبيس؟'),
      tx(
        'A browser lab for learning command-line skills by actually using a simulated computer.',
        'مختبر في المتصفح لتعلّم مهارات سطر الأوامر باستخدام حاسوب محاكى.',
      ),
    ],
    [
      tx('Does it affect my real computer?', 'هل يؤثر على حاسوبي الحقيقي؟'),
      tx(
        'No. Every command runs against a simulated filesystem inside this browser tab — nothing reaches your real machine.',
        'لا. كل أمر يعمل على نظام ملفات محاكى داخل هذا التبويب — لا شيء يصل إلى جهازك الحقيقي.',
      ),
    ],
    [
      tx('Do I need to install anything?', 'هل أحتاج إلى تثبيت شيء؟'),
      tx('No. Terminal Space runs entirely in your browser.', 'لا. تيرمنال سبيس يعمل بالكامل في متصفحك.'),
    ],
    [
      tx('Is the terminal real?', 'هل الطرفية حقيقية؟'),
      tx(
        "It's a real simulator: a real command parser and a real virtual filesystem, modeled on a Windows-style prompt. It doesn't run your operating system's actual commands.",
        'محاكاة حقيقية: محلّل أوامر حقيقي ونظام ملفات افتراضي حقيقي، على نمط موجّه Windows. لا يشغّل أوامر نظام تشغيلك الفعلية.',
      ),
    ],
    [
      tx('Do I need previous terminal experience?', 'هل أحتاج خبرة سابقة بالطرفية؟'),
      tx('No. The first lesson starts with what a prompt is.', 'لا. الدرس الأول يبدأ بما هو الموجّه.'),
    ],
    [
      tx('Is my progress saved?', 'هل يُحفظ تقدّمي؟'),
      tx(
        "Yes, to your account when you're signed in — or to this browser only while you're not.",
        'نعم، في حسابك وأنت مسجّل الدخول — أو في هذا المتصفح فقط وأنت غير مسجّل.',
      ),
    ],
    [
      tx('What happens if I make a mistake?', 'ماذا يحدث إن أخطأت؟'),
      tx(
        'The Guide explains what happened and how to fix it. Nothing is permanent except what you choose to keep.',
        'المرشد يشرح ماذا حدث وكيف تصلحه. لا شيء دائم إلا ما تختار الإبقاء عليه.',
      ),
    ],
    [
      tx('Can I restart a lesson?', 'هل أستطيع إعادة درس؟'),
      tx(
        "Yes, at any time from the lesson footer. Your simulated disk resets to that lesson's starting folders; XP you already earned stays.",
        'نعم، في أي وقت من تذييل الدرس. القرص المحاكى يعود إلى مجلدات بداية ذلك الدرس؛ نقاط الخبرة التي كسبتها تبقى.',
      ),
    ],
  ],
};

export const HELP_APP = {
  kicker: tx('Help', 'المساعدة'),
  title: tx('Using Terminal Space', 'استخدام تيرمنال سبيس'),
  lede: tx(
    'Answers about lessons, hints, missions, and your progress.',
    'إجابات عن الدروس والتلميحات والمهام وتقدّمك.',
  ),
  more: tx('Something not covered here?', 'شيء غير مغطى هنا؟'),
  faq: [
    [
      tx('How do lessons check my work?', 'كيف تتحقق الدروس من عملي؟'),
      tx(
        'The lab watches the simulated filesystem after you run a command, not your keystrokes. Any command that produces the right result is accepted.',
        'المختبر يراقب نظام الملفات المحاكى بعد تشغيل الأمر، لا ضغطات المفاتيح. أي أمر يعطي النتيجة الصحيحة يُقبل.',
      ),
    ],
    [
      tx('What do hints do?', 'ماذا تفعل التلميحات؟'),
      tx(
        'Hints are optional and progressive — ask for one at a time from the lesson footer. You can also reveal the full answer; you still have to type it yourself.',
        'التلميحات اختيارية ومتدرجة — اطلب واحداً في كل مرة من تذييل الدرس. يمكنك أيضاً كشف الإجابة كاملة؛ وما زلت تكتبها بنفسك.',
      ),
    ],
    [
      tx('Does revealing the answer cost XP?', 'هل كشف الإجابة يخصم نقاط الخبرة؟'),
      tx(
        'Base XP for finishing a step is never taken back. Only a small unaided bonus is affected, and it can never be earned twice for the same step.',
        'نقاط الخبرة الأساسية لإنهاء خطوة لا تُسترد. يتأثر فقط مكافأة صغيرة للعمل بلا مساعدة، ولا تُكتسب مرتين للخطوة نفسها.',
      ),
    ],
    [
      tx('How do I restart a lesson?', 'كيف أعيد درساً؟'),
      tx(
        'Use "Restart lesson" in the Lab footer. The simulated disk resets to that lesson\'s starting folders; XP you already earned stays.',
        'استخدم «إعادة الدرس» في تذييل المختبر. القرص المحاكى يعود إلى مجلدات بداية ذلك الدرس؛ نقاط الخبرة التي كسبتها تبقى.',
      ),
    ],
    [
      tx('How do I reset a mission scenario?', 'كيف أعيد ضبط سيناريو مهمة؟'),
      tx(
        'Use "Reset scenario" while inside a mission. It restores the mission\'s starting files without touching your lesson progress.',
        'استخدم «إعادة ضبط السيناريو» وأنت داخل مهمة. يعيد ملفات بداية المهمة دون المساس بتقدّم الدروس.',
      ),
    ],
    [
      tx('Is my progress saved?', 'هل يُحفظ تقدّمي؟'),
      tx(
        "Yes — to your account when you're signed in, or to this browser only while you're not.",
        'نعم — في حسابك وأنت مسجّل الدخول، أو في هذا المتصفح فقط وأنت غير مسجّل.',
      ),
    ],
    [
      tx('Can I use Terminal Space on my phone?', 'هل أستخدم تيرمنال سبيس على الهاتف؟'),
      tx(
        'Yes. Below a certain width the Lab switches to a Terminal/Guide tab layout instead of a side-by-side view.',
        'نعم. تحت عرض معيّن يتحوّل المختبر إلى تبويبي طرفية/مرشد بدل العرض جنباً إلى جنب.',
      ),
    ],
  ],
};

export const CONTACT_COPY = {
  kicker: tx('Contact', 'تواصل معنا'),
  title: tx('Get in touch', 'راسلنا'),
  sentKicker: tx('Message sent', 'أُرسلت الرسالة'),
  sentTitle: tx('Thanks — we got it.', 'شكراً — وصلتنا.'),
  sentBody: tx(
    "We read every message. There's no automated reply, so we'll get back to you directly.",
    'نقرأ كل رسالة. لا رد آلي، لذلك سنعود إليك مباشرة.',
  ),
  notConnected: tx(
    "Terminal Space isn't connected to a message inbox yet — this form is ready, but nothing will submit until one is configured.",
    'تيرمنال سبيس غير متصل بصندوق رسائل بعد — النموذج جاهز، لكن لن يُرسل شيء حتى يُضبط الصندوق.',
  ),
  name: tx('Name', 'الاسم'),
  email: tx('Email', 'البريد الإلكتروني'),
  topic: tx('Topic', 'الموضوع'),
  message: tx('Message', 'الرسالة'),
  enterName: tx('Enter your name.', 'أدخل اسمك.'),
  enterMessage: tx('Enter a message.', 'أدخل رسالة.'),
  sendFailed: tx("We couldn't send that right now. Try again.", 'تعذر الإرسال الآن. أعد المحاولة.'),
  inboxDown: tx(
    "Terminal Space isn't connected to a message inbox yet, so this form can't submit right now. Try again later.",
    'تيرمنال سبيس غير متصل بصندوق رسائل بعد، لذلك لا يمكن إرسال النموذج الآن. حاول لاحقاً.',
  ),
  topics: [
    tx('General question', 'سؤال عام'),
    tx('Bug report', 'بلاغ خلل'),
    tx('Learning feedback', 'ملاحظة على التعلّم'),
    tx('Partnership / business', 'شراكة / أعمال'),
  ],
};

export const PRIVACY_COPY = {
  kicker: tx('Privacy', 'الخصوصية'),
  title: tx('Privacy policy', 'سياسة الخصوصية'),
  lede: tx(
    'This is a plain-language summary of what Terminal Space stores and why. It is not a substitute for legal advice — treat it as a starting point for final review, not a finished legal document.',
    'هذا ملخص بلغة واضحة لما يخزّنه تيرمنال سبيس ولماذا. ليس بديلاً عن استشارة قانونية — اعتبره نقطة بداية للمراجعة النهائية، لا وثيقة قانونية مكتملة.',
  ),
  sections: [
    [
      tx('Account data', 'بيانات الحساب'),
      tx(
        'If you create an account, we store your email address and, once you set one, a display name — the minimum needed to sign you in and identify your progress. Authentication is handled by our database provider (Supabase); we never see or store your password in plain text.',
        'إن أنشأت حساباً نخزّن بريدك الإلكتروني، وبعد أن تضبطه، اسماً معروضاً — الحد الأدنى لتسجيل دخولك وتعريف تقدّمك. المصادقة يتولاها مزوّد قاعدة البيانات (Supabase)؛ لا نرى كلمة مرورك ولا نخزّنها كنص واضح.',
      ),
    ],
    [
      tx('Learning progress', 'تقدّم التعلّم'),
      tx(
        'Completed lessons, missions, achievements, and XP are stored against your account so you can pick up where you left off. This data is not shared with other users or third parties.',
        'الدروس والمهام والإنجازات ونقاط الخبرة المكتملة تُحفظ على حسابك لتعود من حيث توقفت. لا تُشارك هذه البيانات مع مستخدمين آخرين أو أطراف ثالثة.',
      ),
    ],
    [
      tx('Browser storage', 'تخزين المتصفح'),
      tx(
        "Before you sign in, and for any device-specific preferences (like terminal font size), Terminal Space uses your browser's local storage. This data stays on your device and is cleared if you clear your browser's site data.",
        'قبل تسجيل الدخول، ولتفضيلات خاصة بالجهاز (مثل حجم خط الطرفية)، يستخدم تيرمنال سبيس التخزين المحلي للمتصفح. تبقى هذه البيانات على جهازك وتُمسح إن مسحت بيانات الموقع من المتصفح.',
      ),
    ],
    [
      tx('Analytics', 'التحليلات'),
      tx(
        'Terminal Space does not currently use any third-party analytics or advertising services.',
        'تيرمنال سبيس لا يستخدم حالياً أي خدمات تحليلات أو إعلان من طرف ثالث.',
      ),
    ],
    [
      tx('Contact submissions', 'رسائل التواصل'),
      tx(
        'Messages sent through the contact form (name, email, and message) are stored so we can respond to them. They are not used for marketing.',
        'الرسائل المرسلة عبر نموذج التواصل (الاسم والبريد والرسالة) تُحفظ لنرد عليها. لا تُستخدم للتسويق.',
      ),
    ],
    [
      tx('Deletion requests', 'طلبات الحذف'),
      tx(
        'You can reset your learning progress from Settings at any time. For full account deletion, contact us — see the contact page.',
        'يمكنك إعادة ضبط تقدّم التعلّم من الإعدادات في أي وقت. لحذف الحساب كاملاً راسلنا — انظر صفحة التواصل.',
      ),
    ],
  ],
};

export const TERMS_COPY = {
  kicker: tx('Terms', 'الشروط'),
  title: tx('Terms of use', 'شروط الاستخدام'),
  lede: tx(
    'A plain-language summary of the ground rules for using Terminal Space. This is a starting point for final legal review, not a finished legal document.',
    'ملخص بلغة واضحة للقواعد الأساسية لاستخدام تيرمنال سبيس. هذه نقطة بداية للمراجعة القانونية النهائية، لا وثيقة قانونية مكتملة.',
  ),
  sections: [
    [
      tx('What Terminal Space is', 'ما تيرمنال سبيس'),
      tx(
        'Terminal Space is a browser-based tool for learning command-line skills against a simulated computer. It is provided as-is, without warranty, and the available lessons, missions, and tracks may change over time.',
        'تيرمنال سبيس أداة في المتصفح لتعلّم مهارات سطر الأوامر على حاسوب محاكى. يُقدَّم كما هو، بلا ضمان، وقد تتغيّر الدروس والمهام والمسارات المتاحة مع الوقت.',
      ),
    ],
    [
      tx('Your account', 'حسابك'),
      tx(
        "You're responsible for keeping your account credentials secure. Don't share an account, and don't use Terminal Space to attempt to access another learner's data.",
        'أنت مسؤول عن حماية بيانات دخول حسابك. لا تشارك حساباً، ولا تستخدم تيرمنال سبيس لمحاولة الوصول إلى بيانات متعلّم آخر.',
      ),
    ],
    [
      tx('Acceptable use', 'الاستخدام المقبول'),
      tx(
        "Don't attempt to disrupt the service, submit abusive content through the contact form, or use Terminal Space for anything unlawful.",
        'لا تحاول تعطيل الخدمة، ولا ترسل محتوى مسيئاً عبر نموذج التواصل، ولا تستخدم تيرمنال سبيس لأي غرض غير قانوني.',
      ),
    ],
    [
      tx('Content', 'المحتوى'),
      tx(
        "Lesson and mission content is owned by Terminal Space. You're welcome to use what you learn — the code you practice writing is yours.",
        'محتوى الدروس والمهام ملك تيرمنال سبيس. لك أن تستخدم ما تتعلّمه — والشيفرة التي تتدرّب على كتابتها ملكك.',
      ),
    ],
    [
      tx('Changes', 'التغييرات'),
      tx(
        'We may update these terms as the product changes. Continued use after a change means you accept the update.',
        'قد نحدّث هذه الشروط مع تغيّر المنتج. استمرار الاستخدام بعد التغيير يعني قبولك للتحديث.',
      ),
    ],
  ],
};

export const NOT_FOUND_COPY = {
  title: tx('That page does not exist', 'هذه الصفحة غير موجودة'),
  tab: tx('Page Not Found', 'الصفحة غير موجودة'),
  noTrack: tx('No such track', 'لا يوجد هذا المسار'),
};

export function nothingRouted(pathname: string): LocalizedText {
  return tx(`Nothing is routed at ${pathname}.`, `لا يوجد مسار عند ${pathname}.`);
}

export function noTrackBody(trackId: string): LocalizedText {
  return tx(
    `Terminal Space has no track called “${trackId}”.`,
    `ليس لدى تيرمنال سبيس مسار باسم “${trackId}”.`,
  );
}

export const PLANNED_TRACK_COPY = {
  kicker: tx('Planned track', 'مسار مخطط'),
  goFiles: tx('Go to the Files track', 'اذهب إلى مسار الملفات'),
  backDash: tx('Back to dashboard', 'العودة إلى لوحة التحكّم'),
  honest: tx(
    'There are no lessons behind this page, so rather than show you an empty path, here is the honest version: it does not exist yet.',
    'لا دروس خلف هذه الصفحة، لذلك بدل مسار فارغ هذه هي النسخة الصريحة: لم يُبنَ بعد.',
  ),
  filesStart: tx(
    'The Files track is the right place to start — most of what you learn there (paths, arguments, reading errors) is what makes the later tracks readable.',
    'مسار الملفات هو المكان الصحيح للبداية — معظم ما تتعلّمه هناك (المسارات، الوسائط، قراءة الأخطاء) هو ما يجعل المسارات اللاحقة مقروءة.',
  ),
};

export function plannedTrackTitle(name: string): LocalizedText {
  return tx(`${name} is not built yet`, `${name} لم يُبنَ بعد`);
}

export const PROGRESS_COPY = {
  kicker: tx('Progress', 'التقدّم'),
  title: tx('Your Files progress', 'تقدّمك في مسار الملفات'),
  lede: tx(
    "Everything here comes straight from what you've actually completed — no invented metrics.",
    'كل ما هنا يأتي مما أكملته فعلاً — بلا أرقام مخترعة.',
  ),
  filesTrack: tx('Files track', 'مسار الملفات'),
  publishedPct: tx('of published content', 'من المحتوى المنشور'),
  completionAria: tx('Files track completion', 'اكتمال مسار الملفات'),
  publishedLessons: tx('Published lessons', 'دروس منشورة'),
  unitsAvailable: tx('Units available', 'وحدات متاحة'),
  missionsComplete: tx('Missions complete', 'مهام مكتملة'),
  achievementsEarned: tx('Achievements earned', 'إنجازات مكتسبة'),
  units: tx('Units', 'الوحدات'),
  commandsLearned: tx('Commands learned', 'أوامر تعلّمتها'),
  emptyCommands: tx('Complete your first lesson to start building this list.', 'أكمل درسك الأول لتبدأ بناء هذه القائمة.'),
  fuller: tx('Want the fuller picture, badge by badge?', 'تريد الصورة الكاملة، وساماً وساماً؟'),
  viewAchievements: tx('View achievements', 'عرض الإنجازات'),
};

export function unitLessonsCount(done: number, total: number): LocalizedText {
  return tx(`${done} / ${total} lessons`, `${done} / ${total} دروس`);
}

export const ACHIEVEMENTS_COPY = {
  kicker: tx('Achievements', 'الإنجازات'),
  title: tx('Milestones, not the point', 'محطات، لا الغاية'),
  lede: tx(
    'These mark things you have already done. They do not gate lessons or missions — progress through the track is what unlocks content.',
    'هذه تعلّم أشياء أنجزتها. لا تغلق دروساً ولا مهاماً — تقدّم المسار هو ما يفتح المحتوى.',
  ),
  foot: tx(
    'Achievements come from ordinary use. The fastest way to collect them is to keep working through the track.',
    'الإنجازات تأتي من الاستخدام العادي. أسرع طريقة لجمعها أن تواصل المسار.',
  ),
  backPath: tx('Back to the Files path', 'العودة إلى مسار الملفات'),
  categories: {
    Learning: tx('Learning', 'التعلّم'),
    Terminal: tx('Terminal', 'الطرفية'),
    Files: tx('Files', 'الملفات'),
    Missions: tx('Missions', 'المهام'),
    Mastery: tx('Mastery', 'الإتقان'),
  } as Record<string, LocalizedText>,
};

export function earnedOf(done: number, total: number): LocalizedText {
  return tx(`${done} of ${total} earned`, `${done} من ${total} مكتسب`);
}

export const DASH_COPY = {
  emptyAchievements: tx(
    'Nothing yet. Running your first command earns one — it is the first thing lesson 1 asks for.',
    'لا شيء بعد. تشغيل أمرك الأول يكسبك واحداً — وهو أول ما يطلبه الدرس 1.',
  ),
  allMissionsDone: tx(
    'Every unlocked mission is done. New ones open as later units are built.',
    'كل مهمة مفتوحة أُنجزت. تُفتح مهام جديدة كلما بُنيت وحدات لاحقة.',
  ),
  missionsUnlock: tx('Missions unlock as you finish lessons.', 'المهام تُفتح كلما أنهيت دروساً.'),
  xpTowardLevel: tx('XP toward next player level', 'نقاط الخبرة نحو مستوى اللاعب التالي'),
};

export function missionReady(title: string): LocalizedText {
  return tx(`${title} is ready to start.`, `${title} جاهزة للبدء.`);
}

export function missionOpensAfter(title: string, missing: string): LocalizedText {
  return tx(
    `Missions unlock as you finish lessons. ${title} opens after: ${missing}.`,
    `المهام تُفتح كلما أنهيت دروساً. تُفتح «${title}» بعد: ${missing}.`,
  );
}

export const FILES_PATH_COPY = {
  foundations: tx(
    "You've completed all currently available Files content. Further units are written but not yet built — they'll appear here once they are.",
    'أكملت كل محتوى الملفات المتاح حالياً. وحدات لاحقة مكتوبة ولم تُبنَ بعد — ستظهر هنا متى بُنيت.',
  ),
  plannedEmpty: tx(
    'Written but not built yet. Nothing opens here, and nothing pretends to.',
    'مكتوب ولم يُبنَ بعد. لا شيء يُفتح هنا، ولا شيء يدّعي غير ذلك.',
  ),
  currentlyIn: tx('currently in unit', 'حالياً في الوحدة'),
};

export function completeUnitToUnlock(name: string): LocalizedText {
  return tx(`Complete ${name} to unlock.`, `أكمل «${name}» لفتح هذه الوحدة.`);
}

export const LAB_HELP = {
  lede: tx(
    'Commands run inside this browser. None of them reach your real machine.',
    'الأوامر تعمل داخل هذا المتصفح. لا يصل أي منها إلى جهازك الحقيقي.',
  ),
  shortcuts: [
    [tx('Ctrl + L', 'Ctrl + L'), tx('Clear the terminal screen', 'مسح شاشة الطرفية')],
    [tx('Arrow Up / Down', 'السهم للأعلى / للأسفل'), tx('Step through command history', 'التنقّل في سجل الأوامر')],
    [tx('Tab', 'Tab'), tx('Complete a command or file name', 'إكمال أمر أو اسم ملف')],
    [tx('Ctrl + C', 'Ctrl + C'), tx('Clear the current input line', 'مسح سطر الإدخال الحالي')],
    [tx('Esc', 'Esc'), tx('Close Start, menus, and dialogs', 'إغلاق القوائم والنوافذ الحوارية')],
  ],
  tips: [
    tx(
      'Lessons watch the disk, not your keystrokes. If the folder exists, it counts.',
      'الدروس تراقب القرص، لا ضغطات المفاتيح. إن وُجد المجلد، يُحتسب.',
    ),
    tx('dir and ls both list a folder. Use whichever you remember.', 'dir وls كلاهما يعرض المجلد. استخدم ما تتذكره.'),
    tx(
      'rmdir refuses a folder that still has files. Empty it, or use rmdir /s.',
      'rmdir يرفض مجلداً ما زال فيه ملفات. أفرغه، أو استخدم rmdir /s.',
    ),
    tx(
      'Deleted Explorer items sit in Recycle Bin until you empty it.',
      'عناصر المستكشف المحذوفة تبقى في سلة المحذوفات حتى تفرّغها.',
    ),
  ],
};

export const COMMAND_CATEGORIES: Record<string, LocalizedText> = {
  Navigation: tx('Navigation', 'التنقّل'),
  Files: tx('Files', 'الملفات'),
  Folders: tx('Folders', 'المجلدات'),
  Copying: tx('Copying', 'النسخ'),
  Moving: tx('Moving', 'النقل'),
  Deleting: tx('Deleting', 'الحذف'),
  Utilities: tx('Utilities', 'أدوات'),
};

export const COMMAND_SUMMARIES: Record<string, LocalizedText> = {
  cd: tx('Change the current folder, or print it if you omit a path.', 'غيّر المجلد الحالي، أو اطبعه إن حذفت المسار.'),
  pwd: tx('Print the current folder.', 'اطبع المجلد الحالي.'),
  dir: tx('List files and folders in a directory.', 'اعرض الملفات والمجلدات في مجلد.'),
  mkdir: tx('Creates a new directory.', 'ينشئ مجلداً جديداً.'),
  touch: tx('Create an empty file (simulated).', 'أنشئ ملفاً فارغاً (محاكاة).'),
  type: tx('Show a file, or create one with type nul > file.txt', 'اعرض ملفاً، أو أنشئه بـ type nul > file.txt'),
  ren: tx('Rename a file or folder in the current directory.', 'أعد تسمية ملف أو مجلد في المجلد الحالي.'),
  copy: tx('Copy a file to a new name or folder.', 'انسخ ملفاً إلى اسم أو مجلد جديد.'),
  move: tx('Move a file or folder to a new location.', 'انقل ملفاً أو مجلداً إلى مكان جديد.'),
  del: tx('Delete a file (sent to Recycle Bin in this lab).', 'احذف ملفاً (يذهب إلى سلة المحذوفات في هذا المختبر).'),
  rmdir: tx('Remove an empty folder. Use /s to remove contents too.', 'احذف مجلداً فارغاً. استخدم /s لحذف المحتويات أيضاً.'),
  cls: tx('Clear the terminal screen.', 'امسح شاشة الطرفية.'),
  help: tx('List commands, or explain one command.', 'اعرض الأوامر، أو اشرح أمراً واحداً.'),
  ver: tx('Show the virtual computer version.', 'اعرض إصدار الحاسوب الافتراضي.'),
  echo: tx('Print text. echo Hello > file.txt writes that text to a file.', 'اطبع نصاً. echo Hello > file.txt يكتب النص في ملف.'),
  exit: tx('Close the Terminal window.', 'أغلق نافذة الطرفية.'),
};
