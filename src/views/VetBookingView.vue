<template>
  <div class="vetbooking-view">
    <TopBar title="🏥 Vet Clinic & Slot Booking" />

    <div class="vet-scroll-body">
      <!-- 🏥 Clinic Prescription Portal Launcher Banner -->
      <div class="clinic-portal-banner" @click="setTab('clinic-rx')">
        <div class="cpb-icon">🩺</div>
        <div class="cpb-info">
          <div class="cpb-title-row">
            <span class="cpb-badge">FOR VET CLINICS & DOCTORS</span>
            <span class="cpb-live-dot">● Synced</span>
          </div>
          <h4 class="cpb-headline">Nuzzle VetRx™ Prescription Suite</h4>
          <p class="cpb-desc">Generate official prescriptions with auto-dosage calculator, print A4 & sync directly to Pet's Health Vault.</p>
        </div>
        <button class="cpb-action-arrow">Launch →</button>
      </div>

      <!-- Confirmed Appointments Card if any -->
      <div v-if="appointments.length > 0" class="active-appointments-box">
        <h4 class="box-title">📋 Your Upcoming Pet Appointments</h4>
        <div 
          v-for="apt in appointments" 
          :key="apt.id"
          class="appt-item"
        >
          <div class="appt-date-box">
            <span class="d-day">{{ apt.date }}</span>
            <span class="d-time">{{ apt.time }}</span>
          </div>
          <div class="appt-info">
            <span class="p-name">🐾 {{ apt.petName }} — {{ apt.reason }}</span>
            <span class="v-name">{{ apt.vetName }} ({{ apt.clinicName }})</span>
          </div>
          <span class="confirmed-tag">Confirmed ✓</span>
        </div>
      </div>

      <!-- Vet Clinics List -->
      <div class="vets-list">
        <div 
          v-for="vet in vets" 
          :key="vet.id"
          class="vet-card card-item"
        >
          <!-- Vet Header -->
          <div class="vet-profile-row">
            <img :src="vet.avatarUrl" :alt="vet.name" class="vet-photo" />
            <div class="vet-main-meta">
              <div class="name-rating">
                <h4 class="vet-name">{{ vet.name }}</h4>
                <div class="rating-badge">
                  <Star :size="13" fill="#F59E0B" color="#F59E0B" />
                  <span>{{ vet.rating }} ({{ vet.reviewsCount }})</span>
                </div>
              </div>
              <span class="clinic-title">{{ vet.clinicName }}</span>
              <div class="location-line">
                <MapPin :size="12" />
                <span>{{ vet.location }}</span>
              </div>
            </div>
          </div>

          <!-- Specialties -->
          <div class="specialties-pills">
            <span v-for="s in vet.specialties" :key="s" class="spec-pill">
              {{ s }}
            </span>
          </div>

          <!-- Booking Interactive Slot Picker -->
          <div class="booking-section">
            <div class="slot-day-tabs">
              <button 
                v-for="day in Object.keys(vet.slots)" 
                :key="day"
                class="day-tab"
                :class="{ active: selectedDay[vet.id] === day }"
                @click="selectedDay[vet.id] = day"
              >
                {{ day }}
              </button>
            </div>

            <!-- Slots Grid -->
            <div class="slots-grid">
              <button 
                v-for="slot in vet.slots[selectedDay[vet.id] || 'Today']" 
                :key="slot.time"
                class="slot-chip"
                :class="{ 
                  booked: slot.isBooked, 
                  selected: selectedSlot[vet.id] === slot.time && !slot.isBooked 
                }"
                :disabled="slot.isBooked"
                @click="selectedSlot[vet.id] = slot.time"
              >
                <Clock :size="12" />
                <span>{{ slot.time }}</span>
                <span v-if="slot.isBooked" class="booked-lbl">(Booked)</span>
              </button>
            </div>

            <!-- Pet selector for booking -->
            <div v-if="selectedSlot[vet.id]" class="booking-confirm-panel">
              <div class="pet-pick-row">
                <label class="pick-label">Appointment for:</label>
                <select v-model="selectedPetForBooking[vet.id]" class="pet-select">
                  <option v-for="p in pets" :key="p.id" :value="p.id">🐾 {{ p.name }} ({{ p.species }})</option>
                </select>
              </div>

              <button 
                class="btn-solid confirm-booking-btn"
                @click="confirmBooking(vet.id)"
              >
                Confirm Appointment for {{ selectedSlot[vet.id] }} 🩺
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Star, MapPin, Clock } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { vets, appointments, pets, bookVetSlot, setTab } from '../stores/appStore';

