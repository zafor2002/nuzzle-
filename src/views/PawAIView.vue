<template>
  <div class="pawai-view">
    <TopBar title="✨ PawAI Pet Intelligence" />

    <div class="ai-scroll-body">
      <!-- Hero Banner -->
      <div class="ai-hero-card">
        <div class="ai-glow-bg"></div>
        <div class="hero-left">
          <div class="ai-chip">
            <Sparkles :size="12" class="sparkle-icon" />
            <span>Next-Gen Pet AI</span>
          </div>
          <h2 class="ai-hero-title">PawAI Intelligence Suite</h2>
          <p class="ai-hero-sub">AI Vision scanner, Suggest Vet Pro Matcher & 24/7 triage.</p>
        </div>
        <div class="hero-robot-badge">🐾⚡</div>
      </div>

      <!-- Feature Tabs -->
      <div class="ai-tabs-row">
        <button 
          v-for="tab in aiTabs" 
          :key="tab.id"
          class="ai-tab-pill"
          :class="{ active: activeAiTab === tab.id }"
          @click="activeAiTab = tab.id as any"
        >
          <span class="t-emoji">{{ tab.emoji }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- TAB 1: SUGGEST BEST-FIT VET (USER POV + PRO PRIORITY ENGINE) -->
      <div v-if="activeAiTab === 'suggest_vet'" class="tab-pane">
        <!-- 1. Pet Condition Intake Form (User POV) -->
        <div class="condition-intake-card card-item">
          <div class="intake-header">
            <div class="ai-pulse-pill">
              <Sparkles :size="13" class="spin-icon" />
              <span>AI Clinical Matcher</span>
            </div>
            <span class="pro-ranking-indicator">⭐ Pro Partner Vets Ranked #1</span>
          </div>

          <h3 class="intake-title">Find the Best-Fit Vet for Your Pet</h3>
          <p class="intake-sub">
            Tell PawAI about your pet's current condition or medical need. Our AI will analyze your pet's species, symptoms, and urgency to find qualified clinics, prioritizing <strong>Verified Pro Partner Clinics</strong> at the top.
          </p>

          <!-- Step A: Select Pet -->
          <div class="form-row pet-selection-row">
            <label class="row-label">1. Select Pet</label>
            <div class="pets-picker-strip">
              <div 
                v-for="p in pets" 
                :key="p.id"
                class="pet-chip-option"
                :class="{ active: selectedPetId === p.id }"
                @click="selectedPetId = p.id"
              >
                <img :src="p.avatarUrl" :alt="p.name" class="p-chip-avatar" />
                <div class="p-chip-info">
                  <span class="p-chip-name">{{ p.name }}</span>
                  <span class="p-chip-species">{{ p.species }} • {{ p.breed || 'Companion' }}</span>
                </div>
              </div>
              <div v-if="pets.length === 0" class="pet-chip-option active">
                <img :src="activeTargetPet.avatarUrl" alt="Companion" class="p-chip-avatar" />
                <div class="p-chip-info">
                  <span class="p-chip-name">{{ activeTargetPet.name }}</span>
                  <span class="p-chip-species">{{ activeTargetPet.species }} • {{ activeTargetPet.breed || 'Companion' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step B: Add Pet Condition & Symptoms -->
          <div class="form-row condition-input-row">
            <label class="row-label">2. Pet Condition & Symptoms</label>
            <div class="condition-input-wrapper">
              <input 
                v-model="customConditionText" 
                type="text" 
                placeholder="Describe condition e.g., Limping on front paw, severe ear scratching..." 
                class="condition-text-field"
              />
              <button 
                v-if="customConditionText" 
                class="clear-cond-btn" 
                @click="customConditionText = ''"
              >
                ✕
              </button>
            </div>

            <!-- Quick Preset Condition Chips -->
            <div class="presets-label-row">
              <span class="presets-hint">Or tap common conditions:</span>
            </div>
            <div class="condition-presets-track">
              <button 
                v-for="preset in conditionPresets" 
                :key="preset.label"
                type="button"
                class="preset-chip"
                :class="{ active: selectedConditionKey === preset.key }"
                @click="applyConditionPreset(preset)"
              >
                <span>{{ preset.emoji }}</span>
                <span>{{ preset.label }}</span>
              </button>
            </div>
          </div>

          <!-- Step C: Medical Urgency & Distance -->
          <div class="form-row grid-2-col">
            <div class="filter-col">
              <label class="row-label">3. Urgency Level</label>
              <div class="urgency-selector">
                <button 
                  type="button" 
                  class="urg-btn"
                  :class="{ active: !isEmergencyUrgent }"
                  @click="isEmergencyUrgent = false"
                >
                  🟢 Standard Care
                </button>
                <button 
                  type="button" 
                  class="urg-btn emergency"
                  :class="{ active: isEmergencyUrgent }"
                  @click="isEmergencyUrgent = true"
                >
                  🚨 24/7 Emergency
                </button>
              </div>
            </div>

            <div class="filter-col">
              <label class="row-label">4. Max Distance Radius</label>
              <select v-model="selectedMaxDistance" class="distance-dropdown">
                <option :value="5">Within 5 Miles</option>
                <option :value="10">Within 10 Miles</option>
                <option :value="25">Within 25 Miles</option>
                <option :value="999">Any Distance</option>
              </select>
            </div>
          </div>

          <!-- Step D: Big Analyze Action CTA -->
          <button 
            class="btn-solid run-ai-analysis-btn"
            :disabled="isAnalyzingCondition"
            @click="runClinicalAnalysis"
          >
            <Sparkles :size="16" />
            <span>{{ isAnalyzingCondition ? 'AI Analyzing Clinical Criteria...' : '🔍 Analyze Condition & Match Best-Fit Vets' }}</span>
          </button>
        </div>

        <!-- 2. Live AI Clinical Diagnostic & Cross-Referencing Visualizer -->
        <div v-if="isAnalyzingCondition" class="ai-analyzing-card card-item">
          <div class="analyzing-header">
            <div class="scanning-radar-pulse"></div>
            <h4 class="analyzing-title">PawAI Clinical Verification Engine Active</h4>
          </div>

          <div class="stepped-analysis-list">
            <div class="step-item" :class="{ done: analysisProgress >= 30, active: analysisProgress < 30 }">
              <span class="step-num">1</span>
              <span class="step-desc">Analyzing symptom pathology for {{ activeTargetPet.name }} ({{ activeTargetPet.species }})...</span>
            </div>

            <div class="step-item" :class="{ done: analysisProgress >= 70, active: analysisProgress >= 30 && analysisProgress < 70 }">
              <span class="step-num">2</span>
              <span class="step-desc">Cross-referencing {{ activeTargetPet.species }} clearance & medical credentials across all clinics...</span>
            </div>

            <div class="step-item" :class="{ done: analysisProgress >= 100, active: analysisProgress >= 70 }">
              <span class="step-num">3</span>
              <span class="step-desc">Strict criteria verified! Prioritizing Nuzzle Pro Partner Clinics to Rank #1...</span>
            </div>
          </div>

          <div class="progress-bar-track">
            <div class="progress-bar-fill" :style="{ width: `${analysisProgress}%` }"></div>
          </div>
        </div>

        <!-- 3. Matched Results Breakdown (Strict Clinical Fit + Pro Priority) -->
        <div v-else-if="hasRunAnalysis" class="analysis-results-wrapper">
          <!-- Summary Header -->
          <div class="results-summary-card">
            <div class="sum-badge-row">
              <span class="sum-status-badge">✅ Clinical Verification Complete</span>
              <span class="sum-count-pill">{{ totalStrictMatchesCount }} Clinics Qualified</span>
            </div>
            <p class="sum-condition-text">
              Target Pet: <strong>{{ activeTargetPet.name }} ({{ activeTargetPet.species }})</strong> • Condition: <em>"{{ activeConditionDisplayName }}"</em>
            </p>
            <div class="sum-priority-banner">
              ⭐ <strong>Pro Partner Ranking:</strong> Vets with Nuzzle Pro Partner Subscriptions are ranked at the top of your results.
            </div>
          </div>

          <!-- GROUP 1: Verified Pro Partner Clinics (TOP PRIORITY #1) -->
          <div v-if="proMatchedVets.length > 0" class="vets-group pro-group">
            <div class="group-header">
              <div class="group-title-row">
                <span class="group-crown">👑</span>
                <h4 class="group-title">Nuzzle Pro Partner Best-Fit Clinics (Priority #1)</h4>
              </div>
              <span class="group-tag gold">Top Match ({{ proMatchedVets.length }})</span>
            </div>

            <div class="vets-cards-list">
              <div 
                v-for="(vet, idx) in proMatchedVets" 
                :key="vet.id"
                class="suggested-vet-card pro-card-highlight"
              >
                <!-- Top Ribbon -->
                <div class="pro-partner-ribbon">
                  <span class="ribbon-star">🌟</span>
                  <span class="ribbon-text">NUZZLE PRO PRIORITY PARTNER • TOP MATCH #{{ idx + 1 }}</span>
                </div>

                <div class="vet-card-body">
                  <div class="vet-top-info-row">
                    <img :src="vet.avatarUrl" :alt="vet.name" class="vet-avatar-img gold-ring" />

                    <div class="vet-text-col">
                      <div class="vet-name-row">
                        <h4 class="vet-doctor-name">{{ vet.name }}</h4>
                        <span class="pro-shield-badge">✓ PRO PARTNER</span>
                      </div>

                      <span class="vet-clinic-name">{{ vet.clinicName }}</span>

                      <div class="vet-meta-chips">
                        <span class="meta-chip rating">★ {{ vet.rating }} ({{ vet.reviewsCount }})</span>
                        <span class="meta-chip distance">📍 {{ vet.distanceMiles || 1.2 }} mi away</span>
                        <span v-if="vet.emergencyCare" class="meta-chip emergency">🚨 24/7 ICU</span>
                      </div>
                    </div>
                  </div>

                  <!-- AI Diagnostic Match Rationale -->
                  <div class="ai-match-rationale pro-rationale">
                    <span class="ai-brain-icon">🧠</span>
                    <div class="ai-rationale-col">
                      <span class="ai-match-score">99% Clinical Criteria Match</span>
                      <p class="ai-rationale-text">
                        {{ getDetailedMatchRationale(vet, true) }}
                      </p>
                    </div>
                  </div>

                  <!-- Specialties Chips -->
                  <div class="vet-specialties-track">
                    <span 
                      v-for="spec in vet.specialties" 
                      :key="spec"
                      class="spec-chip"
                      :class="{ highlighted: isSpecialtyRelevant(spec) }"
                    >
                      {{ spec }}
                    </span>
                  </div>

                  <!-- Card Footer Actions -->
                  <div class="vet-card-footer">
                    <div class="next-slot-pill">
                      <span class="slot-dot"></span>
                      <span>Next Available: <strong>Tomorrow at 11:00 AM</strong></span>
                    </div>

                    <div class="vet-actions-btns">
                      <button class="btn-solid instant-book-btn pro-book" @click="handleBookSlot(vet)">
                        <Calendar :size="13" />
                        <span>Book Slot</span>
                      </button>
                      <button class="btn-outline clinic-chat-btn" @click="contactClinic(vet)">
                        <Send :size="13" />
                        <span>Chat Clinic</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- GROUP 2: Other Clinically Qualified Clinics (Standard Placement) -->
          <div v-if="standardMatchedVets.length > 0" class="vets-group standard-group">
            <div class="group-header">
              <div class="group-title-row">
                <span class="group-icon">🏥</span>
                <h4 class="group-title">Other Clinically Qualified Vets</h4>
              </div>
              <span class="group-tag">Standard Placement ({{ standardMatchedVets.length }})</span>
            </div>

            <div class="vets-cards-list">
              <div 
                v-for="vet in standardMatchedVets" 
                :key="vet.id"
                class="suggested-vet-card standard-card"
              >
                <div class="vet-card-body">
                  <div class="vet-top-info-row">
                    <img :src="vet.avatarUrl" :alt="vet.name" class="vet-avatar-img" />

                    <div class="vet-text-col">
                      <div class="vet-name-row">
                        <h4 class="vet-doctor-name">{{ vet.name }}</h4>
                        <span class="standard-verified-badge">✓ Verified</span>
                      </div>

                      <span class="vet-clinic-name">{{ vet.clinicName }}</span>

                      <div class="vet-meta-chips">
                        <span class="meta-chip rating">★ {{ vet.rating }} ({{ vet.reviewsCount }})</span>
                        <span class="meta-chip distance">📍 {{ vet.distanceMiles || 3.5 }} mi</span>
                      </div>
                    </div>
                  </div>

                  <!-- AI Rationale -->
                  <div class="ai-match-rationale standard-rationale">
                    <span class="ai-brain-icon">🩺</span>
                    <div class="ai-rationale-col">
                      <span class="ai-match-score">92% Clinical Fit</span>
                      <p class="ai-rationale-text">
                        {{ getDetailedMatchRationale(vet, false) }}
                      </p>
                    </div>
                  </div>

                  <div class="vet-specialties-track">
                    <span 
                      v-for="spec in vet.specialties" 
                      :key="spec"
                      class="spec-chip"
                      :class="{ highlighted: isSpecialtyRelevant(spec) }"
                    >
                      {{ spec }}
                    </span>
                  </div>

                  <div class="vet-card-footer">
                    <div class="next-slot-pill">
                      <span class="slot-dot"></span>
                      <span>Next Open: <strong>Tomorrow at 02:30 PM</strong></span>
                    </div>

                    <div class="vet-actions-btns">
                      <button class="btn-solid instant-book-btn" @click="handleBookSlot(vet)">
                        <Calendar :size="13" />
                        <span>Book Slot</span>
                      </button>
                      <button class="btn-outline clinic-chat-btn" @click="contactClinic(vet)">
                        <Send :size="13" />
                        <span>Chat Clinic</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty Fallback If Zero Matches -->
          <div v-if="totalStrictMatchesCount === 0" class="empty-vet-state">
            <span class="empty-emoji">🩺</span>
            <h4>No Clinics Matched Strict Clinical Criteria</h4>
            <p>None of the registered clinics handle this exact species or emergency level within your chosen distance.</p>
            <button class="btn-solid reset-btn" @click="resetIntakeFilters">
              Reset Filters & Try Again
            </button>
          </div>

          <!-- Section 4: Strict Clinical Safety Exclusions Accordion -->
          <div v-if="excludedVetsList.length > 0" class="excluded-clinics-card">
            <div class="ex-header" @click="isExcludedOpen = !isExcludedOpen">
              <div class="ex-title-left">
                <span class="shield-ex-icon">🛡️</span>
                <span class="ex-title">Strict Medical Safety Filter ({{ excludedVetsList.length }} Excluded)</span>
              </div>
              <span class="ex-toggle-indicator">{{ isExcludedOpen ? '▲ Hide' : '▼ View Safety Exclusions' }}</span>
            </div>

            <div v-if="isExcludedOpen" class="ex-body">
              <p class="ex-desc">
                PawAI strictly verified clinical criteria before ranking. The following clinics were safely filtered out:
              </p>
              <div class="ex-items-list">
                <div v-for="ex in excludedVetsList" :key="ex.vet.id" class="ex-item">
                  <span class="ex-name">🏥 {{ ex.vet.clinicName }}</span>
                  <span class="ex-reason">❌ {{ ex.reason }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pro Vet Practice Enrollment Banner -->
          <div class="pro-clinic-enroll-card" @click="enrollClinicModal">
            <div class="enroll-left">
              <span class="enroll-icon">🏥⭐</span>
              <div>
                <h4 class="enroll-title">Are you a Veterinary Clinic or Animal Hospital?</h4>
                <p class="enroll-sub">
                  Join the <strong>Nuzzle Pro Partner Network ($49/mo)</strong> for #1 Priority Placement on PawAI Suggest Vet & direct client triage logs.
                </p>
              </div>
            </div>
            <button class="enroll-btn">Join Pro Network →</button>
          </div>
        </div>
      </div>

      <!-- TAB 2: PET VISION & HEALTH SCANNER -->
      <div v-else-if="activeAiTab === 'scanner'" class="tab-pane">
        <div class="scanner-card card-item">
          <div class="scanner-viewport">
            <img 
              :src="scanImage" 
              alt="Scan pet" 
              class="scan-preview-img"
              :class="{ scanning: isAiScanning }"
            />

            <div v-if="isAiScanning" class="scan-laser-line"></div>
            
            <div v-if="isAiScanning" class="scanning-badge">
              <div class="spinner-dot"></div>
              <span>AI Analyzing Biometrics & Coat...</span>
            </div>

            <div v-else-if="!currentScanResult" class="scan-prompt-overlay">
              <Camera :size="28" class="cam-icon" />
              <span>Tap 'Analyze Pet' to run AI Vision</span>
            </div>
          </div>

          <div class="scanner-actions-bar">
            <button 
              class="btn-solid scan-btn"
              :disabled="isAiScanning"
              @click="() => runAiPetScan()"
            >
              <Sparkles :size="16" />
              <span>{{ isAiScanning ? 'Processing Neural Scan...' : 'Analyze Pet with AI Vision' }}</span>
            </button>
          </div>

          <!-- Scan Results -->
          <div v-if="currentScanResult" class="scan-results-box">
            <div class="res-header">
              <div class="res-badge">
                <CheckCircle2 :size="15" />
                <span>{{ currentScanResult.breedMatch }}</span>
              </div>
              <span class="conf-score">{{ currentScanResult.confidence }}% Confidence</span>
            </div>

            <div class="mood-box">
              <span class="mood-lbl">🧠 Detected Mood:</span>
              <span class="mood-val">{{ currentScanResult.detectedMood }}</span>
            </div>

            <div class="observations-list">
              <h5 class="obs-title">🔍 Clinical Biometric Observations:</h5>
              <ul>
                <li v-for="(obs, i) in currentScanResult.healthObservations" :key="i">
                  ✓ {{ obs }}
                </li>
              </ul>
            </div>

            <div class="nutrition-box">
              <span class="nut-lbl">🥑 AI Dietary Recommendation:</span>
              <p class="nut-text">{{ currentScanResult.nutritionAdvice }}</p>
            </div>

            <!-- Quick Shortcut to Suggest Vet -->
            <button class="btn-solid suggest-vet-quick-btn" @click="activeAiTab = 'suggest_vet'">
              <span>🏥 Suggest Nearest Pro Vet for this Condition →</span>
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 3: 24/7 SYMPTOM TRIAGE CHAT -->
      <div v-else-if="activeAiTab === 'triage'" class="tab-pane">
        <div class="triage-card card-item">
          <div class="triage-messages-container">
            <div 
              v-for="msg in aiTriageMessages" 
              :key="msg.id"
              class="triage-msg-row"
              :class="{ user: msg.sender === 'user', ai: msg.sender === 'ai' }"
            >
              <div v-if="msg.sender === 'ai'" class="ai-avatar-tiny">🩺</div>
              <div class="msg-bubble" :class="msg.severity || 'low'">
                <p class="msg-text">{{ msg.text }}</p>
                <span class="msg-time">{{ msg.timestamp }}</span>
              </div>
            </div>
          </div>

          <!-- Suggested Quick Prompts -->
          <div class="quick-prompts-track">
            <button 
              v-for="prompt in triagePrompts" 
              :key="prompt"
              class="prompt-pill"
              @click="handleTriagePrompt(prompt)"
            >
              {{ prompt }}
            </button>
          </div>

          <!-- Input Bar -->
          <div class="triage-input-bar">
            <input 
              v-model="triageInput" 
              placeholder="Ask symptoms e.g., 'Dog ate chocolate'..." 
              class="t-input"
              @keyup.enter="handleSendTriage"
            />
            <button class="btn-solid send-triage-btn" @click="handleSendTriage">
              <Send :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 4: PET EMOTION & VOICE TRANSLATOR -->
      <div v-else-if="activeAiTab === 'translator'" class="tab-pane">
        <div class="translator-card card-item">
          <div class="translator-pulse-circle" :class="{ listening: isListening }">
            <button class="mic-trigger-btn" @click="toggleAudioListen">
              <Mic :size="32" class="mic-icon" />
            </button>
          </div>

          <span class="translator-status">
            {{ isListening ? '🐾 Listening to Pet Vocalizations & Barks...' : 'Tap Mic to Translate Pet Audio' }}
          </span>

          <div v-if="translatedThought" class="translation-output-bubble">
            <span class="bubble-tag">PET THOUGHT TRANSLATION:</span>
            <p class="translation-text">"{{ translatedThought }}"</p>
          </div>
        </div>
      </div>

      <!-- TAB 5: PLAYDATE COMPATIBILITY -->
      <div v-else-if="activeAiTab === 'matcher'" class="tab-pane">
        <div class="matcher-card card-item">
          <h4 class="matcher-title">⚡ AI Playdate Compatibility Engine</h4>
          <p class="matcher-sub">Calculates behavioral harmony, energy sync, and size safety.</p>

          <div class="match-vs-row">
            <div class="pet-pick-box">
              <img :src="pets[0].avatarUrl" alt="Waffles" class="m-avatar" />
              <span class="m-name">{{ pets[0].name }}</span>
              <span class="m-stat">⚡ High Zoomies</span>
            </div>

            <div class="vs-badge">VS</div>

            <div class="pet-pick-box">
              <img src="https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=200&auto=format&fit=crop&q=80" alt="Oliver" class="m-avatar" />
              <span class="m-name">Oliver (Corgi)</span>
              <span class="m-stat">⚡ Playful Scout</span>
            </div>
          </div>

          <div class="match-gauge-box">
            <div class="gauge-ring">
              <span class="gauge-percent">96%</span>
              <span class="gauge-label">Match Score</span>
            </div>
            <div class="gauge-details">
              <div class="g-line">
                <span>⚡ Energy Level Sync:</span>
                <strong class="green">98% (High Synergy)</strong>
              </div>
              <div class="g-line">
                <span>🎾 Play Style:</span>
                <strong class="green">Chase & Fetch Buddies</strong>
              </div>
              <div class="g-line">
                <span>🛡️ Temperament Safety:</span>
                <strong class="green">Verified Gentle</strong>
              </div>
            </div>
          </div>

          <button class="btn-solid invite-playdate-btn" @click="invitePlaydate">
            <Calendar :size="16" />
            <span>Schedule Park Playdate 🌳</span>
          </button>
        </div>
      </div>

      <!-- TAB 6: AI MAGIC PORTRAIT STUDIO -->
      <div v-else-if="activeAiTab === 'portraits'" class="tab-pane">
        <div class="portrait-card card-item">
          <h4 class="port-title">🎨 Magic Pet AI Portrait Studio</h4>
          <p class="port-sub">Transform your pet into iconic digital art styles.</p>

          <div class="styles-grid">
            <div 
              v-for="st in aiStyles" 
              :key="st.name"
              class="style-tile"
              :class="{ active: selectedStyle === st.name }"
              @click="selectedStyle = st.name"
            >
              <img :src="st.preview" :alt="st.name" class="style-img" />
              <span class="style-label">{{ st.name }}</span>
            </div>
          </div>

          <button class="btn-solid generate-art-btn" @click="generateMagicArt">
            <Wand2 :size="16" />
            <span>Generate {{ selectedStyle }} Portrait ✨</span>
          </button>
        </div>
      </div>
    </div>

    <!-- BOOKING SUCCESS MODAL -->
    <div v-if="bookedVetAppointment" class="modal-backdrop" @click.self="bookedVetAppointment = null">
      <div class="booking-modal-box">
        <span class="b-paw">🩺🎉</span>
        <h3 class="b-title">Appointment Confirmed!</h3>
        <p class="b-sub">
          Booked with <strong>{{ bookedVetAppointment.name }}</strong> at <strong>{{ bookedVetAppointment.clinicName }}</strong>.
        </p>
        <div class="b-details-card">
          <div class="b-line">
            <span>Date & Time:</span>
            <strong>Tomorrow at 11:00 AM</strong>
          </div>
          <div class="b-line">
            <span>Pet:</span>
            <strong>{{ activeTargetPet.name }}</strong>
          </div>
          <div class="b-line">
            <span>Location:</span>
            <strong>{{ bookedVetAppointment.location }}</strong>
          </div>
        </div>
        <button class="btn-solid full-btn" @click="bookedVetAppointment = null">
          Done 🐾
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Sparkles, Camera, CheckCircle2, Send, Mic, Calendar, Wand2 } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { 
  owner,
  pets, 
  vets,
  aiTriageMessages, 
  sendAiTriageQuery, 
  isAiScanning, 
  currentScanResult, 
  runAiPetScan,
  openChatWith,
  bookVetSlot
} from '../stores/appStore';
import type { Vet } from '../types';

const activeAiTab = ref<'suggest_vet' | 'scanner' | 'triage' | 'translator' | 'matcher' | 'portraits'>('suggest_vet');

const aiTabs = [
  { id: 'suggest_vet', label: 'Suggest Vet', emoji: '🏥' },
  { id: 'scanner', label: 'PetScan AI', emoji: '🔬' },
  { id: 'triage', label: 'PawDoctor 24/7', emoji: '🩺' },
  { id: 'translator', label: 'Voice Translator', emoji: '🎙️' },
  { id: 'matcher', label: 'Playdate Matcher', emoji: '⚡' },
  { id: 'portraits', label: 'Magic Studio', emoji: '🎨' }
];

// SUGGEST VET INTAKE STATE
const selectedPetId = ref(pets[0]?.id || 'pet_1');
const customConditionText = ref('Limping on right front paw after park fetch');
const selectedConditionKey = ref<string>('limping');
const isEmergencyUrgent = ref(false);
const selectedMaxDistance = ref(25);

// Analysis Visualizer State
const isAnalyzingCondition = ref(false);
const analysisProgress = ref(0);
const hasRunAnalysis = ref(true);
const isExcludedOpen = ref(false);
const bookedVetAppointment = ref<Vet | null>(null);

const conditionPresets = [
  { key: 'limping', emoji: '🐾', label: 'Paw Limping / Joint Injury', query: 'Limping on front paw, joint pain', category: 'Orthopedics & Joint Care' },
  { key: 'poison', emoji: '🍫', label: 'Ate Chocolate / Toxin (Urgent)', query: 'Accidentally ingested dark chocolate', category: 'Emergency Surgery', isUrgent: true },
  { key: 'itching', emoji: '🌿', label: 'Skin Itching / Hot Spots', query: 'Severe itching, red belly & ear shaking', category: 'Dermatology & Allergies' },
  { key: 'dental', emoji: '🦷', label: 'Tartar / Bad Breath', query: 'Bad breath, tartar scaling needed', category: 'Dental Scaling' },
  { key: 'avian', emoji: '🦜', label: 'Feather Plucking / Beak', query: 'Feather plucking, lethargic avian', category: 'Avian Medicine' },
  { key: 'vaccine', emoji: '💉', label: 'Routine Core Vaccines', query: 'Annual wellness checkup and rabies vaccine', category: 'Vaccinations' }
];

const activeTargetPet = computed(() => {
  return pets.find(p => p.id === selectedPetId.value) || pets[0] || {
    id: 'pet_companion',
    ownerId: owner.id || 'owner_me',
    name: 'Pet Companion',
    species: 'Dog',
    breed: 'Companion',
    avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    postsCount: 0,
    followersCount: 0
  };
});

const activeConditionDisplayName = computed(() => {
  if (customConditionText.value.trim()) return customConditionText.value;
  const preset = conditionPresets.find(p => p.key === selectedConditionKey.value);
  return preset ? preset.label : 'Routine Wellness & Health Assessment';
});

function applyConditionPreset(preset: typeof conditionPresets[0]) {
  selectedConditionKey.value = preset.key;
  customConditionText.value = preset.query;
  if (preset.isUrgent) {
    isEmergencyUrgent.value = true;
  }
}

function runClinicalAnalysis() {
  isAnalyzingCondition.value = true;
  analysisProgress.value = 10;
  hasRunAnalysis.value = true;

  const interval = setInterval(() => {
    analysisProgress.value += 30;
    if (analysisProgress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        isAnalyzingCondition.value = false;
      }, 350);
    }
  }, 350);
}

// STRICT CLINICAL FILTERING ENGINE
interface EvaluatedVet {
  vet: Vet;
  matches: boolean;
  exclusionReason?: string;
}

const evaluatedVetsList = computed<EvaluatedVet[]>(() => {
  const currentPet = activeTargetPet.value;
  const petSpecies = currentPet?.species || 'Dog';
  const query = (customConditionText.value || '').toLowerCase();

  return vets.map(vet => {
    // 1. Strict Species Check
    if (vet.acceptedSpecies && !vet.acceptedSpecies.includes(petSpecies)) {
      return {
        vet,
        matches: false,
        exclusionReason: `Does not treat ${petSpecies}s (Treats: ${vet.acceptedSpecies.join(', ')})`
      };
    }

    // 2. Strict Emergency Mode Check
    if (isEmergencyUrgent.value && !vet.emergencyCare) {
      return {
        vet,
        matches: false,
        exclusionReason: 'Not equipped for 24/7 ICU & Immediate Trauma Surgery'
      };
    }

    // 3. Distance Check
    if (vet.distanceMiles && vet.distanceMiles > selectedMaxDistance.value) {
      return {
        vet,
        matches: false,
        exclusionReason: `Exceeds max distance (${vet.distanceMiles} mi > ${selectedMaxDistance.value} mi)`
      };
    }

    // 4. Clinical Condition Check
    if (query.includes('chocolate') || query.includes('poison') || query.includes('emergency') || query.includes('toxin')) {
      if (!vet.emergencyCare && !vet.specialties.some(s => s.toLowerCase().includes('emergency') || s.toLowerCase().includes('poison') || s.toLowerCase().includes('trauma'))) {
        return {
          vet,
          matches: false,
          exclusionReason: 'Lacks specialized toxicology & emergency trauma unit'
        };
      }
    } else if (query.includes('avian') || query.includes('feather') || query.includes('beak') || query.includes('bird')) {
      if (!vet.specialties.some(s => s.toLowerCase().includes('avian') || s.toLowerCase().includes('exotic'))) {
        return {
          vet,
          matches: false,
          exclusionReason: 'Lacks certified Avian / Exotic board specialist'
        };
      }
    } else if (query.includes('limp') || query.includes('joint') || query.includes('bone') || query.includes('orthoped')) {
      if (!vet.specialties.some(s => s.toLowerCase().includes('orthoped') || s.toLowerCase().includes('joint') || s.toLowerCase().includes('surgery') || s.toLowerCase().includes('checkup'))) {
        return {
          vet,
          matches: false,
          exclusionReason: 'Lacks orthopedic diagnostic equipment'
        };
      }
    }

    return { vet, matches: true };
  });
});

// Eligible matched vets sorted by Pro Subscriber Priority first!
const strictlyMatchedVets = computed(() => {
  return evaluatedVetsList.value
    .filter(e => e.matches)
    .map(e => e.vet);
});

// Group 1: Pro Subscriber Vets (Priority #1)
const proMatchedVets = computed(() => {
  return strictlyMatchedVets.value
    .filter(v => v.isProSubscriber)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (a.distanceMiles || 0) - (b.distanceMiles || 0);
    });
});

// Group 2: Other Clinically Qualified Vets (Standard Placement)
const standardMatchedVets = computed(() => {
  return strictlyMatchedVets.value
    .filter(v => !v.isProSubscriber)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (a.distanceMiles || 0) - (b.distanceMiles || 0);
    });
});

