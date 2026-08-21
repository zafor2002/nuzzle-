<script setup lang="ts">
import { ref } from 'vue';
import { 
  Sparkles, Camera, CheckCircle2, Send, Mic, ShieldAlert, Wand2 
} from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { 
  aiTriageMessages, 
  sendAiTriageQuery, 
  isAiScanning, 
  currentScanResult, 
  runAiPetScan,
  openChatWith
} from '../stores/appStore';

const activeAiTab = ref<'scanner' | 'triage' | 'translator' | 'matcher' | 'portraits'>('triage');

const aiTabs = [
  { id: 'triage', label: 'PawDoctor 24/7', emoji: '🩺' },
  { id: 'scanner', label: 'PetScan AI', emoji: '🔬' },
  { id: 'translator', label: 'Voice Translator', emoji: '🎙️' },
  { id: 'matcher', label: 'Playdate Matcher', emoji: '⚡' },
  { id: 'portraits', label: 'Magic Studio', emoji: '🎨' }
];

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
          <p class="ai-hero-sub">AI Vision health scanner, 24/7 symptom triage & pet emotion translator.</p>
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

      <!-- TAB 1: PET VISION & HEALTH SCANNER -->
      <div v-if="activeAiTab === 'scanner'" class="tab-pane">
        <div class="scanner-card card-item">
          <div class="scanner-viewport">
            <img 
              :src="scanImage" 
              alt="Scan pet" 
              class="scan-preview-img"
              :class="{ scanning: isAiScanning }"
            />

            <!-- Scan Laser Animation Overlay -->
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
              @click="runAiPetScan()"
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
              <div class="m-item">
                <span class="m-lbl">Body Condition Score:</span>
                <span class="m-val">{{ (currentScanResult as any).bcs || 'BCS 5/9 (Ideal Body Weight)' }}</span>
              </div>
              <div class="m-item">
                <span class="m-lbl">Coat & Skin Health:</span>
                <span class="m-val">{{ (currentScanResult as any).coatHealth || (currentScanResult as any).healthObservations?.[0] || 'Shiny & Dense' }}</span>
              </div>
              <div class="m-item">
                <span class="m-lbl">Detected Mood:</span>
                <span class="m-val">{{ (currentScanResult as any).mood || (currentScanResult as any).detectedMood || 'Joyful' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: 24/7 VET TRIAGE CHAT -->
      <div v-else-if="activeAiTab === 'triage'" class="tab-pane">
        <div class="triage-container card-item">
          <div class="triage-header">
            <div class="triage-badge">
              <ShieldAlert :size="15" />
              <span>24/7 AI Veterinary Triage</span>
            </div>
            <p class="triage-disclaimer">
              Powered by licensed veterinary dataset. For severe crises, call your nearest emergency vet clinic immediately.
            </p>
          </div>

          <!-- Quick Symptom Prompts -->
          <div class="prompts-scroll">
            <button 
              v-for="prompt in triagePrompts" 
              :key="prompt"
              class="prompt-chip"
              @click="handleTriagePrompt(prompt)"
            >
              {{ prompt }}
            </button>
          </div>

          <!-- Chat Thread -->
          <div class="triage-chat-box">
            <div 
              v-for="(msg, idx) in aiTriageMessages" 
              :key="idx"
              class="chat-bubble-row"
              :class="msg.sender"
            >
              <div class="chat-bubble" :class="{ emergency: msg.severity === 'urgent' }">
                <div v-if="msg.severity" class="urgency-tag" :class="msg.severity">
                  🚨 Urgency: {{ msg.severity }}
                </div>
                <p class="bubble-text">{{ msg.text }}</p>
              </div>
            </div>
          </div>

          <!-- Input Bar -->
          <div class="triage-input-bar">
            <input 
              v-model="triageInput" 
              placeholder="Describe symptoms or ask health questions..." 
              class="triage-input"
              @keyup.enter="handleSendTriage"
            />
            <button class="send-triage-btn" @click="handleSendTriage">
              <Send :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 3: VOICE & EMOTION TRANSLATOR -->
      <div v-else-if="activeAiTab === 'translator'" class="tab-pane">
        <div class="translator-card card-item">
          <div class="mic-stage">
            <div class="waveform-container" :class="{ listening: isListening }">
              <div class="wave-bar"></div>
              <div class="wave-bar"></div>
              <div class="wave-bar"></div>
              <div class="wave-bar"></div>
              <div class="wave-bar"></div>
              <div class="wave-bar"></div>
            </div>

            <button 
              class="record-circle-btn"
              :class="{ recording: isListening }"
              @click="toggleAudioListen"
            >
              <Mic :size="28" />
            </button>

            <span class="mic-status-text">
              {{ isListening ? 'Listening for Bark / Meow...' : 'Tap Mic to Capture Pet Sound' }}
            </span>
          </div>

          <!-- Translation Output -->
          <div v-if="translatedThought" class="thought-bubble-result">
            <div class="thought-avatar">
              <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&auto=format&fit=crop&q=80" alt="Pet" />
            </div>
            <div class="thought-text-col">
              <span class="speaker-lbl">Waffles (Golden Retriever) says:</span>
              <p class="translated-dialogue">"{{ translatedThought }}"</p>
              <span class="emotion-detected">✨ Emotion: Excited & Loving (94% Accuracy)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: PLAYDATE HARMONY MATCHER -->
      <div v-else-if="activeAiTab === 'matcher'" class="tab-pane">
        <div class="matcher-card card-item">
          <h3 class="matcher-title">⚡ AI Playdate Harmony Engine</h3>
          <p class="matcher-sub">Neural matching checks behavioral compatibility before dogs meet in the park.</p>

          <div class="match-vs-row">
            <div class="pet-pick-box">
              <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80" class="m-avatar" alt="Waffles" />
              <span class="m-name">Waffles</span>
              <span class="m-stat">High Energy</span>
            </div>

            <div class="vs-badge">VS</div>

            <div class="pet-pick-box">
              <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80" class="m-avatar" alt="Oliver" />
              <span class="m-name">Oliver</span>
              <span class="m-stat">Friendly Fetcher</span>
            </div>
          </div>

          <div class="match-gauge-box">
            <div class="gauge-ring">
              <span class="gauge-percent">96%</span>
              <span class="gauge-label">Match</span>
            </div>
            <div class="gauge-details">
              <div class="g-line">
                <span>Playstyle Synergy:</span>
                <span class="green">High (Both Fetchers)</span>
              </div>
              <div class="g-line">
                <span>Social Temperament:</span>
                <span class="green">Extroverted</span>
              </div>
              <div class="g-line">
                <span>Energy Match:</span>
                <span class="green">98% Compatible</span>
              </div>
            </div>
          </div>

          <button class="btn-solid invite-playdate-btn" @click="invitePlaydate">
            Send 1-Tap Playdate Invitation
          </button>
        </div>
      </div>

      <!-- TAB 5: MAGIC PORTRAIT STUDIO -->
      <div v-else class="tab-pane">
        <div class="portrait-card card-item">
          <h3 class="port-title">🎨 Magic Pet Portrait Studio</h3>
          <p class="port-sub">Generative AI transforms pet photos into fine art avatars.</p>

          <div class="styles-grid">
            <div 
              v-for="s in aiStyles" 
              :key="s.name"
              class="style-tile"
              :class="{ active: selectedStyle === s.name }"
              @click="selectedStyle = s.name"
            >
              <img :src="s.preview" :alt="s.name" class="style-img" />
              <span class="style-label">{{ s.name }}</span>
            </div>
          </div>

          <button class="btn-solid generate-art-btn" @click="generateMagicArt">
            <Wand2 :size="16" />
            <span>Generate {{ selectedStyle }} Avatar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pawai-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ai-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 28px;
}

.ai-hero-card {
  position: relative;
  background: linear-gradient(135deg, #1E1B4B, #312E81 50%, #4C1D95);
  border-radius: var(--radius-xl);
  padding: 18px;
  color: #fff;
  overflow: hidden;
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 25px rgba(49, 46, 129, 0.35);
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
  padding: 3px 9px;
  border-radius: var(--radius-full);
  font-size: 10.5px;
  font-weight: 700;
  color: #E9D5FF;
  margin-bottom: 6px;
}

.sparkle-icon {
  color: #FDE047;
}

.ai-hero-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.ai-hero-sub {
  font-size: 11.5px;
  color: #DDD6FE;
  line-height: 1.35;
  margin-top: 2px;
}

.hero-robot-badge {
  font-size: 32px;
  position: relative;
  z-index: 2;
}

.ai-tabs-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 14px;
}

.ai-tabs-row::-webkit-scrollbar {
  display: none;
}

.ai-tab-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-tab-pill.active {
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  border-color: #6366F1;
  color: #fff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.scanner-card {
  padding: 14px;
}

.scanner-viewport {
  position: relative;
  width: 100%;
  height: 220px;
  background: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 12px;
}

.scan-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.scan-preview-img.scanning {
  filter: contrast(1.2) brightness(0.85);
}

.scan-laser-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #38BDF8, #818CF8, transparent);
  box-shadow: 0 0 14px #38BDF8, 0 0 24px #818CF8;
  animation: laserScan 1.6s ease-in-out infinite alternate;
  z-index: 10;
}

