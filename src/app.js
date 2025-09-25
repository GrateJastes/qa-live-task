const STORAGE_KEY = 'live_cypress_tasks_v1';

const form = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const dueInput = document.getElementById('due');
const priorityInput = document.getElementById('priority');
const saveBtn = document.getElementById('save');
const resetBtn = document.getElementById('reset');
const titleError = document.getElementById('titleError');

const listEl = document.getElementById('taskList');
const searchEl = document.getElementById('search');
const filterStatusEl = document.getElementById('filterStatus');
const filterPriorityEl = document.getElementById('filterPriority');

let tasks = [];
let editingId = null;

function uid() { return Math.random().toString(36).slice(2,9); }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch(e) { tasks = []; }
  render();
}

function saveStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function resetForm() {
  form.reset();
  editingId = null;
  saveBtn.textContent = 'Add Task';
  titleError.hidden = true;
}

function validate() {
  const t = titleInput.value.trim();
  if (!t) {
    titleError.hidden = false;
    return false;
  }
  titleError.hidden = true;
  return true;
}

function addTask(obj) {
  tasks.push(obj);
  saveStorage();
  render();
}

function updateTask(id, patch) {
  tasks = tasks.map(t => t.id === id ? {...t, ...patch} : t);
  saveStorage();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveStorage();
  render();
}

function toggleComplete(id) {
  const t = tasks.find(x => x.id === id);
  if (t) updateTask(id, {completed: !t.completed});
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  const status = filterStatusEl.value;
  const prio = filterPriorityEl.value;

  const filtered = tasks.filter(t => {
    if (q && !(t.title.toLowerCase().includes(q) || (t.description||'').toLowerCase().includes(q))) return false;
    if (status === 'active' && t.completed) return false;
    if (status === 'completed' && !t.completed) return false;
    if (prio !== 'any' && t.priority !== prio) return false;
    return true;
  });

  listEl.innerHTML = '';
  if (filtered.length === 0) {
    listEl.innerHTML = '<li class="meta">No tasks</li>';
    return;
  }

  for (const t of filtered) {
    const li = document.createElement('li');
    li.className = 'task';
    li.dataset.id = t.id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!t.completed;
    cb.addEventListener('change', () => toggleComplete(t.id));
    li.appendChild(cb);

    const body = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = t.title + (t.completed ? ' (done)' : '');
    body.appendChild(title);

    if (t.description) {
      const desc = document.createElement('div');
      desc.textContent = t.description;
      body.appendChild(desc);
    }

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = (t.due ? 'Due: ' + t.due + ' · ' : '') + 'Created: ' + t.createdAt;
    body.appendChild(meta);

    li.appendChild(body);

    const badge = document.createElement('div');
    badge.className = 'badge ' + t.priority;
    badge.textContent = t.priority;
    li.appendChild(badge);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.addEventListener('click', () => {
      editingId = t.id;
      titleInput.value = t.title;
      descInput.value = t.description || '';
      dueInput.value = t.due || '';
      priorityInput.value = t.priority || 'medium';
      saveBtn.textContent = 'Save';
      titleInput.focus();
    });
    actions.appendChild(edit);

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', () => deleteTask(t.id));
    actions.appendChild(del);

    li.appendChild(actions);

    listEl.appendChild(li);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;
  const obj = {
    id: editingId || uid(),
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    due: dueInput.value || null,
    priority: priorityInput.value,
    completed: false,
    createdAt: new Date().toLocaleString()
  };
  if (editingId) {
    updateTask(editingId, obj);
  } else {
    addTask(obj);
  }
  resetForm();
});

resetBtn.addEventListener('click', resetForm);
searchEl.addEventListener('input', render);
filterStatusEl.addEventListener('change', render);
filterPriorityEl.addEventListener('change', render);

// init
load();
