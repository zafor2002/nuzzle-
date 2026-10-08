import type { Owner, Pet, Post, Story, Reel, HealthLog, LostFoundPost, AdoptionListing, Vet, Appointment, MarketplaceListing, ChatConversation, AppNotification } from '../types';

export const initialOwner: Owner = {
  id: 'owner_me',
  username: 'pawprints_alex',
  displayName: 'Alex Rivers',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: '🐾 Golden retriever dad & Siamese cat servant | Nature hiker | Pet nutrition enthusiast 🥑',
  isAnonymous: false,
  isPrivate: false,
  notifyLikes: true,
  notifyComments: true,
  notifyFollows: true,
  followersCount: 1420,
  followingCount: 388
};

export const initialPets: Pet[] = [
  {
    id: 'pet_1',
    ownerId: 'owner_me',
    name: 'Waffles',
    species: 'Dog',
    breed: 'Golden Retriever',
    bio: 'Professional stick collector & supreme ball fetcher 🎾 Always happy!',
    age: '2 yrs 4 mos',
    birthDate: '2022-04-12',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    weight: '29.5 kg',
    microchipId: '985-1410-0921-334',
    postsCount: 34,
    followersCount: 940
  },
  {
    id: 'pet_2',
    ownerId: 'owner_me',
    name: 'Mochi',
    species: 'Cat',
    breed: 'Siamese mix',
    bio: 'Sunbeam napper, midnight zoomies champion 🌙 Silent judge.',
    age: '1 yr 8 mos',
    birthDate: '2023-01-20',
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    weight: '4.2 kg',
    microchipId: '985-1410-0921-889',
    postsCount: 21,
    followersCount: 680
  }
];

export const initialStories: Story[] = [
  {
    id: 'story_1',
    creatorId: 'pet_1',
    creatorName: 'Waffles',
    creatorAvatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80',
    petName: 'Golden Retriever',
    hasUnseen: true,
    segments: [
      {
        id: 'seg_1',
        mediaUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
        caption: 'Morning park sprint was 10/10! 🐾🎾',
        durationMs: 4500
      },
      {
        id: 'seg_2',
        mediaUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
        caption: 'Pupcup conquered! 🍦😋',
        durationMs: 4500
      }
    ]
  },
  {
    id: 'story_2',
    creatorId: 'user_luna',
    creatorName: 'Luna & Oliver',
    creatorAvatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&auto=format&fit=crop&q=80',
    petName: 'Oliver (Corgi)',
    hasUnseen: true,
    segments: [
      {
        id: 'seg_3',
        mediaUrl: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=800&auto=format&fit=crop&q=80',
        caption: 'Short legs, huge dreams ☁️🐕',
        durationMs: 4500
      }
    ]
  },
  {
    id: 'story_3',
    creatorId: 'user_kiwi',
    creatorName: 'Kiwi The Conure',
    creatorAvatar: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&auto=format&fit=crop&q=80',
    petName: 'Kiwi (Green Cheek Conure)',
    hasUnseen: true,
    segments: [
      {
        id: 'seg_4',
        mediaUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80',
        caption: 'Vocal warmups before breakfast 🎶🦜',
        durationMs: 4500
      }
    ]
  },
  {
    id: 'story_4',
    creatorId: 'user_boba',
    creatorName: 'Boba The Bun',
    creatorAvatar: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&auto=format&fit=crop&q=80',
    petName: 'Holland Lop',
    hasUnseen: false,
    segments: [
      {
        id: 'seg_5',
        mediaUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
        caption: 'Banana slices are LIFE 🍌🐰',
        durationMs: 4500
      }
    ]
  }
];

