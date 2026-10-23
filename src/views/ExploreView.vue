<template>
  <div class="explore-view">
    <TopBar title="Explore & Communities" />

    <div class="explore-scroll-body">
      <!-- Search Bar -->
      <div class="search-bar-wrapper">
        <div class="search-input-box">
          <Search :size="18" class="search-icon" />
          <input 
            v-model="searchQuery" 
            placeholder="Search pets, breeds, #hashtags, owners..." 
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
            <X :size="16" />
          </button>
        </div>
      </div>

      <!-- Category Filter Chips -->
      <div class="filter-chips-row">
        <button 
          v-for="cat in categories" 
          :key="cat"
          class="filter-chip"
          :class="{ active: selectedCategory === cat }"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Minimal Ecosystem Quick Hub -->
      <div class="quick-hub-row">
        <button class="hub-pill" id="explore-market-btn" @click="setTab('market')">
          <div class="hub-icon-box hub-market">
            <ShoppingBag :size="16" />
          </div>
          <div class="hub-info">
            <span class="hub-title">Market</span>
            <span class="hub-caption">Supplies</span>
          </div>
        </button>

        <button class="hub-pill" id="explore-adoption-btn" @click="setTab('adoption')">
          <div class="hub-icon-box hub-adoption">
            <HeartHandshake :size="16" />
          </div>
          <div class="hub-info">
            <span class="hub-title">Adoption</span>
            <span class="hub-caption">Rescues</span>
          </div>
        </button>

        <button class="hub-pill" id="explore-reels-btn" @click="setTab('reels')">
          <div class="hub-icon-box hub-reels">
            <Film :size="16" />
          </div>
          <div class="hub-info">
            <span class="hub-title">Reels</span>
            <span class="hub-caption">Clips</span>
          </div>
        </button>
      </div>

      <!-- Trending Hashtags Section -->
      <div class="section-container">
        <div class="section-head">
          <h3 class="section-title">🔥 Trending Topics</h3>
          <span class="view-all-link">See all</span>
        </div>

        <div class="trending-tags-grid">
          <div 
            v-for="item in exploreTrendingTags" 
            :key="item.tag"
            class="trending-tag-card"
            @click="filterByTag(item.tag)"
          >
            <span class="tag-icon">{{ item.icon }}</span>
            <div class="tag-info">
              <span class="tag-name">#{{ item.tag }}</span>
              <span class="tag-count">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Breed & Species Communities -->
      <div class="section-container">
        <div class="section-head">
          <h3 class="section-title">🐾 Breed & Species Clubs</h3>
          <span class="view-all-link">5 Clubs</span>
        </div>

        <div class="communities-scroll">
          <div 
            v-for="comm in speciesCommunities" 
            :key="comm.id" 
            class="community-card"
          >
            <div class="comm-avatar" :style="{ backgroundColor: comm.color }">
              {{ comm.avatar }}
            </div>
            <span class="comm-name">{{ comm.name }}</span>
            <span class="comm-members">{{ comm.members }}</span>
            <button 
              class="join-btn"
              :class="{ joined: joinedCommunities.includes(comm.id) }"
              @click="toggleJoinCommunity(comm.id)"
            >
              {{ joinedCommunities.includes(comm.id) ? 'Joined ✓' : '+ Join' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Explore Media Grid -->
      <div class="section-container">
        <div class="section-head">
          <h3 class="section-title">✨ Popular Pet Moments</h3>
        </div>

        <div class="explore-masonry-grid">
          <div 
            v-for="(img, idx) in exploreImages" 
            :key="idx" 
            class="grid-tile"
            :class="{ featured: idx === 0 || idx === 7 }"
            @click="setTab('feed')"
          >
            <img :src="img" alt="Explore pet" class="grid-img" />
            <div class="tile-overlay">
              <Heart :size="16" fill="#fff" color="#fff" />
              <span class="like-label">{{ Math.floor(Math.random() * 400 + 100) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, X, Heart, ShoppingBag, HeartHandshake, Film } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { exploreTrendingTags, speciesCommunities } from '../data/mockData';
import { searchQuery, activeHashtag, setTab } from '../stores/appStore';

import { postService } from '../services';

const selectedCategory = ref('All');
const categories = ['All', '🐕 Dogs', '🐱 Cats', '🐰 Bunnies', '🦜 Birds', '🏥 Health', '🐾 Adoption'];

function selectCategory(cat: string) {
  selectedCategory.value = cat;
  if (cat === '🐾 Adoption') {
    setTab('adoption');
    return;
  }
  const clean = cat === 'All' ? undefined : cat.replace(/[^a-zA-Z]/g, '').toLowerCase();
  postService.getFeed({ species: clean }).catch(() => {});
}

const joinedCommunities = ref<string[]>(['comm_1']);

function toggleJoinCommunity(id: string) {
  if (joinedCommunities.value.includes(id)) {
    joinedCommunities.value = joinedCommunities.value.filter(c => c !== id);
  } else {
    joinedCommunities.value.push(id);
  }
}

function filterByTag(tag: string) {
  activeHashtag.value = tag;
  setTab('feed');
}

const exploreImages = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=500&auto=format&fit=crop&q=80'
];
</script>

<style scoped>
.explore-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.explore-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: calc(96px + env(safe-area-inset-bottom, 16px));
}

/* Minimal Ecosystem Quick Hub */
.quick-hub-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 4px 16px 12px;
}

