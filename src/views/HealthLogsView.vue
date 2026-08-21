<template>
  <div class="health-view">
    <TopBar title="🪪 Official Digital Pet Passport" />

    <div class="health-scroll-body">
      <!-- Pet Selector Capsule Tray -->
      <div class="pet-selector-tray">
        <button 
          v-for="p in pets" 
          :key="p.id"
          class="pet-select-chip"
          :class="{ active: selectedPetId === p.id }"
          @click="selectedPetId = p.id"
        >
          <img :src="p.avatarUrl" :alt="p.name" class="chip-avatar" />
          <div class="chip-text-col">
            <span class="chip-pet-name">{{ p.name }}</span>
            <span class="chip-pet-breed">{{ p.breed?.split(' ')[0] }}</span>
          </div>
          <span v-if="selectedPetId === p.id" class="chip-active-dot"></span>
        </button>
      </div>

      <!-- Passport Sub-navigation Tabs -->
      <div class="passport-tabs-bar">
        <button 
          class="p-tab" 
          :class="{ active: activeSection === 'identity' }"
          @click="activeSection = 'identity'"
        >
          <Fingerprint :size="15" />
          <span>Identity & Lineage</span>
        </button>
        <button 
          class="p-tab" 
          :class="{ active: activeSection === 'owner' }"
          @click="activeSection = 'owner'"
        >
          <ShieldCheck :size="15" />
          <span>Owner Lineage</span>
        </button>
        <button 
          class="p-tab" 
          :class="{ active: activeSection === 'vaccines' }"
          @click="activeSection = 'vaccines'"
        >
          <FileText :size="15" />
          <span>Medical & Vaccines</span>
        </button>
      </div>

      <!-- ============================================== -->
      <!-- TAB 1: OFFICIAL DIGITAL PASSPORT & IDENTITY   -->
      <!-- ============================================== -->
      <div v-if="activeSection === 'identity'" class="tab-pane fade-in">
        <!-- Physical-Style Official Passport Document Card -->
        <div class="official-passport-card">
          <!-- Holographic Security Header -->
          <div class="pass-holo-header">
            <div class="emblem-row">
              <div class="nuzzle-gold-seal">🐾</div>
              <div class="pass-header-titles">
                <span class="pass-gov-title">NUZZLE VERIFIED PET REGISTRY</span>
                <h3 class="pass-main-title">DIGITAL CANINE & FELINE PASSPORT</h3>
                <span class="pass-intl-code">PASSPORT NO: {{ currentPet.passportNumber || 'BD-NZL-2024-001' }}</span>
              </div>
            </div>
            <div class="chip-rfid-badge">
              <QrCode :size="14" />
              <span>RFID VERIFIED</span>
            </div>
          </div>

          <!-- Main Passport Data Grid -->
          <div class="pass-inner-body">
            <!-- Left: Official Stamped Photo -->
            <div class="pass-photo-col">
              <div class="pass-photo-frame">
                <img :src="currentPet.avatarUrl" :alt="currentPet.name" class="pass-photo-img" />
                <div class="pass-watermark-stamp">VERIFIED</div>
              </div>
              <div class="microchip-scan-box" @click="showQrModal = true">
                <span class="barcode-graphic">||| | |||| || | ||||</span>
                <span class="microchip-id-text">{{ currentPet.microchipId || 'CHIP: 985-1410-0921-334' }}</span>
                <span class="tap-scan-hint">🔍 Tap for Live QR</span>
              </div>
            </div>

            <!-- Right: Identity Data Fields -->
            <div class="pass-fields-col">
              <div class="field-item full">
                <span class="f-label">OFFICIAL REGISTERED NAME</span>
                <span class="f-val highlight">{{ currentPet.name }}</span>
              </div>

              <div class="field-row">
                <div class="field-item">
                  <span class="f-label">SPECIES / TAXONOMY</span>
                  <span class="f-val">{{ currentPet.species }}</span>
                </div>
                <div class="field-item">
                  <span class="f-label">GENDER & REPRODUCTION</span>
                  <span class="f-val">{{ currentPet.gender || 'Neutered / Spayed' }}</span>
                </div>
              </div>

              <div class="field-item full">
                <span class="f-label">OFFICIAL BREED</span>
                <span class="f-val">{{ currentPet.breed || 'Purebred' }}</span>
              </div>

              <div class="field-row">
                <div class="field-item">
                  <span class="f-label">DATE OF BIRTH</span>
                  <span class="f-val">{{ currentPet.birthDate || 'April 12, 2022' }}</span>
                </div>
                <div class="field-item">
                  <span class="f-label">RECORDED AGE</span>
                  <span class="f-val">{{ currentPet.age || '2 yrs' }}</span>
                </div>
              </div>

              <div class="field-row">
                <div class="field-item">
                  <span class="f-label">REGISTERED WEIGHT</span>
                  <span class="f-val font-bold">{{ currentPet.weight || '29.5 kg' }}</span>
                </div>
                <div class="field-item">
                  <span class="f-label">BLOOD GROUP</span>
                  <span class="f-val">{{ currentPet.bloodType || 'Universal' }}</span>
                </div>
              </div>

              <div class="field-item full">
                <span class="f-label">DISTINCT COAT & MARKINGS</span>
                <span class="f-val note">{{ currentPet.colorMarkings || 'Distinct breed standard markings' }}</span>
              </div>
            </div>
          </div>

          <!-- Passport Footer Security & Authority Stamp -->
          <div class="pass-footer-stamp">
            <div class="authority-text">
              <span>ISSUED BY: {{ currentPet.registrationAuthority || 'Nuzzle Central Pet Registry • Dhaka' }}</span>
              <span class="doc-security">SECURE BIOMETRIC HASH • ISO 11784/11785 COMPLIANT</span>
            </div>
            <button class="pass-qr-btn" @click="showQrModal = true">
              <QrCode :size="16" />
              <span>Verify</span>
            </button>
          </div>
        </div>

        <!-- Quick Passport Actions -->
        <div class="passport-actions-grid">
          <button class="act-card-btn" @click="showQrModal = true">
            <div class="act-icon-box lavender">
              <QrCode :size="20" />
            </div>
            <div class="act-text-col">
              <span class="act-title">Scan RFID & QR</span>
              <span class="act-sub">For clinic or boarding intake</span>
            </div>
          </button>

          <button class="act-card-btn" @click="showExportModal = true">
            <div class="act-icon-box emerald">
              <Download :size="20" />
            </div>
            <div class="act-text-col">
              <span class="act-title">Export PDF Certificate</span>
              <span class="act-sub">Official travel-ready copy</span>
            </div>
          </button>
        </div>

        <!-- Travel & International Clearance Status -->
        <div class="clearance-card card">
          <div class="clearance-head">
            <Plane :size="18" class="plane-icon" />
            <h4 class="clearance-title">Travel & Boarding Clearance Status</h4>
          </div>
          <div class="clearance-grid">
            <div class="c-item">
              <CheckCircle2 :size="16" class="check-emerald" />
              <span>Domestic & Airline Boarding Approved</span>
            </div>
            <div class="c-item">
              <CheckCircle2 :size="16" class="check-emerald" />
              <span>Rabies Neutralising Antibody Titre (RNATT) Valid</span>
            </div>
            <div class="c-item">
              <CheckCircle2 :size="16" class="check-emerald" />
              <span>Internal / External Parasite Treatment: Up to Date</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 2: REGISTERED OWNER & CONTACT LINEAGE      -->
      <!-- ============================================== -->
      <div v-else-if="activeSection === 'owner'" class="tab-pane fade-in">
        <div class="owner-lineage-container">
          <!-- Primary Legal Guardian Card -->
          <div class="lineage-card card">
            <div class="l-card-header">
              <div class="l-badge">PRIMARY GUARDIAN</div>
              <span class="verified-tag">✓ Legal Lineage Verified</span>
            </div>

            <div class="guardian-profile-row">
              <img :src="owner.avatarUrl" :alt="owner.displayName" class="guardian-avatar" />
              <div class="guardian-info-col">
                <h4 class="guardian-name">{{ currentPet.ownerLineage?.primaryGuardian || owner.displayName }}</h4>
                <span class="guardian-rel">{{ currentPet.ownerLineage?.relationship || 'Primary Legal Pet Parent' }}</span>
                <span class="guardian-handle">@{{ owner.username }}</span>
              </div>
            </div>

            <div class="contact-details-list">
              <div class="contact-row">
                <Phone :size="15" class="c-icon" />
                <div class="c-val-col">
                  <span class="c-lbl">Direct Mobile Phone</span>
                  <a :href="`tel:${currentPet.ownerLineage?.phone || '+8801712345678'}`" class="c-val link">
                    {{ currentPet.ownerLineage?.phone || '+880 1712-345678' }}
                  </a>
                </div>
              </div>

              <div class="contact-row">
                <Mail :size="15" class="c-icon" />
                <div class="c-val-col">
                  <span class="c-lbl">Registered Email</span>
                  <span class="c-val">{{ currentPet.ownerLineage?.email || 'alex.rivers@pawmail.com' }}</span>
                </div>
              </div>

              <div class="contact-row">
                <MapPin :size="15" class="c-icon" />
                <div class="c-val-col">
                  <span class="c-lbl">Registered Home Address</span>
                  <span class="c-val">{{ currentPet.ownerLineage?.address || 'Road 79, House 14, Gulshan-2, Dhaka-1212' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary / Emergency Lineage Card -->
          <div class="lineage-card card emergency-card">
            <div class="l-card-header">
              <div class="l-badge rose">EMERGENCY BACKUP CONTACT</div>
              <span class="alert-tag">24/7 Helpline</span>
            </div>

            <div class="contact-details-list">
              <div class="contact-row">
                <UserCheck :size="15" class="c-icon rose" />
                <div class="c-val-col">
                  <span class="c-lbl">Emergency Guardian Contact</span>
                  <span class="c-val font-bold">{{ currentPet.ownerLineage?.emergencyContactName || 'Dr. Sarah Mitchell / Caretaker' }}</span>
                </div>
              </div>

              <div class="contact-row">
                <PhoneCall :size="15" class="c-icon rose" />
                <div class="c-val-col">
                  <span class="c-lbl">24/7 Emergency Hotline</span>
                  <a :href="`tel:${currentPet.ownerLineage?.emergencyPhone || '+8801987654321'}`" class="c-val link rose">
                    {{ currentPet.ownerLineage?.emergencyPhone || '+880 1987-654321' }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Primary Vet Clinic & Shelter Lineage -->
          <div class="lineage-card card">
            <div class="l-card-header">
              <div class="l-badge indigo">HEALTHCARE & RESCUE ORIGIN</div>
            </div>

            <div class="contact-details-list">
              <div class="contact-row">
                <Building2 :size="15" class="c-icon" />
                <div class="c-val-col">
                  <span class="c-lbl">Primary Registered Veterinary Hospital</span>
                  <span class="c-val font-bold">{{ currentPet.ownerLineage?.primaryVetClinic || 'Gulshan Pet Hospital & Emergency Center' }}</span>
                </div>
              </div>

              <div class="contact-row">
                <HeartHandshake :size="15" class="c-icon" />
                <div class="c-val-col">
                  <span class="c-lbl">Breeder / Shelter Origin Registry</span>
                  <span class="c-val">{{ currentPet.ownerLineage?.breederOrShelter || 'Dhaka Animal Rescue Foundation & Sanctuary (DRF-902)' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 3: MEDICAL, VACCINES & HEALTH LOGS        -->
      <!-- ============================================== -->
      <div v-else class="tab-pane fade-in">
        <!-- 24/7 AI Health Advisor Banner -->
        <div class="ai-health-banner" @click="setTab('ai')">
          <div class="ai-hb-icon">✨🩺</div>
          <div class="ai-hb-text">
            <span class="ai-hb-title">Ask PawAI 24/7 Health Triage</span>
            <span class="ai-hb-sub">Dose-accurate guidance using {{ currentPet.name }}'s passport data</span>
          </div>
          <ArrowRight :size="16" class="ai-arr" />
        </div>

        <!-- Official Immunization Certificates Table -->
        <div class="vaccine-certs-section">
          <div class="vax-head">
            <div class="vax-title-wrap">
              <Syringe :size="17" class="vax-icon" />
              <h4 class="vax-heading">Official Vaccination Certificates</h4>
            </div>
            <span class="vax-status-badge">100% Up to Date</span>
          </div>

          <div class="vax-cards-list">
            <div 
              v-for="vax in currentPet.vaccinationCertificates" 
              :key="vax.vaccine"
              class="vax-item-card card"
            >
              <div class="vax-card-top">
                <div class="vax-name-col">
                  <h5 class="vax-name">{{ vax.vaccine }}</h5>
                  <span class="vax-batch">Batch No: {{ vax.batchNumber }}</span>
                </div>
                <div class="vax-valid-badge">
                  <CheckCircle2 :size="13" />
                  <span>Valid</span>
                </div>
              </div>

              <div class="vax-dates-row">
                <div class="date-block">
                  <span class="d-lbl">Administered</span>
                  <span class="d-val">{{ vax.dateAdministered }}</span>
                </div>
                <div class="date-block highlight">
                  <span class="d-lbl">Valid Until</span>
                  <span class="d-val">{{ vax.validUntil }}</span>
                </div>
              </div>

              <div class="vax-signature-row">
                <span class="vax-clinic">🏥 {{ vax.vetClinic }}</span>
                <span class="vax-sig">✍️ {{ vax.vetSignature }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add New Medical Record Button -->
        <button class="btn-primary add-record-full-btn" @click="isCreateSheetOpen = true">
          <Plus :size="16" />
          <span>Record New Vaccine / Vet Checkup</span>
        </button>

        <!-- Medical Care Timeline -->
        <div class="timeline-container">
          <h4 class="timeline-title">Complete Care Timeline & Records</h4>

          <div class="timeline-items">
            <div 
              v-for="log in petLogs" 
              :key="log.id"
              class="timeline-card card"
            >
              <div class="t-type-badge" :class="log.type">
                <span v-if="log.type === 'vaccination'">💉 Vaccine</span>
                <span v-else-if="log.type === 'vet_visit'">🩺 Clinic Visit</span>
                <span v-else-if="log.type === 'medication'">💊 Medication</span>
                <span v-else>📋 Health Note</span>
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

      <!-- ============================================== -->
      <!-- MODAL: QR CODE VET SCANNER MODAL               -->
      <!-- ============================================== -->
      <div v-if="showQrModal" class="modal-overlay" @click.self="showQrModal = false">
        <div class="modal-sheet qr-modal-sheet">
          <div class="modal-handle"></div>
          <div class="qr-modal-content">
            <div class="qr-modal-head">
              <div class="qr-pet-badge">🐾 {{ currentPet.name }}'s Digital RFID</div>
              <h3 class="qr-modal-title">Live Vet Verification QR</h3>
              <p class="qr-modal-sub">Scan this code at any registered clinic, airport, or shelter to load instant medical clearance.</p>
            </div>

            <div class="qr-display-box">
              <div class="qr-code-graphic">
                <div class="qr-matrix">
                  <QrCode :size="180" class="qr-svg-icon" />
                </div>
              </div>
              <div class="rfid-code-pill">
                <span>{{ currentPet.microchipId || 'CHIP: 985-1410-0921-334' }}</span>
              </div>
            </div>

            <div class="qr-verified-info">
              <div class="v-line">
                <CheckCircle2 :size="15" class="check-emerald" />
                <span>Encrypted with ISO 11784 Microchip Standard</span>
              </div>
              <div class="v-line">
                <CheckCircle2 :size="15" class="check-emerald" />
                <span>Rabies & Core Vaccinations 100% Up to Date</span>
              </div>
            </div>

            <button class="btn-primary full-btn" @click="showQrModal = false">
              Done / Close Scanner
            </button>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- MODAL: EXPORT OFFICIAL PDF CERTIFICATE MODAL   -->
      <!-- ============================================== -->
      <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
        <div class="modal-sheet qr-modal-sheet">
          <div class="modal-handle"></div>
          <div class="qr-modal-content">
            <div class="cert-modal-head">
              <div class="cert-icon-seal">📜✨</div>
              <h3 class="qr-modal-title">Official PDF Passport Certificate</h3>
              <p class="qr-modal-sub">Verified travel & medical passport ready for download and international vet clearance.</p>
            </div>

            <div class="cert-preview-card">
              <div class="cert-ribbon">OFFICIAL RECORD</div>
              <h4 class="cert-pet-title">🐾 {{ currentPet.name }} ({{ currentPet.breed }})</h4>
              <p class="cert-details-text">
                <strong>Passport No:</strong> {{ currentPet.passportNumber || 'BD-NZL-8842' }}<br/>
                <strong>Microchip:</strong> {{ currentPet.microchipId }}<br/>
                <strong>Legal Guardian:</strong> {{ currentPet.ownerLineage?.primaryGuardian || owner.displayName }}<br/>
                <strong>Status:</strong> Fit for Travel & Public Boarding
              </p>
            </div>

            <button class="btn-primary full-btn" @click="handleDownloadPdf">
              <Download :size="16" />
              <span>Download & Print PDF Passport</span>
            </button>
            <button class="btn-secondary full-btn mt-2" @click="showExportModal = false">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Fingerprint, ShieldCheck, FileText, QrCode, Download, Plane, 
  CheckCircle2, Phone, Mail, MapPin, UserCheck, PhoneCall, Building2, 
  HeartHandshake, Syringe, Plus, ArrowRight 
} from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { pets, owner, healthLogs, isCreateSheetOpen, setTab } from '../stores/appStore';

const selectedPetId = ref(pets[0]?.id || 'pet_1');
const activeSection = ref<'identity' | 'owner' | 'vaccines'>('identity');
const showQrModal = ref(false);
const showExportModal = ref(false);

const currentPet = computed(() => {
  return pets.find(p => p.id === selectedPetId.value) || pets[0];
});

const petLogs = computed(() => {
  return healthLogs.filter(l => l.petId === selectedPetId.value);
});

function handleDownloadPdf() {
  alert(`🐾 Official PDF Passport for ${currentPet.value.name} (Passport #${currentPet.value.passportNumber || 'BD-NZL-8842'}) has been generated!`);
  showExportModal.value = false;
}
</script>

<style scoped>
.health-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-app);
}

.health-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px 28px;
}

/* Pet Switcher Tray */
.pet-selector-tray {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: 12px;
  scrollbar-width: none;
}

.pet-select-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 6px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s ease;
  position: relative;
}

.pet-select-chip.active {
  background: var(--brand-soft);
  border-color: var(--brand-primary);
  box-shadow: var(--shadow-sm);
}

.chip-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid var(--border-strong);
}

