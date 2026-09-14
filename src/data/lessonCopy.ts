import type { LocalizedText } from '../lib/i18n';
import { tx } from '../lib/i18n';

type StepCopy = {
  title?: LocalizedText;
  body?: LocalizedText;
  prompt?: LocalizedText;
  hints?: LocalizedText[];
  successTitle?: LocalizedText;
  successBody?: LocalizedText;
  explanation?: LocalizedText;
  question?: {
    prompt: LocalizedText;
    explanation?: LocalizedText;
    choices?: Record<string, LocalizedText>;
  };
};

export const LESSON_COPY: Record<string, { title: LocalizedText; subtitle: LocalizedText }> = {
  'files-1': { title: tx('Meet the Terminal', 'تعرّف على الطرفية'), subtitle: tx('Prompt, cursor, Enter, and your first command.', 'الموجّه، المؤشر، Enter، وأمرك الأول.') },
  'files-2': { title: tx('Look Around', 'انظر حولك'), subtitle: tx('dir lists the files and folders in front of you.', 'dir يسرد الملفات والمجلدات أمامك.') },
  'files-3': { title: tx('Create Directories', 'إنشاء المجلدات'), subtitle: tx('mkdir makes a folder in the directory you are standing in.', 'mkdir يُنشئ مجلداً في المجلد الذي تقف فيه.') },
  'files-4': { title: tx('Move Around', 'تنقّل'), subtitle: tx('cd changes the current directory. The prompt follows you.', 'cd يغيّر المجلد الحالي. الموجّه يتبعك.') },
  'files-5': { title: tx('Paths', 'المسارات'), subtitle: tx('Relative and absolute names for the same place.', 'أسماء نسبية ومطلقة للمكان نفسه.') },
  'files-6': { title: tx('Create Files', 'إنشاء الملفات'), subtitle: tx('touch makes an empty text file in the current directory.', 'touch يُنشئ ملفاً نصياً فارغاً في المجلد الحالي.') },
  'files-7': { title: tx('Rename', 'إعادة التسمية'), subtitle: tx('ren changes a name without moving the file.', 'ren يغيّر الاسم دون نقل الملف.') },
  'files-8': { title: tx('Copy', 'النسخ'), subtitle: tx('copy leaves the original and makes a second file.', 'copy يُبقي الأصل ويُنشئ ملفاً ثانياً.') },
  'files-9': { title: tx('Move', 'النقل'), subtitle: tx('move relocates a file. The original path is gone.', 'move ينقل الملف. المسار الأصلي يختفي.') },
  'files-10': { title: tx('Delete Safely', 'الحذف بأمان'), subtitle: tx('del removes a file. In this lab it goes to Recycle Bin.', 'del يحذف ملفاً. في هذا المختبر يذهب إلى سلة المحذوفات.') },
  'files-11': { title: tx('Files Challenge', 'تحدي الملفات'), subtitle: tx('Build a small project tree from memory. No step-by-step answers.', 'ابنِ شجرة مشروع صغيرة من الذاكرة. بلا إجابات خطوة بخطوة.') },
  'files-12': { title: tx('Command History', 'سجل الأوامر'), subtitle: tx('Arrow Up recalls what you already typed.', 'السهم للأعلى يسترجع ما كتبته.') },
  'files-13': { title: tx('Tab Completion', 'الإكمال بـ Tab'), subtitle: tx('Tab finishes a name so you type less and misspell less.', 'Tab يُكمل الاسم فتقل الكتابة والأخطاء.') },
  'files-14': { title: tx('Print Working Directory', 'طباعة المجلد الحالي'), subtitle: tx('pwd names the folder in the prompt, in case the prompt is hard to read.', 'pwd يسمّي المجلد في الموجّه إن صعب قراءته.') },
  'files-15': { title: tx('Read a File', 'قراءة ملف'), subtitle: tx('type prints a file’s text without opening an editor.', 'type يطبع نص الملف دون فتح محرر.') },
  'files-16': { title: tx('Ask for Help', 'طلب المساعدة'), subtitle: tx('help lists commands. help name describes one command.', 'help يسرد الأوامر. help name يصف أمراً واحداً.') },
  'files-17': { title: tx('Sort the Downloads', 'ترتيب التنزيلات'), subtitle: tx('A short real job: folders, moves, and a check with dir.', 'عمل حقيقي قصير: مجلدات ونقل وتحقق بـ dir.') },
  'files-18': { title: tx('Read then Relocate', 'اقرأ ثم انقل'), subtitle: tx('Inspect a file, then put it where it belongs.', 'افحص ملفاً ثم ضعه في مكانه.') },
};

