<template>
  <div class="mobile-app-root">
    <div class="mobile-container">
      <!-- Status Bar -->
      <div class="mobile-statusbar">
        <span class="status-time">9:41</span>
        <div class="notch-island"></div>
        <div class="status-indicators">
          <span>5G</span>
          <span class="battery-icon">🔋</span>
        </div>
      </div>

      <!-- Screen Viewport -->
      <div class="screen-viewport">
        <FeedView v-if="currentTab === 'feed'" />
        <ExploreView v-else-if="currentTab === 'explore'" />
        <PawAIView v-else-if="currentTab === 'ai'" />
        <ReelsView v-else-if="currentTab === 'reels'" />
        <LostFoundView v-else-if="currentTab === 'lostfound'" />
        <AdoptionView v-else-if="currentTab === 'adoption'" />
        <MarketplaceView v-else-if="currentTab === 'market'" />
        <VetBookingView v-else-if="currentTab === 'vets'" />
        <HealthLogsView v-else-if="currentTab === 'health'" />
        <MessagesView v-else-if="currentTab === 'messages'" />
        <NotificationsView v-else-if="currentTab === 'activity'" />
        <ProfileView v-else-if="currentTab === 'profile'" />
        <SettingsView v-else-if="currentTab === 'settings'" />
      </div>

      <!-- Bottom Navigation -->
      <BottomNav v-if="currentTab !== 'reels'" />

      <!-- Overlays & Modals -->
      <StoryViewerModal />
      <CommentsModal />
      <ChatWindowModal />
      <CreateSheetModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import BottomNav from './components/layout/BottomNav.vue';
import StoryViewerModal from './components/feed/StoryViewerModal.vue';
import CommentsModal from './components/feed/CommentsModal.vue';
import ChatWindowModal from './components/chat/ChatWindowModal.vue';
import CreateSheetModal from './components/create/CreateSheetModal.vue';

import FeedView from './views/FeedView.vue';
import ExploreView from './views/ExploreView.vue';
import PawAIView from './views/PawAIView.vue';
import ReelsView from './views/ReelsView.vue';
import LostFoundView from './views/LostFoundView.vue';
import AdoptionView from './views/AdoptionView.vue';
import MarketplaceView from './views/MarketplaceView.vue';
import VetBookingView from './views/VetBookingView.vue';
import HealthLogsView from './views/HealthLogsView.vue';
import MessagesView from './views/MessagesView.vue';
import NotificationsView from './views/NotificationsView.vue';
import ProfileView from './views/ProfileView.vue';
import SettingsView from './views/SettingsView.vue';

import { currentTab } from './stores/appStore';
</script>

<style scoped>
.mobile-app-root {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #D8D0F2, #EDE7F6);
  overflow: hidden;
}

.mobile-container {
  width: 100%;
  max-width: 440px;
  height: 100%;
  max-height: 920px;
  background-color: var(--bg-app);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 30px 60px rgba(124, 58, 237, 0.22),
    0 0 0 1px rgba(148, 125, 238, 0.3);
}

@media (min-width: 441px) {
  .mobile-container {
    height: calc(100vh - 24px);
    border-radius: 46px;
    border: 8px solid #EDE7F6;
    box-shadow:
      0 40px 80px rgba(124, 58, 237, 0.3),
      0 0 0 2px rgba(148, 125, 238, 0.4);
  }
}

.mobile-statusbar {
  height: 40px;
  padding: 8px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-primary);
  z-index: 100;
  flex-shrink: 0;
  background: var(--bg-header);
}

.status-time {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 800;
  color: var(--brand-dark);
}

.notch-island {
  width: 110px;
  height: 24px;
  background: var(--ink-primary);
  border-radius: 20px;
  opacity: 0.85;
}

.status-indicators {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--ink-secondary);
}

.battery-icon {
  font-size: 12px;
}

.screen-viewport {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
