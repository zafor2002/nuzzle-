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
pptx.title = 'Round 2: Backend & API Integration • Session 2: Building RESTful APIs & Connecting Frontend to Backend';
pptx.subject = '5-Minute Presentation: Backend Architecture, API Integration Demo, Lessons Learned & Improvements Made';

const OUTPUT_DIR = path.resolve(__dirname, '../presentation');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'Nuzzle_Round2_Backend_API_Presentation.pptx');
const V2_OUTPUT_FILE = path.resolve(__dirname, '../Nuzzle_Round2_Backend_API_Presentation.pptx');
const ROOT_OUTPUT_FILE = path.resolve(__dirname, '../../Nuzzle_Round2_Backend_API_Presentation.pptx');

// Also keep the previous filenames updated so any open link continues to work
const ALT_OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'Nuzzle_REST_API_Architecture_v2.pptx');
const ALT_ROOT_FILE = path.resolve(__dirname, '../../Nuzzle_REST_API_Architecture_v2.pptx');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Soothing Lavender & Pearl White Palette with Crisp Contrast
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

const FONT_FAMILY = 'Times New Roman';

function createBaseSlide(slideNumber, eyebrowText, titleText, speakerNotes) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgSlide };

  // Top Header Bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.333, h: 0.65,
    fill: { color: COLORS.bgHeader },
    line: { color: COLORS.border, width: 1 }
  });

  slide.addText('🐾 Nuzzle • Round 2: Backend & API Integration', {
    x: 0.8, y: 0.12, w: 6.0, h: 0.4,
    fontSize: 13, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
  });

  slide.addText(`Slide ${slideNumber} / 10 • 5-Minute Presentation`, {
    x: 7.5, y: 0.12, w: 5.0, h: 0.4,
    fontSize: 11, fontFace: FONT_FAMILY, color: COLORS.textMuted, align: 'right'
  });

  // Eyebrow
  if (eyebrowText) {
    slide.addText(eyebrowText.toUpperCase(), {
      x: 0.8, y: 0.8, w: 11.733, h: 0.25,
      fontSize: 10, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark, charSpacing: 1.2
    });
  }

  // Slide Title
  if (titleText) {
    slide.addText(titleText, {
      x: 0.8, y: 1.05, w: 11.733, h: 0.5,
      fontSize: 20, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain
    });
  }

  // Bottom Footer
  slide.addShape(pptx.ShapeType.line, {
    x: 0.8, y: 6.8, w: 11.733, h: 0,
    line: { color: COLORS.borderLight, width: 1 }
  });

  slide.addText('Session 2: Building RESTful APIs & Connecting Frontend to Backend • Abu Zafor, Nadim Rahman, Rizvi Sarker', {
    x: 0.8, y: 6.9, w: 10.0, h: 0.3,
    fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textDim
  });

  if (speakerNotes) {
    slide.notes = speakerNotes;
  }

  return slide;
}

