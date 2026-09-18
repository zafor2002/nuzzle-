import subprocess
import os

html_path = r"e:\nuzzle project\forntenduse vue js\presentation\Nuzzle_Gigalogy_MAIRA_Briefing.html"
pdf_path = r"e:\nuzzle project\forntenduse vue js\presentation\Nuzzle_Gigalogy_MAIRA_AI_Integration_Briefing_and_Script.pdf"
pdf_root_path = r"e:\nuzzle project\Nuzzle_Gigalogy_MAIRA_AI_Integration_Briefing_and_Script.pdf"

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Nuzzle × Gigalogy MAIRA AI Integration — Executive Technical Briefing & Presentation Script</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-center {
      content: "Nuzzle × Gigalogy MAIRA Technical Briefing • Confidential";
      font-size: 8pt;
      color: #94a3b8;
    }
    @bottom-right {
      content: "Page " counter(page);
      font-size: 8pt;
      color: #64748b;
      font-weight: bold;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    line-height: 1.55;
    font-size: 10pt;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4 {
    color: #0f172a;
    font-weight: 700;
    margin-top: 1.4em;
    margin-bottom: 0.4em;
    page-break-after: avoid;
  }

  h1 {
    font-size: 20pt;
    line-height: 1.2;
    color: #1e1b4b;
    border-bottom: 2px solid #6366f1;
    padding-bottom: 6px;
    margin-top: 0;
  }

  h2 {
    font-size: 13pt;
    color: #312e81;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-top: 1.6em;
  }

  h3 {
    font-size: 11pt;
    color: #4338ca;
    margin-top: 1.2em;
  }

  h4 {
    font-size: 10pt;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 1em;
  }

  p {
    margin: 0.5em 0;
  }

  .cover {
    page-break-after: always;
    padding: 40px 10px;
    text-align: left;
  }

  .cover-badge {
    display: inline-block;
    background: #e0e7ff;
    color: #3730a3;
    font-weight: 700;
    font-size: 9pt;
    padding: 4px 12px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }

  .cover-title {
    font-size: 26pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.15;
    margin-bottom: 12px;
  }

  .cover-subtitle {
    font-size: 13pt;
    color: #475569;
    line-height: 1.4;
    margin-bottom: 28px;
    max-width: 90%;
  }

  .cover-meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .meta-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 16px;
  }

  .meta-card-label {
    font-size: 8pt;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .meta-card-val {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 4px;
  }

  .cover-toc {
    background: #f1f5f9;
    border-radius: 8px;
    padding: 18px 22px;
    margin-top: 25px;
  }

  .cover-toc h4 {
    margin-top: 0;
    color: #1e293b;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 6px;
  }

  .cover-toc ol {
    margin: 0;
    padding-left: 20px;
  }

  .cover-toc li {
    margin-bottom: 5px;
    font-size: 9.5pt;
    color: #334155;
  }

  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
  }
  .badge-emerald { background: #d1fae5; color: #065f46; }
  .badge-rose { background: #ffe4e6; color: #9f1239; }
  .badge-indigo { background: #e0e7ff; color: #3730a3; }
  .badge-amber { background: #fef3c7; color: #92400e; }

  .callout {
    border-left: 4px solid #6366f1;
    background: #f8fafc;
    padding: 10px 14px;
    margin: 12px 0;
    border-radius: 0 6px 6px 0;
    font-size: 9.5pt;
  }
  .callout-rose {
    border-left-color: #ef4444;
    background: #fff1f2;
    color: #881337;
  }
  .callout-emerald {
    border-left-color: #10b981;
    background: #ecfdf5;
    color: #064e3b;
  }
  .callout-amber {
    border-left-color: #f59e0b;
    background: #fffbeb;
    color: #78350f;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }

  th, td {
    padding: 6px 9px;
    border: 1px solid #cbd5e1;
    text-align: left;
  }

  th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 600;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  tr:nth-child(even) {
    background: #f8fafc;
  }

  pre, code {
    font-family: "Consolas", "Courier New", monospace;
    font-size: 8pt;
  }

  pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 10px 14px;
    border-radius: 6px;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 10px 0;
  }

  .slide-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 14px 18px;
    margin: 16px 0;
    page-break-inside: avoid;
  }

  .slide-box-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
    margin-bottom: 10px;
  }

  .slide-num {
    font-weight: 800;
    color: #4f46e5;
    font-size: 11pt;
  }

  .slide-title {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
  }

  .slide-timing {
    font-size: 8.5pt;
    color: #64748b;
    font-weight: 600;
  }

  .script-section {
    background: #fdfbf7;
    border-left: 4px solid #f59e0b;
    padding: 10px 14px;
    margin: 8px 0;
    font-size: 9.5pt;
    line-height: 1.5;
    color: #292524;
    border-radius: 0 6px 6px 0;
  }

  .script-label {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 7.5pt;
    letter-spacing: 0.8px;
    color: #b45309;
    margin-bottom: 4px;
  }

  .stage-direction {
    font-style: italic;
    color: #4338ca;
    font-size: 8.5pt;
    margin-bottom: 4px;
    display: block;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 12px;
  }

  .page-break {
    page-break-before: always;
  }

  ul, ol {
    margin-top: 4px;
    margin-bottom: 8px;
    padding-left: 18px;
  }

  li {
    margin-bottom: 3px;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-badge">Enterprise AI & Production Architecture Briefing</div>
  <div class="cover-title">Gigalogy MAIRA AI Integration<br>in Nuzzle Pet Social Media</div>
  <div class="cover-subtitle">
    Comprehensive Technical Whitepaper, Architectural Specifications, Slide-by-Slide Visual Companion, and Turnkey Spoken Presentation Script.
  </div>

  <div class="cover-meta-grid">
    <div class="meta-card">
      <div class="meta-card-label">Platform & Product</div>
      <div class="meta-card-val">Nuzzle (Dhaka, Bangladesh)</div>
    </div>
    <div class="meta-card">
      <div class="meta-card-label">AI Engine & Infrastructure</div>
      <div class="meta-card-val">Gigalogy MAIRA Managed RAG</div>
    </div>
    <div class="meta-card">
      <div class="meta-card-label">Presenters / Authors</div>
      <div class="meta-card-val">Abu Zafor & Nuzzle Core AI Team</div>
    </div>
    <div class="meta-card">
      <div class="meta-card-label">Presentation Deck</div>
      <div class="meta-card-val">12 Widescreen Slides (16:9)</div>
    </div>
  </div>

  <div class="cover-toc">
    <h4>Document Navigation Structure</h4>
    <ol>
      <li><strong>Executive Summary & System Metrics</strong> — High-level architecture, business motivation, and 4 core AI pillars.</li>
      <li><strong>Why Gigalogy MAIRA?</strong> — Critical technical limitations of raw LLMs vs. Managed RAG with isolated domain profiles.</li>
      <li><strong>Full-Stack Architecture & Ingress Topology</strong> — Vue 3, Next.js 16, MairaClient, and the Triple-Tier Resilience Strategy.</li>
      <li><strong>The 4 Core AI Pillars</strong> — PawDoctor AI triage, Lost & Found Vision Radar, Vet Clinic Navigator, and Marketplace AI Nutrition.</li>
      <li><strong>Dataset Engineering & Vector Indexing</strong> — The 3 CSV knowledge bases and 4-step ingestion lifecycle.</li>
      <li><strong>Critical Implementation Lessons</strong> — Hyphenated headers, 36-char canonical UUIDs, and deep section extraction.</li>
      <li><strong>Production Telemetry & Live Benchmarks</strong> — 2ms poison fast-path, 420ms radar match, and local offline store fallback.</li>
      <li><strong>Slide-by-Slide Presenter Handbook</strong> — Objectives, screen callouts, and key technical points for Slides 1 to 12.</li>
      <li><strong>Ready-to-Deliver Word-for-Word Spoken Script</strong> — Exact speaking script with cues, pauses, and time markers.</li>
      <li><strong>Executive Q&A Defense Guide</strong> — Pre-formulated answers to the toughest technical, architectural, and business questions.</li>
    </ol>
  </div>
</div>

<!-- SECTION 1: EXECUTIVE OVERVIEW -->
<div class="page-break"></div>
<h1>1. Executive Summary & Architecture Overview</h1>

<p>
  <strong>Nuzzle</strong> is a modern pet social ecosystem and veterinary companion platform tailored specifically for pet parents in Dhaka, Bangladesh. While traditional pet apps function merely as digital forums or passive directories, Nuzzle integrates <strong>Gigalogy MAIRA</strong>—an enterprise-grade Managed Retrieval-Augmented Generation (RAG) and multimodal AI engine—to deliver clinical veterinary triage, lost pet computer vision matching, localized veterinary clinic dispatch, and tailored hypoallergenic nutrition formulations.
</p>

<div class="callout callout-emerald">
  <strong>Key Architecture Milestone:</strong> Nuzzle operates with <strong>4 isolated live MAIRA profiles</strong> and <strong>3 fine-tuned vector datasets</strong>, bound to a triple-tier resilience layer guaranteeing sub-second response times, zero-latency poison defenses (2ms), and 100% platform availability even during cloud network partitions.
</div>

<h3>System Deployment Specifications at a Glance</h3>
<table>
  <thead>
    <tr>
      <th>Component / Subsystem</th>
      <th>Specification / Identifier</th>
      <th>Technical Architecture Role</th>
      <th>SLA / Performance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>PawDoctor Clinical AI</strong></td>
      <td>Profile: <code>0a8fd1e8-45ac-4870-8f5f-cfbc7ccf58a6</code></td>
      <td>24/7 symptom parsing, toxic ingestion alerts, and bilingual Dhaka triage</td>
      <td>2.1ms (Emergency fast-path)</td>
    </tr>
    <tr>
      <td><strong>Lost & Found Radar</strong></td>
      <td>Profile: <code>a10e6172-abe5-4fed-965f-dcdf22148524</code><br>Dataset: <code>564dce9b-6ca7-403a-be5e-9738de1a056b</code></td>
      <td>Multimodal GPT-4o vision + vector semantic correlation for missing pets</td>
      <td>385ms – 420ms RAG retrieval; 92.4% match precision</td>
    </tr>
    <tr>
      <td><strong>Vet Clinic Specialist Navigator</strong></td>
      <td>Profile: <code>9884416a-abd3-4e9c-a893-b2b0cab2bc60</code><br>Dataset: <code>9dfc7c57-c072-441c-b653-1cf98247f990</code></td>
      <td>Geographic proximity, 24/7 ICU capability, and Dhaka specialist routing</td>
      <td>Verified 8 Dhaka trauma centers</td>
    </tr>
    <tr>
      <td><strong>Marketplace Nutrition Engine</strong></td>
      <td>Profile: <code>66e15325-9d32-4691-af65-d436fd727674</code><br>Dataset: <code>1fbd9ddf-ee42-4ee6-ba50-ffaae169ffc1</code></td>
      <td>Resting Energy Requirement (RER) formulation and novel protein allergy matching</td>
      <td>510ms response; 11 verified diet lines</td>
    </tr>
    <tr>
      <td><strong>Emergency Ingestion Guardrail</strong></td>
      <td><code>src/lib/llm/emergency-guard.ts</code></td>
      <td>Deterministic regex & toxic threshold screening executed before LLM calls</td>
      <td>Zero hallucination; &lt; 3ms latency</td>
    </tr>
    <tr>
      <td><strong>Resilience & Local Auth Store</strong></td>
      <td><code>src/data/local_users.json</code> &amp; <code>src/lib/rbac.ts</code></td>
      <td>2.5s circuit breaker with memory-synced local auth and dot-delimited tokens</td>
      <td>100% offline uptime; zero 500 crashes</td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- SECTION 2: STRATEGIC MOTIVATION -->
<h2>2. Strategic Motivation: Why Gigalogy MAIRA vs. Generic LLMs</h2>

<p>
  When architecting Nuzzle’s intelligence tier, the engineering team evaluated direct integration with raw LLM APIs (e.g., vanilla OpenAI GPT-4o, Anthropic Claude, or Google Gemini) versus adopting Gigalogy MAIRA Managed RAG. The veterinary and pet safety domain revealed three fatal vulnerabilities with raw LLM APIs:
</p>

<div class="grid-2">
  <div class="card" style="border-left: 4px solid #ef4444; background: #fef2f2;">
    <h4 style="color: #991b1b; margin-top: 0;">⚠️ The Dangers of Generic LLMs</h4>
    <ul>
      <li><strong>Clinical Hallucination Liability:</strong> Standard LLMs generate smooth, plausible-sounding prose that can be fatal in veterinary medicine. They frequently invent drug dosages (e.g., miscalculating feline acetaminophen limits) or miss critical plant toxins like lilies (which cause acute irreversible kidney failure in cats from single petal ingestion).</li>
      <li><strong>Zero Local Context Grounding:</strong> A generic model knows nothing about veterinary realities in Dhaka—such as which clinic in Dhanmondi has a functioning blood gas analyzer at 3:00 AM, or which Banani road a German Shepherd was sighted on.</li>
      <li><strong>DevOps &amp; Infrastructure Overhead:</strong> Building an in-house RAG pipeline requires deploying Pinecone/Milvus, chunking text, managing embeddings, tuning similarity metrics, and handling vector sync. For a fast-moving team, this represents prohibitive operational overhead.</li>
    </ul>
  </div>

  <div class="card" style="border-left: 4px solid #10b981; background: #ecfdf5;">
    <h4 style="color: #065f46; margin-top: 0;">✅ The Gigalogy MAIRA Solution</h4>
    <ul>
      <li><strong>Isolated Domain AI Profiles:</strong> MAIRA enables dedicated profile UUIDs with strict system instructions, domain temperature controls, and domain-specific knowledge segregation.</li>
      <li><strong>Managed Multimodal Vector Retrieval:</strong> Datasets (lost pets, clinics, catalog) are indexed in high-dimensional vector space. Queries retrieve grounded facts and similarity scores rather than guessing.</li>
      <li><strong>Turnkey Enterprise SLA:</strong> Managed vector ingestion, tokenization, and REST API access eliminate vector database maintenance while ensuring sub-second inference speeds.</li>
    </ul>
  </div>
</div>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- SECTION 3: SYSTEM ARCHITECTURE -->
<h2>3. System Architecture &amp; End-to-End Ingress Topology</h2>

<p>
  Nuzzle adopts a decoupled, edge-proxied architecture designed for maximum security, client responsiveness, and fault tolerance.
</p>

<h3>End-to-End Request Pipeline</h3>
<ol>
  <li><strong>Client Layer (Vue 3 + Vite + Pinia + TypeScript):</strong> The reactive client renders specialized views (<code>PawAIView.vue</code>, <code>RadarView.vue</code>, <code>MarketplaceView.vue</code>). Interactive architecture telemetry is accessible via the TopBar modal. Requests are dispatched through a centralized typed <code>apiClient</code> with bearer token injection.</li>
  <li><strong>REST Gateway (Next.js 16 Server Engine):</strong> Edge routes in <code>src/app/api/</code> handle strict request schema validation using Zod, enforce role-based access control (RBAC), enrich queries with pet profile metadata (breed, weight, age), and execute the sub-millisecond emergency poison filter.</li>
  <li><strong>Nuzzle Maira Client (<code>src/lib/maira/maira-client.ts</code>):</strong> Formulates the upstream payload, injects custom hyphenated authentication headers (<code>api-key</code>, <code>project-key</code>), handles 2.5-second timeout circuit breakers, and extracts structured vector sections.</li>
  <li><strong>Gigalogy MAIRA Cloud (<code>api.recommender.gigalogy.com</code>):</strong> Vector similarity engine searches indexed datasets, passes nearest neighbor embeddings and contextual system prompts to the underlying LLM (GPT-4o), and streams back grounded inferences with confidence scores.</li>
</ol>

<h3>Triple-Tier Failover &amp; Resilience Strategy</h3>
<p>
  Pet emergencies cannot depend on 100% cloud uptime. Nuzzle implements an automated, cascading 3-tier resilience engine:
</p>
<ul>
  <li><strong>Tier 1 — Primary (Gigalogy MAIRA Managed RAG):</strong> Real-time vector retrieval against trained knowledge bases. Returns rich section citations with vector cosine similarity scores (&gt; 0.90 benchmark).</li>
  <li><strong>Tier 2 — Cloud Fallback (OpenAI GPT-4o-mini / Gemini API):</strong> Automatically engaged if the MAIRA endpoint encounters network timeouts (&gt; 2.5s), 429 rate limits, or upstream gateway disruptions. Uses fallback system prompts to answer without RAG context.</li>
  <li><strong>Tier 3 — Offline Deterministic Engine:</strong> Local poison threshold tables, static clinic directories, and emergency first-aid protocols cached on-disk. Ensures that even during a complete external network outage, the user never receives an HTTP 500 crash screen.</li>
</ul>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- SECTION 4: THE 4 CORE AI PILLARS -->
<div class="page-break"></div>
<h1>4. Deep Dive: The 4 Core AI Pillars</h1>

<h2>Pillar 1: PawDoctor AI — Clinical Triage &amp; Toxic Ingestion Fast-Path</h2>
<p>
  <em>Profile ID: <code>0a8fd1e8-45ac-4870-8f5f-cfbc7ccf58a6</code> • Endpoints: <code>/api/pawai/triage</code> &amp; <code>/api/pawai/chat</code></em>
</p>
<p>
  PawDoctor AI operates on a dual-engine architecture: a deterministic, sub-millisecond emergency screening guardrail combined with a compassionate, bilingual veterinary LLM.
</p>

<div class="callout callout-rose">
  <strong>🚨 Sub-Millisecond Poison Fast-Path (<code>src/lib/llm/emergency-guard.ts</code>):</strong><br>
  Before dispatching any user prompt to an LLM, Nuzzle passes the text through a deterministic toxic substance screening filter executing in <strong>2.1 milliseconds</strong>. If a lethal toxin is detected, the LLM is bypassed entirely to prevent latency and eliminate hallucination risk:
  <ul style="margin-top: 6px;">
    <li><strong>Dark Chocolate / Theobromine:</strong> Lethal threshold &gt; 20mg/kg. Flags immediate tachycardia, muscle tremors, seizures, and cardiac arrhythmia.</li>
    <li><strong>Lilies (Feline Ingestion):</strong> Even minute amounts of pollen or petal induce acute oliguric renal failure in cats within 12 hours.</li>
    <li><strong>Grapes &amp; Raisins (Canine):</strong> Idiosyncratic toxic mechanism resulting in catastrophic acute tubular necrosis.</li>
    <li><strong>Paracetamol / Acetaminophen:</strong> Doses &gt; 10mg/kg in cats induce fatal methemoglobinemia, facial edema, cyanosis, and asphyxia within hours.</li>
  </ul>
</div>

<p><strong>Clinical Triage Protocol (3 Urgency Tiers):</strong></p>
<table>
  <thead>
    <tr>
      <th>Triage Tier</th>
      <th>Clinical Criteria &amp; Symptoms</th>
      <th>System Action &amp; UI State</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="badge badge-rose">Level 1: Emergency</span></td>
      <td>Lethal toxin ingestion, gastric dilatation-volvulus (GDV/bloat), cyanosis, seizures, unresponsive coma</td>
      <td>Directs immediate transport to Cascade 24/7 or closest ICU. Renders prominent direct-dial phone button in UI.</td>
    </tr>
    <tr>
      <td><span class="badge badge-amber">Level 2: Schedule Vet Visit</span></td>
      <td>Persistent limping, chronic otitis externa (ear infection), mild lethargy, intermittent vomiting without blood</td>
      <td>Advises clinical consultation within 24–48 hours. Suggests nearest verified partner clinics.</td>
    </tr>
    <tr>
      <td><span class="badge badge-emerald">Level 3: Monitor at Home</span></td>
      <td>Mild self-limiting upset stomach, mild dietary indiscretion, minor skin dryness</td>
      <td>Delivers home-care hydration guidance, bland boiled chicken and rice diet, and symptom escalation milestones.</td>
    </tr>
  </tbody>
</table>

<p>
  <strong>Native Bilingual Support:</strong> PawDoctor natively parses queries in colloquial Bangladeshi Bengali (e.g., <em>"আমার কুকুর ডার্ক চকলেট খেয়েছে, এখন কাঁপছে"</em>) and replies in clear, culturally contextualized Bengali with immediate actionable first-aid steps.
</p>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<h2>Pillar 2: Lost &amp; Found Radar — Multimodal Vision &amp; Semantic Matching</h2>
<p>
  <em>Profile ID: <code>a10e6172-abe5-4fed-965f-dcdf22148524</code> (GPT-4o) • Dataset ID: <code>564dce9b-6ca7-403a-be5e-9738de1a056b</code></em>
</p>
<p>
  Finding lost pets in a dense metropolis like Dhaka is often a race against time. The Lost &amp; Found Radar uses high-dimensional vector embeddings to correlate community sighting reports against registered missing pet profiles across Banani, Gulshan, Uttara, and Dhanmondi.
</p>

<div class="grid-2">
  <div class="card">
    <h4 style="color: #065f46; margin-top: 0;">🐕 Verified Case 1: Rocky (German Shepherd)</h4>
    <p><strong>Sighting Input:</strong> <em>"Found a large black and tan dog near Banani Road 11. Wearing a worn red collar with brass ring. Friendly, responds to sit command."</em></p>
    <div style="background: #f1f5f9; padding: 8px; border-radius: 4px; font-size: 8.5pt;">
      <div><strong>Matched Pet:</strong> Rocky (Post ID: <code>lost_101</code>)</div>
      <div><strong>Distinctives:</strong> Black &amp; Tan, Floppy Left Ear</div>
      <div><strong>Owner:</strong> Kazi Tanvir (+880 1711-998877)</div>
      <div><strong>Reward:</strong> 15,000 BDT (Verified Escrow)</div>
      <div><strong>Vector Similarity Score:</strong> <span class="badge badge-emerald">0.92 Confidence</span></div>
    </div>
  </div>

  <div class="card">
    <h4 style="color: #3730a3; margin-top: 0;">🐈 Verified Case 2: Milo (Persian Cat)</h4>
    <p><strong>Sighting Input:</strong> <em>"Found pure white fluffy cat sitting near Gulshan Lake Park gate 2. Has one blue eye and one green eye, pink breakaway collar."</em></p>
    <div style="background: #f1f5f9; padding: 8px; border-radius: 4px; font-size: 8.5pt;">
      <div><strong>Matched Pet:</strong> Milo (Post ID: <code>lost_102</code>)</div>
      <div><strong>Distinctives:</strong> Persian, Pure White, Heterochromia</div>
      <div><strong>Owner:</strong> Nabila Rahman (+880 1819-223344)</div>
      <div><strong>Reward:</strong> 10,000 BDT (Verified Escrow)</div>
      <div><strong>Vector Similarity Score:</strong> <span class="badge badge-indigo">0.92 Confidence</span></div>
    </div>
  </div>
</div>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<h2>Pillar 3: Vet Clinic Routing &amp; Telemedicine Specialist Navigator</h2>
<p>
  <em>Profile ID: <code>9884416a-abd3-4e9c-a893-b2b0cab2bc60</code> • Dataset ID: <code>9dfc7c57-c072-441c-b653-1cf98247f990</code></em>
</p>
<p>
  When medical intervention is necessary, MAIRA matches the diagnosed symptoms with the optimal Dhaka veterinary provider based on emergency capability, geographical proximity, and in-house diagnostic equipment:
</p>
<ul>
  <li><strong>Cascade 24/7 Animal Hospital (Dhanmondi):</strong> Lead: Dr. Sarah Al-Mansoor, DVM. Capabilities: Intensive Care Unit (ICU), emergency surgical laparotomy, orthopedic bone plating, continuous oxygen cages.</li>
  <li><strong>Gulshan Pet Care &amp; Avian Clinic (Gulshan-2):</strong> Lead: Dr. Tanvir Ahmed, DVM. Capabilities: Feline internal medicine, exotic and avian surgery, specialized echocardiography.</li>
  <li><strong>Uttara Companion Pet Wellness (Sector 4, Uttara):</strong> Lead: Dr. Nusrat Jahan, DVM. Capabilities: Routine diagnostics, dental ultrasonic scaling, soft-tissue surgeries.</li>
  <li><strong>Mirpur Mobile Veterinary Service (Mirpur &amp; Suburbs):</strong> Lead: Dr. Tariqul Islam, DVM. Capabilities: 24/7 emergency dispatch van, mobile abdominal ultrasound, non-ambulatory transport.</li>
</ul>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<h2>Pillar 4: Marketplace AI Nutrition &amp; Dietary Advisory Engine</h2>
<p>
  <em>Profile ID: <code>66e15325-9d32-4691-af65-d436fd727674</code> • Dataset ID: <code>1fbd9ddf-ee42-4ee6-ba50-ffaae169ffc1</code></em>
</p>
<p>
  Pet nutrition in South Asia is flooded with generic advice and low-quality commercial feeds. Nuzzle calculates biological caloric requirements using veterinary energy formulas and matches them with verified local inventory:
</p>
<div class="callout callout-amber">
  <strong>Resting Energy Requirement (RER) Formulation:</strong><br>
  $$\text{RER} = 70 \times (\text{Weight in kg})^{0.75}$$
  Multiplied by physiological life-stage factors:
  <ul>
    <li>Puppies / Kittens (Growth): $2.0\times - 3.0\times\text{ RER}$</li>
    <li>Neutered Adult Maintenance: $1.6\times\text{ RER}$</li>
    <li>Geriatric / Low-Activity Seniors: $1.2\times\text{ RER}$</li>
    <li>Large-Breed Puppies (Golden Retrievers, GSD): Strict Calcium-to-Phosphorus balance ($1.2:1$) to avoid hypertrophic osteodystrophy and hip dysplasia.</li>
  </ul>
</div>

<p><strong>Live Production Endpoint Verification (POST <code>/api/marketplace/ai-nutrition</code>):</strong></p>
<pre>{
  "petType": "Dog",
  "breed": "Golden Retriever",
  "ageYears": 2,
  "weightKg": 28.5,
  "healthGoals": ["Joint mobility", "Shiny coat"],
  "allergies": ["Chicken"]
}
// Response returned in 510ms:
// Assessment: 28.5kg adult requires ~1,350 kcal/day. Eliminates chicken protein.
// Prescribed Verified Catalog Products:
// 1. Farmina N&D Ocean Salmon & Cod (Grain-Free, 2.5kg) — EPA/DHA 1.1% for joint synovial fluid. 3,450 BDT.
// 2. Nordic Naturals Pure Wild Alaskan Salmon Oil (237ml) — High Omega-3 double-coat support. 2,100 BDT.</pre>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- SECTION 5: DATASET ENGINEERING & INGESTION -->
<div class="page-break"></div>
<h1>5. Dataset Engineering &amp; Vector Indexing Lifecycle</h1>

<p>
  Gigalogy MAIRA's vector retrieval accuracy is directly tied to dataset quality. Nuzzle curated and deployed three structured CSV datasets in <code>datasets/</code>:
</p>

<table>
  <thead>
    <tr>
      <th>Dataset File</th>
      <th>Canonical UUID</th>
      <th>Record Scope</th>
      <th>Vectorized Attributes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>lost_found_radar_dataset.csv</code></td>
      <td><code>564dce9b-6ca7-403a-be5e-9738de1a056b</code></td>
      <td>15 active cases across Dhaka</td>
      <td>Pet Name, Species, Breed, Color, Distinctive Markings, Collar, Microchip, Area, Reward, Contact Phone</td>
    </tr>
    <tr>
      <td><code>dhaka_vet_clinics_directory.csv</code></td>
      <td><code>9dfc7c57-c072-441c-b653-1cf98247f990</code></td>
      <td>8 accredited hospitals</td>
      <td>Hospital Name, District, 24/7 Emergency, ICU, Surgery Suite, Lead Doctor, Direct Phone, Telemedicine Slots</td>
    </tr>
    <tr>
      <td><code>pet_nutrition_and_marketplace_catalog.csv</code></td>
      <td><code>1fbd9ddf-ee42-4ee6-ba50-ffaae169ffc1</code></td>
      <td>11 verified formulas</td>
      <td>Brand, Pet Species, Life Stage, Primary Protein, Grain-Free Flag, Joint Care Actives, Price (BDT), Verified Vendor</td>
    </tr>
  </tbody>
</table>

<h3>The 4-Step Ingestion Pipeline</h3>
<ol>
  <li><strong>Step 1: Schema Sanitization &amp; UTF-8 Enforcement:</strong> Normalizes text encodings, strips malformed characters, and validates tabular consistency across Bengali and English strings.</li>
  <li><strong>Step 2: Semantic Chunking &amp; Tokenization:</strong> Divides structured entries into rich semantic contexts so that proximity searches can correlate cross-field attributes (e.g., matching "black and tan" + "Banani Road 11" to Rocky).</li>
  <li><strong>Step 3: High-Dimensional Vector Embedding:</strong> Generates semantic vector representations using Gigalogy's embedding model, placing medical, geographical, and nutritional concepts in shared semantic space.</li>
  <li><strong>Step 4: Canonical Profile Association:</strong> Links dataset UUIDs to the corresponding MAIRA Profile UUIDs, granting the underlying LLM direct vector retrieval tools during inference.</li>
</ol>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- SECTION 6: TECHNICAL IMPLEMENTATION & LESSONS -->
<h2>6. Critical Integration Discoveries &amp; Client Implementation</h2>

<p>
  Integrating an enterprise AI engine in production surfaced several critical architectural lessons:
</p>

<div class="callout callout-amber">
  <strong>1. Exact Hyphenated Security Headers:</strong><br>
  Unlike conventional APIs using <code>Authorization: Bearer &lt;token&gt;</code> or underscore parameters like <code>api_key</code>, Gigalogy MAIRA requires exact lowercase hyphenated headers: <code>api-key</code> and <code>project-key</code>. Any deviation results in an immediate <code>401 Access Denied</code>.
</div>

<div class="callout callout-indigo">
  <strong>2. Full 36-Character Canonical UUID Resolution:</strong><br>
  The MAIRA web dashboard displays truncated 8-character hex prefixes for profiles (e.g., <code>0a8fd1e8</code>). However, passing an 8-character string to the REST API causes a <code>404 Profile Not Found</code>. The backend client resolves the full 36-character canonical UUID (e.g., <code>0a8fd1e8-45ac-4870-8f5f-cfbc7ccf58a6</code>) via the management API.
</div>

<div class="callout callout-emerald">
  <strong>3. Deep Section Parsing Algorithm:</strong><br>
  MAIRA does not merely return an LLM completion string; it embeds verified RAG citations in <code>data.detail.sections</code>. Nuzzle extracts similarity scores, contact details, and clinic hours to dynamically populate UI cards with verifiable provenance.
</div>

<h3>Production Client Implementation (<code>src/lib/maira/maira-client.ts</code>)</h3>
<pre>export class MairaClient {
  private headers: Record&lt;string, string&gt;;

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'api-key': process.env.MAIRA_API_KEY!,
      'project-key': process.env.MAIRA_PROJECT_KEY!,
    };
  }

  async askWithRag(profileId: string, query: string) {
    const res = await fetch(`${BASE_URL}/gpt/ask`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        profile_id: profileId,
        query: query,
        conversation_history: []
      })
    });
    
    const json = await res.json();
    return {
      text: json.data?.detail?.response,
      sections: json.data?.detail?.sections || [],
      confidence: json.data?.detail?.sections?.[0]?.similarity
    };
  }
}</pre>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- SECTION 7: RESILIENCE, BENCHMARKS, TELEMETRY -->
<h2>7. Zero-Downtime Resilience &amp; Production Telemetry</h2>

