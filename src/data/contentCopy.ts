import type { LocalizedText } from '../lib/i18n';
import { tx } from '../lib/i18n';

export const TRACK_COPY: Record<string, { name: LocalizedText; tagline: LocalizedText; blurb: LocalizedText }> = {
  files: {
    name: tx('Files', 'الملفات'),
    tagline: tx('Control files and directories from the terminal.', 'تحكّم بالملفات والمجلدات من الطرفية.'),
    blurb: tx(
      'Read the prompt, move between folders, and create, rename, copy, move, and delete things without touching a mouse.',
      'اقرأ الموجّه، انتقل بين المجلدات، وأنشئ وأعد التسمية وانسخ وانقل واحذف دون لمس الفأرة.',
    ),
  },
  systems: {
    name: tx('Systems', 'الأنظمة'),
    tagline: tx('Processes, machine info, and system settings.', 'العمليات ومعلومات الجهاز وإعدادات النظام.'),
    blurb: tx('Not written yet.', 'لم يُكتب بعد.'),
  },
  networking: {
    name: tx('Networking', 'الشبكات'),
    tagline: tx('Simulated ping, ipconfig, and host lookups.', 'محاكاة ping وipconfig والبحث عن المضيفين.'),
    blurb: tx('Not written yet.', 'لم يُكتب بعد.'),
  },
  git: {
    name: tx('Git', 'Git'),
    tagline: tx('Version control from the command line.', 'التحكم بالإصدارات من سطر الأوامر.'),
    blurb: tx('Not written yet.', 'لم يُكتب بعد.'),
  },
  development: {
    name: tx('Development', 'التطوير'),
    tagline: tx('Build tools, scripts, and package managers.', 'أدوات البناء والسكربتات ومديرو الحزم.'),
    blurb: tx('Not written yet.', 'لم يُكتب بعد.'),
  },
  servers: {
    name: tx('Servers', 'الخوادم'),
    tagline: tx('Remote machines, permissions, and services.', 'الأجهزة البعيدة والصلاحيات والخدمات.'),
    blurb: tx('Not written yet.', 'لم يُكتب بعد.'),
  },
};

export const UNIT_COPY: Record<string, { name: LocalizedText; summary: LocalizedText }> = {
  'files-u1': {
    name: tx('Terminal Rookie', 'أساسيات الطرفية'),
    summary: tx('Read the prompt, run your first command, list a folder.', 'اقرأ الموجّه، نفّذ أمرك الأول، واعرض محتويات مجلد.'),
  },
  'files-u2': {
    name: tx('Finding Your Way', 'التنقّل بين المجلدات'),
    summary: tx('Move between directories and name places with paths.', 'انتقل بين المجلدات وسمِّ الأماكن بالمسارات.'),
  },
  'files-u3': {
    name: tx('Building Things', 'إنشاء المجلدات والملفات'),
    summary: tx('Create directories and files exactly where you want them.', 'أنشئ المجلدات والملفات في المكان الذي تريده.'),
  },
  'files-u4': {
    name: tx('File Management', 'إدارة الملفات'),
    summary: tx('Rename, copy, move, and delete safely.', 'أعد التسمية وانسخ وانقل واحذف بأمان.'),
  },
  'files-u5': {
    name: tx('Working Efficiently', 'العمل بكفاءة'),
    summary: tx('History, tab completion, and the habits that make you fast.', 'السجل، الإكمال بـ Tab، والعادات التي تجعلك سريعاً.'),
  },
  'files-u6': {
    name: tx('Search & Inspect', 'البحث والفحص'),
    summary: tx('Find files and read what is inside them from the terminal.', 'اعثر على الملفات واقرأ محتواها من الطرفية.'),
  },
  'files-u7': {
    name: tx('Real Terminal Tasks', 'مهام عملية على الطرفية'),
    summary: tx('Longer jobs modelled on work people actually do.', 'أعمال أطول على نمط ما يقوم به الناس فعلاً.'),
  },
  'files-u8': {
    name: tx('Files Mastery', 'إتقان الملفات'),
    summary: tx('One independent challenge. No step-by-step answers.', 'تحدٍ مستقل واحد. بلا إجابات خطوة بخطوة.'),
  },
};

export const MISSION_COPY: Record<
  string,
  {
    title: LocalizedText;
    scenario: LocalizedText;
    briefing: LocalizedText;
    objective: LocalizedText;
    hint: LocalizedText;
    difficulty: LocalizedText;
  }