export const initialPosts: Post[] = [
  {
    id: 'post_1',
    ownerId: 'owner_me',
    ownerName: 'Alex Rivers',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    petId: 'pet_1',
    petName: 'Waffles',
    petBreed: 'Golden Retriever',
    petAvatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    caption: 'Found the most majestic stick in the whole forest today. Carried it for 3 whole miles with absolute pride! 🌲🐕 #goldenretriever #forestwalk #happypup',
    petDialogue: 'I am the Supreme Branch Master. This stick belongs in the Smithsonian.',
    petMood: '🐾 Zoomies & Fetch Mode',
    petSoundBite: '🎵 Excited Panting & Tail Wag',
    mediaUrls: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 184,
    commentsCount: 23,
    isLiked: true,
    selectedReaction: 'nuzzle',
    reactions: {
      paw: 68,
      nuzzle: 54,
      treat: 38,
      ball: 19,
      purr: 5
    },
    isSaved: true,
    createdAt: '2h ago',
    location: 'Pine Crest Trail, OR',
    hashtags: ['goldenretriever', 'forestwalk', 'dogsofinstagram', 'happypup'],
    comments: [
      {
        id: 'c1',
        authorName: 'Sarah & Milo',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        isPet: false,
        body: 'Branch manager of the year award goes to Waffles! 🏆',
        createdAt: '1h ago',
        likesCount: 14,
        isLiked: true
      },
      {
        id: 'c2',
        authorName: 'Oliver (Corgi)',
        authorAvatar: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=200&auto=format&fit=crop&q=80',
        isPet: true,
        body: 'Impressed! If I tried carrying that my belly would drag 😂',
        createdAt: '45m ago',
        likesCount: 9
      }
    ]
  },
  {
    id: 'post_2',
    ownerId: 'user_sophia',
    ownerName: 'Sophia Chen',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    petId: 'pet_cleo',
    petName: 'Cleopatra',
    petBreed: 'Bengal Cat',
    petAvatar: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    caption: 'She discovered the top of the refrigerator is warm. We have officially lost all kitchen supremacy. 👑🐾 #bengalcat #catlife #queenstatus',
    petDialogue: 'Bow down, peasant. Feed me salmon from down there.',
    petMood: '👑 Mischief & Royalty',
    petSoundBite: '🎵 Gentle Low Rumble Purr',
    mediaUrls: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 312,
    commentsCount: 42,
    isLiked: false,
    selectedReaction: null,
    reactions: {
      paw: 94,
      nuzzle: 88,
      treat: 72,
      ball: 11,
      purr: 47
    },
    isSaved: false,
    createdAt: '5h ago',
    location: 'Seattle, WA',
    hashtags: ['bengalcat', 'catlife', 'queenstatus'],
    comments: [
      {
        id: 'c3',
        authorName: 'Cat Whisperer Dan',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isPet: false,
        body: 'Her coat pattern in that lighting is unreal! ✨',
        createdAt: '3h ago',
        likesCount: 11
      }
    ]
  },
  {
    id: 'post_3',
    ownerId: 'user_anonymous',
    ownerName: 'Anonymous Owner',
    ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    petId: 'pet_barnaby',
    petName: 'Barnaby',
    petBreed: 'French Bulldog',
    petAvatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&auto=format&fit=crop&q=80',
    isAnonymous: true,
    caption: 'First swimming lesson with the life jacket on! 10% paddling, 90% looking fabulous. 🌊🦺 #frenchie #swimmingdog #summerfun',
    petDialogue: 'I am a fierce amphibious beast. Fear my tiny paddle toes.',
    petMood: '🎾 Splash & Play Time',
    petSoundBite: '🎵 Tiny Snort & Splash',
    mediaUrls: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 489,
    commentsCount: 56,
    isLiked: true,
    selectedReaction: 'treat',
    reactions: {
      paw: 145,
      nuzzle: 120,
      treat: 112,
      ball: 78,
      purr: 34
    },
    isSaved: false,
    createdAt: '8h ago',
    location: 'Lake Tahoe',
    hashtags: ['frenchie', 'swimmingdog', 'summerfun'],
    comments: [
      {
        id: 'c4',
        authorName: 'Alex Rivers',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isPet: false,
        body: 'The little shark fin life vest is top tier adorable! ❤️',
        createdAt: '6h ago',
        likesCount: 7
      }
    ]
  }
];

