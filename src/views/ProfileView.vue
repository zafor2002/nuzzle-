<template>
  <div class="profile-view">
    <!-- Top Header Bar -->
    <header class="profile-top-bar">
      <div class="handle-cluster">
        <h2 class="profile-handle">{{ currentProfileHandle }}</h2>
        <span v-if="owner.role === 'store'" class="role-badge store">🛍️ Verified Store</span>
        <span v-else-if="owner.role === 'vet'" class="role-badge vet">🏥 Verified Clinic</span>
        <span v-else-if="isCurrentAnonymous" class="ghost-status-chip">Ghost Mode</span>
      </div>

      <div class="header-action-icons">
        <button class="icon-round-btn" @click="setTab('settings')" title="Settings">
          <Settings :size="18" />
        </button>
      </div>
    </header>

    <div class="profile-scroll-body">
      <!-- ========================================================= -->
      <!-- A. PET STORE / BRAND PROFILE VIEW (NO PET PASSPORT/PETS) -->
      <!-- ========================================================= -->
      <div v-if="owner.role === 'store'" class="role-store-profile">
        <!-- Store Hero Card -->
        <div class="store-hero-card card-item">
          <div class="store-top-row">
            <div class="store-avatar-frame">
              <img :src="owner.avatarUrl" :alt="owner.displayName" class="store-main-avatar" />
              <span class="store-verified-tag">✓</span>
            </div>

            <div class="store-info-col">
              <div class="store-name-line">
                <h3 class="store-display-name">{{ owner.displayName }}</h3>
                <span class="gold-shield-pill">🛡️ VERIFIED SHOP</span>
              </div>
              <span class="store-category-text">{{ owner.storeCategory || 'Pet Gear & Accessories Boutique' }}</span>
              <span class="store-location-text">📍 1240 NW Lovejoy St, Portland, OR • Open Mon-Sat 9AM-8PM</span>
            </div>
          </div>

          <p class="store-bio-desc">
            {{ owner.bio || 'Official premium boutique specializing in handcrafted ergonomic harnesses, natural organic treats, and luxury pet bedding.' }}
          </p>

          <!-- Storefront Analytics Dashboard -->
          <div class="store-stats-dashboard">
            <div class="s-stat-tile">
              <span class="s-stat-val">⭐ 4.9</span>
              <span class="s-stat-lbl">142 Reviews</span>
            </div>
            <div class="s-stat-tile">
              <span class="s-stat-val">📦 1.4k+</span>
              <span class="s-stat-lbl">Items Sold</span>
            </div>
            <div class="s-stat-tile">
              <span class="s-stat-val">🏷️ {{ myStoreListings.length }}</span>
              <span class="s-stat-lbl">Active Products</span>
            </div>
            <div class="s-stat-tile">
              <span class="s-stat-val">⚡ 99.8%</span>
              <span class="s-stat-lbl">On-Time Shipping</span>
            </div>
          </div>

          <!-- Store Action Buttons -->
          <div class="store-action-buttons">
            <button class="btn-solid add-product-btn" @click="openCreateListing">
              <Plus :size="15" />
              <span>+ Add New Product</span>
            </button>
            <button class="btn-outline view-bazaar-btn" @click="setTab('market')">
              <ShoppingBag :size="15" />
              <span>Browse Nuzzle Bazaar</span>
            </button>
          </div>
        </div>

        <!-- Store Catalog Tabs -->
        <div class="store-tabs-bar">
          <button 
            class="tab-btn" 
            :class="{ active: storeActiveTab === 'inventory' }"
            @click="storeActiveTab = 'inventory'"
          >
            <Grid :size="15" />
            <span>Store Products ({{ myStoreListings.length }})</span>
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: storeActiveTab === 'reviews' }"
            @click="storeActiveTab = 'reviews'"
          >
            <Award :size="15" />
            <span>Customer Reviews (142)</span>
          </button>
        </div>

        <!-- Store Products Inventory List -->
        <div v-if="storeActiveTab === 'inventory'" class="store-inventory-grid">
          <div v-for="item in myStoreListings" :key="item.id" class="store-product-card">
            <div class="p-img-box">
              <img :src="item.imageUrl" :alt="item.title" class="p-img" />
              <span class="p-stock-badge">In Stock ({{ item.stock || 8 }})</span>
            </div>
            <div class="p-info-box">
              <span class="p-cat">{{ item.category }}</span>
              <h5 class="p-title">{{ item.title }}</h5>
              <div class="p-bottom-row">
                <span class="p-price">${{ item.price }}</span>
                <button class="p-edit-btn" @click="manageProduct(item.title)">Manage</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Store Reviews List -->
        <div v-else class="store-reviews-stack">
          <div class="s-review-item">
            <div class="rev-header">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Alex" class="rev-avatar" />
              <div>
                <span class="rev-author">Alex Rivers</span>
                <span class="rev-stars">⭐⭐⭐⭐⭐ • 2 days ago</span>
              </div>
            </div>
            <p class="rev-text">"The harness quality for Waffles is unmatched! Arrived in under 24 hours with custom name embroidery."</p>
          </div>

          <div class="s-review-item">
            <div class="rev-header">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Elena" class="rev-avatar" />
              <div>
                <span class="rev-author">Elena Rostova</span>
                <span class="rev-stars">⭐⭐⭐⭐⭐ • 5 days ago</span>
              </div>
            </div>
            <p class="rev-text">"Best freeze-dried salmon bites in Portland. Mochi is obsessed with them!"</p>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- B. VET CLINIC PROFILE VIEW (NO PET PASSPORT/PETS) -->
      <!-- ========================================================= -->
      <div v-else-if="owner.role === 'vet'" class="role-vet-profile">
        <!-- Clinic Hero Card -->
        <div class="clinic-hero-card card-item">
          <div class="clinic-top-row">
            <div class="clinic-avatar-frame">
              <img :src="owner.avatarUrl" :alt="owner.displayName" class="clinic-main-avatar" />
              <span class="clinic-steth-tag">🩺</span>
            </div>

            <div class="clinic-info-col">
              <div class="clinic-name-line">
                <h3 class="clinic-display-name">{{ owner.displayName }}</h3>
                <span class="clinic-verified-badge">✓ LICENSED PRACTICE</span>
              </div>
              <span class="clinic-hospital-title">{{ owner.clinicName || 'Cascade 24/7 Emergency & Surgical Hospital' }}</span>
              <span class="clinic-license-text">📜 State Medical License #VET-OR-49102 • Board Certified</span>
            </div>
          </div>

          <p class="clinic-bio-desc">
            {{ owner.bio || 'Board-certified surgical hospital specializing in orthopedic ACL/TPLO surgery, trauma ICU triage, and emergency medicine.' }}
          </p>

          <!-- Clinic Medical Specialties Chips -->
          <div class="clinic-specialties-strip">
            <span class="spec-tag">🚨 24/7 ICU & Trauma</span>
            <span class="spec-tag">🦴 Orthopedics & Joints</span>
            <span class="spec-tag">🌿 Dermatology & Allergies</span>
            <span class="spec-tag">🦷 Dental & Oral Surgery</span>
            <span class="spec-tag">🦜 Avian Medicine</span>
          </div>

          <!-- Clinic Analytics Dashboard -->
          <div class="clinic-stats-dashboard">
            <div class="c-stat-tile">
              <span class="c-stat-val">⭐ 5.0</span>
              <span class="c-stat-lbl">218 Patient Reviews</span>
            </div>
            <div class="c-stat-tile">
              <span class="c-stat-val">🩺 3.2k+</span>
              <span class="c-stat-lbl">Consultations Done</span>
            </div>
            <div class="c-stat-tile">
              <span class="c-stat-val">🚨 24/7</span>
              <span class="c-stat-lbl">Urgent ICU Unit</span>
            </div>
          </div>

          <!-- Clinic Action Buttons -->
          <div class="clinic-action-buttons">
            <button class="btn-solid manage-slots-btn" @click="manageScheduleSlots">
              <Calendar :size="15" />
              <span>📅 Manage Schedule Slots</span>
            </button>
            <button class="btn-outline call-hotline-btn" @click="callEmergencyHotline">
              <Phone :size="15" />
              <span>Emergency Hotline</span>
            </button>
          </div>
        </div>

        <!-- Clinic Tabs -->
        <div class="clinic-tabs-bar">
          <button 
            class="tab-btn" 
            :class="{ active: vetActiveTab === 'appointments' }"
            @click="vetActiveTab = 'appointments'"
          >
            <Calendar :size="15" />
            <span>Appointment Ledger ({{ appointments.length }})</span>
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: vetActiveTab === 'reviews' }"
            @click="vetActiveTab = 'reviews'"
          >
            <Award :size="15" />
            <span>Patient Reviews (218)</span>
          </button>
        </div>

        <!-- Clinic Appointments List -->
        <div v-if="vetActiveTab === 'appointments'" class="appointments-ledger-stack">
          <div v-for="apt in appointments" :key="apt.id" class="apt-ledger-card">
            <div class="apt-top-line">
              <div class="apt-pet-col">
                <span class="apt-pet-name">🐾 {{ apt.petName }}</span>
                <span class="apt-reason">{{ apt.reason }}</span>
              </div>
              <span class="apt-status-chip confirmed">✓ Confirmed</span>
            </div>

            <div class="apt-time-row">
              <span>📅 {{ apt.date }} at {{ apt.time }}</span>
              <button class="apt-contact-btn" @click="setTab('messages')">
                <MessageCircle :size="13" />
                <span>Contact Parent</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Clinic Reviews -->
        <div v-else class="clinic-reviews-stack">
          <div class="s-review-item">
            <div class="rev-header">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Alex" class="rev-avatar" />
              <div>
                <span class="rev-author">Alex Rivers (Waffles' Guardian)</span>
                <span class="rev-stars">⭐⭐⭐⭐⭐ • 1 week ago</span>
              </div>
            </div>
            <p class="rev-text">"Dr. Sarah and the emergency team saved Waffles after he ate dark chocolate. Compassionate, ultra-fast triage and transparent pricing."</p>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- C. PET PARENT / GUARDIAN PROFILE (HAS PET PASSPORT & PETS)-->
      <!-- ========================================================= -->
      <div v-else class="role-parent-profile">
        <!-- 1. Pet / Guardian Persona Switcher Pills (ONLY FOR PET PARENTS) -->
        <div class="persona-switch-dock">
          <button 
            class="persona-pill-btn"
            :class="{ active: activeProfileId === 'owner_me' }"
            @click="activeProfileId = 'owner_me'"
          >
            <img :src="owner.avatarUrl" :alt="owner.displayName" class="persona-thumb" />
            <span class="persona-name">{{ owner.displayName.split(' ')[0] }} (Guardian)</span>
          </button>

          <button 
            v-for="p in pets" 
            :key="p.id"
            class="persona-pill-btn"
            :class="{ active: activeProfileId === p.id }"
            @click="activeProfileId = p.id"
          >
            <img :src="p.avatarUrl" :alt="p.name" class="persona-thumb" />
            <span class="persona-name">{{ p.name }} ({{ p.species }})</span>
          </button>

          <button class="persona-pill-btn add-pet-pill-btn" @click="isPassportModalOpen = true">
            <span class="plus-ico">+</span>
            <span class="persona-name">Add Pet</span>
          </button>
        </div>

        <!-- 2. Nuzzle Pro Membership VIP Banner (90 BDT / month) -->
        <div 
          class="pro-profile-banner"
          :class="{ 'pro-active': owner.isProMember }"
          @click="isProModalOpen = true"
        >
          <div class="pro-banner-left">
            <div class="pro-crown-badge">👑</div>
            <div class="pro-banner-text">
              <div class="pro-banner-head">
                <span class="pro-head-title">{{ owner.isProMember ? 'Nuzzle Pro Member Active' : 'Upgrade to Nuzzle Pro' }}</span>
                <span class="pro-price-tag">{{ owner.isProMember ? 'VIP UNLOCKED' : '90 BDT / mo' }}</span>
              </div>
              <p class="pro-head-sub">
                {{ owner.isProMember 
                    ? 'All VIP privileges active: PawDoctor AI, Priority Vets & 5% Market Discount' 
                    : 'VIP Crown, Unlimited PawAI, Priority Vet Slots & 5% Marketplace Discount' }}
              </p>
            </div>
          </div>

          <button class="pro-cta-pill">
            <span>{{ owner.isProMember ? 'Manage' : 'Upgrade' }}</span>
          </button>
        </div>

        <!-- 3. Hero Profile Card -->
        <div class="profile-hero-card" :class="{ 'ghost-active-border': isCurrentAnonymous, 'pro-member-halo': owner.isProMember }">
          <div class="hero-identity-row">
            <div class="hero-avatar-frame" :class="{ 'ghost-halo': isCurrentAnonymous, 'pro-gold-frame': owner.isProMember }">
              <img :src="currentAvatar" :alt="currentDisplayName" class="hero-main-avatar" />
              <div v-if="owner.isProMember && !isCurrentAnonymous" class="pro-crown-tag" title="Nuzzle Pro VIP">👑</div>
              <div v-else-if="isCurrentAnonymous" class="ghost-icon-tag" title="Ghost Mode Mask">👻</div>
            </div>

            <div class="hero-bio-col">
              <div class="name-badge-line">
                <h3 class="hero-display-name">
                  {{ currentDisplayName }}
                  <span v-if="owner.isProMember" class="inline-crown" title="Pro Member">👑</span>
                </h3>
                <span v-if="activePet" class="species-chip">{{ activePet.breed || activePet.species }}</span>
              </div>
              <span class="sub-location-line">
                {{ activePet ? `Age: ${activePet.age || '2 yrs'} • Portland, OR` : 'Certified Pet Guardian • 2 Pets' }}
              </span>
              <p class="hero-bio-paragraph">
                {{ currentBio }}
              </p>
            </div>
          </div>

          <!-- 3. UNIQUE & INNOVATIVE PET VITALS & PACK CIRCLE (Replaces generic followers) -->
          <div class="pet-vitals-dashboard">
            <div class="vital-tile pack-tile" @click="showPackModal">
              <div class="vital-icon-wrap">
                <span class="vital-emoji">🐾</span>
              </div>
              <div class="vital-info">
                <div class="vital-number-row">
                  <span class="vital-val">{{ activePet ? '842' : '1.2k' }}</span>
                  <span class="vital-trend">+14 new</span>
                </div>
                <span class="vital-lbl">Pack Buddies</span>
              </div>
            </div>

            <div class="vital-tile love-tile">
              <div class="vital-icon-wrap">
                <span class="vital-emoji">💜</span>
              </div>
              <div class="vital-info">
                <div class="vital-number-row">
                  <span class="vital-val">{{ activePet ? '3.8k' : '5.4k' }}</span>
                  <span class="vital-trend">High Vibe</span>
                </div>
                <span class="vital-lbl">Paws & Love Earned</span>
              </div>
            </div>

            <div class="vital-tile energy-tile">
              <div class="vital-icon-wrap">
                <span class="vital-emoji">⚡</span>
              </div>
              <div class="vital-info">
                <div class="vital-number-row">
                  <span class="vital-val">98%</span>
                  <span class="vital-sparkle">✨ Peak</span>
                </div>
                <span class="vital-lbl">{{ activePet ? activePet.energyLevel || 'High Zoomies' : 'Active Guardian' }}</span>
              </div>
            </div>
          </div>

          <!-- 4. Pet Achievement & Milestone Badges -->
          <div class="pet-milestones-track">
            <div class="milestone-badge" title="Core Vaccines Up-to-Date">
              <span class="m-icon">💉</span>
              <span class="m-text">100% Vaccinated</span>
            </div>
            <div class="milestone-badge" title="Official RFID Microchip Registered">
              <span class="m-icon">🏷️</span>
              <span class="m-text">RFID Chipped</span>
            </div>
            <div class="milestone-badge" title="IATA Global Travel Passport Verified">
              <span class="m-icon">✈️</span>
              <span class="m-text">Travel Ready</span>
            </div>
            <div class="milestone-badge gold" title="Top 1% Community Snuggler">
              <span class="m-icon">🌟</span>
              <span class="m-text">Park Legend</span>
            </div>
          </div>

          <!-- 5. Profile Action Buttons: Digital Pet Passport -->
          <div class="profile-action-buttons">
            <button class="btn-solid passport-btn" @click="isPassportModalOpen = true">
              <Award :size="15" />
              <span>Digital Pet Passport 🛂</span>
            </button>

            <button class="btn-outline edit-btn" @click="setTab('settings')">
              <Edit :size="14" />
              <span>Edit Info</span>
            </button>
          </div>
        </div>

        <!-- 6. Ghost Anonymity Toggle Card -->
        <div 
          class="ghost-toggle-card"
          :class="{ active: isCurrentAnonymous }"
          @click="toggleAnonymity"
        >
          <div class="ghost-left">
            <div class="ghost-title-row">
              <EyeOff :size="15" class="ghost-eye" />
              <span class="ghost-title">{{ isCurrentAnonymous ? '👻 Ghost Mode Active' : 'Public Profile Active' }}</span>
            </div>
            <p class="ghost-desc">
              {{ isCurrentAnonymous 
                  ? 'Your real identity and photo are masked across public feeds & comments.' 
                  : 'Tap to enable incognito mode and hide real guardian information.' }}
            </p>
          </div>

          <div class="custom-switch" :class="{ on: isCurrentAnonymous }">
            <div class="switch-ball"></div>
          </div>
        </div>

        <!-- 7. Media Grid Tabs -->
        <div class="media-tabs-bar">
          <button class="tab-btn active">
            <Grid :size="16" />
            <span>Memories ({{ currentPostsCount }})</span>
          </button>
          <button class="tab-btn" @click="setTab('market')">
            <Bookmark :size="16" />
            <span>Market Listings</span>
          </button>
        </div>

        <!-- 8. Memories Photo Grid -->
        <div v-if="userGridImages.length > 0" class="memories-photo-grid">
          <div 
            v-for="(img, idx) in userGridImages" 
            :key="idx" 
            class="photo-cell"
            @click="setTab('feed')"
          >
            <img :src="img" alt="Memory" class="grid-image" />
          </div>
        </div>
        <div v-else class="empty-memories-card">
          <span class="empty-mem-icon">📸</span>
          <h4 class="empty-mem-title">No Memories Shared Yet</h4>
          <p class="empty-mem-sub">Share your pet's playful moments, park runs, or cozy naps with Dhaka's pet community.</p>
          <button class="btn-solid bark-cta-btn" @click="isCreateSheetOpen = true">
            <span>🐾 Bark First Memory</span>
          </button>
        </div>
      </div>
    </div>

    <!-- DIGITAL PET PASSPORT MODAL (ONLY ACCESSED BY PET PARENTS) -->
    <PetPassportModal 
      v-if="!owner.role || owner.role === 'parent'"
      :is-open="isPassportModalOpen" 
      @close="isPassportModalOpen = false" 
    />

    <!-- Toast Notification -->
    <transition name="toast-slide">
      <div v-if="profileToast" class="profile-toast-bar">
        {{ profileToast }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Settings, 
  EyeOff, 
  Edit, 
  Grid, 
  Bookmark, 
  Award, 
  ShoppingBag, 
  Plus, 
  Phone, 
  Calendar, 
  MessageCircle 
} from 'lucide-vue-next';
import PetPassportModal from '../components/profile/PetPassportModal.vue';
import { 
  owner, 
  pets, 
  posts,
  activeProfileId, 
  activePet, 
  setTab,
  isProModalOpen,
  marketplace,
  appointments,
  isCreateSheetOpen
} from '../stores/appStore';

const isPassportModalOpen = ref(false);
const profileToast = ref<string | null>(null);
const storeActiveTab = ref<'inventory' | 'reviews'>('inventory');
const vetActiveTab = ref<'appointments' | 'reviews'>('appointments');

const isCurrentAnonymous = computed(() => {
  if (activePet.value) return activePet.value.isAnonymous;
  return owner.isAnonymous;
});

const currentProfileHandle = computed(() => {
  if (owner.role === 'store') return `@${owner.username || 'urbanhound_official'}`;
  if (owner.role === 'vet') return `@${owner.username || 'cascade_emergency_vet'}`;
  if (isCurrentAnonymous.value) {
    return activePet.value ? `@anon_${activePet.value.name.toLowerCase()}` : '@anon_guardian_92';
  }
  if (activePet.value) return `@${activePet.value.name.toLowerCase()}_official`;
  return `@${owner.username}`;
});

const currentDisplayName = computed(() => {
  if (isCurrentAnonymous.value) {
    return activePet.value ? `Anonymous ${activePet.value.species}` : 'Secret Guardian';
  }
  if (activePet.value) return activePet.value.name;
  return owner.displayName;
});

const currentAvatar = computed(() => {
  if (isCurrentAnonymous.value) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
  }
  if (activePet.value) return activePet.value.avatarUrl;
  return owner.avatarUrl;
});

