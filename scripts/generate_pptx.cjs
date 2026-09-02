const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();

// Explicitly define modern 16:9 Widescreen (13.333 x 7.5 inches)
pptx.defineLayout({ name: 'MODERN_16_9', width: 13.333, height: 7.5 });
pptx.layout = 'MODERN_16_9';

// Presentation Properties
pptx.author = 'Abu Zafor, Nadim Rahman, Rizvi Sarker';
pptx.company = 'Nuzzle (Dhaka, Bangladesh)';
pptx.title = 'Nuzzle — The Social Network for Pets (AI-Powered, Built for Bangladesh)';
pptx.subject = 'Comprehensive UI/UX Pitch & Prototype Presentation (Gigalogy Technopreneurship 2026)';

const SCREENSHOTS_DIR = path.resolve(__dirname, '../presentation_screenshots');
const OUTPUT_FILE = path.resolve(__dirname, '../presentation/Nuzzle_UIUX_Presentation.pptx');
const V2_OUTPUT_FILE = path.resolve(__dirname, '../Nuzzle_UIUX_Presentation_v2.pptx');

// Soothing Lavender & Pearl White Palette
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
  rose: 'F43F5E'
};

function createBaseSlide(slideNumber, eyebrowText, titleText, speakerNotes) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgSlide };

  // Top Header Bar across full 13.333 width
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.333, h: 0.65,
    fill: { color: COLORS.bgHeader },
    line: { color: COLORS.border, width: 1 }
  });

  slide.addText('🐾 Nuzzle', {
    x: 0.8, y: 0.12, w: 3.5, h: 0.4,
    fontSize: 14, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark
  });

  slide.addText(`Slide ${slideNumber} / 10 • UI/UX Pitch`, {
    x: 8.5, y: 0.12, w: 4.0, h: 0.4,
    fontSize: 10.5, fontFace: 'Times New Roman', color: COLORS.textMuted, align: 'right'
  });

  // Eyebrow
  if (eyebrowText) {
    slide.addText(eyebrowText.toUpperCase(), {
      x: 0.8, y: 0.8, w: 11.733, h: 0.25,
      fontSize: 9.5, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark, charSpacing: 1.2
    });
  }

  // Slide Title
  if (titleText) {
    slide.addText(titleText, {
      x: 0.8, y: 1.05, w: 11.733, h: 0.5,
      fontSize: 20, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
    });
  }

  // Bottom Footer
  slide.addShape(pptx.ShapeType.line, {
    x: 0.8, y: 6.8, w: 11.733, h: 0,
    line: { color: COLORS.borderLight, width: 1 }
  });

  slide.addText('Technopreneurship 2026 • Abu Zafor, Nadim Rahman, Rizvi Sarker', {
    x: 0.8, y: 6.9, w: 8.0, h: 0.3,
    fontSize: 9.5, fontFace: 'Times New Roman', color: COLORS.textDim
  });

  if (speakerNotes) {
    slide.notes = speakerNotes;
  }

  return slide;
}

