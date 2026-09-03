<template>
  <div v-if="isOpen" class="modal-scrim" @click.self="close">
    <div class="passport-modal-shell">
      <!-- Top Modal Header -->
      <div class="passport-modal-header">
        <div class="header-left">
          <div class="gold-badge-icon">🛂</div>
          <div class="header-text">
            <h3 class="modal-title">Official Digital Pet Passport</h3>
            <span class="modal-sub">Verified Microchip & Digital Health ID</span>
          </div>
        </div>
        <button class="btn-icon close-btn" @click="close" title="Close Passport">
          <X :size="20" />
        </button>
      </div>

      <!-- Pet Switcher Tabs Inside Passport -->
      <div class="passport-pet-tabs">
        <button 
          v-for="p in pets" 
          :key="p.id"
          class="p-tab"
          :class="{ active: selectedPet.id === p.id }"
          @click="selectedPetId = p.id"
        >
          <img :src="p.avatarUrl" :alt="p.name" class="tab-avatar" />
          <span class="tab-name">{{ p.name }}</span>
          <span class="tab-chip-status">✓ Verified</span>
        </button>
      </div>

      <!-- Passport Pages Navigation Pill -->
      <div class="passport-page-pills">
        <button 
          v-for="page in pages" 
          :key="page.id"
          class="page-pill"
          :class="{ active: activePage === page.id }"
          @click="activePage = page.id as any"
        >
          <span class="page-icon">{{ page.icon }}</span>
          <span>{{ page.label }}</span>
        </button>
      </div>

      <!-- Scrollable Passport Document Body -->
      <div class="passport-body-scroll">
        <!-- ================= PAGE 1: OFFICIAL IDENTITY & BIOMETRICS ================= -->
        <div v-if="activePage === 'identity'" class="passport-sheet-page">
          <div class="passport-leather-card">
            <!-- Hologram & Gold Header Banner -->
            <div class="passport-card-top">
              <div class="emblem-group">
                <div class="gold-seal">🐾</div>
                <div class="registry-text">
                  <span class="reg-title">GLOBAL PET PASSPORT REGISTRY</span>
                  <span class="reg-sub">INTERNATIONAL PET IDENTIFICATION & HEALTH PASS</span>
                </div>
              </div>
              <div class="hologram-seal">
                <Sparkles :size="12" class="sparkle-anim" />
                <span>OFFICIAL VERIFIED</span>
              </div>
            </div>

            <!-- Main Bio Layout -->
            <div class="passport-id-grid">
              <!-- Left: Photo with Bezel & Watermark -->
              <div class="passport-photo-frame">
                <img :src="selectedPet.avatarUrl" :alt="selectedPet.name" class="passport-photo" />
                <div class="photo-stamp">PASSED ✓</div>
                <div class="photo-hologram-sheen"></div>
              </div>

              <!-- Right: Biometric Fields Table -->
              <div class="passport-fields-table">
                <div class="field-item">
                  <span class="f-label">DOCUMENT NUMBER</span>
                  <span class="f-val gold-text">NZL-2026-{{ selectedPet.id.toUpperCase() }}-8842</span>
                </div>

                <div class="field-row-double">
                  <div class="field-item">
                    <span class="f-label">PET FULL NAME</span>
                    <span class="f-val bold">{{ selectedPet.name }}</span>
                  </div>
                  <div class="field-item">
                    <span class="f-label">SPECIES / SEX</span>
                    <span class="f-val">{{ selectedPet.species }} • {{ selectedPet.species === 'Cat' ? 'Female' : 'Male' }}</span>
                  </div>
                </div>

                <div class="field-row-double">
                  <div class="field-item">
                    <span class="f-label">BREED</span>
                    <span class="f-val">{{ selectedPet.breed || 'Golden Mix' }}</span>
                  </div>
                  <div class="field-item">
                    <span class="f-label">AGE / WEIGHT</span>
                    <span class="f-val">{{ selectedPet.age || '2 yrs' }} • {{ selectedPet.weight || '29.5 kg' }}</span>
                  </div>
                </div>

                <div class="field-item">
                  <span class="f-label">REGISTERED GUARDIAN</span>
                  <span class="f-val">{{ owner.displayName }} (ID: @{{ owner.username }})</span>
                </div>
              </div>
            </div>

            <!-- Microchip & Scannable QR Recovery Strip -->
            <div class="microchip-recovery-strip">
              <div class="chip-info-block">
                <div class="chip-title-row">
                  <ShieldCheck :size="15" class="shield-icon" />
                  <span class="chip-title">ISO 11784/11785 RFID MICROCHIP</span>
                </div>
                <span class="chip-number">{{ selectedPet.microchipId || '985-0019-4820-GOLD' }}</span>
                <div class="barcode-visual">
                  ||| | |||| | || |||| ||| || |||| | ||| |||| |
                </div>
              </div>

              <div class="qr-code-box" @click="showFullscreenQr = !showFullscreenQr" title="Click to enlarge QR Code">
                <!-- SVG Vector QR Code Graphic -->
                <div class="qr-svg-wrapper">
                  <QrCode :size="52" class="qr-icon" />
                </div>
                <span class="qr-tap-hint">Tap QR to Scan</span>
              </div>
            </div>

            <!-- Security Watermark Strip -->
            <div class="security-footer-strip">
              <span>SECURITY HASH: 8f4a-9b1c-77e2-nuzzle-auth</span>
              <span>ISSUED BY: NUZZLE VET CLINIC ALLIANCE</span>
            </div>
          </div>
        </div>

        <!-- ================= PAGE 2: VACCINATIONS & IMMUNITY VISA ================= -->
        <div v-else-if="activePage === 'vaccines'" class="passport-sheet-page">
          <div class="visa-section-card">
            <div class="visa-header">
              <Syringe :size="18" class="visa-icon" />
              <div>
                <h4 class="visa-title">Immunization & Booster Certificate</h4>
                <p class="visa-sub">Certified veterinary stamps & antibody titers</p>
              </div>
            </div>

            <!-- Overall Immunity Status Banner -->
            <div class="immunity-score-banner">
              <div class="imm-ring">
                <span class="imm-pct">100%</span>
                <span class="imm-lbl">Protected</span>
              </div>
              <div class="imm-details">
                <div class="imm-status-badge">
                  <CheckCircle2 :size="14" />
                  <span>All Core Vaccines Active</span>
                </div>
                <p class="imm-countdown">Next scheduled booster in <strong>312 days</strong> (June 2027)</p>
              </div>
            </div>

            <!-- Vaccines Stamp List -->
            <div class="vaccines-stamp-grid">
              <div 
                v-for="vax in currentPetVaccines" 
                :key="vax.name"
                class="vax-stamp-card"
              >
                <div class="vax-card-top">
                  <span class="vax-name">{{ vax.name }}</span>
                  <span class="vax-stamp-badge">{{ vax.stamp }}</span>
                </div>
                <div class="vax-meta-rows">
                  <div class="v-row">
                    <span class="v-lbl">Administered:</span>
                    <span class="v-val">{{ vax.date }}</span>
                  </div>
                  <div class="v-row">
                    <span class="v-lbl">Expires:</span>
                    <span class="v-val gold-text">{{ vax.expiry }}</span>
                  </div>
                  <div class="v-row">
                    <span class="v-lbl">Clinic:</span>
                    <span class="v-val">{{ vax.clinic }}</span>
                  </div>
                </div>
                <div class="batch-seal">
                  BATCH: {{ vax.batch }} • AUTHENTICATED ✓
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= PAGE 3: TRAVEL & SAFETY CLEARANCE ================= -->
        <div v-else-if="activePage === 'travel'" class="passport-sheet-page">
          <div class="visa-section-card">
            <div class="visa-header">
              <Plane :size="18" class="visa-icon" />
              <div>
                <h4 class="visa-title">International & Domestic Travel Visa</h4>
                <p class="visa-sub">Airline & transit compliance certification</p>
              </div>
            </div>

            <!-- Clearance Stamp -->
            <div class="travel-clearance-box">
              <div class="clearance-stamp-seal">
                <div class="stamp-inner-circle">
                  <span>FIT TO TRAVEL</span>
                  <span class="stamp-date">2026–2027</span>
                  <span>CLEARED ✈️</span>
                </div>
              </div>
              <div class="clearance-text">
                <h5 class="c-title">Cabin & Cargo Flight Cleared</h5>
                <p class="c-desc">
                  {{ selectedPet.name }} has completed veterinary physical wellness screening. Free from clinical signs of infectious disease and external parasites.
                </p>
                <div class="compliance-tags">
                  <span class="c-tag">✓ USDA / IATA Compliant</span>
                  <span class="c-tag">✓ Tapeworm & Rabies Certified</span>
                  <span class="c-tag">✓ Sedation-Free Travel Protocol</span>
                </div>
              </div>
            </div>

            <!-- Temperament & Safety Rating -->
            <div class="temperament-box">
              <h5 class="temp-heading">🛡️ Temperament & Behavioral Safety Assessment</h5>
              <div class="temp-metrics-grid">
                <div class="temp-metric">
                  <span class="tm-lbl">Stranger Friendliness:</span>
                  <strong class="tm-val green">10/10 (Gentle Enthusiast)</strong>
                </div>
                <div class="temp-metric">
                  <span class="tm-lbl">Other Pet Harmony:</span>
                  <strong class="tm-val green">9.8/10 (Playful)</strong>
                </div>
                <div class="temp-metric">
                  <span class="tm-lbl">Bite Risk Level:</span>
                  <strong class="tm-val green">0% (Verified Zero Incident)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer Toolbar -->
      <div class="passport-footer-toolbar">
        <button class="btn-solid p-action-btn" @click="downloadPassportCard">
          <Download :size="16" />
          <span>Save Digital Card</span>
        </button>

        <button class="btn-outline p-action-btn" @click="sharePassport">
          <Share2 :size="16" />
          <span>Share Passport</span>
        </button>
      </div>

      <!-- Toast Feedback Popup -->
      <transition name="toast-fade">
        <div v-if="toastMessage" class="passport-toast">
          {{ toastMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Sparkles, ShieldCheck, QrCode, Syringe, Plane, Download, Share2, CheckCircle2 } from 'lucide-vue-next';
import { pets, owner, activeProfileId } from '../../stores/appStore';
import type { Pet } from '../../types';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const selectedPetId = ref(
  activeProfileId.value !== 'owner_me' ? activeProfileId.value : (pets[0]?.id || 'pet_1')
);

const activePage = ref<'identity' | 'vaccines' | 'travel'>('identity');
const showFullscreenQr = ref(false);
const toastMessage = ref<string | null>(null);

const pages = [
  { id: 'identity', label: 'Identity & Chip', icon: '🐾' },
  { id: 'vaccines', label: 'Vaccine Visas', icon: '💉' },
  { id: 'travel', label: 'Travel Clearance', icon: '✈️' }
];

const selectedPet = computed<Pet>(() => {
  return pets.find(p => p.id === selectedPetId.value) || pets[0] || {
    id: 'pet_draft',
    ownerId: owner.id,
    name: 'Pet Companion',
    species: 'Dog',
    breed: 'Companion',
    avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    weight: '5.0 kg',
    microchipId: '985-0000-0000-000',
    postsCount: 0,
    followersCount: 0
  };
});

const currentPetVaccines = computed(() => {
  const isDog = selectedPet.value?.species !== 'Cat';
  if (isDog) {
    return [
      {
        name: 'Rabies 3-Year Core Vaccine',
        stamp: '⭐ GOLD VERIFIED',
        date: 'Oct 14, 2024',
        expiry: 'Oct 14, 2027',
        clinic: 'Rose City Animal Hospital',
        batch: 'RB-89210-CA'
      },
      {
        name: 'DHPP 5-in-1 (Distemper/Parvo)',
        stamp: '✓ IMMUNIZED',
        date: 'June 10, 2025',
        expiry: 'June 10, 2027',
        clinic: 'Rose City Animal Hospital',
        batch: 'DH-44021-X'
      },
      {
        name: 'Bordetella (Kennel Cough)',
        stamp: '✓ IMMUNIZED',
        date: 'Jan 15, 2026',
        expiry: 'Jan 15, 2027',
        clinic: 'Downtown Veterinary Clinic',
        batch: 'KC-11093-B'
      },
      {
        name: 'Canine Leptospirosis 4-Way',
        stamp: '✓ PROTECTED',
        date: 'June 10, 2025',
        expiry: 'June 10, 2026',
        clinic: 'Rose City Animal Hospital',
        batch: 'LP-33921-A'
      }
    ];
  } else {
    return [
      {
        name: 'Feline Rabies Core Vaccine',
        stamp: '⭐ GOLD VERIFIED',
        date: 'Nov 02, 2024',
        expiry: 'Nov 02, 2027',
        clinic: 'Rose City Animal Hospital',
        batch: 'FR-55912-NY'
      },
      {
        name: 'FVRCP (Feline Viral Rhinotracheitis)',
        stamp: '✓ IMMUNIZED',
        date: 'July 18, 2025',
        expiry: 'July 18, 2027',
        clinic: 'Rose City Animal Hospital',
        batch: 'FV-88201-C'
      },
      {
        name: 'Feline Leukemia Virus (FeLV)',
        stamp: '✓ IMMUNIZED',
        date: 'Feb 12, 2026',
        expiry: 'Feb 12, 2027',
        clinic: 'Downtown Veterinary Clinic',
        batch: 'FL-99120-K'
      }
    ];
  }
});

function close() {
  emit('close');
}

function showToast(msg: string) {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = null;
  }, 2200);
}