const totalStrictMatchesCount = computed(() => {
  return proMatchedVets.value.length + standardMatchedVets.value.length;
});

// Group 3: Excluded Vets List
const excludedVetsList = computed(() => {
  return evaluatedVetsList.value
    .filter(e => !e.matches)
    .map(e => ({ vet: e.vet, reason: e.exclusionReason || 'Criteria mismatch' }));
});

function getDetailedMatchRationale(vet: Vet, isPro: boolean): string {
  const pet = activeTargetPet.value;
  const cond = activeConditionDisplayName.value;

  if (isPro && isEmergencyUrgent.value) {
    return `Strict Match: Board-certified trauma team with 24/7 ICU & surgical triage for ${pet.name}. Priority #1 Pro Partner.`;
  }
  if (isPro) {
    return `Strict Match for "${cond}": Top-rated expertise in ${vet.specialties[0]} for ${pet.species}s. Verified Nuzzle Pro Priority Partner.`;
  }
  return `Clinical Match for "${cond}": Qualified ${pet.species} diagnostics and medical care. Standard placement.`;
}

function isSpecialtyRelevant(spec: string): boolean {
  const query = customConditionText.value.toLowerCase();
  if (query.includes('limp') && (spec.includes('Orthoped') || spec.includes('Joint') || spec.includes('Surgery'))) return true;
  if (query.includes('itch') && (spec.includes('Dermatology') || spec.includes('Allergy'))) return true;
  if (query.includes('dental') && spec.includes('Dental')) return true;
  if (query.includes('avian') && spec.includes('Avian')) return true;
  if (query.includes('chocolate') && (spec.includes('Emergency') || spec.includes('Trauma') || spec.includes('Poison'))) return true;
  return false;
}

