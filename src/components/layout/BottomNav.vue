<template>
  <nav class="bottom-nav">
    <button class="nav-tab-btn" :class="{ active: currentTab === 'feed' }" @click="setTab('feed')">
      <Home class="nav-tab-icon" />
      <span>Den</span>
    </button>

    <button class="nav-tab-btn" :class="{ active: currentTab === 'explore' }" @click="setTab('explore')">
      <Trees class="nav-tab-icon" />
      <span>Park</span>
    </button>

    <!-- Center FAB -->
    <div class="fab-wrapper">
      <button class="fab-create-btn" @click="isCreateSheetOpen = true" title="Create Post">
        <Plus :size="26" />
      </button>
    </div>

    <!-- PawAI Tab -->
    <button class="nav-tab-btn ai-tab" :class="{ active: currentTab === 'ai' }" @click="setTab('ai')">
      <div class="ai-icon-holder" :class="{ active: currentTab === 'ai' }">
        <Sparkles class="nav-tab-icon ai-sparkle" />
      </div>
      <span class="ai-label" :class="{ active: currentTab === 'ai' }">PawAI</span>
    </button>

    <button class="nav-tab-btn" :class="{ active: currentTab === 'profile' }" @click="setTab('profile')">
      <div class="profile-nav-avatar" :class="{ active: currentTab === 'profile' }">
        <img :src="owner.avatarUrl" :alt="owner.displayName" />
      </div>
      <span>Profile</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { Home, Trees, Plus, Sparkles } from 'lucide-vue-next';
import { currentTab, setTab, isCreateSheetOpen, owner } from '../../stores/appStore';
</script>

<style scoped>
.fab-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

/* AI Tab */
.ai-tab .ai-label {
  color: var(--ink-muted);
  transition: all 0.18s ease;
}

.ai-tab .ai-label.active {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.ai-icon-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.18s ease;
  color: var(--ink-muted);
}

.ai-icon-holder.active {
  color: var(--brand-dark);
}

.ai-sparkle {
  color: inherit;
}

/* Profile avatar */
.profile-nav-avatar {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.18s ease;
}

.profile-nav-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-nav-avatar.active {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 1px var(--brand-primary);
}
</style>
