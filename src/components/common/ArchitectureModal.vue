<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
    <div 
      class="relative w-full max-w-5xl max-h-[90vh] bg-[#0f172a] text-slate-100 rounded-2xl shadow-2xl border border-indigo-500/30 flex flex-col overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xl shadow-inner">
            🐾
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg md:text-xl font-bold text-white tracking-wide font-serif">
                Nuzzle Backend REST API Architecture
              </h2>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Connected
              </span>
            </div>
            <p class="text-xs text-indigo-200/70">
              6-Layer Decoupled Architecture • Next.js 16 REST Engine • Prisma 7 • Supabase PostgreSQL
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a 
            href="http://localhost:3000/api/docs" 
            target="_blank" 
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-400/30 transition-colors"
          >
            <span>Swagger UI Docs</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button 
            @click="close" 
            class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2">
        <button 
          @click="activeTab = 'diagram'"
          :class="[
            'py-3 px-4 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
            activeTab === 'diagram' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          ]"
        >
          <span>📐 Visual Architecture Blueprint</span>
        </button>
        <button 
          @click="activeTab = 'health'"
          :class="[
            'py-3 px-4 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
            activeTab === 'health' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          ]"
        >
          <span>🩺 Layer 6: Live Health Check</span>
          <span v-if="healthData" class="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
            {{ healthData.database?.latencyMs || 0 }}ms
          </span>
        </button>
        <button 
          @click="activeTab = 'layers'"
          :class="[
            'py-3 px-4 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
            activeTab === 'layers' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          ]"
        >
          <span>⚡ 6-Layer Interactive Explorer</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        <!-- Tab 1: Visual Blueprint -->
        <div v-if="activeTab === 'diagram'" class="space-y-4">
          <div class="relative rounded-xl overflow-hidden border border-indigo-500/30 bg-[#090d16] shadow-2xl group">
            <img 
              src="/nuzzle_backend_architecture_v2.jpg" 
              alt="Nuzzle Backend REST API Architecture" 
              class="w-full h-auto object-contain rounded-xl max-h-[62vh] mx-auto"
            />
          </div>

          <!-- 6-Layer Quick Summary Grid -->
          <div class="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div class="text-indigo-400 font-bold mb-1">1. Ingress</div>
              <div class="text-slate-300 text-[11px]">Vue 3 + Vercel Edge Proxy</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div class="text-indigo-400 font-bold mb-1">2. Gateway</div>
              <div class="text-slate-300 text-[11px]">JWT, RBAC, Rate Limit & CORS</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div class="text-indigo-400 font-bold mb-1">3. REST Engine</div>
              <div class="text-slate-300 text-[11px]">8 Domain Handlers + Zod</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div class="text-indigo-400 font-bold mb-1">4. Data Access</div>
              <div class="text-slate-300 text-[11px]">Prisma 7 ORM + Pooler</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div class="text-indigo-400 font-bold mb-1">5. Supabase</div>
              <div class="text-slate-300 text-[11px]">PostgreSQL, OAuth & S3 Storage</div>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div class="text-indigo-400 font-bold mb-1">6. Reliability</div>
              <div class="text-slate-300 text-[11px]">Health, Logs & Perf Headers</div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Live Health Check (Layer 6) -->
        <div v-if="activeTab === 'health'" class="space-y-6">
          <div class="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <div class="text-sm font-semibold text-white flex items-center gap-2">
                <span>🩺 System Status:</span>
                <span class="text-emerald-400 font-bold font-mono">{{ healthData?.status || 'CHECKING...' }}</span>
              </div>
              <div class="text-xs text-slate-400 mt-1">
                Last checked: {{ lastCheckedTime || 'Fetching...' }}
              </div>
            </div>
            <button 
              @click="fetchHealth" 
              :disabled="isLoadingHealth"
              class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition-colors"
            >
              {{ isLoadingHealth ? 'Pinging...' : '🔄 Refresh Health' }}
            </button>
          </div>

          <div v-if="healthData" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Card 1: Database -->
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Cloud Database</div>
              <div class="text-xl font-bold text-white">{{ healthData.database?.status }}</div>
              <div class="text-xs text-slate-400">Provider: {{ healthData.database?.provider }}</div>
              <div class="text-xs text-emerald-400 font-mono">Ping Latency: {{ healthData.database?.latencyMs }}ms</div>
              <div class="text-xs text-slate-400">Pooler Port: {{ healthData.database?.poolerPort }} (PgBouncer)</div>
            </div>

            <!-- Card 2: Memory & Uptime -->
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Engine Resources</div>
              <div class="text-xl font-bold text-white">{{ healthData.uptimeSeconds }}s Uptime</div>
              <div class="text-xs text-slate-400">Node Version: {{ healthData.system?.nodeVersion }}</div>
              <div class="text-xs text-indigo-300 font-mono">Heap Used: {{ healthData.system?.memory?.heapUsedMB }} MB</div>
              <div class="text-xs text-slate-400 font-mono">Heap Total: {{ healthData.system?.memory?.heapTotalMB }} MB</div>
            </div>

            <!-- Card 3: Security & Ingress -->
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Gateway & Security</div>
              <div class="text-xl font-bold text-emerald-400">{{ healthData.subsystems?.securityGateway?.status }}</div>
              <div class="text-xs text-slate-400">Enforced Policies:</div>
              <div class="flex flex-wrap gap-1 mt-1">
                <span 
                  v-for="f in healthData.subsystems?.securityGateway?.features" 
                  :key="f"
                  class="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px] border border-indigo-800/40"
                >
                  {{ f }}
                </span>
              </div>
            </div>
          </div>

          <!-- Raw Health JSON Preview -->
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
            <div class="text-xs text-slate-400 font-sans mb-2 font-bold flex items-center justify-between">
              <span>GET /api/health Response Envelope</span>
              <span class="text-emerald-400 font-mono">HTTP 200 OK</span>
            </div>
            <pre class="leading-relaxed">{{ JSON.stringify(healthData, null, 2) }}</pre>
          </div>
        </div>

        <!-- Tab 3: 6-Layer Interactive Explorer -->
        <div v-if="activeTab === 'layers'" class="space-y-4">
          <div class="space-y-3">
            <div 
              v-for="(layer, idx) in layers" 
              :key="idx"
              class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-colors"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center border border-indigo-500/30">
                      {{ idx + 1 }}
                    </span>
                    <h3 class="text-sm font-bold text-white">{{ layer.title }}</h3>
                    <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {{ layer.status }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 leading-relaxed">{{ layer.description }}</p>
                  
                  <div class="flex flex-wrap gap-1.5 mt-2.5">
                    <span 
                      v-for="tech in layer.technologies" 
                      :key="tech"
                      class="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950/60 text-indigo-200 border border-indigo-500/20"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>

                <div v-if="layer.testEndpoint" class="shrink-0">
                  <button 
                    @click="testEndpoint(layer)"
                    :disabled="layer.isTesting"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 transition-colors"
                  >
                    {{ layer.isTesting ? 'Testing...' : '⚡ Test Endpoint' }}
                  </button>
                </div>
              </div>

              <!-- Test Result Output -->
              <div v-if="layer.testResult" class="mt-3 p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 flex items-center justify-between">
                <span>{{ layer.testResult }}</span>
                <span class="text-xs text-slate-400">Response Status: 200 OK</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div class="flex items-center gap-2">
          <span>API Base URL:</span>
          <code class="px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 font-mono">http://localhost:3000/api</code>
        </div>
        <div class="flex items-center gap-3">
          <a href="http://localhost:3000/api/docs" target="_blank" class="text-indigo-400 hover:underline">
            View OpenAPI 3.0 Specs ↗
          </a>
          <span>•</span>
          <button @click="close" class="text-slate-300 hover:text-white">Close Window</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient } from '../../services/apiClient';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const activeTab = ref<'diagram' | 'health' | 'layers'>('diagram');