function handleBookSlot(vet: Vet) {
  const pet = activeTargetPet.value;
  bookVetSlot(vet.id, 'Tomorrow', '11:00 AM', pet.id, activeConditionDisplayName.value);
  bookedVetAppointment.value = vet;
}

function contactClinic(vet: Vet) {
  const pet = activeTargetPet.value;
  openChatWith(
    vet.name,
    vet.avatarUrl,
    undefined,
    `Hi ${vet.name}! PawAI matched your clinic for ${pet.name} (${pet.species}) regarding condition: "${activeConditionDisplayName.value}". Do you have slots available tomorrow?`
  );
}

function resetIntakeFilters() {
  customConditionText.value = 'Limping on right front paw after park fetch';
  selectedConditionKey.value = 'limping';
  selectedMaxDistance.value = 25;
  isEmergencyUrgent.value = false;
  runClinicalAnalysis();
}

function enrollClinicModal() {
  alert('🏥 Welcome to Nuzzle Pro Vet Network! Clinics receive #1 Priority Placement on PawAI Suggest Vet, zero booking fees, and direct client triage records.');
}

// Scanner
const scanImage = ref('https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80');

// Triage
const triageInput = ref('');
const triagePrompts = [
  '🐶 Dog ate dark chocolate',
  '🐱 Cat drinking excessive water',
  '🐾 Limping on right front paw',
  '🥑 Daily calorie plan for Golden'
];