function downloadPassportCard() {
  showToast(`📥 Digital Passport Card for ${selectedPet.value.name} saved!`);
}

function sharePassport() {
  if (navigator.share) {
    navigator.share({
      title: `${selectedPet.value.name}'s Official Pet Passport`,
      text: `View ${selectedPet.value.name}'s verified medical & vaccination passport on Nuzzle!`,
      url: window.location.href
    }).catch(() => {});
  } else {
    showToast(`🔗 Passport link for ${selectedPet.value.name} copied to clipboard!`);
  }
}
</script>

<style scoped>
.passport-modal-shell {
  width: 100%;
  max-width: 440px;
  height: 92%;
  background: var(--bg-card);
  border-radius: 28px 28px 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.45);
  animation: slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  overflow: hidden;
  position: relative;
}

.passport-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 10px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-glass);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gold-badge-icon {
  font-size: 24px;
}

.modal-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
  letter-spacing: -0.01em;
}

.modal-sub {
  font-size: 11px;
  color: var(--ink-muted);
}

/* Pet Switcher Tabs */
.passport-pet-tabs {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-card-subtle);
  border-bottom: 1px solid var(--border-light);
  overflow-x: auto;
  scrollbar-width: none;
}

.passport-pet-tabs::-webkit-scrollbar {
  display: none;
}