// ==========================================
// SLIDE 1: INTRODUCTION
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgSlide };

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.5, y: 0.9, w: 10.333, h: 5.6, r: 0.25,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.5 },
    shadow: { type: 'outer', color: '947DEE', blur: 14, offset: 4, angle: 90, opacity: 0.15 }
  });

  slide.addText('SESSION-01: UI/UX PRESENTATION • 5-MINUTE PITCH', {
    x: 1.8, y: 1.25, w: 9.733, h: 0.3,
    fontSize: 11, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark, align: 'center', charSpacing: 1.5
  });

  slide.addText('Nuzzle: The AI-Powered Pet Social Network', {
    x: 1.8, y: 1.65, w: 9.733, h: 0.65,
    fontSize: 26, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain, align: 'center'
  });

  slide.addText('Built for Bangladesh • MVP Development & Dhaka Launch', {
    x: 1.8, y: 2.35, w: 9.733, h: 0.35,
    fontSize: 13.5, fontFace: 'Times New Roman', bold: true, color: COLORS.primary, align: 'center'
  });

  slide.addText(
    '"An AI-powered, pet-first mobile social ecosystem uniting Dhaka\'s pet parents through dedicated pet profiles, 24/7 AI health triage, visual lost-pet matching, and emergency street-rescue dispatch."',
    {
      x: 2.0, y: 2.9, w: 9.333, h: 1.2,
      fontSize: 13, fontFace: 'Times New Roman', color: COLORS.textMuted, italic: true, align: 'center', lineSpacing: 18
    }
  );

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 2.0, y: 4.5, w: 9.333, h: 0.65, r: 0.15,
    fill: { color: COLORS.bgSubtle },
    line: { color: COLORS.border, width: 1 }
  });

  slide.addText('👥 Project Team: Abu Zafor • Nadim Rahman • Rizvi Sarker    |    📍 Focus: Dhaka Launch (July 2026)', {
    x: 2.2, y: 4.65, w: 8.933, h: 0.35,
    fontSize: 11.5, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain, align: 'center'
  });

  slide.notes = `Good day honorable judges and participants. My name is Abu Zafor, and on behalf of our team with Nadim Rahman and Rizvi Sarker, I am excited to present Nuzzle. In one sentence: Nuzzle is an AI-powered, pet-first mobile social ecosystem that combines everyday locality-based pet social networking with 24/7 AI health triage, visual lost-pet matching, and emergency rescue dispatch for Bangladesh's rapidly growing pet community. Let's dive in!`;
}

// ==========================================
// SLIDE 2: WHAT IS NUZZLE & WHAT ARE WE SOLVING?
// ==========================================
{
  const notes = `What is Nuzzle and what are we solving? In Nuzzle, the pet is the account—not a sub-photo on a human profile. We solve the four critical failures of today's Facebook pet groups: lost pets getting lost in feed noise, medical symptom panic, zero coordination for injured street strays, and fragmented local discovery. Crucially, our daily social layer builds the local density and multi-photo training dataset that makes our AI accurate during episodic crises.`;

  const slide = createBaseSlide(2, 'Core Concept • The Strategic Insight', 'What is Nuzzle & What Are We Solving?', notes);

  // Left Box: What is Nuzzle
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 }
  });

  slide.addText('🐾 What is Nuzzle?', {
    x: 1.05, y: 1.9, w: 5.166, h: 0.35,
    fontSize: 14, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
  });

  slide.addText(
    'The structural decision that defines the product: The pet holds the account, not the owner. An animal has its own profile with photo history, milestones, health logs, and personality-driven bio.\n\nOn top of this social foundation sit 3 AI systems:\n• Visual Lost-Pet Matching (embedding similarity)\n• 24/7 Health Urgency Triage (Bangla/English)\n• Adoption Compatibility Matching & Street Rescue Alerts.',
    {
      x: 1.05, y: 2.35, w: 5.166, h: 3.9,
      fontSize: 11, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 16
    }
  );

  // Right Box: What are we solving
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.866, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 }
  });

  slide.addText('⚡ What Problem Are We Solving?', {
    x: 7.1, y: 1.9, w: 5.166, h: 0.35,
    fontSize: 14, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
  });

  slide.addText(
    'Bangladesh pet ownership surged +170% in 3 years (Tk 500 Cr cat food market), yet all interactions happen in unorganized Facebook groups:\n\n1. Lost pets go unrecovered due to massive post volume.\n2. First-time owners panic over basic symptoms.\n3. Injured street animals have zero dispatch route.\n4. Pet businesses have no targeted storefronts.',
    {
      x: 7.1, y: 2.35, w: 5.166, h: 2.4,
      fontSize: 10.5, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 15
    }
  );

  // Symbiotic Loop Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.1, y: 4.95, w: 5.166, h: 1.35, r: 0.1,
    fill: { color: COLORS.bgSubtle },
    line: { color: COLORS.border, width: 1 }
  });

  slide.addText('Daily Social Layer ⇄ Episodic AI Utility', {
    x: 7.25, y: 5.08, w: 4.866, h: 0.28,
    fontSize: 11, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark
  });

  slide.addText('Social retention generates the local density & training data that makes AI matching work in crises.', {
    x: 7.25, y: 5.38, w: 4.866, h: 0.75,
    fontSize: 10, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 13
  });
}

