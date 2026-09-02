const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();

// 16:9 Widescreen (13.333 x 7.5 inches)
pptx.defineLayout({ name: 'MODERN_16_9', width: 13.333, height: 7.5 });
pptx.layout = 'MODERN_16_9';

// Presentation Metadata
pptx.author = 'Abu Zafor, Nadim Rahman, Rizvi Sarker';
pptx.company = 'Nuzzle (Dhaka, Bangladesh)';
pptx.title = 'Nuzzle — RESTful API Architecture & Frontend-to-Backend Connection';
pptx.subject = 'Comprehensive Full-Stack REST API & Data Flow Architecture (Technopreneurship 2026)';

const OUTPUT_DIR = path.resolve(__dirname, '../presentation');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'Nuzzle_REST_API_Architecture.pptx');
const V2_OUTPUT_FILE = path.resolve(__dirname, '../Nuzzle_REST_API_Architecture.pptx');
const ROOT_OUTPUT_FILE = path.resolve(__dirname, '../../Nuzzle_REST_API_Architecture.pptx');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Soothing Lavender & Pearl White Color Palette
const COLORS = {
  bgSlide: 'FCFAFF',
  bgCard: 'FFFFFF',
  bgSubtle: 'F6F2FB',
  bgHeader: 'EDE7F6',
  primary: '947DEE',
  primaryDark: '7C3AED',
  accentPink: 'EC4899',
  textMain: '261E38',
  textMuted: '5F5377',
  textDim: '9589B0',
  border: 'D5C8F2',
  borderLight: 'EAE2F8',
  emerald: '10B981',
  rose: 'F43F5E',
  codeBg: '161726',
  codeText: 'E2E8F0',
  indigo: '6366F1',
  amber: 'F59E0B'
};

function createBaseSlide(slideNumber, eyebrowText, titleText, speakerNotes) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgSlide };

  // Top Header Bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.333, h: 0.65,
    fill: { color: COLORS.bgHeader },
    line: { color: COLORS.border, width: 1 }
  });

  slide.addText('🐾 Nuzzle Engine', {
    x: 0.8, y: 0.12, w: 4.0, h: 0.4,
    fontSize: 14, fontFace: 'Outfit', bold: true, color: COLORS.primaryDark
  });

  slide.addText(`Slide ${slideNumber} / 10 • Full-Stack REST API Architecture`, {
    x: 7.5, y: 0.12, w: 5.0, h: 0.4,
    fontSize: 10.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, align: 'right'
  });

  // Eyebrow
  if (eyebrowText) {
    slide.addText(eyebrowText.toUpperCase(), {
      x: 0.8, y: 0.8, w: 11.733, h: 0.25,
      fontSize: 9.5, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark, charSpacing: 1.2
    });
  }

  // Slide Title
  if (titleText) {
    slide.addText(titleText, {
      x: 0.8, y: 1.05, w: 11.733, h: 0.5,
      fontSize: 20, fontFace: 'Outfit', bold: true, color: COLORS.textMain
    });
  }

  // Bottom Footer
  slide.addShape(pptx.ShapeType.line, {
    x: 0.8, y: 6.8, w: 11.733, h: 0,
    line: { color: COLORS.borderLight, width: 1 }
  });

  slide.addText('Nuzzle API v2.0 • Abu Zafor, Nadim Rahman, Rizvi Sarker • Technopreneurship 2026', {
    x: 0.8, y: 6.9, w: 8.0, h: 0.3,
    fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textDim
  });

  if (speakerNotes) {
    slide.notes = speakerNotes;
  }

  return slide;
}

