// ══════════════════════════════════════════════════════════════════════════
// GAME ZONE: GOLDEN ARENA 700 — PROFESSIONAL INTERACTIVE GAMES v3.0
// ✅ Authentic Witcher 3 Gwent: Melee/Ranged/Siege rows, Horn per-row,
//    Decoy, Clear Weather, Leader, Tight Bond, Hero immunity, real deck
// ✅ Character portraits: DiceBear SVG + emoji gradient fallback  
// ✅ Detective RPG with AI dialogue and evidence system
// ✅ Tower Roguelite with HP carry-over
// ✅ Mystery Who-Am-I with 6 questions
// ✅ Champions Auction - clean, no background alerts
// ══════════════════════════════════════════════════════════════════════════

'use strict';

// ─────────────────────────────────────────────
// AVATAR / PORTRAIT SYSTEM
// Uses DiceBear avatars (no external image hosting needed)
// DiceBear is CORS-safe, works from any origin
// ─────────────────────────────────────────────

// Map hero id / name patterns to DiceBear seeds and styles
// Also try Wikimedia for real characters (with no-referrer)
const GZ_CHAR_IMAGES = {
  // Gaming
  "1":  "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kratos_PS4.jpg/220px-Kratos_PS4.jpg",
  "kratos": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kratos_PS4.jpg/220px-Kratos_PS4.jpg",
  "2":  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Doom_Slayer_Helmet.jpg/220px-Doom_Slayer_Helmet.jpg",
  "doom": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Doom_Slayer_Helmet.jpg/220px-Doom_Slayer_Helmet.jpg",
  "8":  "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Geralt_of_Rivia_Witcher_3.png/220px-Geralt_of_Rivia_Witcher_3.png",
  "geralt": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Geralt_of_Rivia_Witcher_3.png/220px-Geralt_of_Rivia_Witcher_3.png",
  "11": "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-creed.jpg/220px-Batman-creed.jpg",
  "batman": "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-creed.jpg/220px-Batman-creed.jpg",
  "3":  "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Thanos_MCU.jpg/220px-Thanos_MCU.jpg",
  "thanos": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Thanos_MCU.jpg/220px-Thanos_MCU.jpg",
  "30": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/NeoTheMatrix.jpg/220px-NeoTheMatrix.jpg",
  "neo": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/NeoTheMatrix.jpg/220px-NeoTheMatrix.jpg",
  "12": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/John_Wick_Keanu_Reeves.jpg/220px-John_Wick_Keanu_Reeves.jpg",
  "wick": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/John_Wick_Keanu_Reeves.jpg/220px-John_Wick_Keanu_Reeves.jpg",
};

function gzGetHeroImageUrl(hero) {
  if (!hero) return '';
  // Check by id first
  if (GZ_CHAR_IMAGES[String(hero.id)]) return GZ_CHAR_IMAGES[String(hero.id)];
  // Then by name keyword
  const nameLower = (hero.en ? hero.en.name : hero.name || '').toLowerCase();
  for (const [key, url] of Object.entries(GZ_CHAR_IMAGES)) {
    if (!isNaN(key)) continue; // skip numeric keys (already checked)
    if (nameLower.includes(key)) return url;
  }
  return '';
}

// Generate a rich gradient avatar with emoji for heroes without photos
function gzRenderHeroAvatar(hero, size = 60, showName = false) {
  if (!hero) return '';
  const imgUrl = gzGetHeroImageUrl(hero);
  const hash = Array.from(String(hero.id || 1)).reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = (hash * 47) % 360;
  const hue2 = (hue + 60) % 360;
  const icon = hero.icon || '⚔️';
  const name = hero.ar ? hero.ar.name : hero.name || '؟';
  const isPeak = hero.isPeak;

  const borderColor = isPeak ? '#ffd700' : `hsl(${hue}, 70%, 55%)`;
  const glow = isPeak
    ? '0 0 18px rgba(255,215,0,0.7), 0 0 35px rgba(255,215,0,0.3)'
    : `0 0 14px hsla(${hue},70%,55%,0.5)`;

  const style = `width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;position:relative;flex-shrink:0;` +
    `border:2.5px solid ${borderColor};box-shadow:${glow};display:inline-flex;align-items:center;justify-content:center;` +
    `background:linear-gradient(135deg,hsl(${hue},55%,22%),hsl(${hue2},65%,12%));cursor:default;`;

  let inner;
  if (imgUrl) {
    inner = `<img src="${imgUrl}" alt="${name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" referrerpolicy="no-referrer"
      onerror="this.remove();this.parentElement.querySelector('.gz-av-icon').style.display='flex';" />
      <span class="gz-av-icon" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:${Math.round(size*0.45)}px;">${icon}</span>`;
  } else {
    inner = `<span style="font-size:${Math.round(size*0.45)}px;line-height:1;">${icon}</span>`;
  }

  const nameTag = showName ? `<div style="font-size:10px;color:rgba(255,255,255,0.8);font-weight:700;margin-top:4px;text-align:center;max-width:${size+16}px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>` : '';

  return `<div style="display:inline-flex;flex-direction:column;align-items:center;">
    <div style="${style}">${inner}</div>
    ${nameTag}
  </div>`;
}

// ─────────────────────────────────────────────
// TOAST (no alert popups ever)
// ─────────────────────────────────────────────
function gzToast(msg, type = 'info', duration = 3500) {
  let el = document.getElementById('gz-app-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'gz-app-toast';
    el.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:999999;
      pointer-events:none;transition:opacity 0.3s ease;max-width:480px;width:calc(100% - 32px);`;
    document.body.appendChild(el);
  }
  const colors = {
    info:    'linear-gradient(135deg,#0ea5e9,#0369a1)',
    success: 'linear-gradient(135deg,#10b981,#047857)',
    warn:    'linear-gradient(135deg,#f59e0b,#b45309)',
    error:   'linear-gradient(135deg,#ef4444,#b91c1c)',
    gold:    'linear-gradient(135deg,#ffd700,#b7791f)'
  };
  el.style.opacity = '1';
  el.innerHTML = `<div style="background:${colors[type]||colors.info};color:#fff;padding:13px 20px;border-radius:14px;
    font-family:'Cairo',sans-serif;font-weight:700;font-size:14px;
    box-shadow:0 8px 30px rgba(0,0,0,0.5);text-align:center;border:1px solid rgba(255,255,255,0.15);
    animation:gzToastSlide 0.3s ease-out;">${msg}</div>`;
  clearTimeout(window._gzToastT);
  window._gzToastT = setTimeout(() => { el.style.opacity = '0'; }, duration);
}

// ─────────────────────────────────────────────
// ROOM CODE
// ─────────────────────────────────────────────
function gzGenerateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'GZ-' + Array.from({length:4}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
}

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let gzActiveGame = 'lobby';
let gzOpponentMode = 'ai';
let gzCurrentRoomCode = '';

function gzSwitchGame(gameId) {
  gzActiveGame = gameId;
  // Update nav pills
  document.querySelectorAll('.game-pill-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.game === gameId);
  });
  // Stop any running timers
  if (window.gzAuctionInterval) { clearInterval(window.gzAuctionInterval); window.gzAuctionInterval = null; }
  if (window.gzAuctionCountdown) { clearInterval(window.gzAuctionCountdown); window.gzAuctionCountdown = null; }

  if (gameId === 'lobby') gzRenderLobby();
  else gzOpenGameSetup(gameId);
}

// ─────────────────────────────────────────────
// LOBBY
// ─────────────────────────────────────────────
const GZ_GAMES_CATALOG = [
  {
    id: 'gwent', icon: '🎴', badge: 'استراتيجي 1v1', badgeColor: '#ffd700',
    title: 'جوينت الأساطير',
    sub: 'Gwent — Witcher 3 Style',
    desc: 'لعبة بطاقات تكتيكية مستوحاة بدقة من The Witcher 3. ثلاثة صفوف (Melee · Ranged · Siege)، بوق القائد، بطاقات الطقس، الجاسوس، الـ Decoy والـ Clear Weather. الفوز بأفضل من 3 جولات.',
    players: '1v1 ضد AI أو صديق',
    feat: ['⚔️ صف Melee', '🏹 صف Ranged', '🏰 صف Siege', '🎺 Commander Horn', '❄️ Weather', '🕵️ Spy & Decoy']
  },
  {
    id: 'detective_rpg', icon: '🕵️', badge: 'RPG + AI', badgeColor: '#38bdf8',
    title: 'تحقيقات الأساطير',
    sub: 'Detective RPG — AI Powered',
    desc: 'احصل على بطل عشوائي محقق (شيرلوك، إيتان هوك، نارتو، هالك...) كل بطل له مهارات تحقيق مختلفة. استجوب الشهود، افحص الأدلة، واكشف الجاني.',
    players: 'منفردي + AI محاور',
    feat: ['🎭 بطل عشوائي', '🔍 أدلة ديناميكية', '💬 AI حر', '🏆 نقاط ذكاء']
  },
  {
    id: 'tower', icon: '🏰', badge: 'روجلايك', badgeColor: '#a855f7',
    title: 'برج الظلام',
    sub: 'Tower of Doom — Roguelite',
    desc: 'اختر فريق من 3 أبطال واصعد 10 طوابق من الرعب مع أعتى الزعماء. الصحة تُحمل من طابق لآخر، اختر أبطالك بحكمة.',
    players: 'PvE — صعود البرج',
    feat: ['🗡️ 3 أبطال', '❤️ HP تراكمي', '👹 10 زعيماً', '✨ قدرات خاصة']
  },
  {
    id: 'mystery', icon: '❓', badge: 'تخمين', badgeColor: '#10b981',
    title: 'البطل الغامض',
    sub: 'Who Am I? — 700 Heroes',
    desc: 'خمّن البطل الخفي من بين 700 أسطورة عبر 6 أسئلة ذكية. الأسئلة المحدودة تجعل كل تخمين ثميناً!',
    players: 'فردي أو تحدي أصدقاء',
    feat: ['🎲 700 بطل', '6️⃣ أسئلة فقط', '💡 تلميحات ذكية', '⏱️ نقاط توقيت']
  },
  {
    id: 'auction', icon: '👑', badge: 'مزاد حي', badgeColor: '#f59e0b',
    title: 'مزاد الأبطال',
    sub: 'Champions Auction — Draft Mode',
    desc: 'ميزانية 150M لمزايدة حية واقتناص 5 أبطال. حلل التناغم، قيّم الفريق بالـ AI وانشئ فريق الأحلام.',
    players: 'مزاد تكتيكي',
    feat: ['💰 150M', '5 أبطال', '🤖 تقييم AI', '📊 تحليل التناغم']
  }
];

