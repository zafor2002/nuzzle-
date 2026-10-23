<template>
  <div class="lostfound-view">
    <TopBar title="🚨 Lost & Found Emergency Center" />

    <!-- Mode Toggle: Live Radar Map vs AI Bulletins -->
    <div class="lf-mode-tabs-bar">
      <div class="lf-mode-segmented">
        <button 
          id="lf-tab-radar-map"
          class="mode-btn" 
          :class="{ active: activeViewMode === 'map' }"
          @click="activeViewMode = 'map'"
        >
          <Radio :size="14" class="mode-icon-pulse" />
          <span>Live Radar Map</span>
          <span class="live-indicator-pill">LIVE</span>
        </button>
        <button 
          id="lf-tab-ai-bulletins"
          class="mode-btn" 
          :class="{ active: activeViewMode === 'bulletins' }"
          @click="activeViewMode = 'bulletins'"
        >
          <Camera :size="14" />
          <span>AI Bulletins</span>
          <span class="bulletins-count-badge">{{ lostFoundList.length }}</span>
        </button>
      </div>
    </div>

    <!-- 1. Realtime 5-Mile Interactive Radar Map -->
    <div v-show="activeViewMode === 'map'" class="radar-map-container-pane">
      <PetRadarMap />
    </div>

    <!-- 2. AI Biometric Sighting Bulletins List -->
    <div v-show="activeViewMode === 'bulletins'" class="lf-scroll-body">
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

      <!-- AI Visual & Semantic Radar Match Banner -->
      <div class="ai-radar-card">
        <div class="radar-header-row">
          <div class="radar-icon-pulse">📸</div>
          <div class="radar-title-col">
            <span class="radar-title">⚡ AI Visual Biometric & Radar Match</span>
            <span class="radar-sub">Snap or upload a spotted pet photo — Multimodal Vision AI visually cross-matches active lost pet alerts</span>
          </div>
        </div>

        <!-- Hidden file input for photo upload -->
        <input
          ref="sightingPhotoInput"
          type="file"
          accept="image/*"
          class="hidden-file-input"
          @change="onSightingPhotoSelected"
        />

        <!-- PROMINENT PHOTO UPLOAD ZONE -->
        <div class="radar-upload-dropzone" @click="triggerPhotoInput">
          <div v-if="!aiMatchImage" class="dropzone-empty">
            <div class="camera-pulse-btn">
              <Camera :size="20" />
            </div>
            <div class="dropzone-text">
              <span class="dropzone-title">📸 Tap to Upload or Snap Sighting Photo</span>
              <span class="dropzone-hint">JPG, PNG, or camera snapshot for multimodal AI visual matching</span>
            </div>
          </div>
          <div v-else class="dropzone-filled">
            <img :src="aiMatchImage" alt="Sighting photo" class="dropzone-thumb" />
            <div class="dropzone-details">
              <span class="dropzone-tag">✅ Sighting Photo Attached</span>
              <span class="dropzone-sub">Tap to change photo • Ready for AI comparison</span>
            </div>
            <button type="button" class="btn-remove-dropzone" @click.stop="removePhoto" title="Remove photo">
              <X :size="16" />
            </button>
          </div>
        </div>

        <div class="radar-input-row">
          <input
            v-model="aiMatchQuery"
            class="radar-input"
            placeholder="Additional notes (e.g. Near Banani Rd 11, collar)..."
            @keydown.enter.prevent="runAiRadarMatch"
          />
          <button
            class="btn-solid radar-match-btn"
            :disabled="isAiMatching || (!aiMatchQuery.trim() && !aiMatchImage)"
            @click="runAiRadarMatch"
          >
            <span v-if="isAiMatching">⏳ Scanning...</span>
            <span v-else>🔍 Run Match</span>
          </button>
        </div>

        <!-- 1. Non-Pet Warning Card -->
        <div v-if="aiMatchResult && (aiMatchResult.matchStatus === 'NOT_A_PET' || aiMatchResult.isPet === false)" class="ai-match-result not-pet-result">
          <div class="match-result-header">
            <div class="match-badge not-pet-badge">
              <span>⚠️ No Pet Detected in Sighting Photo</span>
            </div>
            <div class="match-confidence not-pet-confidence">0% Match</div>
          </div>
          <div class="not-pet-body">
            <div class="match-analysis-text">
              {{ aiMatchResult.aiAnalysis || 'The uploaded photo does not appear to contain a pet (detected human or non-pet subject). Please upload a clear photo of the animal.' }}
            </div>
            <div class="not-pet-tip">
              💡 <strong>Biometric Radar Tip:</strong> Ensure the sighted pet's face, coat, and ears are clearly visible with adequate lighting.
            </div>
            <button class="match-retry-btn" @click="triggerPhotoInput">📸 Upload Different Photo</button>
          </div>
          <div class="match-provider-tag">⚡ {{ aiMatchResult.provider }}</div>
        </div>

        <!-- 2. No Match Found Card -->
        <div v-else-if="aiMatchResult && (aiMatchResult.matchStatus === 'NO_MATCH' || !aiMatchResult.matchedLostReport)" class="ai-match-result no-match-result">
          <div class="match-result-header">
            <div class="match-badge no-match-badge">
              <span>🔍 No Matching Lost Pets Found</span>
            </div>
            <div class="match-confidence no-match-confidence">No Correlation</div>
          </div>
          <div class="no-match-body">
            <div class="match-analysis-text">
              {{ aiMatchResult.aiAnalysis || 'We scanned all active lost pet alerts in Dhaka, but found no visual correlation for this sighting.' }}
            </div>
            <div class="no-match-subtext">
              A sighting bulletin has been saved to the community radar so nearby pet owners can be alerted if a report is filed.
            </div>
          </div>
          <div class="match-provider-tag">⚡ {{ aiMatchResult.provider }}</div>
        </div>

        <!-- 3. Genuine Biometric Match Card -->
        <div v-else-if="aiMatchResult && aiMatchResult.matchedLostReport" class="ai-match-result">
          <div class="match-result-header">
            <div class="match-badge">
              <Sparkles :size="14" class="sparkle-icon" />
              <span>{{ aiMatchResult.visualComparison ? 'Visual Biometric Match Found' : 'AI Radar Match Found' }}</span>
            </div>
            <div class="match-confidence">{{ Math.round((aiMatchResult.confidenceScore || 0.94) * 100) }}% Similarity</div>
          </div>

          <!-- Side-by-Side Visual Comparison (When sighting photo or registered photo available) -->
          <div v-if="aiMatchImage || aiMatchResult.matchedLostReport?.imageUrl" class="visual-comparison-grid">
            <div class="comparison-col sighting-col">
              <span class="col-title">📍 Your Sighting</span>
              <div class="comparison-img-wrap">
                <img
                  :src="aiMatchImage || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80'"
                  alt="Sighted Pet"
                  class="comparison-img"
                />
                <span class="img-badge sighting-badge">Observed</span>
              </div>
            </div>

            <div class="comparison-divider">
              <div class="vs-circle">VS</div>
            </div>

            <div class="comparison-col matched-col">
              <span class="col-title">🚨 Registered Report</span>
              <div class="comparison-img-wrap">
                <img
                  :src="aiMatchResult.matchedLostReport?.imageUrl || 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&auto=format&fit=crop&q=80'"
                  alt="Registered Lost Pet"
                  class="comparison-img"
                />
                <span class="img-badge matched-badge">{{ aiMatchResult.matchedLostReport?.petName }}</span>
              </div>
            </div>
          </div>

          <!-- Visual Biometric Criteria Badges -->
          <div v-if="aiMatchResult.visualComparison" class="visual-criteria-box">
            <div v-if="aiMatchResult.visualComparison.coatMatch" class="criterion-item">
              <span class="crit-icon">🎨</span>
              <div class="crit-text">
                <span class="crit-label">Coat & Markings:</span>
                <span class="crit-val">{{ aiMatchResult.visualComparison.coatMatch }}</span>
              </div>
            </div>
            <div v-if="aiMatchResult.visualComparison.facialAndEars" class="criterion-item">
              <span class="crit-icon">🐾</span>
              <div class="crit-text">
                <span class="crit-label">Facial & Ears:</span>
                <span class="crit-val">{{ aiMatchResult.visualComparison.facialAndEars }}</span>
              </div>
            </div>
            <div v-if="aiMatchResult.visualComparison.collarObserved || aiMatchResult.visualComparison.distinctiveFeatures" class="criterion-item">
              <span class="crit-icon">🏷️</span>
              <div class="crit-text">
                <span class="crit-label">Collar & Features:</span>
                <span class="crit-val">{{ aiMatchResult.visualComparison.collarObserved || aiMatchResult.visualComparison.distinctiveFeatures }}</span>
              </div>
            </div>
          </div>

          <div class="match-analysis-text">{{ aiMatchResult.aiAnalysis }}</div>

          <div class="matched-pet-row">
            <div class="matched-pet-info">
              <span class="match-label">Pet Name:</span>
              <span class="match-value">{{ aiMatchResult.matchedLostReport?.petName }}</span>
            </div>
            <div class="matched-pet-info">
              <span class="match-label">Breed:</span>
              <span class="match-value">{{ aiMatchResult.matchedLostReport?.breed }}</span>
            </div>
            <div class="matched-pet-info">
              <span class="match-label">Owner:</span>
              <span class="match-value">{{ aiMatchResult.matchedLostReport?.ownerName }}</span>
            </div>
            <div class="matched-pet-info">
              <span class="match-label">Last Seen:</span>
              <span class="match-value">{{ aiMatchResult.matchedLostReport?.lastSeenLocation }}</span>
            </div>
          </div>

          <div class="match-actions-row">
            <a
              :href="'tel:' + aiMatchResult.matchedLostReport?.contactPhone"
              class="match-call-btn btn-solid"
            >
              <Phone :size="14" />
              <span>Call Owner: {{ aiMatchResult.matchedLostReport?.contactPhone }}</span>
            </a>
          </div>

          <div v-if="aiMatchResult.matchedLostReport?.reward" class="match-reward-pill">
            🏆 Reward: {{ aiMatchResult.matchedLostReport?.reward }}
          </div>
          <div class="match-provider-tag">⚡ {{ aiMatchResult.provider }}</div>
        </div>
        <div v-else-if="aiMatchError" class="ai-match-error">
          ⚠️ {{ aiMatchError }}
        </div>
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

              <!-- 5-Mile Geo-Blast Broadcast Active Beacon Badge -->
              <div v-if="item.geoBlastActive" class="geo-blast-active-badge">
                <span class="blast-beacon-dot"></span>
                <span class="blast-badge-text">
                  ⚡ 5-Mile Geo-Blast Active • {{ item.geoBlastRespondersCount || 86 }} Responders
                </span>
              </div>
              
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
              <span class="c-label">Reported by</span>
              <span class="c-val">{{ item.contactName }}</span>
            </div>

            <div class="action-buttons-group">
              <!-- Locate On Radar Map -->
              <button 
                v-if="item.lat && item.lng"
                type="button"
                class="btn-icon-subtle locate-btn"
                @click="locateOnMap(item)"
                title="View on Radar Map"
              >
                <MapPin :size="13" />
                <span class="btn-subtle-text">Map</span>
              </button>

              <!-- Call button -->
              <button class="btn-icon-subtle contact-call-btn" @click="callOwner(item.contactPhone)" title="Call">
                <Phone :size="13" />
                <span class="btn-subtle-text">Call</span>
              </button>

              <!-- Message button -->
              <button class="btn-icon-subtle contact-chat-btn" @click="chatOwner(item)" title="Chat">
                <MessageCircle :size="13" />
                <span class="btn-subtle-text">Chat</span>
              </button>

              <!-- Geo-Blast Broadcast Action Button (For Lost Pets) -->
              <button 
                v-if="item.status === 'lost' && !item.isClaimed"
                type="button"
                class="geo-blast-mini-btn"
                :class="{ 'blast-active': item.geoBlastActive }"
                @click="openGeoBlast(item)"
                title="Dispatch ৳499 WhatsApp & Push broadcast"
              >
                <Radio :size="12" />
                <span>{{ item.geoBlastActive ? 'Boost' : 'Blast' }}</span>
              </button>

              <!-- CLAIM / LOCK BUTTON -->
              <button 
                v-if="!item.isClaimed"
                class="claim-btn"
                @click="openClaimModal(item)"
              >
                <ShieldCheck :size="13" />
                <span>Claim / Help</span>
              </button>
              
              <button 
                v-else
                class="claimed-active-btn"
                @click="chatOwner(item)"
              >
                <MessageCircle :size="13" />
                <span>Coordinate</span>
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

    <!-- 5-Mile Emergency Geo-Blast Modal -->
    <GeoBlastModal />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MapPin, Phone, MessageCircle, ShieldCheck, X, Camera, Sparkles, Radio } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import PetRadarMap from '../components/map/PetRadarMap.vue';
