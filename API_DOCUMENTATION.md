# 🐾 Nuzzle RESTful API Documentation

> **Comprehensive API Reference & Frontend-to-Backend Integration Guide**  
> *Platform: Nuzzle — The AI-Powered Pet Social Network (Built for Bangladesh & Global)*  
> *Backend Framework: Next.js 16 App Router + Prisma 7 + PostgreSQL (Supabase)*  
> *Frontend Framework: Vue 3 + Vite + TypeScript (Pinia/Reactive Services Layer)*

---

## 1. Overview & Architecture

Nuzzle provides a unified RESTful JSON API layer allowing web, mobile, and third-party partner integrations to access all social networking, emergency rescue, veterinary telemedicine, and verified marketplace capabilities.

### Base URLs
- **Local Development**: `http://localhost:3000/api` (Vite Proxy: `http://localhost:5173/api`)
- **Staging / Production**: `https://api.nuzzle.ai/api`

### Core Response Standard
Every API response adheres to a predictable JSON envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation message",
  "error": "Error description (only present on failure)",
  "errors": { ... }
}
```

---

## 2. Authentication & Authorization

All authenticated endpoints require an `Authorization` HTTP header with a Bearer Token:

```http
Authorization: Bearer <nuzzle_auth_token>
```

### Multi-Role Identity Model
Nuzzle natively supports 3 distinct user roles:
1. `parent` — Pet Parents & Guardians (manages pet profiles, daily moments, vet appointments).
2. `store` — Verified Pet Businesses & Boutiques (verified storefront badge, product catalogs).
3. `vet` — Licensed Veterinary Hospitals & Practitioners (24/7 trauma triage, verified clinic badge, priority booking).

---

## 3. Complete Endpoint Reference

---

### 3.1 Authentication (`/api/auth`)

#### `POST /api/auth/signup`
Registers a new user account with role-specific metadata.

- **Request Body**:
```json
{
  "email": "alex.rivers@nuzzle.ai",
  "password": "SecurePassword123!",
  "username": "pawprints_alex",
  "displayName": "Alex Rivers",
  "role": "parent",
  "storeCategory": "Optional for store role",
  "clinicName": "Optional for vet role"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "owner": {
      "id": "owner_17892348",
      "username": "pawprints_alex",
      "displayName": "Alex Rivers",
      "email": "alex.rivers@nuzzle.ai",
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      "bio": "🐾 Pet Parent in Dhaka | Animal Lover"
    },
    "role": "parent",
    "token": "nuzzle_jwt_owner_17892348_1789234890"
  },
  "message": "Account created successfully."
}
```

- **cURL Example**:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nuzzle.ai","password":"Password123!","username":"testuser","displayName":"Test Parent","role":"parent"}'
```

---

#### `POST /api/auth/login`
Authenticates an existing user or performs a demo quick-login by role.

- **Request Body (Email/Password)**:
```json
{
  "email": "alex.rivers@nuzzle.ai",
  "password": "SecurePassword123!"
}
```
- **Request Body (Demo Role Switch)**:
```json
{
  "role": "vet"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "owner": {
      "id": "owner_drsarah",
      "displayName": "Dr. Sarah Al-Mansoor, DVM",
      "username": "cascade_emergency_vet",
      "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
      "role": "vet",
      "clinicName": "Cascade 24/7 Animal Hospital"
    },
    "role": "vet",
    "token": "nuzzle_token_owner_drsarah_1789234890"
  },
  "message": "Logged in successfully via quick role switch."
}
```

---

#### `GET /api/auth/me`
Retrieves the active authenticated user profile and associated pet entities.

- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "owner_me",
    "username": "pawprints_alex",
    "displayName": "Alex Rivers",
    "followersCount": 1420,
    "followingCount": 388,
    "pets": [
      {
        "id": "pet_1",
        "name": "Waffles",
        "species": "Dog",
        "breed": "Golden Retriever",
        "avatarUrl": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80",
        "weight": "29.5 kg",
        "aiPersonality": "Silly Goofball & Master Fetcher"
      }
    ]
  }
}
```

---

### 3.2 Pet Profile Management (`/api/pets`)

#### `GET /api/pets`
Lists all pets, with optional query parameters for owner filtering or species discovery.

- **Query Parameters**:
  - `ownerId` (string, optional) — Filter pets by guardian ID.
  - `species` (string, optional) — Filter by species (`Dog`, `Cat`, `Bird`, `Rabbit`).
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "pet_1",
      "name": "Waffles",
      "species": "Dog",
      "breed": "Golden Retriever",
      "avatarUrl": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80",
      "age": "2 yrs 4 mos",
      "weight": "29.5 kg",
      "microchipId": "985-1410-0921-334",
      "aiPersonality": "Silly Goofball & Master Fetcher",
      "energyLevel": "High Zoomies"
    }
  ]
}
```