// ==========================================
// SLIDE 1: TITLE & EXECUTIVE SUMMARY
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgSlide };

  slide.addShape(pptx.ShapeType.rect, {
    x: 1.0, y: 1.2, w: 2.6, h: 0.38,
    fill: { color: 'EDE7F6' },
    line: { color: COLORS.primaryDark, width: 1 },
    radius: 0.19
  });

  slide.addText('🐾 NUZZLE FULL-STACK v2.0', {
    x: 1.0, y: 1.25, w: 2.6, h: 0.28,
    fontSize: 9.5, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark, align: 'center'
  });

  slide.addText('RESTful API Architecture &\nFrontend-to-Backend Integration', {
    x: 1.0, y: 1.75, w: 7.5, h: 1.6,
    fontSize: 28, fontFace: 'Outfit', bold: true, color: COLORS.textMain, lineSpacing: 34
  });

  slide.addText(
    'A decoupled, production-grade cloud architecture connecting a high-performance Vue 3 Client with a Next.js 16 REST Engine, Prisma 7 ORM, and Supabase PostgreSQL with real-time authentication.',
    {
      x: 1.0, y: 3.45, w: 7.2, h: 0.9,
      fontSize: 12.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 18
    }
  );

  // 3 Feature Highlight Cards
  const cards = [
    { title: '18+ REST Endpoints', sub: 'Auth, Feed, Radar, Vets & PawAI', icon: '⚡' },
    { title: 'Decoupled Client Layer', sub: 'Typed Axios/Fetch API Services', icon: '🔗' },
    { title: 'PostgreSQL & Supabase', sub: 'Prisma 7 with Connection Pooling', icon: '🛡️' }
  ];

  cards.forEach((c, idx) => {
    const xPos = 1.0 + idx * 2.45;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 4.5, w: 2.3, h: 1.4,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1 },
      radius: 0.15
    });

    slide.addText(c.icon, { x: xPos + 0.15, y: 4.65, w: 0.5, h: 0.4, fontSize: 18 });
    slide.addText(c.title, { x: xPos + 0.15, y: 5.1, w: 2.0, h: 0.3, fontSize: 11, fontFace: 'Outfit', bold: true, color: COLORS.textMain });
    slide.addText(c.sub, { x: xPos + 0.15, y: 5.4, w: 2.0, h: 0.4, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted });
  });

  // Right Side Architecture Visual Card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.8, y: 1.2, w: 3.6, h: 5.0,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.indigo, width: 1.5 },
    radius: 0.2
  });

  slide.addText('CORE ARCHITECTURE STACK', {
    x: 9.1, y: 1.45, w: 3.0, h: 0.3,
    fontSize: 10, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primary, charSpacing: 1.2
  });

  const stackItems = [
    { label: 'Frontend Client', val: 'Vue 3 + Vite + TypeScript', color: '947DEE' },
    { label: 'API Gateway', val: 'Next.js 16 Route Handlers', color: '10B981' },
    { label: 'Auth & Security', val: 'Supabase JWT (Bearer Token)', color: 'F43F5E' },
    { label: 'Data Layer', val: 'Prisma 7 + PostgreSQL Pooler', color: '38BDF8' },
    { label: 'AI Intelligence', val: 'PawDoctor 24/7 Clinical Triage', color: 'F59E0B' },
    { label: 'Deployment', val: 'Vercel Serverless + Netlify Edge', color: 'A78BFA' }
  ];

  stackItems.forEach((item, idx) => {
    const yPos = 1.9 + idx * 0.68;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 9.1, y: yPos, w: 3.0, h: 0.58,
      fill: { color: '1F2038' },
      line: { color: '2D2F52', width: 1 },
      radius: 0.1
    });

    slide.addText(item.label, { x: 9.2, y: yPos + 0.05, w: 2.8, h: 0.2, fontSize: 9, fontFace: 'Plus Jakarta Sans', color: '9589B0' });
    slide.addText(item.val, { x: 9.2, y: yPos + 0.26, w: 2.8, h: 0.25, fontSize: 10.5, fontFace: 'Outfit', bold: true, color: item.color });
  });

  slide.addText('Technopreneurship 2026 • Abu Zafor, Nadim Rahman, Rizvi Sarker', {
    x: 1.0, y: 6.9, w: 10.0, h: 0.3,
    fontSize: 10, fontFace: 'Plus Jakarta Sans', color: COLORS.textDim
  });

  slide.notes = "Welcome to the Nuzzle Full-Stack REST API & Architecture presentation. Today we will walk through the decoupled three-tier architecture, API endpoint suite, Supabase authentication lifecycle, and how our Vue 3 frontend connects seamlessly with the Next.js and PostgreSQL backend.";
}