import GeoBlastModal from '../components/lostfound/GeoBlastModal.vue';
import { 
  lostFoundList, 
  openChatWith, 
  isCreateSheetOpen, 
  claimLostFoundPet, 
  releaseLostFoundClaim,
  openGeoBlastModal,
  radarMapCenter,
  selectedRadarPet
} from '../stores/appStore';
import type { LostFoundPost } from '../types';

import { lostFoundService } from '../services';

const activeViewMode = ref<'map' | 'bulletins'>('map');
const filterStatus = ref<'all' | 'lost' | 'found'>('all');
const claimModalItem = ref<LostFoundPost | null>(null);
const selectedClaimType = ref<'owner_reunited' | 'volunteer_rescue' | 'foster_care'>('volunteer_rescue');
const claimNotesInput = ref('');
const lfToast = ref<string | null>(null);

// AI Visual Biometric & Radar Match state
const aiMatchQuery = ref('');
const aiMatchImage = ref<string | null>(null);
const sightingPhotoInput = ref<HTMLInputElement | null>(null);
const isAiMatching = ref(false);
const aiMatchResult = ref<any>(null);
const aiMatchError = ref<string | null>(null);

function triggerPhotoInput() {
  sightingPhotoInput.value?.click();
}

function onSightingPhotoSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    showToast('⚠️ Image file must be under 10MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    aiMatchImage.value = e.target?.result as string;
    showToast('📸 Sighting photo attached! Tap Match to compare.');
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  aiMatchImage.value = null;
  if (sightingPhotoInput.value) {
    sightingPhotoInput.value.value = '';
  }
}

