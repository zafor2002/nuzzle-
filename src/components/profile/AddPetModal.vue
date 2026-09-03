<template>
  <div v-if="isOpen" class="modal-scrim" @click.self="close">
    <div class="add-pet-modal-shell animate-pop">
      <!-- Modal Header -->
      <div class="add-pet-header">
        <div class="header-badge-group">
          <div class="gold-badge-circle">🐾</div>
          <div>
            <h3 class="modal-title">Register Pet Companion</h3>
            <p class="modal-sub">Create Official Biometric Passport & Digital ID</p>
          </div>
        </div>
        <button class="btn-icon close-btn" @click="close" title="Close">
          <X :size="20" />
        </button>
      </div>

      <!-- Form Container -->
      <form class="add-pet-form" @submit.prevent="handleSubmit">
        <div class="form-scrollable-content">
          <!-- 1. Pet Name & Species -->
          <div class="form-section">
            <label class="section-label">1. Pet Name & Species *</label>
            <div class="input-group">
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="Pet name (e.g. Archie, Luna, Milo)" 
                required
                class="text-input pet-name-input"
                autofocus
              />
            </div>

            <!-- Species Chips -->
            <div class="species-chips-grid">
              <button 
                v-for="s in speciesOptions" 
                :key="s.value"
                type="button"
                class="species-chip"
                :class="{ active: form.species === s.value }"
                @click="handleSelectSpecies(s.value)"
              >
                <span class="s-emoji">{{ s.emoji }}</span>
                <span class="s-label">{{ s.label }}</span>
              </button>
            </div>
          </div>

          <!-- 2. Breed & Physical Traits -->
          <div class="form-section">
            <label class="section-label">2. Breed & Physical Traits</label>
            <div class="two-col-grid">
              <div class="input-field">
                <span class="field-caption">Breed</span>
                <input 
                  v-model="form.breed" 
                  type="text" 
                  :placeholder="form.species === 'Dog' ? 'Golden Retriever' : form.species === 'Cat' ? 'Persian / Mixed' : 'Breed or Variety'" 
                  class="text-input"
                />
              </div>
              <div class="input-field">
                <span class="field-caption">Age / Approx. Years</span>
                <input 
                  v-model="form.age" 
                  type="text" 
                  placeholder="e.g. 2 yrs, 6 mos" 
                  class="text-input"
                />
              </div>
            </div>

            <div class="two-col-grid mt-2">
              <div class="input-field">
                <span class="field-caption">Weight</span>
                <input 
                  v-model="form.weight" 
                  type="text" 
                  placeholder="e.g. 14.2 kg" 
                  class="text-input"
                />
              </div>
              <div class="input-field">
                <span class="field-caption">Microchip ID</span>
                <input 
                  v-model="form.microchipId" 
                  type="text" 
                  placeholder="Auto-generated if blank" 
                  class="text-input"
                />
              </div>
            </div>
          </div>

          <!-- 3. Avatar Selection -->
          <div class="form-section">
            <label class="section-label">3. Passport Photo</label>
            <span class="field-desc">Choose a portrait or enter your pet's photo link:</span>
            
            <div class="avatar-presets-strip">
              <div 
                v-for="(img, idx) in currentPresetAvatars" 
                :key="idx"
                class="avatar-preset-thumb"
                :class="{ selected: form.avatarUrl === img }"
                @click="form.avatarUrl = img"
              >
                <img :src="img" alt="Preset Avatar" class="preset-img" />
                <div v-if="form.avatarUrl === img" class="check-overlay">✓</div>
              </div>
            </div>

            <div class="input-field mt-2">
              <span class="field-caption">Custom Photo URL (optional)</span>
              <input 
                v-model="form.avatarUrl" 
                type="url" 
                placeholder="https://..." 
                class="text-input"
              />
            </div>
          </div>

          <!-- 4. Bio & Personality -->
          <div class="form-section">
            <label class="section-label">4. Personality & Bio</label>
            <div class="input-field">
              <span class="field-caption">AI Personality Archetype</span>
              <select v-model="form.aiPersonality" class="text-input select-input">
                <option value="Enthusiastic Companion">Enthusiastic Companion ⚡</option>
                <option value="Gentle Guardian">Gentle Guardian 🛡️</option>
                <option value="Master Fetcher & Zoomer">Master Fetcher & Zoomer 🎾</option>
                <option value="Cozy Purr Machine">Cozy Purr Machine 😻</option>
                <option value="Curious Adventurer">Curious Adventurer 🌲</option>
              </select>
            </div>

            <div class="input-field mt-2">
              <span class="field-caption">Short Bio</span>
              <textarea 
                v-model="form.bio" 
                placeholder="Share a fun fact about your pet! Favorite toys, park habits, or quirky behaviors..." 
                rows="2"
                class="text-input textarea-input"
              ></textarea>
            </div>
          </div>

          <!-- Submit Error / Feedback -->
          <div v-if="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>
        </div>

        <!-- Sticky Modal Footer Actions (Always Visible!) -->
        <div class="modal-footer-row">
          <button type="button" class="btn-ghost cancel-btn" @click="close">
            Cancel
          </button>
          <button type="submit" class="btn-solid submit-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting">Creating Passport...</span>
            <span v-else>🐾 Create Pet Passport</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { X } from 'lucide-vue-next';