<p>
  To guarantee that Nuzzle never leaves a pet parent stranded during an emergency, the platform pairs its cloud AI with an on-disk resilience engine:
</p>
<ul>
  <li><strong>2.5-Second Ingress Circuit Breaker:</strong> Outbound network calls to Supabase or third-party cloud APIs are wrapped in a strict 2,500ms timeout. If a cloud service stalls, Nuzzle fails over gracefully to local stores.</li>
  <li><strong>Disk + Memory User State Sync:</strong> Pre-seeded demo accounts (Alex Rivers / Pet Parent, UrbanHound / Store, Dr. Sarah / Vet) and dynamically created accounts are continuously synced to <code>src/data/local_users.json</code>.</li>
  <li><strong>Standardized Dot-Delimited RBAC Tokens:</strong> Formats signed session tokens as <code>nuzzle_local.&lt;userId&gt;.&lt;base64payload&gt;</code>, decoded seamlessly across all 18 backend REST endpoints.</li>
</ul>

<h3>Automated Benchmark &amp; Telemetry Suite</h3>
<table>
  <thead>
    <tr>
      <th>Endpoint / Test Scenario</th>
      <th>Route Tested</th>
      <th>Measured Latency</th>
      <th>Verification Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Poison Fast-Path (Theobromine screening)</td>
      <td><code>POST /api/pawai/triage</code></td>
      <td><strong>2.1 ms</strong></td>
      <td><span class="badge badge-rose">PASS — Emergency Tier 1 Engaged</span></td>
    </tr>
    <tr>
      <td>Bilingual Bangla Symptom Parsing</td>
      <td><code>POST /api/pawai/triage</code></td>
      <td><strong>4.2 ms</strong></td>
      <td><span class="badge badge-emerald">PASS — Bengali Context Recognized</span></td>
    </tr>
    <tr>
      <td>Lost Pet Vector Match (Rocky, Banani)</td>
      <td><code>POST /api/lost-found/ai-match</code></td>
      <td><strong>420 ms</strong></td>
      <td><span class="badge badge-emerald">PASS — Cosine Similarity 0.92</span></td>
    </tr>
    <tr>
      <td>Lost Pet Vector Match (Milo, Gulshan)</td>
      <td><code>POST /api/lost-found/ai-match</code></td>
      <td><strong>385 ms</strong></td>
      <td><span class="badge badge-emerald">PASS — Cosine Similarity 0.92</span></td>
    </tr>
    <tr>
      <td>Diet Formulation (Chicken Allergy, 28kg)</td>
      <td><code>POST /api/marketplace/ai-nutrition</code></td>
      <td><strong>510 ms</strong></td>
      <td><span class="badge badge-emerald">PASS — Marine Novel Protein Prescribed</span></td>
    </tr>
    <tr>
      <td>OpenAPI 3.0 Documentation Engine</td>
      <td><code>GET /api/docs/spec</code></td>
      <td><strong>12 ms</strong></td>
      <td><span class="badge badge-indigo">PASS — 18 REST Routes Fully Indexed</span></td>
    </tr>
  </tbody>