.chip-text-col {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.chip-pet-name {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--ink-primary);
  line-height: 1.2;
}

.chip-pet-breed {
  font-size: 10px;
  color: var(--ink-muted);
}

.chip-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-dark);
}

/* Passport Sub-tabs */
.passport-tabs-bar {
  display: flex;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 3px;
  margin-bottom: 14px;
}

.p-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 4px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-muted);
  transition: all 0.18s ease;
  cursor: pointer;
}

.p-tab.active {
  background: var(--bg-card);
  color: var(--brand-dark);
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.12);
}

/* ================================================= */
/* OFFICIAL DIGITAL PASSPORT DOCUMENT CARD          */
/* ================================================= */
.official-passport-card {
  background: linear-gradient(180deg, #FFFFFF 0%, #FAF8FF 100%);
  border: 2px solid var(--brand-primary);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.15);
  margin-bottom: 14px;
  position: relative;
}

/* Holographic Header */
.pass-holo-header {
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 50%, #6366F1 100%);
  color: #fff;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.emblem-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nuzzle-gold-seal {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FDE047, #F59E0B);
  display: grid;
  place-items: center;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  border: 1.5px solid #fff;
}

.pass-header-titles {
  display: flex;
  flex-direction: column;
}

.pass-gov-title {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #E0E7FF;
}