@keyframes laserScan {
  0% { top: 10%; }
  100% { top: 90%; }
}

.scanning-badge {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #38BDF8;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(6px);
  white-space: nowrap;
}

.spinner-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #38BDF8;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.scan-prompt-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}

.scanner-actions-bar {
  margin-bottom: 14px;
}

.scan-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  font-size: 14px;
}

.scan-results-box {
  background: var(--bg-card-subtle);
  border-radius: var(--radius-md);
  padding: 14px;
  border: 1px solid var(--border-light);
}

.res-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

.res-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-primary);
  font-weight: 800;
  font-size: 13.5px;
}

.conf-score {
  font-size: 11px;
  color: var(--accent-emerald);
  font-weight: 800;
  background: var(--accent-emerald-soft);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.mood-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.m-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.m-lbl {
  color: var(--ink-muted);
  font-weight: 600;
}

.m-val {
  color: var(--ink-primary);
  font-weight: 700;
}

/* Triage Styles */
.triage-container {
  padding: 16px;
}

.triage-header {
  margin-bottom: 12px;
}

.triage-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--accent-rose-soft);
  color: var(--accent-rose);
  font-size: 11.5px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  margin-bottom: 6px;
}

.triage-disclaimer {
  font-size: 11px;
  color: var(--ink-muted);
  line-height: 1.35;
}

