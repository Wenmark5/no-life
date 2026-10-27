const CAREERS = [
  { id: 'barista', title: 'Barista', salary: 24000, education: 0, icon: '☕', color: 'peach' },
  { id: 'designer', title: 'Graphic designer', salary: 39000, education: 1, icon: '✳', color: 'lilac' },
  { id: 'teacher', title: 'Teacher', salary: 47000, education: 2, icon: '✎', color: 'mint' },
  { id: 'developer', title: 'Software developer', salary: 62000, education: 2, icon: '⌘', color: 'blue' },
];

const EDUCATION_LEVELS = ['High school', 'Some college', 'College degree', 'Advanced degree'];
const ACTIVITIES = [
  { id: 'exercise', category: 'wellbeing', title: 'Get active', icon: '✳', description: 'Exercise and feel healthier', cost: 200, effects: { health: 10, happiness: 4, looks: 2 }, journal: 'You made time to exercise and look after yourself.' },
  { id: 'rest', category: 'wellbeing', title: 'Take a proper rest', icon: '☾', description: 'Slow down and recharge', effects: { health: 5, happiness: 5 }, journal: 'You took time to rest and recharge.' },
  { id: 'meditate', category: 'wellbeing', title: 'Meditate', icon: '◉', description: 'Find a little calm', effects: { health: 2, happiness: 5, karma: 1 }, journal: 'You made a little space for calm and reflection.' },
  { id: 'study', category: 'learning', title: 'Go to school', icon: '✎', description: 'Earn your next education level', cost: 700, study: true, effects: { smarts: 8, happiness: -2 }, journal: 'You spent the year learning and earned a new education level.' },
  { id: 'read', category: 'learning', title: 'Read and learn', icon: '▤', description: 'Build your knowledge at home', cost: 100, effects: { smarts: 5, happiness: 2 }, journal: 'You spent the year reading and learning new things.' },
  { id: 'course', category: 'learning', title: 'Take an online course', icon: '⌘', description: 'Practice a useful new skill', cost: 350, effects: { smarts: 7, happiness: 1 }, journal: 'You completed an online course and learned a useful skill.' },
  { id: 'friends', category: 'social', title: 'See your friends', icon: '♡', description: 'Catch up and make memories', cost: 150, effects: { happiness: 11, health: 2, karma: 1 }, journal: 'You made some lovely memories with your friends.' },
  { id: 'family', category: 'social', title: 'Spend time with family', icon: '⌂', description: 'Be there for the people you love', cost: 100, effects: { happiness: 8, karma: 3 }, journal: 'You made time for your family and grew closer.' },
  { id: 'community', category: 'social', title: 'Join a local club', icon: '◎', description: 'Meet people who share your interests', cost: 75, effects: { happiness: 7, smarts: 1 }, journal: 'You joined a local club and met some new people.' },
  { id: 'travel', category: 'adventure', title: 'Take a trip', icon: '✈', description: 'Explore somewhere new', cost: 1200, effects: { happiness: 12, health: 2, looks: 1 }, journal: 'You took a trip and saw somewhere new.' },
  { id: 'outdoors', category: 'adventure', title: 'Explore the outdoors', icon: '⌁', description: 'Spend a year outside', cost: 100, effects: { health: 6, happiness: 6, looks: 1 }, journal: 'You spent more time outdoors and discovered a new place.' },
  { id: 'hobby', category: 'adventure', title: 'Try a creative hobby', icon: '✿', description: 'Make something just for fun', cost: 250, effects: { happiness: 8, smarts: 2 }, journal: 'You tried a creative hobby and made something of your own.' },
  { id: 'volunteer', category: 'kindness', title: 'Volunteer', icon: '♡', description: 'Give your time to a good cause', effects: { karma: 12, happiness: 5 }, journal: 'You volunteered your time to help people in your community.' },
  { id: 'neighbor', category: 'kindness', title: 'Help a neighbor', icon: '⌂', description: 'Do something kind close to home', effects: { karma: 8, happiness: 4 }, journal: 'You went out of your way to help a neighbor.' },
  { id: 'donate', category: 'kindness', title: 'Donate to a cause', icon: '♡', description: 'Give $250 to help someone', cost: 250, effects: { karma: 10, happiness: 2 }, journal: 'You donated to a cause that matters to you.' },
  { id: 'extra-work', category: 'work', title: 'Pick up extra work', icon: '↗', description: 'Earn a bonus on top of your salary', requiresJob: true, effects: { happiness: -2 }, journal: 'You put in extra effort at work.' },
  { id: 'side-project', category: 'work', title: 'Work on a side project', icon: '⌘', description: 'Practice skills for your future', cost: 100, effects: { smarts: 3, happiness: 2 }, journal: 'You worked on a side project and built your skills.' },
];