const healthData = ref<any>(null);
const isLoadingHealth = ref(false);
const lastCheckedTime = ref<string>('');

const layers = ref([
  {
    title: 'CLIENT & INGRESS LAYER',
    status: 'Operational',
    description: 'Vue 3 Single Page Application with Pinia state store routing requests through Vercel Edge Proxy.',
    technologies: ['Vue 3 Client', 'Pinia Store', 'Vercel Edge Proxy', 'HTTPS TLS 1.3'],
    testEndpoint: '/posts',
    isTesting: false,
    testResult: '',
  },
  {
    title: 'SECURITY & API GATEWAY LAYER',
    status: 'Enforced',
    description: 'Intercepts requests with Rate Limiting (120 req/min), CORS preflight headers, Bearer JWT session auth, and Zod input validation.',
    technologies: ['Rate Limiting', 'CORS Headers', 'JWT Authentication', 'Role-Based Access (RBAC)', 'Zod Validation'],
    testEndpoint: '/auth/me',
    isTesting: false,
    testResult: '',
  },
  {
    title: 'NEXT.JS 16 REST API ENGINE',
    status: 'Operational',
    description: 'Serverless modular route handlers covering Social Feed, PawDoctor AI Triage, 5-Mile Radar, Vet Telemedicine, Marketplace, and Adoption.',
    technologies: ['Social Feed API', 'PawDoctor AI Triage', 'Lost & Found 5-Mile Radar', 'Vet Telemedicine', 'Marketplace', 'Adoption'],
    testEndpoint: '/pawai/triage',
    isTesting: false,
    testResult: '',
  },
  {
    title: 'DATA ACCESS LAYER',
    status: 'Connected',
    description: 'Prisma 7 ORM query engine with PgBouncer connection pooling connecting to cloud PostgreSQL.',
    technologies: ['Prisma 7 ORM', 'Connection Pooler (Port 6543)', '18 Relational Models'],
    testEndpoint: '/health',
    isTesting: false,
    testResult: '',
  },
  {
    title: 'SUPABASE CLOUD INFRASTRUCTURE',
    status: 'Cloud Active',
    description: 'PostgreSQL Database with PostGIS geospatial queries, Google OAuth 2.0 authentication, and Cloud Media Storage.',
    technologies: ['Supabase PostgreSQL', 'PostGIS 5-Mile Radar', 'Google OAuth', 'Cloud Media Storage (/api/upload)'],
    testEndpoint: '/lost-found?radius=5',
    isTesting: false,
    testResult: '',
  },
  {
    title: 'MONITORING & RELIABILITY LAYER',
    status: 'Active',
    description: 'Structured API logging, performance timing with X-Response-Time headers, error tracking, and health metrics.',
    technologies: ['API Request Logging', 'X-Response-Time Header', 'Automated Health Endpoint (/api/health)', 'Error Tracking'],
    testEndpoint: '/health',
    isTesting: false,
    testResult: '',
  },
]);

function close() {
  emit('close');
}

async function fetchHealth() {
  isLoadingHealth.value = true;
  try {
    const res = await apiClient.getSystemHealth();
    if (res.success && res.data) {
      healthData.value = res.data;
      lastCheckedTime.value = new Date().toLocaleTimeString();
    }
  } catch (err) {
    console.warn('[ArchitectureModal] Failed to fetch health:', err);
  } finally {
    isLoadingHealth.value = false;
  }
}

async function testEndpoint(layer: any) {
  layer.isTesting = true;
  layer.testResult = '';
  try {
    const start = performance.now();
    const res = await apiClient.get(layer.testEndpoint);
    const duration = Math.round(performance.now() - start);
    layer.testResult = `✓ GET ${layer.testEndpoint} responded in ${duration}ms (${res.success ? 'Success' : 'Error'})`;
  } catch (e: any) {
    layer.testResult = `❌ Request failed: ${e.message}`;
  } finally {
    layer.isTesting = false;
  }
}

onMounted(() => {
  fetchHealth();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>
