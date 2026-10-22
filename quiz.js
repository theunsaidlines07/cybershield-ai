import { QUIZ } from './data.js';

const CHOICES = [
  { id: 'suspicious', label: 'Suspicious', icon: 'shield-alert' },
  { id: 'legit', label: 'Probably legitimate', icon: 'shield-check' },
  { id: 'unsure', label: 'Not enough information', icon: 'circle-help' }
];
const LABEL = Object.fromEntries(CHOICES.map(c => [c.id, c.label]));
const POINTS = 10;

let state = { i: 0, score: 0, answers: [], picked: null };
let root, refreshIcons;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function initQuiz(el, iconFn) {
  root = el; refreshIcons = iconFn;
  renderIntro();
}

function renderIntro() {
  root.innerHTML = `
    <div class="panel panel-glow p-6 sm:p-10 text-center">
      <div class="scan-ring mx-auto"><i data-lucide="target"></i></div>
      <h2 class="mt-6 text-2xl sm:text-3xl font-extrabold text-white">Scam Challenge</h2>
      <p class="mt-3 text-slate-400 max-w-md mx-auto">You'll see ${QUIZ.length} fictional messages. Decide if each one is suspicious, probably legitimate, or if there isn't enough information. Every answer comes with an explanation.</p>
      <div class="mt-6 flex flex-wrap justify-center gap-2 text-xs font-mono text-slate-400">
        <span class="engine-badge"><i data-lucide="list"></i>${QUIZ.length} rounds</span>
        <span class="engine-badge"><i data-lucide="star"></i>${POINTS} pts each</span>
        <span class="engine-badge"><i data-lucide="clock"></i>~3 minutes</span>
      </div>
      <button id="quiz-start" class="btn-primary mt-8 px-8"><i data-lucide="play"></i>Start Challenge</button>
    </div>`;
  root.querySelector('#quiz-start').onclick = start;
  refreshIcons();
}

function start() {
  state = { i: 0, score: 0, answers: [], picked: null };
  renderQuestion();
}