.pass-main-title {
  font-family: var(--font-display);
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #FFFFFF;
}

.pass-intl-code {
  font-size: 9.5px;
  font-weight: 700;
  color: #FDE047;
  letter-spacing: 0.04em;
}

.chip-rfid-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 8.5px;
  font-weight: 800;
  backdrop-filter: blur(4px);
}

/* Passport Inner Body */
.pass-inner-body {
  display: flex;
  gap: 12px;
  padding: 14px 12px 10px;
}

/* Left Photo Column */
.pass-photo-col {
  width: 105px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.pass-photo-frame {
  width: 105px;
  height: 125px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border-strong);
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pass-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pass-watermark-stamp {
  position: absolute;
  bottom: 6px;
  right: -8px;
  background: rgba(124, 58, 237, 0.85);
  color: #fff;
  font-size: 8px;
  font-weight: 900;
  padding: 2px 10px;
  transform: rotate(-15deg);
  letter-spacing: 0.06em;
  border: 1px solid #fff;
  border-radius: 4px;
}

.microchip-scan-box {
  width: 100%;
  background: var(--bg-card-subtle);
  border: 1px dashed var(--brand-primary);
  border-radius: 8px;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.12s ease;
}

.microchip-scan-box:hover {
  transform: scale(1.02);
  background: var(--brand-soft);
}

.barcode-graphic {
  font-family: monospace;
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--ink-primary);
}