// ==========================================
// SLIDE 2: THREE-TIER DECOUPLED ARCHITECTURE
// ==========================================
{
  const slide = createBaseSlide(
    2,
    'SYSTEM DESIGN & ARCHITECTURE',
    'Decoupled Three-Tier Full-Stack Infrastructure',
    'Slide 2 explains the three architectural tiers: Vue 3 Client Tier, Next.js REST API Gateway Tier, and Supabase PostgreSQL Database Tier.'
  );

  const tiers = [
    {
      num: 'TIER 1',
      name: 'Client Presentation Layer',
      tech: 'Vue 3 + Vite + TypeScript',
      desc: 'Reactive UI state management via appStore.ts, optimistic tactile interactions, component modules, and typed API service clients.',
      bullets: ['Typed HTTP Client (apiClient.ts)', 'Optimistic UI state dispatch', 'Bearer Token session persistence', 'Vite Dev Proxy (/api -> :3000)']
    },
    {
      num: 'TIER 2',
      name: 'REST Gateway & Engine',
      tech: 'Next.js 16 App Router',
      desc: 'Serverless REST Route Handlers under /src/app/api with strict Zod schema validation, CORS headers, and standard JSON envelopes.',
      bullets: ['Zod schema payload validation', 'Standard { success, data, error } envelopes', 'Supabase Auth session verification', 'Bilingual AI Triage processing']
    },
    {
      num: 'TIER 3',
      name: 'Cloud Persistence & Auth',
      tech: 'Prisma 7 + PostgreSQL',
      desc: 'Cloud database hosted on Supabase with 18 synchronized data models, Transaction/Session poolers, and secure JWT auth engine.',
      bullets: ['18 relational schema models', 'Supabase Transaction Pooler (Port 6543)', 'Session Pooler for migrations (Port 5432)', 'PostgreSQL Row Level Security (RLS)']
    }
  ];

  tiers.forEach((t, idx) => {
    const xPos = 0.8 + idx * 3.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.7, w: 3.8, h: 4.8,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1.2 },
      radius: 0.15
    });

    // Badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.25, y: 1.9, w: 1.1, h: 0.28,
      fill: { color: idx === 1 ? 'EDE7F6' : idx === 2 ? 'E0F2FE' : 'DCFCE7' },
      line: { color: 'FFFFFF', width: 0 },
      radius: 0.1
    });

    slide.addText(t.num, {
      x: xPos + 0.25, y: 1.94, w: 1.1, h: 0.22,
      fontSize: 9, fontFace: 'Plus Jakarta Sans', bold: true,
      color: idx === 1 ? COLORS.primaryDark : idx === 2 ? '0369A1' : '15803D', align: 'center'
    });

    slide.addText(t.name, {
      x: xPos + 0.25, y: 2.3, w: 3.3, h: 0.35,
      fontSize: 14, fontFace: 'Outfit', bold: true, color: COLORS.textMain
    });

    slide.addText(t.tech, {
      x: xPos + 0.25, y: 2.65, w: 3.3, h: 0.25,
      fontSize: 10.5, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark
    });

    slide.addText(t.desc, {
      x: xPos + 0.25, y: 2.95, w: 3.3, h: 0.8,
      fontSize: 10, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 14
    });

    slide.addShape(pptx.ShapeType.line, {
      x: xPos + 0.25, y: 3.85, w: 3.3, h: 0,
      line: { color: COLORS.borderLight, width: 1 }
    });

    slide.addText('CORE CAPABILITIES:', {
      x: xPos + 0.25, y: 4.0, w: 3.3, h: 0.2,
      fontSize: 9, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.textDim
    });

    t.bullets.forEach((b, bIdx) => {
      const bY = 4.3 + bIdx * 0.48;
      slide.addText('• ' + b, {
        x: xPos + 0.25, y: bY, w: 3.3, h: 0.42,
        fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMain, lineSpacing: 12
      });
    });
  });
}

// ==========================================
// SLIDE 3: AUTHENTICATION & MULTI-ROLE IDENTITY
// ==========================================
{
  const slide = createBaseSlide(
    3,
    'SECURITY & IDENTITY LAYER',
    'Multi-Role Authentication & Supabase JWT Lifecycle',
    'Slide 3 covers the registration, login, token management, and multi-role authorization protocol.'
  );

  // Left Side: Protocol Flow
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('3-ROLE HIERARCHY & PERMISSIONS', {
    x: 1.1, y: 1.9, w: 5.2, h: 0.3,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark
  });

  const roles = [
    { name: '🐾 Pet Parent', sub: 'Guardian Passports, Den Feed, Lost Pet Alerts, Vet Booking', badge: 'PARENT' },
    { name: '🛍️ Verified Pet Store', sub: 'Boutique Catalog, Order Management, Gold Shield Badge', badge: 'STORE' },
    { name: '🏥 Vet Clinic / Hospital', sub: 'Telemedicine Slot Management, PawDoctor Triage Partner', badge: 'VET' }
  ];

  roles.forEach((r, idx) => {
    const yPos = 2.3 + idx * 0.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 5.2, h: 0.85,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(r.name, { x: 1.25, y: yPos + 0.1, w: 3.8, h: 0.3, fontSize: 11.5, fontFace: 'Outfit', bold: true, color: COLORS.textMain });
    slide.addText(r.sub, { x: 1.25, y: yPos + 0.4, w: 4.9, h: 0.35, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted });
  });

  slide.addText('Session Token Protocol: Bearer JWT stored in localStorage and automatically forwarded via apiClient.ts Request Interceptors with 401 token refresh.', {
    x: 1.1, y: 5.3, w: 5.2, h: 0.9,
    fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 14
  });

  // Right Side: API Endpoint Signatures
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.7, w: 5.7, h: 4.8,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.indigo, width: 1 },
    radius: 0.15
  });

  slide.addText('AUTHENTICATION REST HANDLERS', {
    x: 7.1, y: 1.9, w: 5.0, h: 0.3,
    fontSize: 10.5, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primary
  });

  const authEndpoints = [
    {
      m: 'POST', path: '/api/auth/signup',
      desc: 'Registers in Supabase Auth & creates linked PostgreSQL Owner'
    },
    {
      m: 'POST', path: '/api/auth/login',
      desc: 'Verifies credentials via Supabase with fallback role switch'
    },
    {
      m: 'GET', path: '/api/auth/me',
      desc: 'Validates Bearer token & returns Owner with pet passports'
    }
  ];

  authEndpoints.forEach((ep, idx) => {
    const yPos = 2.3 + idx * 1.35;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.1, y: yPos, w: 5.1, h: 1.2,
      fill: { color: '1F2038' },
      line: { color: '2D2F52', width: 1 },
      radius: 0.1
    });

    slide.addText(ep.m, { x: 7.25, y: yPos + 0.12, w: 0.8, h: 0.25, fontSize: 10, fontFace: 'Outfit', bold: true, color: COLORS.emerald });
    slide.addText(ep.path, { x: 8.05, y: yPos + 0.12, w: 4.0, h: 0.25, fontSize: 11, fontFace: 'Consolas', bold: true, color: COLORS.codeText });
    slide.addText(ep.desc, { x: 7.25, y: yPos + 0.45, w: 4.8, h: 0.65, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: '9589B0', lineSpacing: 13 });
  });
}

