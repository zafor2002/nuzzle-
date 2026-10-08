<template>
  <div class="messages-view">
    <TopBar title="💬 Direct Messages" />

    <div class="messages-scroll-body">
      <!-- Search Input -->
      <div class="msg-search-box">
        <Search :size="16" class="s-icon" />
        <input v-model="searchChat" placeholder="Search chats by name or pet..." class="s-input" />
      </div>

      <!-- Active Stories Ring Quick DM Bar -->
      <div class="quick-dm-tray">
        <span class="tray-label">Quick Message:</span>
        <div class="quick-contacts-row">
          <div 
            v-for="c in chats" 
            :key="c.id" 
            class="quick-avatar-item"
            @click="openChat(c)"
          >
            <div class="avatar-wrap">
              <img :src="c.participantAvatar" :alt="c.participantName" class="q-avatar" />
              <div v-if="c.isOnline" class="q-online"></div>
            </div>
            <span class="q-name">{{ c.participantName.split(' ')[0] }}</span>
          </div>
        </div>
      </div>

      <!-- Conversation List -->
      <div class="chats-list">
        <div 
          v-for="chat in filteredChats" 
          :key="chat.id"
          class="chat-row-item"
          @click="openChat(chat)"
        >
          <div class="chat-avatar-wrapper">
            <img :src="chat.participantAvatar" :alt="chat.participantName" class="c-avatar" />
            <div v-if="chat.isOnline" class="c-online-dot"></div>
          </div>

          <div class="chat-main-text">
            <div class="chat-title-line">
              <h4 class="participant-name">{{ chat.participantName }}</h4>
              <span class="msg-time">{{ chat.lastMessageTime }}</span>
            </div>

            <div class="chat-preview-line">
              <span v-if="chat.petName" class="pet-context">🐾 {{ chat.petName }}: </span>
              <p class="last-msg-snippet">{{ chat.lastMessage }}</p>
            </div>
          </div>

          <div v-if="chat.unreadCount > 0" class="unread-pill">
            {{ chat.unreadCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { chats, openChat } from '../stores/appStore';

const searchChat = ref('');

const filteredChats = computed(() => {
  if (!searchChat.value.trim()) return chats;
  const q = searchChat.value.toLowerCase();
  return chats.filter(c => 
    c.participantName.toLowerCase().includes(q) || 
    (c.petName && c.petName.toLowerCase().includes(q)) ||
    c.lastMessage.toLowerCase().includes(q)
  );
});
</script>

<style scoped>
.messages-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 84px;
}

.msg-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 8px 14px;
  margin-bottom: 12px;
}

.s-icon {
  color: var(--ink-muted);
}

.s-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--ink-primary);
}

.quick-dm-tray {
  margin-bottom: 14px;
}

.tray-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 6px;
}

.quick-contacts-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
}

.quick-avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.avatar-wrap {
  position: relative;
}

.q-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.q-online {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-emerald);
  border: 2px solid var(--bg-card);
}

.q-name {
  font-size: 11px;
  color: var(--ink-secondary);
}

.chats-list {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.chat-row-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.12s ease;
}

.chat-row-item:last-child {
  border-bottom: none;
}

.chat-row-item:active {
  background: var(--bg-card-subtle);
}

.chat-avatar-wrapper {
  position: relative;
}

.c-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.c-online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--accent-emerald);
  border: 2px solid var(--bg-card);
}

.chat-main-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-title-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.participant-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.msg-time {
  font-size: 10.5px;
  color: var(--ink-muted);
}

.chat-preview-line {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pet-context {
  font-size: 11px;
  font-weight: 700;
  color: var(--brand-primary);
}

.last-msg-snippet {
  font-size: 12px;
  color: var(--ink-muted);
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-pill {
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--brand-primary);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  display: grid;
  place-items: center;
  padding: 0 4px;
}
</style>
