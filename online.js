const ONLINE_ROOM = 'little-lives-public-lobby-v1';
const MAX_CHAT_MESSAGES = 50;
const PLAYER_ID = window.crypto?.randomUUID
  ? window.crypto.randomUUID()
  : `guest-${Math.random().toString(36).slice(2)}-${Date.now()}`;
const onlineConfig = window.LITTLE_LIVES_ONLINE_CONFIG || {};

const onlineElements = {
  setup: document.getElementById('online-setup'),
  status: document.getElementById('online-status'),
  nickname: document.getElementById('online-nickname'),
  nameForm: document.getElementById('online-name-form'),
  joinButton: document.getElementById('online-join-button'),
  playerCount: document.getElementById('online-player-count'),
  players: document.getElementById('online-player-list'),
  chatForm: document.getElementById('online-chat-form'),
  chatInput: document.getElementById('online-chat-input'),
  chatMessages: document.getElementById('online-chat-messages'),
  visitDialog: document.getElementById('online-visit-dialog'),
  visitName: document.getElementById('online-visit-name'),
  visitSummary: document.getElementById('online-visit-summary'),
  visitStats: document.getElementById('online-visit-stats'),
  visitJournal: document.getElementById('online-visit-journal'),
};

let client = null;
let channel = null;
let connected = false;
let lastMessageAt = 0;
let profileTimer = 0;

function setOnlineStatus(message, kind = '') {
  onlineElements.status.textContent = message;
  onlineElements.status.className = `online-status${kind ? ` online-status--${kind}` : ''}`;
}

function readCurrentProfile() {
  return typeof window.littleLivesGetOnlineProfile === 'function'
    ? window.littleLivesGetOnlineProfile()
    : {};
}

function getPresencePayload() {
  const nickname = onlineElements.nickname.value.trim().slice(0, 20);
  return {
    id: PLAYER_ID,
    nickname,
    profile: readCurrentProfile(),
  };
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function getOnlinePlayers() {
  if (!channel || !connected) return [];
  const uniquePlayers = new Map();
  Object.values(channel.presenceState()).flat().forEach((presence) => {
    if (presence?.id && presence?.nickname) {
      uniquePlayers.set(presence.id, presence);
    }
  });
  return [...uniquePlayers.values()].sort((first, second) =>
    first.nickname.localeCompare(second.nickname));
}

function renderOnlinePlayers() {
  const players = getOnlinePlayers();
  onlineElements.playerCount.textContent = `${players.length} ${players.length === 1 ? 'PLAYER' : 'PLAYERS'}`;
  onlineElements.players.replaceChildren();

  if (!connected) {
    onlineElements.players.append(createTextElement(
      'p',
      'online-empty',
      'Join the lobby to meet other players.',
    ));
    return;
  }
  if (!players.length) {
    onlineElements.players.append(createTextElement(
      'p',
      'online-empty',
      'No one is in the lobby yet. You can be the first!',
    ));
    return;
  }

  players.forEach((player) => {
    const isSelf = player.id === PLAYER_ID;
    const profile = player.profile || {};
    const card = document.createElement('article');
    card.className = 'online-player-card';
    const header = document.createElement('div');
    header.className = 'online-player-heading';
    const name = createTextElement('strong', 'online-player-name', player.nickname);
    const badge = createTextElement('span', 'online-presence-badge', isSelf ? 'YOU' : 'ONLINE');
    header.append(name, badge);
    card.append(header);

    const summary = [
      Number.isFinite(profile.age) ? `Age ${profile.age}` : null,
      typeof profile.job === 'string' ? profile.job.slice(0, 40) : null,
    ].filter(Boolean).join(' · ');
    card.append(createTextElement('p', 'online-player-summary', summary || 'Life in progress'));

    if (!isSelf) {
      const visitButton = createTextElement('button', 'online-visit-button', 'Visit life');
      visitButton.type = 'button';
      visitButton.addEventListener('click', () => showPlayerVisit(player));
      card.append(visitButton);
    }
    onlineElements.players.append(card);
  });
}

function addChatMessage(message) {
  if (!message || typeof message.nickname !== 'string' || typeof message.text !== 'string') return;
  const nickname = message.nickname.trim().slice(0, 20);
  const text = message.text.trim().slice(0, 240);
  if (!nickname || !text) return;

  const item = document.createElement('li');
  item.className = message.id === PLAYER_ID ? 'online-chat-message online-chat-message--self' : 'online-chat-message';
  item.append(createTextElement('strong', 'online-chat-nickname', nickname));
  item.append(createTextElement('p', '', text));
  const timestamp = Number(message.sentAt);
  if (Number.isFinite(timestamp)) {
    item.append(createTextElement(
      'time',
      'online-chat-time',
      new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    ));
  }
  onlineElements.chatMessages.append(item);
  while (onlineElements.chatMessages.children.length > MAX_CHAT_MESSAGES) {
    onlineElements.chatMessages.firstElementChild.remove();
  }
  onlineElements.chatMessages.scrollTop = onlineElements.chatMessages.scrollHeight;
}

function showPlayerVisit(player) {
  const profile = player.profile || {};
  onlineElements.visitName.textContent = player.nickname;
  onlineElements.visitSummary.textContent =
    `Age ${Number.isFinite(profile.age) ? profile.age : '—'} · ${typeof profile.job === 'string' ? profile.job.slice(0, 40) : 'Life in progress'} · ${typeof profile.education === 'string' ? profile.education.slice(0, 40) : 'Learning as they go'}`;
  onlineElements.visitStats.replaceChildren();
  [
    ['Happiness', profile.happiness],
    ['Health', profile.health],
  ].forEach(([label, value]) => {
    const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : '—';
    onlineElements.visitStats.append(createTextElement('span', 'online-stat', `${label}: ${safeValue}${safeValue === '—' ? '' : '/100'}`));
  });

  onlineElements.visitJournal.replaceChildren();
  const moments = Array.isArray(profile.recentMoments)
    ? profile.recentMoments.filter((moment) => typeof moment === 'string').slice(0, 3)
    : [];
  if (moments.length) {
    moments.forEach((moment) => {
      onlineElements.visitJournal.append(createTextElement('li', '', moment.slice(0, 160)));
    });
  } else {
    onlineElements.visitJournal.append(createTextElement('li', '', 'Their story is just beginning.'));
  }
  onlineElements.visitDialog.showModal();
}

async function updatePresence() {
  if (!channel || !connected) return;
  try {
    const status = await channel.track(getPresencePayload());
    if (status !== 'ok') {
      setOnlineStatus('Your life profile could not be updated. Please try joining again.', 'error');
    }
  } catch (error) {
    setOnlineStatus(`Could not update your online profile: ${error.message}`, 'error');
  }
}

function connectToLobby() {
  if (!window.supabase?.createClient) {
    setOnlineStatus('The realtime library did not load. Check your internet connection and refresh.', 'error');
    return;
  }
  const projectUrl = typeof onlineConfig.projectUrl === 'string' ? onlineConfig.projectUrl.trim() : '';
  const publishableKey = typeof onlineConfig.publishableKey === 'string' ? onlineConfig.publishableKey.trim() : '';
  let parsedUrl;
  try {
    parsedUrl = new URL(projectUrl);
  } catch {
    setOnlineStatus('The lobby is not configured. Add a valid Supabase Project URL in online-config.js.', 'error');
    return;
  }
  if (parsedUrl.protocol !== 'https:' || !publishableKey) {
    setOnlineStatus('The lobby is not configured. Add the HTTPS Project URL and public anon/publishable key in online-config.js.', 'error');
    return;
  }

  try {
    client = window.supabase.createClient(projectUrl, publishableKey, {
      realtime: { params: { eventsPerSecond: 8 } },
    });
    channel = client.channel(ONLINE_ROOM, {
      config: {
        private: false,
        presence: { key: PLAYER_ID },
        broadcast: { self: false },
      },
    });
    channel
      .on('presence', { event: 'sync' }, renderOnlinePlayers)
      .on('broadcast', { event: 'chat' }, ({ payload }) => addChatMessage(payload))
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          connected = true;
          onlineElements.joinButton.querySelector('span').textContent = 'Update name';
          onlineElements.chatInput.disabled = false;
          onlineElements.chatForm.querySelector('button').disabled = false;
          setOnlineStatus('You’re connected to the public lobby.', 'connected');
          await updatePresence();
          renderOnlinePlayers();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          connected = false;
          onlineElements.chatInput.disabled = true;
          onlineElements.chatForm.querySelector('button').disabled = true;
          setOnlineStatus(`Could not connect to the lobby (${status}). Check the project URL and Realtime settings.`, 'error');
          renderOnlinePlayers();
        } else if (status === 'CLOSED') {
          connected = false;
          onlineElements.chatInput.disabled = true;
          onlineElements.chatForm.querySelector('button').disabled = true;
          setOnlineStatus('You are disconnected from the lobby. Join again to reconnect.', 'error');
          renderOnlinePlayers();
        }
      });
  } catch (error) {
    channel = null;
    setOnlineStatus(`Could not start the lobby: ${error.message}`, 'error');
  }
}

