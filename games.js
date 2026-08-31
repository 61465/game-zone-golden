// ══════════════════════════════════════════════════════════════
// GAME ZONE: GOLDEN ARENA — AI-POWERED INTERACTIVE GAMES
// 1. Witcher 3 Style Gwent with AI Tactical Commentary
// 2. Detective RPG with Real-time AI Interrogation & Free Dialogue
// 3. Tower of Doom with Dynamic AI Bosses
// 4. Mystery Detective (Who Am I?)
// 5. Champions Auction with AI Squad Synergy Analysis
// ══════════════════════════════════════════════════════════════

let gzActiveGame = 'gwent';

// ──────────────────────────────────────────────────────────────
// 1. GWENT ENGINE (جوينت الأساطير — Witcher 3)
// ──────────────────────────────────────────────────────────────
let gwentState = {
  playerHand: [],
  botHand: [],
  playerBoard: { melee: [], ranged: [], magic: [] },
  botBoard: { melee: [], ranged: [], magic: [] },
  playerHorn: { melee: false, ranged: false, magic: false },
  botHorn: { melee: false, ranged: false, magic: false },
  playerGems: 2,
  botGems: 2,
  playerPassed: false,
  botPassed: false,
  round: 1,
  turn: 'player',
  weather: { frost: false, fog: false, rain: false },
  aiComment: 'مرحباً بك في طاولة الجوينت الأسطورية! ألقِ أول بطاقة بحكمة.'
};

function gzHeroToGwentCard(hero) {
  let row = 'melee';
  if (hero.type === 'comic' || hero.source.includes('Harry') || hero.source.includes('Doctor') || (hero.ar && hero.ar.ability && hero.ar.ability.includes('سحر')) || hero.p >= 95) {
    row = 'magic';
  } else if (hero.type === 'movie' || (hero.ar && hero.ar.ability && (hero.ar.ability.includes('قنص') || hero.ar.ability.includes('عين') || hero.ar.ability.includes('سرعة'))) || hero.source.includes('Wick')) {
    row = 'ranged';
  } else {
    row = 'melee';
  }

  let basePower = Math.max(3, Math.min(15, Math.round((hero.p - 70) / 3)));
  if (hero.isPeak) basePower = Math.min(18, basePower + 3);

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  return {
    id: hero.id,
    name: hero[lang] ? hero[lang].name : hero.name || 'بطل',
    icon: hero.icon || '⚔️',
    source: hero.source,
    power: basePower,
    origPower: basePower,
    row: row,
    isPeak: !!hero.isPeak,
    ability: hero[lang] ? hero[lang].ability : ''
  };
}

function gzGetSpecialCards() {
  return [
    { id: 'sp_frost', name: '❄️ صقيع العوالم', icon: '❄️', power: 0, row: 'special', type: 'frost', desc: 'يخفض طاقة الصف القريب إلى 2' },
    { id: 'sp_fog', name: '🌫️ ضباب الأوهام', icon: '🌫️', power: 0, row: 'special', type: 'fog', desc: 'يخفض طاقة الصف البعيد إلى 2' },
    { id: 'sp_rain', name: '🌧️ عاصفة السحر', icon: '🌧️', power: 0, row: 'special', type: 'rain', desc: 'يخفض طاقة صف السحر إلى 2' },
    { id: 'sp_horn', name: '🎺 بوق القائد', icon: '🎺', power: 0, row: 'special', type: 'horn', desc: 'يضاعف طاقة صف كامل (2x)' },
    { id: 'sp_scorch', name: '🔥 الحرق الشامل', icon: '🔥', power: 0, row: 'special', type: 'scorch', desc: 'يدمر أقوى بطاقة في الساحة فوراً' },
    { id: 'sp_spy', name: '🕵️ الجاسوس المخضرم', icon: '🕵️', power: 4, row: 'melee', type: 'spy', desc: 'ينتقل لصف الخصم ويسحب لك بطاقتين' }
  ];
}

function gzInitGwent() {
  const pool = [...heroes].sort(() => 0.5 - Math.random());
  const specials = gzGetSpecialCards().sort(() => 0.5 - Math.random());

  gwentState = {
    playerHand: pool.slice(0, 8).map(gzHeroToGwentCard).concat(specials.slice(0, 2)),
    botHand: pool.slice(8, 16).map(gzHeroToGwentCard).concat(specials.slice(2, 4)),
    playerBoard: { melee: [], ranged: [], magic: [] },
    botBoard: { melee: [], ranged: [], magic: [] },
    playerHorn: { melee: false, ranged: false, magic: false },
    botHorn: { melee: false, ranged: false, magic: false },
    playerGems: 2,
    botGems: 2,
    playerPassed: false,
    botPassed: false,
    round: 1,
    turn: 'player',
    weather: { frost: false, fog: false, rain: false },
    aiComment: 'معركة الجوينت بدأت! استعد لأقوى التكتيكات.'
  };

  gzRenderGwent();
}

function gzCalculateRowScore(cards, isWeather, isHorn) {
  let sum = 0;
  cards.forEach(c => {
    let p = c.origPower || c.power;
    if (isWeather && !c.isPeak) p = 2;
    sum += p;
  });
  if (isHorn) sum *= 2;
  return sum;
}

function gzGetTotalScore(isPlayer) {
  const board = isPlayer ? gwentState.playerBoard : gwentState.botBoard;
  const horns = isPlayer ? gwentState.playerHorn : gwentState.botHorn;
  const w = gwentState.weather;

  const m = gzCalculateRowScore(board.melee, w.frost, horns.melee);
  const r = gzCalculateRowScore(board.ranged, w.fog, horns.ranged);
  const s = gzCalculateRowScore(board.magic, w.rain, horns.magic);

  return { melee: m, ranged: r, magic: s, total: m + r + s };
}

function gzPlayCard(index) {
  if (gwentState.playerPassed || gwentState.turn !== 'player') return;

  const card = gwentState.playerHand[index];
  if (!card) return;

  gwentState.playerHand.splice(index, 1);

  if (card.row === 'special') {
    if (card.type === 'frost') gwentState.weather.frost = true;
    if (card.type === 'fog') gwentState.weather.fog = true;
    if (card.type === 'rain') gwentState.weather.rain = true;
    if (card.type === 'scorch') gzTriggerScorch();
    if (card.type === 'horn') gwentState.playerHorn.melee = true;
    gwentState.aiComment = `ألقيت بطاقة تكتيكية خاصة: ${card.name}!`;
  } else if (card.type === 'spy') {
    gwentState.botBoard.melee.push(card);
    const extra = [...heroes].sort(() => 0.5 - Math.random()).slice(0, 2).map(gzHeroToGwentCard);
    gwentState.playerHand.push(...extra);
    gwentState.aiComment = `حركة ذكية! جاسوسك منحني طاقة لكنك سحبت ورقتين إضافيتين.`;
  } else {
    gwentState.playerBoard[card.row].push(card);
    gwentState.aiComment = `لعبت ${card.name} بطاقة (${card.power}) في صف الـ ${card.row === 'melee' ? 'هجوم' : card.row === 'ranged' ? 'رماية' : 'سحر'}.`;
  }

  gwentState.turn = 'bot';
  gzRenderGwent();

  if (!gwentState.botPassed) {
    setTimeout(gzBotTurn, 900);
  } else {
    gwentState.turn = 'player';
  }
}