// ==========================================
// SLIDE 3: KEY LEARNINGS FROM UI/UX SESSION
// ==========================================
{
  const notes = `During our UI/UX sessions, four core principles profoundly influenced our design approach. First, Pet-As-Entity Architecture: we moved away from generic human social feeds to make the pet the account holder. Second, Emotional Calm Ergonomics: during a lost-pet crisis or illness, high-contrast aggressive feeds cause panic. Our soothing lavender and white textured palette provides calm reassurance. Third, Zero-Barrier Emergency UX: reporting an injured street stray takes under 30 seconds with no login required. And fourth, Tactile Pet Reactions: we replaced generic likes with Facebook-style Paw Fives, Nuzzles, Treats, and Purrs.`;

  const slide = createBaseSlide(3, 'Section 2 • UI/UX Principles & Insights', 'Key Learnings from the UI/UX Session', notes);

  const learnings = [
    {
      icon: '🐾',
      title: 'Pet-As-Entity Architecture',
      desc: 'The pet holds the account, milestones, and medical record—providing structured canonical data for downstream AI matching.',
      tag: 'Core IA Strategy'
    },
    {
      icon: '💜',
      title: 'Calm Lavender Ergonomics',
      desc: 'During lost-pet panic or symptoms, loud feeds heighten anxiety. Our soothing lavender palette fosters trust & de-escalation.',
      tag: 'Emotional UX'
    },
    {
      icon: '⚡',
      title: 'Zero-Barrier Emergency UX',
      desc: 'Reporting an injured animal takes <30s with zero mandatory login—eliminating friction at life-or-death moments.',
      tag: 'Frictionless Action'
    },
    {
      icon: '✨',
      title: 'Tactile Pet Micro-Reactions',
      desc: 'Facebook-style pet reaction dock: Paw Five 🐾, Nuzzle 💜, Treat 🦴, Fetch 🎾, and Purr 😻 for joyful community bond.',
      tag: 'Micro-Interactions'
    }
  ];

  learnings.forEach((item, index) => {
    const xPos = 0.8 + (index * 2.995); // 0.8, 3.795, 6.79, 9.785
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos, y: 1.7, w: 2.745, h: 4.8, r: 0.15,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1.2 }
    });

    slide.addText(item.icon, {
      x: xPos + 0.15, y: 1.9, w: 0.8, h: 0.5,
      fontSize: 22
    });

    slide.addText(item.title, {
      x: xPos + 0.15, y: 2.45, w: 2.445, h: 0.45,
      fontSize: 12.5, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
    });

    slide.addText(item.desc, {
      x: xPos + 0.15, y: 3.0, w: 2.445, h: 2.7,
      fontSize: 10.5, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 14
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.15, y: 5.95, w: 2.445, h: 0.35, r: 0.1,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 }
    });

    slide.addText(item.tag, {
      x: xPos + 0.15, y: 6.0, w: 2.445, h: 0.25,
      fontSize: 9, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark, align: 'center'
    });
  });
}