function gzRenderLobby() {
  const c = document.getElementById('gz-game-view');
  if (!c) return;
  c.innerHTML = `
    <div style="max-width:1200px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:28px;">
        <h2 style="font-family:'Cinzel','Cairo',serif;color:var(--gz-gold);font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;margin-bottom:8px;text-shadow:0 0 30px rgba(255,215,0,0.4);">
          🎮 اختر ساحة النزال
        </h2>
        <p style="color:rgba(255,255,255,0.65);font-size:13px;">5 ألعاب تفاعلية مع 700 بطل أسطوري ودعم الذكاء الاصطناعي</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;">
        ${GZ_GAMES_CATALOG.map(g => `
          <div onclick="gzOpenGameSetup('${g.id}')" style="
            background:linear-gradient(145deg,rgba(20,25,40,0.9) 0%,rgba(10,13,22,0.98) 100%);
            border:1.5px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px 20px;
            display:flex;flex-direction:column;cursor:pointer;position:relative;overflow:hidden;
            transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 8px 24px rgba(0,0,0,0.5);"
            onmouseover="this.style.borderColor='${g.badgeColor}';this.style.transform='translateY(-6px) scale(1.02)';this.style.boxShadow='0 16px 40px ${g.badgeColor}33'"
            onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.5)'">
            <div style="position:absolute;top:14px;right:14px;background:${g.badgeColor}22;color:${g.badgeColor};border:1px solid ${g.badgeColor}55;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">
              ${g.badge}
            </div>
            <div style="font-size:42px;margin-bottom:10px;">${g.icon}</div>
            <div style="font-weight:900;font-size:18px;color:#fff;margin-bottom:2px;">${g.title}</div>
            <div style="font-size:11px;color:${g.badgeColor};font-weight:700;margin-bottom:10px;">${g.sub}</div>
            <p style="color:rgba(255,255,255,0.6);font-size:12px;line-height:1.7;flex:1;margin-bottom:14px;">${g.desc}</p>
            <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:16px;">
              ${g.feat.map(f => `<span style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);font-size:10px;padding:3px 8px;border-radius:6px;color:rgba(255,255,255,0.75);">${f}</span>`).join('')}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.07);padding-top:12px;">
              <span style="font-size:11px;color:rgba(255,255,255,0.4);">👥 ${g.players}</span>
              <button style="background:${g.badgeColor};color:#000;border:none;padding:8px 18px;border-radius:10px;font-weight:900;font-size:12px;cursor:pointer;font-family:'Cairo',sans-serif;">
                انطلق ⚔️
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function gzOpenGameSetup(gameId) {
  gzActiveGame = gameId;
  gzCurrentRoomCode = gzGenerateRoomCode();
  const game = GZ_GAMES_CATALOG.find(g => g.id === gameId);
  const c = document.getElementById('gz-game-view');
  if (!c || !game) return;

  c.innerHTML = `
    <div style="max-width:600px;margin:0 auto;background:radial-gradient(circle at 30% 30%,#182032 0%,#0c0f18 100%);
      border:2px solid ${game.badgeColor};border-radius:24px;padding:28px;box-shadow:0 0 60px ${game.badgeColor}33;">
      <div style="text-align:center;margin-bottom:22px;">
        <div style="font-size:48px;margin-bottom:8px;">${game.icon}</div>
        <h2 style="color:${game.badgeColor};font-family:'Cinzel','Cairo';font-size:22px;font-weight:900;margin-bottom:4px;">${game.title}</h2>
        <p style="color:rgba(255,255,255,0.6);font-size:12px;">${game.sub}</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;">
        <div class="gz-mode-option active" id="gz-opt-ai" onclick="gzSelectMode('ai')" style="border-color:${game.badgeColor};">
          <div style="font-size:28px;margin-bottom:6px;">🤖</div>
          <div style="font-weight:900;color:#fff;font-size:14px;margin-bottom:3px;">ضد الذكاء الاصطناعي</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.55);">نزال فوري مع تعليق ذكي</div>
        </div>
        <div class="gz-mode-option" id="gz-opt-friend" onclick="gzSelectMode('friend')">
          <div style="font-size:28px;margin-bottom:6px;">👥</div>
          <div style="font-weight:900;color:#fff;font-size:14px;margin-bottom:3px;">ضد صديق (كود الغرفة)</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.55);">شارك كود الدعوة</div>
        </div>
      </div>

      <div id="gz-friend-box" style="display:none;background:rgba(0,0,0,0.4);border:1px solid rgba(255,215,0,0.3);border-radius:14px;padding:16px;margin-bottom:18px;text-align:center;">
        <div style="font-size:11px;color:var(--gz-gold);margin-bottom:6px;font-weight:800;">🔑 كود الغرفة:</div>
        <div style="font-family:'Courier New',monospace;font-size:26px;color:#fff;letter-spacing:4px;font-weight:900;margin-bottom:10px;">${gzCurrentRoomCode}</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">
          <button onclick="gzCopyRoomCode()" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Cairo',sans-serif;">📋 نسخ الكود</button>
          <button onclick="gzShareRoomLink()" style="background:#10b981;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Cairo',sans-serif;">📤 مشاركة رابط</button>
        </div>
        <div>
          <input id="gz-join-input" placeholder="أدخل كود صديقك للانضمام..." style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;width:200px;font-family:'Cairo';">
          <button onclick="gzJoinFriendRoom()" style="background:#8b5cf6;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Cairo',sans-serif;margin-right:6px;">انضمام</button>
        </div>
      </div>

      <div style="display:flex;gap:12px;justify-content:center;">
        <button onclick="gzLaunchActiveGame()" style="background:linear-gradient(135deg,${game.badgeColor},#ff6b00);color:#000;border:none;padding:13px 36px;border-radius:12px;font-weight:900;font-size:15px;cursor:pointer;font-family:'Cairo',sans-serif;box-shadow:0 6px 20px rgba(255,215,0,0.3);">
          🚀 ابدأ المعركة
        </button>
        <button onclick="gzRenderLobby()" style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);padding:13px 24px;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;font-family:'Cairo',sans-serif;">
          ← رجوع
        </button>
      </div>
    </div>`;
}

function gzSelectMode(mode) {
  gzOpponentMode = mode;
  document.getElementById('gz-opt-ai')?.classList.toggle('active', mode === 'ai');
  document.getElementById('gz-opt-friend')?.classList.toggle('active', mode === 'friend');
  const fb = document.getElementById('gz-friend-box');
  if (fb) fb.style.display = mode === 'friend' ? 'block' : 'none';
}

function gzCopyRoomCode() {
  navigator.clipboard?.writeText(gzCurrentRoomCode).then(() => gzToast(`✅ تم نسخ الكود: ${gzCurrentRoomCode}`, 'success'));
}

function gzShareRoomLink() {
  const url = location.href.split('?')[0] + `?game=${gzActiveGame}&room=${gzCurrentRoomCode}`;
  if (navigator.share) navigator.share({ title: 'Game Zone Arena', text: `العب معي! كود الغرفة: ${gzCurrentRoomCode}`, url });
  else navigator.clipboard?.writeText(url).then(() => gzToast('✅ تم نسخ رابط الدعوة!', 'success'));
}

function gzJoinFriendRoom() {
  const code = document.getElementById('gz-join-input')?.value.trim();
  if (!code) { gzToast('⚠️ أدخل كود الغرفة أولاً', 'warn'); return; }
  gzCurrentRoomCode = code;
  gzToast(`🎉 انضممت للغرفة [${code}]!`, 'success');
  setTimeout(gzLaunchActiveGame, 600);
}

function gzLaunchActiveGame() {
  if (gzActiveGame === 'gwent') gzInitGwent();
  else if (gzActiveGame === 'detective_rpg') gzInitDetective();
  else if (gzActiveGame === 'tower') gzInitTower();
  else if (gzActiveGame === 'mystery') gzInitMystery();
  else if (gzActiveGame === 'auction') gzInitAuction();
}

// ══════════════════════════════════════════════════════════════════════════
// ████ 1. GWENT — AUTHENTIC WITCHER 3 STYLE ████
// 3 rows per side: Melee | Ranged | Siege
// Commander's Horn slot per row
// Weather affects rows: Frost→Melee, Fog→Ranged, Rain→Siege
// Hero cards immune to weather
// Spy: played on opponent's board, draw 2 cards
// Decoy: return your unit from board to hand
// Clear Weather: remove all weather
// Scorch: burn highest non-hero unit on board
// Leader: powerful once-per-match ability
// ══════════════════════════════════════════════════════════════════════════

const GW = {
  ROWS: ['melee', 'ranged', 'siege'],
  ROW_LABELS: { melee: '⚔️ قتال قريب', ranged: '🏹 رماة بعيدون', siege: '🏰 آلات الحصار' },
  ROW_WEATHER: { melee: 'frost', ranged: 'fog', siege: 'rain' },
  WEATHER_LABELS: { frost: '❄️ صقيع', fog: '🌫️ ضباب', rain: '🌧️ عاصفة' }
};

let gwentState = {};

// Build deck from heroes
function gwBuildDeck() {
  const pool = [...window.heroes].sort(() => 0.5 - Math.random());
  return pool.slice(0, 25).map(h => gwHeroToCard(h));
}

function gwHeroToCard(hero) {
  // Assign row based on hero type
  let row = 'melee';
  const src = (hero.source || '').toLowerCase();
  const abil = hero.ar ? hero.ar.ability : '';
  if (src.includes('matrix') || src.includes('harry') || src.includes('doctor') || src.includes('fma') ||
      abil.includes('سحر') || abil.includes('خيمياء') || abil.includes('ذكاء') || hero.p >= 95) {
    row = 'siege'; // "siege" = long-range/magic
  } else if (hero.type === 'anime' || src.includes('wick') || src.includes('007') || src.includes('horizon') ||
             abil.includes('قنص') || abil.includes('رمي') || abil.includes('هجوم') || abil.includes('بعيد')) {
    row = 'ranged';
  }

  // Power: scale from hero.p (70–100 range → 2–15)
  let power = Math.max(2, Math.min(15, Math.round((hero.p - 68) / 2.2)));
  if (hero.isPeak) power = Math.min(18, power + 3);

  // Is hero? Heroes immune to weather and scorch
  const isHero = hero.p >= 93 || hero.isPeak;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  return {
    id: hero.id,
    heroObj: hero,
    name: hero[lang] ? hero[lang].name : 'بطل',
    abilityName: hero[lang] ? hero[lang].ability : '',
    icon: hero.icon || '⚔️',
    row,
    power,
    origPower: power,
    isHero,          // immune to weather & scorch
    isSpy: false,    // assigned separately for specials
    type: 'unit',
    source: hero.source || ''
  };
}

// Special cards
function gwSpecials() {
  return [
    { id:'sp_frost',  name:'❄️ صقيع قارس',    icon:'❄️', power:0, row:'special', type:'frost',       desc:'يضع الصقيع على صف القتال القريب — يُضعف جميع الوحدات غير الأبطال إلى 2' },
    { id:'sp_fog',    name:'🌫️ ضباب الغاب',   icon:'🌫️', power:0, row:'special', type:'fog',         desc:'يغطي صف الرماة — يُضعف جميع الوحدات غير الأبطال إلى 2' },
    { id:'sp_rain',   name:'🌧️ عاصفة الحصار', icon:'🌧️', power:0, row:'special', type:'rain',        desc:'تضرب صف الحصار — يُضعف جميع الوحدات غير الأبطال إلى 2' },
    { id:'sp_clear',  name:'☀️ صحو الأفق',    icon:'☀️', power:0, row:'special', type:'clear',       desc:'يُزيل جميع تأثيرات الطقس من الساحة دفعةً واحدة' },
    { id:'sp_horn',   name:'🎺 بوق القائد',    icon:'🎺', power:0, row:'special', type:'horn',        desc:'يُضاعف طاقة صف بأكمله — اختر الصف بعد اللعب' },
    { id:'sp_scorch', name:'🔥 لهيب الحرق',   icon:'🔥', power:0, row:'special', type:'scorch',      desc:'يدمر أقوى وحدة غير بطل على الساحة بأكملها' },
    { id:'sp_decoy',  name:'🪤 الفخ المزيف',   icon:'🪤', power:0, row:'special', type:'decoy',       desc:'أعد وحدة واحدة من ساحتك إلى يدك وألعبها مجدداً' },
    { id:'sp_spy',    name:'🕵️ الجاسوس',       icon:'🕵️', power:4, row:'melee',   type:'unit', isSpy:true, desc:'ضع الجاسوس في صف الخصم — واسحب ورقتين جديدتين' },
  ];
}

function gwInitState() {
  // Player gets 10 unit cards + 3 specials
  const deck = gwBuildDeck();
  const specs = gwSpecials().sort(() => 0.5 - Math.random());
  const playerHand = deck.slice(0, 10).concat(specs.slice(0, 3));
  const botHand = deck.slice(10, 20).concat(specs.slice(3, 6));

  return {
    playerHand,
    botHand,
    playerBoard: { melee: [], ranged: [], siege: [] },
    botBoard:    { melee: [], ranged: [], siege: [] },
    playerHorn:  { melee: false, ranged: false, siege: false },
    botHorn:     { melee: false, ranged: false, siege: false },
    weather:     { frost: false, fog: false, rain: false },
    playerGems: 2, // round wins needed
    botGems:    2,
    playerPassed: false,
    botPassed:    false,
    round: 1,
    turn: 'player',
    log: ['🎴 بدأت معركة الجوينت! ألقِ أولى بطاقاتك بحكمة.'],
    pendingHorn: null,  // when player plays horn, ask which row
    pendingDecoy: null  // when player plays decoy, ask which card to pick up
  };
}

function gzInitGwent() {
  gwentState = gwInitState();
  gwRender();
}

// ── Score calculation ──
function gwRowScore(cards, weatherActive, hornActive) {
  let sum = cards.reduce((a, c) => {
    let p = c.origPower || c.power;
    if (weatherActive && !c.isHero) p = 1;
    return a + p;
  }, 0);
  if (hornActive) sum *= 2;
  return sum;
}

function gwScores(isPlayer) {
  const b = isPlayer ? gwentState.playerBoard : gwentState.botBoard;
  const h = isPlayer ? gwentState.playerHorn  : gwentState.botHorn;
  const w = gwentState.weather;
  const m = gwRowScore(b.melee, w.frost, h.melee);
  const r = gwRowScore(b.ranged, w.fog,  h.ranged);
  const s = gwRowScore(b.siege,  w.rain, h.siege);
  return { melee: m, ranged: r, siege: s, total: m + r + s };
}

// ── Card play ──
function gwPlayCard(idx) {
  const st = gwentState;
  if (st.playerPassed || st.turn !== 'player') return;
  if (st.pendingHorn || st.pendingDecoy) return;

  const card = st.playerHand[idx];
  if (!card) return;
  st.playerHand.splice(idx, 1);

  const result = gwApplyCard(card, true);
  if (result === 'PENDING') return; // waiting for row/decoy selection
  if (result) st.log.unshift(result);

  // Bot turn
  st.turn = 'bot';
  gwRender();
  if (!st.botPassed) setTimeout(gwBotTurn, 1000);
  else { st.turn = 'player'; gwCheckRoundEnd(); }
}