onlineElements.setup.hidden = Boolean(
  typeof onlineConfig.projectUrl === 'string'
  && onlineConfig.projectUrl.trim()
  && typeof onlineConfig.publishableKey === 'string'
  && onlineConfig.publishableKey.trim(),
);
onlineElements.nickname.value = `Guest-${PLAYER_ID.slice(0, 4)}`;
onlineElements.joinButton.disabled = onlineElements.setup.hidden === false;

if (onlineElements.setup.hidden) {
  setOnlineStatus('Choose a nickname and join the lobby to get started.');
} else {
  setOnlineStatus('Multiplayer is not configured yet.');
}
renderOnlinePlayers();

onlineElements.nameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = onlineElements.nickname.value.trim();
  if (nickname.length < 2 || nickname.length > 20) {
    setOnlineStatus('Choose a nickname between 2 and 20 characters.', 'error');
    return;
  }
  if (!connected) {
    connectToLobby();
    return;
  }
  updatePresence();
  setOnlineStatus('Your lobby nickname and life profile are updated.', 'connected');
});

onlineElements.chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = onlineElements.chatInput.value.trim();
  if (!connected || !channel || !text) return;
  if (Date.now() - lastMessageAt < 1500) {
    setOnlineStatus('Please wait a moment before sending another message.', 'error');
    return;
  }

  const message = {
    id: PLAYER_ID,
    nickname: onlineElements.nickname.value.trim().slice(0, 20),
    text: text.slice(0, 240),
    sentAt: Date.now(),
  };
  try {
    const status = await channel.send({ type: 'broadcast', event: 'chat', payload: message });
    if (status !== 'ok') {
      setOnlineStatus('Your message could not be sent. Please try again.', 'error');
      return;
    }
    lastMessageAt = Date.now();
    addChatMessage(message);
    onlineElements.chatInput.value = '';
    setOnlineStatus('Message sent to the lobby.', 'connected');
  } catch (error) {
    setOnlineStatus(`Could not send your message: ${error.message}`, 'error');
  }
});

window.addEventListener('little-lives:profile-change', () => {
  window.clearTimeout(profileTimer);
  profileTimer = window.setTimeout(updatePresence, 300);
});

window.addEventListener('pagehide', () => {
  if (client && channel) client.removeChannel(channel);
});
