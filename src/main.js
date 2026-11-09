import { createClient } from '@supabase/supabase-js';
import './style.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const CHAT_TABLE = 'temple_chat_messages';
const app = document.querySelector('#app');
const icons = {
  lotus: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20c-4.1 0-7-2.4-7-5.8 2.9 0 5 .9 7 3 2-2.1 4.1-3 7-3 0 3.4-2.9 5.8-7 5.8Z"/><path d="M12 17c-2.4-2-3.4-4.4-2.6-7.4 2.4 1.1 3.3 3.4 2.6 7.4Zm0 0c2.4-2 3.4-4.4 2.6-7.4C12.2 10.7 11.3 13 12 17ZM7.7 15.7C5 14.4 3.7 12.4 4 9.4c2.6.6 4 2.5 3.7 6.3Zm8.6 0c2.7-1.3 4-3.3 3.7-6.3-2.6.6-4 2.5-3.7 6.3Z"/><path d="M12 21v-2"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 16h12l-1.5-2.2V9a4.5 4.5 0 0 0-9 0v4.8L6 16Z"/><path d="M10 19a2 2 0 0 0 4 0M4 16h16M9 5 8 3m7 2 1-2"/></svg>',
  people: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 19c0-3 2.4-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6m2 3c2 .7 3 2 3 4"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a5 5 0 0 1 0 6m2-9a9 9 0 0 1 0 12"/></svg>',
};

