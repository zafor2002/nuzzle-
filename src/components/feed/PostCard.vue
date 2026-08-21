<template>
  <article class="post-card">
    <!-- Header -->
    <div class="post-header">
      <div class="post-avatar-wrapper" @click="handleProfileClick">
        <img :src="post.petAvatar || post.ownerAvatar" :alt="post.petName || post.ownerName" class="post-avatar" @error="handleImgError($event, 'avatar')" />
        <div v-if="post.petId" class="pet-paw-badge">🐾</div>
      </div>

      <div class="post-author-meta" @click="handleProfileClick">
        <div class="author-line">
          <span class="author-name">{{ post.petName || post.ownerName }}</span>
          <span v-if="post.isAnonymous" class="ghost-tag">👻 Anon</span>
        </div>
        <div class="author-sub">
          <span v-if="post.petBreed" class="breed-name">{{ post.petBreed }} • </span>
          <span v-if="post.location" class="location-name">{{ post.location }} • </span>
          <span class="time-ago">{{ post.createdAt }}</span>
        </div>
      </div>

      <button class="more-btn">
        <MoreHorizontal :size="18" />
      </button>
    </div>

    <!-- Pet Mood & Soundbite Bar (PPTX Slide 6) -->
    <div class="mood-row">
      <span class="mood-pill">🐾 Zoomies</span>
      <span class="mood-pill audio">🎵 Excited Panting</span>
      <span class="mood-pill">🌤️ Happy Day</span>
    </div>

    <!-- Pet Thought Bubble (PPTX Slide 6) -->
    <div class="thought-bubble-wrap" v-if="post.caption">
      <div class="thought-bubble-card">
        💭 <em>"{{ thoughtText }}"</em>
      </div>
    </div>

    <!-- Media — Organic Squircle Container (PPTX Slide 6: 22px asymmetric) -->
    <div class="post-media-area" @dblclick="handleDoubleTap">
      <div class="squircle-media-wrap">
        <img :src="post.mediaUrls[0]" :alt="post.caption" class="post-img" @error="handleImgError($event, 'media')" />

        <!-- Floating Location Capsule -->
        <div class="floating-location" v-if="post.location">
          <MapPin :size="10" />
          <span>{{ post.location }}</span>
        </div>

        <!-- Heart burst animation -->
        <transition name="pop">
          <div v-if="showHeartBurst" class="heart-burst">
            <Heart :size="80" class="burst-icon" />
          </div>
        </transition>

        <div v-if="post.mediaUrls.length > 1" class="carousel-counter">
          1/{{ post.mediaUrls.length }}
        </div>
      </div>
    </div>

    <!-- Pet Reaction Dock (PPTX Slide 6 — Facebook-style floating dock) -->
    <div class="post-actions-bar">
      <div class="reaction-area" ref="reactionAreaRef">
        <!-- Primary reaction button (hold to open dock) -->
        <button
          class="act-btn reaction-trigger"
          :class="{ reacted: currentReaction }"
          @click="handleReactionClick"
          @mouseenter="showDock = true"
          @mouseleave="scheduleDockClose"
          :title="currentReaction ? `Reacted: ${currentReaction}` : 'React'"
        >
          <span class="reaction-display">{{ currentReaction || '🐾' }}</span>
          <span class="count-num">{{ post.likesCount + (currentReaction && !post.isLiked ? 1 : 0) }}</span>
        </button>

        <!-- Floating Reaction Dock -->
        <div
          v-if="showDock"
          class="reaction-dock"
          @mouseenter="clearDockClose"
          @mouseleave="scheduleDockClose"
        >
          <button
            v-for="r in reactions"
            :key="r.emoji"
            class="reaction-btn"
            :class="{ active: currentReaction === r.emoji }"
            :title="r.label"
            @click="setReaction(r.emoji)"
          >
            {{ r.emoji }}
          </button>
        </div>
      </div>

      <div class="center-actions">
        <button class="act-btn comment-btn" @click="openComments(post)">
          <MessageCircle :size="21" />
          <span class="count-num">{{ post.commentsCount }}</span>
        </button>

        <button class="act-btn share-btn" @click="sharePost">
          <Send :size="19" />
        </button>
      </div>

      <button class="act-btn save-btn" :class="{ saved: post.isSaved }" @click="togglePostSave(post.id)">
        <Bookmark :size="21" :fill="post.isSaved ? 'currentColor' : 'none'" />
      </button>
    </div>

    <!-- Caption & Hashtags -->
    <div class="post-body-content">
      <p class="post-caption-text">
        <span class="caption-author">{{ post.ownerName }}:</span>
        {{ post.caption }}
      </p>

      <div class="hashtags-list">
        <span v-for="tag in post.hashtags" :key="tag" class="hashtag-tag" @click="filterByTag(tag)">
          #{{ tag }}
        </span>
      </div>

      <div v-if="post.comments.length > 0" class="comments-preview">
        <button class="view-all-comments" @click="openComments(post)">
          View all {{ post.commentsCount }} comments
        </button>
        <div class="latest-comment">
          <span class="commenter-name">{{ post.comments[post.comments.length - 1].authorName }}:</span>
          <span class="commenter-text">{{ post.comments[post.comments.length - 1].body }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, MapPin } from 'lucide-vue-next';
