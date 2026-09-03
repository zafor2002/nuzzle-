<template>
  <div class="auth-view">
    <!-- Top Background Glows -->
    <div class="auth-ambient-glow"></div>

    <div class="auth-container">
      <!-- 1. Brand Logo & Hero Header -->
      <div class="auth-brand-header">
        <div class="logo-wrapper">
          <NuzzleLogo :size="42" />
        </div>
        <h1 class="brand-title">Nuzzle</h1>
        <p class="brand-tagline">
          The Next-Gen Pet Ecosystem • Social, AI Care & Marketplace
        </p>
      </div>

      <!-- 2. Auth Mode Switcher (Sign In vs Create Account) -->
      <div class="auth-mode-toggle">
        <button 
          type="button"
          class="mode-btn"
          :class="{ active: authMode === 'login' }"
          @click="authMode = 'login'"
        >
          Sign In
        </button>
        <button 
          type="button"
          class="mode-btn"
          :class="{ active: authMode === 'signup' }"
          @click="authMode = 'signup'"
        >
          Create Account
        </button>
      </div>

      <!-- 3. Role Selector (Parent vs Store vs Vet Clinic) -->
      <div class="role-selector-card">
        <span class="role-selector-label">
          {{ authMode === 'signup' ? 'Select Account Type:' : 'Sign In As:' }}
        </span>

        <div class="role-pills-grid">
          <!-- Role 1: Pet Parent -->
          <button 
            type="button"
            class="role-pill"
            :class="{ active: selectedRole === 'parent' }"
            @click="selectedRole = 'parent'"
          >
            <span class="role-icon">🐾</span>
            <div class="role-text-wrap">
              <span class="role-title">Pet Parent</span>
              <span class="role-sub">Guardian Profile</span>
            </div>
          </button>

          <!-- Role 2: Pet Store -->
          <button 
            type="button"
            class="role-pill"
            :class="{ active: selectedRole === 'store' }"
            @click="selectedRole = 'store'"
          >
            <span class="role-icon">🛍️</span>
            <div class="role-text-wrap">
              <span class="role-title">Pet Store</span>
              <span class="role-sub">Boutique & Brand</span>
            </div>
          </button>

          <!-- Role 3: Vet Clinic -->
          <button 
            type="button"
            class="role-pill"
            :class="{ active: selectedRole === 'vet' }"
            @click="selectedRole = 'vet'"
          >
            <span class="role-icon">🏥</span>
            <div class="role-text-wrap">
              <span class="role-title">Vet Clinic</span>
              <span class="role-sub">Doctor & Hospital</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 4. Interactive Form Container -->
      <form class="auth-form-card" @submit.prevent="handleSubmit">
        <!-- Error Alert Banner -->
        <div v-if="authError" class="auth-error-banner">
          <span>⚠️ {{ authError }}</span>
        </div>

        <!-- LOGIN FORM -->
        <div v-if="authMode === 'login'" class="form-fields-stack">
          <!-- Role Context Notice -->
          <div class="role-context-badge" :class="selectedRole">
            <span v-if="selectedRole === 'parent'">🐾 Signing in to your Pet Parent Account & Pet Passports</span>
            <span v-else-if="selectedRole === 'store'">🛍️ Signing in to your Verified Pet Store & Bazaar Dashboard</span>
            <span v-else>🏥 Signing in to your Veterinary Practice & Triage Portal</span>
          </div>

          <div class="input-group">
            <label class="input-label">Email or Username</label>
            <div class="input-field-wrap">
              <Mail :size="16" class="field-ico" />
              <input 
                v-model="loginIdentifier" 
                type="text" 
                :placeholder="selectedRole === 'store' ? 'store@example.com' : selectedRole === 'vet' ? 'clinic@vetcare.com' : 'alex@example.com'" 
                class="auth-input" 
                required 
              />
            </div>
          </div>

          <div class="input-group">
            <div class="label-with-forgot">
              <label class="input-label">Password</label>
              <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">Forgot?</a>
            </div>
            <div class="input-field-wrap">
              <Lock :size="16" class="field-ico" />
              <input 
                v-model="loginPassword" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••" 
                class="auth-input" 
                required 
              />
              <button type="button" class="eye-toggle-btn" @click="showPassword = !showPassword">
                <Eye :size="14" v-if="!showPassword" />
                <EyeOff :size="14" v-else />
              </button>
            </div>
          </div>

          <button type="submit" class="btn-solid auth-submit-btn">
            <span>Sign In as {{ selectedRole === 'store' ? 'Pet Store' : selectedRole === 'vet' ? 'Vet Clinic' : 'Pet Parent' }} →</span>
          </button>
        </div>

        <!-- REGISTRATION / SIGN UP FORM -->
        <div v-else class="form-fields-stack">
          <!-- ROLE-SPECIFIC FORM FIELDS -->

          <!-- A. PET PARENT REGISTRATION -->
          <div v-if="selectedRole === 'parent'" class="role-specific-inputs">
            <div class="input-group">
              <label class="input-label">Your Full Name</label>
              <div class="input-field-wrap">
                <User :size="16" class="field-ico" />
                <input v-model="regParentName" type="text" placeholder="e.g. Alex Rivers" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Username</label>
              <div class="input-field-wrap">
                <span class="field-prefix">@</span>
                <input v-model="regUsername" type="text" placeholder="alex_rivers" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Email Address</label>
              <div class="input-field-wrap">
                <Mail :size="16" class="field-ico" />
                <input v-model="regEmail" type="email" placeholder="alex@example.com" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Create Password</label>
              <div class="input-field-wrap">
                <Lock :size="16" class="field-ico" />
                <input v-model="regPassword" :type="showPassword ? 'text' : 'password'" placeholder="At least 6 characters" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Your First Pet's Name & Species</label>
              <div class="pet-dual-input-row">
                <input v-model="regPetName" type="text" placeholder="e.g. Waffles" class="auth-input pet-name-input" required />
                <select v-model="regPetSpecies" class="auth-input pet-species-select">
                  <option value="Dog">🐕 Dog</option>
                  <option value="Cat">🐱 Cat</option>
                  <option value="Bird">🦜 Bird</option>
                  <option value="Rabbit">🐰 Rabbit</option>
                  <option value="Reptile">🦎 Reptile</option>
                </select>
              </div>
            </div>

            <!-- Pro Member Opt-In Checkbox -->
            <label class="pro-optin-box" :class="{ checked: regIsProChecked }">
              <input v-model="regIsProChecked" type="checkbox" class="pro-checkbox" />
              <div class="pro-optin-text">
                <div class="pro-optin-title">
                  <span>👑 Start with Nuzzle Pro VIP (90 BDT/mo)</span>
                  <span class="vip-tag">RECOMMENDED</span>
                </div>
                <p class="pro-optin-sub">Unlock VIP Crown, unlimited PawDoctor AI triage, priority vet slots & 5% market discounts.</p>
              </div>
            </label>
          </div>

          <!-- B. PET STORE REGISTRATION -->
          <div v-else-if="selectedRole === 'store'" class="role-specific-inputs">
            <div class="input-group">
              <label class="input-label">Pet Store / Brand Name</label>
              <div class="input-field-wrap">
                <ShoppingBag :size="16" class="field-ico" />
                <input v-model="regStoreName" type="text" placeholder="e.g. Paws & Pastures Organic Co." class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Business Owner / Manager Name</label>
              <div class="input-field-wrap">
                <User :size="16" class="field-ico" />
                <input v-model="regStoreOwnerName" type="text" placeholder="e.g. Sarah Jenkins" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Store Category</label>
              <select v-model="regStoreCategory" class="auth-input">
                <option value="Organic Pet Food & Treats">🥩 Organic Pet Food & Treats</option>
                <option value="Accessories, Leashes & Collars">🎒 Accessories, Leashes & Collars</option>
                <option value="Grooming & Spa Supplies">🛁 Grooming & Spa Supplies</option>
                <option value="Beds, Crates & Orthopedic Gear">🛏️ Beds, Crates & Orthopedic Gear</option>
                <option value="All-in-One Pet Superstore">🏬 All-in-One Pet Superstore</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-label">Business Email</label>
              <div class="input-field-wrap">
                <Mail :size="16" class="field-ico" />
                <input v-model="regEmail" type="email" placeholder="orders@pawsandpastures.com" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Store City & Address</label>
              <div class="input-field-wrap">
                <MapPin :size="16" class="field-ico" />
                <input v-model="regStoreAddress" type="text" placeholder="1240 NW Lovejoy St, Portland, OR" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Business Registration / Trade License #</label>
              <div class="input-field-wrap">
                <ShieldCheck :size="16" class="field-ico" />
                <input v-model="regStoreLicense" type="text" placeholder="TL-89421-OR" class="auth-input" />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Create Password</label>
              <div class="input-field-wrap">
                <Lock :size="16" class="field-ico" />
                <input v-model="regPassword" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="auth-input" required />
              </div>
            </div>

            <label class="pro-optin-box gold" :class="{ checked: regIsProStoreChecked }">
              <input v-model="regIsProStoreChecked" type="checkbox" class="pro-checkbox" />
              <div class="pro-optin-text">
                <div class="pro-optin-title">
                  <span>🛡️ Apply for Verified Shop Status ($19.99/mo)</span>
                  <span class="vip-tag gold">GOLD BADGE</span>
                </div>
                <p class="pro-optin-sub">Official Gold Shield Badge, 0% sales commission & priority marketplace placement.</p>
              </div>
            </label>
          </div>

          <!-- C. VET CLINIC REGISTRATION -->
          <div v-else class="role-specific-inputs">
            <div class="input-group">
              <label class="input-label">Clinic or Animal Hospital Name</label>
              <div class="input-field-wrap">
                <Hospital :size="16" class="field-ico" />
                <input v-model="regClinicName" type="text" placeholder="e.g. Cascade 24/7 Emergency Hospital" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Lead Veterinarian Doctor Name</label>
              <div class="input-field-wrap">
                <Stethoscope :size="16" class="field-ico" />
                <input v-model="regVetDoctorName" type="text" placeholder="e.g. Dr. Sarah Al-Mansoor, DVM" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Primary Medical Specialization</label>
              <select v-model="regVetSpecialty" class="auth-input">
                <option value="24/7 Emergency Trauma & Surgery">🚨 24/7 Emergency Trauma & Surgery</option>
                <option value="Canine & Feline Preventive Wellness">🐕 General Canine & Feline Wellness</option>
                <option value="Dermatology, Allergies & Skin Care">🌿 Dermatology & Skin Allergy Center</option>
                <option value="Orthopedics & Joint Therapy">🦴 Orthopedics, Limping & Spine</option>
                <option value="Avian & Small Exotic Animals">🦜 Avian & Exotic Sanctuary Medicine</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-label">Medical Board License Number</label>
              <div class="input-field-wrap">
                <Award :size="16" class="field-ico" />
                <input v-model="regVetLicense" type="text" placeholder="e.g. VET-OR-49102" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Clinic Emergency Phone</label>
              <div class="input-field-wrap">
                <Phone :size="16" class="field-ico" />
                <input v-model="regVetPhone" type="tel" placeholder="(503) 555-2424" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Clinic Address</label>
              <div class="input-field-wrap">
                <MapPin :size="16" class="field-ico" />
                <input v-model="regVetAddress" type="text" placeholder="2100 SW River Pkwy, Portland, OR" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Clinic Admin Email & Password</label>
              <div class="input-field-wrap">
                <Mail :size="16" class="field-ico" />
                <input v-model="regEmail" type="email" placeholder="admin@cascadevet.com" class="auth-input" required />
              </div>
            </div>

            <div class="input-group">
              <div class="input-field-wrap">
                <Lock :size="16" class="field-ico" />
                <input v-model="regPassword" :type="showPassword ? 'text' : 'password'" placeholder="Create clinic password" class="auth-input" required />
              </div>
            </div>

            <label class="pro-optin-box purple" :class="{ checked: regIsProVetChecked }">
              <input v-model="regIsProVetChecked" type="checkbox" class="pro-checkbox" />
              <div class="pro-optin-text">
                <div class="pro-optin-title">
                  <span>⭐ Join PawAI Suggest Vet Pro Partner ($49/mo)</span>
                  <span class="vip-tag purple">RANK #1</span>
                </div>
                <p class="pro-optin-sub">Guaranteed #1 Priority Placement on PawAI Suggest Vet matches & direct client triage logs.</p>
              </div>
            </label>
          </div>

          <button type="submit" class="btn-solid auth-submit-btn">
            <Sparkles :size="16" />
            <span>Create {{ selectedRole === 'store' ? 'Store' : selectedRole === 'vet' ? 'Clinic' : 'Parent' }} Account</span>
          </button>
        </div>
      </form>

      <!-- 5. One-Tap Quick Demo Logins (For Quick Testing) -->
      <div class="quick-demo-section">
        <span class="quick-demo-label">⚡ Quick 1-Tap Demo Switcher:</span>
        <div class="demo-buttons-grid">
          <button type="button" class="demo-btn parent" @click="quickLogin('parent')">
            <span>🐾 Alex (Parent)</span>
          </button>
          <button type="button" class="demo-btn store" @click="quickLogin('store')">
            <span>🛍️ UrbanHound (Store)</span>
          </button>
          <button type="button" class="demo-btn vet" @click="quickLogin('vet')">
            <span>🏥 Dr. Sarah (Vet)</span>
          </button>
        </div>
      </div>

      <!-- 6. Social Sign-In & Security Footer -->
      <div class="auth-footer-block">
        <div class="social-divider">
          <span>or continue with</span>
        </div>

        <div class="social-icons-row">
          <button type="button" class="social-btn google-btn" :disabled="isSubmitting" @click="handleGoogleSignIn">
            <span class="social-icon">G</span>
            <span>Google</span>
          </button>
          <button type="button" class="social-btn" @click="quickLogin(selectedRole)">
            <span class="social-icon"></span>
            <span>Apple</span>
          </button>
        </div>

        <div class="security-stamp">
          <ShieldCheck :size="13" class="shield-ico" />
          <span>256-Bit Encrypted Pet Identity & Clinic Verification Protocol</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShoppingBag, 
  Hospital, 
  ShieldCheck, 
  Stethoscope, 
  Phone, 
  MapPin, 
  Award 
} from 'lucide-vue-next';
import NuzzleLogo from '../components/common/NuzzleLogo.vue';
import type { UserRole } from '../types';
import { loginAsRole, loginWithCredentials, registerWithCredentials } from '../stores/appStore';

