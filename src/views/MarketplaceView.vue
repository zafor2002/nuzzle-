<template>
  <div class="marketplace-view">
    <TopBar title="🛍️ Pet Marketplace" />

    <div class="market-scroll-body">
      <!-- 1. Search & Action Row -->
      <div class="market-top-action">
        <div class="search-box">
          <Search :size="16" class="s-icon" />
          <input 
            v-model="marketSearch" 
            placeholder="Search organic food, GPS collars, beds, toys..." 
            class="s-input" 
          />
          <button v-if="marketSearch" class="clear-search-btn" @click="marketSearch = ''">
            <X :size="14" />
          </button>
        </div>

        <button class="sell-action-btn" @click="isSellModalOpen = true">
          <Plus :size="15" />
          <span>Sell Item</span>
        </button>
      </div>

      <!-- 2. Verified Shop Upgrade Pro Banner -->
      <div class="verified-shop-promo-card" @click="isVerifyModalOpen = true">
        <div class="promo-badge-cluster">
          <span class="gold-shield-icon">🛡️</span>
          <div class="promo-text-col">
            <div class="promo-headline">
              <span class="promo-title">Pet Shop & Food Brand Verification</span>
              <span class="verified-pro-tag">PRO BADGE</span>
            </div>
            <p class="promo-sub">
              Get the Gold Checkmark, 0% platform fees, and priority search placement for $19.99/mo.
            </p>
          </div>
        </div>
        <button class="get-verified-btn">
          <span>Get Verified</span>
          <ChevronRight :size="15" />
        </button>
      </div>

      <!-- 3. Filter Segment Tabs (Verified Shops vs Parents vs Categories) -->
      <div class="market-filter-scroll">
        <button 
          class="market-pill-btn"
          :class="{ active: sellerTypeFilter === 'all' && selectedCat === 'All' }"
          @click="resetFilters"
        >
          🐾 All Items ({{ marketplace.length }})
        </button>

        <button 
          class="market-pill-btn verified-filter"
          :class="{ active: sellerTypeFilter === 'verified_shop' }"
          @click="setSellerFilter('verified_shop')"
        >
          🏬 Verified Shops Only ({{ verifiedCount }})
        </button>

        <button 
          class="market-pill-btn parent-filter"
          :class="{ active: sellerTypeFilter === 'individual' }"
          @click="setSellerFilter('individual')"
        >
          👤 Pet Parent Pre-Loved ({{ parentCount }})
        </button>

        <button 
          v-for="cat in categories" 
          :key="cat"
          class="market-pill-btn"
          :class="{ active: selectedCat === cat && sellerTypeFilter === 'all' }"
          @click="setCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>

      <!-- 4. Marketplace Listings Grid -->
      <div class="items-grid" v-if="filteredItems.length > 0">
        <div 
          v-for="item in filteredItems" 
          :key="item.id"
          class="market-card"
        >
          <!-- Product Photo & Status Tags -->
          <div class="item-img-container">
            <img :src="item.imageUrl" :alt="item.title" class="item-img" />
            <span class="price-badge">${{ item.price }}</span>
            <span class="condition-tag" :class="item.condition.toLowerCase().replace(/\s+/g, '-')">
              {{ item.condition }}
            </span>

            <span v-if="item.isVerifiedShop" class="verified-store-tag">
              ✓ Verified Store
            </span>
          </div>

          <!-- Product Details -->
          <div class="item-details">
            <div class="seller-meta-row">
              <img :src="item.sellerAvatar" :alt="item.sellerName" class="seller-avatar-img" />
              <div class="seller-identity">
                <span class="seller-name-line">
                  {{ item.sellerName }}
                  <span v-if="item.isVerifiedShop" class="verified-check" title="Nuzzle Verified Pet Shop">✓</span>
                </span>
                <span class="seller-sub-badge" :class="{ 'verified-sub': item.isVerifiedShop }">
                  {{ item.shopBadge || (item.isVerifiedShop ? '✓ Verified Partner' : '👤 Pet Parent') }}
                  <span v-if="item.shopRating" class="rating-num"> • {{ item.shopRating }}★</span>
                </span>
              </div>
            </div>

            <h4 class="item-title">{{ item.title }}</h4>
            <span class="item-location-cat">{{ item.category }} • {{ item.location }}</span>
            <p class="item-desc">{{ item.description }}</p>

            <!-- Tags -->
            <div v-if="item.tags && item.tags.length" class="item-tags-row">
              <span v-for="t in item.tags" :key="t" class="mini-tag">#{{ t }}</span>
            </div>

            <!-- Action Buttons Row -->
            <div class="market-card-actions">
              <button class="btn-solid buy-instant-btn" @click="handleInstantBuy(item)">
                <ShoppingBag :size="14" />
                <span>Buy ${{ item.price }}</span>
              </button>

              <button class="btn-outline chat-seller-btn" @click="contactSeller(item)">
                <MessageSquare :size="14" />
                <span>Inquire</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-market-state">
        <span class="empty-icon">🛍️</span>
        <h4 class="empty-title">No listings found</h4>
        <p class="empty-sub">Try selecting another category or be the first to list an item!</p>
        <button class="btn-solid sell-fast-btn" @click="isSellModalOpen = true">
          + Post New Pet Item
        </button>
      </div>
    </div>

    <!-- 5. VERIFY PET SHOP PRO MODAL -->
    <div v-if="isVerifyModalOpen" class="modal-backdrop" @click.self="isVerifyModalOpen = false">
      <div class="verify-shop-modal">
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="modal-icon">🛡️</span>
            <div>
              <h3 class="modal-title">Get Nuzzle Verified Shop Badge</h3>
              <p class="modal-subtitle">Official Verification for Pet Food & Accessory Businesses</p>
            </div>
          </div>
          <button class="close-modal-btn" @click="isVerifyModalOpen = false">
            <X :size="18" />
          </button>
        </div>

        <div class="verify-benefits-grid">
          <div class="benefit-card">
            <span class="b-icon">🌟</span>
            <span class="b-text">Gold Verified Store Checkmark on all listings</span>
          </div>
          <div class="benefit-card">
            <span class="b-icon">⚡</span>
            <span class="b-text">Top Placement on Pet Feed & Search Results</span>
          </div>
          <div class="benefit-card">
            <span class="b-icon">🛡️</span>
            <span class="b-text">Direct In-App Checkout & Buyer Fraud Shield</span>
          </div>
          <div class="benefit-card">
            <span class="b-icon">🤖</span>
            <span class="b-text">AI Stock & Automatic Re-order Assistant</span>
          </div>
        </div>

        <!-- Verification Form -->
        <div class="verify-form">
          <label class="form-label">Shop / Brand Legal Name</label>
          <input v-model="verifyShopName" placeholder="e.g., Paws & Pastures Organic Co." class="form-input" />

          <label class="form-label">Primary Pet Specialization</label>
          <select v-model="verifyCategory" class="form-select">
            <option value="Food & Treats">Organic Pet Nutrition, Kibble & Treats</option>
            <option value="Accessories">Collars, GPS Tech, Harnesses & Leashes</option>
            <option value="Beds & Cages">Beds, Crates, Cages & Habitat Furniture</option>
            <option value="Health">Grooming, Flea & Tick, Supplements</option>
          </select>

          <!-- Pricing Tier Selection -->
          <label class="form-label">Verification Plan</label>
          <div class="plan-cards-row">
            <div 
              class="plan-card" 
              :class="{ selected: selectedPlan === 'monthly' }"
              @click="selectedPlan = 'monthly'"
            >
              <span class="plan-name">Monthly Pro</span>
              <span class="plan-price">$19.99 / mo</span>
              <span class="plan-note">Cancel anytime</span>
            </div>
            <div 
              class="plan-card annual" 
              :class="{ selected: selectedPlan === 'annual' }"
              @click="selectedPlan = 'annual'"
            >
              <span class="plan-badge">Save 35%</span>
              <span class="plan-name">Annual Partner</span>
              <span class="plan-price">$149 / yr</span>
              <span class="plan-note">$12.40 / mo billed annually</span>
            </div>
          </div>

          <button class="btn-solid activate-verify-btn" @click="handleActivateVerification">
            <span>Pay & Activate Verification ✓</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 6. SELL PET ITEM / LISTING MODAL -->
    <div v-if="isSellModalOpen" class="modal-backdrop" @click.self="isSellModalOpen = false">
      <div class="sell-item-modal">
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="modal-icon">📦</span>
            <div>
              <h3 class="modal-title">List a Pet Item for Sale</h3>
              <p class="modal-subtitle">Available to Pet Parents and Verified Boutiques</p>
            </div>
          </div>
          <button class="close-modal-btn" @click="isSellModalOpen = false">
            <X :size="18" />
          </button>
        </div>

        <div class="sell-form-scroll">
          <label class="form-label">Seller Account Type</label>
          <div class="seller-type-toggle">
            <button 
              type="button"
              class="type-pill" 
              :class="{ active: newSellerType === 'individual' }"
              @click="newSellerType = 'individual'"
            >
              👤 Pet Parent (Pre-Loved)
            </button>
            <button 
              type="button"
              class="type-pill" 
              :class="{ active: newSellerType === 'verified_shop' }"
              @click="newSellerType = 'verified_shop'"
            >
              🏬 Verified Boutique / Shop
            </button>
          </div>

          <label class="form-label">Item Title</label>
          <input v-model="newItemTitle" placeholder="e.g., Waterproof Orthopedic Memory Foam Bed" class="form-input" />

          <div class="form-row-2">
            <div>
              <label class="form-label">Category</label>
              <select v-model="newItemCategory" class="form-select">
                <option value="Food & Treats">Food & Treats</option>
                <option value="Accessories">Accessories & Leashes</option>
                <option value="Beds & Cages">Beds & Habitats</option>
                <option value="Toys">Toys & Enrichment</option>
                <option value="Apparel">Apparel & Coats</option>
                <option value="Health">Health & Grooming</option>
              </select>
            </div>

            <div>
              <label class="form-label">Price ($ USD)</label>
              <input v-model.number="newItemPrice" type="number" placeholder="25" class="form-input" />
            </div>
          </div>

          <div class="form-row-2">
            <div>
              <label class="form-label">Condition</label>
              <select v-model="newItemCondition" class="form-select">
                <option value="Brand New">Brand New (Unopened)</option>
                <option value="Like New">Like New (Gently used)</option>
                <option value="Good Condition">Good Condition</option>
              </select>
            </div>

            <div>
              <label class="form-label">Pickup / Ship City</label>
              <input v-model="newItemLocation" placeholder="e.g., Portland, OR" class="form-input" />
            </div>
          </div>

          <label class="form-label">Photo URL</label>
          <input v-model="newItemPhotoUrl" placeholder="https://images.unsplash.com/..." class="form-input" />

          <label class="form-label">Description & Sizing</label>
          <textarea 
            v-model="newItemDescription" 
            placeholder="Provide details on dimensions, ingredients, material, and pickup preference..." 
            class="form-textarea"
            rows="3"
          ></textarea>

          <button class="btn-solid submit-listing-btn" @click="handlePublishListing">
            <span>Publish Listing to Marketplace 🚀</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 7. INSTANT PURCHASE SUCCESS TOAST/MODAL -->
    <div v-if="purchasedItem" class="modal-backdrop" @click.self="purchasedItem = null">
      <div class="purchase-success-modal">
        <span class="success-paw">🎉</span>
        <h3 class="success-title">Order Confirmed!</h3>
        <p class="success-message">
          You purchased <strong>{{ purchasedItem.title }}</strong> for <strong>${{ purchasedItem.price }}</strong>.
        </p>
        <div class="order-summary-box">
          <div class="summary-line">
            <span>Seller:</span>
            <strong>{{ purchasedItem.sellerName }}</strong>
          </div>
          <div class="summary-line">
            <span>Estimated Delivery:</span>
            <strong>2-3 Business Days</strong>
          </div>
        </div>
        <button class="btn-solid full-width-btn" @click="purchasedItem = null">
          Back to Marketplace 🐾
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Plus, X, ChevronRight, ShoppingBag, MessageSquare } from 'lucide-vue-next';
import TopBar from '../components/layout/TopBar.vue';
import { 
  marketplace, 
  openChatWith, 
  addMarketListing, 
  verifyShopSubscription, 
  buyMarketItem, 
  owner 
} from '../stores/appStore';
import type { MarketplaceListing } from '../types';
import { marketplaceService } from '../services';