function gzTriggerScorch() {
  let highest = -1;
  let allCards = [
    ...gwentState.playerBoard.melee, ...gwentState.playerBoard.ranged, ...gwentState.playerBoard.magic,
    ...gwentState.botBoard.melee, ...gwentState.botBoard.ranged, ...gwentState.botBoard.magic
  ];

  allCards.forEach(c => {
    if (!c.isPeak && c.power > highest) highest = c.power;
  });

  if (highest > 0) {
    ['melee', 'ranged', 'magic'].forEach(r => {
      gwentState.playerBoard[r] = gwentState.playerBoard[r].filter(c => c.isPeak || c.power < highest);
      gwentState.botBoard[r] = gwentState.botBoard[r].filter(c => c.isPeak || c.power < highest);
    });
  }
}

function gzPassTurn() {
  gwentState.playerPassed = true;
  gwentState.turn = 'bot';
  gwentState.aiComment = 'انسحبت تكتيكياً لهذه الجولة! سأرى كيف سأنهي دوري.';
  gzRenderGwent();

  if (gwentState.botPassed) {
    gzEndRound();
  } else {
    setTimeout(gzBotTurn, 700);
  }
}

function gzBotTurn() {
  if (gwentState.botPassed) {
    if (gwentState.playerPassed) gzEndRound();
    else gwentState.turn = 'player';
    gzRenderGwent();
    return;
  }

  const pScore = gzGetTotalScore(true).total;
  const bScore = gzGetTotalScore(false).total;

  if (gwentState.playerPassed && bScore > pScore) {
    gwentState.botPassed = true;
    gwentState.aiComment = 'أنا متقدم في النقاط وأنت انسحبت، لذا أوقف لعبي للحفاظ على بطاقاتي للجولة القادمة! 😎';
  } else if (gwentState.botHand.length === 0 || (pScore > bScore + 25 && gwentState.round === 1)) {
    gwentState.botPassed = true;
    gwentState.aiComment = 'الفارق كبير حالياً، أفضل التوفير للجولة القادمة والانسحاب الآن! 🛑';
  } else {
    const cardIdx = Math.floor(Math.random() * gwentState.botHand.length);
    const card = gwentState.botHand.splice(cardIdx, 1)[0];

    if (card.row === 'special') {
      if (card.type === 'frost') gwentState.weather.frost = true;
      else if (card.type === 'fog') gwentState.weather.fog = true;
      else if (card.type === 'rain') gwentState.weather.rain = true;
      else if (card.type === 'scorch') gzTriggerScorch();
      else if (card.type === 'horn') gwentState.botHorn.melee = true;
      gwentState.aiComment = `أنا ألقي تعويذة ${card.name}! لنرى كيف ستتصرف. 🔥`;
    } else if (card.type === 'spy') {
      gwentState.playerBoard.melee.push(card);
      const extra = [...heroes].sort(() => 0.5 - Math.random()).slice(0, 2).map(gzHeroToGwentCard);
      gwentState.botHand.push(...extra);
      gwentState.aiComment = `أرسلت جاسوساً لصفوفك وسحبت ورقتين جديدتين! 🕵️`;
    } else {
      gwentState.botBoard[card.row].push(card);
      gwentState.aiComment = `لعبت ${card.name} بقوة (${card.power}) في صف ${card.row}! ⚡`;
    }
  }

  if (gwentState.playerPassed && gwentState.botPassed) {
    gzEndRound();
  } else {
    gwentState.turn = 'player';
  }
  gzRenderGwent();
}

function gzEndRound() {
  const pScore = gzGetTotalScore(true).total;
  const bScore = gzGetTotalScore(false).total;

  if (pScore > bScore) {
    gwentState.botGems--;
    gwentState.aiComment = `أحسنت! فزت بالجولة ${gwentState.round} بنتيجة (${pScore} - ${bScore}).`;
  } else if (bScore > pScore) {
    gwentState.playerGems--;
    gwentState.aiComment = `انتزعت الجولة ${gwentState.round} بنتيجة (${bScore} - ${pScore})! الحسم قادم.`;
  } else {
    gwentState.playerGems--;
    gwentState.botGems--;
    gwentState.aiComment = `تعادل ملحمي في الجولة! خسر كل منا جوهرة نصر.`;
  }

  if (gwentState.playerGems <= 0 || gwentState.botGems <= 0) {
    setTimeout(() => {
      const won = gwentState.playerGems > gwentState.botGems;
      alert(won ? '🎉 نصر أسطوري! لقد فزت بمباراة الجوينت كاملة!' : '💀 لقد خارت قواك وانتصر الخصم!');
      gzInitGwent();
    }, 500);
    return;
  }

  gwentState.playerBoard = { melee: [], ranged: [], magic: [] };
  gwentState.botBoard = { melee: [], ranged: [], magic: [] };
  gwentState.playerHorn = { melee: false, ranged: false, magic: false };
  gwentState.botHorn = { melee: false, ranged: false, magic: false };
  gwentState.weather = { frost: false, fog: false, rain: false };
  gwentState.playerPassed = false;
  gwentState.botPassed = false;
  gwentState.round++;
  gwentState.turn = 'player';

  const pExtra = [...heroes].sort(() => 0.5 - Math.random())[0];
  const bExtra = [...heroes].sort(() => 0.5 - Math.random())[0];
  if (pExtra) gwentState.playerHand.push(gzHeroToGwentCard(pExtra));
  if (bExtra) gwentState.botHand.push(gzHeroToGwentCard(bExtra));

  gzRenderGwent();
}

function gzRenderGwentCard(card, index, isHand = false) {
  const isSpecial = card.row === 'special';
  return `
    <div class="gwent-card ${card.isPeak ? 'peak' : ''} ${isSpecial ? 'special-card' : ''}" 
         onclick="${isHand ? `gzPlayCard(${index})` : ''}" title="${card.name}">
      <div class="gwent-card-power">${card.power}</div>
      <div class="gwent-card-row-type">${card.row === 'melee' ? '⚔️' : card.row === 'ranged' ? '🏹' : card.row === 'magic' ? '🔮' : '⚡'}</div>
      <div class="gwent-card-icon">${card.icon}</div>
      <div class="gwent-card-name">${card.name}</div>
    </div>
  `;
}