const currentBio = computed(() => {
  if (isCurrentAnonymous.value) {
    return 'Identity shielded with Nuzzle Ghost Mode. Exploring pet life incognito.';
  }
  if (activePet.value) return activePet.value.bio || `${activePet.value.name} is a friendly ${activePet.value.species}.`;
  return owner.bio || 'Certified Pet Guardian • Portland, OR';
});

const userGridImages = computed(() => {
  const myPosts = posts.filter(p => p.ownerId === owner.id || p.ownerName === owner.displayName || pets.some(pet => pet.name === p.petName));
  const images: string[] = [];
  for (const p of myPosts) {
    if (p.mediaUrls && p.mediaUrls.length > 0) {
      images.push(...p.mediaUrls);
    }
  }
  return images;
});

const currentPostsCount = computed(() => {
  if (activePet.value) return activePet.value.postsCount || 0;
  return userGridImages.value.length;
});

const myStoreListings = computed(() => {
  return marketplace.filter(m => m.sellerType === 'verified_shop' || m.sellerName.toLowerCase().includes('urbanhound') || m.sellerName === owner.displayName);
});

function toggleAnonymity() {
  if (activePet.value) {
    activePet.value.isAnonymous = !activePet.value.isAnonymous;
    showToast(activePet.value.isAnonymous ? `👻 Ghost Mode enabled for ${activePet.value.name}` : `Public identity restored for ${activePet.value.name}`);
  } else {
    owner.isAnonymous = !owner.isAnonymous;
    showToast(owner.isAnonymous ? '👻 Guardian Ghost Mode enabled' : 'Public Guardian identity restored');
  }
}