// ==========================================
// SLIDE 1: TITLE & COVER
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgSlide };

  slide.addShape(pptx.ShapeType.rect, {
    x: 1.0, y: 1.1, w: 4.8, h: 0.38,
    fill: { color: 'EDE7F6' },
    line: { color: COLORS.primaryDark, width: 1 },
    radius: 0.19
  });

  slide.addText('ROUND 2: BACKEND & API INTEGRATION (WEEKS 3–4)', {
    x: 1.0, y: 1.15, w: 4.8, h: 0.28,
    fontSize: 10, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark, align: 'center'
  });

  slide.addText('Session 2: Building RESTful APIs &\nConnecting Frontend to Backend', {
    x: 1.0, y: 1.65, w: 7.5, h: 1.5,
    fontSize: 27, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain, lineSpacing: 34
  });

  slide.addText(
    'Nuzzle Full-Stack Engine: Decoupled Vue.js Client connected to a production RESTful API Engine, Prisma 7 ORM, and Supabase PostgreSQL with Google OAuth 2.0 and real-time state synchronization.',
    {
      x: 1.0, y: 3.3, w: 7.2, h: 0.9,
      fontSize: 13, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 18
    }
  );

  // 3 High-Impact Stat Highlight Cards
  const cards = [
    { title: '1. Architecture', sub: 'RESTful Principles & Schema', icon: '🏛️' },
    { title: '2. Integration Demo', sub: 'Vue.js to REST Endpoints', icon: '⚡' },
    { title: '3. Lessons Learned', sub: 'Poolers, OAuth & Fresh Release', icon: '💡' }
  ];

  cards.forEach((c, idx) => {
    const xPos = 1.0 + idx * 2.45;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 4.4, w: 2.3, h: 1.5,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1 },
      radius: 0.15
    });

    slide.addText(c.icon, { x: xPos + 0.15, y: 4.55, w: 0.5, h: 0.4, fontSize: 20 });
    slide.addText(c.title, { x: xPos + 0.15, y: 5.05, w: 2.0, h: 0.3, fontSize: 12, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain });
    slide.addText(c.sub, { x: xPos + 0.15, y: 5.35, w: 2.0, h: 0.45, fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted });
  });

  // Right Side Agenda Card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.8, y: 1.1, w: 3.6, h: 5.2,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.indigo, width: 1.5 },
    radius: 0.2
  });

  slide.addText('5-MINUTE PRESENTATION AGENDA', {
    x: 9.1, y: 1.35, w: 3.0, h: 0.3,
    fontSize: 10.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.primary, charSpacing: 1.2
  });

  const agendaItems = [
    { num: '01', title: 'Backend Architecture Overview', time: '1:15 min' },
    { num: '02', title: 'Relational Schema & Supabase', time: '0:45 min' },
    { num: '03', title: 'API Integration & Vue.js Demo', time: '1:30 min' },
    { num: '04', title: 'Google OAuth & Auth Gate', time: '0:45 min' },
    { num: '05', title: 'Lessons Learned & Fresh Release', time: '0:45 min' }
  ];

  agendaItems.forEach((item, idx) => {
    const yPos = 1.8 + idx * 0.85;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 9.1, y: yPos, w: 3.0, h: 0.72,
      fill: { color: '1F2038' },
      line: { color: '2D2F52', width: 1 },
      radius: 0.1
    });

    slide.addText(item.num, { x: 9.25, y: yPos + 0.12, w: 0.4, h: 0.25, fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.emerald });
    slide.addText(item.title, { x: 9.7, y: yPos + 0.08, w: 2.3, h: 0.3, fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.codeText });
    slide.addText('Allocated Time: ' + item.time, { x: 9.7, y: yPos + 0.38, w: 2.3, h: 0.25, fontSize: 9.5, fontFace: FONT_FAMILY, color: '9589B0' });
  });

  slide.addText('Technopreneurship 2026 • Abu Zafor, Nadim Rahman, Rizvi Sarker', {
    x: 1.0, y: 6.9, w: 10.0, h: 0.3,
    fontSize: 10.5, fontFace: FONT_FAMILY, color: COLORS.textDim
  });

  slide.notes = "Welcome to our Round 2, Session 2 presentation on Building RESTful APIs & Connecting Frontend to Backend. Today we will cover our backend architecture, live API integration with Vue.js, and our key engineering lessons and improvements.";
}

// ==========================================
// SLIDE 2: 5-MINUTE PRESENTATION STRUCTURE
// ==========================================
{
  const slide = createBaseSlide(
    2,
    'SESSION 2 PRESENTATION ROADMAP',
    '3 Core Deliverables: Architecture, Integration & Lessons Learned',
    'Slide 2 establishes the exact 3 core criteria required by the course syllabus for Week 4 presentation.'
  );

  const pillars = [
    {
      badge: 'DELIVERABLE 1',
      title: 'Backend Architecture',
      timing: 'Minutes 0:00 – 1:45',
      desc: 'Deep-dive into RESTful principles, decoupled serverless architecture, 18 relational schema models, connection pooling, and multi-role authentication.',
      points: [
        'REST constraints: Stateless, Resource-based',
        'Standard JSON response envelopes',
        '18 synchronized Prisma/PostgreSQL models',
        'Supabase Auth & Google OAuth 2.0'
      ]
    },
    {
      badge: 'DELIVERABLE 2',
      title: 'API Integration Demo',
      timing: 'Minutes 1:45 – 3:30',
      desc: 'Live demonstration of connecting the Vue.js frontend to REST endpoints using a typed HTTP client layer, optimistic UI updates, and error boundaries.',
      points: [
        'Decoupled apiClient.ts & service layer',
        'Den Feed & 5 Tactile Pet Reactions',
        '5-Mile Emergency Radar & Volunteer Claim',
        'PawDoctor AI 24/7 Clinical Triage'
      ]
    },
    {
      badge: 'DELIVERABLE 3',
      title: 'Lessons & Improvements',
      timing: 'Minutes 3:30 – 5:00',
      desc: 'Critical architectural hurdles overcome, database connection pool tuning, OAuth redirect resolution, and fresh production release engineering.',
      points: [
        'Database connection pool starvation resolved',
        'Handling OAuth redirect loops & port mapping',
        'Fresh account lifecycle & data isolation',
        'Production Vercel deployment & CI/CD'
      ]
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

    // Badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.25, y: 1.9, w: 1.4, h: 0.28,
      fill: { color: 'EDE7F6' },
      line: { color: COLORS.primaryDark, width: 0.8 },
      radius: 0.1
    });

    slide.addText(p.badge, {
      x: xPos + 0.25, y: 1.94, w: 1.4, h: 0.22,
      fontSize: 9.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark, align: 'center'
    });

    slide.addText(p.title, {
      x: xPos + 0.25, y: 2.3, w: 3.3, h: 0.35,
      fontSize: 14, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain
    });

    slide.addText(p.timing, {
      x: xPos + 0.25, y: 2.65, w: 3.3, h: 0.25,
      fontSize: 10.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.emerald
    });

    slide.addText(p.desc, {
      x: xPos + 0.25, y: 2.95, w: 3.3, h: 0.8,
      fontSize: 10.5, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 14
    });

    slide.addShape(pptx.ShapeType.line, {
      x: xPos + 0.25, y: 3.85, w: 3.3, h: 0,
      line: { color: COLORS.borderLight, width: 1 }
    });

    slide.addText('KEY FOCUS AREAS:', {
      x: xPos + 0.25, y: 4.0, w: 3.3, h: 0.2,
      fontSize: 9.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.textDim
    });

    p.points.forEach((point, pIdx) => {
      const pY = 4.3 + pIdx * 0.48;
      slide.addText('• ' + point, {
        x: xPos + 0.25, y: pY, w: 3.3, h: 0.42,
        fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMain, lineSpacing: 13
      });
    });
  });
}