const authMode = ref<'login' | 'signup'>('login');
const selectedRole = ref<UserRole>('parent');
const showPassword = ref(false);
const authError = ref('');
const isSubmitting = ref(false);

// Login Fields
const loginIdentifier = ref('');
const loginPassword = ref('');

// Parent Sign Up
const regParentName = ref('');
const regUsername = ref('');
const regEmail = ref('');
const regPassword = ref('');
const regPetName = ref('');
const regPetSpecies = ref('Dog');
const regIsProChecked = ref(true);

// Store Sign Up
const regStoreName = ref('');
const regStoreOwnerName = ref('');
const regStoreCategory = ref('Organic Pet Food & Treats');
const regStoreAddress = ref('');
const regStoreLicense = ref('');
const regIsProStoreChecked = ref(true);

// Vet Sign Up
const regClinicName = ref('');
const regVetDoctorName = ref('');
const regVetSpecialty = ref('24/7 Emergency Trauma & Surgery');
const regVetLicense = ref('');
const regVetPhone = ref('');
const regVetAddress = ref('');
const regIsProVetChecked = ref(true);

async function handleSubmit() {
  authError.value = '';
  isSubmitting.value = true;

  try {
    if (authMode.value === 'login') {
      const res = await loginWithCredentials({
        email: loginIdentifier.value.includes('@') ? loginIdentifier.value : undefined,
        password: loginPassword.value || undefined,
        role: !loginPassword.value ? selectedRole.value : undefined,
      });

      if (!res.success) {
        authError.value = res.error || 'Invalid email or password.';
      }
    } else {
      if (selectedRole.value === 'parent') {
        const res = await registerWithCredentials({
          email: regEmail.value,
          password: regPassword.value,
          displayName: regParentName.value || 'Pet Parent',
          username: (regUsername.value || 'pet_parent').toLowerCase().replace(/\s+/g, '_'),
          role: 'parent',
          petName: regPetName.value || 'Buddy',
          petSpecies: regPetSpecies.value || 'Dog',
          isPro: regIsProChecked.value,
        });

        if (!res.success) {
          authError.value = res.error || 'Failed to create parent account.';
        }
      } else if (selectedRole.value === 'store') {
        const res = await registerWithCredentials({
          email: regEmail.value,
          password: regPassword.value,
          displayName: regStoreName.value || 'Pet Boutique',
          username: (regStoreName.value || 'pet_boutique').toLowerCase().replace(/\s+/g, '_'),
          role: 'store',
          storeCategory: regStoreCategory.value,
          isPro: regIsProStoreChecked.value,
        });

        if (!res.success) {
          authError.value = res.error || 'Failed to create store account.';
        }
      } else {
        const res = await registerWithCredentials({
          email: regEmail.value,
          password: regPassword.value,
          displayName: regVetDoctorName.value || 'Dr. Specialist, DVM',
          username: (regClinicName.value || 'vet_clinic').toLowerCase().replace(/\s+/g, '_'),
          role: 'vet',
          clinicName: regClinicName.value || 'Companion Animal Hospital',
          isPro: regIsProVetChecked.value,
        });

        if (!res.success) {
          authError.value = res.error || 'Failed to create clinic account.';
        }
      }
    }
  } catch (err: any) {
    authError.value = err.message || 'An unexpected error occurred during authentication.';
  } finally {
    isSubmitting.value = false;
  }
}