export const initialReels: Reel[] = [
  {
    id: 'reel_1',
    creatorName: 'Alex Rivers',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    petName: 'Waffles (Golden Retriever)',
    caption: 'When you say "Walkies" in a whisper from across the house 🐶💨',
    videoGradient: 'linear-gradient(145deg, #1E3A8A, #3B82F6 40%, #F59E0B)',
    videoTitle: 'The Sound Barrier Zoomies',
    audioTrack: 'Original Audio • Golden Vibes 🎵',
    likesCount: 12400,
    commentsCount: 890,
    sharesCount: 3200,
    isLiked: false,
    isSaved: true,
    tags: ['#zoomies', '#goldenretriever', '#puppylove', '#funnydogs']
  },
  {
    id: 'reel_2',
    creatorName: 'Maya Thorne',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    petName: 'Kiko (Maine Coon)',
    caption: 'Trying to work from home with a 15-pound fluffy boss inspecting every key tap 💻🐾',
    videoGradient: 'linear-gradient(145deg, #831843, #BE185D 40%, #F43F5E)',
    videoTitle: 'Chief Purr Officer at Work',
    audioTrack: 'Cat Keyboard Jazz • Ambient Chill 🎹',
    likesCount: 34200,
    commentsCount: 1420,
    sharesCount: 8900,
    isLiked: true,
    isSaved: false,
    tags: ['#mainecoon', '#catsoftiktok', '#wfhlife', '#fluffball']
  },
  {
    id: 'reel_3',
    creatorName: 'EcoParrots',
    creatorAvatar: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&auto=format&fit=crop&q=80',
    petName: 'Mango (Sun Conure)',
    caption: 'Mango learned the iPhone notification chime and now tricks everyone in the house 📱🦜',
    videoGradient: 'linear-gradient(145deg, #065F46, #059669 40%, #10B981)',
    videoTitle: 'The Master Mimic',
    audioTrack: 'Ting Ting Chime • Mango Remastered 🔔',
    likesCount: 89100,
    commentsCount: 3100,
    sharesCount: 14500,
    isLiked: true,
    isSaved: true,
    tags: ['#birdlife', '#conure', '#smartpets', '#parrotsofinstagram']
  }
];

export const initialHealthLogs: HealthLog[] = [
  {
    id: 'hl_1',
    petId: 'pet_1',
    petName: 'Waffles',
    type: 'vaccination',
    title: 'DHPP & Rabies Booster',
    notes: 'Administered at Rose City Animal Hospital. No allergic response. Next booster due in 12 months.',
    date: '2026-06-15',
    reminderAt: '2027-06-15',
    veterinarian: 'Dr. Evelyn Martinez, DVM'
  },
  {
    id: 'hl_2',
    petId: 'pet_1',
    petName: 'Waffles',
    type: 'vet_visit',
    title: 'Annual Wellness & Dental Check',
    notes: 'Teeth scaling clean. Heart and lung sounds clear. Ideal body condition score (5/9). Weight 29.5 kg.',
    date: '2026-07-02',
    reminderAt: '2027-07-02',
    veterinarian: 'Dr. James Callahan'
  },
  {
    id: 'hl_3',
    petId: 'pet_1',
    petName: 'Waffles',
    type: 'medication',
    title: 'Heartgard Plus Monthly Chew',
    notes: 'Heartworm & parasite preventative given with breakfast.',
    date: '2026-08-01',
    reminderAt: '2026-09-01'
  },
  {
    id: 'hl_4',
    petId: 'pet_2',
    petName: 'Mochi',
    type: 'vaccination',
    title: 'FVRCP Tri-annual Vaccine',
    notes: 'Calicivirus, Panleukopenia and Rhinotracheitis preventative. All good!',
    date: '2026-05-10',
    reminderAt: '2027-05-10',
    veterinarian: 'Dr. Evelyn Martinez, DVM'
  }
];