// ==========================================
// SLIDE 3: OVERVIEW OF BACKEND ARCHITECTURE
// ==========================================
{
  const slide = createBaseSlide(
    3,
    'PART 1 • BACKEND ARCHITECTURE OVERVIEW',
    'RESTful API Principles & Decoupled Gateway Architecture',
    'Slide 3 explains the core RESTful principles, stateless HTTP request lifecycle, and uniform API interface.'
  );

  // Left Side: REST Principles & Standards
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('CORE RESTful PRINCIPLES ADHERED TO', {
    x: 1.1, y: 1.9, w: 5.2, h: 0.3,
    fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
  });

  const restRules = [
    { title: 'Stateless Communication', desc: 'Every HTTP request contains complete context via Authorization: Bearer <JWT> headers. No server-side session locks.' },
    { title: 'Resource-Oriented URI Design', desc: 'Predictable plural noun paths (/api/posts, /api/pets, /api/vet/appointments, /api/lost-found) matching business domains.' },
    { title: 'Uniform HTTP Verbs', desc: 'GET for reads, POST for creation, PATCH/PUT for mutations, and DELETE for removals with standard status codes.' },
    { title: 'Consistent Response Envelopes', desc: 'All endpoints wrap responses in { success: boolean, data?: T, error?: string, message?: string } for seamless client parsing.' }
  ];

  restRules.forEach((r, idx) => {
    const yPos = 2.3 + idx * 0.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 5.2, h: 0.85,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(r.title, { x: 1.25, y: yPos + 0.1, w: 4.9, h: 0.28, fontSize: 11.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain });
    slide.addText(r.desc, { x: 1.25, y: yPos + 0.38, w: 4.9, h: 0.45, fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 13 });
  });

  // Right Side: Architecture Flow Diagram
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.7, w: 5.7, h: 4.8,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.indigo, width: 1 },
    radius: 0.15
  });

  slide.addText('REST REQUEST-RESPONSE LIFECYCLE', {
    x: 7.1, y: 1.9, w: 5.0, h: 0.3,
    fontSize: 10.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.primary
  });

  const lifecycleCode = 
`// 1. Vue.js Client Request (apiClient.ts)
GET /api/posts?category=barks
Headers: { 
  "Authorization": "Bearer eyJhbGciOi...", 
  "Content-Type": "application/json" 
}

// 2. Gateway Router & JWT Validation
RouteHandler: validateSession(token) -> userId

// 3. PostgreSQL Query via Prisma 7 Engine
prisma.post.findMany({ where: { category: "barks" } })

// 4. Uniform JSON Envelope Response
{
  "success": true,
  "data": [ ...posts ],
  "meta": { "count": 18, "page": 1 }
}`;

  slide.addText(lifecycleCode, {
    x: 7.1, y: 2.3, w: 5.1, h: 4.0,
    fontSize: 10, fontFace: 'Consolas', color: COLORS.codeText, lineSpacing: 14
  });
}

