<template>
  <div class="reels-view">
    <!-- Top Floating Header -->
    <div class="reels-top-bar">
      <span class="reels-title">Reels</span>
      <button class="cam-btn" @click="isCreateSheetOpen = true">
        <Camera :size="22" />
      </button>
    </div>

    <!-- Reels Vertical Container -->
    <div class="reels-container" ref="reelsContainer">
      <div 
        v-for="reel in reels" 
        :key="reel.id" 
        class="reel-item"
        :style="{ background: reel.videoGradient }"
      >
        <!-- Animated visual ambient blob -->
        <div class="ambient-blob"></div>

        <!-- Video Mock Info Banner in Center -->
        <div class="reel-center-badge">
          <Play :size="32" class="play-icon" />
          <span class="video-mock-title">{{ reel.videoTitle }}</span>
        </div>

        <!-- Right Side Action Rail -->
        <div class="reel-action-rail">
          <!-- Like -->
          <button 
            class="rail-btn" 
            :class="{ active: reel.isLiked }"
            @click="toggleReelLike(reel.id)"
          >
            <div class="icon-circle">
              <Heart :size="24" :fill="reel.isLiked ? 'currentColor' : 'none'" />
            </div>
            <span class="rail-count">{{ formatCount(reel.likesCount) }}</span>
          </button>

          <!-- Comment -->
          <button class="rail-btn" @click="openReelComments(reel)">
            <div class="icon-circle">
              <MessageCircle :size="24" />
            </div>
            <span class="rail-count">{{ formatCount(reel.commentsCount) }}</span>
          </button>

          <!-- Save -->
          <button 
            class="rail-btn" 
            :class="{ active: reel.isSaved }"
            @click="toggleReelSave(reel.id)"
          >
            <div class="icon-circle">
              <Bookmark :size="24" :fill="reel.isSaved ? 'currentColor' : 'none'" />
            </div>
            <span class="rail-count">Save</span>
          </button>

          <!-- Share -->
          <button class="rail-btn" @click="shareReel(reel)">
            <div class="icon-circle">
              <Share2 :size="22" />
            </div>
            <span class="rail-count">{{ formatCount(reel.sharesCount) }}</span>
          </button>

          <!-- Spinning Audio Disc -->
          <div class="spinning-disc">
            <Music :size="14" />
          </div>
        </div>

        <!-- Bottom Creator Info & Caption -->
        <div class="reel-bottom-info">
          <div class="creator-badge-row">
            <img :src="reel.creatorAvatar" :alt="reel.creatorName" class="reel-creator-avatar" @error="handleImgError($event, 'avatar')" />
            <div class="creator-labels">
              <span class="c-name">{{ reel.creatorName }}</span>
              <span v-if="reel.petName" class="c-pet">🐾 {{ reel.petName }}</span>
            </div>
            <button class="follow-pill-btn">Follow</button>
          </div>

          <p class="reel-caption-text">
            {{ reel.caption }}
          </p>

          <!-- Audio Track Pill -->
          <div class="audio-pill">
            <Music :size="12" class="note-icon" />
            <span class="audio-track-name">{{ reel.audioTrack }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Camera, Heart, MessageCircle, Bookmark, Share2, Music, Play } from 'lucide-vue-next';
import { reels, toggleReelLike, toggleReelSave, isCreateSheetOpen, setTab } from '../stores/appStore';
import type { Reel } from '../types';
import { handleImgError } from '../utils/imageFallback';

function formatCount(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function openReelComments(_reel: Reel) {
  setTab('feed');
}

function shareReel(reel: Reel) {
  if (navigator.share) {
    navigator.share({
      title: reel.videoTitle,
      text: reel.caption,
      url: window.location.href
    }).catch(() => {});
  } else {
    alert('Reel link copied! 🐾');
  }
}
</script>

<style scoped>
.reels-view {
  position: relative;
  height: 100%;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.reels-top-bar {
  position: absolute;
  top: 10px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 30;
}

.reels-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

.cam-btn {
  color: #fff;
  padding: 6px;
}

.reels-container {
  flex: 1;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
}

.reels-container::-webkit-scrollbar {
  display: none;
}

.reel-item {
  height: 100%;
  position: relative;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px 16px 20px;
  overflow: hidden;
}

.ambient-blob {
  position: absolute;
  top: 30%;
  left: 20%;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  filter: blur(50px);
  animation: floatAmbient 6s ease-in-out infinite alternate;
}

@keyframes floatAmbient {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 30px) scale(1.2); }
}

.reel-center-badge {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.35);
  padding: 16px 24px;
  border-radius: 20px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  z-index: 10;
}

.play-icon {
  color: #fff;
  opacity: 0.9;
}

.video-mock-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

.reel-action-rail {
  position: absolute;
  right: 12px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 20;
}

.rail-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #fff;
  transition: transform 0.12s ease;
}

.rail-btn:active {
  transform: scale(0.9);
}

.icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  backdrop-filter: blur(8px);
}

.rail-btn.active .icon-circle {
  color: #F43F5E;
}

.rail-count {
  font-size: 11px;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.spinning-disc {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1E293B, #0F172A);
  border: 2px solid rgba(255, 255, 255, 0.6);
  display: grid;
  place-items: center;
  animation: spin 3.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.reel-bottom-info {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 82%;
  z-index: 20;
}

.creator-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reel-creator-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid #fff;
  object-fit: cover;
}

.creator-labels {
  display: flex;
  flex-direction: column;
}

.c-name {
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}

.c-pet {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
}

.follow-pill-btn {
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid #fff;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

.reel-caption-text {
  font-size: 13.5px;
  line-height: 1.4;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}

.audio-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  backdrop-filter: blur(8px);
  width: fit-content;
}
</style>