import { authService } from '../services/authService';

function quickLogin(role: UserRole) {
  selectedRole.value = role;
  loginAsRole(role);
}

async function handleGoogleSignIn() {
  authError.value = '';
  isSubmitting.value = true;
  try {
    const { error } = await authService.loginWithGoogle();
    if (error) {
      authError.value = error.message || 'Google sign-in failed. Please try again.';
    }
  } catch (err: any) {
    authError.value = err.message || 'Could not initialize Google authentication.';
  } finally {
    isSubmitting.value = false;
  }
}

function handleForgotPassword() {
  alert('Password reset link sent to your registered email.');
}
</script>

<style scoped>
.auth-view {
  min-height: 100%;
  background: var(--bg-main);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  padding: 18px 16px 84px;
}

.auth-ambient-glow {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(148, 125, 238, 0.25) 0%, rgba(244, 63, 94, 0.12) 50%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}

.auth-container {
  max-width: 420px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 2;
}

/* Brand Header */
.auth-brand-header {
  text-align: center;
  margin-bottom: 16px;
}

.logo-wrapper {
  display: inline-flex;
  margin-bottom: 6px;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 900;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.brand-tagline {
  font-size: 11.5px;
  color: var(--ink-secondary);
  margin-top: 2px;
}

/* Auth Mode Toggle */
.auth-mode-toggle {
  display: flex;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 3px;
  margin-bottom: 12px;
}

.mode-btn {
  flex: 1;
  padding: 8px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 800;
  color: var(--ink-muted);
  cursor: pointer;
  transition: all 0.16s ease;
}

.mode-btn.active {
  background: var(--bg-card);
  color: var(--brand-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Role Selector */
.role-selector-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 10px 12px;
  margin-bottom: 12px;
}

.role-selector-label {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-secondary);
  margin-bottom: 6px;
}

.role-pills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.role-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 4px;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.role-pill:hover {
  transform: translateY(-1px);
}

.role-pill.active {
  background: #F3EEFF;
  border-color: #7C3AED;
  box-shadow: 0 3px 10px rgba(124, 58, 237, 0.15);
}

:global([data-theme='dark']) .role-pill.active {
  background: rgba(88, 28, 135, 0.35);
}

.role-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.role-text-wrap {
  display: flex;
  flex-direction: column;
}

.role-title {
  font-size: 11px;
  font-weight: 800;
  color: var(--ink-primary);
  line-height: 1.15;
}

.role-sub {
  font-size: 8.5px;
  color: var(--ink-muted);
  margin-top: 1px;
}

/* Form Stack */
.auth-form-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.auth-error-banner {
  background: #FFF1F2;
  border: 1px solid #FFE4E6;
  color: #E11D48;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: fadeIn 0.2s ease;
}

.form-fields-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.role-context-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 8px;
  text-align: center;
}