function showPackModal() {
  showToast(`🐾 Pack Circle: ${activePet.value ? activePet.value.name : 'Your Pets'} has 842 neighborhood buddies!`);
}

function showToast(msg: string) {
  profileToast.value = msg;
  setTimeout(() => {
    profileToast.value = null;
  }, 2200);
}

function openCreateListing() {
  isCreateSheetOpen.value = true;
}

function manageProduct(title: string) {
  showToast(`🏷️ Managing product: ${title}`);
}

function manageScheduleSlots() {
  showToast('📅 Booking schedule slots updated for tomorrow!');
}

function callEmergencyHotline() {
  showToast('📞 Emergency Hotline: (503) 555-2424');
}
</script>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.profile-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 20;
}

.handle-cluster {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-handle {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.role-badge {
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.role-badge.store {
  background: #FEF3C7;
  color: #92400E;
  border: 1px solid #FCD34D;
}

.role-badge.vet {
  background: #ECFDF5;
  color: #065F46;
  border: 1px solid #A7F3D0;
}

.ghost-status-chip {
  font-size: 10px;
  font-weight: 800;
  background: #EDE9FE;
  color: #6D28D9;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.icon-round-btn {
  color: var(--ink-secondary);
  padding: 6px;
  border-radius: 50%;
  transition: all 0.15s ease;
}

.icon-round-btn:hover {
  background: var(--bg-card-subtle);
  color: var(--ink-primary);
}

.profile-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px 84px;
}

/* ========================================= */
/* STORE PROFILE STYLES */
/* ========================================= */
.store-hero-card {
  background: var(--bg-card);
  border: 1.5px solid #FCD34D;
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.12);
  margin-bottom: 12px;
}

.store-top-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.store-avatar-frame {
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 14px;
  border: 2px solid #F59E0B;
  flex-shrink: 0;
}

.store-main-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.store-verified-tag {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #D97706;
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1.5px solid #fff;
}

.store-info-col {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.store-name-line {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.store-display-name {
  font-size: 15px;
  font-weight: 900;
  color: var(--ink-primary);
}

.gold-shield-pill {
  font-size: 8.5px;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, #D97706, #F59E0B);
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.store-category-text {
  font-size: 11px;
  font-weight: 700;
  color: #92400E;
  margin-top: 1px;
}

:global([data-theme='dark']) .store-category-text {
  color: #FCD34D;
}

.store-location-text {
  font-size: 10.5px;
  color: var(--ink-muted);
  margin-top: 2px;
}

.store-bio-desc {
  font-size: 11.5px;
  color: var(--ink-secondary);
  line-height: 1.35;
  margin: 10px 0;
}

.store-stats-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  background: var(--bg-card-subtle);
  border-radius: 12px;
  padding: 8px 6px;
  text-align: center;
  margin-bottom: 12px;
}

.s-stat-tile {
  display: flex;
  flex-direction: column;
}

.s-stat-val {
  font-size: 13px;
  font-weight: 900;
  color: #92400E;
}

:global([data-theme='dark']) .s-stat-val {
  color: #FCD34D;
}

.s-stat-lbl {
  font-size: 8.5px;
  color: var(--ink-muted);
  font-weight: 700;
}

.store-action-buttons {
  display: flex;
  gap: 8px;
}

.add-product-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  font-size: 11.5px;
  font-weight: 800;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #D97706, #F59E0B);
}

.view-bazaar-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: var(--radius-full);
}

.store-tabs-bar, .clinic-tabs-bar {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 10px;
}

.store-inventory-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.store-product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.p-img-box {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
}

.p-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.p-stock-badge {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 8px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 4px;
}

.p-info-box {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.p-cat {
  font-size: 8.5px;
  font-weight: 700;
  color: #D97706;
}

.p-title {
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-primary);
  line-height: 1.25;
}

.p-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.p-price {
  font-size: 12px;
  font-weight: 900;
  color: #059669;
}

.p-edit-btn {
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--bg-card-subtle);
  color: var(--ink-secondary);
}