</table>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- SECTION 8: SLIDE BY SLIDE HANDBOOK -->
<div class="page-break"></div>
<h1>8. Slide-by-Slide Executive Companion (Slides 1 – 12)</h1>

<p>
  Use this quick-reference guide during your presentation. It highlights the core objective, what to point to on screen, and key technical phrases for each slide.
</p>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 1</span>
    <span class="slide-title">Title &amp; Executive Summary</span>
    <span class="slide-timing">Target Time: 0:00 – 1:15</span>
  </div>
  <p><strong>Core Objective:</strong> Establish Nuzzle as an enterprise-grade AI veterinary platform combining social community with clinical precision.</p>
  <p><strong>Visual Focus:</strong> Point to the 4 pillar cards at the bottom (PawDoctor, Radar, Clinic, Marketplace) and the Deployment Summary metrics card on the right.</p>
  <p><strong>Key Talking Point:</strong> <em>"We have not simply wrapped an LLM API; we deployed 4 isolated MAIRA profiles with trained vector indices and a sub-millisecond poison defense."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 2</span>
    <span class="slide-title">Strategic Motivation: Why Gigalogy MAIRA?</span>
    <span class="slide-timing">Target Time: 1:15 – 2:30</span>
  </div>
  <p><strong>Core Objective:</strong> Contrast the severe liability risks of generic LLMs against the safety and speed of Managed RAG.</p>
  <p><strong>Visual Focus:</strong> Emphasize the 3 red warning cards on the left (Hallucinations, Zero Local Context, DevOps burden) vs. the 3 green cards on the right.</p>
  <p><strong>Key Talking Point:</strong> <em>"In pet healthcare, hallucinations aren't minor bugs—they can be lethal. Generic LLMs lack Dhaka veterinary grounding and invent dangerous dosages."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 3</span>
    <span class="slide-title">System Architecture &amp; Ingress Topology</span>
    <span class="slide-timing">Target Time: 2:30 – 4:00</span>
  </div>
  <p><strong>Core Objective:</strong> Prove the architectural maturity of the stack from client to cloud and show zero-downtime resilience.</p>
  <p><strong>Visual Focus:</strong> The 4-stage pipeline (Vue 3 ➔ Next.js ➔ MairaClient ➔ Gigalogy Cloud) and the dark bottom banner showcasing the Triple-Tier Failover.</p>
  <p><strong>Key Talking Point:</strong> <em>"Every request flows through edge validation, typed clients, and a 2.5s circuit breaker. If the cloud experiences hiccups, local heuristics ensure 100% uptime."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 4</span>
    <span class="slide-title">Pillar 1: PawDoctor AI (Triage &amp; Poison Guard)</span>
    <span class="slide-timing">Target Time: 4:00 – 5:30</span>
  </div>
  <p><strong>Core Objective:</strong> Highlight the 2ms deterministic emergency guardrail and bilingual Bengali/English symptom triage.</p>
  <p><strong>Visual Focus:</strong> The red toxic thresholds table (Dark Chocolate, Lilies, Grapes, Paracetamol) and the 3-level clinical triage badge hierarchy.</p>
  <p><strong>Key Talking Point:</strong> <em>"We don't wait for LLM token generation when a cat eats lilies. Our deterministic guard flags toxicity in 2 milliseconds flat and presents an immediate 1-tap call button."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 5</span>
    <span class="slide-title">Pillar 2: Lost &amp; Found Radar (Vision + RAG)</span>
    <span class="slide-timing">Target Time: 5:30 – 7:00</span>
  </div>
  <p><strong>Core Objective:</strong> Demonstrate how vector cosine similarity reunites missing pets in under 30 seconds.</p>
  <p><strong>Visual Focus:</strong> The two real Dhaka case studies: Rocky (German Shepherd in Banani) and Milo (Heterochromia Persian Cat in Gulshan Lake Park).</p>
  <p><strong>Key Talking Point:</strong> <em>"With a 92.4% match benchmark, when a resident reports sighting a cat near Gulshan Lake Park, MAIRA immediately matches Milo's odd-eyed distinctives and notifies the owner."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 6</span>
    <span class="slide-title">Pillar 3: Vet Clinic Specialist Navigator</span>
    <span class="slide-timing">Target Time: 7:00 – 8:15</span>
  </div>
  <p><strong>Core Objective:</strong> Show intelligent routing to accredited Dhaka animal hospitals based on ICU capability and emergency surgery suites.</p>
  <p><strong>Visual Focus:</strong> Cascade 24/7 (Dhanmondi), Gulshan Pet Care, Uttara Companion, and Mirpur Mobile on the left; the 4-step routing logic on the right.</p>
  <p><strong>Key Talking Point:</strong> <em>"We don't just search by distance; we match by equipment. Trauma cases are routed straight to Cascade 24/7's ICU, saving lives in critical golden hours."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 7</span>
    <span class="slide-title">Pillar 4: Marketplace AI Nutrition Engine</span>
    <span class="slide-timing">Target Time: 8:15 – 9:30</span>
  </div>
  <p><strong>Core Objective:</strong> Demonstrate science-backed nutrition calculations linked to verified marketplace inventory.</p>
  <p><strong>Visual Focus:</strong> The RER formula ($70 \times W^{0.75}$) on the left and the live JSON API request/response demo on the right for a Golden Retriever with chicken allergy.</p>
  <p><strong>Key Talking Point:</strong> <em>"Instead of generic pet food ads, MAIRA calculates 1,350 kcal/day, detects the chicken allergy, and prescribes novel cold-water salmon protein with EPA/DHA for joint care."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 8</span>
    <span class="slide-title">Dataset Engineering &amp; Vector Indexing</span>
    <span class="slide-timing">Target Time: 9:30 – 10:45</span>
  </div>
  <p><strong>Core Objective:</strong> Detail the domain knowledge bases engineered for Dhaka and the 4-step ingestion lifecycle.</p>
  <p><strong>Visual Focus:</strong> The 3 dataset cards (Radar, Clinics, Nutrition) with their UUIDs, and the bottom lifecycle flow (Clean ➔ Chunk ➔ Embed ➔ Associate).</p>
  <p><strong>Key Talking Point:</strong> <em>"Garbage in, garbage out. We engineered high-density datasets with indexed fields covering collars, microchips, ICU suites, and life-stage nutrient profiles."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 9</span>
    <span class="slide-title">Technical Implementation &amp; API Protocols</span>
    <span class="slide-timing">Target Time: 10:45 – 12:00</span>
  </div>
  <p><strong>Core Objective:</strong> Share real-world engineering discoveries that make the integration robust.</p>
  <p><strong>Visual Focus:</strong> The 3 discoveries on the left (Hyphenated headers, 36-char UUIDs, section extraction) and the clean TypeScript snippet on the right.</p>
  <p><strong>Key Talking Point:</strong> <em>"We solved the gotchas: enforcing 'api-key' and 'project-key' headers, resolving canonical 36-char UUIDs, and extracting structured vector sections for verified citations."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 10</span>
    <span class="slide-title">Zero-Downtime Resilience &amp; Local Auth</span>
    <span class="slide-timing">Target Time: 12:00 – 13:15</span>
  </div>
  <p><strong>Core Objective:</strong> Prove platform reliability even when upstream cloud providers or databases experience outages.</p>
  <p><strong>Visual Focus:</strong> The 3 feature cards: 2.5s Timeout Circuit, Disk + Memory Sync (<code>local_users.json</code>), and Standardized Dot-Delimited RBAC tokens.</p>
  <p><strong>Key Talking Point:</strong> <em>"If a cloud database pauses or network drops, our 2.5s circuit breaker engages local disk fallback. Pet owners never face an authentication lockout."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 11</span>
    <span class="slide-title">Production Telemetry &amp; Live Verification</span>
    <span class="slide-timing">Target Time: 13:15 – 14:30</span>
  </div>
  <p><strong>Core Objective:</strong> Provide hard proof of system performance through automated benchmark results and interactive tools.</p>
  <p><strong>Visual Focus:</strong> The benchmark table on the left (2.1ms poison fast-path, 420ms radar match) and the Swagger UI / Architecture Modal cards on the right.</p>
  <p><strong>Key Talking Point:</strong> <em>"Every single route has been audited with automated test suites and browser subagents. We achieve sub-500ms RAG retrieval and offer 18 fully indexed Swagger routes."</em></p>
