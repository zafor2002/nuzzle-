<template>
  <div class="mobile-app-root">
    <!-- Main App Container (True Mobile Shell) -->
    <div class="mobile-container">
      <!-- Status Bar for real mobile look -->
      <div class="mobile-statusbar">
        <span class="status-time">9:41</span>
        <div class="notch-island"></div>
        <div class="status-indicators">
          <span>5G</span>
          <span class="battery-icon">100% 🔋</span>
        </div>
      </div>

      <!-- Active Screen Viewport -->
      <div class="screen-viewport">
        <AuthView v-if="currentTab === 'auth'" />
        <FeedView v-else-if="currentTab === 'feed'" />
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
      <BottomNav v-if="currentTab !== 'reels' && currentTab !== 'auth'" />

      <!-- Overlays & Modals -->
      <StoryViewerModal />
      <CommentsModal />
      <ChatWindowModal />
      <CreateSheetModal />
      <ProUpgradeModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import BottomNav from './components/layout/BottomNav.vue';
import StoryViewerModal from './components/feed/StoryViewerModal.vue';
import CommentsModal from './components/feed/CommentsModal.vue';
import ChatWindowModal from './components/chat/ChatWindowModal.vue';
import CreateSheetModal from './components/create/CreateSheetModal.vue';
import ProUpgradeModal from './components/subscription/ProUpgradeModal.vue';

// Views
import AuthView from './views/AuthView.vue';
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

import { onMounted } from 'vue';
import { currentTab, initSupabaseAuthListener } from './stores/appStore';

onMounted(() => {
  initSupabaseAuthListener();
});
</script>

<style scoped>
.mobile-app-root {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-stage);
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(186, 167, 248, 0.35) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(148, 125, 238, 0.25) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(253, 251, 254, 0.6) 0%, transparent 60%);
  overflow: hidden;
}

.mobile-container {
  width: 100%;
  max-width: 440px;
  height: 100%;
  max-height: 920px;
  background: var(--bg-app-textured);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 25px 60px -10px rgba(45, 25, 80, 0.25),
    0 10px 30px rgba(148, 125, 238, 0.15);
}

@media (min-width: 441px) {
  .mobile-container {
    height: calc(100vh - 24px);
    border-radius: 40px;
    border: 8px solid #D8CDF2;
    box-shadow: 
      0 30px 70px rgba(45, 25, 80, 0.3),
      0 0 0 2px #EDE4FA;
  }
}

.mobile-statusbar {
  height: 40px;
  padding: 8px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-primary);
  z-index: 100;
  flex-shrink: 0;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.notch-island {
  width: 110px;
  height: 24px;
  background: #1C152B;
  border-radius: 20px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
}

.status-indicators {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.screen-viewport {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