// ==========================================
// SLIDE 4: PROBLEM STATEMENT & TARGET USERS
// ==========================================
{
  const notes = `Looking at the Problem and Target Users: Bangladesh's pet ownership exploded by 170% over the last three years, with cats accounting for 90% of pets and a Tk 500 Crore market. Yet, this entire community is trapped in fragmented Facebook groups where pets have no online identity, lost pets go unrecovered, symptoms trigger panic, and injured street animals have no route to help. We serve three distinct segments: 64M social users in Dhaka (B2C), 4,225+ pet businesses and 225+ clinics needing verified storefronts (B2B), and dedicated animal rescue volunteers.`;

  const slide = createBaseSlide(4, 'Section 3 • Market Reality & Personas', 'Problem Statement & Target Users in Bangladesh', notes);

  // Left Box: Problem
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 }
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.05, y: 1.9, w: 5.166, h: 0.95, r: 0.1,
    fill: { color: COLORS.bgSubtle },
    line: { color: COLORS.border, width: 1 }
  });

  slide.addText('+170% Pet Ownership Surge (3 Years)', {
    x: 1.2, y: 2.0, w: 4.866, h: 0.35,
    fontSize: 14, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark
  });

  slide.addText('~90% cats • Tk 500 Cr (US$43M) cat-food market • 4,000+ shops • 225+ clinics', {
    x: 1.2, y: 2.35, w: 4.866, h: 0.35,
    fontSize: 9.5, fontFace: 'Times New Roman', color: COLORS.textMuted
  });

  slide.addText('Core Pain Points in Bangladesh:', {
    x: 1.05, y: 3.05, w: 5.166, h: 0.35,
    fontSize: 12.5, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
  });

  const problems = [
    '• Pets have zero persistent online identity on Facebook.',
    '• Lost-pet posts get buried rapidly without visual matching.',
    '• Symptom panic vs dangerous care delay for first-time owners.',
    '• Injured street strays have no geo-targeted route to rescue.'
  ];

  slide.addText(problems.join('\n'), {
    x: 1.05, y: 3.45, w: 5.166, h: 2.8,
    fontSize: 10.5, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 15
  });

  // Right Box: 3 Target Personas
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.866, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 }
  });

  slide.addText('3 Core Customer Segments (Dhaka Focus):', {
    x: 7.1, y: 1.9, w: 5.166, h: 0.35,
    fontSize: 13, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
  });

  const segments = [
    { title: 'Segment A (B2C): Pet Parents & Adopters', desc: 'Dhaka pet owners (Dhanmondi, Gulshan, Uttara) needing daily social community, digital passports, and 24/7 AI health support.' },
    { title: 'Segment B (B2B): Pet Shops, Groomers & Clinics', desc: '4,225+ shops nationwide with zero pet-tailored digital discovery. Monetized via Tk 500/month verified subscriptions.' },
    { title: 'Segment C (Welfare): Rescue Volunteers & Shelters', desc: 'Active Dhaka street-animal rescue network utilizing geo-fenced claim-and-lock dispatch free of charge.' }
  ];

  segments.forEach((seg, i) => {
    const yP = 2.35 + (i * 1.35);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.1, y: yP, w: 5.166, h: 1.2, r: 0.1,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 }
    });

    slide.addText(seg.title, {
      x: 7.25, y: yP + 0.1, w: 4.866, h: 0.28,
      fontSize: 10.5, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark
    });

    slide.addText(seg.desc, {
      x: 7.25, y: yP + 0.42, w: 4.866, h: 0.7,
      fontSize: 9.5, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 13
    });
  });
}

