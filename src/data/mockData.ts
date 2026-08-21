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
    birthDate: 'April 12, 2022',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    weight: '29.5 kg',
    gender: 'Neutered Male ♂',
    microchipId: 'CHIP: 985-1410-0921-334',
    passportNumber: 'BD-NZL-2022-8842-GOLD',
    colorMarkings: 'Honey Gold with White Chest Star',
    bloodType: 'DEA 1.1 Negative (Universal Donor)',
    registrationAuthority: 'Nuzzle Verified Pet Registry • Dhaka Central Division',
    ownerLineage: {
      primaryGuardian: 'Alex Rivers',
      relationship: 'Legal Adopter & Primary Guardian',
      phone: '+880 1712-345678',
      email: 'alex.rivers@pawmail.com',
      address: 'Road 79, House 14, Gulshan-2, Dhaka-1212',
      emergencyContactName: 'Dr. Sarah Mitchell (Lead Veterinarian)',
      emergencyPhone: '+880 1987-654321',
      primaryVetClinic: 'Gulshan Pet Hospital & 24/7 Trauma Center',
      breederOrShelter: 'Dhaka Paws Rescue Foundation (Shelter ID #DRF-902)'
    },
    vaccinationCertificates: [
      {
        vaccine: 'Rabies (Defensor 3 - 3yr)',
        dateAdministered: 'June 10, 2024',
        validUntil: 'June 10, 2027',
        batchNumber: 'RB-2024-9981A',
        vetClinic: 'Gulshan Pet Hospital',
        vetSignature: 'Dr. Sarah Mitchell, DVM #BD-6421',
        status: 'valid'
      },
      {
        vaccine: 'DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)',
        dateAdministered: 'April 15, 2024',
        validUntil: 'April 15, 2025',
        batchNumber: 'DH-8841-B9',
        vetClinic: 'Gulshan Pet Hospital',
        vetSignature: 'Dr. Sarah Mitchell, DVM #BD-6421',
        status: 'valid'
      },
      {
        vaccine: 'Bordetella Bronchiseptica (Kennel Cough)',
        dateAdministered: 'January 20, 2024',
        validUntil: 'January 20, 2025',
        batchNumber: 'KC-1102-X4',
        vetClinic: 'Gulshan Pet Hospital',
        vetSignature: 'Dr. Tanvir Ahmed, DVM #BD-5890',
        status: 'valid'
      },
      {
        vaccine: 'Canine Leptospirosis 4-Way',
        dateAdministered: 'May 02, 2024',
        validUntil: 'May 02, 2025',
        batchNumber: 'LP-3321-K8',
        vetClinic: 'Gulshan Pet Hospital',
        vetSignature: 'Dr. Sarah Mitchell, DVM #BD-6421',
        status: 'valid'
      }
    ],
    healthClearance: {
      fitForTravel: true,
      rabiesTitreClear: true,
      lastDeworming: 'August 01, 2024 (Drontal Plus)',
      allergies: ['No known drug allergies', 'Mild sensitivity to chicken meal']
    },
    postsCount: 34,
    followersCount: 940
  },
  {
    id: 'pet_2',
    ownerId: 'owner_me',
    name: 'Mochi',
    species: 'Cat',
    breed: 'Siamese Mix (Seal Point)',
    bio: 'Sunbeam napper, midnight zoomies champion 🌙 Silent judge.',
    age: '1 yr 8 mos',
    birthDate: 'January 20, 2023',
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    weight: '4.2 kg',
    gender: 'Spayed Female ♀',
    microchipId: 'CHIP: 985-1410-0921-889',
    passportNumber: 'BD-NZL-2023-1109-SIAM',
    colorMarkings: 'Cream body with dark chocolate seal points and sapphire eyes',
    bloodType: 'Feline Type A',
    registrationAuthority: 'Nuzzle Verified Pet Registry • Dhaka Central Division',
    ownerLineage: {
      primaryGuardian: 'Alex Rivers',
      relationship: 'Legal Adopter & Primary Guardian',
      phone: '+880 1712-345678',
      email: 'alex.rivers@pawmail.com',
      address: 'Road 79, House 14, Gulshan-2, Dhaka-1212',
      emergencyContactName: 'Feline Care Specialist Rahat Kabir',
      emergencyPhone: '+880 1987-654322',
      primaryVetClinic: 'Dhanmondi Feline Health Clinic & Spa',
      breederOrShelter: 'Dhaka Stray Cat Rescue Network (ID #CAT-410)'
    },
    vaccinationCertificates: [
      {
        vaccine: 'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)',
        dateAdministered: 'February 14, 2024',
        validUntil: 'February 14, 2027',
        batchNumber: 'FV-2024-4011C',
        vetClinic: 'Dhanmondi Feline Health Clinic',
        vetSignature: 'Dr. Farhana Yasmin, MRCVS #BD-7712',
        status: 'valid'
      },
      {
        vaccine: 'Feline Rabies (PureVax Feline)',
        dateAdministered: 'March 01, 2024',
        validUntil: 'March 01, 2025',
        batchNumber: 'FR-9932-P1',
        vetClinic: 'Dhanmondi Feline Health Clinic',
        vetSignature: 'Dr. Farhana Yasmin, MRCVS #BD-7712',
        status: 'valid'
      },
      {
        vaccine: 'Feline Leukemia Virus (FeLV)',
        dateAdministered: 'March 01, 2024',
        validUntil: 'March 01, 2025',
        batchNumber: 'FL-5501-M3',
        vetClinic: 'Dhanmondi Feline Health Clinic',
        vetSignature: 'Dr. Farhana Yasmin, MRCVS #BD-7712',
        status: 'valid'
      }
    ],
    healthClearance: {
      fitForTravel: true,
      rabiesTitreClear: true,
      lastDeworming: 'July 15, 2024 (Profender Topical)',
      allergies: ['No known allergies', 'Negative FeLV / FIV Certified']
    },
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
    caption: 'Found the most majestic stick in the whole forest today. Carried it for 3 whole miles with absolute pride! 🌲🐕 #goldenretriever #forestwalk #dogsofinstagram #happypup',
    mediaUrls: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 184,
    commentsCount: 23,
    isLiked: true,
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
    petAvatar: 'https://images.unsplash.com/photo-1513360309081-38f0762b781e?w=200&auto=format&fit=crop&q=80',
    isAnonymous: false,
    caption: 'She discovered the top of the refrigerator is warm. We have officially lost all kitchen supremacy. 👑🐾 #bengalcat #catlife #queenstatus',
    mediaUrls: [
      'https://images.unsplash.com/photo-1513360309081-38f0762b781e?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 312,
    commentsCount: 42,
    isLiked: false,
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
    mediaUrls: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 489,
    commentsCount: 56,
    isLiked: true,
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
    petName: 'Archie',
    species: 'Dog',
    breed: 'Beagle',
    status: 'lost',
    description: 'Wearing a red reflective collar with brass tag. Very friendly, responds to his name and squeaky toys. Slipped out near Elmwood Park around 4 PM.',
    imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
    location: 'Elmwood Park / 4th Ave, Portland',
    reward: '$250 Reward',
    contactName: 'Daniel Vance',
    contactPhone: '(503) 555-0192',
    reportedAt: '3 hours ago',
    isResolved: false
  },
  {
    id: 'lf_2',
    petName: 'Unidentified Tabby',
    species: 'Cat',
    breed: 'Domestic Short Hair',
    status: 'found',
    description: 'Found sheltering under porch during rain. Sweet green-eyed grey tabby, no collar. Safe and warm in our garage with food and water.',
    imageUrl: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&auto=format&fit=crop&q=80',
    location: 'Maple Ridge Neighborhood',
    contactName: 'Clara Oswald',
    contactPhone: '(503) 555-0844',
    reportedAt: '1 day ago',
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
    id: 'vet_1',
    name: 'Dr. Evelyn Martinez, DVM',
    clinicName: 'Rose City Companion Animal Clinic',
    location: '1420 NW Lovejoy St, Portland, OR',
    bio: '12+ years experience in small animal medicine, preventive wellness, and soft tissue surgery.',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 142,
    specialties: ['Wellness Exam', 'Dental Scaling', 'Vaccinations', 'Nutrition Counseling'],
    slots: {
      'Today': [
        { time: '09:00 AM', isBooked: true },
        { time: '10:30 AM', isBooked: false },
        { time: '01:15 PM', isBooked: false },
        { time: '03:45 PM', isBooked: true }
      ],
      'Tomorrow': [
        { time: '09:30 AM', isBooked: false },
        { time: '11:00 AM', isBooked: false },
        { time: '02:00 PM', isBooked: false },
        { time: '04:30 PM', isBooked: false }
      ]
    }
  },
  {
    id: 'vet_2',
    name: 'Dr. Marcus Vance, BVSc',
    clinicName: 'Paws & Claws Holistic Care',
    location: '880 SE Hawthorne Blvd, Portland, OR',
    bio: 'Specialist in geriatric pet care, joint therapy, acupuncture, and feline behavioral management.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 98,
    specialties: ['Geriatric Care', 'Acupuncture', 'Feline Medicine', 'Allergy Workups'],
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
    id: 'mkt_1',
    title: 'Orthopedic Memory Foam Pet Bed (Large)',
    category: 'Beds & Cages',
    price: 45,
    description: 'Waterproof liner with removable machine-washable faux fur cover. Used for 2 weeks, like new condition!',
    imageUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&auto=format&fit=crop&q=80',
    condition: 'Like New',
    sellerName: 'Elena Rostova',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    location: 'Pearl District',
    status: 'available'
  },
  {
    id: 'mkt_2',
    title: 'Interactive Laser & Feather Teaser Cat Toy',
    category: 'Toys',
    price: 18,
    description: 'Automatic 360-degree rotating laser with unpredictable timer modes. USB rechargeable.',
    imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800&auto=format&fit=crop&q=80',
    condition: 'Brand New',
    sellerName: 'Marcus Cole',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'Hawthorne',
    status: 'available'
  },
  {
    id: 'mkt_3',
    title: 'Hands-Free Bungee Running Leash with Waist Belt',
    category: 'Apparel',
    price: 24,
    description: 'Heavy duty with shock-absorbing bungee and pouch for phone & treats.',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80',
    condition: 'Good Condition',
    sellerName: 'Alex Rivers',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'West Hills',
    status: 'available'
  }
];

export const initialChats: ChatConversation[] = [
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