function createNpc(id, name, emoji, jobId, salary, education, money, happiness, health, trait, goal) {
  return { id, name, emoji, age: 18, jobId, salary, education, money, happiness, health, trait, goal, yearsWorked: 0, lastChoice: 'Looking forward to what comes next.' };
}

function createInitialState() {
  return {
    age: 18,
    year: 1,
    ageLimit: 100,
    money: 3500,
    happiness: 72,
    health: 86,
    looks: 68,
    smarts: 55,
    karma: 50,
    education: 0,
    jobId: null,
    yearsWorked: 0,
    extraEarnings: 0,
    actionTaken: false,
    finished: false,
    people: [
      createNpc('maya', 'Maya Chen', '🌻', 'designer', 39000, 1, 4200, 77, 89, 'dreamer', 'creative work'),
      createNpc('leo', 'Leo Brooks', '🚲', null, 0, 0, 2800, 68, 91, 'ambitious', 'a good career'),
      createNpc('amara', 'Amara Okafor', '🌿', 'teacher', 47000, 2, 6100, 82, 84, 'steady', 'a happy life'),
    ],
    journal: [],
  };
}

let state = createInitialState();
let toastTimer;
let currentPage = 'age';
let selectedActivityCategory = 'wellbeing';

const elements = {
  age: document.getElementById('player-age'),
  year: document.getElementById('year-label'),
  stage: document.getElementById('life-stage'),
  money: document.getElementById('player-money'),
  moneyNote: document.getElementById('money-note'),
  happiness: document.getElementById('player-happiness'),
  happinessMeter: document.getElementById('happiness-meter'),
  health: document.getElementById('player-health'),
  healthMeter: document.getElementById('health-meter'),
  looks: document.getElementById('player-looks'),
  looksMeter: document.getElementById('looks-meter'),
  smarts: document.getElementById('player-smarts'),
  smartsMeter: document.getElementById('smarts-meter'),
  karma: document.getElementById('player-karma'),
  karmaMeter: document.getElementById('karma-meter'),
  education: document.getElementById('player-education'),
  educationNote: document.getElementById('education-note'),
  jobSummary: document.getElementById('job-summary'),
  careers: document.getElementById('career-list'),
  actionStatus: document.getElementById('action-status'),
  ageButton: document.getElementById('age-button'),
  activityGrid: document.getElementById('activity-grid'),
  activityCategories: [...document.querySelectorAll('.activity-category')],
  adminPlayerForm: document.getElementById('admin-player-form'),
  adminNpcForm: document.getElementById('admin-npc-form'),
  people: document.getElementById('npc-list'),
  journal: document.getElementById('journal-list'),
  journalCount: document.getElementById('journal-count'),
  assetIncome: document.getElementById('asset-income'),
  assetBonus: document.getElementById('asset-bonus'),
  pageButtons: [...document.querySelectorAll('.menu-link')],
  pageViews: [...document.querySelectorAll('[data-page-view]')],
  pageLinks: [...document.querySelectorAll('[data-go-page]')],
  toast: document.getElementById('toast'),
  restart: document.getElementById('restart-button'),
};

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US').format(Math.round(amount));
}

