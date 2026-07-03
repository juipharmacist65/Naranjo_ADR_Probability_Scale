const questions = window.NARANJO_QUESTIONS || [];
const STORAGE_KEY = 'naranjoAdrAssessment.v2';
let latestReport = null;

function getLevel(score) {
  if (score >= 9) return { key: 'definite', label: 'Definite (แน่นอน)', range: '≥ 9', desc: 'มีหลักฐานชัดเจนว่าอาการไม่พึงประสงค์เกิดจากยา' };
  if (score >= 5) return { key: 'probable', label: 'Probable (น่าจะใช่)', range: '5–8', desc: 'มีหลักฐานสนับสนุนอย่างดีว่าอาการไม่พึงประสงค์น่าจะเกิดจากยา' };
  if (score >= 1) return { key: 'possible', label: 'Possible (อาจจะใช่)', range: '1–4', desc: 'มีหลักฐานพอประมาณว่าอาการไม่พึงประสงค์อาจเกิดจากยา แต่ยังมีสาเหตุอื่นที่อาจเป็นไปได้' };
  return { key: 'doubtful', label: 'Doubtful (น่าสงสัย/ไม่น่าใช่)', range: '≤ 0', desc: 'มีหลักฐานไม่เพียงพอหรือมีข้อมูลขัดแย้งว่าอาการไม่พึงประสงค์เกิดจากยา' };
}

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function scoreText(score) {
  return score >= 0 ? `+${score}` : `${score}`;
}

function renderQuestions() {
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';

  questions.forEach((q) => {
    const card = makeEl('fieldset', 'card');
    card.dataset.qid = q.id;

    const legend = makeEl('legend', 'card-title');
    const num = makeEl('span', 'q-num', String(q.id));
    const text = makeEl('span', '', q.text);
    const toggle = makeEl('button', 'criteria-toggle', '📄 ซ่อนเกณฑ์');
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', `criteria-${q.id}`);
    toggle.setAttribute('aria-expanded', 'true');
    legend.append(num, text, toggle);
    card.appendChild(legend);

    const critBox = makeEl('div', 'criteria-box');
    critBox.id = `criteria-${q.id}`;
    Object.entries(q.criteria).forEach(([value, desc]) => {
      const item = makeEl('div', 'c-item');
      const option = q.options.find(o => o.value === value);
      item.append(makeEl('span', 'c-label', option?.label || value), makeEl('span', '', desc));
      critBox.appendChild(item);
    });
    card.appendChild(critBox);

    const optDiv = makeEl('div', 'options');
    q.options.forEach((opt) => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `q${q.id}`;
      radio.value = opt.value;
      radio.dataset.score = String(opt.score);
      radio.dataset.answerLabel = opt.label;
      radio.required = true;
      label.append(radio, document.createTextNode(opt.label), makeEl('span', 'score-hint', scoreText(opt.score)));
      optDiv.appendChild(label);
    });
    card.appendChild(optDiv);
    container.appendChild(card);

    toggle.addEventListener('click', () => {
      const isClosed = critBox.classList.toggle('closed');
      toggle.textContent = isClosed ? '📄 เกณฑ์' : '📄 ซ่อนเกณฑ์';
      toggle.setAttribute('aria-expanded', String(!isClosed));
    });
  });
}

function getCaseInfo() {
  return {
    suspectedDrug: document.getElementById('suspectedDrug').value.trim(),
    adverseReaction: document.getElementById('adverseReaction').value.trim(),
    drugStartDate: document.getElementById('drugStartDate').value,
    reactionStartDate: document.getElementById('reactionStartDate').value,
    drugStopDate: document.getElementById('drugStopDate').value,
    assessor: document.getElementById('assessor').value.trim(),
    clinicalNote: document.getElementById('clinicalNote').value.trim(),
    assessedAt: new Date().toLocaleString('th-TH')
  };
}

function collectAnswers() {
  const checked = [...document.querySelectorAll('#naranjoForm input[type="radio"]:checked')];
  const answered = new Set(checked.map(r => r.name));
  if (answered.size < questions.length) {
    const missing = questions.filter(q => !answered.has(`q${q.id}`)).map(q => q.id);
    alert(`กรุณาเลือกคำตอบสำหรับข้อที่ ${missing.join(', ')}`);
    return null;
  }

  const details = checked
    .map((r) => {
      const qid = Number(r.name.replace('q', ''));
      const q = questions.find(item => item.id === qid);
      const score = Number(r.dataset.score);
      const answer = r.dataset.answerLabel;
      return {
        qid,
        question: q.text,
        answer,
        value: r.value,
        score,
        criteria: q.criteria[r.value] || ''
      };
    })
    .sort((a, b) => a.qid - b.qid);

  const total = details.reduce((sum, item) => sum + item.score, 0);
  return { details, total, level: getLevel(total), caseInfo: getCaseInfo() };
}