const selectedDay = reactive<{ [vetId: string]: string }>({
  vet_1: 'Today',
  vet_2: 'Today'
});

const selectedSlot = reactive<{ [vetId: string]: string | null }>({
  vet_1: null,
  vet_2: null
});

const selectedPetForBooking = reactive<{ [vetId: string]: string }>({
  vet_1: pets[0]?.id || 'pet_1',
  vet_2: pets[0]?.id || 'pet_1'
});

function confirmBooking(vetId: string) {
  const day = selectedDay[vetId] || 'Today';
  const time = selectedSlot[vetId];
  const petId = selectedPetForBooking[vetId];

  if (!time) return;

  const success = bookVetSlot(vetId, day, time, petId, 'Routine Physical & Wellness Exam');
  if (success) {
    selectedSlot[vetId] = null;
    alert(`Appointment successfully confirmed! 🩺`);
  }
}
</script>

<style scoped>
.vetbooking-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.vet-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.clinic-portal-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #2D1B69 0%, #4C1D95 100%);
  color: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  margin-bottom: 14px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(76, 29, 149, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.clinic-portal-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(76, 29, 149, 0.35);
}

.cpb-icon {
  font-size: 28px;
  background: rgba(255, 255, 255, 0.12);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cpb-info {
  flex: 1;
  min-width: 0;
}

.cpb-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.cpb-badge {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #DDD6FE;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.cpb-live-dot {
  font-size: 10px;
  font-weight: 700;
  color: #34D399;
}

.cpb-headline {
  font-size: 14px;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.cpb-desc {
  font-size: 11px;
  color: #E9D5FF;
  margin: 2px 0 0;
  line-height: 1.3;
}

.cpb-action-arrow {
  background: #FFFFFF;
  color: #5B21B6;
  border: none;
  font-size: 11.5px;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
}

.active-appointments-box {
  background: var(--brand-soft);
  border: 1.5px solid var(--brand-primary);
  border-radius: var(--radius-lg);
  padding: 14px;
  margin-bottom: 14px;
}

.box-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--brand-primary);
  margin-bottom: 8px;
}

.appt-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card);
  padding: 10px 12px;
  border-radius: var(--radius-md);
  margin-bottom: 6px;
}

.appt-date-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-card-subtle);
  padding: 4px 8px;
  border-radius: 8px;
  min-width: 60px;
}

.d-day {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--brand-primary);
}

.d-time {
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-primary);
}

.appt-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.p-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.v-name {
  font-size: 11px;
  color: var(--ink-muted);
}

.confirmed-tag {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--accent-emerald);
  background: var(--accent-emerald-soft);
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.vets-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vet-card {
  padding: 16px;
}

.vet-profile-row {
  display: flex;
  gap: 12px;
}

.vet-photo {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.vet-main-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name-rating {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vet-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.rating-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-secondary);
}

.clinic-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--brand-primary);
}

.location-line {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--ink-muted);
  margin-top: 2px;
}

.specialties-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 12px 0;
}

.spec-pill {
  font-size: 11px;
  font-weight: 600;
  background: var(--bg-card-subtle);
  color: var(--ink-secondary);
  padding: 3px 8px;
  border-radius: 6px;
}

.booking-section {
  border-top: 1px solid var(--border-light);
  padding-top: 12px;
}

.slot-day-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.day-tab {
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  background: var(--bg-card-subtle);
  color: var(--ink-secondary);
}

.day-tab.active {
  background: var(--ink-primary);
  color: var(--ink-inverse);
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.slot-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  color: var(--ink-primary);
  transition: all 0.15s ease;
}

.slot-chip.selected {
  background: var(--brand-soft);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  font-weight: 700;
}

.slot-chip.booked {
  background: var(--bg-card-subtle);
  opacity: 0.45;
  cursor: not-allowed;
  text-decoration: line-through;
}

.booked-lbl {
  font-size: 10px;
}

.booking-confirm-panel {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pet-pick-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pick-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-secondary);
}

.pet-select {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 4px 10px;
  font-size: 12.5px;
  outline: none;
}

.confirm-booking-btn {
  width: 100%;
  padding: 10px;
  font-size: 13px;
}
</style>