function handleSendTriage() {
  if (!triageInput.value.trim()) return;
  sendAiTriageQuery(triageInput.value);
  triageInput.value = '';
}

function handleTriagePrompt(p: string) {
  sendAiTriageQuery(p);
}

// Translator
const isListening = ref(false);
const translatedThought = ref<string | null>("Hey human! That squirrel in the tree looked at me funny. Give me the tennis ball and I'll protect this living room with honor!");

function toggleAudioListen() {
  isListening.value = true;
  translatedThought.value = null;
  setTimeout(() => {
    isListening.value = false;
    const thoughts = [
      "I smelled peanut butter 30 minutes ago. Where is it hiding? I will find it.",
      "That delivery driver seemed nice, but I barked just to let them know I'm the boss here.",
      "The sunbeam moved across the floor so I had to relocate my nap. High effort day.",
      "I love you more than bacon! (Okay, equal to bacon). Let's go for a walk!"
    ];
    translatedThought.value = thoughts[Math.floor(Math.random() * thoughts.length)];
  }, 1800);
}

// Matcher
function invitePlaydate() {
  openChatWith(
    'Luna & Oliver',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&auto=format&fit=crop&q=80',
    'Oliver (Corgi)',
    'Hi! Our PawAI Playdate score was 96% Match! Would you like to do a weekend dog park meet?'
  );
}