> = {
  'm-messy-desktop': {
    title: tx('Messy Desktop', 'سطح مكتب فوضوي'),
    difficulty: tx('Starter', 'مبتدئ'),
    scenario: tx('Four loose files have piled up on the Desktop.', 'أربعة ملفات مبعثرة تكدست على سطح المكتب.'),
    briefing: tx(
      'Your Desktop has two text files and two images sitting loose. Sort them into a Notes folder and an Images folder so the Desktop is clean.',
      'سطح مكتبك فيه ملفان نصيان وصورتان مبعثران. رتّبهم في مجلد Notes ومجلد Images حتى يصبح سطح المكتب نظيفاً.',
    ),
    objective: tx(
      'Desktop\\Notes holds todo.txt and ideas.txt. Desktop\\Images holds logo.png and screenshot.png.',
      'Desktop\\Notes يحتوي todo.txt وideas.txt. Desktop\\Images يحتوي logo.png وscreenshot.png.',
    ),
    hint: tx(
      'mkdir makes the two folders. move puts each file inside one. dir shows what is left.',
      'mkdir ينشئ المجلدين. move يضع كل ملف داخل واحد. dir يعرض ما تبقّى.',
    ),
  },
  'm-school-setup': {
    title: tx('School Assignment Setup', 'تجهيز واجب مدرسي'),
    difficulty: tx('Starter', 'مبتدئ'),
    scenario: tx('A new biology assignment needs somewhere to live.', 'واجب أحياء جديد يحتاج مكاناً ليعيش فيه.'),
    briefing: tx(
      'Set up a folder for a biology assignment inside Documents: a place for notes, plus an empty essay and a sources file ready to write in.',
      'جهّز مجلداً لواجب الأحياء داخل Documents: مكان للملاحظات، مع ملف مقال فارغ وملف مصادر جاهزين للكتابة.',
    ),
    objective: tx(
      'Documents\\Biology contains a Notes folder, essay.txt, and sources.txt.',
      'Documents\\Biology يحتوي مجلد Notes وessay.txt وsources.txt.',
    ),
    hint: tx(
      'mkdir for the folders, touch for the two files. cd into Biology first if that feels easier.',
      'mkdir للمجلدات، touch للملفين. ادخل Biology بـ cd أولاً إن كان ذلك أسهل.',
    ),
  },
  'm-photo-organizer': {
    title: tx('Photo Organizer', 'منظّم الصور'),
    difficulty: tx('Intermediate', 'متوسط'),
    scenario: tx('Pictures is one long list of unsorted images.', 'Pictures قائمة طويلة من صور غير مرتبة.'),
    briefing: tx(
      'Pictures holds two holiday photos, a birthday photo, and a screenshot. Give each kind its own folder so the album makes sense.',
      'Pictures يحتوي صورتين للعطلة وصورة عيد ميلاد ولقطة شاشة. أعطِ كل نوع مجلده حتى يصبح الألبوم مفهوماً.',
    ),
    objective: tx(
      'Pictures\\Holiday holds both holiday photos, Pictures\\Birthday holds birthday.jpg, Pictures\\Screenshots holds capture.png.',
      'Pictures\\Holiday يحتوي صورتي العطلة، Pictures\\Birthday يحتوي birthday.jpg، Pictures\\Screenshots يحتوي capture.png.',
    ),
    hint: tx(
      'Three folders, then move each file into the right one. Move takes one file at a time.',
      'ثلاثة مجلدات، ثم انقل كل ملف إلى المكان الصحيح. move يأخذ ملفاً واحداً في كل مرة.',
    ),
  },
  'm-lost-file': {
    title: tx('Lost File', 'ملف ضائع'),
    difficulty: tx('Intermediate', 'متوسط'),
    scenario: tx('Chemistry homework was saved in Downloads under a useless name.', 'واجب الكيمياء حُفظ في Downloads باسم بلا معنى.'),
    briefing: tx(
      'Downloads\\temp holds untitled.txt — it is actually your chemistry homework. Give it a real name and file it under Documents\\School. Nothing should be left in Downloads\\temp.',
      'Downloads\\temp يحتوي untitled.txt — إنه واجب الكيمياء. أعطه اسماً حقيقياً وضعه تحت Documents\\School. لا يجب أن يبقى شيء في Downloads\\temp.',
    ),
    objective: tx(
      'Documents\\School\\chemistry.txt exists and Downloads\\temp\\untitled.txt is gone.',
      'Documents\\School\\chemistry.txt موجود وDownloads\\temp\\untitled.txt اختفى.',
    ),
    hint: tx(
      'You can cd into Downloads\\temp to look first. ren changes the name, move relocates it, and School has to exist before anything can move into it.',
      'يمكنك الدخول إلى Downloads\\temp بـ cd للنظر أولاً. ren يغيّر الاسم، move ينقل الملف، ويجب أن يوجد School قبل أن يدخل إليه شيء.',
    ),
  },
  'm-dev-workspace': {
    title: tx('Developer Workspace', 'مساحة عمل المطوّر'),
    difficulty: tx('Advanced', 'متقدم'),
    scenario: tx('A new web project starts as an empty folder.', 'مشروع ويب جديد يبدأ كمجلد فارغ.'),
    briefing: tx(
      'Build the skeleton of a small website project under Projects\\app: a README at the top, a src folder holding index.html and styles.css, and an empty tests folder.',
      'ابنِ هيكل موقع صغير تحت Projects\\app: README في الأعلى، ومجلد src فيه index.html وstyles.css، ومجلد tests فارغ.',
    ),
    objective: tx(
      'Projects\\app has README.md, src\\index.html, src\\styles.css, and a tests folder.',
      'Projects\\app يحتوي README.md وsrc\\index.html وsrc\\styles.css ومجلد tests.',
    ),
    hint: tx(
      'Create folders before the files that go inside them. Full paths like touch src\\styles.css save you a cd.',
      'أنشئ المجلدات قبل الملفات التي تدخلها. المسارات الكاملة مثل touch src\\styles.css تغنيك عن cd.',
    ),
  },
  'm-cleanup-duty': {
    title: tx('Cleanup Duty', 'واجب التنظيف'),
    difficulty: tx('Advanced', 'متقدم'),
    scenario: tx('An old scratch folder is full of junk, but one file matters.', 'مجلد مسودات قديم مليء بالزوائد، لكن ملفاً واحداً مهم.'),
    briefing: tx(
      'Projects\\old holds two throwaway .tmp files and one file worth keeping. Put a copy of keep.txt somewhere safe in Projects\\Backup, then get rid of Projects\\old entirely.',
      'Projects\\old يحتوي ملفين .tmp للرمي وملفاً يستحق الحفظ. ضع نسخة من keep.txt في مكان آمن داخل Projects\\Backup، ثم احذف Projects\\old بالكامل.',
    ),
    objective: tx(
      'Projects\\Backup\\keep.txt exists and Projects\\old no longer exists.',
      'Projects\\Backup\\keep.txt موجود وProjects\\old لم يعد موجوداً.',
    ),
    hint: tx(
      'Copy before you delete. rmdir refuses a folder that still has files in it — empty it first, or use rmdir /s.',
      'انسخ قبل الحذف. rmdir يرفض مجلداً ما زال فيه ملفات — أفرغه أولاً، أو استخدم rmdir /s.',
    ),
  },
  'm-inbox-sort': {
    title: tx('Downloads Triage', 'فرز التنزيلات'),
    difficulty: tx('Intermediate', 'متوسط'),
    scenario: tx('Downloads is a pile again: a PDF, a photo, and a text dump.', 'Downloads كومة مجدداً: PDF وصورة ونص.'),
    briefing: tx(
      'Downloads has invoice.pdf, holiday.jpg, and dump.txt sitting loose. Make Docs, Photos, and Text folders and file each item. dir on Downloads should then show only folders.',
      'Downloads فيه invoice.pdf وholiday.jpg وdump.txt مبعثرة. أنشئ مجلدات Docs وPhotos وText وضع كل ملف في مكانه. dir على Downloads يجب أن يعرض مجلدات فقط بعدها.',
    ),
    objective: tx(
      'Downloads\\Docs\\invoice.pdf, Downloads\\Photos\\holiday.jpg, and Downloads\\Text\\dump.txt exist.',
      'Downloads\\Docs\\invoice.pdf وDownloads\\Photos\\holiday.jpg وDownloads\\Text\\dump.txt موجودة.',
    ),
    hint: tx(
      'mkdir three folders, then move each file. type dump.txt first if you want to be sure it is text.',
      'mkdir لثلاثة مجلدات، ثم move لكل ملف. type dump.txt أولاً إن أردت التأكد أنه نص.',
    ),
  },
  'm-read-then-file': {
    title: tx('Read Then File', 'اقرأ ثم أرشف'),
    difficulty: tx('Intermediate', 'متوسط'),
    scenario: tx('A note on the Desktop says where it belongs. Read it, then put it there.', 'ملاحظة على سطح المكتب تقول أين مكانها. اقرأها ثم ضعها هناك.'),
    briefing: tx(
      'Desktop\\where.txt tells you to store it in Documents\\Filed. Read the file, make Filed if needed, and move the note there.',
      'Desktop\\where.txt يطلب حفظه في Documents\\Filed. اقرأ الملف، أنشئ Filed إن لزم، وانقل الملاحظة إليه.',
    ),
    objective: tx(
      'Documents\\Filed\\where.txt exists and Desktop\\where.txt does not.',
      'Documents\\Filed\\where.txt موجود وDesktop\\where.txt غير موجود.',
    ),
    hint: tx(
      'type Desktop\\where.txt. mkdir Documents\\Filed if it is missing. move the file.',
      'type Desktop\\where.txt. mkdir Documents\\Filed إن كان ناقصاً. ثم move للملف.',
    ),
  },
  'm-workspace-label': {
    title: tx('Label the Workspace', 'سمِّ مساحة العمل'),
    difficulty: tx('Advanced', 'متقدم'),
    scenario: tx(
      'A project folder exists. You need a README inside it that you can prove you wrote.',
      'مجلد مشروع موجود. تحتاج README داخله تستطيع إثبات أنك كتبته.',
    ),
    briefing: tx(
      'Projects\\Lab already exists. Create readme.txt inside it with any text (echo or a touch plus later edits are fine in this lab — touch an empty file is enough), then prove you can print it with type.',
      'Projects\\Lab موجود مسبقاً. أنشئ readme.txt داخله بأي نص (echo أو touch يكفيان هنا)، ثم أثبت أنك تستطيع طباعته بـ type.',
    ),
    objective: tx('Projects\\Lab\\readme.txt exists.', 'Projects\\Lab\\readme.txt موجود.'),
    hint: tx(
      'cd into Projects\\Lab or use a full path. touch readme.txt. type readme.txt to inspect it.',
      'ادخل Projects\\Lab بـ cd أو استخدم مساراً كاملاً. touch readme.txt. type readme.txt لفحصه.',
    ),
  },
};

