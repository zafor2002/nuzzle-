<template>
  <div v-if="isCreateSheetOpen" class="modal-scrim" @click.self="isCreateSheetOpen = false">
    <div class="bottom-sheet create-sheet">
      <div class="sheet-handle"></div>

      <div class="sheet-header">
        <h3 class="sheet-title">Create New</h3>
        <button class="btn-icon" @click="isCreateSheetOpen = false">
          <X :size="20" />
        </button>
      </div>

      <!-- Action Type Selector Tabs -->
      <div class="create-type-tabs">
        <button 
          v-for="t in createTypes" 
          :key="t.id" 
          class="create-tab"
          :class="{ active: selectedType === t.id }"
          @click="selectedType = t.id as any"
        >
          <span class="t-emoji">{{ t.emoji }}</span>
          <span>{{ t.label }}</span>
        </button>
      </div>

      <!-- Form Content -->
      <div class="create-form-body">
        <!-- 1. POST FORM -->
        <div v-if="selectedType === 'post'" class="form-section">
          <!-- Select Poster Identity -->
          <div class="field-row">
            <label class="field-label">Post As:</label>
            <div class="identity-options">
              <button 
                class="id-option-btn" 
                :class="{ active: selectedPosterPetId === '' }"
                @click="selectedPosterPetId = ''"
              >
                {{ owner.displayName }}
              </button>
              <button 
                v-for="p in pets" 
                :key="p.id" 
                class="id-option-btn"
                :class="{ active: selectedPosterPetId === p.id }"
                @click="selectedPosterPetId = p.id"
              >
                🐾 {{ p.name }}
              </button>
            </div>
          </div>

          <!-- AI Magic Caption Generator Assistant -->
          <div class="ai-caption-helper">
            <div class="ai-helper-head">
              <span class="ai-help-title">✨ PawAI Caption Writer:</span>
              <div class="ai-tones-row">
                <button class="tone-btn" @click="applyAiCaption('silly')">🤪 Silly</button>
                <button class="tone-btn" @click="applyAiCaption('heartwarming')">❤️ Sweet</button>
                <button class="tone-btn" @click="applyAiCaption('dramatic')">🎭 Dramatic</button>
                <button class="tone-btn" @click="applyAiCaption('poetic')">🌲 Poetic</button>
              </div>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Caption & #Hashtags</label>
            <textarea 
              v-model="postCaption" 
              placeholder="What is your pet up to today? Tap an AI tone above to auto-write..." 
              rows="3" 
              class="form-textarea"
            ></textarea>
          </div>

          <div class="field-group">
            <label class="field-label">Photo URL</label>
            <input 
              v-model="postMediaUrl" 
              placeholder="https://images.unsplash.com/..." 
              class="form-input" 
            />
            <div class="preset-images-row">
              <span class="preset-label">Or sample:</span>
              <button 
                v-for="(img, idx) in sampleImages" 
                :key="idx" 
                class="preset-thumb-btn"
                @click="postMediaUrl = img"
              >
                <img :src="img" alt="Sample" />
              </button>
            </div>
          </div>

          <button class="btn-solid submit-btn" @click="handleCreatePost">
            Publish Post 🚀
          </button>
        </div>

        <!-- 2. LOST & FOUND ALERT FORM -->
        <div v-else-if="selectedType === 'lostfound'" class="form-section">
          <div class="status-toggle-row">
            <button 
              class="status-btn lost" 
              :class="{ active: lfStatus === 'lost' }"
              @click="lfStatus = 'lost'"
            >
              🚨 Lost Pet
            </button>
            <button 
              class="status-btn found" 
              :class="{ active: lfStatus === 'found' }"
              @click="lfStatus = 'found'"
            >
              🐾 Found Pet
            </button>
          </div>

          <div class="field-group">
            <label class="field-label">Pet Name / Description</label>
            <input v-model="lfPetName" placeholder="e.g. Charlie (Golden Retriever mix)" class="form-input" />
          </div>

          <div class="field-group">
            <label class="field-label">Last Seen Location</label>
            <input v-model="lfLocation" placeholder="e.g. Washington Park near tennis courts" class="form-input" />
          </div>

          <div class="field-group">
            <label class="field-label">Distinctive Details / Markings</label>
            <textarea v-model="lfDescription" placeholder="Collar color, behavior with strangers, microchip status..." rows="2" class="form-textarea"></textarea>
          </div>

          <div class="field-row">
            <div class="field-half">
              <label class="field-label">Reward (Optional)</label>
              <input v-model="lfReward" placeholder="$150 Reward" class="form-input" />
            </div>
            <div class="field-half">
              <label class="field-label">Contact Phone</label>
              <input v-model="lfContactPhone" placeholder="(503) 555-0199" class="form-input" />
            </div>
          </div>

          <button class="btn-solid submit-btn danger" @click="handleCreateLostFound">
            Broadcast Emergency Alert 🚨
          </button>
        </div>

        <!-- 3. HEALTH LOG FORM -->
        <div v-else-if="selectedType === 'health'" class="form-section">
          <div class="field-group">
            <label class="field-label">Select Pet</label>
            <select v-model="healthPetId" class="form-select">
              <option v-for="p in pets" :key="p.id" :value="p.id">{{ p.name }} ({{ p.species }})</option>
            </select>
          </div>

          <div class="field-group">
            <label class="field-label">Log Type</label>
            <select v-model="healthLogType" class="form-select">
              <option value="vaccination">💉 Vaccination Booster</option>
              <option value="vet_visit">🩺 Vet Checkup / Dental</option>
              <option value="medication">💊 Medication / Preventative</option>
              <option value="allergy">⚠️ Allergy / Dietary Note</option>
            </select>
          </div>

          <div class="field-group">
            <label class="field-label">Record Title</label>
            <input v-model="healthTitle" placeholder="e.g. Rabies 3-Year Vaccine" class="form-input" />
          </div>

          <div class="field-group">
            <label class="field-label">Clinical Notes & Vet</label>
            <textarea v-model="healthNotes" placeholder="Clinic name, dosage, reaction observations..." rows="2" class="form-textarea"></textarea>
          </div>

          <button class="btn-solid submit-btn" @click="handleCreateHealth">
            Save Pet Health Record 🩺
          </button>
        </div>

        <!-- 4. MARKETPLACE ITEM -->
        <div v-else-if="selectedType === 'market'" class="form-section">
          <div class="field-group">
            <label class="field-label">Item Title</label>
            <input v-model="marketTitle" placeholder="e.g. Large Orthopedic Dog Bed" class="form-input" />
          </div>

          <div class="field-row">
            <div class="field-half">
              <label class="field-label">Price ($)</label>
              <input v-model.number="marketPrice" type="number" placeholder="35" class="form-input" />
            </div>
            <div class="field-half">
              <label class="field-label">Category</label>
              <select v-model="marketCategory" class="form-select">
                <option value="Beds & Cages">Beds & Cages</option>
                <option value="Toys">Toys</option>
                <option value="Food & Treats">Food & Treats</option>
                <option value="Apparel">Apparel</option>
              </select>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Description</label>
            <textarea v-model="marketDesc" placeholder="Condition, size dimensions, reason for selling..." rows="2" class="form-textarea"></textarea>
          </div>

          <button class="btn-solid submit-btn" @click="handleCreateMarket">
            List in Pet Marketplace 🛍️
          </button>
        </div>

        <!-- 5. PET REEL / VIDEO FORM -->
        <div v-else-if="selectedType === 'reel'" class="form-section">
          <div class="field-group">
            <label class="field-label">Reel Title</label>
            <input v-model="reelTitle" placeholder="e.g. Midnight Zoomies Champion 🐾" class="form-input" />
          </div>

          <div class="field-group">
            <label class="field-label">Caption & Tags</label>
            <textarea v-model="reelCaption" placeholder="Tell the story behind this moment... #zoomies #dhakapets" rows="2" class="form-textarea"></textarea>
          </div>

          <div class="field-group">
            <label class="field-label">Audio Track</label>
            <select v-model="reelAudioTrack" class="form-select">
              <option value="Original Pet Audio • Nuzzle Dhaka">🎵 Original Pet Audio • Nuzzle Dhaka</option>
              <option value="Upbeat Whistle & Paws 🎶">🎶 Upbeat Whistle & Paws</option>
              <option value="Lo-Fi Park Stroll Beats 🐾">🐾 Lo-Fi Park Stroll Beats</option>
              <option value="Cat Meow Symphony Remixed 🐱">🐱 Cat Meow Symphony Remixed</option>
            </select>
          </div>

          <div class="field-group">
            <label class="field-label">Video Gradient Theme</label>
            <div class="preset-images-row">
              <button 
                type="button"
                v-for="g in reelGradients" 
                :key="g.name"
                class="preset-thumb-btn gradient-thumb"
                :style="{ background: g.style }"
                @click="selectedReelGradient = g.style"
              >
                <span>{{ g.name }}</span>
              </button>
            </div>
          </div>

          <button class="btn-solid submit-btn" @click="handleCreateReel">
            Publish Pet Reel 🎬
          </button>
        </div>

        <!-- 6. ADOPTION LISTING FORM -->
        <div v-else-if="selectedType === 'adoption'" class="form-section">
          <div class="field-row">
            <div class="field-half">
              <label class="field-label">Pet Name</label>
              <input v-model="adoptPetName" placeholder="e.g. Bella" class="form-input" />
            </div>
            <div class="field-half">
              <label class="field-label">Species & Breed</label>
              <input v-model="adoptBreed" placeholder="e.g. Deshi Cat" class="form-input" />
            </div>
          </div>

          <div class="field-row">
            <div class="field-half">
              <label class="field-label">Age</label>
              <input v-model="adoptAge" placeholder="e.g. 5 months" class="form-input" />
            </div>
            <div class="field-half">
              <label class="field-label">Gender</label>
              <select v-model="adoptGender" class="form-select">
                <option value="Boy">Boy ♂</option>
                <option value="Girl">Girl ♀</option>
              </select>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Dhaka Shelter / Location</label>
            <input v-model="adoptLocation" placeholder="e.g. Banani Rd 11 / PAW Rescue Shelter" class="form-input" />
          </div>

          <div class="field-group">
            <label class="field-label">Story & Temperament</label>
            <textarea v-model="adoptDescription" placeholder="Friendly, vaccinated, loves cuddling..." rows="2" class="form-textarea"></textarea>
          </div>

          <button class="btn-solid submit-btn" @click="handleCreateAdoption">
            List Rescue For Adoption 🏡
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import { 
  isCreateSheetOpen, 
  owner, 
  pets, 
  createNewPost, 
  reportLostPet, 
  addHealthRecord, 
  marketplace, 
  generateAiCaption,
  setTab,
  createNewReel,
  createNewAdoptionListing
} from '../../stores/appStore';

