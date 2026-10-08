<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" id="geo-blast-modal-backdrop" @click.self="handleClose">
      <div class="geo-blast-card" id="geo-blast-modal-container" role="dialog" aria-modal="true">
        <!-- Close Button -->
        <button 
          id="geo-blast-close-btn"
          class="modal-close-btn" 
          @click="handleClose"
          aria-label="Close modal"
        >
          <X :size="20" />
        </button>

        <!-- Header with Pulsating Emergency Icon -->
        <div class="modal-header">
          <div class="emergency-beacon-badge">
            <span class="beacon-pulse"></span>
            <span class="beacon-icon">⚡</span>
          </div>
          <div class="modal-header-text">
            <h2 class="modal-title">Emergency 5-Mile Geo-Blast</h2>
            <p class="modal-subtitle">
              Instant WhatsApp & Push broadcast to all Dhaka volunteers, shelters, & 24/7 ICU clinics within 5km.
            </p>
          </div>
        </div>

        <!-- Target Pet Summary Card -->
        <div v-if="pet" class="target-pet-card" id="geo-blast-pet-target">
          <img :src="pet.imageUrl" :alt="pet.petName" class="target-pet-thumb" />
          <div class="target-pet-info">
            <div class="target-name-row">
              <span class="target-pet-name">{{ pet.petName }}</span>
              <span class="target-status-tag" :class="pet.status">
                {{ pet.status === 'lost' ? '🚨 MISSING' : '🐾 FOUND' }}
              </span>
            </div>
            <p class="target-pet-breed">{{ pet.breed || pet.species }} • {{ pet.areaName || pet.location }}</p>
            <div class="target-reward-row" v-if="pet.reward">
              <Award :size="13" class="reward-icon" />
              <span class="reward-val">{{ pet.reward }} Escrow Bounty</span>
            </div>
          </div>
        </div>

        <!-- State 1: Configure & Dispatch -->
        <div v-if="!isDispatching && !isDispatched" class="dispatch-form">
          <!-- Radius & Micro-Cluster Config -->
          <div class="form-section">
            <label class="section-label">
              <Navigation :size="14" class="label-icon" />
              <span>Broadcast Radius & Micro-Cluster</span>
            </label>
            <div class="radius-toggle-group">
              <button
                type="button"
                id="geo-radius-3km"
                class="radius-btn"
                :class="{ active: selectedRadius === 3 }"
                @click="selectedRadius = 3"
              >
                <span class="radius-dist">3 km</span>
                <span class="radius-reach">~45 Volunteers</span>
              </button>
              <button
                type="button"
                id="geo-radius-5km"
                class="radius-btn recommended"
                :class="{ active: selectedRadius === 5 }"
                @click="selectedRadius = 5"
              >
                <span class="rec-badge">Recommended</span>
                <span class="radius-dist">5 km</span>
                <span class="radius-reach">~120+ Volunteers</span>
              </button>
              <button
                type="button"
                id="geo-radius-10km"
                class="radius-btn"
                :class="{ active: selectedRadius === 10 }"
                @click="selectedRadius = 10"
              >
                <span class="radius-dist">10 km</span>
                <span class="radius-reach">Metro Coverage</span>
              </button>
            </div>
          </div>

          <!-- Dhaka Neighborhood Geofence Select -->
          <div class="form-section">
            <label class="section-label">
              <MapPin :size="14" class="label-icon" />
              <span>Primary Dhaka Geofence Anchor</span>
            </label>
            <div class="geofence-pills">
              <button
                v-for="hood in dhakaNeighborhoods"
                :key="hood.id"
                type="button"
                :id="`geo-anchor-${hood.id}`"
                class="geofence-chip"
                :class="{ active: selectedNeighborhood === hood.id }"
                @click="selectedNeighborhood = hood.id"
              >
                {{ hood.name }}
              </button>
            </div>
          </div>

          <!-- Live Network Reach Estimator -->
          <div class="reach-estimator-box" id="geo-blast-estimator">
            <div class="estimator-header">
              <span class="radar-ping-dot"></span>
              <span class="estimator-title">Estimated Instant Reach</span>
            </div>
            <div class="reach-metrics-grid">
              <div class="metric-card">
                <Users :size="16" class="metric-ico" />
                <span class="metric-num">{{ estimatedResponders }}</span>
                <span class="metric-label">Vetted Volunteers</span>
              </div>
              <div class="metric-card">
                <Building2 :size="16" class="metric-ico" />
                <span class="metric-num">{{ estimatedClinics }}</span>
                <span class="metric-label">24/7 ICU Clinics</span>
              </div>
              <div class="metric-card">
                <Send :size="16" class="metric-ico" />
                <span class="metric-num">98%</span>
                <span class="metric-label">WhatsApp Delivery</span>
              </div>
            </div>
          </div>

          <!-- Pricing & Escrow Guarantee -->
          <div class="pricing-card">
            <div class="pricing-row">
              <div class="pricing-label-col">
                <span class="pricing-title">Emergency Broadcast Fee</span>
                <span class="pricing-sub">Server SMS gateway + WhatsApp Cloud API blast</span>
              </div>
              <div class="pricing-amount">
                <span class="currency">৳</span>
                <span class="price-val">499</span>
                <span class="bdt">BDT</span>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="payment-methods-row">
              <span class="pay-label">Fast Pay via:</span>
              <div class="pay-chips">
                <button 
                  type="button"
                  class="pay-method-chip"
                  :class="{ active: selectedPaymentMethod === 'bkash' }"
                  @click="selectedPaymentMethod = 'bkash'"
                >
                  <span class="pay-dot bkash"></span> bKash
                </button>
                <button 
                  type="button"
                  class="pay-method-chip"
                  :class="{ active: selectedPaymentMethod === 'nagad' }"
                  @click="selectedPaymentMethod = 'nagad'"
                >
                  <span class="pay-dot nagad"></span> Nagad
                </button>
                <button 
                  type="button"
                  class="pay-method-chip"
                  :class="{ active: selectedPaymentMethod === 'card' }"
                  @click="selectedPaymentMethod = 'card'"
                >
                  <CreditCard :size="12" /> Card
                </button>
              </div>
            </div>
          </div>

          <!-- Dispatch Action Button -->
          <button 
            id="geo-blast-dispatch-btn"
            type="button" 
            class="btn-dispatch-blast"
            @click="startDispatchProcess"
          >
            <Radio :size="18" class="dispatch-ico" />
            <span>Pay ৳499 & Broadcast 5-Mile Alert</span>
          </button>
          <p class="dispatch-guarantee">
            🔒 100% Guaranteed Delivery within 90 seconds. Broadcasted to verified Dhaka pet lovers.
          </p>
        </div>

        <!-- State 2: Dispatching Animation Sequence -->
        <div v-else-if="isDispatching" class="dispatching-sequence" id="geo-blast-dispatching-view">
          <div class="radar-scan-animation">
            <div class="scan-ring ring-1"></div>
            <div class="scan-ring ring-2"></div>
            <div class="scan-ring ring-3"></div>
            <div class="scan-center-pin">
              <Radio :size="28" class="pulsing-radio" />
            </div>
          </div>

          <h3 class="dispatch-status-title">{{ currentStepText }}</h3>
          
          <div class="progress-bar-track">
            <div class="progress-bar-fill" :style="{ width: `${dispatchProgress}%` }"></div>
          </div>

          <!-- Live Log Stream -->
          <div class="dispatch-log-terminal">
            <div 
              v-for="(log, idx) in dispatchLogs" 
              :key="idx" 
              class="log-line"
              :class="{ 'log-success': log.done }"
            >
              <CheckCircle v-if="log.done" :size="13" class="log-icon-check" />
              <div v-else class="log-spinner"></div>
              <span>{{ log.text }}</span>
            </div>
          </div>
        </div>

        <!-- State 3: Dispatched Success View -->
        <div v-else-if="isDispatched" class="dispatched-success-view" id="geo-blast-success-view">
          <div class="success-badge-celebrate">
            <Check :size="36" />
          </div>

          <h3 class="success-headline">🚨 Broadcast Active Across {{ selectedRadius }}km!</h3>
          <p class="success-desc">
            Your emergency bulletin has been sent to {{ finalReachCount }} rescuers and {{ estimatedClinics }} veterinary clinics near {{ activeNeighborhoodName }}.
          </p>

          <div class="live-tracking-box">
            <div class="tracking-item">
              <span class="tracking-dot-live"></span>
              <span class="tracking-text">WhatsApp Alerts: <strong>{{ Math.floor(finalReachCount * 0.75) }} Delivered</strong></span>
            </div>
            <div class="tracking-item">
              <span class="tracking-dot-live"></span>
              <span class="tracking-text">In-App Push: <strong>{{ finalReachCount }} Active Beacons</strong></span>
            </div>
            <div class="tracking-item">
              <span class="tracking-dot-live"></span>
              <span class="tracking-text">24/7 ICU Hospitals: <strong>{{ estimatedClinics }} Clinics Notified</strong></span>
            </div>
          </div>

          <div class="success-actions-row">
            <button 
              id="geo-blast-view-map-btn"
              type="button" 
              class="btn-view-map"
              @click="viewOnRadarMap"
            >
              <MapPin :size="16" />
              <span>View On Live Radar Map</span>
            </button>
            <button 
              id="geo-blast-done-btn"
              type="button" 
              class="btn-done"
              @click="handleClose"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  X, Radio, Navigation, MapPin, Users, Building2, Send, 
  Award, CreditCard, CheckCircle, Check 
} from 'lucide-vue-next';
import { 
  isGeoBlastModalOpen, 
  activeLostPetForBlast, 
  closeGeoBlastModal, 
  broadcastGeoBlast, 
  currentTab, 
  radarMapCenter,
  selectedRadarPet 
} from '../../stores/appStore';
import type { LostFoundPost } from '../../types';