.microchip-id-text {
  font-size: 8.5px;
  font-weight: 800;
  color: var(--brand-dark);
  text-align: center;
  line-height: 1.2;
}

.tap-scan-hint {
  font-size: 8px;
  font-weight: 700;
  color: var(--ink-muted);
  margin-top: 2px;
}

/* Right Data Fields Column */
.pass-fields-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-row {
  display: flex;
  gap: 8px;
}

.field-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(246, 242, 251, 0.7);
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid rgba(148, 125, 238, 0.12);
}

.field-item.full {
  flex: none;
  width: 100%;
}

.f-label {
  font-size: 7.5px;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: var(--ink-muted);
}

.f-val {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-primary);
  line-height: 1.2;
}

.f-val.highlight {
  font-size: 13px;
  font-weight: 900;
  color: var(--brand-dark);
}

.f-val.note {
  font-size: 9.5px;
  color: var(--ink-secondary);
}

/* Footer Stamp */
.pass-footer-stamp {
  background: #F4EFFF;
  border-top: 1px solid var(--border-light);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.authority-text {
  display: flex;
  flex-direction: column;
  font-size: 8px;
  color: var(--ink-secondary);
  font-weight: 700;
}

.doc-security {
  font-size: 7px;
  color: var(--brand-dark);
  font-weight: 800;
}

.pass-qr-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--brand-dark);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

