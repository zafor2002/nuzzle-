<template>
  <div class="adoption-view">
    <TopBar title="🐾 Pet Adoption Center" />

    <div class="adoption-scroll-body">
      <!-- Top Adoption Intro Banner -->
      <div class="adopt-banner">
        <div class="adopt-banner-text">
          <h3 class="adopt-banner-title">Find Your Forever Friend 🏡</h3>
          <p class="adopt-banner-sub">Verified shelters, rescue fosters & direct adoption bookings with 48h holds.</p>
        </div>
      </div>

      <!-- Species Filter Chips -->
      <div class="filter-chips-row">
        <button 
          v-for="s in speciesList" 
          :key="s"
          class="filter-chip"
          :class="{ active: selectedSpecies === s }"
          @click="selectSpecies(s)"
        >
          {{ s }}
        </button>
      </div>

      <!-- Adoption Cards -->
      <div class="adoptions-grid">
        <div 
          v-for="pet in filteredAdoptions" 
          :key="pet.id"
          class="adopt-card card-item"
          :class="{ 'claimed-pet-card': pet.isClaimed }"
        >
          <div class="adopt-image-container">
            <img :src="pet.imageUrl" :alt="pet.name" class="adopt-img" />
            
            <span 
              class="adopt-status-badge" 
              :class="[pet.isClaimed ? 'reserved' : pet.status]"
            >
              {{ pet.isClaimed ? 'RESERVED / HOLD 🔒' : pet.status.toUpperCase() }}
            </span>
            
            <span class="adopt-gender-badge">{{ pet.gender === 'Boy' ? '♂ Boy' : '♀ Girl' }}</span>
          </div>

          <!-- Claimed / Booked Reservation Banner -->
          <div v-if="pet.isClaimed" class="adoption-claim-banner">
            <div class="claim-msg-col">
              <span class="claim-title">
                {{ pet.claimType === 'meet_greet' ? '📅 Meet & Greet Confirmed:' : '🔒 48-Hour Adoption Hold:' }}
              </span>
              <span class="claim-details">
                Reserved by <strong>{{ pet.claimedBy }}</strong>
                <template v-if="pet.bookedMeetDate"> ({{ pet.bookedMeetDate }} @ {{ pet.bookedMeetTime }})</template>
              </span>
            </div>
            <button class="cancel-hold-btn" @click="handleCancelClaim(pet)" title="Release Reservation">
              Cancel Hold
            </button>
          </div>

          <div class="adopt-info-body">
            <div class="adopt-header-row">
              <div class="name-age">
                <h4 class="adopt-pet-name">{{ pet.name }}</h4>
                <span class="adopt-breed-age">{{ pet.breed }} • {{ pet.age }}</span>
              </div>
              <span v-if="pet.fee" class="adopt-fee">{{ pet.fee }}</span>
            </div>

            <!-- Health Badges -->
            <div class="health-badges-row">
              <span v-if="pet.isVaccinated" class="h-badge">✓ Vaccinated</span>
              <span v-if="pet.isNeutered" class="h-badge">✓ Spayed / Neutered</span>
              <span v-if="pet.isClaimed" class="h-badge hold-badge">🔒 Under Hold</span>
            </div>

            <!-- Temperament Tags -->
            <div class="temperament-tags">
              <span v-for="tag in pet.temperament" :key="tag" class="temp-tag">
                #{{ tag }}
              </span>
            </div>

            <p class="adopt-desc">{{ pet.description }}</p>

            <div class="shelter-row">
              <Building :size="13" class="shelter-icon" />
              <span class="shelter-name">{{ pet.shelterName }} • {{ pet.location }}</span>
            </div>

            <!-- ACTION BUTTONS ROW -->
            <div class="adopt-actions-group">
              <!-- If Not Claimed: Dual Booking/Claim actions -->
              <template v-if="!pet.isClaimed && pet.status !== 'adopted'">
                <button 
                  class="btn-solid book-meet-btn"
                  @click="openBookingModal(pet, 'meet_greet')"
                >
                  <Calendar :size="15" />
                  <span>Book Meet & Greet</span>
                </button>

                <button 
                  class="btn-outline claim-hold-btn"
                  @click="openBookingModal(pet, 'adoption_hold')"
                >
                  <ShieldCheck :size="15" />
                  <span>Claim 48h Hold</span>
                </button>
              </template>

              <!-- If Claimed: Coordinate Chat action -->
              <template v-else-if="pet.isClaimed">
                <button 
                  class="btn-solid chat-shelter-btn"
                  @click="inquireAboutPet(pet)"
                >
                  <MessageSquare :size="15" />
                  <span>Chat with {{ pet.shelterName.split(' ')[0] }}</span>
                </button>
              </template>

              <template v-else>
                <button class="btn-solid adopt-inquire-btn" disabled>
                  <span>Happily Adopted ❤️</span>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADOPTION BOOKING & CLAIM MODAL -->
    <div v-if="bookingModalPet" class="modal-scrim" @click.self="bookingModalPet = null">
      <div class="bottom-sheet adopt-booking-sheet">
        <div class="sheet-handle"></div>

        <div class="sheet-header">
          <div class="adopt-modal-head">
            <HeartHandshake :size="20" class="brand-icon" />
            <h3 class="sheet-title">Book / Claim {{ bookingModalPet.name }}</h3>
          </div>
          <button class="btn-icon" @click="bookingModalPet = null">
            <X :size="20" />
          </button>
        </div>

        <div class="adopt-modal-body">
          <!-- Pet Info Card -->
          <div class="target-pet-card">
            <img :src="bookingModalPet.imageUrl" :alt="bookingModalPet.name" class="t-pet-thumb" />
            <div class="t-pet-info">
              <h4 class="t-pet-name">{{ bookingModalPet.name }}</h4>
              <span class="t-pet-loc">{{ bookingModalPet.breed }} • {{ bookingModalPet.shelterName }}</span>
              <span class="t-pet-status">Fee: {{ bookingModalPet.fee || 'Adoption by Donation' }}</span>
            </div>
          </div>

          <!-- Type Selector Options -->
          <div class="claim-type-tabs">
            <button 
              class="type-tab-btn"
              :class="{ active: selectedClaimMode === 'meet_greet' }"
              @click="selectedClaimMode = 'meet_greet'"
            >
              📅 Book Meet & Greet
            </button>
            <button 
              class="type-tab-btn"
              :class="{ active: selectedClaimMode === 'adoption_hold' }"
              @click="selectedClaimMode = 'adoption_hold'"
            >
              🔒 48h Adoption Hold
            </button>
            <button 
              class="type-tab-btn"
              :class="{ active: selectedClaimMode === 'foster_sponsor' }"
              @click="selectedClaimMode = 'foster_sponsor'"
            >
              🤝 Foster / Sponsor
            </button>
          </div>

          <!-- Meet & Greet Date & Slot Picker -->
          <div v-if="selectedClaimMode === 'meet_greet'" class="slot-picker-section">
            <label class="section-lbl">Select Visit Day:</label>
            <div class="days-pills-row">
              <button 
                v-for="d in ['Today', 'Tomorrow', 'Saturday', 'Sunday']" 
                :key="d"
                class="day-pill"
                :class="{ active: selectedMeetDay === d }"
                @click="selectedMeetDay = d"
              >
                {{ d }}
              </button>
            </div>

            <label class="section-lbl" style="margin-top: 10px;">Select Time Slot:</label>
            <div class="time-slots-grid">
              <button 
                v-for="t in ['10:30 AM', '1:30 PM', '4:00 PM', '6:00 PM']" 
                :key="t"
                class="time-chip"
                :class="{ active: selectedMeetTime === t }"
                @click="selectedMeetTime = t"
              >
                <Clock :size="12" />
                <span>{{ t }}</span>
              </button>
            </div>

            <div class="location-notice-box">
              📍 <strong>Location:</strong> {{ bookingModalPet.shelterName }} ({{ bookingModalPet.location }})
            </div>
          </div>

          <!-- 48-Hour Hold Explanation -->
          <div v-else-if="selectedClaimMode === 'adoption_hold'" class="hold-explainer-box">
            <div class="hold-badge-head">
              <ShieldCheck :size="16" />
              <span>48-Hour Adoption Hold Guarantee</span>
            </div>
            <p class="hold-p">
              Placing a hold temporarily reserves {{ bookingModalPet.name }} exclusively for you while shelter staff reviews your application. No other adopters can claim this pet for 48 hours.
            </p>
          </div>

          <!-- Foster / Sponsor Explanation -->
          <div v-else class="foster-explainer-box">
            <div class="hold-badge-head">
              <Heart :size="16" fill="currentColor" />
              <span>Foster Care & Medical Sponsorship</span>
            </div>
            <p class="hold-p">
              Provide temporary foster housing or sponsor {{ bookingModalPet.name }}'s vaccinations and nutrition until adoption!
            </p>
          </div>

          <button class="btn-solid confirm-adopt-btn" @click="handleConfirmBooking">
            {{ selectedClaimMode === 'meet_greet' ? `Confirm Meet & Greet for ${selectedMeetDay} 📅` : `Place Adoption Hold for ${bookingModalPet.name} 💖` }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast-slide">
      <div v-if="adoptToast" class="adopt-toast-bar">
        {{ adoptToast }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Building, HeartHandshake, Calendar, ShieldCheck, MessageSquare, Clock, Heart, X } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { 
  adoptions, 
  openChatWith, 
  bookOrClaimAdoption, 
  cancelAdoptionClaim 
} from '../stores/appStore';
import type { AdoptionListing } from '../types';

import { adoptionService } from '../services';

const selectedSpecies = ref('All');
const speciesList = ['All', '🐕 Dogs', '🐱 Cats', '🐰 Rabbits', '🦜 Birds'];

function selectSpecies(s: string) {
  selectedSpecies.value = s;
  const clean = s === 'All' ? undefined : s.replace(/[^a-zA-Z]/g, '').toLowerCase();
  adoptionService.getAdoptions(clean).catch(() => {});
}

const bookingModalPet = ref<AdoptionListing | null>(null);
const selectedClaimMode = ref<'meet_greet' | 'adoption_hold' | 'foster_sponsor'>('meet_greet');
const selectedMeetDay = ref('Tomorrow');
const selectedMeetTime = ref('2:00 PM');
const adoptToast = ref<string | null>(null);

const filteredAdoptions = computed(() => {
  if (selectedSpecies.value === 'All') return adoptions;
  const clean = selectedSpecies.value.replace(/[^a-zA-Z]/g, '').toLowerCase();
  return adoptions.filter(a => a.species.toLowerCase().includes(clean) || clean.includes(a.species.toLowerCase()));
});

function openBookingModal(pet: AdoptionListing, mode: 'meet_greet' | 'adoption_hold') {
  bookingModalPet.value = pet;
  selectedClaimMode.value = mode;
}

function handleConfirmBooking() {
  if (!bookingModalPet.value) return;

  bookOrClaimAdoption(
    bookingModalPet.value.id,
    selectedClaimMode.value,
    selectedMeetDay.value,
    selectedMeetTime.value
  );

  showToast(
    selectedClaimMode.value === 'meet_greet'
      ? `📅 Meet & Greet confirmed for ${bookingModalPet.value.name} on ${selectedMeetDay.value}!`
      : `🔒 48-Hour Adoption Hold placed on ${bookingModalPet.value.name}!`
  );

  bookingModalPet.value = null;
}

function handleCancelClaim(pet: AdoptionListing) {
  if (confirm(`Cancel reservation for ${pet.name}?`)) {
    cancelAdoptionClaim(pet.id);
    showToast(`🔓 Reservation for ${pet.name} cancelled.`);
  }
}

function inquireAboutPet(pet: AdoptionListing) {
  openChatWith(
    pet.shelterName,
    pet.imageUrl,
    pet.name,
    `Hello! I have booked a meet & greet for ${pet.name} (${pet.breed}). Looking forward to visiting!`
  );
}

function showToast(msg: string) {
  adoptToast.value = msg;
  setTimeout(() => {
    adoptToast.value = null;
  }, 2400);
}
</script>

<style scoped>
.adoption-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.adoption-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.adopt-banner {
  background: linear-gradient(135deg, #F5F0FF, #EFEBFF);
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: var(--shadow-sm);
}

.adopt-banner-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.adopt-banner-sub {
  font-size: 12px;
  color: var(--ink-secondary);
  margin-top: 2px;
}

.adoptions-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 6px;
}

.adopt-card {
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;
}

.adopt-card.claimed-pet-card {
  border-color: #A855F7;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.18);
}

.adopt-image-container {
  position: relative;
  width: 100%;
  height: 200px;
}

.adopt-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.adopt-status-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 10.5px;
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.adopt-status-badge.available {
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
}

.adopt-status-badge.pending {
  background: rgba(245, 158, 11, 0.9);
  color: #fff;
}

.adopt-status-badge.reserved {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.95), rgba(236, 72, 153, 0.95));
  color: #fff;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.4);
}

