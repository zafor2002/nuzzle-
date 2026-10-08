<template>
  <div class="pawai-view">
    <TopBar title="✨ PawAI Pet Intelligence" />

    <div class="ai-scroll-body">
      <!-- Hero Banner -->
      <!-- Slim Modern Hero Header -->
      <div class="ai-hero-card">
        <div class="hero-left">
          <div class="ai-hero-title-row">
            <Sparkles :size="14" class="sparkle-icon" />
            <h2 class="ai-hero-title">PawAI Intelligence</h2>
          </div>
          <p class="ai-hero-sub">AI clinical triage & verified vet matching</p>
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
              <Sparkles :size="12" class="spin-icon" />
              <span>AI Clinical Matcher</span>
            </div>
          </div>

          <h3 class="intake-title">Find Best-Fit Vet</h3>

          <!-- Step A: Select Pet -->
          <div class="form-row pet-selection-row">
            <label class="row-label">Patient</label>
            <div class="pets-picker-strip">
              <button 
                v-for="p in pets" 
                :key="p.id"
                type="button"
                class="pet-chip-option"
                :class="{ active: selectedPetId === p.id }"
                @click="selectedPetId = p.id"
              >
                <img :src="p.avatarUrl" :alt="p.name" class="p-chip-avatar" />
                <span class="p-chip-name">{{ p.name }}</span>
                <span class="p-chip-species">({{ p.species }})</span>
              </button>
              <button v-if="pets.length === 0" type="button" class="pet-chip-option active">
                <img :src="activeTargetPet.avatarUrl" alt="Companion" class="p-chip-avatar" />
                <span class="p-chip-name">{{ activeTargetPet.name }}</span>
                <span class="p-chip-species">({{ activeTargetPet.species }})</span>
              </button>
            </div>
          </div>

          <!-- Step B: Add Pet Condition & Symptoms -->
          <div class="form-row condition-input-row">
            <label class="row-label">Symptoms & Condition</label>
            <div class="condition-input-wrapper">
              <input 
                v-model="customConditionText" 
                type="text" 
                placeholder="Describe symptoms (e.g., Limping on front paw)..." 
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
              <label class="row-label">Urgency</label>
              <div class="urgency-selector">
                <button 
                  type="button" 
                  class="urg-btn"
                  :class="{ active: !isEmergencyUrgent }"
                  @click="isEmergencyUrgent = false"
                >
                  🟢 Standard
                </button>
                <button 
                  type="button" 
                  class="urg-btn emergency"
                  :class="{ active: isEmergencyUrgent }"
                  @click="isEmergencyUrgent = true"
                >
                  🚨 Emergency
                </button>
              </div>
            </div>

            <div class="filter-col">
              <label class="row-label">Max Distance</label>
              <select v-model="selectedMaxDistance" class="distance-dropdown">
                <option :value="5">Within 5 miles</option>
                <option :value="10">Within 10 miles</option>
                <option :value="25">Within 25 miles</option>
                <option :value="999">Any distance</option>
              </select>
            </div>
          </div>

          <!-- Step D: Analyze Action CTA -->
          <button 
            class="btn-solid run-ai-analysis-btn"
            :disabled="isAnalyzingCondition"
            @click="runClinicalAnalysis"
          >
            <Sparkles :size="15" />
            <span>{{ isAnalyzingCondition ? 'Matching Clinics...' : 'Match Best-Fit Vets' }}</span>
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
              <div class="sum-status-lead">
                <span class="status-dot-emerald"></span>
                <span class="sum-status-title">Clinical Verification Complete</span>
              </div>
              <span class="sum-count-pill">{{ totalStrictMatchesCount }} {{ totalStrictMatchesCount === 1 ? 'Clinic' : 'Clinics' }} Qualified</span>
            </div>
            <p class="sum-condition-text">
              For <strong>{{ activeTargetPet.name }}</strong> ({{ activeTargetPet.species }}) · <em>{{ activeConditionDisplayName }}</em>
            </p>
          </div>

          <!-- GROUP 1: Verified Best-Fit Clinics -->
          <div v-if="proMatchedVets.length > 0" class="vets-group pro-group">
            <div class="group-header">
              <h4 class="group-title">Recommended Clinics</h4>
              <span class="group-tag gold">Verified Fit</span>
            </div>

            <div class="vets-cards-list">
              <div 
                v-for="vet in proMatchedVets" 
                :key="vet.id"
                class="suggested-vet-card pro-card-highlight"
              >
                <div class="vet-card-body">
                  <div class="vet-top-info-row">
                    <img :src="vet.avatarUrl" :alt="vet.name" class="vet-avatar-img" />

                    <div class="vet-text-col">
                      <div class="vet-name-row">
                        <h4 class="vet-doctor-name">{{ vet.name }}</h4>
                        <span class="pro-shield-badge">Pro Partner</span>
                      </div>

                      <span class="vet-clinic-name">{{ vet.clinicName }}</span>

                      <div class="vet-meta-chips">
                        <span class="meta-chip rating">★ {{ vet.rating }} ({{ vet.reviewsCount }})</span>
                        <span class="meta-chip distance">📍 {{ vet.distanceMiles || 1.2 }} mi</span>
                        <span v-if="vet.emergencyCare" class="meta-chip emergency">24/7 ICU</span>
                      </div>
                    </div>
                  </div>

                  <!-- AI Diagnostic Match Rationale -->
                  <div class="ai-match-rationale pro-rationale">
                    <div class="ai-rationale-col">
                      <div class="ai-rationale-header">
                        <span class="ai-match-score">99% Criteria Match</span>
                      </div>
                      <p class="ai-rationale-text">
                        {{ getDetailedMatchRationale(vet, true) }}
                      </p>
                    </div>
                  </div>

                  <!-- Specialties Chips (clean 3 max) -->
                  <div class="vet-specialties-track">
                    <span 
                      v-for="spec in vet.specialties.slice(0, 3)" 
                      :key="spec"
                      class="spec-chip"
                      :class="{ highlighted: isSpecialtyRelevant(spec) }"
                    >
                      {{ spec }}
                    </span>
                    <span v-if="vet.specialties.length > 3" class="spec-chip-more">
                      +{{ vet.specialties.length - 3 }} more
                    </span>
                  </div>

                  <!-- Card Footer Actions -->
                  <div class="vet-card-footer">
                    <div class="next-slot-pill">
                      <span class="slot-dot"></span>
                      <span>Tomorrow · <strong>11:00 AM</strong></span>
                    </div>

                    <div class="vet-actions-btns">
                      <button class="btn-solid instant-book-btn pro-book" @click="handleBookSlot(vet)">
                        <Calendar :size="13" />
                        <span>Book Slot</span>
                      </button>
                      <button class="btn-outline clinic-chat-btn" @click="contactClinic(vet)">
                        <Send :size="13" />
                        <span>Chat</span>
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
              <h4 class="group-title">Other Qualified Clinics</h4>
              <span class="group-tag">Standard Match ({{ standardMatchedVets.length }})</span>
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
                    <div class="ai-rationale-col">
                      <span class="ai-match-score">92% Clinical Fit</span>
                      <p class="ai-rationale-text">
                        {{ getDetailedMatchRationale(vet, false) }}
                      </p>
                    </div>
                  </div>

                  <div class="vet-specialties-track">
                    <span 
                      v-for="spec in vet.specialties.slice(0, 3)" 
                      :key="spec"
                      class="spec-chip"
                      :class="{ highlighted: isSpecialtyRelevant(spec) }"
                    >
                      {{ spec }}
                    </span>
                    <span v-if="vet.specialties.length > 3" class="spec-chip-more">
                      +{{ vet.specialties.length - 3 }} more
                    </span>
                  </div>

                  <div class="vet-card-footer">
                    <div class="next-slot-pill">
                      <span class="slot-dot"></span>
                      <span>Tomorrow · <strong>02:30 PM</strong></span>
                    </div>

                    <div class="vet-actions-btns">
                      <button class="btn-solid instant-book-btn" @click="handleBookSlot(vet)">
                        <Calendar :size="13" />
                        <span>Book Slot</span>
                      </button>
                      <button class="btn-outline clinic-chat-btn" @click="contactClinic(vet)">
                        <Send :size="13" />
                        <span>Chat</span>
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
                <span class="ex-title">Safety Filter · {{ excludedVetsList.length }} Excluded</span>
              </div>
              <span class="ex-toggle-indicator">{{ isExcludedOpen ? 'Hide ▲' : 'View ▼' }}</span>
            </div>

            <div v-if="isExcludedOpen" class="ex-body">
              <div class="ex-items-list">
                <div v-for="ex in excludedVetsList" :key="ex.vet.id" class="ex-item">
                  <span class="ex-name">🏥 {{ ex.vet.clinicName }}</span>
                  <span class="ex-reason">Filtered: {{ ex.reason }}</span>
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
          <!-- Hidden file input for device photo upload -->
          <input 
            type="file" 
            ref="scanFileInputRef" 
            accept="image/png, image/jpeg, image/jpg, image/webp" 
            class="hidden-file-input" 
            @change="handleScanFileSelected" 
          />
          <!-- Hidden file input for direct camera capture on mobile -->
          <input 
            type="file" 
            ref="cameraFileInputRef" 
            accept="image/*" 
            capture="environment" 
            class="hidden-file-input" 
            @change="handleScanFileSelected" 
          />

          <!-- Scanner Viewport with Click-to-Upload & Drag-Drop -->
          <div 
            class="scanner-viewport" 
            :style="viewportAspectRatioStyle"
            :class="{ dragging: isDraggingOverViewport }"
            @click="triggerScanFileInput"
            @dragover.prevent="isDraggingOverViewport = true"
            @dragleave.prevent="isDraggingOverViewport = false"
            @drop.prevent="handleScanFileDrop"
            title="Click or drop a photo to upload pet image"
          >
            <!-- Background blurred backdrop when 'contain' mode is active -->
            <div 
              v-if="scanFitMode === 'contain'" 
              class="scanner-blurred-bg" 
              :style="{ backgroundImage: `url(${scanImage})` }"
            ></div>

            <img 
              :src="scanImage" 
              alt="Scan pet" 
              class="scan-preview-img"
              :class="{ scanning: isAiScanning, 'fit-contain': scanFitMode === 'contain' }"
              :style="scanImageStyle"
            />

            <div v-if="isAiScanning" class="scan-laser-line"></div>
            
            <div v-if="isAiScanning" class="scanning-badge">
              <div class="spinner-dot"></div>
              <span>AI Analyzing Biometrics & Coat...</span>
            </div>

            <div v-else class="viewport-upload-overlay">
              <div class="upload-badge-pill">
                <Camera :size="15" />
                <span>{{ isCustomUploaded ? 'Change Photo' : 'Tap to Upload Pet Photo' }}</span>
              </div>
            </div>

            <!-- Uploading status overlay -->
            <div v-if="isUploadingPhoto" class="uploading-overlay">
              <div class="spinner-dot"></div>
              <span>Uploading & Optimizing Pet Photo...</span>
            </div>
          </div>

          <!-- Photo Size & Framing Adjuster Toolbar -->
          <div class="photo-adjust-toolbar">
            <div class="adjust-toolbar-header">
              <div class="adjust-title-chip">
                <Sliders :size="13" />
                <span>Photo Size & Framing</span>
              </div>
              <div class="adjust-quick-actions">
                <!-- Fit Mode Toggle -->
                <button 
                  type="button" 
                  class="adjust-action-btn"
                  :class="{ active: scanFitMode === 'contain' }"
                  @click.stop="toggleFitMode"
                  :title="scanFitMode === 'contain' ? 'Switch to Fill Crop' : 'Switch to Fit Whole Pet'"
                >
                  <Maximize2 :size="12" />
                  <span>{{ scanFitMode === 'contain' ? 'Fit Whole Pet' : 'Fill Crop' }}</span>
                </button>

                <!-- Aspect Ratio Switcher -->
                <div class="ratio-pill-group">
                  <button 
                    type="button" 
                    class="ratio-btn" 
                    :class="{ active: scanAspectRatio === '4/3' }" 
                    @click.stop="scanAspectRatio = '4/3'"
                  >4:3</button>
                  <button 
                    type="button" 
                    class="ratio-btn" 
                    :class="{ active: scanAspectRatio === '1/1' }" 
                    @click.stop="scanAspectRatio = '1/1'"
                  >1:1</button>
                  <button 
                    type="button" 
                    class="ratio-btn" 
                    :class="{ active: scanAspectRatio === '16/9' }" 
                    @click.stop="scanAspectRatio = '16/9'"
                  >16:9</button>
                </div>

                <!-- Reset -->
                <button 
                  type="button" 
                  class="adjust-reset-btn" 
                  @click.stop="resetPhotoAdjustments"
                  title="Reset zoom & framing"
                >
                  <RotateCcw :size="12" />
                </button>
              </div>
            </div>

            <!-- Zoom & Position Range Sliders -->
            <div class="adjust-controls-grid">
              <!-- Zoom / Size -->
              <div class="adjust-control-item">
                <div class="control-label-row">
                  <span class="control-label">
                    <ZoomIn :size="12" /> Zoom / Size
                  </span>
                  <span class="control-value">{{ scanZoom }}%</span>
                </div>
                <div class="slider-row">
                  <button type="button" class="zoom-step-btn" @click.stop="zoomOut" :disabled="scanZoom <= 50" title="Zoom out">
                    <ZoomOut :size="11" />
                  </button>
                  <input 
                    type="range" 
                    min="50" 
                    max="200" 
                    step="5" 
                    v-model.number="scanZoom" 
                    class="adjust-range-slider" 
                  />
                  <button type="button" class="zoom-step-btn" @click.stop="zoomIn" :disabled="scanZoom >= 200" title="Zoom in">
                    <ZoomIn :size="11" />
                  </button>
                </div>
              </div>

              <!-- Vertical Pan / Framing Position -->
              <div class="adjust-control-item">
                <div class="control-label-row">
                  <span class="control-label">
                    <Move :size="12" /> Vertical Framing
                  </span>
                  <span class="control-value">{{ scanPosition <= 35 ? 'Top Focus' : scanPosition >= 65 ? 'Bottom Focus' : 'Centered' }}</span>
                </div>
                <div class="slider-row">
                  <span class="range-hint">Top</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5" 
                    v-model.number="scanPosition" 
                    class="adjust-range-slider" 
                  />
                  <span class="range-hint">Bottom</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sample Pets Quick Switcher -->
          <div class="sample-pets-row">
            <span class="sample-label">Or test sample:</span>
            <div class="sample-buttons">
              <button 
                v-for="sample in sampleScanPets" 
                :key="sample.breed" 
                type="button"
                class="sample-pill-btn"
                :class="{ active: scanImage === sample.url }"
                @click.stop="selectSamplePet(sample)"
              >
                {{ sample.label }}
              </button>
            </div>
          </div>

          <!-- Scanner Action Controls -->
          <div class="scanner-actions-bar">
            <div class="upload-action-buttons">
              <button 
                type="button" 
                class="btn-outline upload-action-btn"
                :disabled="isAiScanning || isUploadingPhoto"
                @click.stop="triggerScanFileInput"
              >
                <Upload :size="15" />
                <span>Upload Photo</span>
              </button>

              <button 
                type="button" 
                class="btn-outline camera-action-btn"
                :disabled="isAiScanning || isUploadingPhoto"
                @click.stop="triggerCameraInput"
              >
                <Camera :size="15" />
                <span>Camera</span>
              </button>
            </div>

            <button 
              type="button"
              class="btn-solid scan-btn"
              :disabled="isAiScanning || isUploadingPhoto"
              @click.stop="handleRunScan"
            >
              <Sparkles :size="16" />
              <span>{{ isAiScanning ? 'Processing Neural Scan...' : 'Analyze Pet with AI Vision ✨' }}</span>
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

            <div v-if="currentScanResult.funFact" class="funfact-box">
              <span class="fact-lbl">💡 Clinical Breed Fact:</span>
              <p class="fact-text">{{ currentScanResult.funFact }}</p>
            </div>

            <div v-if="currentScanResult.provider" class="scan-provider-pill">
              <span>⚡ {{ currentScanResult.provider }}</span>
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
          <!-- Chat Session & Context Memory Header -->
          <div class="chat-memory-header">
            <div class="memory-status-badge" title="Conversation turns are retained in active AI context memory">
              <span class="memory-dot"></span>
              <span class="memory-title">🧠 Context Memory Active</span>
              <span class="memory-count">({{ aiTriageMessages.length }} saved)</span>
            </div>
            <button 
              type="button" 
              class="btn-clear-chat" 
              @click="handleClearChat"
              title="Clear conversation history and start fresh consultation"
            >
              <RotateCcw :size="12" />
              <span>New Consultation</span>
            </button>
          </div>

          <div ref="triageMessagesContainer" class="triage-messages-container">
            <div 
              v-for="msg in aiTriageMessages" 
              :key="msg.id"
              class="triage-msg-row"
              :class="{ user: msg.sender === 'user', ai: msg.sender === 'ai' }"
            >
              <div v-if="msg.sender === 'ai'" class="ai-avatar-tiny">🩺</div>
              <div class="msg-bubble" :class="msg.severity || 'low'">
                <div v-if="msg.urgencyLabel" class="msg-urgency-pill" :style="{ backgroundColor: msg.urgencyColor || '#10B981' }">
                  {{ msg.urgencyLabel }}
                </div>
                <!-- AI messages: render with markdown-to-HTML parser -->
                <div
                  v-if="msg.sender === 'ai'"
                  class="msg-text msg-text-html"
                  v-html="renderMsgText(msg.text)"
                ></div>
                <p v-else class="msg-text">{{ msg.text }}</p>
                <div v-if="msg.actions && msg.actions.length" class="msg-actions-box">
                  <div class="msg-actions-title">📋 Recommended Actions:</div>
                  <ul class="msg-actions-list">
                    <li v-for="(act, idx) in msg.actions" :key="idx">✓ {{ act }}</li>
                  </ul>
                </div>
                <div v-if="msg.redFlags && msg.redFlags.length" class="msg-redflags-box">
                  <div class="msg-redflags-title">🚨 Red Flags — Seek Vet Immediately If:</div>
                  <ul class="msg-redflags-list">
                    <li v-for="(flag, idx) in msg.redFlags" :key="idx">⚠️ {{ flag }}</li>
                  </ul>
                </div>
                <div v-if="msg.clinic" class="msg-clinic-box">
                  🏥 <strong>{{ msg.clinic.clinicName }}</strong> · Call: <a :href="'tel:' + msg.clinic.phone" class="clinic-phone-link">{{ msg.clinic.phone }}</a>
                </div>
                <div class="msg-meta-row">
                  <span v-if="msg.provider" class="msg-provider-tag">⚡ {{ msg.provider }}</span>
                  <span class="msg-time">{{ msg.timestamp }}</span>
                </div>
              </div>
            </div>

            <!-- Live Typing / Processing Bubble -->
            <div v-if="isAiTriageLoading" class="triage-msg-row ai">
              <div class="ai-avatar-tiny">🩺</div>
              <div class="msg-bubble low typing-bubble">
                <span class="typing-text">PawDoctor AI is analyzing symptoms...</span>
                <div class="typing-dots">
                  <span class="t-dot"></span>
                  <span class="t-dot"></span>
                  <span class="t-dot"></span>
                </div>
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
              <img :src="activeTargetPet?.avatarUrl || pets[0]?.avatarUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80'" :alt="activeTargetPet?.name || 'Waffles'" class="m-avatar" />
              <span class="m-name">{{ activeTargetPet?.name || 'Waffles' }}</span>
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
import { ref, computed, watch, nextTick } from 'vue';
import { 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  Send, 
  Mic, 
  Calendar, 
  Wand2, 
  Upload,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Move
} from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { apiClient } from '../services/apiClient';
import { 
  owner,
  pets, 
  vets,
  aiTriageMessages, 
  sendAiTriageQuery, 
  clearChatHistory,
  isAiTriageLoading,
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

  if (isPro && isEmergencyUrgent.value) {
    return `24/7 ICU & emergency trauma surgical team for ${pet.name}.`;
  }
  if (isPro) {
    return `Top-rated expertise in ${vet.specialties[0]} for ${pet.species}s.`;
  }
  return `Certified ${pet.species} care & clinical diagnostics.`;
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

// Scanner State & Upload Handlers
const scanImage = ref('https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80');
const scanFileInputRef = ref<HTMLInputElement | null>(null);
const cameraFileInputRef = ref<HTMLInputElement | null>(null);
const isDraggingOverViewport = ref(false);
const isUploadingPhoto = ref(false);
const isCustomUploaded = ref(false);

// Photo Size & Framing Adjustments for PetScan
const scanFitMode = ref<'cover' | 'contain'>('cover');
const scanZoom = ref(100); // 50% to 200%
const scanPosition = ref(65); // 0% (top) to 100% (bottom), default 65% for standard pet face centering
const scanAspectRatio = ref<'4/3' | '1/1' | '16/9'>('4/3');

const viewportAspectRatioStyle = computed(() => ({
  aspectRatio: scanAspectRatio.value.replace('/', ' / ')
}));

const scanImageStyle = computed(() => ({
  objectFit: scanFitMode.value,
  objectPosition: `center ${scanPosition.value}%`,
  transform: `scale(${scanZoom.value / 100})`,
  transformOrigin: `center ${scanPosition.value}%`
}));

function setZoom(val: number) {
  scanZoom.value = Math.min(200, Math.max(50, Math.round(val)));
}

function zoomIn() {
  setZoom(scanZoom.value + 15);
}

function zoomOut() {
  setZoom(scanZoom.value - 15);
}

function toggleFitMode() {
  scanFitMode.value = scanFitMode.value === 'cover' ? 'contain' : 'cover';
}

function resetPhotoAdjustments() {
  scanFitMode.value = 'cover';
  scanZoom.value = 100;
  scanPosition.value = 65;
  scanAspectRatio.value = '4/3';
}

// Client-side image resizing and optimization for ultra-fast, smooth photo upload
function resizeAndOptimizeImage(file: File, maxDim = 1400, quality = 0.88): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedDataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Compress an existing data URL down to a small size for AI API submission
function resizeDataUrlForAi(dataUrl: string, maxDim = 512, quality = 0.72): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

const sampleScanPets = [
  { label: '🐕 Golden', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80', breed: 'Golden Retriever', species: 'Dog' },
  { label: '🐱 Bengal', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80', breed: 'Bengal Cat', species: 'Cat' },
  { label: '🐶 Frenchie', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80', breed: 'French Bulldog', species: 'Dog' },
  { label: '🐰 Bunny', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80', breed: 'Holland Lop', species: 'Rabbit' },
];

function triggerScanFileInput() {
  scanFileInputRef.value?.click();
}

function triggerCameraInput() {
  cameraFileInputRef.value?.click();
}

function handleScanFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  processUploadedPetPhoto(file);
  target.value = '';
}

function handleScanFileDrop(event: DragEvent) {
  isDraggingOverViewport.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  processUploadedPetPhoto(file);
}

async function processUploadedPetPhoto(file: File) {
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (JPEG, PNG, WEBP).');
    return;
  }

  isUploadingPhoto.value = true;
  isCustomUploaded.value = true;

  try {
    // 1. High-quality preview image (1400px, 88%) for crisp display
    const previewDataUrl = await resizeAndOptimizeImage(file, 1400, 0.88);
    scanImage.value = previewDataUrl;

    // Reset zoom and center framing for user's newly uploaded photo
    scanZoom.value = 100;
    scanPosition.value = 50;

    // 2. Small compressed image for AI API (512px, 72% quality ~60-90KB) to avoid Vercel body size limits
    const aiDataUrl = await resizeDataUrlForAi(previewDataUrl, 512, 0.72);
    const pet = activeTargetPet.value;
    runAiPetScan(aiDataUrl, pet?.species, pet?.breed);

    // 3. Background cloud media upload (non-blocking)
    apiClient.uploadMedia(file).then(res => {
      if (res.success && res.data?.url) {
        console.log('[PetScan] Uploaded pet photo to cloud media:', res.data.url);
      }
    }).catch(err => {
      console.warn('[PetScan] Media upload notice:', err);
    });
  } catch (err) {
    console.error('[PetScan] Failed to resize/optimize photo:', err);
    // Fallback to direct read
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        scanImage.value = dataUrl;
        // Still compress for AI even in fallback path
        const aiDataUrl = await resizeDataUrlForAi(dataUrl, 512, 0.72).catch(() => dataUrl);
        const pet = activeTargetPet.value;
        runAiPetScan(aiDataUrl, pet?.species, pet?.breed);
      }
    };
    reader.readAsDataURL(file);
  } finally {
    isUploadingPhoto.value = false;
  }
}

function selectSamplePet(sample: typeof sampleScanPets[0]) {
  scanImage.value = sample.url;
  isCustomUploaded.value = false;
  scanPosition.value = sample.breed.includes('Golden') ? 65 : 50;
  scanZoom.value = 100;
  scanFitMode.value = 'cover';
  runAiPetScan(sample.url, sample.species, sample.breed);
}

function handleRunScan() {
  const pet = activeTargetPet.value;
  runAiPetScan(scanImage.value, pet?.species, pet?.breed);
}

// Triage
const triageMessagesContainer = ref<HTMLElement | null>(null);
const triageInput = ref('');
const triagePrompts = [
  '🐶 Dog ate dark chocolate',
  '🐱 Cat drinking excessive water',
  '🐾 Limping on right front paw',
  '🥑 Daily calorie plan for Golden'
];

function scrollToBottom() {
  nextTick(() => {
    if (triageMessagesContainer.value) {
      triageMessagesContainer.value.scrollTop = triageMessagesContainer.value.scrollHeight;
    }
  });
}

watch(() => aiTriageMessages.length, () => {
  scrollToBottom();
});

function handleSendTriage() {
  if (!triageInput.value.trim()) return;
  sendAiTriageQuery(triageInput.value);
  triageInput.value = '';
  scrollToBottom();
}

function handleTriagePrompt(p: string) {
  sendAiTriageQuery(p);
  scrollToBottom();
}

function handleClearChat() {
  if (confirm('Start a new consultation? This will clear current session history and reset context memory.')) {
    clearChatHistory();
  }
}

/**
 * Lightweight markdown-to-HTML converter for AI chat message rendering.
 * Converts ###/##/# headers, **bold**, `code`, bullet lists, numbered lists, and newlines.
 */
function renderMsgText(text: string): string {
  if (!text) return '';

  let html = text
    // Escape HTML special chars first (prevent XSS from AI output)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers: ### h3, ## h2, # h1
    .replace(/^### (.+)$/gm, '<p class="md-h3">$1</p>')
    .replace(/^## (.+)$/gm, '<p class="md-h2">$1</p>')
    .replace(/^# (.+)$/gm, '<p class="md-h1">$1</p>')
    // Bold **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Inline code `text`
    .replace(/`(.+?)`/g, '<code class="md-code">$1</code>')
    // Bullet lists: lines starting with - or * or •
    .replace(/^[-*•] (.+)$/gm, '<li class="md-li">$1</li>')
    // Numbered lists: 1. 2. etc.
    .replace(/^\d+\. (.+)$/gm, '<li class="md-li md-li-num">$1</li>')
    // Wrap consecutive <li> items in <ul>
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul class="md-ul">${match}</ul>`)
    // Line breaks to <br> (double newline = paragraph break)
    .replace(/\n\n/g, '</p><p class="md-p">')
    .replace(/\n/g, '<br>');

  // Wrap in a paragraph if not already wrapped
  if (!html.startsWith('<p') && !html.startsWith('<ul')) {
    html = `<p class="md-p">${html}</p>`;
  }

  return html;
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
  border-radius: 14px;
  padding: 9px 12px;
  color: #fff;
  overflow: hidden;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 14px rgba(49, 46, 129, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.hero-left {
  position: relative;
  z-index: 2;
  max-width: 85%;
}

.ai-hero-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sparkle-icon {
  color: #FDE047;
}

.ai-hero-title {
  font-family: var(--font-display);
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.ai-hero-sub {
  font-size: 10px;
  color: #DDD6FE;
  line-height: 1.25;
  margin-top: 1px;
}

.hero-robot-badge {
  font-size: 20px;
}

/* Tabs */
.ai-tabs-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 8px;
}

.ai-tabs-row::-webkit-scrollbar {
  display: none;
}

.ai-tab-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
  font-size: 11px;
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
  border-radius: 14px;
  padding: 10px 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.intake-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.ai-pulse-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9.5px;
  font-weight: 800;
  color: #7C3AED;
  background: #F3EEFF;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

:global([data-theme='dark']) .ai-pulse-pill {
  background: rgba(124, 58, 237, 0.2);
  color: #C4B5FD;
}

.intake-title {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--ink-primary);
  margin-bottom: 6px;
}

.form-row {
  margin-bottom: 6px;
}

.row-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: var(--ink-muted);
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

/* Pets Strip */
.pets-picker-strip {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}

.pets-picker-strip::-webkit-scrollbar {
  display: none;
}

.pet-chip-option {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px 3px 4px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.pet-chip-option.active {
  background: #F3EEFF;
  border-color: #7C3AED;
}

:global([data-theme='dark']) .pet-chip-option.active {
  background: rgba(124, 58, 237, 0.25);
  border-color: #A78BFA;
}

.p-chip-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
}

.p-chip-name {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.p-chip-species {
  font-size: 9px;
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
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 6px 26px 6px 9px;
  font-size: 11px;
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
  right: 7px;
  font-size: 10.5px;
  color: var(--ink-muted);
  cursor: pointer;
}

.condition-presets-track {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-top: 4px;
}

.condition-presets-track::-webkit-scrollbar {
  display: none;
}

.preset-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  font-size: 9.5px;
  font-weight: 600;
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

:global([data-theme='dark']) .preset-chip.active {
  background: rgba(124, 58, 237, 0.25);
  border-color: #A78BFA;
  color: #DDD6FE;
}

.grid-2-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.filter-col {
  display: flex;
  flex-direction: column;
}

.urgency-selector {
  display: flex;
  gap: 3px;
}

.urg-btn {
  flex: 1;
  padding: 4px 3px;
  border-radius: 6px;
  border: 1px solid var(--border-light);
  background: var(--bg-card-subtle);
  font-size: 9.5px;
  font-weight: 700;
  color: var(--ink-secondary);
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
}

.urg-btn.active {
  background: #ECFDF5;
  border-color: #10B981;
  color: #065F46;
}

:global([data-theme='dark']) .urg-btn.active {
  background: rgba(16, 185, 129, 0.2);
  color: #6EE7B7;
}

.urg-btn.emergency.active {
  background: #FFF1F2;
  border-color: #F43F5E;
  color: #9F1239;
}

:global([data-theme='dark']) .urg-btn.emergency.active {
  background: rgba(244, 63, 94, 0.2);
  color: #FDA4AF;
}

.distance-dropdown {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 10px;
  color: var(--ink-primary);
  outline: none;
  height: 25px;
}

.run-ai-analysis-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 800;
  margin-top: 2px;
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  box-shadow: 0 3px 10px rgba(124, 58, 237, 0.25);
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
  padding: 10px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.sum-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}

.sum-status-lead {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot-emerald {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

.sum-status-title {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.sum-count-pill {
  font-size: 10px;
  font-weight: 600;
  background: var(--bg-card-subtle);
  padding: 2px 7px;
  border-radius: var(--radius-full);
  color: var(--ink-secondary);
  border: 1px solid var(--border-light);
}

.sum-condition-text {
  font-size: 11.5px;
  color: var(--ink-secondary);
  line-height: 1.35;
}

/* GROUPS */
.vets-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
}

.group-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-primary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.group-tag {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--ink-muted);
  background: var(--bg-card-subtle);
  padding: 2px 7px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
}

.group-tag.gold {
  background: #fef3c7;
  color: #b45309;
  border-color: #fde68a;
}

/* CARDS */
.suggested-vet-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.suggested-vet-card.pro-card-highlight {
  border: 1px solid #fde68a;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.08);
}

.vet-card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vet-top-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vet-avatar-img {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border-subtle);
}

.vet-text-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.vet-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.vet-doctor-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pro-shield-badge {
  font-size: 9px;
  font-weight: 700;
  color: #b45309;
  background: #fef3c7;
  border: 1px solid #fde68a;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.standard-verified-badge {
  font-size: 9px;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.vet-clinic-name {
  font-size: 11px;
  color: var(--ink-secondary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

.vet-meta-chips {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 3px;
}

.meta-chip {
  font-size: 9.5px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.meta-chip.rating {
  background: #fef3c7;
  color: #92400e;
}

.meta-chip.distance {
  background: var(--bg-card-subtle);
  color: var(--ink-muted);
}

.meta-chip.emergency {
  background: #fee2e2;
  color: #dc2626;
  font-weight: 700;
}

/* AI Match Rationale */
.ai-match-rationale {
  border-radius: 8px;
  padding: 7px 9px;
}

.ai-match-rationale.pro-rationale {
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.12);
}

.ai-match-rationale.standard-rationale {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
}

.ai-rationale-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ai-match-score {
  font-size: 10.5px;
  font-weight: 700;
  color: #6366f1;
}

.ai-rationale-text {
  font-size: 11px;
  color: var(--ink-secondary);
  line-height: 1.35;
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
  padding: 2px 7px;
  border-radius: 6px;
}

.spec-chip.highlighted {
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.2);
  color: #4f46e5;
  font-weight: 700;
}

.spec-chip-more {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--ink-muted);
  padding: 2px 4px;
}

.vet-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
}

.next-slot-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  color: var(--ink-secondary);
}

.slot-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
}

.vet-actions-btns {
  display: flex;
  gap: 6px;
}

.instant-book-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 8px;
  background: #6366f1;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.instant-book-btn.pro-book {
  background: #d97706;
}

.instant-book-btn:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.clinic-chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.clinic-chat-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--ink-primary);
}

/* 4. SAFETY EXCLUSIONS ACCORDION */
.excluded-clinics-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 4px;
}

.ex-header {
  padding: 7px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 11px;
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
  font-weight: 600;
  color: var(--ink-muted);
}

.ex-toggle-indicator {
  font-size: 10px;
  color: var(--ink-muted);
  font-weight: 600;
}

.ex-body {
  padding: 8px 10px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-card-subtle);
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
}

.ex-name {
  font-weight: 600;
  color: var(--ink-primary);
}

.ex-reason {
  color: var(--ink-muted);
}

/* PRO CLINIC ENROLL */
.pro-clinic-enroll-card {
  margin-top: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.enroll-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.enroll-icon {
  font-size: 18px;
}

.enroll-title {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-primary);
}

.enroll-sub {
  font-size: 10px;
  color: var(--ink-muted);
  line-height: 1.25;
}

.enroll-btn {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ink-secondary);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
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

.hidden-file-input {
  display: none !important;
}

.scanner-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 380px;
  border-radius: 14px;
  overflow: hidden;
  background: #0f0c1e;
  cursor: pointer;
  border: 2px dashed rgba(168, 85, 247, 0.35);
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-viewport:hover {
  border-color: #A855F7;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.25);
}

.scanner-viewport.dragging {
  border-color: #A855F7;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.45);
  transform: scale(1.01);
}

.scanner-blurred-bg {
  position: absolute;
  inset: -20px;
  background-size: cover;
  background-position: center;
  filter: blur(22px) brightness(0.4);
  opacity: 0.85;
  transform: scale(1.1);
  pointer-events: none;
}

.scan-preview-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.15s ease-out, object-position 0.15s ease-out;
  user-select: none;
  pointer-events: none;
  z-index: 1;
}

.scan-preview-img.fit-contain {
  object-fit: contain;
}

/* Photo Adjustment Toolbar */
.photo-adjust-toolbar {
  margin-top: 10px;
  padding: 10px 12px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.adjust-toolbar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.adjust-title-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-secondary);
}

.adjust-quick-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.adjust-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: var(--radius-full);
  font-size: 10.5px;
  font-weight: 700;
  background: var(--bg-card);
  color: var(--ink-secondary);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.adjust-action-btn:hover,
.adjust-action-btn.active {
  background: rgba(168, 85, 247, 0.15);
  border-color: #A855F7;
  color: #A855F7;
}

.ratio-pill-group {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 2px;
}

.ratio-btn {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  color: var(--ink-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.ratio-btn.active {
  background: #A855F7;
  color: #fff;
}

.adjust-reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--ink-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.adjust-reset-btn:hover {
  color: #A855F7;
  border-color: #A855F7;
  transform: rotate(-45deg);
}

.adjust-controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 480px) {
  .adjust-controls-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

.adjust-control-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ink-muted);
}

.control-value {
  font-size: 10.5px;
  font-weight: 800;
  color: #A855F7;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.zoom-step-btn {
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
  cursor: pointer;
}

.zoom-step-btn:hover:not(:disabled) {
  border-color: #A855F7;
  color: #A855F7;
}

.zoom-step-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.range-hint {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--ink-muted);
}

.adjust-range-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 5px;
  border-radius: 3px;
  background: var(--border-light);
  outline: none;
  cursor: pointer;
}

.adjust-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #A855F7;
  box-shadow: 0 1px 4px rgba(168, 85, 247, 0.4);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.adjust-range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.viewport-upload-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 40%);
  pointer-events: none;
}

.upload-badge-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 12, 30, 0.82);
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
}

.scanner-viewport:hover .upload-badge-pill {
  transform: translateY(-2px);
  background: rgba(126, 34, 206, 0.85);
}

.uploading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(15, 12, 30, 0.85);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(6px);
  z-index: 10;
}

.sample-pets-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.sample-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-muted);
}

.sample-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sample-pill-btn {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  color: var(--ink-secondary);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sample-pill-btn:hover {
  border-color: #A855F7;
  color: #A855F7;
}

.sample-pill-btn.active {
  background: #A855F7;
  color: #ffffff;
  border-color: #A855F7;
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.3);
}

.scanner-actions-bar {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-action-buttons {
  display: flex;
  gap: 8px;
}

.upload-action-btn,
.camera-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 700;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  color: var(--ink-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-action-btn:hover,
.camera-action-btn:hover {
  background: var(--bg-card-subtle);
  border-color: #A855F7;
  color: #A855F7;
}

.scan-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 800;
  background: linear-gradient(135deg, #7E22CE, #9333EA);
  color: #fff;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(126, 34, 206, 0.35);
  transition: all 0.25s ease;
}

.scan-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(126, 34, 206, 0.45);
}

.scan-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.scan-provider-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  font-size: 10px;
  font-weight: 700;
  color: #7C3AED;
  background: rgba(124, 58, 237, 0.08);
  padding: 3px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(124, 58, 237, 0.2);
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

.chat-memory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--radius-md, 10px);
  font-size: 11px;
}

.memory-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4F46E5;
  font-weight: 600;
}

.memory-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
  animation: pulse-memory 2s infinite ease-in-out;
}

@keyframes pulse-memory {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.memory-title {
  font-weight: 700;
}

.memory-count {
  font-size: 10px;
  opacity: 0.75;
  font-weight: 500;
}

.btn-clear-chat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.25);
  color: var(--text-secondary, #475569);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear-chat:hover {
  background: #FEE2E2;
  border-color: #FCA5A5;
  color: #DC2626;
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

.msg-urgency-pill {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

.msg-actions-box {
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  border-left: 3px solid var(--brand-primary);
}

.msg-actions-title {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--ink-primary);
}

.msg-actions-list {
  margin: 0;
  padding-left: 14px;
  font-size: 11.5px;
  line-height: 1.4;
  color: var(--ink-secondary);
}

.msg-clinic-box {
  margin-top: 8px;
  padding: 6px 10px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  font-size: 11px;
}

/* Red Flags section */
.msg-redflags-box {
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(239, 68, 68, 0.07);
  border-radius: 6px;
  border-left: 3px solid #EF4444;
}

.msg-redflags-title {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #DC2626;
}

.msg-redflags-list {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11px;
  line-height: 1.5;
  color: #7F1D1D;
}

:global([data-theme='dark']) .msg-redflags-list {
  color: #FCA5A5;
}

:global([data-theme='dark']) .msg-redflags-title {
  color: #FCA5A5;
}

:global([data-theme='dark']) .msg-redflags-box {
  background: rgba(239, 68, 68, 0.12);
}

/* Markdown-rendered AI message text */
.msg-text-html {
  font-size: 12px;
  line-height: 1.45;
  color: var(--ink-primary);
}

.msg-text-html .md-h1,
.msg-text-html .md-h2,
.msg-text-html .md-h3 {
  font-weight: 700;
  margin: 6px 0 2px;
  color: var(--ink-primary);
}

.msg-text-html .md-h1 { font-size: 13.5px; }
.msg-text-html .md-h2 { font-size: 13px; }
.msg-text-html .md-h3 { font-size: 12.5px; color: var(--brand-primary); }

.msg-text-html .md-p {
  margin: 4px 0;
}

.msg-text-html .md-ul {
  margin: 4px 0 4px 6px;
  padding: 0;
  list-style: none;
}

.msg-text-html .md-li {
  padding: 1px 0;
  padding-left: 4px;
  line-height: 1.4;
}

.msg-text-html .md-li::before {
  content: '• ';
  color: var(--brand-primary);
  font-weight: 700;
}

.msg-text-html .md-li-num::before {
  content: '→ ';
  color: var(--brand-primary);
}

.msg-text-html .md-code {
  background: rgba(0, 0, 0, 0.08);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 11px;
}

:global([data-theme='dark']) .msg-text-html .md-code {
  background: rgba(255, 255, 255, 0.1);
}

.clinic-phone-link {
  color: #059669;
  font-weight: 700;
  text-decoration: underline;
}

.msg-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  font-size: 9px;
  opacity: 0.75;
}

.msg-provider-tag {
  font-size: 9px;
  font-weight: 600;
  color: var(--brand-primary);
}

.typing-bubble {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.typing-text {
  font-size: 11.5px;
  font-style: italic;
  opacity: 0.85;
}

.typing-dots {
  display: inline-flex;
  gap: 3px;
}

.t-dot {
  width: 5px;
  height: 5px;
  background: var(--brand-primary);
  border-radius: 50%;
  animation: typingBounce 1.2s infinite ease-in-out;
}

.t-dot:nth-child(2) { animation-delay: 0.2s; }
.t-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1.1); opacity: 1; }
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
