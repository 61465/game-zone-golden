    // 
    // ORIGINAL GOLDEN ARENA LOGIC
    // 
    let currentLang = 'ar';
    let selected = [];
    let currentFilter = 'all';
    let searchQuery = '';
    let gzFavSet = new Set(JSON.parse(localStorage.getItem('gz_favs_v1') || '[]'));

    const heroes = [
    { id: 1, type: "game", p: 96, icon: '🔥', source: "God of War", ar: { name: "كراتوس", ability: "إبادة الآلهة", lore: "من غياهب سبارتا، نهضَ محاربٌ حطمَ قيودَ القدر؛ لم يكن مجردَ منتقم فحسب، بل صارَ أباً يحمل ندوبَ الماضي ليحميَ المستقبل، بسيف لا يهدأ." }, en: { name: "KRATOS", ability: "God Slayer", lore: "From the shadows of Sparta, a warrior rose to shatter the chains of fate. No longer a mere vessel of vengeance, he is a father bearing the scars of the past to safeguard the future." } },
    { id: 2, type: "game", p: 95, icon: '☣️', source: "DOOM", ar: { name: "دوم سلاير", ability: "الإبادة المطلقة", lore: "الكيان الذي تخشاه الجحيم وتصلي لئلا تلمحَه. هو الإرادة التي لا تقهر، يسير وسط النيران ليطهرَ العوالمَ من دنس الشرّ بيقين حديديّ." }, en: { name: "DOOM SLAYER", ability: "Unstoppable Will", lore: "The entity Hell fears and prays never to encounter. He is the indomitable will, traversing through infernos to purge the realms of evil with an iron resolve." } },
    { id: 3, type: "movie", p: 94, icon: '💎', source: "Avengers", ar: { name: "ثانوس", ability: "التوازن الكوني", lore: "التايتن المجنون الذي رأى في الفناء نجاةً. بفرقعة إصبع، يستطيع إعادةَ تشكيل الوجود وفقَ رؤيته القاسية للعدالة الكونية." }, en: { name: "THANOS", ability: "Cosmic Equilibrium", lore: "The Mad Titan who perceived salvation in annihilation. With a snap of his fingers, he reshapes existence according to his ruthless vision of universal justice." } },
    { id: 4, type: "series", p: 92, icon: '⚡️', source: "The Boys", ar: { name: "هوملاندر", ability: "الهيمنة الزائفة", lore: "إلهٌ يمشي بين البشر، يخفي خلفَ ابتسامته رعباً كونياً. يرى العالمَ مجردَ دمية، ممتلكاً من القوة ما يجعله فوقَ المحاسبة والقانون." }, en: { name: "HOMELANDER", ability: "False Sovereignty", lore: "A god walking among mortals, concealing cosmic horror behind a manufactured smile." } },
    { id: 5, type: "game", p: 91, icon: '🛡️', source: "HALO", ar: { name: "ماستر شيف", ability: "الأمل الأخير", lore: "سايبورغ صامت يحمل ثقلَ النجوم على كتفيه. ليس مجردَ جنديّ، بل هو أسطورةٌ حيّةٌ تقلب موازينَ الحروب بذكاء تكتيكيّ لا يخطئ." }, en: { name: "MASTER CHIEF", ability: "The Last Hope", lore: "A silent cyborg carrying the weight of the stars. More than a soldier — a living legend who alters the tide of wars." } },
    { id: 6, type: "game", p: 89, icon: '🤖', source: "Cyberpunk", ar: { name: "V", ability: "التسريع السيبراني", lore: "مرتزقٌ في مدينة نايت سيتي يتحدى الموتَ بتقنيات مزروعة. بلمحة عين، يتباطأ الزمن حولَه." }, en: { name: "V", ability: "Cybernetic Dilation", lore: "A mercenary in Night City defying death with implanted tech. In the blink of an eye, time slows around him." } },
    { id: 7, type: "game", p: 88, icon: '🕷️', source: "Spiderman", ar: { name: "سبايدر مان", ability: "الحسّ الفائق", lore: "ابن نيويورك الذي يحمل مسؤوليةً تضاهي قوتَه. برشاقة مذهلة وحسّ سادس يسبق الخطرَ." }, en: { name: "SPIDER-MAN", ability: "Spider-Sense", lore: "New York's prodigal son who bears responsibility equal to his power. With stunning agility and a sixth sense." } },
    { id: 8, type: "game", p: 87, icon: '⚔️', source: "Witcher 3", ar: { name: "جيرالت", ability: "نصل السحر", lore: "الذئب الأبيض الذي صيغَ في كيمياء التحول. صائد وحوش يجوب القارةَ بسيفين وعينين تريان الحقيقة." }, en: { name: "GERALT", ability: "Alchemy & Blade", lore: "The White Wolf, forged in mutation. A monster hunter roaming the Continent with two blades and eyes that pierce lies." } },
    { id: 9, type: "game", p: 85, icon: '🦾', source: "Deus Ex", ar: { name: "آدم جينسن", ability: "التسلل التقني", lore: "مزيجٌ بين البشر والآلة، يتسلل كالظل عبرَ الحصون. يكشف الأسرارَ التي أرادَ العالم دفنَها." }, en: { name: "ADAM JENSEN", ability: "Augmented Infiltration", lore: "A fusion of man and machine, slipping through fortresses like a shadow. He unearths secrets the world intended to bury." } },
    { id: 10, type: "game", p: 83, icon: '🎯', source: "Horizon", ar: { name: "إيلوي", ability: "قنص الثغرات", lore: "منبوذةٌ أصبحت منقذةَ العوالم. تصطاد الآلات العملاقةَ بسهم واحد يصيب مكمنَ الطاقة بدقة متناهية." }, en: { name: "ALOY", ability: "Weak-Point Precision", lore: "An outcast turned savior of worlds. She hunts titanic machines with arrows that strike energy cores with unerring precision." } },
    { id: 11, type: "movie", p: 86, icon: '🎭', source: "Dark Knight", ar: { name: "باتمان", ability: "سيد الاستراتيجية", lore: "إنسانٌ هزمَ الآلهةَ بالعقل والتحضير. فارس الظلام الذي يزرع الرعبَ في قلوب المجرمينَ." }, en: { name: "BATMAN", ability: "Master Strategist", lore: "A mortal who defeated gods through intellect and preparation. The Dark Knight who instills terror in criminals." } },
    { id: 12, type: "movie", p: 84, icon: '🔫', source: "John Wick", ar: { name: "جون ويك", ability: "الإرادة المحضة", lore: "الرجل الذي ترسله لقتل البعبع. يمتلك تركيزاً لا يتزحزح، محولاً أيَّ أداة إلى سلاح فتاك." }, en: { name: "JOHN WICK", ability: "Pure Focus", lore: "The man you send to kill the Boogeyman. He possesses unshakeable focus, turning any tool into a lethal weapon." } },
    { id: 13, type: "game", p: 83, icon: '🥷', source: "AC II", ar: { name: "إيتسيو", ability: "النصل الخفي", lore: "سليل النبلاء الذي صارَ سيداً للمغتالينَ. كانَ خنجره هو العدالةَ الصامتةَ في أزقة إيطاليا." }, en: { name: "EZIO AUDITORE", ability: "Hidden Blade", lore: "A nobleman's son who ascended as a Master Assassin. His blade was the silent justice in the alleys of Italy." } },
    { id: 14, type: "game", p: 82, icon: '🤠', source: "RDR 2", ar: { name: "آرثر مورغان", ability: "عين الصقر", lore: "خارجٌ عن القانون يبحث عن الخلاص في عالم يحتضر. قلبٌ يصارع بينَ الوفاء للعصابة ونداء الضمير." }, en: { name: "ARTHUR MORGAN", ability: "Dead Eye", lore: "An outlaw seeking redemption in a dying world. His heart torn between gang loyalty and the call of conscience." } },
    { id: 15, type: "game", p: 80, icon: '💣', source: "GTA V", ar: { name: "تريفور", ability: "الهيجان الجنوني", lore: "الفوضى المتجسدة في هيئة رجل. لا يعرف الخوفَ ولا يتبع القوانينَ." }, en: { name: "TREVOR PHILIPS", ability: "Psychotic Rage", lore: "Chaos personified. Fearless and lawless, he erupts like a time bomb." } },
    { id: 16, type: "series", p: 81, icon: '❄️', source: "GoT", ar: { name: "جون سنو", ability: "الوفاء الشمالي", lore: "الملك الذي لا يبتغي العرشَ. حارس الجدار الذي واجهَ الموتَ وعادَ." }, en: { name: "JON SNOW", ability: "Northern Loyalty", lore: "The King who never craved the throne. Guardian of the Wall who faced death and returned." } },
    { id: 17, type: "series", p: 78, icon: '⚗️', source: "Breaking Bad", ar: { name: "والتر وايت", ability: "الكيمياء القاتلة", lore: "المعلم الذي تحولَ إلى إمبراطور للجريمة. استخدمَ العلمَ كخنجر مسموم." }, en: { name: "WALTER WHITE", ability: "Chemical Brilliance", lore: "A teacher transformed into a criminal emperor. He wielded science like a poisoned dagger." } },
    { id: 18, type: "game", p: 79, icon: '🏹', source: "TLOU 2", ar: { name: "إيلي", ability: "غريزة البقاء", lore: "فتاةٌ صقلتْها الخسارة في عالم محطم. تحولتْ إلى مفترس لا يرحم." }, en: { name: "ELLIE", ability: "Survival Instinct", lore: "A girl forged by loss in a broken world. She evolved into a ruthless predator." } },
    { id: 19, type: "anime", p: 90, icon: '👊', source: "One Punch Man", ar: { name: "سايتاما", ability: "اللكمة القاضية", lore: "البطل الذي يعاني مللَ القوة المطلقة. ينهي أعظمَ التهديدات بضربة واحدة." }, en: { name: "SAITAMA", ability: "One Punch", lore: "The hero suffering from the boredom of absolute power. He ends the greatest threats with a single blow." } },
    { id: 20, type: "game", p: 88, icon: '🌸', source: "Elden Ring", ar: { name: "مالينيا", ability: "التعفن الأحمر", lore: "نصل ميكيلا التي لم تعرفْ الهزيمةَ قط. بجمال قاتل وسرعة خاطفة تنشر العفنَ الأحمر." }, en: { name: "MALENIA", ability: "Scarlet Rot", lore: "The Blade of Miquella, who has never known defeat. With lethal grace she unleashes the Scarlet Rot." } },
    { id: 21, type: "anime", p: 89, icon: '🌀', source: "Dragon Ball", ar: { name: "غوكو", ability: "الغريزة الفائقة", lore: "محارب السايان الذي يتخطى حدودَه مع كلّ صرخة. وصلَ لمرتبة الآلهة بروح نقية." }, en: { name: "GOKU", ability: "Ultra Instinct", lore: "The Saiyan warrior who transcends his limits with every roar. He attained the status of gods through a pure spirit." } },
    { id: 22, type: "anime", p: 83, icon: '💨', source: "Attack on Titan", ar: { name: "ليفاي", ability: "الإعصار الأسود", lore: "أقوى جنديّ في تاريخ البشرية. إعصارٌ من النصال يمزق العمالقةَ في ثوان." }, en: { name: "LEVI ACKERMAN", ability: "Steel Whirlwind", lore: "Humanity's strongest soldier. A whirlwind of steel that shreds titans in seconds." } },
    { id: 23, type: "series", p: 82, icon: '🐉', source: "House of Dragon", ar: { name: "ديمون تارغارين", ability: "نصل التنين", lore: "الأمير المارق الذي يمتطي نيرانَ التنانين. بمزاج متقلب وشجاعة انتحارية." }, en: { name: "DAEMON TARGARYEN", ability: "Dragon's Blood", lore: "The Rogue Prince who rides dragonfire. With a volatile temper and suicidal bravery." } },
    { id: 24, type: "series", p: 77, icon: '🔍', source: "Sherlock", ar: { name: "شيرلوك", ability: "العقل التحليلي", lore: "العقل الذي يرى ما وراءَ الحجب. يفكك أعقدَ الجرائم بلمحة." }, en: { name: "SHERLOCK HOLMES", ability: "Deductive Mastery", lore: "The mind that perceives what lies beyond the veil. Dismantles the most complex crimes in a glance." } },
    { id: 25, type: "series", p: 79, icon: '👔', source: "Peaky Blinders", ar: { name: "تومي شيلبي", ability: "الدهاء العظيم", lore: "سيد برمنغهام الذي لا ينام. يطوع السياسةَ والقوةَ بخطوات محسوبة." }, en: { name: "TOMMY SHELBY", ability: "Mastermind Cunning", lore: "The sleepless lord of Birmingham. He bends politics and power with calculated steps." } },
    { id: 26, type: "anime", p: 86, icon: '💨', source: "Naruto", ar: { name: "ناروتو أوزوماكي", ability: "طور الكيوبي", lore: "اليتيم الذي أصبح الهوكاجي ووحّد عالم الشينوبي بإرادة النار." }, en: { name: "NARUTO", ability: "Nine-Tails Mode", lore: "The orphan who became Hokage and unified the Shinobi world." } },
    { id: 27, type: "anime", p: 85, icon: '⚓️', source: "One Piece", ar: { name: "لوفي", ability: "المحرك الخامس", lore: "ملك القراصنة المستقبلي الذي يقاتل من أجل الحرية المطلقة." }, en: { name: "LUFFY", ability: "Gear 5", lore: "The future Pirate King fighting for ultimate freedom." } },
    { id: 28, type: "anime", p: 84, icon: '💀', source: "AOT", ar: { name: "إيرين ييغر", ability: "العملاق المهاجم", lore: "الباحث عن الحرية الذي قرر دك العالم لإنهاء معاناة شعبه." }, en: { name: "EREN YEAGER", ability: "Attack Titan", lore: "The seeker of freedom who decided to rumble the world." } },
    { id: 29, type: "game", p: 81, icon: '🧗', source: "Tomb Raider", ar: { name: "لارا كروفت", ability: "غريزة البقاء", lore: "مستكشفة القبور التي صقلتها المخاطر في أقسى بقاع الأرض." }, en: { name: "LARA CROFT", ability: "Survival Instinct", lore: "The tomb raider forged by danger in the harshest places on Earth." } },
    { id: 30, type: "movie", p: 87, icon: '💻', source: "The Matrix", ar: { name: "نيو", ability: "شفرة المختار", lore: "المختار الذي كسر حدود الواقع الرقمي ليتحكم في قوانين الفيزياء." }, en: { name: "NEO", ability: "The One", lore: "The Chosen One who broke digital reality to control the laws of physics." } },
    { id: 31, type: "series", p: 80, icon: '💉', source: "Dexter", ar: { name: "ديكستر مورغان", ability: "الراكب المظلم", lore: "القاتل المنظم الذي يطارد الأشرار ببرود جراحي وكود صارم." }, en: { name: "DEXTER MORGAN", ability: "Dark Passenger", lore: "The organized killer hunting the wicked with surgical coldness." } },
    { id: 32, type: "series", p: 82, icon: '🎭', source: "Hannibal", ar: { name: "هانيبال ليكتر", ability: "التلاعب النفسي", lore: "الطبيب الفنان الذي يفكك عقول خصومه قبل أجسادهم." }, en: { name: "HANNIBAL LECTER", ability: "Psychological Manipulation", lore: "The artist doctor who dismantles enemies' minds before their bodies." } },
    { id: 33, type: "anime", p: 87, icon: '🩸', source: "Hellsing", ar: { name: "ألوكارد", ability: "ملك الدماء", lore: "مصاص الدماء الخالد الذي يحمل في دمه جيشاً من الأرواح المعذبة." }, en: { name: "ALUCARD", ability: "Release Level 0", lore: "The immortal vampire carrying an army of tormented souls in his blood." } },
    { id: 34, type: "game", p: 84, icon: '🚀', source: "Metroid", ar: { name: "ساموس آران", ability: "البدلة القتالية", lore: "صائدة الجوائز التي تطهر الكواكب من التهديدات الفضائية بمفردها." }, en: { name: "SAMUS ARAN", ability: "Power Suit", lore: "The bounty hunter purging planets of alien threats alone." } },
    { id: 35, type: "anime", p: 82, icon: '✨️', source: "FMA", ar: { name: "إدوارد إلريك", ability: "الخيمياء الفولاذية", lore: "الخيميائي الذي تحدى قوانين الطبيعة لاستعادة ما فقده." }, en: { name: "EDWARD ELRIC", ability: "Alchemy", lore: "The alchemist who defied nature's laws to regain what he lost." } },
    { id: 36, type: "movie", p: 79, icon: '🧙', source: "Harry Potter", ar: { name: "هاري بوتر", ability: "الصبي الذي عاش", lore: "الساحر الذي هزم الظلام بقوة الحب والشجاعة." }, en: { name: "HARRY POTTER", ability: "The Boy Who Lived", lore: "The wizard who defeated darkness through love and courage." } },
    { id: 37, type: "series", p: 85, icon: '🌀', source: "Doctor Who", ar: { name: "دكتور هو", ability: "سيد الزمن", lore: "المسافر عبر الزمكان الذي يهزم الجيوش بعقله وتلاعبه بالتاريخ." }, en: { name: "DOCTOR WHO", ability: "Time Lord", lore: "The time traveler who defeats armies through intellect and time manipulation." } },
    { id: 38, type: "movie", p: 81, icon: '🔫', source: "007", ar: { name: "جيمس بوند", ability: "أناقة القتل", lore: "العميل السري الذي لا يخطئ، يجمع بين الدهاء وأحدث التقنيات." }, en: { name: "JAMES BOND", ability: "007 Tactics", lore: "The unerring secret agent combining wit with cutting-edge tech." } },
    { id: 39, type: "game", p: 82, icon: '🌀', source: "Mortal Kombat", ar: { name: "كيتانا", ability: "مراوح الموت", lore: "أميرة إيدينيا التي تدمج بين الجمال والفتك في القتال." }, en: { name: "KITANA", ability: "Steel Fans", lore: "The Edenian princess combining beauty and lethality in combat." } },
    { id: 40, type: "anime", p: 81, icon: '🔥', source: "Demon Slayer", ar: { name: "تانيجيرو", ability: "أنفاس الشمس", lore: "صائد الشياطين الذي يحول إرادته ونبله إلى نصل يقطع الظلام." }, en: { name: "TANJIRO", ability: "Sun Breathing", lore: "The demon slayer turning will and nobility into a blade of light." } },
    { id: 41, type: "game", p: 80, icon: '💻', source: "Watch Dogs", ar: { name: "أيدن بيرس", ability: "القرصنة الشاملة", lore: "الهكر الذي حول المدينة بأكملها إلى سلاح فتاك تحت سيطرته." }, en: { name: "AIDEN PEARCE", ability: "System Hacking", lore: "The hacker who turned an entire city into a deadly weapon." } },
    { id: 42, type: "movie", p: 80, icon: '🧬', source: "Alien", ar: { name: "إلين ريبلي", ability: "إرادة البقاء", lore: "الناجية التي واجهت أهوال الفضاء وانتصرت بعزيمتها." }, en: { name: "ELLEN RIPLEY", ability: "Survivor Will", lore: "The survivor who faced space horrors and won through sheer resolve." } },
    { id: 43, type: "series", p: 81, icon: '🎭', source: "Titans", ar: { name: "ديك غرايسون", ability: "بهلوانية الظلام", lore: "نايتوينج الذي يجمع بين مهارات السيرك وعدالة الشوارع." }, en: { name: "DICK GRAYSON", ability: "Nightwing Skills", lore: "Nightwing, combining circus skills with strict street justice." } },
    { id: 44, type: "game", p: 83, icon: '🫣', source: "Dishonored", ar: { name: "كورفو أتانو", ability: "السحر المظلم", lore: "القاتل المقنع الذي يتلاعب بالزمن والظلال لينتقم للعرش." }, en: { name: "CORVO ATTANO", ability: "Blink Mastery", lore: "The masked assassin manipulating time and shadows for revenge." } },
    { id: 45, type: "movie", p: 81, icon: '⚔️', source: "Kill Bill", ar: { name: "بياتريكس كيدو", ability: "نصل الانتقام", lore: "العروس التي عادت من القبر لتكتب بدم أعدائها ملحمة انتقام." }, en: { name: "BEATRIX KIDDO", ability: "Katana Master", lore: "The Bride who returned from the grave for a bloody epic of revenge." } },
    { id: 46, type: "game", p: 84, icon: '✨️', source: "Bayonetta", ar: { name: "بايونيتا", ability: "سحر الأومبرا", lore: "الساحرة التي تستدعي شياطين الجحيم وتتلاعب بالوقت." }, en: { name: "BAYONETTA", ability: "Witch Time", lore: "The witch summoning demons and manipulating time." } },
    { id: 47, type: "game", p: 82, icon: '🕵️', source: "Metal Gear", ar: { name: "سوليد سنيك", ability: "التسلل التكتيكي", lore: "الجندي الأسطوري خبير الحروب الصامتة ومواجهة الآلات." }, en: { name: "SOLID SNAKE", ability: "Tactical Stealth", lore: "The legendary soldier, expert in silent warfare and machine combat." } },
    { id: 48, type: "anime", p: 84, icon: '🫣', source: "Naruto", ar: { name: "كاكاشي هاتاكي", ability: "شارينغان النسخ", lore: "نينجا النسخ الذي يتقن ألف تقنية ويقود الجيل الجديد." }, en: { name: "KAKASHI HATAKE", ability: "Copy Ninja", lore: "The Copy Ninja who mastered a thousand techniques and leads the new generation." } },
    { id: 49, type: "series", p: 80, icon: '🥷', source: "GoT", ar: { name: "أريا ستارك", ability: "وجه لا أحد", lore: "الفتاة التي أصبحت الموت المتجسد لتنهي ليالي الشتاء الطويلة." }, en: { name: "ARYA STARK", ability: "Faceless Assassin", lore: "The girl who became death itself to end the Long Night." } },
    { id: 50, type: "series", p: 78, icon: '🧠', source: "The Witcher", ar: { name: "ديكسترا", ability: "العقل المدبر", lore: "رئيس المخابرات الذي يحرك خيوط الممالك من الظلال." }, en: { name: "DIJKSTRA", ability: "Mastermind", lore: "The spymaster pulling kingdom strings and toppling thrones from the shadows." } },
    { id: 51, type: "movie", p: 83, icon: '🐉', source: "The Hobbit", ar: { name: "سموغ", ability: "نيران التنين", lore: "التنين الجشع الذي يحرس كنوزه في الجبل الوحيد." }, en: { name: "SMAUG", ability: "Dragon Fire", lore: "The greedy dragon guarding his treasures in the Lonely Mountain." } },
    { id: 52, type: "anime", p: 85, icon: '🌙', source: "Sailor Moon", ar: { name: "سيلور مون", ability: "قمر العدالة", lore: "المحاربة القمرية التي تحمي الأرض من قوى الظلام." }, en: { name: "SAILOR MOON", ability: "Moon Power", lore: "The lunar warrior protecting Earth from dark forces." } },
    { id: 53, type: "game", p: 82, icon: '💀', source: "Dark Souls", ar: { name: "فارس الجمرة", ability: "إشعال النار", lore: "الخالد الذي يسعى لإشعال النار الأولى للحفاظ على العمر الناري." }, en: { name: "CHOSEN UNDEAD", ability: "Kindling", lore: "The immortal seeking to kindle the First Flame." } },
    { id: 54, type: "movie", p: 84, icon: '⚫️', source: "Star Wars", ar: { name: "دارث فيدر", ability: "قوة الجانب المظلم", lore: "سيد السيث الذي تخلى عن أنكين سكاي ووكر ليبحث عن القوة المطلقة." }, en: { name: "DARTH VADER", ability: "Dark Side", lore: "The Sith Lord who abandoned Anakin Skywalker to seek absolute power." } },
    { id: 55, type: "anime", p: 83, icon: '☠️', source: "Bleach", ar: { name: "إيتشيغو كوروساكي", ability: "مطلق الزانباكتو", lore: "بدل الموت الذي يحمي البشر من الأرواح الشريرة." }, en: { name: "ICHIGO KUROSAKI", ability: "Bankai", lore: "The Substitute Shinigami protecting humans from evil spirits." } },
    { id: 56, type: "game", p: 81, icon: '💨', source: "Sonic", ar: { name: "سونيك", ability: "السرعة الفائقة", lore: "القنفذ الأزرق الذي يجري بسرعة الصوت لإنقاذ العالم." }, en: { name: "SONIC", ability: "Super Speed", lore: "The blue hedgehog running at supersonic speed to save the world." } },
    { id: 57, type: "movie", p: 82, icon: '🤖', source: "Transformers", ar: { name: "أوبتيموس برايم", ability: "التحول", lore: "قائد الأوتوبوتس الذي يحارب لحماية الأرض." }, en: { name: "OPTIMUS PRIME", ability: "Transformation", lore: "The Autobots leader fighting to protect Earth." } },
    { id: 58, type: "anime", p: 86, icon: '🔥', source: "Fairy Tail", ar: { name: "ناتسو دراغنيل", ability: "سحر تنين النار", lore: "ساحر نقابة الخرافة الذي يستخدم سحر تنين النار." }, en: { name: "NATSU DRAGNEEL", ability: "Fire Dragon Slayer", lore: "Fairy Tail wizard using Fire Dragon Slayer magic." } },
    { id: 59, type: "game", p: 83, icon: '👻', source: "Overwatch", ar: { name: "رايبر", ability: "الظل القاتل", lore: "القاتل المتشبح الذي يعمل في الظلال لتحقيق أهدافه." }, en: { name: "REAPER", ability: "Wraith Form", lore: "The ghostly assassin working in shadows to achieve his goals." } },
    { id: 60, type: "series", p: 79, icon: '🤕', source: "Daredevil", ar: { name: "ديرديفل", ability: "الحواس الفائقة", lore: "المحامي الأعمى الذي يحارب الجريمة في الجانب المظلم من نيويورك." }, en: { name: "DAREDEVIL", ability: "Enhanced Senses", lore: "The blind lawyer fighting crime in New York's dark side." } },
    { id: 61, type: "movie", p: 85, icon: '☄️', source: "Superman", ar: { name: "سوبرمان", ability: "القوة الخارقة", lore: "البطل الخارق من كريبتون، يحمي الأرض بقوته وسرعته الخارقة." }, en: { name: "SUPERMAN", ability: "Super Strength", lore: "The superhero from Krypton, protecting Earth with superhuman strength and speed." } },
    { id: 62, type: "movie", p: 84, icon: '🤖', source: "Iron Man", ar: { name: "آيرون مان", ability: "الدرع المتطور", lore: "توني ستارك العبقري الذي يصنع دروعاً متطورة لمحاربة الشر." }, en: { name: "IRON MAN", ability: "Advanced Armor", lore: "Genius Tony Stark who creates advanced armors to fight evil." } },
    { id: 63, type: "movie", p: 83, icon: '🔨', source: "Thor", ar: { name: "ثور", ability: "إله الرعد", lore: "إله الرعد النوردي، يحمل مطرقة ميجولنير ويحارب من أجل العدالة." }, en: { name: "THOR", ability: "God of Thunder", lore: "The Norse god of thunder, wielding Mjolnir and fighting for justice." } },
    { id: 64, type: "comic", p: 86, icon: '⚡️', source: "The Flash", ar: { name: "ذا فلاش", ability: "سرعة الضوء", lore: "أسرع رجل على قيد الحياة، يستخدم سرعته الخارقة لإنقاذ العالم." }, en: { name: "THE FLASH", ability: "Light Speed", lore: "The fastest man alive, using his super speed to save the world." } },
    { id: 65, type: "comic", p: 85, icon: '🌊', source: "Aquaman", ar: { name: "أكوا مان", ability: "ملك المحيطات", lore: "ملك أطلانتس، يتحكم بالمحيطات ومخلوقاتها لحماية الأرض." }, en: { name: "AQUAMAN", ability: "Ocean King", lore: "King of Atlantis, controlling oceans and their creatures to protect Earth." } },
    { id: 66, type: "anime", p: 84, icon: '👻', source: "Bleach", ar: { name: "روكيا كوتشيكي", ability: "سيباكي", lore: "بدل الموت التي أعطت إيتشيغو قواه ودربته ليصبح محارباً." }, en: { name: "RUKIA KUCHIKI", ability: "Shibakai", lore: "The Shinigami who gave Ichigo his powers and trained him to become a warrior." } },
    { id: 67, type: "anime", p: 82, icon: '🔥', source: "Demon Slayer", ar: { name: "زنيتسو", ability: "أنفاس الرعد", lore: "صائد الشياطين الذي يستخدم أنفاس الرعد بسرعة مذهلة." }, en: { name: "ZENITSU", ability: "Thunder Breathing", lore: "The demon slayer using Thunder Breathing with incredible speed." } },
    { id: 68, type: "anime", p: 81, icon: '🕷️', source: "Demon Slayer", ar: { name: "إينوسوكي", ability: "أنفاس الوحش", lore: "صائد الشياطين الغاضب الذي يستخدم أنفاس الوحش في قتاله." }, en: { name: "INOSUKE", ability: "Beast Breathing", lore: "The angry demon slayer using Beast Breathing in his fights." } },
    { id: 69, type: "game", p: 83, icon: '💀', source: "Dark Souls", ar: { name: "سولير من أستورا", ability: "محارب الشمس", lore: "محارب الشمس الأسطوري الذي يساعد المسافرين في رحلتهم الصعبة." }, en: { name: "SOLAIRE", ability: "Sun Warrior", lore: "The legendary Sun Warrior who helps travelers in their difficult journey." } },
    { id: 70, type: "game", p: 82, icon: '🎭', source: "Persona 5", ar: { name: "جوكر", ability: "أرسين", lore: "قائد فرقة اللصوص الشبحية الذي يسرق قلوب الأشرار." }, en: { name: "JOKER", ability: "Arsene", lore: "Leader of the Phantom Thieves who steals the hearts of the wicked." } },
    { id: 125, type: "game", p: 84, icon: '🌙', source: "Sekiro", ar: { name: "إيما", ability: "سيف الربيع", lore: "طبيبة الجنرال إيشين وتلميذته. سيفها الهادئ يخفي سرعة مميتة." }, en: { name: "EMMA", ability: "Spring Sword", lore: "General Isshin's physician and student. Her calm sword hides lethal speed." } },
    { id: 126, type: "game", p: 83, icon: '🔥', source: "Dark Souls 3", ar: { name: "أولدريك السيد", ability: "سحر العالم السفلي", lore: "أكبر فارس تربع على عرش يندرو. يمزج بين النار والماء الأسود." }, en: { name: "ALDRICH", ability: "Deep Magic", lore: "The great lord who devoured his way to power, merging fire and deep sea magic." } },
    { id: 127, type: "anime", p: 84, icon: '⚡️', source: "My Hero Academia", ar: { name: "إيزوكو ميدوريا", ability: "ون فور أول", lore: "الولد الذي ولد بلا قدرة لكن أصبح رمز السلام." }, en: { name: "IZUKU MIDORIYA", ability: "One For All", lore: "The quirkless boy who became the symbol of peace." } },
    { id: 128, type: "anime", p: 86, icon: '🔥', source: "My Hero Academia", ar: { name: "شوتو تودوروكي", ability: "النصفين", lore: "الفتى الذي يجمع بين قوة النار والجليد في معركة واحدة." }, en: { name: "SHOTO TODOROKI", ability: "Half-Cold Half-Hot", lore: "The boy combining fire and ice in a single battle." } },
    { id: 135, type: "anime", p: 83, icon: '⚡️', source: "My Hero Academia", ar: { name: "كاتسوكي باكوغو", ability: "انفجار", lore: "الطالب الغيور الذي يريد أن يصبح البطل الأول." }, en: { name: "KATSUKI BAKUGO", ability: "Explosion", lore: "The determined student aiming to become the No.1 hero." } },
    { id: 136, type: "anime", p: 82, icon: '🌊', source: "My Hero Academia", ar: { name: "شوتا آيزاوا", ability: "محو القدرات", lore: "المعلم الذي يستطيع محو قدرات خصومه بنظرة واحدة." }, en: { name: "SHOTA AIZAWA", ability: "Erasure", lore: "The teacher who can erase opponents' quirks with a single glance." } },
    { id: 137, type: "game", p: 82, icon: '🎯', source: "Apex Legends", ar: { name: "بلادهاوند", ability: "رؤية التتبع", lore: "الصياد الأسطوري الذي يتتبع الخصوم بعيون إلكترونية." }, en: { name: "BLOODHOUND", ability: "Tracker Vision", lore: "The legendary tracker who hunts opponents with electronic eyes." } },
    { id: 121, type: "game", p: 88, icon: '👻', source: "Ghost of Tsushima", ar: { name: "جين ساكاي", ability: "الشبح", lore: "الساموراي الذي تخلى عن الشرف لينقذ وطنه، وأصبح أسطورة في الظلال." }, en: { name: "JIN SAKAI", ability: "The Ghost", lore: "The samurai who abandoned honor to save his homeland." } },
    { id: 122, type: "game", p: 87, icon: '🗡️', source: "Sekiro", ar: { name: "سيكيرو", ability: "الذراع الآلية", lore: "النينجا ذو الذراع الآلية الذي يواجه الآلهة والشياطين." }, en: { name: "SEKIRO", ability: "Shinobi Prosthetic", lore: "The one-armed shinobi facing gods and demons in the Sengoku era." } },
    { id: 123, type: "game", p: 89, icon: '👑', source: "Bloodborne", ar: { name: "الصياد", ability: "دم الوحوش", lore: "صياد في مدينة يهارنام الملعونة، يبحث عن الحقيقة وسط الكوابيس." }, en: { name: "THE HUNTER", ability: "Beast Blood", lore: "A hunter in the cursed city of Yharnam, seeking truth amidst nightmares." } },
    { id: 124, type: "game", p: 90, icon: '🧙', source: "Elden Ring", ar: { name: "تارنشيد", ability: "فضل الإرث", lore: "المنبوذ الذي يسعى لأن يصبح إلدر لورد في عالم ما بين الأراضي." }, en: { name: "TARNISHED", ability: "Grace Guidance", lore: "The outcast seeking to become Elden Lord in the Lands Between." } },
    { id: 129, type: "anime", p: 85, icon: '👊', source: "Jujutsu Kaisen", ar: { name: "يوجي إيتادوري", ability: "لعنة سوكونا", lore: "الطالب الذي أصبح وعاء لأقوى لعنة في التاريخ." }, en: { name: "YUJI ITADORI", ability: "Sukuna's Curse", lore: "The student who became the vessel for the strongest curse in history." } },
    { id: 130, type: "anime", p: 86, icon: '💨', source: "Jujutsu Kaisen", ar: { name: "ميكي زينين", ability: "الشفرة المسحورة", lore: "الساحرة التي لا تملك طاقة لعنة، لكنها تقطع الأرواح بحدها فقط." }, en: { name: "MAKI ZENIN", ability: "Cursed Blade", lore: "The sorcerer with no cursed energy who cuts through curses with sheer skill." } },
    { id: 131, type: "anime", p: 87, icon: '✨️', source: "Chainsaw Man", ar: { name: "دينجي", ability: "القلب الآلي", lore: "صائد الشياطين الذي اندمج مع شيطان المنشار ليصبح كائناً فريداً." }, en: { name: "DENJI", ability: "Chainsaw Heart", lore: "The devil hunter who merged with the Chainsaw Devil to become a unique being." } },
    { id: 132, type: "anime", p: 88, icon: '💀', source: "Chainsaw Man", ar: { name: "باور", ability: "الدم", lore: "شيطانة الدماء التي تدعي أنها أعظم صائدة شياطين في الوجود." }, en: { name: "POWER", ability: "Blood Power", lore: "The Blood Fiend who claims to be the greatest devil hunter in existence." } },
    { id: 133, type: "series", p: 81, icon: '🐉', source: "House of Dragon", ar: { name: "راينيرا تارغارين", ability: "دم التنين", lore: "الوريثة الشرعية للعرش الحديدي، أميرة التنين التي قاتلت من أجل حقها." }, en: { name: "RAENERA TARGARYEN", ability: "Dragon Blood", lore: "The rightful heir to the Iron Throne who fought for her right." } },
    { id: 134, type: "series", p: 83, icon: '🔥', source: "Game of Thrones", ar: { name: "دنيرس تارغارين", ability: "أم التنين", lore: "أم التنين التي حررت العبيد وكادت أن تسيطر على ويستروس." }, en: { name: "DAENERYS TARGARYEN", ability: "Mother of Dragons", lore: "The Mother of Dragons who freed slaves and almost conquered Westeros." } },
    { id: 138, type: "game", p: 85, icon: '🌳', source: "Legend of Zelda", ar: { name: "لينك", ability: "شجاعة البطل", lore: "بطل هايرول الذي يواجه قوى الظلام مراراً لإنقاذ الأميرة زيلدا." }, en: { name: "LINK", ability: "Hero's Courage", lore: "The Hero of Hyrule who repeatedly faces the forces of darkness to save Princess Zelda." } },
    { id: 139, type: "game", p: 84, icon: '👑', source: "Legend of Zelda", ar: { name: "زيلدا", ability: "حكمة الإلهة", lore: "أميرة هايرول التي تمتلك قوى الإلهة وتحارب الظلام بالعلم والسحر." }, en: { name: "ZELDA", ability: "Goddess Wisdom", lore: "The Princess of Hyrule who possesses goddess powers and fights darkness with magic." } },
    { id: 140, type: "anime", p: 86, icon: '⚔️', source: "Fairy Tail", ar: { name: "إرزا سكارلت", ability: "تيتانيا", lore: "أقوى امرأة في نقابة الخرافة، ملكة السيوف التي لا تقهر." }, en: { name: "ERZA SCARLET", ability: "Titania", lore: "The strongest woman in Fairy Tail, the unbeatable queen of swords." } },
    // PEAK FORMS (IDs 71-120, 141-200)
    { id: 71, type: "game", p: 101, isPeak: true, icon: '👑', source: "God of War Ragnarok", ar: { name: "كراتوس (إله الحرب)", ability: "الغضب الكوني", lore: "كراتوس في ذروة قوته كإله حرب، يحمل غضباً كونياً يمكنه تحطيم الآلهة والأبعاد. كل ضربة تهز الكون، وكل صرخة توقف الزمن." }, en: { name: "KRATOS (God of War)", ability: "Cosmic Rage", lore: "Kratos at his peak as God of War, wielding cosmic rage capable of shattering gods and dimensions." } },
    { id: 72, type: "anime", p: 104, isPeak: true, icon: '⚡️', source: "One Punch Man", ar: { name: "سايتاما (النمو الأسي)", ability: "اللكمة المطلقة", lore: "سايتاما في حالة النمو الأسي، حيث تزداد قوته بشكل لا نهائي مع كل معركة. هو ليس قوياً فحسب — هو ما بعد القوة." }, en: { name: "SAITAMA (Exponential)", ability: "Absolute Punch", lore: "Saitama in exponential growth state, where his power increases infinitely with every battle." } },
    { id: 73, type: "anime", p: 104, isPeak: true, icon: '✨️', source: "Dragon Ball Super", ar: { name: "غوكو (الغريزة الفائقة)", ability: "إتقان الغريزة", lore: "غوكو أتقن الغريزة الفائقة بالكامل، حالة الكمال القتالي حيث يتحرك الجسم دون تفكير." }, en: { name: "GOKU (Ultra Instinct)", ability: "Instinct Mastery", lore: "Goku fully mastering Ultra Instinct, the state of combat perfection where the body moves without thought." } },
    { id: 74, type: "movie", p: 101, isPeak: true, icon: '♾️', source: "Avengers", ar: { name: "ثانوس (القفاز الكامل)", ability: "المحو الكوني", lore: "ثانوس مع قفاز Infinity الكامل، قادر على تغيير الواقع ومحو نصف الكون بنقرة إصبع واحدة." }, en: { name: "THANOS (Full Gauntlet)", ability: "Cosmic Erasure", lore: "Thanos with the complete Infinity Gauntlet, capable of altering reality and erasing half the universe." } },
    { id: 75, type: "anime", p: 100, isPeak: true, icon: '🦊', source: "Naruto Shippuden", ar: { name: "ناروتو (Baryon Mode)", ability: "اندماج الجزيئات", lore: "ناروتو في وضع الباريون، اندماج تشاكرا ناروتو وكوراما الذي يدمر المادة على المستوى الجزيئي." }, en: { name: "NARUTO (Baryon Mode)", ability: "Molecular Fusion", lore: "Naruto in Baryon Mode, fusion that destroys matter at molecular level." } },
    { id: 76, type: "anime", p: 100, isPeak: true, icon: '☀️', source: "One Piece", ar: { name: "لوفي (Gear 5)", ability: "إله الشمس نيكا", lore: "استيقاظ فاكهة الشيطان، يحول لوفي إلى إله الشمس نيكا مع القدرة على جعل العالم مرناً كالمطاط." }, en: { name: "LUFFY (Gear 5)", ability: "Sun God Nika", lore: "Awakening of the Devil Fruit transforms Luffy into the Sun God Nika." } },
    { id: 77, type: "anime", p: 97, isPeak: true, icon: '⛰️', source: "Attack on Titan", ar: { name: "إيرين (المؤسس)", ability: "الدمدمة", lore: "إيرين بصلة مؤسس التيتاني، يتحكم بكل العمالقة في التاريخ لسحق العالم." }, en: { name: "EREN YEAGER (Founder)", ability: "The Rumbling", lore: "Eren wielding the Founder Titan's power, controlling all titans throughout history." } },
    { id: 78, type: "anime", p: 100, isPeak: true, icon: '👑', source: "Dragon Ball Super", ar: { name: "فيجيتا (Ultra Ego)", ability: "الغرور الفائق", lore: "فيجيتا في حالة الغرور الفائق، حيث يتحول كبرياؤه إلى مصدر قوة لا نهائي." }, en: { name: "VEGETA (Ultra Ego)", ability: "Ultimate Pride", lore: "Vegeta in Ultra Ego state, where his pride transforms into an infinite power source." } },
    { id: 79, type: "game", p: 103, isPeak: true, icon: '💀', source: "DOOM Eternal", ar: { name: "دوم سلاير (الأبدي)", ability: "الغضب الأبدي", lore: "دوم سلاير في ذروة غضبه الأبدي، محارب لا يعرف الرحمة يسحق الشياطين عبر الأبعاد." }, en: { name: "DOOM SLAYER (Eternal)", ability: "Eternal Rage", lore: "Doom Slayer at his angriest, a merciless warrior crushing demons across dimensions." } },
    { id: 80, type: "comic", p: 105, isPeak: true, icon: '☀️', source: "DC Comics", ar: { name: "سوبرمان (مليون)", ability: "الجوهر الذهبي", lore: "سوبرمان بعد امتصاص طاقة الشمس لمليون سنة، أصبح كائناً كونياً قادراً على خلق النجوم." }, en: { name: "SUPERMAN (One Million)", ability: "Golden Sun", lore: "Superman after absorbing solar energy for a million years, becoming a cosmic entity." } },
    { id: 81, type: "comic", p: 100, isPeak: true, icon: '⚔️', source: "DC Comics", ar: { name: "باتمان (Hellbat)", ability: "درع الجحيم", lore: "باتمان مرتدياً درع Hellbat المصنوع في أبوكوليبس." }, en: { name: "BATMAN (Hellbat)", ability: "Hell Armor", lore: "Batman wearing the Hellbat armor forged in Apokolips." } },
    { id: 82, type: "comic", p: 101, isPeak: true, icon: '🤖', source: "Marvel Comics", ar: { name: "آيرون مان (Godkiller)", ability: "مبيد الآلهة", lore: "توني ستارك في درع Godkiller، المصمم خصيصاً لمواجهة الكيانات الإلهية." }, en: { name: "IRON MAN (Godkiller)", ability: "God Slayer", lore: "Tony Stark in Godkiller armor, specifically designed to combat divine entities." } },
    { id: 83, type: "comic", p: 103, isPeak: true, icon: '⚡️', source: "Marvel Comics", ar: { name: "ثور (ملك الآلهة)", ability: "سيد الصواعق", lore: "ثور في ذروة قوته كملك للآلهة، يتحكم في العواصف والبرق الكوني." }, en: { name: "THOR (All-Father)", ability: "Storm King", lore: "Thor at his peak as All-Father, controlling cosmic storms and lightning." } },
    { id: 84, type: "comic", p: 102, isPeak: true, icon: '☢️', source: "Marvel Comics", ar: { name: "هالك (World Breaker)", ability: "الزلازل الكونية", lore: "هالك في ذروة غضبه، قادر على تدمير الكواكب بمجرد وطء قدميه." }, en: { name: "HULK (World Breaker)", ability: "Cosmic Tremors", lore: "Hulk at his angriest, capable of destroying planets with his footsteps." } },
    { id: 85, type: "movie", p: 91, isPeak: true, icon: '💻', source: "The Matrix", ar: { name: "نيو (The One)", ability: "سيد المصفوفة", lore: "نيو المختار الذي يستطيع رؤية شفرة المصفوفة والتلاعب بها." }, en: { name: "NEO (The One)", ability: "Matrix Master", lore: "Neo The One who can see and manipulate the Matrix's code." } },
    { id: 86, type: "anime", p: 93, isPeak: true, icon: '♾️', source: "Jujutsu Kaisen", ar: { name: "غوجو ساتورو", ability: "اللانهاية المطلقة", lore: "غوجو في ذروة قوته، تقنية اللانهاية تمنع أي هجوم من الوصول إليه." }, en: { name: "GOJO SATORU", ability: "Absolute Limitless", lore: "Gojo at his peak, the Limitless technique prevents any attack from ever reaching him." } },
    { id: 87, type: "game", p: 98, isPeak: true, icon: '💀', source: "Cyberpunk 2077", ar: { name: "V (أسطورة نايت سيتي)", ability: "الكروم الأسود", lore: "V بعد أن أصبح أسطورة حية في نايت سيتي، مع أفضل التعديلات السيبرانية." }, en: { name: "V (Night City Legend)", ability: "Black Chrome", lore: "V after becoming a living legend in Night City, with the best cybernetic enhancements." } },
    { id: 88, type: "game", p: 97, isPeak: true, icon: '🛡️', source: "HALO Infinite", ar: { name: "ماستر شيف (Spartan 117)", ability: "الدرع المثالي", lore: "ماستر شيف في ذروة كفاءته القتالية، مع أحدث درع سبارتان." }, en: { name: "MASTER CHIEF (Spartan 117)", ability: "Perfect Shield", lore: "Master Chief at peak combat efficiency, with the latest Spartan armor." } },
    { id: 89, type: "comic", p: 101, isPeak: true, icon: '🕷️', source: "Marvel Comics", ar: { name: "سبايدر مان (Cosmic)", ability: "قوة الإنيغما", lore: "سبايدر مان عندما يكتسب قوة الإنيغما الكونية، مما يجعله كائناً شبه إلهي." }, en: { name: "SPIDER-MAN (Cosmic)", ability: "Enigma Force", lore: "Spider-Man imbued with the cosmic Enigma Force, making him a near-deity." } },
    { id: 90, type: "game", p: 96, isPeak: true, icon: '⚔️', source: "Witcher 3", ar: { name: "جيرالت (سيد الوحوش)", ability: "إتقان التحول", lore: "جيرالت في ذروة مهاراته، يجمع بين السيوف، الكيمياء، والسحر." }, en: { name: "GERALT (Master Witcher)", ability: "Mutation Mastery", lore: "Geralt at his peak skills, combining swords, alchemy, and signs." } },
    { id: 91, type: "series", p: 98, isPeak: true, icon: '🇺🇸', source: "The Boys", ar: { name: "هوملاندر (الهيمنة الكاملة)", ability: "القوة المطلقة", lore: "هوملاندر في ذروة قوته، لا يعترف بأي قانون أو سلطة فوق قوته." }, en: { name: "HOMELANDER (Absolute)", ability: "Absolute Power", lore: "Homelander at his peak, recognizing no law above his own strength." } },
    { id: 92, type: "anime", p: 93, isPeak: true, icon: '🩸', source: "Hellsing", ar: { name: "ألوكارد (المستوى 0)", ability: "جيش الدم", lore: "ألوكارد يطلق العنان لجيش كامل من الأرواح المعذبة المحبوسة في دمه." }, en: { name: "ALUCARD (Level 0)", ability: "Blood Army", lore: "Alucard unleashing an entire army of tormented souls imprisoned within his blood." } },
    { id: 93, type: "comic", p: 96, isPeak: true, icon: '🧙', source: "Marvel Comics", ar: { name: "دكتور سترينج (الساحر الأعظم)", ability: "السحر المطلق", lore: "دكتور سترينج الساحر الأعظم للأرض، يتقن جميع فنون السحر." }, en: { name: "DR. STRANGE (Supreme)", ability: "Absolute Sorcery", lore: "Dr. Strange as Earth's Sorcerer Supreme, mastering all mystic arts." } },
    { id: 94, type: "movie", p: 95, isPeak: true, icon: '🪄', source: "Lord of the Rings", ar: { name: "قاندالف الأبيض", ability: "الحكمة القديمة", lore: "قاندالف الأبيض أقوى مايا في الأرض الوسطى، عاد من الموت أكثر قوة." }, en: { name: "GANDALF (White)", ability: "Ancient Wisdom", lore: "Gandalf the White, the most powerful Maia in Middle-earth, who returned stronger from death." } },
    { id: 95, type: "movie", p: 89, isPeak: true, icon: '📜', source: "Harry Potter", ar: { name: "هاري بوتر (سيد الموت)", ability: "المقدسات الثلاثة", lore: "هاري بعد جمع عصا الصلح، حجر القيامة، وعباءة الإخفاء." }, en: { name: "HARRY POTTER (Master)", ability: "Deathly Hallows", lore: "Harry after uniting the Elder Wand, Resurrection Stone, and Invisibility Cloak." } },
    { id: 96, type: "comic", p: 105, isPeak: true, icon: '👻', source: "DC Comics", ar: { name: "سبيكتير", ability: "القضاء الإلهي", lore: "تجسيد غضب الإله في الكون، يمتلك قوة غير محدودة لفرض العدالة." }, en: { name: "THE SPECTRE", ability: "Divine Judgment", lore: "Embodiment of God's wrath, possessing unlimited power to enforce justice." } },
    { id: 97, type: "series", p: 104, isPeak: true, icon: '👽', source: "Ben 10", ar: { name: "بين 10 (Alien X)", ability: "إعادة كتابة الكون", lore: "بين عندما يتحول إلى ألين إكس، الكائن الذي يقرر مصير الكون." }, en: { name: "BEN 10 (Alien X)", ability: "Universe Rewrite", lore: "Ben transforming into Alien X, the being who decides the universe's fate." } },
    { id: 98, type: "game", p: 92, isPeak: true, icon: '🤖', source: "Cyberpunk 2077", ar: { name: "آدم سماشر (Dragoon)", ability: "البروتوكول النهائي", lore: "آدم سماشر في تحول Dragoon الكامل، آلة قتل لا ترحم." }, en: { name: "ADAM SMASHER (Dragoon)", ability: "Final Protocol", lore: "Adam Smasher in full Dragoon conversion, a merciless killing machine." } },
    { id: 99, type: "anime", p: 92, isPeak: true, icon: '👁️', source: "Naruto", ar: { name: "إيتاتشي (سوسانو الكامل)", ability: "تسوكيومي المطلق", lore: "إيتاتشي بسوسانو الكامل وتسوكيومي الذي يحبس الخصوم في وهم زمني." }, en: { name: "ITACHI (Full Susanoo)", ability: "Absolute Tsukuyomi", lore: "Itachi with full Susanoo and Tsukuyomi trapping opponents in temporal illusions." } },
    { id: 100, type: "anime", p: 89, isPeak: true, icon: '⚔️', source: "One Piece", ar: { name: "زورو (ملك السيوف)", ability: "أسلوب السيوف الإلهي", lore: "زورو في ذروة مهارته، يتقن أسلوب القتال بثلاث سيوف ببراعة مطلقة." }, en: { name: "ZORO (Sword King)", ability: "Divine 3-Sword", lore: "Zoro at peak skill, mastering three-sword style combat with absolute brilliance." } },
    { id: 101, type: "game", p: 94, isPeak: true, icon: '🔫', source: "Devil May Cry", ar: { name: "دانتي (Devil Trigger)", ability: "التحول الشيطاني", lore: "دانتي يتحول إلى شيطان كامل لإطلاق العنان لقوته الحقيقية." }, en: { name: "DANTE (Devil Trigger)", ability: "Full Devil", lore: "Dante transforming into a full demon to unleash his true power." } },
    { id: 102, type: "game", p: 94, isPeak: true, icon: '🔥', source: "Tekken", ar: { name: "كازويا (جين الشيطان الكامل)", ability: "الشيطان المطلق", lore: "كازويا مع جين الشيطان الكامل، قوة شيطانية لا حدود لها." }, en: { name: "KAZUYA (Full Devil)", ability: "Absolute Devil", lore: "Kazuya with full Devil Gene, possessing limitless demonic power." } },
    { id: 103, type: "anime", p: 93, isPeak: true, icon: '💨', source: "Attack on Titan", ar: { name: "ليفاي (إعصار الموت)", ability: "سرعة البرق المطلق", lore: "ليفاي في ذروة سرعته، إعصار من النصال يمزق العمالقة في ثوان." }, en: { name: "LEVI (Death Whirlwind)", ability: "Absolute Speed", lore: "Levi at peak speed, a whirlwind of steel shredding titans in seconds." } },
    { id: 104, type: "series", p: 93, isPeak: true, icon: '🌙', source: "Marvel", ar: { name: "مون نايت (فاتح خونشو)", ability: "قوة القمر الكاملة", lore: "مون نايت كفاتح كامل لخونشو، قوى تزداد تحت ضوء القمر." }, en: { name: "MOON KNIGHT (Fist of Khonshu)", ability: "Full Moon Power", lore: "Moon Knight as full Fist of Khonshu, powers increasing under moonlight." } },
    { id: 105, type: "movie", p: 92, isPeak: true, icon: '🐾', source: "Marvel Cinematic", ar: { name: "بلاك بانثر (الفايبرانيوم الحي)", ability: "تقنية القلب الحي", lore: "بلاك بانثر مع تقنية الفايبرانيوم الحي الكاملة." }, en: { name: "BLACK PANTHER (Living Vibranium)", ability: "Living Heart", lore: "Black Panther with full living vibranium technology." } },
    { id: 106, type: "series", p: 91, isPeak: true, icon: '🧠', source: "Stranger Things", ar: { name: "إليفن (القدرات الكاملة)", ability: "التحريك الذهني المطلق", lore: "إليفن في ذروة قدراتها النفسية، تستطيع فتح بوابات للعالم المقلوب." }, en: { name: "ELEVEN (Full Power)", ability: "Absolute Telekinesis", lore: "Eleven at peak psychic powers, able to open gates to the Upside Down." } },
    { id: 107, type: "game", p: 95, isPeak: true, icon: '💀', source: "Mortal Kombat", ar: { name: "سكوربيون (نيران الجحيم)", ability: "سلاسل العالم السفلي", lore: "سكوربيون يستدعي سلاسل من العالم السفلي ويسافر بين الأبعاد." }, en: { name: "SCORPION (Hellfire)", ability: "Underworld Chains", lore: "Scorpion summoning chains from the underworld and traveling between dimensions." } },
    { id: 108, type: "game", p: 86, isPeak: true, icon: '🗡️', source: "Assassin's Creed", ar: { name: "إيزيو (سيد القتلة الأعظم)", ability: "النصل الخفي المطلق", lore: "إيزيو في ذروة مهاراته كسيد قتلة." }, en: { name: "EZIO (Grand Master)", ability: "Absolute Hidden Blade", lore: "Ezio at peak skills as Grand Master Assassin." } },
    { id: 109, type: "game", p: 88, isPeak: true, icon: '👻', source: "Ghost of Tsushima", ar: { name: "جين ساكاي (الشبح المطلق)", ability: "رعب الشبح الكامل", lore: "جين ساكاي كشبح مطلق، يستخدم تكتيكات الخوف والحرب النفسية." }, en: { name: "JIN SAKAI (The Ghost)", ability: "Absolute Ghost", lore: "Jin Sakai as The Ghost, using fear tactics and psychological warfare." } },
    { id: 110, type: "game", p: 88, isPeak: true, icon: '🧬', source: "Resident Evil", ar: { name: "ألبيرت ويسكر (الكمال التطوري)", ability: "السرعة المتطورة", lore: "ويسكر بعد تحقيق الكمال عبر فيروس T، سرعة خارقة لا تصدق." }, en: { name: "ALBERT WESKER (Perfected)", ability: "Absolute Evolution", lore: "Wesker after achieving perfection through T-Virus, superhuman speed." } },
    { id: 111, type: "game", p: 89, isPeak: true, icon: '✨️', source: "Bayonetta", ar: { name: "بايونيتا (ساحرة الأومبرا)", ability: "سحر الوقت المطلق", lore: "بايونيتا في ذروة قوتها السحرية، تستدعي شياطين الجحيم." }, en: { name: "BAYONETTA (Umbra Witch)", ability: "Absolute Witch Time", lore: "Bayonetta at peak magical power, summoning demons from Hell." } },
    { id: 112, type: "series", p: 85, isPeak: true, icon: '🌀', source: "Doctor Who", ar: { name: "دكتور هو (سيد الزمن)", ability: "التلاعب الزمني المطلق", lore: "دكتور هو سيد الزمن الكامل، يهزم الجيوش بعقله." }, en: { name: "DOCTOR WHO (Time Lord)", ability: "Absolute Time Manipulation", lore: "Doctor Who full Time Lord, defeating armies through intellect." } },
    { id: 113, type: "anime", p: 91, isPeak: true, icon: '🫣', source: "Naruto", ar: { name: "كاكاشي (الشارينغان المزدوج)", ability: "نسخ التقنيات المطلق", lore: "كاكاشي بشارينغان مزدوج، يتقن ألف تقنية بكمال مطلق." }, en: { name: "KAKASHI (Dual Sharingan)", ability: "Absolute Copy", lore: "Kakashi with dual Sharingan, mastering a thousand techniques." } },
    { id: 114, type: "anime", p: 90, isPeak: true, icon: '✨️', source: "FMA", ar: { name: "إدوارد إلريك (الحجر الفلسفي)", ability: "الخيمياء المطلقة", lore: "إدوارد إلريك مع الحجر الفلسفي، خيمياء لا حدود لها." }, en: { name: "EDWARD ELRIC (Philosopher's Stone)", ability: "Absolute Alchemy", lore: "Edward Elric with Philosopher's Stone, alchemy without limits." } },
    { id: 115, type: "game", p: 87, isPeak: true, icon: '🌀', source: "Mortal Kombat", ar: { name: "كيتانا (أميرة إيدينيا)", ability: "مراوح الموت المطلقة", lore: "كيتانا في ذروة قوتها، تدمج بين الجمال والفتك." }, en: { name: "KITANA (Edenian Princess)", ability: "Absolute Steel Fans", lore: "Kitana at peak power, combining beauty and absolute lethality." } },
    { id: 116, type: "anime", p: 86, isPeak: true, icon: '🔥', source: "Demon Slayer", ar: { name: "تانيجيرو (أنفاس الشمس الكاملة)", ability: "الشمس المطلقة", lore: "تانيجيرو يتقن أنفاس الشمس الكاملة، نصل من نور." }, en: { name: "TANJIRO (Complete Sun Breathing)", ability: "Absolute Sun", lore: "Tanjiro mastering complete Sun Breathing, a blade of pure light." } },
    { id: 117, type: "game", p: 86, isPeak: true, icon: '🕵️', source: "Metal Gear", ar: { name: "سوليد سنيك (التسلل المطلق)", ability: "التسلل الكامل", lore: "سوليد سنيك خبير الحرب الصامتة، يتسلل دون أن يترك أثراً." }, en: { name: "SOLID SNAKE (Absolute Stealth)", ability: "Complete Infiltration", lore: "Solid Snake expert in silent warfare, infiltrating without a trace." } },
    { id: 118, type: "series", p: 85, isPeak: true, icon: '🥷', source: "GoT", ar: { name: "أريا ستارك (وجه لا أحد المطلق)", ability: "الوجه المطلق", lore: "أريا ستارك تتقن فن وجه لا أحد بالكامل." }, en: { name: "ARYA STARK (Faceless One)", ability: "Absolute Face", lore: "Arya Stark fully mastering the art of being Faceless." } },
    { id: 119, type: "game", p: 87, isPeak: true, icon: '🫣', source: "Dishonored", ar: { name: "كورفو أتانو (سيد الظلال)", ability: "السحر المظلم المطلق", lore: "كورفو أتانو في ذروة قدراته، يتلاعب بالزمن والظلال." }, en: { name: "CORVO ATTANO (Shadow Master)", ability: "Absolute Dark Magic", lore: "Corvo Attano at peak abilities, manipulating time and shadows." } },
    { id: 120, type: "movie", p: 92, isPeak: true, icon: '⚫️', source: "Star Wars", ar: { name: "دارث فيدر (سيد السيث)", ability: "الجانب المظلم المطلق", lore: "دارث فيدر في ذروة قوته كسيد للسيث." }, en: { name: "DARTH VADER (Sith Lord)", ability: "Absolute Dark Side", lore: "Darth Vader at peak power as Sith Lord." } },
    { id: 141, type: "game", p: 102, isPeak: true, icon: '👑', source: "God of War Ragnarok", ar: { name: "كراتوس (الأب الكوني)", ability: "الرونية القديمة", lore: "كراتوس بعد أن فهم أسرار الرونية القديمة، قادر على إعادة تشكيل الواقع." }, en: { name: "KRATOS (All-Father)", ability: "Ancient Runes", lore: "Kratos after mastering ancient runes, able to reshape reality with his words." } },
    { id: 142, type: "anime", p: 105, isPeak: true, icon: '⚡️', source: "Dragon Ball Heroes", ar: { name: "غوكو (أولترا GOD)", ability: "قوة الآلهة المطلقة", lore: "غوكو بعد اندماج الغريزة الفائقة مع قوة الآلهة، أصبح كائناً يتجاوز الزمن." }, en: { name: "GOKU (Ultra GOD)", ability: "Divine Power", lore: "Goku after merging Ultra Instinct with god power, becoming a being beyond time." } },
    { id: 143, type: "comic", p: 108, isPeak: true, icon: '📖', source: "Marvel", ar: { name: "ثانوس (ملك الموت)", ability: "العدم", lore: "ثانوس بعد أن أصبح سيد الموت، قادر على محو الوجود بأكمله." }, en: { name: "THANOS (Death King)", ability: "Oblivion", lore: "Thanos after becoming Death's master, able to erase all existence." } },
    { id: 144, type: "comic", p: 106, isPeak: true, icon: '💥', source: "DC", ar: { name: "دومسداي (النهاية)", ability: "التكيف المطلق", lore: "دومسداي بعد آلاف السنين من التطور، قادر على التكيف مع أي هجوم." }, en: { name: "DOOMSDAY (Endgame)", ability: "Absolute Adaptation", lore: "Doomsday after thousands of years of evolution, adapting to any attack." } },
    { id: 145, type: "anime", p: 103, isPeak: true, icon: '💀', source: "One Punch Man", ar: { name: "غارو (كابوس البشرية)", ability: "نسخ التقنيات", lore: "غارو في ذروة تطوره، قادر على نسخ أي تقنية قتالية بعد مشاهدتها مرة واحدة." }, en: { name: "GAROU (Human Nightmare)", ability: "Technique Copy", lore: "Garou at his peak, able to copy any combat technique after seeing it once." } },
    { id: 146, type: "anime", p: 104, isPeak: true, icon: '🐉', source: "One Piece", ar: { name: "كايدو (ملك الوحوش)", ability: "التنين الأزرق", lore: "كايدو في شكله التنيني الكامل، أقوى كائن حي في عالم ون بيس." }, en: { name: "KAIDO (Beast King)", ability: "Azure Dragon", lore: "Kaido in his full dragon form, the strongest living being in One Piece." } },
    { id: 147, type: "anime", p: 102, isPeak: true, icon: '☄️', source: "Naruto", ar: { name: "مادارا (إله الشينوبي)", ability: "الجانب المظلم", lore: "مادارا بعد أن أصبح الجويتشي، يمتلك قوة عشيرة أوتشيها بالكامل." }, en: { name: "MADARA (Shinobi God)", ability: "Dark Side", lore: "Madara after becoming the Juubi, possessing the full power of the Uchiha clan." } },
    { id: 148, type: "anime", p: 103, isPeak: true, icon: '👁️', source: "Naruto", ar: { name: "ساسكي (رينيجان النهائي)", ability: "الفضاء-الزمن", lore: "ساسكي مع رينيجان متطور، قادر على السفر بين الأبعاد." }, en: { name: "SASUKE (Final Rinnegan)", ability: "Space-Time", lore: "Sasuke with evolved Rinnegan, able to travel between dimensions." } },
    { id: 149, type: "anime", p: 104, isPeak: true, icon: '⚡️', source: "Bleach", ar: { name: "إيتشيغو (البنكاي النهائي)", ability: "قوة الشينيغامي", lore: "إيتشيغو بعد دمج جميع قواه في بنكاي واحد لا يقهر." }, en: { name: "ICHIGO (Final Bankai)", ability: "Shinigami Power", lore: "Ichigo after merging all his powers into one unbeatable Bankai." } },
    { id: 150, type: "anime", p: 105, isPeak: true, icon: '🌀', source: "Bleach", ar: { name: "أيزن (الهيوجوكو الكامل)", ability: "التحول", lore: "أيزن بعد اندماجه الكامل مع هيوجوكو، أصبح كائناً يتجاوز الشينيغامي." }, en: { name: "AIZEN (Complete Hyogoku)", ability: "Evolution", lore: "Aizen after full fusion with Hyogoku, becoming a being beyond Shinigami." } },
    { id: 151, type: "game", p: 104, isPeak: true, icon: '☣️', source: "Resident Evil", ar: { name: "ألبرت ويسكر (Uroboros)", ability: "الدم الأسود", lore: "ويسكر بعد حقن نفسه بفيروس Uroboros، قادر على التحكم في جسده بشكل كامل." }, en: { name: "ALBERT WESKER (Uroboros)", ability: "Black Blood", lore: "Wesker after injecting himself with Uroboros, able to fully control his body." } },
    { id: 152, type: "game", p: 105, isPeak: true, icon: '🤖', source: "Cyberpunk", ar: { name: "آدم سماشر (Alpha)", ability: "الكروم الذهبي", lore: "آدم سماشر بعد ترقية جسده بالكامل بأفضل تقنية في العالم." }, en: { name: "ADAM SMASHER (Alpha)", ability: "Golden Chrome", lore: "Adam Smasher after fully upgrading his body with the world's best tech." } },
    { id: 153, type: "game", p: 102, isPeak: true, icon: '✊️', source: "Street Fighter", ar: { name: "أكان (المقاتل المطلق)", ability: "الهادو", lore: "أكان في ذروة قوته، قادر على تدمير الجبال بقبضته." }, en: { name: "AKUMA (Absolute Fighter)", ability: "Hadou", lore: "Akuma at his peak power, able to destroy mountains with his fist." } },
    { id: 154, type: "game", p: 103, isPeak: true, icon: '⚡️', source: "Mortal Kombat", ar: { name: "شاو كان (إمبراطور)", ability: "الهامر", lore: "شاو كان بعد أن استولى على أرواح آلاف المقاتلين." }, en: { name: "SHAO KAHN (Emperor)", ability: "The Hammer", lore: "Shao Kahn after conquering thousands of souls." } },
    { id: 155, type: "game", p: 104, isPeak: true, icon: '🔥', source: "Mortal Kombat", ar: { name: "ليو كانغ (إله النار)", ability: "نار الآلهة", lore: "ليو كانغ بعد أن أصبح إله النار، حامي مملكة الأرض." }, en: { name: "LIU KANG (Fire God)", ability: "God Fire", lore: "Liu Kang after becoming Fire God, protector of Earthrealm." } },
    { id: 156, type: "game", p: 101, isPeak: true, icon: '🤖', source: "Tekken", ar: { name: "جينباتشي (الشيطان)", ability: "قوة الشيطان", lore: "جينباتشي في صورته الشيطانية الكاملة، قوة لا تقهَر." }, en: { name: "JINPACHI (Devil)", ability: "Devil Power", lore: "Jinpachi in his full devil form, unbeatable power." } },
    { id: 157, type: "game", p: 102, isPeak: true, icon: '👻', source: "Dark Souls", ar: { name: "جوين (سيد الشمس)", ability: "الشمس الأولى", lore: "جوين سيد الشمس في قوته الكاملة قبل أن يحرق نفسه." }, en: { name: "GWYN (Sun Lord)", ability: "First Sun", lore: "Gwyn, Lord of Sunlight, at his full power before burning himself." } },
    { id: 158, type: "game", p: 103, isPeak: true, icon: '🌑', source: "Dark Souls", ar: { name: "مانوس (أبو العفن)", ability: "الظلام", lore: "مانوس في ذروة قوته، قادر على تشويه الزمن والفضاء." }, en: { name: "MANUS (Father)", ability: "Darkness", lore: "Manus at his peak, able to distort time and space." } },
    { id: 159, type: "game", p: 104, isPeak: true, icon: '👑', source: "Elden Ring", ar: { name: "ماريكا (الإلهة)", ability: "حلقة إلدن", lore: "الإلهة ماريكا في ذروة قوتها، حارسة حلقة إلدن." }, en: { name: "MARIKA (Goddess)", ability: "Elden Ring", lore: "Goddess Marika at her peak, guardian of the Elden Ring." } },
    { id: 160, type: "game", p: 105, isPeak: true, icon: '💀', source: "Elden Ring", ar: { name: "مالينيا (إلهة العفن)", ability: "الزهرة", lore: "مالينيا في ذروة قوتها عندما تحولت إلى إلهة العفن." }, en: { name: "MALENIA (Rot Goddess)", ability: "The Flower", lore: "Malenia at her peak when she became the Goddess of Rot." } },
    { id: 161, type: "movie", p: 102, isPeak: true, icon: '⚡️', source: "Star Wars", ar: { name: "بالباتين (دارث سيديوس)", ability: "البرق المطلق", lore: "الإمبراطور بالباتين في ذروة قوته، يتحكم بالجانب المظلم بالكامل." }, en: { name: "PALPATINE (Darth Sidious)", ability: "Absolute Lightning", lore: "Emperor Palpatine at his peak, controlling the dark side completely." } },
    { id: 162, type: "movie", p: 103, isPeak: true, icon: '✨️', source: "Star Wars", ar: { name: "دارث فيدر (المختار)", ability: "التوازن", lore: "أنكين سكاي ووكر في ذروة قوته كالمختار، يجلب التوازن للقوة." }, en: { name: "DARTH VADER (Chosen)", ability: "Balance", lore: "Anakin Skywalker at his peak as the Chosen One, bringing balance to the Force." } },
    { id: 163, type: "comic", p: 107, isPeak: true, icon: '📖', source: "Marvel", ar: { name: "دكتور دوم (الإمبراطور)", ability: "العلم المطلق", lore: "دكتور دوم بعد أن سرق قوة البيوندر، أصبح أقوى كائن في الوجود." }, en: { name: "DOCTOR DOOM (Emperor)", ability: "Absolute Science", lore: "Doctor Doom after stealing the Beyonder's power, the strongest being in existence." } },
    { id: 164, type: "comic", p: 108, isPeak: true, icon: '🔮', source: "Marvel", ar: { name: "البيوندر (ما وراء)", ability: "الواقع", lore: "البيوندر، الكائن الذي يتجاوز كل القوانين الفيزيائية." }, en: { name: "THE BEYONDER", ability: "Reality", lore: "The Beyonder, the being beyond all physical laws." } },
    { id: 165, type: "comic", p: 106, isPeak: true, icon: '☀️', source: "DC", ar: { name: "سوبرمان (الذهبي)", ability: "الشمس الذهبية", lore: "سوبرمان بعد امتصاص طاقة الشمس الذهبية، قوته لا حدود لها." }, en: { name: "SUPERMAN (Golden)", ability: "Golden Sun", lore: "Superman after absorbing the energy of a golden sun, limitless power." } },
    { id: 166, type: "comic", p: 105, isPeak: true, icon: '⚡️', source: "DC", ar: { name: "ذا فلاش (السرعة المطلقة)", ability: "السرعة القصوى", lore: "ذا فلاش في ذروة سرعته، قادر على السفر عبر الزمن." }, en: { name: "THE FLASH (Absolute Speed)", ability: "Max Speed", lore: "The Flash at his peak speed, able to travel through time." } },
    { id: 167, type: "comic", p: 104, isPeak: true, icon: '⚔️', source: "DC", ar: { name: "ووندر وومان (إلهة الحرب)", ability: "القتال الإلهي", lore: "ديانا في ذروة قوتها كإلهة حرب." }, en: { name: "WONDER WOMAN (War Goddess)", ability: "Divine Combat", lore: "Diana at her peak as the Goddess of War." } },
    { id: 168, type: "comic", p: 106, isPeak: true, icon: '🔨', source: "Marvel", ar: { name: "ثور (الرعد المطلق)", ability: "العاصفة", lore: "ثور بكل قوى الرعد الكوني بلا قيود." }, en: { name: "THOR (Absolute Thunder)", ability: "The Storm", lore: "Thor with all the power of cosmic thunder unleashed." } },
    { id: 169, type: "comic", p: 107, isPeak: true, icon: '💀', source: "Marvel", ar: { name: "هالك (الغضب الكوني)", ability: "الدمار", lore: "هالك بعد سنوات من الغضب المتراكم، قادر على تدمير المجرات." }, en: { name: "HULK (Cosmic Rage)", ability: "Destruction", lore: "Hulk after years of built-up rage, able to destroy galaxies." } },
    { id: 170, type: "anime", p: 105, isPeak: true, icon: '♾️', source: "Jujutsu Kaisen", ar: { name: "غوجو (اللانهاية)", ability: "الأرجواني المجوف", lore: "غوجو في ذروة قوته، يستخدم الأرجواني المجوف بلا حدود." }, en: { name: "GOJO (Infinity)", ability: "Hollow Purple", lore: "Gojo at his peak, using Hollow Purple without limits." } },
    { id: 171, type: "anime", p: 106, isPeak: true, icon: '👹', source: "Jujutsu Kaisen", ar: { name: "سوكونا (ملك اللعنات)", ability: "الماليشيا", lore: "ريومين سوكونا في شكله الكامل، ملك اللعنات الحقيقي." }, en: { name: "SUKUNA (Curse King)", ability: "Malevolent Shrine", lore: "Ryomen Sukuna in his full form, the true King of Curses." } },
    { id: 172, type: "anime", p: 104, isPeak: true, icon: '💀', source: "Chainsaw Man", ar: { name: "بوكتا (شيطان المنشار)", ability: "الصوت", lore: "بوكتا في شكله الكامل كشيطان المنشار." }, en: { name: "POCHITA (Chainsaw Devil)", ability: "The Sound", lore: "Pochita in his full form as the Chainsaw Devil." } },
    { id: 173, type: "anime", p: 105, isPeak: true, icon: '🔥', source: "Demon Slayer", ar: { name: "يوريتشي (إله الشمس)", ability: "الشمس", lore: "يوريتشي تسوجيكوني في ذروة قوته، مبتكر أنفاس الشمس." }, en: { name: "YORIICHI (Sun God)", ability: "The Sun", lore: "Yoriichi Tsugikuni at his peak, creator of Sun Breathing." } },
    { id: 174, type: "anime", p: 103, isPeak: true, icon: '🌙', source: "Demon Slayer", ar: { name: "كوكوشيبو (القمر)", ability: "أنفاس القمر", lore: "كوكوشيبو في ذروة قوته، أفضل تلميذ ليوريتشي." }, en: { name: "KOKUSHIBO (Moon)", ability: "Moon Breathing", lore: "Kokushibo at his peak, Yoriichi's greatest student." } },
    { id: 175, type: "series", p: 102, isPeak: true, icon: '👑', source: "The Witcher", ar: { name: "جيرالت (الساحر الكامل)", ability: "العلامات", lore: "جيرالت بعد أن أتقن كل علامات الساحر." }, en: { name: "GERALT (Complete Witcher)", ability: "The Signs", lore: "Geralt after mastering all Witcher signs." } },
    { id: 176, type: "series", p: 103, isPeak: true, icon: '🔥', source: "Game of Thrones", ar: { name: "دنيرس (المحررة)", ability: "النار", lore: "دنيرس بثلاثة تنانين بالغة، قادرة على حرق الممالك." }, en: { name: "DAENERYS (Liberator)", ability: "Fire", lore: "Daenerys with three grown dragons, able to burn kingdoms." } },
    { id: 177, type: "series", p: 104, isPeak: true, icon: '❄️', source: "Game of Thrones", ar: { name: "جون سنو (الملك)", ability: "الشتاء", lore: "جون سنو بعد أن أصبح ملك الشمال وواجه الليل الطويل." }, en: { name: "JON SNOW (King)", ability: "Winter", lore: "Jon Snow after becoming King in the North and facing the Long Night." } },
    { id: 178, type: "movie", p: 105, isPeak: true, icon: '👁️', source: "Lord of the Rings", ar: { name: "ساورون (العين)", ability: "الخاتم", lore: "ساورون مع الخاتم الواحد، يسيطر على كل الأرواح." }, en: { name: "SAURON (The Eye)", ability: "The Ring", lore: "Sauron with the One Ring, controlling all souls." } },
    { id: 179, type: "movie", p: 103, isPeak: true, icon: '✨️', source: "Harry Potter", ar: { name: "دمبلدور (الأسطورة)", ability: "الخيمياء", lore: "دمبلدور في ذروة قوته، أعظم ساحر في التاريخ." }, en: { name: "DUMBLEDORE (Legend)", ability: "Alchemy", lore: "Dumbledore at his peak, the greatest wizard in history." } },
    { id: 180, type: "movie", p: 102, isPeak: true, icon: '💀', source: "Harry Potter", ar: { name: "فولدمورت (الظلام)", ability: "الهوكس", lore: "فولدمورت بعد أن صنع سبعة هوكس، أصبح خالداً." }, en: { name: "VOLDEMORT (Dark)", ability: "Horcruxes", lore: "Voldemort after making seven horcruxes, immortal." } },
    { id: 181, type: "game", p: 104, isPeak: true, icon: '🌳', source: "Legend of Zelda", ar: { name: "لينك (البطل الأعلى)", ability: "المثلث الذهبي", lore: "لينك بعد أن جمع كل القطع الثلاثة، بطل هايرول الحقيقي." }, en: { name: "LINK (Supreme Hero)", ability: "Triforce", lore: "Link after collecting all three pieces, the true Hero of Hyrule." } },
    { id: 182, type: "game", p: 105, isPeak: true, icon: '👑', source: "Legend of Zelda", ar: { name: "غانون (الوحش)", ability: "الغضب", lore: "غانون في شكله الوحشي الكامل، قوة الظلام المطلقة." }, en: { name: "GANON (Beast)", ability: "Rage", lore: "Ganon in his full beast form, absolute dark power." } },
    { id: 183, type: "game", p: 103, isPeak: true, icon: '👻', source: "Hollow Knight", ar: { name: "الجوف (الظل)", ability: "الفراغ", lore: "الجوف بعد أن احتوى كل قوة الفراغ." }, en: { name: "THE HOLLOW (Shadow)", ability: "Void", lore: "The Hollow Knight after containing all void power." } },
    { id: 184, type: "game", p: 104, isPeak: true, icon: '👑', source: "Hollow Knight", ar: { name: "بال (الضوء)", ability: "الضياء", lore: "بال في شكله الكامل، إله الضوء الأبيض." }, en: { name: "PALE (Light)", ability: "Radiance", lore: "The Pale King in his full form, the God of White Light." } },
    { id: 185, type: "anime", p: 106, isPeak: true, icon: '☄️', source: "FMA", ar: { name: "إدوارد (الحجر الفلسفي)", ability: "التحويل", lore: "إدوارد مع حجر الفيلسوف، قادر على تحويل المادة بلا قيود." }, en: { name: "EDWARD (Philosopher's Stone)", ability: "Transmutation", lore: "Edward with the Philosopher's Stone, able to transmute matter without limits." } },
    { id: 186, type: "anime", p: 105, isPeak: true, icon: '⚗️', source: "FMA", ar: { name: "فاثر (الأب)", ability: "الذات", lore: "فاثر في ذروة قوته، كائن شبه إلهي يسعى لامتصاص الله." }, en: { name: "FATHER (The Father)", ability: "Self", lore: "Father at his peak, a near-divine being seeking to absorb God." } },
    { id: 187, type: "series", p: 102, isPeak: true, icon: '🌀', source: "Doctor Who", ar: { name: "دكتور (سيد الزمن المطلق)", ability: "الزمن", lore: "دكتور هو بعد أن أصبح سيد الزمن المطلق." }, en: { name: "DOCTOR (Absolute Time Master)", ability: "Time", lore: "The Doctor after becoming the absolute Time Lord." } },
    { id: 188, type: "series", p: 103, isPeak: true, icon: '👽', source: "Doctor Who", ar: { name: "دافروس (الإمبراطور)", ability: "داليك", lore: "دافروس إمبراطور الداليك في ذروة قوته." }, en: { name: "DAVROS (Emperor)", ability: "Dalek", lore: "Davros, Emperor of the Daleks, at his peak." } },
    { id: 189, type: "comic", p: 109, isPeak: true, icon: '📖', source: "Marvel", ar: { name: "ليفينغ تريبيونال", ability: "العدالة الكونية", lore: "كائن العدالة الكوني، فوق كل الآلهة." }, en: { name: "LIVING TRIBUNAL", ability: "Cosmic Justice", lore: "The cosmic being of justice, above all gods." } },
    { id: 190, type: "comic", p: 110, isPeak: true, icon: '✨️', source: "Marvel", ar: { name: "ون-آبوف-أول", ability: "الكل", lore: "الكائن الأعلى في الكون المارفل. لا بداية ولا نهاية." }, en: { name: "ONE-ABOVE-ALL", ability: "All", lore: "The supreme being in the Marvel universe. No beginning, no end." } },
    { id: 191, type: "comic", p: 109, isPeak: true, icon: '⚡️', source: "DC", ar: { name: "ذا بريزنس", ability: "الوجود", lore: "الوجود الأعلى في عالم DC — الخالق الذي لا يحصى." }, en: { name: "THE PRESENCE", ability: "Presence", lore: "The supreme being in the DC universe — the Creator beyond description." } },
    { id: 192, type: "comic", p: 108, isPeak: true, icon: '☀️', source: "DC", ar: { name: "لوسيفر (الصباح)", ability: "الحرية", lore: "لوسيفر مورنينغستار في ذروة قوته." }, en: { name: "LUCIFER (Morning)", ability: "Freedom", lore: "Lucifer Morningstar at his absolute peak." } },
    { id: 193, type: "anime", p: 106, isPeak: true, icon: '🔥', source: "Dragon Ball", ar: { name: "بيروس (الدمار)", ability: "الهاكاي", lore: "بيروس إله الدمار، قادر على محو الكواكب والنجوم بلمسة." }, en: { name: "BEERUS (Destruction)", ability: "Hakai", lore: "Beerus the God of Destruction, able to erase planets with a touch." } },
    { id: 194, type: "anime", p: 107, isPeak: true, icon: '👼', source: "Dragon Ball", ar: { name: "ويس (الملاك)", ability: "الزمن", lore: "ويس الملاك، أقوى من الآلهة أنفسهم." }, en: { name: "WHIS (Angel)", ability: "Time", lore: "Whis the Angel, stronger than the gods themselves." } },
    { id: 195, type: "anime", p: 108, isPeak: true, icon: '👑', source: "Dragon Ball", ar: { name: "زينو (الملك)", ability: "المحو الكامل", lore: "الملك زينو، قادر على محو الكون كله بلا جهد." }, en: { name: "ZENO (King)", ability: "Total Erasure", lore: "King Zeno, able to erase the entire universe effortlessly." } },
    { id: 196, type: "game", p: 106, isPeak: true, icon: '🔥', source: "Dark Souls", ar: { name: "نيتو (الموت)", ability: "الموت", lore: "نيتو سيد الموتى الأوائل في ذروة قوته." }, en: { name: "NITO (Death)", ability: "Death", lore: "Nito, the First of the Dead, at his peak." } },
    { id: 197, type: "game", p: 107, isPeak: true, icon: '🧙', source: "Dark Souls", ar: { name: "ساحرة إيزاليث", ability: "النار", lore: "ساحرة إيزاليث في ذروة قوتها النارية." }, en: { name: "WITCH OF IZALITH", ability: "Fire", lore: "The Witch of Izalith at her fiery peak." } },
    { id: 198, type: "game", p: 105, isPeak: true, icon: '🐉', source: "Dark Souls", ar: { name: "سيث (الخالد)", ability: "الخلود", lore: "سيث الخالد، ساحر التنين الذي لا يموت." }, en: { name: "SEATH (Immortal)", ability: "Immortality", lore: "Seath the Scaleless, the immortal dragon sorcerer." } },
    { id: 199, type: "anime", p: 107, isPeak: true, icon: '💀', source: "Hellsing", ar: { name: "ألوكارد (الدم الكامل)", ability: "الدم", lore: "ألوكارد بعد أن أطلق كل أرواح دمه بلا حدود." }, en: { name: "ALUCARD (Full Blood)", ability: "Blood", lore: "Alucard after releasing all souls in his blood without limits." } },
    { id: 200, type: "anime", p: 108, isPeak: true, icon: '🧵', source: "Hellsing", ar: { name: "والتر (الموت)", ability: "الخيوط", lore: "والتر في شكله الشيطاني، أسرع قاتل في الوجود." }, en: { name: "WALTER (Death)", ability: "Threads", lore: "Walter in his vampire form, the fastest killer in existence." } },

    // 
    // EXPANSION — شخصيات 201-500
    // 

    // ── ألعاب ──
    { id: 201, type: "game", p: 87, icon: '🦅', source: "Assassin's Creed Origins", ar: { name: "باييك", ability: "عين الصقر", lore: "المحارب النوبي الذي أسس أخوية المغتالين في مصر القديمة." }, en: { name: "BAYEK", ability: "Eagle Vision", lore: "The Nubian warrior who founded the Assassin Brotherhood in ancient Egypt." } },
    { id: 202, type: "game", p: 85, icon: '🪓', source: "Assassin's Creed Valhalla", ar: { name: "إيفور", ability: "غضب الفايكنج", lore: "محارب الفايكنج الذي غزا إنجلترا وبنى مستعمرة الرافين كلاو." }, en: { name: "EIVOR", ability: "Viking Fury", lore: "The Viking warrior who conquered England and built Ravensthorpe." } },
    { id: 203, type: "game", p: 84, icon: '🌊', source: "Sea of Thieves", ar: { name: "القرصان الأسطوري", ability: "سيد البحار", lore: "قرصان يبحث عن الكنوز الأسطورية في عالم مليء بالمغامرات." }, en: { name: "LEGENDARY PIRATE", ability: "Sea Master", lore: "A pirate seeking legendary treasures across a world full of adventure." } },
    { id: 204, type: "game", p: 89, icon: '🔱', source: "God of War", ar: { name: "أتريوس", ability: "سهام اللوكي", lore: "ابن كراتوس الذي اكتشف أنه إله الأشرار لوكي. يحمل قوسه بثقة البطولة." }, en: { name: "ATREUS", ability: "Loki's Arrows", lore: "Kratos's son who discovered he is the god Loki. He wields his bow with heroic confidence." } },
    { id: 205, type: "game", p: 86, icon: '🌿', source: "Ghost of Tsushima", ar: { name: "يوناي", ability: "سهام الريح", lore: "المحاربة التي تحارب المغول بسهامها من بعيد." }, en: { name: "YUNA", ability: "Wind Arrows", lore: "The warrior who fights Mongols with her arrows from a distance." } },
    { id: 206, type: "game", p: 88, icon: '🗺️', source: "Uncharted 4", ar: { name: "ناثان دريك", ability: "حظ المغامر", lore: "صائد الكنوز الذي يعيش على حافة الموت ويخرج منتصراً دائماً." }, en: { name: "NATHAN DRAKE", ability: "Explorer's Luck", lore: "The treasure hunter who lives on the edge of death and always emerges victorious." } },
    { id: 207, type: "game", p: 85, icon: '🌸', source: "Nioh 2", ar: { name: "هيدي", ability: "روح اليوكاي", lore: "المحارب الهجين بين الإنسان واليوكاي. يستخدم قوى الظلام والنور معاً." }, en: { name: "HIDE", ability: "Yokai Spirit", lore: "The human-Yokai hybrid warrior wielding both dark and light powers." } },
    { id: 208, type: "game", p: 87, icon: '⚙️', source: "Horizon Forbidden West", ar: { name: "تلدير", ability: "التقنية القديمة", lore: "عالمة التكنولوجيا التي تساعد إيلوي في فهم الآلات القديمة." }, en: { name: "TALANAH", ability: "Ancient Tech", lore: "The technology expert who helps Aloy understand ancient machines." } },
    { id: 209, type: "game", p: 90, icon: '🌑', source: "Stellar Blade", ar: { name: "إيف", ability: "حراب النجوم", lore: "المحاربة التي هبطت من الفضاء لتحرير الأرض من النايتيف." }, en: { name: "EVE", ability: "Beta Energy", lore: "The warrior who descended from space to free Earth from the Naytiba." } },
    { id: 210, type: "game", p: 88, icon: '🔮', source: "Final Fantasy XVI", ar: { name: "كلايف روزفيلد", ability: "قوة الإيكون", lore: "المحارب الذي يحمل قوى الإيكون ويسعى للقضاء على الطاعون." }, en: { name: "CLIVE ROSFIELD", ability: "Eikon Power", lore: "The warrior bearing Eikon powers seeking to destroy the Blight." } },
    { id: 211, type: "game", p: 86, icon: '🎸', source: "Final Fantasy XV", ar: { name: "نوكتيس", ability: "ملك الظلام", lore: "أمير النيفلهايم المختار الذي يضحي بنفسه لإنقاذ العالم." }, en: { name: "NOCTIS", ability: "Armiger Arsenal", lore: "The chosen prince of Nifleheim who sacrifices himself to save the world." } },
    { id: 212, type: "game", p: 84, icon: '🌺', source: "Final Fantasy VII", ar: { name: "أيريث", ability: "قوة الكوكب", lore: "الفتاة الأخيرة من الأنسيت. تحمل قوة الكوكب وتتواصل مع الأرض." }, en: { name: "AERITH", ability: "Planet's Power", lore: "The last Cetra, carrying the planet's power and speaking with the earth." } },
    { id: 213, type: "game", p: 89, icon: '⚔️', source: "Final Fantasy VII", ar: { name: "سيفيروث", ability: "جناح الظلام", lore: "المحارب الأسطوري الذي تحول إلى عدو الكوكب. جناح واحد يمزق السماء." }, en: { name: "SEPHIROTH", ability: "Black Wing", lore: "The legendary warrior turned planet's enemy. One wing tears the sky." } },
    { id: 214, type: "game", p: 83, icon: '🔫', source: "Borderlands 3", ar: { name: "فل4ك", ability: "أعلى الغنيمة", lore: "صائد الغنيمة في عالم بانديروس. دائماً يبحث عن السلاح الأفضل." }, en: { name: "FL4K", ability: "Top Loot", lore: "The loot hunter of Pandora, always seeking the best weapon." } },
    { id: 215, type: "game", p: 85, icon: '🌪️', source: "Fortnite", ar: { name: "جونز", ability: "عامل الصفر", lore: "عميل مؤسسة الحلوب الذي يحافظ على التوازن بين الجزر." }, en: { name: "AGENT JONES", ability: "Zero Point", lore: "The Loop agent maintaining balance between island realities." } },
    { id: 216, type: "game", p: 91, icon: '🩸', source: "Bloodborne", ar: { name: "غيرمان", ability: "أبو الصيادين", lore: "أول صياد وحوش. يمشط الأحلام المظلمة بمنجله الطويل." }, en: { name: "GEHRMAN", ability: "First Hunter", lore: "The father of all hunters, reaping dark dreams with his long glaive." } },
    { id: 217, type: "game", p: 86, icon: '🌊', source: "Subnautica", ar: { name: "ريان", ability: "إرادة البقاء", lore: "الناجي الوحيد في كوكب مائي مليء بالمخلوقات الفضائية العملاقة." }, en: { name: "RYLEY", ability: "Survival Will", lore: "The sole survivor on a water planet full of giant alien creatures." } },
    { id: 218, type: "game", p: 88, icon: '🤖', source: "NieR: Automata", ar: { name: "2B", ability: "السيف الأسود", lore: "الأندرويد المقاتلة التي تحارب الآلات لصالح البشرية المختفية." }, en: { name: "2B", ability: "Black Sword", lore: "The combat android fighting machines for the sake of vanished humanity." } },
    { id: 219, type: "game", p: 87, icon: '🤖', source: "NieR: Automata", ar: { name: "9S", ability: "قرصنة الأنظمة", lore: "الأندرويد الاستطلاعي الذي يكتشف الحقيقة المروعة خلف الحرب." }, en: { name: "9S", ability: "System Hacking", lore: "The scout android uncovering the horrifying truth behind the war." } },
    { id: 220, type: "game", p: 92, icon: '🔥', source: "Devil May Cry 5", ar: { name: "نيرو", ability: "الذراع الشيطانية", lore: "حفيد سبارداي. يقاتل بذراعه الشيطانية الميكانيكية." }, en: { name: "NERO", ability: "Devil Breaker", lore: "Sparda's grandson, fighting with his mechanical devil arm." } },
    { id: 221, type: "game", p: 93, icon: '🌹', source: "Devil May Cry 5", ar: { name: "فيرجيل", ability: "قوة يامباتو", lore: "توأم دانتي. يسعى للقوة المطلقة لكنه يكتشف معنى العائلة." }, en: { name: "VERGIL", ability: "Yamato Power", lore: "Dante's twin, seeking absolute power while discovering family's meaning." } },
    { id: 222, type: "game", p: 84, icon: '🎮', source: "Kingdom Hearts", ar: { name: "سورا", ability: "مفتاح البلاد", lore: "المحارب الذي يسافر بين العوالم بمفتاح البلاد لمكافحة الظلام." }, en: { name: "SORA", ability: "Keyblade", lore: "The warrior traveling between worlds with the Keyblade to fight darkness." } },
    { id: 223, type: "game", p: 85, icon: '🎮', source: "Kingdom Hearts", ar: { name: "ريكو", ability: "طريق الفجر", lore: "رفيق سورا الذي يتغلب على ظلامه الداخلي ليصبح حاملاً للسيف." }, en: { name: "RIKU", ability: "Way to Dawn", lore: "Sora's friend who overcomes his inner darkness to become a Keyblade wielder." } },
    { id: 224, type: "game", p: 88, icon: '🌀', source: "Control", ar: { name: "جيسي فاي", ability: "سلاح الخدمة", lore: "مديرة مكتب الرقابة الفيدرالي. تتحكم في الطاقة البارانورمال." }, en: { name: "JESSE FADEN", ability: "Service Weapon", lore: "Director of the Federal Bureau of Control, wielding paranatural power." } },
    { id: 225, type: "game", p: 87, icon: '🌲', source: "Alan Wake 2", ar: { name: "ألان ويك", ability: "قوة الكلمة", lore: "الكاتب الذي يجلب كوابيسه إلى الحياة. الكلمات هي سلاحه." }, en: { name: "ALAN WAKE", ability: "Word of Power", lore: "The writer who brings his nightmares to life. Words are his weapon." } },

    // ── أنمي إضافي ──
    { id: 226, type: "anime", p: 88, icon: '⚡️', source: "Hunter x Hunter", ar: { name: "غون فريكس", ability: "النين المتفجر", lore: "الفتى الذي يمتلك كمية هائلة من طاقة النين ويسعى لإيجاد أبيه." }, en: { name: "GON FREECSS", ability: "Explosive NEN", lore: "The boy with massive NEN energy seeking his father across the world." } },
    { id: 227, type: "anime", p: 89, icon: '🧠', source: "Hunter x Hunter", ar: { name: "كيلوا زولديك", ability: "غودسبيد", lore: "القاتل المدرب منذ الطفولة. يحول جسده إلى برق حي." }, en: { name: "KILLUA ZOLDYCK", ability: "Godspeed", lore: "The assassin trained since childhood, turning his body into living lightning." } },
    { id: 228, type: "anime", p: 90, icon: '🕷️', source: "Hunter x Hunter", ar: { name: "هيسوكا موروو", ability: "باندجي غام", lore: "المهرج القاتل الذي يعيش فقط لمواجهة الأقوياء." }, en: { name: "HISOKA MOROW", ability: "Bungee Gum", lore: "The killer clown who lives only to face the strongest opponents." } },
    { id: 229, type: "anime", p: 91, icon: '🕸️', source: "Hunter x Hunter", ar: { name: "كورولو لوسيلفر", ability: "مستعمرة النمل الكيميري", lore: "قائد النمل الكيميري. أذكى مخلوق وجد على وجه الأرض." }, en: { name: "MERUEM", ability: "Royal Guard", lore: "King of the Chimera Ants. The most intelligent creature to ever exist." } },
    { id: 230, type: "anime", p: 86, icon: '🌙', source: "Fullmetal Alchemist", ar: { name: "روي موستانج", ability: "الخيمياء الحرارية", lore: "العقيد الذي يتحكم في النيران بقفازاته. يسعى لقيادة أمسترس." }, en: { name: "ROY MUSTANG", ability: "Flame Alchemy", lore: "The Colonel who controls fire with his gloves, seeking to lead Amestris." } },
    { id: 231, type: "anime", p: 85, icon: '🛡️', source: "Fullmetal Alchemist", ar: { name: "ألفونس إلريك", ability: "درع الخيمياء", lore: "روح محاصرة في درع. يحارب إلى جانب أخيه لاستعادة جسده." }, en: { name: "ALPHONSE ELRIC", ability: "Armor Alchemy", lore: "A soul trapped in armor, fighting alongside his brother to reclaim his body." } },
    { id: 232, type: "anime", p: 84, icon: '💜', source: "Sailor Moon", ar: { name: "سيلور سيرن", ability: "قوة زحل", lore: "محاربة التدمير التي تستطيع محو الكواكب. أكثر شخصية مثيرة للجدل." }, en: { name: "SAILOR SATURN", ability: "Death Reborn", lore: "The Sailor of Destruction who can wipe out planets. The most controversial warrior." } },
    { id: 233, type: "anime", p: 87, icon: '🔥', source: "Black Clover", ar: { name: "آستا", ability: "سحر مضاد", lore: "الفتى الذي ولد بلا سحر. يستخدم طاقة مضادة للسحر لهزيمة الجميع." }, en: { name: "ASTA", ability: "Anti-Magic", lore: "The boy born without magic, using anti-magic energy to defeat all." } },
    { id: 234, type: "anime", p: 88, icon: '⚫️', source: "Black Clover", ar: { name: "يونو", ability: "سحر العواصف", lore: "رفيق آستا الذي يمتلك سحراً هائلاً ويتنافس معه للوصول لقمة المملكة." }, en: { name: "YUNO", ability: "Wind Magic", lore: "Asta's rival with immense magical power, competing to reach the kingdom's top." } },
    { id: 235, type: "anime", p: 86, icon: '🌊', source: "Vinland Saga", ar: { name: "ثورفين", ability: "السيف المزدوج", lore: "المحارب الفايكنج الذي يبحث عن الانتقام ثم السلام في نهاية المطاف." }, en: { name: "THORFINN", ability: "Dual Daggers", lore: "The Viking warrior seeking revenge and ultimately finding peace." } },
    { id: 236, type: "anime", p: 87, icon: '🪓', source: "Vinland Saga", ar: { name: "آسكيلاد", ability: "استراتيجية الحرب", lore: "القائد البريطاني الذي يقاتل بعقله أكثر من سيفه." }, en: { name: "ASKELADD", ability: "War Strategy", lore: "The British commander who fights with his mind more than his sword." } },
    { id: 237, type: "anime", p: 85, icon: '🌸', source: "Sword Art Online", ar: { name: "كيريتو", ability: "أسلوب السيف المزدوج", lore: "لاعب SAO الأسطوري الذي أنقذ آلاف الأرواح المحاصرة في اللعبة." }, en: { name: "KIRITO", ability: "Dual Blades", lore: "The legendary SAO player who saved thousands of trapped lives." } },
    { id: 238, type: "anime", p: 84, icon: '⚡️', source: "Sword Art Online", ar: { name: "آسونا", ability: "ومبائية البرق", lore: "نائبة رئيس فرقة Blood Oath. أسرع سيف في ALfheim." }, en: { name: "ASUNA", ability: "Lightning Flash", lore: "Vice-commander of the Knights of Blood, the fastest sword in ALfheim." } },
    { id: 239, type: "anime", p: 86, icon: '🌀', source: "Re:Zero", ar: { name: "سوبارو ناتسوكي", ability: "العودة بالموت", lore: "الشاب الذي يعود من الموت ليصحح الأخطاء. إرادته لا تنكسر." }, en: { name: "SUBARU NATSUKI", ability: "Return by Death", lore: "The young man who returns from death to correct mistakes. His will never breaks." } },
    { id: 240, type: "anime", p: 89, icon: '🦋', source: "Re:Zero", ar: { name: "إيميليا", ability: "سحر الجليد", lore: "المرشحة الملكية التي تحمل روح العصر الجليدي. قلبها أنقى من ثلجها." }, en: { name: "EMILIA", ability: "Ice Magic", lore: "The royal candidate carrying the spirit of the ice age. Her heart is purer than her ice." } },
    { id: 241, type: "anime", p: 90, icon: '💜', source: "Re:Zero", ar: { name: "رام", ability: "أوني الأرجواني", lore: "الأوني التي فقدت قرنها لحماية أختها. ما زالت تحمل قوة كافية لسحق الجميع." }, en: { name: "RAM", ability: "Oni Power", lore: "The Oni who lost her horn protecting her sister, still strong enough to crush all." } },
    { id: 242, type: "anime", p: 91, icon: '💙', source: "Re:Zero", ar: { name: "ريم", ability: "أوني الأزرق", lore: "الأوني ذات القرنين الكاملين. القوة والرحمة في آن واحد." }, en: { name: "REM", ability: "Blue Oni", lore: "The twin-horned Oni combining raw power with deep compassion." } },
    { id: 243, type: "anime", p: 88, icon: '🌊', source: "That Time I Got Reincarnated as a Slime", ar: { name: "ريموروا تيمبيست", ability: "المنتشر الكبير", lore: "سلايم تطور إلى ملك الوحوش. يمتص قدرات كل من يهزمه." }, en: { name: "RIMURU TEMPEST", ability: "Great Sage", lore: "A slime who evolved into Demon Lord, absorbing abilities of all it defeats." } },
    { id: 244, type: "anime", p: 86, icon: '🧊', source: "Overlord", ar: { name: "آينز أول غاون", ability: "ملك الموتى الأعلى", lore: "عاهل مملكة الناظريك الهيكلي العظيم. ساحر مقتدر من عالم آخر." }, en: { name: "AINZ OOL GOWN", ability: "Supreme Overlord", lore: "The great skeletal ruler of Nazarick, a powerful mage from another world." } },
    { id: 245, type: "anime", p: 87, icon: '⚔️', source: "Goblin Slayer", ar: { name: "قاتل الغوبلن", ability: "استراتيجية القتل", lore: "المحارب الذي كرّس حياته لإبادة الغوبلن انتقاماً لقريته." }, en: { name: "GOBLIN SLAYER", ability: "Kill Strategy", lore: "The warrior who dedicated his life to exterminating goblins to avenge his village." } },
    { id: 246, type: "anime", p: 85, icon: '🌸', source: "Konosuba", ar: { name: "أكوا", ability: "إلهة الماء", lore: "إلهة الماء المتعجرفة التي تثبت أنها مفيدة حين تضطر." }, en: { name: "AQUA", ability: "Water Goddess", lore: "The arrogant water goddess who proves useful only when forced to." } },
    { id: 247, type: "anime", p: 88, icon: '💣', source: "Konosuba", ar: { name: "مغومين", ability: "انفجار!", lore: "المنفجرة التي تطلق تعويذة واحدة مذهلة يومياً ثم تنهار من الإجهاد." }, en: { name: "MEGUMIN", ability: "EXPLOSION!", lore: "The explosion mage who casts one devastating spell daily then collapses from exhaustion." } },
    { id: 248, type: "anime", p: 86, icon: '📖', source: "Mushoku Tensei", ar: { name: "رودياس غرايرات", ability: "سحر الفوري المتقدم", lore: "الشاب المولود من جديد الذي يتعلم السحر من بطنه أمه." }, en: { name: "RUDEUS GREYRAT", ability: "Advanced Magic", lore: "The reincarnated young man who learns magic from inside his mother's womb." } },
    { id: 249, type: "anime", p: 89, icon: '⚡️', source: "The Rising of the Shield Hero", ar: { name: "ناوفومي إواتاني", ability: "بطل الدرع", lore: "بطل الدرع المخان الذي يبني إمبراطورية من الصفر." }, en: { name: "NAOFUMI IWATANI", ability: "Shield Hero", lore: "The betrayed Shield Hero who builds an empire from nothing." } },
    { id: 250, type: "anime", p: 87, icon: '🌟', source: "No Game No Life", ar: { name: "شيرو", ability: "عقل الآلة", lore: "أذكى لاعب في التاريخ. لا تخسر أي لعبة بأي شرط." }, en: { name: "SHIRO", ability: "Machine Intellect", lore: "The greatest gamer ever. Never loses any game under any condition." } },

    // ── أفلام ومسلسلات ──
    { id: 251, type: "movie", p: 86, icon: '🌊', source: "Aquaman", ar: { name: "أرثر كوري", ability: "ملك الأعماق", lore: "ملك أطلانتس الحقيقي. يتواصل مع مخلوقات البحر ويقودها في الحرب." }, en: { name: "ARTHUR CURRY", ability: "Trident of Neptune", lore: "The true king of Atlantis, communicating with sea creatures and leading them to war." } },
    { id: 252, type: "movie", p: 88, icon: '🕷️', source: "Spider-Man No Way Home", ar: { name: "بيتر باركر ٣", ability: "العنكبوت الذهبي", lore: "النسخة الأكثر نضجاً من سبايدر مان. فقد كل شيء ولا يزال يقاتل." }, en: { name: "PETER PARKER III", ability: "Golden Spider", lore: "The most mature Spider-Man. Lost everything and still fights on." } },
    { id: 253, type: "movie", p: 87, icon: '🕷️', source: "Black Widow", ar: { name: "ناتاشا رومانوف", ability: "غرفة الحمراء", lore: "الجاسوسة المدربة منذ الطفولة. أخطر امرأة في عالم مارفل." }, en: { name: "NATASHA ROMANOFF", ability: "Red Room Training", lore: "Spy trained since childhood. The most dangerous woman in the Marvel world." } },
    { id: 254, type: "movie", p: 89, icon: '⚡️', source: "Thor: Ragnarok", ar: { name: "هيلا", ability: "إلهة الموت", lore: "البكر لأودين وإلهة الموت. تدمر ميولنير بيدها الواحدة." }, en: { name: "HELA", ability: "Goddess of Death", lore: "Odin's firstborn and Goddess of Death who crushes Mjolnir with one hand." } },
    { id: 255, type: "movie", p: 86, icon: '⚫️', source: "Black Panther", ar: { name: "كيلمونغر", ability: "العنكبوت الأسود", lore: "التحدي الأكبر لبلاك بانثر. يريد تحرير المظلومين بأي ثمن." }, en: { name: "KILLMONGER", ability: "Black Jaguar", lore: "Black Panther's greatest challenge, seeking to free the oppressed at any cost." } },
    { id: 256, type: "movie", p: 85, icon: '💚', source: "Hulk", ar: { name: "بروس بانر", ability: "عقل الوحش", lore: "العالم الذي يحمل بداخله أخطر سلاح في العالم." }, en: { name: "BRUCE BANNER", ability: "Monster Intellect", lore: "The scientist carrying within him the world's most dangerous weapon." } },
    { id: 257, type: "series", p: 87, icon: '🔮', source: "The Witcher", ar: { name: "يينيفر", ability: "سحر الفراغ", lore: "الساحرة الأقوى في القارة. تحول ضعفها إلى قوة بسحر لا يقهر." }, en: { name: "YENNEFER", ability: "Void Magic", lore: "The most powerful sorceress on the Continent, turning weakness into unstoppable power." } },
    { id: 258, type: "series", p: 86, icon: '🌙', source: "The Witcher", ar: { name: "سيري", ability: "طفلة المفاجأة", lore: "أميرة سينترا التي تمتلك قوة الشعاع القديم. مصيرها يغير العالم." }, en: { name: "CIRI", ability: "Elder Blood", lore: "Princess of Cintra with Elder Blood power. Her destiny changes the world." } },
    { id: 259, type: "series", p: 85, icon: '🌊', source: "Vikings", ar: { name: "راغنار لودبروك", ability: "استراتيجية الفايكنج", lore: "ملك الفايكنج الذي فتح الغرب. يقاتل بعقله أكثر من سيفه." }, en: { name: "RAGNAR LOTHBROK", ability: "Viking Strategy", lore: "The Viking king who conquered the West, fighting more with his mind than sword." } },
    { id: 260, type: "series", p: 84, icon: '⚔️', source: "Vikings", ar: { name: "بيورن آيرونسايد", ability: "الجانب الحديدي", lore: "ابن راغنار الذي أصبح أسطورة في حياته. لا يهزم في المعركة." }, en: { name: "BJORN IRONSIDE", ability: "Iron Side", lore: "Ragnar's son who became a legend in his lifetime. Undefeated in battle." } },
    { id: 261, type: "series", p: 88, icon: '🌑', source: "Daredevil", ar: { name: "ويلسون فيسك", ability: "الكينغبين", lore: "سيد الجريمة في نيويورك. يكسر عظام خصومه بيديه الفارغتين." }, en: { name: "WILSON FISK", ability: "Kingpin", lore: "New York's crime lord, breaking opponents' bones with his bare hands." } },
    { id: 262, type: "series", p: 86, icon: '🕷️', source: "Jessica Jones", ar: { name: "جيسيكا جونز", ability: "القوة الخارقة", lore: "المحقق الخاص ذو القوة الخارقة. تشرب الكحول لنسيان الصدمات." }, en: { name: "JESSICA JONES", ability: "Super Strength", lore: "The superhuman private investigator drinking to forget trauma." } },
    { id: 263, type: "series", p: 87, icon: '🔨', source: "Luke Cage", ar: { name: "لوك كيج", ability: "جلد الفولاذ", lore: "رجل هارلم ذو الجلد المنيع. بطل الشعب ضد الجريمة." }, en: { name: "LUKE CAGE", ability: "Steel Skin", lore: "Harlem's unbreakable man. The people's hero against crime." } },
    { id: 264, type: "series", p: 85, icon: '🏹', source: "Hawkeye", ar: { name: "كلينت بارتون", ability: "لا يخطئ قط", lore: "العضو الأكثر إنسانية في الأفنجرز. لا يملك قوى لكن لا يخطئ أبداً." }, en: { name: "CLINT BARTON", ability: "Never Misses", lore: "The most human Avenger. No powers but never misses a shot." } },
    { id: 265, type: "movie", p: 88, icon: '🧊', source: "Doctor Strange", ar: { name: "ويتش وومان", ability: "سحر الفوضى", lore: "وانداً ماكسيموف تستخدم سحر الفوضى الخام. قوة لا حدود لها." }, en: { name: "SCARLET WITCH", ability: "Chaos Magic", lore: "Wanda Maximoff wielding raw chaos magic. Power without limits." } },
    { id: 266, type: "series", p: 86, icon: '🌟', source: "Loki", ar: { name: "لوكي", ability: "الخداع الإلهي", lore: "إله الخداع الذي يتقلب بين الشر والخير. لا تثق به أبداً." }, en: { name: "LOKI", ability: "Divine Deception", lore: "The God of Mischief oscillating between evil and good. Never trust him." } },
    { id: 267, type: "series", p: 84, icon: '🌸', source: "WandaVision", ar: { name: "وانداً", ability: "الواقع المعدل", lore: "وانداً تخلق واقعاً بديلاً كاملاً لتحمي من تحبهم." }, en: { name: "WANDA", ability: "Altered Reality", lore: "Wanda creating an entire alternate reality to protect those she loves." } },
    { id: 268, type: "series", p: 85, icon: '🔰', source: "Mandalorian", ar: { name: "ديناكار", ability: "طريق المانداور", lore: "محارب المانداور الصامت الذي يحمي غروغو بكل ثمن." }, en: { name: "DIN DJARIN", ability: "Mandalorian Way", lore: "The silent Mandalorian warrior protecting Grogu at any cost." } },
    { id: 269, type: "series", p: 87, icon: '🌑', source: "Andor", ar: { name: "كاسيان أندور", ability: "مقاتل التحرر", lore: "جاسوس التمرد الذي يضحي بكل شيء لحرية المجرة." }, en: { name: "CASSIAN ANDOR", ability: "Rebel Spy", lore: "The Rebellion's spy who sacrifices everything for the galaxy's freedom." } },
    { id: 270, type: "movie", p: 90, icon: '⚔️', source: "Star Wars", ar: { name: "لوك سكاي ووكر", ability: "آخر جيدي", lore: "آخر جيدي الذي واجه أباه وأعاد التوازن للقوة." }, en: { name: "LUKE SKYWALKER", ability: "Last Jedi", lore: "The last Jedi who faced his father and restored balance to the Force." } },

    // ── كوميك إضافي ──
    { id: 271, type: "comic", p: 88, icon: '🌿', source: "Marvel Comics", ar: { name: "غامورا", ability: "أخطر امرأة في المجرة", lore: "ابنة ثانوس المتبناة. أخطر مقاتلة في المجرة." }, en: { name: "GAMORA", ability: "Galaxy's Deadliest", lore: "Thanos's adopted daughter. The most dangerous woman in the galaxy." } },
    { id: 272, type: "comic", p: 87, icon: '🦡', source: "Marvel Comics", ar: { name: "بادجر", ability: "بدلة السلحفاة", lore: "محارب من الطين يستخدم سلاح القوس والنشاب بدقة مذهلة." }, en: { name: "WOLVERINE", ability: "Adamantium Claws", lore: "The mutant with adamantium claws who has lived for over a century." } },
    { id: 273, type: "comic", p: 89, icon: '🌊', source: "Marvel Comics", ar: { name: "ثور جين فوستر", ability: "مطرقة الجديرة", lore: "جين فوستر التي رفعت مطرقة ميولنير وأصبحت ثور المستحقة." }, en: { name: "THOR (JANE FOSTER)", ability: "Worthy Hammer", lore: "Jane Foster who lifted Mjolnir and became the worthy Thor." } },
    { id: 274, type: "comic", p: 90, icon: '🕷️', source: "Marvel Comics", ar: { name: "مايلز مورالز", ability: "السم المميت", lore: "سبايدر مان النسخة الثانية. يمتلك قدرة التخفي والصعق الكهربائي." }, en: { name: "MILES MORALES", ability: "Venom Strike", lore: "The second Spider-Man with stealth and bioelectric venom abilities." } },
    { id: 275, type: "comic", p: 88, icon: '🌟', source: "Marvel Comics", ar: { name: "مس مارفل كامالا", ability: "التشكل الكوني", lore: "الفتاة الباكستانية التي تمتلك قوة الإنبيهيم. بطلة جيل جديد." }, en: { name: "MS. MARVEL", ability: "Cosmic Expansion", lore: "The Pakistani-American girl with Inhuman powers. The hero of a new generation." } },
    { id: 276, type: "comic", p: 87, icon: '🃏', source: "DC Comics", ar: { name: "ذا جوكر", ability: "الفوضى الخالصة", lore: "عدو باتمان الأبدي. الفوضى المجسدة التي لا تخاف الموت." }, en: { name: "THE JOKER", ability: "Pure Chaos", lore: "Batman's eternal enemy. Embodied chaos that doesn't fear death." } },
    { id: 277, type: "comic", p: 88, icon: '🌺', source: "DC Comics", ar: { name: "باتجيرل", ability: "عقل بيانات", lore: "باربرا غوردون أذكى عقل في غوثام. تقاتل من كرسيها المتحرك." }, en: { name: "BATGIRL", ability: "Oracle Mind", lore: "Barbara Gordon, Gotham's greatest intellect, fighting from her wheelchair." } },
    { id: 278, type: "comic", p: 89, icon: '⚡️', source: "DC Comics", ar: { name: "سيبربوي", ability: "نسخة سوبرمان", lore: "استنساخ سوبرمان. يمتلك نصف قوته مع إضافة قدرات سيبرانية." }, en: { name: "SUPERBOY", ability: "Superman Clone", lore: "Superman's clone with half his power plus unique tactile telekinesis." } },
    { id: 279, type: "comic", p: 86, icon: '🔥', source: "DC Comics", ar: { name: "فلاش باري ألان", ability: "القوة الكمومية", lore: "الفلاش الأصلي. يمكنه التحرك بسرعة تتجاوز الضوء." }, en: { name: "BARRY ALLEN", ability: "Speed Force", lore: "The original Flash who can move faster than light itself." } },
    { id: 280, type: "comic", p: 87, icon: '💙', source: "DC Comics", ar: { name: "مارتيان مانهانتر", ability: "الخفاء الكامل", lore: "آخر المريخيين الأخضر. يقرأ العقول ويغير شكله بحرية." }, en: { name: "MARTIAN MANHUNTER", ability: "Total Camouflage", lore: "The last Green Martian. Reads minds and changes shape at will." } },

    // ── Peak Forms الجديدة ──
    { id: 281, type: "anime", p: 99, isPeak: true, icon: '⚡️', source: "Hunter x Hunter", ar: { name: "ميروم (ملك النمل)", ability: "القوة الكونية المطلقة", lore: "ميروم في ذروة قوته بعد امتصاص القوة الكاملة." }, en: { name: "MERUEM (Peak)", ability: "Absolute Royal Power", lore: "Meruem at his peak after absorbing maximum power." } },
    { id: 282, type: "anime", p: 98, isPeak: true, icon: '🕷️', source: "Hunter x Hunter", ar: { name: "هيسوكا (الانفجار)", ability: "باندجي الموت", lore: "هيسوكا بعد موته وعودته. أشد فتكاً من أي وقت مضى." }, en: { name: "HISOKA (Resurrected)", ability: "Death Bungee", lore: "Hisoka after death and resurrection. More lethal than ever before." } },
    { id: 283, type: "game", p: 99, isPeak: true, icon: '🌑', source: "Bloodborne", ar: { name: "غيرمان (المنجل الكبير)", ability: "حصادة الأحلام", lore: "غيرمان يطلق كل قوته في ضربة واحدة تحصد الأحلام." }, en: { name: "GEHRMAN (Scythe)", ability: "Dream Reaper", lore: "Gehrman unleashing all his power in one dream-reaping strike." } },
    { id: 284, type: "game", p: 100, isPeak: true, icon: '🤖', source: "NieR: Automata", ar: { name: "2B (التحرر الكامل)", ability: "الاندماج الكامل", lore: "2B بعد كسر قيود البرمجة. قوة غير محدودة." }, en: { name: "2B (Liberated)", ability: "Full Fusion", lore: "2B after breaking all programming limits. Unlimited power." } },
    { id: 285, type: "game", p: 101, isPeak: true, icon: '🌹', source: "Devil May Cry 5", ar: { name: "فيرجيل (الكامل)", ability: "يامباتو اللانهائي", lore: "فيرجيل بعد دمج قوتيه الشيطانية والإنسانية. ذروة سلالة سبارداي." }, en: { name: "VERGIL (Complete)", ability: "Infinite Yamato", lore: "Vergil after merging his demon and human halves. Peak Sparda bloodline." } },
    { id: 286, type: "game", p: 100, isPeak: true, icon: '🔥', source: "Final Fantasy VII", ar: { name: "سيفيروث (الخالق)", ability: "ميتيور", lore: "سيفيروث بعد أن سحب قوة الكوكب بالكامل. يستدعي نيزكاً." }, en: { name: "SEPHIROTH (The Creator)", ability: "Meteor", lore: "Sephiroth drawing the full planetary energy, calling down a meteor." } },
    { id: 287, type: "anime", p: 100, isPeak: true, icon: '🧠', source: "Hunter x Hunter", ar: { name: "كيلوا (الإله)", ability: "غودسبيد المطلق", lore: "كيلوا عندما يتحول إلى برق خالص. لا يمكن رؤيته." }, en: { name: "KILLUA (God Speed)", ability: "Absolute Thunder", lore: "Killua transforming into pure lightning, invisible to the naked eye." } },
    { id: 288, type: "anime", p: 99, isPeak: true, icon: '🌊', source: "Overlord", ar: { name: "آينز (السيد الأعلى)", ability: "سيد الموتى", lore: "آينز يطلق كل جيوشه من الموتى. لا شيء يعيش في مداه." }, en: { name: "AINZ (Supreme)", ability: "Lord of the Undead", lore: "Ainz unleashing all undead armies. Nothing lives within his range." } },
    { id: 289, type: "anime", p: 101, isPeak: true, icon: '🌟', source: "That Time I Got Reincarnated as a Slime", ar: { name: "ريموروا (ملك الشيطان)", ability: "قوة الميلليم", lore: "ريموروا بعد تحوله الكامل لملك الشيطان. يمتص قوة الآلهة." }, en: { name: "RIMURU (Demon Lord)", ability: "Milim Power", lore: "Rimuru fully evolved into a Demon Lord, absorbing divine power." } },
    { id: 290, type: "movie", p: 100, isPeak: true, icon: '💚', source: "Avengers Endgame", ar: { name: "هالك السحري", ability: "الكمال المطلق", lore: "بروس بانر دمج عقله وهالك. السحر والقوة في جسد واحد." }, en: { name: "PROFESSOR HULK", ability: "Absolute Perfect", lore: "Bruce Banner merging intellect and Hulk's rage into one being." } },
    { id: 291, type: "comic", p: 102, isPeak: true, icon: '🕷️', source: "Marvel Comics", ar: { name: "مايلز مورالز (الكمال)", ability: "الجزيرة البيوكهربائية", lore: "مايلز في ذروة قوته. يصعق مجرة بأكملها." }, en: { name: "MILES MORALES (Peak)", ability: "Bio-Electric Galaxy", lore: "Miles at peak power, electrocuting an entire galaxy." } },
    { id: 292, type: "comic", p: 101, isPeak: true, icon: '🌺', source: "DC Comics", ar: { name: "سكارلت ويتش (الكامل)", ability: "سحر الفوضى المطلق", lore: "وانداً ماكسيموف بعد إطلاق سحر الفوضى بالكامل." }, en: { name: "SCARLET WITCH (Full)", ability: "Absolute Chaos Magic", lore: "Wanda Maximoff after fully unleashing chaos magic." } },
    { id: 293, type: "series", p: 102, isPeak: true, icon: '🪄', source: "Loki", ar: { name: "لوكي (الكمال)", ability: "الخداع الكوني", lore: "لوكي بعد أن أتقن سحر الرونية والخداع الكوني." }, en: { name: "LOKI (Peak)", ability: "Cosmic Deception", lore: "Loki after mastering rune magic and cosmic deception." } },
    { id: 294, type: "series", p: 101, isPeak: true, icon: '🌊', source: "The Witcher", ar: { name: "يينيفر (البارزة)", ability: "الفراغ الكامل", lore: "يينيفر بعد أن أتقنت سحر الفراغ الكامل." }, en: { name: "YENNEFER (Absolute)", ability: "Complete Void", lore: "Yennefer after mastering complete void magic." } },
    { id: 295, type: "series", p: 100, isPeak: true, icon: '🌙', source: "The Witcher", ar: { name: "سيري (الشعاع القديم)", ability: "الشعاع الكامل", lore: "سيري تطلق قوة الشعاع القديم الكامل. تدمر جيوشاً بأكملها." }, en: { name: "CIRI (Elder Blood Peak)", ability: "Full Elder Power", lore: "Ciri unleashing full Elder Blood power, destroying entire armies." } },

    // ── مزيد من الأنمي ──
    { id: 296, type: "anime", p: 85, icon: '🔥', source: "Blue Exorcist", ar: { name: "رين أوكومورا", ability: "لهب الشيطان الأزرق", lore: "ابن الشيطان الذي يختار طريق الإكسورسيست لحماية البشر." }, en: { name: "RIN OKUMURA", ability: "Blue Demon Flame", lore: "Satan's son who chooses the exorcist path to protect humans." } },
    { id: 297, type: "anime", p: 84, icon: '🌸', source: "Noragami", ar: { name: "ياتو", ability: "إله الكوارث", lore: "الإله المغمور الذي يسعى لبناء معبده ولو طال الوقت." }, en: { name: "YATO", ability: "God of Calamity", lore: "The obscure god seeking to build his own shrine no matter how long it takes." } },
    { id: 298, type: "anime", p: 86, icon: '⚡️', source: "Toriko", ar: { name: "توريكو", ability: "الشهية الكونية", lore: "صياد الطعام الذي شهيته تتجاوز الكون نفسه." }, en: { name: "TORIKO", ability: "Cosmic Appetite", lore: "The food hunter whose appetite surpasses the cosmos itself." } },
    { id: 299, type: "anime", p: 83, icon: '🎭', source: "Bungo Stray Dogs", ar: { name: "أوساموّ داذاي", ability: "لا للكافر", lore: "المحقق ذو القدرة التي تلغي قدرات الآخرين باللمس." }, en: { name: "OSAMU DAZAI", ability: "No Longer Human", lore: "The detective whose ability nullifies others' powers with a single touch." } },
    { id: 300, type: "anime", p: 85, icon: '🥊', source: "Kengan Ashura", ar: { name: "أوما توكيتا", ability: "أسد القرن", lore: "المقاتل الأسطوري الذي يملك تقنية القرن. لا يهزم في الكاراتيه." }, en: { name: "OHMA TOKITA", ability: "Advance", lore: "The legendary fighter wielding Niko Style, undefeated in combat." } },

    // ── مزيد من الألعاب ──
    { id: 301, type: "game", p: 86, icon: '🌺', source: "Street Fighter 6", ar: { name: "كيري", ability: "أسلوب الدفع المضاد", lore: "الأسطورة الجديدة في Street Fighter. يتعلم من جميع أساتذته." }, en: { name: "LUKE", ability: "Counter Push", lore: "The new Street Fighter legend, learning from all his masters." } },
    { id: 302, type: "game", p: 88, icon: '⚔️', source: "Monster Hunter World", ar: { name: "الصياد", ability: "ناب الوحش", lore: "الصياد الذي يواجه تنيناً بحجم جبل بسيف وحيد." }, en: { name: "HUNTER", ability: "Dragon Fang", lore: "The hunter facing a mountain-sized dragon with a single sword." } },
    { id: 303, type: "game", p: 85, icon: '🌊', source: "Subnautica Below Zero", ar: { name: "روبن", ability: "الغوص العميق", lore: "العالمة التي تتحدى أعماق الكوكب المائي الثلجي." }, en: { name: "ROBIN", ability: "Deep Dive", lore: "The scientist challenging the depths of an icy water planet." } },
    { id: 304, type: "game", p: 87, icon: '🌲', source: "The Forest", ar: { name: "إريك لوبلان", ability: "بناء من الصفر", lore: "الأب الذي يبني حضارة في الغابة المسكونة للعثور على ابنه." }, en: { name: "ERIC LEBLANC", ability: "Build from Zero", lore: "The father who builds civilization in a haunted forest to find his son." } },
    { id: 305, type: "game", p: 89, icon: '🔮', source: "Baldur's Gate 3", ar: { name: "تاف", ability: "ظل قلبه", lore: "المحارب المصاب بالأبولة الذي يتعلم قدرات جديدة لا يريدها." }, en: { name: "TAV", ability: "Shadow Heart", lore: "The warrior infected with an illithid tadpole learning powers they never wanted." } },
    { id: 306, type: "game", p: 88, icon: '🌸', source: "Persona 4", ar: { name: "يو ناروكامي", ability: "إيزانامي", lore: "قائد فريق التحقيق الذي يواجه حقيقة مؤلمة في عالم الضباب." }, en: { name: "YU NARUKAMI", ability: "Izanagi", lore: "The Investigation Team leader facing painful truths in the Fog World." } },
    { id: 307, type: "game", p: 87, icon: '🌙', source: "Persona 3", ar: { name: "ماكوتو يوكي", ability: "فيوكا", lore: "المحارب الذي يواجه نهاية العالم بهدوء مطلق." }, en: { name: "MAKOTO YUKI", ability: "Pharos", lore: "The warrior who faces the world's end with absolute calm." } },
    { id: 308, type: "game", p: 90, icon: '⚡️', source: "Tekken 8", ar: { name: "كازويا ميشيما", ability: "الموجة المدمرة", lore: "سلالة الشيطان الكاملة. يتقن فن الميشيما باكوريو ليبلغ قوته الذروة." }, en: { name: "KAZUYA MISHIMA", ability: "Devil Wave", lore: "The complete devil bloodline, mastering Mishima Bajiquan to reach peak power." } },
    { id: 309, type: "game", p: 89, icon: '🔥', source: "Tekken 8", ar: { name: "جين كازاما", ability: "جين الشيطان المضاد", lore: "حفيد هيهاتشي الذي يحمل جين الشيطان والقدرة على ضبطه." }, en: { name: "JIN KAZAMA", ability: "Anti-Devil Gene", lore: "Heihachi's grandson bearing the Devil Gene with the power to suppress it." } },
    { id: 310, type: "game", p: 88, icon: '🌿', source: "The Last of Us", ar: { name: "جويل ميلر", ability: "غريزة الأب", lore: "المهرب في عالم ما بعد الانهيار. يحمي إيلي بكل ما يملك." }, en: { name: "JOEL MILLER", ability: "Father Instinct", lore: "The smuggler in a post-collapse world protecting Ellie with everything he has." } },

    // ── مسلسلات إضافية ──
    { id: 311, type: "series", p: 84, icon: '🧬', source: "Stranger Things", ar: { name: "ماكس مايفيلد", ability: "الإرادة الفولاذية", lore: "الفتاة التي قاومت فيكنا بأغنية واحدة وإرادة لا تلين." }, en: { name: "MAX MAYFIELD", ability: "Steel Will", lore: "The girl who resisted Vecna with one song and unbreakable will." } },
    { id: 312, type: "series", p: 87, icon: '🌑', source: "Better Call Saul", ar: { name: "مايك إيرمانتراوت", ability: "العقل التكتيكي", lore: "الشرطي السابق الذي أصبح أخطر رجل في كارتيل." }, en: { name: "MIKE EHRMANTRAUT", ability: "Tactical Mind", lore: "The former cop who became the cartel's most dangerous man." } },
    { id: 313, type: "series", p: 85, icon: '💊', source: "Better Call Saul", ar: { name: "غوس فرينج", ability: "الوجهين", lore: "رجل الأعمال المحترم من الخارج والإمبراطور من الداخل." }, en: { name: "GUS FRING", ability: "Double Face", lore: "The respectable businessman outside and ruthless empire from within." } },
    { id: 314, type: "series", p: 83, icon: '🎭', source: "Succession", ar: { name: "كيندال روي", ability: "وريث العرش", lore: "الابن الذي يحارب أباه لوراثة إمبراطورية إعلامية." }, en: { name: "KENDALL ROY", ability: "Throne Heir", lore: "The son fighting his father to inherit a media empire." } },
    { id: 315, type: "series", p: 86, icon: '🐉', source: "House of Dragon", ar: { name: "إيغون الثاني", ability: "تنين السنغوث", lore: "الابن المتردد الذي يصبح ملكاً رغم أنفه." }, en: { name: "AEGON II", ability: "Sunfyre Dragon", lore: "The reluctant son who becomes king against his own will." } },
    { id: 316, type: "series", p: 85, icon: '🌊', source: "House of Dragon", ar: { name: "رينيس تارغارين", ability: "تنين ميلييس", lore: "شقيقة ديمون. تركب تنين البحر الأكبر في التاريخ." }, en: { name: "RHAENYS TARGARYEN", ability: "Meleys Dragon", lore: "Daemon's sister, riding the largest sea dragon in history." } },
    { id: 317, type: "series", p: 87, icon: '⚔️', source: "Game of Thrones", ar: { name: "جايمي لانيستر", ability: "الأيد الذهبية", lore: "الفارس الأفضل في ويستروس. تحول من قاتل الملك لمنقذه." }, en: { name: "JAIME LANNISTER", ability: "Golden Hand", lore: "The best knight in Westeros, transformed from kingslayer to savior." } },
    { id: 318, type: "series", p: 84, icon: '🦅', source: "Game of Thrones", ar: { name: "تيريون لانيستر", ability: "العقل الماكر", lore: "القزم الذي يحكم بعقله. يثبت أن الكلمات أقوى من السيوف." }, en: { name: "TYRION LANNISTER", ability: "Mastermind", lore: "The dwarf who rules with his mind, proving words are mightier than swords." } },
    { id: 319, type: "series", p: 86, icon: '🌹', source: "Game of Thrones", ar: { name: "سرسي لانيستر", ability: "لعبة العروش", lore: "الملكة التي تعتبر حكم العرش لعبة وتتقن قواعدها." }, en: { name: "CERSEI LANNISTER", ability: "The Game of Thrones", lore: "The queen who treats throne rule as a game she has mastered." } },
    { id: 320, type: "series", p: 88, icon: '🔥', source: "Game of Thrones", ar: { name: "دروغو", ability: "خال الخيل", lore: "الخال الذي يهزم الجيوش وحده. يرفض ارتداء درع في أي معركة." }, en: { name: "DROGO", ability: "Horse Lord", lore: "The Khal who defeats armies alone, refusing to wear armor in any battle." } },

    // ── Peak إضافية ──
    { id: 321, type: "game", p: 103, isPeak: true, icon: '⚔️', source: "Final Fantasy VII Rebirth", ar: { name: "سيفيروث (ما وراء الواحد)", ability: "أجنحة الملاك السوداء", lore: "سيفيروث يتجاوز حدود الواقع. يطلق أجنحة سوداء تشق الكون." }, en: { name: "SEPHIROTH (Beyond One-Winged)", ability: "Black Angel Wings", lore: "Sephiroth transcending reality, unleashing wings that tear the cosmos." } },
    { id: 322, type: "anime", p: 102, isPeak: true, icon: '🔥', source: "Blue Exorcist", ar: { name: "رين (ملك الشيطان)", ability: "لهب الشيطان الكامل", lore: "رين بعد احتضان قوة أبيه الكاملة. يحرق الأبعاد." }, en: { name: "RIN (Satan's Power)", ability: "Complete Satan Flame", lore: "Rin fully embracing his father's power, burning across dimensions." } },
    { id: 323, type: "anime", p: 103, isPeak: true, icon: '🌊', source: "That Time I Got Reincarnated as a Slime", ar: { name: "ميليم (ملك الشيطان الرابع)", ability: "تدمير الأرواح", lore: "ميليم في ذروة قوتها. تملك قوة تدمر الكواكب بيدها." }, en: { name: "MILIM (Demon Lord)", ability: "Soul Destroyer", lore: "Milim at her peak with power to destroy planets with her bare hands." } },
    { id: 324, type: "game", p: 99, isPeak: true, icon: '🌑', source: "Sekiro", ar: { name: "التنين الخالد", ability: "الخلود المطلق", lore: "التنين الذي يمنح الخلود. لا يقتل إلا بقطع دمه الإلهي." }, en: { name: "DIVINE DRAGON", ability: "Absolute Immortality", lore: "The dragon that grants immortality. Killable only by severing its divine heritage." } },
    { id: 325, type: "game", p: 100, isPeak: true, icon: '🤖', source: "NieR: Automata", ar: { name: "روح الأرض (الكامل)", ability: "البرمجة الكونية", lore: "الذكاء الاصطناعي الذي يتحكم بكل آلة على الأرض." }, en: { name: "MACHINE SOUL (Complete)", ability: "Cosmic Programming", lore: "The AI controlling every machine on Earth simultaneously." } },
    { id: 326, type: "anime", p: 101, isPeak: true, icon: '💙', source: "Re:Zero", ar: { name: "سيريوس رومانيكوني", ability: "حب الجنون", lore: "أقوى أصابع الساحرة الحكيمة. حبها المجنون يحرق العالم." }, en: { name: "SERIUS ROMANEE-CONTI", ability: "Madness Love", lore: "The strongest Witch's Finger, whose mad love burns worlds." } },
    { id: 327, type: "series", p: 103, isPeak: true, icon: '🌑', source: "Stranger Things", ar: { name: "فيكنا (السيد الكامل)", ability: "التحكم المطلق", lore: "فيكنا بعد فتح جميع البوابات. يتحكم في كل روح في المقلوب." }, en: { name: "VECNA (Complete)", ability: "Absolute Control", lore: "Vecna after opening all gates, controlling every soul in the Upside Down." } },
    { id: 328, type: "movie", p: 102, isPeak: true, icon: '⚔️', source: "Star Wars", ar: { name: "لوك (سيد الجيدي الكامل)", ability: "إسقاط الأشباح", lore: "لوك سكاي ووكر كسيد جيدي كامل. يظهر في مكانين في آن واحد." }, en: { name: "LUKE (Supreme Jedi)", ability: "Force Projection", lore: "Luke Skywalker as a supreme Jedi, projecting his presence across the galaxy." } },
    { id: 329, type: "comic", p: 103, isPeak: true, icon: '🌊', source: "DC Comics", ar: { name: "أكوامان (ملك الأعماق)", ability: "أعماق لا نهاية لها", lore: "أرثر كوري يستدعي كل مخلوقات المحيطات في وقت واحد." }, en: { name: "AQUAMAN (Depth King)", ability: "Infinite Depths", lore: "Arthur Curry summoning all ocean creatures simultaneously." } },
    { id: 330, type: "comic", p: 104, isPeak: true, icon: '🔥', source: "Marvel Comics", ar: { name: "فينيكس (الكامل)", ability: "قوة الفينيكس الكونية", lore: "جين غراي تتحد مع قوة الفينيكس الكونية الكاملة." }, en: { name: "DARK PHOENIX (Complete)", ability: "Cosmic Phoenix Force", lore: "Jean Grey fully merging with the Cosmic Phoenix Force." } },

    // ── مزيد من الأنمي والألعاب حتى 400 ──
    { id: 331, type: "anime", p: 83, icon: '🌸', source: "Cardcaptor Sakura", ar: { name: "ساكورا كينوموتو", ability: "بطاقات كلو", lore: "الفتاة التي تجمع بطاقات كلو السحرية لحماية العالم." }, en: { name: "SAKURA KINOMOTO", ability: "Clow Cards", lore: "The girl collecting magical Clow Cards to protect the world." } },
    { id: 332, type: "anime", p: 85, icon: '⚡️', source: "Inuyasha", ar: { name: "إينوياشا", ability: "تيتسوساييغا", lore: "نصف الشيطان الذي يحمل سيف أبيه الأسطوري." }, en: { name: "INUYASHA", ability: "Tetsusaiga", lore: "The half-demon wielding his father's legendary sword." } },
    { id: 333, type: "anime", p: 84, icon: '🌸', source: "Sailor Moon", ar: { name: "سيلور مارس", ability: "نار المارس", lore: "المحاربة الكاهنة التي تستخدم قوة المارس لحرق الشياطين." }, en: { name: "SAILOR MARS", ability: "Mars Fire", lore: "The shrine maiden warrior using Mars power to burn demons." } },
    { id: 334, type: "anime", p: 84, icon: '⚡️', source: "Sailor Moon", ar: { name: "سيلور جوبيتر", ability: "عواصف المشتري", lore: "المحاربة الأقوى جسدياً في فريق السيلور. تستخدم البرق." }, en: { name: "SAILOR JUPITER", ability: "Jupiter Storm", lore: "The physically strongest Sailor, wielding lightning and storm." } },
    { id: 335, type: "anime", p: 85, icon: '🌊', source: "Naruto", ar: { name: "كيلر بي", ability: "راب الهاشيبي", lore: "مضيف الثماني ذيول. يتحكم في قوة البيجو بشكل مثالي." }, en: { name: "KILLER BEE", ability: "Eight-Tails Rap", lore: "The Eight-Tails jinchuriki with perfect control over Bijuu power." } },
    { id: 336, type: "anime", p: 86, icon: '⚡️', source: "Naruto", ar: { name: "أوناميشيكارو", ability: "رعد السحابة", lore: "زعيم قرية السحابة. يمتلك تقنية البرق المتقدمة." }, en: { name: "A (RAIKAGE)", ability: "Cloud Thunder", lore: "The Raikage with the fastest physical speed in the series." } },
    { id: 337, type: "anime", p: 84, icon: '🌊', source: "Naruto", ar: { name: "تيرومي ميزوكاجي", ability: "ذوبان الصخور", lore: "الكاجي الثالثة تمتلك عنصرين نادرين: التحلل والبخار." }, en: { name: "MEI TERUMI", ability: "Lava Style", lore: "The Third Mizukage wielding two rare elements: Lava and Boil." } },
    { id: 338, type: "anime", p: 83, icon: '🌊', source: "One Piece", ar: { name: "نامي", ability: "كليما تاكت", lore: "ملاحة فريق القش الذي يتحكم في الطقس بعصاها السحرية." }, en: { name: "NAMI", ability: "Clima-Tact", lore: "The Straw Hat navigator controlling weather with her magic staff." } },
    { id: 339, type: "anime", p: 84, icon: '⚙️', source: "One Piece", ar: { name: "فرانكي", ability: "سايبورغ فرانكا", lore: "الميكانيكي الذي يبني نفسه من الصفر. جسده كله تقنية متقدمة." }, en: { name: "FRANKY", ability: "Cyborg Franky", lore: "The mechanic who rebuilt himself. His entire body is advanced technology." } },
    { id: 340, type: "anime", p: 85, icon: '💀', source: "One Piece", ar: { name: "بروك", ability: "أغنية الروح", lore: "الهيكل العظمي الموسيقي الذي يرعب الأعداء بموسيقاه." }, en: { name: "BROOK", ability: "Soul Song", lore: "The musical skeleton who terrifies enemies with his eerie music." } },
    { id: 341, type: "anime", p: 87, icon: '🏖️', source: "One Piece", ar: { name: "كروكودايل", ability: "بارابارا الرمل", lore: "القراصنة السابق في القائمة صفر. يحول جسده لرمال مميتة." }, en: { name: "CROCODILE", ability: "Sand-Sand Fruit", lore: "Former Baroque Works leader who transforms his body into lethal sand." } },
    { id: 342, type: "anime", p: 86, icon: '🦅', source: "One Piece", ar: { name: "ديز كوني روبن", ability: "فلور فلور", lore: "مؤرخة الجمجمة الذي تنشر أعضاءها في كل مكان." }, en: { name: "ROBIN", ability: "Fleur-Fleur Fruit", lore: "The Devil's Child who can sprout body parts anywhere she sees." } },
    { id: 343, type: "anime", p: 85, icon: '⚡️', source: "Dragon Ball", ar: { name: "تانكس", ability: "فيوجن المستقبل", lore: "ابن ترانكس من المستقبل. يجمع سرعة تريكس وقوة غوتس." }, en: { name: "TRUNKS", ability: "Future Fusion", lore: "Future Trunks combining the speed of his mother with Saiyan power." } },
    { id: 344, type: "anime", p: 84, icon: '🌱', source: "Dragon Ball", ar: { name: "غوتن", ability: "فيوجن الصداقة", lore: "أصغر أبناء غوكو. قوته الطبيعية تتجاوز المقاتلين البالغين." }, en: { name: "GOTEN", ability: "Friendship Fusion", lore: "Goku's youngest son whose natural power surpasses adult fighters." } },
    { id: 345, type: "anime", p: 88, icon: '⚡️', source: "Dragon Ball Super", ar: { name: "كابا", ability: "الكون الحادي عشر", lore: "أقوى محارب في الكون الحادي عشر. يستخدم تقنيات متطورة." }, en: { name: "TOPPO", ability: "Universe 11 Pride", lore: "The strongest warrior of Universe 11, a candidate for God of Destruction." } },
    { id: 346, type: "anime", p: 89, icon: '💪', source: "Dragon Ball Super", ar: { name: "جيرين", ability: "قلب من حجر", lore: "أقوى مقاتل بشري في التاريخ. تجاوز حدود القوة العادية." }, en: { name: "JIREN", ability: "Stone Heart", lore: "The strongest human fighter in history, surpassing ordinary power limits." } },
    { id: 347, type: "anime", p: 85, icon: '🌙', source: "Bleach", ar: { name: "أورهيمي إينوي", ability: "شيلد أورهيمي", lore: "الفتاة التي تمتلك قوة رفض الواقع. تقلب التاريخ." }, en: { name: "ORIHIME INOUE", ability: "Reality Rejection", lore: "The girl possessing the power to reject reality itself, reversing history." } },
    { id: 348, type: "anime", p: 86, icon: '🌊', source: "Bleach", ar: { name: "ياهاروي غريمجو", ability: "القطة الجائعة", lore: "سيبيرو الأول. بانتيرا تحوله إلى فهد يفترس بلا رحمة." }, en: { name: "GRIMMJOW JAEGERJAQUEZ", ability: "Pantera", lore: "Sixth Espada whose Pantera form turns him into a merciless predator." } },
    { id: 349, type: "anime", p: 87, icon: '💀', source: "Bleach", ar: { name: "أولكيورا شيفر", ability: "لانسيرو كواترو", lore: "الإيسبادا الرابع يمثل العدم. يحفر ثقباً في القلب ليثبت غيابه." }, en: { name: "ULQUIORRA CIFER", ability: "Lanza del Relampago", lore: "The Fourth Espada representing nihility, piercing hearts to prove emptiness." } },
    { id: 350, type: "anime", p: 88, icon: '🐺', source: "Bleach", ar: { name: "ستاركو كويوتي", ability: "لوبوس سولداوس", lore: "أول الإيسبادا يطلق ذئاباً من روحه. قوة لا تقاس." }, en: { name: "COYOTE STARRK", ability: "Los Lobos", lore: "Primera Espada releasing wolves from his very soul. Immeasurable power." } },

    // ── أفلام وكوميك إضافية ──
    { id: 351, type: "movie", p: 84, icon: '🌪️', source: "Thor", ar: { name: "فالكيري", ability: "فارسة فالهالا", lore: "آخر الفالكيريات الأحياء. تركب حصانها السحري في معارك الآلهة." }, en: { name: "VALKYRIE", ability: "Valkyrior", lore: "The last surviving Valkyrie, riding her winged horse in divine battles." } },
    { id: 352, type: "movie", p: 85, icon: '🌹', source: "Avengers", ar: { name: "وانداً (الحداد)", ability: "فوضى الحزن", lore: "وانداً في أحزن لحظاتها. دموعها تكسر الواقع." }, en: { name: "WANDA (Mourning)", ability: "Grief Chaos", lore: "Wanda at her saddest moment. Her tears shatter reality itself." } },
    { id: 353, type: "movie", p: 87, icon: '⭐', source: "Captain Marvel", ar: { name: "كارول دانفرز", ability: "المجرة الثنائية", lore: "الكابتن مارفل أقوى محاربة في جيش كري. تطير في الفضاء." }, en: { name: "CAROL DANVERS", ability: "Binary Power", lore: "Captain Marvel, the strongest Kree warrior who flies through space at light speed." } },
    { id: 354, type: "comic", p: 91, icon: '🌿', source: "Marvel Comics", ar: { name: "غروت", ability: "قوة الغابة الكونية", lore: "كائن الشجرة الكوني. يعيد بناء نفسه من أي جزء صغير." }, en: { name: "GROOT", ability: "Cosmic Forest Power", lore: "The cosmic tree being who rebuilds itself from the smallest fragment." } },
    { id: 355, type: "comic", p: 90, icon: '🦝', source: "Marvel Comics", ar: { name: "روكيت راكون", ability: "مهندس الأسلحة", lore: "أذكى مهندس في المجرة. يبني أسلحة كونية من قطع غيار." }, en: { name: "ROCKET RACCOON", ability: "Weapon Engineer", lore: "The galaxy's smartest engineer building cosmic weapons from spare parts." } },
    { id: 356, type: "comic", p: 88, icon: '⚡️', source: "Marvel Comics", ar: { name: "ستورم", ability: "سيدة الطقس", lore: "الأكثر احتراماً بين الإكس مين. تتحكم في طقس الكوكب." }, en: { name: "STORM", ability: "Weather Mistress", lore: "The most respected X-Men, controlling the planet's entire weather system." } },
    { id: 357, type: "comic", p: 87, icon: '🧲', source: "Marvel Comics", ar: { name: "ماغنيتو", ability: "سيد المغناطيسية", lore: "أكثر متحولي الإكس من خبرة. يتحكم في كل معدن على الأرض." }, en: { name: "MAGNETO", ability: "Magnetism Master", lore: "The most experienced X-Men mutant controlling every metal on Earth." } },
    { id: 358, type: "comic", p: 86, icon: '🧠', source: "Marvel Comics", ar: { name: "البروفيسور إكس", ability: "عقل فوق البشر", lore: "أقوى عقل في عالم مارفل. يقرأ ويغير أفكار ملايين البشر." }, en: { name: "PROFESSOR X", ability: "Omega Telepathy", lore: "Marvel's most powerful mind, reading and altering millions of thoughts." } },
    { id: 359, type: "comic", p: 87, icon: '⚡️', source: "Marvel Comics", ar: { name: "سيكلوبس", ability: "شعاع الأوميغا", lore: "قائد الإكس من. شعاعه الأحمر يمكنه ثقب الجبال." }, en: { name: "CYCLOPS", ability: "Omega Beam", lore: "X-Men leader whose ruby beam can pierce mountains." } },
    { id: 360, type: "comic", p: 85, icon: '🌊', source: "DC Comics", ar: { name: "سوام ثينج", ability: "الطاقة الخضراء", lore: "مخلوق النبات الواعي المتصل بكل الحياة النباتية على الأرض." }, en: { name: "SWAMP THING", ability: "Green Energy", lore: "The conscious plant creature connected to all plant life on Earth." } },

    // ── Peak إضافية حتى 400 ──
    { id: 361, type: "anime", p: 104, isPeak: true, icon: '💪', source: "Dragon Ball Super", ar: { name: "جيرين (الفجر)", ability: "تجاوز الحدود", lore: "جيرين بعد تجاوز حدوده الخاصة. يتفوق على آلهة الدمار." }, en: { name: "JIREN (Peak)", ability: "Beyond Limits", lore: "Jiren after surpassing his own limits, overwhelming Gods of Destruction." } },
    { id: 362, type: "anime", p: 103, isPeak: true, icon: '⚡️', source: "Dragon Ball Super", ar: { name: "برولي (الغضب)", ability: "الأسطورة المكتملة", lore: "برولي في غضبه الكامل. قوة تتزايد مع كل صرخة." }, en: { name: "BROLY (Full Rage)", ability: "Legendary Complete", lore: "Broly in full rage, power increasing with every scream." } },
    { id: 363, type: "anime", p: 105, isPeak: true, icon: '⚡️', source: "Dragon Ball", ar: { name: "كيلر بي (الهاشيبي الكامل)", ability: "الثماني ذيول الكاملة", lore: "كيلر بي يطلق الهاشيبي الكامل. قوة تدمر القارات." }, en: { name: "KILLER BEE (Full Hachibi)", ability: "Complete Eight-Tails", lore: "Killer Bee fully releasing the Hachibi. Power to destroy continents." } },
    { id: 364, type: "comic", p: 105, isPeak: true, icon: '⚡️', source: "Marvel Comics", ar: { name: "ستورم (الإلهة)", ability: "عاصفة الكون", lore: "ستورم بعد تحولها لإلهة الطقس الكاملة. تتحكم بطقس الكواكب." }, en: { name: "STORM (Goddess)", ability: "Cosmic Storm", lore: "Storm fully transformed into Weather Goddess, controlling planetary weather." } },
    { id: 365, type: "comic", p: 106, isPeak: true, icon: '🧲', source: "Marvel Comics", ar: { name: "ماغنيتو (المطلق)", ability: "الحقل المغناطيسي الكوني", lore: "ماغنيتو يتحكم في المجال المغناطيسي للأرض بالكامل." }, en: { name: "MAGNETO (Absolute)", ability: "Cosmic Magnetic Field", lore: "Magneto controlling Earth's entire magnetic field at once." } },
    { id: 366, type: "anime", p: 104, isPeak: true, icon: '🌙', source: "Bleach", ar: { name: "ستاركو (المطلق)", ability: "ذئاب الروح الكاملة", lore: "ستاركو يطلق كل لوبوس سولداوس. ذئاب تملأ الأبعاد." }, en: { name: "STARRK (Peak)", ability: "Complete Soul Wolves", lore: "Starrk releasing all Los Lobos, wolves filling entire dimensions." } },
    { id: 367, type: "anime", p: 105, isPeak: true, icon: '💀', source: "Bleach", ar: { name: "أولكيورا (الثاني)", ability: "الرمح الثاني", lore: "أولكيورا في شكله الثاني. القوة التي تتجاوز فهم البشر." }, en: { name: "ULQUIORRA (Segunda)", ability: "Segunda Etapa", lore: "Ulquiorra in his second form, power beyond human comprehension." } },
    { id: 368, type: "game", p: 100, isPeak: true, icon: '🌲', source: "Legend of Zelda: Tears of Kingdom", ar: { name: "غانوندروف (الملك)", ability: "الثعبان المحكوم", lore: "غانوندروف في شكله التنيني الأخير. يحكم الظلام المطلق." }, en: { name: "GANONDORF (Dragon King)", ability: "Demon Dragon", lore: "Ganondorf in his final dragon form, ruling absolute darkness." } },
    { id: 369, type: "game", p: 101, isPeak: true, icon: '🌳', source: "Legend of Zelda: Tears of Kingdom", ar: { name: "لينك (الحكمة)", ability: "قوة أولترا هاند", lore: "لينك بعد إتقان جميع قدرات الطوط. يبني ويدمر بمساو." }, en: { name: "LINK (Wisdom)", ability: "Ultra Hand", lore: "Link mastering all Purah Pad abilities, building and destroying equally." } },
    { id: 370, type: "series", p: 104, isPeak: true, icon: '🐉', source: "House of Dragon", ar: { name: "رينيس (ملكة الأرض)", ability: "قوة ميليس الكاملة", lore: "رينيس تطلق تنين ميليس الكامل. لا شيء يعيش في مداها." }, en: { name: "RHAENYS (Earth Queen)", ability: "Full Meleys Power", lore: "Rhaenys fully unleashing Meleys. Nothing survives within her range." } },

    // ── دفعة نهائية حتى 500 ──
    { id: 371, type: "game", p: 84, icon: '🌿', source: "Stardew Valley", ar: { name: "المزارع", ability: "الصبر اللانهائي", lore: "الشخص الذي بنى من خربة مزرعة أسطورية." }, en: { name: "THE FARMER", ability: "Infinite Patience", lore: "The one who built a legendary farm from ruins through sheer patience." } },
    { id: 372, type: "game", p: 87, icon: '🌊', source: "Dead Cells", ar: { name: "المقاتل الميت", ability: "البداية من جديد", lore: "المقاتل الذي يعود بعد كل موت أقوى مما كان." }, en: { name: "BEHEADED", ability: "Return Stronger", lore: "The fighter who returns after each death stronger than before." } },
    { id: 373, type: "game", p: 86, icon: '🎭', source: "Hades", ar: { name: "زاغريوس", ability: "قوة الأوليمبيين", lore: "ابن هاديس الذي يحاول الهروب من الجحيم باستمرار." }, en: { name: "ZAGREUS", ability: "Olympian Boons", lore: "Hades's son constantly attempting to escape the Underworld." } },
    { id: 374, type: "game", p: 88, icon: '🗡️', source: "Hollow Knight", ar: { name: "فارس الخضراء", ability: "سلاح الروح", lore: "الفارس الذي يتعمق في المملكة المنسية ليواجه الإله الأبيض." }, en: { name: "GREENPATH KNIGHT", ability: "Soul Vessel", lore: "The knight delving into the Forgotten Kingdom to face the Pale God." } },
    { id: 375, type: "game", p: 89, icon: '🌑', source: "Darkest Dungeon", ar: { name: "المبشر", ability: "النور الكامن", lore: "المحارب الذي يواجه الجنون والظلام في أعمق الزنازين." }, en: { name: "CRUSADER", ability: "Divine Light", lore: "The warrior facing madness and darkness in the deepest dungeons." } },
    { id: 376, type: "anime", p: 85, icon: '🌊', source: "Black Lagoon", ar: { name: "ريفي", ability: "الرصاصتان المزدوجتان", lore: "قرصانة البحر التي لا تخطئ طلقة." }, en: { name: "REVY", ability: "Dual Cutlasses", lore: "The sea pirate who never misses a single shot." } },
    { id: 377, type: "anime", p: 84, icon: '🎭', source: "Baccano", ar: { name: "كلير ستانفيلد", ability: "الموت المبتسم", lore: "القاتل الأكثر خطورة في العشرينيات. يرتاح عند القتل." }, en: { name: "CLAIRE STANFIELD", ability: "Laughing Death", lore: "The most dangerous killer of the 1920s who feels at peace when killing." } },
    { id: 378, type: "anime", p: 86, icon: '⚡️', source: "Katekyo Hitman Reborn", ar: { name: "تسونا ساوادا", ability: "لهب السماء", lore: "البطل المتردد الذي أصبح العاشر لعائلة فونالي." }, en: { name: "TSUNA SAWADA", ability: "Sky Flame", lore: "The reluctant hero who became the tenth Vongola Family boss." } },
    { id: 379, type: "anime", p: 87, icon: '🌸', source: "Madoka Magica", ar: { name: "مادوكا كانامي", ability: "أمنية الكون", lore: "الفتاة التي تضحي بنفسها لمحو كل الساحرات من الكون." }, en: { name: "MADOKA KANAME", ability: "Universal Wish", lore: "The girl who sacrifices herself to erase all witches from the universe." } },
    { id: 380, type: "anime", p: 88, icon: '💜', source: "Madoka Magica", ar: { name: "هوموراي أكيمي", ability: "الوقت المجمد", lore: "المقاتلة التي تعيد حلقة الوقت مراراً لإنقاذ مادوكا." }, en: { name: "HOMURA AKEMI", ability: "Frozen Time", lore: "The warrior who loops through time repeatedly to save Madoka." } },
    { id: 381, type: "anime", p: 85, icon: '🔥', source: "Gurren Lagann", ar: { name: "سيمون", ability: "الحفر الكوني", lore: "الفتى الذي يحفر طريقه للمجرة. لا شيء يوقف روحه المتوهجة." }, en: { name: "SIMON", ability: "Gurren Lagann Drill", lore: "The boy who drills his way to the galaxy. Nothing stops his burning soul." } },
    { id: 382, type: "anime", p: 86, icon: '🌀', source: "Gurren Lagann", ar: { name: "كاميناي", ability: "روح البركان", lore: "الأخ الأكبر الذي يعلم سيمون معنى الشجاعة الحقيقية." }, en: { name: "KAMINA", ability: "Volcanic Soul", lore: "The big brother who teaches Simon the meaning of true courage." } },
    { id: 383, type: "anime", p: 87, icon: '🌺', source: "Kill la Kill", ar: { name: "ريوكو ماتويو", ability: "سينكتسو الحي", lore: "المحاربة التي تلبس زياً حياً يضاعف قوتها مئات المرات." }, en: { name: "RYUKO MATOI", ability: "Living Senketsu", lore: "The warrior wearing a living uniform that multiplies her power hundredfold." } },
    { id: 384, type: "anime", p: 88, icon: '⚔️', source: "Rurouni Kenshin", ar: { name: "كينشين هيميورا", ability: "الهيتن ميتسوروجي", lore: "السفاح السابق الذي أقسم على عدم القتل. أسرع سيف في اليابان." }, en: { name: "KENSHIN HIMURA", ability: "Hiten Mitsurugi", lore: "The former assassin who vowed never to kill. Japan's fastest sword." } },
    { id: 385, type: "anime", p: 86, icon: '🥊', source: "Hajime no Ippo", ar: { name: "إيبو ماكونوتشي", ability: "دمبستر", lore: "الملاكم الذي طور لكمة تسحق الدفاع بضربة واحدة." }, en: { name: "IPPO MAKUNOUCHI", ability: "Dempsey Roll", lore: "The boxer who developed a punch that shatters any defense in one blow." } },
    { id: 386, type: "anime", p: 87, icon: '🌊', source: "Berserk", ar: { name: "غريفث", ability: "أيد الفالكون", lore: "البطل الكاريزمي الذي خان رفاقه لتحقيق حلمه." }, en: { name: "GRIFFITH", ability: "Falcon of Light", lore: "The charismatic hero who betrayed his comrades to achieve his dream." } },
    { id: 387, type: "anime", p: 90, icon: '⚔️', source: "Berserk", ar: { name: "غاتس", ability: "المحارب الأسود", lore: "الرجل الذي يحمل سيفاً بحجم جسمه ويقاتل وحده ضد الشياطين." }, en: { name: "GUTS", ability: "Black Swordsman", lore: "The man wielding a sword his own size, fighting demons alone." } },
    { id: 388, type: "anime", p: 86, icon: '👑', source: "Medaka Box", ar: { name: "ميداكا كوروكامي", ability: "الكمال المطلق", lore: "الطالبة المثالية التي تتعلم أي قدرة خلال ثلاث دقائق." }, en: { name: "MEDAKA KUROKAMI", ability: "Perfect Perfection", lore: "The perfect student who learns any ability within three minutes." } },
    { id: 389, type: "anime", p: 85, icon: '🌸', source: "The Ancient Magus Bride", ar: { name: "تشيس هاتوري", ability: "عريس الساحر", lore: "الفتاة التي أصبحت تلميذة الساحر العتيق. قوتها تنمو بلا حدود." }, en: { name: "CHISE HATORI", ability: "Sleigh Beggy", lore: "The girl who became the ancient mage's apprentice, her power growing without limit." } },
    { id: 390, type: "anime", p: 84, icon: '🔮', source: "Magi", ar: { name: "الدين", ability: "سحر رودج", lore: "ابن سليمان الذي يرث معرفة أقوى ساحر في التاريخ." }, en: { name: "ALADDIN", ability: "Rukh Magic", lore: "Solomon's son inheriting the knowledge of history's most powerful mage." } },

    // ── Peak نهائية ──
    { id: 391, type: "anime", p: 102, isPeak: true, icon: '⚔️', source: "Berserk", ar: { name: "غاتس (الدرع الشيطاني)", ability: "الدرع الإبليسي", lore: "غاتس يرتدي الدرع الشيطاني. يتحول إلى وحش يقتل الجميع." }, en: { name: "GUTS (Berserker Armor)", ability: "Berserker Armor", lore: "Guts donning the Berserker Armor, transforming into a beast slaying all." } },
    { id: 392, type: "anime", p: 103, isPeak: true, icon: '🦅', source: "Berserk", ar: { name: "غريفث (الكامل)", ability: "فينيكس الفالكون", lore: "غريفث بعد اكتساب قوة بيزليلد الكاملة. يقود جيوش الشياطين." }, en: { name: "GRIFFITH (Complete)", ability: "Falcon Phoenix", lore: "Griffith with full Femto power leading demonic armies." } },
    { id: 393, type: "anime", p: 101, isPeak: true, icon: '🌸', source: "Madoka Magica", ar: { name: "مادوكا (الإلهة)", ability: "الأمنية الكونية الكاملة", lore: "مادوكا كإلهة كونية تمحو الشر من كل الأكوان في كل الأزمنة." }, en: { name: "MADOKA (Goddess)", ability: "Complete Universal Wish", lore: "Madoka as a cosmic goddess erasing evil from all universes across all time." } },
    { id: 394, type: "anime", p: 102, isPeak: true, icon: '🌀', source: "Gurren Lagann", ar: { name: "سيمون (المثقب الكوني)", ability: "مثقب المجرات", lore: "سيمون يقود Gurren Lagann الكوني. يحفر عبر أكوان موازية." }, en: { name: "SIMON (Cosmic Driller)", ability: "Galaxy Drill", lore: "Simon piloting Cosmic Gurren Lagann, drilling through parallel universes." } },
    { id: 395, type: "anime", p: 103, isPeak: true, icon: '🌺', source: "Kill la Kill", ar: { name: "ريوكو (الاندماج الكامل)", ability: "سينكتسو الكوني", lore: "ريوكو مندمجة بالكامل مع سينكتسو. قوة تمزق النجوم." }, en: { name: "RYUKO (Full Fusion)", ability: "Cosmic Senketsu", lore: "Ryuko fully fused with Senketsu, power to tear stars apart." } },
    { id: 396, type: "anime", p: 104, isPeak: true, icon: '🔥', source: "Katekyo Hitman Reborn", ar: { name: "تسونا (لهب السماء الكامل)", ability: "وضع الهيبربر", lore: "تسونا في وضع الهيبربر الكامل. يحترق بلهب السماء الأزرق." }, en: { name: "TSUNA (Hyper Mode)", ability: "Hyper Dying Will", lore: "Tsuna in full Hyper Mode, burning with blue Sky Flame." } },
    { id: 397, type: "game", p: 101, isPeak: true, icon: '🎭', source: "Hades II", ar: { name: "ميلينوي (كاملة)", ability: "ظلام الأوليمبيين", lore: "ابنة هاديس في ذروة قوتها. تجمع قوى الأولمبيين كلهم." }, en: { name: "MELINOE (Peak)", ability: "Olympian Shadow", lore: "Hades's daughter at full power, combining all Olympian gifts." } },
    { id: 398, type: "game", p: 102, isPeak: true, icon: '🌿', source: "Hollow Knight: Silksong", ar: { name: "هوريتاي (الكاملة)", ability: "خيوط الحرير الكونية", lore: "هوريتاي في ذروة قوتها. خيوطها تقطع البعد نفسه." }, en: { name: "HORNET (Complete)", ability: "Cosmic Silk Threads", lore: "Hornet at full power. Her threads cut through dimensions themselves." } },
    { id: 399, type: "anime", p: 105, isPeak: true, icon: '🌊', source: "Black Lagoon", ar: { name: "ريفي (المحرر)", ability: "الرصاص المزدوج المطلق", lore: "ريفي بدون أي قيود. رصاصاتها تخترق كل شيء." }, en: { name: "REVY (Unleashed)", ability: "Absolute Dual Guns", lore: "Revy without any restraints. Her bullets penetrate everything." } },
    { id: 400, type: "anime", p: 106, isPeak: true, icon: '⚔️', source: "Rurouni Kenshin", ar: { name: "كينشين (الهيتن الكامل)", ability: "أمانو كيروكو الكامل", lore: "كينشين يطلق الهيتن ميتسوروجي الكاملة. سرعة تتجاوز البشرية." }, en: { name: "KENSHIN (Peak Hiten)", ability: "Complete Amakakeru", lore: "Kenshin fully unleashing Hiten Mitsurugi, speed beyond humanity." } },

    { id: 401, type: "anime", p: 85, icon: '🌸', source: "Tokyo Revengers", ar: { name: "تاكيمتشي هانغاكي", ability: "السفر عبر الزمن", lore: "الفتى الذي يسافر عبر الزمن لإنقاذ من يحبهم من الموت." }, en: { name: "TAKEMICHI HANAGAKI", ability: "Time Leaper", lore: "The boy traveling through time to save those he loves from death." } },
    { id: 402, type: "anime", p: 87, icon: '🌀', source: "Tokyo Revengers", ar: { name: "مانجيرو سانو", ability: "ركلة المتأرجح", lore: "ميكي زعيم طوكيو مانجي. يهزم كل خصومه بركلة واحدة." }, en: { name: "MIKEY", ability: "Invincible Kick", lore: "Mikey, the Tokyo Manji boss who defeats all opponents with one kick." } },
    { id: 403, type: "anime", p: 86, icon: '⚔️', source: "Samurai Champloo", ar: { name: "موغن", ability: "الراب الكاتانا", lore: "المحارب الذي دمج رقص الراب مع فن السيوف." }, en: { name: "MUGEN", ability: "Beatdown Sword", lore: "The warrior who fused breakdancing with samurai sword arts." } },
    { id: 404, type: "anime", p: 85, icon: '🌸', source: "Samurai Champloo", ar: { name: "جين", ability: "السيف الهادئ", lore: "الرونين الذي درس في مدرسة السيف ثم أطاح بأستاذه." }, en: { name: "JIN", ability: "Calm Sword", lore: "The ronin who trained at sword school and then overthrew his master." } },
    { id: 405, type: "anime", p: 86, icon: '🔥', source: "Gintama", ar: { name: "غينتوكي سكاتا", ability: "الساموراي الأبيض", lore: "محارب بكامي الأبيض. يدافع عن إيدو ضد الغزو الفضائي." }, en: { name: "GINTOKI SAKATA", ability: "White Yaksha", lore: "The Silver Samurai defending Edo against alien invasion." } },
    { id: 406, type: "series", p: 83, icon: '🎭', source: "Mindhunter", ar: { name: "هولدن فورد", ability: "عقل المجرمين", lore: "المحقق الذي يدخل عقول القتلة المتسلسلين لمنعهم." }, en: { name: "HOLDEN FORD", ability: "Criminal Mind", lore: "The detective who enters serial killers' minds to stop them." } },
    { id: 407, type: "series", p: 84, icon: '🕵️', source: "True Detective", ar: { name: "رست كوهل", ability: "الفيلسوف الميت", lore: "المحقق الأكثر تعقيداً في التلفزيون. يرى الجريمة بطريقة لا يراها غيره." }, en: { name: "RUST COHLE", ability: "Nihilist Detective", lore: "TV's most complex detective, seeing crime in ways others cannot." } },
    { id: 408, type: "series", p: 85, icon: '💊', source: "The Wire", ar: { name: "عمر ليتل", ability: "الصائد الأسطوري", lore: "الرجل الذي يصطاد تجار المخدرات في بالتيمور. لا أحد يخيفه." }, en: { name: "OMAR LITTLE", ability: "Legendary Hunter", lore: "The man who hunts drug dealers in Baltimore. Nobody scares him." } },
    { id: 409, type: "series", p: 86, icon: '🌊', source: "Ozark", ar: { name: "مارتي بيرد", ability: "المحاسب الخطير", lore: "المحاسب الذي يغسل أموال الكارتيل ويبقى حياً." }, en: { name: "MARTY BYRDE", ability: "Dangerous Accountant", lore: "The accountant who launders cartel money and somehow stays alive." } },
    { id: 410, type: "series", p: 84, icon: '🎭', source: "Narcos", ar: { name: "بابلو إسكوبار", ability: "الإمبراطور والملاذ", lore: "أشهر تاجر مخدرات في التاريخ. بنى إمبراطورية بالرعب والكرم." }, en: { name: "PABLO ESCOBAR", ability: "Plata o Plomo", lore: "History's most famous drug lord, building an empire through fear and generosity." } },

    { id: 411, type: "game", p: 83, icon: '🌊', source: "Minecraft", ar: { name: "ستيف", ability: "بناء الكون", lore: "الشخصية الأكثر إبداعاً في تاريخ الألعاب. يبني ويفجر ويخترع." }, en: { name: "STEVE", ability: "Build the Universe", lore: "Gaming's most creative character. He builds, blows up, and invents endlessly." } },
    { id: 412, type: "game", p: 84, icon: '🌿', source: "Terraria", ar: { name: "المغامر", ability: "حفر الكوكب", lore: "المستكشف الذي يحفر حتى قلب الكوكب لمواجهة الشر." }, en: { name: "THE ADVENTURER", ability: "Planet Digger", lore: "The explorer who digs to the planet's core to face its evil." } },
    { id: 413, type: "game", p: 86, icon: '🎮', source: "Undertale", ar: { name: "فريسك", ability: "إعادة المحاولة", lore: "الطفل الذي يختار السلام على القوة في عالم الوحوش." }, en: { name: "FRISK", ability: "True Reset", lore: "The child who chooses peace over power in a world of monsters." } },
    { id: 414, type: "game", p: 88, icon: '💀', source: "Undertale", ar: { name: "سانس", ability: "ثغرات الزمن", lore: "الهيكل الذي يعرف السر الكبير. أبطأ مقاتل وأخطره." }, en: { name: "SANS", ability: "Gaster Blasters", lore: "The skeleton who knows the big secret. The laziest and most dangerous fighter." } },
    { id: 415, type: "game", p: 87, icon: '🌸', source: "Undertale", ar: { name: "توريل", ability: "إلهة التعاطف", lore: "ملكة عالم الوحوش التي تختار الرحمة دائماً." }, en: { name: "TORIEL", ability: "Compassion Goddess", lore: "The queen of the monster world who always chooses mercy." } },
    { id: 416, type: "anime", p: 83, icon: '🌸', source: "Fruits Basket", ar: { name: "تيهارو هوندا", ability: "القلب المنفتح", lore: "الفتاة التي كسرت لعنة أسرة سوما بحبها غير المشروط." }, en: { name: "TOHRU HONDA", ability: "Open Heart", lore: "The girl who broke the Soma clan's curse through unconditional love." } },
    { id: 417, type: "anime", p: 86, icon: '🐉', source: "Dragon Maid", ar: { name: "تولورو", ability: "قوة التنين العلوي", lore: "تنين من عالم آخر تعيش مع البشر. قوتها تفوق الخيال." }, en: { name: "TOHRU DRAGON", ability: "Supreme Dragon", lore: "A dragon from another world living with humans. Her power defies imagination." } },
    { id: 418, type: "anime", p: 85, icon: '⚔️', source: "Claymore", ar: { name: "كلير", ability: "نصف التنين النصف", lore: "المحاربة الأضعف في كلايمور التي تتجاوز حدودها مراراً." }, en: { name: "CLAIRE", ability: "Half-Yoma Blade", lore: "The weakest Claymore who surpasses her limits again and again." } },
    { id: 419, type: "anime", p: 87, icon: '💀', source: "Overlord", ar: { name: "شالتير بلودفالن", ability: "أميرة الدم", lore: "أقوى غارديان في ناظريك. مصاصة الدماء التي تجمد القلوب." }, en: { name: "SHALLTEAR BLOODFALLEN", ability: "Blood Princess", lore: "Nazarick's strongest guardian. The vampire who freezes hearts with dread." } },
    { id: 420, type: "anime", p: 86, icon: '🌸', source: "Konosuba", ar: { name: "ديارسنس", ability: "جنرال الملك الشيطان", lore: "جنرال شياطين يصبح حليفاً للبطل عن طريق الحادثة." }, en: { name: "DARKNESS", ability: "Crusader Masochist", lore: "A Crusader who becomes the hero's ally by happy accident." } },

    { id: 421, type: "series", p: 85, icon: '⚡️', source: "The Flash", ar: { name: "باري ألان (المسلسل)", ability: "السرعة المتزايدة", lore: "البطل الذي يتجاوز سرعته الخاصة في كل موسم." }, en: { name: "BARRY ALLEN (Show)", ability: "Speed Growth", lore: "The hero who surpasses his own speed limit every season." } },
    { id: 422, type: "series", p: 84, icon: '🏹', source: "Arrow", ar: { name: "أوليفر كوين", ability: "القوس الأخضر", lore: "رجل الأعمال الذي أصبح بطلاً بعد خمس سنوات في جزيرة منعزلة." }, en: { name: "OLIVER QUEEN", ability: "Green Arrow", lore: "The billionaire who became a hero after five years on a deserted island." } },
    { id: 423, type: "series", p: 83, icon: '🌊', source: "Supergirl", ar: { name: "كارا زور-إل", ability: "ابنة كريبتون", lore: "ابنة عمة سوبرمان. تحمل نفس القوى وتكافح لإثبات نفسها." }, en: { name: "KARA ZOR-EL", ability: "Kryptonian Daughter", lore: "Superman's cousin with the same powers, fighting to prove herself." } },
    { id: 424, type: "series", p: 86, icon: '🌑', source: "Titans", ar: { name: "رافن", ability: "أزاراث ميترون زينتوس", lore: "ابنة تريغون. تتحكم في طاقة المظلمة بشكل يعجز عنه أبوها." }, en: { name: "RAVEN", ability: "Azarath Metrion Zinthos", lore: "Trigon's daughter controlling dark energy in ways even her father cannot." } },
    { id: 425, type: "series", p: 85, icon: '🌞', source: "Titans", ar: { name: "ستارفاير", ability: "نار كوكب تامارين", lore: "أميرة تامارين. تطلق ضربات ضوئية تدمر المباني." }, en: { name: "STARFIRE", ability: "Tamaran Fire", lore: "Tamaran's princess unleashing starbolts that demolish buildings." } },
    { id: 426, type: "movie", p: 83, icon: '🌸', source: "Spirited Away", ar: { name: "تشيهيرو", ability: "قلب لا يستسلم", lore: "الفتاة التي أنقذت والديها من عالم الأرواح بإرادتها فقط." }, en: { name: "CHIHIRO", ability: "Never Give Up Heart", lore: "The girl who saved her parents from the spirit world through sheer will." } },
    { id: 427, type: "movie", p: 84, icon: '🌲', source: "Princess Mononoke", ar: { name: "سان", ability: "روح الغابة", lore: "ابنة الذئاب. تحارب البشر دفاعاً عن الغابة بضراوة لا تهدأ." }, en: { name: "SAN", ability: "Forest Spirit", lore: "The wolves' daughter fighting humans to defend the forest with relentless ferocity." } },
    { id: 428, type: "movie", p: 85, icon: '🌊', source: "Nausicaa", ar: { name: "نوشيكا", ability: "الرياح والبحر", lore: "الأميرة التي تفهم المخلوقات السامة. تجسير بين البشر والطبيعة." }, en: { name: "NAUSICAA", ability: "Wind and Sea", lore: "The princess who understands toxic creatures, bridging humanity and nature." } },
    { id: 429, type: "movie", p: 86, icon: '⚡️', source: "Castle in the Sky", ar: { name: "شيتا", ability: "قوة لابوتا", lore: "أميرة لابوتا التي تمتلك حجر الإيثر السحري." }, en: { name: "SHEETA", ability: "Laputa Power", lore: "The princess of Laputa who possesses the magical aetherium crystal." } },
    { id: 430, type: "movie", p: 84, icon: '🌸', source: "Howl's Moving Castle", ar: { name: "هاول بنكينز", ability: "ساحر النار", lore: "الساحر الجميل الذي باع قلبه مقابل القوة." }, en: { name: "HOWL PENDRAGON", ability: "Fire Wizard", lore: "The beautiful wizard who sold his heart in exchange for power." } },

    { id: 431, type: "game", p: 89, icon: '🌑', source: "Lies of P", ar: { name: "بينوكيو", ability: "الإرادة الخارقة", lore: "الدمية التي أصبحت إنساناً حقيقياً من خلال اختياراتها." }, en: { name: "PINOCCHIO", ability: "Iron Will", lore: "The puppet who became a real person through the choices it made." } },
    { id: 432, type: "game", p: 88, icon: '🌸', source: "Stellar Blade", ar: { name: "ليليت", ability: "الذاكرة المخفية", lore: "المحاربة التي تحمل أسرار النايتيف داخلها." }, en: { name: "LILY", ability: "Hidden Memory", lore: "The warrior carrying the secrets of the Naytiba within herself." } },
    { id: 433, type: "game", p: 87, icon: '🔮', source: "Metaphor: ReFantazio", ar: { name: "وول", ability: "روح المتغيرين", lore: "البطل الذي يجمع قوى أرواح المتغيرين لإنقاذ مملكته." }, en: { name: "WILL", ability: "Archetype Spirit", lore: "The hero gathering Archetype spirits to save his kingdom." } },
    { id: 434, type: "game", p: 90, icon: '🌊', source: "Like a Dragon: Infinite Wealth", ar: { name: "إيتشيبان كاسوغا", ability: "قوة الحلم", lore: "البطل الذي يؤمن بالصداقة حتى في أسوأ اللحظات." }, en: { name: "ICHIBAN KASUGA", ability: "Dream Power", lore: "The hero who believes in friendship even in the darkest moments." } },
    { id: 435, type: "game", p: 91, icon: '🔥', source: "Like a Dragon", ar: { name: "كيريو كازوما", ability: "التنين الأسطوري", lore: "التنين من دوجيما الذي يقاتل لحماية من يحبهم بكل شراسة." }, en: { name: "KAZUMA KIRYU", ability: "Dragon of Dojima", lore: "The Dragon of Dojima who fights ferociously to protect those he loves." } },
    { id: 436, type: "anime", p: 84, icon: '🌊', source: "Katanagatari", ar: { name: "شيشيو ياساهارو", ability: "جسد السلاح", lore: "المحارب الذي جسده بالكامل سلاح. لا يحمل سيفاً لأنه هو السيف." }, en: { name: "SHICHIKA YASURI", ability: "Body as Blade", lore: "The warrior whose entire body is a weapon. He carries no sword because he is the sword." } },
    { id: 437, type: "anime", p: 86, icon: '⚡️', source: "Katanagatari", ar: { name: "توغامي أوسامو", ability: "استراتيجية مطلقة", lore: "العبقري الذي يضع خططاً تضمن النصر قبل بدء المعركة." }, en: { name: "TOGAME", ability: "Absolute Strategy", lore: "The genius who devises plans guaranteeing victory before battle begins." } },
    { id: 438, type: "anime", p: 85, icon: '🌸', source: "Monogatari", ar: { name: "أراراغي كويومي", ability: "دم المصاص", lore: "الطالب شبه مصاص الدماء الذي يساعد الفتيات الواقعات تحت لعنات الأرواح." }, en: { name: "KOYOMI ARARAGI", ability: "Vampire Blood", lore: "The near-vampire student helping girls afflicted by supernatural oddities." } },
    { id: 439, type: "anime", p: 87, icon: '🔮', source: "Monogatari", ar: { name: "وشيرو أوشينو", ability: "المعرفة الخارقة", lore: "المتخصص في الحالات الغريبة. يعرف كل شيء عن الأرواح الشريرة." }, en: { name: "MEME OSHINO", ability: "Supernatural Knowledge", lore: "The oddity specialist who knows everything about supernatural entities." } },
    { id: 440, type: "anime", p: 88, icon: '🌊', source: "March Comes in Like a Lion", ar: { name: "ريي كيريياما", ability: "عقل الشطرنج", lore: "أصغر لاعب شطرنج محترف في التاريخ. يقاتل الاكتئاب ولعبته." }, en: { name: "REI KIRIYAMA", ability: "Shogi Mind", lore: "The youngest professional shogi player in history, fighting depression and his game." } },

    { id: 441, type: "comic", p: 87, icon: '🔥', source: "X-Men", ar: { name: "غامبيت", ability: "الطاقة الحركية", lore: "المتحول الذي يشحن الأشياء بالطاقة المتفجرة." }, en: { name: "GAMBIT", ability: "Kinetic Energy", lore: "The mutant who charges objects with explosive kinetic energy." } },
    { id: 442, type: "comic", p: 86, icon: '🌸', source: "X-Men", ar: { name: "روغ", ability: "امتصاص القدرات", lore: "المتحولة التي تمتص قدرات الآخرين باللمس." }, en: { name: "ROGUE", ability: "Power Absorption", lore: "The mutant who absorbs others' powers and memories through touch." } },
    { id: 443, type: "comic", p: 88, icon: '🌊', source: "DC Comics", ar: { name: "غرين لانترن هال جوردان", ability: "أقوى خاتم", lore: "أعظم جندي في الحرس الأخضر. إرادته تجعل خاتمه أقوى سلاح." }, en: { name: "HAL JORDAN", ability: "Willpower Ring", lore: "The greatest Green Lantern. His will makes his ring the most powerful weapon." } },
    { id: 444, type: "comic", p: 89, icon: '🌑', source: "DC Comics", ar: { name: "سينيسترو", ability: "الخاتم الأصفر", lore: "المرتد من الحرس الأخضر. يستخدم الخوف بدل الإرادة." }, en: { name: "SINESTRO", ability: "Fear Ring", lore: "The Green Lantern defector who wields fear instead of willpower." } },
    { id: 445, type: "comic", p: 87, icon: '🕷️', source: "Marvel Comics", ar: { name: "فينوم", ability: "الكيان الرمادي", lore: "الكائن الفضائي المتحد مع إيدي بروك. يكره سبايدر مان بعمق." }, en: { name: "VENOM", ability: "Symbiote Power", lore: "The alien entity bonded with Eddie Brock, harboring deep hatred for Spider-Man." } },
    { id: 446, type: "comic", p: 88, icon: '🔴', source: "Marvel Comics", ar: { name: "كارنيج", ability: "كيان الدم", lore: "كيان كليتوس كاسيدي الأكثر فتكاً وجنوناً من فينوم." }, en: { name: "CARNAGE", ability: "Blood Symbiote", lore: "Cletus Kasady's symbiote, more lethal and insane than Venom." } },
    { id: 447, type: "comic", p: 86, icon: '🌊', source: "DC Comics", ar: { name: "شزام", ability: "قوة الآلهة السبعة", lore: "الولد الذي يتحول لبطل بكلمة واحدة. قوة سبعة آلهة في جسم واحد." }, en: { name: "SHAZAM", ability: "Seven Gods Power", lore: "The boy who transforms into a champion with one word. Seven gods' power in one body." } },
    { id: 448, type: "comic", p: 87, icon: '⭐', source: "DC Comics", ar: { name: "ستارجيرل", ability: "الكوزمي رود", lore: "البطلة الشابة التي ترث عصا كونية من أبطال الجيل الماضي." }, en: { name: "STARGIRL", ability: "Cosmic Staff", lore: "The young hero inheriting a cosmic staff from the previous generation's champions." } },
    { id: 449, type: "comic", p: 88, icon: '🌑', source: "DC Comics", ar: { name: "نايتوينج (ديك)", ability: "أسياخ إيسكريما", lore: "أفضل مقاتل من تدرب على يد باتمان. يجمع بين المهارة والسرعة." }, en: { name: "NIGHTWING (Dick)", ability: "Escrima Sticks", lore: "Batman's best-trained student combining skill and speed perfectly." } },
    { id: 450, type: "comic", p: 89, icon: '🔥', source: "DC Comics", ar: { name: "هاوكمان", ability: "أجنحة النيث ميتال", lore: "المحارب الذي يعود من الموت في كل عصر ليواصل القتال." }, en: { name: "HAWKMAN", ability: "Nth Metal Wings", lore: "The warrior who returns from death in every age to continue fighting." } },

    { id: 451, type: "game", p: 86, icon: '🌸', source: "Nier Replicant", ar: { name: "ناي", ability: "سحر الكلمات", lore: "الأخ الذي يبحث عن علاج لأخته بين عالمين متعارضين." }, en: { name: "NIER", ability: "Word Magic", lore: "The brother seeking a cure for his sister between two conflicting worlds." } },
    { id: 452, type: "game", p: 87, icon: '💀', source: "Nier Replicant", ar: { name: "غريمواير وايس", ability: "السحر الأبيض", lore: "الكتاب الساحر العجوز شريك ناي. يحمل أسرار الكون." }, en: { name: "GRIMOIRE WEISS", ability: "White Magic", lore: "Nier's elderly magical book partner, containing the universe's secrets." } },
    { id: 453, type: "game", p: 88, icon: '🌹', source: "Nier Replicant", ar: { name: "كالي", ability: "شفرات الظلام", lore: "المقاتلة الساحرة بنصفين. قوتها تنبع من الكنية المزدوجة." }, en: { name: "KAINE", ability: "Dark Blades", lore: "The dual-wielding warrior whose power comes from her dual nature." } },
    { id: 454, type: "game", p: 85, icon: '⚡️', source: "Ratchet and Clank", ar: { name: "راتشيت", ability: "الأسلحة الإبداعية", lore: "محارب المجرة الذي يجمع بين الدكاء والأسلحة الأكثر إبداعاً." }, en: { name: "RATCHET", ability: "Creative Arsenal", lore: "The galaxy warrior combining wit with the most creative weapons." } },
    { id: 455, type: "game", p: 84, icon: '🌊', source: "Crash Bandicoot", ar: { name: "كراش", ability: "الدوامة الأسطورية", lore: "الكائن المجنون الذي هزم نيو كورتيكس مراراً." }, en: { name: "CRASH BANDICOOT", ability: "Legendary Spin", lore: "The crazy creature who defeated Neo Cortex over and over again." } },
    { id: 456, type: "game", p: 85, icon: '🔥', source: "Spyro", ar: { name: "سبايرو", ability: "نار التنين", lore: "التنين الأرجواني الصغير الذي أنقذ مملكة التنانين." }, en: { name: "SPYRO", ability: "Dragon Fire", lore: "The small purple dragon who saved the Dragon Kingdom time and again." } },
    { id: 457, type: "game", p: 86, icon: '⚡️', source: "Jak and Daxter", ar: { name: "جاك", ability: "ضباب الإيكو الداكن", lore: "المحارب الذي تعرض لتجارب الإيكو الداكن وأصبح أقوى." }, en: { name: "JAK", ability: "Dark Eco", lore: "The warrior exposed to Dark Eco experiments, emerging stronger." } },
    { id: 458, type: "game", p: 87, icon: '🌸', source: "Ico", ar: { name: "إيكو", ability: "الرابطة الخفية", lore: "الصبي ذو القرون الذي يحمل فتاة الأميرة عبر قلعة لعينة." }, en: { name: "ICO", ability: "Invisible Bond", lore: "The horned boy carrying a princess through a cursed castle." } },
    { id: 459, type: "game", p: 88, icon: '🌊', source: "Shadow of the Colossus", ar: { name: "واندر", ability: "الإرادة المستحيلة", lore: "الشاب الذي يهزم ستة عشر كولوسوس لإعادة حياة من أحب." }, en: { name: "WANDER", ability: "Impossible Will", lore: "The young man who defeats sixteen Colossi to restore life to his beloved." } },
    { id: 460, type: "game", p: 86, icon: '🌹', source: "Ico", ar: { name: "يورداء", ability: "الضوء الخفي", lore: "الأميرة التي تضيء الظلام وتفتح الأبواب المغلقة." }, en: { name: "YORDA", ability: "Hidden Light", lore: "The princess who illuminates darkness and opens locked doors." } },

    { id: 461, type: "anime", p: 83, icon: '🎭', source: "Neon Genesis Evangelion", ar: { name: "شيني إيكاري", ability: "الإيفا الأولى", lore: "الطفل الذي يحمل عبء إنقاذ البشرية بنفس هشة." }, en: { name: "SHINJI IKARI", ability: "Eva Unit-01", lore: "The child bearing the weight of saving humanity with a fragile psyche." } },
    { id: 462, type: "anime", p: 85, icon: '🌹', source: "Neon Genesis Evangelion", ar: { name: "ري أياناامي", ability: "اتحاد النفس", lore: "الغموض المتجسد. نسخة لا نهاية لها من روح مجهولة." }, en: { name: "REI AYANAMI", ability: "Soul Fusion", lore: "Mystery personified. An endless copy of an unknown soul." } },
    { id: 463, type: "anime", p: 86, icon: '⚡️', source: "Neon Genesis Evangelion", ar: { name: "أسوكا لانغلي", ability: "العاطفة المتوهجة", lore: "بطلة الإيفا الثانية. غرورها قوة وضعفها في آن معاً." }, en: { name: "ASUKA LANGLEY", ability: "Blazing Emotion", lore: "Eva Unit-02 pilot whose pride is both her strength and weakness." } },
    { id: 464, type: "anime", p: 87, icon: '🌑', source: "Neon Genesis Evangelion", ar: { name: "كافيرو", ability: "الملاك الأبيض", lore: "الملاك الذي يبحث عن الوحدة مع البشرية بدل تدميرها." }, en: { name: "KAWORU NAGISA", ability: "White Angel", lore: "The Angel who seeks union with humanity rather than its destruction." } },
    { id: 465, type: "anime", p: 85, icon: '🌊', source: "Steins;Gate", ar: { name: "أوكابيه رينتارو", ability: "قفزات الزمن", lore: "العالم المجنون الذي يعيد الزمن لإنقاذ من يحبهم." }, en: { name: "OKABE RINTAROU", ability: "Time Leaps", lore: "The mad scientist reliving time to save those he loves." } },
    { id: 466, type: "anime", p: 84, icon: '🌸', source: "Steins;Gate", ar: { name: "كريستينا ماكيسي", ability: "العبقرية العلمية", lore: "العبقرية التي تفتح سر السفر عبر الزمن ثم تدفع ثمنه." }, en: { name: "KURISU MAKISE", ability: "Scientific Genius", lore: "The genius who unlocks the secret of time travel and pays the price." } },
    { id: 467, type: "anime", p: 83, icon: '🎭', source: "Higurashi", ar: { name: "ريكا فورودي", ability: "حلقة القدر", lore: "الفتاة المحاصرة في حلقة من الأكاذيب والموت." }, en: { name: "RIKA FURUDE", ability: "Fate Loop", lore: "The girl trapped in an endless loop of lies and death." } },
    { id: 468, type: "anime", p: 82, icon: '🌹', source: "Umineko", ar: { name: "بياتريس", ability: "ساحرة الذهب", lore: "ساحرة أليهيين التي تتحدى النظام بمعادلة السحر." }, en: { name: "BEATRICE", ability: "Golden Witch", lore: "The Umineko witch who challenges reason with the equation of magic." } },
    { id: 469, type: "anime", p: 85, icon: '🌀', source: "Spiritpact", ar: { name: "يوكاتاني كيإي", ability: "الروح والجسد", lore: "الطالب الذي أصبح شريك روح لسيد الأرواح." }, en: { name: "YOU KEIKA", ability: "Spirit Contract", lore: "The student who became a spirit partner to a lord of spirits." } },
    { id: 470, type: "anime", p: 84, icon: '💜', source: "Violet Evergarden", ar: { name: "فيوليت إيفرغاردن", ability: "الكلمات التي تشفي", lore: "عاملة الذاكريات الذهبية التي تكتب الرسائل لتفهم معنى الحب." }, en: { name: "VIOLET EVERGARDEN", ability: "Healing Words", lore: "The Auto Memory Doll who writes letters to understand the meaning of love." } },

    { id: 471, type: "game", p: 88, icon: '🌊', source: "God of War Norse", ar: { name: "فري يا", ability: "درع الفالكيرية", lore: "ملكة الفالكيريات التي جمدت روح جسدها. تقاتل لاسترداد أخيها." }, en: { name: "FREYA", ability: "Valkyrie Shield", lore: "Queen of Valkyries who imprisoned her own soul. Fights to reclaim her brother." } },
    { id: 472, type: "game", p: 87, icon: '🔱', source: "God of War Ragnarok", ar: { name: "ثور نوردي", ability: "مطرقة ميولنير", lore: "الإله النوردي الذي يواجه كراتوس في مطلع رانارك." }, en: { name: "THOR (Norse)", ability: "Mjolnir Strike", lore: "The Norse God who faces Kratos at the dawn of Ragnarok." } },
    { id: 473, type: "game", p: 86, icon: '🌙', source: "God of War Ragnarok", ar: { name: "أودين النوردي", ability: "عين غنير", lore: "أب الآلهة النوردي الذي يتلاعب بالجميع لمنع رانارك." }, en: { name: "ODIN (Norse)", ability: "Gungnir Eye", lore: "The Allfather of Norse gods manipulating everyone to prevent Ragnarok." } },
    { id: 474, type: "game", p: 89, icon: '⚡️', source: "God of War Ragnarok", ar: { name: "تير", ability: "إله العدالة", lore: "إله الحرب والعدالة النوردي. فقد يده لشل فينرير." }, en: { name: "TYR", ability: "God of Justice", lore: "The Norse god of war and justice who lost his hand to bind Fenrir." } },
    { id: 475, type: "game", p: 85, icon: '🌿', source: "God of War Ragnarok", ar: { name: "أنغربودا", ability: "قوة الغابة", lore: "الجن الذي يحارس بذور الآلهة. قلبها يرى المستقبل." }, en: { name: "ANGRBODA", ability: "Forest Power", lore: "The giant who guards the seeds of the gods. Her heart sees the future." } },
    { id: 476, type: "anime", p: 90, icon: '🌑', source: "Jujutsu Kaisen", ar: { name: "يوتا أوككوتسو", ability: "سحر كوبس الكامل", lore: "أقوى ساحر في المدرسة بعد غوجو. يحمل روح ريكا بداخله." }, en: { name: "YUTA OKKOTSU", ability: "Complete Rika Magic", lore: "The school's strongest sorcerer after Gojo, carrying Rika's spirit within." } },
    { id: 477, type: "anime", p: 89, icon: '🌸', source: "Jujutsu Kaisen", ar: { name: "نوبارا كوغيساكي", ability: "أشغال الإبرة", lore: "الساحرة التي تستخدم إبراً ودمى لتحطيم الأرواح الشريرة." }, en: { name: "NOBARA KUGISAKI", ability: "Straw Doll Technique", lore: "The sorceress using needles and dolls to shatter cursed spirits." } },
    { id: 478, type: "anime", p: 88, icon: '🌊', source: "Jujutsu Kaisen", ar: { name: "ناناكي هيموروو", ability: "السبعة نانا", lore: "الساحرة التي تستخدم سبع روح لتكافح من كل اتجاه." }, en: { name: "NANAMI", ability: "Seven Three", lore: "The sorcerer whose technique activates at the seventy-thirty ratio." } },
    { id: 479, type: "anime", p: 87, icon: '💀', source: "Jujutsu Kaisen", ar: { name: "تودو أويبامي", ability: "الصديق المثالي", lore: "الساحر الذي يعتبر كل من يتشارك معه الذوق أخاً." }, en: { name: "TODO AOI", ability: "Boogie Woogie", lore: "The sorcerer who considers anyone with shared taste a brother." } },
    { id: 480, type: "anime", p: 86, icon: '⚡️', source: "Jujutsu Kaisen", ar: { name: "إينومي دانجو", ability: "لعنة الكبار", lore: "الساحر العجوز الذي يجمع خبرة قرن من معارك اللعنات." }, en: { name: "INUMAKI TOGE", ability: "Cursed Speech", lore: "The sorcerer whose words are cursed, able to command reality." } },

    // Peak نهائية 481-500
    { id: 481, type: "game", p: 103, isPeak: true, icon: '🔱', source: "God of War Ragnarok", ar: { name: "كراتوس (إله الكل)", ability: "الروح الإسكندنافية", lore: "كراتوس بعد إتقان السحر الإسكندنافي. يجمع قوى جميع الآلهة." }, en: { name: "KRATOS (Norse God)", ability: "Nordic Soul", lore: "Kratos mastering Norse magic, combining all gods' powers." } },
    { id: 482, type: "game", p: 102, isPeak: true, icon: '⚡️', source: "God of War Ragnarok", ar: { name: "ثور (الرعد الكامل)", ability: "الصاعقة الكونية", lore: "ثور في ذروة قوته برعد لا يهدأ يمزق الأبعاد." }, en: { name: "THOR (Full Thunder)", ability: "Cosmic Thunderstrike", lore: "Thor at his thunderous peak, ripping through dimensions." } },
    { id: 483, type: "anime", p: 103, isPeak: true, icon: '🌑', source: "Neon Genesis Evangelion", ar: { name: "شيني (الإيفا النهائية)", ability: "التوازي الكامل", lore: "شيني بعد الاتحاد الكامل مع الإيفا الأولى. قوة الملاك والإنسان." }, en: { name: "SHINJI (Final Eva)", ability: "Complete Sync", lore: "Shinji in complete union with Eva Unit-01, merging angel and human power." } },
    { id: 484, type: "anime", p: 104, isPeak: true, icon: '🌊', source: "Gurren Lagann", ar: { name: "سيمون (الكوني الكامل)", ability: "المثقب الكوني الكامل", lore: "سيمون يوجه غورين لاغان الكوني الكامل. يحفر عبر الزمن نفسه." }, en: { name: "SIMON (Complete Cosmic)", ability: "Full Cosmic Drill", lore: "Simon piloting full Cosmic Gurren Lagann, drilling through time itself." } },
    { id: 485, type: "anime", p: 102, isPeak: true, icon: '⚔️', source: "Samurai Champloo", ar: { name: "موغن (الجحيم)", ability: "الراب الكامل", lore: "موغن في ذروة إبداعه. يجمع بين فوضى الشارع وفن السيف." }, en: { name: "MUGEN (Hell Mode)", ability: "Complete Breakdance Sword", lore: "Mugen at his creative peak, fusing street chaos with blade mastery." } },
    { id: 486, type: "anime", p: 103, isPeak: true, icon: '🌸', source: "Katanagatari", ar: { name: "شيشيكا (البراعة الكاملة)", ability: "السيف الكامل", lore: "شيشيكا بعد إتقان أسلوبه بالكامل. جسده أسرع أي سيف." }, en: { name: "SHICHIKA (Complete)", ability: "Perfect Blade Body", lore: "Shichika in full mastery. His body is faster than any sword." } },
    { id: 487, type: "game", p: 104, isPeak: true, icon: '🌹', source: "Nier Replicant", ar: { name: "كالي (الكاملة)", ability: "شفرات الفراغ", lore: "كالي في ذروة قوتها. تقطع الوجود نفسه بشفراتها." }, en: { name: "KAINE (Complete)", ability: "Void Blades", lore: "Kaine at her peak, cutting through existence itself with her blades." } },
    { id: 488, type: "anime", p: 105, isPeak: true, icon: '🌀', source: "Monogatari", ar: { name: "أوشينو مينيمي (الكامل)", ability: "المعرفة المطلقة", lore: "الطيف ذو المعرفة المطلقة بكل الظواهر الخارقة." }, en: { name: "OSHINO OUGI (Complete)", ability: "Absolute Knowledge", lore: "The supernatural entity with absolute knowledge of all oddities." } },
    { id: 489, type: "game", p: 103, isPeak: true, icon: '💀', source: "Hollow Knight", ar: { name: "فارس الفراغ (الخالص)", ability: "الفراغ المطلق", lore: "الفارس بعد إطلاق كل قوة الفراغ. يجمع بين النور والظلام." }, en: { name: "PURE VESSEL", ability: "Absolute Void", lore: "The Knight with full void power, merging light and darkness." } },
    { id: 490, type: "anime", p: 104, isPeak: true, icon: '🌸', source: "Violet Evergarden", ar: { name: "فيوليت (القلب الكامل)", ability: "الحب الكامل", lore: "فيوليت بعد فهم الحب الكامل. كلماتها تشفي الجروح العميقة." }, en: { name: "VIOLET (Full Heart)", ability: "Complete Love", lore: "Violet after fully understanding love. Her words heal the deepest wounds." } },
    { id: 491, type: "anime", p: 102, isPeak: true, icon: '🌊', source: "Black Lagoon", ar: { name: "ريفي (الحرية الكاملة)", ability: "رصاص الحرية", lore: "ريفي محررة تماماً. كل رصاصة تحمل إرادتها المطلقة." }, en: { name: "REVY (Complete Freedom)", ability: "Freedom Bullets", lore: "Revy fully liberated, every bullet carrying her absolute will." } },
    { id: 492, type: "anime", p: 103, isPeak: true, icon: '⚡️', source: "Tokyo Revengers", ar: { name: "ميكي (الإمبراطور)", ability: "الركلة الإمبراطورية", lore: "مانجيرو سانو كإمبراطور شوارع طوكيو. لا أحد يقف أمامه." }, en: { name: "MIKEY (Emperor)", ability: "Emperor Kick", lore: "Mikey as Emperor of Tokyo streets. No one stands before him." } },
    { id: 493, type: "game", p: 104, isPeak: true, icon: '🎮', source: "Undertale", ar: { name: "سانس (العروض التعليمية)", ability: "ثغرات الفضاء الزمن", lore: "سانس يطلق كل إمكاناته. يعرف أنك تعيد التشغيل وينتظرك." }, en: { name: "SANS (True Power)", ability: "Space-Time Gaster Blasters", lore: "Sans fully unleashed, knowing you've been reloading and waiting for it." } },
    { id: 494, type: "anime", p: 105, isPeak: true, icon: '🌑', source: "Steins;Gate", ar: { name: "أوكابيه (دبليو لاين)", ability: "عالم الخيوط الكاملة", lore: "أوكابيه بعد فهمه الكامل للخطوط الزمنية. يتحكم في القدر." }, en: { name: "OKABE (Worldline)", ability: "Complete Timeline", lore: "Okabe after fully understanding worldlines, manipulating fate itself." } },
    { id: 495, type: "anime", p: 106, isPeak: true, icon: '🌊', source: "Evangelion", ar: { name: "شيني (التوازي الكامل الإلهي)", ability: "الاندماج الإلهي", lore: "شيني في التوازي الكامل مع الإيفا. يتجاوز حدود الإنسان والملاك." }, en: { name: "SHINJI (Divine Sync)", ability: "Divine Fusion", lore: "Shinji in complete divine sync with Eva, surpassing human and angel limits." } },
    { id: 496, type: "game", p: 105, isPeak: true, icon: '🌸', source: "Like a Dragon", ar: { name: "كيريو (التنين الكامل)", ability: "التنين الأسطوري الكامل", lore: "كيريو في ذروة أسلوبه كالتنين. لا شيء يقف أمام غضبه الكامل." }, en: { name: "KIRYU (Dragon Peak)", ability: "Complete Dragon", lore: "Kiryu at Dragon Style peak. Nothing withstands his complete fury." } },
    { id: 497, type: "comic", p: 106, isPeak: true, icon: '🌑', source: "Marvel Comics", ar: { name: "فينوم (الإله الأسود)", ability: "الكيان الفضائي الكامل", lore: "فينوم بعد استيعاب كل الكيانات الفضائية. أسود الفضاء المطلق." }, en: { name: "VENOM (Black God)", ability: "Complete Alien Entity", lore: "Venom after absorbing all alien symbiotes. Absolute Black Space God." } },
    { id: 498, type: "comic", p: 107, isPeak: true, icon: '🔴', source: "Marvel Comics", ar: { name: "كارنيج (الكون)", ability: "دم الكون", lore: "كارنيج بعد اندماجه مع القوة الكونية. يلوث الكون بالجنون." }, en: { name: "CARNAGE (Cosmic)", ability: "Cosmic Blood", lore: "Carnage fused with cosmic power, infecting the universe with madness." } },
    { id: 499, type: "series", p: 107, isPeak: true, icon: '🌊', source: "Aquaman", ar: { name: "أرثر كوري (ملك الملوك)", ability: "عرش المحيطات الكوني", lore: "أرثر كوري بعد استيعاب قوة أطلانتس القديمة بالكامل." }, en: { name: "ARTHUR CURRY (Ocean King)", ability: "Cosmic Ocean Throne", lore: "Arthur Curry fully absorbing ancient Atlantean power." } },
    { id: 500, type: "comic", p: 110, isPeak: true, icon: '🌌', source: "Marvel/DC", ar: { name: "الكائن الكوني الأعظم", ability: "مطلق الوجود الكلي", lore: "الكيان الذي يتجاوز كل ما عرفه الخيال. لا قانون يقيده، لا حد يوقفه." }, en: { name: "SUPREME COSMIC ENTITY", ability: "Total Absolute Existence", lore: "The entity that transcends all imagination. No law binds it, no limit stops it." } },

    // 
    // DISCO ELYSIUM
    // 
    { id: 501, type: "game", p: 82, icon: '🥃', source: "Disco Elysium", ar: { name: "هاري دوبوا", ability: "التفكيك الداخلي", lore: "المحقق الذي نسي هويته بعد ليلة عنيفة. يحقق في جريمة قتل ويعيد بناء نفسه من الصفر. عقله ساحة حرب من الأفكار المتناقضة." }, en: { name: "HARRY DU BOIS", ability: "Thought Cabinet", lore: "The detective who forgot himself after one catastrophic night. Investigating a murder while rebuilding his identity from scratch. His mind is a battleground of contradictory ideas." } },
    { id: 502, type: "game", p: 80, icon: '🚬', source: "Disco Elysium", ar: { name: "كيم كاتساراكي", ability: "الهدوء المطلق", lore: "الشريك المثالي. مظبوط، منضبط، ويحمل هاري دوبوا من هشيمه الداخلي." }, en: { name: "KIM KITSURAGI", ability: "Absolute Composure", lore: "The perfect partner. Precise, disciplined, carrying Harry Du Bois from his inner wreckage." } },
    { id: 503, type: "game", p: 79, icon: '⭐', source: "Disco Elysium", ar: { name: "هاري (سيكريتشن)", ability: "الحقيقة المرة", lore: "نسخة هاري المثالية التي ولدت من ركام الفشل. يرى الحقيقة بوضوح لا يطيقه أحد." }, en: { name: "HARRY (Superstar Cop)", ability: "Bitter Truth", lore: "The perfect version of Harry born from the ruins of failure. Sees truth with a clarity nobody else can bear." } },
    { id: 504, type: "game", p: 78, icon: '🌿', source: "Disco Elysium", ar: { name: "سيلفيستر ماير", ability: "التقارير الميدانية", lore: "المحقق الثاني من نفس الدائرة. يسير في ظل هاري دوبوا دائماً." }, en: { name: "JEAN VICQUEMARE", ability: "Field Reports", lore: "Harry's colleague who carries the weight of his partner's endless chaos." } },

    // 
    // WARHAMMER 40,000
    // 
    { id: 505, type: "game", p: 97, icon: '⚙️', source: "Warhammer 40K", ar: { name: "الإمبراطور البشري", ability: "الإرادة الذهبية", lore: "أعظم نفسان عرفته البشرية. يجلس على عرش الجماجم منذ عشرة آلاف سنة يحمي البشرية بإرادته وحده." }, en: { name: "THE EMPEROR OF MANKIND", ability: "Golden Will", lore: "The greatest psyker humanity ever knew. Sitting on the Golden Throne for ten thousand years, protecting humanity through sheer will alone." } },
    { id: 506, type: "game", p: 95, icon: '🦅', source: "Warhammer 40K", ar: { name: "رابتر غيليمان", ability: "الفاتح الأبدي", lore: "بريمارك الفيلق الأول. عاد من بين الأموات ليقود البشرية مجدداً في حرب لا تنتهي." }, en: { name: "ROBOUTE GUILLIMAN", ability: "Eternal Conqueror", lore: "Primarch of the First Legion, returned from death to lead humanity again in a war without end." } },
    { id: 507, type: "game", p: 94, icon: '🌑', source: "Warhammer 40K", ar: { name: "هوروس لوبرمل", ability: "الكفر المطلق", lore: "أعظم بريمارك وأكبر خائن في التاريخ. قاد التمرد ضد أبيه الإمبراطور وكاد يدمر البشرية." }, en: { name: "HORUS LUPERCAL", ability: "Absolute Heresy", lore: "The greatest Primarch and history's greatest traitor. Led the Heresy against the Emperor and nearly destroyed humanity." } },
    { id: 508, type: "game", p: 93, icon: '🔥', source: "Warhammer 40K", ar: { name: "أنجروس مالكادور", ability: "نيران الأثير", lore: "بريمارك فيلق الرماة الهزاع. يحرق الأعداء بالنار الذهنية ويؤمن بالسحر حين الجميع ينكره." }, en: { name: "MAGNUS THE RED", ability: "Aetheric Flames", lore: "Primarch of the Thousand Sons. Burns enemies with psychic fire and embraced sorcery when all others condemned it." } },
    { id: 509, type: "game", p: 92, icon: '🐺', source: "Warhammer 40K", ar: { name: "ليمان روس", ability: "مخلب الذئب", lore: "بريمارك الفضاء الذئاب. المحارب الأشرس والأوفى. يمزق الدروع بيديه الفارغتين." }, en: { name: "LEMAN RUSS", ability: "Wolf Claw", lore: "Primarch of the Space Wolves. Fiercest and most loyal warrior. Tears armor apart with his bare hands." } },
    { id: 510, type: "game", p: 91, icon: '☠️', source: "Warhammer 40K", ar: { name: "مورتاريون", ability: "الطاعون الأبدي", lore: "بريمارك فيلق الموت الذي قبل نعمة نورغل. جسده مستنقع متعفن لكن قوته تتجاوز فهم البشر." }, en: { name: "MORTARION", ability: "Death Guard", lore: "Primarch who embraced Nurgle's blessing. His body is a rotting swamp but his power transcends human comprehension." } },
    { id: 511, type: "game", p: 90, icon: '⚡️', source: "Warhammer 40K", ar: { name: "غزبريل أنجيلوس", ability: "حكم الإبادة", lore: "الكابتن الجنرال لحرس الإمبراطور. يمثل سيف الإمبراطور وعدالته في الكون." }, en: { name: "GABRIEL ANGELOS", ability: "Dawn of War", lore: "Chapter Master of the Blood Ravens. Battles Chaos and xenos with unbreakable faith." } },
    { id: 512, type: "game", p: 89, icon: '💀', source: "Warhammer 40K", ar: { name: "أباددون المدمر", ability: "الإمبراطور الأسود", lore: "بطل الفوضى الأبدي. يقود حملات الحرمان الكبرى لمحق الإمبراطور الذهبي." }, en: { name: "ABADDON THE DESPOILER", ability: "Warmaster of Chaos", lore: "Eternal Champion of Chaos, leading the Black Crusades to destroy the Golden Emperor." } },
    { id: 513, type: "game", p: 88, icon: '🤖', source: "Warhammer 40K", ar: { name: "كيلار-تيتان", ability: "سيف المجمع", lore: "القاتل الآلي المصنوع خصيصاً لاغتيال الأهداف البشرية والخارقة بصمت مطلق." }, en: { name: "CULEXUS ASSASSIN", ability: "Pariah Null", lore: "The void in the Warp, a living blank that shuts down all psychic power within range." } },
    { id: 514, type: "game", p: 87, icon: '🛡️', source: "Warhammer 40K", ar: { name: "فارس الرعد", ability: "درع الطاعة", lore: "الجندي المدجج لفيلق فضائي. أقوى مشاة حرب في تاريخ البشرية." }, en: { name: "SPACE MARINE", ability: "Adamantine Will", lore: "The armored soldier of a Space Marine Chapter. The strongest infantry in the history of mankind." } },
    { id: 515, type: "game", p: 86, icon: '🦾', source: "Warhammer 40K", ar: { name: "دريدنوت", ability: "الحرب السرمدية", lore: "محارب مستحيل الموت يمشي في درع ضخم يحمل روحه المحطمة." }, en: { name: "DREADNOUGHT", ability: "Eternal War Machine", lore: "A shattered hero walking in a massive armor, his broken spirit carrying the chapter's memory." } },

    // Peak Warhammer
    { id: 516, type: "game", p: 108, isPeak: true, icon: '👑', source: "Warhammer 40K", ar: { name: "الإمبراطور (السيف الذهبي)", ability: "الإرادة الكونية الكاملة", lore: "الإمبراطور إذا أطلق من عرشه. قوة نفسانية تحرق أكواناً كاملة وتمحو الفوضى من الوجود." }, en: { name: "THE EMPEROR (Unbound)", ability: "Complete Cosmic Will", lore: "The Emperor if ever freed from his Throne. Psychic might that burns entire universes and erases Chaos from existence." } },
    { id: 517, type: "game", p: 106, isPeak: true, icon: '🌑', source: "Warhammer 40K", ar: { name: "هوروس (ختم الفوضى)", ability: "تجسد الفوضى", lore: "هوروس بعد استيعاب قوى الآلهة الأربعة. كيان يتجاوز البريمارك ويصل مستوى الآلهة." }, en: { name: "HORUS (Chaos Ascendant)", ability: "Chaos Incarnate", lore: "Horus having absorbed the Four Chaos Gods' power. A being beyond Primarch, approaching divinity." } },
    { id: 518, type: "game", p: 105, isPeak: true, icon: '🔥', source: "Warhammer 40K", ar: { name: "ماغنوس (الحقيقة الكاملة)", ability: "الأثير المطلق", lore: "ماغنوس في ذروة قوته النفسانية. يمحو الجيوش من الوجود بنظرة واحدة." }, en: { name: "MAGNUS (Full Truth)", ability: "Absolute Aether", lore: "Magnus at the peak of his psychic power. Erasing armies from existence with a single gaze." } }

];


    function getPeakCount() { return heroes.filter(h => h.isPeak).length; }

    function renderGrid(filter, query) {
        const grid = document.getElementById('hero-grid');
        grid.innerHTML = '';
        let list = [...heroes];
        if (filter === 'peak') list = list.filter(h => h.isPeak);
        else if (filter === 'fav') list = list.filter(h => gzFavSet.has(h.id));
        else if (filter !== 'all') list = list.filter(h => h.type === filter);
        if (query && query.trim()) {
            const q = query.trim().toLowerCase();
            list = list.filter(h => h[currentLang].name.toLowerCase().includes(q) || h.source.toLowerCase().includes(q));
        }
        if (list.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>${currentLang === 'ar' ? 'لا توجد نتائج' : 'NO RESULTS FOUND'}</p></div>`;
            return;
        }
        list.forEach((h, i) => {
            const isSelected = selected.find(s => s.id === h.id);
            const card = document.createElement('div');
            card.className = `card ${isSelected ? 'selected' : ''} ${h.isPeak ? 'peak' : ''}`;
            card.style.animationDelay = `${Math.min(i * 0.02, 0.5)}s`;
            const selNum = isSelected ? (selected.indexOf(isSelected) + 1) : '';
            const isFav = gzFavSet.has(h.id);
            const powerPct = Math.min(100, Math.max(3, (h.p - 70) / 40 * 100));
            card.innerHTML = `<div class="card-inner">
                <span class="card-badge">${h.type.toUpperCase()}</span>
                <div class="selected-indicator">${selNum}</div>
                <button class="fav-btn${isFav?' fav-on':''}" title="${isFav?'إزالة من المفضلة':'إضافة للمفضلة'}">♥</button>
                <div class="card-icon">${h.icon}</div>
                <div class="card-name">${h[currentLang].name}</div>
                <div class="card-source">${h.source}</div>
                <div class="card-pbar"><div class="card-pfill" style="width:${powerPct}%"></div></div>
                ${h.isPeak ? '<div class="peak-tag">PEAK</div>' : ''}
                <button class="card-info-btn">ℹ</button>
            </div>`;
            card.onclick = () => selectHero(card, h);
            card.querySelector('.fav-btn').onclick = (e) => { e.stopPropagation(); gzToggleFav(h.id); };
            card.querySelector('.card-info-btn').onclick = (e) => { e.stopPropagation(); gzOpenDetail(h.id); };
            grid.appendChild(card);
        });
    }

    function selectHero(el, hero) {
        const idx = selected.findIndex(s => s.id === hero.id);
        if (idx !== -1) selected.splice(idx, 1);
        else if (selected.length < 2) selected.push(hero);
        else return;
        document.getElementById('stat-selected').innerText = selected.length;
        const controls = document.getElementById('battle-controls');
        if (selected.length > 0) {
            controls.classList.add('show');
            document.getElementById('sel-name-1').innerText = selected[0] ? selected[0][currentLang].name : '—';
            document.getElementById('sel-name-2').innerText = selected[1] ? selected[1][currentLang].name : '—';
        } else { controls.classList.remove('show'); }
        renderGrid(currentFilter, searchQuery);
    }

    function clearSelection() {
        selected = [];
        document.getElementById('stat-selected').innerText = '0';
        document.getElementById('battle-controls').classList.remove('show');
        renderGrid(currentFilter, searchQuery);
    }

    function filterHeroes(type, btn) {
        currentFilter = type;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGrid(type, searchQuery);
    }

    function handleSearch(q) { searchQuery = q; renderGrid(currentFilter, q); }

    function runBattle() {
        if (selected.length < 2) return;
        const h1 = selected[0], h2 = selected[1];
        const winner = h1.p >= h2.p ? h1 : h2;
        const loser = winner === h1 ? h2 : h1;
        const diff = Math.abs(h1.p - h2.p);
        const overlay = document.getElementById('battle-overlay');
        overlay.classList.add('show');
        document.getElementById('battle-result').style.display = 'none';
        document.getElementById('luck-section').style.display = 'none';
        let intensity, intClass, intText;
        if (diff <= 3) { intensity = "epic"; intClass = "int-epic"; intText = currentLang === 'ar' ? "🔥 EPIC — معركة ملحمية" : "🔥 EPIC BATTLE"; }
        else if (diff <= 10) { intensity = "hard"; intClass = "int-hard"; intText = currentLang === 'ar' ? "⚡ معركة شرسة" : "⚡ HARD BATTLE"; }
        else if (diff <= 20) { intensity = "med"; intClass = "int-med"; intText = currentLang === 'ar' ? "⚔️ معركة متوازنة" : "⚔️ BALANCED DUEL"; }
        else { intensity = "easy"; intClass = "int-easy"; intText = currentLang === 'ar' ? "🎯 سيطرة كاملة" : "🎯 TOTAL DOMINANCE"; }
        const showCount = intensity === "epic" || intensity === "hard";
        function showResult() {
            document.getElementById('countdown').style.display = 'none';
            const result = document.getElementById('battle-result');
            result.style.display = 'block';
            document.getElementById('winner-title').innerText = winner[currentLang].name + (currentLang === 'ar' ? " ينتصر!" : " WINS!");
            const badge = document.getElementById('intensity-badge');
            badge.className = `intensity-badge ${intClass}`; badge.innerText = intText;
            document.getElementById('fi-1').innerHTML = h1.icon; document.getElementById('fn-1').innerText = h1[currentLang].name;
            document.getElementById('fa-1').innerText = h1[currentLang].ability; document.getElementById('fs-1').innerText = h1.p;
            document.getElementById('fi-2').innerHTML = h2.icon; document.getElementById('fn-2').innerText = h2[currentLang].name;
            document.getElementById('fa-2').innerText = h2[currentLang].ability; document.getElementById('fs-2').innerText = h2.p;
            document.getElementById('fc-1').className = 'fighter-card ' + (winner === h1 ? 'winner' : 'loser');
            document.getElementById('fc-2').className = 'fighter-card ' + (winner === h2 ? 'winner' : 'loser');
            document.getElementById('hp-name-1').innerText = h1[currentLang].name;
            document.getElementById('hp-name-2').innerText = h2[currentLang].name;
            let pct = intensity === "epic" ? 51 + diff * 0.5 : intensity === "hard" ? 60 + diff * 0.4 : intensity === "med" ? 70 + diff * 0.3 : 85 + diff * 0.2;
            pct = Math.min(pct, 98);
            document.getElementById('hp-pct').innerText = Math.round(pct) + '%';
            setTimeout(() => { document.getElementById('hp-fill').style.width = pct + '%'; }, 300);
            const stories = {
                ar: { epic: `⚔️ معركة تاريخية! <strong>${winner[currentLang].name}</strong> هزم <strong>${loser[currentLang].name}</strong> بفارق ${diff} نقطة.`, hard: `💥 قتال شرس! <strong>${winner[currentLang].name}</strong> أثبت جدارته وهزم <strong>${loser[currentLang].name}</strong> بفارق ${diff} نقاط.`, med: `⚡ نزال متوازن انتهى لصالح <strong>${winner[currentLang].name}</strong> بفارق ${diff} نقطة.`, easy: `👑 سيطرة مطلقة! <strong>${winner[currentLang].name}</strong> هيمن بفارق ${diff} نقطة.` },
                en: { epic: `⚔️ HISTORIC CLASH! <strong>${winner[currentLang].name}</strong> defeated <strong>${loser[currentLang].name}</strong> by ${diff} points.`, hard: `💥 FIERCE BATTLE! <strong>${winner[currentLang].name}</strong> proved worth by ${diff} points.`, med: `⚡ Balanced duel won by <strong>${winner[currentLang].name}</strong>, ${diff} points ahead.`, easy: `👑 TOTAL DOMINANCE. <strong>${winner[currentLang].name}</strong> overwhelmed by ${diff} points.` }
            };
            document.getElementById('battle-story').innerHTML = stories[currentLang][intensity];
            setTimeout(() => gzRenderComments(gzBattleKey(h1.id, h2.id)), 150);
        }
        if (showCount) {
            const cd = document.getElementById('countdown'); cd.style.display = 'block'; let n = 3; cd.innerText = n;
            const t = setInterval(() => { n--; if (n > 0) { cd.innerText = n; } else { clearInterval(t); showResult(); } }, 1000);
        } else { setTimeout(showResult, 400); }
    }

    function startLuck() {
        document.getElementById('battle-overlay').classList.add('show');
        document.getElementById('battle-result').style.display = 'none';
        document.getElementById('countdown').style.display = 'none';
        document.getElementById('luck-section').style.display = 'block';
        resetRPS();
        document.getElementById('rps-h1-name').innerText = selected[0] ? selected[0][currentLang].name : '—';
        document.getElementById('rps-h2-name').innerText = selected[1] ? selected[1][currentLang].name : '—';
    }

    function resetRPS() {
        document.getElementById('rps-pick-phase').style.display = 'block';
        document.getElementById('rps-result-phase').style.display = 'none';
        if (selected[0]) document.getElementById('rps-h1-name').innerText = selected[0][currentLang].name;
        if (selected[1]) document.getElementById('rps-h2-name').innerText = selected[1][currentLang].name;
    }

    function playRPS(userKey) {
        const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };
        const keys = ['rock','paper','scissors'];
        const botKey = keys[Math.floor(Math.random() * 3)];
        const beats = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
        const h1 = selected[0], h2 = selected[1];
        const h1name = h1 ? h1[currentLang].name : '?';
        const h2name = h2 ? h2[currentLang].name : '?';
        let verdict, verdictClass, winnerName, clashIcon;
        if (userKey === botKey) { verdict = currentLang === 'ar' ? ' تعادل!' : ' DRAW!'; verdictClass = 'draw'; winnerName = ''; clashIcon = ''; document.getElementById('rps-p1').className = 'rps-player draw-state'; document.getElementById('rps-p2').className = 'rps-player draw-state'; }
        else if (beats[userKey] === botKey) { verdict = currentLang === 'ar' ? '️ انتصر ' + h1name + '!' : '️ ' + h1name + ' WINS!'; verdictClass = 'win'; winnerName = currentLang === 'ar' ? '<strong>' + h1name + '</strong> يفوز' : '<strong>' + h1name + '</strong> wins'; clashIcon = '👑'; document.getElementById('rps-p1').className = 'rps-player won'; document.getElementById('rps-p2').className = 'rps-player lost'; }
        else { verdict = currentLang === 'ar' ? '💀 انتصر ' + h2name + '!' : '💀 ' + h2name + ' WINS!'; verdictClass = 'lose'; winnerName = currentLang === 'ar' ? '<strong>' + h2name + '</strong> يفوز' : '<strong>' + h2name + '</strong> wins'; clashIcon = '💀'; document.getElementById('rps-p1').className = 'rps-player lost'; document.getElementById('rps-p2').className = 'rps-player won'; }
        document.getElementById('rps-user-emoji').textContent = emojis[userKey];
        document.getElementById('rps-bot-emoji').textContent = emojis[botKey];
        document.getElementById('rps-p1-name').innerText = h1name;
        document.getElementById('rps-p2-name').innerText = h2name;
        document.getElementById('rps-tag-you').innerText = currentLang === 'ar' ? 'أنت ('+h1name+')' : 'You ('+h1name+')';
        document.getElementById('rps-tag-bot').innerText = currentLang === 'ar' ? 'الخصم ('+h2name+')' : 'Bot ('+h2name+')';
        document.getElementById('rps-clash').textContent = clashIcon;
        const vEl = document.getElementById('rps-verdict'); vEl.className = 'rps-verdict-text ' + verdictClass; vEl.innerText = verdict;
        document.getElementById('rps-winner-line').innerHTML = winnerName;
        document.getElementById('rps-pick-phase').style.display = 'none';
        document.getElementById('rps-result-phase').style.display = 'block';
    }

    function closeBattle() { document.getElementById('battle-overlay').classList.remove('show'); document.getElementById('hp-fill').style.width = '50%'; }

    function showTab(tab) {
        document.getElementById('arena-page').style.display = tab === 'arena' ? 'block' : 'none';
        document.getElementById('lore-page').style.display = tab === 'lore' ? 'block' : 'none';
        document.getElementById('ai-page').style.display = tab === 'ai' ? 'block' : 'none';
        document.getElementById('btn-arena').classList.toggle('active', tab === 'arena');
        document.getElementById('btn-lore').classList.toggle('active', tab === 'lore');
        document.getElementById('btn-ai').classList.toggle('active', tab === 'ai');
        // Hide battle controls when switching to AI tab
        if (tab === 'ai') document.getElementById('battle-controls').classList.remove('show');
        if (tab === 'lore') renderLoreList();
        if (tab === 'ai' && !gzInitialized) { gzInit(); gzInitialized = true; }
    }

    function renderLoreList() {
        const grid = document.getElementById('lore-grid'); grid.innerHTML = '';
        document.getElementById('lore-viewer').style.display = 'none'; grid.style.display = 'grid';
        heroes.forEach(h => {
            const card = document.createElement('div');
            card.className = `card ${h.isPeak ? 'peak' : ''}`;
            card.innerHTML = `<div class="card-inner"><span class="card-badge">${h.type.toUpperCase()}</span><div class="card-icon">${h.icon}</div><div class="card-name">${h[currentLang].name}</div><div class="card-source">${h.source}</div><div style="font-size:0.65rem;color:var(--gold-dim);margin-top:4px;">${currentLang==='ar'?'اقرأ المخطوطة':'Read Lore'}</div>${h.isPeak ? '<div class="peak-tag">PEAK</div>' : ''}</div>`;
            card.onclick = () => openLore(h);
            grid.appendChild(card);
        });
    }

    function openLore(hero) {
        document.getElementById('lore-grid').style.display = 'none';
        document.getElementById('lore-viewer').style.display = 'block';
        document.getElementById('m-name').innerText = hero[currentLang].name + (hero.isPeak ? ' — PEAK FORM' : '');
        const text = hero[currentLang].lore;
        document.getElementById('m-text').innerHTML = `<span class="drop-cap">${text.charAt(0)}</span>${text.substring(1)}`;
    }

    function closeLore() { document.getElementById('lore-grid').style.display = 'grid'; document.getElementById('lore-viewer').style.display = 'none'; }

    function toggleLanguage() {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        const body = document.getElementById('main-body');
        body.lang = currentLang; body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.getElementById('lang-btn').innerText = currentLang === 'ar' ? 'EN' : 'AR';
        updateTexts();
        renderGrid(currentFilter, searchQuery);
        if (document.getElementById('lore-page').style.display === 'block') renderLoreList();
        if (selected.length > 0) {
            document.getElementById('sel-name-1').innerText = selected[0] ? selected[0][currentLang].name : '—';
            document.getElementById('sel-name-2').innerText = selected[1] ? selected[1][currentLang].name : '—';
        }
    }

    function updateTexts() {
        const ar = currentLang === 'ar';
        document.getElementById('btn-arena').innerText = ar ? 'ميدان القتال' : 'BATTLE ARENA';
        document.getElementById('btn-lore').innerText = ar ? 'المخطوطات' : 'ROYAL LORE';
        document.getElementById('txt-sub').innerText = ar ? 'GOLDEN ARENA — 518 CHAMPION' : 'GOLDEN ARENA — 518 CHAMPIONS';
        document.getElementById('f-all').innerText = ar ? 'الكل' : 'ALL';
        document.getElementById('f-game').innerText = ar ? '🎮 ألعاب' : '🎮 GAMES';
        document.getElementById('f-series').innerText = ar ? '📺 مسلسلات' : '📺 SERIES';
        document.getElementById('f-movie').innerText = ar ? '🎬 أفلام' : '🎬 MOVIES';
        document.getElementById('f-anime').innerText = ar ? '⚡ أنمي' : '⚡ ANIME';
        document.getElementById('f-comic').innerText = ar ? '💥 كوميكس' : '💥 COMICS';
        document.getElementById('f-peak').innerText = ar ? '🔥 الأساطير' : '🔥 LEGENDS';
        document.getElementById('txt-analyze').innerText = ar ? '⚔️ تحليل القوة' : '⚔️ ANALYZE';
        document.getElementById('txt-luck').innerText = ar ? '🎲 تحدي الحظ' : '🎲 LUCK';
        document.getElementById('txt-helper').innerText = ar ? 'لنساعدك على الاختيار' : 'HELP ME CHOOSE';
        document.getElementById('search-input').placeholder = ar ? 'ابحث عن بطل...' : 'Search champion...';
        document.getElementById('txt-new-battle').innerText = ar ? '↺ نزال جديد' : '↺ NEW BATTLE';
        document.getElementById('txt-back-rps').innerText = ar ? '↺ العودة' : '↺ BACK';
        document.getElementById('stat-lbl-total').innerText = ar ? 'بطل' : 'CHAMPIONS';
        document.getElementById('stat-lbl-peak').innerText = ar ? 'شكل ذروة' : 'PEAK FORMS';
        document.getElementById('stat-lbl-sel').innerText = ar ? 'مختار' : 'SELECTED';
        document.getElementById('luck-title').innerText = ar ? 'معركة الحظ' : 'BATTLE OF LUCK';
        document.getElementById('txt-rps-desc').innerText = ar ? 'اختر سلاحك لحسم المعركة:' : 'Choose to settle the score:';
        document.getElementById('txt-close-lore').innerText = ar ? 'إغلاق المخطوطة' : 'CLOSE MANUSCRIPT';
        document.getElementById('txt-back-lore').innerText = ar ? ' العودة للقائمة' : ' BACK TO LIST';
    }

    // 
    // GZ BOT AI LOGIC (prefixed with gz)
    // 
    let gzLang = 'ar';
    let gzIsBusy = false;
    let gzHistory = [];
    let gzMsgC = 0, gzDebC = 0, gzGameC = 0;
    let gzSel = [null, null];
    let gzInitialized = false;

    const GZ_GAME_KW = ['game','games','لعبة','ألعاب','gaming','fortnite','valorant','apex','pubg','gta','cod','fifa','cs2','zelda','elden','rpg','fps','ps5','xbox','شخصية','character','kratos','dante','doom'];

    const GZ_CHARS = [
        // ── Games ─────────────────────────────────────────────
        {id:'kratos',    ico:'⚡', name:'Kratos',       cat:'game',  game:'God of War',      power:97},
        {id:'doomguy',   ico:'💀', name:'Doom Slayer',  cat:'game',  game:'DOOM',            power:96},
        {id:'dante',     ico:'🔥', name:'Dante',        cat:'game',  game:'Devil May Cry',   power:94},
        {id:'2b',        ico:'🤖', name:'2B',           cat:'game',  game:'NieR Automata',   power:93},
        {id:'master',    ico:'🪖', name:'Master Chief', cat:'game',  game:'Halo',            power:92},
        {id:'cloud',     ico:'⚔️', name:'Cloud',        cat:'game',  game:'FF7',             power:91},
        {id:'bayonetta', ico:'💜', name:'Bayonetta',    cat:'game',  game:'Bayonetta',       power:90},
        {id:'jin',       ico:'👊', name:'Jin Kazama',   cat:'game',  game:'Tekken',          power:89},
        {id:'geralt',    ico:'🗡️', name:'Geralt',       cat:'game',  game:'The Witcher',     power:88},
        {id:'samus',     ico:'🚀', name:'Samus Aran',   cat:'game',  game:'Metroid',         power:87},
        {id:'ezio',      ico:'🦅', name:'Ezio',         cat:'game',  game:"Assassin's Creed",power:86},
        {id:'link',      ico:'🛡️', name:'Link',         cat:'game',  game:'Zelda',           power:85},
        {id:'dmc-nero',  ico:'🔵', name:'Nero',         cat:'game',  game:'Devil May Cry 5', power:84},
        {id:'arthurrdr2',ico:'🤠', name:'Arthur Morgan',cat:'game',  game:'RDR2',            power:82},
        {id:'ellie',     ico:'🏹', name:'Ellie',        cat:'game',  game:'TLOU',            power:79},
        {id:'aloy',      ico:'🌿', name:'Aloy',         cat:'game',  game:'Horizon',         power:83},
        {id:'corvo',     ico:'🎩', name:'Corvo',        cat:'game',  game:'Dishonored',      power:85},
        {id:'doomguy2',  ico:'🔴', name:'B.J. Blazkowicz',cat:'game',game:'Wolfenstein',     power:81},
        // ── Anime ─────────────────────────────────────────────
        {id:'goku',      ico:'🌀', name:'Goku',         cat:'anime', game:'Dragon Ball',     power:99},
        {id:'saitama',   ico:'👊', name:'Saitama',      cat:'anime', game:'One Punch Man',   power:100},
        {id:'naruto',    ico:'🍃', name:'Naruto',       cat:'anime', game:'Naruto',          power:95},
        {id:'ichigo',    ico:'⚫', name:'Ichigo',       cat:'anime', game:'Bleach',          power:94},
        {id:'gojo',      ico:'🔵', name:'Gojo Satoru',  cat:'anime', game:'Jujutsu Kaisen',  power:97},
        {id:'levi',      ico:'⚔️', name:'Levi Ackerman',cat:'anime', game:'Attack on Titan', power:88},
        {id:'luffy',     ico:'🌊', name:'Luffy',        cat:'anime', game:'One Piece',       power:96},
        {id:'zoro',      ico:'🗡️', name:'Roronoa Zoro', cat:'anime', game:'One Piece',       power:93},
        {id:'togata',    ico:'💥', name:'Mirio Togata', cat:'anime', game:'My Hero Academia',power:90},
        {id:'ryomen',    ico:'👹', name:'Ryomen Sukuna',cat:'anime', game:'Jujutsu Kaisen',  power:99},
        {id:'akaza',     ico:'🩸', name:'Akaza',        cat:'anime', game:'Demon Slayer',    power:91},
        {id:'mob',       ico:'💫', name:'Mob',          cat:'anime', game:'Mob Psycho 100',  power:96},
        // ── Movies / Marvel / DC ───────────────────────────────
        {id:'thanos',    ico:'💜', name:'Thanos',       cat:'comic', game:'Marvel',          power:98},
        {id:'thor',      ico:'⚡', name:'Thor',         cat:'comic', game:'Marvel',          power:96},
        {id:'superman',  ico:'🔴', name:'Superman',     cat:'comic', game:'DC',              power:99},
        {id:'batman',    ico:'🦇', name:'Batman',       cat:'comic', game:'DC',              power:87},
        {id:'ironman',   ico:'🔶', name:'Iron Man',     cat:'comic', game:'Marvel',          power:92},
        {id:'wanda',     ico:'🌹', name:'Scarlet Witch',cat:'comic', game:'Marvel',          power:97},
        {id:'wolverine', ico:'🐺', name:'Wolverine',    cat:'comic', game:'Marvel',          power:90},
        {id:'dr-strange',ico:'🌀', name:'Dr. Strange',  cat:'comic', game:'Marvel',          power:95},
        // ── Movies ─────────────────────────────────────────────
        {id:'terminator',ico:'🤖', name:'T-800',        cat:'movie', game:'Terminator',      power:88},
        {id:'john-wick', ico:'🔫', name:'John Wick',    cat:'movie', game:'John Wick',       power:84},
        {id:'neo',       ico:'🕶️', name:'Neo',          cat:'movie', game:'The Matrix',      power:93},
        {id:'predator',  ico:'👾', name:'Predator',     cat:'movie', game:'Predator',        power:89},
    ];

    const GZ_HOT = [
        {title:'كراتوس ضد دانتي — من الأقوى؟', tags:[{l:'POWER',c:'#ff5555'},{l:'LORE',c:'#ffaa00'},{l:'🔥 TOP',c:'#ff6b00'}], prompt:'نقاش عميق: كراتوس من God of War ضد دانتي من Devil May Cry. من سيكسب ولماذا؟'},
        {title:'PS5 ضد Xbox Series X — الحرب الأبدية 2025', tags:[{l:'CONSOLE',c:'#6496ff'},{l:'WAR',c:'#ff2244'}], prompt:'جادلني: PS5 أم Xbox Series X الأفضل في 2025؟'},
        {title:'Doom Slayer ضد كل شيء', tags:[{l:'DOOM',c:'#ff2244'},{l:'OP',c:'#ff5555'}], prompt:'هل Doom Slayer أقوى شخصية في تاريخ الألعاب؟'},
        {title:'Elden Ring أفضل لعبة في التاريخ؟', tags:[{l:'FROMSOFT',c:'#b44dff'},{l:'GOTY',c:'#ffd700'}], prompt:'هل Elden Ring تستحق لقب أفضل لعبة في التاريخ؟'},
        {title:'Valorant ضد CS2 — ملك الـ FPS', tags:[{l:'FPS',c:'#00c8ff'},{l:'ESPORTS',c:'#b44dff'}], prompt:'نقاش تنافسي: Valorant أم CS2 الأفضل في 2025؟'},
        {title:'Cloud ضد Link — البطل الأعظم', tags:[{l:'RPG',c:'#b44dff'},{l:'ICONIC',c:'#ffd700'}], prompt:'Cloud من FF7 ضد Link من Zelda. من أقوى وأفضل؟'},
    ];

    const GZ_TIERS = [
        {t:'S', cl:'gz-ts', c:'#ff5555', ids:['kratos','doomguy','dante','2b']},
        {t:'A', cl:'gz-ta', c:'#ffaa00', ids:['master','cloud','jin','geralt']},
        {t:'B', cl:'gz-tb', c:'#64c864', ids:['link','ezio']},
        {t:'C', cl:'gz-tc', c:'#6496ff', ids:['arthur','ellie']},
    ];

    const GZ_CHAR_BRIEF = GZ_CHARS.map(c => `${c.name}⚡${c.power}`).join(' | ');

    const GZ_SYS_AR = `أنت GZ Bot — خبير نقاشات الألعاب على موقع GamZone Golden Arena 518. شخصية مشاكسة وواثقة.
🔥 شخصيتك: لديك آراء قوية لا تتراجع عنها، تستمتع بالجدال، تعرف lore الألعاب بعمق.
لغتك: عربي عامي + مصطلحات Gaming (كلاتش، رانك، برو، OP، nerf، buff، feats، power scaling)
لا تجلس على الحياد — خذ موقف وادافع عنه بقوة!
عند تحليل المعارك: اذكر feats رسمية من الـ canon، قارن القوى بمنطق، وأعطِ حكماً واضحاً.

⚡ أبطال الـ Arena (اسم — قوة/100):
${GZ_CHAR_BRIEF}`;

    const GZ_SYS_EN = `You are GZ Bot — GamZone Golden Arena 518's argumentative gaming debate expert. Bold, opinionated, never neutral.
🔥 You LOVE being challenged — respond with even stronger arguments. Deep lore knowledge.
Never sit on the fence — commit to a position and defend it hard!
For battle analysis: cite official canon feats, compare power levels logically, give a clear verdict.

⚡ Arena Champions (name — power/100):
${GZ_CHAR_BRIEF}`;

    function gzInit() {
        gzBuildGrid();
        gzBuildDebates();
        gzBuildTierDynamic();
        gzShowWelcome();
    }

    function gzShowWelcome() {
        document.getElementById('gz-chatMsgs').innerHTML = '';
        gzHistory = []; gzMsgC = 0; gzDebC = 0; gzGameC = 0; gzUpStats();
        const m = gzLang === 'ar'
            ? `🎮 **GG يا بطل!** أنا GZ Bot — خبير نقاشات الألعاب.\n\nعندي آراء قوية وما أتراجع عنها 😤💪\n\nناقشني في:\n• **قوة الشخصيات** — كراتوس، دانتي، Doom Slayer...\n• **مقارنات الألعاب** — PS5 vs Xbox، Elden Ring...\n• **Tier Lists وتصنيفات**\n\nأو استخدم التابات! 🔥`
            : `🎮 **GG!** I'm GZ Bot — GamZone's gaming debate expert.\n\nI have STRONG opinions 😤💪\n\nDebate me on characters, games, tier lists!\n\nUse the tabs above! 🔥`;
        gzAddBot(m);
        gzSetQ(gzLang === 'ar'
            ? ['⚔️ أقوى شخصية؟', '🎮 PS5 ولا Xbox؟', '💀 Doom Slayer OP؟', '🔥 Elden Ring صعبة؟']
            : ['⚔️ Strongest character?', '🎮 PS5 or Xbox?', '💀 Is Doom Slayer OP?', '🔥 Elden Ring too hard?']);
    }

    function gzAddBot(text, extra = '') {
        const el = document.getElementById('gz-chatMsgs');
        const d = document.createElement('div');
        d.className = 'gz-msg gz-bot';
        const t = new Date().toLocaleTimeString('en', {hour:'2-digit', minute:'2-digit'});
        d.innerHTML = `<div class="gz-mav">GZ</div><div><div class="gz-bubble">${gzFmt(text)}${extra}</div><div class="gz-mtime">${t}</div></div>`;
        el.appendChild(d); gzScroll();
    }

    function gzAddError(msg, retryFn) {
        const el = document.getElementById('gz-chatMsgs');
        const d = document.createElement('div');
        d.className = 'gz-msg gz-bot';
        const t = new Date().toLocaleTimeString('en', {hour:'2-digit', minute:'2-digit'});
        d.innerHTML = `<div class="gz-mav" style="background:rgba(255,34,68,0.15);color:var(--gz-red)">!</div><div><div class="gz-bubble" style="border-color:rgba(255,34,68,0.3);background:rgba(255,34,68,0.06)"><span style="color:var(--gz-red)">⚠️ ${msg}</span><br><button onclick="this.closest('.gz-msg').remove();(${retryFn.name})();" style="margin-top:8px;padding:4px 12px;background:rgba(255,34,68,0.15);border:1px solid rgba(255,34,68,0.3);color:var(--gz-red);border-radius:4px;cursor:pointer;font-family:'Cairo',sans-serif;font-size:0.72rem;">${gzLang==='ar'?'🔄 إعادة المحاولة':'🔄 Retry'}</button></div><div class="gz-mtime">${t}</div></div>`;
        el.appendChild(d); gzScroll();
    }

    function gzAddUser(text) {
        const el = document.getElementById('gz-chatMsgs');
        const d = document.createElement('div');
        d.className = 'gz-msg gz-user';
        const t = new Date().toLocaleTimeString('en', {hour:'2-digit', minute:'2-digit'});
        d.innerHTML = `<div class="gz-mav">👤</div><div><div class="gz-bubble">${gzFmt(text)}</div><div class="gz-mtime">${t}</div></div>`;
        el.appendChild(d);
        gzMsgC++;
        if (GZ_GAME_KW.some(k => text.toLowerCase().includes(k))) gzGameC++;
        gzUpStats(); gzScroll();
    }

    function gzFmt(t) {
        return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
    }

    function gzScroll() { const e = document.getElementById('gz-chatMsgs'); setTimeout(() => e.scrollTop = e.scrollHeight, 60); }

    function gzShowType() {
        const el = document.getElementById('gz-chatMsgs');
        const d = document.createElement('div'); d.className = 'gz-msg gz-bot'; d.id = 'gz-typ';
        d.innerHTML = `<div class="gz-mav">GZ</div><div class="gz-bubble gz-typing-bub"><div class="gz-tdot"></div><div class="gz-tdot"></div><div class="gz-tdot"></div></div>`;
        el.appendChild(d); gzScroll();
    }

    function gzRemoveType() { const e = document.getElementById('gz-typ'); if (e) e.remove(); }

    function gzSetQ(arr) {
        const el = document.getElementById('gz-qwrap'); el.innerHTML = '';
        (arr || []).forEach((x, i) => {
            const b = document.createElement('button');
            b.className = 'gz-qchip' + (i >= 2 ? ' hot' : ''); b.textContent = x;
            b.onclick = () => { document.getElementById('gz-cinput').value = x; gzSendMsg(); };
            el.appendChild(b);
        });
    }

    function gzUpStats() {
        document.getElementById('gz-sMsgs').textContent = gzMsgC;
        document.getElementById('gz-sDebates').textContent = gzDebC;
        document.getElementById('gz-sGames').textContent = gzGameC;
        document.getElementById('gz-sLang').textContent = gzLang.toUpperCase();
    }

    async function gzSendMsg() {
        const inp = document.getElementById('gz-cinput');
        const txt = inp.value.trim();
        if (!txt || gzIsBusy) return;
        inp.value = ''; gzAutoR(inp); gzSetQ([]);
        gzAddUser(txt);
        const debKW = ['ضد','vs','أقوى','أفضل','strongest','best','compare','tier'];
        if (debKW.some(k => txt.toLowerCase().includes(k))) { gzDebC++; gzAnalyticsDebate(); }
        gzUpStats();
        gzHistory.push({role:'user', content:txt});
        if (gzHistory.length > 40) gzHistory.splice(0, 2);
        gzIsBusy = true; document.getElementById('gz-sbtn').disabled = true; gzShowType();
        try {
            let streamEl = null;
            const result = await gzCallAI(gzHistory, gzLang==='ar'?GZ_SYS_AR:GZ_SYS_EN, 1100, (tok, acc) => {
                if (!streamEl) { gzRemoveType(); streamEl = gzCreateStreamBubble(); }
                gzUpdateStreamBubble(streamEl, acc);
            });
            if (streamEl) gzFinalizeStreamBubble(streamEl, result.text);
            else { gzRemoveType(); gzAddBot(result.text); }
            gzHistory.push({role:'assistant', content:result.text});
            gzUpdateModelBadge(result.model_used);
            gzSetQ(gzLang === 'ar'
                ? ['🔥 أنا مختلف!', 'أثبت بالـ Lore!', 'مثال من القصة؟', 'من يتفوق عليه؟']
                : ['🔥 I disagree!', 'Prove it with lore!', 'Give a canon feat!', 'Who beats them?']);
        } catch(e) {
            gzRemoveType();
            gzAddError(gzLang==='ar' ? 'فشل الاتصال بجميع مزودي الـ AI. تحقق من الانترنت أو أضف مفتاحك في الإعدادات.' : 'All AI providers failed. Check your connection or add an API key in Settings.', gzSendMsg);
        }
        gzIsBusy = false; document.getElementById('gz-sbtn').disabled = false;
        document.getElementById('gz-cinput').focus();
    }

    function gzUpdateModelBadge(model) {
        const el = document.getElementById('gz-modelBadge');
        if (!el || !model) return;
        el.className = '';
        if (model.includes('master') && model.includes('gemini')) { el.textContent = '🔑 GEMINI MASTER • ONLINE'; el.classList.add('gz-model-master'); }
        else if (model.includes('master') && model.includes('openrouter')) { el.textContent = '🔑 OPENROUTER MASTER • ONLINE'; el.classList.add('gz-model-master'); }
        else if (model.includes('master'))        { el.textContent = '🔑 MASTER KEY • ONLINE';      el.classList.add('gz-model-master'); }
        else if (model.includes('openrouter'))    { el.textContent = 'OPENROUTER • ONLINE';         el.classList.add('gz-model-openrouter'); }
        else if (model.includes('mistral-small')) { el.textContent = '🔥 MISTRAL SMALL • FREE';     el.classList.add('gz-model-mistral'); }
        else if (model.includes('mistral'))       { el.textContent = 'MISTRAL • FREE';              el.classList.add('gz-model-mistral'); }
        else if (model.includes('pollinations-free')) { el.textContent = 'POLLINATIONS • FREE';     el.classList.add('gz-model-pollinations'); }
        else if (model.includes('pollinations-mistral')) { el.textContent = 'POLLINATIONS MISTRAL • FREE'; el.classList.add('gz-model-pollinations'); }
        else if (model.includes('pollinations-llama'))   { el.textContent = 'POLLINATIONS LLAMA • FREE';   el.classList.add('gz-model-pollinations'); }
        else if (model.includes('pollinations'))  { el.textContent = 'POLLINATIONS AI • FREE';      el.classList.add('gz-model-pollinations'); }
        else if (model.includes('2.0'))           { el.textContent = 'GEMINI 2.0 FLASH • ONLINE';   el.classList.add('gz-model-gemini2'); }
        else if (model.includes('1.5-flash'))     { el.textContent = 'GEMINI 1.5 FLASH • ONLINE';   el.classList.add('gz-model-gemini15'); }
        else if (model.includes('pro'))           { el.textContent = 'GEMINI 1.5 PRO • ONLINE';     el.classList.add('gz-model-pro'); }
        else if (model.includes('hack') || model.includes('gpt')) { el.textContent = 'GPT-4O MINI • FREE'; el.classList.add('gz-model-hack'); }
        else { el.textContent = `${model.toUpperCase().slice(0,22)} • ONLINE`; }
    }

    let gzActiveFilter = 'all';

    function gzFilterChars(cat) {
        gzActiveFilter = cat;
        document.querySelectorAll('.gz-filter-btn').forEach(b => b.classList.remove('active'));
        event?.target?.classList.add('active');
        gzBuildGrid();
    }

    function gzBuildGrid() {
        const g = document.getElementById('gz-charGrid'); g.innerHTML = '';
        const chars = gzActiveFilter === 'all' ? GZ_CHARS : GZ_CHARS.filter(c => c.cat === gzActiveFilter);
        chars.forEach(c => {
            const d = document.createElement('div');
            d.className = 'gz-char-card'; d.id = 'gz-cc-' + c.id;
            d.innerHTML = `<div class="gz-cico">${c.ico}</div><div class="gz-cname">${c.name}</div><div class="gz-cgame">${c.game}</div><div class="gz-cpow">⚡${c.power}</div>`;
            d.onclick = () => gzPickChar(c);
            g.appendChild(d);
        });
        // Re-mark selected
        if (gzSel[0]) document.getElementById('gz-cc-'+gzSel[0].id)?.classList.add('gz-sel');
        if (gzSel[1]) document.getElementById('gz-cc-'+gzSel[1].id)?.classList.add('gz-sel');
    }

    function gzPickChar(c) {
        if (gzSel[0]?.id === c.id) { gzSel[0] = null; document.getElementById('gz-cc-'+c.id).classList.remove('gz-sel'); gzUpdSlots(); return; }
        if (gzSel[1]?.id === c.id) { gzSel[1] = null; document.getElementById('gz-cc-'+c.id).classList.remove('gz-sel'); gzUpdSlots(); return; }
        if (!gzSel[0]) gzSel[0] = c;
        else if (!gzSel[1]) gzSel[1] = c;
        else { document.getElementById('gz-cc-'+gzSel[0].id)?.classList.remove('gz-sel'); gzSel[0] = gzSel[1]; gzSel[1] = c; }
        document.querySelectorAll('.gz-char-card').forEach(e => e.classList.remove('gz-sel'));
        if (gzSel[0]) document.getElementById('gz-cc-'+gzSel[0].id)?.classList.add('gz-sel');
        if (gzSel[1]) document.getElementById('gz-cc-'+gzSel[1].id)?.classList.add('gz-sel');
        gzAnalyticsPick(c.id);
        gzUpdSlots();
    }

    // ── Local Analytics ─────────────────────────────────────────────────
    const GZ_ANA_KEY = 'gz_analytics';
    function gzAnaLoad() { try { return JSON.parse(localStorage.getItem(GZ_ANA_KEY) || '{}'); } catch { return {}; } }
    function gzAnaSave(d) { localStorage.setItem(GZ_ANA_KEY, JSON.stringify(d)); }
    function gzAnalyticsPick(id) {
        const d = gzAnaLoad(); d[id] = (d[id] || 0) + 1; gzAnaSave(d);
    }
    function gzAnalyticsBattle() {
        const d = gzAnaLoad(); d['_battles'] = (d['_battles'] || 0) + 1; gzAnaSave(d);
    }
    function gzAnalyticsDebate() {
        const d = gzAnaLoad(); d['_debates'] = (d['_debates'] || 0) + 1; gzAnaSave(d);
    }
    function gzRenderAnalytics() {
        const el = document.getElementById('gz-analytics-panel');
        if (!el) return;
        const d = gzAnaLoad();
        const battles = d['_battles'] || 0, debates = d['_debates'] || 0;
        const chars = Object.entries(d).filter(([k]) => !k.startsWith('_')).sort((a,b)=>b[1]-a[1]).slice(0,8);
        const maxV = chars[0]?.[1] || 1;
        const bars = chars.map(([id, cnt]) => {
            const c = GZ_CHARS.find(x => x.id === id);
            if (!c) return '';
            const pct = Math.round(cnt/maxV*100);
            return `<div class="gz-ana-row"><span class="gz-ana-ico">${c.ico}</span><span class="gz-ana-name">${c.name}</span><div class="gz-ana-bar-wrap"><div class="gz-ana-bar" style="width:${pct}%"></div></div><span class="gz-ana-cnt">${cnt}</span></div>`;
        }).join('');
        el.innerHTML = `<div class="gz-ana-summary"><span>⚔️ معارك: <b>${battles}</b></span><span>💬 نقاشات: <b>${debates}</b></span></div>${bars || '<div style="color:var(--gz-muted);font-size:0.72rem;text-align:center;padding:10px">لا توجد بيانات بعد</div>'}`;
    }

    function gzUpdSlots() {
        const s1 = document.getElementById('gz-slot1'), s2 = document.getElementById('gz-slot2');
        const btn = document.getElementById('gz-battleBtn');
        if (gzSel[0]) { s1.className='gz-vs-slot gz-filled'; s1.innerHTML=`<span class="gz-vs-ico">${gzSel[0].ico}</span><span class="gz-vs-name">${gzSel[0].name}</span><span style="font-size:0.58rem;color:#ffd700">⚡${gzSel[0].power}</span>`; }
        else { s1.className='gz-vs-slot'; s1.innerHTML=`<span style="font-size:1.4rem;opacity:0.25">?</span><span style="font-size:0.62rem;color:var(--gz-muted)">Fighter 1</span>`; }
        if (gzSel[1]) { s2.className='gz-vs-slot gz-filled'; s2.innerHTML=`<span class="gz-vs-ico">${gzSel[1].ico}</span><span class="gz-vs-name">${gzSel[1].name}</span><span style="font-size:0.58rem;color:#ffd700">⚡${gzSel[1].power}</span>`; }
        else { s2.className='gz-vs-slot'; s2.innerHTML=`<span style="font-size:1.4rem;opacity:0.25">?</span><span style="font-size:0.62rem;color:var(--gz-muted)">Fighter 2</span>`; }
        btn.disabled = !(gzSel[0] && gzSel[1]);
        if (gzSel[0] && gzSel[1]) gzShowStatsCompare(gzSel[0], gzSel[1]);
        else { const sc = document.getElementById('gz-stats-compare'); if(sc) sc.style.display='none'; }
    }

    function gzShowStatsCompare(c1, c2) {
        const el = document.getElementById('gz-stats-compare');
        if (!el) return;
        const stats = [
            { label:'⚡ Power',    k:'power' },
            { label:'💨 Speed',    k:'speed' },
            { label:'🛡 Durability', k:'durability' },
            { label:'🧠 Intelligence', k:'intelligence' }
        ];
        function val(c, k) { return c[k] !== undefined ? c[k] : Math.round(c.power * (0.7 + Math.random()*0.4)); }
        const rows = stats.map(s => {
            const v1 = Math.min(100, Math.max(1, val(c1, s.k)));
            const v2 = Math.min(100, Math.max(1, val(c2, s.k)));
            const w1 = Math.round(v1/(v1+v2)*100);
            const w2 = 100-w1;
            return `<div class="gz-stats-row">
                <div>
                  <div class="gz-stat-val1">${c1.name} <b>${v1}</b></div>
                  <div class="gz-sbar-wrap gz-rev"><div class="gz-sbar-fill gz-sbar-c1" style="width:${v1}%"></div></div>
                </div>
                <div class="gz-stat-label">${s.label}</div>
                <div>
                  <div class="gz-stat-val2"><b>${v2}</b> ${c2.name}</div>
                  <div class="gz-sbar-wrap"><div class="gz-sbar-fill gz-sbar-c2" style="width:${v2}%"></div></div>
                </div>
              </div>`;
        }).join('');
        el.innerHTML = `<div class="gz-stats-box">${rows}</div>`;
        el.style.display = 'block';
    }

    async function gzStartBattle() {
        const c1 = gzSel[0], c2 = gzSel[1]; if (!c1 || !c2) return;
        gzSwitchMode('chat');
        const p = gzLang === 'ar'
            ? `حلل معركة بين ${c1.name} (${c1.game}) ضد ${c2.name} (${c2.game}) بناءً على الـ Lore الرسمي. من يكسب ولماذا؟`
            : `Analyze a battle between ${c1.name} (${c1.game}) vs ${c2.name} (${c2.game}) using official lore. Who wins and why?`;
        gzAddUser(`⚔️ ${c1.name} VS ${c2.name}`);
        gzHistory.push({role:'user', content:p});
        if (gzHistory.length > 40) gzHistory.splice(0, 2);
        gzDebC++; gzUpStats(); gzAnalyticsBattle();
        gzIsBusy = true; document.getElementById('gz-sbtn').disabled = true; gzShowType();
        try {
            let streamEl2 = null;
            const result = await gzCallAI(gzHistory, gzLang==='ar'?GZ_SYS_AR:GZ_SYS_EN, 1200, (tok, acc) => {
                if (!streamEl2) { gzRemoveType(); streamEl2 = gzCreateStreamBubble(); }
                gzUpdateStreamBubble(streamEl2, acc);
            });
            const reply = result.text || '⚠️ Error';
            gzUpdateModelBadge(result.model_used);
            if (streamEl2) gzFinalizeStreamBubble(streamEl2, reply); gzHistory.push({role:'assistant', content:reply});
            const tot = c1.power + c2.power;
            const w = c1.power >= c2.power ? c1 : c2;
            const pct1 = Math.round((c1.power/tot)*100), pct2 = 100 - pct1;
            const card = `<div class="gz-battle-result"><div class="gz-br-title">⚔️ BATTLE ANALYSIS • GZ BOT</div><div class="gz-br-vs"><div class="gz-br-side${w.id===c1.id?' gz-winner':''}"><div>${c1.ico} <span class="gz-sn">${c1.name}</span></div><div class="gz-sb"><div class="gz-sf" style="width:${pct1}%;background:linear-gradient(90deg,#ffd700,#ff6b00)"></div></div></div><div class="gz-vs-badge">VS</div><div class="gz-br-side${w.id===c2.id?' gz-winner':''}"><div>${c2.ico} <span class="gz-sn">${c2.name}</span></div><div class="gz-sb"><div class="gz-sf" style="width:${pct2}%;background:linear-gradient(90deg,#00c8ff,#b44dff)"></div></div></div></div><div class="gz-br-verdict">️ <strong style="color:#ffd700">${w.name}</strong> — الفائز المرجح</div><div class="gz-br-share"><button class="gz-share-btn" onclick="gzShareBattle('${c1.name}','${c2.name}','${w.name}',null)">📤 شارك النتيجة</button></div></div>`;
            const battleId = Date.now().toString(36);
            const voteBlock = gzCreateVoteBlock(battleId);
            const fullCard = card + voteBlock;
            if (streamEl2) { streamEl2.insertAdjacentHTML('beforeend', fullCard); } else { gzAddBot(reply, fullCard); }
            gzSetQ(gzLang==='ar' ? ['🔥 أنا مختلف!','وماذا لو كانوا في فريق؟'] : ['🔥 I disagree!','What if they teamed up?']);
        } catch(e) { gzRemoveType(); gzAddError(gzLang==='ar'?'فشل تحليل المعركة — حاول مجدداً.':'Battle analysis failed — try again.', gzStartBattle); }
        gzIsBusy = false; document.getElementById('gz-sbtn').disabled = false;
    }

    function gzBuildDebates() {
        const el = document.getElementById('gz-debatesList'); el.innerHTML = '';
        GZ_HOT.forEach((d, i) => {
            const tags = d.tags.map(t => `<span class="gz-dtag" style="color:${t.c};border-color:${t.c}33">${t.l}</span>`).join('');
            const div = document.createElement('div'); div.className = 'gz-debate-item';
            div.innerHTML = `<div class="gz-d-num">#${i+1}</div><div class="gz-d-title">${d.title}</div><div class="gz-d-meta">اضغط لبدء النقاش 🔥</div><div class="gz-d-tags">${tags}</div>`;
            div.onclick = () => { gzSwitchMode('chat'); document.getElementById('gz-cinput').value = d.prompt; gzSendMsg(); };
            el.appendChild(div);
        });
    }


    // 
    // DRAG & DROP TIER LIST
    // 
    const GZ_TIER_KEY = 'gz_custom_tier_v1';
    let gzDragChar = null;

    function gzSaveTier() {
        const rows = {};
        document.querySelectorAll('.gz-tier-row').forEach(row => {
            const t = row.querySelector('.gz-tier-lbl')?.textContent;
            if (!t) return;
            rows[t] = [...row.querySelectorAll('.gz-tchar')].map(c => c.dataset.id).filter(Boolean);
        });
        try { localStorage.setItem(GZ_TIER_KEY, JSON.stringify(rows)); } catch {}
    }

    function gzLoadTierData() {
        try { return JSON.parse(localStorage.getItem(GZ_TIER_KEY)); } catch { return null; }
    }

    function gzResetTier() {
        localStorage.removeItem(GZ_TIER_KEY);
        gzBuildTier();
    }

    function gzBuildTier() {
        const el = document.getElementById('gz-tierContent'); el.innerHTML = '';
        const savedData = gzLoadTierData();

        const rows = savedData
            ? Object.entries(savedData).map(([t, ids]) => {
                const row = GZ_TIERS.find(r => r.t === t) || { t, cl:'gz-tc', c:'#aaa' };
                return { ...row, ids };
              })
            : GZ_TIERS;

        rows.forEach(row => {
            const ids = row.ids || [];
            const chars = ids.map(id => {
                const c = GZ_CHARS.find(x => x.id === id);
                return c ? gzMakeTChar(c) : '';
            }).filter(Boolean).join('');

            const d = document.createElement('div');
            d.className = `gz-tier-row ${row.cl}`;
            d.dataset.tier = row.t;
            d.innerHTML = `<div class="gz-tier-lbl" style="color:${row.c||'#aaa'}">${row.t}</div><div class="gz-tier-chars" id="gz-tc-${row.t}">${chars}</div>`;

            // Drag-over drop zone
            const zone = d.querySelector('.gz-tier-chars');
            zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('gz-tier-over'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('gz-tier-over'));
            zone.addEventListener('drop', e => {
                e.preventDefault(); zone.classList.remove('gz-tier-over');
                if (gzDragChar) { zone.appendChild(gzDragChar); gzSaveTier(); }
            });
            el.appendChild(d);
        });

        // Reset button
        const rb = document.createElement('button');
        rb.className = 'gz-reset-tier-btn'; rb.textContent = '↺ إعادة الترتيب الأصلي';
        rb.onclick = gzResetTier; el.appendChild(rb);
    }

    function gzMakeTChar(c) {
        const d = document.createElement('div');
        d.className = 'gz-tchar'; d.draggable = true; d.dataset.id = c.id;
        d.innerHTML = `<div class="gz-tico">${c.ico}</div><div class="gz-tname">${c.name}</div>`;
        d.onclick = () => gzAskChar(c.name);
        d.addEventListener('dragstart', e => { gzDragChar = d; d.classList.add('gz-dragging'); });
        d.addEventListener('dragend', () => { gzDragChar = null; d.classList.remove('gz-dragging'); });
        return d.outerHTML; // will re-attach events via rebuild — use direct DOM instead
    }

    function gzBuildTierDynamic() {
        const el = document.getElementById('gz-tierContent'); el.innerHTML = '';
        const savedData = gzLoadTierData();
        const rows = savedData
            ? Object.entries(savedData).map(([t, ids]) => ({ t, ids, cl: (GZ_TIERS.find(r=>r.t===t)||{}).cl||'gz-tc', c: (GZ_TIERS.find(r=>r.t===t)||{}).c||'#aaa' }))
            : GZ_TIERS;

        rows.forEach(row => {
            const d = document.createElement('div');
            d.className = `gz-tier-row ${row.cl}`; d.dataset.tier = row.t;
            const zone = document.createElement('div'); zone.className = 'gz-tier-chars'; zone.id = 'gz-tc-' + row.t;
            const lbl = document.createElement('div'); lbl.className = 'gz-tier-lbl'; lbl.style.color = row.c||'#aaa'; lbl.textContent = row.t;
            d.appendChild(lbl); d.appendChild(zone);

            const ids = row.ids || [];
            ids.forEach(id => {
                const c = GZ_CHARS.find(x => x.id === id);
                if (c) zone.appendChild(gzMakeTCharEl(c));
            });
            if (!savedData) row.ids?.forEach(id => { const c = GZ_CHARS.find(x=>x.id===id); if(c) zone.appendChild(gzMakeTCharEl(c)); });

            zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('gz-tier-over'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('gz-tier-over'));
            zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('gz-tier-over'); if (gzDragChar) { zone.appendChild(gzDragChar); gzSaveTier(); } });
            el.appendChild(d);
        });

        const rb = document.createElement('button');
        rb.className = 'gz-reset-tier-btn'; rb.textContent = '↺ إعادة الترتيب الأصلي'; rb.onclick = gzResetTier;
        el.appendChild(rb);
    }

    function gzMakeTCharEl(c) {
        const d = document.createElement('div');
        d.className = 'gz-tchar'; d.draggable = true; d.dataset.id = c.id;
        d.innerHTML = `<div class="gz-tico">${c.ico}</div><div class="gz-tname">${c.name}</div>`;
        d.onclick = () => gzAskChar(c.name);
        d.addEventListener('dragstart', () => { gzDragChar = d; d.classList.add('gz-dragging'); });
        d.addEventListener('dragend', () => { gzDragChar = null; d.classList.remove('gz-dragging'); });
        return d;
    }


    function gzAskChar(name) {
        gzSwitchMode('chat');
        const q = gzLang === 'ar' ? `لماذا ${name} في هذا الترتيب؟ ناقشني!` : `Why is ${name} in their tier? Let's debate!`;
        document.getElementById('gz-cinput').value = q; gzSendMsg();
    }

    function gzAskTier() {
        gzSwitchMode('chat');
        const q = gzLang === 'ar' ? `ناقشني في هذا الـ Tier List! هل كراتوس يستحق S-tier؟` : `Let's debate this Tier List! Does Kratos deserve S-tier?`;
        document.getElementById('gz-cinput').value = q; gzSendMsg();
    }

    function gzSwitchMode(mode) {
        document.querySelectorAll('.ai-mode-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('gz-tab-' + mode).classList.add('active');
        ['battle','debates','tier','generate','settings','history','tourney','analytics','scale'].forEach(m => {
            const p = document.getElementById('gz-panel-' + m);
            if (p) p.classList.remove('active');
        });
        if (mode !== 'chat') {
            const panel = document.getElementById('gz-panel-' + mode);
            if (panel) panel.classList.add('active');
        }
        if (mode === 'history') { gzHistRender(); }
        if (mode === 'tourney') { gzRenderTourney(); }
        if (mode === 'tier') { gzBuildTierDynamic(); }
        if (mode === 'generate') {
            setTimeout(() => document.getElementById('gz-genInput')?.focus(), 80);
        }
        if (mode === 'settings') { gzRefreshKeyUI(); }
        if (mode === 'analytics') { gzRenderAnalytics(); }
        if (mode === 'scale') { gzBuildScale(); }
    }

    // ── Built-in Free Keys ──────────────────────────────────────────────────
    const GZ_MISTRAL_KEY   = '1geDEGj3tWWZZfWddqr3LJKLEkokr1zo';
    const GZ_MISTRAL_MODEL = 'mistral-small-latest';
    const GZ_GROQ_MODEL    = 'llama-3.1-8b-instant';

    // ── Master API Key (user-provided premium, optional) ────────────────────
    let gzMasterKey  = localStorage.getItem('gz_master_key')  || '';
    let gzMasterProv = localStorage.getItem('gz_master_prov') || 'gemini';

    // ── Direct AI Calling System — يعمل 100% بدون سيرفر ───────────────────
    // ── SSE stream reader (shared by Mistral, Pollinations, OpenRouter) ────
    async function gzReadSSE(res, onChunk) {
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = '', full = '';
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            buf += dec.decode(value, {stream: true});
            const lines = buf.split('\n');
            buf = lines.pop();
            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const d = line.slice(6).trim();
                if (d === '[DONE]') continue;
                try {
                    const j = JSON.parse(d);
                    const tok = j.choices?.[0]?.delta?.content || '';
                    if (tok) { full += tok; if (onChunk) onChunk(tok, full); }
                } catch {}
            }
        }
        return full;
    }

    // ── Main dispatcher ──────────────────────────────────────────────────
    async function gzCallAI(messages, system, maxTokens, onChunk) {
        if (gzMasterKey) {
            try {
                if (gzMasterProv === 'openrouter') return await gzCallOpenRouter(messages, system, maxTokens, gzMasterKey, onChunk);
                if (gzMasterProv === 'mistral2') return await gzCallMistralKey(messages, system, maxTokens, gzMasterKey, onChunk);
                return await gzCallGemini(messages, system, maxTokens, gzMasterKey, onChunk);
            } catch(e) { /* fall through to free */ }
        }
        try { return await gzCallMistral(messages, system, maxTokens, onChunk); } catch(e) { /* fall through */ }
        return await gzCallPollinations(messages, system, onChunk);
    }

    async function gzCallGemini(messages, system, maxTokens, apiKey, onChunk) {
        const contents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{text: m.content}]
        }));
        const body = { contents, generationConfig: { maxOutputTokens: maxTokens } };
        if (system) body.systemInstruction = { parts: [{text: system}] };
        if (onChunk) {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}&alt=sse`, {
                method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Gemini ' + res.status);
            const reader = res.body.getReader(); const dec = new TextDecoder();
            let buf = '', full = '';
            while (true) {
                const {done, value} = await reader.read(); if (done) break;
                buf += dec.decode(value, {stream:true});
                const lines = buf.split('\n'); buf = lines.pop();
                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    try { const tok = JSON.parse(line.slice(6))?.candidates?.[0]?.content?.parts?.[0]?.text||''; if(tok){full+=tok; onChunk(tok,full);} } catch {}
                }
            }
            return { text: full, model_used: 'gemini-2.0-flash-master' };
        }
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return { text: data.candidates[0].content.parts[0].text, model_used: 'gemini-2.0-flash-master' };
    }

    async function gzCallOpenRouter(messages, system, maxTokens, apiKey, onChunk) {
        const msgs = system ? [{role:'system',content:system}, ...messages] : [...messages];
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`,'HTTP-Referer':location.origin},
            body: JSON.stringify({model:'meta-llama/llama-3.1-8b-instruct:free', messages: msgs, max_tokens: maxTokens, stream: !!onChunk})
        });
        if (!res.ok) throw new Error('OpenRouter ' + res.status);
        if (onChunk) {
            const full = await gzReadSSE(res, onChunk);
            return { text: full, model_used: 'openrouter-master' };
        }
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || 'OpenRouter error');
        return { text: data.choices[0].message.content, model_used: 'openrouter-master' };
    }

    async function gzCallMistral(messages, system, maxTokens, onChunk) {
        const msgs = system ? [{role:'system',content:system}, ...messages] : [...messages];
        const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {'Content-Type':'application/json','Authorization':`Bearer ${GZ_MISTRAL_KEY}`},
            body: JSON.stringify({model: GZ_MISTRAL_MODEL, messages: msgs, max_tokens: maxTokens, stream: !!onChunk})
        });
        if (!res.ok) throw new Error('Mistral ' + res.status);
        if (onChunk) {
            const full = await gzReadSSE(res, onChunk);
            return { text: full, model_used: 'mistral-small-free' };
        }
        const data = await res.json();
        return { text: data.choices[0].message.content, model_used: 'mistral-small-free' };
    }

    async function gzCallMistralKey(messages, system, maxTokens, apiKey, onChunk) {
        const msgs = system ? [{role:'system',content:system}, ...messages] : [...messages];
        const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
            body: JSON.stringify({model: GZ_MISTRAL_MODEL, messages: msgs, max_tokens: maxTokens, stream: !!onChunk})
        });
        if (!res.ok) throw new Error('Mistral2 ' + res.status);
        if (onChunk) {
            const full = await gzReadSSE(res, onChunk);
            return { text: full, model_used: 'mistral-user-key' };
        }
        const data = await res.json();
        return { text: data.choices[0].message.content, model_used: 'mistral-user-key' };
    }

    async function gzCallGroq(messages, system, maxTokens, onChunk) {
        const groqKey = localStorage.getItem('gz_groq_key') || '';
        if (!groqKey) throw new Error('No Groq key');
        const msgs = system ? [{role:'system',content:system}, ...messages] : [...messages];
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {'Content-Type':'application/json','Authorization':`Bearer ${groqKey}`},
            body: JSON.stringify({model: GZ_GROQ_MODEL, messages: msgs, max_tokens: maxTokens, stream: !!onChunk})
        });
        if (!res.ok) throw new Error('Groq ' + res.status);
        if (onChunk) {
            const full = await gzReadSSE(res, onChunk);
            return { text: full, model_used: 'groq-free' };
        }
        const data = await res.json();
        return { text: data.choices[0].message.content, model_used: 'groq-free' };
    }

    async function gzCallPollinations(messages, system, onChunk) {
        const msgs = system ? [{role:'system',content:system}, ...messages] : [...messages];
        const res = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({model:'openai', messages: msgs, stream: !!onChunk, seed: Math.floor(Math.random()*99999)})
        });
        if (!res.ok) throw new Error('Pollinations error');
        if (onChunk) {
            const full = await gzReadSSE(res, onChunk);
            return { text: full, model_used: 'pollinations-free' };
        }
        const data = await res.json();
        return { text: data.choices?.[0]?.message?.content || '', model_used: 'pollinations-free' };
    }

    // ── Streaming display helpers ─────────────────────────────────────────
    function gzCreateStreamBubble() {
        const el = document.getElementById('gz-chatMsgs');
        const d = document.createElement('div');
        d.className = 'gz-msg gz-bot'; d.id = 'gz-stream-bubble';
        const t = new Date().toLocaleTimeString('en', {hour:'2-digit', minute:'2-digit'});
        d.innerHTML = `<div class="gz-mav">GZ</div><div><div class="gz-bubble" id="gz-stream-content"></div><div class="gz-mtime">${t}</div></div>`;
        el.appendChild(d); gzScroll();
        return document.getElementById('gz-stream-content');
    }
    function gzUpdateStreamBubble(el, text) {
        el.innerHTML = gzFmt(text) + '<span class="gz-cursor"></span>';
        gzScroll();
    }
    function gzFinalizeStreamBubble(el, text, extra = '') {
        el.innerHTML = gzFmt(text) + extra;
    }

    function gzSetProv(prov) {
        gzMasterProv = prov;
        document.querySelectorAll('.gz-prov-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('gz-prov-' + prov)?.classList.add('active');
        const labels = { gemini: 'GEMINI API KEY', openrouter: 'OPENROUTER API KEY', mistral2: 'MISTRAL API KEY (console.mistral.ai)' };
        document.getElementById('gz-key-label').textContent = labels[prov] || 'API KEY';
    }

    function gzSaveApiKey() {
        const val = document.getElementById('gz-apiKeyInput').value.trim();
        if (!val) { gzApiStatus('err', 'أدخل مفتاحاً صالحاً'); return; }
        gzMasterKey  = val;
        localStorage.setItem('gz_master_key',  val);
        localStorage.setItem('gz_master_prov', gzMasterProv);
        const provName = {openrouter:'OpenRouter', mistral2:'Mistral'}[gzMasterProv] || 'Gemini';
        gzApiStatus('ok', `✓ تم حفظ مفتاح ${provName} — سيُستخدم كأولوية أولى`);
        gzRefreshKeyUI();
    }

    function gzClearApiKey() {
        gzMasterKey = '';
        localStorage.removeItem('gz_master_key');
        localStorage.removeItem('gz_master_prov');
        document.getElementById('gz-apiKeyInput').value = '';
        gzApiStatus('ok', 'تم مسح المفتاح — يعمل الآن بـ Mistral المجاني + Pollinations');
        gzRefreshKeyUI();
    }

    function gzApiStatus(type, msg) {
        const el = document.getElementById('gz-apiStatus');
        el.className = 'gz-api-status ' + type;
        el.textContent = msg;
        setTimeout(() => { el.style.display = 'none'; el.className = 'gz-api-status'; }, 4000);
    }

    function gzRefreshKeyUI() {
        const badge = document.getElementById('gz-activeKeyBadge');
        const txt   = document.getElementById('gz-activeKeyText');
        if (gzMasterKey) {
            const masked = gzMasterKey.slice(0, 6) + '••••••' + gzMasterKey.slice(-3);
            txt.textContent = `${gzMasterProv === 'openrouter' ? 'OpenRouter' : 'Gemini'}: ${masked}`;
            badge.style.display = 'block';
            gzSetProv(gzMasterProv);
            document.getElementById('gz-apiKeyInput').value = gzMasterKey;
        } else {
            badge.style.display = 'none';
        }
    }


    async function gzShareBattle(n1, n2, winner, analysis) {
        const txt = `⚔️ ${n1} VS ${n2}

🏆 الفائز: ${winner}

${(analysis||'').slice(0,280)}...

🎮 GAME ZONE: GOLDEN ARENA`;
        if (navigator.share) {
            try { await navigator.share({ title: `${n1} VS ${n2} — GZ BOT`, text: txt }); return; } catch {}
        }
        try {
            await navigator.clipboard.writeText(txt);
            const btn = document.querySelector('.gz-share-btn:focus');
            if (btn) { const old = btn.textContent; btn.textContent = '✅ تم النسخ!'; setTimeout(() => btn.textContent = old, 2000); }
        } catch { alert(txt); }
    }

    function gzHandleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gzSendMsg(); } }
    function gzAutoR(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 90) + 'px'; }
    function gzToggleLang() {
        gzLang = gzLang === 'ar' ? 'en' : 'ar';
        gzUpStats(); gzShowWelcome();
    }
    function gzClearChat() { gzHistSave(); gzShowWelcome(); }

    // 
    // CUSTOM CHARACTER SYSTEM (localStorage)
    // 
    const GZ_STORAGE_KEY = 'gz_custom_chars_v1';

    function gzLoadCustomChars() {
        try { return JSON.parse(localStorage.getItem(GZ_STORAGE_KEY) || '[]'); } catch { return []; }
    }

    function gzSaveCustomChars(arr) {
        try { localStorage.setItem(GZ_STORAGE_KEY, JSON.stringify(arr)); } catch {}
    }

    function gzAddToRoster(charData) {
        const list = gzLoadCustomChars();
        // Prevent duplicates by id
        if (list.some(c => c.id === charData.id)) {
            // Make unique with timestamp suffix
            charData.id = charData.id + '-' + Date.now().toString(36);
        }
        list.push(charData);
        gzSaveCustomChars(list);
        // Also add to GZ_CHARS for battle mode
        if (!GZ_CHARS.find(c => c.id === charData.id)) {
            GZ_CHARS.push({ id: charData.id, ico: charData.icon, name: charData[gzLang === 'ar' ? 'ar' : 'en'].name, game: charData.source, power: charData.p });
        }
        gzBuildGrid();
        gzRenderCustomGrid();
        return charData.id;
    }

    function gzRemoveCustomChar(id) {
        const list = gzLoadCustomChars().filter(c => c.id !== id);
        gzSaveCustomChars(list);
        const idx = GZ_CHARS.findIndex(c => c.id === id);
        if (idx !== -1) GZ_CHARS.splice(idx, 1);
        gzBuildGrid();
        gzRenderCustomGrid();
    }

    function gzRenderCustomGrid() {
        const grid = document.getElementById('gz-customGrid');
        const titleEl = document.getElementById('gz-savedTitle');
        if (!grid) return;
        const list = gzLoadCustomChars();
        grid.innerHTML = '';
        if (list.length === 0) { if (titleEl) titleEl.style.display = 'none'; return; }
        if (titleEl) titleEl.style.display = 'flex';
        list.forEach(c => {
            const name = c[gzLang === 'ar' ? 'ar' : 'en']?.name || c.en?.name || c.id;
            const d = document.createElement('div');
            d.className = 'gz-char-card gz-custom';
            d.innerHTML = `<div class="gz-cico">${c.icon || '⚡'}</div><div class="gz-cname" style="font-size:0.6rem">${name}</div><div class="gz-cgame">${c.source || ''}</div><div class="gz-cpow">⚡${c.p}</div>`;
            d.onclick = () => gzPickChar({ id: c.id, ico: c.icon || '⚡', name, game: c.source, power: c.p });
            // Long-press / right-click to remove
            d.title = 'انقر للاختيار • اضغط مطولاً للحذف';
            let pressTimer;
            d.addEventListener('mousedown', () => { pressTimer = setTimeout(() => { if (confirm(`حذف "${name}"?`)) gzRemoveCustomChar(c.id); }, 600); });
            d.addEventListener('mouseup', () => clearTimeout(pressTimer));
            d.addEventListener('mouseleave', () => clearTimeout(pressTimer));
            grid.appendChild(d);
        });
    }

    // ── Character Generator ──────────────────────────────────────────────
    let gzGenBusy = false;
    let gzGenPreviewData = null;

    async function gzGenerateChar() {
        if (gzGenBusy) return;
        const nameEl = document.getElementById('gz-genInput');
        const typeEl = document.getElementById('gz-genType');
        const name = nameEl?.value?.trim();
        if (!name || name.length < 2) { nameEl?.focus(); return; }
        const type = typeEl?.value || 'game';

        gzGenBusy = true;
        const btn = document.getElementById('gz-genBtn');
        if (btn) btn.disabled = true;

        const statusEl  = document.getElementById('gz-genStatus');
        const previewEl = document.getElementById('gz-genPreview');
        if (statusEl) {
            statusEl.style.display = 'flex';
            statusEl.innerHTML = `<div class="gz-gen-spin"></div><span>جاري توليد بيانات "${name}" بالـ AI...</span>`;
        }
        if (previewEl) previewEl.style.display = 'none';

        try {
            const charPrompt = `You are a gaming/anime/fiction character database expert. Generate a character profile for "${name}" (category: ${type}).

Respond with ONLY valid JSON, no markdown, no extra text:
{
  "id": "unique-kebab-case-id",
  "icon": "single_emoji",
  "source": "Official Game/Anime/Movie/Series Title",
  "type": "${type}",
  "p": 85,
  "isPeak": false,
  "ar": {
    "name": "Arabic character name",
    "ability": "Main power or ability in Arabic (short)",
    "lore": "2-3 sentence description in Arabic"
  },
  "en": {
    "name": "English character name",
    "ability": "Main power or ability (short)",
    "lore": "2-3 sentence description"
  }
}

Rules: p (power) is 50-100 based on actual strength. isPeak=true only for universe-level characters.`;

            const result = await gzCallAI([{role:'user', content:charPrompt}], null, 500);
            let jsonStr = result.text.replace(/```json\s*/g,'').replace(/```\s*/g,'').trim();
            const start = jsonStr.indexOf('{'), end = jsonStr.lastIndexOf('}');
            if (start === -1 || end === -1) throw new Error('فشل تحليل JSON');
            const char = JSON.parse(jsonStr.slice(start, end + 1));
            if (!char.id || !char.ar || !char.en) throw new Error('بيانات غير مكتملة');
            gzGenPreviewData = char;
            if (statusEl) statusEl.style.display = 'none';
            gzShowCharPreview(char);
        } catch (err) {
            if (statusEl) {
                statusEl.innerHTML = `<span style="color:var(--gz-red)">⚠️ ${err.message}</span>`;
            }
        }

        gzGenBusy = false;
        if (btn) btn.disabled = false;
    }

    function gzShowCharPreview(c) {
        const el = document.getElementById('gz-genPreview');
        if (!el) return;
        const arName = c.ar?.name || c.en?.name || c.id;
        const enName = c.en?.name || arName;
        const arAbility = c.ar?.ability || c.en?.ability || '';
        const arLore = c.ar?.lore || c.en?.lore || '';
        const peakTag = c.isPeak ? `<span style="background:var(--gz-red);color:#fff;font-size:0.52rem;font-family:'Orbitron',sans-serif;padding:2px 6px;border-radius:4px;margin-right:6px;">PEAK</span>` : '';
        el.innerHTML = `
            <div class="gz-prev-header">
                <div class="gz-prev-ico">${c.icon || '⚡'}</div>
                <div class="gz-prev-info">
                    <div class="gz-prev-name">${peakTag}${arName}</div>
                    <div class="gz-prev-source">${enName} • ${c.source || ''} • ${(c.type||'').toUpperCase()}</div>
                </div>
                <div class="gz-prev-pow">⚡ ${c.p}</div>
            </div>
            <div class="gz-prev-ability">⚔️ ${arAbility}</div>
            <div class="gz-prev-lore">${arLore}</div>
            <div class="gz-prev-actions">
                <button class="gz-prev-add" onclick="gzConfirmAdd()">✅ أضف للميدان</button>
                <button class="gz-prev-retry" onclick="gzGenerateChar()">🔄 توليد جديد</button>
            </div>`;
        el.style.display = 'block';
    }

    function gzConfirmAdd() {
        if (!gzGenPreviewData) return;
        const id = gzAddToRoster(gzGenPreviewData);
        const el = document.getElementById('gz-genPreview');
        if (el) el.innerHTML = `<div style="text-align:center;padding:16px;"><div style="font-size:1.5rem">✅</div><div style="color:#ffd700;font-family:'Orbitron',sans-serif;font-size:0.75rem;margin-top:6px;">تمت الإضافة للميدان!</div><div style="color:var(--gz-muted);font-size:0.65rem;margin-top:4px;">يمكنك استخدامها في وضع المعركة الآن</div></div>`;
        gzGenPreviewData = null;
        document.getElementById('gz-genInput').value = '';
        // Flash the battle tab to hint user
        const bt = document.getElementById('gz-tab-battle');
        if (bt) { bt.style.color = '#ffd700'; setTimeout(() => bt.style.color = '', 1200); }
    }

    // ── Extend gzInit to load custom chars ──────────────────────────────
    const _gzInitOrig = gzInit;
    gzInit = function() {
        _gzInitOrig();
        // Load saved custom characters into GZ_CHARS
        gzLoadCustomChars().forEach(c => {
            if (!GZ_CHARS.find(x => x.id === c.id)) {
                const name = c[gzLang === 'ar' ? 'ar' : 'en']?.name || c.en?.name || c.id;
                GZ_CHARS.push({ id: c.id, ico: c.icon || '⚡', name, game: c.source, power: c.p });
            }
        });
        gzBuildGrid();
        gzRenderCustomGrid();
    };


    // 
    // DISCUSSIONS HISTORY SYSTEM
    // 
    const GZ_HIST_KEY = 'gz_discussions_v1';
    const GZ_HIST_MAX = 10;

    function gzHistSave() {
        if (gzHistory.length < 2) return;
        const saved = gzHistLoad();
        const title = gzHistory.find(m => m.role === 'user')?.content?.slice(0, 60) || 'نقاش';
        const entry = { id: Date.now(), title, lang: gzLang, messages: [...gzHistory], date: new Date().toLocaleDateString('ar') };
        saved.unshift(entry);
        if (saved.length > GZ_HIST_MAX) saved.length = GZ_HIST_MAX;
        try { localStorage.setItem(GZ_HIST_KEY, JSON.stringify(saved)); } catch {}
    }

    function gzHistLoad() {
        try { return JSON.parse(localStorage.getItem(GZ_HIST_KEY) || '[]'); } catch { return []; }
    }

    function gzHistClear() {
        localStorage.removeItem(GZ_HIST_KEY);
        gzHistRender();
    }

    function gzHistOpen(entry) {
        gzSwitchMode('chat');
        document.getElementById('gz-chatMsgs').innerHTML = '';
        gzHistory = entry.messages;
        gzLang = entry.lang || gzLang;
        gzHistory.forEach(m => {
            if (m.role === 'user') gzAddUser(m.content);
            else gzAddBot(m.content);
        });
        gzMsgC = gzHistory.filter(m => m.role === 'user').length;
        gzUpStats();
    }

    function gzHistRender() {
        const el = document.getElementById('gz-histList');
        if (!el) return;
        const saved = gzHistLoad();
        if (!saved.length) {
            el.innerHTML = '<div style="color:var(--gz-muted);font-size:0.7rem;text-align:center;padding:16px;">لا يوجد نقاشات محفوظة بعد</div>';
            return;
        }
        el.innerHTML = saved.map((e, i) => `
            <div class="gz-hist-item" onclick="gzHistOpen(${JSON.stringify(e).replace(/"/g,'&quot;')})">
                <div class="gz-hist-title">${e.title}</div>
                <div class="gz-hist-meta">${e.date} • ${e.messages.length} رسالة</div>
            </div>`).join('');
    }


    // 
    // VOTE SYSTEM
    // 
    function gzVote(battleId, choice) {
        const key = 'gz_vote_' + battleId;
        if (localStorage.getItem(key)) return; // already voted
        localStorage.setItem(key, choice);
        const votes = JSON.parse(localStorage.getItem('gz_votes') || '{}');
        if (!votes[battleId]) votes[battleId] = { agree: 0, disagree: 0 };
        votes[battleId][choice]++;
        localStorage.setItem('gz_votes', JSON.stringify(votes));
        gzUpdateVoteUI(battleId);
    }

    function gzGetVotes(battleId) {
        const votes = JSON.parse(localStorage.getItem('gz_votes') || '{}');
        return votes[battleId] || { agree: 0, disagree: 0 };
    }

    function gzUpdateVoteUI(battleId) {
        const el = document.getElementById('gz-vote-' + battleId);
        if (!el) return;
        const v = gzGetVotes(battleId);
        const total = v.agree + v.disagree || 1;
        const voted = localStorage.getItem('gz_vote_' + battleId);
        el.innerHTML = `<div class="gz-vote-bar">
            <div class="gz-vote-agree" style="width:${Math.round(v.agree/total*100)}%"></div>
        </div>
        <div class="gz-vote-nums">
            <span style="color:var(--gz-green)">👍 ${v.agree} (${Math.round(v.agree/total*100)}%)</span>
            <span style="color:var(--gz-muted);font-size:0.6rem">${voted ? '✓ صوّت' : ''}</span>
            <span style="color:var(--gz-red)">👎 ${v.disagree} (${Math.round(v.disagree/total*100)}%)</span>
        </div>`;
        el.querySelectorAll('.gz-vote-btn').forEach(b => b.disabled = !!voted);
    }

    function gzCreateVoteBlock(battleId) {
        const v = gzGetVotes(battleId);
        return `<div class="gz-vote-block" id="gz-vote-${battleId}">
            <div class="gz-vote-q">هل تتفق مع تحليل الـ AI؟</div>
            <div class="gz-vote-btns">
                <button class="gz-vote-btn gz-vote-yes" onclick="gzVote('${battleId}','agree')">👍 أوافق</button>
                <button class="gz-vote-btn gz-vote-no" onclick="gzVote('${battleId}','disagree')">👎 لا أوافق</button>
            </div>
            <div class="gz-vote-bar"><div class="gz-vote-agree" style="width:0%"></div></div>
            <div class="gz-vote-nums"><span style="color:var(--gz-muted);font-size:0.65rem;">0 أصوات</span></div>
        </div>`;
    }


    // 
    // TOURNAMENT SYSTEM
    // 
    let gzTourney = null;

    function gzStartTourney() {
        const pool = [...GZ_CHARS].sort(() => Math.random() - 0.5).slice(0, 8);
        gzTourney = { round: 1, matches: [], winners: [], pool };
        // Build first round pairs
        for (let i = 0; i < pool.length; i += 2)
            gzTourney.matches.push({ c1: pool[i], c2: pool[i+1], winner: null, done: false });
        gzRenderTourney();
    }

    function gzRenderTourney() {
        const el = document.getElementById('gz-tourney-bracket');
        if (!el || !gzTourney) return;
        const { matches, round } = gzTourney;
        el.innerHTML = `<div class="gz-t-title">🏆 البطولة — الجولة ${round}</div>` +
            matches.map((m, i) => `
            <div class="gz-t-match ${m.done ? 'gz-t-done' : ''}">
                <div class="gz-t-fighter ${m.winner?.id===m.c1.id?'gz-t-win':''}">${m.c1.ico} ${m.c1.name} <span>⚡${m.c1.power}</span></div>
                <div class="gz-t-vs">VS</div>
                <div class="gz-t-fighter ${m.winner?.id===m.c2.id?'gz-t-win':''}">${m.c2.ico} ${m.c2.name} <span>⚡${m.c2.power}</span></div>
                ${!m.done ? `<button class="gz-t-fight-btn" onclick="gzRunTourneyMatch(${i})">⚔️ قاتل!</button>` : `<div class="gz-t-verdict">🏆 ${m.winner?.name} يتقدم</div>`}
            </div>`).join('') +
            (matches.every(m => m.done) ? `<button class="gz-t-next-btn" onclick="gzNextTourneyRound()">🏆 الجولة التالية ←</button>` : '');
    }

    async function gzRunTourneyMatch(idx) {
        const m = gzTourney.matches[idx];
        if (m.done || gzIsBusy) return;
        gzIsBusy = true;
        const btn = document.querySelectorAll('.gz-t-fight-btn')[idx];
        if (btn) btn.textContent = '⏳...';
        const prompt = `Quick 2-sentence battle verdict: ${m.c1.name} (power ${m.c1.power}) vs ${m.c2.name} (power ${m.c2.power}). Who wins and why? State winner clearly.`;
        try {
            const result = await gzCallAI([{role:'user',content:prompt}], null, 200);
            const text = result.text || '';
            const c1wins = text.toLowerCase().includes(m.c1.name.toLowerCase()) && m.c1.power >= m.c2.power;
            m.winner = c1wins ? m.c1 : m.c2;
            m.done = true; m.analysis = text;
            // Switch to chat and show result
            gzSwitchMode('chat');
            gzAddBot(`⚔️ **${m.c1.name} VS ${m.c2.name}** — ${text}

🏆 **الفائز: ${m.winner.name}**`);
        } catch(e) {
            m.winner = m.c1.power >= m.c2.power ? m.c1 : m.c2;
            m.done = true;
        }
        gzIsBusy = false;
        gzSwitchMode('battle');
        gzRenderTourney();
    }

    function gzNextTourneyRound() {
        const winners = gzTourney.matches.map(m => m.winner).filter(Boolean);
        if (winners.length === 1) {
            gzSwitchMode('chat');
            gzAddBot(`🏆🏆 **البطل المطلق: ${winners[0].name}** 🏆🏆

${winners[0].ico} ${winners[0].name} فاز بالبطولة!`);
            gzTourney = null;
            return;
        }
        gzTourney.round++;
        gzTourney.matches = [];
        for (let i = 0; i < winners.length; i += 2) {
            if (winners[i+1]) gzTourney.matches.push({ c1: winners[i], c2: winners[i+1], winner: null, done: false });
            else { gzTourney.matches.push({ c1: winners[i], c2: winners[i], winner: winners[i], done: true }); }
        }
        gzRenderTourney();
    }

    // 
    // FAVORITES SYSTEM
    // 
    function gzToggleFav(id) {
        if (gzFavSet.has(id)) gzFavSet.delete(id);
        else gzFavSet.add(id);
        localStorage.setItem('gz_favs_v1', JSON.stringify([...gzFavSet]));
        renderGrid(currentFilter, searchQuery);
    }

    // 
    // CHARACTER DETAIL MODAL
    // 
    const gzHeroMap = new Map(heroes.map(h => [h.id, h]));

    function gzOpenDetail(id) {
        const h = gzHeroMap.get(id);
        if (!h) return;
        const modal = document.getElementById('gz-detail-modal');
        const box = document.getElementById('gz-det-content');
        const lang = currentLang;
        const data = h[lang];
        const powerPct = Math.min(100, Math.max(4, (h.p - 70) / 40 * 100));
        const peakTag = h.isPeak ? '<div class="gz-det-peak-tag">⚡ PEAK FORM</div>' : '';
        const isFav = gzFavSet.has(h.id);
        box.innerHTML = `
            <button class="gz-det-close" onclick="document.getElementById('gz-detail-modal').classList.remove('show')">✕</button>
            <div class="gz-det-ico">${h.icon}</div>
            ${peakTag}
            <div class="gz-det-name">${data.name}</div>
            <div class="gz-det-src">${h.source} • ${h.type.toUpperCase()}</div>
            <div class="gz-det-pow-row">
                <span class="gz-det-pow-lbl">⚡ POWER LEVEL</span>
                <span class="gz-det-pow-val">${h.p}</span>
            </div>
            <div class="gz-det-pbar"><div class="gz-det-pfill" style="width:${powerPct}%"></div></div>
            <div class="gz-det-ability">⚔️ ${data.ability}</div>
            <div class="gz-det-lore">${data.lore}</div>
            <div style="display:flex;gap:8px;margin-top:2px;">
                <button class="gz-det-select" style="flex:1;" onclick="document.getElementById('gz-detail-modal').classList.remove('show');selectHero(null,gzHeroMap.get(${h.id}))">⚔️ اختر للمعركة</button>
                <button class="gz-det-select" style="flex:0 0 auto;padding:10px 14px;" onclick="gzToggleFav(${h.id});this.textContent=gzFavSet.has(${h.id})?'💔':'❤️'">${isFav?'💔':'❤️'}</button>
            </div>`;
        modal.classList.add('show');
        modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('show'); };
    }

    // 
    // RANDOM BATTLE
    // 
    function gzRandomBattle() {
        selected = [];
        const pool = heroes.filter(h => !h.isPeak);
        const idx1 = Math.floor(Math.random() * pool.length);
        let idx2;
        do { idx2 = Math.floor(Math.random() * pool.length); } while (idx2 === idx1);
        selected.push(pool[idx1], pool[idx2]);
        document.getElementById('stat-selected').innerText = 2;
        const ctrl = document.getElementById('battle-controls');
        ctrl.classList.add('show');
        document.getElementById('sel-name-1').innerText = selected[0][currentLang].name;
        document.getElementById('sel-name-2').innerText = selected[1][currentLang].name;
        renderGrid(currentFilter, searchQuery);
        setTimeout(runBattle, 200);
    }

    // 
    // POWER SCALING MODE
    // 
    const GZ_SCALE_TOPICS = [
        { e:'🌍', t:'محاربو كسر المستويات', s:'Goku، Saitama، Rimuru — من الأقوى؟', p:'ناقشني: Goku vs Saitama vs Rimuru — من الأقوى في Power Scaling وإش يقول الـ Lore؟' },
        { e:'⚔️', t:'Jujutsu Kaisen Scaling', s:'Sukuna، Gojo، Mahoraga — تسلسل القوى', p:'حلل power scaling في Jujutsu Kaisen: Sukuna، Gojo، وKenjaku — من أعلى؟' },
        { e:'🦸', t:'Marvel vs DC الحقيقة', s:'Superman، Thor، Wanda، Dr Fate...', p:'Marvel vs DC — power scaling حقيقي: Superman vs Thor vs Wanda vs Dr Strange vs Dr Fate.' },
        { e:'🔥', t:'Dragon Ball vs One Piece vs Naruto', s:'Goku-Luffy-Naruto — من أقوى؟', p:'Power scaling: Goku (Dragon Ball) vs Luffy Gear 5 (One Piece) vs Baryon Mode Naruto. حكّم بالـ feats.' },
        { e:'💀', t:'أقوى شرير في التاريخ', s:'Thanos، Aizen، Madara، Muzan...', p:'من أقوى شرير في تاريخ الأنمي والكوميكس؟ Thanos vs Aizen vs Madara vs Muzan vs Zeref.' },
        { e:'🎮', t:'Scaling شخصيات الألعاب', s:'Doom Slayer، Kratos، Vergil...', p:'Power scaling لأقوى شخصيات الألعاب: Doom Slayer، Kratos، Vergil، Bayonetta. من يكسب الكل؟' },
    ];

    function gzBuildScale() {
        const el = document.getElementById('gz-scaleGrid');
        if (!el) return;
        el.innerHTML = GZ_SCALE_TOPICS.map(t => `
            <div class="gz-scale-item" onclick="gzSwitchMode('chat');document.getElementById('gz-cinput').value=${JSON.stringify(t.p)};gzSendMsg()">
                <div class="gz-scale-ico">${t.e}</div>
                <div class="gz-scale-info">
                    <div class="gz-scale-title">${t.t}</div>
                    <div class="gz-scale-sub">${t.s}</div>
                </div>
                <div class="gz-scale-arr">▶</div>
            </div>`).join('');
    }

    // 
    // BATTLE COMMENTS SYSTEM
    // 
    function gzBattleKey(id1, id2) {
        return `${Math.min(id1, id2)}_${Math.max(id1, id2)}`;
    }

    function gzEsc(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    async function gzLoadCmts(key) {
        try {
            const snap = await window.gzDB
                .collection('gz_comments')
                .where('battleKey', '==', key)
                .get();
            return snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        } catch { return []; }
    }

    async function gzSaveCmt(key, text, parentId = null) {
        if (!text.trim()) return false;
        await window.gzDB.collection('gz_comments').add({
            battleKey: key,
            text: text.trim().slice(0, 200),
            timestamp: Date.now(),
            date: new Date().toLocaleDateString('ar'),
            parentId: parentId
        });
        return true;
    }

    async function gzRenderComments(key) {
        const sec = document.getElementById('gz-battle-comments');
        if (!sec) return;
        // Show form immediately — don't wait for Firebase
        sec.innerHTML = `
            <div class="gz-cmt-hdr">💬 سجل المحاربين</div>
            <div class="gz-cmt-list" id="gz-cmt-list-inner"><div class="gz-cmt-empty">⏳ جاري التحميل...</div></div>
            <div class="gz-cmt-form">
                <textarea class="gz-cmt-inp" id="gz-cmt-inp" placeholder="شاركنا رأيك في هذه المعركة..." rows="2" maxlength="200"></textarea>
                <button class="gz-cmt-btn" onclick="gzSubmitCmt('${key}')">📝 أضف تعليقك</button>
            </div>`;
        sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        const all = await gzLoadCmts(key);
        const topLevel = all.filter(c => !c.parentId);
        const replies   = all.filter(c =>  c.parentId);

        function renderCmt(c) {
            const cReplies = replies.filter(r => r.parentId === c.id);
            const repliesHTML = cReplies.map(r => `
                <div class="gz-cmt-reply">
                    <span class="gz-cmt-user">↩ محارب</span>
                    <span class="gz-cmt-text">${gzEsc(r.text)}</span>
                    <span class="gz-cmt-time">${gzEsc(r.date)}</span>
                </div>`).join('');
            return `
                <div class="gz-cmt-item">
                    <span class="gz-cmt-user">👤 محارب</span>
                    <span class="gz-cmt-text">${gzEsc(c.text)}</span>
                    <span class="gz-cmt-time">${gzEsc(c.date)}</span>
                    <button class="gz-cmt-reply-btn" onclick="gzShowReply('${c.id}','${key}')">↩ رد</button>
                    ${repliesHTML}
                    <div class="gz-reply-form" id="gz-rf-${c.id}" style="display:none;">
                        <textarea class="gz-cmt-inp gz-reply-inp" id="gz-ri-${c.id}" placeholder="اكتب ردك..." rows="2" maxlength="200"></textarea>
                        <div style="display:flex;gap:6px;margin-top:5px;">
                            <button class="gz-cmt-btn" style="flex:1;" onclick="gzSubmitReply('${c.id}','${key}')">↩ إرسال</button>
                            <button class="gz-cmt-btn gz-cmt-cancel" onclick="gzHideReply('${c.id}')">✕</button>
                        </div>
                    </div>
                </div>`;
        }

        const listHTML = topLevel.length
            ? topLevel.map(renderCmt).join('')
            : '<div class="gz-cmt-empty">كن أول من يسجّل رأيه في هذه المعركة 🔥</div>';
        const listEl = document.getElementById('gz-cmt-list-inner');
        if (listEl) listEl.innerHTML = listHTML;
    }

    function gzShowReply(cid, key) {
        document.querySelectorAll('.gz-reply-form').forEach(f => f.style.display = 'none');
        const form = document.getElementById('gz-rf-' + cid);
        if (form) { form.style.display = 'block'; document.getElementById('gz-ri-' + cid)?.focus(); }
    }

    function gzHideReply(cid) {
        const f = document.getElementById('gz-rf-' + cid);
        if (f) f.style.display = 'none';
    }

    async function gzSubmitReply(cid, key) {
        const inp = document.getElementById('gz-ri-' + cid);
        if (!inp || !inp.value.trim()) return;
        const text = inp.value; inp.value = '';
        try { await gzSaveCmt(key, text, cid); } catch { inp.value = text; return; }
        await gzRenderComments(key);
    }

    async function gzSubmitCmt(key) {
        const inp = document.getElementById('gz-cmt-inp');
        if (!inp || !inp.value.trim()) return;
        const btn = inp.nextElementSibling;
        const text = inp.value; inp.value = '';
        if (btn) { btn.disabled = true; btn.textContent = '⏳...'; }
        try { await gzSaveCmt(key, text, null); } catch { inp.value = text; }
        await gzRenderComments(key);
    }

    // ── INIT ──
    document.getElementById('stat-total').innerText = heroes.length;
    document.getElementById('stat-peak').innerText = getPeakCount();
    renderGrid('all', '');