const selectedType = ref<'post' | 'lostfound' | 'health' | 'market' | 'reel' | 'adoption'>('post');

const createTypes = [
  { id: 'post', label: 'Post', emoji: '📸' },
  { id: 'reel', label: 'Reel', emoji: '🎬' },
  { id: 'lostfound', label: 'Lost & Found', emoji: '🚨' },
  { id: 'adoption', label: 'Adoption', emoji: '🏡' },
  { id: 'health', label: 'Health Log', emoji: '🩺' },
  { id: 'market', label: 'Sell Gear', emoji: '🛍️' }
];

// Post form
const postCaption = ref('');
const postMediaUrl = ref('https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80');
const selectedPosterPetId = ref('pet_1');

const sampleImages = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80'
];

function applyAiCaption(tone: 'silly' | 'heartwarming' | 'dramatic' | 'poetic') {
  const selectedPet = pets.find(p => p.id === selectedPosterPetId.value);
  const result = generateAiCaption(tone, selectedPet?.name || 'Waffles');
  postCaption.value = `${result.caption} ${result.tags.map(t => '#' + t).join(' ')}`;
}

function handleCreatePost() {
  if (!postCaption.value.trim()) return;
  createNewPost(postCaption.value, postMediaUrl.value, selectedPosterPetId.value || undefined);
  postCaption.value = '';
  isCreateSheetOpen.value = false;
  setTab('feed');
}