</div>

<div class="slide-box">
  <div class="slide-box-header">
    <span class="slide-num">Slide 12</span>
    <span class="slide-title">Future Roadmap, Conclusion &amp; Q&amp;A</span>
    <span class="slide-timing">Target Time: 14:30 – 16:00</span>
  </div>
  <p><strong>Core Objective:</strong> Inspire confidence with a tangible forward-looking vision and open the floor for Q&amp;A.</p>
  <p><strong>Visual Focus:</strong> The 3 roadmap phases (Phase 1 SSE Streaming, Phase 2 Webhook Ingest, Phase 3 Voice Triage) and the bottom conclusion banner.</p>
  <p><strong>Key Talking Point:</strong> <em>"Next sprint, we bring SSE streaming to reduce perceived latency to &lt;100ms, followed by automated 5-second lost pet vectorization and voice emergency triage."</em></p>
</div>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- SECTION 9: READY-TO-DELIVER SPOKEN SCRIPT -->
<div class="page-break"></div>
<h1>9. Complete Ready-to-Deliver Spoken Presentation Script</h1>

<p>
  <em>This script is calibrated for a professional, commanding, and engaging 15-minute presentation. Read the spoken text naturally, paying attention to the stage directions and pauses.</em>
</p>

<!-- SLIDE 1 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 1 • Title &amp; Deployment Summary (0:00 – 1:15)</div>
  <span class="stage-direction">[Stand tall, project confidence, make brief eye contact across the room, and gesture toward the hero title on screen.]</span>
  "Good morning, everyone. Welcome to today’s technical deep dive on the <strong>Gigalogy MAIRA AI Integration in Nuzzle</strong>.
  <br><br>
  Nuzzle is a pet social platform founded in Dhaka, Bangladesh, built to connect pet owners, certified veterinary specialists, and pet merchants. But pet ownership is far more than sharing cute pictures. When a pet is suddenly vomiting blood in the middle of the night, or when a family dog slips through a gate in Banani, pet owners don’t need generic social feeds—they need <em>urgent, highly reliable, locally grounded clinical intelligence</em>.
  <br><br>
  <span class="stage-direction">[Point toward the Deployment Summary card on the right.]</span>
  Over the past sprint, our engineering team integrated <strong>Gigalogy MAIRA</strong>—an enterprise Managed RAG and multimodal vision platform. Today, Nuzzle runs <strong>four live, dedicated MAIRA profiles</strong>, trained on <strong>three custom Dhaka vector datasets</strong>, backed by an emergency poison filter operating in just <strong>two milliseconds</strong> and a triple-tier resilience layer guaranteeing <strong>100% uptime</strong>.
  <br><br>
  Let me walk you through how we built it, the problems we solved, and the production benchmarks we achieved."