export const ACHIEVEMENT_COPY: Record<string, { title: LocalizedText; description: LocalizedText }> = {
  'first-command': {
    title: tx('First Command', 'الأمر الأول'),
    description: tx('Run a command in Terminal.', 'نفّذ أمراً في الطرفية.'),
  },
  'twenty-commands': {
    title: tx('Getting Fluent', 'طلاقة أولى'),
    description: tx('Run 20 commands.', 'نفّذ 20 أمراً.'),
  },
  organizer: {
    title: tx('Organizer', 'المنظّم'),
    description: tx('Create a folder.', 'أنشئ مجلداً.'),
  },
  'file-explorer': {
    title: tx('File Maker', 'صانع الملفات'),
    description: tx('Create a file on the virtual disk.', 'أنشئ ملفاً على القرص المحاكى.'),
  },
  'copy-master': {
    title: tx('Copy Master', 'أستاذ النسخ'),
    description: tx('Copy a file.', 'انسخ ملفاً.'),
  },
  cleanup: {
    title: tx('Cleanup', 'تنظيف'),
    description: tx('Delete a file or folder.', 'احذف ملفاً أو مجلداً.'),
  },
  rookie: {
    title: tx('Terminal Rookie', 'أساسيات الطرفية'),
    description: tx('Finish your first lesson.', 'أنهِ درسك الأول.'),
  },
  navigator: {
    title: tx('Navigator', 'الملاح'),
    description: tx('Finish the Finding Your Way unit.', 'أنهِ وحدة التنقّل بين المجلدات.'),
  },
  'five-lessons': {
    title: tx('Five Down', 'خمسة دروس'),
    description: tx('Finish 5 lessons.', 'أنهِ 5 دروس.'),
  },
  'first-mission': {
    title: tx('On The Job', 'في العمل'),
    description: tx('Complete a mission.', 'أكمل مهمة.'),
  },
  'mission-veteran': {
    title: tx('Mission Veteran', 'محارب المهام'),
    description: tx('Complete 3 missions.', 'أكمل 3 مهام.'),
  },
  'mission-complete': {
    title: tx('Field Ready', 'جاهز للميدان'),
    description: tx('Complete every mission.', 'أكمل كل المهام.'),
  },
  unaided: {
    title: tx('On Your Own', 'بنفسك'),
    description: tx('Finish a lesson without revealing an answer.', 'أنهِ درساً دون كشف الإجابة.'),
  },
  apprentice: {
    title: tx('Files Apprentice', 'متدرّب الملفات'),
    description: tx('Finish every built lesson in the Files track.', 'أنهِ كل درس مبني في مسار الملفات.'),
  },
};
