<template>
  <!-- Snuggle Circles Story Tray (PPTX Slide 8) -->
  <div class="story-tray">
    <!-- Add Story -->
    <div class="story-item" @click="isCreateSheetOpen = true">
      <div class="snuggle-circle add-circle">
        <img :src="owner.avatarUrl" :alt="owner.displayName" class="story-avatar" />
        <div class="add-plus-badge"><Plus :size="11" /></div>
      </div>
      <span class="story-name">Your Story</span>
    </div>

    <!-- Active Snuggle Circles -->
    <div
      v-for="story in stories"
      :key="story.id"
      class="story-item"
      @click="openStory(story)"
    >
      <div class="snuggle-circle" :class="{ unseen: story.hasUnseen, seen: !story.hasUnseen }">
        <img :src="story.creatorAvatar" :alt="story.creatorName" class="story-avatar" />
        <!-- Live Activity Tag (Slide 8) -->
        <div v-if="story.hasUnseen" class="activity-tag">
          <span>{{ getActivityTag(story.id) }}</span>
        </div>
      </div>
      <span class="story-name">{{ story.creatorName.split(' ')[0] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { stories, openStory, owner, isCreateSheetOpen } from '../../stores/appStore';

// Live pet activity tags from PPTX Slide 8
const activityTags = ['☁️ Zoomies', '🎶 Singing', '🌙 Napping', '🐟 Hungry', '🎾 Playful', '💤 Sleepy'];

function getActivityTag(id: string): string {
  return activityTags[id.charCodeAt(0) % activityTags.length];
}
</script>

<style scoped>
/* Snuggle Circles Story Tray — PPTX Slide 8 */
.story-tray {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  overflow-x: auto;
  padding: 14px 16px 10px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  scrollbar-width: none;
}

.story-tray::-webkit-scrollbar { display: none; }

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  flex-shrink: 0;
}

/* Snuggle Circle — squircle shape with lavender glow (Slide 8) */
.snuggle-circle {
  width: 64px;
  height: 64px;
  border-radius: 20px 14px 20px 14px; /* asymmetric squircle */
  padding: 2.5px;
  position: relative;
  display: grid;
  place-items: center;
  transition: transform 0.18s ease;
  background: var(--border-light);
}

.story-item:active .snuggle-circle {
  transform: scale(0.92);
}

/* Glowing lavender ring for unseen stories (Slide 8) */
.snuggle-circle.unseen {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-dark), #4F46E5);
  box-shadow: 0 0 14px rgba(148, 125, 238, 0.5);
}

.snuggle-circle.seen {
  background: var(--border-strong);
  box-shadow: none;
  opacity: 0.75;
}

.add-circle {
  background: var(--bg-card-subtle);
  border: 2px dashed var(--border-strong);
  box-shadow: none;
}

.story-avatar {
  width: 100%;
  height: 100%;
  border-radius: 18px 12px 18px 12px;
  object-fit: cover;
  border: 2.5px solid var(--bg-card);
}

.add-plus-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-dark));
  color: #fff;
  display: grid;
  place-items: center;
  border: 2px solid var(--bg-card);
  box-shadow: 0 2px 6px rgba(124, 58, 237, 0.3);
}

/* Live Activity Tag (Slide 8) */
.activity-tag {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-dark));
  color: #fff;
  font-size: 8.5px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  border: 1.5px solid var(--bg-card);
  box-shadow: 0 2px 6px rgba(124, 58, 237, 0.3);
}

.story-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-secondary);
  max-width: 68px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  margin-top: 10px;
}
</style>