export const initialLostFound: LostFoundPost[] = [
  {
    id: 'lf_1',
    petName: 'Rocky',
    species: 'Dog',
    breed: 'German Shepherd',
    status: 'lost',
    description: 'Large pointed erect ears with slight nick on left ear. Red nylon collar with silver Nuzzle QR tag. Friendly dog responds to whistling and his name Rocky.',
    imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80',
    location: 'Banani Road 11 near Kemal Ataturk Ave',
    areaName: 'Banani, Dhaka',
    lat: 23.7937,
    lng: 90.4066,
    reward: '৳15,000 Reward',
    contactName: 'Kazi Tanvir',
    contactPhone: '+880 1711-998877',
    reportedAt: '1 hour ago',
    isResolved: false,
    geoBlastActive: true,
    geoBlastRadiusKm: 5,
    geoBlastRespondersCount: 86
  },
  {
    id: 'lf_2',
    petName: 'Milo',
    species: 'Cat',
    breed: 'Persian (Odd-Eyed)',
    status: 'lost',
    description: 'One blue eye and one amber eye with fluffy pure white coat. Pink velvet collar with gold bell. Very shy, hides under parked cars near Gulshan Lake Park.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    location: 'Gulshan-2 near Lake Park & Embassy Zone',
    areaName: 'Gulshan-2, Dhaka',
    lat: 23.7925,
    lng: 90.4167,
    reward: '৳10,000 Reward',
    contactName: 'Nabila Rahman',
    contactPhone: '+880 1819-223344',
    reportedAt: '3 hours ago',
    isResolved: false,
    geoBlastActive: true,
    geoBlastRadiusKm: 5,
    geoBlastRespondersCount: 112
  },
  {
    id: 'lf_3',
    petName: 'Shadow',
    species: 'Dog',
    breed: 'Siberian Husky',
    status: 'lost',
    description: 'Striking ice-blue eyes with white face mask and bushy tail. Blue reflective chest harness. Microchipped with Nuzzle Smart Collar. Fast runner.',
    imageUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&auto=format&fit=crop&q=80',
    location: 'Uttara Sector 7 Park Lake drive',
    areaName: 'Uttara, Dhaka',
    lat: 23.8698,
    lng: 90.3986,
    reward: '৳25,000 Reward',
    contactName: 'Arif Chowdhury',
    contactPhone: '+880 1912-334455',
    reportedAt: '5 hours ago',
    isResolved: false,
    geoBlastActive: false,
    geoBlastRadiusKm: 5,
    geoBlastRespondersCount: 42
  },
  {
    id: 'lf_4',
    petName: 'Simba',
    species: 'Cat',
    breed: 'Deshi / Indie Shorthair',
    status: 'lost',
    description: 'Orange ginger tabby with white socks on all four paws. Yellow flea collar with nameplate. Neutered male with loud meow.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=80',
    location: 'Dhanmondi Road 27 near Rabindra Sarobar',
    areaName: 'Dhanmondi, Dhaka',
    lat: 23.7538,
    lng: 90.3768,
    reward: '৳5,000 Reward',
    contactName: 'Samiul Huq',
    contactPhone: '+880 1611-445566',
    reportedAt: 'Yesterday',
    isResolved: false
  },
  {
    id: 'lf_5',
    petName: 'Spotted Beagle Mix (Found)',
    species: 'Dog',
    breed: 'Beagle Cross',
    status: 'found',
    description: 'Found sheltering near Bashundhara Playpen school gate. Safe with building security, given water. Looking for verified pet parent!',
    imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
    location: 'Bashundhara R/A Block C',
    areaName: 'Bashundhara, Dhaka',
    lat: 23.8151,
    lng: 90.4323,
    contactName: 'Bashundhara Pet Rescue Volunteers',
    contactPhone: '+880 1722-556677',
    reportedAt: '6 hours ago',
    isResolved: false
  }
];