const marketSearch = ref('');
const selectedCat = ref('All');
const sellerTypeFilter = ref<'all' | 'verified_shop' | 'individual'>('all');
const categories = ['Food & Treats', 'Accessories', 'Beds & Cages', 'Toys', 'Apparel', 'Health'];

// Modals
const isVerifyModalOpen = ref(false);
const isSellModalOpen = ref(false);
const purchasedItem = ref<MarketplaceListing | null>(null);

// Verification Form State
const verifyShopName = ref('Pawsome Pet Goods Co.');
const verifyCategory = ref('Accessories');
const selectedPlan = ref<'monthly' | 'annual'>('monthly');

// New Listing Form State
const newSellerType = ref<'individual' | 'verified_shop'>('individual');
const newItemTitle = ref('');
const newItemCategory = ref<MarketplaceListing['category']>('Food & Treats');
const newItemPrice = ref<number>(30);
const newItemCondition = ref<'Brand New' | 'Like New' | 'Good Condition'>('Like New');
const newItemLocation = ref('Portland, OR');
const newItemPhotoUrl = ref('https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&auto=format&fit=crop&q=80');
const newItemDescription = ref('');

const verifiedCount = computed(() => marketplace.filter(i => i.isVerifiedShop).length);
const parentCount = computed(() => marketplace.filter(i => !i.isVerifiedShop).length);