// ==========================================
// SLIDE 5: DESIGN PROCESS & SYSTEM DESIGN
// ==========================================
{
  const notes = `Our Design Process translated user pain points into three defensible workflows. First, our Locality-Ranked Den Feed ranks posts by proximity rather than engagement, building familiar neighborhood safety density. Second, our 3-Tier AI Health Triage allows owners to input symptoms in Bangla or English, classifying cases into Monitor at Home, See Vet within 24-48h, or Emergency Care Now—deliberately escalation-biased for safety. Third, our Geo-Fenced Rescue Alert utilizes a progressive radius claim-and-lock system so volunteers never duplicate effort.`;

  const slide = createBaseSlide(5, 'Section 4 • User Flows & System Design', 'Design Process & Architectural Decisions', notes);

  const pillars = [
    {
      icon: '📍',
      title: '1. Locality-First Feed',
      desc: 'Ranked strictly by recency and neighborhood proximity rather than dopamine engagement algorithms. Builds local density so lost pets are recognized immediately by neighbors.',
      sub: 'PostGIS Geo-Radius Queries'
    },
    {
      icon: '🩺',
      title: '2. 3-Tier Health Triage',
      desc: 'Symptoms described in Bangla or English. Classifies into: (1) Monitor at home, (2) See vet in 24-48h, or (3) Emergency Care Now. Escalation-biased for veterinary safety.',
      sub: 'Licensed Vet-Signed Taxonomy'
    },
    {
      icon: '🚨',
      title: '3. Claim-and-Lock Rescue',
      desc: 'Geo-fenced alert broadcast to nearest registered NGO volunteers. First responder claims and locks report, preventing wasted trips and showing live arrival status.',
      sub: 'Progressive Radius Dispatch'
    }
  ];

  pillars.forEach((p, i) => {
    const xP = 0.8 + (i * 4.027); // 0.8, 4.827, 8.854
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xP, y: 1.7, w: 3.677, h: 4.8, r: 0.15,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1.2 }
    });

    slide.addText(p.icon, {
      x: xP + 0.2, y: 1.9, w: 0.8, h: 0.5,
      fontSize: 24
    });

    slide.addText(p.title, {
      x: xP + 0.2, y: 2.55, w: 3.277, h: 0.45,
      fontSize: 13.5, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
    });

    slide.addText(p.desc, {
      x: xP + 0.2, y: 3.1, w: 3.277, h: 2.6,
      fontSize: 10.5, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 15
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xP + 0.2, y: 5.95, w: 3.277, h: 0.35, r: 0.1,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 }
    });

    slide.addText(p.sub, {
      x: xP + 0.2, y: 6.0, w: 3.277, h: 0.25,
      fontSize: 9, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark, align: 'center'
    });
  });
}

// ==========================================
// SLIDE 6: UI DEEP DIVE — DEN FEED & REACTIONS
// ==========================================
{
  const notes = `Looking at our UI in detail: The Den Feed features magazine-style moment cards with pet mood badges, soundbite indicators, and our signature Facebook-style Pet Multi-Reaction Dock—allowing users to tap or hover to give Paw Fives, Nuzzles, Treats, Tennis Balls, or Purrs with celebratory bursts!`;

  const slide = createBaseSlide(6, 'UI Deep Dive • Feed & Micro-Interactions', 'Den Feed & Facebook-Style Pet Reaction Dock', notes);

  // Left Screenshot Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 }
  });

  const feedImg = path.join(SCREENSHOTS_DIR, '01_home_feed.png');
  if (fs.existsSync(feedImg)) {
    slide.addImage({
      path: feedImg,
      x: 1.05, y: 1.85, w: 5.166, h: 4.5
    });
  }

  // Right Details Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.866, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 }
  });

  slide.addText('✨ Key UI Components & Interactions:', {
    x: 7.1, y: 1.9, w: 5.166, h: 0.35,
    fontSize: 13, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
  });

  const uiItems = [
    { title: '1. Facebook-Style Pet Reaction Dock', desc: 'Hover/click opens floating frosted dock with 1.4x zoom: 🐾 Paw Five, 💜 Nuzzle, 🦴 Treat, 🎾 Fetch, 😻 Purr.' },
    { title: '2. Pet Mood & Soundbite Bar', desc: 'Pills displaying active pet moods (🐾 Zoomies) and audio waveform barks (🎵 Excited Panting & Tail Wag).' },
    { title: '3. Pet Thought Dialogue Bubbles', desc: 'First-person pet monologues: 💭 "I am the Supreme Branch Master. This stick belongs in the Smithsonian."' },
    { title: '4. Organic Media Container', desc: '22px asymmetric squircle corners with floating location capsules and double-tap celebration bursts.' }
  ];

  uiItems.forEach((item, i) => {
    const yP = 2.35 + (i * 1.05);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.1, y: yP, w: 5.166, h: 0.95, r: 0.1,
      fill: { color: COLORS.bgSubtle },
      line: { color: COLORS.borderLight, width: 1 }
    });

    slide.addText(item.title, {
      x: 7.25, y: yP + 0.08, w: 4.866, h: 0.25,
      fontSize: 10.5, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark
    });

    slide.addText(item.desc, {
      x: 7.25, y: yP + 0.36, w: 4.866, h: 0.55,
      fontSize: 9.5, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 13
    });
  });
}