function gzRenderGwent() {
  const container = document.getElementById('gz-game-view');
  if (!container || gzActiveGame !== 'gwent') return;

  const pScores = gzGetTotalScore(true);
  const bScores = gzGetTotalScore(false);

  container.innerHTML = `
    <div class="gwent-board-container">
      <!-- AI TACTICAL SPEECH BUBBLE -->
      <div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.3);border-radius:12px;padding:8px 14px;margin-bottom:12px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:22px;">🤖</span>
        <div style="font-size:13px;color:#fef08a;font-weight:700;"><strong>تعليق الذكاء الاصطناعي:</strong> ${gwentState.aiComment}</div>
      </div>

      <div class="gwent-header-scores">
        <div class="gwent-player-status">
          <div style="font-size:24px;">🤖</div>
          <div>
            <div style="font-weight:900;color:#fff;font-size:14px;">الخصم (GZ AI) ${gwentState.botPassed ? '<span style="color:#ef4444;font-size:11px;">[انسحب]</span>' : ''}</div>
            <div class="gwent-gem-wins">
              <div class="gwent-gem ${gwentState.botGems >= 2 ? 'won' : ''}"></div>
              <div class="gwent-gem ${gwentState.botGems >= 1 ? 'won' : ''}"></div>
            </div>
          </div>
          <div class="gwent-total-score-badge" style="color:#f87171;">${bScores.total}</div>
        </div>

        <div style="text-align:center;">
          <div style="font-family:'Cinzel';font-size:16px;color:var(--gz-gold);font-weight:900;">الجولة ${gwentState.round}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);">${gwentState.turn === 'player' ? '👉 دورك الآن' : '⏳ دور الخصم...'}</div>
        </div>

        <div class="gwent-player-status" style="justify-content:flex-end;">
          <div class="gwent-total-score-badge" style="color:#4ade80;">${pScores.total}</div>
          <div style="text-align:left;">
            <div style="font-weight:900;color:#fff;font-size:14px;">أنت ${gwentState.playerPassed ? '<span style="color:#ef4444;font-size:11px;">[انسحبت]</span>' : ''}</div>
            <div class="gwent-gem-wins">
              <div class="gwent-gem ${gwentState.playerGems >= 2 ? 'won' : ''}"></div>
              <div class="gwent-gem ${gwentState.playerGems >= 1 ? 'won' : ''}"></div>
            </div>
          </div>
          <div style="font-size:24px;">👑</div>
        </div>
      </div>

      <div class="gwent-rows-zone">
        <div class="gwent-row ${gwentState.weather.rain ? 'weather-active' : ''}">
          <div class="gwent-row-label"><span class="row-icon">🔮</span>سحر الخصم</div>
          <div class="gwent-row-cards">${gwentState.botBoard.magic.map((c, i) => gzRenderGwentCard(c, i)).join('')}</div>
          <div class="gwent-row-score">${bScores.magic}</div>
        </div>
        <div class="gwent-row ${gwentState.weather.fog ? 'weather-active' : ''}">
          <div class="gwent-row-label"><span class="row-icon">🏹</span>رماة الخصم</div>
          <div class="gwent-row-cards">${gwentState.botBoard.ranged.map((c, i) => gzRenderGwentCard(c, i)).join('')}</div>
          <div class="gwent-row-score">${bScores.ranged}</div>
        </div>
        <div class="gwent-row ${gwentState.weather.frost ? 'weather-active' : ''}">
          <div class="gwent-row-label"><span class="row-icon">⚔️</span>هجوم الخصم</div>
          <div class="gwent-row-cards">${gwentState.botBoard.melee.map((c, i) => gzRenderGwentCard(c, i)).join('')}</div>
          <div class="gwent-row-score">${bScores.melee}</div>
        </div>

        <div style="height:2px;background:linear-gradient(90deg,transparent,rgba(255,215,0,0.4),transparent);margin:4px 0;"></div>

        <div class="gwent-row ${gwentState.weather.frost ? 'weather-active' : ''}">
          <div class="gwent-row-label"><span class="row-icon">⚔️</span>هجومك القريب</div>
          <div class="gwent-row-cards">${gwentState.playerBoard.melee.map((c, i) => gzRenderGwentCard(c, i)).join('')}</div>
          <div class="gwent-row-score">${pScores.melee}</div>
        </div>
        <div class="gwent-row ${gwentState.weather.fog ? 'weather-active' : ''}">
          <div class="gwent-row-label"><span class="row-icon">🏹</span>رماتك</div>
          <div class="gwent-row-cards">${gwentState.playerBoard.ranged.map((c, i) => gzRenderGwentCard(c, i)).join('')}</div>
          <div class="gwent-row-score">${pScores.ranged}</div>
        </div>
        <div class="gwent-row ${gwentState.weather.rain ? 'weather-active' : ''}">
          <div class="gwent-row-label"><span class="row-icon">🔮</span>سحرك ودعمك</div>
          <div class="gwent-row-cards">${gwentState.playerBoard.magic.map((c, i) => gzRenderGwentCard(c, i)).join('')}</div>
          <div class="gwent-row-score">${pScores.magic}</div>
        </div>
      </div>

      <div class="gwent-hand-zone">
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="gwent-action-btn gwent-pass-btn" onclick="gzPassTurn()" ${gwentState.playerPassed ? 'disabled' : ''}>
            🛑 إنهاء الدور (Pass)
          </button>
          <button class="gwent-action-btn" style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.2);" onclick="gzInitGwent()">
            🔄 معركة جديدة
          </button>
        </div>
        <div class="gwent-hand-cards">
          ${gwentState.playerHand.map((c, i) => gzRenderGwentCard(c, i, true)).join('')}
        </div>
      </div>
    </div>
  `;
}


// ──────────────────────────────────────────────────────────────
// 2. DETECTIVE RPG MYSTERY (تحقيقات الأساطير: استجواب حي بالذكاء الاصطناعي)
// ──────────────────────────────────────────────────────────────
let caseState = {
  detectiveHero: null,
  detectiveType: 'smart',
  detectiveBadge: '',
  detectiveDesc: '',
  caseTitle: 'مقتل الحارس الأسطوري وسرقة تميمة الآلهة من الحلبة',
  cluesFound: [],
  interviewLogs: [],
  suspects: [],
  culprit: null,
  ap: 6,
  isAIResponding: false,
  aiDeductionText: '',
  solved: false,
  gameOver: false
};

function gzGetDetectiveArchetype(hero) {
  const name = hero.ar ? hero.ar.name : hero.name;
  if (name.includes('شيرلوك') || name.includes('باتمان') || name.includes('والتر') || name.includes('ديكسترا') || name.includes('هاري دوبوا') || name.includes('شيني') || name.includes('أوكابيه')) {
    return {
      type: 'genius',
      badge: '🧠 عبقري استنتاجي (Genius Detective)',
      desc: 'يمتلك بصيرة خارقة لكشف أدق التناقضات وحركات العيون والرموز الخفية.'
    };
  }
  if (name.includes('هالك') || name.includes('تريفور') || name.includes('دوم سلاير') || name.includes('سايتاما') || name.includes('غوكو') || name.includes('ديدبول') || name.includes('باور') || name.includes('دينجي')) {
    return {
      type: 'chaos',
      badge: '💥 كارثة تدميرية في التحقيق (Chaos Menace)',
      desc: 'لا يفهم التحقيق، يهدد الشهود ويكسر الأبواب بحثاً عن القتال أو الطعام!'
    };
  }
  return {
    type: 'tactical',
    badge: '⚔️ محقق تكتيكي ميداني (Tactical Investigator)',
    desc: 'يعتمد على حواس القتال وتتبع آثار الأسلحة والسموم ومسارات الهروب.'
  };
}

function gzInitCase() {
  const detective = heroes[Math.floor(Math.random() * heroes.length)];
  const arch = gzGetDetectiveArchetype(detective);

  const otherHeroes = heroes.filter(h => h.id !== detective.id).sort(() => 0.5 - Math.random()).slice(0, 3);
  const culprit = otherHeroes[Math.floor(Math.random() * otherHeroes.length)];

  caseState = {
    detectiveHero: detective,
    detectiveType: arch.type,
    detectiveBadge: arch.badge,
    detectiveDesc: arch.desc,
    caseTitle: 'مقتل الحارس الأسطوري وسرقة تميمة الآلهة من الحلبة',
    cluesFound: [],
    interviewLogs: [],
    suspects: otherHeroes,
    culprit: culprit,
    ap: 6,
    isAIResponding: false,
    aiDeductionText: '',
    solved: false,
    gameOver: false
  };

  gzRenderCase();
}