const isOpen = computed(() => isGeoBlastModalOpen.value);
const pet = computed<LostFoundPost | null>(() => activeLostPetForBlast.value);

const selectedRadius = ref<number>(5);
const selectedNeighborhood = ref<string>('banani');
const selectedPaymentMethod = ref<'bkash' | 'nagad' | 'card'>('bkash');

const isDispatching = ref(false);
const isDispatched = ref(false);
const dispatchProgress = ref(0);
const currentStepText = ref('Initializing Dhaka Geofence Broadcast...');
const finalReachCount = ref(112);

const dhakaNeighborhoods = [
  { id: 'banani', name: 'Banani & Rd 11', lat: 23.7937, lng: 90.4066 },
  { id: 'gulshan', name: 'Gulshan-1 & 2', lat: 23.7925, lng: 90.4167 },
  { id: 'dhanmondi', name: 'Dhanmondi & 27', lat: 23.7538, lng: 90.3768 },
  { id: 'uttara', name: 'Uttara Sectors', lat: 23.8698, lng: 90.3986 },
  { id: 'bashundhara', name: 'Bashundhara R/A', lat: 23.8151, lng: 90.4323 },
  { id: 'baridhara', name: 'Baridhara DOHS', lat: 23.8050, lng: 90.4215 },
];

