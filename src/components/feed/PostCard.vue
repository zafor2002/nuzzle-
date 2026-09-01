<template>
  <article class="nuzzle-clean-card">
    <!-- 1. Crisp Pet Header -->
    <header class="card-header">
      <div class="author-cell" @click="handleProfileClick">
        <div class="avatar-ring">
          <img :src="post.petAvatar || post.ownerAvatar" :alt="post.petName || post.ownerName" class="avatar-img" @error="onAvatarError" />
          <span class="species-charm">{{ getSpeciesEmoji(post.petBreed) }}</span>
        </div>

        <div class="author-meta">
          <div class="name-row">
            <h4 class="pet-name">
              {{ post.petName || post.ownerName }}
              <span v-if="isAuthorPro" class="pro-crown-badge" title="Nuzzle Pro Member">👑</span>
            </h4>
            <span v-if="post.isAnonymous" class="ghost-badge">👻 Anon</span>
          </div>
          <span class="byline-row">{{ post.ownerName }} · {{ post.createdAt }}</span>
        </div>
      </div>

      <div class="header-tools">
        <span v-if="post.petMood" class="clean-mood-pill">{{ post.petMood }}</span>
        <button class="menu-icon-btn" title="Options">
          <MoreHorizontal :size="17" />
        </button>
      </div>
    </header>

    <!-- 2. Clean Media Frame -->
    <div class="media-container" @dblclick="handleDoubleTap">
      <img :src="post.mediaUrls[0]" :alt="post.caption" class="media-img" @error="onMediaError" />

      <!-- Minimal Location Stamp -->
      <div v-if="post.location" class="location-pill">
        <MapPin :size="10" />
        <span>{{ post.location }}</span>
      </div>

      <!-- Minimal Reaction Pop -->
      <transition name="fade-scale">
        <div v-if="burstReaction" class="reaction-pop-badge">
          <span class="burst-icon">{{ getReactionEmoji(burstReaction) }}</span>
        </div>
      </transition>
    </div>

    <!-- 3. Integrated Caption & Pet Thought -->
    <div class="card-content">
      <p class="caption-line">
        <strong class="guardian-author" @click="handleProfileClick">{{ post.ownerName }}</strong>
        {{ post.caption }}
      </p>

      <!-- Pet's Inner Thought -->
      <div v-if="post.petDialogue || getPetThought(post)" class="clean-pet-quote">
        <span class="quote-paw">🐾</span>
        <span class="quote-text">"{{ post.petDialogue || getPetThought(post) }}"</span>
      </div>

      <!-- Minimal Hashtags -->
      <div v-if="post.hashtags && post.hashtags.length" class="tags-row">
        <span 
          v-for="tag in post.hashtags" 
          :key="tag" 
          class="tag-item"
          @click="exploreTag(tag)"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- 4. Clean 1-Line Action Toolbar with Minimal Facebook Reaction Dock -->
    <footer class="card-action-bar">
      <div class="left-actions">
        <!-- Facebook-Style React Anchor -->
        <div 
          class="reaction-anchor" 
          @mouseleave="onMouseLeaveAnchor"
        >
          <!-- Floating Reaction Dock with Minimal Animation -->
          <transition name="dock-spring">
            <div 
              v-if="isDockOpen" 
              class="floating-react-dock"
              @mouseenter="onMouseEnterDock"
              @mouseleave="onMouseLeaveDock"
            >
              <button 
                class="dock-item" 
                @click="chooseReaction('paw')" 
                title="Paw Five"
              >
                <span class="dock-emoji">🐾</span>
              </button>
              <button 
                class="dock-item" 
                @click="chooseReaction('nuzzle')" 
                title="Nuzzle"
              >
                <span class="dock-emoji">💜</span>
              </button>
              <button 
                class="dock-item" 
                @click="chooseReaction('treat')" 
                title="Treat"
              >
                <span class="dock-emoji">🦴</span>
              </button>
              <button 
                class="dock-item" 
                @click="chooseReaction('ball')" 
                title="Fetch"
              >
                <span class="dock-emoji">🎾</span>
              </button>
              <button 
                class="dock-item" 
                @click="chooseReaction('purr')" 
                title="Purr"
              >
                <span class="dock-emoji">😻</span>
              </button>
            </div>
          </transition>

          <!-- Main React Trigger Pill -->
          <button 
            class="action-pill react-pill"
            :class="[
              post.selectedReaction ? `active-${post.selectedReaction}` : '',
              { isLiked: post.isLiked }
            ]"
            @click="handleMainReactClick"
            @mouseenter="onMouseEnterButton"
          >
            <span class="pill-emoji">{{ currentActiveEmoji }}</span>
            <span class="pill-count">{{ totalReactionsCount }}</span>
          </button>
        </div>

        <!-- Comments Pill -->
        <button class="action-pill" @click="openComments(post)" title="Comments">
          <MessageCircle :size="16" />
          <span class="pill-count">{{ post.commentsCount }}</span>
        </button>

        <!-- Share Button -->
        <button class="action-pill icon-only" @click="sharePost(post)" title="Share">
          <Send :size="15" />
        </button>
      </div>

      <!-- Save to Vault Bookmark -->
      <button 
        class="action-pill icon-only bookmark-btn" 
        :class="{ active: post.isSaved }" 
        @click="handleSave"
        title="Bookmark"
      >
        <Bookmark :size="16" :fill="post.isSaved ? 'currentColor' : 'none'" />
      </button>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MoreHorizontal, MessageCircle, Send, Bookmark, MapPin } from 'lucide-vue-next';