function gwApplyCard(card, isPlayer) {
  const st = gwentState;
  const side = isPlayer ? 'player' : 'bot';
  const oppSide = isPlayer ? 'bot' : 'player';

  if (card.type === 'frost')  { st.weather.frost = true; return `❄️ ${isPlayer?'لعبت':'الخصم لعب'} صقيعاً على صف القتال!`; }
  if (card.type === 'fog')    { st.weather.fog   = true; return `🌫️ ${isPlayer?'لعبت':'الخصم لعب'} ضباباً على صف الرماة!`; }
  if (card.type === 'rain')   { st.weather.rain  = true; return `🌧️ ${isPlayer?'لعبت':'الخصم لعب'} عاصفة على صف الحصار!`; }
  if (card.type === 'clear')  { st.weather.frost = st.weather.fog = st.weather.rain = false; return '☀️ صحا الأفق! جميع تأثيرات الطقس أُزيلت.'; }
  if (card.type === 'scorch') { return gwDoScorch(isPlayer); }

  if (card.type === 'horn') {
    if (isPlayer) {
      st.pendingHorn = true;
      gwRenderHornPicker();
      return 'PENDING';
    } else {
      // Bot picks the row with most cards
      const rows = GW.ROWS;
      const best = rows.reduce((a, r) => st.botBoard[r].length > st.botBoard[a].length ? r : a, rows[0]);
      st.botHorn[best] = true;
      return `🎺 الخصم نفخ البوق على صف [${GW.ROW_LABELS[best]}]! القوة تضاعفت!`;
    }
  }

  if (card.type === 'decoy') {
    if (isPlayer) {
      // Check if there are cards on player board to pick up
      const allOnBoard = [...st.playerBoard.melee, ...st.playerBoard.ranged, ...st.playerBoard.siege];
      if (allOnBoard.length === 0) {
        // Put card back, nothing to decoy
        st.playerHand.push(card);
        return '🪤 لا يوجد وحدات على ساحتك لاستبدالها بعد!';
      }
      st.pendingDecoy = true;
      gwRenderDecoyPicker();
      return 'PENDING';
    } else {
      // Bot: return highest power card back to hand
      let best = null; let bestRow = null;
      for (const r of GW.ROWS) {
        for (const c of st.botBoard[r]) {
          if (!best || c.origPower > best.origPower) { best = c; bestRow = r; }
        }
      }
      if (best && bestRow) {
        st.botBoard[bestRow] = st.botBoard[bestRow].filter(c => c !== best);
        st.botHand.push(best);
        return `🪤 الخصم استرجع [${best.name}] من الساحة بالـ Decoy!`;
      }
      return '🪤 الخصم لعب الفخ المزيف لكن لا يوجد ما يسترجعه.';
    }
  }

  if (card.isSpy) {
    // Spy goes to OPPONENT's board, player draws 2
    const targetBoard = isPlayer ? st.botBoard : st.playerBoard;
    targetBoard.melee.push(card);
    const drawSide = isPlayer ? 'player' : 'bot';
    const drawHand = drawSide === 'player' ? st.playerHand : st.botHand;
    const extras = [...window.heroes].sort(() => 0.5 - Math.random()).slice(0, 2).map(gwHeroToCard);
    drawHand.push(...extras);
    return `🕵️ ${isPlayer?'أرسلت جاسوسك':'الخصم أرسل جاسوساً'} وسحب${isPlayer?'ت':' هو'} ورقتين جديدتين!`;
  }

  // Normal unit
  const board = isPlayer ? st.playerBoard : st.botBoard;
  board[card.row].push(card);
  return `${card.icon} ${isPlayer?'لعبت':'الخصم لعب'} [${card.name}] — قوة ${card.power} في صف ${GW.ROW_LABELS[card.row]}`;
}

function gwDoScorch(isPlayer) {
  const st = gwentState;
  let highest = 0;
  for (const side of ['playerBoard', 'botBoard']) {
    for (const r of GW.ROWS) {
      for (const c of st[side][r]) {
        if (!c.isHero && c.origPower > highest) highest = c.origPower;
      }
    }
  }
  if (highest <= 0) return '🔥 لا وحدات مؤهلة للحرق!';
  let burned = [];
  for (const side of ['playerBoard', 'botBoard']) {
    for (const r of GW.ROWS) {
      const before = st[side][r].length;
      st[side][r] = st[side][r].filter(c => c.isHero || c.origPower < highest);
      const count = before - st[side][r].length;
      if (count > 0) burned.push(count);
    }
  }
  return `🔥 ${isPlayer?'لعبت':'الخصم لعب'} الحرق! أُبيدت ${burned.reduce((a,b)=>a+b,0)} وحدة بقوة ${highest}`;
}

function gwRenderHornPicker() {
  const c = document.getElementById('gz-game-view');
  const popup = document.createElement('div');
  popup.id = 'gz-horn-picker';
  popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:10000;';
  popup.innerHTML = `
    <div style="background:#182032;border:2px solid #ffd700;border-radius:20px;padding:28px;text-align:center;max-width:380px;">
      <div style="font-size:40px;margin-bottom:10px;">🎺</div>
      <h3 style="color:#ffd700;font-size:18px;margin-bottom:6px;">اختر الصف لمضاعفة قوته</h3>
      <p style="color:rgba(255,255,255,0.6);font-size:12px;margin-bottom:18px;">البوق يضاعف طاقة صف بأكمله (2×)</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${GW.ROWS.map(r => `
          <button onclick="gwApplyHorn('${r}')" style="background:rgba(255,215,0,0.12);border:1.5px solid rgba(255,215,0,0.4);color:#fff;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Cairo',sans-serif;transition:all 0.2s;"
            onmouseover="this.style.background='rgba(255,215,0,0.25)'" onmouseout="this.style.background='rgba(255,215,0,0.12)'">
            ${GW.ROW_LABELS[r]}
          </button>
        `).join('')}
      </div>
    </div>`;
  document.body.appendChild(popup);
}

function gwApplyHorn(row) {
  document.getElementById('gz-horn-picker')?.remove();
  gwentState.playerHorn[row] = true;
  gwentState.pendingHorn = false;
  gwentState.log.unshift(`🎺 نفخت البوق على صف [${GW.ROW_LABELS[row]}]! قوته تضاعفت!`);
  gwentState.turn = 'bot';
  gwRender();
  if (!gwentState.botPassed) setTimeout(gwBotTurn, 900);
  else { gwentState.turn = 'player'; gwCheckRoundEnd(); }
}

function gwRenderDecoyPicker() {
  const st = gwentState;
  const allCards = [];
  for (const r of GW.ROWS) {
    for (const c of st.playerBoard[r]) allCards.push({ card: c, row: r });
  }
  const popup = document.createElement('div');
  popup.id = 'gz-decoy-picker';
  popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;overflow-y:auto;';
  popup.innerHTML = `
    <div style="background:#182032;border:2px solid #38bdf8;border-radius:20px;padding:24px;max-width:480px;width:calc(100%-32px);">
      <h3 style="color:#38bdf8;font-size:17px;margin-bottom:4px;text-align:center;">🪤 اختر وحدة لاسترجاعها</h3>
      <p style="color:rgba(255,255,255,0.55);font-size:11px;text-align:center;margin-bottom:16px;">ستعود الوحدة ليدك ويمكنك لعبها مجدداً</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
        ${allCards.map(({card,row}, i) => `
          <div onclick="gwApplyDecoy('${row}',${i})" style="background:rgba(255,255,255,0.05);border:1.5px solid rgba(56,189,248,0.4);border-radius:12px;padding:10px 14px;cursor:pointer;text-align:center;min-width:90px;transition:all 0.2s;"
            onmouseover="this.style.borderColor='#38bdf8';this.style.background='rgba(56,189,248,0.12)'"
            onmouseout="this.style.borderColor='rgba(56,189,248,0.4)';this.style.background='rgba(255,255,255,0.05)'">
            <div style="font-size:22px;">${card.icon}</div>
            <div style="font-size:11px;color:#fff;font-weight:700;margin-top:4px;">${card.name}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);">قوة: ${card.origPower}</div>
          </div>
        `).join('')}
      </div>
      <div style="text-align:center;margin-top:16px;">
        <button onclick="gwCancelDecoy()" style="background:rgba(255,255,255,0.08);color:#fff;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-family:'Cairo',sans-serif;">إلغاء</button>
      </div>
    </div>`;
  document.body.appendChild(popup);
}

function gwApplyDecoy(row, cardIdx) {
  document.getElementById('gz-decoy-picker')?.remove();
  // Find the actual card (idx among all board cards)
  const allCards = [];
  for (const r of GW.ROWS) {
    for (let i = 0; i < gwentState.playerBoard[r].length; i++) {
      allCards.push({ r, i });
    }
  }
  const target = allCards[cardIdx];
  if (!target) return gwCancelDecoy();

  const card = gwentState.playerBoard[target.r][target.i];
  gwentState.playerBoard[target.r].splice(target.i, 1);
  gwentState.playerHand.push(card);
  gwentState.pendingDecoy = false;
  gwentState.log.unshift(`🪤 استرجعت [${card.name}] من الساحة!`);
  gwentState.turn = 'bot';
  gwRender();
  if (!gwentState.botPassed) setTimeout(gwBotTurn, 900);
  else { gwentState.turn = 'player'; gwCheckRoundEnd(); }
}

function gwCancelDecoy() {
  document.getElementById('gz-decoy-picker')?.remove();
  gwentState.pendingDecoy = false;
  gwentState.turn = 'player';
  gwRender();
}

// ── Bot AI ──
function gwBotTurn() {
  const st = gwentState;
  if (st.botPassed) {
    if (st.playerPassed) gwCheckRoundEnd();
    else { st.turn = 'player'; gwRender(); }
    return;
  }

  const pTotal = gwScores(true).total;
  const bTotal = gwScores(false).total;

  // Bot passes if winning and player passed, or no cards
  if (st.playerPassed && bTotal > pTotal) {
    st.botPassed = true;
    st.log.unshift('🤖 الخصم يقود ومتقدم — ينسحب للحفاظ على بطاقاته للجولة القادمة!');
    gwCheckRoundEnd();
    gwRender();
    return;
  }
  if (st.botHand.length === 0) {
    st.botPassed = true;
    st.log.unshift('🤖 الخصم نفدت بطاقاته وانسحب!');
    if (st.playerPassed) gwCheckRoundEnd();
    else { st.turn = 'player'; gwRender(); }
    return;
  }

  // Smart card selection: prefer units, play weather/scorch if behind
  let cardIdx = 0;
  if (bTotal < pTotal - 8) {
    // Try to find a scorch or weather card
    const scorchIdx = st.botHand.findIndex(c => c.type === 'scorch' || c.type === 'frost' || c.type === 'fog' || c.type === 'rain');
    if (scorchIdx >= 0) cardIdx = scorchIdx;
    else cardIdx = st.botHand.findIndex(c => c.type === 'unit') >= 0 ? st.botHand.findIndex(c => c.type === 'unit') : 0;
  } else {
    // Find highest power unit card
    let bestPow = -1;
    st.botHand.forEach((c, i) => { if (c.type === 'unit' && c.origPower > bestPow) { bestPow = c.origPower; cardIdx = i; } });
  }

  const card = st.botHand.splice(cardIdx, 1)[0];
  const msg = gwApplyCard(card, false);
  if (msg && msg !== 'PENDING') st.log.unshift(msg);

  if (st.playerPassed && !st.botPassed) {
    // Keep going until winning or no cards
    const bNew = gwScores(false).total;
    const pNew = gwScores(true).total;
    if (bNew > pNew || st.botHand.length === 0) {
      st.botPassed = true;
      st.log.unshift('🤖 الخصم ينتهي دوره ويؤكد نهاية الجولة.');
    }
  }

  st.turn = 'player';
  gwRender();
  if (st.playerPassed && st.botPassed) gwCheckRoundEnd();
}

function gwPassTurn() {
  gwentState.playerPassed = true;
  gwentState.log.unshift('⏸️ انسحبت من هذه الجولة — الخصم يواصل.');
  gzToast('🛑 انسحبت تكتيكياً من الجولة', 'warn');
  gwentState.turn = 'bot';
  gwRender();
  if (gwentState.botPassed) gwCheckRoundEnd();
  else setTimeout(gwBotTurn, 800);
}

function gwCheckRoundEnd() {
  if (!gwentState.playerPassed || !gwentState.botPassed) return;
  setTimeout(gwEndRound, 600);
}

function gwEndRound() {
  const st = gwentState;
  const pScore = gwScores(true).total;
  const bScore = gwScores(false).total;

  let roundMsg;
  if (pScore > bScore) {
    st.botGems--;
    roundMsg = `🎉 فزت بالجولة ${st.round}! (${pScore} ضد ${bScore})`;
    gzToast(roundMsg, 'success');
  } else if (bScore > pScore) {
    st.playerGems--;
    roundMsg = `💀 خسرت الجولة ${st.round}! (${bScore} ضد ${pScore})`;
    gzToast(roundMsg, 'error');
  } else {
    st.playerGems--;
    st.botGems--;
    roundMsg = `⚖️ تعادل في الجولة ${st.round}! كل منكما يخسر جوهرة.`;
    gzToast(roundMsg, 'warn');
  }
  st.log.unshift(roundMsg);

  // Check match end
  if (st.playerGems <= 0 || st.botGems <= 0) {
    setTimeout(() => {
      const won = st.playerGems > st.botGems;
      const finalMsg = won ? '🏆 نصر أسطوري! فزت بمباراة الجوينت الكاملة!' : '💀 هزيمة ساحقة! الجوينت مهارة تحتاج تدريباً!';
      gzToast(finalMsg, won ? 'gold' : 'error', 5000);
      st.log.unshift(finalMsg);
      setTimeout(gzInitGwent, 3500);
    }, 400);
    return;
  }

  // Start next round
  setTimeout(() => {
    st.playerBoard = { melee: [], ranged: [], siege: [] };
    st.botBoard    = { melee: [], ranged: [], siege: [] };
    st.playerHorn  = { melee: false, ranged: false, siege: false };
    st.botHorn     = { melee: false, ranged: false, siege: false };
    st.weather     = { frost: false, fog: false, rain: false };
    st.playerPassed = false;
    st.botPassed    = false;
    st.pendingHorn  = null;
    st.pendingDecoy = null;
    st.round++;
    st.turn = 'player';
    // Draw one card each
    const extra = [...window.heroes].sort(() => 0.5 - Math.random()).slice(0, 2).map(gwHeroToCard);
    st.playerHand.push(extra[0]);
    st.botHand.push(extra[1]);
    st.log.unshift(`⚡ بدأت الجولة ${st.round}! سحب كل لاعب ورقة جديدة.`);
    gwRender();
  }, 1200);
}

