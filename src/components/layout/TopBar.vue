<template>
  <header class="app-header">
    <div class="header-left">
      <button v-if="showBackButton" class="btn-icon" @click="goBack" title="Back">
        <ArrowLeft :size="20" />
      </button>

      <div v-else class="brand-badge" @click="setTab('feed')">
        <div class="brand-icon-wrapper">
          <PawPrint :size="16" class="brand-paw" />
        </div>
        <span class="brand-text">Nuzzle</span>
      </div>

      <div v-if="owner.isAnonymous" class="anon-pill" title="Anonymous mode active">
        <EyeOff :size="11" />
        <span>Ghost</span>
      </div>
    </div>

    <!-- Center PawAI Quick Pill -->
    <div v-if="!showBackButton" class="header-center-ai" @click="setTab('ai')">
      <div class="pawai-quick-pill">
        <Sparkles :size="12" class="ai-sparkle-spin" />
        <span>PawAI</span>
      </div>
    </div>

    <div class="header-title" v-else-if="title">{{ title }}</div>

    <div class="header-actions">
      <button class="action-btn" @click="setTab('lostfound')" title="Emergency Radar">
        <AlertTriangle :size="19" class="alert-icon" />
        <span class="badge-dot pulse"></span>
      </button>

      <button class="action-btn" @click="setTab('messages')" title="Messages">
        <MessageCircle :size="20" />
        <span v-if="unreadMessagesCount > 0" class="badge-count">{{ unreadMessagesCount }}</span>
      </button>

      <button class="action-btn" @click="setTab('activity')" title="Notifications">
        <Bell :size="20" />
        <span v-if="unreadNotificationsCount > 0" class="badge-count">{{ unreadNotificationsCount }}</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PawPrint, MessageCircle, Bell, AlertTriangle, ArrowLeft, EyeOff, Sparkles } from 'lucide-vue-next';
import { currentTab, setTab, owner, unreadMessagesCount, unreadNotificationsCount } from '../../stores/appStore';

const props = defineProps<{
  title?: string;
  canGoBack?: boolean;
}>();

const showBackButton = computed(() => {
  return props.canGoBack || !['feed', 'explore', 'ai', 'reels', 'profile'].includes(currentTab.value);
});

function goBack() {
  setTab('feed');
}
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  user-select: none;
}

.brand-icon-wrapper {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-dark));
  display: grid;
  place-items: center;
  color: #fff;
  box-shadow: 0 3px 10px rgba(124, 58, 237, 0.3);
}

.brand-paw {
  transform: rotate(-12deg);
}

.brand-text {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 19px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.anon-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-strong);
  color: var(--ink-secondary);
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.header-center-ai {
  cursor: pointer;
}

.pawai-quick-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-dark));
  color: #fff;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 800;
  box-shadow: 0 2px 10px rgba(124, 58, 237, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.pawai-quick-pill:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.5);
}

.ai-sparkle-spin {
  color: #FDE047;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.header-title {
  font-weight: 700;
  font-size: 15px;
  color: var(--ink-primary);
  text-align: center;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: var(--ink-secondary);
  position: relative;
  transition: background 0.15s ease, color 0.15s ease;
}

.action-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--brand-dark);
}

.alert-icon {
  color: var(--accent-rose);
}

.badge-count {
  position: absolute;
  top: 3px;
  right: 3px;
  background: var(--accent-rose);
  color: #fff;
  font-size: 9.5px;
  font-weight: 800;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 2px solid var(--bg-header);
}

.badge-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-rose);
  border: 1.5px solid var(--bg-header);
}

.pulse {
  animation: pulseAnim 1.6s infinite;
}

@keyframes pulseAnim {
  0% { transform: scale(0.95); opacity: 1; }
  50% { transform: scale(1.35); opacity: 0.7; }
  100% { transform: scale(0.95); opacity: 1; }
}
</style>