const initialMessages = [
  { name: 'Mây Trắng', text: 'Chúc mọi người một buổi tối an yên 🌿', tone: 'sage', time: '19:42' },
  { name: 'An Nhiên', text: 'Nam mô A Di Đà Phật 🙏', tone: 'gold', time: '19:43' },
  { name: 'Thiện Tâm', text: 'Mình vừa thả một đèn hoa đăng cho gia đình.', tone: 'rose', time: '19:43' },
  { name: 'Minh Đăng', text: 'Chúc quý đạo hữu buổi tối an yên.', tone: 'blue', time: '19:44' },
];
let currentName = localStorage.getItem('an-lac-name') || 'Khách Tân Phú';
let messageRows = [];
let channel;
let bellSound = true;
let lastMessageAt = 0;
const timeNow = () => new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date());

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="#home" aria-label="Chùa Tân Phú - Trang chủ"><span class="brand-mark">${icons.lotus}</span><span class="brand-copy"><strong>Tân Phú</strong><small>CHÙA ONLINE</small></span></a>
      <nav class="top-nav" aria-label="Điều hướng"><a class="nav-item active" href="#home">Chánh điện</a><a class="nav-item" href="#rituals">Nghi lễ</a><a class="nav-item" href="#community">Đạo hữu</a></nav>
      <button class="profile-button" id="profile-button" aria-label="Đổi tên hiển thị"><span class="profile-avatar">☼</span><span id="profile-name"></span><span class="profile-caret">⌄</span></button>
    </header>

    <main id="home">
      <section class="welcome-row"><div><div class="eyebrow"><span class="live-dot"></span> MỘT GÓC TĨNH TÂM GIỮA CUỘC SỐNG</div><h1>Ghé chùa, <em>lòng an.</em></h1><p class="welcome-subtitle">Dừng chân đôi phút. Gửi một lời nguyện lành, gặp những tâm hồn đồng điệu.</p></div><div class="welcome-note"><span class="note-icon">☼</span><div><strong>Thở chậm một nhịp</strong><small>Bạn đang ở nơi bình yên.</small></div></div></section>

      <section class="temple-scene" aria-label="Không gian chánh điện ảo">
        <div class="scene-sky"></div><div class="scene-moon"></div><div class="scene-stars" aria-hidden="true">✦　 ·　　 ✧　　　 ·　✦　　 ·</div><div class="scene-hills hills-far"></div><div class="scene-hills hills-near"></div>
        <div class="scene-bamboo bamboo-left"><i></i><i></i><i></i><i></i></div><div class="scene-bamboo bamboo-right"><i></i><i></i><i></i></div>
        <div class="temple-roof roof-back"><div class="roof-cap"></div></div><div class="temple-building"><div class="temple-roof"><div class="roof-cap"></div><div class="roof-ridge"></div></div><div class="temple-upper"><span class="temple-window"></span><span class="temple-window"></span><span class="temple-window"></span></div><div class="temple-eaves"></div><div class="temple-pillars"><span></span><span></span><span></span><span></span><span></span></div><div class="temple-door"><div class="buddha-halo"></div><svg class="buddha-svg" viewBox="0 0 60 84" aria-hidden="true"><defs><linearGradient id="buddha-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e2a4"/><stop offset=".5" stop-color="#d8ae5d"/><stop offset="1" stop-color="#8a6428"/></linearGradient></defs><ellipse cx="30" cy="79" rx="21" ry="4" fill="#191610" opacity=".55"/><path d="M9 77 Q30 68 51 77 L51 81 Q30 73 9 81 Z" fill="#c99f4e"/><path d="M13 74 Q30 66 47 74 L45 78 Q30 71 15 78 Z" fill="url(#buddha-gold)" opacity=".85"/><path d="M30 22 C39 22 43 30 43 41 C43 53 38 62 30 62 C22 62 17 53 17 41 C17 30 21 22 30 22 Z" fill="url(#buddha-gold)"/><path d="M23 45 Q30 51 37 45" stroke="#8a6428" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="30" cy="40" r="3.4" fill="#f0d492"/><circle cx="30" cy="14" r="8" fill="url(#buddha-gold)"/><circle cx="30" cy="5" r="2.6" fill="url(#buddha-gold)"/><path d="M22 14 Q21 18 22.5 20 M38 14 Q39 18 37.5 20" stroke="#8a6428" stroke-width="1" fill="none" stroke-linecap="round"/></svg><div class="altar-glow"></div></div><div class="temple-steps"></div></div>
        <div class="scene-lantern lantern-a">✧</div><div class="scene-lantern lantern-b">✧</div><div class="scene-lantern lantern-c">✧</div><div class="scene-path"></div><div class="devotee" id="devotee" aria-hidden="true"><span class="d-head"></span><span class="d-robe"></span></div><div class="incense-pot"><div class="pot-smoke"></div><span>☼</span></div>
        <div class="scene-caption"><span class="caption-dot"></span> CHÁNH ĐIỆN · TÂN PHÚ <span class="caption-divider">/</span> <span id="scene-visitor-count">Mời bạn an tọa</span></div>
        <div class="scene-quote"><span>“Tâm an, vạn sự an.”</span><small>— Lời nhắc cho hôm nay</small></div>
      </section>

      <div class="main-columns">
        <div class="left-column">
          <section id="rituals" class="ritual-section">
            <div class="section-heading"><div><div class="eyebrow section-eyebrow">KHOẢNH KHẮC TĨNH TÂM</div><h2>Thành tâm dâng lễ</h2></div><span class="section-aside">Chọn một nghi lễ để bắt đầu</span></div>
            <div class="ritual-grid">
              <button class="ritual-card" data-action="incense"><span class="ritual-icon incense-icon"><span>♨</span></span><span class="ritual-copy"><strong>Thắp hương</strong><small>Dâng nén tâm hương</small></span><span class="ritual-arrow">↗</span></button>
              <button class="ritual-card" data-action="bow"><span class="ritual-icon bow-icon"><span>⌁</span></span><span class="ritual-copy"><strong>Lạy Phật</strong><small>Chắp tay, cúi đầu thành kính</small></span><span class="ritual-arrow">↗</span></button>
              <button class="ritual-card" data-action="lantern"><span class="ritual-icon lantern-icon"><span>♧</span></span><span class="ritual-copy"><strong>Thả hoa đăng</strong><small>Gửi ước nguyện theo ánh đèn</small></span><span class="ritual-arrow">↗</span></button>
              <button class="ritual-card" data-action="fortune"><span class="ritual-icon fortune-icon"><span>筊</span></span><span class="ritual-copy"><strong>Xin quẻ</strong><small>Gieo một quẻ, nhận lời lành</small></span><span class="ritual-arrow">↗</span></button>
              <button class="ritual-card" data-action="woodfish"><span class="ritual-icon woodfish-icon"><span>◉</span></span><span class="ritual-copy"><strong>Gõ mõ</strong><small>Tĩnh tâm theo nhịp mõ</small></span><span class="ritual-arrow">↗</span></button>
              <button class="ritual-card" data-action="bell"><span class="ritual-icon bell-icon">${icons.bell}</span><span class="ritual-copy"><strong>Thỉnh chuông</strong><small>Nghe tiếng chuông ngân xa</small></span><span class="ritual-arrow">↗</span></button>
            </div>
          </section>
          <section class="intention-card"><span class="intention-lotus">❋</span><div><div class="eyebrow section-eyebrow">GÓC LỜI NGUYỆN</div><h3>Giữ một điều lành trong tâm.</h3><p>Không cần nói thành lời. Nguyện cho bản thân và mọi người được bình an.</p></div><button class="intention-button" id="intention-button" aria-label="Gửi lời nguyện">Gửi lời nguyện <span>→</span></button></section>
        </div>

        <aside class="chat-card" id="community">
          <div class="chat-heading"><div><span class="chat-heading-icon">${icons.people}</span><div><h2>Đạo hữu gần xa</h2><p><span class="chat-live" id="chat-live-dot"></span><span id="online-count">Đang mở phòng</span></p></div></div><button class="chat-menu" title="Cộng đồng an lành" aria-label="Thông tin">···</button></div>
          <div class="chat-rule"></div><div class="chat-context">Cùng nhau giữ lời nói hiền hòa, sẻ chia điều an lành. 🙏</div>
          <div class="messages" id="messages" role="log" aria-live="polite" aria-label="Tin nhắn cộng đồng"></div>
          <form class="chat-form" id="chat-form"><label for="chat-input" class="sr-only">Tin nhắn của bạn</label><input id="chat-input" name="message" maxlength="220" autocomplete="off" placeholder="Gửi lời chào an lành..."/><button type="submit" aria-label="Gửi tin nhắn"><span>↑</span></button></form>
          <div class="chat-footnote"><span>${icons.sound}</span> Từ bi trong lời nói, an vui trong cộng đồng.</div>
        </aside>
      </div>
      <footer class="footer"><span>${icons.lotus}<strong>Chùa Tân Phú</strong> · Một góc chùa nhỏ trên mạng</span><button id="sound-button" class="sound-button">${icons.sound} <span>Âm thanh đang bật</span></button><span class="footer-right">Nguyện mọi người đều được an lành <span>☼</span></span></footer>
    </main>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <div class="modal-backdrop" id="modal-backdrop" hidden><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" id="modal-close" aria-label="Đóng">×</button><div class="modal-symbol" id="modal-symbol">☼</div><div class="eyebrow section-eyebrow">GIEO MỘT QUẺ LÀNH</div><h2 id="modal-title">Lời quẻ hôm nay</h2><p class="fortune-text" id="fortune-text"></p><p class="fortune-advice" id="fortune-advice"></p><button class="modal-submit" id="fortune-again">Xin quẻ thêm lần nữa</button></section></div>
