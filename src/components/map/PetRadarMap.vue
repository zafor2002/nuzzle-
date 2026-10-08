<template>
  <div class="pet-radar-map-wrapper">
    <!-- Clean, Streamlined Top Bar (Unified Scroll + Floating Layer Trigger) -->
    <div class="radar-top-controls">
      <div class="radar-pills-bar">
        <!-- Scrollable Category & Cluster Chips -->
        <div class="pills-scroll-track">
          <button 
            class="filter-pill" 
            :class="{ active: markerFilter === 'all' }"
            @click="setMarkerFilter('all')"
          >
            📍 All ({{ lostPinsCount + clinicPinsCount + qrPinsCount }})
          </button>
          <button 
            class="filter-pill lost-pill" 
            :class="{ active: markerFilter === 'lost' }"
            @click="setMarkerFilter('lost')"
          >
            🚨 Lost ({{ lostPinsCount }})
          </button>
          <button 
            class="filter-pill clinic-pill" 
            :class="{ active: markerFilter === 'clinic' }"
            @click="setMarkerFilter('clinic')"
          >
            🏥 ICU Clinics ({{ clinicPinsCount }})
          </button>
          <button 
            class="filter-pill qr-pill" 
            :class="{ active: markerFilter === 'qr' }"
            @click="setMarkerFilter('qr')"
          >
            🏷️ QR Pins ({{ qrPinsCount }})
          </button>

          <span class="pill-divider-dot">·</span>

          <!-- Quick Cluster Jumps -->
          <button 
            v-for="cluster in clusters" 
            :key="cluster.name"
            class="cluster-chip"
            :class="{ active: activeCluster === cluster.name }"
            @click="jumpToCluster(cluster)"
          >
            {{ cluster.name }}
          </button>
        </div>

        <!-- Google Maps Floating Layer Selector Trigger -->
        <div class="layer-selector-wrap">
          <button 
            id="btn-toggle-map-layers" 
            class="layer-icon-trigger" 
            :class="{ 'menu-open': isLayerMenuOpen }"
            @click.stop="isLayerMenuOpen = !isLayerMenuOpen"
            title="Google Map Styles"
          >
            <Layers :size="16" />
          </button>

          <!-- Layer Switcher Dropdown Popover -->
          <div v-if="isLayerMenuOpen" class="layer-popover-dropdown" @click.stop>
            <span class="popover-title">Map Type</span>
            <button 
              class="popover-btn" 
              :class="{ active: mapLayerType === 'roadmap' }"
              @click="switchMapLayer('roadmap'); isLayerMenuOpen = false"
            >
              <span>🗺️ Standard Road</span>
            </button>
            <button 
              class="popover-btn" 
              :class="{ active: mapLayerType === 'satellite' }"
              @click="switchMapLayer('satellite'); isLayerMenuOpen = false"
            >
              <span>🛰️ Satellite Hybrid</span>
            </button>
            <button 
              class="popover-btn" 
              :class="{ active: mapLayerType === 'terrain' }"
              @click="switchMapLayer('terrain'); isLayerMenuOpen = false"
            >
              <span>🏔️ Topo Terrain</span>
            </button>
            <button 
              class="popover-btn" 
              :class="{ active: mapLayerType === 'carto' }"
              @click="switchMapLayer('carto'); isLayerMenuOpen = false"
            >
              <span>🏙️ Clean CartoDB</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Leaflet Map Container -->
    <div ref="mapContainer" class="leaflet-map-canvas" @click="isLayerMenuOpen = false"></div>

    <!-- Floating Slim Radar Sweep Pill (Unobtrusive & Clean) -->
    <div class="radar-hud-pill">
      <div class="hud-pill-lead">
        <span class="radar-pulse-dot"></span>
        <span class="hud-pill-label">5-Mile Radar</span>
      </div>
      <div class="hud-pill-toggles">
        <button 
          v-for="r in radiusOptions" 
          :key="r.km"
          class="radius-mini-btn"
          :class="{ active: selectedRadiusKm === r.km }"
          @click="setRadius(r.km)"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <!-- Active Pin Detailed Preview Drawer (Lost Pet or Clinic or QR Tag) -->
    <div v-if="selectedTarget" class="map-target-drawer" :class="selectedTarget.type">
      <button class="drawer-close-btn" @click="selectedTarget = null" title="Close">
        <X :size="16" />
      </button>

      <!-- 1. LOST PET SELECTED -->
      <div v-if="selectedTarget.type === 'lost'" class="drawer-content">
        <div class="drawer-header-row">
          <div class="pet-thumb-wrap">
            <img :src="selectedTarget.data.imageUrl" :alt="selectedTarget.data.petName" class="drawer-pet-img" />
            <span class="lost-tag-beacon">🚨 LOST</span>
          </div>
          <div class="drawer-main-meta">
            <div class="drawer-title-line">
              <h4 class="drawer-pet-name">{{ selectedTarget.data.petName }}</h4>
              <span v-if="selectedTarget.data.reward" class="drawer-reward-badge">🏆 {{ selectedTarget.data.reward }}</span>
            </div>
            <span class="drawer-sub-meta">{{ selectedTarget.data.species }} • {{ selectedTarget.data.breed }}</span>
            <div class="drawer-loc-line">
              <MapPin :size="13" class="loc-pin" />
              <span>{{ selectedTarget.data.location }}</span>
            </div>
          </div>
        </div>

        <p class="drawer-desc">{{ selectedTarget.data.description }}</p>

        <!-- Actions: Direct Call & 5-Mile Geo-Blast -->
        <div class="drawer-actions-grid">
          <a :href="'tel:' + selectedTarget.data.contactPhone" class="btn-solid call-btn">
            <Phone :size="15" />
            <span>Call: {{ selectedTarget.data.contactPhone }}</span>
          </a>
          <button class="btn-solid geo-blast-btn" @click="handleOpenGeoBlast(selectedTarget.data)">
            <Radio :size="15" class="radar-pulse-icon" />
            <span>5-Mile Geo-Blast (৳499)</span>
          </button>
        </div>
      </div>

      <!-- 2. CLINIC SELECTED -->
      <div v-else-if="selectedTarget.type === 'clinic'" class="drawer-content">
        <div class="drawer-header-row">
          <div class="clinic-icon-box">
            🏥
          </div>
          <div class="drawer-main-meta">
            <div class="drawer-title-line">
              <h4 class="drawer-pet-name">{{ selectedTarget.data.clinicName }}</h4>
              <span class="open-now-badge">● Open Now 24/7</span>
            </div>
            <span class="drawer-sub-meta">{{ selectedTarget.data.name }} (Lead Vet)</span>
            <div class="drawer-loc-line">
              <MapPin :size="13" class="loc-pin" />
              <span>{{ selectedTarget.data.location }} • ~{{ selectedTarget.data.distanceMiles || 1.8 }} km away</span>
            </div>
          </div>
        </div>

        <div class="clinic-specialties-row">
          <span v-for="s in selectedTarget.data.specialties" :key="s" class="clinic-spec-chip">
            {{ s }}
          </span>
        </div>

        <div class="drawer-actions-grid">
          <a :href="'tel:' + (selectedTarget.data.phone || '+8801711998877')" class="btn-solid call-btn clinic">
            <Phone :size="15" />
            <span>Hotline: {{ selectedTarget.data.phone || '+880 1711-998877' }}</span>
          </a>
          <button class="btn-solid book-btn" @click="bookClinic(selectedTarget.data)">
            <Calendar :size="15" />
            <span>Book Emergency Slot</span>
          </button>
        </div>
      </div>

      <!-- 3. SMART QR COLLAR GPS PIN SELECTED -->
      <div v-else-if="selectedTarget.type === 'qr'" class="drawer-content">
        <div class="drawer-header-row">
          <div class="qr-pin-box">
            🏷️
          </div>
          <div class="drawer-main-meta">
            <div class="drawer-title-line">
              <h4 class="drawer-pet-name">{{ selectedTarget.data.name }}'s Smart QR Tag</h4>
              <span class="qr-sync-badge">✓ Realtime GPS Sync</span>
            </div>
            <span class="drawer-sub-meta">{{ selectedTarget.data.species }} • {{ selectedTarget.data.breed }}</span>
            <div class="drawer-loc-line">
              <MapPin :size="13" class="loc-pin" />
              <span>{{ selectedTarget.data.lastScannedGps?.address }}</span>
            </div>
          </div>
        </div>

        <div class="qr-status-box">
          <span class="qr-timestamp">⏱️ Last Scanned: {{ selectedTarget.data.lastScannedGps?.scannedAt }}</span>
          <span class="qr-chip-id">Microchip / Tag ID: {{ selectedTarget.data.microchipId }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { MapPin, Phone, Radio, Calendar, X, Layers } from 'lucide-vue-next';
import L from 'leaflet';
import { 
  lostFoundList, 
  vets, 
  pets, 
  radarMapCenter, 
  openGeoBlastModal, 
  setTab 
} from '../../stores/appStore';
import type { LostFoundPost, Vet } from '../../types';

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let radarCircle: L.Circle | null = null;
let markerLayerGroup: L.LayerGroup | null = null;
let currentTileLayer: L.TileLayer | null = null;

const markerFilter = ref<'all' | 'lost' | 'clinic' | 'qr'>('all');
const activeCluster = ref('Banani');
const selectedRadiusKm = ref(8); // 8 km ~= 5 miles
const selectedTarget = ref<{ type: 'lost' | 'clinic' | 'qr'; data: any } | null>(null);
const isLayerMenuOpen = ref(false);

// Google Maps Free Live Tile Stream Options (Standard, Satellite, Terrain)
const mapLayerType = ref<'roadmap' | 'satellite' | 'terrain' | 'carto'>('roadmap');

const googleMapTiles = {
  roadmap: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  satellite: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', // Google Hybrid: High-Res Satellite + Street Labels
  terrain: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',  // Google Terrain
  carto: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
};

function switchMapLayer(layer: 'roadmap' | 'satellite' | 'terrain' | 'carto') {
  mapLayerType.value = layer;
  if (!map) return;
  if (currentTileLayer) {
    map.removeLayer(currentTileLayer);
  }
  const isCarto = layer === 'carto';
  currentTileLayer = L.tileLayer(googleMapTiles[layer], {
    maxZoom: isCarto ? 19 : 20,
    subdomains: isCarto ? 'abcd' : ['mt0', 'mt1', 'mt2', 'mt3']
  }).addTo(map);
}

const radiusOptions = [
  { km: 3, label: '2 Mi' },
  { km: 8, label: '5 Mi (Radar)' },
  { km: 14, label: 'Metro' },
];

const clusters = [
  { name: 'Banani', lat: 23.7937, lng: 90.4066 },
  { name: 'Gulshan', lat: 23.7925, lng: 90.4167 },
  { name: 'Dhanmondi', lat: 23.7538, lng: 90.3768 },
  { name: 'Uttara', lat: 23.8698, lng: 90.3986 },
  { name: 'Bashundhara', lat: 23.8151, lng: 90.4323 },
];

const lostPinsCount = computed(() => lostFoundList.filter(p => !p.isResolved && p.lat && p.lng).length);
const clinicPinsCount = computed(() => vets.filter(v => v.lat && v.lng).length);
const qrPinsCount = computed(() => pets.filter(p => p.lastScannedGps).length);

function initMap() {
  if (!mapContainer.value) return;

  const centerLat = radarMapCenter.value[0] || 23.7937;
  const centerLng = radarMapCenter.value[1] || 90.4066;

  map = L.map(mapContainer.value, {
    center: [centerLat, centerLng],
    zoom: 13,
    zoomControl: false,
    attributionControl: false
  });

  // Google Maps Free Live Tile Stream (Direct Google Tile Server, No API Key Required)
  currentTileLayer = L.tileLayer(googleMapTiles[mapLayerType.value], {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }).addTo(map);

  markerLayerGroup = L.layerGroup().addTo(map);

  drawRadarCircle([centerLat, centerLng], selectedRadiusKm.value);
  renderMarkers();
}

function drawRadarCircle(center: [number, number], radiusKm: number) {
  if (!map) return;
  if (radarCircle) {
    radarCircle.remove();
  }

  // Draw 5-mile pulsating radar radius
  radarCircle = L.circle(center, {
    radius: radiusKm * 1000,
    color: '#F43F5E',
    weight: 2,
    opacity: 0.85,
    dashArray: '6, 6',
    fillColor: '#F43F5E',
    fillOpacity: 0.12
  }).addTo(map);
}

function renderMarkers() {
  if (!map || !markerLayerGroup) return;
  markerLayerGroup.clearLayers();

  // 1. Lost Pet Markers
  if (markerFilter.value === 'all' || markerFilter.value === 'lost') {
    lostFoundList.forEach(pet => {
      if (pet.lat && pet.lng && !pet.isResolved) {
        const isSelected = selectedTarget.value?.type === 'lost' && selectedTarget.value.data.id === pet.id;
        
        const lostIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="radar-lost-beacon ${isSelected ? 'selected' : ''}">
              <div class="beacon-pulse-ring"></div>
              <div class="beacon-avatar-frame">
                <img src="${pet.imageUrl}" alt="${pet.petName}" class="beacon-img" />
              </div>
              <span class="beacon-name-pill">🚨 ${pet.petName}</span>
            </div>
          `,
          iconSize: [42, 54],
          iconAnchor: [21, 48]
        });

        const marker = L.marker([pet.lat, pet.lng], { icon: lostIcon });
        marker.on('click', () => {
          selectedTarget.value = { type: 'lost', data: pet };
          if (map) map.panTo([pet.lat!, pet.lng!]);
        });
        markerLayerGroup!.addLayer(marker);
      }
    });
  }

  // 2. 24/7 Clinic Markers
  if (markerFilter.value === 'all' || markerFilter.value === 'clinic') {
    vets.forEach(clinic => {
      if (clinic.lat && clinic.lng) {
        const isSelected = selectedTarget.value?.type === 'clinic' && selectedTarget.value.data.id === clinic.id;

        const clinicIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="radar-clinic-beacon ${isSelected ? 'selected' : ''}">
              <div class="clinic-pulse-ring"></div>
              <div class="clinic-badge-frame">
                <span>🏥</span>
              </div>
              <span class="clinic-name-pill">24/7 ICU</span>
            </div>
          `,
          iconSize: [38, 48],
          iconAnchor: [19, 42]
        });

        const marker = L.marker([clinic.lat, clinic.lng], { icon: clinicIcon });
        marker.on('click', () => {
          selectedTarget.value = { type: 'clinic', data: clinic };
          if (map) map.panTo([clinic.lat!, clinic.lng!]);
        });
        markerLayerGroup!.addLayer(marker);
      }
    });
  }

  // 3. Smart QR Collar GPS Pin
  if (markerFilter.value === 'all' || markerFilter.value === 'qr') {
    pets.forEach(pet => {
      if (pet.lastScannedGps) {
        const qrIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="radar-qr-beacon">
              <div class="qr-pulse-ring"></div>
              <div class="qr-badge-frame">
                <span>🏷️</span>
              </div>
              <span class="qr-name-pill">${pet.name} (QR GPS)</span>
            </div>
          `,
          iconSize: [38, 48],
          iconAnchor: [19, 42]
        });

        const marker = L.marker([pet.lastScannedGps.lat, pet.lastScannedGps.lng], { icon: qrIcon });
        marker.on('click', () => {
          selectedTarget.value = { type: 'qr', data: pet };
          if (map) map.panTo([pet.lastScannedGps!.lat, pet.lastScannedGps!.lng]);
        });
        markerLayerGroup!.addLayer(marker);
      }
    });
  }
}

function setMarkerFilter(filter: 'all' | 'lost' | 'clinic' | 'qr') {
  markerFilter.value = filter;
  renderMarkers();
}

function jumpToCluster(cluster: { name: string; lat: number; lng: number }) {
  activeCluster.value = cluster.name;
  radarMapCenter.value = [cluster.lat, cluster.lng];
  if (map) {
    map.flyTo([cluster.lat, cluster.lng], 13.5, { duration: 1.2 });
    drawRadarCircle([cluster.lat, cluster.lng], selectedRadiusKm.value);
  }
}

function setRadius(km: number) {
  selectedRadiusKm.value = km;
  if (map && radarCircle) {
    const center = radarCircle.getLatLng();
    drawRadarCircle([center.lat, center.lng], km);
  }
}

function handleOpenGeoBlast(pet: LostFoundPost) {
  openGeoBlastModal(pet);
}

function bookClinic(_clinic: Vet) {
  setTab('vets');
}

watch(radarMapCenter, (newCenter) => {
  if (map && newCenter) {
    map.panTo(newCenter);
    drawRadarCircle(newCenter, selectedRadiusKm.value);
  }
});

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.pet-radar-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
}

/* Streamlined top controls */
.radar-top-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 400;
  pointer-events: none;
}

.radar-pills-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
}

.pills-scroll-track {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  flex: 1;
  padding: 2px 0;
}

.pills-scroll-track::-webkit-scrollbar {
  display: none;
}

.filter-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(8px);
  color: #334155;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.filter-pill:hover {
  background: #ffffff;
  transform: translateY(-1px);
}

.filter-pill.active {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.25);
}

.filter-pill.lost-pill.active {
  background: #f43f5e;
  color: #ffffff;
  border-color: #e11d48;
  box-shadow: 0 2px 8px rgba(244, 63, 94, 0.35);
}

.filter-pill.clinic-pill.active {
  background: #10b981;
  color: #ffffff;
  border-color: #059669;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.35);
}

.filter-pill.qr-pill.active {
  background: #0ea5e9;
  color: #ffffff;
  border-color: #0284c7;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.35);
}

.pill-divider-dot {
  color: #94a3b8;
  font-weight: 800;
  font-size: 14px;
  user-select: none;
  padding: 0 2px;
}

.cluster-chip {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: #475569;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cluster-chip:hover {
  background: #ffffff;
  color: #0f172a;
}

.cluster-chip.active {
  background: #6366f1;
  color: #ffffff;
  border-color: #4f46e5;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

/* Layer selector popover */
.layer-selector-wrap {
  position: relative;
  flex-shrink: 0;
}

.layer-icon-trigger {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
}

.layer-icon-trigger:hover,
.layer-icon-trigger.menu-open {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}

.layer-popover-dropdown {
  position: absolute;
  top: 38px;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 155px;
  z-index: 500;
  animation: popoverFadeIn 0.15s ease;
}

@keyframes popoverFadeIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.popover-title {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  padding: 4px 8px 2px;
}

.popover-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: #334155;
  padding: 7px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.12s ease;
}

.popover-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.popover-btn.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
}

/* Map canvas */
.leaflet-map-canvas {
  flex: 1;
  width: 100%;
  height: 100%;
  z-index: 10;
}

/* Slim Unobtrusive Floating HUD Pill */
.radar-hud-pill {
  position: absolute;
  top: 50px;
  left: 12px;
  z-index: 400;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-full);
  padding: 3px 6px 3px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

.hud-pill-lead {
  display: flex;
  align-items: center;
  gap: 6px;
}

.radar-pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f43f5e;
  box-shadow: 0 0 6px #f43f5e;
  animation: pulseDot 1.4s infinite;
}

@keyframes pulseDot {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.35); opacity: 0.5; }
  100% { transform: scale(0.9); opacity: 1; }
}

.hud-pill-label {
  font-size: 10.5px;
  font-weight: 700;
  color: #f8fafc;
  white-space: nowrap;
}

.hud-pill-toggles {
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px;
  border-radius: var(--radius-full);
}

.radius-mini-btn {
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.12s ease;
}

.radius-mini-btn:hover {
  color: #ffffff;
}

.radius-mini-btn.active {
  background: #f43f5e;
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(244, 63, 94, 0.4);
}

/* Dark theme adjustments */
:root[class~="dark"] .filter-pill,
:root[class~="dark"] .cluster-chip,
:root[class~="dark"] .layer-icon-trigger {
  background: rgba(30, 41, 59, 0.92);
  color: #cbd5e1;
  border-color: rgba(255, 255, 255, 0.08);
}

:root[class~="dark"] .layer-popover-dropdown {
  background: rgba(30, 41, 59, 0.98);
  border-color: rgba(255, 255, 255, 0.1);
}

:root[class~="dark"] .popover-btn {
  color: #cbd5e1;
}

:root[class~="dark"] .popover-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

:root[class~="dark"] .popover-btn.active {
  background: rgba(37, 99, 235, 0.25);
  color: #60a5fa;
}

/* Bottom Preview Drawer */
.map-target-drawer {
  position: absolute;
  bottom: 68px;
  left: 10px;
  right: 10px;
  z-index: 500;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 11px 13px;
  animation: slideUpDrawer 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.map-target-drawer.lost {
  border-color: #FDA4AF;
}

.map-target-drawer.clinic {
  border-color: #A7F3D0;
}

.map-target-drawer.qr {
  border-color: #BAE6FD;
}

@keyframes slideUpDrawer {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.drawer-close-btn {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #F1F5F9;
  border: none;
  display: grid;
  place-items: center;
  color: #64748B;
  cursor: pointer;
  transition: all 0.15s ease;
}

.drawer-close-btn:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.drawer-header-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 6px;
}

.pet-thumb-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid #F43F5E;
}

.drawer-pet-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lost-tag-beacon {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #F43F5E;
  color: #fff;
  font-size: 7.5px;
  font-weight: 800;
  text-align: center;
  padding: 1px 0;
}

.clinic-icon-box, .qr-pin-box {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #D1FAE5;
  display: grid;
  place-items: center;
  font-size: 20px;
  flex-shrink: 0;
}

.qr-pin-box {
  background: #E0F2FE;
}

.drawer-main-meta {
  flex: 1;
  min-width: 0;
}

.drawer-title-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.drawer-pet-name {
  font-size: 14px;
  font-weight: 800;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer-reward-badge {
  font-size: 9.5px;
  font-weight: 800;
  background: #FEF3C7;
  color: #B45309;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  border: 1px solid #FDE68A;
}

.open-now-badge {
  font-size: 9px;
  font-weight: 800;
  color: #059669;
  background: #D1FAE5;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.qr-sync-badge {
  font-size: 9px;
  font-weight: 800;
  color: #0284C7;
  background: #E0F2FE;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.drawer-sub-meta {
  font-size: 11px;
  color: #64748B;
  font-weight: 600;
}

.drawer-loc-line {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  color: #475569;
  margin-top: 1px;
}

.loc-pin {
  color: #F43F5E;
}

.drawer-desc {
  font-size: 11.5px;
  color: #334155;
  line-height: 1.3;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.drawer-actions-grid {
  display: flex;
  gap: 6px;
}

.call-btn, .geo-blast-btn, .book-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 7px 10px;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  border: none;
}

.call-btn {
  background: #0284C7;
  color: #fff;
}

.call-btn.clinic {
  background: #059669;
}

.geo-blast-btn {
  background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
  color: #fff;
  box-shadow: 0 3px 10px rgba(225, 29, 72, 0.35);
}

.book-btn {
  background: #7C3AED;
  color: #fff;
}

.clinic-specialties-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.clinic-spec-chip {
  font-size: 9.5px;
  font-weight: 700;
  background: #F1F5F9;
  color: #475569;
  padding: 2px 6px;
  border-radius: 4px;
}

.qr-status-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 10.5px;
  color: #475569;
}

:root[class~="dark"] .map-target-drawer {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

:root[class~="dark"] .drawer-close-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

:root[class~="dark"] .drawer-pet-name {
  color: #f8fafc;
}

:root[class~="dark"] .drawer-desc {
  color: #cbd5e1;
}

:root[class~="dark"] .drawer-loc-line {
  color: #94a3b8;
}

:root[class~="dark"] .clinic-spec-chip {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

:root[class~="dark"] .qr-status-box {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}
</style>

<!-- Global styles for custom Leaflet HTML markers -->
<style>
.custom-leaflet-marker {
  background: transparent !important;
  border: none !important;
}

/* Lost Pet Radar Beacon Marker */
.radar-lost-beacon {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.radar-lost-beacon:hover, .radar-lost-beacon.selected {
  transform: scale(1.15) translateY(-4px);
}

.beacon-pulse-ring {
  position: absolute;
  top: 3px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(244, 63, 94, 0.4);
  animation: lostPulse 1.8s infinite;
  z-index: 1;
}

@keyframes lostPulse {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}

.beacon-avatar-frame {
  position: relative;
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2.5px solid #F43F5E;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
  background: #fff;
}

.beacon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.beacon-name-pill {
  position: relative;
  z-index: 3;
  margin-top: -4px;
  background: #BE123C;
  color: #fff;
  font-size: 9.5px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0,0,0,0.25);
}

/* 24/7 Clinic Marker */
.radar-clinic-beacon {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.clinic-pulse-ring {
  position: absolute;
  top: 2px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.45);
  animation: clinicPulse 2.2s infinite;
}

@keyframes clinicPulse {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

.clinic-badge-frame {
  position: relative;
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #10B981;
  display: grid;
  place-items: center;
  font-size: 16px;
  border: 2px solid #fff;
  box-shadow: 0 3px 8px rgba(0,0,0,0.25);
}

.clinic-name-pill {
  margin-top: 1px;
  background: #047857;
  color: #fff;
  font-size: 8.5px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 6px;
  white-space: nowrap;
}

/* Smart QR Marker */
.radar-qr-beacon {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.qr-pulse-ring {
  position: absolute;
  top: 2px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(14, 165, 233, 0.45);
  animation: clinicPulse 2.5s infinite;
}

.qr-badge-frame {
  position: relative;
  z-index: 2;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #0EA5E9;
  display: grid;
  place-items: center;
  font-size: 14px;
  border: 2px solid #fff;
  box-shadow: 0 3px 8px rgba(0,0,0,0.25);
}

.qr-name-pill {
  margin-top: 1px;
  background: #0284C7;
  color: #fff;
  font-size: 8.5px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 6px;
  white-space: nowrap;
}
</style>