async function runAiRadarMatch() {
  if ((!aiMatchQuery.value.trim() && !aiMatchImage.value) || isAiMatching.value) return;
  isAiMatching.value = true;
  aiMatchResult.value = null;
  aiMatchError.value = null;

  try {
    const res = await lostFoundService.matchLostFoundAi({
      sightingDescription: aiMatchQuery.value.trim() || 'Visual sighting photo match',
      imageUrl: aiMatchImage.value || undefined,
      location: 'Dhaka',
    });

    if (res.success && res.data) {
      aiMatchResult.value = res.data;
    } else {
      aiMatchError.value = res.error || 'No matching lost pet reports found in the radar zone.';
    }
  } catch (err: any) {
    aiMatchError.value = 'Unable to connect to AI radar. Please try again.';
    console.warn('[LostFound AI Match] Error:', err);
  } finally {
    isAiMatching.value = false;
  }
}

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

function locateOnMap(item: LostFoundPost) {
  if (item.lat && item.lng) {
    radarMapCenter.value = [item.lat, item.lng];
  }
  selectedRadarPet.value = item;
  activeViewMode.value = 'map';
}

function openGeoBlast(item: LostFoundPost) {
  openGeoBlastModal(item);
}
</script>

<style scoped>
.lostfound-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* Mode Switch Segmented Header */
.lf-mode-tabs-bar {
  padding: 6px 14px 6px;
  background: var(--bg-surface, #fff);
  border-bottom: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.06));
  flex-shrink: 0;
  z-index: 10;
}