.prompts-scroll {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 12px;
}

.prompt-chip {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
  font-size: 11px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  cursor: pointer;
}

.triage-chat-box {
  background: var(--bg-card-subtle);
  border-radius: var(--radius-md);
  padding: 12px;
  height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
  border: 1px solid var(--border-light);
}

.chat-bubble-row {
  display: flex;
}

.chat-bubble-row.user {
  justify-content: flex-end;
}

.chat-bubble-row.bot {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 85%;
  padding: 9px 12px;
  border-radius: 14px;
  font-size: 12.5px;
  line-height: 1.4;
}

.chat-bubble-row.user .chat-bubble {
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chat-bubble-row.bot .chat-bubble {
  background: var(--bg-card);
  color: var(--ink-primary);
  border: 1px solid var(--border-light);
  border-bottom-left-radius: 4px;
}

.chat-bubble.emergency {
  background: #FFF1F2;
  border: 1.5px solid #FDA4AF;
  color: #9F1239;
}

.urgency-tag {
  font-size: 10px;
  font-weight: 800;
  margin-bottom: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.urgency-tag.critical {
  background: #FFE4E6;
  color: #E11D48;
}

.triage-input-bar {
  display: flex;
  gap: 8px;
}

.triage-input {
  flex: 1;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 8px 14px;
  font-size: 12.5px;
}

.send-triage-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #6366F1;
  color: #fff;
  display: grid;
  place-items: center;
}

/* Translator Styles */
.translator-card {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.mic-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.waveform-container {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
}

.wave-bar {
  width: 4px;
  height: 10px;
  background: var(--border-strong);
  border-radius: 2px;
  transition: height 0.2s ease;
}

.waveform-container.listening .wave-bar {
  background: #6366F1;
  animation: waveAnim 0.6s infinite alternate;
}

.waveform-container.listening .wave-bar:nth-child(2) { animation-delay: 0.1s; }
.waveform-container.listening .wave-bar:nth-child(3) { animation-delay: 0.2s; }
.waveform-container.listening .wave-bar:nth-child(4) { animation-delay: 0.3s; }
.waveform-container.listening .wave-bar:nth-child(5) { animation-delay: 0.2s; }
.waveform-container.listening .wave-bar:nth-child(6) { animation-delay: 0.1s; }

@keyframes waveAnim {
  0% { height: 8px; }
  100% { height: 36px; }
}

.record-circle-btn {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.record-circle-btn.recording {
  background: #F43F5E;
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(244, 63, 94, 0.5);
}

.mic-status-text {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-secondary);
}

.thought-bubble-result {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 14px;
  text-align: left;
  animation: fadeIn 0.3s ease;
}

.thought-avatar img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.speaker-lbl {
  font-size: 11px;
  font-weight: 800;
  color: var(--brand-primary);
}

.translated-dialogue {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-primary);
  margin: 4px 0 6px;
  line-height: 1.4;
}

.emotion-detected {
  font-size: 11px;
  color: var(--accent-emerald);
  font-weight: 700;
}

/* Matcher Styles */
.matcher-card {
  padding: 16px;
}

.matcher-title {
  font-size: 15px;
  font-weight: 800;
}

.matcher-sub {
  font-size: 12px;
  color: var(--ink-muted);
  margin-bottom: 14px;
}

.match-vs-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 16px;
}