.p-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 6px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-secondary);
  white-space: nowrap;
  transition: all 0.15s ease;
}

.p-tab.active {
  background: var(--brand-gradient);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 3px 10px rgba(148, 125, 238, 0.35);
}

.tab-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

.tab-chip-status {
  font-size: 9.5px;
  opacity: 0.85;
}

/* Page Pills */
.passport-page-pills {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border-light);
}

.page-pill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 0;
  border-radius: var(--radius-md);
  font-size: 11.5px;
  font-weight: 700;
  background: var(--bg-card-subtle);
  color: var(--ink-muted);
  transition: all 0.15s ease;
}

.page-pill.active {
  background: #241A3E;
  color: #F8FAFC;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

:global([data-theme='dark']) .page-pill.active {
  background: var(--brand-primary);
  color: #fff;
}

.passport-body-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
}

/* LEATHER PASSPORT CARD DESIGN */
.passport-leather-card {
  background: linear-gradient(145deg, #1E1735 0%, #120E22 60%, #1A132E 100%);
  border: 2px solid #D4AF37;
  border-radius: 20px;
  padding: 16px;
  color: #F8FAFC;
  box-shadow: 
    0 16px 36px rgba(18, 14, 34, 0.4),
    inset 0 0 20px rgba(212, 175, 55, 0.12);
  position: relative;
  overflow: hidden;
}

.passport-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(212, 175, 55, 0.35);
  padding-bottom: 10px;
  margin-bottom: 12px;
}

