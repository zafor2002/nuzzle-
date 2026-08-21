<template>
  <div v-if="selectedStory" class="story-viewer-modal">
    <!-- Story Content Box -->
    <div 
      class="story-viewport" 
      @mousedown="pauseStory" 
      @mouseup="resumeStory"
      @touchstart="pauseStory"
      @touchend="resumeStory"
    >
      <!-- Top Progress Bars -->
      <div class="progress-bar-row">
        <div 
          v-for="(seg, idx) in selectedStory.segments" 
          :key="seg.id" 
          class="progress-track"
        >
          <div 
            class="progress-fill" 
            :style="{ 
              width: idx < currentSegmentIndex ? '100%' : (idx === currentSegmentIndex ? `${progressPercent}%` : '0%') 
            }"
          ></div>
        </div>
      </div>

      <!-- Header Info -->
      <div class="story-top-info">
        <div class="creator-meta">
          <img :src="selectedStory.creatorAvatar" :alt="selectedStory.creatorName" class="viewer-avatar" @error="handleImgError($event, 'avatar')" />
          <div class="creator-names">
            <span class="creator-title">{{ selectedStory.creatorName }}</span>
            <span v-if="selectedStory.petName" class="pet-sub">{{ selectedStory.petName }}</span>
          </div>
        </div>

        <button class="close-btn" @click.stop="closeStory">
          <X :size="22" />
        </button>
      </div>

      <!-- Story Media Background -->
      <div class="story-media-container">
        <img 
          :src="currentSegment.mediaUrl" 
          :alt="currentSegment.caption || 'Story media'" 
          class="story-image"
          @error="handleImgError($event, 'media')"
        />

        <!-- Left / Right Tap zones -->
        <div class="tap-zone left-zone" @click.stop="prevSegment"></div>
        <div class="tap-zone right-zone" @click.stop="nextSegment"></div>
      </div>

      <!-- Caption & Footer -->
      <div class="story-footer">
        <p v-if="currentSegment.caption" class="segment-caption">
          {{ currentSegment.caption }}
        </p>

        <div class="reply-bar" @click.stop>
          <input 
            v-model="replyText" 
            placeholder="Send reply to story..." 
            class="story-reply-input"
            @keyup.enter="sendReply"
          />
          <button class="send-story-btn" @click="sendReply">
            <Send :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { X, Send } from 'lucide-vue-next';
import { selectedStory, closeStory, openChatWith } from '../../stores/appStore';
import { handleImgError } from '../../utils/imageFallback';

const currentSegmentIndex = ref(0);
const progressPercent = ref(0);
const replyText = ref('');
const isPaused = ref(false);
let timer: any = null;

const currentSegment = computed(() => {
  if (!selectedStory.value) return { mediaUrl: '', caption: '', durationMs: 4500 };
  return selectedStory.value.segments[currentSegmentIndex.value] || selectedStory.value.segments[0];
});

watch(selectedStory, (newStory) => {
  if (newStory) {
    currentSegmentIndex.value = 0;
    progressPercent.value = 0;
    startTimer();
  } else {
    stopTimer();
  }
});

function startTimer() {
  stopTimer();
  progressPercent.value = 0;
  const duration = currentSegment.value?.durationMs || 4500;
  const interval = 50;
  const step = (interval / duration) * 100;

  timer = setInterval(() => {
    if (!isPaused.value) {
      progressPercent.value += step;
      if (progressPercent.value >= 100) {
        nextSegment();
      }
    }
  }, interval);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function nextSegment() {
  if (!selectedStory.value) return;
  if (currentSegmentIndex.value < selectedStory.value.segments.length - 1) {
    currentSegmentIndex.value++;
    startTimer();
  } else {
    closeStory();
  }
}

function prevSegment() {
  if (currentSegmentIndex.value > 0) {
    currentSegmentIndex.value--;
    startTimer();
  } else {
    progressPercent.value = 0;
  }
}

function pauseStory() {
  isPaused.value = true;
}

function resumeStory() {
  isPaused.value = false;
}

function sendReply() {
  if (!replyText.value.trim() || !selectedStory.value) return;
  const text = replyText.value;
  replyText.value = '';
  const creator = selectedStory.value.creatorName;
  const avatar = selectedStory.value.creatorAvatar;
  const pet = selectedStory.value.petName;
  closeStory();
  openChatWith(creator, avatar, pet, `Replied to story: "${text}"`);
}

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
.story-viewer-modal {
  position: absolute;
  inset: 0;
  background: #000;
  z-index: 150;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.story-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.progress-bar-row {
  position: absolute;
  top: 14px;
  left: 12px;
  right: 12px;
  display: flex;
  gap: 5px;
  z-index: 20;
}

.progress-track {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
  transition: width 0.05s linear;
}

.story-top-info {
  position: absolute;
  top: 26px;
  left: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 20;
}

.creator-meta {
  display: flex;
  align-items: center;
  gap: 9px;
}

.viewer-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid #fff;
  object-fit: cover;
}

.creator-names {
  display: flex;
  flex-direction: column;
}

.creator-title {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

.pet-sub {
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
}

.close-btn {
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  display: grid;
  place-items: center;
  backdrop-filter: blur(8px);
}

.story-media-container {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
}

.story-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tap-zone {
  position: absolute;
  top: 70px;
  bottom: 90px;
  width: 38%;
  z-index: 10;
}

.left-zone {
  left: 0;
}

.right-zone {
  right: 0;
}

.story-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 14px 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.segment-caption {
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.4;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.reply-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.story-reply-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-full);
  padding: 10px 16px;
  color: #fff;
  font-size: 13.5px;
  outline: none;
  backdrop-filter: blur(10px);
}

.story-reply-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.send-story-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--brand-primary);
  color: #fff;
  display: grid;
  place-items: center;
}
</style>
