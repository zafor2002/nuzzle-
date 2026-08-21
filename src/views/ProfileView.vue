<template>
  <div class="profile-view">
    <!-- Top Header -->
    <header class="app-header profile-header">
      <div class="header-username">
        <span class="user-handle">@{{ currentProfileHandle }}</span>
      </div>

      <div class="header-actions">
        <button class="btn-icon" @click="setTab('settings')" title="Settings">
          <Settings :size="20" />
        </button>
      </div>
    </header>

    <div class="profile-scroll-body">
      <!-- Profile Persona Switcher (Owner vs Pets) -->
      <div class="persona-switcher-bar">
        <button 
          class="persona-tab"
          :class="{ active: activeProfileId === 'owner_me' }"
          @click="activeProfileId = 'owner_me'"
        >
          <img :src="owner.avatarUrl" :alt="owner.displayName" class="persona-avatar" />
          <span>{{ owner.displayName.split(' ')[0] }} (Owner)</span>
        </button>

        <button 
          v-for="p in pets" 
          :key="p.id"
          class="persona-tab"
          :class="{ active: activeProfileId === p.id }"
          @click="activeProfileId = p.id"
        >
          <img :src="p.avatarUrl" :alt="p.name" class="persona-avatar" />
          <span>🐾 {{ p.name }}</span>
        </button>
      </div>

      <!-- Anonymity / Ghost Mode Banner -->
      <div class="anonymity-card card-item">
        <div class="anon-text-col">
          <div class="anon-badge-line">
            <EyeOff :size="15" class="anon-icon" />
            <span class="anon-title">Anonymous Mode</span>
          </div>
          <p class="anon-explain">
            Hides your real name & photo across public posts.
          </p>
        </div>

        <div 
          class="toggle-switch" 
          :class="{ active: isCurrentAnonymous }"
          @click="toggleAnonymity"
        >
          <div class="toggle-thumb"></div>
        </div>
      </div>

      <!-- Main Profile Bio & Numbers Card -->
      <div class="profile-hero-card card-item">
        <div class="hero-top-row">
          <div class="hero-avatar-wrapper">
            <img :src="currentAvatar" :alt="currentDisplayName" class="hero-avatar" />
            <div v-if="activePet" class="pet-star-badge">⭐</div>
          </div>

          <div class="stats-counts-group">
            <div class="count-box">
              <span class="c-num">{{ currentPostsCount }}</span>
              <span class="c-label">Posts</span>
            </div>
            <div class="count-box">
              <span class="c-num">{{ currentFollowersCount }}</span>
              <span class="c-label">Followers</span>
            </div>
            <div class="count-box">
              <span class="c-num">{{ currentFollowingCount }}</span>
              <span class="c-label">Following</span>
            </div>
          </div>
        </div>

        <!-- Names & Bio -->
        <div class="hero-bio-section">
          <h3 class="hero-name">{{ currentDisplayName }}</h3>
          <span v-if="activePet" class="hero-subtitle">{{ activePet.species }} • {{ activePet.breed }} • Age: {{ activePet.age }}</span>
          <span v-else class="hero-subtitle">Pet Parent • Dhaka, Bangladesh</span>

          <p class="hero-bio-text">
            {{ currentBio }}
          </p>

          <!-- Pet Verified Passport Badge (when in Pet View) -->
          <div v-if="activePet" class="pet-passport-summary-badge" @click="setTab('health')">
            <div class="pass-badge-left">
              <span class="pass-tag-chip">🪪 VERIFIED PASSPORT</span>
              <span class="pass-chip-no">{{ activePet.microchipId || 'CHIP: 985-1410-0921-334' }}</span>
            </div>
            <div class="pass-badge-right">
              <span class="pass-view-btn">View Official Passport →</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="profile-buttons-row">
          <button v-if="activePet" class="btn-primary profile-btn" @click="setTab('health')">
            <Activity :size="15" />
            <span>Digital Health Passport</span>
          </button>
          <button v-else class="btn-primary profile-btn" @click="isCreateSheetOpen = true">
            <Plus :size="15" />
            <span>New Post</span>
          </button>

          <button class="btn-secondary profile-btn" @click="setTab('settings')">
            <Edit :size="14" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <!-- Pets Roster (when in Owner View) -->
      <div v-if="!activePet" class="pets-roster-section">
        <div class="roster-head">
          <h4 class="roster-title">🐾 Alex's Pets ({{ pets.length }})</h4>
          <button class="add-pet-link" @click="addDemoPet">+ Add Pet</button>
        </div>

        <div class="pets-cards-scroll">
          <div 
            v-for="p in pets" 
            :key="p.id"
            class="pet-summary-card"
            @click="activeProfileId = p.id"
          >
            <img :src="p.avatarUrl" :alt="p.name" class="p-thumb" />
            <span class="p-name">{{ p.name }}</span>
            <span class="p-breed">{{ p.breed }}</span>
          </div>
        </div>
      </div>

      <!-- Media & Posts Grid Tabs -->
      <div class="profile-media-tabs">
        <button class="p-tab-btn active">
          <Grid :size="18" />
          <span>Posts ({{ currentPostsCount }})</span>
        </button>
        <button class="p-tab-btn">
          <Bookmark :size="18" />
          <span>Saved</span>
        </button>
      </div>

      <!-- Grid Photos -->
      <div class="profile-posts-grid">
        <div 
          v-for="(img, idx) in userGridImages" 
          :key="idx"
          class="grid-photo-cell"
        >
          <img :src="img" alt="Post" class="grid-img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Settings, EyeOff, Activity, Plus, Edit, Grid, Bookmark } from 'lucide-vue-next';