export const initialAdoptions: AdoptionListing[] = [
  {
    id: 'adopt_1',
    name: 'Daisy',
    species: 'Dog',
    breed: 'Australian Shepherd Mix',
    age: '1.5 years',
    gender: 'Girl',
    status: 'available',
    description: 'High energy, loves agility games, gentle with kids! Looking for an active outdoor family.',
    imageUrl: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=800&auto=format&fit=crop&q=80',
    location: 'Cascade Pet Rescue, OR',
    shelterName: 'Cascade Rescue Foundation',
    fee: '$120 adoption fee',
    temperament: ['Playful', 'Smart', 'Affectionate'],
    isVaccinated: true,
    isNeutered: true
  },
  {
    id: 'adopt_2',
    name: 'Pip & Squeak',
    species: 'Rabbit',
    breed: 'Mini Rex Pair',
    age: '9 months',
    gender: 'Boy',
    status: 'available',
    description: 'Bonded pair of velvety soft bunnies. Litterbox trained, love cilantro and cardboard castles.',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
    location: 'Hop Haven Sanctuary',
    shelterName: 'Hop Haven Animal Rescue',
    fee: '$75 bonded pair fee',
    temperament: ['Gentle', 'Curious', 'Quiet'],
    isVaccinated: true,
    isNeutered: true
  },
  {
    id: 'adopt_3',
    name: 'Shadow',
    species: 'Cat',
    breed: 'Bombay / Domestic Black Cat',
    age: '3 years',
    gender: 'Boy',
    status: 'pending',
    description: 'Sleek mini-panther who lives to be brushed and will purr like an engine while making biscuits.',
    imageUrl: 'https://images.unsplash.com/photo-1503777119540-ce54b422baff?w=800&auto=format&fit=crop&q=80',
    location: 'City Feline Haven',
    shelterName: 'City Feline Care',
    fee: '$60 fee',
    temperament: ['Lap Cat', 'Calm', 'Vocal'],
    isVaccinated: true,
    isNeutered: true
  }
];

export const initialVets: Vet[] = [
  {
    id: 'vet_3',
    name: 'Dr. Sarah Al-Mansoor, DVM, DACVS',
    clinicName: 'Cascade 24/7 Emergency & Surgical Hospital',
    location: 'House 14 Road 103, Gulshan-2, Dhaka',
    bio: 'Board-Certified Veterinary Surgeon specializing in 24/7 trauma triage, orthopedics, poison decontamination, and acute surgical ICU.',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 218,
    isProSubscriber: true,
    proBadgeLabel: '🌟 24/7 ICU Verified Hospital',
    distanceMiles: 1.8,
    acceptedSpecies: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile'],
    emergencyCare: true,
    isOpenNow: true,
    hasIcu: true,
    hasSurgery: true,
    lat: 23.7925,
    lng: 90.4167,
    phone: '+880 1711-998877',
    priceRange: '$$$',
    specialties: ['24/7 Trauma ICU', 'Poison Decontamination', 'Emergency Surgery', 'Digital X-Ray & Ultrasound'],
    slots: {
      'Today': [
        { time: 'Immediate Emergency (Open Now)', isBooked: false },
        { time: '02:00 PM', isBooked: false },
        { time: '05:30 PM', isBooked: false }
      ],
      'Tomorrow': [
        { time: '09:00 AM', isBooked: false },
        { time: '01:00 PM', isBooked: false }
      ]
    }
  },
  {
    id: 'vet_1',
    name: 'Dr. Emily Watson, DVM',
    clinicName: 'Bark & Purr Veterinary Center',
    location: 'House 32 Road 27 (Old 16), Dhanmondi, Dhaka',
    bio: '12+ years experience in companion animal clinical pathology, ultrasonic dental scaling, and feline emergency care.',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813571-638f026385ab?w=200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 142,
    isProSubscriber: true,
    proBadgeLabel: '🌟 Nuzzle Partner Clinic',
    distanceMiles: 3.2,
    acceptedSpecies: ['Dog', 'Cat', 'Rabbit'],
    emergencyCare: true,
    isOpenNow: true,
    hasIcu: true,
    hasSurgery: true,
    lat: 23.7538,
    lng: 90.3768,
    phone: '+880 1819-223344',
    priceRange: '$$',
    specialties: ['General Wellness', 'Preventive Vaccinations', 'Dental Scaling', 'Feline Internal Medicine'],
    slots: {
      'Today': [
        { time: '10:30 AM', isBooked: false },
        { time: '01:15 PM', isBooked: false },
        { time: '03:45 PM', isBooked: true }
      ],
      'Tomorrow': [
        { time: '09:30 AM', isBooked: false },
        { time: '11:00 AM', isBooked: false }
      ]
    }
  },
  {
    id: 'vet_4',
    name: 'Dr. Marcus Vance, BVSc MSc',
    clinicName: 'Avian & Exotic Pet Sanctuary',
    location: 'Sector 7 Road 12, Uttara, Dhaka',
    bio: 'Specialist in avian medicine, exotic parrots, rabbits, ferrets, reptiles, and specialized small mammal dental burr.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 86,
    isProSubscriber: true,
    proBadgeLabel: '🌟 Avian & Exotic Specialist',
    distanceMiles: 4.5,
    acceptedSpecies: ['Bird', 'Rabbit', 'Reptile', 'Guinea Pig'],
    emergencyCare: false,
    isOpenNow: true,
    hasIcu: false,
    hasSurgery: true,
    lat: 23.8698,
    lng: 90.3986,
    phone: '+880 1912-889900',
    priceRange: '$$',
    specialties: ['Avian Medicine', 'Beak & Feather Care', 'Rabbit GI Stasis', 'Exotic Surgery'],
    slots: {
      'Today': [
        { time: '01:00 PM', isBooked: false },
        { time: '04:00 PM', isBooked: false }
      ],
      'Tomorrow': [
        { time: '10:30 AM', isBooked: false },
        { time: '02:30 PM', isBooked: false }
      ]
    }
  },
  {
    id: 'vet_2',
    name: 'Dr. Tanzeem Reza, DVM MS',
    clinicName: 'Pet Care Clinic & Diagnostic Center',
    location: 'Plot 18 Block C, Bashundhara R/A, Dhaka',
    bio: 'Clinical pathology specialist, infectious disease PCR screening (Parvo/Distemper), microscopic skin scrapings, and fluid therapy.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 98,
    isProSubscriber: false,
    proBadgeLabel: '✓ Diagnostic Hub',
    distanceMiles: 2.7,
    acceptedSpecies: ['Dog', 'Cat'],
    emergencyCare: true,
    isOpenNow: true,
    hasIcu: true,
    hasSurgery: false,
    lat: 23.8151,
    lng: 90.4323,
    phone: '+880 1722-445566',
    priceRange: '$$',
    specialties: ['PCR Blood Screening', 'Pre-Surgical Profiles', 'Fluid Therapy', 'Microscopic Scrapings'],
    slots: {
      'Today': [
        { time: '11:30 AM', isBooked: true },
        { time: '02:30 PM', isBooked: false }
      ],
      'Tomorrow': [
        { time: '10:00 AM', isBooked: false },
        { time: '01:30 PM', isBooked: false }
      ]
    }
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt_1',
    petId: 'pet_1',
    petName: 'Waffles',
    vetId: 'vet_1',
    vetName: 'Dr. Evelyn Martinez, DVM',
    clinicName: 'Rose City Companion Animal Clinic',
    reason: 'Bi-annual physical & nail trim',
    date: 'Tomorrow',
    time: '11:00 AM',
    status: 'confirmed'
  }
];