.store-reviews-stack, .clinic-reviews-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.s-review-item {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 10px;
}

.rev-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.rev-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.rev-author {
  display: block;
  font-size: 11px;
  font-weight: 800;
}

.rev-stars {
  font-size: 9.5px;
  color: var(--ink-muted);
}

.rev-text {
  font-size: 11px;
  color: var(--ink-secondary);
  line-height: 1.35;
}

/* ========================================= */
/* VET CLINIC PROFILE STYLES */
/* ========================================= */
.clinic-hero-card {
  background: var(--bg-card);
  border: 1.5px solid #A7F3D0;
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.12);
  margin-bottom: 12px;
}

.clinic-top-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.clinic-avatar-frame {
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 14px;
  border: 2px solid #059669;
  flex-shrink: 0;
}

.clinic-main-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.clinic-steth-tag {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #059669;
  color: #fff;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1.5px solid #fff;
}

.clinic-info-col {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.clinic-name-line {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.clinic-display-name {
  font-size: 15px;
  font-weight: 900;
  color: var(--ink-primary);
}

.clinic-verified-badge {
  font-size: 8.5px;
  font-weight: 900;
  color: #fff;
  background: #059669;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.clinic-hospital-title {
  font-size: 11.5px;
  font-weight: 800;
  color: #065F46;
  margin-top: 1px;
}

:global([data-theme='dark']) .clinic-hospital-title {
  color: #A7F3D0;
}

.clinic-license-text {
  font-size: 10px;
  color: var(--ink-muted);
  margin-top: 2px;
}

.clinic-bio-desc {
  font-size: 11.5px;
  color: var(--ink-secondary);
  line-height: 1.35;
  margin: 10px 0 6px;
}

.clinic-specialties-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}

.spec-tag {
  font-size: 9.5px;
  font-weight: 700;
  background: #ECFDF5;
  color: #065F46;
  border: 1px solid #A7F3D0;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

:global([data-theme='dark']) .spec-tag {
  background: rgba(6, 78, 59, 0.4);
  color: #A7F3D0;
}

.clinic-stats-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: var(--bg-card-subtle);
  border-radius: 12px;
  padding: 8px 6px;
  text-align: center;
  margin-bottom: 12px;
}

.c-stat-tile {
  display: flex;
  flex-direction: column;
}

.c-stat-val {
  font-size: 13px;
  font-weight: 900;
  color: #065F46;
}

:global([data-theme='dark']) .c-stat-val {
  color: #34D399;
}

.c-stat-lbl {
  font-size: 8.5px;
  color: var(--ink-muted);
  font-weight: 700;
}

.clinic-action-buttons {
  display: flex;
  gap: 8px;
}

.manage-slots-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  font-size: 11.5px;
  font-weight: 800;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #059669, #10B981);
}

