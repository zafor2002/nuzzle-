<template>
  <div class="lostfound-view">
    <TopBar title="🚨 5-Mile Emergency Radar" />

    <div class="lf-scroll-body">
      <!-- Live 5-Mile Radar Scanner Pulse Card (PPTX Slide 5 & 8) -->
      <div class="radar-scan-card">
        <div class="radar-scan-graphic">
          <div class="radar-pulse-ring ring-1"></div>
          <div class="radar-pulse-ring ring-2"></div>
          <div class="radar-center-blip">🚨</div>
          <div class="radar-stray-blip blip-1" title="Active Lost Report">🐾</div>
          <div class="radar-stray-blip blip-2" title="Nearby Volunteer">🚑</div>
        </div>

        <div class="radar-info-col">
          <div class="radar-live-badge">
            <span class="live-pulse-dot"></span>
            <span>LIVE 5-MILE GEO-FENCE RADAR</span>
          </div>
          <h3 class="radar-title">Dhaka Emergency Alert Network</h3>
          <p class="radar-desc">
            Visual embedding photo matcher & zero-barrier dispatch. <30s report broadcast to local rescuers.
          </p>
          <div class="radar-stats-row">
            <span class="r-stat">📍 Gulshan • Banani • Baridhara</span>
            <span class="r-stat highlight">⚡ 12 Active Responders</span>
          </div>
        </div>
      </div>

      <!-- Zero-Barrier Fast Report Banner (PPTX Slide 3 & 5) -->
      <div class="fast-dispatch-banner">
        <div class="dispatch-text">
          <span class="d-title">Spotted an Injured or Lost Animal?</span>
          <span class="d-sub">Zero-barrier &lt;30 second emergency street-rescue report.</span>
        </div>
        <button class="btn-primary dispatch-btn" @click="isCreateSheetOpen = true">
          <AlertCircle :size="15" />
          <span>Report & Dispatch</span>
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-chips-row">
        <button 
          class="filter-chip" 
          :class="{ active: filterStatus === 'all' }"
          @click="filterStatus = 'all'"
        >
          All Radar Alerts ({{ lostFoundList.length }})
        </button>
        <button 
          class="filter-chip" 
          :class="{ active: filterStatus === 'lost' }"
          @click="filterStatus = 'lost'"
        >
          🚨 Missing / Lost ({{ lostCount }})
        </button>
        <button 
          class="filter-chip" 
          :class="{ active: filterStatus === 'found' }"
          @click="filterStatus = 'found'"
        >
          🐾 Found / Stray ({{ foundCount }})
        </button>
      </div>

      <!-- Alerts List with Claim-and-Lock Status (PPTX Slide 5) -->
      <div class="alerts-list">
        <div 
          v-for="item in filteredList" 
          :key="item.id"
          class="alert-card card"
        >
          <!-- Status Banner & Claim-and-Lock Indicator -->
          <div class="alert-status-header" :class="item.status">
            <div class="status-badge-wrap">
              <span class="status-dot"></span>
              <span class="status-title-text">
                {{ item.status === 'lost' ? '🚨 5-MILE LOST PET ALERT' : '🐾 FOUND PET REPORT' }}
              </span>
            </div>

            <!-- Claim-and-Lock Tag (PPTX Slide 5) -->
            <div class="claim-lock-badge" :class="item.id === 'lf_1' ? 'claimed' : 'unclaimed'">
              <span v-if="item.id === 'lf_1'">🔒 Claimed: NGO Volunteer on way (ETA 6m)</span>
              <span v-else>🔓 Open Broadcast (Unclaimed)</span>
            </div>
          </div>

          <!-- Pet Media & Main Info -->
          <div class="alert-body-content">
            <div class="alert-img-holder">
              <img :src="item.imageUrl" :alt="item.petName" class="alert-pet-img" />
              <!-- AI Visual Match Badge -->
              <div class="ai-match-tag">
                <Sparkles :size="10" />
                <span>98.4% AI Match</span>
              </div>
            </div>

            <div class="alert-details">
              <div class="pet-title-line">
                <h4 class="pet-name-heading">{{ item.petName }}</h4>
                <span v-if="item.reward" class="reward-pill">{{ item.reward }}</span>
              </div>
              
              <span class="pet-species-breed">{{ item.species }} • {{ item.breed || 'Unknown breed' }}</span>
              
              <div class="location-row">
                <MapPin :size="13" class="loc-icon" />
                <span class="location-text">{{ item.location }}</span>
              </div>

              <p class="description-text">{{ item.description }}</p>

              <!-- Microchip & Security tag -->
              <div class="microchip-tag-line">
                <Fingerprint :size="12" />
                <span>Microchip Tagged • Verified Nuzzle Identity</span>
              </div>
            </div>
          </div>

          <!-- Contact & Action Footer -->
          <div class="alert-actions-footer">
            <div class="contact-name-info">
              <span class="c-label">Reported by:</span>
              <span class="c-val">{{ item.contactName }} ({{ item.reportedAt }})</span>
            </div>

            <div class="action-buttons-group">
              <button class="btn-secondary contact-call-btn" @click="callOwner(item.contactPhone)">
                <Phone :size="14" />
                <span>Call</span>
              </button>

              <button class="btn-primary contact-chat-btn" @click="chatOwner(item)">
                <MessageCircle :size="14" />
                <span>Message</span>
              </button>

              <button 
                class="btn-claim-lock" 
                :class="item.id === 'lf_1' ? 'claimed' : 'unclaimed'"
                @click="toggleClaim(item.id)"
              >
                <span>{{ item.id === 'lf_1' ? 'Locked 🔒' : 'Claim & Lock' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MapPin, Phone, MessageCircle, AlertCircle, Sparkles, Fingerprint } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { lostFoundList, openChatWith, isCreateSheetOpen } from '../stores/appStore';
import type { LostFoundPost } from '../types';

const filterStatus = ref<'all' | 'lost' | 'found'>('all');

const lostCount = computed(() => lostFoundList.filter(i => i.status === 'lost').length);
const foundCount = computed(() => lostFoundList.filter(i => i.status === 'found').length);

const filteredList = computed(() => {
  if (filterStatus.value === 'all') return lostFoundList;
  return lostFoundList.filter(i => i.status === filterStatus.value);
});

function callOwner(phone: string) {
  alert(`Connecting 24/7 direct phone call to: ${phone}`);
}

function chatOwner(item: LostFoundPost) {
  openChatWith(
    item.contactName, 
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    item.petName,
    `Hi ${item.contactName}, I have visual confirmation regarding ${item.petName} (${item.status})!`
  );
}

function toggleClaim(id: string) {
  alert(`⚡ Claim-and-Lock Status Updated! Your responder dispatch route is now locked to prevent duplicate volunteer runs.`);
}
</script>

<style scoped>
.lostfound-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-app);
}