function changeStat(value, amount) {
  return Math.max(0, Math.min(100, value + amount));
}

function addJournalEntry(text, age = state.age, year = state.year) {
  state.journal.unshift({ text, age, year });
  state.journal = state.journal.slice(0, 10);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove('visible'), 3200);
}

function showPage(page) {
  const viewExists = elements.pageViews.some((view) => view.dataset.pageView === page);
  if (!viewExists) return;

  currentPage = page;
  elements.pageViews.forEach((view) => {
    view.hidden = view.dataset.pageView !== page;
  });
  elements.pageButtons.forEach((button) => {
    if (button.dataset.page === page) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

function getLifeStage(age) {
  if (age < 22) return 'Just starting out';
  if (age < 35) return 'Finding your way';
  if (age < 60) return 'In your stride';
  if (age < 80) return 'A life well lived';
  return 'The golden years';
}

function renderCareers() {
  elements.careers.innerHTML = '';
  CAREERS.forEach((career) => {
    const card = document.createElement('article');
    const isCurrent = state.jobId === career.id;
    const isQualified = state.education >= career.education;
    card.className = `career-card${isCurrent ? ' current' : ''}`;
    const requirements = career.education
      ? `${EDUCATION_LEVELS[career.education]} required`
      : 'No experience needed';
    card.innerHTML = `
      <span class="career-icon ${career.color}" aria-hidden="true">${career.icon}</span>
      <span class="career-info"><strong>${career.title}</strong><small>${requirements}</small></span>
      <span class="career-salary">$${formatMoney(career.salary)}<small>/ year</small></span>
      <button class="career-button" type="button" ${isCurrent || !isQualified || state.finished ? 'disabled' : ''}>
        ${isCurrent ? 'Your job' : isQualified ? 'Choose' : 'Study first'}
      </button>`;
    const button = card.querySelector('button');
    if (!isCurrent && isQualified) {
      button.addEventListener('click', () => chooseCareer(career));
    }
    elements.careers.append(card);
  });
}

function renderPeople() {
  elements.people.innerHTML = '';
  state.people.forEach((person) => {
    const job = person.jobId ? CAREERS.find((career) => career.id === person.jobId)?.title : 'Exploring options';
    const card = document.createElement('article');
    card.className = 'npc-card';
    card.innerHTML = `
      <div class="npc-top">
        <span class="npc-avatar" aria-hidden="true">${person.emoji}</span>
        <span class="npc-heading"><strong>${person.name}</strong><small>Age ${person.age} · ${job}</small></span>
        <span class="npc-mood" title="Happiness">${person.happiness >= 70 ? '☀' : person.happiness >= 40 ? '◐' : '☁'}</span>
      </div>
      <div class="npc-stats">
        <span>♥ ${person.happiness} happiness</span>
        <span>＄${formatMoney(person.money)}</span>
      </div>
      <p class="npc-choice"><span>THIS YEAR</span>${person.lastChoice}</p>`;
    elements.people.append(card);
  });
}

function renderJournal() {
  elements.journal.innerHTML = '';
  state.journal.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'journal-entry';
    item.innerHTML = `<span class="journal-year">AGE ${entry.age}</span><span>${entry.text}</span>`;
    elements.journal.append(item);
  });
  elements.journalCount.textContent = state.journal.length
    ? `${state.journal.length} ${state.journal.length === 1 ? 'moment' : 'moments'} saved`
    : 'Your story is beginning';
  if (!state.journal.length) {
    const item = document.createElement('li');
    item.className = 'journal-empty';
    item.textContent = 'Your story is waiting to be written. Finish your first year to add a memory.';
    elements.journal.append(item);
  }
}

function populateSelect(select, options, placeholder) {
  select.innerHTML = '';
  if (placeholder) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = placeholder;
    select.append(option);
  }
  options.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
}

function getAdminField(form, name) {
  return form.elements.namedItem(name);
}