function gzInvestigateArea(area) {
  if (caseState.ap <= 0 || caseState.gameOver) {
    alert('⏳ نفدت نقاط التحقيق (AP)! حان وقت توجيه أصابع الاتهام للمجرم.');
    return;
  }

  caseState.ap--;
  const dType = caseState.detectiveType;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const culpritName = caseState.culprit[lang] ? caseState.culprit[lang].name : caseState.culprit.name;

  if (area === 'vault') {
    if (dType === 'chaos') {
      caseState.cluesFound.push(`💥 ${caseState.detectiveHero[lang].name} ركل الخزنة وكسر الباب بالكامل! وجد رماداً مشتعلاً وشظية سلاح من عالم [${caseState.culprit.source}]!`);
    } else if (dType === 'genius') {
      caseState.cluesFound.push(`🔍 فحص دقيق: تم تعطيل القفل دون أي أثر عنف، مما يدل على قدرة تصنيفها [${caseState.culprit.p >= 90 ? 'خارقة جداً 90+' : 'تكتيكية سريعة'}]!`);
    } else {
      caseState.cluesFound.push(`⚔️ أثر قتالي: وُجدت بصمة سحرية تنتمي لعالم [${caseState.culprit.type === 'anime' ? 'الأنمي' : caseState.culprit.type === 'game' ? 'الألعاب' : 'القصص المصورة'}]!`);
    }
  } else if (area === 'body') {
    if (dType === 'chaos') {
      caseState.cluesFound.push(`⚠️ المحقق صرخ في الجثة طالباً منها الاستيقاظ! سقطت من جيب الضحية بطاقة تحمل الحرف الأول (${culpritName.charAt(0)})!`);
    } else {
      caseState.cluesFound.push(`🩸 تقرير الطب الشرعي: الضحية سقطت بضربة مباغتة، والقدرة المستخدمة هي: [${caseState.culprit[lang] ? caseState.culprit[lang].ability : 'قدرة غامضة'}]!`);
    }
  } else if (area === 'archive') {
    caseState.cluesFound.push(`📜 سجلات الحلبة: شوهد شخص من تصنيف [${caseState.culprit.type.toUpperCase()}] يهرب من الساحة باتجاه الظلال فور انطفاء الأنوار.`);
  }

  gzRenderCase();
}

// Real-time AI Interrogation with Suspect
async function gzAskCustomAIQuestion(suspectId) {
  if (caseState.ap <= 0 || caseState.gameOver) {
    alert('⏳ نفدت نقاط التحقيق (AP)! وجه اتهامك النهائي.');
    return;
  }

  const inputEl = document.getElementById('gz-case-custom-q');
  const userQuestion = inputEl ? inputEl.value.trim() : '';
  if (!userQuestion) {
    alert('⚠️ اكتب سؤالك أولاً في الخانة المخصصة.');
    return;
  }

  const suspect = caseState.suspects.find(s => s.id === suspectId);
  if (!suspect) return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const suspectName = suspect[lang] ? suspect[lang].name : suspect.name;
  const detectiveName = caseState.detectiveHero[lang] ? caseState.detectiveHero[lang].name : caseState.detectiveHero.name;
  const isGuilty = suspect.id === caseState.culprit.id;

  caseState.ap--;
  caseState.isAIResponding = true;
  gzRenderCase();

  const prompt = `You are roleplaying as the fictional character "${suspectName}" from "${suspect.source}" in an RPG detective interrogation room.
The investigator questioning you is "${detectiveName}" (Archetype: ${caseState.detectiveType}).
Crime Context: The Sacred Crown of Golden Arena was stolen and the Golden Guard was murdered.
Your Status in this crime: ${isGuilty ? 'YOU ARE THE REAL CULPRIT! You are guilty and trying to hide it, but under intense pressure or clever questioning you may slip up or get defensive.' : 'YOU ARE INNOCENT! You have a genuine alibi related to your lore and are annoyed or cooperative.'}
Detective's Question: "${userQuestion}"

Respond strictly IN CHARACTER as ${suspectName} in Arabic (1-3 sentences maximum). Show personality, tone, and mannerisms matching your fictional universe.`;

  try {
    const aiRes = await window.gzCallAI([{ role: 'user', content: prompt }], 'You are a master character roleplayer.', 200);
    const reply = aiRes.text || '...';
    caseState.interviewLogs.push(`❓ <strong>${detectiveName} سأل ${suspectName}:</strong> "${userQuestion}"<br>💬 <strong>${suspectName}:</strong> "${reply}"`);
  } catch (err) {
    caseState.interviewLogs.push(`💬 <strong>${suspectName}:</strong> "لا أعرف شيئاً عما تتحدث عنه!"`);
  }

  caseState.isAIResponding = false;
  gzRenderCase();
}

async function gzGetAIDeduction() {
  if (caseState.cluesFound.length === 0 && caseState.interviewLogs.length === 0) {
    alert('⚠️ اجمع بعض الأدلة أو استجوب المشتبه بهم أولاً حتى يتمكن الذكاء الاصطناعي من تحليلها.');
    return;
  }

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const dName = caseState.detectiveHero[lang] ? caseState.detectiveHero[lang].name : caseState.detectiveHero.name;
  
  caseState.isAIResponding = true;
  gzRenderCase();

  const prompt = `You are an AI Forensic & Mystery Detective Assistant analyzing clues for Investigator "${dName}".
Collected Clues:
${caseState.cluesFound.join('\n')}
Interrogation Notes:
${caseState.interviewLogs.join('\n')}

Suspects:
${caseState.suspects.map(s => `${s[lang]?s[lang].name:s.name} (${s.source}, Type: ${s.type}, Power: ${s.p})`).join(', ')}

Provide a sharp, logical 2-sentence deduction in Arabic analyzing which suspect fits the evidence best without explicitly spoiling the mystery.`;

  try {
    const aiRes = await window.gzCallAI([{ role: 'user', content: prompt }], 'You are a master forensic deductive assistant.', 250);
    caseState.aiDeductionText = aiRes.text;
  } catch (e) {
    caseState.aiDeductionText = 'الأدلة تشير إلى تقارب أسلوب الجريمة مع أحد المشتبه بهم ذوي القدرات السحرية/التكتيكية.';
  }

  caseState.isAIResponding = false;
  gzRenderCase();
}

function gzAccuseSuspect(suspectId) {
  if (caseState.gameOver) return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const correct = suspectId === caseState.culprit.id;
  const cName = caseState.culprit[lang] ? caseState.culprit[lang].name : caseState.culprit.name;
  const dName = caseState.detectiveHero[lang] ? caseState.detectiveHero[lang].name : caseState.detectiveHero.name;

  caseState.gameOver = true;
  caseState.solved = correct;

  if (correct) {
    alert(`🎉 عبقرية منقطعة النظير! المحقق [${dName}] نجح في حل القضية وكشف القاتل الحقيقي: [${cName}] واستعاد تميمة الحلبة!`);
  } else {
    alert(`❌ اتهام خاطئ وسقطت القضية! المجرم الحقيقي كان [${cName}] وهرب بالغنيمة!`);
  }

  gzRenderCase();
}

