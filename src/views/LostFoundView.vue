<template>
  <div class="lostfound-view">
    <TopBar title="🚨 Lost & Found Emergency Center" />

    <div class="lf-scroll-body">
      <!-- Top Alert Notice -->
      <div class="lf-header-card">
        <div class="lf-shield-icon">🚨</div>
        <div class="lf-header-text">
          <h3 class="lf-title">Community Pet Alert Network</h3>
          <p class="lf-desc">5-mile emergency radar with Claim-and-Lock volunteer dispatch.</p>
        </div>
        <button class="btn-solid report-fast-btn" @click="isCreateSheetOpen = true">
          + Report
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-chips-row">
        <button 
          class="filter-chip" 
          :class="{ active: filterStatus === 'all' }"
          @click="selectFilter('all')"
        >
          All Alerts ({{ lostFoundList.length }})
        </button>
        <button 
          class="filter-chip" 
          :class="{ active: filterStatus === 'lost' }"
          @click="selectFilter('lost')"
        >
          🚨 Missing / Lost ({{ lostCount }})
        </button>
        <button 
          class="filter-chip" 
          :class="{ active: filterStatus === 'found' }"
          @click="selectFilter('found')"
        >
          🐾 Found Pets ({{ foundCount }})
        </button>
      </div>

      <!-- Alerts List -->
      <div class="alerts-list">
        <div 
          v-for="item in filteredList" 
          :key="item.id"
          class="alert-card card-item"
          :class="{ 'claimed-card': item.isClaimed }"
        >
          <!-- Status Banner -->
          <div 
            class="alert-status-header" 
            :class="[item.isClaimed ? (item.claimType === 'owner_reunited' ? 'reunited' : 'claimed') : item.status]"
          >
            <div class="status-left-label">
              <ShieldCheck v-if="item.isClaimed" :size="14" class="stat-icon" />
              <span class="status-title-text">
                <template v-if="item.isClaimed">
                  {{ item.claimType === 'owner_reunited' ? '🎉 REUNITED WITH FAMILY' : '🔒 RESCUE DISPATCH CLAIMED' }}
                </template>
                <template v-else>
                  {{ item.status === 'lost' ? '🚨 LOST PET ALERT' : '🐾 FOUND PET REPORT' }}
                </template>
              </span>
            </div>
            
            <span v-if="item.reward && !item.isClaimed" class="reward-pill">{{ item.reward }}</span>
            <span v-else class="time-reported">{{ item.isClaimed ? item.claimedAt : item.reportedAt }}</span>
          </div>

          <!-- Claimed Volunteer Strip if Claimed -->
          <div v-if="item.isClaimed" class="claimed-banner-strip">
            <div class="c-strip-text">
              <span class="c-by">
                {{ item.claimType === 'owner_reunited' ? 'Reunited by Owner:' : '🛡️ Dispatch Locked by:' }}
                <strong>{{ item.claimedBy }}</strong>
              </span>
              <span v-if="item.claimNotes" class="c-note">"{{ item.claimNotes }}"</span>
            </div>
            <button class="release-btn" @click="handleReleaseClaim(item)" title="Release Claim">
              Release
            </button>
          </div>

          <!-- Pet Media & Main Info -->
          <div class="alert-body-content">
            <div class="alert-img-holder">
              <img :src="item.imageUrl" :alt="item.petName" class="alert-pet-img" />
              <div v-if="item.isClaimed" class="claimed-watermark">
                {{ item.claimType === 'owner_reunited' ? 'REUNITED' : 'CLAIMED' }}
              </div>
            </div>

            <div class="alert-details">
              <div class="pet-name-row">
                <h4 class="pet-name-heading">{{ item.petName }}</h4>
                <span v-if="item.isClaimed" class="claimed-chip-badge">Locked 🔒</span>
              </div>
              <span class="pet-species-breed">{{ item.species }} • {{ item.breed || 'Unknown breed' }}</span>
              
              <div class="location-row">
                <MapPin :size="14" class="loc-icon" />
                <span class="location-text">{{ item.location }}</span>
              </div>

              <p class="description-text">{{ item.description }}</p>
            </div>
          </div>

          <!-- Contact & Action Footer -->
          <div class="alert-actions-footer">
            <div class="contact-name-info">
              <span class="c-label">Reported by:</span>
              <span class="c-val">{{ item.contactName }}</span>
            </div>

            <div class="action-buttons-group">
              <!-- Call button -->
              <button class="btn-outline contact-call-btn" @click="callOwner(item.contactPhone)">
                <Phone :size="14" />
                <span>Call</span>
              </button>

              <!-- Message button -->
              <button class="btn-outline contact-chat-btn" @click="chatOwner(item)">
                <MessageCircle :size="14" />
                <span>Message</span>
              </button>

              <!-- CLAIM / LOCK BUTTON -->
              <button 
                v-if="!item.isClaimed"
                class="btn-solid claim-btn"
                @click="openClaimModal(item)"
              >
                <ShieldCheck :size="15" />
                <span>Claim / Book Help</span>
              </button>
              
              <button 
                v-else
                class="btn-solid claimed-active-btn"
                @click="chatOwner(item)"
              >
                <span>Coordinate Care 💬</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CLAIM & LOCK RESCUE DISPATCH MODAL -->
    <div v-if="claimModalItem" class="modal-scrim" @click.self="claimModalItem = null">
      <div class="bottom-sheet claim-sheet">
        <div class="sheet-handle"></div>
        
        <div class="sheet-header">
          <div class="claim-modal-head">
            <ShieldCheck :size="20" class="gold-icon" />
            <h3 class="sheet-title">Claim Pet & Lock Dispatch</h3>
          </div>
          <button class="btn-icon" @click="claimModalItem = null">
            <X :size="20" />
          </button>
        </div>

        <div class="claim-modal-body">
          <div class="target-pet-card">
            <img :src="claimModalItem.imageUrl" :alt="claimModalItem.petName" class="t-pet-thumb" />
            <div class="t-pet-info">
              <h4 class="t-pet-name">{{ claimModalItem.petName }}</h4>
              <span class="t-pet-loc">{{ claimModalItem.species }} • {{ claimModalItem.location }}</span>
              <span class="t-pet-status">Status: {{ claimModalItem.status.toUpperCase() }}</span>
            </div>
          </div>

          <div class="claim-options-group">
            <label class="claim-opt-label">Select Your Claim / Help Role:</label>
            
            <div 
              class="claim-option-tile"
              :class="{ selected: selectedClaimType === 'owner_reunited' }"
              @click="selectedClaimType = 'owner_reunited'"
            >
              <div class="opt-radio" :class="{ active: selectedClaimType === 'owner_reunited' }"></div>
              <div class="opt-text">
                <span class="opt-title">🏠 I am the Owner (Pet Found & Reunited 🎉)</span>
                <span class="opt-desc">Marks alert as resolved and notifies community that pet is safe at home.</span>
              </div>
            </div>

            <div 
              class="claim-option-tile"
              :class="{ selected: selectedClaimType === 'volunteer_rescue' }"
              @click="selectedClaimType = 'volunteer_rescue'"
            >
              <div class="opt-radio" :class="{ active: selectedClaimType === 'volunteer_rescue' }"></div>
              <div class="opt-text">
                <span class="opt-title">🛡️ Volunteer / NGO Rescuer (Lock Dispatch)</span>
                <span class="opt-desc">Locks report to prevent duplicate rescue runs. Coordinates intake & vet scan.</span>
              </div>
            </div>

            <div 
              class="claim-option-tile"
              :class="{ selected: selectedClaimType === 'foster_care' }"
              @click="selectedClaimType = 'foster_care'"
            >
              <div class="opt-radio" :class="{ active: selectedClaimType === 'foster_care' }"></div>
              <div class="opt-text">
                <span class="opt-title">🏡 Temporary Foster / Safe Haven Hold</span>
                <span class="opt-desc">Offering temporary safe housing while owner is located.</span>
              </div>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Rescue Notes & Next Steps (Optional):</label>
            <input 
              v-model="claimNotesInput" 
              placeholder="e.g. Taking to Rose City Vet for RFID microchip scan..." 
              class="form-input"
            />
          </div>

          <button class="btn-solid confirm-claim-btn" @click="handleConfirmClaim">
            Confirm & Lock Dispatch 🔒
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast-slide">
      <div v-if="lfToast" class="lf-toast-bar">
        {{ lfToast }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MapPin, Phone, MessageCircle, ShieldCheck, X } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { 
  lostFoundList, 
  openChatWith, 
  isCreateSheetOpen, 
  claimLostFoundPet, 
  releaseLostFoundClaim 
} from '../stores/appStore';
import type { LostFoundPost } from '../types';