import { 
  owner, 
  pets, 
  activeProfileId, 
  activePet, 
  setTab, 
  isCreateSheetOpen 
} from '../stores/appStore';

const currentProfileHandle = computed(() => {
  if (activePet.value) return activePet.value.name.toLowerCase() + '_official';
  return owner.username;
});

const currentDisplayName = computed(() => {
  if (activePet.value) return activePet.value.name;
  return owner.displayName;
});

const currentAvatar = computed(() => {
  if (activePet.value) return activePet.value.avatarUrl;
  return owner.avatarUrl;
});

const currentBio = computed(() => {
  if (activePet.value) return activePet.value.bio || 'Happy pet on PetSocial!';
  return owner.bio || 'Pet lover on PetSocial!';
});

const currentPostsCount = computed(() => {
  if (activePet.value) return activePet.value.postsCount;
  return 48;
});

const currentFollowersCount = computed(() => {
  if (activePet.value) return activePet.value.followersCount;
  return owner.followersCount;
});

const currentFollowingCount = computed(() => {
  if (activePet.value) return 42;
  return owner.followingCount;
});

const isCurrentAnonymous = computed(() => {
  if (activePet.value) return activePet.value.isAnonymous;
  return owner.isAnonymous;
});

function toggleAnonymity() {
  if (activePet.value) {
    activePet.value.isAnonymous = !activePet.value.isAnonymous;
  } else {
    owner.isAnonymous = !owner.isAnonymous;
  }
}

function addDemoPet() {
  const newPet = {
    id: `pet_${Date.now()}`,
    ownerId: owner.id,
    name: 'Pepper',
    species: 'Dog' as const,
    breed: 'Australian Shepherd',
    bio: 'Speedy frisbee catcher! 🥏',
    age: '6 mos',
    avatarUrl: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    postsCount: 1,
    followersCount: 12
  };
  pets.push(newPet);
  activeProfileId.value = newPet.id;
}

const userGridImages = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80'
];
</script>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-handle {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-primary);
}

.profile-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.persona-switcher-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 12px;
}

.persona-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px 8px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-secondary);
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.persona-tab.active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: #fff;
  box-shadow: 0 3px 8px rgba(244, 145, 92, 0.3);
}

.persona-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.anonymity-card {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  background: var(--bg-card-subtle);
  border-color: var(--border-strong);
}

.anon-badge-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.anon-icon {
  color: var(--ink-muted);
}

.anon-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--ink-primary);
}

.anon-explain {
  font-size: 11px;
  color: var(--ink-muted);
}

.profile-hero-card {
  padding: 16px;
  margin-bottom: 14px;
}

.hero-top-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-avatar-wrapper {
  position: relative;
}

.hero-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.pet-star-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #F59E0B;
  color: #fff;
  font-size: 11px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid var(--bg-card);
}

.stats-counts-group {
  flex: 1;
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.count-box {
  display: flex;
  flex-direction: column;
}

.c-num {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-primary);
}

.c-label {
  font-size: 11px;
  color: var(--ink-muted);
}

.hero-bio-section {
  margin: 12px 0 14px;
}

.hero-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-primary);
}

.hero-subtitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-primary);
  display: block;
  margin-bottom: 4px;
}

.hero-bio-text {
  font-size: 13px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.profile-buttons-row {
  display: flex;
  gap: 8px;
}

.profile-btn {
  flex: 1;
  padding: 8px 0;
  font-size: 13px;
}

.pets-roster-section {
  margin-bottom: 14px;
}

.roster-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.roster-title {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.add-pet-link {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--brand-primary);
}

.pets-cards-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.pet-summary-card {
  flex-shrink: 0;
  width: 115px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.p-thumb {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 4px;
}

.p-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-primary);
}

.p-breed {
  font-size: 10px;
  color: var(--ink-muted);
  text-align: center;
}

.profile-media-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 8px;
}

.p-tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-muted);
  border-bottom: 2px solid transparent;
}

.p-tab-btn.active {
  color: var(--brand-primary);
  border-bottom-color: var(--brand-primary);
}

.profile-posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.grid-photo-cell {
  aspect-ratio: 1 / 1;
}

.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Pet Verified Passport Summary Badge */
.pet-passport-summary-badge {
  margin-top: 10px;
  background: linear-gradient(135deg, rgba(148, 125, 238, 0.12), rgba(124, 58, 237, 0.08));
  border: 1px solid var(--brand-primary);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.pet-passport-summary-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
}

.pass-badge-left {
  display: flex;
  flex-direction: column;
}

.pass-tag-chip {
  font-size: 8.5px;
  font-weight: 800;
  color: var(--brand-dark);
  letter-spacing: 0.05em;
}

.pass-chip-no {
  font-size: 11px;
  font-weight: 800;
  font-family: monospace;
  color: var(--ink-primary);
}

.pass-view-btn {
  font-size: 11px;
  font-weight: 800;
  color: var(--brand-dark);
}
</style>