function gzRenderCase() {
  const container = document.getElementById('gz-game-view');
  if (!container || gzActiveGame !== 'detective_rpg') return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const d = caseState.detectiveHero;
  const dName = d[lang] ? d[lang].name : d.name;

  container.innerHTML = `
    <div style="background:radial-gradient(circle at center, #1e1b18 0%, #0c0a08 100%);border:2px solid var(--gz-gold);border-radius:24px;padding:24px;box-shadow:0 0 45px rgba(255,215,0,0.25);">
      <!-- DETECTIVE BADGE HEADER -->
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,215,0,0.25);padding-bottom:16px;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="font-size:45px;background:rgba(0,0,0,0.5);border:2px solid var(--gz-gold);border-radius:50%;width:70px;height:70px;display:flex;align-items:center;justify-content:center;">${d.icon}</div>
          <div>
            <div style="font-family:'Cinzel';font-size:20px;color:var(--gz-gold);font-weight:900;">المحقق المعين: ${dName}</div>
            <div style="color:#fcd34d;font-size:12px;font-weight:700;">${caseState.detectiveBadge}</div>
            <div style="color:rgba(255,255,255,0.7);font-size:11px;max-width:480px;">${caseState.detectiveDesc}</div>
          </div>
        </div>

        <div style="text-align:center;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);padding:10px 18px;border-radius:14px;">
          <div style="font-size:11px;color:rgba(255,255,255,0.6);">نقاط التحقيق (AP)</div>
          <div style="font-size:26px;font-family:'Cinzel';color:#4ade80;font-weight:900;">${caseState.ap} ⏳</div>
          <button class="bid-btn-action" style="padding:4px 10px;font-size:11px;margin-top:4px;" onclick="gzInitCase()">🎲 سحب محقق آخر</button>
        </div>
      </div>

      <!-- AI DEDUCTION BOX -->
      ${caseState.aiDeductionText ? `
        <div style="background:rgba(56,189,248,0.1);border:1px solid #38bdf8;border-radius:12px;padding:12px 16px;margin-bottom:18px;">
          <div style="font-weight:800;color:#38bdf8;font-size:13px;margin-bottom:4px;">🧠 استنتاج المساعد الذكي (AI Analysis):</div>
          <div style="font-size:13px;color:#fff;">${caseState.aiDeductionText}</div>
        </div>
      ` : ''}

      <!-- CASE DESCRIPTION -->
      <div style="background:rgba(255,107,0,0.08);border:1px solid rgba(255,107,0,0.3);border-radius:14px;padding:12px 16px;margin-bottom:20px;">
        <div style="color:var(--gz-orange);font-weight:900;font-size:14px;margin-bottom:4px;">📜 ملف الجريمة: ${caseState.caseTitle}</div>
        <div style="color:rgba(255,255,255,0.8);font-size:12px;">تحرك في مسرح الجريمة، اسأل المشتبه بهم بحرية كاملة بالذكاء الاصطناعي، ثم ضع شكوكك ووجه الاتهام الحاسم!</div>
      </div>

      <!-- INVESTIGATION LOCATIONS -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-bottom:20px;">
        <button class="game-pill-btn" style="border-radius:14px;padding:14px;text-align:right;flex-direction:column;align-items:flex-start;background:rgba(0,0,0,0.35);" 
                onclick="gzInvestigateArea('vault')">
          <div style="font-weight:900;color:var(--gz-gold);font-size:14px;">🏛️ تفقد الخزنة المكسورة</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);">فحص القفل وآثار الاقتحام (1 AP)</div>
        </button>

        <button class="game-pill-btn" style="border-radius:14px;padding:14px;text-align:right;flex-direction:column;align-items:flex-start;background:rgba(0,0,0,0.35);" 
                onclick="gzInvestigateArea('body')">
          <div style="font-weight:900;color:#f87171;font-size:14px;">🩸 فحص جثة الحارس</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);">تحديد السلاح ونوع القدرة المستخدمة (1 AP)</div>
        </button>

        <button class="game-pill-btn" style="border-radius:14px;padding:14px;text-align:right;flex-direction:column;align-items:flex-start;background:rgba(0,0,0,0.35);" 
                onclick="gzInvestigateArea('archive')">
          <div style="font-weight:900;color:#38bdf8;font-size:14px;">📜 مراجعة كاميرات وسجلات الحلبة</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);">رصد المشتبه بهم وقت وقوع الجريمة (1 AP)</div>
        </button>
      </div>

      <!-- FREE-FORM AI QUESTION INPUT -->
      <div style="background:rgba(0,0,0,0.4);border:1px solid var(--gz-border);border-radius:16px;padding:16px;margin-bottom:20px;">
        <div style="font-weight:800;color:var(--gz-gold);font-size:13px;margin-bottom:8px;">💬 استجواب حر بالذكاء الاصطناعي (اكتب أي سؤال يخطر ببالك):</div>
        <div style="display:flex;gap:10px;margin-bottom:10px;">
          <input type="text" id="gz-case-custom-q" placeholder="مثال: أين كنت وقت انطفاء الأنوار؟ لماذا ملابسك ملطخة بالرماد؟" 
                 style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,215,0,0.3);color:#fff;padding:10px 14px;border-radius:10px;font-family:'Cairo';font-size:13px;">
          <button class="bid-btn-action" style="background:#8b5cf6;" onclick="gzGetAIDeduction()">🧠 استنتاج الـ AI</button>
        </div>
        <div style="font-size:11px;color:rgba(255,255,255,0.5);">اختر المشتبه به بالأسفل للضغط على "استجواب بالـ AI" لتوجيه سؤالك المكتوب إليه مباشرة.</div>
      </div>

      <!-- EVIDENCE & INTERVIEW LOGS -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
        <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:14px;min-height:120px;">
          <div style="font-weight:800;color:var(--gz-gold);font-size:13px;margin-bottom:8px;">🔎 الأدلة المجمعة (${caseState.cluesFound.length}):</div>
          ${caseState.cluesFound.length === 0 ? '<div style="color:rgba(255,255,255,0.4);font-size:12px;">لم تجمع أي دليل بعد. تفقد أحد المواقع بالأعلى.</div>' : ''}
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${caseState.cluesFound.map(cl => `<div style="font-size:12px;color:#fff;background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:8px;">${cl}</div>`).join('')}
          </div>
        </div>

        <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:14px;min-height:120px;">
          <div style="font-weight:800;color:#38bdf8;font-size:13px;margin-bottom:8px;">🗣️ حوارات واعترافات المشتبه بهم:</div>
          ${caseState.isAIResponding ? '<div style="color:#fcd34d;font-size:12px;">⏳ الذكاء الاصطناعي يتقمص شخصية المشتبه به ويجيب الآن...</div>' : ''}
          ${caseState.interviewLogs.length === 0 && !caseState.isAIResponding ? '<div style="color:rgba(255,255,255,0.4);font-size:12px;">انقر على "استجواب بالـ AI" لتوجيه سؤالك لأي مشتبه به.</div>' : ''}
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${caseState.interviewLogs.map(log => `<div style="font-size:12px;color:#cbd5e1;background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:8px;border-right:3px solid #38bdf8;">${log}</div>`).join('')}
          </div>
        </div>
      </div>

      <!-- SUSPECTS & ACCUSATION -->
      <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;">
        <div style="font-weight:900;color:var(--gz-gold);font-size:15px;margin-bottom:12px;">👥 دائرة المشتبه بهم الرئيسية:</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px;">
          ${caseState.suspects.map(s => {
            const sName = s[lang] ? s[lang].name : s.name;
            return `
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,215,0,0.25);border-radius:14px;padding:14px;text-align:center;">
                <div style="font-size:38px;margin-bottom:4px;">${s.icon}</div>
                <div style="font-weight:900;color:#fff;font-size:15px;">${sName}</div>
                <div style="font-size:11px;color:var(--gz-gold);margin-bottom:10px;">${s.source} · طاقة: ${s.p}</div>
                <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                  <button class="bid-btn-action" style="padding:6px 12px;font-size:11px;background:#0284c7;" onclick="gzAskCustomAIQuestion(${s.id})">💬 استجواب بالـ AI</button>
                  <button class="bid-btn-action" style="padding:6px 12px;font-size:11px;background:#ef4444;" onclick="gzAccuseSuspect(${s.id})">⚖️ اتهم هذا البطل!</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}