// ==========================================
// SLIDE 7: UI DEEP DIVE — PAWAI INTELLIGENCE SUITE
// ==========================================
{
  const notes = `Our PawAI Intelligence Suite includes PetScan AI Vision for breed & coat health, PawDoctor 24/7 symptom triage in Bangla and English with clinic routing, an AI audio Voice Translator, and an AI Playdate Matcher.`;

  const slide = createBaseSlide(7, 'UI Deep Dive • AI Vision & Triage Suite', 'PawAI Intelligence Suite & 24/7 Triage', notes);

  const aiScreens = [
    {
      img: path.join(SCREENSHOTS_DIR, '03_pawai_scanner.png'),
      title: '📸 PetScan AI Vision',
      desc: 'Computer vision biometric scanning for breed purity (98.4%), body condition score, coat sheen, and facial emotion.'
    },
    {
      img: path.join(SCREENSHOTS_DIR, '04_pawai_triage.png'),
      title: '🩺 24/7 Symptom Triage',
      desc: 'Bangla & English natural language health triage classifying into Low, Moderate, or Critical urgency with emergency vet routing.'
    },
    {
      img: path.join(SCREENSHOTS_DIR, '05_pawai_translator.png'),
      title: '🎙️ Audio Voice Translator',
      desc: 'Captures bark and meow audio waveforms to translate pet vocalizations into humorous first-person thoughts.'
    }
  ];

  aiScreens.forEach((sc, i) => {
    const xP = 0.8 + (i * 4.027); // 0.8, 4.827, 8.854
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xP, y: 1.7, w: 3.677, h: 4.8, r: 0.15,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1.2 }
    });

    if (fs.existsSync(sc.img)) {
      slide.addImage({
        path: sc.img,
        x: xP + 0.15, y: 1.85, w: 3.377, h: 2.1
      });
    }

    slide.addText(sc.title, {
      x: xP + 0.15, y: 4.05, w: 3.377, h: 0.35,
      fontSize: 12.5, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
    });

    slide.addText(sc.desc, {
      x: xP + 0.15, y: 4.45, w: 3.377, h: 1.9,
      fontSize: 10, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 14
    });
  });
}