import { addNewPet, isAddPetModalOpen } from '../../stores/appStore';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'created', pet: any): void;
}>();

const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

const speciesOptions = [
  { value: 'Dog', label: 'Dog', emoji: '🐕' },
  { value: 'Cat', label: 'Cat', emoji: '🐱' },
  { value: 'Bird', label: 'Bird', emoji: '🦜' },
  { value: 'Rabbit', label: 'Rabbit', emoji: '🐰' },
  { value: 'Other', label: 'Other', emoji: '🐾' }
];

const dogAvatars = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=250&auto=format&fit=crop&q=80'
];

const catAvatars = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=250&auto=format&fit=crop&q=80'
];

const otherAvatars = [
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=250&auto=format&fit=crop&q=80'
];

const form = reactive({
  name: '',
  species: 'Dog' as 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Reptile' | 'Other',
  breed: '',
  age: '',
  weight: '',
  microchipId: '',
  avatarUrl: dogAvatars[0],
  aiPersonality: 'Enthusiastic Companion',
  bio: ''
});

const currentPresetAvatars = computed(() => {
  if (form.species === 'Dog') return dogAvatars;
  if (form.species === 'Cat') return catAvatars;
  return otherAvatars;
});

function handleSelectSpecies(s: any) {
  form.species = s;
  if (s === 'Dog') form.avatarUrl = dogAvatars[0];
  else if (s === 'Cat') form.avatarUrl = catAvatars[0];
  else form.avatarUrl = otherAvatars[0];
}

function close() {
  isAddPetModalOpen.value = false;
  emit('close');
}

async function handleSubmit() {
  if (!form.name.trim()) {
    errorMessage.value = 'Please enter your pet\'s name.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    const res = await addNewPet({
      name: form.name,
      species: form.species,
      breed: form.breed,
      age: form.age,
      weight: form.weight,
      microchipId: form.microchipId,
      avatarUrl: form.avatarUrl,
      aiPersonality: form.aiPersonality,
      bio: form.bio
    });

    emit('created', res.pet);
    close();

    // Reset form
    form.name = '';
    form.breed = '';
    form.age = '';
    form.weight = '';
    form.microchipId = '';
    form.bio = '';
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to register pet. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.modal-scrim {
  position: fixed;
  inset: 0;
  background: rgba(14, 11, 26, 0.75);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.add-pet-modal-shell {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.animate-pop {
  animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.add-pet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: linear-gradient(135deg, rgba(148, 125, 238, 0.12), rgba(124, 58, 237, 0.06));
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.header-badge-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gold-badge-circle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #F59E0B, #D97706);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.modal-title {
  font-size: 15.5px;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.modal-sub {
  font-size: 10.5px;
  color: var(--text-muted);
  margin: 1px 0 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-main);
}

.add-pet-form {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.form-scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.form-scrollable-content::-webkit-scrollbar-track {
  background: transparent;
}

.form-scrollable-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 999px;
}

.form-scrollable-content::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary);
}

.field-caption {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 4px;
  display: block;
}

.field-desc {
  font-size: 11px;
  color: var(--text-muted);
}

.text-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-subtle, rgba(0, 0, 0, 0.04));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 13px;
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.text-input:focus {
  border-color: var(--primary);
}

.pet-name-input {
  font-size: 15px;
  font-weight: 700;
}

.species-chips-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-top: 4px;
}

.species-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  background: var(--bg-subtle, rgba(0, 0, 0, 0.03));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s;
}

.species-chip:hover {
  border-color: var(--primary);
}

.species-chip.active {
  background: rgba(148, 125, 238, 0.15);
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
}

.s-emoji {
  font-size: 18px;
}

.s-label {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-main);
}

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mt-2 {
  margin-top: 8px;
}

.avatar-presets-strip {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.avatar-preset-thumb {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-preset-thumb:hover {
  transform: scale(1.05);
}

.avatar-preset-thumb.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(148, 125, 238, 0.4);
}

.preset-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.check-overlay {
  position: absolute;
  inset: 0;
  background: rgba(124, 58, 237, 0.5);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-input {
  cursor: pointer;
}

.textarea-input {
  resize: none;
}

.error-banner {
  background: rgba(244, 63, 94, 0.12);
  border: 1px solid rgba(244, 63, 94, 0.4);
  color: #F43F5E;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
}

.modal-footer-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 14px 22px;
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
}

.cancel-btn {
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-full);
}

.submit-btn {
  padding: 10px 22px;
  font-size: 13px;
  font-weight: 800;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(148, 125, 238, 0.35);
  transition: all 0.2s;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(148, 125, 238, 0.45);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