// ──────────────────────────────────────────────────────────────
// 3. TOWER OF DOOM (برج الزعماء مع حوارات الذكاء الاصطناعي)
// ──────────────────────────────────────────────────────────────
let towerState = {
  floor: 1,
  maxFloor: 10,
  team: [],
  teamHp: 100,
  maxHp: 100,
  currentBoss: null,
  bossHp: 100,
  maxBossHp: 100,
  bossDialogue: '',
  inBattle: false
};

function gzInitTower() {
  const pool = [...heroes].sort(() => 0.5 - Math.random());
  towerState = {
    floor: 1,
    maxFloor: 10,
    team: pool.slice(0, 3),
    teamHp: 100,
    maxHp: 100,
    currentBoss: null,
    bossHp: 100,
    maxBossHp: 100,
    bossDialogue: '',
    inBattle: false
  };
  gzSpawnTowerBoss();
}

function gzSpawnTowerBoss() {
  const peakPool = heroes.filter(h => h.isPeak || h.p >= 90);
  const boss = peakPool[Math.floor(Math.random() * peakPool.length)] || heroes[0];
  const bossHp = 80 + towerState.floor * 35;
  towerState.currentBoss = boss;
  towerState.bossHp = bossHp;
  towerState.maxBossHp = bossHp;
  towerState.bossDialogue = `تجرؤون على دخول الطابق ${towerState.floor}؟! ستكون نهايتكم هنا!`;
  towerState.inBattle = true;
  gzRenderTower();
}

function gzTowerAttack(type) {
  if (!towerState.inBattle) return;

  const teamPower = towerState.team.reduce((acc, h) => acc + h.p, 0) / 3;
  let dmg = 0;
  let selfDamage = 0;

  if (type === 'strike') {
    dmg = Math.round(teamPower * 0.45 + Math.random() * 10);
    selfDamage = Math.round(towerState.currentBoss.p * 0.18 + Math.random() * 8);
    towerState.bossDialogue = 'ضربة ضعيفة! تذوق غضبي!';
  } else if (type === 'skill') {
    dmg = Math.round(teamPower * 0.75 + Math.random() * 15);
    selfDamage = Math.round(towerState.currentBoss.p * 0.28 + Math.random() * 10);
    towerState.bossDialogue = 'آرغغ! قوة مذهلة... لكن لن تسقطني بسهولة!';
  } else if (type === 'shield') {
    const heal = Math.min(25, towerState.maxHp - towerState.teamHp);
    towerState.teamHp += heal;
    dmg = Math.round(teamPower * 0.2);
    selfDamage = Math.round(towerState.currentBoss.p * 0.08);
    towerState.bossDialogue = 'تختبئ خلف دروعك؟! الجبناء لا يصعدون هذا البرج!';
  }

  towerState.bossHp = Math.max(0, towerState.bossHp - dmg);
  towerState.teamHp = Math.max(0, towerState.teamHp - selfDamage);

  if (towerState.bossHp <= 0) {
    towerState.inBattle = false;
    if (towerState.floor >= towerState.maxFloor) {
      alert('🏆 أسطووورة! لقد طهرت برج الظلام بالكامل وهزمت أعظم 10 زعماء في التاريخ!');
      gzInitTower();
      return;
    }
    const healBonus = 20;
    towerState.teamHp = Math.min(towerState.maxHp, towerState.teamHp + healBonus);
    towerState.floor++;
    alert(`⚡ انتصرت على الزعيم! صعدت للطابق ${towerState.floor} وتمت استعادة +${healBonus} صحة.`);
    gzSpawnTowerBoss();
    return;
  }

  if (towerState.teamHp <= 0) {
    alert(`💀 سقطت فرقتك في الطابق ${towerState.floor}! أعد المحاولة مجدداً.`);
    gzInitTower();
    return;
  }

  gzRenderTower();
}

function gzRenderTower() {
  const container = document.getElementById('gz-game-view');
  if (!container || gzActiveGame !== 'tower') return;

  const b = towerState.currentBoss;
  if (!b) return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const bossName = b[lang] ? b[lang].name : b.name;
  const teamPct = Math.max(0, Math.round((towerState.teamHp / towerState.maxHp) * 100));
  const bossPct = Math.max(0, Math.round((towerState.bossHp / towerState.maxBossHp) * 100));

  container.innerHTML = `
    <div style="background:radial-gradient(circle at center, #1b1226 0%, #0a0612 100%);border:2px solid var(--gz-purple);border-radius:24px;padding:24px;box-shadow:0 0 40px rgba(168,85,247,0.25);">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:14px;margin-bottom:16px;">
        <div style="font-family:'Cinzel';font-size:22px;color:#d8b4fe;font-weight:900;">🏰 برج الظلام — الطابق ${towerState.floor}/${towerState.maxFloor}</div>
        <div style="color:var(--gz-gold);font-weight:700;font-size:14px;">زعيم الطابق: <strong>${bossName}</strong></div>
      </div>

      <!-- BOSS DIALOGUE BUBBLE -->
      <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:10px 14px;margin-bottom:18px;color:#fca5a5;font-size:13px;font-weight:700;">
        💬 <strong>صوت الزعيم (${bossName}):</strong> "${towerState.bossDialogue}"
      </div>

      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center;margin-bottom:24px;">
        <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(16,185,129,0.3);border-radius:16px;padding:16px;text-align:center;">
          <div style="font-size:13px;color:#4ade80;font-weight:800;margin-bottom:6px;">فرقتك الاستكشافية</div>
          <div style="display:flex;justify-content:center;gap:8px;margin-bottom:10px;">
            ${towerState.team.map(h => `<span style="font-size:32px;" title="${h[lang]?h[lang].name:h.name}">${h.icon}</span>`).join('')}
          </div>
          <div style="font-size:12px;color:#fff;margin-bottom:4px;">صحة الفريق: ${towerState.teamHp} / ${towerState.maxHp}</div>
          <div style="background:rgba(255,255,255,0.1);height:10px;border-radius:99px;overflow:hidden;">
            <div style="background:#10b981;height:100%;width:${teamPct}%;transition:width 0.3s ease;"></div>
          </div>
        </div>

        <div style="font-family:'Cinzel';font-size:28px;font-weight:900;color:#f43f5e;">VS</div>

        <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(244,63,94,0.4);border-radius:16px;padding:16px;text-align:center;">
          <div style="font-size:13px;color:#fb7185;font-weight:800;margin-bottom:6px;">زعيم الطابق الأسطوري</div>
          <div style="font-size:45px;margin-bottom:8px;">${b.icon}</div>
          <div style="font-weight:900;color:#fff;font-size:15px;margin-bottom:4px;">${bossName}</div>
          <div style="font-size:12px;color:#fb7185;margin-bottom:4px;">صحة الزعيم: ${towerState.bossHp} / ${towerState.maxBossHp}</div>
          <div style="background:rgba(255,255,255,0.1);height:10px;border-radius:99px;overflow:hidden;">
            <div style="background:#ef4444;height:100%;width:${bossPct}%;transition:width 0.3s ease;"></div>
          </div>
        </div>
      </div>

      <div style="text-align:center;">
        <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-bottom:12px;">اختر تكتيك الهجوم للفرقة:</div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button class="bid-btn-action" style="background:#10b981;" onclick="gzTowerAttack('strike')">⚔️ هجوم خاطف متوازن</button>
          <button class="bid-btn-action" style="background:#8b5cf6;" onclick="gzTowerAttack('skill')">💥 ضربة القدرة القصوى</button>
          <button class="bid-btn-action" style="background:#3b82f6;" onclick="gzTowerAttack('shield')">🛡️ درع تكتيكي وعلاج</button>
        </div>
      </div>
    </div>
  `;
}


