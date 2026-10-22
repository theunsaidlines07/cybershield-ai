import { createIcons, icons } from 'https://cdn.jsdelivr.net/npm/lucide@latest/+esm';
import { SAMPLES, DEMO_MESSAGE, LESSONS, RULES } from './data.js';
import { ruleBasedAnalyze, aiAnalyze } from './analyzer.js';
import { initQuiz } from './quiz.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const refreshIcons = () => createIcons({ icons });

let engine = 'rules';
let busy = false;

// ---------------- Navigation ----------------
const VIEWS = ['home', 'checker', 'learn', 'quiz', 'help', 'privacy'];
function go(view, push = true) {
  if (!VIEWS.includes(view)) view = 'home';
  VIEWS.forEach(v => $(`#view-${v}`).classList.toggle('hidden', v !== view));
  $$('[data-nav]').forEach(b => {
    if (b.matches('.nav-link, .tab, .icon-btn')) b.classList.toggle('active', b.dataset.nav === view);
  });
  if (push && location.hash !== '#' + view) history.pushState(null, '', '#' + view);
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-nav]');
  if (b) { e.preventDefault(); go(b.dataset.nav); }
});
window.addEventListener('popstate', () => go(location.hash.slice(1), false));

// ---------------- Engine selection & auth ----------------
function isSignedIn() {
  try { return !!window.puter?.auth?.isSignedIn(); } catch { return false; }
}
function renderEngine() {
  $$('[data-engine]').forEach(b => {
    const on = b.dataset.engine === engine;
    b.classList.toggle('active', on); b.setAttribute('aria-checked', on);
  });
  $('#ai-panel').classList.toggle('hidden', engine !== 'ai');
  const badge = engine === 'ai'
    ? '<i data-lucide="sparkles"></i>AI analysis'
    : '<i data-lucide="list-checks"></i>Rule-based demo';
  $$('[data-engine-badge]').forEach(el => el.innerHTML = badge);

  const auth = $('#ai-auth');
  if (!window.puter) {
    auth.innerHTML = '<span class="text-amber-300 text-xs">AI service unavailable (could not load). Rule-based mode still works offline.</span>';
  } else if (isSignedIn()) {
    auth.innerHTML = `<span class="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-medium"><i data-lucide="circle-check" class="w-4 h-4"></i>Signed in — AI ready</span>
      <button id="ai-signout" class="btn-ghost btn-sm">Sign out</button>`;
    $('#ai-signout').onclick = () => { try { puter.auth.signOut(); } catch {} renderEngine(); };
  } else {
    auth.innerHTML = '<button id="ai-signin" class="btn-ghost btn-sm"><i data-lucide="log-in"></i>Sign in to use AI</button><span class="text-xs text-slate-500">Free account · no payment needed</span>';
    $('#ai-signin').onclick = async () => {
      try { await puter.auth.signIn(); } catch { /* user closed popup */ }
      renderEngine();
    };
  }
  refreshIcons();
}
$$('[data-engine]').forEach(b => b.onclick = () => { engine = b.dataset.engine; renderEngine(); });

// ---------------- Checker ----------------
const input = $('#checker-input');
function updateCount() { $('#char-count').textContent = `${input.value.length} / 4000`; }
input.addEventListener('input', () => { updateCount(); showError(false); });

function showError(on, msg) {
  const el = $('#checker-error');
  el.classList.toggle('hidden', !on);
  if (msg) el.lastChild.textContent = msg;
  input.classList.toggle('invalid', on);
}

function renderSamples() {
  $('#samples').innerHTML = SAMPLES.map((s, i) =>
    `<button class="sample" data-sample="${i}"><i data-lucide="${s.icon}"></i><span>${esc(s.label)}</span></button>`).join('');
  $$('[data-sample]').forEach(b => b.onclick = () => {
    input.value = SAMPLES[+b.dataset.sample].text; updateCount(); showError(false);
    runCheck();
  });
}

function renderLoading() {
  $('#result-area').innerHTML = `
    <div class="panel p-8 text-center">
      <div class="scan-ring busy mx-auto"><i data-lucide="${engine === 'ai' ? 'sparkles' : 'scan-line'}"></i></div>
      <h3 class="mt-5 text-lg font-semibold text-white">${engine === 'ai' ? 'AI is reading the message…' : 'Checking for warning-sign patterns…'}</h3>
      <p class="mt-1.5 text-sm text-slate-400">Links are never opened during analysis.</p>
    </div>`;
  refreshIcons();
}

