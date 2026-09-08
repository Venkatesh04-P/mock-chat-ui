const conversations = [
  {
    id: 1,
    name: "Alex Johnson",
    status: "Online",
    avatar: "A",
    messages: [
      { sender: "them", text: "Hey! How are you doing?", time: "10:12 AM" },
      { sender: "me", text: "I'm doing great! Working on a chat UI project.", time: "10:14 AM" },
      { sender: "them", text: "Nice! Is it using HTML, CSS and JavaScript?", time: "10:15 AM" },
      { sender: "me", text: "Yes. It also has conversation switching and auto-scroll.", time: "10:17 AM" },
      { sender: "them", text: "That sounds good. Keep going!", time: "10:18 AM" }
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    status: "Online",
    avatar: "P",
    messages: [
      { sender: "them", text: "Did you complete the assignment?", time: "9:35 AM" },
      { sender: "me", text: "Almost. I am testing the interface now.", time: "9:42 AM" }
    ]
  },
  {
    id: 3,
    name: "Rahul Kumar",
    status: "Last seen 15 min ago",
    avatar: "R",
    messages: [
      { sender: "me", text: "Can you share the project requirements?", time: "Yesterday" },
      { sender: "them", text: "Sure, I will send them shortly.", time: "Yesterday" }
    ]
  },
  {
    id: 4,
    name: "Project Team",
    status: "5 members",
    avatar: "T",
    messages: [
      { sender: "them", text: "Welcome to the project group!", time: "Monday" },
      { sender: "me", text: "Thank you everyone.", time: "Monday" }
    ]
  }
];

let activeConversationId = 1;

const conversationList = document.getElementById("conversationList");
const messageThread = document.getElementById("messageThread");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const searchInput = document.getElementById("searchInput");

function getActiveConversation() {
  return conversations.find(c => c.id === activeConversationId);
}

function renderConversations(filter = "") {
  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (!filtered.length) {
    conversationList.innerHTML =
      '<div class="empty-state">No conversations found.</div>';
    return;
  }

  conversationList.innerHTML = filtered.map(c => {
    const last = c.messages[c.messages.length - 1];
    return `
      <div class="conversation ${c.id === activeConversationId ? "active" : ""}"
           data-id="${c.id}">
        <div class="avatar">${c.avatar}</div>
        <div class="conversation-info">
          <div class="conversation-top">
            <span class="conversation-name">${escapeHTML(c.name)}</span>
            <span class="conversation-time">${escapeHTML(last.time)}</span>
          </div>
          <div class="conversation-preview">${escapeHTML(last.text)}</div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".conversation").forEach(item => {
    item.addEventListener("click", () => {
      activeConversationId = Number(item.dataset.id);
      renderAll();
    });
  });
}

function renderMessages() {
  const conversation = getActiveConversation();

  document.getElementById("headerName").textContent = conversation.name;
  document.getElementById("headerStatus").textContent = conversation.status;
  document.getElementById("headerAvatar").textContent = conversation.avatar;

  messageThread.innerHTML = `
    <div class="day-label">Today</div>
    ${conversation.messages.map(message => `
      <div class="message-row ${message.sender === "me" ? "sent" : "received"}">
        <div class="message">
          <div class="message-text">${escapeHTML(message.text)}</div>
          <span class="message-time">${escapeHTML(message.time)}</span>
        </div>
      </div>
    `).join("")}
  `;

  scrollToLatestMessage();
}

function sendMessage(text) {
  const conversation = getActiveConversation();
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

  conversation.messages.push({
    sender: "me",
    text,
    time
  });

  renderAll();
  messageInput.focus();

  // Mock reply to demonstrate simulated state updates.
  setTimeout(() => {
    conversation.messages.push({
      sender: "them",
      text: "Thanks for your message! This is a mock reply.",
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      })
    });
    renderAll();
  }, 700);
}

function scrollToLatestMessage() {
  messageThread.scrollTop = messageThread.scrollHeight;
}

function renderAll() {
  renderConversations(searchInput.value);
  renderMessages();
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

messageForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = messageInput.value.trim();

  if (!text) return;

  sendMessage(text);
  messageInput.value = "";
});

searchInput.addEventListener("input", () => {
  renderConversations(searchInput.value);
});

document.getElementById("newChatBtn").addEventListener("click", () => {
  const newId = conversations.length + 1;

  conversations.push({
    id: newId,
    name: `New Contact ${newId}`,
    status: "Online",
    avatar: "N",
    messages: [
      {
        sender: "them",
        text: "New conversation started.",
        time: "Now"
      }
    ]
  });

  activeConversationId = newId;
  renderAll();
});

renderAll();
