<template>
  <div class="mobile-app-root">
    <!-- Main App Container (Clean Web Shell / Clinic Portal Expandable) -->
    <div class="mobile-container" :class="{ 'clinic-rx-expanded': currentTab === 'clinic-rx' }">
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
        <ClinicRxView v-else-if="currentTab === 'clinic-rx'" />
        <MessagesView v-else-if="currentTab === 'messages'" />
        <NotificationsView v-else-if="currentTab === 'activity'" />
        <ProfileView v-else-if="currentTab === 'profile'" />
        <SettingsView v-else-if="currentTab === 'settings'" />
      </div>

      <!-- Bottom Navigation -->
      <BottomNav v-if="currentTab !== 'auth' && currentTab !== 'clinic-rx'" />

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
import ClinicRxView from './views/ClinicRxView.vue';
import MessagesView from './views/MessagesView.vue';
import NotificationsView from './views/NotificationsView.vue';
import ProfileView from './views/ProfileView.vue';
import SettingsView from './views/SettingsView.vue';

import { onMounted } from 'vue';
import { currentTab, initSupabaseAuthListener, syncLiveBackendData } from './stores/appStore';

onMounted(() => {
  initSupabaseAuthListener();
  syncLiveBackendData();
  if (typeof window !== 'undefined') {
    (window as any).setAppTab = (t: any) => { currentTab.value = t; };
  }
});
</script>

<style scoped>
.mobile-app-root {
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: stretch;
  background-color: var(--bg-stage);
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(186, 167, 248, 0.22) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(148, 125, 238, 0.16) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(253, 251, 254, 0.6) 0%, transparent 60%);
  overflow: hidden;
}

:global([data-theme='dark']) .mobile-app-root {
  background-color: #0c0816;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(85, 60, 145, 0.25) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(65, 45, 115, 0.2) 0%, transparent 45%);
}

.mobile-container {
  width: 100%;
  max-width: 425px; /* Strictly locked in phone mode */
  height: 100vh;
  height: -webkit-fill-available;
  height: 100dvh;
  background: var(--bg-app-textured);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-left: 1px solid var(--border-subtle);
  border-right: 1px solid var(--border-subtle);
  box-shadow: 0 0 45px rgba(45, 25, 80, 0.08);
  margin: 0 auto;
}

:global([data-theme='dark']) .mobile-container {
  border-color: rgba(169, 149, 246, 0.18);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.6);
}

.screen-viewport {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}
</style>