function renderAdminPlayer() {
  const form = elements.adminPlayerForm;
  const job = CAREERS.find((career) => career.id === state.jobId);
  const values = {
    age: state.age,
    year: state.year,
    ageLimit: state.ageLimit,
    money: state.money,
    job: state.jobId || '',
    salary: job?.salary || 0,
    education: state.education,
    activity: state.selectedActivity || '',
    happiness: state.happiness,
    health: state.health,
    looks: state.looks,
    smarts: state.smarts,
    karma: state.karma,
    yearsWorked: state.yearsWorked,
    extraEarnings: state.extraEarnings,
    finished: state.finished,
  };
  Object.entries(values).forEach(([name, value]) => {
    getAdminField(form, name).value = value;
  });
  getAdminField(form, 'finished').checked = state.finished;
}

function renderAdminNpcFields() {
  const form = elements.adminNpcForm;
  const personSelect = getAdminField(form, 'person');
  state.people.forEach((npc, index) => {
    if (personSelect.options[index]) personSelect.options[index].textContent = npc.name;
  });
  const person = state.people.find((npc) => npc.id === personSelect.value)
    || state.people[0];
  if (!person) return;
  const values = {
    person: person.id,
    name: person.name,
    emoji: person.emoji,
    age: person.age,
    job: person.jobId || '',
    salary: person.salary,
    education: person.education,
    money: person.money,
    happiness: person.happiness,
    health: person.health,
    yearsWorked: person.yearsWorked,
    trait: person.trait,
    goal: person.goal,
    lastChoice: person.lastChoice,
  };
  Object.entries(values).forEach(([name, value]) => {
    getAdminField(form, name).value = value;
  });
}

function setupAdminControls() {
  const playerForm = elements.adminPlayerForm;
  const npcForm = elements.adminNpcForm;
  const careerOptions = CAREERS.map((career) => ({ value: career.id, label: career.title }));
  const educationOptions = EDUCATION_LEVELS.map((label, index) => ({ value: index, label }));
  const activityOptions = ACTIVITIES.map((activity) => ({ value: activity.id, label: activity.title }));

  populateSelect(getAdminField(playerForm, 'job'), careerOptions, 'No job');
  populateSelect(getAdminField(playerForm, 'education'), educationOptions);
  populateSelect(getAdminField(playerForm, 'activity'), activityOptions, 'No activity chosen');
  populateSelect(getAdminField(npcForm, 'job'), careerOptions, 'No job');
  populateSelect(getAdminField(npcForm, 'education'), educationOptions);
  populateSelect(
    getAdminField(npcForm, 'person'),
    state.people.map((person) => ({ value: person.id, label: person.name })),
  );
  renderAdminPlayer();
  renderAdminNpcFields();

  getAdminField(playerForm, 'job').addEventListener('change', (event) => {
    const career = CAREERS.find((option) => option.id === event.target.value);
    getAdminField(playerForm, 'salary').value = career?.salary || 0;
  });
  getAdminField(npcForm, 'job').addEventListener('change', (event) => {
    const career = CAREERS.find((option) => option.id === event.target.value);
    getAdminField(npcForm, 'salary').value = career?.salary || 0;
  });
  getAdminField(npcForm, 'person').addEventListener('change', renderAdminNpcFields);

  playerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!playerForm.reportValidity()) return;

    const jobId = getAdminField(playerForm, 'job').value;
    const salary = Number(getAdminField(playerForm, 'salary').value);
    const job = CAREERS.find((career) => career.id === jobId);
    if (job) job.salary = salary;
    state.age = Number(getAdminField(playerForm, 'age').value);
    state.year = Number(getAdminField(playerForm, 'year').value);
    state.ageLimit = Number(getAdminField(playerForm, 'ageLimit').value);
    state.money = Number(getAdminField(playerForm, 'money').value);
    state.jobId = jobId || null;
    state.education = Number(getAdminField(playerForm, 'education').value);
    state.happiness = Number(getAdminField(playerForm, 'happiness').value);
    state.health = Number(getAdminField(playerForm, 'health').value);
    state.looks = Number(getAdminField(playerForm, 'looks').value);
    state.smarts = Number(getAdminField(playerForm, 'smarts').value);
    state.karma = Number(getAdminField(playerForm, 'karma').value);
    state.yearsWorked = Number(getAdminField(playerForm, 'yearsWorked').value);
    state.extraEarnings = Number(getAdminField(playerForm, 'extraEarnings').value);
    state.finished = getAdminField(playerForm, 'finished').checked;
    state.selectedActivity = getAdminField(playerForm, 'activity').value || null;
    state.actionTaken = Boolean(state.selectedActivity);
    state.pendingAction = state.selectedActivity
      ? `You chose ${ACTIVITIES.find((activity) => activity.id === state.selectedActivity).title} for the year.`
      : '';
    const journalEntry = getAdminField(playerForm, 'journalEntry').value.trim();
    if (journalEntry) addJournalEntry(journalEntry);
    render();
    showToast('Player settings applied.');
  });

  npcForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!npcForm.reportValidity()) return;

    const person = state.people.find((npc) => npc.id === getAdminField(npcForm, 'person').value);
    if (!person) {
      showToast('Choose an NPC to edit.');
      return;
    }
    person.name = getAdminField(npcForm, 'name').value.trim();
    person.emoji = getAdminField(npcForm, 'emoji').value.trim();
    person.age = Number(getAdminField(npcForm, 'age').value);
    person.jobId = getAdminField(npcForm, 'job').value || null;
    person.salary = Number(getAdminField(npcForm, 'salary').value);
    person.education = Number(getAdminField(npcForm, 'education').value);
    person.money = Number(getAdminField(npcForm, 'money').value);
    person.happiness = Number(getAdminField(npcForm, 'happiness').value);
    person.health = Number(getAdminField(npcForm, 'health').value);
    person.yearsWorked = Number(getAdminField(npcForm, 'yearsWorked').value);
    person.trait = getAdminField(npcForm, 'trait').value;
    person.goal = getAdminField(npcForm, 'goal').value;
    person.lastChoice = getAdminField(npcForm, 'lastChoice').value.trim();
    const personSelect = getAdminField(npcForm, 'person');
    personSelect.options[personSelect.selectedIndex].textContent = person.name;
    render();
    showToast(`${person.name}'s settings applied.`);
  });
}