/* Actions Grid */
.passport-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.act-card-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.15s ease;
  text-align: left;
}

.act-card-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--brand-primary);
}

.act-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.act-icon-box.lavender {
  background: var(--brand-soft);
  color: var(--brand-dark);
}

.act-icon-box.emerald {
  background: var(--accent-emerald-soft);
  color: var(--accent-emerald);
}

.act-text-col {
  display: flex;
  flex-direction: column;
}

.act-title {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.act-sub {
  font-size: 9.5px;
  color: var(--ink-muted);
}

/* Clearance Card */
.clearance-card {
  padding: 12px 14px;
  margin-bottom: 14px;
}

.clearance-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.plane-icon { color: var(--brand-dark); }

.clearance-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--ink-primary);
}

.clearance-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.c-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-secondary);
}

.check-emerald { color: var(--accent-emerald); flex-shrink: 0; }

/* ================================================= */
/* TAB 2: OWNER LINEAGE STYLES                       */
/* ================================================= */
.owner-lineage-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lineage-card {
  padding: 14px;
}

.lineage-card.emergency-card {
  border-color: rgba(225, 29, 72, 0.25);
  background: linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%);
}

.l-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.l-badge {
  font-size: 9.5px;
  font-weight: 800;
  background: var(--brand-soft);
  color: var(--brand-dark);
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.l-badge.rose {
  background: var(--accent-rose-soft);
  color: var(--accent-rose);
}

.l-badge.indigo {
  background: var(--accent-indigo-soft);
  color: var(--accent-indigo);
}

.verified-tag {
  font-size: 10px;
  font-weight: 800;
  color: var(--accent-emerald);
}

.alert-tag {
  font-size: 10px;
  font-weight: 800;
  color: var(--accent-rose);
}

.guardian-profile-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 10px;
}