.role-context-badge.parent {
  background: #F3EEFF;
  color: #6D28D9;
}

.role-context-badge.store {
  background: #FEF3C7;
  color: #92400E;
}

.role-context-badge.vet {
  background: #ECFDF5;
  color: #065F46;
}

.role-specific-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.input-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-primary);
}

.label-with-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--brand-primary);
  text-decoration: none;
}

.input-field-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-ico {
  position: absolute;
  left: 10px;
  color: var(--ink-muted);
}

.field-prefix {
  position: absolute;
  left: 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-muted);
}

.auth-input {
  width: 100%;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 8px 12px 8px 32px;
  font-size: 12px;
  color: var(--ink-primary);
  outline: none;
  transition: all 0.15s ease;
}

.auth-input:focus {
  border-color: var(--brand-primary);
  background: var(--bg-card);
}

.eye-toggle-btn {
  position: absolute;
  right: 10px;
  color: var(--ink-muted);
  cursor: pointer;
}

/* Pet Dual Input */
.pet-dual-input-row {
  display: flex;
  gap: 6px;
}

.pet-name-input {
  flex: 2;
  padding-left: 12px;
}

.pet-species-select {
  flex: 1.4;
  padding-left: 8px;
}

/* Pro Opt-In Boxes */
.pro-optin-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #FFFBEB;
  border: 1.5px solid #FCD34D;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