const filteredItems = computed(() => {
  return marketplace.filter(item => {
    // Seller Type Filter
    if (sellerTypeFilter.value === 'verified_shop' && !item.isVerifiedShop) return false;
    if (sellerTypeFilter.value === 'individual' && item.isVerifiedShop) return false;

    // Category Filter
    if (selectedCat.value !== 'All' && item.category !== selectedCat.value) return false;

    // Search query
    if (marketSearch.value.trim()) {
      const q = marketSearch.value.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchSeller = item.sellerName.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchSeller || matchCat;
    }

    return true;
  });
});

function setSellerFilter(type: 'verified_shop' | 'individual') {
  sellerTypeFilter.value = type;
  selectedCat.value = 'All';
  marketplaceService.getListings().catch(() => {});
}

function setCategory(cat: string) {
  selectedCat.value = cat;
  sellerTypeFilter.value = 'all';
  marketplaceService.getListings(cat).catch(() => {});
}

function resetFilters() {
  selectedCat.value = 'All';
  sellerTypeFilter.value = 'all';
  marketSearch.value = '';
  marketplaceService.getListings().catch(() => {});
}

function contactSeller(item: MarketplaceListing) {
  openChatWith(
    item.sellerName,
    item.sellerAvatar,
    undefined,
    `Hi ${item.sellerName}! I am interested in "${item.title}" listed for $${item.price}. Is it available? 🐾`
  );
}