// ==========================================
// SLIDE 4: DATABASE SCHEMA & SUPABASE CLOUD
// ==========================================
{
  const slide = createBaseSlide(
    4,
    'PART 1 • DATABASE SCHEMA & PERSISTENCE',
    '18 Relational Models on Supabase Cloud PostgreSQL',
    'Slide 4 breaks down the 18 PostgreSQL tables, Prisma ORM schema mapping, and dual connection pooler architecture.'
  );

  // 3 Schema Clusters
  const clusters = [
    {
      title: 'Identity & Social Core',
      models: 'Owner, Pet, Post, Comment, Like, Follow, Hashtag',
      desc: 'Multi-pet personas per owner, 5 tactile pet reactions, threaded comments, and follower graph with bi-directional relations.',
      color: COLORS.primaryDark
    },
    {
      title: 'Emergency & Clinical',
      models: 'LostFoundPost, Vet, Appointment, HealthLog',
      desc: 'Geolocation coordinates, volunteer claim-and-lock rescue state, clinic accreditation, and vaccination health logs.',
      color: COLORS.rose
    },
    {
      title: 'Commerce & Multimedia',
      models: 'MarketplaceListing, AdoptionListing, Story, Reel',
      desc: 'Gold-shield verified boutiques, rescue animal profiles, 24h ephemeral story reels, and multimedia assets.',
      color: COLORS.emerald
    }
  ];

  clusters.forEach((c, idx) => {
    const xPos = 0.8 + idx * 3.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.7, w: 3.8, h: 2.4,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1.2 },
      radius: 0.15
    });

    slide.addText(c.title, {
      x: xPos + 0.25, y: 1.9, w: 3.3, h: 0.35,
      fontSize: 13.5, fontFace: FONT_FAMILY, bold: true, color: c.color
    });

    slide.addText('Models: ' + c.models, {
      x: xPos + 0.25, y: 2.25, w: 3.3, h: 0.35,
      fontSize: 10, fontFace: 'Consolas', bold: true, color: COLORS.textMain
    });

    slide.addText(c.desc, {
      x: xPos + 0.25, y: 2.65, w: 3.3, h: 1.2,
      fontSize: 10.5, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 14
    });
  });

  // Bottom Wide Card: Dual Connection Pooler Architecture
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 4.3, w: 11.733, h: 2.2,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('DUAL CONNECTION POOLING ARCHITECTURE (SUPABASE POSTGRESQL)', {
    x: 1.1, y: 4.5, w: 11.0, h: 0.3,
    fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
  });

  const poolers = [
    { name: 'Transaction Pooler (Port 6543)', role: 'Runtime API Traffic', desc: 'DATABASE_URL connected via PgBouncer. Allows thousands of concurrent serverless API requests without exhausting PostgreSQL connection limits.' },
    { name: 'Session Pooler (Port 5432)', role: 'Schema Migrations', desc: 'DIRECT_URL with direct TCP socket. Dedicated exclusively for running prisma db push and schema migrations that require full DDL session locks.' }
  ];

  poolers.forEach((pool, pIdx) => {
    const pX = 1.1 + pIdx * 5.7;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: pX, y: 4.9, w: 5.5, h: 1.35,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(pool.name + ' • ' + pool.role, { x: pX + 0.2, y: 5.02, w: 5.1, h: 0.28, fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain });
    slide.addText(pool.desc, { x: pX + 0.2, y: 5.35, w: 5.1, h: 0.8, fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 14 });
  });
}