.guardian-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--brand-primary);
}

.guardian-info-col {
  display: flex;
  flex-direction: column;
}

.guardian-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.guardian-rel {
  font-size: 11px;
  color: var(--brand-dark);
  font-weight: 700;
}

.guardian-handle {
  font-size: 10.5px;
  color: var(--ink-muted);
}

.contact-details-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.c-icon {
  color: var(--brand-dark);
  margin-top: 3px;
  flex-shrink: 0;
}

.c-icon.rose { color: var(--accent-rose); }

.c-val-col {
  display: flex;
  flex-direction: column;
}

.c-lbl {
  font-size: 9.5px;
  color: var(--ink-muted);
  font-weight: 700;
}

.c-val {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.c-val.link {
  color: var(--brand-dark);
  font-weight: 700;
  text-decoration: underline;
}

.c-val.link.rose { color: var(--accent-rose); }

/* ================================================= */
/* TAB 3: VACCINES & MEDICAL STYLES                  */
/* ================================================= */
.ai-health-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  color: #fff;
  border-radius: var(--radius-lg);
  margin-bottom: 14px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  transition: transform 0.15s ease;
}

.ai-health-banner:hover {
  transform: translateY(-2px);
}

.ai-hb-icon { font-size: 24px; }

.ai-hb-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ai-hb-title {
  font-size: 13px;
  font-weight: 800;
}