.lf-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px 28px;
}

/* ================================================= */
/* LIVE RADAR SCANNER PULSE CARD (Slide 5 & 8)      */
/* ================================================= */
.radar-scan-card {
  background: linear-gradient(135deg, #261E38 0%, #3B2D57 100%);
  color: #fff;
  border-radius: 20px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
  box-shadow: 0 8px 24px rgba(38, 30, 56, 0.25);
  position: relative;
  overflow: hidden;
}

.radar-scan-graphic {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: rgba(148, 125, 238, 0.15);
  border: 1px solid rgba(148, 125, 238, 0.4);
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.radar-pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid #A78BFA;
  animation: radarWave 2.4s cubic-bezier(0.1, 0.2, 0.7, 1) infinite;
}

.radar-pulse-ring.ring-2 {
  animation-delay: 1.2s;
}

@keyframes radarWave {
  0%   { transform: scale(0.3); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}

.radar-center-blip {
  font-size: 20px;
  z-index: 2;
}

.radar-stray-blip {
  position: absolute;
  font-size: 11px;
  background: rgba(225, 29, 72, 0.9);
  padding: 2px 4px;
  border-radius: 50%;
  z-index: 2;
}

.radar-stray-blip.blip-1 { top: 6px; right: 10px; }
.radar-stray-blip.blip-2 { bottom: 8px; left: 10px; background: #059669; }

.radar-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.radar-live-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 8.5px;
  font-weight: 800;
  color: #FDE047;
  letter-spacing: 0.06em;
}

.live-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E11D48;
  box-shadow: 0 0 8px #E11D48;
  animation: pulseDot 1.4s infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.4); }
}