.lf-mode-segmented {
  display: flex;
  background: rgba(0, 0, 0, 0.04);
  padding: 3px;
  border-radius: 10px;
  gap: 4px;
}

:root[class~="dark"] .lf-mode-tabs-bar {
  background: #111827;
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

:root[class~="dark"] .lf-mode-segmented {
  background: rgba(255, 255, 255, 0.06);
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  font-size: 0.775rem;
  font-weight: 600;
  color: var(--ink-muted, #64748b);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.mode-btn:hover {
  color: var(--ink-primary, #0f172a);
}

.mode-btn.active {
  background: #ffffff;
  color: #0f172a;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
}

:root[class~="dark"] .mode-btn.active {
  background: #1e293b;
  color: #f8fafc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.mode-icon-pulse {
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.9; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.9; }
}

.live-indicator-pill {
  background: #ef4444;
  color: #fff;
  font-size: 0.5625rem;
  font-weight: 900;
  padding: 1px 5px;
  border-radius: 9999px;
  letter-spacing: 0.04em;
}

.bulletins-count-badge {
  background: rgba(0, 0, 0, 0.06);
  color: #64748b;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 9999px;
}

.mode-btn.active .bulletins-count-badge {
  background: #f1f5f9;
  color: #0f172a;
}

:root[class~="dark"] .bulletins-count-badge {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

:root[class~="dark"] .mode-btn.active .bulletins-count-badge {
  background: rgba(255, 255, 255, 0.18);
  color: #f8fafc;
}

/* Map Pane Container */
.radar-map-container-pane {
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Geo-Blast Badge on Cards */
.geo-blast-active-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.725rem;
  font-weight: 700;
  color: #ef4444;
}

.blast-beacon-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse-beacon 1.2s infinite;
}

@keyframes pulse-beacon {
  0% { transform: scale(0.8); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.4; }
  100% { transform: scale(0.8); opacity: 1; }
}

.locate-btn {
  border-color: #3b82f6;
  color: #3b82f6;
  font-size: 0.775rem;
  padding: 6px 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.locate-btn:hover {
  background: rgba(59, 130, 246, 0.08);
}

.geo-blast-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  font-size: 0.775rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
  transition: all 0.2s;
}

.geo-blast-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.geo-blast-btn.blast-active {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
}

.lf-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px calc(96px + env(safe-area-inset-bottom, 16px));
}

.lf-header-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.lf-shield-icon {
  font-size: 22px;
}

.lf-header-text {
  flex: 1;
}

.lf-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink-primary, #0f172a);
}