// ==========================================
// SLIDE 8: UI DEEP DIVE — SAFETY, STORIES & PASSPORT
// ==========================================
{
  const notes = `For Safety and Daily Delight: Our 5-Mile Lost & Found Radar uses image embedding similarity; Snuggle Circles provide squircle story trays; and our Floating Island navigation includes a digital Pet Passport and an on-the-fly pet switcher.`;

  const slide = createBaseSlide(8, 'UI Deep Dive • Safety, Stories & Passport', 'Safety Radar, Snuggle Circles & Pet Passport', notes);

  const safetyScreens = [
    {
      img: path.join(SCREENSHOTS_DIR, '09_lost_and_found.png'),
      title: '🚨 5-Mile Emergency Radar',
      desc: 'Visual embedding photo comparison and <30-second zero-barrier injured animal report dispatch with claim-and-lock.'
    },
    {
      img: path.join(SCREENSHOTS_DIR, '02_story_viewer.png'),
      title: '✨ Snuggle Circles Stories',
      desc: 'Squircle daily story carousel with live pet activity tags (☁️ Zoomies, 🎶 Singing) and glowing lavender borders.'
    },
    {
      img: path.join(SCREENSHOTS_DIR, '14_pet_persona_profile.png'),
      title: '🐾 Pet Passport & Switching',
      desc: 'Floating Island Navigation capsule bar, on-the-fly pet perspective switcher, and complete digital health passports.'
    }
  ];

  safetyScreens.forEach((sc, i) => {
    const xP = 0.8 + (i * 4.027); // 0.8, 4.827, 8.854
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xP, y: 1.7, w: 3.677, h: 4.8, r: 0.15,
      fill: { color: COLORS.bgCard },
      line: { color: COLORS.border, width: 1.2 }
    });

    if (fs.existsSync(sc.img)) {
      slide.addImage({
        path: sc.img,
        x: xP + 0.15, y: 1.85, w: 3.377, h: 2.1
      });
    }

    slide.addText(sc.title, {
      x: xP + 0.15, y: 4.05, w: 3.377, h: 0.35,
      fontSize: 12.5, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
    });

    slide.addText(sc.desc, {
      x: xP + 0.15, y: 4.45, w: 3.377, h: 1.9,
      fontSize: 10, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 14
    });
  });
}

// ==========================================
// SLIDE 9: DESIGN SYSTEM & ACCESSIBILITY
// ==========================================
{
  const notes = `Our Design System employs a soothing Lavender and Pearl White textured theme, frosted glassmorphism, and titanium bezels—accessible in both light and dark modes.`;

  const slide = createBaseSlide(9, 'Design System • Tokens & Aesthetics', 'Lavender & White Textured Design Tokens', notes);

  // Left Details Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 }
  });

  slide.addText('🎨 Curated Design Tokens:', {
    x: 1.05, y: 1.9, w: 5.166, h: 0.35,
    fontSize: 13.5, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
  });

  slide.addText(
    '• Primary Lavender (#947DEE): Evokes care, calm, and clinical trust.\n• Deep Violet (#7C3AED): High-contrast accent for interactive states.\n• Pearl White (#FCFAFF): Textured background reducing glare.\n• Deep Plum Ink (#261E38): WCAG AAA compliant text contrast.\n• Frosted Glassmorphism: backdrop-filter: blur(24px) with multi-layer shadows.\n• Typography: Plus Jakarta Sans (body) & Outfit (display branding).',
    {
      x: 1.05, y: 2.35, w: 5.166, h: 4.0,
      fontSize: 10.5, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 16
    }
  );

  // Right Screenshot Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.866, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 }
  });

  const darkImg = path.join(SCREENSHOTS_DIR, '17_dark_theme_mode.png');
  if (fs.existsSync(darkImg)) {
    slide.addImage({
      path: darkImg,
      x: 7.1, y: 1.85, w: 5.166, h: 3.5
    });
  }

  slide.addText('🌙 Dual Light & Dark Theme Accessibility', {
    x: 7.1, y: 5.5, w: 5.166, h: 0.3,
    fontSize: 12, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
  });

  slide.addText('Seamless toggle preserving high-contrast legibility across bright daylight and night.', {
    x: 7.1, y: 5.85, w: 5.166, h: 0.55,
    fontSize: 9.5, fontFace: 'Times New Roman', color: COLORS.textMuted
  });
}