// Lost & Found form
const lfStatus = ref<'lost' | 'found'>('lost');
const lfPetName = ref('');
const lfLocation = ref('');
const lfDescription = ref('');
const lfReward = ref('');
const lfContactPhone = ref('(503) 555-0199');

function handleCreateLostFound() {
  if (!lfPetName.value.trim() || !lfLocation.value.trim()) return;
  reportLostPet({
    petName: lfPetName.value,
    species: 'Pet',
    status: lfStatus.value,
    description: lfDescription.value || 'Please help find this beloved pet!',
    imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
    location: lfLocation.value,
    reward: lfReward.value,
    contactName: owner.displayName,
    contactPhone: lfContactPhone.value
  });
  lfPetName.value = '';
  isCreateSheetOpen.value = false;
  setTab('lostfound');
}

// Health form
const healthPetId = ref(pets[0]?.id || 'pet_1');
const healthLogType = ref<'vaccination' | 'vet_visit' | 'medication' | 'allergy'>('vaccination');
const healthTitle = ref('');
const healthNotes = ref('');

function handleCreateHealth() {
  if (!healthTitle.value.trim()) return;
  const targetPet = pets.find(p => p.id === healthPetId.value) || pets[0];
  addHealthRecord({
    petId: targetPet.id,
    petName: targetPet.name,
    type: healthLogType.value,
    title: healthTitle.value,
    notes: healthNotes.value,
    date: new Date().toISOString().split('T')[0],
    veterinarian: 'Rose City Animal Hospital'
  });
  healthTitle.value = '';
  healthNotes.value = '';
  isCreateSheetOpen.value = false;
  setTab('health');
}