// ==========================================
// SLIDE 5: SECURITY & GOOGLE OAUTH 2.0
// ==========================================
{
  const slide = createBaseSlide(
    5,
    'PART 1 • SECURITY & AUTHENTICATION',
    'Multi-Role Authorization & Google OAuth 2.0 Integration',
    'Slide 5 presents the authentication architecture, Supabase JWT tokens, and 1-click Google sign-in.'
  );

  // Left Card: 3 Roles
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('ROLE-BASED ACCESS CONTROL (RBAC)', {
    x: 1.1, y: 1.9, w: 5.2, h: 0.3,
    fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
  });

  const roleList = [
    { role: '🐾 Pet Guardian', desc: 'Can register pets, log health records, post moments, and broadcast 5-mile emergency radar alerts.' },
    { role: '🛍️ Verified Pet Store', desc: 'Authorized to list inventory, manage boutique stock, and display Gold Shield verified store badges.' },
    { role: '🏥 Licensed Vet Clinic', desc: 'Maintains telemedicine consultation slots, verified credentials, and receives PawDoctor emergency referrals.' }
  ];

  roleList.forEach((rl, idx) => {
    const yPos = 2.3 + idx * 1.05;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 5.2, h: 0.9,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(rl.role, { x: 1.25, y: yPos + 0.12, w: 4.9, h: 0.28, fontSize: 11.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain });
    slide.addText(rl.desc, { x: 1.25, y: yPos + 0.42, w: 4.9, h: 0.45, fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 13 });
  });

  slide.addText('Authorization Header: Bearer <Supabase_JWT> validated on all protected routes with automatic 401 unauthorized rejection.', {
    x: 1.1, y: 5.6, w: 5.2, h: 0.7,
    fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 14
  });

  // Right Card: Google OAuth 2.0 Integration
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.7, w: 5.7, h: 4.8,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.indigo, width: 1 },
    radius: 0.15
  });

  slide.addText('GOOGLE OAUTH 2.0 PROTOCOL & FLOW', {
    x: 7.1, y: 1.9, w: 5.0, h: 0.3,
    fontSize: 10.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.primary
  });

  const oauthSteps = [
    { step: '1. Frontend Trigger', text: 'User clicks "Continue with Google" -> calls signInWithOAuth({ provider: "google" })' },
    { step: '2. Google Consent Screen', text: 'Redirects to Google Accounts; user authorizes profile & email credentials.' },
    { step: '3. Supabase Callback', text: 'Supabase callback URI validates credentials & mints live JWT access token.' },
    { step: '4. Session Capture', text: 'initSupabaseAuthListener() captures token, sets user avatar, and unlocks feed.' }
  ];

  oauthSteps.forEach((st, idx) => {
    const yPos = 2.35 + idx * 0.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.1, y: yPos, w: 5.1, h: 0.85,
      fill: { color: '1F2038' },
      line: { color: '2D2F52', width: 1 },
      radius: 0.1
    });

    slide.addText(st.step, { x: 7.25, y: yPos + 0.1, w: 4.8, h: 0.25, fontSize: 10.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.emerald });
    slide.addText(st.text, { x: 7.25, y: yPos + 0.36, w: 4.8, h: 0.45, fontSize: 9.5, fontFace: 'Consolas', color: COLORS.codeText, lineSpacing: 13 });
  });
}

// ==========================================
// SLIDE 6: CONNECTING VUE.JS TO REST BACKEND
// ==========================================
{
  const slide = createBaseSlide(
    6,
    'PART 2 • API INTEGRATION DEMO',
    'Connecting the Vue.js Frontend to REST APIs',
    'Slide 6 presents the decoupled client architecture, apiClient.ts, and domain-driven service modules.'
  );

  // 4 Client Connection Cards
  const clientLayers = [
    {
      name: 'apiClient.ts (Core HTTP Wrapper)',
      desc: 'Centralized fetch wrapper handling base URLs, auto-attaching Bearer tokens from localStorage, unwrapping { success, data } envelopes, and uniform error logging.',
      code: 'const res = await apiClient.post<T>("/posts", payload);\nif (!res.success) throw new Error(res.error);'
    },
    {
      name: 'Domain-Driven Services Layer',
      desc: 'Individual domain services (authService, postService, vetService, lostFoundService, pawAiService) that translate UI actions into REST endpoints.',
      code: 'export const postService = {\n  react: (id, type) => apiClient.post(`/posts/${id}/react`, { type })\n};'
    },
    {
      name: 'Vite Development Proxy (Zero-CORS)',
      desc: 'Configured in vite.config.ts to proxy /api requests to http://localhost:3000 during local development, completely eliminating browser CORS blocks.',
      code: 'server: {\n  proxy: { "/api": "http://localhost:3000" }\n}'
    },
    {
      name: 'Production Cloud Integration',
      desc: 'In production, Vercel environment variables inject VITE_API_BASE_URL pointing to the deployed backend serverless functions with standard CORS headers.',
      code: 'VITE_API_BASE_URL = "https://nuzzle-backend.vercel.app/api"'
    }
  ];

  clientLayers.forEach((cl, idx) => {
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

    slide.addText(cl.name, {
      x: xPos + 0.2, y: yPos + 0.15, w: 5.4, h: 0.3,
      fontSize: 12.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
    });

    slide.addText(cl.desc, {
      x: xPos + 0.2, y: yPos + 0.45, w: 5.4, h: 0.7,
      fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 14
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.2, y: yPos + 1.2, w: 5.4, h: 0.9,
      fill: { color: COLORS.codeBg },
      line: { color: COLORS.indigo, width: 1 },
      radius: 0.08
    });

    slide.addText(cl.code, {
      x: xPos + 0.3, y: yPos + 1.28, w: 5.2, h: 0.75,
      fontSize: 9.5, fontFace: 'Consolas', color: COLORS.codeText, lineSpacing: 13
    });
  });
}