.lf-desc {
  font-size: 11px;
  color: var(--ink-muted, #64748b);
  line-height: 1.35;
}

.report-fast-btn {
  background: #e11d48;
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  padding: 7px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.report-fast-btn:hover {
  background: #be123c;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.alert-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.alert-card.claimed-card {
  border-color: #a7f3d0;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.08);
}

.alert-status-header {
  padding: 7px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.status-left-label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.alert-status-header.lost {
  background: rgba(244, 63, 94, 0.08);
  color: #e11d48;
  border-bottom: 1px solid rgba(244, 63, 94, 0.12);
}

.alert-status-header.found {
  background: rgba(16, 185, 129, 0.08);
  color: #059669;
  border-bottom: 1px solid rgba(16, 185, 129, 0.12);
}

.alert-status-header.claimed {
  background: rgba(99, 102, 241, 0.08);
  color: #4f46e5;
  border-bottom: 1px solid rgba(99, 102, 241, 0.12);
}

.alert-status-header.reunited {
  background: rgba(245, 158, 11, 0.08);
  color: #d97706;
  border-bottom: 1px solid rgba(245, 158, 11, 0.12);
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
  padding: 8px 12px;
  background: var(--bg-card-subtle, #f8fafc);
  border-top: 1px solid var(--border-light, #e2e8f0);
  gap: 8px;
}

.contact-name-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.c-label {
  font-size: 9.5px;
  color: var(--ink-muted, #94a3b8);
  font-weight: 500;
  line-height: 1.2;
}

.c-val {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-primary, #1e293b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-buttons-group {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-shrink: 0;
}

.btn-icon-subtle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 5px 8px;
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap !important;
}

.btn-icon-subtle:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

.btn-subtle-text {
  font-size: 11px;
}

.geo-blast-mini-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 9px;
  font-size: 11px;
  font-weight: 700;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap !important;
  transition: all 0.15s ease;
}

.geo-blast-mini-btn:hover {
  background: #fee2e2;
}

.geo-blast-mini-btn.blast-active {
  background: #fffbeb;
  color: #d97706;
  border-color: #fde68a;
}

.claim-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 11px;
  font-size: 11.5px;
  font-weight: 700;
  color: #ffffff;
  background: #059669;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap !important;
  box-shadow: 0 1px 3px rgba(5, 150, 105, 0.2);
  transition: all 0.15s ease;
}

.claim-btn:hover {
  background: #047857;
  transform: translateY(-1px);
}

.claimed-active-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 11px;
  font-size: 11.5px;
  font-weight: 700;
  color: #ffffff;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap !important;
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.2);
  transition: all 0.15s ease;
}

.claimed-active-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

:root[class~="dark"] .alert-actions-footer {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(255, 255, 255, 0.06);
}

:root[class~="dark"] .btn-icon-subtle {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

:root[class~="dark"] .btn-icon-subtle:hover {
  background: #334155;
  color: #ffffff;
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

/* ===================== AI RADAR MATCH ===================== */
.ai-radar-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%);
  border: 1.5px solid rgba(99, 102, 241, 0.25);
  border-radius: 16px;
  padding: 12px 14px;
  margin-bottom: 10px;
}

.radar-header-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.radar-icon-pulse {
  font-size: 22px;
  animation: pulse 2s infinite;
  flex-shrink: 0;
}

.radar-title-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.radar-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--ink-primary);
  letter-spacing: -0.01em;
}