import type { Post, PetReactionType } from '../../types';
import { 
  reactToPost, 
  togglePostSave, 
  openComments, 
  activeProfileId, 
  setTab,
  owner
} from '../../stores/appStore';

const props = defineProps<{
  post: Post;
}>();

const isAuthorPro = computed(() => {
  if (props.post.ownerName === owner.displayName) {
    return !!owner.isProMember;
  }
  return props.post.id === 'post_1' || props.post.petName === 'Waffles';
});

const isDockOpen = ref(false);
const burstReaction = ref<PetReactionType | null>(null);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const totalReactionsCount = computed(() => {
  if (props.post.reactions) {
    const r = props.post.reactions;
    return (r.paw || 0) + (r.nuzzle || 0) + (r.treat || 0) + (r.ball || 0) + (r.purr || 0);
  }
  return props.post.likesCount || 0;
});

const currentActiveEmoji = computed(() => {
  if (!props.post.selectedReaction) return '🐾';
  return getReactionEmoji(props.post.selectedReaction);
});

function handleMainReactClick() {
  if (!isDockOpen.value) {
    isDockOpen.value = true;
  } else {
    const target = props.post.selectedReaction || 'paw';
    chooseReaction(target);
  }
}

function onMouseEnterButton() {
  clearTimer();
  isDockOpen.value = true;
}

function onMouseLeaveAnchor() {
  startCloseTimer();
}

function onMouseEnterDock() {
  clearTimer();
  isDockOpen.value = true;
}

function onMouseLeaveDock() {
  startCloseTimer();
}

function startCloseTimer() {
  clearTimer();
  closeTimer = setTimeout(() => {
    isDockOpen.value = false;
  }, 400);
}

function clearTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function chooseReaction(reaction: PetReactionType) {
  reactToPost(props.post.id, reaction);
  isDockOpen.value = false;
  triggerBurst(reaction);
}

function triggerBurst(reaction: PetReactionType) {
  burstReaction.value = reaction;
  setTimeout(() => {
    burstReaction.value = null;
  }, 650);
}

function handleDoubleTap() {
  const current = props.post.selectedReaction || 'nuzzle';
  chooseReaction(current);
}

function handleSave() {
  togglePostSave(props.post.id);
}

function handleProfileClick() {
  if (props.post.petId) {
    activeProfileId.value = props.post.petId;
  } else {
    activeProfileId.value = 'owner_me';
  }
  setTab('profile');
}

function exploreTag(_tag: string) {
  setTab('explore');
}

function sharePost(post: Post) {
  if (navigator.share) {
    navigator.share({
      title: `Nuzzle - ${post.petName || post.ownerName}'s post`,
      text: post.caption,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard! 🐾');
  }
}

function onAvatarError(e: Event) {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80';
  }
}

function onMediaError(e: Event) {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&auto=format&fit=crop&q=80';
  }
}

function getSpeciesEmoji(breed?: string): string {
  if (!breed) return '🐾';
  const b = breed.toLowerCase();
  if (b.includes('cat') || b.includes('kitten') || b.includes('persian') || b.includes('bengal')) return '🐱';
  if (b.includes('bird') || b.includes('parrot') || b.includes('kiwi')) return '🦜';
  if (b.includes('rabbit') || b.includes('bunny') || b.includes('lop')) return '🐰';
  return '🐕';
}

function getReactionEmoji(reaction: PetReactionType): string {
  switch (reaction) {
    case 'paw': return '🐾';
    case 'nuzzle': return '💜';
    case 'treat': return '🦴';
    case 'ball': return '🎾';
    case 'purr': return '😻';
    default: return '🐾';
  }
}

function getPetThought(post: Post): string {
  if (post.petDialogue) return post.petDialogue;
  const name = post.petName || 'I';
  if (post.caption.toLowerCase().includes('park') || post.caption.toLowerCase().includes('run')) {
    return `${name}: "Investigated 14 distinct smells at maximum speed!"`;
  }
  if (post.caption.toLowerCase().includes('nap') || post.caption.toLowerCase().includes('sleep')) {
    return `${name}: "Selected the sunniest carpet spot and declared it my kingdom."`;
  }
  if (post.caption.toLowerCase().includes('treat') || post.caption.toLowerCase().includes('food')) {
    return `${name}: "The human opened the snack cupboard. Puppy eyes deployed."`;
  }
  return `${name}: "Living my best life today. 10/10 would wag again!"`;
}
</script>