// ==========================================
// SLIDE 4: DEN FEED, REACTIONS & STORIES API
// ==========================================
{
  const slide = createBaseSlide(
    4,
    'SOCIAL ENGAGEMENT ENGINE',
    'Den Feed, Tactile Reactions & 24h Stories API',
    'Slide 4 explains the social moments feed, 5 tactile reactions, comment threading, and 24h Snuggle Circles.'
  );

  // Left Card: Endpoints & Features
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 6.8, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('CORE FEED & MOMENTS CAPABILITIES', {
    x: 1.1, y: 1.9, w: 6.2, h: 0.3,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark
  });

  const feedFeatures = [
    { title: 'Paginated Den Feed', desc: 'GET /api/posts supports category filtering, hashtag lookup, and cursor pagination.' },
    { title: '5 Tactile Pet Reactions', desc: 'POST /api/posts/:id/react toggles Paw 🐾, Nuzzle 💜, Treat 🦴, Ball 🎾, and Purr 😻.' },
    { title: 'Pet Persona Comments', desc: 'POST /api/posts/:id/comments supports posting as either human parent or as the pet.' },
    { title: 'Snuggle Circles (24h Stories)', desc: 'GET /api/stories fetches ephemeral active video/photo segments created in last 24 hours.' }
  ];

  feedFeatures.forEach((f, idx) => {
    const yPos = 2.3 + idx * 0.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 6.2, h: 0.85,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(f.title, { x: 1.25, y: yPos + 0.1, w: 5.8, h: 0.28, fontSize: 11, fontFace: 'Outfit', bold: true, color: COLORS.textMain });
    slide.addText(f.desc, { x: 1.25, y: yPos + 0.38, w: 5.8, h: 0.4, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted });
  });

  // Right Card: 5 Reaction Dock Visual
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.8, y: 1.7, w: 4.7, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('5 TACTILE PET REACTIONS', {
    x: 8.1, y: 1.9, w: 4.0, h: 0.3,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark
  });

  const reactions = [
    { emoji: '🐾', name: 'Paw Print', action: 'Standard appreciation' },
    { emoji: '💜', name: 'Nuzzle', action: 'Deep affection & snuggle' },
    { emoji: '🦴', name: 'Tasty Treat', action: 'Reward for good behaviour' },
    { emoji: '🎾', name: 'Tennis Ball', action: 'Playful energy & zoomies' },
    { emoji: '😻', name: 'Heart Purr', action: 'Cat vocalization love' }
  ];

  reactions.forEach((r, idx) => {
    const yPos = 2.3 + idx * 0.82;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8.1, y: yPos, w: 4.1, h: 0.72,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(r.emoji, { x: 8.25, y: yPos + 0.12, w: 0.5, h: 0.45, fontSize: 18 });
    slide.addText(r.name, { x: 8.85, y: yPos + 0.1, w: 3.2, h: 0.25, fontSize: 11, fontFace: 'Outfit', bold: true, color: COLORS.textMain });
    slide.addText(r.action, { x: 8.85, y: yPos + 0.35, w: 3.2, h: 0.28, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted });
  });
}