function formatActivityEffects(activity) {
  const effectLabels = {
    health: 'health',
    happiness: 'happiness',
    looks: 'looks',
    smarts: 'smarts',
    karma: 'karma',
  };
  const effects = Object.entries(activity.effects)
    .filter(([, amount]) => amount !== 0)
    .map(([stat, amount]) => `${amount > 0 ? '+' : ''}${amount} ${effectLabels[stat]}`);
  if (activity.id === 'extra-work') {
    const job = CAREERS.find((career) => career.id === state.jobId);
    if (job) effects.push(`+$${formatMoney(Math.round(job.salary * 0.12))}`);
  }
  if (activity.cost) effects.push(`$${formatMoney(activity.cost)}`);
  if (activity.requiresJob && !state.jobId) effects.unshift('Choose a job first');
  return effects.join(' · ');
}

function renderActivities() {
  elements.activityCategories.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.category === selectedActivityCategory));
  });
  elements.activityGrid.innerHTML = '';
  ACTIVITIES
    .filter((activity) => activity.category === selectedActivityCategory)
    .forEach((activity) => {
      const button = document.createElement('button');
      button.className = `life-action${state.selectedActivity === activity.id ? ' selected' : ''}`;
      button.type = 'button';
      button.disabled = state.actionTaken || state.finished;
      button.setAttribute('aria-pressed', String(state.selectedActivity === activity.id));
      button.innerHTML = `
        <span class="action-icon">${activity.icon}</span>
        <span class="action-copy">
          <strong>${activity.title}</strong>
          <small>${activity.description}</small>
          <small class="activity-effects">${formatActivityEffects(activity)}</small>
        </span>
        <span class="action-arrow" aria-hidden="true">↗</span>`;
      button.addEventListener('click', () => takeAction(activity.id));
      elements.activityGrid.append(button);
    });
}