.adopt-status-badge.adopted {
  background: rgba(100, 116, 139, 0.9);
  color: #fff;
}

.adopt-gender-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

/* ADOPTION CLAIM BANNER */
.adoption-claim-banner {
  background: linear-gradient(135deg, #FAF5FF, #F3EEFF);
  border-bottom: 1.5px solid #D8B4FE;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

:global([data-theme='dark']) .adoption-claim-banner {
  background: rgba(42, 23, 72, 0.4);
  border-color: rgba(192, 132, 252, 0.3);
}

.claim-msg-col {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.claim-title {
  font-size: 11px;
  font-weight: 800;
  color: #7C3AED;
}

.claim-details {
  font-size: 11px;
  color: var(--ink-secondary);
}

.cancel-hold-btn {
  font-size: 10.5px;
  font-weight: 700;
  color: #E11D48;
  background: #FFE4E6;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  border: 1px solid #FDA4AF;
}

.adopt-info-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.adopt-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.adopt-pet-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink-primary);
}

.adopt-breed-age {
  font-size: 12px;
  color: var(--ink-secondary);
}

.adopt-fee {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-primary);
  background: var(--brand-soft);
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.health-badges-row {
  display: flex;
  gap: 6px;
}

.h-badge {
  font-size: 11px;
  font-weight: 700;
  color: #047857;
  background: #D1FAE5;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.h-badge.hold-badge {
  color: #7C3AED;
  background: #F3EEFF;
}

.temperament-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.temp-tag {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-muted);
  background: var(--bg-card-subtle);
  padding: 2px 7px;
  border-radius: 6px;
}