// ==========================================
// SLIDE 7: LIVE API INTEGRATION DEMOS
// ==========================================
{
  const slide = createBaseSlide(
    7,
    'PART 2 • API INTEGRATION DEMO',
    'Live REST Endpoint Demonstrations & UI Workflows',
    'Slide 7 walks through 4 production endpoint workflows demonstrating Vue.js reactive communication.'
  );

  const workflows = [
    {
      title: 'Den Feed & Tactile Reactions',
      endpoint: 'POST /api/posts/:id/react',
      desc: 'Pet parents react with 5 tactile pet reactions (🐾 Paw, 💜 Nuzzle, 🦴 Treat, 🎾 Ball, 😻 Purr). Optimistically updates reaction counts in Vue.js appStore.',
      status: '200 OK • Latency: 42ms'
    },
    {
      title: '5-Mile Emergency Radar & Claim',
      endpoint: 'POST /api/lost-found/:id/claim',
      desc: 'Emergency lost pet alerts broadcast within a 5.0-mile radius. Volunteers claim-and-lock rescue cases to prevent duplicated rescue attempts.',
      status: '200 OK • Latency: 58ms'
    },
    {
      title: 'PawDoctor 24/7 AI Clinical Triage',
      endpoint: 'POST /api/pawai/triage',
      desc: 'Clinical symptom triage classifying urgency into Emergency, Moderate, and Low with bilingual (Bangla & English) recommendations.',
      status: '200 OK • Latency: 110ms'
    },
    {
      title: 'Vet Telemedicine Slot Booking',
      endpoint: 'POST /api/vet/appointments',
      desc: 'Real-time calendar scheduling preventing double-booking across accredited clinics (Cascade 24/7, Bay Area Exotic, Sunnyvale Wellness).',
      status: '201 Created • Latency: 65ms'
    }
  ];

  workflows.forEach((wf, idx) => {
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

    slide.addText(wf.title, {
      x: xPos + 0.25, y: yPos + 0.15, w: 5.3, h: 0.3,
      fontSize: 13, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain
    });

    slide.addText(wf.endpoint, {
      x: xPos + 0.25, y: yPos + 0.45, w: 3.5, h: 0.25,
      fontSize: 10.5, fontFace: 'Consolas', bold: true, color: COLORS.primaryDark
    });

    slide.addText(wf.status, {
      x: xPos + 3.8, y: yPos + 0.45, w: 1.8, h: 0.25,
      fontSize: 9.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.emerald, align: 'right'
    });

    slide.addText(wf.desc, {
      x: xPos + 0.25, y: yPos + 0.75, w: 5.3, h: 0.85,
      fontSize: 10.5, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 14
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.25, y: yPos + 1.7, w: 5.3, h: 0.42,
      fill: { color: 'EDE7F6' },
      line: { color: COLORS.borderLight, width: 0.8 },
      radius: 0.08
    });

    slide.addText('✓ Integration Verified: Live HTTP communication tested & confirmed.', {
      x: xPos + 0.35, y: yPos + 1.78, w: 5.1, h: 0.26,
      fontSize: 9.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
    });
  });
}

// ==========================================
// SLIDE 8: STATE SYNC & OPTIMISTIC UI
// ==========================================
{
  const slide = createBaseSlide(
    8,
    'PART 2 • DATA SYNCHRONIZATION',
    'Optimistic UI Updates & Error Rollback Mechanisms',
    'Slide 8 explains how Vue.js Pinia/appStore delivers zero perceived latency while guaranteeing server consistency.'
  );

  // Left Column: Optimistic Pattern
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('THE OPTIMISTIC UI PATTERN IN NUZZLE', {
    x: 1.1, y: 1.9, w: 5.2, h: 0.3,
    fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
  });

  slide.addText(
    'In social applications, waiting 100-300ms for network round-trips ruins tactile interaction. Nuzzle utilizes optimistic mutations:',
    {
      x: 1.1, y: 2.25, w: 5.2, h: 0.6,
      fontSize: 10.5, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 14
    }
  );

  const steps = [
    { step: '1. Instant UI Reaction', desc: 'When user taps 💜 Nuzzle, reaction count increments immediately in the local Vue reactive store.' },
    { step: '2. Background REST Dispatch', desc: 'postService.react(postId, "nuzzle") sends async HTTP request in the background.' },
    { step: '3. Automatic Rollback on Error', desc: 'If network fails or server responds with 500/400, count automatically reverts with a toast notification.' }
  ];

  steps.forEach((st, idx) => {
    const yPos = 2.95 + idx * 1.05;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 5.2, h: 0.92,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(st.step, { x: 1.25, y: yPos + 0.1, w: 4.9, h: 0.28, fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain });
    slide.addText(st.desc, { x: 1.25, y: yPos + 0.38, w: 4.9, h: 0.48, fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 13 });
  });

  // Right Column: Implementation Code Sample
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.7, w: 5.7, h: 4.8,
    fill: { color: COLORS.codeBg },
    line: { color: COLORS.indigo, width: 1 },
    radius: 0.15
  });

  slide.addText('REACTIVE STORE MUTATION IMPLEMENTATION', {
    x: 7.1, y: 1.9, w: 5.0, h: 0.3,
    fontSize: 10.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.primary
  });

  const optimisticCode = 