const activeNeighborhoodName = computed(() => {
  const found = dhakaNeighborhoods.find(n => n.id === selectedNeighborhood.value);
  return found ? found.name : 'Dhaka Metro';
});

const estimatedResponders = computed(() => {
  if (selectedRadius.value === 3) return 48;
  if (selectedRadius.value === 5) return 128;
  return 340;
});

const estimatedClinics = computed(() => {
  if (selectedRadius.value === 3) return 3;
  if (selectedRadius.value === 5) return 6;
  return 14;
});

interface LogItem {
  text: string;
  done: boolean;
}
const dispatchLogs = ref<LogItem[]>([]);

function handleClose() {
  if (isDispatching.value) return; // Prevent closing midway
  isDispatching.value = false;
  isDispatched.value = false;
  dispatchProgress.value = 0;
  closeGeoBlastModal();
}

function startDispatchProcess() {
  if (!pet.value) return;

  isDispatching.value = true;
  dispatchProgress.value = 10;
  currentStepText.value = 'Connecting to Dhaka Emergency Rescuer Mesh...';
  dispatchLogs.value = [
    { text: 'Securing ৳499 transaction via ' + selectedPaymentMethod.value.toUpperCase() + ' gateway...', done: false },
  ];

  setTimeout(() => {
    dispatchProgress.value = 35;
    dispatchLogs.value[0].done = true;
    currentStepText.value = `Establishing ${selectedRadius.value}km Geofence around ${activeNeighborhoodName.value}...`;
    dispatchLogs.value.push({ text: `Targeting 5km radial perimeter (${estimatedResponders.value} local volunteers)...`, done: false });
  }, 1000);

  setTimeout(() => {
    dispatchProgress.value = 65;
    dispatchLogs.value[1].done = true;
    currentStepText.value = 'Dispatching Priority WhatsApp Cloud Bulletins...';
    dispatchLogs.value.push({ text: `Alerting ${estimatedClinics.value} 24/7 ICU Veterinary emergency centers...`, done: false });
  }, 2200);

  setTimeout(() => {
    dispatchProgress.value = 90;
    dispatchLogs.value[2].done = true;
    currentStepText.value = 'Synchronizing Live GPS Radar Beacons...';
    dispatchLogs.value.push({ text: 'Locking Escrow Bounty verification hash...', done: false });
  }, 3300);

  setTimeout(() => {
    dispatchProgress.value = 100;
    if (dispatchLogs.value[3]) dispatchLogs.value[3].done = true;
    
    // Execute store action to persist active blast state
    if (pet.value) {
      broadcastGeoBlast(pet.value.id, selectedRadius.value);
      finalReachCount.value = estimatedResponders.value;
    }

    isDispatching.value = false;
    isDispatched.value = true;
  }, 4400);
}