// ──────────────────────────────────────────────────────────────
// 4. MYSTERY DETECTIVE (المحقق وكشف البطل الغامض)
// ──────────────────────────────────────────────────────────────
let mysteryState = {
  secretHero: null,
  questionsLeft: 6,
  askedClues: [],
  gameOver: false,
  won: false
};

function gzInitMystery() {
  mysteryState = {
    secretHero: heroes[Math.floor(Math.random() * heroes.length)],
    questionsLeft: 6,
    askedClues: [],
    gameOver: false,
    won: false
  };
  gzRenderMystery();
}

function gzAskMystery(type) {
  if (mysteryState.questionsLeft <= 0 || mysteryState.gameOver) return;

  const h = mysteryState.secretHero;
  let questionText = '';
  let answer = false;

  if (type === 'type_game') {
    questionText = 'هل هو من عالم الألعاب؟';
    answer = h.type === 'game';
  } else if (type === 'type_anime') {
    questionText = 'هل هو من عالم الأنمي؟';
    answer = h.type === 'anime';
  } else if (type === 'power_90') {
    questionText = 'هل تصنيف طاقته 90 فما فوق؟';
    answer = h.p >= 90;
  } else if (type === 'is_peak') {
    questionText = 'هل هو في طور الذروة (Peak Form)؟';
    answer = !!h.isPeak;
  } else if (type === 'has_magic') {
    questionText = 'هل يمتلك قدرات سحرية / كونية خارقة؟';
    answer = (h.ar && h.ar.ability && (h.ar.ability.includes('سحر') || h.ar.ability.includes('كون') || h.ar.ability.includes('إله'))) || h.p >= 98;
  } else if (type === 'has_weapon') {
    questionText = 'هل يستخدم أسلحة ونصال حادة؟';
    answer = (h.ar && h.ar.ability && (h.ar.ability.includes('سيف') || h.ar.ability.includes('نصل') || h.ar.ability.includes('شفر'))) || false;
  }

  mysteryState.questionsLeft--;
  mysteryState.askedClues.push({ q: questionText, a: answer });
  gzRenderMystery();
}

function gzGuessHero(heroId) {
  if (mysteryState.gameOver) return;

  if (heroId === mysteryState.secretHero.id) {
    mysteryState.won = true;
    mysteryState.gameOver = true;
    alert(`🎉 إجابة عبقرية! البطل السري هو بالفعل: ${mysteryState.secretHero[typeof currentLang !== 'undefined' ? currentLang : 'ar'].name}!`);
  } else {
    mysteryState.questionsLeft--;
    if (mysteryState.questionsLeft <= 0) {
      mysteryState.gameOver = true;
      alert(`💀 نفدت المحاولات! البطل السري كان: ${mysteryState.secretHero[typeof currentLang !== 'undefined' ? currentLang : 'ar'].name}`);
    } else {
      alert(`❌ تخمين خاطئ! متبقي لديك ${mysteryState.questionsLeft} محاولات.`);
    }
  }
  gzRenderMystery();
}