function render() {
  elements.age.textContent = state.age;
  elements.year.textContent = `Year ${state.year} of your story`;
  elements.stage.textContent = getLifeStage(state.age);
  elements.money.textContent = `$${formatMoney(state.money)}`;
  elements.moneyNote.textContent = state.money < 0
    ? 'A tough year. Try to bring in more income.'
    : state.money > 25000 ? 'You have a comfortable cushion' : 'A little nest egg';
  const job = CAREERS.find((career) => career.id === state.jobId);
  elements.assetIncome.textContent = `$${formatMoney(job?.salary || 0)} / year`;
  elements.assetBonus.textContent = `$${formatMoney(state.extraEarnings)} this year`;
  elements.happiness.innerHTML = `${state.happiness}<span class="unit">/100</span>`;
  elements.happinessMeter.style.width = `${state.happiness}%`;
  elements.health.innerHTML = `${state.health}<span class="unit">/100</span>`;
  elements.healthMeter.style.width = `${state.health}%`;
  elements.looks.innerHTML = `${state.looks}<span class="unit">/100</span>`;
  elements.looksMeter.style.width = `${state.looks}%`;
  elements.smarts.innerHTML = `${state.smarts}<span class="unit">/100</span>`;
  elements.smartsMeter.style.width = `${state.smarts}%`;
  elements.karma.innerHTML = `${state.karma}<span class="unit">/100</span>`;
  elements.karmaMeter.style.width = `${state.karma}%`;
  elements.education.textContent = EDUCATION_LEVELS[state.education];
  elements.educationNote.textContent = state.education >= 2 ? 'Lots of doors are open' : 'Ready to learn more';
  elements.jobSummary.textContent = job ? `${job.title} · $${formatMoney(job.salary)}/yr` : 'Between jobs';
  elements.actionStatus.textContent = state.actionTaken
    ? `${ACTIVITIES.find((activity) => activity.id === state.selectedActivity)?.title || 'Your activity'} chosen. Finish the year when you’re ready.`
    : 'You haven’t chosen an activity yet.';
  renderActivities();
  elements.ageButton.disabled = state.finished;
  elements.ageButton.innerHTML = state.finished
    ? '<span>Your story is complete</span><span aria-hidden="true">✦</span>'
    : '<span>Finish this year</span><span aria-hidden="true">→</span>';
  elements.restart.textContent = state.year > 1 ? 'Start over' : 'New story';
  renderCareers();
  renderPeople();
  renderJournal();
  renderAdminPlayer();
  renderAdminNpcFields();
  window.dispatchEvent(new CustomEvent('little-lives:profile-change', {
    detail: getOnlineProfile(),
  }));
}

function getOnlineProfile() {
  const job = CAREERS.find((career) => career.id === state.jobId);
  const activity = ACTIVITIES.find((item) => item.id === state.selectedActivity);
  return {
    age: state.age,
    job: job?.title || 'Exploring options',
    education: EDUCATION_LEVELS[state.education],
    health: state.health,
    happiness: state.happiness,
    year: state.year,
    recentMoments: state.journal.slice(0, 3).map((entry) => entry.text),
    currentActivity: activity?.title || null,
  };
}

function chooseCareer(career) {
  if (state.finished) return;
  const previous = CAREERS.find((item) => item.id === state.jobId);
  state.jobId = career.id;
  state.yearsWorked = 0;
  addJournalEntry(previous
    ? `You left your job as a ${previous.title} and became a ${career.title}.`
    : `You got your first job as a ${career.title}.`);
  render();
  showToast(`You're now a ${career.title}.`);
}