function viewOnRadarMap() {
  if (pet.value) {
    if (pet.value.lat && pet.value.lng) {
      radarMapCenter.value = [pet.value.lat, pet.value.lng];
    }
    selectedRadarPet.value = pet.value;
  }
  handleClose();
  currentTab.value = 'lostfound';
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.geo-blast-card {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: #111827;
  border: 1px solid rgba(239, 68, 68, 0.35);
  box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.25), 0 0 40px rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  padding: 24px;
  color: #f3f4f6;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #9ca3af;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

/* Header */
.modal-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.emergency-beacon-badge {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.beacon-icon {
  font-size: 24px;
  z-index: 2;
}

.beacon-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 20px;
  border: 2px solid #ef4444;
  animation: beacon-pulse-anim 1.8s infinite;
  opacity: 0.8;
}

@keyframes beacon-pulse-anim {
  0% { transform: scale(0.95); opacity: 0.9; }
  50% { transform: scale(1.15); opacity: 0.3; }
  100% { transform: scale(1.25); opacity: 0; }
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin: 0;
  line-height: 1.4;
}

/* Target Pet Card */
.target-pet-card {
  display: flex;
  gap: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.target-pet-thumb {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(239, 68, 68, 0.5);
}

.target-pet-info {
  flex: 1;
  min-width: 0;
}

.target-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.target-pet-name {
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
}

.target-status-tag {
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 9999px;
  letter-spacing: 0.04em;
}

.target-status-tag.lost {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.target-status-tag.found {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.target-pet-breed {
  font-size: 0.775rem;
  color: #9ca3af;
  margin: 0 0 4px 0;
}

.target-reward-row {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  font-size: 0.725rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

/* Form Sections */
.form-section {
  margin-bottom: 18px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #d1d5db;
  margin-bottom: 8px;
}

.label-icon {
  color: #ef4444;
}

/* Radius Selector */
.radius-toggle-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.radius-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #9ca3af;
}

.radius-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.radius-btn.active {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #fff;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}

.radius-dist {
  font-size: 0.95rem;
  font-weight: 800;
}

.radius-reach {
  font-size: 0.6875rem;
  opacity: 0.8;
  margin-top: 2px;
}

.rec-badge {
  position: absolute;
  top: -8px;
  background: #ef4444;
  color: #fff;
  font-size: 0.5625rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 9999px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

/* Geofence Chips */
.geofence-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.geofence-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s;
}

.geofence-chip:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #e5e7eb;
}

.geofence-chip.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
  font-weight: 700;
}

/* Reach Estimator Box */
.reach-estimator-box {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 18px;
}

.estimator-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.radar-ping-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: ping-pulse 1.5s infinite;
}

@keyframes ping-pulse {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.4; }
  100% { transform: scale(0.9); opacity: 1; }
}

.estimator-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
}