function gzRenderMystery() {
  const container = document.getElementById('gz-game-view');
  if (!container || gzActiveGame !== 'mystery') return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const candidates = heroes.slice(0, 18);

  container.innerHTML = `
    <div style="background:radial-gradient(circle at center, #0f1c2e 0%, #070c14 100%);border:2px solid var(--gz-blue);border-radius:24px;padding:24px;box-shadow:0 0 40px rgba(56,189,248,0.25);">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:14px;margin-bottom:20px;">
        <div style="font-family:'Cinzel';font-size:22px;color:#7dd3fc;font-weight:900;">❓ المحقق الغامض (Who Is The Champion?)</div>
        <div style="color:var(--gz-gold);font-weight:800;font-size:16px;">المحاولات المتبقية: <strong>${mysteryState.questionsLeft}</strong> ⏳</div>
      </div>

      <div style="background:rgba(0,0,0,0.35);border-radius:14px;padding:14px;margin-bottom:20px;min-height:80px;">
        <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-bottom:8px;font-weight:700;">سجل التحريات والتلميحات:</div>
        ${mysteryState.askedClues.length === 0 ? '<div style="color:rgba(255,255,255,0.4);font-size:12px;">اطرح سؤالاً بالأسفل لكشف هوية البطل...</div>' : ''}
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${mysteryState.askedClues.map(c => `
            <div style="font-size:13px;display:flex;justify-content:space-between;padding:6px 10px;background:rgba(255,255,255,0.03);border-radius:8px;">
              <span style="color:#fff;">${c.q}</span>
              <strong style="color:${c.a ? '#4ade80' : '#f87171'};">${c.a ? '✅ نعم' : '❌ لا'}</strong>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:24px;">
        <div style="font-weight:700;color:#fff;margin-bottom:10px;font-size:13px;">اختر سؤال استجواب من المحقق:</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="bid-btn-action" style="background:#0284c7;" onclick="gzAskMystery('type_game')">🎮 هل هو من الألعاب؟</button>
          <button class="bid-btn-action" style="background:#0284c7;" onclick="gzAskMystery('type_anime')">⚡ هل هو من الأنمي؟</button>
          <button class="bid-btn-action" style="background:#0284c7;" onclick="gzAskMystery('power_90')">🔥 هل قوته 90+؟</button>
          <button class="bid-btn-action" style="background:#0284c7;" onclick="gzAskMystery('is_peak')">👑 هل هو طور ذروة (Peak)؟</button>
          <button class="bid-btn-action" style="background:#0284c7;" onclick="gzAskMystery('has_magic')">🔮 هل قدرته سحرية/كونية؟</button>
          <button class="bid-btn-action" style="background:#0284c7;" onclick="gzAskMystery('has_weapon')">⚔️ هل يقاتل بالسيف؟</button>
        </div>
      </div>

      <div>
        <div style="font-weight:700;color:var(--gz-gold);margin-bottom:10px;font-size:13px;">هل عرفت من هو؟ انقر على البطل لتأكيد تخمينك:</div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;">
          ${candidates.map(h => `
            <div style="padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,215,0,0.3);border-radius:10px;text-align:center;min-width:85px;cursor:pointer;"
                 onclick="gzGuessHero(${h.id})">
              <div style="font-size:28px;">${h.icon}</div>
              <div style="font-size:11px;font-weight:700;color:#fff;">${h[lang]?h[lang].name:h.name}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}


// ──────────────────────────────────────────────────────────────
// 5. CHAMPIONS AUCTION (مزاد الأبطال مع تقييم الذكاء الاصطناعي)
// ──────────────────────────────────────────────────────────────
let auctionState = {
  currentHero: null,
  currentBid: 10,
  highestBidder: 'البنك',
  userBudget: 150,
  userSquad: [],
  timeLeft: 8,
  aiTeamReport: '',
  timerInterval: null
};

function gzInitAuction() {
  auctionState.userSquad = [];
  auctionState.userBudget = 150;
  auctionState.aiTeamReport = '';
  gzNextAuctionHero();
}

function gzNextAuctionHero() {
  if (auctionState.userSquad.length >= 5) {
    gzAnalyzeSquadAI();
    return;
  }
  const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
  auctionState.currentHero = randomHero;
  auctionState.currentBid = Math.max(5, Math.floor(randomHero.p / 4));
  auctionState.highestBidder = 'البنك';
  auctionState.timeLeft = 8;

  gzRenderAuction();

  if (auctionState.timerInterval) clearInterval(auctionState.timerInterval);
  auctionState.timerInterval = setInterval(() => {
    auctionState.timeLeft--;
    if (auctionState.timeLeft <= 0) {
      clearInterval(auctionState.timerInterval);
      gzFinishAuctionLot();
    }
    const tEl = document.getElementById('gz-auc-time');
    if (tEl) tEl.innerText = auctionState.timeLeft;
  }, 1000);
}

function gzUserBid(amount) {
  if (auctionState.userBudget < amount) {
    alert('⚠️ لا تملك ميزانية كافية!');
    return;
  }
  auctionState.currentBid = amount;
  auctionState.highestBidder = 'أنت (القائد)';
  auctionState.timeLeft = 6;
  gzRenderAuction();
}

function gzFinishAuctionLot() {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  if (auctionState.highestBidder.includes('أنت')) {
    auctionState.userBudget -= auctionState.currentBid;
    auctionState.userSquad.push(auctionState.currentHero);
    alert(`🎉 تهانينا! فزت بـ ${auctionState.currentHero[lang].name}!`);
  } else {
    alert(`⏳ بيع البطل لخصم آخر.`);
  }
  gzNextAuctionHero();
}

async function gzAnalyzeSquadAI() {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const squadNames = auctionState.userSquad.map(h => `${h[lang]?h[lang].name:h.name} (${h.source}, Power: ${h.p})`).join(', ');
  
  const prompt = `Analyze this 5-member dream battle squad formed from an auction:
Squad: ${squadNames}
Remaining Budget: ${auctionState.userBudget}M

Provide a 2-3 sentence gaming analysis in Arabic rating their chemistry, synergy, and overall threat level (e.g. S-Tier / 95/100).`;

  try {
    const res = await window.gzCallAI([{ role: 'user', content: prompt }], 'You are a tactical gaming squad analyst.', 250);
    auctionState.aiTeamReport = res.text;
  } catch (e) {
    auctionState.aiTeamReport = 'فريق أسطوري متكامل يجمع بين القوة التدميرية وسرعة رد الفعل والخبرة التكتيكية!';
  }

  gzRenderAuction();
}

function gzRenderAuction() {
  const container = document.getElementById('gz-game-view');
  if (!container || gzActiveGame !== 'auction') return;

  const h = auctionState.currentHero;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';

  container.innerHTML = `
    <div class="auction-hero-box">
      ${auctionState.aiTeamReport ? `
        <div style="background:rgba(16,185,129,0.15);border:1px solid #10b981;border-radius:14px;padding:16px;margin-bottom:20px;text-align:right;">
          <div style="font-weight:900;color:#10b981;font-size:15px;margin-bottom:6px;">🏆 تقرير المحلل الذكي لتشكيلتك الخماسية (AI Team Report):</div>
          <div style="color:#fff;font-size:13px;line-height:1.6;">${auctionState.aiTeamReport}</div>
          <button class="bid-btn-action" style="margin-top:12px;" onclick="gzInitAuction()">🔄 مزاد جديد</button>
        </div>
      ` : ''}

      ${h && auctionState.userSquad.length < 5 ? `
        <div class="auction-timer-circle" id="gz-auc-time">${auctionState.timeLeft}</div>
        <div style="font-size:55px;margin:10px 0;">${h.icon}</div>
        <h2 style="color:var(--gz-gold);font-family:'Cinzel';font-size:24px;margin-bottom:4px;">${h[lang].name}</h2>
        <div style="color:rgba(255,255,255,0.7);font-size:13px;">${h.source} · طاقة القوة: <strong>${h.p}</strong></div>
        
        <div style="display:flex;justify-content:center;gap:20px;margin:20px 0;font-size:16px;flex-wrap:wrap;">
          <div>💰 السعر الحالي: <strong style="color:var(--gz-gold);">${auctionState.currentBid}M</strong></div>
          <div>👑 أعلى مزايد: <strong style="color:#38bdf8;">${auctionState.highestBidder}</strong></div>
          <div>🏦 ميزانيتك: <strong style="color:#10b981;">${auctionState.userBudget}M</strong></div>
        </div>

        <div class="auction-bid-buttons">
          <button class="bid-btn-action" onclick="gzUserBid(${auctionState.currentBid + 2})">+2M مزايدة</button>
          <button class="bid-btn-action" onclick="gzUserBid(${auctionState.currentBid + 5})">+5M مزايدة</button>
          <button class="bid-btn-action" style="background:#b44dff;" onclick="gzUserBid(${auctionState.currentBid + 10})">+10M ضربة قاضية</button>
        </div>
      ` : ''}

      <div style="margin-top:30px;text-align:right;">
        <h4 style="color:var(--gz-gold);margin-bottom:10px;">🛡️ تشكيلة فريقك (${auctionState.userSquad.length}/5):</h4>
        <div style="display:flex;gap:10px;overflow-x:auto;">
          ${auctionState.userSquad.map(sq => `
            <div style="padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,215,0,0.3);border-radius:10px;text-align:center;min-width:90px;">
              <div style="font-size:24px;">${sq.icon}</div>
              <div style="font-size:11px;font-weight:700;color:#fff;">${sq[lang].name}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ──────────────────────────────────────────────────────────────
// HUB SWITCHER
// ──────────────────────────────────────────────────────────────
function gzSwitchGame(gameName) {
  gzActiveGame = gameName;
  document.querySelectorAll('.game-pill-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.game === gameName);
  });

  if (gameName === 'gwent') gzInitGwent();
  else if (gameName === 'detective_rpg') gzInitCase();
  else if (gameName === 'tower') gzInitTower();
  else if (gameName === 'mystery') gzInitMystery();
  else if (gameName === 'auction') gzInitAuction();
}

window.gzSwitchGame = gzSwitchGame;
window.gzPlayCard = gzPlayCard;
window.gzPassTurn = gzPassTurn;
window.gzInitGwent = gzInitGwent;
window.gzInitCase = gzInitCase;
window.gzInvestigateArea = gzInvestigateArea;
window.gzAskCustomAIQuestion = gzAskCustomAIQuestion;
window.gzGetAIDeduction = gzGetAIDeduction;
window.gzAccuseSuspect = gzAccuseSuspect;
window.gzTowerAttack = gzTowerAttack;
window.gzAskMystery = gzAskMystery;
window.gzGuessHero = gzGuessHero;
window.gzUserBid = gzUserBid;
window.gzInitAuction = gzInitAuction;