function handleInstantBuy(item: MarketplaceListing) {
  buyMarketItem(item.id);
  purchasedItem.value = item;
}

function handleActivateVerification() {
  if (!verifyShopName.value.trim()) return;
  const plan = selectedPlan.value === 'monthly' ? '$19.99/mo' : '$149/yr';
  verifyShopSubscription(verifyShopName.value, verifyCategory.value, plan);
  isVerifyModalOpen.value = false;
  alert(`🌟 Verification Activated! "${verifyShopName.value}" now has Official Nuzzle Gold Badge status.`);
}

function handlePublishListing() {
  if (!newItemTitle.value.trim()) {
    alert('Please enter an item title');
    return;
  }

  addMarketListing({
    title: newItemTitle.value,
    category: newItemCategory.value,
    price: Number(newItemPrice.value) || 10,
    description: newItemDescription.value || 'Quality pet supply in great condition!',
    imageUrl: newItemPhotoUrl.value || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&auto=format&fit=crop&q=80',
    condition: newItemCondition.value,
    sellerName: newSellerType.value === 'verified_shop' ? 'Verified Partner Shop' : owner.displayName,
    sellerAvatar: owner.avatarUrl,
    sellerType: newSellerType.value,
    isVerifiedShop: newSellerType.value === 'verified_shop',
    shopBadge: newSellerType.value === 'verified_shop' ? '✓ Verified Boutique' : '👤 Pet Parent',
    shopRating: newSellerType.value === 'verified_shop' ? 5.0 : undefined,
    location: newItemLocation.value || 'Local Pickup',
    stock: 1,
    tags: [newItemCategory.value.toLowerCase().replace(/\s+/g, '')]
  });

  isSellModalOpen.value = false;
  // Reset form
  newItemTitle.value = '';
  newItemDescription.value = '';
}
</script>