.call-hotline-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: var(--radius-full);
}

.appointments-ledger-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.apt-ledger-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.apt-top-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.apt-pet-name {
  font-size: 12px;
  font-weight: 800;
  color: var(--ink-primary);
}

.apt-reason {
  display: block;
  font-size: 10.5px;
  color: var(--ink-secondary);
}

.apt-status-chip {
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.apt-status-chip.confirmed {
  background: #ECFDF5;
  color: #065F46;
}

.apt-time-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10.5px;
  color: var(--ink-muted);
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px dashed var(--border-light);
}

.apt-contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  color: var(--brand-primary);
}

/* ========================================= */
/* PARENT PROFILE STYLES */
/* ========================================= */
.persona-switch-dock {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 12px;
  padding: 2px 0;
}

.persona-switch-dock::-webkit-scrollbar {
  display: none;
}

.persona-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 4px;
  background: var(--bg-card);
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.persona-pill-btn:hover {
  transform: translateY(-1px);
  border-color: var(--brand-primary);
}

.persona-pill-btn.active {
  background: linear-gradient(135deg, #F3EEFF 0%, #FAF5FF 100%);
  border-color: #7C3AED;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.18);
}

:global([data-theme='dark']) .persona-pill-btn.active {
  background: rgba(88, 28, 135, 0.35);
  border-color: #A855F7;
}

.persona-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.persona-name {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ink-secondary);
}