.radar-sub {
  font-size: 11px;
  color: var(--ink-secondary);
  line-height: 1.3;
}

.radar-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.radar-input {
  flex: 1;
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 8px 11px;
  font-size: 12px;
  background: var(--bg-card);
  color: var(--ink-primary);
  outline: none;
  transition: border-color 0.2s ease;
}

.radar-input:focus {
  border-color: var(--brand-primary);
}

.hidden-file-input {
  display: none !important;
}

/* Prominent Photo Upload Zone */
.radar-upload-dropzone {
  margin-bottom: 10px;
  background: var(--bg-card);
  border: 1.5px dashed rgba(99, 102, 241, 0.4);
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radar-upload-dropzone:hover {
  border-color: var(--brand-primary);
  background: rgba(99, 102, 241, 0.06);
  transform: translateY(-1px);
}

.dropzone-empty {
  display: flex;
  align-items: center;
  gap: 12px;
}

.camera-pulse-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand-primary), #8B5CF6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.dropzone-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropzone-title {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.dropzone-hint {
  font-size: 10.5px;
  color: var(--ink-muted);
}

.dropzone-filled {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropzone-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  border: 1.5px solid #10B981;
  flex-shrink: 0;
}

.dropzone-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.dropzone-tag {
  font-size: 12px;
  font-weight: 800;
  color: #059669;
}

.dropzone-sub {
  font-size: 10.5px;
  color: var(--ink-muted);
}

.btn-remove-dropzone {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
}

.btn-remove-dropzone:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
}

.radar-match-btn {
  flex-shrink: 0;
  font-size: 12px;
  padding: 8px 16px;
  border-radius: 10px;
  white-space: nowrap;
  font-weight: 700;
}

.radar-match-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1px;
}

.preview-tag {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.preview-sub {
  font-size: 10px;
  color: var(--ink-muted);
}

.btn-remove-preview {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-remove-preview:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* AI Match Result */
.ai-match-result {
  margin-top: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 14px;
  padding: 13px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.match-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.match-badge {
  font-size: 11.5px;
  font-weight: 800;
  color: #059669;
  display: flex;
  align-items: center;
  gap: 5px;
}

.sparkle-icon {
  color: #10B981;
}

.match-confidence {
  font-size: 11px;
  font-weight: 800;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.2));
  color: #065F46;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

:global([data-theme='dark']) .match-confidence {
  background: rgba(16, 185, 129, 0.25);
  color: #6EE7B7;
}

/* Side-by-Side Visual Comparison Grid */
.visual-comparison-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.04);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  padding: 8px 10px;
}