// ==========================================
// SLIDE 5: 5-MILE EMERGENCY RADAR API
// ==========================================
{
  const slide = createBaseSlide(
    5,
    'EMERGENCY RESCUE DISPATCH',
    '5-Mile Radar Alert & Volunteer Claim-and-Lock API',
    'Slide 5 covers the lost & found emergency broadcast radar, coordinate bounding box filtering, and street rescue claim protocol.'
  );

  // Left Column
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('5-MILE GEOLOCATION RADAR', {
    x: 1.1, y: 1.9, w: 5.2, h: 0.3,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.rose
  });

  slide.addText(
    'When a pet is reported lost, the Radar Engine broadcasts a high-priority push notification to all pet parents, verified stores, and clinics within a 5.0-mile radius.',
    {
      x: 1.1, y: 2.25, w: 5.2, h: 0.7,
      fontSize: 10.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 15
    }
  );

  const radarCards = [
    { title: '🚨 Emergency Bounding Box', desc: 'Queries PostgreSQL with lat/long distance math to return local alerts only.' },
    { title: '🔒 Claim-and-Lock Rescue Protocol', desc: 'POST /api/lost-found/:id/claim locks rescue case to 1 volunteer to prevent duplicate dispatches.' },
    { title: '💰 Bounty & Identification', desc: 'Displays microchip ID, collar tags, distinctive markings, and optional rescue rewards.' }
  ];

  radarCards.forEach((rc, idx) => {
    const yPos = 3.05 + idx * 1.15;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 5.2, h: 1.0,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(rc.title, { x: 1.25, y: yPos + 0.1, w: 4.9, h: 0.28, fontSize: 11, fontFace: 'Outfit', bold: true, color: COLORS.textMain });
    slide.addText(rc.desc, { x: 1.25, y: yPos + 0.4, w: 4.9, h: 0.52, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 13 });
  });

  // Right Column: JSON Schema Snapshot
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.7, w: 5.7, h: 4.8,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.indigo, width: 1 },
    radius: 0.15
  });

  slide.addText('RADAR ALERT PAYLOAD SCHEMA', {
    x: 7.1, y: 1.9, w: 5.0, h: 0.3,
    fontSize: 10.5, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primary
  });

  const schemaJson = 
`POST /api/lost-found
{
  "petName": "Archie",
  "species": "Dog",
  "breed": "Cocker Spaniel",
  "status": "lost",
  "lastSeenAddress": "Gulshan-2 Circle, Dhaka",
  "lastSeenLatitude": 23.7925,
  "lastSeenLongitude": 90.4078,
  "rewardAmount": "$250 Bounty",
  "isUrgent": true,
  "microchipId": "985-1410-0921-334"
}

// Claim-and-Lock Response:
{ "success": true, "status": "claimed", "volunteerId": "usr_99" }`;

  slide.addText(schemaJson, {
    x: 7.1, y: 2.3, w: 5.1, h: 3.9,
    fontSize: 9.5, fontFace: 'Consolas', color: COLORS.codeText, lineSpacing: 14
  });
}

// ==========================================
// SLIDE 6: VETERINARY TELEMEDICINE & BOOKING API
// ==========================================
{
  const slide = createBaseSlide(
    6,
    'TELEMEDICINE & CLINICAL CARE',
    'Veterinary Directory & Appointment Scheduling API',
    'Slide 6 presents the vet hospital directory endpoints, clinic ranking algorithm, and real-time appointment booking.'
  );

  // 3 Clinical Value Pillars
  const pillars = [
    {
      title: 'Verified Clinic Directory',
      endpoint: 'GET /api/vet/directory',
      desc: 'Returns accredited veterinary hospitals in Dhaka with ratings, distance radius, and emergency badges.',
      items: ['Dr. Sarah Al-Mansoor (Cascade 24/7)', 'Dr. Marcus Lee (Bay Area Exotic)', 'Dr. Priya Nair (Sunnyvale Wellness)']
    },
    {
      title: 'Pro Priority Placement',
      endpoint: 'Ranking Algorithm',
      desc: 'Subscribed partner clinics receive guaranteed #1 priority placement in PawAI triage suggestions.',
      items: ['Gold Clinic Shield Badge', 'Instant Triage Log Handoff', '0% Booking Commission']
    },
    {
      title: 'Slot Scheduling Engine',
      endpoint: 'POST /api/vet/appointments',
      desc: 'Pet parents book physical or virtual consultations with real-time slot conflict prevention.',
      items: ['Vaccination & Checkups', 'Emergency Trauma Booking', 'Adoption Meet & Greets']
    }
  ];

  pillars.forEach((p, idx) => {
    const xPos = 0.8 + idx * 3.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.7, w: 3.8, h: 4.8,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1.2 },
      radius: 0.15
    });

    slide.addText(p.title, {
      x: xPos + 0.25, y: 1.95, w: 3.3, h: 0.35,
      fontSize: 13.5, fontFace: 'Outfit', bold: true, color: COLORS.textMain
    });

    slide.addText(p.endpoint, {
      x: xPos + 0.25, y: 2.3, w: 3.3, h: 0.25,
      fontSize: 10, fontFace: 'Consolas', bold: true, color: COLORS.primaryDark
    });

    slide.addText(p.desc, {
      x: xPos + 0.25, y: 2.65, w: 3.3, h: 0.75,
      fontSize: 10, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 14
    });

    slide.addShape(pptx.ShapeType.line, {
      x: xPos + 0.25, y: 3.5, w: 3.3, h: 0,
      line: { color: COLORS.borderLight, width: 1 }
    });

    p.items.forEach((item, iIdx) => {
      const iY = 3.75 + iIdx * 0.85;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: xPos + 0.25, y: iY, w: 3.3, h: 0.7,
        fill: { color: COLORS.bgSubtle },
        line: { color: COLORS.borderLight, width: 1 },
        radius: 0.1
      });

      slide.addText('✓ ' + item, {
        x: xPos + 0.4, y: iY + 0.18, w: 3.0, h: 0.35,
        fontSize: 10, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.textMain
      });
    });
  });
}