.persona-pill-btn.active .persona-name {
  color: #6D28D9;
}

:global([data-theme='dark']) .persona-pill-btn.active .persona-name {
  color: #E9D5FF;
}

/* Pro Banner */
.pro-profile-banner {
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  border: 1.5px solid #FCD34D;
  border-radius: 16px;
  padding: 10px 12px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.15);
  transition: transform 0.15s ease;
}

:global([data-theme='dark']) .pro-profile-banner {
  background: rgba(45, 30, 10, 0.65);
  border-color: rgba(245, 158, 11, 0.4);
}

.pro-profile-banner:hover {
  transform: translateY(-1px);
}

.pro-profile-banner.pro-active {
  border-color: #D97706;
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
}

:global([data-theme='dark']) .pro-profile-banner.pro-active {
  background: rgba(55, 35, 10, 0.8);
}

.pro-banner-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pro-crown-badge {
  font-size: 24px;
}

.pro-banner-head {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pro-head-title {
  font-size: 12.5px;
  font-weight: 800;
  color: #92400E;
}

:global([data-theme='dark']) .pro-head-title {
  color: #FCD34D;
}

.pro-price-tag {
  font-size: 9px;
  font-weight: 900;
  color: #fff;
  background: #D97706;
  padding: 1px 5px;
  border-radius: var(--radius-full);
}

.pro-head-sub {
  font-size: 10.5px;
  color: #B45309;
  line-height: 1.25;
  margin-top: 1px;
}

:global([data-theme='dark']) .pro-head-sub {
  color: #FDE68A;
}

.pro-cta-pill {
  font-size: 11px;
  font-weight: 800;
  color: #92400E;
  background: #fff;
  padding: 5px 10px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

:global([data-theme='dark']) .pro-cta-pill {
  background: #78350F;
  color: #FDE68A;
}

/* Parent Hero Card */
.profile-hero-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.profile-hero-card.ghost-active-border {
  border-color: #8B5CF6;
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.18);
}

.hero-identity-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.hero-avatar-frame {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--brand-primary);
  flex-shrink: 0;
}