// Portraits
const selectedStyle = ref('Pixar 3D Hero');
const aiStyles = [
  { name: 'Pixar 3D Hero', preview: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80' },
  { name: 'Cyberpunk Neon', preview: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80' },
  { name: 'Royal Renaissance', preview: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Anime Companion', preview: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80' }
];

function generateMagicArt() {
  alert(`✨ Generating ${selectedStyle.value} AI Portrait! Saved to your Pet Gallery.`);
}
</script>

<style scoped>
.pawai-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ai-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px 84px;
}

.ai-hero-card {
  position: relative;
  background: linear-gradient(135deg, #1E1B4B, #312E81 50%, #4C1D95);
  border-radius: var(--radius-xl);
  padding: 14px 16px;
  color: #fff;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 22px rgba(49, 46, 129, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.ai-glow-bg {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.45), transparent 70%);
  filter: blur(20px);
}

.hero-left {
  position: relative;
  z-index: 2;
  max-width: 80%;
}

.ai-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 700;
  color: #E9D5FF;
  margin-bottom: 4px;
}

.sparkle-icon {
  color: #FDE047;
}

.ai-hero-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.ai-hero-sub {
  font-size: 11px;
  color: #DDD6FE;
  line-height: 1.3;
  margin-top: 1px;
}

.hero-robot-badge {
  font-size: 28px;
}

/* Tabs */
.ai-tabs-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 10px;
}