<style scoped>
.marketplace-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.market-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px 30px;
}

/* 1. Search & Action Row */
.market-top-action {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 7px 12px;
}

.s-icon {
  color: var(--ink-muted);
  flex-shrink: 0;
}

.s-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 12.5px;
  color: var(--ink-primary);
}

.clear-search-btn {
  color: var(--ink-muted);
  display: grid;
  place-items: center;
}

.sell-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
  border-radius: var(--radius-full);
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.sell-action-btn:hover {
  transform: translateY(-1px);
}

/* 2. Verified Shop Promo Card */
.verified-shop-promo-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  border: 1.5px solid #FCD34D;
  border-radius: 14px;
  padding: 10px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

:global([data-theme='dark']) .verified-shop-promo-card {
  background: rgba(45, 30, 10, 0.6);
  border-color: rgba(245, 158, 11, 0.4);
}

.verified-shop-promo-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.18);
}

.promo-badge-cluster {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gold-shield-icon {
  font-size: 20px;
}

.promo-text-col {
  display: flex;
  flex-direction: column;
}

.promo-headline {
  display: flex;
  align-items: center;
  gap: 5px;
}

.promo-title {
  font-size: 12.5px;
  font-weight: 800;
  color: #92400E;
}

:global([data-theme='dark']) .promo-title {
  color: #FCD34D;
}

.verified-pro-tag {
  font-size: 9px;
  font-weight: 900;
  color: #fff;
  background: #D97706;
  padding: 1px 5px;
  border-radius: var(--radius-full);
}

.promo-sub {
  font-size: 10.5px;
  color: #B45309;
  line-height: 1.3;
}

:global([data-theme='dark']) .promo-sub {
  color: #FDE68A;
}

.get-verified-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 800;
  color: #92400E;
  background: #fff;
  padding: 5px 9px;
  border-radius: var(--radius-full);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

:global([data-theme='dark']) .get-verified-btn {
  background: #78350F;
  color: #FDE68A;
}

/* 3. Filter Scroll */
.market-filter-scroll {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 10px;
}

.market-filter-scroll::-webkit-scrollbar {
  display: none;
}

.market-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 11px;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
}

.market-pill-btn:hover {
  background: #F3EEFF;
  border-color: #D5C8F2;
  color: var(--brand-primary);
}

.market-pill-btn.active {
  background: var(--brand-primary);
  color: #fff;
  border-color: transparent;
}

.market-pill-btn.verified-filter.active {
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
}