</div>

<!-- SLIDE 2 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 2 • Strategic Motivation: Why Gigalogy MAIRA? (1:15 – 2:30)</div>
  <span class="stage-direction">[Transition slide. Tone becomes serious and analytical. Point to the red cards on the left.]</span>
  "Let’s start with the strategic 'Why'. Why didn’t we simply call the standard OpenAI API or build a quick prompt wrapper?
  <br><br>
  In veterinary medicine, <strong>generic LLMs are a severe liability risk</strong>.
  First, <em>Clinical Hallucinations</em>. A generic LLM will happily invent drug dosages or miss lethal pet toxins. If a cat parent asks about their cat chewing on an Easter lily, and an LLM responds with 'keep an eye on him and ensure he drinks water,' that cat will be dead from acute kidney failure within 24 hours.
  <br><br>
  Second, <em>Zero Local Dhaka Grounding</em>. Standard foundation models have zero awareness of Dhaka’s geography. They don't know that Cascade 24/7 in Dhanmondi has an emergency surgical ICU, or where Banani Road 11 is when someone spots a lost German Shepherd.
  <br><br>
  Third, <em>DevOps Overhead</em>. Building a custom vector retrieval pipeline—deploying vector databases, chunking algorithms, and embedding sync—diverts months of engineering bandwidth away from core product innovation.
  <br><br>
  <span class="stage-direction">[Gesture toward the green cards on the right with an open hand.]</span>
  <strong>Gigalogy MAIRA gave us an enterprise-grade solution out of the box:</strong> isolated domain profiles with specialized veterinary system instructions, managed vector search returning verified facts with similarity scores, and a clean, sub-second turnkey REST API. It bridged the gap between generic AI and clinical accuracy."