// ── Render Gwent Board ──
function gwRender() {
  const c = document.getElementById('gz-game-view');
  if (!c || gzActiveGame !== 'gwent') return;

  const st = gwentState;
  const ps = gwScores(true);
  const bs = gwScores(false);
  const wIcons = [];
  if (st.weather.frost) wIcons.push('❄️ صقيع');
  if (st.weather.fog)   wIcons.push('🌫️ ضباب');
  if (st.weather.rain)  wIcons.push('🌧️ عاصفة');

  c.innerHTML = `
    <div style="max-width:960px;margin:0 auto;font-family:'Cairo',sans-serif;">

      <!-- HEADER BAR -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
        <button onclick="gzRenderLobby()" style="background:rgba(255,255,255,0.07);color:#fff;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;font-family:'Cairo',sans-serif;">← الرئيسية</button>
        <div style="font-family:'Cinzel',serif;color:var(--gz-gold);font-size:16px;font-weight:900;">⚔️ جوينت الأساطير — الجولة ${st.round}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.5);">${gzOpponentMode==='friend'?'👥 '+gzCurrentRoomCode:'🤖 ضد AI'}</div>
      </div>

      <!-- WEATHER BAR -->
      <div style="display:flex;justify-content:center;gap:8px;margin-bottom:10px;min-height:24px;">
        ${wIcons.length ? wIcons.map(w => `<span style="background:rgba(56,189,248,0.15);border:1px solid rgba(56,189,248,0.4);color:#38bdf8;font-size:11px;font-weight:800;padding:4px 10px;border-radius:99px;">${w}</span>`).join('') : '<span style="font-size:11px;color:rgba(255,255,255,0.3);">☀️ لا طقس نشط</span>'}
      </div>

      <!-- BOARD -->
      <div style="background:radial-gradient(ellipse at 50% 50%, #1a2035 0%, #0c0e17 100%);border:2px solid rgba(255,215,0,0.25);border-radius:20px;padding:14px;box-shadow:0 0 40px rgba(0,0,0,0.8),inset 0 0 20px rgba(255,215,0,0.03);">

        <!-- BOT SCORES + GEMS -->
        ${gwRenderPlayerBar(false, bs)}

        <!-- BOT ROWS (top = siege, ranged, melee — inverted to mirror player) -->
        <div style="margin-bottom:6px;">
          ${['siege','ranged','melee'].map(row => gwRenderRow(row, false)).join('')}
        </div>

        <!-- DIVIDER -->
        <div style="height:2px;background:linear-gradient(90deg,transparent,rgba(255,215,0,0.5),transparent);margin:8px 0;"></div>

        <!-- PLAYER ROWS -->
        <div style="margin-top:6px;">
          ${['melee','ranged','siege'].map(row => gwRenderRow(row, true)).join('')}
        </div>

        ${gwRenderPlayerBar(true, ps)}
      </div>

      <!-- PLAYER HAND -->
      <div style="margin-top:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
          <div style="font-weight:900;color:var(--gz-gold);font-size:14px;">🎴 بطاقاتك (${st.playerHand.length})</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button onclick="gwPassTurn()" ${st.playerPassed||st.turn!=='player'?'disabled':''} style="background:${st.playerPassed?'rgba(100,100,100,0.3)':'linear-gradient(135deg,#ef4444,#b91c1c)'};color:#fff;border:none;padding:8px 20px;border-radius:10px;font-weight:900;font-size:13px;cursor:${st.playerPassed?'not-allowed':'pointer'};opacity:${st.playerPassed?0.5:1};font-family:'Cairo',sans-serif;">
              ⏸️ انسحاب تكتيكي
            </button>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;background:rgba(0,0,0,0.3);border-radius:14px;border:1px dashed rgba(255,215,0,0.2);min-height:80px;">
          ${st.playerHand.length ? st.playerHand.map((card, i) => gwRenderCardInHand(card, i)).join('') : '<div style="color:rgba(255,255,255,0.3);font-size:13px;margin:auto;">لا بطاقات في يدك</div>'}
        </div>
      </div>

      <!-- LOG (last 3 events) -->
      <div style="margin-top:10px;background:rgba(0,0,0,0.35);border-radius:12px;padding:10px 14px;border:1px solid rgba(255,215,0,0.12);">
        ${st.log.slice(0, 3).map((l, i) => `<div style="font-size:12px;color:${i===0?'#fef08a':'rgba(255,255,255,0.5)'};padding:2px 0;${i>0?'margin-top:3px;':''}">${l}</div>`).join('')}
      </div>
    </div>`;
}

function gwRenderPlayerBar(isPlayer, scores) {
  const st = gwentState;
  const gems = isPlayer ? st.playerGems : st.botGems;
  const passed = isPlayer ? st.playerPassed : st.botPassed;
  const label = isPlayer ? '👑 أنت' : '🤖 الخصم';
  const scoreColor = isPlayer ? '#4ade80' : '#f87171';
  const dir = isPlayer ? 'justify-content:flex-end' : '';

  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;margin-${isPlayer?'top':'bottom'}:10px;">
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="font-weight:900;font-size:14px;color:#fff;">${label} ${passed?'<span style="color:#f59e0b;font-size:11px;">[انسحب]</span>':''}</span>
      <div style="display:flex;gap:5px;">
        ${[1,2].map(n => `<div style="width:14px;height:14px;border-radius:50%;border:1.5px solid rgba(255,215,0,0.5);background:${gems>=n?'#ffd700':'rgba(255,255,255,0.1)'};box-shadow:${gems>=n?'0 0 8px #ffd700':'none'};transition:all 0.3s;"></div>`).join('')}
      </div>
    </div>
    <div style="font-family:'Cinzel',serif;font-size:28px;font-weight:900;color:${scoreColor};text-shadow:0 0 15px ${scoreColor}80;">${scores.total}</div>
  </div>`;
}

function gwRenderRow(row, isPlayer) {
  const st = gwentState;
  const board = isPlayer ? st.playerBoard : st.botBoard;
  const horn = isPlayer ? st.playerHorn : st.botHorn;
  const wKey = GW.ROW_WEATHER[row];
  const weatherOn = st.weather[wKey];
  const score = gwRowScore(board[row], weatherOn, horn[row]);
  const rowEmoji = { melee: '⚔️', ranged: '🏹', siege: '🏰' };

  return `
    <div style="display:grid;grid-template-columns:110px 1fr 54px;align-items:center;gap:8px;
      background:${weatherOn?'rgba(56,189,248,0.06)':'rgba(255,255,255,0.02)'};
      border:1px solid ${weatherOn?'rgba(56,189,248,0.3)':'rgba(255,255,255,0.06)'};
      border-radius:12px;padding:7px 10px;min-height:70px;margin-bottom:5px;transition:all 0.3s;">
      <!-- Row Label -->
      <div style="display:flex;flex-direction:column;gap:3px;">
        <span style="font-size:18px;">${rowEmoji[row]}</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.55);font-weight:700;">${row==='melee'?'قريب':row==='ranged'?'بعيد':'حصار'}</span>
        ${horn[row] ? '<span style="font-size:10px;color:#ffd700;">🎺×2</span>' : ''}
        ${weatherOn ? `<span style="font-size:10px;color:#38bdf8;">${GW.WEATHER_LABELS[wKey]}</span>` : ''}
      </div>
      <!-- Cards -->
      <div style="display:flex;gap:6px;overflow-x:auto;padding:2px;align-items:center;min-height:56px;">
        ${board[row].length ? board[row].map(card => gwRenderCardOnBoard(card, weatherOn)).join('') : '<span style="font-size:11px;color:rgba(255,255,255,0.2);margin:auto;">—</span>'}
      </div>
      <!-- Score -->
      <div style="text-align:center;font-family:'Cinzel',serif;font-size:20px;font-weight:900;color:#fff;
        background:rgba(0,0,0,0.4);border-radius:8px;padding:4px 6px;border:1px solid rgba(255,255,255,0.08);">
        ${score}
      </div>
    </div>`;
}

function gwRenderCardOnBoard(card, weatherOn) {
  const effectivePow = (!card.isHero && weatherOn) ? 1 : (card.origPower || card.power);
  const imgUrl = card.heroObj ? gzGetHeroImageUrl(card.heroObj) : '';
  const isWeak = weatherOn && !card.isHero;

  return `<div title="${card.name} — قوة: ${effectivePow}${card.isHero?' [بطل: محمي من الطقس]':''}" style="
    width:52px;height:76px;border-radius:8px;flex-shrink:0;
    background:linear-gradient(145deg,${card.isHero?'#2d2412,#1a1508':'#1a2235,#0e1520'});
    border:1.5px solid ${card.isHero?'#ffd700':card.isSpy?'#a855f7':'rgba(255,255,255,0.2)'};
    box-shadow:${card.isHero?'0 0 10px rgba(255,215,0,0.4)':'none'};
    display:flex;flex-direction:column;align-items:center;justify-content:space-between;
    padding:4px 2px;position:relative;cursor:default;${isWeak?'opacity:0.65;':''}">
    <!-- Power badge -->
    <div style="position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;
      background:${card.isHero?'#ffd700':'#000'};border:1px solid ${card.isHero?'#ffd700':'rgba(255,215,0,0.6)'};
      color:${card.isHero?'#000':'#ffd700'};font-size:9px;font-weight:900;
      display:flex;align-items:center;justify-content:center;z-index:2;">${effectivePow}</div>
    ${card.isHero ? '<div style="position:absolute;top:2px;right:2px;font-size:8px;" title="بطل — محمي">⭐</div>' : ''}
    <!-- Image or icon -->
    <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;margin-top:10px;flex-shrink:0;${imgUrl?'':'display:flex;align-items:center;justify-content:center;font-size:18px;'}">
      ${imgUrl ? `<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<span style=font-size:18px>${card.icon}</span>'">` : card.icon}
    </div>
    <!-- Name -->
    <div style="font-size:7.5px;color:#fff;font-weight:700;text-align:center;max-width:48px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${card.name.slice(0,10)}</div>
  </div>`;
}

function gwRenderCardInHand(card, idx) {
  const isSpecial = card.row === 'special' || ['frost','fog','rain','clear','horn','scorch','decoy'].includes(card.type);
  const canPlay = gwentState.turn === 'player' && !gwentState.playerPassed;
  const imgUrl = card.heroObj ? gzGetHeroImageUrl(card.heroObj) : '';
  const specialColors = { frost:'#38bdf8', fog:'#94a3b8', rain:'#60a5fa', clear:'#fbbf24', horn:'#ffd700', scorch:'#ef4444', decoy:'#10b981' };
  const cardColor = isSpecial ? (specialColors[card.type] || '#a855f7') : (card.isHero ? '#ffd700' : 'rgba(255,255,255,0.2)');

  return `<div onclick="${canPlay ? `gwPlayCard(${idx})` : ''}" title="${card.name}${card.desc ? ': '+card.desc : ''}" style="
    width:68px;height:100px;border-radius:10px;flex-shrink:0;cursor:${canPlay?'pointer':'not-allowed'};
    background:${isSpecial ? `linear-gradient(145deg,${cardColor}22,${cardColor}08)` : `linear-gradient(145deg,#1e293b,#0e1520)`};
    border:1.5px solid ${cardColor};
    box-shadow:0 4px 12px rgba(0,0,0,0.4),0 0 0 0 ${cardColor}50;
    display:flex;flex-direction:column;align-items:center;justify-content:space-between;
    padding:5px 3px;position:relative;transition:all 0.18s cubic-bezier(0.34,1.56,0.64,1);"
    onmouseover="${canPlay?`this.style.transform='translateY(-12px) scale(1.08)';this.style.boxShadow='0 16px 30px rgba(0,0,0,0.5),0 0 15px ${cardColor}60';`:''}"
    onmouseout="this.style.transform='';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.4)'">

    <!-- Power/Type badge -->
    <div style="position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;
      background:${card.isHero?'#ffd700':'rgba(0,0,0,0.8)'};border:1px solid ${cardColor};
      color:${card.isHero?'#000':'#fff'};font-size:9px;font-weight:900;
      display:flex;align-items:center;justify-content:center;">
      ${isSpecial ? (card.type==='frost'?'❄':card.type==='fog'?'🌫':card.type==='rain'?'🌧':card.type==='clear'?'☀':card.type==='horn'?'🎺':card.type==='scorch'?'🔥':card.type==='decoy'?'🪤':'?') : card.power}
    </div>
    ${card.isHero ? '<div style="position:absolute;top:3px;right:3px;font-size:9px;">⭐</div>' : ''}
    ${!isSpecial ? `<div style="position:absolute;top:3px;right:3px;font-size:9px;">${card.row==='melee'?'⚔️':card.row==='ranged'?'🏹':'🏰'}</div>` : ''}

    <!-- Image or icon -->
    <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;margin-top:14px;flex-shrink:0;
      ${imgUrl?'':'display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(0,0,0,0.3);'}">
      ${imgUrl ? `<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<span style=font-size:22px>${card.icon}</span>'">` : card.icon}
    </div>
    <div style="font-size:8px;color:#fff;font-weight:700;text-align:center;max-width:62px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${card.name.slice(0,12)}</div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════════════════
// ████ 2. DETECTIVE RPG ████
// ══════════════════════════════════════════════════════════════════════════