// ==========================================
// SLIDE 10: CONCLUSION & ROADMAP
// ==========================================
{
  const notes = `To conclude: Creating this prototype validated that the social layer and AI systems form an indispensable compounding loop. Our 6-Month MVP Roadmap targets a public launch in Dhaka with 10,000 registered users, 12,000 pet profiles, and 150 verified businesses. Pets are family. Nuzzle gives them the platform they deserve. Thank you!`;

  const slide = createBaseSlide(10, 'Section 6 • Learnings, Roadmap & Conclusion', 'Conclusion & Six-Month Dhaka Launch Roadmap', notes);

  // Left Box: Roadmap
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 }
  });

  slide.addText('🚀 6-Month Roadmap & Gate Criteria (Dhaka):', {
    x: 1.05, y: 1.9, w: 5.166, h: 0.35,
    fontSize: 13, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
  });

  const roadmap = [
    '• Months 1–2 (Foundation): Pet profiles, follow graph, locality feed, UX complete.',
    '• Month 3 (Lost-Pet AI): Precision@5 ≥ 60% with visual embedding similarity.',
    '• Month 4 (Triage & Rescue): Vet sign-off, <5% under-triage rate, 20+ responders.',
    '• Month 5 (Adoption AI): Compatibility scoring, 50 verified shops, 10 shelters.',
    '• Month 6 (Public Launch): 10,000 users, 12,000 pet profiles in Dhaka.'
  ];

  slide.addText(roadmap.join('\n\n'), {
    x: 1.05, y: 2.35, w: 5.166, h: 3.9,
    fontSize: 10, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 14
  });

  // Right Box: Key Learnings & Closing
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.866, y: 1.7, w: 5.666, h: 4.8, r: 0.15,
    fill: { color: COLORS.bgSubtle },
    line: { color: COLORS.border, width: 1.2 }
  });

  slide.addText('💡 Key Prototype Learnings:', {
    x: 7.1, y: 1.9, w: 5.166, h: 0.35,
    fontSize: 13.5, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain
  });

  slide.addText(
    'The social layer earns daily attention and generates continuous multi-photo training data; the AI features provide indispensable crisis support.\n\nNeither half functions without the other, and building them together creates a compounding network moat.',
    {
      x: 7.1, y: 2.3, w: 5.166, h: 1.8,
      fontSize: 11, fontFace: 'Times New Roman', color: COLORS.textMuted, lineSpacing: 15
    }
  );

  // Closing Remark Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.1, y: 4.45, w: 5.166, h: 1.85, r: 0.1,
    fill: { color: COLORS.bgCard },
    line: { color: COLORS.border, width: 1.2 },
    shadow: { type: 'outer', color: '947DEE', blur: 10, offset: 3, angle: 90, opacity: 0.15 }
  });

  slide.addText('🐾 CLOSING REMARK', {
    x: 7.3, y: 4.65, w: 4.766, h: 0.25,
    fontSize: 9.5, fontFace: 'Times New Roman', bold: true, color: COLORS.primaryDark, charSpacing: 1
  });

  slide.addText('"Pets are family. Nuzzle gives them the dedicated, intelligent, and compassionate platform they deserve."', {
    x: 7.3, y: 5.0, w: 4.766, h: 1.1,
    fontSize: 12, fontFace: 'Times New Roman', bold: true, color: COLORS.textMain, italic: true
  });
}

// Ensure output directories exist
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const v2OutputDir = path.dirname(V2_OUTPUT_FILE);
if (!fs.existsSync(v2OutputDir)) {
  fs.mkdirSync(v2OutputDir, { recursive: true });
}

// Generate Presentation
async function build() {
  const filesToSave = [
    OUTPUT_FILE,
    V2_OUTPUT_FILE,
    path.resolve(__dirname, '../../Nuzzle_UIUX_Presentation.pptx'),
    path.resolve(__dirname, '../../Nuzzle_UIUX_Presentation_v2.pptx')
  ];

  for (const file of filesToSave) {
    try {
      await pptx.writeFile({ fileName: file });
      console.log(`✅ Saved: ${file}`);
    } catch (err) {
      console.warn(`Could not overwrite ${file} (likely open in PowerPoint).`);
    }
  }
}

build().catch(err => {
  console.error('❌ Error generating presentation:', err);
});