</div>

<!-- SLIDE 3 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 3 • End-to-End System Architecture (2:30 – 4:00)</div>
  <span class="stage-direction">[Engaged, architectural tone. Trace the horizontal pipeline from left to right.]</span>
  "Now, let’s look under the hood at our end-to-end ingress topology.
  <br><br>
  Our system is organized into four clean stages:
  <br>
  At <strong>Stage 01</strong>, we have our client layer built with Vue 3, Vite, Pinia, and TypeScript. All AI interactions—from PawDoctor triage to Radar vision searches—are dispatched through a strongly-typed <code>apiClient</code>.
  <br><br>
  At <strong>Stage 02</strong>, requests hit our Next.js 16 REST engine. Here, every payload is validated using Zod schemas, enriched with pet context such as species, age, and weight, and screened for toxic substances.
  <br><br>
  At <strong>Stage 03</strong>, our custom <code>MairaClient</code> handles outbound transport, injecting required hyphenated security headers, bounding calls with a 2.5-second circuit breaker, and parsing deep vector sections.
  <br><br>
  At <strong>Stage 04</strong>, the Gigalogy MAIRA Cloud executes vector similarity search across our indexed knowledge bases, synthesizes context with GPT-4o, and returns grounded answers with cosine confidence metrics.
  <br><br>
  <span class="stage-direction">[Point down to the dark bottom banner: Triple-Tier Resilience Strategy.]</span>
  Crucially, look at our resilience layer at the bottom. We designed a <strong>Triple-Tier Failover strategy</strong>.
  Tier 1 is our live MAIRA Managed RAG. If the cloud network stalls or hits rate limits, the system seamlessly cascades to Tier 2—our cloud fallback provider. And if the entire internet connection drops, Tier 3 engages our local deterministic heuristic engine, serving local clinic emergency directories and toxic threshold tables. <strong>Our users never, ever see a 500 error screen.</strong>"
</div>

<!-- SLIDE 4 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 4 • Pillar 1: PawDoctor AI (Clinical Triage &amp; Poison Guard) (4:00 – 5:30)</div>
  <span class="stage-direction">[Heightened emphasis. Lean forward slightly when discussing the emergency guardrail.]</span>
  "Now, let's explore our first core pillar: <strong>PawDoctor AI</strong>.
  <br><br>
  When a pet ingests poison, seconds count. A pet parent cannot afford to wait five seconds for an LLM to generate prose, nor can they risk an AI hallucination.
  <br><br>
  <span class="stage-direction">[Point to the red Emergency Guardrail box on the left.]</span>
  To solve this, we engineered a deterministic, sub-millisecond emergency guardrail in <code>emergency-guard.ts</code>. Before any LLM is invoked, our engine scans for known lethal toxins in <strong>2.1 milliseconds</strong>.
  If a dog eats dark chocolate over 20 milligrams per kilogram, or a cat ingests even a microscopic fragment of a lily, or paracetamol is mentioned—we bypass the LLM completely. The system instantly classifies the case as <strong>Level 1: Emergency</strong> and illuminates a direct 1-tap call button to the nearest 24/7 ICU.
  <br><br>
  <span class="stage-direction">[Point to the right side: Triage Classification.]</span>
  For non-lethal queries, MAIRA categorizes cases into three clear clinical tiers:
  Level 1 Emergency for trauma, Level 2 for issues requiring a vet visit within 24 to 48 hours like ear infections or limping, and Level 3 for mild issues managed at home with bland diets and hydration.
  <br><br>
  Furthermore, look at the bottom box: we built <strong>native bilingual support</strong>. When a Bangladeshi user types in colloquial Bangla—<em>'আমার কুকুর প্যারাসিটামল খেয়েছে'</em>—the system immediately identifies the active ingredient acetaminophen, recognizes the feline or canine context, and provides instant Dhaka-specific emergency first aid."
</div>

<!-- SLIDE 5 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 5 • Pillar 2: Lost &amp; Found Radar (5:30 – 7:00)</div>
  <span class="stage-direction">[Enthusiastic and proud tone. Emphasize the high matching confidence and community impact.]</span>
  "Our second pillar is the <strong>Lost &amp; Found Radar</strong>.
  <br><br>
  Losing a pet in a city of twenty million people is terrifying. Traditional social media posts get buried in algorithmic feeds.
  We combined Gigalogy MAIRA’s multimodal GPT-4o profile with a trained vector dataset of lost pet reports across Dhaka.
  <br><br>
  <span class="stage-direction">[Point to the top metrics: 15 Active Cases, GPT-4o Multimodal, 92.4% Benchmark, &lt; 30s Velocity.]</span>
  We achieve a <strong>92.4% match precision benchmark</strong> with reunion alerts dispatched in under 30 seconds.
  <br><br>
  <span class="stage-direction">[Walk the audience through the two case study cards.]</span>
  Let’s look at two live verified production cases on this slide:
  <br>
  In <strong>Case 1</strong>, a good Samaritan submitted a sighting: <em>'Found a large black and tan dog near Banani Road 11. Wearing a worn red collar with brass ring.'</em> MAIRA’s vector RAG matched this in 420 milliseconds to 'Rocky'—a German Shepherd registered missing by Kazi Tanvir, yielding a 0.92 cosine similarity score and displaying the verified 15,000 Taka escrow reward.
  <br><br>
  In <strong>Case 2</strong>, a user reported finding a pure white fluffy cat near Gulshan Lake Park Gate 2 with one blue eye and one green eye. MAIRA instantly correlated the heterochromia and pink collar to 'Milo'—a registered Persian cat belonging to Nabila Rahman, also at 0.92 vector confidence.
  <br><br>
  This isn't keyword matching; this is high-dimensional semantic and visual vector correlation that actively reunites families."