export const initialMarketplace: MarketplaceListing[] = [
  {
    id: 'mkt_shop_1',
    title: 'Bark & Bite Organic Freeze-Dried Raw Beef Toppers',
    category: 'Food & Treats',
    price: 32,
    description: '100% grass-fed single-ingredient beef topper infused with wild blueberries and organic kelp. Great for picky eaters and coat shine.',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80',
    condition: 'Brand New',
    sellerName: 'Paws & Pastures Organic Co.',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    sellerType: 'verified_shop',
    isVerifiedShop: true,
    shopRating: 4.9,
    shopBadge: '✓ Verified Food Brand',
    location: 'Official Store • Ships in 24h',
    status: 'available',
    stock: 45,
    tags: ['organic', 'raw', 'grain-free', 'bestseller']
  },
  {
    id: 'mkt_shop_2',
    title: 'Smart GPS & Night Glow LED Safety Harness (Waterproof USB-C)',
    category: 'Accessories',
    price: 48,
    description: 'Real-time cellular beacon tracking with customizable 360-degree ambient neon glow. Fits dogs 15–40kg.',
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&auto=format&fit=crop&q=80',
    condition: 'Brand New',
    sellerName: 'UrbanHound Gear Lab',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    sellerType: 'verified_shop',
    isVerifiedShop: true,
    shopRating: 5.0,
    shopBadge: '✓ Verified Gear Boutique',
    location: 'Portland Flagship • Ships Free',
    status: 'available',
    stock: 18,
    tags: ['gps', 'safety', 'harness', 'nightwalks']
  },
  {
    id: 'mkt_shop_3',
    title: 'Wild Alaskan Salmon & Cranberry Puree for Cats (Pack of 12)',
    category: 'Food & Treats',
    price: 22,
    description: 'Vet-approved taurine-boosted lickable puree treats for kidney and urinary tract support.',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80',
    condition: 'Brand New',
    sellerName: 'Purrfect Feast Naturals',
    sellerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    sellerType: 'verified_shop',
    isVerifiedShop: true,
    shopRating: 4.8,
    shopBadge: '✓ Verified Nutrition Partner',
    location: 'Seattle Hub • Next-Day Delivery',
    status: 'available',
    stock: 60,
    tags: ['cats', 'urinarycare', 'lickable', 'salmon']
  },
  {
    id: 'mkt_shop_4',
    title: 'Multi-Level Deluxe Sisal Scratching Tree & Velvet Cloud Hammock',
    category: 'Beds & Cages',
    price: 89,
    description: 'Eco-friendly natural sisal rope with heavy-duty weighted oak base. Includes ultra-soft hanging sleep cloud.',
    imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800&auto=format&fit=crop&q=80',
    condition: 'Brand New',
    sellerName: 'Whiskers & Co. Atelier',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerType: 'verified_shop',
    isVerifiedShop: true,
    shopRating: 4.9,
    shopBadge: '✓ Verified Craft Studio',
    location: 'Design Studio • Free Assembly Guide',
    status: 'available',
    stock: 8,
    tags: ['cattree', 'furniture', 'scratchpost', 'luxury']
  },
  {
    id: 'mkt_parent_1',
    title: 'Orthopedic Memory Foam Pet Bed (Large, Removable Cover)',
    category: 'Beds & Cages',
    price: 45,
    description: 'Waterproof liner with removable machine-washable faux fur cover. Used for 2 weeks by my gentle retriever, washed and sanitized!',
    imageUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&auto=format&fit=crop&q=80',
    condition: 'Like New',
    sellerName: 'Elena Rostova',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    sellerType: 'individual',
    isVerifiedShop: false,
    shopBadge: '👤 Pet Parent',
    location: 'Pearl District (Local Pickup / Drop-off)',
    status: 'available',
    stock: 1,
    tags: ['bed', 'memoryfoam', 'largepet']
  },
  {
    id: 'mkt_parent_2',
    title: 'Hands-Free Bungee Running Leash with Phone/Treat Waist Pack',
    category: 'Apparel',
    price: 24,
    description: 'Heavy duty with shock-absorbing bungee and pouch for phone & treats. Great for trail running with energetic dogs.',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80',
    condition: 'Good Condition',
    sellerName: 'Alex Rivers',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerType: 'individual',
    isVerifiedShop: false,
    shopBadge: '👤 Pet Parent',
    location: 'West Hills (Can meet at Park)',
    status: 'available',
    stock: 1,
    tags: ['leash', 'running', 'bungee']
  },
  {
    id: 'mkt_parent_3',
    title: 'Soft-Sided Airline Approved Expandable Pet Travel Carrier',
    category: 'Accessories',
    price: 35,
    description: 'TSA and airline compliant with fold-out mesh porches on both sides. Used only once for a flight.',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80',
    condition: 'Like New',
    sellerName: 'Sophia Chen',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    sellerType: 'individual',
    isVerifiedShop: false,
    shopBadge: '👤 Pet Parent',
    location: 'Downtown (Pick up anytime)',
    status: 'available',
    stock: 1,
    tags: ['carrier', 'travel', 'airline']
  }
];