.hub-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md, 12px);
  cursor: pointer;
  text-align: left;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.hub-pill:hover {
  transform: translateY(-1px);
  border-color: var(--brand-primary);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.hub-pill:active {
  transform: translateY(0);
}

.hub-icon-box {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.hub-pill:hover .hub-icon-box {
  transform: scale(1.06);
}

.hub-market {
  background: rgba(245, 158, 11, 0.12);
  color: #D97706;
}

:global([data-theme='dark']) .hub-market {
  background: rgba(245, 158, 11, 0.2);
  color: #FBBF24;
}

.hub-adoption {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

:global([data-theme='dark']) .hub-adoption {
  background: rgba(16, 185, 129, 0.2);
  color: #34D399;
}

.hub-reels {
  background: rgba(236, 72, 153, 0.12);
  color: #DB2777;
}

:global([data-theme='dark']) .hub-reels {
  background: rgba(236, 72, 153, 0.2);
  color: #F472B6;
}

.hub-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.hub-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-primary);
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hub-caption {
  font-size: 10px;
  font-weight: 500;
  color: var(--ink-muted);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.search-bar-wrapper {
  padding: 10px 16px 4px;
}

.search-input-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 8px 16px;
  box-shadow: var(--shadow-sm);
}

.search-icon {
  color: var(--ink-muted);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13.5px;
  color: var(--ink-primary);
}

.clear-btn {
  color: var(--ink-muted);
}

.section-container {
  padding: 14px 16px 4px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.view-all-link {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-primary);
  cursor: pointer;
}

.trending-tags-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.trending-tag-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.trending-tag-card:hover {
  border-color: var(--brand-primary);
  transform: translateY(-1px);
}

.tag-icon {
  font-size: 18px;
}

.tag-info {
  display: flex;
  flex-direction: column;
}

.tag-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-primary);
}

.tag-count {
  font-size: 11px;
  color: var(--ink-muted);
}

.communities-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 4px 0 10px;
}

.communities-scroll::-webkit-scrollbar {
  display: none;
}

.community-card {
  flex-shrink: 0;
  width: 145px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.community-card:hover {
  border-color: var(--brand-primary);
  transform: translateY(-2px);
}

.comm-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 20px;
  margin-bottom: 8px;
}

.comm-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-primary);
  line-height: 1.3;
  height: 32px;
  display: flex;
  align-items: center;
}

.comm-members {
  font-size: 10.5px;
  color: var(--ink-muted);
  margin-bottom: 10px;
}

.join-btn {
  width: 100%;
  padding: 6px 0;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-strong);
  color: var(--ink-primary);
  transition: all 0.15s ease;
}

.join-btn.joined {
  background: var(--accent-emerald-soft);
  border-color: var(--accent-emerald);
  color: var(--accent-emerald);
}

.explore-masonry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.grid-tile {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
}

.grid-tile.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.grid-tile:hover .grid-img {
  transform: scale(1.05);
}

.tile-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.grid-tile:hover .tile-overlay {
  opacity: 1;
}

</style>