.pet-pick-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.m-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.m-name {
  font-size: 13px;
  font-weight: 800;
}

.m-stat {
  font-size: 10.5px;
  color: var(--brand-primary);
  font-weight: 700;
}

.vs-badge {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 800;
  background: var(--bg-card-subtle);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  color: var(--ink-muted);
}

.match-gauge-box {
  background: var(--bg-card-subtle);
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.gauge-ring {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 4px solid var(--accent-emerald);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.gauge-percent {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent-emerald);
}

.gauge-label {
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--ink-muted);
}

.gauge-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
}

.g-line {
  display: flex;
  justify-content: space-between;
}

.green {
  color: var(--accent-emerald);
}

.invite-playdate-btn {
  width: 100%;
  background: linear-gradient(135deg, #10B981, #059669);
  padding: 10px;
}

/* Portrait Studio */
.portrait-card {
  padding: 16px;
}

.port-title {
  font-size: 15px;
  font-weight: 800;
}

.port-sub {
  font-size: 12px;
  color: var(--ink-muted);
  margin-bottom: 12px;
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.style-tile {
  border: 2px solid var(--border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.style-tile.active {
  border-color: #6366F1;
  box-shadow: 0 0 0 1px #6366F1;
}

.style-img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.style-label {
  padding: 6px 8px;
  font-size: 11.5px;
  font-weight: 700;
  text-align: center;
  background: var(--bg-card);
}

.generate-art-btn {
  width: 100%;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  padding: 10px;
}
</style>