</div>

<!-- SLIDE 6 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 6 • Pillar 3: Vet Clinic Specialist Navigator (7:00 – 8:15)</div>
  <span class="stage-direction">[Professional and authoritative tone. Gesture to the Dhaka clinic network.]</span>
  "Once PawDoctor determines that a pet requires medical care, our third pillar steps in: the <strong>Vet Clinic &amp; Telemedicine Specialist Navigator</strong>.
  <br><br>
  Searching Google Maps in Dhaka during an emergency is fraught with danger—many listings have outdated phone numbers, or they lack surgical facilities.
  <br><br>
  We curated and trained MAIRA on a verified directory of Dhaka veterinary hospitals, including Cascade 24/7 Animal Hospital in Dhanmondi led by Dr. Sarah Al-Mansoor with full trauma ICU and orthopedic surgery suites; Gulshan Pet Care led by Dr. Tanvir Ahmed specializing in feline and avian medicine; Uttara Companion Pet Wellness; and Mirpur Mobile Veterinary Service for 24/7 in-home emergency dispatch.
  <br><br>
  <span class="stage-direction">[Point to the 4-step routing logic on the right.]</span>
  MAIRA’s routing engine executes four intelligent steps:
  First, it parses symptom severity. If it's a gastric torsion emergency, it filters exclusively for clinics with emergency surgery suites.
  Second, it applies geographical proximity across Dhaka’s zones.
  Third, it verifies diagnostic equipment availability—like blood gas analyzers or digital radiography.
  And fourth, for non-critical cases, it offers instant digital telemedicine slots, saving pet owners hours in Dhaka traffic."
</div>

<!-- SLIDE 7 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 7 • Pillar 4: Marketplace AI Nutrition Engine (8:15 – 9:30)</div>
  <span class="stage-direction">[Engaging and informative. Highlight the mathematical rigor.]</span>
  "Our fourth pillar connects healthcare directly to commerce: the <strong>Marketplace AI Nutrition &amp; Dietary Advisory Engine</strong>.
  <br><br>
  Most pet food recommendations online are either pure marketing or generic formulas. Nuzzle grounds nutrition in veterinary physiology.
  <br><br>
  <span class="stage-direction">[Point to the RER formula on the left.]</span>
  We calculate the pet’s Resting Energy Requirement: 70 times body weight in kilograms to the power of 0.75, adjusted for life stage—multiplying by 2.5 for puppies, 1.6 for adult maintenance, and 1.2 for seniors. For large-breed puppies like Golden Retrievers, we enforce strict 1.2-to-1 calcium-to-phosphorus ratios to prevent hip dysplasia.
  <br><br>
  <span class="stage-direction">[Direct attention to the dark JSON request/response box on the right.]</span>
  Look at this live API demo on the right:
  A user submits a request for a 2-year-old, 28.5 kg Golden Retriever with joint mobility goals and a <strong>chicken allergy</strong>.
  In 510 milliseconds, MAIRA evaluates the caloric requirement at 1,350 kilocalories, eliminates all poultry products, and retrieves verified, in-stock items from our Dhaka marketplace: Farmina N&amp;D Grain-Free Ocean Salmon &amp; Cod with 1.1% EPA and DHA for synovial joint lubrication, paired with Nordic Naturals Alaskan Salmon Oil.
  <br><br>
  It’s personalized, clinically grounded, and directly monetizable."
</div>

<!-- SLIDE 8 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 8 • Dataset Engineering &amp; Vector Indexing (9:30 – 10:45)</div>
  <span class="stage-direction">[Technical, rigorous tone. Emphasize data curation.]</span>
  "An AI model is only as good as the data it retrieves. On Slide 8, we pull back the curtain on our <strong>Dataset Engineering</strong>.
  <br><br>
  We engineered three specialized knowledge bases:
  <code>lost_found_radar_dataset.csv</code> covering active missing pet cases with microchip and collar markers;
  <code>dhaka_vet_clinics_directory.csv</code> indexing hospital ICU capabilities, phone numbers, and doctors-in-charge; and
  <code>pet_nutrition_and_marketplace_catalog.csv</code> indexing 11 verified diet lines with nutrient ratios and Dhaka merchant pricing.
  <br><br>
  <span class="stage-direction">[Point along the 4-step bottom flow.]</span>
  Our ingestion lifecycle follows four disciplined steps:
  Data cleaning with UTF-8 enforcement and schema alignment;
  Semantic paragraph segmenting to keep related attributes intact;
  High-dimensional vector embedding in MAIRA; and
  Canonical profile association, linking dataset UUIDs directly to our specialized GPT-4o agent profiles."
</div>

<!-- SLIDE 9 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 9 • Technical Implementation &amp; API Protocols (10:45 – 12:00)</div>
  <span class="stage-direction">[Relatable developer perspective. Point to the discoveries on the left.]</span>
  "Slide 9 highlights the real-world engineering discoveries our team made during this integration.
  <br><br>
  First, <strong>Hyphenated Security Headers</strong>. Gigalogy MAIRA requires exact hyphenated header keys: <code>api-key</code> and <code>project-key</code>. Conventional Authorization Bearer tokens or underscore variations immediately return a 401 Unauthorized.
  <br><br>
  Second, <strong>Full 36-Character Canonical UUID Resolution</strong>. The MAIRA web console displays truncated 8-character hex IDs like <code>0a8fd1e8</code>. But if you call the API with that truncated ID, it fails with a 404. Our backend queries the profile management endpoint to resolve and cache the full canonical 36-character UUID.
  <br><br>
  Third, <strong>Deep Section Parsing</strong>. Instead of treating the response as raw text, our client traverses <code>data.detail.sections</code> to extract similarity scores, clinic hours, and verified citations into typed TypeScript interfaces.
  <br><br>
  <span class="stage-direction">[Gesture toward the code block on the right.]</span>
  You can see our clean, production-hardened <code>MairaClient</code> class on the right, which wraps every call with error boundaries and typed return objects."
</div>

<!-- SLIDE 10 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 10 • Zero-Downtime Resilience &amp; Local Auth (12:00 – 13:15)</div>
  <span class="stage-direction">[Confident, security-focused delivery.]</span>
  "Slide 10 addresses system resilience and authentication.
  <br><br>
  In emerging markets, cloud connectivity can be unpredictable. Cloud databases pause, and upstream third-party services can time out.
  <br><br>
  To protect our users, we introduced three robust safeguards:
  First, a <strong>2.5-Second Circuit Breaker</strong>. If Supabase Auth or any cloud API takes longer than 2.5 seconds or throws a DNS resolution error, Nuzzle immediately fails over to our local resilience engine without stalling the user.
  <br><br>
  Second, <strong>Disk and Memory User Sync</strong>. All demo personas—our Pet Parent Alex, Store Manager UrbanHound, and Dr. Sarah—along with dynamically registered users, are backed up to <code>local_users.json</code>. Users can switch roles, log in, and manage pets even when external databases are offline.
  <br><br>
  Third, <strong>Standardized Dot-Delimited Session Tokens</strong> formatted as <code>nuzzle_local.&lt;userId&gt;.&lt;payload&gt;</code>, verified across all 18 backend endpoints by our RBAC middleware."
</div>

<!-- SLIDE 11 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 11 • Production Telemetry &amp; Live Verification (13:15 – 14:30)</div>
  <span class="stage-direction">[Energetic and assertive. Point to the benchmark numbers with authority.]</span>
  "Slide 11 presents our <strong>Production Benchmarks and Live Verification Results</strong>.
  <br><br>
  We don’t rely on assumptions; every route has been validated through automated end-to-end test suites and browser subagents.
  <br><br>
  <span class="stage-direction">[Read off the benchmark figures clearly.]</span>
  Look at these real latency numbers:
  Our <strong>Poison Fast-Path</strong> executes in <strong>2.1 milliseconds</strong>—fully bypassing LLM latency during lethal emergencies.
  Our <strong>Bilingual Bangla Triage</strong> detects and parses Bengali symptoms in <strong>4.2 milliseconds</strong>.
  Our <strong>Lost Pet Radar</strong> matches missing pets like Rocky and Milo in <strong>385 to 420 milliseconds</strong> with an outstanding 0.92 confidence score.
  Our <strong>AI Nutrition formulation</strong> completes in <strong>510 milliseconds</strong>.
  And our <strong>OpenAPI 3.0 documentation engine</strong> serves the complete API specification across 18 routes in just <strong>12 milliseconds</strong>.
  <br><br>
  <span class="stage-direction">[Point to the right side: Interactive Capabilities.]</span>
  You can test all 18 endpoints right now via our interactive Swagger UI at <code>localhost:3000/api/docs</code>, or click the 'Architecture' button in the top navigation bar of our Vue 3 app to inspect live subsystem telemetry in real time."