// ==========================================
// SLIDE 7: VERIFIED MARKETPLACE & ADOPTION API
// ==========================================
{
  const slide = createBaseSlide(
    7,
    'COMMERCE & ADOPTION HUBS',
    'Verified Pet Boutique & Adoption Listings API',
    'Slide 7 covers marketplace listing creation, store verification badge, and rescue adoption inquiries.'
  );

  // Left Card: Marketplace
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('🛍️ VERIFIED PET MARKETPLACE API', {
    x: 1.1, y: 1.9, w: 5.2, h: 0.3,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark
  });

  const marketPoints = [
    { title: 'GET /api/marketplace', desc: 'Filtered product catalog by Category (Food, Toys, Beds, Apparel, Health).' },
    { title: 'POST /api/marketplace', desc: 'Verified merchants list authentic products with stock counts, pricing & images.' },
    { title: 'Gold Shield Verification', desc: 'Verified stores get official badge & priority placement across marketplace feeds.' }
  ];

  marketPoints.forEach((mp, idx) => {
    const yPos = 2.3 + idx * 1.15;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 5.2, h: 1.0,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(mp.title, { x: 1.25, y: yPos + 0.1, w: 4.9, h: 0.28, fontSize: 11, fontFace: 'Outfit', bold: true, color: COLORS.textMain });
    slide.addText(mp.desc, { x: 1.25, y: yPos + 0.4, w: 4.9, h: 0.52, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 13 });
  });

  // Right Card: Adoption Hub
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.7, w: 5.7, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('🏠 RESCUE & ADOPTION NETWORK API', {
    x: 7.1, y: 1.9, w: 5.0, h: 0.3,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', bold: true, color: '0284C7'
  });

  const adoptPoints = [
    { title: 'GET /api/adoption', desc: 'Lists shelter & rescue pets with age, breed, gender, and temperament tags.' },
    { title: 'Vaccination & Neutered Badges', desc: 'Each pet profile carries verified medical records and shelter background.' },
    { title: 'Meet & Greet Scheduling', desc: 'Direct adoption inquiry flow syncing with veterinary calendar slots.' }
  ];

  adoptPoints.forEach((ap, idx) => {
    const yPos = 2.3 + idx * 1.15;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.1, y: yPos, w: 5.1, h: 1.0,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(ap.title, { x: 7.25, y: yPos + 0.1, w: 4.8, h: 0.28, fontSize: 11, fontFace: 'Outfit', bold: true, color: COLORS.textMain });
    slide.addText(ap.desc, { x: 7.25, y: yPos + 0.4, w: 4.8, h: 0.52, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 13 });
  });
}

// ==========================================
// SLIDE 8: PAWAI 24/7 SYMPTOM TRIAGE API
// ==========================================
{
  const slide = createBaseSlide(
    8,
    'AI INTELLIGENCE SUITE',
    'PawDoctor 24/7 Symptom Triage Engine API',
    'Slide 8 explains the clinical triage endpoint, Bengali and English NLP classification, and automatic emergency clinic recommendations.'
  );

  // Left Column: Triage Engine Workflow
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 6.0, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('CLINICAL TRIAGE CLASSIFICATION', {
    x: 1.1, y: 1.9, w: 5.4, h: 0.3,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark
  });

  const triageLevels = [
    { level: '🚨 EMERGENCY (Critical)', desc: 'Toxins (chocolate, poison, grapes), uncontrolled bleeding, trauma. Triggers immediate 24/7 emergency clinic dispatch.', color: 'F43F5E' },
    { level: '⚠️ MODERATE (Clinical Attention)', desc: 'Limping, repeated vomiting, diarrhea, lethargy. Suggests withholding food for 4h and booking quick checkup.', color: 'F59E0B' },
    { level: '🌿 LOW / WELLNESS (Guidance)', desc: 'Nutrition, dietary caloric calculation, coat health, preventive care tips in Bangla & English.', color: '10B981' }
  ];

  triageLevels.forEach((tl, idx) => {
    const yPos = 2.3 + idx * 1.3;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 5.4, h: 1.15,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(tl.level, { x: 1.25, y: yPos + 0.12, w: 5.1, h: 0.28, fontSize: 11, fontFace: 'Outfit', bold: true, color: tl.color });
    slide.addText(tl.desc, { x: 1.25, y: yPos + 0.42, w: 5.1, h: 0.65, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 13 });
  });

  // Right Column: Endpoint Code Sample
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.0, y: 1.7, w: 5.5, h: 4.8,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.indigo, width: 1 },
    radius: 0.15
  });

  slide.addText('POST /api/pawai/triage', {
    x: 7.3, y: 1.9, w: 4.9, h: 0.3,
    fontSize: 10.5, fontFace: 'Consolas', bold: true, color: COLORS.emerald
  });

  const triageCode = 