.adopt-desc {
  font-size: 12.5px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.shelter-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--ink-muted);
}

.shelter-icon {
  color: var(--brand-primary);
}

/* ACTIONS */
.adopt-actions-group {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.book-meet-btn {
  flex: 1.2;
  padding: 9px;
  font-size: 12.5px;
  background: var(--brand-gradient);
}

.claim-hold-btn {
  flex: 1;
  padding: 9px;
  font-size: 12.5px;
  border-color: #C4B5FD;
  color: #7C3AED;
}

.claim-hold-btn:hover {
  background: #F3EEFF;
}

.chat-shelter-btn {
  width: 100%;
  padding: 10px;
  font-size: 13px;
  background: var(--brand-gradient);
}

.adopt-inquire-btn {
  width: 100%;
  margin-top: 4px;
}

/* BOOKING MODAL */
.adopt-booking-sheet {
  height: 84%;
}

.adopt-modal-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  color: var(--brand-primary);
}

.adopt-modal-body {
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

.claim-type-tabs {
  display: flex;
  gap: 6px;
  background: var(--bg-card-subtle);
  padding: 4px;
  border-radius: var(--radius-md);
}

.type-tab-btn {
  flex: 1;
  padding: 7px 4px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-muted);
  transition: all 0.15s ease;
  text-align: center;
}

.type-tab-btn.active {
  background: var(--bg-card);
  color: var(--ink-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.section-lbl {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-secondary);
  margin-bottom: 6px;
}

.days-pills-row {
  display: flex;
  gap: 6px;
}

.day-pill {
  flex: 1;
  padding: 6px 0;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
  text-align: center;
}

.day-pill.active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: #fff;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.time-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  color: var(--ink-primary);
}

.time-chip.active {
  background: var(--brand-soft);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  font-weight: 700;
}

.location-notice-box {
  background: var(--bg-card-subtle);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: 11.5px;
  color: var(--ink-secondary);
  margin-top: 10px;
}

.hold-explainer-box, .foster-explainer-box {
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-md);
  padding: 14px;
}

.hold-badge-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  color: var(--brand-primary);
  margin-bottom: 6px;
}

.hold-p {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.confirm-adopt-btn {
  width: 100%;
  padding: 12px;
  font-size: 13.5px;
  background: linear-gradient(135deg, #947DEE 0%, #7C3AED 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  margin-top: 4px;
}

/* Toast */
.adopt-toast-bar {
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
