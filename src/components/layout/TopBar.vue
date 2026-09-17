<template>
  <header class="app-header clean-topbar">
    <!-- Left Section: Back Button or Brand Logo -->
    <div class="topbar-left">
      <button v-if="showBackButton" class="back-btn" @click="goBack" title="Back">
        <ArrowLeft :size="19" />
      </button>
      
      <div v-else class="brand-badge" @click="setTab('feed')">
        <NuzzleLogo :size="26" />
        <span class="brand-text">Nuzzle</span>
      </div>

      <!-- Quick Active Pet Perspective Switcher Pill on Feed (Only for Pet Parents) -->
      <button 
        v-if="!showBackButton && (!owner.role || owner.role === 'parent') && pets.length > 0" 
        class="pet-perspective-pill"
        @click="cyclePetPerspective"
        :title="'Switch perspective from ' + currentBrowsingName"
      >
        <span class="perspective-emoji">{{ currentBrowsingEmoji }}</span>
        <span class="perspective-name">{{ currentBrowsingName }}</span>
        <span class="perspective-badge">Perspective</span>
      </button>
    </div>

    <!-- Center / Inline Title Section (Flex-bounded: Never Overlaps!) -->
    <div v-if="showBackButton && title" class="topbar-title-container">
      <h3 class="topbar-title-text">{{ title }}</h3>
    </div>
    <div v-else class="topbar-spacer"></div>

    <!-- Right Action Buttons (Always Fixed Width & Spaced) -->
    <div class="topbar-right-actions">
      <!-- 🚨 Emergency 5-Mile Lost & Found Radar -->
      <button 
        class="header-action-btn emergency-btn" 
        :class="{ active: currentTab === 'lostfound' }"
        @click="setTab('lostfound')" 
        title="5-Mile Lost & Found Radar"
      >
        <AlertTriangle :size="17" />
        <span class="pulse-dot"></span>
      </button>

      <!-- 💬 Direct Messages -->
      <button 
        class="header-action-btn" 
        :class="{ active: currentTab === 'messages' }"
        @click="setTab('messages')" 
        title="Messages"
      >
        <MessageCircle :size="18" />
        <span v-if="unreadMessagesCount > 0" class="unread-pill">{{ unreadMessagesCount }}</span>
      </button>

      <!-- 🔔 Notifications -->
      <button 
        class="header-action-btn" 
        :class="{ active: currentTab === 'activity' }"
        @click="setTab('activity')" 
        title="Notifications"
      >
        <Bell :size="18" />
        <span v-if="unreadNotificationsCount > 0" class="unread-dot"></span>
      </button>

      <!-- 🏛️ System Architecture Blueprint & Live API Console -->
      <button 
        class="header-action-btn architecture-btn" 
        @click="showArchitectureModal = true" 
        title="Nuzzle Backend System Architecture & Live Console"
      >
        <Layers :size="17" />
        <span class="live-status-dot"></span>
      </button>
    </div>

    <!-- System Architecture Console Modal -->
    <ArchitectureModal 
      :is-open="showArchitectureModal" 
      @close="showArchitectureModal = false" 
    />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MessageCircle, Bell, AlertTriangle, ArrowLeft, Layers } from 'lucide-vue-next';
import NuzzleLogo from '../common/NuzzleLogo.vue';
import ArchitectureModal from '../common/ArchitectureModal.vue';
import { 
  currentTab, 
  setTab, 
  owner, 
  pets, 
  activeProfileId, 
  unreadMessagesCount, 
  unreadNotificationsCount 
} from '../../stores/appStore';

const showArchitectureModal = ref(false);

const props = defineProps<{
  title?: string;
  canGoBack?: boolean;
}>();

const showBackButton = computed(() => {
  return props.canGoBack || !['feed', 'explore', 'ai', 'reels', 'profile'].includes(currentTab.value);
});

const currentBrowsingName = computed(() => {
  if (activeProfileId.value === 'owner_me') return owner.displayName.split(' ')[0];
  const pet = pets.find(p => p.id === activeProfileId.value);
  return pet ? pet.name : 'Waffles';
});

const currentBrowsingEmoji = computed(() => {
  if (activeProfileId.value === 'owner_me') return '👤';
  const pet = pets.find(p => p.id === activeProfileId.value);
  return pet?.species === 'Cat' ? '🐱' : '🐾';
});

function cyclePetPerspective() {
  if (activeProfileId.value === 'owner_me' && pets[0]) {
    activeProfileId.value = pets[0].id;
  } else if (pets[1] && activeProfileId.value === pets[0]?.id) {
    activeProfileId.value = pets[1].id;
  } else {
    activeProfileId.value = 'owner_me';
  }
}

function goBack() {
  setTab('feed');
}
</script>

<style scoped>
.clean-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 10px 0 12px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(16px);
  gap: 8px;
}

/* Left side */
.topbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.brand-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 800;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.pet-perspective-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #F3EEFF 0%, #FAF5FF 100%);
  border: 1.5px solid #DDD6FE;
  padding: 2px 7px 2px 5px;
  border-radius: var(--radius-full);
  font-size: 10.5px;
  font-weight: 700;
  color: #6D28D9;
  cursor: pointer;
  transition: all 0.18s ease;
  box-shadow: 0 1px 4px rgba(148, 125, 238, 0.1);
}

.pet-perspective-pill:hover {
  transform: translateY(-1px);
  border-color: #8B5CF6;
  background: #EDE9FE;
}

.perspective-emoji {
  font-size: 11px;
}

.perspective-name {
  max-width: 55px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.perspective-badge {
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
  background: #7C3AED;
  color: #fff;
  padding: 1px 3px;
  border-radius: 3px;
  letter-spacing: 0.02em;
}

.back-btn {
  color: var(--ink-primary);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: background 0.15s ease;
}

.back-btn:hover {
  background: var(--bg-card-subtle);
}

/* Center / Title bounded in flex */
.topbar-title-container {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.topbar-title-text {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-spacer {
  flex: 1;
}

/* Right side actions */
.topbar-right-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.header-action-btn {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--ink-secondary);
  transition: all 0.15s ease;
}

.header-action-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--brand-primary);
}

.header-action-btn.active {
  color: var(--brand-primary);
  background: var(--brand-soft);
}

.emergency-btn {
  color: #E11D48;
}

.emergency-btn:hover {
  background: #FFE4E6;
}

.pulse-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 6px;
  height: 6px;
  background: #E11D48;
  border-radius: 50%;
  border: 1px solid var(--bg-card);
}

.unread-pill {
  position: absolute;
  top: 3px;
  right: 2px;
  background: var(--brand-primary);
  color: #fff;
  font-size: 8.5px;
  font-weight: 800;
  min-width: 14px;
  height: 14px;
  padding: 0 2px;
  border-radius: var(--radius-full);
  display: grid;
  place-items: center;
  border: 1.5px solid var(--bg-card);
}

.unread-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  background: var(--brand-primary);
  border-radius: 50%;
  border: 1px solid var(--bg-card);
}

.architecture-btn {
  color: #7C3AED;
}

.architecture-btn:hover {
  background: #EDE7F6;
  color: #6D28D9;
}

.live-status-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 6.5px;
  height: 6.5px;
  background: #10B981;
  border-radius: 50%;
  border: 1.5px solid var(--bg-card);
  box-shadow: 0 0 4px #10B981;
}
</style>