export const STEP_COPY: Record<string, StepCopy> = {
  'f1-intro': {
    title: tx('This is a terminal', 'هذه طرفية'),
    body: tx(
      'A terminal is a text window for talking to a computer. You type a command, press Enter, and the computer replies with text. Nothing you type here reaches your real machine.',
      'الطرفية نافذة نصّية للحديث مع الحاسوب. تكتب أمراً، تضغط Enter، فيرد الحاسوب بالنص. لا شيء مما تكتبه هنا يصل إلى جهازك الحقيقي.',
    ),
  },
  'f1-prompt': {
    title: tx('The prompt is your location', 'الموجّه هو موقعك'),
    body: tx(
      'The text before > is the current directory — the folder the terminal is standing in. The blinking cursor is where the next character will appear. Press Enter to run whatever you typed.',
      'النص قبل > هو المجلد الحالي — المجلد الذي تقف فيه الطرفية. المؤشر الوامض هو مكان الحرف التالي. اضغط Enter لتشغيل ما كتبته.',
    ),
  },
  'f1-echo': {
    title: tx('Your first command', 'أمرك الأول'),
    body: tx(
      'echo prints the words that follow it. It does not create a file. It just repeats the text so you can see that the terminal is listening.',
      'echo يطبع الكلمات التي تليه. لا ينشئ ملفاً. يعيد النص فقط لتعلم أن الطرفية تستمع.',
    ),
    prompt: tx('Type echo Hello in the Terminal, then press Enter.', 'اكتب echo Hello في الطرفية ثم اضغط Enter.'),
    hints: [
      tx('You need the command that prints text back to the screen.', 'تحتاج الأمر الذي يعيد النص إلى الشاشة.'),
      tx('The command begins with e.', 'الأمر يبدأ بحرف e.'),
      tx('Type echo followed by a space and Hello.', 'اكتب echo ثم مسافة ثم Hello.'),
    ],
    successTitle: tx('Command completed', 'اكتمل الأمر'),
    successBody: tx('The terminal printed your text. echo always talks; it does not change folders or files.', 'الطرفية طبعت نصك. echo يتكلم دائماً؛ لا يغيّر المجلدات أو الملفات.'),
    explanation: tx('echo prints whatever text follows it. Hello is the text you are asking it to print back.', 'echo يطبع النص الذي يليه. Hello هو النص الذي تطلب إعادة طباعته.'),
  },
  'f1-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx(
      'A prompt names your current folder. You type a command, press Enter, and read the reply. echo prints text. Nothing here touches your real computer.',
      'الموجّه يسمّي مجلدك الحالي. تكتب أمراً، تضغط Enter، وتقرأ الرد. echo يطبع نصاً. لا شيء هنا يمس حاسوبك الحقيقي.',
    ),
  },
  'f2-intro': {
    title: tx('Folders already exist', 'المجلدات موجودة مسبقاً'),
    body: tx(
      'The simulated disk already has a home folder with Desktop, Documents, Downloads, and more. You do not start from an empty universe.',
      'القرص المحاكى فيه مسبقاً مجلد المنزل مع Desktop وDocuments وDownloads وغيرها. لا تبدأ من كون فارغ.',
    ),
  },
  'f2-demo': {
    title: tx('Meet dir', 'تعرّف على dir'),
    body: tx('dir lists the files and folders in the current directory. ls does the same thing in this lab.', 'dir يسرد الملفات والمجلدات في المجلد الحالي. ls يفعل الشيء نفسه في هذا المختبر.'),
  },
  'f2-try': {
    title: tx('List this folder', 'اعرض هذا المجلد'),
    body: tx('You are in your home folder. Ask the terminal what is already here.', 'أنت في مجلد المنزل. اسأل الطرفية عمّا هو موجود هنا.'),
    prompt: tx('Run dir (or ls) in the Terminal.', 'نفّذ dir (أو ls) في الطرفية.'),
    hints: [tx('The listing command is three letters.', 'أمر العرض ثلاثة أحرف.'), tx('Type dir and press Enter.', 'اكتب dir واضغط Enter.')],
    successTitle: tx('Listed', 'تم العرض'),
    successBody: tx('Those names are folders you can enter later with cd.', 'هذه الأسماء مجلدات يمكنك دخولها لاحقاً بـ cd.'),
    explanation: tx('dir prints the contents of the current directory. It does not move you.', 'dir يطبع محتويات المجلد الحالي. لا ينقلك.'),
  },
  'f2-q': {
    title: tx('Check your reading', 'تحقق من قراءتك'),
    body: tx('A knowledge check. Pick the answer that matches what dir actually does.', 'تحقق معرفي. اختر الإجابة التي تطابق ما يفعله dir فعلاً.'),
    question: {
      prompt: tx(
        'You are at C:\\Users\\Student> and you run dir. What does the list show?',
        'أنت عند C:\\Users\\Student> وتشغّل dir. ماذا تعرض القائمة؟',
      ),
      explanation: tx(
        'dir lists the current directory. The prompt said Student, so you saw Student’s contents — not the whole disk, and not Desktop unless you were inside it.',
        'dir يسرد المجلد الحالي. الموجّه قال Student، لذلك رأيت محتويات Student — لا القرص كله، ولا Desktop ما لم تكن داخله.',
      ),
      choices: {
        a: tx('Every file on the C: drive', 'كل ملف على القرص C:'),
        b: tx('Only the files and folders inside C:\\Users\\Student', 'فقط الملفات والمجلدات داخل C:\\Users\\Student'),
        c: tx('Only files on your real computer', 'فقط ملفات جهازك الحقيقي'),
        d: tx('The contents of Desktop', 'محتويات Desktop'),
      },
    },
  },
  'f2-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx('dir (and ls) list the current folder. Read the list before you try to move or create anything.', 'dir (وls) يعرضان المجلد الحالي. اقرأ القائمة قبل أن تحاول النقل أو الإنشاء.'),
  },
  'f3-intro': {
    title: tx('Folders & directories', 'المجلدات والدلائل'),
    body: tx('Folder and directory mean the same thing here: a named container for files and other folders.', 'المجلد والدليل هنا شيء واحد: وعاء مسمّى للملفات والمجلدات الأخرى.'),
  },
  'f3-home': {
    title: tx('Home directory', 'مجلد المنزل'),
    body: tx('C:\\Users\\Student is your home. New folders you make without a path land inside wherever the prompt currently is.', 'C:\\Users\\Student هو منزلك. المجلدات الجديدة بلا مسار تهبط حيث يقف الموجّه الآن.'),
  },
  'f3-demo': {
    title: tx('Meet mkdir', 'تعرّف على mkdir'),
    body: tx('mkdir Name creates a directory called Name in the current folder.', 'mkdir Name يُنشئ مجلداً اسمه Name في المجلد الحالي.'),
  },
  'f3-try': {
    title: tx('Your turn', 'دورك'),
    body: tx('Create a directory named Projects in the current folder.', 'أنشئ مجلداً اسمه Projects في المجلد الحالي.'),
    prompt: tx('Make a directory called Projects.', 'أنشئ مجلداً اسمه Projects.'),
    hints: [tx('The command starts with mk.', 'الأمر يبدأ بـ mk.'), tx('Type mkdir Projects.', 'اكتب mkdir Projects.')],
    successTitle: tx('Created', 'تم الإنشاء'),
    successBody: tx('Projects now exists as a folder. dir will show it.', 'Projects موجود الآن كمجلد. dir سيعرضه.'),
    explanation: tx('mkdir creates a directory. The name after it is the folder you want.', 'mkdir يُنشئ مجلداً. الاسم بعده هو المجلد المطلوب.'),
  },
  'f3-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx('mkdir creates a directory in the current location unless you give it a path.', 'mkdir يُنشئ مجلداً في الموقع الحالي ما لم تعطه مساراً.'),
  },
  'f4-intro': {
    title: tx('Standing still vs moving', 'الوقوف مقابل الحركة'),
    body: tx('dir looks around without moving. cd changes the current directory. The prompt updates to prove it.', 'dir ينظر دون حركة. cd يغيّر المجلد الحالي. يتغيّر الموجّه ليؤكّد ذلك.'),
  },
  'f4-demo': {
    title: tx('cd into a folder', 'ادخل مجلداً بـ cd'),
    body: tx('cd Documents moves you into Documents if that folder exists from here.', 'cd Documents ينقلك إلى Documents إن كان المجلد موجوداً من هنا.'),
  },
  'f4-try-in': {
    title: tx('Enter Documents', 'ادخل Documents'),
    body: tx('Move into the Documents folder.', 'انتقل إلى مجلد Documents.'),
    prompt: tx('cd into Documents.', 'ادخل Documents بـ cd.'),
    hints: [tx('The move command is two letters.', 'أمر الحركة حرفان.'), tx('Type cd Documents.', 'اكتب cd Documents.')],
    successTitle: tx('Moved in', 'دخلت'),
    successBody: tx('The prompt should now end in Documents.', 'يجب أن ينتهي الموجّه الآن بـ Documents.'),
    explanation: tx('cd changes directory. You are now standing in Documents.', 'cd يغيّر المجلد. أنت الآن داخل Documents.'),
  },
  'f4-up': {
    title: tx('Climb out with cd ..', 'اصعد بـ cd ..'),
    body: tx('.. means the parent folder. cd .. takes you one level up.', '.. تعني المجلد الأب. cd .. يصعدك مستوى واحداً.'),
  },
  'f4-try-out': {
    title: tx('Back to Student', 'عد إلى Student'),
    body: tx('Leave Documents and return to your home folder.', 'غادر Documents وعد إلى مجلد المنزل.'),
    prompt: tx('Use cd .. to go up.', 'استخدم cd .. للصعود.'),
    hints: [tx('Two dots mean parent.', 'نقطتان تعنيان الأب.'), tx('Type cd ..', 'اكتب cd ..')],
    successTitle: tx('Back home', 'عدت للمنزل'),
    successBody: tx('The prompt should show Users\\Student again.', 'يجب أن يظهر الموجّه Users\\Student مجدداً.'),
    explanation: tx('cd .. moves to the parent directory.', 'cd .. ينتقل إلى المجلد الأب.'),
  },
  'f4-q': {
    title: tx('Where does mkdir land?', 'أين يهبط mkdir؟'),
    body: tx('Think about current directory before you create anything.', 'فكّر في المجلد الحالي قبل أن تنشئ أي شيء.'),
    question: {
      prompt: tx(
        'You are at C:\\Users\\Student\\Documents> and you run mkdir School. Where is School created?',
        'أنت عند C:\\Users\\Student\\Documents> وتشغّل mkdir School. أين يُنشأ School؟',
      ),
      explanation: tx(
        'mkdir School has no path, so School is created inside the current directory: Documents.',
        'mkdir School بلا مسار، لذلك يُنشأ School داخل المجلد الحالي: Documents.',
      ),
      choices: {
        a: tx('C:\\', 'C:\\'),
        b: tx('C:\\Users', 'C:\\Users'),
        c: tx('C:\\Users\\Student\\Documents', 'C:\\Users\\Student\\Documents'),
        d: tx('C:\\Users\\Student\\Desktop', 'C:\\Users\\Student\\Desktop'),
      },
    },
  },
  'f4-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx('cd moves. cd .. goes up. The prompt is how you check where you are.', 'cd يحرّك. cd .. يصعد. الموجّه هو طريقة التحقق من موقعك.'),
  },
  'f5-intro': {
    title: tx('Two ways to name a place', 'طريقتان لتسمية المكان'),
    body: tx(
      'A relative path starts from where you are (Documents). An absolute path starts from the drive (C:\\Users\\Student\\Documents). Both can name the same folder.',
      'المسار النسبي يبدأ من موقعك (Documents). المسار المطلق يبدأ من القرص (C:\\Users\\Student\\Documents). كلاهما قد يسمّي المجلد نفسه.',
    ),
  },
  'f5-demo': {
    title: tx('Same folder, two spellings', 'المجلد نفسه، كتابتان'),
    body: tx('cd Documents and cd C:\\Users\\Student\\Documents can land you in the same place from home.', 'cd Documents وcd C:\\Users\\Student\\Documents قد يوصلانك إلى المكان نفسه من المنزل.'),
  },
  'f5-try': {
    title: tx('Create with a full path', 'أنشئ بمسار كامل'),
    body: tx('From home, create a folder named Archive inside Documents without cd-ing there first.', 'من المنزل، أنشئ مجلداً اسمه Archive داخل Documents دون الدخول إليه أولاً.'),
    prompt: tx('mkdir a folder at Documents\\Archive using a path.', 'أنشئ مجلداً في Documents\\Archive باستخدام مسار.'),
    hints: [tx('You can pass a path to mkdir.', 'يمكنك تمرير مسار إلى mkdir.'), tx('Try mkdir Documents\\Archive.', 'جرّب mkdir Documents\\Archive.')],
    successTitle: tx('Pathed', 'تم بالمسار'),
    successBody: tx('You did not have to be standing in Documents to create something inside it.', 'لم تكن بحاجة للوقوف في Documents لإنشاء شيء داخله.'),
    explanation: tx('A path tells mkdir where, not just what.', 'المسار يخبر mkdir بالمكان لا بالاسم فقط.'),
  },
  'f5-q': {
    title: tx('Relative or absolute?', 'نسبي أم مطلق؟'),
    body: tx('C:\\Users\\Student\\Projects starts from the drive. That is absolute.', 'C:\\Users\\Student\\Projects يبدأ من القرص. هذا مطلق.'),
    question: {
      prompt: tx('Which of these is an absolute path?', 'أيّ من هذه مسار مطلق؟'),
      explanation: tx(
        'Absolute paths start at the drive (C:\\). The others are relative to wherever you currently are.',
        'المسارات المطلقة تبدأ من القرص (C:\\). البقية نسبية إلى موقعك الحالي.',
      ),
      choices: {
        a: tx('Documents', 'Documents'),
        b: tx('Projects\\Lab', 'Projects\\Lab'),
        c: tx('C:\\Users\\Student\\Documents', 'C:\\Users\\Student\\Documents'),
        d: tx('..', '..'),
      },
    },
  },
  'f5-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx('Relative paths start here. Absolute paths start from the drive. Use whichever is clearer.', 'المسارات النسبية تبدأ من هنا. المطلقة تبدأ من القرص. استخدم الأوضح.'),
  },
  'f6-intro': {
    title: tx('Files live inside folders', 'الملفات تعيش داخل المجلدات'),
    body: tx('A file is a named blob of content. Folders hold files. touch creates an empty file.', 'الملف كتلة محتوى مسمّاة. المجلدات تحمل الملفات. touch ينشئ ملفاً فارغاً.'),
  },
  'f6-demo': {
    title: tx('Meet touch', 'تعرّف على touch'),
    body: tx('touch notes.txt creates notes.txt in the current directory if it does not already exist.', 'touch notes.txt ينشئ notes.txt في المجلد الحالي إن لم يكن موجوداً.'),
  },
  'f6-try': {
    title: tx('Leave a file in Projects', 'اترك ملفاً في Projects'),
    body: tx('Create readme.txt inside Projects.', 'أنشئ readme.txt داخل Projects.'),
    prompt: tx('Make Projects\\readme.txt exist.', 'اجعل Projects\\readme.txt موجوداً.'),
    hints: [tx('touch creates files.', 'touch ينشئ الملفات.'), tx('You may need mkdir Projects first if it is missing.', 'قد تحتاج mkdir Projects أولاً إن كان ناقصاً.')],
    successTitle: tx('Filed', 'أُنشئ الملف'),
    successBody: tx('readme.txt is an empty file waiting for content.', 'readme.txt ملف فارغ ينتظر المحتوى.'),
    explanation: tx('touch creates an empty file at the path you give it.', 'touch ينشئ ملفاً فارغاً في المسار الذي تعطيه.'),
  },
  'f6-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx('touch creates files. mkdir creates folders. Paths work for both.', 'touch ينشئ الملفات. mkdir ينشئ المجلدات. المسارات تعمل مع كليهما.'),
  },
  'f7-intro': {
    title: tx('A clearer name', 'اسم أوضح'),
    body: tx('ren old new changes the name of a file or folder. The content stays. The old name is gone.', 'ren القديم الجديد يغيّر اسم ملف أو مجلد. المحتوى يبقى. الاسم القديم يختفي.'),
  },
  'f7-demo': {
    title: tx('Meet ren', 'تعرّف على ren'),
    body: tx('ren ideas.txt notes.txt turns ideas.txt into notes.txt in the same folder.', 'ren ideas.txt notes.txt يحوّل ideas.txt إلى notes.txt في المجلد نفسه.'),
  },
  'f7-try': {
    title: tx('Rename ideas.txt', 'أعد تسمية ideas.txt'),
    body: tx('There is a file called ideas.txt. Rename it to notes.txt.', 'هناك ملف اسمه ideas.txt. أعد تسميته إلى notes.txt.'),
    prompt: tx('ren ideas.txt to notes.txt.', 'حوّل ideas.txt إلى notes.txt بـ ren.'),
    hints: [tx('ren takes the old name then the new name.', 'ren يأخذ الاسم القديم ثم الجديد.'), tx('Type ren ideas.txt notes.txt.', 'اكتب ren ideas.txt notes.txt.')],
    successTitle: tx('Renamed', 'أُعيدت التسمية'),
    successBody: tx('The file is the same object with a better name.', 'الملف هو الكائن نفسه باسم أفضل.'),
    explanation: tx('ren changes the name. It does not copy.', 'ren يغيّر الاسم. لا ينسخ.'),
  },
  'f7-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx('ren old new. Same place, new name.', 'ren القديم الجديد. المكان نفسه، اسم جديد.'),
  },
  'f8-intro': {
    title: tx('A spare copy', 'نسخة احتياطية'),
    body: tx('copy source destination duplicates a file. Afterward both names exist.', 'copy المصدر الوجهة يكرر ملفاً. بعدها يوجد الاسمان.'),
  },
  'f8-demo': {
    title: tx('Meet copy', 'تعرّف على copy'),
    body: tx('copy game.txt game.bak leaves game.txt and creates game.bak.', 'copy game.txt game.bak يبقي game.txt وينشئ game.bak.'),
  },
  'f8-try': {
    title: tx('Duplicate game.txt', 'كرّر game.txt'),
    body: tx('Make a backup copy of game.txt named game.bak.', 'اصنع نسخة احتياطية من game.txt اسمها game.bak.'),
    prompt: tx('copy game.txt to game.bak.', 'انسخ game.txt إلى game.bak.'),
    hints: [tx('copy source destination.', 'copy المصدر الوجهة.'), tx('Type copy game.txt game.bak.', 'اكتب copy game.txt game.bak.')],
    successTitle: tx('Copied', 'تم النسخ'),
    successBody: tx('Both files exist. Changing one will not change the other.', 'الملفان موجودان. تغيير أحدهما لا يغيّر الآخر.'),
    explanation: tx('copy duplicates. The original stays.', 'copy يكرر. الأصل يبقى.'),
  },
  'f8-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx('copy keeps the original. Use it before you experiment.', 'copy يبقي الأصل. استخدمه قبل التجريب.'),
  },
  'f9-intro': {
    title: tx('Move vs copy', 'النقل مقابل النسخ'),
    body: tx('move relocates. After a successful move, the source path is gone. copy would have left it.', 'move ينقل. بعد نقل ناجح يختفي مسار المصدر. copy كان سيتركه.'),
  },
  'f9-demo': {
    title: tx('Meet move', 'تعرّف على move'),
    body: tx('move game.txt Games puts game.txt inside the Games folder.', 'move game.txt Games يضع game.txt داخل مجلد Games.'),
  },
  'f9-try': {
    title: tx('Put the game away', 'ضع اللعبة في مكانها'),
    body: tx('Move game.txt into a Games folder.', 'انقل game.txt إلى مجلد Games.'),
    prompt: tx('Games\\game.txt should exist. The old game.txt should not.', 'يجب أن يوجد Games\\game.txt. ويجب ألا يبقى game.txt القديم.'),
    hints: [tx('mkdir Games if needed, then move.', 'mkdir Games إن لزم، ثم move.'), tx('move game.txt Games', 'move game.txt Games')],
    successTitle: tx('Moved', 'تم النقل'),
    successBody: tx('The file lives in Games now. dir in the old folder will not show it.', 'الملف يعيش في Games الآن. dir في المجلد القديم لن يظهره.'),
    explanation: tx('move changes location. The original path disappears.', 'move يغيّر الموقع. المسار الأصلي يختفي.'),
  },
  'f9-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx('move relocates. copy duplicates. Pick the one that matches the job.', 'move ينقل. copy يكرر. اختر ما يناسب العمل.'),
  },
  'f10-intro': {
    title: tx('Deleting is serious', 'الحذف أمر جدّي'),
    body: tx(
      'del removes a file. On a real machine that can be hard to undo. In this lab, deleted items go to Recycle Bin so you can restore them. Still treat delete as a command you mean.',
      'del يحذف ملفاً. على جهاز حقيقي قد يصعب التراجع. في هذا المختبر تذهب العناصر المحذوفة إلى سلة المحذوفات لاستعادتها. عامل الحذف كأمر تقصده.',
    ),
  },
  'f10-demo': {
    title: tx('Meet del', 'تعرّف على del'),
    body: tx('del school.txt removes that file from the current directory.', 'del school.txt يحذف ذلك الملف من المجلد الحالي.'),
  },
  'f10-try': {
    title: tx('Remove school.txt', 'احذف school.txt'),
    body: tx('Delete school.txt. It is throwaway.', 'احذف school.txt. إنه للرمي.'),
    prompt: tx('school.txt should no longer exist.', 'يجب ألا يبقى school.txt موجوداً.'),
    hints: [tx('del deletes files.', 'del يحذف الملفات.'), tx('Type del school.txt.', 'اكتب del school.txt.')],
    successTitle: tx('Deleted', 'تم الحذف'),
    successBody: tx('Gone. dir will not list it. In this lab that is permanent.', 'اختفى. dir لن يسرده. في هذا المختبر هذا نهائي.'),
    explanation: tx('del removes a file. Check the name before you press Enter.', 'del يحذف ملفاً. تحقق من الاسم قبل Enter.'),
  },
  'f10-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx('del for files, rmdir for folders. Look first. There is no undo here.', 'del للملفات، rmdir للمجلدات. انظر أولاً. لا تراجع هنا.'),
  },
  'f11-intro': {
    title: tx('Practical exam', 'اختبار عملي'),
    body: tx(
      'Build a small project tree from scratch. No step-by-step. The lab checks the finished folders and files, not the exact commands.',
      'ابنِ شجرة مشروع صغيرة من الصفر. بلا خطوات. المختبر يتحقق من المجلدات والملفات النهائية، لا من الأوامر حرفياً.',
    ),
  },
  'f11-mission': {
    title: tx('Build the project', 'ابنِ المشروع'),
    body: tx(
      'Create Projects with Website and Notes inside it, then put index.html in Website and ideas.txt in Notes.',
      'أنشئ Projects وفيه Website وNotes، ثم ضع index.html في Website وideas.txt في Notes.',
    ),
    prompt: tx('Finish with that tree. Any command order that matches is accepted.', 'أنهِ بهذه الشجرة. أي ترتيب أوامر يطابقها مقبول.'),
    hints: [
      tx('Website and Notes are folders inside Projects. index.html and ideas.txt are files inside those folders.', 'Website وNotes مجلدان داخل Projects. index.html وideas.txt ملفان داخل تلك المجلدات.'),
      tx('Create the folders first, then the files. touch creates a file. mkdir creates a directory.', 'أنشئ المجلدات أولاً ثم الملفات. touch يُنشئ ملفاً. mkdir يُنشئ مجلداً.'),
    ],
    successTitle: tx('Tree complete', 'اكتملت الشجرة'),
    successBody: tx('Projects holds Website and Notes, with the two files in the right places. That is a real workspace.', 'Projects يحمل Website وNotes، والملفان في مكانيهما. هذه مساحة عمل حقيقية.'),
    explanation: tx('Folders before the files that go inside them. Any order or path style is accepted as long as the finished tree matches.', 'المجلدات قبل الملفات التي تدخلها. أي ترتيب أو أسلوب مسار مقبول ما دامت الشجرة النهائية تطابق.'),
  },
  'f11-summary': {
    title: tx('What you learned', 'ما تعلّمته'),
    body: tx(
      'You can list, create, navigate, name paths, make files, rename, copy, move, delete, recall commands, complete names with Tab, print files, and ask for help. That is the Files track.',
      'تستطيع العرض والإنشاء والتنقل وتسمية المسارات وصنع الملفات وإعادة التسمية والنسخ والنقل والحذف واسترجاع الأوامر وإكمال الأسماء بـ Tab وطباعة الملفات وطلب المساعدة. هذا مسار الملفات.',
    ),
  },
  'f12-intro': {
    title: tx('You do not retype everything', 'لا تعيد كتابة كل شيء'),
    body: tx(
      'The terminal remembers commands you already ran in this session. Arrow Up walks backward through that list. Arrow Down walks forward. This is how people stay fast without memorizing long lines.',
      'الطرفية تتذكر الأوامر التي نفّذتها في هذه الجلسة. السهم للأعلى يسير للخلف في القائمة. السهم للأسفل يسير للأمام. هكذا يبقى الناس سريعين دون حفظ الأسطر الطويلة.',
    ),
  },
  'f12-try': {
    title: tx('Leave a command to recall', 'اترك أمراً لاسترجاعه'),
    body: tx('Run echo History so the terminal has something to remember.', 'نفّذ echo History حتى يكون لدى الطرفية شيء تتذكره.'),
    prompt: tx('Type echo History and press Enter.', 'اكتب echo History واضغط Enter.'),
    hints: [tx('The command that prints text is echo.', 'الأمر الذي يطبع النص هو echo.'), tx('Type echo History.', 'اكتب echo History.')],
    successTitle: tx('Stored', 'حُفظ'),
    successBody: tx('That line is now in this session’s history.', 'هذا السطر الآن في سجل هذه الجلسة.'),
    explanation: tx('This prints History and stores the line so Arrow Up can bring it back.', 'هذا يطبع History ويخزن السطر حتى يعيده السهم للأعلى.'),
  },
  'f12-recall': {
    title: tx('Recall with Arrow Up', 'استرجع بالسهم للأعلى'),
    body: tx(
      'Click the Terminal. Press Arrow Up until you see echo History, then press Enter. Do not retype it if you can avoid it.',
      'انقر الطرفية. اضغط السهم للأعلى حتى ترى echo History، ثم اضغط Enter. لا تعد كتابته إن استطعت.',
    ),
    prompt: tx('Recall echo History with Arrow Up and run it again.', 'استرجع echo History بالسهم للأعلى ونفّذه مجدداً.'),
    hints: [
      tx('Use the Up arrow key, not a mouse menu.', 'استخدم مفتاح السهم للأعلى، لا قائمة الفأرة.'),
      tx('Stop when the line reads echo History, then Enter.', 'توقف عندما يقرأ السطر echo History، ثم Enter.'),
    ],
    successTitle: tx('Recalled', 'استُرجع'),
    successBody: tx('History is a list, not a file. Closing the Terminal window clears this session’s list.', 'السجل قائمة لا ملف. إغلاق نافذة الطرفية يمسح قائمة هذه الجلسة.'),
    explanation: tx('Arrow Up fills the input with a previous line. Enter runs it again.', 'السهم للأعلى يملأ الإدخال بسطر سابق. Enter يعيد تشغيله.'),
  },
  'f13-intro': {
    title: tx('The terminal can finish the word', 'الطرفية تستطيع إكمال الكلمة'),
    body: tx(
      'Type the start of a command or a folder name, then press Tab. If only one match exists, the rest of the name appears. If several match, Tab fills the shared prefix.',
      'اكتب بداية أمر أو اسم مجلد، ثم اضغط Tab. إن وُجد تطابق واحد يظهر بقية الاسم. إن تطابقت عدة أسماء يملأ Tab البادئة المشتركة.',
    ),
  },
  'f13-try': {
    title: tx('Complete dir', 'أكمل dir'),
    body: tx('Type di and press Tab. The command should become dir. Then press Enter to list this folder.', 'اكتب di واضغط Tab. يجب أن يصبح الأمر dir. ثم اضغط Enter لعرض هذا المجلد.'),
    prompt: tx('Use Tab to turn di into dir, then run it.', 'استخدم Tab لتحويل di إلى dir، ثم نفّذه.'),
    hints: [
      tx('Type the first two letters, then Tab, then Enter.', 'اكتب الحرفين الأولين، ثم Tab، ثم Enter.'),
      tx('ls also lists, but this step wants dir.', 'ls يعرض أيضاً، لكن هذه الخطوة تريد dir.'),
    ],
    successTitle: tx('Completed', 'اكتمل'),
    successBody: tx('Tab is for names on disk too: cd Doc then Tab usually becomes Documents.', 'Tab يعمل لأسماء القرص أيضاً: cd Doc ثم Tab تصبح عادة Documents.'),
    explanation: tx('Tab completed di to dir because dir is the only command that starts that way here.', 'Tab أكمل di إلى dir لأن dir هو الأمر الوحيد الذي يبدأ كذلك هنا.'),
  },
  'f14-intro': {
    title: tx('Where am I?', 'أين أنا؟'),
    body: tx(
      'The prompt already shows the current directory. pwd prints that same path as output, which is useful when the prompt is clipped or you want to copy the path.',
      'الموجّه يعرض المجلد الحالي مسبقاً. pwd يطبع المسار نفسه كمخرجات، وهذا مفيد عندما يُقص الموجّه أو تريد نسخ المسار.',
    ),
  },
  'f14-try': {
    title: tx('Ask for the path', 'اطلب المسار'),
    body: tx('You are inside Documents. Print the working directory.', 'أنت داخل Documents. اطبع مجلد العمل.'),
    prompt: tx('Run pwd.', 'نفّذ pwd.'),
    hints: [tx('Three letters. Starts with p.', 'ثلاثة أحرف. تبدأ بـ p.'), tx('Type pwd and press Enter.', 'اكتب pwd واضغط Enter.')],
    successTitle: tx('Located', 'تم تحديد الموقع'),
    successBody: tx('The printed path should match the text before > in the prompt.', 'يجب أن يطابق المسار المطبوع النص قبل > في الموجّه.'),
    explanation: tx('pwd means print working directory. It does not move you.', 'pwd تعني طباعة مجلد العمل. لا تنقلك.'),
  },
  'f15-intro': {
    title: tx('Look inside without leaving', 'انظر للداخل دون مغادرة'),
    body: tx(
      'type filename prints the file to the terminal. It does not change the file. Windows uses type; some systems use cat. This lab teaches type.',
      'type اسم-الملف يطبع الملف إلى الطرفية. لا يغيّر الملف. Windows يستخدم type؛ بعض الأنظمة تستخدم cat. هذا المختبر يعلّم type.',
    ),
  },
  'f15-try': {
    title: tx('Read note.txt', 'اقرأ note.txt'),
    body: tx('Documents holds note.txt. Print its contents.', 'Documents يحتوي note.txt. اطبع محتواه.'),
    prompt: tx('Read note.txt with type.', 'اقرأ note.txt بـ type.'),
    hints: [tx('The command is type.', 'الأمر هو type.'), tx('The file is note.txt in the current directory.', 'الملف هو note.txt في المجلد الحالي.')],
    successTitle: tx('Read', 'قُرئ'),
    successBody: tx('You should see: Ship the Files track.', 'يجب أن ترى: Ship the Files track.'),
    explanation: tx('type followed by the file name prints the text stored in that file.', 'type يليه اسم الملف يطبع النص المخزّن في ذلك الملف.'),
  },
  'f16-intro': {
    title: tx('The lab can describe itself', 'المختبر يستطيع وصف نفسه'),
    body: tx(
      'help with no extra words lists the commands this terminal knows. help dir describes dir. Use it when you remember a name but not the shape.',
      'help بلا كلمات إضافية يسرد الأوامر التي تعرفها هذه الطرفية. help dir يصف dir. استخدمه عندما تتذكر اسماً لا شكله.',
    ),
  },
  'f16-try': {
    title: tx('Open the catalog', 'افتح الكتالوج'),
    body: tx('Ask the terminal for the command list.', 'اطلب من الطرفية قائمة الأوامر.'),
    prompt: tx('Run help.', 'نفّذ help.'),
    hints: [tx('Four letters.', 'أربعة أحرف.'), tx('Type help and press Enter.', 'اكتب help واضغط Enter.')],
    successTitle: tx('Catalog open', 'فُتح الكتالوج'),
    successBody: tx('You can also run help type or help mkdir for a single command.', 'يمكنك أيضاً تشغيل help type أو help mkdir لأمر واحد.'),
    explanation: tx('help on its own prints the catalog.', 'help وحده يطبع الكتالوج.'),
  },
  'f17-brief': {
    title: tx('A pile on Downloads', 'كومة في Downloads'),
    body: tx(
      'Three files are sitting loose in Downloads: a document, an image, and a text file. Put them into Docs, Images, and Text folders. dir should show only those three folders when you are done.',
      'ثلاثة ملفات مبعثرة في Downloads: مستند وصورة وملف نص. ضعها في مجلدات Docs وImages وText. يجب أن يعرض dir تلك المجلدات الثلاثة فقط عند الانتهاء.',
    ),
  },
  'f17-job': {
    title: tx('Sort the three files', 'رتّب الملفات الثلاثة'),
    body: tx('Make Docs, Images, and Text. Move report.docx, shot.png, and notes.txt into the matching folder.', 'أنشئ Docs وImages وText. انقل report.docx وshot.png وnotes.txt إلى المجلد المناسب.'),
    prompt: tx(
      'Finish with Downloads\\Docs\\report.docx, Downloads\\Images\\shot.png, and Downloads\\Text\\notes.txt.',
      'أنهِ بـ Downloads\\Docs\\report.docx وDownloads\\Images\\shot.png وDownloads\\Text\\notes.txt.',
    ),
    hints: [
      tx('mkdir makes the folders. move puts each file inside one.', 'mkdir ينشئ المجلدات. move يضع كل ملف داخل واحد.'),
      tx('dir checks what is left in Downloads.', 'dir يتحقق مما تبقّى في Downloads.'),
    ],
    successTitle: tx('Sorted', 'رُتّبت'),
    successBody: tx('Downloads is a set of folders instead of a pile. That is a real terminal job.', 'Downloads مجموعة مجلدات بدل كومة. هذا عمل طرفية حقيقي.'),
    explanation: tx('Folders first, then each file into the folder that matches its kind.', 'المجلدات أولاً، ثم كل ملف إلى المجلد الذي يناسب نوعه.'),
  },
  'f18-brief': {
    title: tx('Do not move it blindly', 'لا تنقله على عمى'),
    body: tx(
      'Desktop has readme.txt. Read it with type, then move it into Documents. This is how people check a file before they file it.',
      'Desktop فيه readme.txt. اقرأه بـ type ثم انقله إلى Documents. هكذا يتحقق الناس من ملف قبل أرشفته.',
    ),
  },
  'f18-job': {
    title: tx('Read, then move', 'اقرأ ثم انقل'),
    body: tx('type the file so you know what it is. Then move Desktop\\readme.txt into Documents.', 'اطبع الملف بـ type لتعرف ما هو. ثم انقل Desktop\\readme.txt إلى Documents.'),
    prompt: tx('Documents\\readme.txt should exist. Desktop\\readme.txt should not.', 'يجب أن يوجد Documents\\readme.txt وألا يوجد Desktop\\readme.txt.'),
    hints: [
      tx('cd Desktop then type readme.txt. Then move it to ..\\Documents.', 'ادخل Desktop بـ cd ثم type readme.txt. ثم انقله إلى ..\\Documents.'),
      tx('From home: type Desktop\\readme.txt then move Desktop\\readme.txt Documents.', 'من المنزل: type Desktop\\readme.txt ثم move Desktop\\readme.txt Documents.'),
    ],
    successTitle: tx('Filed', 'أُرشف'),
    successBody: tx('You inspected the file, then put it in the right folder. That is the habit unit 7 is for.', 'فحصت الملف ثم وضعته في المجلد الصحيح. هذه عادة الوحدة 7.'),
    explanation: tx('Read first so you know it belongs in Documents. move then files it.', 'اقرأ أولاً لتعرف أنه ينتمي إلى Documents. ثم move يرشفه.'),
  },
};