import type { Post } from '../../types';
import { togglePostLike, togglePostSave, openComments, setTab, activeHashtag } from '../../stores/appStore';
import { handleImgError } from '../../utils/imageFallback';

const props = defineProps<{ post: Post }>();

const showHeartBurst = ref(false);
const showDock = ref(false);
const currentReaction = ref<string>('');
let dockTimer: ReturnType<typeof setTimeout> | null = null;
const reactionAreaRef = ref<HTMLElement | null>(null);

// Reactions from PPTX Slide 6: Paw Five, Nuzzle, Treat, Fetch, Purr
const reactions = [
  { emoji: '🐾', label: 'Paw Five' },
  { emoji: '💜', label: 'Nuzzle' },
  { emoji: '🦴', label: 'Treat' },
  { emoji: '🎾', label: 'Fetch' },
  { emoji: '😻', label: 'Purr' },
];

// Pet thought monologue — map caption to first-person pet thought
const petThoughts = [
  "I am the Supreme Branch Master. This stick belongs in the Smithsonian.",
  "They said 'good boy' and I have never felt more understood in my life.",
  "This nap is extremely important research. Do not disturb.",
  "I HAVE FOUND THE SQUIRREL. My life's purpose is now complete.",
  "The mailman comes every day. Every day I must warn them. Every day.",
];

const thoughtText = computed(() => {
  const idx = props.post.id.charCodeAt(0) % petThoughts.length;
  return petThoughts[idx];
});

function handleDoubleTap() {
  if (!props.post.isLiked) togglePostLike(props.post.id);
  showHeartBurst.value = true;
  if (!currentReaction.value) currentReaction.value = '🐾';
  setTimeout(() => { showHeartBurst.value = false; }, 800);
}

function handleReactionClick() {
  if (currentReaction.value) {
    currentReaction.value = '';
  } else {
    currentReaction.value = '🐾';
    togglePostLike(props.post.id);
  }
  showDock.value = false;
}

function setReaction(emoji: string) {
  currentReaction.value = currentReaction.value === emoji ? '' : emoji;
  if (!props.post.isLiked && currentReaction.value) togglePostLike(props.post.id);
  showDock.value = false;
}

function scheduleDockClose() {
  dockTimer = setTimeout(() => { showDock.value = false; }, 350);
}

function clearDockClose() {
  if (dockTimer) clearTimeout(dockTimer);
}

function handleProfileClick() { setTab('profile'); }

function filterByTag(tag: string) {
  activeHashtag.value = tag;
  setTab('explore');
}

function sharePost() {
  if (navigator.share) {
    navigator.share({ title: 'Nuzzle Post', text: props.post.caption, url: window.location.href }).catch(() => {});
  }
}
</script>

<style scoped>
.post-card {
  background: var(--bg-card);
  border-bottom: 6px solid var(--bg-app);
  border-radius: 0;
  margin-bottom: 2px;
}

/* Header */
.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
}

.post-avatar-wrapper {
  position: relative;
  cursor: pointer;
}

.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.pet-paw-badge {
  position: absolute;
  bottom: -2px;
  right: -4px;
  font-size: 11px;
  background: var(--brand-soft);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border: 1.5px solid var(--bg-card);
}

.post-author-meta { flex: 1; cursor: pointer; }

.author-line { display: flex; align-items: center; gap: 6px; }

.author-name {
  font-weight: 800;
  font-size: 14px;
  color: var(--ink-primary);
}