.radar-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 800;
  color: #FFFFFF;
}

.radar-desc {
  font-size: 10.5px;
  color: #DDD6F3;
  line-height: 1.35;
}

.radar-stats-row {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  font-size: 9.5px;
  font-weight: 700;
}

.r-stat { color: #B8ACDC; }
.r-stat.highlight { color: #6EE7B7; }

/* Fast Dispatch Banner */
.fast-dispatch-banner {
  background: linear-gradient(135deg, rgba(225, 29, 72, 0.08), rgba(225, 29, 72, 0.14));
  border: 1.5px solid rgba(225, 29, 72, 0.35);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.dispatch-text {
  display: flex;
  flex-direction: column;
}

.d-title {
  font-size: 12px;
  font-weight: 800;
  color: var(--accent-rose);
}

.d-sub {
  font-size: 10px;
  color: var(--ink-secondary);
}

.dispatch-btn {
  font-size: 11.5px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #E11D48, #BE123C);
  box-shadow: 0 2px 8px rgba(225, 29, 72, 0.35);
  flex-shrink: 0;
}

/* Filter Chips */
.filter-chips-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: 10px;
  scrollbar-width: none;
}

/* Alerts List */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-card {
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
}

.alert-status-header {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.alert-status-header.lost {
  background: #FFF1F2;
  color: #BE123C;
  border-bottom: 1px solid #FECDD3;
}

.alert-status-header.found {
  background: #D1FAE5;
  color: #047857;
  border-bottom: 1px solid #A7F3D0;
}

.status-badge-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.claim-lock-badge {
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.claim-lock-badge.claimed {
  background: #E0E7FF;
  color: #4338CA;
  border: 1px solid #C7D2FE;
}

.claim-lock-badge.unclaimed {
  background: #FEF3C7;
  color: #B45309;
  border: 1px solid #FDE68A;
}

.alert-body-content {
  display: flex;
  gap: 12px;
  padding: 12px;
}

.alert-img-holder {
  width: 95px;
  height: 95px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  border: 1px solid var(--border-light);
}

.alert-pet-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-match-tag {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  background: rgba(38, 30, 56, 0.85);
  color: #FDE047;
  font-size: 8px;
  font-weight: 800;
  padding: 2px 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  backdrop-filter: blur(4px);
}

.alert-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pet-title-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pet-name-heading {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
}

.reward-pill {
  background: #FFE4E6;
  border: 1px solid var(--accent-rose);
  color: var(--accent-rose);
  padding: 1px 7px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 800;
}

.pet-species-breed {
  font-size: 11px;
  font-weight: 700;
  color: var(--brand-dark);
}

.location-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--ink-secondary);
}

.loc-icon { color: var(--accent-rose); }

.description-text {
  font-size: 11px;
  color: var(--ink-secondary);
  line-height: 1.35;
  margin-top: 2px;
}

.microchip-tag-line {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9.5px;
  color: var(--accent-emerald);
  font-weight: 700;
  margin-top: 4px;
}

/* Actions Footer */
.alert-actions-footer {
  padding: 8px 12px;
  background: var(--bg-card-subtle);
  border-top: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.contact-name-info {
  display: flex;
  flex-direction: column;
}

.c-label {
  font-size: 8.5px;
  color: var(--ink-muted);
  font-weight: 700;
}

.c-val {
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-primary);
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-call-btn, .contact-chat-btn {
  font-size: 11px;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: var(--radius-full);
}

.btn-claim-lock {
  font-size: 10px;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--brand-primary);
  background: var(--brand-soft);
  color: var(--brand-dark);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-claim-lock:hover {
  background: var(--brand-primary);
  color: #fff;
}
</style>