// Market form
const marketTitle = ref('');
const marketPrice = ref(25);
const marketCategory = ref<'Beds & Cages' | 'Toys' | 'Food & Treats' | 'Apparel'>('Beds & Cages');
const marketDesc = ref('');

function handleCreateMarket() {
  if (!marketTitle.value.trim()) return;
  marketplace.unshift({
    id: `mkt_${Date.now()}`,
    title: marketTitle.value,
    category: marketCategory.value,
    price: marketPrice.value,
    description: marketDesc.value || 'Gently used pet gear in great condition.',
    imageUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&auto=format&fit=crop&q=80',
    condition: 'Like New',
    sellerName: owner.displayName,
    sellerAvatar: owner.avatarUrl,
    sellerType: 'individual',
    isVerifiedShop: false,
    shopBadge: '👤 Pet Parent',
    location: 'Dhaka, Bangladesh',
    status: 'available',
    stock: 1
  });
  marketTitle.value = '';
  isCreateSheetOpen.value = false;
  setTab('market');
}

// Reel form
const reelTitle = ref('');
const reelCaption = ref('');
const reelAudioTrack = ref('Original Pet Audio • Nuzzle Dhaka');
const selectedReelGradient = ref('linear-gradient(180deg, #180b2a 0%, #31104a 50%, #0d0617 100%)');
const reelGradients = [
  { name: 'Cosmic', style: 'linear-gradient(180deg, #180b2a 0%, #31104a 50%, #0d0617 100%)' },
  { name: 'Emerald', style: 'linear-gradient(180deg, #022c22 0%, #064e3b 50%, #022c22 100%)' },
  { name: 'Sunset', style: 'linear-gradient(180deg, #431407 0%, #7c2d12 50%, #1c1917 100%)' }
];

