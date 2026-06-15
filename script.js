const STORAGE_KEY = 'macro-tracker-data';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const fallback = {
    goals: { cal: 2400, protein: 170, carbs: 265, fat: 65 },
    days: {}
  };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return { ...fallback, ...parsed, goals: { ...fallback.goals, ...(parsed.goals || {}) } };
  } catch (e) {
    return fallback;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let data = loadData();

const goalInputs = {
  cal: document.getElementById('goal-cal'),
  protein: document.getElementById('goal-protein'),
  carbs: document.getElementById('goal-carbs'),
  fat: document.getElementById('goal-fat')
};

const displayGoals = {
  cal: document.getElementById('display-goal-cal'),
  protein: document.getElementById('display-goal-protein'),
  carbs: document.getElementById('display-goal-carbs'),
  fat: document.getElementById('display-goal-fat')
};

const eatenEls = {
  cal: document.getElementById('eaten-cal'),
  protein: document.getElementById('eaten-protein'),
  carbs: document.getElementById('eaten-carbs'),
  fat: document.getElementById('eaten-fat')
};

const barEls = {
  cal: document.getElementById('bar-cal'),
  protein: document.getElementById('bar-protein'),
  carbs: document.getElementById('bar-carbs'),
  fat: document.getElementById('bar-fat')
};

const foodLogEl = document.getElementById('food-log');
const emptyLogEl = document.getElementById('empty-log');
const addForm = document.getElementById('add-form');
const resetBtn = document.getElementById('reset-day');

function initGoalInputs() {
  Object.keys(goalInputs).forEach((key) => {
    goalInputs[key].value = data.goals[key];
  });
}

function getTodayLog() {
  const key = todayKey();
  if (!data.days[key]) {
    data.days[key] = [];
  }
  return data.days[key];
}

function render() {
  const log = getTodayLog();
  const totals = log.reduce(
    (acc, item) => {
      acc.cal += item.cal;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    },
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  Object.keys(eatenEls).forEach((key) => {
    eatenEls[key].textContent = Math.round(totals[key]);
    displayGoals[key].textContent = Math.round(data.goals[key]);
    const pct = data.goals[key] > 0 ? Math.min(100, (totals[key] / data.goals[key]) * 100) : 0;
    barEls[key].style.width = pct + '%';
  });

  if (log.length === 0) {
    foodLogEl.innerHTML = '';
    emptyLogEl.style.display = 'block';
    return;
  }

  emptyLogEl.style.display = 'none';
  foodLogEl.innerHTML = log
    .map((item, index) => `
      <li>
        <span>${escapeHtml(item.name)}</span>
        <span class="food-meta">
          <span>${Math.round(item.cal)} kcal · P${item.protein} C${item.carbs} F${item.fat}</span>
          <button class="delete-btn" data-index="${index}" aria-label="Remove ${escapeHtml(item.name)}">&times;</button>
        </span>
      </li>
    `)
    .join('');

  foodLogEl.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      getTodayLog().splice(idx, 1);
      saveData(data);
      render();
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

Object.keys(goalInputs).forEach((key) => {
  goalInputs[key].addEventListener('input', () => {
    const val = parseFloat(goalInputs[key].value);
    data.goals[key] = isNaN(val) ? 0 : val;
    saveData(data);
    render();
  });
});

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('food-name').value.trim();
  const cal = parseFloat(document.getElementById('food-cal').value) || 0;
  const protein = parseFloat(document.getElementById('food-protein').value) || 0;
  const carbs = parseFloat(document.getElementById('food-carbs').value) || 0;
  const fat = parseFloat(document.getElementById('food-fat').value) || 0;

  if (!name) return;

  getTodayLog().push({ name, cal, protein, carbs, fat });
  saveData(data);
  render();

  addForm.reset();
  document.getElementById('food-name').focus();
});

resetBtn.addEventListener('click', () => {
  if (confirm('Clear all food logged today?')) {
    data.days[todayKey()] = [];
    saveData(data);
    render();
  }
});

initGoalInputs();
render();
