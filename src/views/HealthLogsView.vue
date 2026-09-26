<template>
  <div class="health-view">
    <TopBar title="🩺 Pet Health Passport & Logs" />

    <div class="health-scroll-body">
      <!-- Pet Switcher Chips -->
      <div class="pet-selector-tray">
        <button 
          v-for="p in pets" 
          :key="p.id"
          class="pet-select-chip"
          :class="{ active: selectedPetId === p.id }"
          @click="selectedPetId = p.id"
        >
          <img :src="p.avatarUrl" :alt="p.name" class="chip-avatar" />
          <span class="chip-pet-name">{{ p.name }}</span>
        </button>
      </div>

      <!-- Pet Passport Summary Card -->
      <div v-if="currentPet" class="passport-card card-item">
        <div class="passport-header">
          <div class="pass-id-line">
            <span class="pass-title">DIGITAL HEALTH RECORD</span>
            <span class="pass-num">CHIP: {{ currentPet.microchipId || '985-0019-482' }}</span>
          </div>
          <h3 class="pass-pet-name">🐾 {{ currentPet.name }}</h3>
          <span class="pass-meta">{{ currentPet.species }} • {{ currentPet.breed }} • Age: {{ currentPet.age }}</span>
        </div>

        <div class="stats-row">
          <div class="stat-col">
            <span class="s-num">{{ currentPet.weight || '29.5 kg' }}</span>
            <span class="s-lbl">Weight</span>
          </div>
          <div class="stat-col">
            <span class="s-num">100%</span>
            <span class="s-lbl">Vaccines Up to Date</span>
          </div>
          <div class="stat-col">
            <span class="s-num">June 2027</span>
            <span class="s-lbl">Next Booster Due</span>
          </div>
        </div>
      </div>

      <!-- PawAI Health Assistant Trigger Banner -->
      <div class="ai-health-banner" @click="setTab('ai')">
        <div class="ai-hb-icon">✨🩺</div>
        <div class="ai-hb-text">
          <span class="ai-hb-title">Ask PawAI 24/7 Health Advisor</span>
          <span class="ai-hb-sub">Instant symptom analysis & personalized nutrition advice</span>
        </div>
      </div>

      <!-- Official VetRx Prescriptions Hub -->
      <div class="vetrx-health-banner" @click="setTab('clinic-rx')">
        <div class="vrx-icon">💊</div>
        <div class="vrx-text">
          <span class="vrx-title">Verified Veterinary Prescriptions (VetRx™)</span>
          <span class="vrx-sub">Access tamper-proof clinical prescriptions & dosage schedules</span>
        </div>
        <span class="vrx-arrow">Open Portal →</span>
      </div>

      <!-- Add New Health Record Button -->
      <button class="btn-solid add-health-btn" @click="isCreateSheetOpen = true">
        + Record Vaccination / Vet Visit
      </button>

      <!-- Logs Timeline -->
      <div class="timeline-container">
        <h4 class="timeline-title">Medical History & Care Timeline</h4>

        <div class="timeline-items">
          <div 
            v-for="log in petLogs" 
            :key="log.id"
            class="timeline-card card-item"
          >
            <div class="t-type-badge" :class="log.type">
              <span v-if="log.type === 'vaccination'">💉 Vaccine</span>
              <span v-else-if="log.type === 'vet_visit'">🩺 Checkup</span>
              <span v-else-if="log.type === 'medication'">💊 Medicine</span>
              <span v-else>📋 Note</span>
            </div>

            <div class="t-main-info">
              <div class="t-title-row">
                <h5 class="t-title">{{ log.title }}</h5>
                <span class="t-date">{{ log.date }}</span>
              </div>

              <p v-if="log.notes" class="t-notes">{{ log.notes }}</p>

              <div class="t-footer-meta">
                <span v-if="log.veterinarian" class="t-vet">👨‍⚕️ {{ log.veterinarian }}</span>
                <span v-if="log.reminderAt" class="t-reminder">⏰ Next Due: {{ log.reminderAt }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TopBar from '../components/layout/TopBar.vue';
import { pets, healthLogs, isCreateSheetOpen, setTab } from '../stores/appStore';

const selectedPetId = ref(pets[0]?.id || 'pet_1');

const currentPet = computed(() => {
  return pets.find(p => p.id === selectedPetId.value) || pets[0];
});

const petLogs = computed(() => {
  return healthLogs.filter(l => l.petId === selectedPetId.value);
});
</script>

<style scoped>
.health-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.health-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.pet-selector-tray {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.pet-select-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 8px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-secondary);
  transition: all 0.15s ease;
}