import { lostFoundService } from '../services';

const filterStatus = ref<'all' | 'lost' | 'found'>('all');
const claimModalItem = ref<LostFoundPost | null>(null);
const selectedClaimType = ref<'owner_reunited' | 'volunteer_rescue' | 'foster_care'>('volunteer_rescue');
const claimNotesInput = ref('');
const lfToast = ref<string | null>(null);

function selectFilter(status: 'all' | 'lost' | 'found') {
  filterStatus.value = status;
  lostFoundService.getReports(status).catch(() => {});
}

const lostCount = computed(() => lostFoundList.filter(i => i.status === 'lost').length);
const foundCount = computed(() => lostFoundList.filter(i => i.status === 'found').length);

const filteredList = computed(() => {
  if (filterStatus.value === 'all') return lostFoundList;
  return lostFoundList.filter(i => i.status === filterStatus.value);
});

function callOwner(phone: string) {
  alert(`Connecting phone call to: ${phone}`);
}

function chatOwner(item: LostFoundPost) {
  openChatWith(
    item.contactName, 
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    item.petName,
    `Hi ${item.contactName}, I'm coordinating regarding ${item.petName} (${item.status.toUpperCase()})!`
  );
}

function openClaimModal(item: LostFoundPost) {
  claimModalItem.value = item;
  claimNotesInput.value = '';
  selectedClaimType.value = item.status === 'found' ? 'volunteer_rescue' : 'owner_reunited';
}