`// Request Body:
{
  "petName": "Mochi",
  "species": "Cat",
  "symptoms": "cat ate lilies and is vomiting",
  "isProSubscriber": true
}

// Structured Response:
{
  "success": true,
  "data": {
    "urgency": "emergency",
    "urgencyScore": 95,
    "analysisEn": "Lilies are acutely nephrotoxic to felines. Emergency hospital care required.",
    "analysisBn": "লিলি ফুল বিড়ালের জন্য অত্যন্ত বিষাক্ত। অবিলম্বে হাসপাতালে নিন।",
    "suggestedClinics": [
      { "name": "Cascade 24/7 Hospital", "distance": "1.2 mi" }
    ]
  }
}`;

  slide.addText(triageCode, {
    x: 7.3, y: 2.25, w: 4.9, h: 4.0,
    fontSize: 9, fontFace: 'Consolas', color: COLORS.codeText, lineSpacing: 13
  });
}

// ==========================================
// SLIDE 9: FRONTEND CLIENT LAYER & STATE SYNC
// ==========================================
{
  const slide = createBaseSlide(
    9,
    'CLIENT INTEGRATION LAYER',
    'Frontend Service Architecture & Reactive State Synchronization',
    'Slide 9 details the modular TypeScript service layer in Vue 3, apiClient.ts, and optimistic Pinia/appStore mutations.'
  );

  // 4 Service Architecture Cards
  const services = [
    {
      name: 'apiClient.ts (Core HTTP Client)',
      desc: 'Base fetch client supporting Bearer token headers, standard JSON unwrapping, timeout guards, and Vite proxy.',
      code: 'apiClient.get<T>(url, params)\napiClient.post<T>(url, body)\napiClient.setToken(jwt)'
    },
    {
      name: 'Domain Service Modules',
      desc: 'Modular services encapsulating each business domain: authService, postService, petService, vetService, pawAiService.',
      code: 'authService.login({ email, password })\npostService.react(id, "nuzzle")\nvetService.bookSlot(slotId)'
    },
    {
      name: 'appStore.ts Reactive Sync',
      desc: 'Vue reactive store performs optimistic mutations immediately for zero-lag UI, then asynchronously syncs to backend API.',
      code: 'post.likesCount++;\npostService.react(id).catch(rollback);'
    },
    {
      name: 'Vite Dev Proxy Configuration',
      desc: 'vite.config.ts automatically proxies all /api requests to http://localhost:3000 for seamless local development with 0 CORS.',
      code: 'server: {\n  proxy: { "/api": "http://localhost:3000" }\n}'
    }
  ];

  services.forEach((s, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = 0.8 + col * 5.95;
    const yPos = 1.7 + row * 2.45;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: yPos, w: 5.8, h: 2.3,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1 },
      radius: 0.12
    });

    slide.addText(s.name, {
      x: xPos + 0.2, y: yPos + 0.15, w: 5.4, h: 0.3,
      fontSize: 12, fontFace: 'Outfit', bold: true, color: COLORS.primaryDark
    });

    slide.addText(s.desc, {
      x: xPos + 0.2, y: yPos + 0.45, w: 5.4, h: 0.65,
      fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted, lineSpacing: 13
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.2, y: yPos + 1.15, w: 5.4, h: 0.95,
      fill: { color: COLORS.codeBg },
      line: { color: COLORS.indigo, width: 1 },
      radius: 0.08
    });

    slide.addText(s.code, {
      x: xPos + 0.3, y: yPos + 1.25, w: 5.2, h: 0.75,
      fontSize: 9, fontFace: 'Consolas', color: COLORS.codeText, lineSpacing: 12
    });
  });
}