<style scoped>
.nuzzle-clean-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 18px;
  margin: 8px 12px 14px;
  overflow: visible;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  position: relative;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

/* 1. Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px 9px;
}

.author-cell {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
}

.avatar-ring {
  position: relative;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid var(--border-subtle);
}

.species-charm {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  display: grid;
  place-items: center;
  font-size: 8.5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.author-meta {
  display: flex;
  flex-direction: column;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pet-name {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
  letter-spacing: -0.01em;
}

.ghost-badge {
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: #7C3AED;
  padding: 1px 5px;
  border-radius: var(--radius-full);
}

.byline-row {
  font-size: 11px;
  color: var(--ink-muted);
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.clean-mood-pill {
  font-size: 10.5px;
  font-weight: 600;
  color: #6D28D9;
  background: #F3EEFF;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.menu-icon-btn {
  color: var(--ink-muted);
  padding: 4px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: all 0.15s ease;
}

.menu-icon-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--ink-primary);
}

/* 2. Media Frame */
.media-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--bg-card-subtle);
  overflow: hidden;
  user-select: none;
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.location-pill {
  position: absolute;
  top: 9px;
  left: 9px;
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(26, 18, 42, 0.7);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
}

/* Minimal Pop burst on double tap */
.reaction-pop-badge {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(148, 125, 238, 0.15);
  pointer-events: none;
}

.burst-icon {
  font-size: 48px;
  animation: popAnim 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes popAnim {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}

/* 3. Integrated Content */
.card-content {
  padding: 9px 14px 4px;
}

.caption-line {
  font-size: 13px;
  line-height: 1.45;
  color: var(--ink-primary);
}

.guardian-author {
  font-weight: 800;
  margin-right: 4px;
  cursor: pointer;
}

.clean-pet-quote {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  font-size: 12px;
  font-style: italic;
  color: #7C3AED;
}

.quote-paw {
  font-style: normal;
  font-size: 11px;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.tag-item {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--brand-primary);
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.tag-item:hover {
  opacity: 0.75;
}

/* 4. Action Toolbar */
.card-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 10px;
  position: relative;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.reaction-anchor {
  position: relative;
  display: inline-flex;
}

.action-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-subtle);
  color: var(--ink-secondary);
  font-size: 12px;
  font-weight: 700;
  transition: all 0.15s ease;
  cursor: pointer;
}

.action-pill:hover {
  background: #F3EEFF;
  border-color: #D5C8F2;
  color: var(--brand-primary);
}

.action-pill:active {
  transform: scale(0.95);
}

.action-pill.icon-only {
  padding: 5px 7px;
}

.pill-emoji {
  font-size: 13.5px;
}

.pill-count {
  font-size: 11.5px;
}

.react-pill.isLiked {
  background: #F3EEFF;
  border-color: #C4B5FD;
  color: #7C3AED;
}

.bookmark-btn.active {
  color: var(--brand-primary);
  background: #F3EEFF;
  border-color: #C4B5FD;
}

/* Floating Reaction Dock */
.floating-react-dock {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 125, 238, 0.28);
  border-radius: 28px;
  padding: 3px 6px;
  box-shadow: 
    0 10px 26px -4px rgba(45, 25, 80, 0.2),
    0 2px 6px rgba(148, 125, 238, 0.12);
  z-index: 80;
  transform-origin: bottom left;
}

:global([data-theme='dark']) .floating-react-dock {
  background: rgba(28, 21, 43, 0.98);
  border-color: rgba(169, 149, 246, 0.28);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
}

.dock-item {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: transparent;
  cursor: pointer;
  transition: transform 0.16s ease, background 0.15s ease;
}

.dock-emoji {
  font-size: 18px;
  transition: transform 0.15s ease;
}

.dock-item:hover {
  transform: scale(1.3) translateY(-3px);
  background: rgba(148, 125, 238, 0.12);
}

/* Dock pop minimal spring */
.dock-spring-enter-active {
  animation: springIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dock-spring-leave-active {
  animation: fadeOut 0.12s ease-in forwards;
}

@keyframes springIn {
  0% { transform: scale(0.85) translateY(4px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes fadeOut {
  0% { transform: scale(1) translateY(0); opacity: 1; }
  100% { transform: scale(0.9) translateY(3px); opacity: 0; }
}

.pro-crown-badge {
  font-size: 13px;
  margin-left: 2px;
  filter: drop-shadow(0 1px 2px rgba(245, 158, 11, 0.4));
}
</style>