function handleConfirmClaim() {
  if (!claimModalItem.value) return;

  claimLostFoundPet(
    claimModalItem.value.id,
    selectedClaimType.value,
    claimNotesInput.value
  );

  showToast(
    selectedClaimType.value === 'owner_reunited'
      ? `🎉 ${claimModalItem.value.petName} marked as Reunited with Family!`
      : `🔒 Rescue Dispatch Locked for ${claimModalItem.value.petName}!`
  );

  claimModalItem.value = null;
}

function handleReleaseClaim(item: LostFoundPost) {
  if (confirm(`Release claim on ${item.petName}? Report will be open for other volunteers.`)) {
    releaseLostFoundClaim(item.id);
    showToast(`🔓 Claim on ${item.petName} released.`);
  }
}

function showToast(msg: string) {
  lfToast.value = msg;
  setTimeout(() => {
    lfToast.value = null;
  }, 2400);
}
</script>

<style scoped>
.lostfound-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.lf-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.lf-header-card {
  background: linear-gradient(135deg, #FFF1F2, #FFE4E6);
  border: 1.5px solid #FDA4AF;
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.lf-shield-icon {
  font-size: 26px;
}

.lf-header-text {
  flex: 1;
}

.lf-title {
  font-size: 14px;
  font-weight: 800;
  color: #9F1239;
}

.lf-desc {
  font-size: 11.5px;
  color: #BE123C;
  line-height: 1.35;
}

.report-fast-btn {
  background: #E11D48;
  font-size: 12.5px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.alert-card {
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;
}

.alert-card.claimed-card {
  border-color: #34D399;
  box-shadow: 0 4px 18px rgba(16, 185, 129, 0.15);
}

.alert-status-header {
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.status-left-label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.alert-status-header.lost {
  background: #FFE4E6;
  color: #BE123C;
  border-bottom: 1px solid #FECDD3;
}

.alert-status-header.found {
  background: #D1FAE5;
  color: #047857;
  border-bottom: 1px solid #A7F3D0;
}

.alert-status-header.claimed {
  background: #ECFDF5;
  color: #065F46;
  border-bottom: 1.5px solid #6EE7B7;
}

.alert-status-header.reunited {
  background: linear-gradient(135deg, #FEF3C7, #EDE9FE);
  color: #7C3AED;
  border-bottom: 1.5px solid #C4B5FD;
}

/* Claimed Banner Strip */
.claimed-banner-strip {
  background: #F0FDF4;
  border-bottom: 1px solid #BBF7D0;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

:global([data-theme='dark']) .claimed-banner-strip {
  background: rgba(6, 95, 70, 0.3);
  border-color: rgba(52, 211, 153, 0.3);
}

.c-strip-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.c-by {
  font-size: 11px;
  color: #065F46;
}

:global([data-theme='dark']) .c-by {
  color: #6EE7B7;
}

.c-note {
  font-size: 10.5px;
  color: #047857;
  font-style: italic;
}

.release-btn {
  font-size: 10.5px;
  font-weight: 700;
  color: #E11D48;
  background: #FFE4E6;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  border: 1px solid #FDA4AF;
}

.reward-pill {
  background: #FEE2E2;
  border: 1px solid #EF4444;
  color: #DC2626;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
}

.alert-body-content {
  display: flex;
  gap: 12px;
  padding: 14px;
}

.alert-img-holder {
  width: 95px;
  height: 95px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}

.alert-pet-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.claimed-watermark {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  text-align: center;
  padding: 2px 0;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.alert-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pet-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pet-name-heading {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.claimed-chip-badge {
  font-size: 10px;
  font-weight: 800;
  background: #D1FAE5;
  color: #047857;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.pet-species-breed {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-primary);
  margin-bottom: 4px;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--ink-muted);
  margin-bottom: 6px;
}

.loc-icon {
  color: var(--accent-rose);
}

.description-text {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.alert-actions-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-card-subtle);
  border-top: 1px solid var(--border-light);
  gap: 6px;
}

.contact-name-info {
  display: flex;
  flex-direction: column;
  min-width: 75px;
}

.c-label {
  font-size: 10px;
  color: var(--ink-muted);
}

.c-val {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 85px;
}

.action-buttons-group {
  display: flex;
  gap: 6px;
  align-items: center;
}

.contact-call-btn, .contact-chat-btn {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: var(--radius-full);
}

.claim-btn {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #10B981, #059669);
  color: #fff;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.claimed-active-btn {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: var(--radius-full);
  background: var(--brand-primary);
}

/* CLAIM MODAL */
.claim-sheet {
  height: 82%;
}

.claim-modal-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gold-icon {
  color: #10B981;
}

.claim-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.target-pet-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 10px;
}

.t-pet-thumb {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.t-pet-info {
  display: flex;
  flex-direction: column;
}

.t-pet-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
}

.t-pet-loc {
  font-size: 11.5px;
  color: var(--ink-secondary);
}

.t-pet-status {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--brand-primary);
}

.claim-options-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.claim-opt-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--ink-secondary);
}

.claim-option-tile {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  cursor: pointer;
  transition: all 0.15s ease;
}

.claim-option-tile:hover {
  border-color: var(--brand-primary);
}

.claim-option-tile.selected {
  background: #F0FDF4;
  border-color: #10B981;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.15);
}

:global([data-theme='dark']) .claim-option-tile.selected {
  background: rgba(6, 95, 70, 0.25);
  border-color: #34D399;
}

.opt-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border-strong);
  margin-top: 2px;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.opt-radio.active {
  border-color: #10B981;
  background: #10B981;
  box-shadow: inset 0 0 0 3px #fff;
}

.opt-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.opt-title {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.opt-desc {
  font-size: 11px;
  color: var(--ink-muted);
  line-height: 1.35;
}

.confirm-claim-btn {
  width: 100%;
  padding: 12px;
  font-size: 13.5px;
  background: linear-gradient(135deg, #10B981, #059669);
  color: #fff;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  margin-top: 4px;
}

/* Toast */
.lf-toast-bar {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 18, 42, 0.95);
  color: #fff;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  z-index: 100;
  white-space: nowrap;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>