.ai-tabs-row::-webkit-scrollbar {
  display: none;
}

.ai-tab-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-tab-pill.active {
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
}

.t-emoji {
  font-size: 12px;
}

/* 1. CONDITION INTAKE CARD */
.condition-intake-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 18px;
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.intake-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.ai-pulse-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 800;
  color: #7C3AED;
  background: #F3EEFF;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.pro-ranking-indicator {
  font-size: 9.5px;
  font-weight: 800;
  color: #92400E;
  background: #FEF3C7;
  border: 1px solid #FCD34D;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.intake-title {
  font-size: 15px;
  font-weight: 900;
  color: var(--ink-primary);
}

.intake-sub {
  font-size: 11.5px;
  color: var(--ink-secondary);
  line-height: 1.35;
  margin: 3px 0 12px;
}

.form-row {
  margin-bottom: 10px;
}

.row-label {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-primary);
  margin-bottom: 4px;
}

/* Pets Strip */
.pets-picker-strip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.pet-chip-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px 5px 6px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  cursor: pointer;
  transition: all 0.15s ease;
}

.pet-chip-option.active {
  background: #F3EEFF;
  border-color: #7C3AED;
}

.p-chip-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.p-chip-info {
  display: flex;
  flex-direction: column;
}

.p-chip-name {
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-primary);
  line-height: 1.1;
}

.p-chip-species {
  font-size: 8.5px;
  color: var(--ink-muted);
}

/* Condition Text Input */
.condition-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.condition-text-field {
  width: 100%;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  border-radius: 10px;
  padding: 8px 30px 8px 10px;
  font-size: 12px;
  color: var(--ink-primary);
  outline: none;
  transition: border-color 0.15s ease;
}

.condition-text-field:focus {
  border-color: #7C3AED;
  background: var(--bg-card);
}

.clear-cond-btn {
  position: absolute;
  right: 8px;
  font-size: 12px;
  color: var(--ink-muted);
  cursor: pointer;
}

.presets-label-row {
  margin: 6px 0 3px;
}

.presets-hint {
  font-size: 10px;
  font-weight: 700;
  color: var(--ink-muted);
}

.condition-presets-track {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
}

.condition-presets-track::-webkit-scrollbar {
  display: none;
}

.preset-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  font-size: 10px;
  font-weight: 700;
  color: var(--ink-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
}

.preset-chip:hover {
  border-color: #7C3AED;
}

.preset-chip.active {
  background: #F3EEFF;
  border-color: #7C3AED;
  color: #6D28D9;
}

.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.filter-col {
  display: flex;
  flex-direction: column;
}

.urgency-selector {
  display: flex;
  gap: 4px;
}

.urg-btn {
  flex: 1;
  padding: 6px 4px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: var(--bg-card-subtle);
  font-size: 10px;
  font-weight: 700;
  color: var(--ink-secondary);
  cursor: pointer;
}

.urg-btn.active {
  background: #ECFDF5;
  border-color: #10B981;
  color: #065F46;
}

.urg-btn.emergency.active {
  background: #FFF1F2;
  border-color: #F43F5E;
  color: #9F1239;
}

.distance-dropdown {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 11px;
  color: var(--ink-primary);
  outline: none;
}

.run-ai-analysis-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: var(--radius-full);
  font-size: 12.5px;
  font-weight: 800;
  margin-top: 4px;
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
}