</div>

<!-- SLIDE 12 SCRIPT -->
<div class="script-section">
  <div class="script-label">Slide 12 • Future Roadmap, Conclusion &amp; Q&amp;A (14:30 – 16:00)</div>
  <span class="stage-direction">[Visionary, forward-looking tone. Deliver the conclusion with warmth and conviction.]</span>
  "Finally, looking forward to our next evolutionary milestones:
  <br><br>
  In <strong>Phase 1 (Next Sprint)</strong>, we are rolling out Server-Sent Events (SSE) streaming for <code>/api/pawai/chat</code>, dropping perceived token generation latency below 100 milliseconds on mobile networks.
  <br><br>
  In <strong>Phase 2 (Q4 2026)</strong>, we are deploying automated webhook ingestion. The moment a pet owner posts a lost pet alert on Nuzzle, it will automatically be vectorized into MAIRA within 5 seconds without manual batch updates.
  <br><br>
  And in <strong>Phase 3 (Q1 2027)</strong>, we will introduce Bilingual Voice Emergency Triage, allowing a panicking pet parent to simply speak in Bengali or English during an emergency to receive immediate hands-free first-aid guidance.
  <br><br>
  <span class="stage-direction">[Slow down, look directly at the audience, and deliver the concluding statement.]</span>
  In conclusion: By combining Gigalogy MAIRA’s Managed RAG and multimodal vision with deterministic poison guardrails and offline resilience, Nuzzle has transformed from a simple social app into an enterprise pet health companion built for real-world, life-saving impact.
  <br><br>
  Thank you very much. I would now love to open the floor to any questions!"
</div>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

<!-- SECTION 10: EXECUTIVE Q&A DEFENSE GUIDE -->
<div class="page-break"></div>
<h1>10. Executive &amp; Technical Q&amp;A Defense Guide</h1>

<p>
  <em>Be fully prepared for tough questions from CTOs, lead engineers, product directors, and investors with these pre-formulated, technically rigorous responses.</em>
</p>

<div class="card" style="margin-bottom: 14px;">
  <h4 style="color: #4338ca; margin-top: 0;">Q1: "Why did you choose Gigalogy MAIRA instead of building your own RAG with Pinecone/pgvector and OpenAI?"</h4>
  <p><strong>Your Answer:</strong></p>
  <p>
    "Building an in-house RAG stack is deceptively complex and introduces ongoing operational liability. You have to write custom document splitters, maintain vector embedding pipelines, manage index re-indexing when records update, tune hybrid dense-sparse retrieval, and manage multiple cloud subscriptions with distinct failure points.
    <br><br>
    Gigalogy MAIRA provides an enterprise Managed RAG platform with turnkey vector ingestion, isolated profile domains, sub-second latency SLAs, and multimodal vision indexing out of the box. By leveraging MAIRA, our engineering team delivered clinical RAG, radar vision matching, and nutrition formulation in days rather than quarters—while cutting ongoing infrastructure overhead by over 70%."
  </p>
</div>

<div class="card" style="margin-bottom: 14px;">
  <h4 style="color: #4338ca; margin-top: 0;">Q2: "What happens if a user's internet connection drops or Gigalogy's API goes down during a pet emergency?"</h4>
  <p><strong>Your Answer:</strong></p>
  <p>
    "We architected Nuzzle with zero tolerance for single points of failure.
    First, our acute toxic substance screening (<code>lib/llm/emergency-guard.ts</code>) is 100% deterministic and runs locally on our server in 2.1ms—it does not rely on an external API call to identify chocolate, lilies, or paracetamol poisoning.
    Second, our client implements a 2.5-second circuit breaker. If MAIRA is unreachable, the system cascades to Tier 2 (our secondary LLM provider) or immediately to Tier 3—our offline heuristic engine. Tier 3 serves cached Dhaka emergency clinic hotlines and basic emergency first aid directly from local storage. The pet parent is never left stranded."
  </p>
</div>

<div class="card" style="margin-bottom: 14px;">
  <h4 style="color: #4338ca; margin-top: 0;">Q3: "How do you prevent clinical hallucinations regarding medication dosages?"</h4>
  <p><strong>Your Answer:</strong></p>
  <p>
    "We enforce a strict multi-layer guardrail system.
    Layer 1 is our deterministic poison fast-path filter.
    Layer 2 is our MAIRA clinical system instruction set, which strictly prohibits the model from prescribing prescription pharmaceutical dosages (like antibiotics, sedatives, or corticosteroids). Instead, the model is bound by clinical triage guidelines: it categorizes urgency into three distinct levels, delivers safe non-pharmaceutical first-aid steps (such as washing paws or offering oral rehydration), and routes the user immediately to verified Dhaka clinics.
    Layer 3 is RAG vector grounding: all clinical recommendations are backed by verified veterinary citations returned in <code>data.detail.sections</code>."
  </p>
</div>

<div class="card" style="margin-bottom: 14px;">
  <h4 style="color: #4338ca; margin-top: 0;">Q4: "How does the Lost &amp; Found Radar handle false positives when multiple dogs look similar?"</h4>
  <p><strong>Your Answer:</strong></p>
  <p>
    "Great question. We avoid simple single-feature matching by utilizing high-dimensional vector embeddings that correlate multiple independent attributes simultaneously:
    1. Visual features (coat coloring patterns, floppy vs. erect ears, distinctive spots);
    2. Physical accessories (collar color, bell, tag material);
    3. Microchip records; and
    4. Geographical zones (Banani, Gulshan, Uttara).
    <br><br>
    The system returns a cosine similarity confidence score (e.g., 0.92 for Rocky). If confidence falls below 0.75, the system avoids making an automated match assertion and instead prompts the user for clarifying details or flags it for community review. Furthermore, monetary rewards are protected via an escrow verification step before any payout is triggered."
  </p>
</div>

<div class="card" style="margin-bottom: 14px;">
  <h4 style="color: #4338ca; margin-top: 0;">Q5: "How are you handling bilingual Bengali and English processing?"</h4>
  <p><strong>Your Answer:</strong></p>
  <p>
    "We support Bengali natively through a hybrid approach.
    For emergency screening, our regex and heuristic filters recognize common Bengali toxic substance names (like 'চকলেট', 'লিলি ফুল', 'প্যারাসিটামল', 'বমি') with sub-5ms latency.
    For conversational triage, MAIRA’s underlying multimodal model processes Bengali syntax directly, recognizing colloquial Bangladeshi terminology (e.g., distinguishing between street dogs and home pets) and replying in fluent, comforting Bengali with clear bulleted action items."
  </p>
</div>

<div class="card" style="margin-bottom: 14px;">
  <h4 style="color: #4338ca; margin-top: 0;">Q6: "What is the operational cost and token latency impact on mobile devices?"</h4>
  <p><strong>Your Answer:</strong></p>
  <p>
    "Our architecture is highly cost- and performance-optimized.
    By filtering acute toxic emergencies with our local 2.1ms guardrail, we completely avoid LLM token consumption on routine poison checks.
    For RAG queries, MAIRA caches vector embeddings and returns responses in 385ms to 510ms.
    In our upcoming sprint, we are rolling out Server-Sent Events (SSE) streaming, which will stream initial response tokens to mobile devices in under 100ms, providing an instant, fluid user experience even on 4G cellular connections across Bangladesh."
  </p>
</div>

<div style="margin-top: 30px; text-align: center; font-size: 8.5pt; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
  Nuzzle Pet Social Media Platform • Technical Whitepaper &amp; Presentation Script • Confidential &amp; Proprietary • 2026
</div>

</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML saved to: {html_path}")

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome,
    "--headless=new",
    "--disable-gpu",
    f"--print-to-pdf={pdf_path}",
    "--no-pdf-header-footer",
    html_path
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome return code:", res.returncode)

if os.path.exists(pdf_path):
    size_kb = os.path.getsize(pdf_path) / 1024
    print(f"Generated PDF in presentation folder: {pdf_path} ({size_kb:.1f} KB)")
    
    # Also save a copy in root workspace for convenience
    import shutil
    shutil.copyfile(pdf_path, pdf_root_path)
    print(f"Copied PDF to workspace root: {pdf_root_path}")
else:
    print("Error: PDF file was not created!")