.ai-hb-sub {
  font-size: 10.5px;
  color: #E0E7FF;
}

.ai-arr { color: #FDE047; }

/* Vaccine List */
.vaccine-certs-section {
  margin-bottom: 16px;
}

.vax-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.vax-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.vax-icon { color: var(--brand-dark); }

.vax-heading {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
}

.vax-status-badge {
  font-size: 10px;
  font-weight: 800;
  background: var(--accent-emerald-soft);
  color: var(--accent-emerald);
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.vax-cards-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vax-item-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vax-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.vax-name-col {
  display: flex;
  flex-direction: column;
}

.vax-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--ink-primary);
}

.vax-batch {
  font-size: 10px;
  color: var(--ink-muted);
  font-family: monospace;
}

.vax-valid-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  background: var(--accent-emerald-soft);
  color: var(--accent-emerald);
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.vax-dates-row {
  display: flex;
  gap: 12px;
  background: var(--bg-card-subtle);
  padding: 6px 10px;
  border-radius: 8px;
}

.date-block {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.date-block.highlight .d-val {
  color: var(--brand-dark);
  font-weight: 800;
}

.d-lbl {
  font-size: 8.5px;
  color: var(--ink-muted);
  font-weight: 700;
}

.d-val {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.vax-signature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10.5px;
  color: var(--ink-secondary);
  font-weight: 600;
}

.add-record-full-btn {
  width: 100%;
  margin-bottom: 16px;
  padding: 12px;
}

/* Timeline */
.timeline-container {
  margin-top: 4px;
}

.timeline-title {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
  margin-bottom: 10px;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.t-type-badge {
  font-size: 9.5px;
  font-weight: 800;
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  color: var(--brand-dark);
}

.t-type-badge.vaccination { background: var(--accent-emerald-soft); color: var(--accent-emerald); }
.t-type-badge.vet_visit { background: var(--brand-soft); color: var(--brand-dark); }
.t-type-badge.medication { background: var(--accent-amber-soft); color: var(--accent-amber); }

.t-main-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.t-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.t-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--ink-primary);
}

.t-date {
  font-size: 10.5px;
  color: var(--ink-muted);
}

.t-notes {
  font-size: 11.5px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.t-footer-meta {
  display: flex;
  gap: 12px;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ink-muted);
  margin-top: 2px;
}

/* ================================================= */
/* MODALS STYLING                                    */
/* ================================================= */
.qr-modal-sheet {
  padding: 0 16px 24px;
}

.qr-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.qr-pet-badge {
  background: var(--brand-soft);
  color: var(--brand-dark);
  font-size: 11px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  margin-bottom: 4px;
}

.qr-modal-title {
  font-size: 18px;
  font-weight: 900;
  color: var(--ink-primary);
}

.qr-modal-sub {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.45;
  max-width: 320px;
}

.qr-display-box {
  background: #FFFFFF;
  border: 2px solid var(--brand-primary);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
}

.qr-matrix {
  color: #261E38;
}

.rfid-code-pill {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  font-family: monospace;
  font-size: 11px;
  font-weight: 800;
  color: var(--brand-dark);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.qr-verified-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  padding: 10px 14px;
  border-radius: 12px;
  width: 100%;
}

.v-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-secondary);
}

.full-btn {
  width: 100%;
  padding: 12px;
}

.mt-2 { margin-top: 8px; }

/* Certificate modal */
.cert-icon-seal { font-size: 36px; }

.cert-preview-card {
  background: #FFFDF9;
  border: 2px solid #D97706;
  border-radius: 14px;
  padding: 16px;
  width: 100%;
  text-align: left;
  position: relative;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.15);
}

.cert-ribbon {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 9px;
  font-weight: 900;
  background: #FEF3C7;
  color: #B45309;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.cert-pet-title {
  font-size: 15px;
  font-weight: 800;
  color: #78350F;
  margin-bottom: 8px;
}

.cert-details-text {
  font-size: 12px;
  line-height: 1.6;
  color: #451A03;
}
</style>