/* 2. LIVE ANALYSIS VISUALIZER */
.ai-analyzing-card {
  background: linear-gradient(135deg, #1E1B4B 0%, #312E81 100%);
  border: 1.5px solid #818CF8;
  border-radius: 18px;
  padding: 16px;
  color: #fff;
  margin-bottom: 12px;
}

.analyzing-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.scanning-radar-pulse {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #34D399;
  box-shadow: 0 0 10px #34D399;
  animation: pulse 1s infinite alternate;
}

.analyzing-title {
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.stepped-analysis-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #A5B4FC;
  transition: all 0.2s ease;
}

.step-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: grid;
  place-items: center;
  font-size: 9.5px;
  font-weight: 800;
}

.step-item.active {
  color: #FDE047;
  font-weight: 700;
}

.step-item.done {
  color: #6EE7B7;
}

.step-item.done .step-num {
  background: #10B981;
  color: #fff;
}

.progress-bar-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981, #34D399);
  transition: width 0.3s ease;
}

/* 3. RESULTS BREAKDOWN */
.analysis-results-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.results-summary-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 10px 12px;
}

.sum-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.sum-status-badge {
  font-size: 11px;
  font-weight: 800;
  color: #059669;
}

.sum-count-pill {
  font-size: 9.5px;
  font-weight: 800;
  background: var(--bg-card-subtle);
  padding: 2px 6px;
  border-radius: var(--radius-full);
  color: var(--ink-secondary);
}

.sum-condition-text {
  font-size: 11px;
  color: var(--ink-secondary);
  line-height: 1.3;
}

.sum-priority-banner {
  font-size: 10px;
  color: #92400E;
  background: #FEF3C7;
  padding: 4px 8px;
  border-radius: 6px;
  margin-top: 6px;
}

:global([data-theme='dark']) .sum-priority-banner {
  background: rgba(45, 30, 10, 0.6);
  color: #FCD34D;
}

/* GROUPS */
.vets-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.group-crown {
  font-size: 14px;
}

.group-icon {
  font-size: 14px;
}

.group-title {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.group-tag {
  font-size: 9.5px;
  font-weight: 800;
  color: var(--ink-muted);
  background: var(--bg-card-subtle);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.group-tag.gold {
  background: #FEF3C7;
  color: #92400E;
  border: 1px solid #FCD34D;
}

/* CARDS */
.suggested-vet-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  margin-bottom: 8px;
}

.suggested-vet-card.pro-card-highlight {
  border: 1.5px solid #FCD34D;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.18);
}

.pro-partner-ribbon {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
  color: #fff;
  padding: 4px 10px;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.02em;
}

.vet-card-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vet-top-info-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.vet-avatar-img {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1.5px solid var(--border-subtle);
}

.vet-avatar-img.gold-ring {
  border-color: #F59E0B;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.3);
}

.vet-text-col {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.vet-name-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.vet-doctor-name {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.pro-shield-badge {
  font-size: 8.5px;
  font-weight: 900;
  color: #fff;
  background: #D97706;
  padding: 1px 5px;
  border-radius: 4px;
}

.standard-verified-badge {
  font-size: 8.5px;
  font-weight: 800;
  color: #059669;
  background: #ECFDF5;
  padding: 1px 5px;
  border-radius: 4px;
}

.vet-clinic-name {
  font-size: 11px;
  color: var(--ink-secondary);
  font-weight: 600;
}

.vet-meta-chips {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 3px;
}

.meta-chip {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: var(--radius-full);
}

.meta-chip.rating {
  background: #FEF3C7;
  color: #92400E;
}

.meta-chip.distance {
  background: var(--bg-card-subtle);
  color: var(--ink-muted);
}

.meta-chip.emergency {
  background: #FFE4E6;
  color: #E11D48;
}

/* AI Match Rationale */
.ai-match-rationale {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  border-radius: 8px;
  padding: 6px 8px;
}

.ai-match-rationale.pro-rationale {
  background: linear-gradient(135deg, #FAF5FF 0%, #F3EEFF 100%);
  border: 1px dashed #DDD6FE;
}

:global([data-theme='dark']) .ai-match-rationale.pro-rationale {
  background: rgba(88, 28, 135, 0.25);
  border-color: rgba(147, 51, 234, 0.4);
}

.ai-match-rationale.standard-rationale {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
}

.ai-brain-icon {
  font-size: 13px;
  flex-shrink: 0;
  margin-top: 1px;
}

.ai-rationale-col {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.ai-match-score {
  font-size: 10px;
  font-weight: 800;
  color: #7C3AED;
}

.ai-rationale-text {
  font-size: 10.5px;
  color: var(--ink-secondary);
  line-height: 1.3;
}

.vet-specialties-track {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.spec-chip {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--ink-secondary);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.spec-chip.highlighted {
  background: #F3EEFF;
  border-color: #C084FC;
  color: #7C3AED;
  font-weight: 800;
}

.vet-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid var(--border-light);
}

.next-slot-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--ink-secondary);
}

.slot-dot {
  width: 6px;
  height: 6px;
  background: #059669;
  border-radius: 50%;
}

.vet-actions-btns {
  display: flex;
  gap: 5px;
}

.instant-book-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 9px;
  border-radius: var(--radius-full);
}

.instant-book-btn.pro-book {
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
}

.clinic-chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10.5px;
  padding: 5px 8px;
  border-radius: var(--radius-full);
}

/* 4. SAFETY EXCLUSIONS ACCORDION */
.excluded-clinics-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
}

.ex-header {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: var(--bg-card-subtle);
}

.ex-title-left {
  display: flex;
  align-items: center;
  gap: 5px;
}

.shield-ex-icon {
  font-size: 12px;
}

.ex-title {
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-secondary);
}

.ex-toggle-indicator {
  font-size: 10px;
  font-weight: 700;
  color: var(--brand-primary);
}

.ex-body {
  padding: 10px 12px;
  border-top: 1px solid var(--border-light);
}

.ex-desc {
  font-size: 10.5px;
  color: var(--ink-muted);
  margin-bottom: 6px;
}

.ex-items-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ex-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10.5px;
  padding: 3px 0;
  border-bottom: 1px dashed var(--border-light);
}

.ex-item:last-child {
  border-bottom: none;
}

.ex-name {
  font-weight: 700;
  color: var(--ink-secondary);
}

.ex-reason {
  color: #DC2626;
  font-size: 10px;
  font-weight: 600;
}