function renderList(title, items, emptyText) {
  const section = makeEl('div');
  section.appendChild(makeEl('h3', '', title));
  if (!items.length) {
    section.appendChild(makeEl('p', '', emptyText));
    return section;
  }
  const ul = document.createElement('ul');
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `ข้อ ${item.qid}: ${item.answer} (${scoreText(item.score)}) — ${item.criteria}`;
    ul.appendChild(li);
  });
  section.appendChild(ul);
  return section;
}

function renderResult(report) {
  latestReport = report;
  document.getElementById('scoreDisplay').textContent = report.total;
  const levelEl = document.getElementById('levelDisplay');
  levelEl.textContent = report.level.label;
  levelEl.className = `result-level ${report.level.key}`;

  const interp = document.getElementById('resultInterp');
  interp.textContent = `${report.level.label} — ${report.level.desc} | คะแนนรวม ${report.total} คะแนน (${report.level.range}: ${report.level.label})`;

  const supporting = report.details.filter(d => d.score > 0);
  const reducing = report.details.filter(d => d.score < 0);
  const unknowns = report.details.filter(d => d.value === 'unknown');

  const summary = document.getElementById('naranjoSummary');
  summary.innerHTML = '';
  summary.appendChild(makeEl('h3', '', 'สรุป Naranjo'));
  summary.appendChild(makeEl('p', '', `คะแนนรวม ${report.total} คะแนน จัดอยู่ในระดับ ${report.level.label} โดยมีปัจจัยสนับสนุน ${supporting.length} ข้อ ปัจจัยที่ลดความเป็นไปได้ ${reducing.length} ข้อ และข้อมูลที่ยังไม่ทราบ ${unknowns.length} ข้อ`));
  summary.appendChild(renderList('ปัจจัยที่สนับสนุนความสัมพันธ์กับยา', supporting, 'ไม่พบปัจจัยที่ให้คะแนนบวก'));
  summary.appendChild(renderList('ปัจจัยที่ลดความเป็นไปได้', reducing, 'ไม่พบปัจจัยที่ให้คะแนนลบ'));
  summary.appendChild(renderList('ข้อมูลที่ยังไม่ทราบ/ควรติดตามเพิ่มเติม', unknowns, 'ไม่มีข้อที่ตอบไม่ทราบ'));

  const caseSummary = document.getElementById('caseSummary');
  caseSummary.innerHTML = '';
  caseSummary.appendChild(makeEl('h3', '', 'ข้อมูลประกอบรายงาน'));
  const ci = report.caseInfo;
  const caseLines = [
    ['ยาที่สงสัย', ci.suspectedDrug],
    ['อาการไม่พึงประสงค์', ci.adverseReaction],
    ['วันที่เริ่มยา', ci.drugStartDate],
    ['วันที่เริ่มเกิดอาการ', ci.reactionStartDate],
    ['วันที่หยุดยา/Dechallenge', ci.drugStopDate],
    ['ผู้ประเมิน', ci.assessor],
    ['วันที่ประเมิน', ci.assessedAt],
    ['หมายเหตุ', ci.clinicalNote]
  ].filter(([, value]) => value);
  if (caseLines.length === 0) {
    caseSummary.appendChild(makeEl('p', '', 'ไม่ได้ระบุข้อมูลประกอบเพิ่มเติม'));
  } else {
    const ul = document.createElement('ul');
    caseLines.forEach(([key, value]) => {
      const li = document.createElement('li');
      li.textContent = `${key}: ${value}`;
      ul.appendChild(li);
    });
    caseSummary.appendChild(ul);
  }

  const detail = document.getElementById('resultDetail');
  detail.innerHTML = '';
  const header = makeEl('div', 'detail-row');
  header.append(makeEl('div', '', 'คำถาม'), makeEl('div', '', 'คำตอบ/คะแนน'), makeEl('div', '', 'เกณฑ์ที่ใช้สรุป'));
  detail.appendChild(header);
  report.details.forEach((d) => {
    const row = makeEl('div', 'detail-row');
    row.append(
      makeEl('div', '', `ข้อ ${d.qid}: ${d.question}`),
      makeEl('div', 'detail-answer', `${d.answer} (${scoreText(d.score)})`),
      makeEl('div', '', d.criteria)
    );
    detail.appendChild(row);
  });

  document.getElementById('result').classList.add('visible');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generatePlainSummary(report) {
  const supporting = report.details.filter(d => d.score > 0);
  const reducing = report.details.filter(d => d.score < 0);
  const unknowns = report.details.filter(d => d.value === 'unknown');
  const ci = report.caseInfo;
  const lines = [
    'สรุป Naranjo',
    `คะแนนรวม: ${report.total} คะแนน`,
    `ระดับ: ${report.level.label}`,
    `การแปลผล: ${report.level.desc}`,
    '',
    ci.suspectedDrug ? `ยาที่สงสัย: ${ci.suspectedDrug}` : '',
    ci.adverseReaction ? `อาการไม่พึงประสงค์: ${ci.adverseReaction}` : '',
    ci.drugStartDate ? `วันที่เริ่มยา: ${ci.drugStartDate}` : '',
    ci.reactionStartDate ? `วันที่เริ่มเกิดอาการ: ${ci.reactionStartDate}` : '',
    ci.drugStopDate ? `วันที่หยุดยา/Dechallenge: ${ci.drugStopDate}` : '',
    ci.assessor ? `ผู้ประเมิน: ${ci.assessor}` : '',
    `วันที่ประเมิน: ${ci.assessedAt}`,
    ci.clinicalNote ? `หมายเหตุ: ${ci.clinicalNote}` : '',
    '',
    `ปัจจัยสนับสนุน (${supporting.length} ข้อ):`,
    ...(supporting.length ? supporting.map(d => `- ข้อ ${d.qid}: ${d.answer} (${scoreText(d.score)}) — ${d.criteria}`) : ['- ไม่มี']),
    '',
    `ปัจจัยที่ลดความเป็นไปได้ (${reducing.length} ข้อ):`,
    ...(reducing.length ? reducing.map(d => `- ข้อ ${d.qid}: ${d.answer} (${scoreText(d.score)}) — ${d.criteria}`) : ['- ไม่มี']),
    '',
    `ข้อมูลที่ยังไม่ทราบ/ควรติดตาม (${unknowns.length} ข้อ):`,
    ...(unknowns.length ? unknowns.map(d => `- ข้อ ${d.qid}: ${d.question} — ${d.criteria}`) : ['- ไม่มี']),
    '',
    'รายละเอียดรายข้อ:',
    ...report.details.map(d => `ข้อ ${d.qid}: ${d.question} | ตอบ ${d.answer} (${scoreText(d.score)}) | เกณฑ์: ${d.criteria}`)
  ];
  return lines.filter(line => line !== '').join('\n');
}

function saveDraft() {
  const data = { caseInfo: getCaseInfo(), answers: {} };
  document.querySelectorAll('#naranjoForm input[type="radio"]:checked').forEach(r => {
    data.answers[r.name] = r.value;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function restoreDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.caseInfo) {
      Object.entries(data.caseInfo).forEach(([key, value]) => {
        const el = document.querySelector(`[name="${key}"]`);
        if (el && key !== 'assessedAt') el.value = value || '';
      });
    }
    if (data.answers) {
      Object.entries(data.answers).forEach(([name, value]) => {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) radio.checked = true;
      });
    }
  } catch (error) {
    console.warn('Cannot restore Naranjo draft', error);
  }
}