.hero-avatar-frame.pro-gold-frame {
  border-color: #F59E0B;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
}

.hero-main-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.pro-crown-tag {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 13px;
  background: #FEF3C7;
  border: 1.5px solid #F59E0B;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
}

.ghost-icon-tag {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: #7C3AED;
  color: #fff;
  font-size: 11px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1.5px solid #fff;
}

.hero-bio-col {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.name-badge-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hero-display-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.inline-crown {
  font-size: 13px;
  margin-left: 2px;
}

.species-chip {
  font-size: 9.5px;
  font-weight: 800;
  background: #F3EEFF;
  color: #7C3AED;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.sub-location-line {
  font-size: 10.5px;
  color: var(--ink-muted);
  margin-top: 1px;
}

.hero-bio-paragraph {
  font-size: 11px;
  color: var(--ink-secondary);
  line-height: 1.35;
  margin-top: 3px;
}

/* Vitals */
.pet-vitals-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 10px;
}

.vital-tile {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 8px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vital-tile:hover {
  transform: translateY(-1px);
}

.vital-icon-wrap {
  font-size: 16px;
  flex-shrink: 0;
}

.vital-info {
  display: flex;
  flex-direction: column;
}

.vital-number-row {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.vital-val {
  font-size: 12px;
  font-weight: 900;
  color: var(--ink-primary);
}

.vital-trend {
  font-size: 8.5px;
  font-weight: 800;
  color: #059669;
}

.vital-sparkle {
  font-size: 8.5px;
  font-weight: 800;
  color: #D97706;
}

.vital-lbl {
  font-size: 8.5px;
  color: var(--ink-muted);
  font-weight: 700;
}

/* Milestones */
.pet-milestones-track {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 12px;
}

.pet-milestones-track::-webkit-scrollbar {
  display: none;
}

.milestone-badge {
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
}

.milestone-badge.gold {
  background: #FEF3C7;
  border-color: #FCD34D;
  color: #92400E;
}

/* Action Buttons */
.profile-action-buttons {
  display: flex;
  gap: 8px;
}

.passport-btn {
  flex: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 800;
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
}

.edit-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
}

/* Ghost Toggle */
.ghost-toggle-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 12px;
}