.reach-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 10px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-ico {
  color: #60a5fa;
  margin-bottom: 4px;
}

.metric-num {
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
}

.metric-label {
  font-size: 0.65rem;
  color: #9ca3af;
  margin-top: 3px;
}

/* Pricing Card */
.pricing-card {
  background: rgba(239, 68, 68, 0.08);
  border: 1px dashed rgba(239, 68, 68, 0.4);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 20px;
}

.pricing-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.pricing-title {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
}

.pricing-sub {
  font-size: 0.725rem;
  color: #9ca3af;
}

.pricing-amount {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.currency {
  font-size: 1.1rem;
  font-weight: 800;
  color: #ef4444;
}

.price-val {
  font-size: 1.6rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.03em;
}

.bdt {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
}

.payment-methods-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 10px;
}

.pay-label {
  font-size: 0.75rem;
  color: #9ca3af;
}

.pay-chips {
  display: flex;
  gap: 6px;
}

.pay-method-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #d1d5db;
  font-size: 0.725rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s;
}

.pay-method-chip.active {
  background: #fff;
  color: #111827;
  border-color: #fff;
}

.pay-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.pay-dot.bkash {
  background: #e2136e;
}

.pay-dot.nagad {
  background: #f7931e;
}

/* Action Buttons */
.btn-dispatch-blast {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.5);
  transition: all 0.2s;
}

.btn-dispatch-blast:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px -5px rgba(239, 68, 68, 0.65);
}

.dispatch-guarantee {
  text-align: center;
  font-size: 0.725rem;
  color: #9ca3af;
  margin: 10px 0 0 0;
}

/* Dispatching Sequence View */
.dispatching-sequence {
  padding: 30px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.radar-scan-animation {
  position: relative;
  width: 130px;
  height: 130px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid #ef4444;
  animation: radar-sweep 2.2s infinite cubic-bezier(0.2, 0.8, 0.4, 1);
}

.ring-1 { width: 40px; height: 40px; animation-delay: 0s; }
.ring-2 { width: 80px; height: 80px; animation-delay: 0.5s; }
.ring-3 { width: 120px; height: 120px; animation-delay: 1.0s; }

@keyframes radar-sweep {
  0% { transform: scale(0.3); opacity: 0.9; }
  100% { transform: scale(1.3); opacity: 0; }
}

.scan-center-pin {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 2;
  box-shadow: 0 0 30px #ef4444;
}

.pulsing-radio {
  animation: pulse-ico 1s infinite alternate;
}

@keyframes pulse-ico {
  from { transform: scale(0.9); }
  to { transform: scale(1.15); }
}

.dispatch-status-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 16px 0;
}

.progress-bar-track {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #f59e0b);
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.dispatch-log-terminal {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.log-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.775rem;
  color: #9ca3af;
  font-family: monospace;
}

.log-line.log-success {
  color: #34d399;
}

.log-icon-check {
  color: #10b981;
  flex-shrink: 0;
}

.log-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-top-color: #ef4444;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Success View */
.dispatched-success-view {
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.success-badge-celebrate {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 16px;
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.5);
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.success-headline {
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px 0;
}

.success-desc {
  font-size: 0.8125rem;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0 0 20px 0;
  max-width: 400px;
}

.live-tracking-box {
  width: 100%;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.tracking-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8125rem;
  color: #d1d5db;
}

.tracking-dot-live {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.success-actions-row {
  width: 100%;
  display: flex;
  gap: 12px;
}

.btn-view-map {
  flex: 2;
  padding: 13px;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view-map:hover {
  background: #059669;
}

.btn-done {
  flex: 1;
  padding: 13px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-done:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