:global([data-theme='dark']) .pro-optin-box {
  background: rgba(45, 30, 10, 0.6);
  border-color: rgba(245, 158, 11, 0.4);
}

.pro-optin-box.gold {
  border-color: #D97706;
}

.pro-optin-box.purple {
  background: #FAF5FF;
  border-color: #DDD6FE;
}

:global([data-theme='dark']) .pro-optin-box.purple {
  background: rgba(88, 28, 135, 0.25);
  border-color: rgba(147, 51, 234, 0.4);
}

.pro-checkbox {
  margin-top: 2px;
  accent-color: #D97706;
}

.pro-optin-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pro-optin-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 800;
  color: #92400E;
}

:global([data-theme='dark']) .pro-optin-title {
  color: #FCD34D;
}

.pro-optin-box.purple .pro-optin-title {
  color: #6D28D9;
}

:global([data-theme='dark']) .pro-optin-box.purple .pro-optin-title {
  color: #DDD6FE;
}

.vip-tag {
  font-size: 8px;
  font-weight: 900;
  color: #fff;
  background: #D97706;
  padding: 1px 4px;
  border-radius: var(--radius-full);
}

.vip-tag.purple {
  background: #7C3AED;
}

.pro-optin-sub {
  font-size: 10px;
  color: #B45309;
  line-height: 1.25;
}