// ==========================================
// SLIDE 10: DEPLOYMENT, CLOUD & RECAP
// ==========================================
{
  const slide = createBaseSlide(
    10,
    'PRODUCTION INFRASTRUCTURE',
    'Cloud Deployment Topology & Full-Stack Summary',
    'Slide 10 summarizes the complete production deployment topology, GitHub repositories, and full-stack readiness.'
  );

  // Left Column: Deployment Topology
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('PRODUCTION CLOUD TOPOLOGY', {
    x: 1.1, y: 1.9, w: 5.2, h: 0.3,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark
  });

  const topology = [
    { label: 'Frontend Hosting', val: 'Vercel / Netlify (SPA Rewrites via vercel.json)', icon: '🌐' },
    { label: 'Backend API Engine', val: 'Vercel Serverless Functions (Next.js 16)', icon: '⚡' },
    { label: 'Database Cloud', val: 'Supabase PostgreSQL (18 Models Synchronized)', icon: '🗄️' },
    { label: 'Authentication', val: 'Supabase Auth (JWT Bearer Token Flow)', icon: '🔐' }
  ];

  topology.forEach((top, idx) => {
    const yPos = 2.3 + idx * 0.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 5.2, h: 0.82,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(top.icon, { x: 1.25, y: yPos + 0.18, w: 0.4, h: 0.4, fontSize: 16 });
    slide.addText(top.label, { x: 1.75, y: yPos + 0.1, w: 4.4, h: 0.25, fontSize: 10, fontFace: 'Plus Jakarta Sans', color: COLORS.textDim });
    slide.addText(top.val, { x: 1.75, y: yPos + 0.35, w: 4.4, h: 0.4, fontSize: 10.5, fontFace: 'Outfit', bold: true, color: COLORS.textMain });
  });

  // Right Column: Summary Metrics & Repositories
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.7, w: 5.7, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('FULL-STACK REPOSITORIES & METRICS', {
    x: 7.1, y: 1.9, w: 5.0, h: 0.3,
    fontSize: 11, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark
  });

  const metrics = [
    { num: '18+', label: 'REST Route Handlers', color: COLORS.primaryDark },
    { num: '18', label: 'Database Models', color: COLORS.emerald },
    { num: '3', label: 'User Roles (Parent/Store/Vet)', color: COLORS.indigo },
    { num: '100%', label: 'Type-Safe (TypeScript)', color: COLORS.rose }
  ];

  metrics.forEach((m, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = 7.1 + col * 2.6;
    const yPos = 2.3 + row * 1.15;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: yPos, w: 2.45, h: 1.0,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(m.num, { x: xPos + 0.15, y: yPos + 0.1, w: 2.15, h: 0.45, fontSize: 20, fontFace: 'Outfit', bold: true, color: m.color });
    slide.addText(m.label, { x: xPos + 0.15, y: yPos + 0.55, w: 2.15, h: 0.35, fontSize: 9.5, fontFace: 'Plus Jakarta Sans', color: COLORS.textMuted });
  });

  // Repo Links Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.1, y: 4.8, w: 5.1, h: 1.4,
    fill: { color: 'EDE7F6' },
    line: { color: COLORS.border, width: 1 },
    radius: 0.12
  });

  slide.addText('📦 GITHUB REPOSITORIES:', {
    x: 7.3, y: 4.95, w: 4.7, h: 0.25,
    fontSize: 9.5, fontFace: 'Plus Jakarta Sans', bold: true, color: COLORS.primaryDark
  });

  slide.addText('• Frontend: https://github.com/zafor2002/nuzzle-\n• Backend:  https://github.com/zafor2002/nuzzle-backend\n• Documentation: API_DOCUMENTATION.md', {
    x: 7.3, y: 5.25, w: 4.7, h: 0.85,
    fontSize: 9.5, fontFace: 'Consolas', color: COLORS.textMain, lineSpacing: 13
  });
}

// Generate Presentation Files
async function build() {
  console.log('Generating Nuzzle REST API Presentation...');
  
  const filesToSave = [
    path.resolve(OUTPUT_DIR, 'Nuzzle_REST_API_Architecture_v2.pptx'),
    path.resolve(__dirname, '../Nuzzle_REST_API_Architecture_v2.pptx'),
    path.resolve(__dirname, '../../Nuzzle_REST_API_Architecture_v2.pptx'),
    OUTPUT_FILE,
    V2_OUTPUT_FILE,
    ROOT_OUTPUT_FILE
  ];

  for (const file of filesToSave) {
    try {
      await pptx.writeFile({ fileName: file });
      console.log(`✓ Saved: ${file}`);
    } catch (err) {
      console.warn(`Could not overwrite ${file} (likely open in PowerPoint).`);
    }
  }
}

build().catch(err => {
  console.error('Error generating presentation:', err);
});