.pet-select-chip.active {
  background: var(--brand-soft);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.chip-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
}

.passport-card {
  background: linear-gradient(135deg, #1E293B, #0F172A);
  color: #fff;
  padding: 18px;
  border-radius: var(--radius-xl);
  margin-bottom: 14px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pass-id-line {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #94A3B8;
  margin-bottom: 6px;
}

.pass-pet-name {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: #F8FAFC;
}

.pass-meta {
  font-size: 12px;
  color: #CBD5E1;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-top: 14px;
  padding-top: 12px;
  text-align: center;
}

.stat-col {
  display: flex;
  flex-direction: column;
}

.s-num {
  font-size: 13px;
  font-weight: 800;
  color: #F8FAFC;
}

.s-lbl {
  font-size: 9.5px;
  color: #94A3B8;
}

.ai-health-banner {
  background: linear-gradient(135deg, #EEF2FF, #FAF5FF);
  border: 1.5px solid #C7D2FE;
  border-radius: var(--radius-lg);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.ai-health-banner:active {
  transform: scale(0.98);
}

.vetrx-health-banner {
  background: linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%);
  border: 1.5px solid #DDD6FE;
  border-radius: var(--radius-lg);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.06);
  transition: transform 0.15s ease;
}

.vetrx-health-banner:hover {
  transform: translateY(-1px);
  border-color: #A78BFA;
}

.vrx-icon {
  font-size: 22px;
  width: 36px;
  height: 36px;
  background: #EDE9FE;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vrx-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.vrx-title {
  font-size: 12px;
  font-weight: 800;
  color: #6D28D9;
}

.vrx-sub {
  font-size: 10.5px;
  color: #7C3AED;
}

.vrx-arrow {
  font-size: 11px;
  font-weight: 800;
  color: #6D28D9;
  background: #FFFFFF;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #DDD6FE;
  white-space: nowrap;
}

.ai-hb-icon {
  font-size: 24px;
}

.ai-hb-text {
  display: flex;
  flex-direction: column;
}

.ai-hb-title {
  font-size: 13px;
  font-weight: 800;
  color: #4338CA;
}

.ai-hb-sub {
  font-size: 11px;
  color: #6366F1;
}

.add-health-btn {
  width: 100%;
  margin-bottom: 16px;
  padding: 11px;
}

.timeline-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
  margin-bottom: 10px;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-card {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.t-type-badge {
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  width: fit-content;
}

.t-type-badge.vaccination {
  background: #D1FAE5;
  color: #047857;
}

.t-type-badge.vet_visit {
  background: #DBEAFE;
  color: #1D4ED8;
}

.t-type-badge.medication {
  background: #FEF3C7;
  color: #B45309;
}

.t-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.t-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-primary);
}

.t-date {
  font-size: 11px;
  color: var(--ink-muted);
}

.t-notes {
  font-size: 12.5px;
  color: var(--ink-secondary);
  line-height: 1.4;
  margin-top: 4px;
}

.t-footer-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--ink-muted);
  border-top: 1px dashed var(--border-light);
  padding-top: 6px;
  margin-top: 6px;
}

.t-reminder {
  color: var(--brand-primary);
  font-weight: 600;
}
</style>
