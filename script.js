/* Defaults */
const DEFAULT_TEXTAREA_FONT = 14;   // start smaller by default
let currentTextareaFont = DEFAULT_TEXTAREA_FONT;

// For Undo stack
const collectorStateStack = [];

/* Init */
window.addEventListener('DOMContentLoaded', () => {
  // Apply default font size
  applyTextareaFont(DEFAULT_TEXTAREA_FONT);

  // Font slider
  const slider = document.getElementById('fontSlider');
  const thumb  = document.getElementById('sliderThumb');

  const positionThumb = () => {
    const min = Number(slider.min);
    const max = Number(slider.max);
    const val = Number(slider.value);
    const pct = (val - min) / (max - min); // 0..1

    const railWidth = slider.clientWidth;
    const x = pct * railWidth;

    thumb.style.left = `${x}px`;
    thumb.textContent = `${val}`; // just number
  };

  const applySlider = (val) => {
    const size = Math.max(12, Math.min(28, Number(val) || DEFAULT_TEXTAREA_FONT));
    currentTextareaFont = size;
    applyTextareaFont(size);
    positionThumb();
  };

  slider.addEventListener('input', e => applySlider(e.target.value));
  window.addEventListener('resize', positionThumb);
  applySlider(slider.value); // initial

  // History toggle
  const historyPanel = document.getElementById('historyPanel');
  const toggleBtn = document.getElementById('historyToggle');
  const closeBtn  = document.getElementById('closeHistoryBtn');

  const toggleHistory = () => {
    const isOpen = historyPanel.classList.toggle('open');
    historyPanel.setAttribute('aria-hidden', String(!isOpen));
  };

  toggleBtn.addEventListener('click', toggleHistory);
  closeBtn.addEventListener('click', toggleHistory);
});

/* -------- Core features -------- */
function formatText() {
  let inputText = document.getElementById('inputText').value;

  // Treat unknown/special characters � as new lines
  inputText = inputText.replace(/�/g, '\n');

  let lines = inputText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  if (lines.length % 2 !== 0) {
    alert("The input does not contain an even number of meaningful lines.");
    return;
  }

  const result = [];
  for (let i = 0; i < lines.length; i += 2) {
    result.push(`${lines[i]}: ${lines[i + 1]}`);
  }

  const output = result.join('\n');
  const outEl = document.getElementById('outputText');
  outEl.value = output;
  flashBox(outEl, 'red');                 // red flash
  appendToHistory("Sentinel/Cortex", output);
}


function clearFields() {
  const inputEl  = document.getElementById('inputText');
  const outputEl = document.getElementById('outputText');
  inputEl.value = '';
  outputEl.value = '';
  flashBox(inputEl, 'red');
  flashBox(outputEl, 'red');
}

function addToCollection() {
  const arranged  = document.getElementById('outputText').value.trim();
  const collector = document.getElementById('collectorText');

  if (!arranged) {
    alert("Nothing to add. Please click Arrange first.");
    return;
  }
  // Save state for Undo
  collectorStateStack.push(collector.value);

  if (collector.value.trim()) {
    collector.value = collector.value.trim() + "\n\n" + arranged + "\n";
  } else {
    collector.value = arranged + "\n";
  }

  flashBox(collector, 'red');             // red flash
}

function undoLastAddition() {
  if (collectorStateStack.length === 0) {
    alert("oops");
    return;
  }
  const collector = document.getElementById('collectorText');
  collector.value = collectorStateStack.pop();
  flashBox(collector, 'red');             // red flash on affected box
}

function clearBottom() {
  const collector  = document.getElementById('collectorText');
  const mergedOut  = document.getElementById('mergeOutput');
  collector.value = '';
  mergedOut.value = '';
  flashBox(collector, 'red');
  flashBox(mergedOut, 'red');
}

function mergeCollected() {
  const raw = document.getElementById('collectorText').value;
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);

  const map = new Map(); // key -> ordered unique values
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!map.has(key)) map.set(key, []);
    const arr = map.get(key);
    if (!arr.includes(value)) arr.push(value);
  }

  const merged = [];
  for (const [k, v] of map.entries()) merged.push(`${k}: ${v.join(', ')}`);
  const mergedEl = document.getElementById('mergeOutput');
  mergedEl.value = merged.join('\n');
  flashBox(mergedEl, 'red');              // red flash
}

function formatJsonResults(jsonString) {
  try {
    const arr = JSON.parse(jsonString);
    const lines = [];
    if (Array.isArray(arr)) {
      arr.forEach((obj, i) => {
        Object.entries(obj).forEach(([k, v]) => lines.push(`${k}: ${v}`));
        if (arr.length > 1 && i < arr.length - 1) lines.push("");
      });
    } else if (typeof arr === "object") {
      Object.entries(arr).forEach(([k, v]) => lines.push(`${k}: ${v}`));
    } else {
      return jsonString;
    }
    return lines.join('\n');
  } catch {
    return jsonString;
  }
}

function appendToHistory(source, output) {
  const el = document.getElementById('historyOutput');
  const sep = "\n======================\n";
  const entry = `${source} Output:\n${output}`;
  el.textContent = el.textContent.trim() ? el.textContent + sep + entry : entry;
}

/* Copy: blue hover is CSS; here we also flash the source box blue */
function copyOutput(id, sourceTextareaId) {
  const el = document.getElementById(id);
  el.focus(); el.select();
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    document.execCommand('copy');
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(el.value).catch(() => {});
  }
  const src = document.getElementById(sourceTextareaId);
  if (src) flashBox(src, 'blue');         // blue flash on the copied-from box
}

/* -------- Helpers -------- */
function applyTextareaFont(px) {
  document.querySelectorAll('textarea.logbox').forEach(t => t.style.fontSize = `${px}px`);
}

function flashBox(el, color='red'){
  // remove both classes to restart animation
  el.classList.remove('flash-red', 'flash-blue');
  void el.offsetWidth; // reflow
  el.classList.add(color === 'blue' ? 'flash-blue' : 'flash-red');
}