.ghost-tag {
  font-size: 10px;
  font-weight: 700;
  background: var(--bg-card-subtle);
  color: var(--ink-muted);
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.author-sub { font-size: 11.5px; color: var(--ink-muted); margin-top: 1px; }

.breed-name { font-weight: 700; color: var(--brand-primary); }

.more-btn { color: var(--ink-muted); padding: 4px; }

/* Pet Mood Bar (Slide 6) */
.mood-row {
  display: flex;
  gap: 6px;
  padding: 0 16px 8px;
  flex-wrap: wrap;
}

.mood-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  color: var(--brand-dark);
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: var(--radius-full);
}

.mood-pill.audio {
  background: rgba(79, 70, 229, 0.07);
  color: #4F46E5;
  border-color: rgba(79, 70, 229, 0.18);
}

/* Pet Thought Bubble (Slide 6) */
.thought-bubble-wrap { padding: 0 16px 8px; }

.thought-bubble-card {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 14px 14px 14px 4px;
  padding: 9px 12px;
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.45;
  font-style: italic;
}

/* Media — Organic Squircle (Slide 6: 22px asymmetric) */
.post-media-area {
  position: relative;
  width: 100%;
  padding: 0 12px 8px;
  user-select: none;
}

.squircle-media-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 22px 14px 22px 14px;
  overflow: hidden;
  background: var(--bg-card-subtle);
  box-shadow: var(--shadow-card);
}

.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.floating-location {
  position: absolute;
  bottom: 10px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(252, 250, 255, 0.88);
  backdrop-filter: blur(8px);
  color: var(--ink-secondary);
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
}

.heart-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10;
}

.burst-icon {
  color: #ffffff;
  fill: var(--brand-primary);
  filter: drop-shadow(0 4px 12px rgba(148, 125, 238, 0.7));
}

.pop-enter-active, .pop-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-enter-from { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
.pop-leave-to { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }

.carousel-counter {
  position: absolute;
  top: 10px;
  right: 12px;
  background: rgba(38, 30, 56, 0.6);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

/* Actions Bar with Reaction Dock */
.post-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 4px;
}

.reaction-area {
  position: relative;
}

/* Floating Reaction Dock (Slide 6) */
.reaction-dock {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--bg-glass);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 6px 10px;
  box-shadow: var(--shadow-lg);
  position: absolute;
  bottom: calc(100% + 10px);
  left: -8px;
  z-index: 200;
  white-space: nowrap;
  animation: dockReveal 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes dockReveal {
  from { opacity: 0; transform: scale(0.7) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.reaction-btn {
  font-size: 22px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.12s ease;
  line-height: 1;
}

.reaction-btn:hover, .reaction-btn.active {
  transform: scale(1.4) translateY(-5px);
  background: var(--bg-card-subtle);
}

.reaction-trigger {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--ink-secondary);
  font-size: 13px;
  font-weight: 700;
  padding: 4px 2px;
  transition: transform 0.12s ease, color 0.15s ease;
}

.reaction-trigger.reacted {
  color: var(--brand-dark);
}

.reaction-trigger:active { transform: scale(0.9); }

.reaction-display {
  font-size: 20px;
  line-height: 1;
}

.center-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.act-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--ink-secondary);
  font-size: 13px;
  font-weight: 700;
  padding: 4px;
  transition: transform 0.12s ease, color 0.15s ease;
}

.act-btn:hover { color: var(--brand-dark); }
.act-btn:active { transform: scale(0.88); }

.save-btn.saved { color: var(--brand-primary); }
.count-num { font-size: 13px; font-weight: 700; }

/* Caption */
.post-body-content { padding: 4px 16px 14px; }

.post-caption-text {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--ink-primary);
}

.caption-author {
  font-weight: 800;
  margin-right: 5px;
  color: var(--ink-primary);
}

.hashtags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.hashtag-tag {
  color: var(--brand-dark);
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
}

.hashtag-tag:hover { text-decoration: underline; }

.comments-preview { margin-top: 8px; }

.view-all-comments {
  color: var(--ink-muted);
  font-size: 12.5px;
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
}

.latest-comment { font-size: 12.5px; color: var(--ink-secondary); }

.commenter-name {
  font-weight: 700;
  margin-right: 4px;
  color: var(--ink-primary);
}
</style>