function handleCreateReel() {
  if (!reelTitle.value.trim() && !reelCaption.value.trim()) return;
  createNewReel({
    videoTitle: reelTitle.value.trim() || 'Dhaka Pet Joy',
    caption: reelCaption.value.trim() || 'Daily moments on Nuzzle!',
    audioTrack: reelAudioTrack.value,
    videoGradient: selectedReelGradient.value
  });
  reelTitle.value = '';
  reelCaption.value = '';
  isCreateSheetOpen.value = false;
  setTab('reels');
}

// Adoption form
const adoptPetName = ref('');
const adoptBreed = ref('');
const adoptAge = ref('6 Months');
const adoptGender = ref<'Boy' | 'Girl'>('Boy');
const adoptLocation = ref('Dhaka, Bangladesh');
const adoptDescription = ref('');

function handleCreateAdoption() {
  if (!adoptPetName.value.trim()) return;
  createNewAdoptionListing({
    name: adoptPetName.value.trim(),
    species: adoptBreed.value.toLowerCase().includes('cat') ? 'Cat' : 'Dog',
    breed: adoptBreed.value.trim() || 'Indie Companion',
    age: adoptAge.value,
    gender: adoptGender.value,
    description: adoptDescription.value.trim() || 'Healthy, loving rescue ready for adoption.',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
    location: adoptLocation.value.trim() || 'Dhaka, Bangladesh',
    shelterName: 'Nuzzle Verified Rescue Hub',
    fee: 'Free Adoption',
    temperament: ['Playful', 'Gentle', 'Vaccinated'],
    isVaccinated: true,
    isNeutered: true
  });
  adoptPetName.value = '';
  adoptBreed.value = '';
  adoptDescription.value = '';
  isCreateSheetOpen.value = false;
  setTab('adoption');
}
</script>

<style scoped>
.create-sheet {
  height: 84%;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-light);
}

.sheet-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink-primary);
}

.create-type-tabs {
  display: flex;
  gap: 6px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-light);
  overflow-x: auto;
  scrollbar-width: none;
}

.create-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  border-radius: var(--radius-full);
  font-size: 12.5px;
  font-weight: 600;
  background: var(--bg-card-subtle);
  color: var(--ink-secondary);
  white-space: nowrap;
  transition: all 0.15s ease;
}

.create-tab.active {
  background: var(--brand-primary);
  color: #fff;
}

.create-form-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.field-group {
  margin-bottom: 14px;
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-secondary);
  margin-bottom: 6px;
}

.ai-caption-helper {
  background: linear-gradient(135deg, #F5F0FF, #FAF5FF);
  border: 1px solid #D5C8F2;
  border-radius: var(--radius-md);
  padding: 10px 12px;
  margin-bottom: 12px;
}

.ai-helper-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ai-help-title {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--brand-primary);
}

.ai-tones-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
}

.tone-btn {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  background: #fff;
  border: 1px solid var(--border-strong);
  color: var(--ink-primary);
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.15s ease;
}

.tone-btn:active, .tone-btn:hover {
  background: var(--brand-gradient);
  color: #fff;
  border-color: transparent;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  font-size: 13.5px;
  color: var(--ink-primary);
  outline: none;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--brand-primary);
}

.form-textarea {
  resize: none;
}

.field-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.field-half {
  flex: 1;
}

.identity-options {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.id-option-btn {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  color: var(--ink-secondary);
  border: 1px solid var(--border-light);
}

.id-option-btn.active {
  background: var(--brand-soft);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
  font-weight: 700;
}

.preset-images-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.preset-label {
  font-size: 11px;
  color: var(--ink-muted);
}

.preset-thumb-btn {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  overflow: hidden;
  border: 1.5px solid var(--border-light);
}

.preset-thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-toggle-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.status-btn {
  flex: 1;
  padding: 10px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 13.5px;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  color: var(--ink-secondary);
}

.status-btn.lost.active {
  background: #FFE4E6;
  border-color: #F43F5E;
  color: #BE123C;
}

.status-btn.found.active {
  background: #D1FAE5;
  border-color: #10B981;
  color: #047857;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
  padding: 12px;
}

.submit-btn.danger {
  background: var(--accent-rose);
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
}
</style>