.market-pill-btn.parent-filter.active {
  background: linear-gradient(135deg, #7C3AED 0%, #947DEE 100%);
}

/* 4. Listings Grid */
.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.market-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.item-img-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: var(--bg-card-subtle);
  overflow: hidden;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-badge {
  position: absolute;
  top: 9px;
  left: 9px;
  background: var(--brand-primary);
  color: #fff;
  font-weight: 900;
  font-size: 13px;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.condition-tag {
  position: absolute;
  top: 9px;
  right: 9px;
  background: rgba(26, 18, 42, 0.75);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.condition-tag.brand-new {
  background: #059669;
}

.verified-store-tag {
  position: absolute;
  bottom: 8px;
  left: 9px;
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
  color: #fff;
  font-size: 9.5px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.item-details {
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.seller-meta-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.seller-avatar-img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-subtle);
}

.seller-identity {
  display: flex;
  flex-direction: column;
}

.seller-name-line {
  font-size: 12px;
  font-weight: 800;
  color: var(--ink-primary);
  display: flex;
  align-items: center;
  gap: 3px;
}

.verified-check {
  font-size: 10px;
  font-weight: 900;
  color: #D97706;
  background: #FEF3C7;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
}

.seller-sub-badge {
  font-size: 10px;
  font-weight: 600;
  color: var(--ink-muted);
}

.seller-sub-badge.verified-sub {
  color: #D97706;
  font-weight: 700;
}

.rating-num {
  color: #F59E0B;
}

.item-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink-primary);
  line-height: 1.35;
  margin-top: 2px;
}

.item-location-cat {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-muted);
}

.item-desc {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.item-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.mini-tag {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--brand-primary);
}

.market-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
}

.buy-instant-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
  padding: 7px;
  border-radius: var(--radius-full);
}

.chat-seller-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
  padding: 7px;
  border-radius: var(--radius-full);
}

/* Empty State */
.empty-market-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink-primary);
}

.empty-sub {
  font-size: 12px;
  color: var(--ink-muted);
  margin-bottom: 14px;
}

/* Modals */
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

.verify-shop-modal, .sell-item-modal, .purchase-success-modal {
  background: var(--bg-card);
  border-radius: 20px;
  width: 100%;
  max-width: 390px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-icon {
  font-size: 24px;
}

.modal-title {
  font-size: 14.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.modal-subtitle {
  font-size: 11px;
  color: var(--ink-muted);
}

.close-modal-btn {
  color: var(--ink-muted);
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
}

.verify-benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.benefit-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 8px;
}

.b-icon {
  font-size: 16px;
}

.b-text {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ink-secondary);
  line-height: 1.25;
}

.form-label {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink-secondary);
  margin: 8px 0 4px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12.5px;
  color: var(--ink-primary);
  outline: none;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.plan-cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 6px 0 12px;
}

.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
  border-radius: 12px;
  background: var(--bg-card-subtle);
  border: 1.5px solid var(--border-light);
  cursor: pointer;
  transition: all 0.15s ease;
}

.plan-card.selected {
  border-color: #D97706;
  background: #FFFBEB;
}

:global([data-theme='dark']) .plan-card.selected {
  background: rgba(217, 119, 6, 0.2);
}

.plan-badge {
  position: absolute;
  top: -7px;
  right: 6px;
  background: #059669;
  color: #fff;
  font-size: 8.5px;
  font-weight: 900;
  padding: 1px 5px;
  border-radius: var(--radius-full);
}

.plan-name {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ink-primary);
}

.plan-price {
  font-size: 13px;
  font-weight: 900;
  color: #D97706;
}

.plan-note {
  font-size: 9.5px;
  color: var(--ink-muted);
}

.activate-verify-btn, .submit-listing-btn {
  width: 100%;
  padding: 9px;
  font-size: 13px;
  font-weight: 800;
  border-radius: var(--radius-full);
  margin-top: 8px;
}

.seller-type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 6px;
}

.type-pill {
  padding: 6px 8px;
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--radius-full);
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  color: var(--ink-secondary);
  cursor: pointer;
}

.type-pill.active {
  background: var(--brand-primary);
  color: #fff;
  border-color: transparent;
}

/* Purchase Success */
.purchase-success-modal {
  text-align: center;
  padding: 24px 18px;
}

.success-paw {
  font-size: 44px;
}

.success-title {
  font-size: 17px;
  font-weight: 900;
  color: var(--ink-primary);
  margin-top: 6px;
}

.success-message {
  font-size: 12.5px;
  color: var(--ink-secondary);
  margin-top: 4px;
}

.order-summary-box {
  background: var(--bg-card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 10px 12px;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
}

.full-width-btn {
  width: 100%;
  padding: 9px;
  border-radius: var(--radius-full);
}
</style>