`// In appStore.ts:
export async function togglePostReaction(postId, type) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  // 1. Optimistic Mutation
  const previousState = { ...post.reactions };
  post.reactions[type]++;
  post.isReacted = true;

  try {
    // 2. Async REST API Request
    const res = await postService.react(postId, type);
    if (!res.success) throw new Error(res.error);
  } catch (err) {
    // 3. Rollback on Network Failure
    post.reactions = previousState;
    post.isReacted = false;
    showToast("Failed to save reaction. Please retry.");
  }
}`;

  slide.addText(optimisticCode, {
    x: 7.1, y: 2.25, w: 5.1, h: 4.1,
    fontSize: 9.5, fontFace: 'Consolas', color: COLORS.codeText, lineSpacing: 13
  });
}

// ==========================================
// SLIDE 9: LESSONS LEARNED
// ==========================================
{
  const slide = createBaseSlide(
    9,
    'PART 3 • LESSONS LEARNED & CHALLENGES',
    'Key Technical Hurdles & Architectural Solutions',
    'Slide 9 details 3 significant real-world engineering hurdles encountered during API integration and how they were solved.'
  );

  const lessons = [
    {
      num: 'HURDLE 01',
      title: 'PostgreSQL Pool Starvation',
      challenge: 'Prisma initially failed with "prepared statement already exists" and connection exhaustion on Supabase serverless instances during concurrent traffic.',
      solution: 'Configured dual connection strings: Transaction pooler (Port 6543, pgbouncer=true) for runtime APIs and Session pooler (Port 5432) for schema migrations.',
      color: COLORS.rose
    },
    {
      num: 'HURDLE 02',
      title: 'OAuth Port & Redirect Mismatch',
      challenge: 'Google OAuth redirected back to localhost:3000 resulting in "Connection Refused" because the Vue.js frontend was running on localhost:5173.',
      solution: 'Configured Supabase URL Configuration whitelist to include http://localhost:5173/** and updated redirect_to options in signInWithOAuth.',
      color: COLORS.amber
    },
    {
      num: 'HURDLE 03',
      title: 'Decoupled Environment Security',
      challenge: 'Vercel warned of exposing private database credentials if variables carried framework prefixes like NEXT_PUBLIC_.',
      solution: 'Architected server-side Supabase client to read private SUPABASE_URL and SUPABASE_ANON_KEY while Vue client uses VITE_ public variables.',
      color: COLORS.primaryDark
    }
  ];

  lessons.forEach((l, idx) => {
    const xPos = 0.8 + idx * 3.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.7, w: 3.8, h: 4.8,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1.2 },
      radius: 0.15
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.25, y: 1.9, w: 1.2, h: 0.28,
      fill: { color: 'EDE7F6' },
      line: { color: l.color, width: 0.8 },
      radius: 0.1
    });

    slide.addText(l.num, {
      x: xPos + 0.25, y: 1.94, w: 1.2, h: 0.22,
      fontSize: 9, fontFace: FONT_FAMILY, bold: true, color: l.color, align: 'center'
    });

    slide.addText(l.title, {
      x: xPos + 0.25, y: 2.3, w: 3.3, h: 0.35,
      fontSize: 13.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain
    });

    slide.addText('THE CHALLENGE:', {
      x: xPos + 0.25, y: 2.7, w: 3.3, h: 0.2,
      fontSize: 9.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.rose
    });

    slide.addText(l.challenge, {
      x: xPos + 0.25, y: 2.95, w: 3.3, h: 0.9,
      fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 14
    });

    slide.addShape(pptx.ShapeType.line, {
      x: xPos + 0.25, y: 3.95, w: 3.3, h: 0,
      line: { color: COLORS.borderLight, width: 1 }
    });

    slide.addText('HOW WE SOLVED IT:', {
      x: xPos + 0.25, y: 4.1, w: 3.3, h: 0.2,
      fontSize: 9.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.emerald
    });

    slide.addText(l.solution, {
      x: xPos + 0.25, y: 4.35, w: 3.3, h: 1.9,
      fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMain, lineSpacing: 14
    });
  });
}