.ghost-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ghost-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.ghost-title {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.ghost-desc {
  font-size: 10px;
  color: var(--ink-muted);
}

.custom-switch {
  width: 38px;
  height: 22px;
  background: var(--border-medium);
  border-radius: var(--radius-full);
  padding: 2px;
  transition: background 0.2s ease;
}

.custom-switch.on {
  background: #7C3AED;
}

.switch-ball {
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.custom-switch.on .switch-ball {
  transform: translateX(16px);
}

/* Media Grid */
.media-tabs-bar {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 8px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-muted);
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.tab-btn.active {
  color: var(--brand-primary);
  border-bottom-color: var(--brand-primary);
}

.memories-photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  border-radius: 12px;
  overflow: hidden;
}

.photo-cell {
  aspect-ratio: 1;
  background: var(--bg-card-subtle);
  overflow: hidden;
  cursor: pointer;
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.photo-cell:hover .grid-image {
  transform: scale(1.05);
}

/* Toast */
.profile-toast-bar {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 18, 42, 0.95);
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
  z-index: 999;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.toast-slide-enter-active, .toast-slide-leave-active {
  transition: all 0.25s ease;
}

.toast-slide-enter-from, .toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

/* Fresh User Empty States */
.add-pet-pill-btn {
  background: rgba(148, 125, 238, 0.1) !important;
  border: 1px dashed var(--primary) !important;
  color: var(--primary) !important;
}

.plus-ico {
  font-size: 14px;
  font-weight: 800;
  color: var(--primary);
}

.empty-memories-card {
  text-align: center;
  padding: 32px 20px;
  background: var(--bg-card);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-xl);
  margin-top: 8px;
}

.empty-mem-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.empty-mem-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 6px;
}

.empty-mem-sub {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 16px;
}

.bark-cta-btn {
  padding: 10px 20px;
  font-size: 12.5px;
  font-weight: 700;
  border-radius: var(--radius-full);
  margin: 0 auto;
}
</style>