---

#### `POST /api/pets`
Creates a new digital pet passport with AI personality attributes.

- **Request Body**:
```json
{
  "name": "Barnaby",
  "species": "Dog",
  "breed": "French Bulldog",
  "bio": "First swimming lesson with the life jacket on! 🌊🦺",
  "avatarUrl": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&auto=format&fit=crop&q=80",
  "weight": "12.4 kg",
  "aiPersonality": "Amphibious Beast with Tiny Paddle Toes",
  "energyLevel": "Moderate Zoomies"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "pet_178923891",
    "name": "Barnaby",
    "species": "Dog",
    "breed": "French Bulldog",
    "createdAt": "2026-08-31T12:00:00.000Z"
  },
  "message": "Pet profile created successfully."
}
```

---

### 3.3 Social Feed & Tactile Reactions (`/api/posts`)

#### `GET /api/posts`
Retrieves paginated moments from the Den Feed, including pet monologues, audio waveforms, and reaction counts.

- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 20)
  - `tag` (string, optional) — Filter by hashtag (e.g. `goldenretriever`).
  - `species` (string, optional) — Filter by species.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "post_1",
      "ownerName": "Alex Rivers",
      "petName": "Waffles",
      "petBreed": "Golden Retriever",
      "caption": "Found the most majestic stick in the whole park today. Carried it for 3 whole miles with absolute pride! 🌲🐕 #goldenretriever #happypup",
      "petDialogue": "I am the Supreme Branch Master. This stick belongs in the Smithsonian.",
      "petMood": "🐾 Zoomies & Fetch Mode",
      "petSoundBite": "🎵 Excited Panting & Tail Wag",
      "mediaUrls": [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80"
      ],
      "likesCount": 184,
      "reactions": {
        "paw": 68,
        "nuzzle": 54,
        "treat": 38,
        "ball": 19,
        "purr": 5
      },
      "location": "Gulshan Lake Park, Dhaka"
    }
  ]
}
```

---

#### `POST /api/posts/:id/react`
Dispatches a Facebook-style tactile pet reaction.

- **Supported Reaction Types**: `paw` (🐾), `nuzzle` (💜), `treat` (🦴), `ball` (🎾), `purr` (😻).
- **Request Body**:
```json
{
  "reaction": "nuzzle"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "postId": "post_1",
    "reaction": "nuzzle",
    "message": "Reacted with nuzzle 🐾"
  }
}
```

---

### 3.4 5-Mile Emergency Radar & Street Rescue (`/api/lost-found`)

#### `GET /api/lost-found`
Fetches community lost, found, and injured street rescue alerts within a 5-mile geo-fence.

- **Query Parameters**:
  - `filter` — `all` | `lost` | `found` | `emergency`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "lf_1",
      "type": "lost",
      "petName": "Rusty",
      "species": "Dog",
      "breed": "Golden Cocker Spaniel",
      "lastSeenLocation": "Gulshan-2 Circle, Dhaka",
      "lastSeenDate": "Today, 2:30 PM",
      "reward": "৳ 5,000 BDT",
      "distanceMiles": 0.8,
      "matchScore": 94,
      "isClaimed": false
    }
  ]
}
```

---

#### `POST /api/lost-found/:id/claim`
Executes a claim-and-lock action by a registered volunteer or coordinator to prevent duplicated dispatch.

- **Request Body**:
```json
{
  "volunteerName": "Volunteer Farhan (PAW Rescue)"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "lf_2",
    "isClaimed": true,
    "claimedBy": "Volunteer Farhan (PAW Rescue)",
    "claimedAt": "Just now",
    "message": "Rescue report claimed & locked. Dispatch notification sent to nearby coordinators."
  }
}
```

---

### 3.5 Veterinary Clinics & Telemedicine (`/api/vet`)

#### `GET /api/vet/directory`
Lists accredited clinics and 24/7 hospitals with Pro priority ranking.