/* PRO CLINIC ENROLL */
.pro-clinic-enroll-card {
  margin-top: 6px;
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  border: 1.5px solid #FCD34D;
  border-radius: 14px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

:global([data-theme='dark']) .pro-clinic-enroll-card {
  background: rgba(45, 30, 10, 0.6);
  border-color: rgba(245, 158, 11, 0.4);
}

.enroll-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.enroll-icon {
  font-size: 24px;
}

.enroll-title {
  font-size: 12px;
  font-weight: 800;
  color: #92400E;
}

:global([data-theme='dark']) .enroll-title {
  color: #FCD34D;
}

.enroll-sub {
  font-size: 10px;
  color: #B45309;
  line-height: 1.25;
}

:global([data-theme='dark']) .enroll-sub {
  color: #FDE68A;
}

.enroll-btn {
  font-size: 10.5px;
  font-weight: 800;
  color: #92400E;
  background: #fff;
  padding: 5px 9px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

:global([data-theme='dark']) .enroll-btn {
  background: #78350F;
  color: #FDE68A;
}

/* Empty Vet State */
.empty-vet-state {
  text-align: center;
  padding: 24px 16px;
  background: var(--bg-card);
  border-radius: 14px;
  border: 1px solid var(--border-light);
}

.empty-emoji {
  font-size: 32px;
}

.empty-vet-state h4 {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
  margin-top: 4px;
}

.empty-vet-state p {
  font-size: 11px;
  color: var(--ink-muted);
  margin: 4px 0 10px;
}

.reset-btn {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
}

/* SCANNER STYLES */
.scanner-card {
  padding: 12px;
}

.scanner-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  overflow: hidden;
  background: var(--bg-card-subtle);
}

.scan-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.scan-preview-img.scanning {
  filter: brightness(0.8) contrast(1.2);
}

.scan-laser-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #A855F7;
  box-shadow: 0 0 14px #A855F7, 0 0 24px #A855F7;
  animation: laserScan 1.6s ease-in-out infinite alternate;
}

@keyframes laserScan {
  0% { top: 0%; }
  100% { top: 96%; }
}

.scanning-badge {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(26, 18, 42, 0.85);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
}

.spinner-dot {
  width: 8px;
  height: 8px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.scan-prompt-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(2px);
}

.scanner-actions-bar {
  margin-top: 10px;
}

.scan-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px;
  border-radius: var(--radius-full);
  font-size: 12.5px;
  font-weight: 800;
}

.scan-results-box {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.res-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.res-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 800;
  color: #059669;
}

.conf-score {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-muted);
}

.mood-box, .nutrition-box, .funfact-box {
  font-size: 11.5px;
  line-height: 1.35;
  background: var(--bg-card-subtle);
  padding: 8px 10px;
  border-radius: 8px;
}

.observations-list ul {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  color: var(--ink-secondary);
}

.obs-title {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.suggest-vet-quick-btn {
  width: 100%;
  padding: 8px;
  font-size: 11.5px;
  font-weight: 800;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #059669 0%, #10B981 100%);
  margin-top: 4px;
}

/* TRIAGE STYLES */
.triage-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.triage-messages-container {
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
}

.triage-msg-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.triage-msg-row.user {
  justify-content: flex-end;
}

.ai-avatar-tiny {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #F3EEFF;
  display: grid;
  place-items: center;
  font-size: 13px;
  flex-shrink: 0;
}

.msg-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 14px;
  font-size: 12px;
  line-height: 1.35;
}

.triage-msg-row.user .msg-bubble {
  background: var(--brand-primary);
  color: #fff;
  border-bottom-right-radius: 2px;
}

.triage-msg-row.ai .msg-bubble {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-bottom-left-radius: 2px;
}

.msg-bubble.urgent {
  background: #FFF1F2;
  border-color: #FDA4AF;
  color: #9F1239;
}

.msg-time {
  display: block;
  font-size: 9px;
  opacity: 0.65;
  margin-top: 2px;
}

.quick-prompts-track {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
}

.prompt-pill {
  font-size: 10.5px;
  font-weight: 600;
  padding: 4px 8px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  white-space: nowrap;
  color: var(--ink-secondary);
  cursor: pointer;
}

.triage-input-bar {
  display: flex;
  gap: 6px;
}

.t-input {
  flex: 1;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 7px 12px;
  font-size: 12px;
  color: var(--ink-primary);
  outline: none;
}

.send-triage-btn {
  padding: 7px 12px;
  border-radius: var(--radius-full);
}

/* TRANSLATOR */
.translator-card {
  padding: 24px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.translator-pulse-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(148, 125, 238, 0.15);
  display: grid;
  place-items: center;
  margin-bottom: 12px;
}

.translator-pulse-circle.listening {
  animation: pulseMic 1.4s infinite;
}

@keyframes pulseMic {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(148, 125, 238, 0.5); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 16px rgba(148, 125, 238, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(148, 125, 238, 0); }
}

.mic-trigger-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
  cursor: pointer;
}

.translator-status {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-secondary);
}

.translation-output-bubble {
  margin-top: 14px;
  background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%);
  border: 1.5px dashed #C084FC;
  border-radius: 14px;
  padding: 12px;
  text-align: left;
}

.bubble-tag {
  font-size: 9.5px;
  font-weight: 900;
  color: #7C3AED;
}

.translation-text {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-primary);
  line-height: 1.35;
  margin-top: 2px;
}

/* MATCHER */
.matcher-card {
  padding: 14px;
}

.matcher-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
}

.matcher-sub {
  font-size: 11px;
  color: var(--ink-muted);
}

.match-vs-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 12px 0;
}

.pet-pick-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.m-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--brand-primary);
}

.m-name {
  font-size: 11.5px;
  font-weight: 800;
}

.m-stat {
  font-size: 9.5px;
  color: #7C3AED;
  font-weight: 700;
}

.vs-badge {
  font-size: 11px;
  font-weight: 900;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  padding: 4px 8px;
  border-radius: var(--radius-full);
}

.match-gauge-box {
  background: var(--bg-card-subtle);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.gauge-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid #059669;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.gauge-percent {
  font-size: 14px;
  font-weight: 900;
  color: #059669;
}

.gauge-label {
  font-size: 8px;
  color: var(--ink-muted);
}

.gauge-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
}

.invite-playdate-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: var(--radius-full);
  font-size: 12px;
}

/* PORTRAITS */
.portrait-card {
  padding: 14px;
}

.port-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
}

.port-sub {
  font-size: 11px;
  color: var(--ink-muted);
}

.styles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 10px 0;
}

.style-tile {
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border-light);
  cursor: pointer;
  position: relative;
}

.style-tile.active {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.35);
}

.style-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.style-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  text-align: center;
}

.generate-art-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: var(--radius-full);
  font-size: 12px;
}

/* MODAL */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}

.booking-modal-box {
  background: var(--bg-card);
  border-radius: 20px;
  width: 100%;
  max-width: 360px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.b-paw {
  font-size: 40px;
}

.b-title {
  font-size: 16px;
  font-weight: 900;
  color: var(--ink-primary);
  margin-top: 4px;
}

.b-sub {
  font-size: 12px;
  color: var(--ink-secondary);
  margin-top: 4px;
}

.b-details-card {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 10px 12px;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
}

.b-line {
  display: flex;
  justify-content: space-between;
}

.full-btn {
  width: 100%;
  padding: 8px;
  border-radius: var(--radius-full);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  from { opacity: 0.6; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1.15); }
}
</style>
