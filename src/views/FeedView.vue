<template>
  <div class="feed-view">
    <TopBar />

    <div class="feed-scroll-body">
      <!-- Stories Pods Tray -->
      <StoryTray />

      <!-- Species / Pack Filter Chips -->
      <div class="pet-species-filter-bar">
        <button 
          v-for="filter in speciesFilters" 
          :key="filter.id"
          class="species-filter-chip"
          :class="{ active: activeSpeciesFilter === filter.id }"
          @click="selectSpeciesFilter(filter.id)"
        >
          <span class="chip-icon">{{ filter.icon }}</span>
          <span class="chip-label">{{ filter.label }}</span>
        </button>
      </div>

      <!-- Emergency Alert Banner if any active lost pet -->
      <div v-if="activeLostPet" class="emergency-banner" @click="setTab('lostfound')">
        <div class="alert-pulse-circle">🚨</div>
        <div class="alert-banner-text">
          <span class="alert-title">Emergency Radar: Lost {{ activeLostPet.species }} ({{ activeLostPet.petName }})</span>
          <span class="alert-subtitle">{{ activeLostPet.location }} • Tap to dispatch help</span>
        </div>
      </div>

      <!-- Posts List -->
      <div class="posts-feed-container">
        <PostCard 
          v-for="post in filteredFeedPosts" 
          :key="post.id" 
          :post="post" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TopBar from '../components/layout/TopBar.vue';
import StoryTray from '../components/feed/StoryTray.vue';
import PostCard from '../components/feed/PostCard.vue';
import { activePosts, lostFoundList, setTab } from '../stores/appStore';
import { postService } from '../services';

const activeSpeciesFilter = ref('all');

function selectSpeciesFilter(id: string) {
  activeSpeciesFilter.value = id;
  postService.getFeed({ species: id === 'all' ? undefined : id }).catch(() => {});
}

const speciesFilters = [
  { id: 'all', label: 'All Pets', icon: '🐾' },
  { id: 'dog', label: 'Canines', icon: '🐕' },
  { id: 'cat', label: 'Felines', icon: '🐱' },
  { id: 'bird', label: 'Aviary', icon: '🦜' },
  { id: 'bunny', label: 'Bunnies', icon: '🐰' },
];

const activeLostPet = computed(() => {
  return lostFoundList.find(p => p.status === 'lost' && !p.isResolved) || null;
});

const filteredFeedPosts = computed(() => {
  if (activeSpeciesFilter.value === 'all') return activePosts.value;
  return activePosts.value.filter(post => {
    const breed = (post.petBreed || '').toLowerCase();
    const caption = (post.caption || '').toLowerCase();
    const text = breed + ' ' + caption;
    if (activeSpeciesFilter.value === 'dog') {
      return text.includes('dog') || text.includes('corgi') || text.includes('golden') || text.includes('frenchie') || text.includes('husky');
    }
    if (activeSpeciesFilter.value === 'cat') {
      return text.includes('cat') || text.includes('persian') || text.includes('bengal') || text.includes('kitten');
    }
    if (activeSpeciesFilter.value === 'bird') {
      return text.includes('bird') || text.includes('parrot') || text.includes('conure') || text.includes('kiwi');
    }
    if (activeSpeciesFilter.value === 'bunny') {
      return text.includes('bun') || text.includes('rabbit') || text.includes('lop');
    }
    return true;
  });
});
</script>

<style scoped>
.feed-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.feed-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 84px;
}

.pet-species-filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  overflow-x: auto;
  scrollbar-width: none;
}

.pet-species-filter-bar::-webkit-scrollbar {
  display: none;
}

.species-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-subtle);
  color: var(--ink-secondary);
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.species-filter-chip:hover {
  background: #F3EEFF;
  border-color: #D5C8F2;
  transform: translateY(-1px);
}

.species-filter-chip.active {
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.chip-icon {
  font-size: 13px;
}

.emergency-banner {
  margin: 4px 14px 8px;
  background: linear-gradient(135deg, #FFF1F2, #FFE4E6);
  border: 1.5px solid #FDA4AF;
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(244, 63, 94, 0.12);
  transition: transform 0.15s ease;
}

.emergency-banner:active {
  transform: scale(0.98);
}

.alert-pulse-circle {
  font-size: 20px;
  animation: bounce 1.8s infinite;
}

.alert-banner-text {
  display: flex;
  flex-direction: column;
}

.alert-title {
  font-size: 13px;
  font-weight: 800;
  color: #9F1239;
}

.alert-subtitle {
  font-size: 11.5px;
  color: #BE123C;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.posts-feed-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
