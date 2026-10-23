<template>
  <div class="settings-view">
    <TopBar title="⚙️ Settings & Privacy" />

    <div class="settings-scroll-body">
      <!-- Section 0: Nuzzle Pro Member VIP -->
      <div class="settings-section">
        <h4 class="sec-heading">Subscription Plan</h4>
        <div class="settings-card card-item pro-settings-card" @click="isProModalOpen = true">
          <div class="pro-settings-left">
            <span class="pro-crown-ico">👑</span>
            <div>
              <div class="pro-set-head">
                <span class="pro-set-title">{{ owner.isProMember ? 'Nuzzle Pro Member' : 'Upgrade to Nuzzle Pro' }}</span>
                <span class="pro-set-badge">{{ owner.isProMember ? 'ACTIVE' : '90 BDT / mo' }}</span>
              </div>
              <p class="pro-set-sub">
                {{ owner.isProMember ? `Subscribed (${owner.proPlan}) • All VIP privileges unlocked` : 'Unlock VIP Crown, Unlimited PawDoctor AI & 5% Market Discount' }}
              </p>
            </div>
          </div>
          <button class="pro-set-btn">{{ owner.isProMember ? 'Manage' : 'Upgrade' }}</button>
        </div>
      </div>

      <!-- Section 1: Account Information -->
      <div class="settings-section">
        <h4 class="sec-heading">Account Details</h4>
        <div class="settings-card card-item">
          <div class="setting-row">
            <span class="set-label">Display Name</span>
            <input v-model="owner.displayName" class="set-input" />
          </div>

          <div class="setting-row">
            <span class="set-label">Username</span>
            <span class="set-val-readonly">@{{ owner.username }} (Fixed)</span>
          </div>

          <div class="setting-row">
            <span class="set-label">Email Address</span>
            <span class="set-val-readonly">alex.rivers@example.com</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Privacy & Anonymity -->
      <div class="settings-section">
        <h4 class="sec-heading">Privacy & Anonymity Controls</h4>
        <div class="settings-card card-item">
          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Global Anonymity (Ghost Mode)</span>
              <span class="t-sub">Conceals owner identity across all public posts and listings.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.isAnonymous }"
              @click="owner.isAnonymous = !owner.isAnonymous"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>

          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Private Account</span>
              <span class="t-sub">Only approved followers can view your full pet journals.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.isPrivate }"
              @click="owner.isPrivate = !owner.isPrivate"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Notification Preferences -->
      <div class="settings-section">
        <h4 class="sec-heading">Notification Channels</h4>
        <div class="settings-card card-item">
          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Likes on Pet Photos</span>
              <span class="t-sub">Notify when someone likes your pets' posts.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.notifyLikes }"
              @click="owner.notifyLikes = !owner.notifyLikes"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>

          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Comments & Replies</span>
              <span class="t-sub">Notify on questions and feedback.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.notifyComments }"
              @click="owner.notifyComments = !owner.notifyComments"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>

          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">New Followers</span>
              <span class="t-sub">Notify when other pet owners follow your pack.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: owner.notifyFollows }"
              @click="owner.notifyFollows = !owner.notifyFollows"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Display & Appearance -->
      <div class="settings-section">
        <h4 class="sec-heading">Appearance</h4>
        <div class="settings-card card-item">
          <div class="setting-toggle-row">
            <div class="toggle-text">
              <span class="t-main">Dark Theme</span>
              <span class="t-sub">Switch between soothing lavender palette and obsidian dark mode.</span>
            </div>
            <div 
              class="toggle-switch" 
              :class="{ active: isDarkMode }"
              @click="toggleTheme"
            >
              <div class="toggle-thumb"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 5: Switch Role & Logout -->
      <div class="settings-section">
        <button class="btn-solid switch-role-btn" @click="setTab('auth')">
          🔄 Switch Account / Sign In as Store or Vet
        </button>

        <button class="btn-outline logout-btn" @click="handleLogout">
          Log Out of Nuzzle
        </button>

        <p class="app-version-text">
          Nuzzle Client v1.0.0 • Multi-Role Ecosystem
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopBar from '../components/layout/TopBar.vue';
import { owner, isDarkMode, toggleTheme, setTab, isProModalOpen, performLogout } from '../stores/appStore';

function handleLogout() {
  if (confirm('Are you sure you want to log out of Nuzzle?')) {
    performLogout();
  }
}
</script>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.settings-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px calc(48px + env(safe-area-inset-bottom, 16px));
}

/* Pro Settings Card */
.pro-settings-card {
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  border: 1.5px solid #FCD34D;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
  transition: transform 0.15s ease;
}

:global([data-theme='dark']) .pro-settings-card {
  background: rgba(45, 30, 10, 0.65);
  border-color: rgba(245, 158, 11, 0.4);
}

.pro-settings-card:hover {
  transform: translateY(-1px);
}

.pro-settings-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pro-crown-ico {
  font-size: 26px;
}

.pro-set-head {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pro-set-title {
  font-size: 13px;
  font-weight: 800;
  color: #92400E;
}

:global([data-theme='dark']) .pro-set-title {
  color: #FCD34D;
}

.pro-set-badge {
  font-size: 9px;
  font-weight: 900;
  color: #fff;
  background: #D97706;
  padding: 1px 5px;
  border-radius: var(--radius-full);
}

.pro-set-sub {
  font-size: 10.5px;
  color: #B45309;
  line-height: 1.25;
  margin-top: 1px;
}

:global([data-theme='dark']) .pro-set-sub {
  color: #FDE68A;
}

.pro-set-btn {
  font-size: 11px;
  font-weight: 800;
  color: #92400E;
  background: #fff;
  padding: 5px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

:global([data-theme='dark']) .pro-set-btn {
  background: #78350F;
  color: #FDE68A;
}

.settings-section {
  margin-bottom: 18px;
}

.sec-heading {
  font-size: 12.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-muted);
  margin-bottom: 8px;
  padding-left: 4px;
}

.settings-card {
  padding: 4px 16px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
}

.setting-row:last-child {
  border-bottom: none;
}

.set-label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.set-input {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 6px 12px;
  font-size: 13px;
  color: var(--ink-primary);
  text-align: right;
  outline: none;
}

.set-val-readonly {
  font-size: 12.5px;
  color: var(--ink-muted);
}

.setting-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
  gap: 12px;
}

.setting-toggle-row:last-child {
  border-bottom: none;
}

.toggle-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.t-main {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.t-sub {
  font-size: 11px;
  color: var(--ink-muted);
  line-height: 1.35;
}

.switch-role-btn {
  width: 100%;
  padding: 11px;
  font-size: 12.5px;
  font-weight: 800;
  border-radius: var(--radius-full);
  margin-bottom: 6px;
}

.logout-btn {
  width: 100%;
  color: var(--accent-rose);
  border-color: #FECDD3;
  padding: 10px;
}

.app-version-text {
  text-align: center;
  font-size: 11px;
  color: var(--ink-muted);
  margin-top: 14px;
}
</style>