.comparison-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.col-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--ink-secondary);
  text-transform: uppercase;
  letter-spacing: 0.2px;
}

.comparison-img-wrap {
  position: relative;
  width: 100%;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  border: 1.5px solid var(--border-light);
}

.comparison-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.sighting-badge {
  background: rgba(99, 102, 241, 0.85);
  color: #fff;
}

.matched-badge {
  background: rgba(239, 68, 68, 0.88);
  color: #fff;
}

.comparison-divider {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary), #8B5CF6);
  color: #fff;
  font-size: 9.5px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

/* Visual Biometric Criteria Box */
.visual-criteria-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: var(--bg-hover);
  border-radius: 8px;
  padding: 8px 10px;
  border: 1px solid var(--border-light);
}

.criterion-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11px;
}

.crit-icon {
  font-size: 13px;
  flex-shrink: 0;
  margin-top: -1px;
}

.crit-text {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  line-height: 1.35;
}

.crit-label {
  font-weight: 700;
  color: var(--ink-primary);
}

.crit-val {
  color: var(--ink-secondary);
}

.match-analysis-text {
  font-size: 11.5px;
  color: var(--ink-secondary);
  line-height: 1.4;
  font-style: italic;
  border-left: 2.5px solid #10B981;
  padding-left: 8px;
}

.matched-pet-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  background: var(--bg-hover);
  padding: 8px 10px;
  border-radius: 8px;
}

.matched-pet-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.match-label {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.match-value {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-primary);
}

.match-actions-row {
  display: flex;
  gap: 8px;
}

.match-call-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 12px;
  padding: 9px 12px;
  border-radius: 10px;
  gap: 6px;
  background: linear-gradient(135deg, #10B981, #059669);
  color: #fff;
  font-weight: 700;
}

.match-reward-pill {
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: #92400E;
  background: #FEF3C7;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #FCD34D;
}

.match-provider-tag {
  font-size: 9.5px;
  color: var(--brand-primary);
  font-weight: 600;
  text-align: right;
}

.ai-match-error {
  margin-top: 8px;
  font-size: 11.5px;
  color: #DC2626;
  background: rgba(239, 68, 68, 0.07);
  padding: 8px 10px;
  border-radius: 8px;
  border-left: 3px solid #EF4444;
}

/* Non-Pet Alert Card Styles */
.not-pet-result {
  border-color: rgba(245, 158, 11, 0.45);
  background: rgba(245, 158, 11, 0.04);
}

.not-pet-badge {
  color: #D97706;
}

.not-pet-confidence {
  background: rgba(245, 158, 11, 0.15);
  color: #B45309;
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.not-pet-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.not-pet-body .match-analysis-text {
  border-left-color: #F59E0B;
  color: var(--ink-primary);
  font-style: normal;
  font-weight: 500;
}

.not-pet-tip {
  font-size: 11px;
  background: rgba(99, 102, 241, 0.06);
  border: 1px dashed rgba(99, 102, 241, 0.25);
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.match-retry-btn {
  align-self: flex-start;
  font-size: 11.5px;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 8px;
  background: var(--brand-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  margin-top: 2px;
  transition: opacity 0.2s;
}

.match-retry-btn:hover {
  opacity: 0.9;
}

/* No Match Found Card Styles */
.no-match-result {
  border-color: rgba(99, 102, 241, 0.3);
  background: rgba(99, 102, 241, 0.03);
}

.no-match-badge {
  color: var(--brand-primary);
}

.no-match-confidence {
  background: rgba(99, 102, 241, 0.1);
  color: var(--brand-primary);
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.no-match-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.no-match-body .match-analysis-text {
  border-left-color: var(--brand-primary);
  color: var(--ink-primary);
  font-style: normal;
}

.no-match-subtext {
  font-size: 11px;
  color: var(--ink-muted);
  line-height: 1.35;
}
</style>