function renderQuestion() {
  const q = QUIZ[state.i];
  const pct = (state.i / QUIZ.length) * 100;
  root.innerHTML = `
    <div class="flex items-center justify-between text-sm mb-2">
      <span class="font-mono text-slate-400">Round <b class="text-white">${state.i + 1}</b> / ${QUIZ.length}</span>
      <span class="font-mono text-slate-400">Score <b class="text-cy-400">${state.score}</b></span>
    </div>
    <div class="q-progress mb-6"><span style="width:${pct}%"></span></div>

    <div class="panel p-4 sm:p-6">
      <div class="msg-card">
        <div class="msg-top">
          <span class="msg-avatar"><i data-lucide="${q.icon}"></i></span>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white truncate">${esc(q.from)}</div>
            <div class="text-[11px] font-mono uppercase tracking-wider text-slate-500">${esc(q.channel)} · fictional</div>
          </div>
        </div>
        <div class="msg-bubble">${esc(q.message)}</div>
      </div>

      <p class="mt-6 mb-3 font-semibold text-white">What do you think?</p>
      <div class="grid gap-2.5" id="choices">
        ${CHOICES.map(c => `<button class="choice" data-choice="${c.id}"><span class="choice-icon"><i data-lucide="${c.icon}"></i></span><span class="flex-1">${c.label}</span><span class="choice-mark"></span></button>`).join('')}
      </div>
      <div id="feedback"></div>
    </div>`;
  root.querySelectorAll('[data-choice]').forEach(b => b.onclick = () => answer(b.dataset.choice));
  refreshIcons();
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function answer(choice) {
  if (state.picked) return;
  const q = QUIZ[state.i];
  const correct = choice === q.answer;
  state.picked = choice;
  if (correct) state.score += POINTS;
  state.answers.push({ correct });

  root.querySelectorAll('[data-choice]').forEach(b => {
    b.disabled = true;
    const id = b.dataset.choice;
    if (id === q.answer) { b.classList.add('correct'); b.querySelector('.choice-mark').innerHTML = '<i data-lucide="check"></i>'; }
    else if (id === choice) { b.classList.add('wrong'); b.querySelector('.choice-mark').innerHTML = '<i data-lucide="lightbulb"></i>'; }
    else b.classList.add('dim');
  });

  const last = state.i === QUIZ.length - 1;
  const encouragement = ['Great spotting!', 'Nicely done!', 'Sharp eyes!', 'Correct — well reasoned!'];
  root.querySelector('#feedback').innerHTML = `
    <div class="feedback ${correct ? 'good' : 'learn'} mt-5">
      <div class="flex items-center gap-2 font-bold ${correct ? 'text-emerald-300' : 'text-blue-300'}">
        <i data-lucide="${correct ? 'party-popper' : 'lightbulb'}"></i>
        ${correct ? `${encouragement[state.i % encouragement.length]} +${POINTS} points` : `Good try — the best answer is “${LABEL[q.answer]}”.`}
      </div>
      <p class="mt-2 text-slate-300 text-[15px] leading-relaxed">${esc(q.explanation)}</p>
      <div class="mt-3 text-xs font-mono uppercase tracking-wider text-slate-500">What to look for</div>
      <div class="mt-1">${q.signs.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>
      <button id="quiz-next" class="btn-primary mt-5 w-full sm:w-auto">${last ? '<i data-lucide="flag"></i>See my results' : 'Next message<i data-lucide="arrow-right"></i>'}</button>
    </div>`;
  root.querySelector('#quiz-next').onclick = () => {
    state.picked = null;
    if (last) renderResults(); else { state.i++; renderQuestion(); }
  };
  refreshIcons();
  root.querySelector('#feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderResults() {
  const max = QUIZ.length * POINTS;
  const right = state.answers.filter(a => a.correct).length;
  const pct = Math.round((state.score / max) * 100);
  let title, msg, color;
  if (pct >= 90) { title = 'Scam-Spotting Expert'; msg = 'Outstanding! You recognise warning signs like a pro. Share what you know with friends and family.'; color = '#34d399'; }
  else if (pct >= 70) { title = 'Cyber Defender'; msg = 'Great job! You caught most of the tricks. Review the explanations to sharpen your skills even more.'; color = '#22d3ee'; }
  else if (pct >= 40) { title = 'Alert Learner'; msg = 'Good effort! Scammers are clever — and now you know more of their tricks. The Learn & Prevent section can help.'; color = '#60a5fa'; }
  else { title = 'Getting Started'; msg = 'Everyone starts somewhere! These tricks fool many adults too. Explore Learn & Prevent and try again — you’ll improve quickly.'; color = '#fbbf24'; }
  const C = 2 * Math.PI * 62;
  root.innerHTML = `
    <div class="panel panel-glow p-6 sm:p-10 text-center">
      <svg class="score-ring mx-auto" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r="62" fill="none" stroke="#16233d" stroke-width="10"/>
        <circle cx="75" cy="75" r="62" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"
          stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 75 75)" id="ring" style="transition: stroke-dashoffset 1s ease"/>
        <text x="75" y="72" text-anchor="middle" fill="#fff" font-size="32" font-weight="800" font-family="Inter">${state.score}</text>
        <text x="75" y="96" text-anchor="middle" fill="#64748b" font-size="13" font-family="JetBrains Mono">of ${max} pts</text>
      </svg>
      <div class="mt-5 chip" style="color:${color};border-color:${color}55">${title}</div>
      <h2 class="mt-4 text-2xl font-extrabold text-white">You got ${right} of ${QUIZ.length} right</h2>
      <p class="mt-3 text-slate-400 max-w-md mx-auto">${msg}</p>
      <div class="mt-6 flex justify-center gap-1.5 flex-wrap">
        ${state.answers.map((a, i) => `<span class="w-8 h-8 rounded-lg grid place-items-center text-xs font-mono font-bold ${a.correct ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/30' : 'bg-blue-400/10 text-blue-300 border border-blue-400/30'}">${i + 1}</span>`).join('')}
      </div>
      <div class="mt-8 flex flex-wrap justify-center gap-2.5">
        <button id="quiz-restart" class="btn-primary"><i data-lucide="rotate-ccw"></i>Play Again</button>
        <button class="btn-ghost" data-nav="learn"><i data-lucide="book-open"></i>Learn &amp; Prevent</button>
      </div>
    </div>`;
  root.querySelector('#quiz-restart').onclick = start;
  refreshIcons();
  requestAnimationFrame(() => setTimeout(() => {
    const r = root.querySelector('#ring'); if (r) r.style.strokeDashoffset = C * (1 - pct / 100);
  }, 50));
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