function renderError(msg) {
  $('#result-area').innerHTML = `
    <div class="panel p-6">
      <div class="flex gap-3">
        <span class="sign-icon"><i data-lucide="cloud-off"></i></span>
        <div>
          <h3 class="font-semibold text-white">AI analysis couldn't be completed</h3>
          <p class="mt-1 text-sm text-slate-400">${esc(msg)}</p>
          <button id="fallback-rules" class="btn-ghost btn-sm mt-4"><i data-lucide="list-checks"></i>Use rule-based checker instead</button>
        </div>
      </div>
    </div>`;
  $('#fallback-rules').onclick = () => { engine = 'rules'; renderEngine(); runCheck(); };
  refreshIcons();
}

const INDICATOR = {
  High: { text: 'Potential warning signs found', icon: 'shield-alert', bars: 3, explain: 'Several warning signs commonly seen in scams appear in this message.' },
  Medium: { text: 'Some warning signs', icon: 'shield-alert', bars: 2, explain: 'Some patterns deserve caution. Verify before you act.' },
  Low: { text: 'No obvious warning signs found', icon: 'shield-check', bars: 1, explain: 'No strong scam patterns were detected — but that is not proof the message is safe.' }
};

function renderResult(r) {
  const ind = INDICATOR[r.risk];
  const engineLabel = r.engine === 'ai'
    ? '<i data-lucide="sparkles"></i>AI analysis · via Puter'
    : '<i data-lucide="list-checks"></i>Rule-based demo · not AI';

  const signsHtml = r.signs.length ? r.signs.map(s => `
    <div class="sign">
      <span class="sign-icon"><i data-lucide="${s.icon || 'triangle-alert'}"></i></span>
      <div class="min-w-0 flex-1">
        <div class="font-semibold text-white text-[15px]">${esc(s.title)}</div>
        <p class="mt-0.5 text-sm text-slate-400 leading-relaxed">${esc(s.explanation)}</p>
        ${s.matched?.length ? `<div>${s.matched.map(m => `<span class="tag">${esc(m)}</span>`).join('')}</div>` : ''}
        ${s.evidence && !s.urls ? `<div class="quote">“${esc(s.evidence)}”</div>` : ''}
      </div>
    </div>`).join('') : `<p class="text-sm text-slate-400">No specific warning signs were matched in this text.</p>`;

  const urlHtml = r.urls.length ? `
    <div class="r-section">
      <div class="r-title"><i data-lucide="link"></i>Link text inspection</div>
      ${r.urls.map(u => `
        <div class="url-row">
          <div class="flex items-center gap-2 font-mono text-sm text-slate-200 break-all"><i data-lucide="link-2-off" class="w-4 h-4 text-slate-500 shrink-0"></i>${esc(u.url)}</div>
          ${u.issues.length ? `<ul class="mt-2 space-y-1">${u.issues.map(x => `<li class="text-xs text-amber-200/90 flex gap-1.5"><i data-lucide="triangle-alert" class="w-3.5 h-3.5 shrink-0 mt-0.5"></i>${esc(x)}</li>`).join('')}</ul>`
            : '<p class="mt-1.5 text-xs text-slate-500">No obvious warning features in the visible text.</p>'}
        </div>`).join('')}
      <p class="mt-3 text-xs text-slate-500 flex gap-1.5"><i data-lucide="info" class="w-3.5 h-3.5 shrink-0 mt-0.5"></i>CyberShield only inspects the visible link text. It did not open the link and cannot confirm whether the website is malicious or safe.</p>
    </div>` : '';

  $('#result-area').innerHTML = `
    <div class="panel overflow-hidden risk-${r.risk}" style="animation: fadeUp .35s ease both">
      <div class="risk-head">
        <div class="flex items-center justify-between gap-2 mb-4">
          <span class="engine-badge">${engineLabel}</span>
          <span class="risk-pill">${r.risk} risk</span>
        </div>
        <div class="flex items-start gap-4">
          <span class="risk-icon"><i data-lucide="${ind.icon}"></i></span>
          <div class="min-w-0">
            <h2 class="text-xl sm:text-2xl font-extrabold text-white leading-tight">${ind.text}</h2>
            <p class="mt-1 text-sm text-slate-400">${ind.explain}</p>
          </div>
        </div>
        <div class="mt-5">
          <div class="flex justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5"><span>Low</span><span>Medium</span><span>High</span></div>
          <div class="meter">${[1, 2, 3].map(n => `<span class="${n <= ind.bars ? 'on' : ''}"></span>`).join('')}</div>
        </div>
        <p class="mt-4 text-[15px] text-slate-300 leading-relaxed">${esc(r.summary)}</p>
      </div>

      <div class="r-section">
        <div class="r-title"><i data-lucide="triangle-alert"></i>Warning signs (${r.signs.length})</div>
        ${signsHtml}
      </div>
      ${urlHtml}
      <div class="r-section">
        <div class="r-title"><i data-lucide="footprints"></i>Recommended safe next steps</div>
        ${r.steps.map(s => `<div class="step"><i data-lucide="circle-check"></i><span>${esc(s)}</span></div>`).join('')}
      </div>
      <div class="r-section bg-ink-950/50">
        <p class="text-xs text-slate-400 flex gap-2 leading-relaxed"><i data-lucide="scale" class="w-4 h-4 shrink-0 text-amber-400"></i>
        <span><b class="text-slate-300">This result is not proof of fraud or proof of safety.</b> ${r.engine === 'ai' ? 'AI can make mistakes.' : 'This rule-based checker only looks for common text patterns.'} It cannot verify who sent the message. When unsure, contact the organisation through an official channel.</span></p>
        <div class="mt-4 flex flex-wrap gap-2">
          <button id="analyze-another" class="btn-ghost btn-sm"><i data-lucide="rotate-ccw"></i>Analyse another message</button>
          <button class="btn-ghost btn-sm" data-nav="help"><i data-lucide="life-buoy"></i>I already responded — get help</button>
        </div>
      </div>
    </div>`;
  $('#analyze-another').onclick = clearChecker;
  refreshIcons();
  if (window.innerWidth < 1024) $('#result-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function runCheck() {
  if (busy) return;
  const text = input.value.trim();
  if (!text) { showError(true, 'Please paste or type a message to analyse.'); input.focus(); return; }
  if (text.length < 8) { showError(true, 'That message is very short. Please paste the full message for a useful check.'); return; }

  if (engine === 'ai' && !isSignedIn()) {
    if (!window.puter) { renderError('The AI service could not be loaded. Please check the internet connection.'); return; }
    try { await puter.auth.signIn(); } catch {}
    renderEngine();
    if (!isSignedIn()) { renderError('Sign-in is needed for AI analysis. You can use the rule-based checker without signing in.'); return; }
  }

  busy = true;
  const btn = $('#checker-run');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Analysing…';
  renderLoading();
  try {
    let result;
    if (engine === 'ai') {
      result = await aiAnalyze(text);
    } else {
      await new Promise(r => setTimeout(r, 650)); // brief pause so visitors see the scan state
      result = ruleBasedAnalyze(text);
    }
    renderResult(result);
  } catch (err) {
    renderError(err?.message || 'Something went wrong. Please try again.');
  } finally {
    busy = false; btn.disabled = false;
    btn.innerHTML = '<i data-lucide="search-check"></i>Check for Scam Signs';
    refreshIcons();
  }
}

function clearChecker() {
  input.value = ''; updateCount(); showError(false);
  $('#result-area').innerHTML = `
    <div class="panel p-8 text-center">
      <div class="scan-ring mx-auto"><i data-lucide="shield"></i></div>
      <h3 class="mt-5 text-lg font-semibold text-white">Ready to analyse</h3>
      <p class="mt-1.5 text-sm text-slate-400 max-w-sm mx-auto">Paste a message or pick a sample. Results will show the risk level, warning signs and safe next steps.</p>
    </div>`;
  refreshIcons();
  input.focus();
}

$('#checker-run').onclick = runCheck;
$('#checker-clear').onclick = clearChecker;
$('#checker-demo').onclick = () => { input.value = DEMO_MESSAGE; updateCount(); showError(false); input.focus(); };

// Home quick check
const homeInput = $('#home-input');
$('#home-demo').onclick = () => { homeInput.value = DEMO_MESSAGE; $('#home-error').classList.add('hidden'); homeInput.classList.remove('invalid'); };
homeInput.addEventListener('input', () => { $('#home-error').classList.add('hidden'); homeInput.classList.remove('invalid'); });
$('#home-check').onclick = () => {
  const t = homeInput.value.trim();
  if (!t) { $('#home-error').classList.remove('hidden'); homeInput.classList.add('invalid'); homeInput.focus(); return; }
  input.value = homeInput.value; updateCount();
  homeInput.value = '';
  go('checker');
  runCheck();
};

// ---------------- Learn ----------------
function renderLearn() {
  $('#rules').innerHTML = RULES.map(r => `<div class="rule"><span class="rule-icon"><i data-lucide="${r.icon}"></i></span><span>${esc(r.text)}</span></div>`).join('');
  $('#lessons').innerHTML = LESSONS.map(l => `
    <article class="lesson lc-${l.color}">
      <button class="lesson-head" aria-expanded="false">
        <span class="lesson-icon"><i data-lucide="${l.icon}"></i></span>
        <span class="flex-1 min-w-0">
          <span class="block font-bold text-white text-[16px] leading-snug">${esc(l.title)}</span>
          <span class="block mt-1 text-sm text-slate-400 leading-relaxed">${esc(l.definition)}</span>
        </span>
        <i data-lucide="chevron-down" class="lesson-chev"></i>
      </button>
      <div class="lesson-body"><div>
        <div class="px-[18px] pb-5 space-y-4">
          <div>
            <div class="l-label text-slate-400"><i data-lucide="message-square-quote"></i>Example (fictional)</div>
            <div class="example-box">${esc(l.example)}</div>
          </div>
          <div>
            <div class="l-label text-amber-300"><i data-lucide="triangle-alert"></i>Warning signs</div>
            <ul class="l-list l-warn">${l.signs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
          </div>
          <div>
            <div class="l-label text-emerald-300"><i data-lucide="shield-check"></i>How to stay safe</div>
            <ul class="l-list l-prev">${l.prevention.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
          </div>
        </div>
      </div></div>
    </article>`).join('');
  $$('.lesson-head').forEach(h => h.onclick = () => {
    const card = h.parentElement; const open = !card.classList.contains('open');
    card.classList.toggle('open', open); h.setAttribute('aria-expanded', open);
  });
}

// ---------------- Help ----------------
const HELP_STEPS = [
  ['Stop communicating', 'Stop replying to the suspected scammer. Block the number or account and don’t answer further calls.', 'message-circle-off'],
  ['Don’t send more money or information', 'Do not send more money or share any more OTPs, PINs, passwords or personal details — even if they threaten or promise a refund.', 'hand'],
  ['Contact your bank or payment provider', 'Call your bank or payment app using official contact details (from the back of your card, the official app, or official website). Ask them to block cards or transactions.', 'landmark'],
  ['Secure your accounts', 'From a trusted device, change compromised passwords, sign out of other sessions and turn on two-factor authentication. Uninstall any remote-access app you were asked to install.', 'lock-keyhole'],
  ['Preserve evidence', 'Keep screenshots of messages, phone numbers, usernames, links (as text — don’t open them), transaction IDs/UTR numbers, dates and amounts.', 'folder-lock'],
  ['Report through official channels', 'Report the incident to official authorities. In India, use the national helpline or reporting portal shown on this page.', 'flag']
];
const EVIDENCE = ['Screenshots of the messages or chats', 'Sender’s phone number, email or profile name', 'Transaction ID / UTR / reference number', 'Date, time and amount of each payment', 'Links or UPI IDs used (copied as text)', 'Bank statement showing the transaction'];

function renderHelp() {
  $('#help-steps').innerHTML = HELP_STEPS.map(([t, d, ic], i) => `
    <li class="help-step">
      <span class="help-num">${i + 1}</span>
      <div class="min-w-0">
        <div class="flex items-center gap-2 font-semibold text-white"><i data-lucide="${ic}" class="w-4 h-4 text-slate-400"></i>${t}</div>
        <p class="mt-1 text-sm text-slate-400 leading-relaxed">${d}</p>
      </div>
    </li>`).join('');
  $('#evidence').innerHTML = EVIDENCE.map(e => `<button class="check-row" aria-pressed="false"><span class="check-box"><i data-lucide="check"></i></span><span>${esc(e)}</span></button>`).join('');
  $$('.check-row').forEach(b => b.onclick = () => { const on = b.classList.toggle('on'); b.setAttribute('aria-pressed', on); });
}

// ---------------- Init ----------------
renderSamples();
renderLearn();
renderHelp();
initQuiz($('#quiz-root'), refreshIcons);
renderEngine();
updateCount();
go(location.hash.slice(1) || 'home', false);
refreshIcons();