function takeAction(actionName) {
  if (state.actionTaken || state.finished) return;
  const activity = ACTIVITIES.find((option) => option.id === actionName);
  if (!activity) return;
  if (activity.cost && state.money < activity.cost) {
    showToast(`You need $${formatMoney(activity.cost)} for this activity.`);
    return;
  }
  if (activity.study && state.education >= EDUCATION_LEVELS.length - 1) {
    showToast('You have reached the highest education level.');
    return;
  }
  if (activity.requiresJob && !state.jobId) {
    showToast('Choose a career before picking up extra work.');
    return;
  }

  state.money -= activity.cost || 0;
  if (activity.study) {
    state.education += 1;
  }
  Object.entries(activity.effects).forEach(([stat, amount]) => {
    state[stat] = changeStat(state[stat], amount);
  });
  let message = activity.journal;
  if (activity.study) {
    message = `You studied hard and earned ${EDUCATION_LEVELS[state.education].toLowerCase()}.`;
  }
  if (activity.id === 'extra-work') {
    const job = CAREERS.find((career) => career.id === state.jobId);
    const bonus = Math.round(job.salary * 0.12);
    state.extraEarnings += bonus;
    message = `You worked extra hard and earned a $${formatMoney(bonus)} bonus.`;
  }
  state.actionTaken = true;
  state.selectedActivity = activity.id;
  state.pendingAction = message;
  elements.actionStatus.textContent = message;
  render();
}

function scoreNpcChoice(person, choice) {
  const lowHappiness = (70 - person.happiness) * 0.16;
  const lowHealth = (75 - person.health) * 0.13;
  const wantsCareer = !person.jobId ? 5 : Math.max(0, (50000 - person.salary) / 10000);
  const needsMoney = person.money < 1500 ? 4 : person.money < 4000 ? 1 : 0;
  const goalBoost = person.goal === choice.goal ? 2.5 : 0;
  const traitBoost = person.trait === choice.trait ? 2.2 : 0;
  return choice.base + lowHappiness * (choice.kind === 'socialize' ? 1.4 : 0.35)
    + lowHealth * (choice.kind === 'exercise' ? 1.7 : 0.2)
    + wantsCareer * (choice.kind === 'career' ? 0.65 : 0)
    + needsMoney * (choice.kind === 'work' ? 0.8 : 0)
    + goalBoost + traitBoost + Math.random() * 1.5;
}

function decideNpcAction(person) {
  const choices = [
    { kind: 'socialize', base: 2, goal: 'a happy life', trait: 'steady', label: 'made time for friends', apply: () => { person.happiness = changeStat(person.happiness, 8); person.money -= Math.max(0, Math.min(person.money, 180)); } },
    { kind: 'exercise', base: 1.8, goal: 'a happy life', trait: 'steady', label: 'looked after their health', apply: () => { person.health = changeStat(person.health, 8); person.happiness = changeStat(person.happiness, 2); } },
    { kind: 'work', base: 2.2, goal: 'a good career', trait: 'ambitious', label: 'worked hard and saved', apply: () => { person.money += 700; person.happiness = changeStat(person.happiness, -2); } },
  ];

  const nextCareer = CAREERS.find((career) => career.education <= person.education
    && career.salary > (person.salary || 0) + 5000);
  if (nextCareer) {
    choices.push({
      kind: 'career', base: person.jobId ? 2.8 : 4.8, goal: 'a good career', trait: 'ambitious',
      label: `applied for a ${nextCareer.title.toLowerCase()} job`,
      apply: () => {
        person.jobId = nextCareer.id;
        person.salary = nextCareer.salary;
        person.yearsWorked = 0;
        person.happiness = changeStat(person.happiness, 3);
      },
    });
  }

  if (person.education < 2 && person.money > 1200) {
    const hasCareerGoal = person.jobId && CAREERS.some((career) => career.education > person.education && career.salary > person.salary);
    choices.push({
      kind: 'study', base: person.trait === 'dreamer' ? 4.2 : hasCareerGoal ? 3.6 : 1.8,
      goal: person.trait === 'dreamer' ? 'creative work' : 'a good career', trait: 'dreamer', label: 'went back to school',
      apply: () => { person.education += 1; person.money -= 900; person.happiness = changeStat(person.happiness, -2); },
    });
  }

  choices.sort((a, b) => scoreNpcChoice(person, b) - scoreNpcChoice(person, a));
  const choice = choices[0];
  choice.apply();
  person.lastChoice = choice.label;
  return `${person.name} ${choice.label}.`;
}