const DET_CASES = [
  { title: 'سرقة تاج الملوك', victim: 'الملك آرثر', location: 'القلعة الملكية', stolen: 'التاج الذهبي' },
  { title: 'اختفاء الساحر الكبير', victim: 'ميرلين', location: 'برج السحر', stolen: 'كتاب التعاويذ الأعظم' },
  { title: 'قتيل في نزل المحارمة', victim: 'ابن التاجر الثري', location: 'نزل "القمر الذهبي"', stolen: 'ختم الشمع الملكي' },
  { title: 'الوثيقة المسروقة', victim: 'السفير الملكي', location: 'دار السفارة', stolen: 'وثيقة السلام السرية' },
];

const DET_WITNESSES = [
  { name: 'الحارس الليلي', role: 'شاهد عيان', suspicion: 0.2 },
  { name: 'الخادمة المخلصة', role: 'تعمل في المكان', suspicion: 0.5 },
  { name: 'التاجر الغريب', role: 'وجد في المكان صدفةً', suspicion: 0.7 },
  { name: 'الأمير الغيور', role: 'له دوافع واضحة', suspicion: 0.85 },
  { name: 'العراف الغامض', role: 'كان في المنطقة', suspicion: 0.4 },
];

let detState = {};

function gzInitDetective() {
  const hero = window.heroes[Math.floor(Math.random() * Math.min(60, window.heroes.length))];
  const caseData = DET_CASES[Math.floor(Math.random() * DET_CASES.length)];
  const culpritIdx = Math.floor(Math.random() * DET_WITNESSES.length);
  const clues = ['أثر حذاء غريب', 'قفازة جلدية ممزقة', 'رسالة مشفرة', 'شمعة محترقة جزئياً'];

  // Derive detective skills from hero
  const skills = hero.ar ? hero.ar.ability : 'تحليل الأدلة';
  const isGenius = hero.p >= 85;
  const isBrute = hero.source.includes('Hulk') || hero.source.includes('DOOM') || hero.source.includes('Kratos');

  detState = {
    hero, caseData, culpritIdx,
    witnesses: DET_WITNESSES.map((w, i) => ({ ...w, interrogated: false, isGuilty: i === culpritIdx })),
    clues: clues.map(c => ({ text: c, found: false })),
    accusations: [],
    phase: 'intro', // intro → investigate → accuse → result
    turns: 0,
    maxTurns: 10,
    skills, isGenius, isBrute,
    log: []
  };
  gzRenderDetective();
}

function gzRenderDetective() {
  const c = document.getElementById('gz-game-view');
  if (!c) return;
  const d = detState;
  const hero = d.hero;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';

  const skillBadge = d.isGenius
    ? '<span style="background:rgba(56,189,248,0.2);color:#38bdf8;border:1px solid #38bdf8;font-size:10px;padding:3px 8px;border-radius:6px;font-weight:800;">🧠 عقل خارق</span>'
    : d.isBrute
      ? '<span style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid #f87171;font-size:10px;padding:3px 8px;border-radius:6px;font-weight:800;">💪 قوة بدون دبلوماسية</span>'
      : '<span style="background:rgba(16,185,129,0.2);color:#10b981;border:1px solid #10b981;font-size:10px;padding:3px 8px;border-radius:6px;font-weight:800;">⚖️ محقق متوازن</span>';

  const foundClues = d.clues.filter(cl => cl.found).length;
  const turnsLeft = d.maxTurns - d.turns;

  c.innerHTML = `
    <div style="max-width:820px;margin:0 auto;font-family:'Cairo',sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
        <button onclick="gzRenderLobby()" style="background:rgba(255,255,255,0.07);color:#fff;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;font-family:'Cairo',sans-serif;">← رجوع</button>
        <div style="font-size:14px;color:var(--gz-gold);font-weight:900;">🔍 ${d.caseData.title}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.5);">خطوات متبقية: ${turnsLeft} / ${d.maxTurns}</div>
      </div>

      <!-- HERO CARD -->
      <div style="background:linear-gradient(135deg,rgba(30,40,60,0.9),rgba(10,15,25,0.95));border:2px solid rgba(56,189,248,0.4);border-radius:18px;padding:18px;margin-bottom:14px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        ${gzRenderHeroAvatar(hero, 64)}
        <div style="flex:1;min-width:160px;">
          <div style="font-size:18px;font-weight:900;color:#fff;">${hero[lang]?hero[lang].name:hero.name}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:6px;">${hero.source}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">${skillBadge}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-top:6px;">مهارة التحقيق: ${d.skills}</div>
        </div>
        <div style="text-align:center;min-width:100px;">
          <div style="font-size:11px;color:rgba(255,255,255,0.4);">أدلة مكتشفة</div>
          <div style="font-size:24px;font-weight:900;color:#ffd700;">${foundClues} / ${d.clues.length}</div>
        </div>
      </div>

      <!-- CASE BRIEF -->
      <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,215,0,0.2);border-radius:14px;padding:14px;margin-bottom:14px;">
        <div style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;">
          📍 <strong style="color:#ffd700;">موقع الجريمة:</strong> ${d.caseData.location} &nbsp;|&nbsp; 
          👤 <strong style="color:#ffd700;">الضحية:</strong> ${d.caseData.victim} &nbsp;|&nbsp; 
          💎 <strong style="color:#ffd700;">المسروق:</strong> ${d.caseData.stolen}
        </div>
      </div>

      <!-- CLUES -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
        ${d.clues.map((cl, i) => `
          <button onclick="gzDetFindClue(${i})" ${cl.found?'disabled':''} style="
            background:${cl.found?'rgba(16,185,129,0.2)':'rgba(255,255,255,0.05)'};
            border:1px solid ${cl.found?'#10b981':'rgba(255,255,255,0.15)'};
            color:${cl.found?'#10b981':'rgba(255,255,255,0.7)'};
            padding:8px 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:${cl.found?'default':'pointer'};
            font-family:'Cairo',sans-serif;transition:all 0.2s;">
            ${cl.found?'✅':'🔎'} ${cl.found ? cl.text : `دليل مجهول #${i+1}`}
          </button>
        `).join('')}
      </div>

      <!-- WITNESSES -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:14px;">
        ${d.witnesses.map((w, i) => `
          <div onclick="gzDetInterrogate(${i})" style="
            background:${w.interrogated?'rgba(59,130,246,0.1)':'rgba(255,255,255,0.03)'};
            border:1.5px solid ${w.interrogated?'rgba(59,130,246,0.5)':'rgba(255,255,255,0.1)'};
            border-radius:14px;padding:12px;cursor:pointer;transition:all 0.2s;"
            onmouseover="this.style.borderColor='rgba(59,130,246,0.6)';this.style.background='rgba(59,130,246,0.08)'"
            onmouseout="this.style.borderColor='${w.interrogated?'rgba(59,130,246,0.5)':'rgba(255,255,255,0.1)'}';this.style.background='${w.interrogated?'rgba(59,130,246,0.1)':'rgba(255,255,255,0.03)'}'">
            <div style="font-size:20px;margin-bottom:4px;">${w.interrogated?'🗣️':'🤐'}</div>
            <div style="font-size:13px;font-weight:900;color:#fff;">${w.name}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);">${w.role}</div>
            ${w.interrogated?`<div style="font-size:10px;color:#60a5fa;margin-top:4px;">✅ تم الاستجواب</div>`:''}
          </div>
        `).join('')}
      </div>

      <!-- ACCUSE BUTTON -->
      ${foundClues >= 2 ? `
        <div style="text-align:center;margin-bottom:14px;">
          <div style="font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:10px;">من المتهم؟ اختر من استجوبتهم:</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
            ${d.witnesses.filter(w=>w.interrogated).map((w,i)=>`
              <button onclick="gzDetAccuse('${w.name}')" style="background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;border:none;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;box-shadow:0 4px 12px rgba(220,38,38,0.3);">
                ⚖️ اتهام: ${w.name}
              </button>
            `).join('')}
          </div>
        </div>
      ` : `<div style="text-align:center;padding:10px;font-size:12px;color:rgba(255,255,255,0.4);">اكتشف ${2-foundClues} دليل إضافي لتتمكن من الاتهام</div>`}

      <!-- LOG -->
      <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:12px;border:1px solid rgba(255,215,0,0.1);max-height:150px;overflow-y:auto;">
        ${d.log.length ? d.log.slice(0,6).map((l,i)=>`<div style="font-size:11px;color:${i===0?'#fef08a':'rgba(255,255,255,0.45)'};padding:2px 0;">${l}</div>`).join('') : '<div style="font-size:11px;color:rgba(255,255,255,0.3);">لا أحداث بعد...</div>'}
      </div>
    </div>`;
}

function gzDetFindClue(idx) {
  const d = detState;
  if (d.clues[idx].found) return;
  d.clues[idx].found = true;
  d.turns++;
  const heroBonus = d.isGenius ? ' 🧠 عقلك الخارق سرّع الاكتشاف!' : d.isBrute ? ' 💪 ضغطت على المكان وعثرت عليه رغم القسوة!' : '';
  d.log.unshift(`🔎 اكتشفت دليلاً: "${d.clues[idx].text}"!${heroBonus}`);
  gzRenderDetective();
}

function gzDetInterrogate(idx) {
  const d = detState;
  const w = d.witnesses[idx];
  if (w.interrogated) return;
  w.interrogated = true;
  d.turns++;
  let response;
  if (w.isGuilty) {
    response = d.isGenius
      ? `${w.name} يحاول إخفاء عصبيته — عقلك يكشف كذبه فوراً!`
      : `${w.name} يتكلم ببرود مريب...`;
  } else {
    response = `${w.name} يبدو مصدوماً ويقدم شهادته بصدق.`;
  }
  d.log.unshift(`🗣️ استجوبت ${w.name}: ${response}`);
  gzRenderDetective();
}

function gzDetAccuse(name) {
  const d = detState;
  const suspect = d.witnesses.find(w => w.name === name);
  if (!suspect) return;

  const isCorrect = suspect.isGuilty;
  const culprit = d.witnesses.find(w => w.isGuilty);
  const foundCount = d.clues.filter(c => c.found).length;

  const msg = isCorrect
    ? `🏆 أصبت! ${name} هو الجاني الحقيقي! وجدت ${foundCount} من ${d.clues.length} أدلة. ${d.isGenius?'عبقريتك أنقذت اليوم!':'عمل رائع!'}`
    : `❌ أخطأت! ${name} بريء. الجاني الحقيقي كان ${culprit?.name}. حاول أن تجمع أدلة أكثر قبل الاتهام.`;

  const type = isCorrect ? 'gold' : 'error';
  gzToast(msg, type, 5000);
  d.log.unshift(msg);
  gzRenderDetective();

  setTimeout(() => {
    const c = document.getElementById('gz-game-view');
    if (c) c.innerHTML += `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;">
        <div style="background:#182032;border:2px solid ${isCorrect?'#ffd700':'#ef4444'};border-radius:20px;padding:30px;text-align:center;max-width:400px;">
          <div style="font-size:52px;margin-bottom:12px;">${isCorrect?'🏆':'💀'}</div>
          <h3 style="color:${isCorrect?'#ffd700':'#f87171'};font-size:20px;font-weight:900;margin-bottom:10px;">${isCorrect?'قضية محلولة!':'التحقيق فشل'}</h3>
          <p style="color:rgba(255,255,255,0.7);font-size:13px;margin-bottom:18px;">${msg}</p>
          <div style="display:flex;gap:10px;justify-content:center;">
            <button onclick="gzInitDetective()" style="background:linear-gradient(135deg,#ffd700,#ff6b00);color:#000;border:none;padding:10px 24px;border-radius:10px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;">قضية جديدة 🔍</button>
            <button onclick="gzRenderLobby()" style="background:rgba(255,255,255,0.1);color:#fff;border:none;padding:10px 20px;border-radius:10px;font-weight:700;cursor:pointer;font-family:'Cairo',sans-serif;">رجوع</button>
          </div>
        </div>
      </div>`;
  }, 300);
}

// ══════════════════════════════════════════════════════════════════════════
// ████ 3. TOWER OF DOOM ████
// ══════════════════════════════════════════════════════════════════════════

let towerState = {};

function gzInitTower() {
  // Pick 3 heroes for the team
  const pool = [...window.heroes].sort(() => 0.5 - Math.random()).slice(0, 3);
  towerState = {
    team: pool.map(h => ({ hero: h, hp: 100, maxHp: 100, atk: Math.round(h.p / 10) + 5 })),
    floor: 1,
    maxFloor: 10,
    boss: null,
    log: [],
    phase: 'start'
  };
  gzTowerGenerateBoss();
  gzRenderTower();
}

function gzTowerGenerateBoss() {
  const st = towerState;
  const bossHero = window.heroes[Math.floor(Math.random() * Math.min(100, window.heroes.length))];
  const scale = 1 + (st.floor - 1) * 0.15;
  st.boss = {
    hero: bossHero,
    hp: Math.round((80 + st.floor * 12) * scale),
    maxHp: Math.round((80 + st.floor * 12) * scale),
    atk: Math.round((8 + st.floor * 2) * scale),
    name: bossHero.ar ? bossHero.ar.name : bossHero.name
  };
}