`;

const messagesElement = document.querySelector('#messages');
const toastElement = document.querySelector('#toast');
let toastTimer;
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}
function renderMessages() {
  messagesElement.innerHTML = messageRows.map((message) => `<article class="chat-message"><span class="message-avatar ${escapeHTML(message.tone || 'sage')}">${escapeHTML(Array.from(message.name || '?')[0])}</span><div class="message-body"><div class="message-meta"><strong>${escapeHTML(message.name || 'Đạo hữu')}</strong><time>${escapeHTML(message.time || timeNow())}</time></div><p>${escapeHTML(message.text)}</p></div></article>`).join('');
  messagesElement.scrollTop = messagesElement.scrollHeight;
}
function notify(message) {
  toastElement.textContent = message;
  toastElement.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastElement.classList.remove('show'), 2800);
}

const demoStore = 'an-lac-community-messages';
try {
  const saved = JSON.parse(localStorage.getItem(demoStore) || '[]');
  messageRows = [...initialMessages, ...(Array.isArray(saved) ? saved.slice(-15) : [])];
} catch {
  messageRows = [...initialMessages];
}
renderMessages();
document.querySelector('#profile-name').textContent = currentName;

const CHAT_CHANNEL = 'chuatanphu-community';
const chatState = { mode: 'local', id: localStorage.getItem('an-lac-guest-id') || `guest-${Math.random().toString(16).slice(2, 10)}` };
localStorage.setItem('an-lac-guest-id', chatState.id);
const toneCycle = ['sage', 'gold', 'rose', 'blue'];

function pushIncoming(entry) {
  if (!entry || !entry.text) return;
  if (entry.id && messageRows.some((row) => row.id === entry.id)) return;
  messageRows.push({ id: entry.id, name: entry.name || 'Đạo hữu', text: entry.text, time: entry.time || timeNow(), tone: toneCycle[messageRows.length % 4] });
  messageRows = messageRows.slice(-35);
  renderMessages();
}
function setPresence(count) {
  document.querySelector('#online-count').textContent = count === 1 ? '1 người đang ở đây' : `${count} người đang ở đây`;
  document.querySelector('#scene-visitor-count').textContent = `${count} đạo hữu đang ghé thăm`;
  document.querySelector('#chat-live-dot').classList.add('chat-live');
}

function startCommunityChat() {
  if (!supabase) return;
  channel = supabase.channel(CHAT_CHANNEL, { config: { presence: { key: chatState.id }, broadcast: { self: false } } });
  channel
    .on('broadcast', { event: 'msg' }, ({ payload }) => pushIncoming({ id: payload.id, name: payload.name, text: payload.text, time: timeNow() }))
    .on('presence', { event: 'sync' }, () => {
      const visitors = Object.values(channel.presenceState()).reduce((sum, sessions) => sum + sessions.length, 0);
      setPresence(Math.max(visitors, 1));
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        chatState.mode = 'realtime';
        channel.track({ name: currentName, joined_at: new Date().toISOString() });
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        chatState.mode = 'local';
        document.querySelector('#chat-live-dot').classList.remove('chat-live');
        document.querySelector('#online-count').textContent = 'Chưa kết nối';
      }
    });
}
startCommunityChat();

document.querySelector('#profile-button').addEventListener('click', () => {
  const updated = window.prompt('Bạn muốn mọi người gọi mình là gì?', currentName);
  if (updated === null) return;
  const clean = updated.trim().replace(/\s+/g, ' ').slice(0, 28);
  if (!clean) return notify('Tên hiển thị không được để trống.');
  currentName = clean;
  localStorage.setItem('an-lac-name', currentName);
  document.querySelector('#profile-name').textContent = currentName;
  channel?.track({ name: currentName, joined_at: new Date().toISOString() }).catch(() => {});
  notify(`Chào ${currentName}, mời bạn an tọa.`);
});

document.querySelector('#chat-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.querySelector('#chat-input');
  const text = input.value.trim();
  if (!text) return;
  if (text.length > 220) return notify('Tin nhắn tối đa 220 ký tự.');
  if (Date.now() - lastMessageAt < 1200) return notify('Bạn chờ một chút trước khi gửi tin tiếp nhé.');
  lastMessageAt = Date.now();
  const message = { id: `${chatState.id}-${Date.now()}`, name: currentName, text, time: timeNow(), tone: toneCycle[messageRows.length % 4] };

  if (chatState.mode === 'realtime' && channel) {
    const result = await channel.send({ type: 'broadcast', event: 'msg', payload: { id: message.id, name: currentName, text, ts: Date.now() } });
    if (result !== 'ok') {
      lastMessageAt = 0;
      return notify('Chưa gửi được tin nhắn. Xin thử lại sau ít phút.');
    }
    pushIncoming(message);
  } else {
    const userMessages = [...messageRows.filter((row) => row.isLocal), { ...message, isLocal: true }].slice(-15);
    messageRows = [...initialMessages, ...userMessages];
    try { localStorage.setItem(demoStore, JSON.stringify(userMessages)); } catch { /* private browsing */ }
    renderMessages();
    notify('Tin nhắn đã lưu trên thiết bị này. Phòng chat chung đang kết nối lại.');
  }
  input.value = '';
});

function incenseRitual() {
  const pot = document.querySelector('.incense-pot');
  for (let i = 0; i < 4; i += 1) {
    const smoke = document.createElement('span');
    smoke.className = 'ritual-smoke';
    smoke.style.left = `${14 + Math.random() * 30}px`;
    smoke.style.animationDelay = `${i * 160}ms`;
    pot.append(smoke);
    window.setTimeout(() => smoke.remove(), 3500);
  }
  pot.classList.add('glowing');
  window.setTimeout(() => pot.classList.remove('glowing'), 2300);
  notify('Nén tâm hương đã được dâng lên. Xin nguyện điều lành.');
}
let templeVisiting = false;
function templeVisit() {
  if (templeVisiting) return;
  templeVisiting = true;
  const devotee = document.querySelector('#devotee');
  const compact = window.matchMedia('(max-width:700px)').matches;
  devotee.classList.add('walking');
  devotee.style.left = compact ? '50%' : '45%';
  devotee.style.bottom = compact ? '21%' : '25%';
  window.setTimeout(() => {
    devotee.classList.remove('walking');
    devotee.classList.add('prostrating');
    incenseRitual();
    notify('Đạo hữu tiến vào chánh điện, đảnh lễ Tam Bái trước Đức Phật. 🙏');
  }, 2600);
  window.setTimeout(() => {
    devotee.classList.remove('prostrating');
    devotee.classList.add('walking');
    devotee.style.left = '21%';
    devotee.style.bottom = '8%';
  }, 5400);
  window.setTimeout(() => {
    devotee.classList.remove('walking');
    templeVisiting = false;
  }, 8100);
}
function bowRitual() {
  const buddha = document.querySelector('.temple-door');
  buddha.classList.remove('blessing');
  void buddha.offsetWidth;
  buddha.classList.add('blessing');
  window.setTimeout(() => buddha.classList.remove('blessing'), 2400);
  notify('Bạn vừa thành kính đảnh lễ. Tâm nguyện an lành. 🙏');
}
function lanternRitual() {
  const path = document.querySelector('.scene-path');
  const lantern = document.createElement('span');
  lantern.className = 'floating-lantern';
  lantern.setAttribute('aria-label', 'Hoa đăng mang lời nguyện bình an');
  lantern.innerHTML = '<i>✧</i>';
  lantern.style.setProperty('--lantern-x', `${Math.round(15 + Math.random() * 70)}%`);
  path.append(lantern);
  window.setTimeout(() => lantern.remove(), 7400);
  notify('Hoa đăng mang lời nguyện của bạn đang trôi đi. 🪷');
}
const fortunes = [
  ['Tâm sáng như trăng', 'Giữ lòng kiên nhẫn, việc nhỏ làm bằng thiện ý sẽ dần thành việc lớn.'],
  ['Gieo duyên lành', 'Một lời hỏi thăm chân tình có thể đem niềm vui đến cho người đang cần.'],
  ['An nhiên tự tại', 'Chậm lại một nhịp, lắng nghe lòng mình rồi hãy bước tiếp.'],
  ['Vạn sự tùy duyên', 'Điều đến cứ đón bằng lòng biết ơn, điều đi xin nhẹ lòng buông bỏ.'],
  ['Từ bi hỷ xả', 'Hôm nay, hãy dành cho chính mình sự dịu dàng mà bạn vẫn dành cho mọi người.'],
  ['Đường xa thong thả', 'Đường tốt không ở nhanh chậm; mỗi bước chân thiện lành đều đáng quý.'],
];
function showFortune() {
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  document.querySelector('#fortune-text').textContent = `“${fortune[0]}”`;
  document.querySelector('#fortune-advice').textContent = fortune[1];
  document.querySelector('#modal-backdrop').hidden = false;
  document.querySelector('#modal-close').focus();
}
function closeFortune() { document.querySelector('#modal-backdrop').hidden = true; }
document.querySelector('#modal-close').addEventListener('click', closeFortune);
document.querySelector('#fortune-again').addEventListener('click', showFortune);
document.querySelector('#modal-backdrop').addEventListener('click', (event) => { if (event.target.id === 'modal-backdrop') closeFortune(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeFortune(); });

let woodfishTimer;
let woodfishOn = false;
let woodfishCount = 0;
function toggleWoodfish(button) {
  woodfishOn = !woodfishOn;
  button.classList.toggle('ritual-active', woodfishOn);
  if (woodfishOn) {
    woodfishTimer = window.setInterval(() => {
      woodfishCount += 1;
      button.querySelector('.ritual-icon').classList.remove('woodfish-tap');
      void button.offsetWidth;
      button.querySelector('.ritual-icon').classList.add('woodfish-tap');
      if (woodfishCount === 1) notify('Nhịp mõ bắt đầu. Cùng tĩnh tâm một chút nhé.');
    }, 900);
  } else {
    window.clearInterval(woodfishTimer);
    notify(`Bạn đã gõ ${woodfishCount} nhịp mõ. 🙏`);
    woodfishCount = 0;
  }
}
function playBell() {
  if (!bellSound) { notify('Chuông đã ngân trong tâm bạn. 🔔'); return; }
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(610, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(218, audio.currentTime + 3.4);
    gain.gain.setValueAtTime(0.16, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 3.5);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 3.5);
    oscillator.addEventListener('ended', () => audio.close());
    document.querySelector('.temple-building').classList.add('bell-ripple');
    window.setTimeout(() => document.querySelector('.temple-building').classList.remove('bell-ripple'), 2600);
  } catch { /* audio is optional on unsupported devices */ }
  notify('Tiếng chuông chùa ngân vang, xin gửi bình an tới muôn nơi. 🔔');
}
document.querySelector('.temple-building').addEventListener('click', templeVisit);
document.querySelectorAll('.ritual-card[data-action]').forEach((button) => button.addEventListener('click', () => {
  switch (button.dataset.action) {
    case 'incense': incenseRitual(); break;
    case 'bow': bowRitual(); break;
    case 'lantern': lanternRitual(); break;
    case 'fortune': showFortune(); break;
    case 'woodfish': toggleWoodfish(button); break;
    case 'bell': playBell(); break;
    default: break;
  }
}));
document.querySelector('#intention-button').addEventListener('click', () => notify('Gửi lời nguyện an lành đến bạn và những người hữu duyên. ☼'));
document.querySelector('#sound-button').addEventListener('click', (event) => {
  bellSound = !bellSound;
  event.currentTarget.querySelector('span').textContent = bellSound ? 'Âm thanh đang bật' : 'Âm thanh đang tắt';
  notify(bellSound ? 'Âm thanh đã bật.' : 'Âm thanh chuông đã tắt.');
});
window.addEventListener('pagehide', () => { if (channel) supabase?.removeChannel(channel); });