function clearPersistedForm() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

function resetAll() {
  const form = document.getElementById('naranjoForm');
  form.reset();
  clearPersistedForm();
  latestReport = null;
  document.getElementById('result').classList.remove('visible');
  document.getElementById('scoreDisplay').textContent = '0';
  document.getElementById('levelDisplay').textContent = '—';
  document.getElementById('resultInterp').textContent = '';
  document.getElementById('naranjoSummary').innerHTML = '';
  document.getElementById('caseSummary').innerHTML = '';
  document.getElementById('resultDetail').innerHTML = '';
  document.querySelectorAll('.criteria-box').forEach(box => box.classList.remove('closed'));
  document.querySelectorAll('.criteria-toggle').forEach(btn => {
    btn.textContent = '📄 ซ่อนเกณฑ์';
    btn.setAttribute('aria-expanded', 'true');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function downloadJson(report) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `naranjo-assessment-${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  const form = document.getElementById('naranjoForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const report = collectAnswers();
    if (!report) return;
    saveDraft();
    renderResult(report);
  });
  form.addEventListener('reset', (event) => {
    event.preventDefault();
    resetAll();
  });
  form.addEventListener('change', saveDraft);
  form.addEventListener('input', saveDraft);

  document.getElementById('copySummaryBtn').addEventListener('click', async () => {
    if (!latestReport) return;
    const text = generatePlainSummary(latestReport);
    try {
      await navigator.clipboard.writeText(text);
      alert('คัดลอกสรุป Naranjo แล้ว');
    } catch {
      alert('ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาเลือกข้อความในผลลัพธ์แล้วคัดลอกด้วยตนเอง');
    }
  });
  document.getElementById('printBtn').addEventListener('click', () => window.print());
  document.getElementById('downloadJsonBtn').addEventListener('click', () => {
    if (latestReport) downloadJson(latestReport);
  });
  document.getElementById('editBtn').addEventListener('click', () => {
    document.getElementById('naranjoForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('newAssessmentBtn').addEventListener('click', resetAll);
}

renderQuestions();
restoreDraft();
bindEvents();
console.log('Naranjo Scale ready. Reset clears form and saved local draft.');
