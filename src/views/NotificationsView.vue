<template>
  <div class="notifications-view">
    <TopBar title="🔔 Activity & Notifications" />

    <div class="notif-scroll-body">
      <!-- Header Actions -->
      <div class="notif-top-row">
        <div class="filter-chips-row" style="padding: 0;">
          <button 
            class="filter-chip" 
            :class="{ active: filterType === 'all' }"
            @click="filterType = 'all'"
          >
            All Activity
          </button>
          <button 
            class="filter-chip" 
            :class="{ active: filterType === 'social' }"
            @click="filterType = 'social'"
          >
            Likes & Comments
          </button>
          <button 
            class="filter-chip" 
            :class="{ active: filterType === 'alerts' }"
            @click="filterType = 'alerts'"
          >
            🚨 Alerts & Health
          </button>
        </div>

        <button class="mark-read-link" @click="markAllNotificationsAsRead">
          Mark all read
        </button>
      </div>

      <!-- Notifications List -->
      <div class="notif-list">
        <div 
          v-for="item in filteredNotifs" 
          :key="item.id"
          class="notif-card"
          :class="{ unread: !item.isRead }"
          @click="handleNotificationClick(item)"
        >
          <div class="notif-avatar-col">
            <img :src="item.avatarUrl" :alt="item.title" class="notif-avatar" />
            <div class="notif-badge-icon" :class="item.type">
              <Heart v-if="item.type === 'like'" :size="10" fill="#fff" />
              <MessageCircle v-else-if="item.type === 'comment'" :size="10" />
              <AlertTriangle v-else-if="item.type === 'lost_alert'" :size="10" />
              <UserPlus v-else-if="item.type === 'follow'" :size="10" />
              <Calendar v-else :size="10" />
            </div>
          </div>

          <div class="notif-content-col">
            <div class="notif-title-row">
              <h5 class="notif-title">{{ item.title }}</h5>
              <span class="notif-time">{{ item.timeAgo }}</span>
            </div>
            <p class="notif-message">{{ item.message }}</p>
          </div>

          <div v-if="!item.isRead" class="unread-dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Heart, MessageCircle, AlertTriangle, UserPlus, Calendar } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { notifications, markAllNotificationsAsRead, setTab } from '../stores/appStore';
import type { AppNotification } from '../types';

const filterType = ref<'all' | 'social' | 'alerts'>('all');

const filteredNotifs = computed(() => {
  if (filterType.value === 'social') {
    return notifications.filter(n => ['like', 'comment', 'follow'].includes(n.type));
  }
  if (filterType.value === 'alerts') {
    return notifications.filter(n => ['lost_alert', 'appointment'].includes(n.type));
  }
  return notifications;
});

function handleNotificationClick(item: AppNotification) {
  item.isRead = true;
  if (item.type === 'lost_alert') {
    setTab('lostfound');
  } else if (item.type === 'appointment') {
    setTab('vets');
  } else {
    setTab('feed');
  }
}
</script>

<style scoped>
.notifications-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.notif-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px calc(96px + env(safe-area-inset-bottom, 16px));
}

.notif-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.mark-read-link {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--brand-primary);
  white-space: nowrap;
}

.notif-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notif-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.notif-card.unread {
  background: var(--brand-soft);
  border-color: var(--brand-secondary);
}

.notif-avatar-col {
  position: relative;
  flex-shrink: 0;
}

.notif-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.notif-badge-icon {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  border: 2px solid var(--bg-card);
}

.notif-badge-icon.like {
  background: var(--accent-rose);
}

.notif-badge-icon.comment {
  background: var(--brand-primary);
}

.notif-badge-icon.lost_alert {
  background: #E11D48;
}

.notif-badge-icon.follow {
  background: var(--accent-indigo);
}

.notif-badge-icon.appointment {
  background: var(--accent-emerald);
}

.notif-content-col {
  flex: 1;
  min-width: 0;
}

.notif-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.notif-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-primary);
}

.notif-time {
  font-size: 10.5px;
  color: var(--ink-muted);
}

.notif-message {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.35;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-primary);
  flex-shrink: 0;
}
</style>