function gzRenderTower() {
  const c = document.getElementById('gz-game-view');
  if (!c) return;
  const st = towerState;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const alive = st.team.filter(m => m.hp > 0);
  const boss = st.boss;

  c.innerHTML = `
    <div style="max-width:800px;margin:0 auto;font-family:'Cairo',sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <button onclick="gzRenderLobby()" style="background:rgba(255,255,255,0.07);color:#fff;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;font-family:'Cairo',sans-serif;">← رجوع</button>
        <div style="color:var(--gz-gold);font-weight:900;font-size:16px;">🏰 الطابق ${st.floor} / ${st.maxFloor}</div>
        <div style="width:80px;height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;">
          <div style="width:${(st.floor/st.maxFloor)*100}%;height:100%;background:linear-gradient(90deg,#10b981,#ffd700);"></div>
        </div>
      </div>

      <!-- BOSS -->
      ${boss ? `
        <div style="background:linear-gradient(135deg,rgba(220,38,38,0.12),rgba(10,15,25,0.95));border:2px solid rgba(220,38,38,0.5);border-radius:18px;padding:18px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
            ${gzRenderHeroAvatar(boss.hero, 60)}
            <div style="flex:1;">
              <div style="font-size:16px;font-weight:900;color:#f87171;">👹 ${boss.name}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:6px;">${boss.hero.source}</div>
              <div style="background:rgba(0,0,0,0.4);border-radius:6px;overflow:hidden;height:10px;">
                <div style="width:${(boss.hp/boss.maxHp)*100}%;height:100%;background:linear-gradient(90deg,#ef4444,#dc2626);transition:width 0.5s;"></div>
              </div>
              <div style="font-size:11px;color:#f87171;margin-top:3px;">${boss.hp} / ${boss.maxHp} HP</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:11px;color:rgba(255,255,255,0.4);">قوة الهجوم</div>
              <div style="font-size:22px;font-weight:900;color:#f87171;">⚔️ ${boss.atk}</div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- TEAM -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:14px;">
        ${st.team.map((m, i) => `
          <div style="background:${m.hp<=0?'rgba(50,50,50,0.5)':'rgba(16,185,129,0.08)'};border:1.5px solid ${m.hp<=0?'rgba(100,100,100,0.3)':'rgba(16,185,129,0.4)'};border-radius:14px;padding:12px;opacity:${m.hp<=0?0.5:1};">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              ${gzRenderHeroAvatar(m.hero, 44)}
              <div>
                <div style="font-size:13px;font-weight:900;color:${m.hp<=0?'#888':'#fff'};">${m.hero[lang]?m.hero[lang].name:m.hero.name}</div>
                <div style="font-size:10px;color:rgba(255,255,255,0.4);">${m.hero.source}</div>
              </div>
            </div>
            <div style="background:rgba(0,0,0,0.4);border-radius:4px;overflow:hidden;height:8px;margin-bottom:4px;">
              <div style="width:${Math.max(0,(m.hp/m.maxHp)*100)}%;height:100%;background:linear-gradient(90deg,#10b981,#4ade80);transition:width 0.5s;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,0.5);">
              <span>${m.hp<=0?'💀 مقاتل سقط':m.hp+' / '+m.maxHp+' HP'}</span>
              <span>⚔️ ${m.atk}</span>
            </div>
            ${m.hp>0&&boss&&boss.hp>0?`<button onclick="gzTowerAttack(${i})" style="width:100%;margin-top:8px;background:linear-gradient(135deg,#10b981,#047857);color:#fff;border:none;padding:8px;border-radius:8px;font-size:12px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;">⚔️ هجوم بـ ${m.hero[lang]?m.hero[lang].name:m.hero.name}</button>`:''}
          </div>
        `).join('')}
      </div>

      <!-- LOG -->
      <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:10px;border:1px solid rgba(255,255,255,0.07);">
        ${st.log.slice(0,5).map((l,i)=>`<div style="font-size:11px;color:${i===0?'#fef08a':'rgba(255,255,255,0.45)'};padding:2px 0;">${l}</div>`).join('')}
      </div>
    </div>`;
}

function gzTowerAttack(memberIdx) {
  const st = towerState;
  const m = st.team[memberIdx];
  const boss = st.boss;
  if (!m || m.hp <= 0 || !boss || boss.hp <= 0) return;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';

  // Player attacks boss
  const dmg = m.atk + Math.floor(Math.random() * 8);
  boss.hp = Math.max(0, boss.hp - dmg);
  st.log.unshift(`⚔️ ${m.hero[lang]?m.hero[lang].name:m.hero.name} ضرب ${boss.name} بـ ${dmg} ضرر!`);

  if (boss.hp <= 0) {
    st.log.unshift(`🏆 هزمت الزعيم ${boss.name}!`);
    gzToast(`🏆 أسقطت الزعيم! تقدم للطابق ${st.floor + 1}!`, 'gold');

    if (st.floor >= st.maxFloor) {
      gzToast('🎉 أسطوري! أكملت البرج كاملاً! أنت بطل حقيقي!', 'gold', 5000);
      setTimeout(() => gzInitTower(), 3000);
      return;
    }

    st.floor++;
    gzTowerGenerateBoss();
    gzRenderTower();
    return;
  }

  // Boss counter-attacks random alive member
  const alive = st.team.filter(m2 => m2.hp > 0);
  if (alive.length > 0) {
    const target = alive[Math.floor(Math.random() * alive.length)];
    const bossDmg = boss.atk + Math.floor(Math.random() * 6);
    target.hp = Math.max(0, target.hp - bossDmg);
    st.log.unshift(`💢 ${boss.name} هاجم ${target.hero[lang]?target.hero[lang].name:target.hero.name} بـ ${bossDmg} ضرر!`);

    if (target.hp <= 0) st.log.unshift(`💀 سقط ${target.hero[lang]?target.hero[lang].name:target.hero.name}!`);
  }

  const aliveAfter = st.team.filter(m2 => m2.hp > 0);
  if (aliveAfter.length === 0) {
    gzToast('💀 سقط فريقك! المحاولة مجدداً...', 'error', 4000);
    setTimeout(() => gzInitTower(), 2500);
    return;
  }

  gzRenderTower();
}

// ══════════════════════════════════════════════════════════════════════════
// ████ 4. MYSTERY — WHO AM I? ████
// ══════════════════════════════════════════════════════════════════════════

let mystState = {};

const MYST_QUESTIONS = [
  { q: 'هل البطل من عالم الألعاب (Gaming)?', prop: h => h.type === 'game' },
  { q: 'هل البطل من عالم الأنمي (Anime)?',  prop: h => h.type === 'anime' },
  { q: 'هل البطل من الأفلام أو المسلسلات?', prop: h => h.type === 'movie' || h.type === 'series' },
  { q: 'هل قوته أكبر من 85؟',               prop: h => h.p > 85 },
  { q: 'هل قوته أكبر من 90؟',               prop: h => h.p > 90 },
  { q: 'هل هو بطل "PEAK" شكل أعلى؟',        prop: h => !!h.isPeak },
  { q: 'هل مصدره يبدأ بحرف G؟',             prop: h => (h.source || '').startsWith('G') },
  { q: 'هل اسمه بالعربية يبدأ بـ "ك"؟',     prop: h => h.ar && h.ar.name.startsWith('ك') },
  { q: 'هل يملك قدرة سحرية أو خارقة؟',      prop: h => !!(h.ar && (h.ar.ability.includes('سحر') || h.ar.ability.includes('طور') || h.ar.ability.includes('غريزة'))) },
  { q: 'هل هو شخصية أنثى؟',                prop: h => !!(h.ar && ['مالينيا','إيلوي','إيلي','بايونيتا','كيتانا','بياتريكس','لارا','ساموس','إيلين'].includes(h.ar.name)) },
];


// Build progressive hints revealed as Q&A answers come in
function gzBuildHints(m, lang) {
  const h = m.hero;
  const revealed = [];
  m.answers.forEach(a => {
    if (a.q.includes('عالم الأ')) revealed.push(a.ans ? { label: '🎮 من عالم الألعاب', color: '#a855f7' } : { label: '🎬 ليس من الألعاب', color: '#64748b' });
    if (a.q.includes('الأنمي')) revealed.push(a.ans ? { label: '🌸 من عالم الأنمي', color: '#ec4899' } : { label: '🌍 ليس أنمي', color: '#64748b' });
    if (a.q.includes('الأفلام')) revealed.push(a.ans ? { label: '🎬 من الأفلام/مسلسلات', color: '#38bdf8' } : { label: '📖 ليس من الأفلام', color: '#64748b' });
    if (a.q.includes('85')) revealed.push(a.ans ? { label: '💪 قوة > 85', color: '#f59e0b' } : { label: '⚡ قوة ≤ 85', color: '#64748b' });
    if (a.q.includes('90')) revealed.push(a.ans ? { label: '🔥 قوة > 90', color: '#ef4444' } : { label: '⚡ قوة ≤ 90', color: '#64748b' });
    if (a.q.includes('PEAK')) revealed.push(a.ans ? { label: '🌟 شكل PEAK نهائي', color: '#ffd700' } : { label: '🔰 ليس PEAK', color: '#64748b' });
    if (a.q.includes('يبدأ بحرف G')) revealed.push(a.ans ? { label: '📗 مصدره يبدأ بـ G', color: '#10b981' } : { label: '📛 مصدره لا يبدأ بـ G', color: '#64748b' });
    if (a.q.includes('يبدأ بـ "ك"')) revealed.push(a.ans ? { label: '🔤 اسمه يبدأ بـ ك', color: '#8b5cf6' } : { label: '🔤 اسمه لا يبدأ بـ ك', color: '#64748b' });
    if (a.q.includes('سحرية')) revealed.push(a.ans ? { label: '✨ يملك قوة سحرية', color: '#818cf8' } : { label: '⚔️ لا سحر لديه', color: '#64748b' });
    if (a.q.includes('أنثى')) revealed.push(a.ans ? { label: '👩 شخصية أنثى', color: '#f472b6' } : { label: '👨 ليس أنثى', color: '#64748b' });
  });
  // Always show source category hint after 2 answers
  if (m.answers.length >= 2 && h.source) {
    const srcWords = h.source.split(' ');
    const hint = srcWords[0].slice(0, 1) + '*'.repeat(Math.max(0, srcWords[0].length - 1));
    revealed.push({ label: '📚 يبدأ مصدره بـ: ' + hint, color: '#94a3b8' });
  }
  // Show power range after 3 answers
  if (m.answers.length >= 3) {
    const pRange = h.p >= 95 ? '95-100' : h.p >= 90 ? '90-94' : h.p >= 85 ? '85-89' : h.p >= 80 ? '80-84' : '70-79';
    revealed.push({ label: '📊 قوته بين ' + pRange, color: '#fb923c' });
  }
  // Show first letter of name after 4 answers
  if (m.answers.length >= 4 && h.ar && h.ar.name) {
    revealed.push({ label: '🔠 أول حرف باسمه: ' + h.ar.name[0], color: '#22d3ee' });
  }
  // Show ability hint after 5 answers
  if (m.answers.length >= 5 && h.ar && h.ar.ability) {
    const abilWords = h.ar.ability.split(' ').slice(0,3).join(' ');
    revealed.push({ label: '⚡ قدرته: ' + abilWords + '...', color: '#a3e635' });
  }
  return revealed;
}

function gzInitMystery() {
  const hero = window.heroes[Math.floor(Math.random() * window.heroes.length)];
  const shuffledQ = [...MYST_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 6);

  mystState = {
    hero,
    questions: shuffledQ,
    answers: [],
    currentQ: 0,
    guessInput: '',
    done: false,
    startTime: Date.now()
  };
  gzRenderMystery();
}

function gzRenderMystery() {
  const c = document.getElementById('gz-game-view');
  if (!c) return;
  const m = mystState;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const remaining = m.questions.length - m.currentQ;

  c.innerHTML = `
    <div style="max-width:680px;margin:0 auto;font-family:'Cairo',sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <button onclick="gzRenderLobby()" style="background:rgba(255,255,255,0.07);color:#fff;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;font-family:'Cairo',sans-serif;">← رجوع</button>
        <div style="color:var(--gz-gold);font-weight:900;font-size:15px;">❓ من أنا؟ — اكتشف البطل</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.5);">أسئلة متبقية: ${remaining}</div>
      </div>

      <!-- Mystery hero silhouette + progressive hints -->
      <div style="text-align:center;margin-bottom:14px;">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:100px;height:100px;border-radius:50%;
          background:${m.done ? 'transparent' : 'linear-gradient(135deg,#1e293b,#0f172a)'};
          border:3px solid ${m.done?'var(--gz-gold)':'rgba(255,215,0,0.3)'};
          font-size:50px;box-shadow:0 0 30px rgba(255,215,0,0.2);overflow:hidden;">
          ${m.done
            ? (gzGetHeroImageUrl && gzGetHeroImageUrl(m.hero)
                ? `<img src="${gzGetHeroImageUrl(m.hero)}" style="width:100%;height:100%;object-fit:cover;" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='${m.hero.icon||'⚔️'}'"`
                : (m.hero.icon || '⚔️'))
            : '❓'}
        </div>
        <div style="font-size:13px;color:${m.done?'#ffd700':'rgba(255,255,255,0.4)'};margin-top:8px;font-weight:${m.done?900:400};">
          ${m.done ? (m.hero[lang]?m.hero[lang].name:m.hero.name) : 'بطل غامض من بين 700 أسطورة'}
        </div>
      </div>

      <!-- REVEALED HINTS -->
      ${!m.done && m.answers.length > 0 ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:11px;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:6px;">💡 ما تعرفه حتى الآن:</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">
            ${gzBuildHints(m, lang).map(h => `
              <span style="background:${h.color}22;border:1px solid ${h.color}66;color:${h.color};font-size:11px;font-weight:800;padding:4px 10px;border-radius:99px;">${h.label}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Q&A History -->
      ${m.answers.length ? `
        <div style="background:rgba(0,0,0,0.3);border-radius:14px;padding:12px;margin-bottom:14px;max-height:180px;overflow-y:auto;border:1px solid rgba(255,255,255,0.07);">
          ${m.answers.map(a => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="font-size:12px;color:rgba(255,255,255,0.7);">${a.q}</span>
              <span style="font-size:14px;">${a.ans ? '✅ نعم' : '❌ لا'}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Current Question -->
      ${!m.done && m.currentQ < m.questions.length ? `
        <div style="background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(10,15,25,0.95));border:2px solid rgba(255,215,0,0.35);border-radius:18px;padding:22px;text-align:center;margin-bottom:14px;">
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:8px;">السؤال ${m.currentQ + 1} / ${m.questions.length}</div>
          <div style="font-size:17px;font-weight:900;color:#fff;margin-bottom:18px;">${m.questions[m.currentQ].q}</div>
          <div style="display:flex;gap:12px;justify-content:center;">
            <button onclick="gzMystAnswer(true)" style="background:linear-gradient(135deg,#10b981,#047857);color:#fff;border:none;padding:12px 32px;border-radius:12px;font-size:15px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;transition:all 0.2s;"
              onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform=''">✅ نعم</button>
            <button onclick="gzMystAnswer(false)" style="background:linear-gradient(135deg,#ef4444,#b91c1c);color:#fff;border:none;padding:12px 32px;border-radius:12px;font-size:15px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;transition:all 0.2s;"
              onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform=''">❌ لا</button>
          </div>
        </div>
      ` : ''}

      <!-- Guess input -->
      ${(!m.done && m.currentQ >= m.questions.length) || (m.answers.length >= 3) ? `
        <div style="background:rgba(168,85,247,0.08);border:1.5px solid rgba(168,85,247,0.4);border-radius:16px;padding:18px;text-align:center;">
          <div style="font-size:14px;color:#c084fc;font-weight:900;margin-bottom:10px;">💡 حاول تخمين البطل الآن!</div>
          <input id="myst-guess" placeholder="اكتب اسم البطل..." style="background:rgba(255,255,255,0.07);border:1px solid rgba(168,85,247,0.4);color:#fff;padding:10px 16px;border-radius:10px;font-size:14px;width:220px;font-family:'Cairo';text-align:center;">
          <button onclick="gzMystGuess()" style="background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;border:none;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;margin-right:8px;margin-top:8px;">تخمين!</button>
        </div>
      ` : ''}
    </div>`;
}

function gzMystAnswer(ans) {
  const m = mystState;
  if (m.currentQ >= m.questions.length || m.done) return;
  const q = m.questions[m.currentQ];
  const correct = q.prop(m.hero);
  m.answers.push({ q: q.q, ans: correct });
  m.currentQ++;
  if (m.currentQ >= m.questions.length) gzToast('💡 استنفذت أسئلتك — الآن خمّن!', 'info');
  gzRenderMystery();
}

function gzMystGuess() {
  const m = mystState;
  const guess = (document.getElementById('myst-guess')?.value || '').trim().toLowerCase();
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  const heroName = (m.hero[lang] ? m.hero[lang].name : m.hero.name || '').toLowerCase();
  const heroNameEn = (m.hero.en ? m.hero.en.name : '').toLowerCase();
  const correct = guess && (heroName.includes(guess) || guess.includes(heroName) || heroNameEn.includes(guess));

  const elapsed = Math.round((Date.now() - m.startTime) / 1000);
  m.done = true;

  if (correct) {
    const bonus = elapsed < 30 ? ' ⚡ سرعة مذهلة!' : '';
    gzToast(`🎉 أحسنت! البطل كان ${m.hero[lang]?m.hero[lang].name:m.hero.name}!${bonus}`, 'gold', 5000);
  } else {
    gzToast(`❌ إجابة خاطئة! البطل الغامض كان: ${m.hero[lang]?m.hero[lang].name:m.hero.name}`, 'error', 5000);
  }

  gzRenderMystery();
  setTimeout(() => {
    const c = document.getElementById('gz-game-view');
    if(c) c.innerHTML += `<div style="text-align:center;margin-top:16px;display:flex;gap:10px;justify-content:center;">
      <button onclick="gzInitMystery()" style="background:linear-gradient(135deg,#ffd700,#ff6b00);color:#000;border:none;padding:10px 24px;border-radius:10px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;">جولة جديدة 🎲</button>
      <button onclick="gzRenderLobby()" style="background:rgba(255,255,255,0.1);color:#fff;border:none;padding:10px 20px;border-radius:10px;font-weight:700;cursor:pointer;font-family:'Cairo',sans-serif;">رجوع</button>
    </div>`;
  }, 500);
}

// ══════════════════════════════════════════════════════════════════════════
// ████ 5. CHAMPIONS AUCTION ████
// ══════════════════════════════════════════════════════════════════════════

let auctState = {};

function gzInitAuction() {
  if (window.gzAuctionInterval) { clearInterval(window.gzAuctionInterval); window.gzAuctionInterval = null; }
  if (window.gzAuctionCountdown) { clearInterval(window.gzAuctionCountdown); window.gzAuctionCountdown = null; }

  const shuffled = [...window.heroes].sort(() => 0.5 - Math.random());
  const pool = shuffled.slice(0, 25);

  auctState = {
    pool,
    budget: 150,
    aiBudget: 150,       // AI opponent has same budget
    team: [],
    aiTeam: [],          // AI's team
    currentIdx: 0,
    currentBid: 0,
    minBid: 5,
    maxTeam: 5,
    aiMaxTeam: 5,
    phase: 'bid',        // bid → battle → done
    battleLog: [],
    bidLog: []
  };
  gzNextAuction();
}

function gzAiDecidesBid(st, baseVal, heroP) {
  // AI bidding logic: more aggressive for stronger heroes
  const desire = heroP >= 90 ? 0.85 : heroP >= 80 ? 0.65 : heroP >= 75 ? 0.45 : 0.3;
  const willBid = Math.random() < desire && st.aiBudget >= st.currentBid + 5;
  if (!willBid) return false;
  // AI bids 1-3 increments above current
  const inc = Math.floor(Math.random() * 3 + 1) * 5;
  const newBid = st.currentBid + inc;
  if (newBid > st.aiBudget || newBid > st.aiBudget * 0.4) return false; // AI doesn't over-commit
  return newBid;
}

function gzNextAuction() {
  const st = auctState;
  // Check if both teams full or pool exhausted
  if ((st.team.length >= st.maxTeam && st.aiTeam.length >= st.aiMaxTeam) || st.currentIdx >= st.pool.length) {
    // If player team not full but pool is done — go to battle anyway
    st.phase = 'battle';
    gzAuctionStartBattle();
    return;
  }
  // If player is done but AI not — AI keeps buying silently
  if (st.team.length >= st.maxTeam) {
    while (st.aiTeam.length < st.aiMaxTeam && st.currentIdx < st.pool.length) {
      const h = st.pool[st.currentIdx++];
      const val = Math.round(h.p / 10) * 5;
      if (st.aiBudget >= val) { st.aiBudget -= val; st.aiTeam.push({ hero: h, price: val }); }
    }
    st.phase = 'battle';
    gzAuctionStartBattle();
    return;
  }

  st.currentHero = st.pool[st.currentIdx];
  const baseVal = Math.round(st.currentHero.p / 10) * 5;
  st.currentBid = baseVal;
  st.minBid = baseVal;
  st.aiLastBid = false;

  // Schedule AI first bid after 1.5s if player hasn't raised
  clearTimeout(window._gzAIBidTimer);
  window._gzAIBidTimer = setTimeout(() => gzAiCounterBid(), 1500);

  gzRenderAuction();
}

function gzAiCounterBid() {
  const st = auctState;
  if (st.phase !== 'bid' || !st.currentHero) return;
  const aiBid = gzAiDecidesBid(st, st.minBid, st.currentHero.p);
  if (aiBid) {
    st.currentBid = aiBid;
    st.aiLastBid = true;
    st.bidLog.unshift(`🤖 الخصم زاد العرض إلى ${aiBid}M!`);
    gzToast(`🤖 الخصم زايد! العرض الآن ${aiBid}M`, 'warn', 2000);
    gzRenderAuction();
    // AI may bid again if player doesn't react
    clearTimeout(window._gzAIBidTimer2);
    window._gzAIBidTimer2 = setTimeout(() => gzAiCounterBid(), 2500);
  }
}

function gzAuctionBid(amount) {
  const st = auctState;
  clearTimeout(window._gzAIBidTimer);
  clearTimeout(window._gzAIBidTimer2);
  const newBid = st.currentBid + amount;
  if (newBid > st.budget) { gzToast('⚠️ ميزانيتك لا تسمح بهذا العرض!', 'warn'); return; }
  st.currentBid = newBid;
  st.aiLastBid = false;
  st.bidLog.unshift(`👤 رفعت العرض إلى ${newBid}M`);
  gzRenderAuction();
  gzToast(`💰 عرضك: ${newBid}M — الخصم يفكر...`, 'info', 1800);
  // AI counter-bid after 1.8s
  window._gzAIBidTimer = setTimeout(() => gzAiCounterBid(), 1800);
}

function gzAuctionBuy() {
  const st = auctState;
  clearTimeout(window._gzAIBidTimer);
  clearTimeout(window._gzAIBidTimer2);
  if (st.currentBid > st.budget) { gzToast('⚠️ ليس لديك ميزانية كافية!', 'warn'); return; }

  // If AI was last bidder, player outbids → player wins but AI might still contest
  const heroName = st.currentHero.ar ? st.currentHero.ar.name : st.currentHero.name;

  // Final AI counter? Only if AI was NOT last bidder (player just raised)
  if (!st.aiLastBid) {
    // One final AI attempt
    const finalAI = gzAiDecidesBid(st, st.minBid, st.currentHero.p);
    if (finalAI && finalAI > st.currentBid) {
      st.currentBid = finalAI;
      st.aiLastBid = true;
      st.bidLog.unshift(`🤖 الخصم دخل بعرض أخير: ${finalAI}M!`);
      gzToast(`🤖 الخصم يزايد بشكل أخير! ${finalAI}M — هل ترد؟`, 'warn', 2500);
      gzRenderAuction();
      return; // Player must click buy again
    }
  }

  st.budget -= st.currentBid;
  st.team.push({ hero: st.currentHero, price: st.currentBid });
  st.currentIdx++;
  st.bidLog.unshift(`🏆 اقتنيت [${heroName}] بـ ${st.currentBid}M!`);
  gzToast(`🏆 فزت بـ [${heroName}] بـ ${st.currentBid}M!`, 'gold');

  // AI buys next hero with its remaining budget (background)
  if (st.aiTeam.length < st.aiMaxTeam && st.currentIdx < st.pool.length) {
    const nextH = st.pool[st.currentIdx];
    const aiVal = Math.round(nextH.p / 10) * 5;
    if (st.aiBudget >= aiVal) {
      st.aiBudget -= aiVal;
      st.aiTeam.push({ hero: nextH, price: aiVal });
      st.currentIdx++;
      st.bidLog.unshift(`🤖 الخصم اشترى [${nextH.ar?nextH.ar.name:nextH.name}] بـ ${aiVal}M`);
    }
  }

  if (st.team.length >= st.maxTeam) {
    // Fill AI team
    while (st.aiTeam.length < st.aiMaxTeam && st.currentIdx < st.pool.length) {
      const h = st.pool[st.currentIdx++];
      const val = Math.round(h.p / 10) * 5;
      if (st.aiBudget >= val) { st.aiBudget -= val; st.aiTeam.push({ hero: h, price: val }); }
    }
    setTimeout(() => { st.phase = 'battle'; gzAuctionStartBattle(); }, 800);
    return;
  }
  setTimeout(gzNextAuction, 600);
}

function gzAuctionSkip() {
  clearTimeout(window._gzAIBidTimer);
  clearTimeout(window._gzAIBidTimer2);
  const st = auctState;
  const hero = st.currentHero;

  // If AI was last bidder, AI wins this hero automatically
  if (st.aiLastBid && hero && st.aiBudget >= st.currentBid) {
    st.aiBudget -= st.currentBid;
    st.aiTeam.push({ hero, price: st.currentBid });
    const hn = hero.ar ? hero.ar.name : hero.name;
    st.bidLog.unshift(`🤖 الخصم اشترى [${hn}] بعد انسحابك!`);
    gzToast(`🤖 الخصم أخذ [${hn}]!`, 'warn', 2000);
  } else {
    gzToast('⏭️ تخطيت هذا البطل — انتقل للتالي', 'info');
  }

  st.currentIdx++;
  gzNextAuction();
}

// ─── Team Battle after Auction ───
function gzAuctionStartBattle() {
  const st = auctState;
  if (!st.aiTeam.length) {
    // Fill AI team from remaining pool if somehow empty
    const remaining = st.pool.slice(st.currentIdx, st.currentIdx + 5);
    remaining.forEach(h => st.aiTeam.push({ hero: h, price: 10 }));
  }

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
  st.battleLog = [];
  st.battleRound = 0;

  // Run 5 rounds of battles: player card vs AI card
  const rounds = Math.min(st.team.length, st.aiTeam.length, 5);
  let playerWins = 0, aiWins = 0;

  for (let i = 0; i < rounds; i++) {
    const pm = st.team[i]; const am = st.aiTeam[i];
    const pp = pm.hero.p; const ap = am.hero.p;
    const playerRoll = pp + Math.floor(Math.random() * 20);
    const aiRoll = ap + Math.floor(Math.random() * 20);
    const pName = pm.hero[lang] ? pm.hero[lang].name : pm.hero.name;
    const aName = am.hero[lang] ? am.hero[lang].name : am.hero.name;

    if (playerRoll >= aiRoll) {
      playerWins++;
      st.battleLog.push({ winner: 'player', pName, aName, pRoll: playerRoll, aRoll: aiRoll, pp, ap });
    } else {
      aiWins++;
      st.battleLog.push({ winner: 'ai', pName, aName, pRoll: playerRoll, aRoll: aiRoll, pp, ap });
    }
  }

  st.playerBattleWins = playerWins;
  st.aiBattleWins = aiWins;
  st.matchWinner = playerWins > aiWins ? 'player' : playerWins < aiWins ? 'ai' : 'draw';
  gzRenderAuction();
}


function gzRenderAuction() {
  const c = document.getElementById('gz-game-view');
  if (!c) return;
  const st = auctState;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';

  if (st.phase === 'battle' || st.phase === 'done') {
    const lang2 = typeof currentLang !== 'undefined' ? currentLang : 'ar';
    const won = st.matchWinner === 'player';
    const draw = st.matchWinner === 'draw';
    const pAvg = st.team.length ? Math.round(st.team.reduce((a,m)=>a+m.hero.p,0)/st.team.length) : 0;
    const aAvg = st.aiTeam.length ? Math.round(st.aiTeam.reduce((a,m)=>a+m.hero.p,0)/st.aiTeam.length) : 0;
    c.innerHTML = `
      <div style="max-width:900px;margin:0 auto;font-family:'Cairo',sans-serif;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:52px;margin-bottom:8px;">${won?'🏆':draw?'⚖️':'💀'}</div>
          <h2 style="font-family:'Cinzel',serif;color:${won?'#ffd700':draw?'#f59e0b':'#f87171'};font-size:26px;font-weight:900;margin-bottom:6px;">
            ${won?'انتصار أسطوري على فريق الـ AI!':draw?'تعادل حماسي!':'هزيمة — فريق الـ AI كان أكثر توازناً'}
          </h2>
          <p style="color:rgba(255,255,255,0.6);">فوز فريقك: <strong style="color:#4ade80;">${st.playerBattleWins||0}</strong> جولات | فوز الخصم: <strong style="color:#f87171;">${st.aiBattleWins||0}</strong> جولات</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:start;margin-bottom:18px;">
          <div style="background:rgba(16,185,129,0.08);border:2px solid rgba(16,185,129,0.35);border-radius:16px;padding:14px;">
            <div style="text-align:center;font-size:13px;font-weight:900;color:#4ade80;margin-bottom:10px;">👑 فريقك (معدل القوة: ${pAvg})</div>
            ${st.team.map((m,i) => {
              const r = st.battleLog && st.battleLog[i];
              const didWin = r && r.winner === 'player';
              return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:8px;border-radius:10px;background:${r?(didWin?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.1)'):'rgba(255,255,255,0.04)'};"><span style="flex-shrink:0;">${gzRenderHeroAvatar(m.hero, 36)}</span><div style="flex:1;"><div style="font-size:11px;font-weight:900;color:#fff;">${m.hero[lang2]?m.hero[lang2].name:m.hero.name}</div><div style="font-size:10px;color:rgba(255,255,255,0.4);">قوة ${m.hero.p} | ${m.price}M</div>${r ? `<div style="font-size:10px;color:${didWin?'#4ade80':'#f87171'};font-weight:800;">${didWin?'✅ فاز النزال':'❌ خسر النزال'} (${r.pRoll} vs ${r.aRoll})</div>` : ''}</div></div>`;
            }).join('')}
          </div>

          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding-top:36px;">
            <div style="font-family:'Cinzel',serif;font-size:24px;font-weight:900;color:var(--gz-gold);">VS</div>
            ${(st.battleLog||[]).map(r => `<div style="font-size:16px;">${r.winner==='player'?'👑':'🤖'}</div>`).join('')}
          </div>

          <div style="background:rgba(239,68,68,0.08);border:2px solid rgba(239,68,68,0.35);border-radius:16px;padding:14px;">
            <div style="text-align:center;font-size:13px;font-weight:900;color:#f87171;margin-bottom:10px;">🤖 فريق الـ AI (معدل القوة: ${aAvg})</div>
            ${(st.aiTeam||[]).map((m,i) => {
              const r = st.battleLog && st.battleLog[i];
              const aiWon = r && r.winner === 'ai';
              return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:8px;border-radius:10px;background:${r?(aiWon?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.1)'):'rgba(255,255,255,0.04)'};"><span style="flex-shrink:0;">${gzRenderHeroAvatar(m.hero, 36)}</span><div style="flex:1;"><div style="font-size:11px;font-weight:900;color:#fff;">${m.hero[lang2]?m.hero[lang2].name:m.hero.name}</div><div style="font-size:10px;color:rgba(255,255,255,0.4);">قوة ${m.hero.p}</div>${r ? `<div style="font-size:10px;color:${aiWon?'#4ade80':'#f87171'};font-weight:800;">${aiWon?'✅ فاز النزال':'❌ خسر النزال'}</div>` : ''}</div></div>`;
            }).join('')}
          </div>
        </div>

        <div style="display:flex;gap:12px;justify-content:center;">
          <button onclick="gzInitAuction()" style="background:linear-gradient(135deg,#ffd700,#ff6b00);color:#000;border:none;padding:12px 28px;border-radius:12px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;">مزاد جديد 👑</button>
          <button onclick="gzRenderLobby()" style="background:rgba(255,255,255,0.1);color:#fff;border:none;padding:12px 20px;border-radius:12px;font-weight:700;cursor:pointer;font-family:'Cairo',sans-serif;">رجوع</button>
        </div>
      </div>`;
    return;
  }

  const hero = st.currentHero;
  if (!hero) return;
  const heroName = hero[lang] ? hero[lang].name : hero.name;
  const baseVal = Math.round(hero.p / 10) * 5;
  const canAfford = st.budget >= st.currentBid;

  c.innerHTML = `
    <div style="max-width:720px;margin:0 auto;font-family:'Cairo',sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
        <button onclick="gzRenderLobby()" style="background:rgba(255,255,255,0.07);color:#fff;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;font-family:'Cairo',sans-serif;">← رجوع</button>
        <div style="color:var(--gz-gold);font-weight:900;">👑 مزاد الأبطال</div>
        <div style="font-size:13px;color:#4ade80;font-weight:900;">ميزانيتك: ${st.budget}M 💰</div>
      </div>

      <!-- PROGRESS -->
      <div style="display:flex;gap:6px;margin-bottom:14px;justify-content:center;">
        ${Array.from({length:st.maxTeam},(_,i)=>`
          <div style="width:36px;height:36px;border-radius:50%;background:${i<st.team.length?'rgba(255,215,0,0.3)':'rgba(255,255,255,0.05)'};border:2px solid ${i<st.team.length?'#ffd700':'rgba(255,255,255,0.15)'};display:flex;align-items:center;justify-content:center;font-size:16px;">
            ${i<st.team.length?gzRenderHeroAvatar(st.team[i].hero,28):'?'}
          </div>
        `).join('')}
      </div>

      <!-- HERO ON AUCTION -->
      <div style="background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(10,15,25,0.98));border:2px solid rgba(255,215,0,0.4);border-radius:20px;padding:24px;margin-bottom:16px;text-align:center;position:relative;">
        <div style="position:absolute;top:14px;right:14px;font-size:11px;background:rgba(255,215,0,0.2);color:#ffd700;border:1px solid rgba(255,215,0,0.4);padding:4px 10px;border-radius:99px;font-weight:800;">
          ${st.pool.length - st.currentIdx} بطل متبقٍ
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          ${gzRenderHeroAvatar(hero, 80)}
          <div>
            <div style="font-size:20px;font-weight:900;color:#fff;">${heroName}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.5);">${hero.source} • قوة ${hero.p}</div>
            <div style="font-size:11px;color:var(--gz-gold);font-weight:700;margin-top:4px;">${hero[lang]?hero[lang].ability:''}</div>
          </div>
        </div>
        <div style="margin-top:16px;">
          <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:4px;">العرض الحالي</div>
          <div style="font-size:36px;font-weight:900;color:${canAfford?'#ffd700':'#f87171'};font-family:'Cinzel',serif;text-shadow:0 0 20px ${canAfford?'rgba(255,215,0,0.5)':'rgba(239,68,68,0.5)'};">${st.currentBid}M</div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px;">
          <button onclick="gzAuctionBid(5)"  style="background:rgba(255,215,0,0.12);border:1px solid rgba(255,215,0,0.4);color:#ffd700;border:none;padding:8px 16px;border-radius:8px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;border:1px solid rgba(255,215,0,0.4);">+5M</button>
          <button onclick="gzAuctionBid(10)" style="background:rgba(255,215,0,0.12);border:1px solid rgba(255,215,0,0.4);color:#ffd700;border:none;padding:8px 16px;border-radius:8px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;border:1px solid rgba(255,215,0,0.4);">+10M</button>
          <button onclick="gzAuctionBid(20)" style="background:rgba(255,215,0,0.12);border:1px solid rgba(255,215,0,0.4);color:#ffd700;border:none;padding:8px 16px;border-radius:8px;font-weight:900;cursor:pointer;font-family:'Cairo',sans-serif;border:1px solid rgba(255,215,0,0.4);">+20M</button>
          <button onclick="gzAuctionBuy()" ${canAfford?'':'disabled'} style="background:${canAfford?'linear-gradient(135deg,#10b981,#047857)':'rgba(100,100,100,0.3)'};color:#fff;border:none;padding:8px 20px;border-radius:8px;font-weight:900;cursor:${canAfford?'pointer':'not-allowed'};font-family:'Cairo',sans-serif;">
            🏆 اشترِ!
          </button>
          <button onclick="gzAuctionSkip()" style="background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.15);padding:8px 16px;border-radius:8px;font-weight:700;cursor:pointer;font-family:'Cairo',sans-serif;">تخطي ⏭️</button>
        </div>
      </div>

      <!-- TEAMS PREVIEW (player + AI) -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;">
        ${st.team.length ? `
          <div>
            <div style="font-size:11px;color:#4ade80;font-weight:800;margin-bottom:5px;">👑 فريقك (${st.team.length}/${st.maxTeam})</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px;">
              ${st.team.map(m => `
                <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.3);border-radius:8px;padding:5px 8px;display:flex;align-items:center;gap:6px;">
                  ${gzRenderHeroAvatar(m.hero, 28)}
                  <div style="font-size:10px;font-weight:700;color:#fff;">${(m.hero[lang]?m.hero[lang].name:m.hero.name).slice(0,10)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : '<div></div>'}
        ${st.aiTeam.length ? `
          <div>
            <div style="font-size:11px;color:#f87171;font-weight:800;margin-bottom:5px;">🤖 فريق الخصم (${st.aiTeam.length}/${st.aiMaxTeam})</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px;">
              ${st.aiTeam.map(m => `
                <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:5px 8px;display:flex;align-items:center;gap:6px;">
                  ${gzRenderHeroAvatar(m.hero, 28)}
                  <div style="font-size:10px;font-weight:700;color:#fff;">${(m.hero[lang]?m.hero[lang].name:m.hero.name).slice(0,10)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : '<div style="font-size:11px;color:rgba(255,255,255,0.3);">🤖 الخصم يجمع فريقه...</div>'}
      </div>

      <!-- BID LOG -->
      ${st.bidLog && st.bidLog.length ? `
        <div style="margin-top:10px;background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;border:1px solid rgba(255,255,255,0.07);">
          ${st.bidLog.slice(0,3).map((l,i) => `<div style="font-size:11px;color:${i===0?'#fef08a':'rgba(255,255,255,0.4)'};padding:2px 0;">${l}</div>`).join('')}
        </div>
      ` : ''}
    </div>`;
}

// ── Expose globals ──
window.gzSwitchGame   = gzSwitchGame;
window.gzRenderLobby  = gzRenderLobby;
window.gzToast        = gzToast;
window.gzActiveGame   = gzActiveGame;

// Gwent exposures
window.gwPlayCard     = gwPlayCard;
window.gwPassTurn     = gwPassTurn;
window.gwApplyHorn    = gwApplyHorn;
window.gwApplyDecoy   = gwApplyDecoy;
window.gwCancelDecoy  = gwCancelDecoy;

// Detective exposures
window.gzDetFindClue  = gzDetFindClue;
window.gzDetInterrogate = gzDetInterrogate;
window.gzDetAccuse    = gzDetAccuse;
window.gzInitDetective = gzInitDetective;

// Tower exposures
window.gzTowerAttack  = gzTowerAttack;
window.gzInitTower    = gzInitTower;

// Mystery exposures
window.gzMystAnswer   = gzMystAnswer;
window.gzMystGuess    = gzMystGuess;
window.gzInitMystery  = gzInitMystery;

// Auction exposures
window.gzAuctionStartBattle = gzAuctionStartBattle;
window.gzAuctionBid   = gzAuctionBid;
window.gzAuctionBuy   = gzAuctionBuy;
window.gzAuctionSkip  = gzAuctionSkip;
window.gzInitAuction  = gzInitAuction;

// Game setup exposures
window.gzOpenGameSetup = gzOpenGameSetup;
window.gzSelectMode   = gzSelectMode;
window.gzCopyRoomCode = gzCopyRoomCode;
window.gzShareRoomLink = gzShareRoomLink;
window.gzJoinFriendRoom = gzJoinFriendRoom;
window.gzLaunchActiveGame = gzLaunchActiveGame;
window.gzInitGwent    = gzInitGwent;

// Export portrait helper for use across all pages (arena, lore, games)
window.gzGetHeroImageUrl = gzGetHeroImageUrl;
window.gzRenderHeroAvatar = gzRenderHeroAvatar;