// ==========================================
// SLIDE 10: IMPROVEMENTS MADE & FRESH RELEASE
// ==========================================
{
  const slide = createBaseSlide(
    10,
    'PART 3 • IMPROVEMENTS & RELEASE READINESS',
    'Production Improvements & Fresh Account Lifecycle Engineering',
    'Slide 10 highlights the key improvements made, fresh account release lifecycle, and deployment readiness.'
  );

  // Left Column: Major Improvements
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('4 MAJOR ENGINEERING IMPROVEMENTS MADE', {
    x: 1.1, y: 1.9, w: 5.2, h: 0.3,
    fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
  });

  const improvements = [
    { title: '1. Mock Data to PostgreSQL Cloud Migration', desc: 'Migrated from in-memory arrays to 18 live tables on Supabase Cloud PostgreSQL with relational integrity.' },
    { title: '2. Google OAuth 2.0 Integration', desc: 'Engineered 1-click Google authentication capturing user profile, display name, and avatar seamlessly.' },
    { title: '3. Fresh Account Lifecycle & Data Isolation', desc: 'New users land on a clean slate without inheriting demo pets or mock memories. Fresh pet registration & personal photo grid.' },
    { title: '4. First-Visit Auth Gate', desc: 'Enforced authentication guard so fresh visitors must log in or sign up before accessing the Den Feed.' }
  ];

  improvements.forEach((imp, idx) => {
    const yPos = 2.3 + idx * 1.05;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y: yPos, w: 5.2, h: 0.95,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 },
      radius: 0.1
    });

    slide.addText(imp.title, { x: 1.25, y: yPos + 0.1, w: 4.9, h: 0.28, fontSize: 11.5, fontFace: FONT_FAMILY, bold: true, color: COLORS.textMain });
    slide.addText(imp.desc, { x: 1.25, y: yPos + 0.4, w: 4.9, h: 0.48, fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted, lineSpacing: 13 });
  });

  // Right Column: Release Status & Deliverables
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.7, w: 5.7, h: 4.8,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1 },
    radius: 0.15
  });

  slide.addText('PRODUCTION RELEASE SUMMARY & REPOSITORIES', {
    x: 7.1, y: 1.9, w: 5.0, h: 0.3,
    fontSize: 11, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
  });

  const stats = [
    { num: '18+', label: 'REST API Handlers', color: COLORS.primaryDark },
    { num: '18', label: 'Database Models', color: COLORS.emerald },
    { num: '1-Click', label: 'Google OAuth 2.0', color: COLORS.indigo },
    { num: '100%', label: 'Type-Safe (TS)', color: COLORS.rose }
  ];

  stats.forEach((st, idx) => {
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

    slide.addText(st.num, { x: xPos + 0.15, y: yPos + 0.1, w: 2.15, h: 0.45, fontSize: 20, fontFace: FONT_FAMILY, bold: true, color: st.color });
    slide.addText(st.label, { x: xPos + 0.15, y: yPos + 0.55, w: 2.15, h: 0.35, fontSize: 10, fontFace: FONT_FAMILY, color: COLORS.textMuted });
  });

  // Repositories Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.1, y: 4.8, w: 5.1, h: 1.4,
    fill: { color: 'EDE7F6' },
    line: { color: COLORS.border, width: 1 },
    radius: 0.12
  });

  slide.addText('📦 PRODUCTION GITHUB REPOSITORIES:', {
    x: 7.3, y: 4.95, w: 4.7, h: 0.25,
    fontSize: 10, fontFace: FONT_FAMILY, bold: true, color: COLORS.primaryDark
  });

  slide.addText('• Frontend Repo: https://github.com/zafor2002/nuzzle-\n• Backend Repo:  https://github.com/zafor2002/nuzzle-backend\n• Live Status:   Nuzzle API v2.0 Console Operational', {
    x: 7.3, y: 5.25, w: 4.7, h: 0.85,
    fontSize: 9.5, fontFace: 'Consolas', color: COLORS.textMain, lineSpacing: 13
  });
}

// Build and Save Presentation Files
async function build() {
  console.log('Generating Nuzzle Round 2 Backend & API Presentation...');

  const filesToSave = [
    OUTPUT_FILE,
    V2_OUTPUT_FILE,
    ROOT_OUTPUT_FILE,
    ALT_OUTPUT_FILE,
    ALT_ROOT_FILE
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