.emblem-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gold-seal {
  font-size: 24px;
}

.reg-title {
  display: block;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #FDE047;
}

.reg-sub {
  display: block;
  font-size: 8.5px;
  color: #CBD5E1;
  letter-spacing: 0.04em;
}

.hologram-seal {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3));
  border: 1px solid rgba(244, 114, 182, 0.5);
  padding: 3px 8px;
  border-radius: var(--radius-full);
  font-size: 9px;
  font-weight: 800;
  color: #FBCFE8;
}

.sparkle-anim {
  color: #FDE047;
  animation: pulse 1.5s infinite;
}

/* ID Grid */
.passport-id-grid {
  display: flex;
  gap: 14px;
  margin-bottom: 12px;
}

.passport-photo-frame {
  position: relative;
  width: 95px;
  height: 115px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #D4AF37;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.passport-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-stamp {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
  font-size: 8.5px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 4px;
}

.photo-hologram-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.25) 50%, transparent 60%);
  pointer-events: none;
}

.passport-fields-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-item {
  display: flex;
  flex-direction: column;
}

.field-row-double {
  display: flex;
  gap: 10px;
}

.field-row-double .field-item {
  flex: 1;
}

.f-label {
  font-size: 8.5px;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 0.05em;
}

.f-val {
  font-size: 11.5px;
  color: #F8FAFC;
}