function ageNpc(person) {
  const event = decideNpcAction(person);
  if (person.jobId) {
    person.yearsWorked += 1;
    person.money += person.salary;
    person.money -= 14000;
    if (person.yearsWorked >= 5 && person.salary < 70000) {
      person.salary = Math.round(person.salary * 1.08);
      person.yearsWorked = 0;
      person.lastChoice = `${person.lastChoice}; earned a raise`;
    }
  } else {
    person.money -= 9000;
  }
  person.money = Math.max(-10000, person.money);
  person.age += 1;
  person.health = changeStat(person.health, person.age > 65 ? -3 : -1);
  person.happiness = changeStat(person.happiness, person.money < 0 ? -4 : 0);
  return event;
}

function finishYear() {
  if (state.finished) return;
  const events = [];
  if (!state.actionTaken) {
    state.pendingAction = 'You took the year at your own pace.';
  }
  if (state.jobId) {
    const job = CAREERS.find((career) => career.id === state.jobId);
    const earned = job.salary + state.extraEarnings;
    state.extraEarnings = 0;
    state.money += earned;
    state.money -= 18000;
    state.yearsWorked += 1;
    events.push(`You earned $${formatMoney(earned)} as a ${job.title} and spent $18,000 on living costs.`);
    if (state.yearsWorked >= 5 && job.salary < 90000) {
      job.salary = Math.round(job.salary * 1.08);
      state.yearsWorked = 0;
      events.push(`Your hard work paid off: you got a raise to $${formatMoney(job.salary)} a year.`);
    }
  } else {
    state.money -= 11000;
    events.push('You got by without a steady job, but your savings went down by $11,000.');
  }
  state.health = changeStat(state.health, state.age >= 60 ? -3 : -1);
  if (state.money < 0) state.happiness = changeStat(state.happiness, -4);
  else if (state.money > 40000) state.happiness = changeStat(state.happiness, 2);
  if (state.health < 25) state.happiness = changeStat(state.happiness, -2);

  const nextAge = state.age + 1;
  state.people.forEach((person) => {
    const event = ageNpc(person);
    events.push(event);
  });
  state.age = nextAge;
  state.year += 1;
  if (state.pendingAction) events.unshift(state.pendingAction);
  events.forEach((event) => addJournalEntry(event, nextAge, state.year));
  state.actionTaken = false;
  state.selectedActivity = null;
  state.pendingAction = '';

  if (state.age >= state.ageLimit) {
    state.finished = true;
    addJournalEntry(`You reached ${state.age} years old. What a remarkable story.`, state.age, state.year);
    showToast(`You reached your age limit of ${state.ageLimit}. What a life!`);
  }
  render();
}

function restartGame() {
  if (state.year > 1 && !window.confirm('Start a new story? Your current life will be lost.')) return;
  state = createInitialState();
  selectedActivityCategory = 'wellbeing';
  render();
  showToast('A new story begins at age 18.');
}

elements.pageButtons.forEach((button) => {
  button.addEventListener('click', () => showPage(button.dataset.page));
});
elements.pageLinks.forEach((button) => {
  button.addEventListener('click', () => showPage(button.dataset.goPage));
});
elements.activityCategories.forEach((button) => {
  button.addEventListener('click', () => {
    selectedActivityCategory = button.dataset.category;
    renderActivities();
  });
});
elements.ageButton.addEventListener('click', finishYear);
elements.restart.addEventListener('click', restartGame);
setupAdminControls();
window.littleLivesGetOnlineProfile = getOnlineProfile;
showPage(currentPage);
render();
