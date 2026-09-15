const STRINGS = {
  en: {
    dir: "ltr",
    site_name: "Academic Research Study",
    // Landing / consent
    academic_notice_title: "This is an academic research study",
    academic_notice_body: "This site is part of a graduate research project studying how websites collect visitor data and how people feel about it. Nothing you do here is shared, sold, or used outside this study.",
    eligibility_note: "Participation is open to adults (18+) only.",
    consent_title: "Before you continue",
    consent_body: "By continuing, you agree to take part in this academic study. Some details about what happens next will only be explained at the end — this is a normal part of how this kind of research works, and you'll get a full explanation and the option to delete your data before anything is kept.",
    consent_agree: "I agree to take part",
    consent_decline: "I don't agree",
    // Blocked / ineligible
    blocked_title: "You can't continue without consent",
    blocked_body: "Participation in this study requires agreeing to take part. No data has been collected from you beyond this page. Thank you for considering it.",
    ineligible_title: "This study is for adults only",
    ineligible_body: "Thanks for your interest — this study is limited to participants 18 and older. No data has been collected from you beyond this page.",
    back_home: "Back to home",
    // Cookie banner
    cookie_title: "Cookie preferences",
    cookie_body: "This site uses cookies for analytics. Read our policy to control individual categories.",
    cookie_accept: "Accept all",
    cookie_reject: "Reject all",
    cookie_policy: "Read policy",
    // Profile / pre-feed
    profile_title: "A little about you",
    profile_subtitle: "This helps us understand our participants as a group. All fields are required unless marked optional.",
    interests_label: "Which of these are you interested in? (choose all that apply)",
    interest_fashion: "Fashion",
    interest_food: "Food",
    interest_memes: "Memes",
    interest_politics: "Politics",
    interest_news: "News",
    interest_sports: "Sports",
    interest_tech: "Tech",
    interest_gaming: "Gaming",
    location_label: "Where are you located? (country / city)",
    location_placeholder: "e.g. Damascus, Syria",
    age_label: "Age",
    age_under18: "Under 18",
    age_18_24: "18–24",
    age_25_34: "25–34",
    age_35_44: "35–44",
    age_45_54: "45–54",
    age_55plus: "55+",
    gender_label: "Gender (optional)",
    gender_woman: "Woman",
    gender_man: "Man",
    gender_nonbinary: "Non-binary",
    gender_self_describe: "Self-describe",
    gender_prefer_not: "Prefer not to say",
    baseline_title: "Before you continue, a few quick questions",
    baseline_q1: "How comfortable are you, in general, with websites collecting data about your online behavior?",
    baseline_q2: "How aware do you consider yourself of the techniques websites use to collect data about visitors?",
    baseline_q3: "How much do you trust websites to only collect data you've explicitly agreed to?",
    scale_1: "Not at all",
    scale_5: "Extremely",
    continue_btn: "Continue",
    required_note: "Please answer all required questions to continue.",
    // Optional info
    optional_info_title: "Want updates on this research? (optional)",
    optional_info_body: "Leave your name and email if you'd like a summary of the results once the study is published. Totally optional — you can skip this.",
    name_label: "Name",
    email_label: "Email",
    skip: "Skip",
    submit: "Continue",
    // Feed
    feed_timer_active: "Please browse for {n}s",
    feed_timer_done: "You can continue whenever you're ready",
    feed_continue: "Continue",
    feed_comment_placeholder: "Write a comment…",
  },
  ar: {
    dir: "rtl",
    site_name: "دراسة بحثية أكاديمية",
    academic_notice_title: "هذا بحث أكاديمي",
    academic_notice_body: "هذا الموقع جزء من مشروع بحث دراسات عليا يدرس كيف تجمع المواقع بيانات الزوار وكيف يشعر الناس تجاه ذلك. لا شيء تفعله هنا يُشارك أو يُباع أو يُستخدم خارج هذه الدراسة.",
    eligibility_note: "المشاركة متاحة للبالغين (18 سنة فأكثر) فقط.",
    consent_title: "قبل المتابعة",
    consent_body: "بالمتابعة، أنت توافق على المشاركة في هذه الدراسة الأكاديمية. بعض تفاصيل ما سيحدث لاحقًا لن تُشرح إلا في النهاية — هذا جزء طبيعي من هذا النوع من الأبحاث، وستحصل على شرح كامل وخيار حذف بياناتك قبل الاحتفاظ بأي شيء.",
    consent_agree: "أوافق على المشاركة",
    consent_decline: "لا أوافق",
    blocked_title: "لا يمكنك المتابعة دون الموافقة",
    blocked_body: "تتطلب المشاركة في هذه الدراسة الموافقة عليها. لم تُجمع أي بيانات منك بخلاف هذه الصفحة. شكرًا لاهتمامك.",
    ineligible_title: "هذه الدراسة للبالغين فقط",
    ineligible_body: "شكرًا لاهتمامك — هذه الدراسة مقتصرة على المشاركين البالغين 18 سنة فأكثر. لم تُجمع أي بيانات منك بخلاف هذه الصفحة.",
    back_home: "العودة للصفحة الرئيسية",
    cookie_title: "تفضيلات ملفات تعريف الارتباط",
    cookie_body: "يستخدم هذا الموقع ملفات تعريف الارتباط للتحليلات. اقرأ سياستنا للتحكم بكل فئة على حدة.",
    cookie_accept: "قبول الكل",
    cookie_reject: "رفض الكل",
    cookie_policy: "قراءة السياسة",
    profile_title: "القليل عنك",
    profile_subtitle: "هذا يساعدنا على فهم المشاركين كمجموعة. جميع الحقول مطلوبة ما لم يُذكر أنها اختيارية.",
    interests_label: "ما الذي يثير اهتمامك؟ (اختر كل ما ينطبق)",
    interest_fashion: "موضة",
    interest_food: "طعام",
    interest_memes: "ميمز",
    interest_politics: "سياسة",
    interest_news: "أخبار",
    interest_sports: "رياضة",
    interest_tech: "تقنية",
    interest_gaming: "ألعاب",
    location_label: "أين تقيم؟ (الدولة / المدينة)",
    location_placeholder: "مثال: دمشق، سوريا",
    age_label: "العمر",
    age_under18: "أقل من 18",
    age_18_24: "18–24",
    age_25_34: "25–34",
    age_35_44: "35–44",
    age_45_54: "45–54",
    age_55plus: "55 فأكثر",
    gender_label: "الجنس (اختياري)",
    gender_woman: "امرأة",
    gender_man: "رجل",
    gender_nonbinary: "غير ثنائي",
    gender_self_describe: "تعريف ذاتي",
    gender_prefer_not: "أفضل عدم الإفصاح",
    baseline_title: "قبل المتابعة، بضعة أسئلة سريعة",
    baseline_q1: "بشكل عام، ما مدى ارتياحك لجمع المواقع بيانات عن سلوكك على الإنترنت؟",
    baseline_q2: "ما مدى وعيك بالتقنيات التي تستخدمها المواقع لجمع بيانات الزوار؟",
    baseline_q3: "ما مدى ثقتك بأن المواقع لا تجمع سوى البيانات التي وافقت عليها صراحة؟",
    scale_1: "أبدًا",
    scale_5: "كثيرًا جدًا",
    continue_btn: "متابعة",
    required_note: "يرجى الإجابة على جميع الأسئلة المطلوبة للمتابعة.",
    optional_info_title: "تريد تحديثات حول هذا البحث؟ (اختياري)",
    optional_info_body: "اترك اسمك وبريدك الإلكتروني إذا أردت ملخصًا للنتائج بعد نشر الدراسة. اختياري تمامًا — يمكنك التخطي.",
    name_label: "الاسم",
    email_label: "البريد الإلكتروني",
    skip: "تخطي",
    submit: "متابعة",
    // Feed
    feed_timer_active: "يرجى التصفح لمدة {n} ثانية",
    feed_timer_done: "يمكنك المتابعة عندما تكون جاهزًا",
    feed_continue: "متابعة",
    feed_comment_placeholder: "اكتب تعليقًا…",
  },
};

function getLang() {
  return localStorage.getItem("study_lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("study_lang", lang);
  applyI18n();
}

function applyI18n() {
  const lang = getLang();
  const dict = STRINGS[lang] || STRINGS.en;
  document.documentElement.lang = lang;
  document.documentElement.dir = dict.dir;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });
}

document.addEventListener("DOMContentLoaded", applyI18n);