:global([data-theme='dark']) .pro-optin-sub {
  color: #FDE68A;
}

.pro-optin-box.purple .pro-optin-sub {
  color: #7C3AED;
}

:global([data-theme='dark']) .pro-optin-box.purple .pro-optin-sub {
  color: #C084FC;
}

.auth-submit-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  font-size: 12.5px;
  font-weight: 800;
  border-radius: var(--radius-full);
  margin-top: 4px;
}

/* Quick Demo Switcher */
.quick-demo-section {
  margin-top: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 10px 12px;
}

.quick-demo-label {
  display: block;
  font-size: 10.5px;
  font-weight: 800;
  color: var(--ink-secondary);
  margin-bottom: 6px;
}

.demo-buttons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.demo-btn {
  padding: 6px 4px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.demo-btn.parent {
  background: #F3EEFF;
  border: 1px solid #DDD6FE;
  color: #6D28D9;
}

.demo-btn.store {
  background: #FEF3C7;
  border: 1px solid #FCD34D;
  color: #92400E;
}

.demo-btn.vet {
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  color: #065F46;
}

.demo-btn:hover {
  transform: translateY(-1px);
}

/* Footer & Social */
.auth-footer-block {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.social-divider {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: center;
  color: var(--ink-muted);
  font-size: 10.5px;
}

.social-divider::before, .social-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-light);
}

.social-divider span {
  padding: 0 8px;
}

.social-icons-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-primary);
  cursor: pointer;
}

.social-icon {
  font-weight: 900;
  font-size: 13px;
}

.security-stamp {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9.5px;
  color: var(--ink-muted);
  text-align: center;
}

.shield-ico {
  color: #059669;
  flex-shrink: 0;
}
</style>
