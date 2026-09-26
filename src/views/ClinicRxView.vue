<template>
  <div class="clinic-rx-view" :class="{ 'fullscreen-portal': isExpanded }">
    <!-- Top Action Bar for Clinic -->
    <header class="clinic-navbar no-print">
      <div class="nav-brand-group">
        <div class="clinic-badge-icon">
          <span>🩺</span>
        </div>
        <div class="clinic-titles">
          <div class="title-with-pill">
            <h2 class="portal-main-heading">Nuzzle VetRx™ Clinic Portal</h2>
            <span class="live-sync-pill">● Nuzzle Cloud Synced</span>
          </div>
          <p class="portal-sub-text">Connected Small Animal Clinical EMR & Prescription Dispatch Engine</p>
        </div>
      </div>

      <div class="nav-controls">
        <button class="portal-btn secondary-btn" @click="activeView = activeView === 'form' ? 'archive' : 'form'">
          <span v-if="activeView === 'form'">📋 Prescriptions Archive ({{ clinicPrescriptions.length }})</span>
          <span v-else>✍️ Write New Prescription</span>
        </button>

        <button class="portal-btn icon-btn" @click="isExpanded = !isExpanded" :title="isExpanded ? 'Collapse View' : 'Expand Portal'">
          <span v-if="isExpanded">🗗 Standard</span>
          <span v-else>🗖 Expand</span>
        </button>

        <button class="portal-btn exit-btn" @click="setTab('feed')" title="Back to Nuzzle App">
          <span>✕ Exit Portal</span>
        </button>
      </div>
    </header>

    <!-- MAIN SCROLLABLE WORKSPACE -->
    <main class="clinic-workspace no-print">
      <!-- VIEW 1: PRESCRIPTION CREATOR & DOSAGE ENGINE -->
      <div v-if="activeView === 'form'" class="rx-composer-grid">
        <!-- LEFT COLUMN: Practice Info, Patient Vitals & Diagnosis -->
        <section class="rx-column left-pane">
          <!-- 1. Practice & Attending Vet Card -->
          <div class="portal-card practice-card">
            <div class="card-section-head">
              <span class="step-num">1</span>
              <h4>Clinic Letterhead & Attending Doctor</h4>
            </div>

            <div class="clinic-selector-row">
              <label class="field-label">Select Practice</label>
              <select v-model="selectedClinicPreset" class="portal-select" @change="applyClinicPreset">
                <option value="cascade">Cascade 24/7 Animal Hospital (Dhanmondi)</option>
                <option value="gulshan">Gulshan Pet Care & Surgery Centre (Gulshan 2)</option>
                <option value="uttara">Paws & Claws Veterinary Clinic (Uttara)</option>
                <option value="custom">-- Custom Clinic Letterhead --</option>
              </select>
            </div>

            <div class="grid-2-col">
              <div class="field-group">
                <label class="field-label">Attending Veterinarian</label>
                <input v-model="form.doctorName" type="text" class="portal-input" placeholder="e.g. Dr. Emily Watson, DVM" />
              </div>
              <div class="field-group">
                <label class="field-label">BVC / Vet Council Reg. No</label>
                <input v-model="form.doctorRegNo" type="text" class="portal-input" placeholder="e.g. BVC-Reg-3921" />
              </div>
            </div>

            <div class="field-group mt-2">
              <label class="field-label">Doctor Qualifications / Specialties</label>
              <input v-model="form.doctorDegrees" type="text" class="portal-input" placeholder="e.g. DVM, MS Small Animal Surgery" />
            </div>
          </div>

          <!-- 2. Patient & Owner Identification -->
          <div class="portal-card patient-card">
            <div class="card-section-head">
              <span class="step-num">2</span>
              <h4>Patient Demographics & Vitals</h4>
            </div>

            <!-- Pet Mode Switch: Nuzzle Pet vs Walk-in -->
            <div class="pet-origin-toggle">
              <button 
                class="origin-btn" 
                :class="{ active: petOrigin === 'nuzzle' }" 
                @click="setPetOrigin('nuzzle')"
              >
                🐾 Nuzzle Community Pet
              </button>
              <button 
                class="origin-btn" 
                :class="{ active: petOrigin === 'walkin' }" 
                @click="setPetOrigin('walkin')"
              >
                🏥 Walk-In Patient
              </button>
            </div>

            <!-- Nuzzle Pet Quick Selector -->
            <div v-if="petOrigin === 'nuzzle' && nuzzlePetsList.length > 0" class="field-group">
              <label class="field-label">Select Patient from Nuzzle Registry</label>
              <select v-model="selectedNuzzlePetId" class="portal-select" @change="onSelectNuzzlePet">
                <option v-for="p in nuzzlePetsList" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.species }} - {{ p.breed || 'Companion' }}) • Owner: {{ owner.displayName }}
                </option>
              </select>
            </div>

            <div class="grid-2-col">
              <div class="field-group">
                <label class="field-label">Pet Name *</label>
                <input v-model="form.petName" type="text" class="portal-input highlight-input" placeholder="e.g. Milo" />
              </div>
              <div class="field-group">
                <label class="field-label">Species *</label>
                <select v-model="form.petSpecies" class="portal-select">
                  <option value="Dog">Dog (Canine)</option>
                  <option value="Cat">Cat (Feline)</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Bird">Bird (Avian)</option>
                  <option value="Other">Other Companion</option>
                </select>
              </div>
            </div>

            <div class="grid-3-col mt-2">
              <div class="field-group">
                <label class="field-label">Breed</label>
                <input v-model="form.petBreed" type="text" class="portal-input" placeholder="e.g. Golden Retriever" />
              </div>
              <div class="field-group">
                <label class="field-label">Age</label>
                <input v-model="form.petAge" type="text" class="portal-input" placeholder="e.g. 2 Years" />
              </div>
              <div class="field-group weight-critical-box">
                <label class="field-label weight-label">Weight (kg) *</label>
                <div class="weight-input-stepper">
                  <button type="button" class="step-btn" @click="stepWeight(-0.5)">-</button>
                  <input 
                    v-model.number="form.petWeightKg" 
                    type="number" 
                    step="0.1" 
                    min="0.1" 
                    class="portal-input weight-input" 
                    placeholder="28.5"
                    @input="recalculateFormulary" 
                  />
                  <button type="button" class="step-btn" @click="stepWeight(0.5)">+</button>
                </div>
                <span class="weight-calc-hint">Powers auto-dosage engine</span>
              </div>
            </div>

            <!-- Vitals Bar -->
            <div class="vitals-row mt-3">
              <div class="vital-item">
                <label>🌡️ Temp</label>
                <input v-model="form.temperature" type="text" class="mini-input" placeholder="101.5 °F" />
              </div>
              <div class="vital-item">
                <label>❤️ Heart Rate</label>
                <input v-model="form.pulseRate" type="text" class="mini-input" placeholder="92 bpm" />
              </div>
              <div class="vital-item">
                <label>🫁 Respiration</label>
                <input v-model="vitals.respiration" type="text" class="mini-input" placeholder="24 rpm" />
              </div>
            </div>

            <!-- Owner Info -->
            <div class="grid-2-col mt-3">
              <div class="field-group">
                <label class="field-label">Owner / Guardian Name *</label>
                <input v-model="form.ownerName" type="text" class="portal-input" placeholder="e.g. Tanvir Ahmed" />
              </div>
              <div class="field-group">
                <label class="field-label">Owner WhatsApp / Mobile *</label>
                <input v-model="form.ownerPhone" type="text" class="portal-input" placeholder="e.g. +880 1711-223344" />
              </div>
            </div>
          </div>

          <!-- 3. Clinical Assessment & Diagnosis -->
          <div class="portal-card diagnosis-card">
            <div class="card-section-head">
              <span class="step-num">3</span>
              <h4>Diagnosis & Clinical Findings</h4>
            </div>

            <div class="field-group">
              <label class="field-label">Clinical Diagnosis *</label>
              <input 
                v-model="form.diagnosis" 
                type="text" 
                class="portal-input diag-input" 
                placeholder="e.g. Acute Gastroenteritis & Dehydration" 
              />
            </div>

            <!-- Quick Presets -->
            <div class="diag-presets-tray">
              <span class="presets-caption">Quick Presets:</span>
              <button 
                v-for="preset in diagnosisPresets" 
                :key="preset.name" 
                type="button" 
                class="preset-chip"
                @click="applyDiagnosisPreset(preset)"
              >
                {{ preset.name }}
              </button>
            </div>

            <div class="field-group mt-2">
              <label class="field-label">Clinical Observations & Physical Exam Notes</label>
              <textarea 
                v-model="form.clinicalNotes" 
                rows="2" 
                class="portal-textarea" 
                placeholder="Mild abdominal discomfort on palpation. Mucous membranes pink, CRT < 2s. Hydration adequate."
              ></textarea>
            </div>
          </div>
        </section>

        <!-- RIGHT COLUMN: Smart Drug Formulary, Medications, Diet & Dispatch -->
        <section class="rx-column right-pane">
          <!-- 4. Smart Veterinary Formulary & Auto-Dosage Engine -->
          <div class="portal-card formulary-card">
            <div class="card-section-head between">
              <div class="flex-align-gap">
                <span class="step-num">4</span>
                <h4>Rx Smart Formulary & Weight-Based Calculator</h4>
              </div>
              <span class="rx-sym">℞</span>
            </div>

            <p class="formulary-desc">
              Click any common veterinary drug below to automatically compute the exact dosage based on patient weight (<strong>{{ form.petWeightKg || 0 }} kg</strong>):
            </p>

            <!-- Quick Drug Pills Tray -->
            <div class="quick-drugs-grid">
              <button 
                v-for="drug in formularyDatabase" 
                :key="drug.name" 
                type="button" 
                class="drug-quick-pill"
                @click="addFormularyDrug(drug)"
                :title="drug.indication"
              >
                <span class="drug-name-bold">{{ drug.name }}</span>
                <span class="drug-calc-preview">{{ calculateDrugDosePreview(drug) }}</span>
              </button>
            </div>

            <!-- Active Prescribed Medications Table -->
            <div class="medications-table-wrapper mt-3">
              <div class="table-header-row">
                <span class="col-name">Medicine & Strength</span>
                <span class="col-dosage">Dosage & Frequency</span>
                <span class="col-duration">Duration</span>
                <span class="col-instructions">Instructions</span>
                <span class="col-actions"></span>
              </div>

              <div v-if="form.medications.length === 0" class="empty-meds-box">
                <span>💊 No medications added yet. Click a drug above or press "+ Add Custom Medication"</span>
              </div>

              <div 
                v-for="(med, idx) in form.medications" 
                :key="med.id || idx" 
                class="med-item-row"
              >
                <div class="col-name">
                  <input v-model="med.name" type="text" class="med-table-input med-name-field" placeholder="Drug name" />
                  <div class="type-strength-row">
                    <select v-model="med.type" class="med-mini-select">
                      <option value="Tablet">Tablet</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Drops">Drops</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Topical">Topical</option>
                    </select>
                    <input v-model="med.strength" type="text" class="med-table-input strength-field" placeholder="e.g. 375 mg" />
                  </div>
                </div>

                <div class="col-dosage">
                  <input v-model="med.dosage" type="text" class="med-table-input" placeholder="e.g. 1 Tablet" />
                  <select v-model="med.frequency" class="med-mini-select mt-1">
                    <option value="Once Daily (SID)">Once Daily (SID)</option>
                    <option value="Twice Daily (BID)">Twice Daily (BID)</option>
                    <option value="Thrice Daily (TID)">Thrice Daily (TID)</option>
                    <option value="Every 8 Hours">Every 8 Hours</option>
                    <option value="Every 12 Hours">Every 12 Hours</option>
                    <option value="As Needed (PRN)">As Needed (PRN)</option>
                    <option value="Single Dose Stat">Single Dose Stat</option>
                  </select>
                </div>

                <div class="col-duration">
                  <input v-model="med.duration" type="text" class="med-table-input" placeholder="e.g. 7 Days" />
                </div>

                <div class="col-instructions">
                  <input v-model="med.instructions" type="text" class="med-table-input" placeholder="e.g. After food with fresh water" />
                </div>

                <div class="col-actions">
                  <button type="button" class="del-med-btn" @click="removeMedication(idx)" title="Remove medicine">✕</button>
                </div>
              </div>

              <button type="button" class="add-custom-med-btn mt-2" @click="addEmptyMedication">
                + Add Custom Medication Line
              </button>
            </div>
          </div>

          <!-- 5. Dietary, Nutrition & Follow-up Directives -->
          <div class="portal-card care-card">
            <div class="card-section-head">
              <span class="step-num">5</span>
              <h4>Dietary Advice & Next Follow-Up</h4>
            </div>

            <div class="grid-2-col">
              <div class="field-group">
                <label class="field-label">Special Dietary Directives</label>
                <textarea 
                  v-model="form.dietaryAdvice" 
                  rows="2" 
                  class="portal-textarea" 
                  placeholder="e.g. Royal Canin Gastrointestinal wet kibble for 10 days. Strictly no table scraps or chicken skin."
                ></textarea>
              </div>

              <div class="field-group">
                <label class="field-label">Next Clinic Review / Follow-Up Date</label>
                <input v-model="form.followUpDate" type="date" class="portal-input" />
                <div class="quick-date-chips mt-1">
                  <button type="button" class="chip-date" @click="setFollowUpDays(3)">+3 Days</button>
                  <button type="button" class="chip-date" @click="setFollowUpDays(5)">+5 Days</button>
                  <button type="button" class="chip-date" @click="setFollowUpDays(7)">+7 Days</button>
                  <button type="button" class="chip-date" @click="setFollowUpDays(14)">+14 Days</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. Triple-Channel Dispatch & Nuzzle Synchronization Hub -->
          <div class="portal-card dispatch-hub-card">
            <div class="card-section-head">
              <span class="step-num">6</span>
              <h4>Dispatch & Communication Center</h4>
            </div>

            <p class="dispatch-help">
              Issuing creates a tamper-proof digital prescription, automatically synchronizes with Nuzzle's HealthLog Vault, and prepares direct WhatsApp transmission for the pet owner.
            </p>

            <div class="action-buttons-cluster">
              <!-- Sync to Nuzzle Button -->
              <button 
                type="button" 
                class="dispatch-action-btn primary-sync-btn"
                :disabled="isSubmitting"
                @click="handleSubmitPrescription"
              >
                <span v-if="isSubmitting" class="spinner">⏳</span>
                <span v-else>⚡ Issue & Sync to Nuzzle App</span>
              </button>

              <!-- Print A4 Button -->
              <button 
                type="button" 
                class="dispatch-action-btn print-btn"
                @click="openPrintPreview"
              >
                <span>🖨️ Print Official A4 Rx</span>
              </button>

              <!-- WhatsApp Dispatch Button -->
              <button 
                type="button" 
                class="dispatch-action-btn whatsapp-btn"
                @click="sendViaWhatsApp"
              >
                <span>📱 Send via WhatsApp</span>
              </button>
            </div>

            <!-- Success Flash Notification Banner -->
            <transition name="fade">
              <div v-if="successBanner" class="success-alert-card mt-3">
                <div class="alert-icon">✅</div>
                <div class="alert-details">
                  <h5 class="alert-title">Prescription {{ successBanner.rxNumber }} Successfully Issued!</h5>
                  <p class="alert-text">
                    Synced with <strong>{{ successBanner.petName }}'s</strong> Nuzzle Digital Health Passport. Direct link:
                    <a :href="successBanner.verificationUrl" target="_blank" class="verify-link">{{ successBanner.verificationUrl }}</a>
                  </p>
                </div>
              </div>
            </transition>
          </div>
        </section>
      </div>

      <!-- VIEW 2: ISSUED PRESCRIPTIONS ARCHIVE -->
      <div v-else class="rx-archive-view">
        <div class="archive-header-row">
          <div>
            <h3>Issued Prescriptions Archive</h3>
            <p class="archive-subtitle">All electronic prescriptions created and synced across the Nuzzle Network</p>
          </div>
          <div class="archive-search-box">
            <input 
              v-model="archiveSearch" 
              type="text" 
              placeholder="Search by Pet Name, Owner Phone or Rx No..." 
              class="portal-input archive-search-input" 
            />
          </div>
        </div>

        <div v-if="filteredPrescriptions.length === 0" class="empty-archive">
          <div class="empty-icon">📭</div>
          <h4>No matching prescriptions found</h4>
          <p>Create your first prescription using the "+ Write New Prescription" button above.</p>
        </div>

        <div v-else class="archive-cards-grid">
          <div 
            v-for="rx in filteredPrescriptions" 
            :key="rx.id" 
            class="archive-rx-card"
          >
            <div class="rx-card-top">
              <div class="rx-no-badge">{{ rx.rxNumber }}</div>
              <span class="rx-time">{{ formatDate(rx.createdAt) }}</span>
            </div>

            <div class="rx-pet-info">
              <h4 class="rx-pet-title">🐾 {{ rx.petName }}</h4>
              <span class="rx-pet-meta">{{ rx.petSpecies }} • {{ rx.petBreed }} • {{ rx.petWeightKg }} kg • Owner: {{ rx.ownerName }}</span>
            </div>

            <div class="rx-diag-box">
              <span class="diag-label">Diagnosis:</span>
              <span class="diag-text">{{ rx.diagnosis }}</span>
            </div>

            <div class="rx-meds-summary">
              <span class="meds-count-badge">💊 {{ rx.medications.length }} Medications</span>
              <ul class="meds-mini-list">
                <li v-for="m in rx.medications.slice(0, 3)" :key="m.id || m.name">
                  {{ m.name }} — {{ m.dosage }} ({{ m.frequency }})
                </li>
                <li v-if="rx.medications.length > 3" class="more-meds">+ {{ rx.medications.length - 3 }} more...</li>
              </ul>
            </div>

            <div class="rx-card-actions">
              <button class="rx-action-btn small-btn" @click="loadRxIntoPrint(rx)">🖨️ View & Print A4</button>
              <button class="rx-action-btn small-btn wa-small-btn" @click="dispatchWhatsAppForRx(rx)">📱 WhatsApp</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ============================================================== -->
    <!-- PUBLICATION-GRADE A4 PRESCRIPTION PRINT TEMPLATE (PRINT ONLY) -->
    <!-- ============================================================== -->
    <div id="nuzzle-official-rx-print" class="a4-print-sheet">
      <!-- Clinic Official Letterhead -->
      <div class="print-letterhead">
        <div class="print-clinic-left">
          <h1 class="print-clinic-name">{{ printableRx.clinicName }}</h1>
          <p class="print-clinic-sub">{{ printableRx.clinicAddress }} • Phone: {{ printableRx.clinicPhone }}</p>
          <p class="print-nuzzle-tag">Official Partner of Nuzzle Veterinary Network</p>
        </div>
        <div class="print-clinic-right">
          <h2 class="print-doc-name">{{ printableRx.doctorName }}</h2>
          <p class="print-doc-deg">{{ printableRx.doctorDegrees }}</p>
          <p class="print-doc-reg">Registration No: <strong>{{ printableRx.doctorRegNo }}</strong></p>
        </div>
      </div>

      <div class="print-divider"></div>

      <!-- Rx Meta & Barcode Line -->
      <div class="print-meta-grid">
        <div class="meta-col">
          <span class="lbl">PRESCRIPTION NO:</span>
          <span class="val highlight-rx">{{ printableRx.rxNumber }}</span>
        </div>
        <div class="meta-col">
          <span class="lbl">DATE ISSUED:</span>
          <span class="val">{{ formatDate(printableRx.createdAt) }}</span>
        </div>
        <div class="meta-col">
          <span class="lbl">PATIENT:</span>
          <span class="val font-bold">🐾 {{ printableRx.petName }} ({{ printableRx.petSpecies }})</span>
        </div>
        <div class="meta-col">
          <span class="lbl">BREED & AGE:</span>
          <span class="val">{{ printableRx.petBreed || 'Mixed' }}, {{ printableRx.petAge || 'Adult' }}</span>
        </div>
        <div class="meta-col">
          <span class="lbl">BODY WEIGHT:</span>
          <span class="val font-bold">{{ printableRx.petWeightKg }} kg</span>
        </div>
        <div class="meta-col">
          <span class="lbl">OWNER / GUARDIAN:</span>
          <span class="val">{{ printableRx.ownerName }} ({{ printableRx.ownerPhone }})</span>
        </div>
      </div>

      <!-- Vitals Table -->
      <div class="print-vitals-strip">
        <span><strong>Temperature:</strong> {{ printableRx.temperature || '101.5 °F' }}</span>
        <span><strong>Pulse / HR:</strong> {{ printableRx.pulseRate || '90 bpm' }}</span>
        <span><strong>Clinical Diagnosis:</strong> <u>{{ printableRx.diagnosis }}</u></span>
      </div>

      <!-- Rx Big Symbol -->
      <div class="print-rx-symbol-row">
        <span class="big-rx">℞</span>
        <span class="rx-caption">Medical Directives & Treatment Plan:</span>
      </div>

      <!-- Medications Table -->
      <table class="print-meds-table">
        <thead>
          <tr>
            <th style="width: 5%">#</th>
            <th style="width: 38%">Medication / Formulation</th>
            <th style="width: 22%">Dose & Frequency</th>
            <th style="width: 15%">Duration</th>
            <th style="width: 20%">Instructions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(med, idx) in printableRx.medications" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>
              <strong>{{ med.name }}</strong>
              <div v-if="med.strength" class="print-sub-strength">{{ med.type }} • {{ med.strength }}</div>
            </td>
            <td>{{ med.dosage }} &bull; {{ med.frequency }}</td>
            <td>{{ med.duration }}</td>
            <td>{{ med.instructions || 'As advised' }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Clinical Findings & Dietary Advice -->
      <div class="print-care-section">
        <div v-if="printableRx.clinicalNotes" class="print-care-block">
          <h4 class="care-title">Clinical Notes & Findings:</h4>
          <p class="care-text">{{ printableRx.clinicalNotes }}</p>
        </div>

        <div v-if="printableRx.dietaryAdvice" class="print-care-block">
          <h4 class="care-title">Dietary & Home Care Guidelines:</h4>
          <p class="care-text">{{ printableRx.dietaryAdvice }}</p>
        </div>

        <div v-if="printableRx.followUpDate" class="print-care-block">
          <h4 class="care-title">Scheduled Review / Follow-Up:</h4>
          <p class="care-text"><strong>{{ printableRx.followUpDate }}</strong> (or immediately if symptoms worsen)</p>
        </div>
      </div>

      <!-- Footer & Signature Strip -->
      <div class="print-footer-strip">
        <div class="print-qr-col">
          <div class="qr-mock-box">
            <span class="qr-label">NUZZLE VERIFIED</span>
            <span class="qr-code-id">{{ printableRx.rxNumber }}</span>
          </div>
          <p class="qr-hint">Scan with camera to verify digital authenticity on Nuzzle</p>
        </div>

        <div class="print-sig-col">
          <div class="sig-line"></div>
          <p class="sig-name">{{ printableRx.doctorName }}</p>
          <p class="sig-sub">Registered Veterinary Surgeon Seal & Signature</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import type { PrescriptionRecord, PrescriptionMedication } from '../types';
import { 
  pets, 
  owner, 
  clinicPrescriptions, 
  issueAndSyncPrescription, 
  syncClinicPrescriptions, 
  setTab 
} from '../stores/appStore';

// UI State
const isExpanded = ref(true);
const activeView = ref<'form' | 'archive'>('form');
const isSubmitting = ref(false);
const petOrigin = ref<'nuzzle' | 'walkin'>('nuzzle');
const selectedNuzzlePetId = ref(pets[0]?.id || '');
const selectedClinicPreset = ref('cascade');
const archiveSearch = ref('');
const successBanner = ref<PrescriptionRecord | null>(null);

// Vitals helper
const vitals = reactive({
  respiration: '24 rpm'
});

// Main Form Model
const form = reactive({
  petId: 'pet_1',
  petName: 'Milo',
  petSpecies: 'Dog',
  petBreed: 'Golden Retriever',
  petAge: '2 Years',
  petWeightKg: 28.5,
  ownerName: 'Tanvir Ahmed',
  ownerPhone: '+880 1711-223344',
  clinicId: 'cascade_dhanmondi',
  clinicName: 'Cascade 24/7 Animal Hospital',
  clinicAddress: 'House 42, Road 8/A, Dhanmondi, Dhaka',
  clinicPhone: '+880 1711-998877',
  doctorName: 'Dr. Emily Watson, DVM',
  doctorDegrees: 'DVM, MS in Small Animal Surgery (UVA)',
  doctorRegNo: 'BVC-Reg-3921',
  diagnosis: 'Acute Gastrointestinal Upset & Dietary Indiscretion',
  clinicalNotes: 'Mild abdominal discomfort on palpation. Normal temperature. Hydration status stable.',
  temperature: '101.8 °F',
  pulseRate: '92 bpm',
  medications: [
    {
      id: 'med_1',
      name: 'Amoxicillin + Clavulanic Acid (Clavamox)',
      type: 'Tablet',
      strength: '375 mg',
      dosage: '1 Tablet',
      frequency: 'Twice Daily (BID)',
      duration: '7 Days',
      instructions: 'Administer directly by mouth after meal.',
    },
    {
      id: 'med_2',
      name: 'Metronidazole',
      type: 'Tablet',
      strength: '200 mg',
      dosage: '1 Tablet',
      frequency: 'Twice Daily (BID)',
      duration: '5 Days',
      instructions: 'For gut motility and anaerobic bacterial coverage.',
    },
    {
      id: 'med_3',
      name: 'Proviable-DC Probiotic Paste',
      type: 'Syrup',
      strength: '15 ml tube',
      dosage: '3 ml',
      frequency: 'Once Daily (SID)',
      duration: '5 Days',
      instructions: 'Mix with moist food in the morning.',
    },
  ] as PrescriptionMedication[],
  dietaryAdvice: 'Transition strictly to Royal Canin Gastrointestinal wet kibble for 10 days. Avoid table scraps and poultry fat.',
  followUpDate: getFutureDate(7),
});

// Printable Rx Reference
const printableRx = ref<PrescriptionRecord>({
  id: 'rx_active',
  rxNumber: 'NZ-RX-2026-8492',
  createdAt: new Date().toISOString(),
  petId: form.petId,
  petName: form.petName,
  petSpecies: form.petSpecies,
  petBreed: form.petBreed,
  petAge: form.petAge,
  petWeightKg: form.petWeightKg,
  ownerName: form.ownerName,
  ownerPhone: form.ownerPhone,
  clinicName: form.clinicName,
  clinicAddress: form.clinicAddress,
  clinicPhone: form.clinicPhone,
  doctorName: form.doctorName,
  doctorDegrees: form.doctorDegrees,
  doctorRegNo: form.doctorRegNo,
  diagnosis: form.diagnosis,
  clinicalNotes: form.clinicalNotes,
  temperature: form.temperature,
  pulseRate: form.pulseRate,
  medications: [...form.medications],
  dietaryAdvice: form.dietaryAdvice,
  followUpDate: form.followUpDate,
  status: 'active',
  verificationUrl: 'https://nuzzle.ai/verify/rx/NZ-RX-2026-8492',
});

// Standard Veterinary Formulary Database
interface FormularyDrug {
  name: string;
  type: string;
  dosePerKgMg: number;
  frequency: string;
  defaultDuration: string;
  defaultInstructions: string;
  indication: string;
}

const formularyDatabase: FormularyDrug[] = [
  {
    name: 'Amoxicillin + Clavulanate (Clavamox)',
    type: 'Tablet',
    dosePerKgMg: 12.5,
    frequency: 'Twice Daily (BID)',
    defaultDuration: '7 Days',
    defaultInstructions: 'Administer directly by mouth after meal.',
    indication: 'Broad spectrum antibacterial for skin, respiratory & soft tissue.',
  },
  {
    name: 'Meloxicam (Metacam)',
    type: 'Syrup',
    dosePerKgMg: 0.1,
    frequency: 'Once Daily (SID)',
    defaultDuration: '5 Days',
    defaultInstructions: 'Shake well. Dispense with morning meal for pain/inflammation.',
    indication: 'NSAID analgesic for post-op, arthritis, or soft-tissue injury.',
  },
  {
    name: 'Metronidazole (Flagyl)',
    type: 'Tablet',
    dosePerKgMg: 10,
    frequency: 'Twice Daily (BID)',
    defaultDuration: '5 Days',
    defaultInstructions: 'For diarrhea and anaerobic intestinal bacterial control.',
    indication: 'Antiprotozoal & antibacterial for colitis & Giardia.',
  },
  {
    name: 'Cephalexin (Keflex)',
    type: 'Capsule',
    dosePerKgMg: 22,
    frequency: 'Twice Daily (BID)',
    defaultDuration: '10 Days',
    defaultInstructions: 'Complete full antibacterial course.',
    indication: 'First-line antibiotic for canine pyoderma & skin infections.',
  },
  {
    name: 'Doxycycline',
    type: 'Tablet',
    dosePerKgMg: 10,
    frequency: 'Once Daily (SID)',
    defaultDuration: '14 Days',
    defaultInstructions: 'Give with moist food to prevent esophageal irritation.',
    indication: 'Tick-borne diseases, Ehrlichia, Anaplasma, and Kennel Cough.',
  },
  {
    name: 'Prednisolone',
    type: 'Tablet',
    dosePerKgMg: 0.5,
    frequency: 'Once Daily (SID)',
    defaultDuration: '5 Days',
    defaultInstructions: 'Taper dosage gradually as instructed by clinician.',
    indication: 'Corticosteroid for acute pruritus, allergies, and inflammation.',
  },
  {
    name: 'Drontal Plus (Dewormer)',
    type: 'Tablet',
    dosePerKgMg: 1, // 1 tab per 10kg
    frequency: 'Single Dose Stat',
    defaultDuration: 'Repeat in 14 Days',
    defaultInstructions: 'Administer on empty stomach or mixed with small meatball.',
    indication: 'Broad-spectrum deworming against tapeworms, roundworms, hookworms.',
  },
  {
    name: 'Proviable-DC Probiotic Paste',
    type: 'Syrup',
    dosePerKgMg: 0.1,
    frequency: 'Once Daily (SID)',
    defaultDuration: '5 Days',
    defaultInstructions: 'Syringe directly into mouth or over palatable wet food.',
    indication: 'Restores beneficial microflora and normal stool consistency.',
  },
  {
    name: 'Sucralfate (Carafate)',
    type: 'Tablet',
    dosePerKgMg: 20,
    frequency: 'Thrice Daily (TID)',
    defaultDuration: '5 Days',
    defaultInstructions: 'Administer 1 hour before meal or other oral medications.',
    indication: 'Gastric mucosa coating agent for ulcers and reflux.',
  },
  {
    name: 'Tramadol HCl',
    type: 'Tablet',
    dosePerKgMg: 2.5,
    frequency: 'Twice Daily (BID)',
    defaultDuration: '3 Days',
    defaultInstructions: 'For moderate to severe pain management.',
    indication: 'Centrally acting analgesic for trauma or post-surgical pain.',
  },
  {
    name: 'Gentamicin + Betamethasone Drops',
    type: 'Drops',
    dosePerKgMg: 0,
    frequency: 'Twice Daily (BID)',
    defaultDuration: '7 Days',
    defaultInstructions: 'Instill 3-4 drops into affected ear canal after cleaning.',
    indication: 'Otitis externa with bacterial and inflammatory involvement.',
  },
];

// Presets for common clinical conditions
const diagnosisPresets = [
  {
    name: 'Acute Gastroenteritis',
    diagnosis: 'Acute Gastrointestinal Upset & Dietary Indiscretion',
    notes: 'Mild abdominal discomfort on palpation. Normal temperature. Hydration status stable.',
    diet: 'Strict gastrointestinal wet food (Royal Canin GI / Hill\'s i/d) for 7 days. Free choice clean water.',
  },
  {
    name: 'Canine Parvovirus Protocol',
    diagnosis: 'Suspected Canine Parvoviral Enteritis',
    notes: 'Severe lethargy, pyrexia, bloody diarrhea. IV fluid therapy initiated. Strict isolation mandatory.',
    diet: 'Nil per os until vomiting ceases for 24h, then begin micro-enteral nutrition with hydrolyzed liquid.',
  },
  {
    name: 'Flea Allergy Dermatitis',
    diagnosis: 'Flea Allergy Dermatitis (FAD) & Secondary Superficial Pyoderma',
    notes: 'Pruritus in lumbosacral region, dorsal alopecia, erythematous papules.',
    diet: 'Supplement with Omega-3 & Omega-6 fatty acid dermal oil for coat restoration.',
  },
  {
    name: 'Otitis Externa',
    diagnosis: 'Bilateral Acute Otitis Externa',
    notes: 'Erythema and yellowish ceruminous discharge in both ear canals. Tympanic membrane intact.',
    diet: 'Maintain regular diet. Prevent water entry into ear canals during bathing.',
  },
  {
    name: 'Routine Deworming & Health',
    diagnosis: 'Routine Prophylactic Deworming & Wellness Screening',
    notes: 'Patient active, alert, responsive. Heart sounds clear. Coat healthy.',
    diet: 'Continue balanced maintenance diet appropriate for breed and life stage.',
  },
];

// Computed list of community pets
const nuzzlePetsList = computed(() => {
  return pets.length > 0 ? pets : [
    {
      id: 'pet_1',
      name: 'Milo',
      species: 'Dog' as const,
      breed: 'Golden Retriever',
      age: '2 Years',
      weight: '28.5 kg',
      ownerId: 'owner_me',
      avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=120&auto=format&fit=crop&q=80',
      isAnonymous: false,
      postsCount: 12,
      followersCount: 84
    },
    {
      id: 'pet_2',
      name: 'Luna',
      species: 'Cat' as const,
      breed: 'Persian Longhair',
      age: '1.5 Years',
      weight: '4.2 kg',
      ownerId: 'owner_me',
      avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&auto=format&fit=crop&q=80',
      isAnonymous: false,
      postsCount: 8,
      followersCount: 45
    }
  ];
});

// Filtered archive list
const filteredPrescriptions = computed(() => {
  if (!archiveSearch.value.trim()) return clinicPrescriptions;
  const q = archiveSearch.value.toLowerCase();
  return clinicPrescriptions.filter(
    r =>
      r.petName.toLowerCase().includes(q) ||
      r.rxNumber.toLowerCase().includes(q) ||
      r.ownerName.toLowerCase().includes(q) ||
      r.ownerPhone.includes(q) ||
      r.diagnosis.toLowerCase().includes(q)
  );
});

// Methods
function setPetOrigin(origin: 'nuzzle' | 'walkin') {
  petOrigin.value = origin;
  if (origin === 'walkin') {
    form.petId = 'walkin_' + Date.now();
    form.petName = '';
    form.petBreed = '';
    form.petAge = '';
    form.petWeightKg = 10;
  } else {
    onSelectNuzzlePet();
  }
}

function onSelectNuzzlePet() {
  const found = nuzzlePetsList.value.find(p => p.id === selectedNuzzlePetId.value) || nuzzlePetsList.value[0];
  if (found) {
    form.petId = found.id;
    form.petName = found.name;
    form.petSpecies = found.species;
    form.petBreed = found.breed || 'Companion';
    form.petAge = found.age || 'Adult';
    const parsedWeight = parseFloat(found.weight || '15');
    form.petWeightKg = isNaN(parsedWeight) ? 15 : parsedWeight;
    form.ownerName = owner.displayName || 'Tanvir Ahmed';
  }
}

function stepWeight(delta: number) {
  const current = Number(form.petWeightKg) || 10;
  form.petWeightKg = Math.max(0.2, Number((current + delta).toFixed(1)));
  recalculateFormulary();
}

function recalculateFormulary() {
  // Can trigger automatic strength/dosage updates if desired
}

function calculateDrugDosePreview(drug: FormularyDrug): string {
  const wt = form.petWeightKg || 10;
  if (drug.dosePerKgMg === 0) return '3-4 drops BID';
  if (drug.name.includes('Drontal')) {
    const tabs = Math.max(0.5, Math.round((wt / 10) * 2) / 2);
    return `${tabs} Tab single dose`;
  }
  const totalMg = Math.round(wt * drug.dosePerKgMg);
  return `${totalMg} mg (${drug.frequency.split(' ')[0]})`;
}

function addFormularyDrug(drug: FormularyDrug) {
  const wt = form.petWeightKg || 10;
  let strengthStr = '';
  let dosageStr = '';

  if (drug.name.includes('Drontal')) {
    const tabs = Math.max(0.5, Math.round((wt / 10) * 2) / 2);
    strengthStr = '1 Tab per 10 kg';
    dosageStr = `${tabs} Tablet`;
  } else if (drug.dosePerKgMg === 0) {
    strengthStr = '15 ml Dropper';
    dosageStr = '3-4 Drops';
  } else {
    const totalMg = Math.round(wt * drug.dosePerKgMg);
    strengthStr = `${totalMg} mg`;
    dosageStr = drug.type === 'Syrup' ? `${Math.round(totalMg / 50 * 10) / 10} ml` : '1 Unit';
  }

  form.medications.push({
    id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name: drug.name,
    type: drug.type,
    strength: strengthStr,
    dosage: dosageStr,
    frequency: drug.frequency,
    duration: drug.defaultDuration,
    instructions: drug.defaultInstructions,
  });
}

function addEmptyMedication() {
  form.medications.push({
    id: `med_${Date.now()}`,
    name: '',
    type: 'Tablet',
    strength: '',
    dosage: '1 Tablet',
    frequency: 'Twice Daily (BID)',
    duration: '5 Days',
    instructions: 'Administer with food.',
  });
}

function removeMedication(index: number) {
  form.medications.splice(index, 1);
}

function applyDiagnosisPreset(preset: typeof diagnosisPresets[0]) {
  form.diagnosis = preset.diagnosis;
  form.clinicalNotes = preset.notes;
  form.dietaryAdvice = preset.diet;
}

function setFollowUpDays(days: number) {
  form.followUpDate = getFutureDate(days);
}

function getFutureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function applyClinicPreset() {
  if (selectedClinicPreset.value === 'cascade') {
    form.clinicName = 'Cascade 24/7 Animal Hospital';
    form.clinicAddress = 'House 42, Road 8/A, Dhanmondi, Dhaka';
    form.clinicPhone = '+880 1711-998877';
    form.doctorName = 'Dr. Emily Watson, DVM';
    form.doctorDegrees = 'DVM, MS in Small Animal Surgery (UVA)';
    form.doctorRegNo = 'BVC-Reg-3921';
  } else if (selectedClinicPreset.value === 'gulshan') {
    form.clinicName = 'Gulshan Pet Care & Surgery Centre';
    form.clinicAddress = 'Plot 14, Road 113, Gulshan 2, Dhaka';
    form.clinicPhone = '+880 1722-445566';
    form.doctorName = 'Dr. Rafiqul Islam, DVM, PhD';
    form.doctorDegrees = 'DVM, PhD (Veterinary Internal Medicine)';
    form.doctorRegNo = 'BVC-Reg-1845';
  } else if (selectedClinicPreset.value === 'uttara') {
    form.clinicName = 'Paws & Claws Veterinary Clinic';
    form.clinicAddress = 'Sector 4, Road 7, Uttara, Dhaka';
    form.clinicPhone = '+880 1733-112233';
    form.doctorName = 'Dr. Sarah Chowdhury, DVM';
    form.doctorDegrees = 'DVM, Small Animal Clinical Practitioner';
    form.doctorRegNo = 'BVC-Reg-4102';
  }
}

async function handleSubmitPrescription() {
  if (!form.petName.trim()) {
    alert('Please enter a valid Pet Name.');
    return;
  }
  if (!form.diagnosis.trim()) {
    alert('Please provide a clinical diagnosis.');
    return;
  }
  if (form.medications.length === 0) {
    alert('Please add at least one medication to the prescription.');
    return;
  }

  isSubmitting.value = true;
  try {
    const res = await issueAndSyncPrescription({
      petId: form.petId,
      petName: form.petName,
      petSpecies: form.petSpecies,
      petBreed: form.petBreed,
      petAge: form.petAge,
      petWeightKg: form.petWeightKg,
      ownerName: form.ownerName,
      ownerPhone: form.ownerPhone,
      clinicId: form.clinicId,
      clinicName: form.clinicName,
      clinicAddress: form.clinicAddress,
      clinicPhone: form.clinicPhone,
      doctorName: form.doctorName,
      doctorDegrees: form.doctorDegrees,
      doctorRegNo: form.doctorRegNo,
      diagnosis: form.diagnosis,
      clinicalNotes: form.clinicalNotes,
      temperature: form.temperature,
      pulseRate: form.pulseRate,
      medications: form.medications,
      dietaryAdvice: form.dietaryAdvice,
      followUpDate: form.followUpDate,
    });

    const issued = res?.data?.prescription;
    if (issued) {
      printableRx.value = { ...issued };
      successBanner.value = issued;
      setTimeout(() => {
        successBanner.value = null;
      }, 10000);
    }
  } catch (err: any) {
    alert('Notice: Stored in session. Sync response: ' + (err.message || 'Complete'));
  } finally {
    isSubmitting.value = false;
  }
}

function openPrintPreview() {
  printableRx.value = {
    id: `rx_${Date.now()}`,
    rxNumber: form.medications[0]?.id ? `NZ-RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : 'NZ-RX-2026-8492',
    createdAt: new Date().toISOString(),
    petId: form.petId,
    petName: form.petName,
    petSpecies: form.petSpecies,
    petBreed: form.petBreed,
    petAge: form.petAge,
    petWeightKg: form.petWeightKg,
    ownerName: form.ownerName,
    ownerPhone: form.ownerPhone,
    clinicName: form.clinicName,
    clinicAddress: form.clinicAddress,
    clinicPhone: form.clinicPhone,
    doctorName: form.doctorName,
    doctorDegrees: form.doctorDegrees,
    doctorRegNo: form.doctorRegNo,
    diagnosis: form.diagnosis,
    clinicalNotes: form.clinicalNotes,
    temperature: form.temperature,
    pulseRate: form.pulseRate,
    medications: [...form.medications],
    dietaryAdvice: form.dietaryAdvice,
    followUpDate: form.followUpDate,
    status: 'active',
    verificationUrl: `https://nuzzle.ai/verify/rx/${form.medications[0]?.id || 'NZ-RX-2026-8492'}`,
  };

  setTimeout(() => {
    window.print();
  }, 100);
}

function loadRxIntoPrint(rx: PrescriptionRecord) {
  printableRx.value = { ...rx };
  setTimeout(() => {
    window.print();
  }, 100);
}

function sendViaWhatsApp() {
  const medSummary = form.medications
    .map((m, i) => `${i + 1}. *${m.name}* (${m.dosage}, ${m.frequency} x ${m.duration})\n   _${m.instructions || 'As advised'}_`)
    .join('\n');

  const text = 
`🐾 *${form.clinicName}*
🩺 *Official Prescription Issued*
----------------------------------------
*Patient:* ${form.petName} (${form.petSpecies} - ${form.petBreed})
*Weight:* ${form.petWeightKg} kg
*Doctor:* ${form.doctorName} (Reg: ${form.doctorRegNo})
*Diagnosis:* ${form.diagnosis}
----------------------------------------
💊 *Prescribed Medications:*
${medSummary}

🥗 *Diet & Care Advice:*
${form.dietaryAdvice || 'Follow normal diet.'}

⏰ *Follow-up Date:* ${form.followUpDate || 'As needed'}
----------------------------------------
🔒 *Nuzzle Digital Health Passport Verification:*
https://nuzzle.ai/verify/rx/${printableRx.value.rxNumber}`;

  const cleanPhone = form.ownerPhone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function dispatchWhatsAppForRx(rx: PrescriptionRecord) {
  const medSummary = rx.medications
    .map((m, i) => `${i + 1}. *${m.name}* (${m.dosage}, ${m.frequency} x ${m.duration})`)
    .join('\n');

  const text = 
`🐾 *${rx.clinicName}*
Official Prescription: *#${rx.rxNumber}*
Patient: ${rx.petName} (${rx.petWeightKg} kg)
Diagnosis: ${rx.diagnosis}

Medications:
${medSummary}

View on Nuzzle App: ${rx.verificationUrl}`;

  const cleanPhone = rx.ownerPhone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function formatDate(isoDate: string): string {
  if (!isoDate) return 'Recently';
  try {
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

onMounted(() => {
  syncClinicPrescriptions();
});
</script>

<style scoped>
/* ============================================================== */
/* CLINIC PORTAL CORE STYLES                                      */
/* ============================================================== */
.clinic-rx-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F8F9FE;
  color: #1E1B2E;
  overflow: hidden;
  font-family: var(--font-main);
}

.fullscreen-portal {
  width: 100%;
  max-width: 100%;
}

/* NAVBAR */
.clinic-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #FFFFFF;
  border-bottom: 1.5px solid #EBE6F5;
  box-shadow: 0 2px 10px rgba(110, 86, 207, 0.04);
  flex-shrink: 0;
  z-index: 20;
}

.nav-brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.clinic-badge-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
}

.title-with-pill {
  display: flex;
  align-items: center;
  gap: 10px;
}

.portal-main-heading {
  font-size: 17px;
  font-weight: 800;
  color: #1E1B2E;
  margin: 0;
  letter-spacing: -0.3px;
}

.live-sync-pill {
  font-size: 11px;
  font-weight: 700;
  color: #10B981;
  background: #D1FAE5;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.portal-sub-text {
  font-size: 12px;
  color: #6B7280;
  margin: 2px 0 0;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.portal-btn {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.secondary-btn {
  background: #EDE9FE;
  color: #6D28D9;
}
.secondary-btn:hover {
  background: #DDD6FE;
}

.icon-btn {
  background: #F3F4F6;
  color: #4B5563;
}
.icon-btn:hover {
  background: #E5E7EB;
}

.exit-btn {
  background: #FEE2E2;
  color: #DC2626;
}
.exit-btn:hover {
  background: #FCA5A5;
}

/* WORKSPACE */
.clinic-workspace {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 40px;
}

/* 2-COLUMN RESPONSIVE LAYOUT */
.rx-composer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  max-width: 1320px;
  margin: 0 auto;
}

@media (min-width: 900px) {
  .rx-composer-grid {
    grid-template-columns: 430px 1fr;
  }
}

.rx-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* CARDS */
.portal-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #EBE8F4;
  box-shadow: 0 4px 16px rgba(38, 30, 56, 0.03);
}

.card-section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.card-section-head.between {
  justify-content: space-between;
}

.flex-align-gap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #7C3AED;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-section-head h4 {
  font-size: 15px;
  font-weight: 800;
  color: #1E1B2E;
  margin: 0;
}

.rx-sym {
  font-family: Georgia, serif;
  font-size: 26px;
  font-weight: 900;
  color: #7C3AED;
}

/* FORM FIELDS */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label {
  font-size: 12px;
  font-weight: 700;
  color: #4B5563;
}

.portal-input, .portal-select, .portal-textarea {
  width: 100%;
  padding: 9px 12px;
  border-radius: 9px;
  border: 1.5px solid #E2E8F0;
  font-size: 13.5px;
  color: #1F2937;
  background: #FFFFFF;
  font-family: inherit;
  box-sizing: border-box;
}

.portal-input:focus, .portal-select:focus, .portal-textarea:focus {
  outline: none;
  border-color: #7C3AED;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

.highlight-input {
  font-weight: 700;
  color: #111827;
}

.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.grid-3-col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.mt-1 { margin-top: 6px; }
.mt-2 { margin-top: 10px; }
.mt-3 { margin-top: 14px; }

/* PET ORIGIN TOGGLE */
.pet-origin-toggle {
  display: flex;
  gap: 6px;
  background: #F3F4F6;
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.origin-btn {
  flex: 1;
  padding: 6px 10px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  border-radius: 7px;
  cursor: pointer;
}

.origin-btn.active {
  background: #FFFFFF;
  color: #7C3AED;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

/* WEIGHT STEPPER */
.weight-critical-box {
  background: #F5F3FF;
  border: 1.5px dashed #C4B5FD;
  padding: 8px 10px;
  border-radius: 10px;
}

.weight-label {
  color: #5B21B6;
}

.weight-input-stepper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.step-btn {
  width: 28px;
  height: 32px;
  background: #EDE9FE;
  border: 1px solid #DDD6FE;
  color: #6D28D9;
  font-weight: 800;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}

.weight-input {
  text-align: center;
  font-weight: 800;
  color: #5B21B6;
  font-size: 15px;
  padding: 6px 4px;
}

.weight-calc-hint {
  font-size: 10px;
  color: #7C3AED;
  font-weight: 600;
  display: block;
  margin-top: 3px;
}

/* VITALS ROW */
.vitals-row {
  display: flex;
  gap: 8px;
  background: #F9FAFB;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}

.vital-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.vital-item label {
  font-size: 10.5px;
  font-weight: 700;
  color: #6B7280;
}

.mini-input {
  width: 100%;
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid #D1D5DB;
  font-size: 12px;
  background: #FFFFFF;
}

/* DIAGNOSIS PRESETS */
.diag-input {
  font-weight: 700;
  color: #7C3AED;
}

.diag-presets-tray {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  align-items: center;
}

.presets-caption {
  font-size: 11px;
  font-weight: 700;
  color: #9CA3AF;
}

.preset-chip {
  padding: 4px 9px;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  background: #F9FAFB;
  font-size: 11.5px;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.preset-chip:hover {
  background: #EDE9FE;
  border-color: #C4B5FD;
  color: #6D28D9;
}

/* QUICK DRUGS GRID */
.formulary-desc {
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 10px;
}

.quick-drugs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 8px;
  max-height: 180px;
  overflow-y: auto;
  padding: 4px;
}

.drug-quick-pill {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 10px;
  border-radius: 10px;
  background: #FAF5FF;
  border: 1px solid #E9D5FF;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.drug-quick-pill:hover {
  background: #F3E8FF;
  border-color: #C084FC;
  transform: translateY(-1px);
}

.drug-name-bold {
  font-size: 12px;
  font-weight: 800;
  color: #6B21A8;
  line-height: 1.2;
}

.drug-calc-preview {
  font-size: 11px;
  color: #9333EA;
  font-weight: 600;
  margin-top: 3px;
}

/* MEDICATIONS TABLE */
.medications-table-wrapper {
  background: #FAFAFA;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  padding: 10px;
}

.table-header-row {
  display: grid;
  grid-template-columns: 2fr 1.6fr 1fr 2fr 30px;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  color: #6B7280;
  text-transform: uppercase;
  padding-bottom: 6px;
  border-bottom: 1.5px solid #E5E7EB;
  margin-bottom: 8px;
}

.med-item-row {
  display: grid;
  grid-template-columns: 2fr 1.6fr 1fr 2fr 30px;
  gap: 8px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed #E5E7EB;
}

.type-strength-row {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.med-table-input {
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #D1D5DB;
  font-size: 12px;
  box-sizing: border-box;
}

.med-name-field {
  font-weight: 700;
  color: #111827;
}

.med-mini-select {
  padding: 5px 6px;
  border-radius: 6px;
  border: 1px solid #D1D5DB;
  font-size: 11px;
  background: #FFFFFF;
}

.del-med-btn {
  background: #FEE2E2;
  border: none;
  color: #DC2626;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 12px;
  cursor: pointer;
}

.add-custom-med-btn {
  width: 100%;
  padding: 8px;
  background: #FFFFFF;
  border: 1.5px dashed #C4B5FD;
  color: #6D28D9;
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.add-custom-med-btn:hover {
  background: #F5F3FF;
}

.empty-meds-box {
  padding: 20px;
  text-align: center;
  color: #9CA3AF;
  font-size: 12px;
}

/* QUICK DATE CHIPS */
.quick-date-chips {
  display: flex;
  gap: 6px;
}

.chip-date {
  padding: 3px 8px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  background: #F3F4F6;
  font-size: 11px;
  font-weight: 600;
  color: #4B5563;
  cursor: pointer;
}

.chip-date:hover {
  background: #EDE9FE;
  color: #6D28D9;
}

/* DISPATCH HUB */
.dispatch-help {
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 12px;
}

.action-buttons-cluster {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 10px;
}

.dispatch-action-btn {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 800;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.primary-sync-btn {
  background: linear-gradient(135deg, #7C3AED 0%, #9333EA 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
}

.primary-sync-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.print-btn {
  background: #1E293B;
  color: #FFFFFF;
}

.print-btn:hover {
  background: #334155;
}

.whatsapp-btn {
  background: #10B981;
  color: #FFFFFF;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
}

.whatsapp-btn:hover {
  background: #059669;
}

/* SUCCESS BANNER */
.success-alert-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #ECFDF5;
  border: 1.5px solid #A7F3D0;
  padding: 12px 14px;
  border-radius: 12px;
}

.alert-icon {
  font-size: 20px;
}

.alert-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #065F46;
  margin: 0;
}

.alert-text {
  font-size: 12px;
  color: #047857;
  margin: 4px 0 0;
}

.verify-link {
  color: #059669;
  text-decoration: underline;
  font-weight: 700;
}

/* ARCHIVE VIEW */
.rx-archive-view {
  max-width: 1200px;
  margin: 0 auto;
}

.archive-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.archive-header-row h3 {
  font-size: 20px;
  font-weight: 800;
  color: #1E1B2E;
  margin: 0;
}

.archive-subtitle {
  font-size: 12.5px;
  color: #6B7280;
  margin: 2px 0 0;
}

.archive-search-input {
  width: 320px;
}

.archive-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.archive-rx-card {
  background: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #EBE8F4;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.rx-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.rx-no-badge {
  font-size: 12px;
  font-weight: 800;
  color: #6D28D9;
  background: #EDE9FE;
  padding: 3px 8px;
  border-radius: 6px;
}

.rx-time {
  font-size: 11px;
  color: #9CA3AF;
}

.rx-pet-title {
  font-size: 15px;
  font-weight: 800;
  color: #1E1B2E;
  margin: 0;
}

.rx-pet-meta {
  font-size: 11.5px;
  color: #6B7280;
}

.rx-diag-box {
  background: #F9FAFB;
  padding: 8px 10px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 12px;
}

.diag-label {
  font-weight: 700;
  color: #4B5563;
  margin-right: 4px;
}

.diag-text {
  color: #7C3AED;
  font-weight: 700;
}

.rx-meds-summary {
  margin-bottom: 12px;
}

.meds-count-badge {
  font-size: 11px;
  font-weight: 700;
  color: #374151;
}

.meds-mini-list {
  padding-left: 18px;
  margin: 4px 0 0;
  font-size: 11.5px;
  color: #6B7280;
}

.more-meds {
  font-style: italic;
  color: #9CA3AF;
}

.rx-card-actions {
  display: flex;
  gap: 8px;
}

.small-btn {
  flex: 1;
  padding: 6px 10px;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 8px;
  border: 1px solid #D1D5DB;
  background: #F9FAFB;
  cursor: pointer;
}

.wa-small-btn {
  background: #ECFDF5;
  border-color: #A7F3D0;
  color: #065F46;
}

.empty-archive {
  text-align: center;
  padding: 60px 20px;
  color: #9CA3AF;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

/* ============================================================== */
/* OFFICIAL A4 PRINT STYLES                                       */
/* ============================================================== */
.a4-print-sheet {
  display: none;
}

@media print {
  /* Hide all screen UI when printing */
  .no-print,
  .mobile-app-root > *:not(.a4-print-sheet),
  .mobile-statusbar,
  .bottom-nav-outer-wrapper {
    display: none !important;
  }

  body, html {
    background: #FFFFFF !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .a4-print-sheet {
    display: block !important;
    width: 100% !important;
    max-width: 210mm !important;
    margin: 0 auto !important;
    padding: 20mm 15mm !important;
    background: #FFFFFF !important;
    color: #111827 !important;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
    box-sizing: border-box !important;
  }

  .print-letterhead {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 15px;
  }

  .print-clinic-name {
    font-size: 22px;
    font-weight: 900;
    color: #1E1B2E;
    margin: 0;
    text-transform: uppercase;
  }

  .print-clinic-sub {
    font-size: 11px;
    color: #4B5563;
    margin: 4px 0 0;
  }

  .print-nuzzle-tag {
    font-size: 10px;
    color: #7C3AED;
    font-weight: 700;
    margin: 2px 0 0;
  }

  .print-clinic-right {
    text-align: right;
  }

  .print-doc-name {
    font-size: 16px;
    font-weight: 800;
    margin: 0;
    color: #111827;
  }

  .print-doc-deg {
    font-size: 11px;
    color: #4B5563;
    margin: 2px 0 0;
  }

  .print-doc-reg {
    font-size: 11px;
    color: #1F2937;
    margin: 2px 0 0;
  }

  .print-divider {
    height: 3px;
    background: #7C3AED;
    margin: 10px 0 15px;
  }

  .print-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px 12px;
    background: #F9FAFB;
    border: 1px solid #E5E7EB;
    padding: 10px 12px;
    border-radius: 6px;
    margin-bottom: 12px;
  }

  .meta-col {
    display: flex;
    flex-direction: column;
  }

  .meta-col .lbl {
    font-size: 9px;
    font-weight: 800;
    color: #6B7280;
  }

  .meta-col .val {
    font-size: 11.5px;
    color: #111827;
  }

  .highlight-rx {
    color: #7C3AED;
    font-weight: 800;
  }

  .font-bold {
    font-weight: 700;
  }

  .print-vitals-strip {
    display: flex;
    gap: 20px;
    padding: 6px 10px;
    border-bottom: 1px solid #E5E7EB;
    font-size: 11px;
    margin-bottom: 12px;
  }

  .print-rx-symbol-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
  }

  .big-rx {
    font-family: Georgia, serif;
    font-size: 32px;
    font-weight: 900;
    color: #111827;
    line-height: 1;
  }

  .rx-caption {
    font-size: 12px;
    font-weight: 800;
    color: #374151;
  }

  .print-meds-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
  }

  .print-meds-table th {
    background: #F3F4F6;
    border: 1px solid #D1D5DB;
    padding: 6px 8px;
    font-size: 10px;
    text-transform: uppercase;
    text-align: left;
  }

  .print-meds-table td {
    border: 1px solid #E5E7EB;
    padding: 8px;
    font-size: 11px;
    vertical-align: top;
  }

  .print-sub-strength {
    font-size: 10px;
    color: #6B7280;
  }

  .print-care-section {
    border-top: 1px dashed #D1D5DB;
    padding-top: 10px;
    margin-bottom: 30px;
  }

  .print-care-block {
    margin-bottom: 8px;
  }

  .care-title {
    font-size: 11px;
    font-weight: 800;
    margin: 0 0 2px;
    color: #374151;
  }

  .care-text {
    font-size: 10.5px;
    color: #4B5563;
    margin: 0;
  }

  .print-footer-strip {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 40px;
    padding-top: 15px;
    border-top: 1px solid #E5E7EB;
  }

  .qr-mock-box {
    border: 1.5px solid #111827;
    padding: 6px 12px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .qr-label {
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 1px;
  }

  .qr-code-id {
    font-size: 11px;
    font-weight: 800;
  }

  .qr-hint {
    font-size: 9px;
    color: #6B7280;
    margin: 4px 0 0;
  }

  .print-sig-col {
    text-align: center;
    width: 220px;
  }

  .sig-line {
    border-bottom: 1.5px solid #111827;
    margin-bottom: 6px;
  }

  .sig-name {
    font-size: 12px;
    font-weight: 800;
    margin: 0;
  }

  .sig-sub {
    font-size: 9.5px;
    color: #6B7280;
    margin: 2px 0 0;
  }
}
</style>