export const initialChats: ChatConversation[] = [
  {
    id: 'chat_pawdoctor_ai',
    participantId: 'pawdoctor_ai',
    participantName: 'PawDoctor AI (Clinical Assistant)',
    participantAvatar: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=150&auto=format&fit=crop&q=80',
    petName: 'PawDoctor 24/7',
    lastMessage: 'Hello! I am PawDoctor AI. How can I help your pet today?',
    lastMessageTime: 'Just now',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'm_ai_welcome',
        senderId: 'pawdoctor_ai',
        isSelf: false,
        body: 'Hello! 🐾 I am your 24/7 clinical triage AI assistant powered by veterinary taxonomies. Ask me anything about your pet\'s health, diet, vaccines, or symptoms!',
        timestamp: 'Just now'
      }
    ]
  },
  {
    id: 'chat_1',
    participantId: 'user_sophia',
    participantName: 'Sophia Chen',
    participantAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    petName: 'Cleopatra (Bengal)',
    lastMessage: 'Let me know which weekend works for the dog park playdate!',
    lastMessageTime: '12m ago',
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        senderId: 'user_sophia',
        isSelf: false,
        body: 'Hey Alex! Loved your latest post of Waffles with that massive branch haha 🌲',
        timestamp: '11:20 AM'
      },
      {
        id: 'm2',
        senderId: 'owner_me',
        isSelf: true,
        body: 'Thanks Sophia! He refused to let it go all the way back to the car 😂',
        timestamp: '11:24 AM'
      },
      {
        id: 'm3',
        senderId: 'user_sophia',
        isSelf: false,
        body: 'Let me know which weekend works for the dog park playdate!',
        timestamp: '11:30 AM'
      }
    ]
  },
  {
    id: 'chat_2',
    participantId: 'shelter_cascade',
    participantName: 'Cascade Rescue Foundation',
    participantAvatar: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=150&auto=format&fit=crop&q=80',
    petName: 'Daisy (Adoption Inquiry)',
    lastMessage: 'We received your foster inquiry and sent the application form 📋',
    lastMessageTime: '2h ago',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm4',
        senderId: 'owner_me',
        isSelf: true,
        body: 'Hello! I saw Daisy on the adoption hub. Is she good with other golden retrievers?',
        timestamp: '9:15 AM'
      },
      {
        id: 'm5',
        senderId: 'shelter_cascade',
        isSelf: false,
        body: 'We received your foster inquiry and sent the application form 📋',
        timestamp: '10:00 AM'
      }
    ]
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'like',
    title: 'New Like on Waffles’ Post',
    message: 'Sophia Chen and 14 others liked your photo "Found the most majestic stick..."',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    timeAgo: '15m ago',
    isRead: false
  },
  {
    id: 'notif_2',
    type: 'comment',
    title: 'New Comment',
    message: 'Oliver (Corgi) commented: "Impressed! If I tried carrying that my belly would drag 😂"',
    avatarUrl: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=200&auto=format&fit=crop&q=80',
    timeAgo: '45m ago',
    isRead: false
  },
  {
    id: 'notif_3',
    type: 'lost_alert',
    title: '🚨 Lost Pet Alert Nearby',
    message: 'Archie (Beagle) reported lost near Elmwood Park (1.2 miles away)',
    avatarUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=200&auto=format&fit=crop&q=80',
    timeAgo: '3h ago',
    isRead: true
  },
  {
    id: 'notif_4',
    type: 'follow',
    title: 'New Follower',
    message: 'Kiwi The Conure started following Waffles',
    avatarUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&auto=format&fit=crop&q=80',
    timeAgo: '1d ago',
    isRead: true
  }
];

export const exploreTrendingTags = [
  { tag: 'goldenretriever', count: '142K posts', icon: '🐕' },
  { tag: 'caturday', count: '98K posts', icon: '🐱' },
  { tag: 'bunniesofig', count: '45K posts', icon: '🐰' },
  { tag: 'petnutrition', count: '31K posts', icon: '🥑' },
  { tag: 'adoptionjourney', count: '29K posts', icon: '🏡' },
  { tag: 'vetadvice', count: '18K posts', icon: '🩺' }
];

export const speciesCommunities = [
  { id: 'comm_1', name: 'Golden Retriever Club', members: '24.5K members', avatar: '🐕', color: '#FDE68A' },
  { id: 'comm_2', name: 'Feline Royalty Lounge', members: '19.8K members', avatar: '👑', color: '#DDD6FE' },
  { id: 'comm_3', name: 'Frenchie & Pug Pals', members: '15.2K members', avatar: '🐾', color: '#FECDD3' },
  { id: 'comm_4', name: 'Avian & Feathered Friends', members: '8.4K members', avatar: '🦜', color: '#A7F3D0' },
  { id: 'comm_5', name: 'Bunny Haven Burrow', members: '6.9K members', avatar: '🥕', color: '#FED7AA' }
];