- **Query Parameters**:
  - `emergency` (boolean) — Filter for 24/7 emergency trauma capabilities.
  - `species` (string) — Filter by accepted species.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "vet_3",
      "name": "Dr. Sarah Al-Mansoor, DVM, DACVS",
      "clinicName": "Cascade 24/7 Emergency & Surgical Hospital",
      "location": "Gulshan-2, Dhaka",
      "isProSubscriber": true,
      "proBadgeLabel": "🌟 Nuzzle Pro Priority Hospital",
      "distanceMiles": 2.1,
      "emergencyCare": true,
      "slots": {
        "Today": [
          { "time": "02:00 PM", "isBooked": false },
          { "time": "05:30 PM", "isBooked": false }
        ]
      }
    }
  ]
}
```

---

#### `POST /api/vet/appointments`
Books a confirmed veterinary slot with instant scheduling verification.

- **Request Body**:
```json
{
  "petId": "pet_1",
  "petName": "Waffles",
  "vetId": "vet_1",
  "vetName": "Dr. Emily Watson, DVM",
  "clinicName": "Bark & Purr Veterinary Center",
  "date": "Tomorrow",
  "time": "10:30 AM",
  "reason": "Annual Vaccination Booster & Dental Check"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "apt_17892401",
    "status": "confirmed",
    "confirmationCode": "NZL-VET-481923"
  },
  "message": "Veterinary consultation booked successfully."
}
```

---

### 3.6 PawAI 24/7 Symptom Triage (`/api/pawai/triage`)

#### `POST /api/pawai/triage`
Performs natural language veterinary symptom evaluation in Bangla and English, classifying conditions into 3 clinical urgency tiers.

- **Request Body**:
```json
{
  "petName": "Waffles",
  "species": "Dog",
  "symptoms": "Limping on right front paw after jumping and whining when touched",
  "isProSubscriber": true
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "triageId": "trg_17892410",
    "petName": "Waffles",
    "species": "Dog",
    "urgency": "moderate",
    "urgencyLabel": "Schedule Vet Visit (24-48h)",
    "urgencyColor": "#F59E0B",
    "summary": "Our clinical triage engine analyzed Waffles's symptoms. Non-emergency clinical evaluation recommended.",
    "recommendedActions": [
      "Ensure access to clean, fresh water at all times.",
      "Keep your pet indoors in a calm, temperature-controlled room.",
      "Record a 15-second video of any unusual gait or posture for your veterinarian."
    ],
    "redFlags": [
      "Pale or bluish gums",
      "Difficulty breathing",
      "Inability to bear any weight on the limb for >24 hours"
    ],
    "recommendedClinic": {
      "id": "vet_3",
      "name": "Dr. Sarah Al-Mansoor, DVM",
      "clinicName": "Cascade 24/7 Emergency & Surgical Hospital",
      "phone": "+880 1711-998877",
      "isProPriority": true
    },
    "disclaimer": "PawDoctor AI provides preliminary guidance based on veterinary triage taxonomies and does not replace in-person diagnosis by a licensed veterinarian."
  }
}
```

---

### 3.7 Verified Marketplace (`/api/marketplace`)

#### `GET /api/marketplace`
Lists verified products and shop merchandise with category filters.

- **Query Parameters**:
  - `category` — `All` | `Gear & Leashes` | `Beds & Furniture` | `Toys` | `Food & Treats`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "mkt_1",
      "title": "Ergonomic Breathable Dog Harness (No-Pull)",
      "category": "Gear & Leashes",
      "price": 1850,
      "currency": "BDT",
      "sellerName": "UrbanHound Dhaka Official",
      "sellerType": "verified_shop",
      "location": "Gulshan-2, Dhaka",
      "rating": 4.9
    }
  ]
}
```

---

## 4. Frontend Integration Guide

The Vue 3 frontend (`forntenduse vue js`) is organized with a centralized typed API client and modular domain services:

```
src/services/
├── apiClient.ts         # Base HTTP client with Bearer Token & Error handling
├── authService.ts       # Signup, login, session validation
├── postService.ts       # Feed, reactions, comments, bookmarks
├── petService.ts        # Pet passports, CRUD, health logs
├── vetService.ts        # Directory, appointment scheduling
├── lostFoundService.ts  # 5-Mile emergency radar, claim-and-lock
├── marketplaceService.ts# Storefront listings & categories
├── adoptionService.ts   # Rescue & adoption listings
├── pawAiService.ts      # PawDoctor 24/7 AI triage engine
└── index.ts             # Unified barrel export
```

### Example: Calling an API Service in Vue Component
```typescript
import { postService, pawAiService } from '@/services';

// Fetch paginated feed
const feedResponse = await postService.getFeed({ page: 1, limit: 10 });
if (feedResponse.success) {
  console.log('Posts loaded:', feedResponse.data);
}

// Perform PawDoctor AI triage
const triageResult = await pawAiService.submitTriage({
  petName: 'Waffles',
  species: 'Dog',
  symptoms: 'Swallowed a small plastic toy piece',
  isProSubscriber: true
});
```

---

## 5. HTTP Status Code Conventions

| Status Code | Meaning | Description |
|---|---|---|
| `200 OK` | Success | Standard successful GET or state mutation |
| `201 Created` | Created | Resource successfully created (Post, Pet, Booking) |
| `400 Bad Request` | Validation Error | Payload failed Zod schema validation |
| `401 Unauthorized` | Auth Required | Missing or expired Bearer Token |
| `404 Not Found` | Not Found | Target ID does not exist in database |
| `409 Conflict` | Conflict | Duplicate username or email |
| `500 Server Error` | Server Failure | Internal server error (handled with error envelope) |