.f-val.bold {
  font-weight: 800;
  font-size: 13px;
}

.gold-text {
  color: #FDE047 !important;
  font-weight: 800;
}

/* Microchip Recovery Strip */
.microchip-recovery-strip {
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.chip-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #A7F3D0;
  font-size: 9.5px;
  font-weight: 800;
}

.chip-number {
  font-family: monospace;
  font-size: 13px;
  font-weight: 800;
  color: #FDE047;
  letter-spacing: 0.05em;
}

.barcode-visual {
  font-family: monospace;
  font-size: 9px;
  color: #94A3B8;
  letter-spacing: 2px;
  margin-top: 2px;
}

.qr-code-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: #ffffff;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.qr-svg-wrapper {
  color: #0F172A;
  display: grid;
  place-items: center;
}

.qr-tap-hint {
  font-size: 7.5px;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
}

.security-footer-strip {
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  color: #64748B;
  margin-top: 10px;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
  padding-top: 6px;
}

/* VISA SECTIONS */
.visa-section-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.visa-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.visa-icon {
  color: var(--brand-primary);
}

.visa-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
}

.visa-sub {
  font-size: 11px;
  color: var(--ink-muted);
}

.immunity-score-banner {
  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
  border: 1.5px solid #10B981;
  border-radius: var(--radius-md);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.imm-ring {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #10B981;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.35);
}

.imm-pct {
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
}

.imm-lbl {
  font-size: 8px;
  text-transform: uppercase;
  font-weight: 700;
}

.imm-status-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 800;
  color: #065F46;
}

.imm-countdown {
  font-size: 11px;
  color: #047857;
  margin-top: 2px;
}

.vaccines-stamp-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vax-stamp-card {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vax-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vax-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--ink-primary);
}

.vax-stamp-badge {
  font-size: 9.5px;
  font-weight: 800;
  background: #FEF3C7;
  color: #B45309;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  border: 1px solid #FCD34D;
}

.vax-meta-rows {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  font-size: 10.5px;
}

.v-lbl {
  display: block;
  color: var(--ink-muted);
}

.v-val {
  color: var(--ink-primary);
  font-weight: 600;
}

.batch-seal {
  font-size: 9px;
  font-weight: 700;
  color: var(--accent-emerald);
  border-top: 1px dashed var(--border-light);
  padding-top: 5px;
}

/* TRAVEL SECTION */
.travel-clearance-box {
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 14px;
  display: flex;
  gap: 12px;
}

.clearance-stamp-seal {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  border: 2px dashed #3B82F6;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #1D4ED8;
}

.stamp-inner-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 8px;
  font-weight: 800;
  text-align: center;
}

.stamp-date {
  font-size: 9px;
  color: #2563EB;
}

.clearance-text {
  flex: 1;
}

.c-title {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.c-desc {
  font-size: 11px;
  color: var(--ink-secondary);
  line-height: 1.35;
  margin: 4px 0 8px;
}

.compliance-tags {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 10.5px;
  font-weight: 700;
  color: #047857;
}

.temperament-box {
  background: var(--bg-card-subtle);
  border-radius: var(--radius-md);
  padding: 12px;
}

.temp-heading {
  font-size: 12px;
  font-weight: 800;
  color: var(--ink-primary);
  margin-bottom: 8px;
}

.temp-metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
}

.tm-lbl {
  color: var(--ink-muted);
  margin-right: 6px;
}

.tm-val.green {
  color: var(--accent-emerald);
}

/* Footer Actions */
.passport-footer-toolbar {
  padding: 12px 16px 20px;
  background: var(--bg-card);
  border-top: 1px solid var(--border-light);
  display: flex;
  gap: 10px;
}

.p-action-btn {
  flex: 1;
  padding: 11px 0;
  font-size: 13px;
}

/* Toast */
.passport-toast {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 18, 42, 0.95);
  color: #fff;
  padding: 8px 18px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  z-index: 200;
  white-space: nowrap;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>
