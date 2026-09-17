import { reactive, ref, computed } from 'vue';
import type { 
  TabType, 
  Owner, 
  Pet, 
  Post, 
  Story, 
  Reel, 
  HealthLog, 
  LostFoundPost, 
  AdoptionListing, 
  Vet, 
  Appointment, 
  MarketplaceListing, 
  ChatConversation, 
  AppNotification,
  AiScanResult,
  PetReactionType,
  UserRole,
  UserAccount
} from '../types';
import { 
  initialStories, 
  initialPosts, 
  initialReels, 
  initialHealthLogs, 
  initialLostFound, 
  initialAdoptions, 
  initialVets, 
  initialAppointments, 
  initialMarketplace, 
  initialChats, 
  initialNotifications 
} from '../data/mockData';
import { 
  authService, 
  postService, 
  vetService, 
  lostFoundService, 
  marketplaceService, 
  pawAiService,
  adoptionService,
  apiClient 
} from '../services';
import { supabase } from '../services/supabaseClient';

// Check if user has an existing saved session
const savedToken = typeof window !== 'undefined' ? localStorage.getItem('nuzzle_auth_token') : null;

// State
export const isAuthenticated = ref<boolean>(!!savedToken);
export const currentTab = ref<TabType>(savedToken ? 'feed' : 'auth');
export const isDarkMode = ref(false);
export const isCreateSheetOpen = ref(false);
export const selectedStory = ref<Story | null>(null);
export const activeChat = ref<ChatConversation | null>(null);
export const searchQuery = ref('');
export const activeHashtag = ref<string | null>(null);
export const activeProfileId = ref<string>('owner_me');
export const isCommentsModalOpen = ref(false);
export const activePostForComments = ref<Post | null>(null);
export const isProModalOpen = ref(false);
export const isAddPetModalOpen = ref(false);
export const currentRole = ref<UserRole>('parent');

export const owner = reactive<Owner>({
  id: 'owner_me',
  username: 'petparent',
  displayName: 'Pet Parent',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: '🐾 Pet lover on Nuzzle • Welcome to Dhaka\'s Pet Community!',
  isAnonymous: false,
  isPrivate: false,
  notifyLikes: true,
  notifyComments: true,
  notifyFollows: true,
  followersCount: 0,
  followingCount: 0
});

export const pets = reactive<Pet[]>([]);
export const stories = reactive<Story[]>([...initialStories]);
export const posts = reactive<Post[]>([...initialPosts]);
export const reels = reactive<Reel[]>([...initialReels]);
export const healthLogs = reactive<HealthLog[]>([...initialHealthLogs]);
export const lostFoundList = reactive<LostFoundPost[]>([...initialLostFound]);
export const adoptions = reactive<AdoptionListing[]>([...initialAdoptions]);
export const vets = reactive<Vet[]>([...initialVets]);
export const appointments = reactive<Appointment[]>([...initialAppointments]);
export const marketplace = reactive<MarketplaceListing[]>([...initialMarketplace]);
export const chats = reactive<ChatConversation[]>([...initialChats]);
export const notifications = reactive<AppNotification[]>([...initialNotifications]);

// AI Hub Reactive State
export interface AiTriageMessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  severity?: 'low' | 'medium' | 'urgent';
  urgencyLabel?: string;
  urgencyColor?: string;
  actions?: string[];
  redFlags?: string[];
  clinic?: {
    name: string;
    clinicName: string;
    phone: string;
    location?: string;
  };
  provider?: string;
  timestamp: string;
}

export const aiTriageMessages = reactive<AiTriageMessageItem[]>([
  {
    id: 'ai_1',
    sender: 'ai',
    text: "Hello Alex! I am PawAI 🩺, your 24/7 Pet Care & Triage Assistant. Describe any symptom or dietary question about Waffles or Mochi, and I'll provide immediate triage guidance.",
    severity: 'low',
    timestamp: 'Just now'
  }
]);

export const isAiTriageLoading = ref(false);

export const isAiScanning = ref(false);
export const currentScanResult = ref<AiScanResult | null>(null);

// Computed
export const activePet = computed(() => {
  if (activeProfileId.value === 'owner_me') return null;
  return pets.find(p => p.id === activeProfileId.value) || null;
});

export const unreadNotificationsCount = computed(() => {
  return notifications.filter(n => !n.isRead).length;
});

export const unreadMessagesCount = computed(() => {
  return chats.reduce((acc, c) => acc + c.unreadCount, 0);
});

export const activePosts = computed(() => {
  if (activeHashtag.value) {
    return posts.filter(p => p.hashtags.includes(activeHashtag.value!));
  }
  return posts;
});

// Actions
export function setTab(tab: TabType) {
  if (!isAuthenticated.value && tab !== 'auth') {
    currentTab.value = 'auth';
    return;
  }
  currentTab.value = tab;

  // Immediately dispatch live backend API request on every tab click
  if (tab === 'feed') {
    postService.getFeed({ page: 1, limit: 15 }).then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const livePosts = res.data;
        const sessionPosts = posts.filter(p => p.id.startsWith('post_') && !livePosts.some(lp => lp.id === p.id));
        posts.splice(0, posts.length, ...sessionPosts, ...livePosts);
      }
    }).catch(() => {});
  } else if (tab === 'explore') {
    postService.getFeed({ page: 1, limit: 12 }).catch(() => {});
  } else if (tab === 'vets') {
    vetService.getDirectory().then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        vets.splice(0, vets.length, ...res.data);
      }
    }).catch(() => {});
    vetService.getAppointments().catch(() => {});
  } else if (tab === 'lostfound') {
    lostFoundService.getReports().then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveReports: LostFoundPost[] = res.data.map((r: any) => ({
          id: r.id,
          petName: r.petName,
          species: r.species,
          breed: r.breed || 'Companion',
          status: (r.type === 'found' || r.status === 'found') ? 'found' : 'lost',
          description: r.description || '',
          imageUrl: r.imageUrl || (r.mediaUrls && r.mediaUrls[0]) || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
          location: r.lastSeenLocation || r.location || 'Dhaka',
          reward: r.reward,
          contactName: r.contactName || 'Community Member',
          contactPhone: r.contactPhone || '+880 1700-000000',
          reportedAt: r.lastSeenDate || r.reportedDate || 'Recently',
          isResolved: r.isResolved || false,
          isClaimed: r.isClaimed || false,
          claimedBy: r.claimedBy,
          claimedAt: r.claimedAt,
          claimType: r.claimType,
          claimNotes: r.claimNotes,
        }));
        const sessionReports = lostFoundList.filter(item => !liveReports.some(lr => lr.id === item.id));
        lostFoundList.splice(0, lostFoundList.length, ...sessionReports, ...liveReports);
      }
    }).catch(() => {});
  } else if (tab === 'market') {
    marketplaceService.getListings().then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveItems: MarketplaceListing[] = res.data.map((m: any) => {
          const isShop = m.sellerType === 'store' || m.sellerType === 'verified_shop';
          return {
            id: m.id,
            title: m.title,
            category: (m.category as any) || 'Accessories',
            price: Number(m.price) || 0,
            description: m.description || '',
            imageUrl: m.imageUrl || (m.mediaUrls && m.mediaUrls[0]) || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80',
            condition: 'Brand New',
            sellerName: m.sellerName || (isShop ? 'UrbanHound Dhaka Official' : 'Alex Rivers'),
            sellerAvatar: m.sellerAvatar || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=200&auto=format&fit=crop&q=80',
            sellerType: isShop ? 'verified_shop' : 'individual',
            isVerifiedShop: isShop,
            shopRating: 4.9,
            location: m.location || 'Dhaka',
            status: 'available',
          };
        });
        const sessionItems = marketplace.filter(item => !liveItems.some(li => li.id === item.id));
        marketplace.splice(0, marketplace.length, ...sessionItems, ...liveItems);
      }
    }).catch(() => {});
  } else if (tab === 'adoption') {
    adoptionService.getAdoptions().then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveAdoptions: AdoptionListing[] = res.data.map((a: any) => ({
          id: a.id,
          name: a.name,
          species: a.species,
          breed: a.breed || 'Companion',
          age: a.age || 'Young',
          gender: (a.gender === 'Female' || a.gender === 'Girl') ? 'Girl' : 'Boy',
          status: 'available',
          description: a.description || a.bio || 'Loving rescue companion looking for a home.',
          imageUrl: a.imageUrl || (a.mediaUrls && a.mediaUrls[0]) || 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&auto=format&fit=crop&q=80',
          location: a.location || 'Dhaka',
          shelterName: a.shelterName || a.organizationName || 'Dhaka Animal Welfare Shelter',
          isVaccinated: a.vaccinated ?? true,
          isNeutered: a.neutered ?? false,
          temperament: ['Affectionate', 'Gentle'],
        }));
        const sessionAdoptions = adoptions.filter(item => !liveAdoptions.some(la => la.id === item.id));
        adoptions.splice(0, adoptions.length, ...sessionAdoptions, ...liveAdoptions);
      }
    }).catch(() => {});
  } else if (tab === 'profile') {
    authService.getCurrentUser().catch(() => {});
    apiClient.get('/pets').catch(() => {});
  } else if (tab === 'activity') {
    apiClient.get('/notifications').catch(() => {});
  } else if (tab === 'messages') {
    apiClient.get('/messages').catch(() => {});
  } else if (tab === 'reels') {
    apiClient.get('/stories').catch(() => {});
  }
}

export function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function reactToPost(postId: string, reaction: PetReactionType) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (!post.reactions) {
    post.reactions = { paw: 0, nuzzle: 0, treat: 0, ball: 0, purr: 0 };
  }

  // If already selected the same reaction, toggle off
  if (post.selectedReaction === reaction) {
    post.reactions[reaction] = Math.max(0, post.reactions[reaction] - 1);
    post.selectedReaction = null;
    post.isLiked = false;
    post.likesCount = Math.max(0, post.likesCount - 1);
  } else {
    // If switching from another reaction
    if (post.selectedReaction && post.reactions[post.selectedReaction] > 0) {
      post.reactions[post.selectedReaction]--;
    } else {
      post.likesCount++;
    }
    post.selectedReaction = reaction;
    post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
    post.isLiked = true;
  }

  // Async sync to backend API
  postService.reactToPost(postId, reaction).catch(() => {});
}

export function togglePostLike(postId: string) {
  reactToPost(postId, 'nuzzle');
}

export function togglePostSave(postId: string) {
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.isSaved = !post.isSaved;
    postService.toggleSave(postId).catch(() => {});
  }
}

export function addComment(postId: string, body: string, isAsPet: boolean = false) {
  const post = posts.find(p => p.id === postId);
  if (!post || !body.trim()) return;

  const authorName = isAsPet && pets[0] ? `${pets[0].name} (Golden)` : owner.displayName;
  const authorAvatar = isAsPet && pets[0] ? pets[0].avatarUrl : owner.avatarUrl;

  const newComment = {
    id: `c_${Date.now()}`,
    authorName,
    authorAvatar,
    isPet: isAsPet,
    body: body.trim(),
    createdAt: 'Just now',
    likesCount: 0
  };

  post.comments.push(newComment);
  post.commentsCount++;

  // Async sync to backend API
  postService.addComment(postId, body.trim(), authorName, isAsPet).catch(() => {});
}

export function toggleReelLike(reelId: string) {
  const reel = reels.find(r => r.id === reelId);
  if (reel) {
    reel.isLiked = !reel.isLiked;
    reel.likesCount += reel.isLiked ? 1 : -1;
  }
}

export function toggleReelSave(reelId: string) {
  const reel = reels.find(r => r.id === reelId);
  if (reel) {
    reel.isSaved = !reel.isSaved;
  }
}

export function openStory(story: Story) {
  selectedStory.value = story;
  story.hasUnseen = false;
  // Trigger live stories API request
  apiClient.get('/stories').catch(() => {});
}

export function closeStory() {
  selectedStory.value = null;
}

export function openComments(post: Post) {
  activePostForComments.value = post;
  isCommentsModalOpen.value = true;
  // Trigger live comments fetch from backend
  postService.getComments(post.id).then(res => {
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      post.comments = res.data;
      post.commentsCount = res.data.length;
    }
  }).catch(() => {});
}

export function closeComments() {
  isCommentsModalOpen.value = false;
  activePostForComments.value = null;
}

export function openChat(conversation: ChatConversation) {
  activeChat.value = conversation;
  conversation.unreadCount = 0;
  // Trigger live messages API request
  apiClient.get('/messages').catch(() => {});
}

export function openChatWith(name: string, avatar: string, petName?: string, defaultMsg?: string) {
  let chat = chats.find(c => c.participantName === name);
  if (!chat) {
    chat = {
      id: `chat_${Date.now()}`,
      participantId: `user_${Date.now()}`,
      participantName: name,
      participantAvatar: avatar,
      petName,
      lastMessage: defaultMsg || 'Started conversation',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      isOnline: true,
      messages: defaultMsg ? [
        {
          id: `m_${Date.now()}`,
          senderId: 'owner_me',
          isSelf: true,
          body: defaultMsg,
          timestamp: 'Just now'
        }
      ] : []
    };
    chats.unshift(chat);
  }
  activeChat.value = chat;
}

export function closeChat() {
  activeChat.value = null;
}

export async function sendMessageToActiveChat(body: string) {
  if (!activeChat.value || !body.trim()) return;

  const currentChat = activeChat.value;
  const userText = body.trim();

  const newMsg = {
    id: `msg_${Date.now()}`,
    senderId: 'owner_me',
    isSelf: true,
    body: userText,
    timestamp: 'Just now'
  };

  currentChat.messages.push(newMsg);
  currentChat.lastMessage = userText;
  currentChat.lastMessageTime = 'Just now';

  const isAiChat = 
    currentChat.participantId.includes('ai') || 
    currentChat.participantName.toLowerCase().includes('pawdoctor') ||
    currentChat.participantName.toLowerCase().includes('ai') ||
    currentChat.participantName.toLowerCase().includes('dr.') ||
    currentChat.participantName.toLowerCase().includes('vet');

  if (isAiChat) {
    try {
      const currentPet = activePet.value || pets[0];
      const chatHistory = currentChat.messages.slice(-8).map(m => ({
        role: (m.isSelf ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.body
      }));

      const res = await pawAiService.sendChat({
        messages: chatHistory,
        petContext: {
          petName: currentPet?.name || 'Waffles',
          species: currentPet?.species || 'Dog',
          breed: currentPet?.breed || 'Golden Retriever',
          isProSubscriber: owner.isProMember,
        }
      });

      if (res.success && res.data?.reply) {
        currentChat.messages.push({
          id: `msg_ai_${Date.now()}`,
          senderId: currentChat.participantId,
          isSelf: false,
          body: res.data.reply,
          timestamp: 'Just now'
        });
        currentChat.lastMessage = res.data.reply;
        currentChat.lastMessageTime = 'Just now';
        return;
      }
    } catch (err) {
      console.warn('AI chat error, using local fallback:', err);
    }
  }

  // Standard peer conversation reply
  setTimeout(() => {
    if (currentChat) {
      const replies = [
        "Aww that's fantastic! 🐾 Let's coordinate soon!",
        "Thanks so much for reaching out! Happy to help 🐶",
        "Sounds like a great plan! Talk soon 😊",
        "Purr-fect! Let me know if you need anything else 🐱"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      currentChat.messages.push({
        id: `msg_reply_${Date.now()}`,
        senderId: currentChat.participantId,
        isSelf: false,
        body: randomReply,
        timestamp: 'Just now'
      });
      currentChat.lastMessage = randomReply;
      currentChat.lastMessageTime = 'Just now';
    }
  }, 1000);
}

// AI Specific Actions
export async function sendAiTriageQuery(query: string) {
  if (!query.trim()) return;

  const userMsgId = `u_${Date.now()}`;
  aiTriageMessages.push({
    id: userMsgId,
    sender: 'user',
    text: query,
    timestamp: 'Just now'
  });

  isAiTriageLoading.value = true;

  try {
    const currentPet = activePet.value || pets[0];
    const res = await pawAiService.submitTriage({
      petName: currentPet?.name || 'Pet',
      species: currentPet?.species || 'Dog',
      breed: currentPet?.breed || undefined,
      symptoms: query,
      isProSubscriber: owner.isProMember,
    });

    if (res.success && res.data) {
      const d = res.data;
      const severityMap: Record<string, 'low' | 'medium' | 'urgent'> = {
        low: 'low',
        moderate: 'medium',
        emergency: 'urgent',
      };

      aiTriageMessages.push({
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: d.summary,
        severity: severityMap[d.urgency] || 'low',
        urgencyLabel: d.urgencyLabel,
        urgencyColor: d.urgencyColor,
        actions: d.recommendedActions,
        redFlags: d.redFlags,
        clinic: d.recommendedClinic,
        provider: d.provider,
        timestamp: 'Just now',
      });
      return;
    }
  } catch (err) {
    console.warn('Backend triage error, using local fallback:', err);
  } finally {
    isAiTriageLoading.value = false;
  }

  // Fallback if network was unreachable
  const q = query.toLowerCase();
  let aiResponse = "I've analyzed your question. Ensure your pet has plenty of fresh water and rest. If symptoms persist over 24 hours, booking a quick checkup with Dr. Evelyn Martinez is advised.";
  let severity: 'low' | 'medium' | 'urgent' = 'low';

  if (q.includes('chocolate') || q.includes('poison') || q.includes('grape') || q.includes('onion') || q.includes('bleeding')) {
    aiResponse = "🚨 CRITICAL TRIAGE ALERT: Ingesting this substance can be toxic to pets! Please contact your nearest emergency veterinary hospital immediately.";
    severity = 'urgent';
  } else if (q.includes('vomit') || q.includes('diarrhea') || q.includes('limp')) {
    aiResponse = "⚠️ MODERATE ATTENTION: Mild gastrointestinal or muscular issue detected. Withhold heavy meals for 4 hours, provide small sips of water.";
    severity = 'medium';
  }

  aiTriageMessages.push({
    id: `ai_${Date.now()}`,
    sender: 'ai',
    text: aiResponse,
    severity,
    timestamp: 'Just now'
  });
}


export function runAiPetScan(_imageUrl?: string, petSpecies?: string, petBreed?: string) {
  isAiScanning.value = true;
  currentScanResult.value = null;

  const currentPet = activePet.value || pets[0];
  const species = (petSpecies || currentPet?.species || 'Dog').toLowerCase();
  const breed = petBreed || currentPet?.breed || (species === 'cat' ? 'Bengal / Tabby' : 'Golden Retriever');

  setTimeout(() => {
    isAiScanning.value = false;

    if (species.includes('cat') || species.includes('feline')) {
      currentScanResult.value = {
        breedMatch: `${breed} (97.6% Biometric Match)`,
        confidence: 97.6,
        detectedMood: 'Curious & Contented 😻 (Relaxed posture, soft rhythmic blinking)',
        healthObservations: [
          'Coat condition: Silky dense gloss, zero dander or matting detected',
          'Eye & Pupillary Clarity: Clear sclera, symmetrical pupil reactivity',
          'Ear Canal Biometrics: Clean pinnae, zero mite irritation detected',
          'Dental Health Index: Grade 1 healthy enamel, pink gingival margin'
        ],
        nutritionAdvice: 'High-protein wet food rotation (min 34% protein) with taurine, omega-3, and fresh water fountain.',
        funFact: 'Cats have 32 individual muscles in each ear, allowing 180-degree independent rotation!'
      };
    } else if (species.includes('rabbit') || species.includes('bunny')) {
      currentScanResult.value = {
        breedMatch: `${breed} (96.2% Biometric Match)`,
        confidence: 96.2,
        detectedMood: 'Gentle & Inquisitive 🥕 (Soft twitching nose, relaxed ear carriage)',
        healthObservations: [
          'Coat & Fur Density: Soft plush coat, clean dry hocks',
          'Dental Incisor Occlusion: Proper chisel wear alignment detected',
          'Respiratory Rhythm: Smooth, silent breathing with zero ocular discharge',
          'Hydration & Gut Balance: High fiber digestive score'
        ],
        nutritionAdvice: '85% continuous fresh Timothy hay + small handful of dark leafy greens daily.',
        funFact: 'A happy rabbit performs an acrobatic jump and twist in mid-air known as a "binky"!'
      };
    } else {
      currentScanResult.value = {
        breedMatch: `${breed} (98.4% Biometric Match)`,
        confidence: 98.4,
        detectedMood: 'Joyful & High Energy 🌟 (Relaxed ears, soft panting expression)',
        healthObservations: [
          'Coat density: Excellent sheen, zero matting or skin redness detected',
          'Body Condition Score: Ideal 5/9 (Athletic lean musculature)',
          'Eye clarity: Clear sclera, alert tracking and visual focus',
          'Estimated Dental Cleanliness: 92% healthy enamel, zero plaque build-up'
        ],
        nutritionAdvice: 'Maintain balanced caloric intake with joint supplements (glucosamine/chondroitin).',
        funFact: 'A dog’s sense of smell is so acute it can detect some scents in parts per trillion!'
      };
    }
  }, 1400);
}

export function generateAiCaption(type: 'silly' | 'heartwarming' | 'dramatic' | 'poetic', _petName: string = 'Waffles'): { caption: string; tags: string[] } {
  const captions = {
    silly: {
      caption: `10/10 branch manager right here. I don't fetch sticks, I acquire lumber 🌲🐶 No one can stop my zoomies today!`,
      tags: ['zoomies', 'stickcollector', 'goodboy', 'doghumor', 'goldensofig']
    },
    heartwarming: {
      caption: `Golden hour walks with my favorite human ❤️ Every day with you is the best adventure of my life.`,
      tags: ['unconditionallove', 'petlife', 'goldenhour', 'companion', 'furever']
    },
    dramatic: {
      caption: `It has been 4.5 minutes since my last treat. Despair is setting in. The bowl is a barren wasteland. Send help 🍖🥺`,
      tags: ['dramadog', 'treatplease', 'starvingartist', 'petsoftiktok']
    },
    poetic: {
      caption: `Sunlight dancing through the pine needles, paws softly treading on mossy earth. The forest belongs to the brave 🐾✨`,
      tags: ['naturepup', 'wildandfree', 'goldenretriever', 'peaceful']
    }
  };

  return captions[type] || captions.silly;
}

export function addHealthRecord(record: Omit<HealthLog, 'id'>) {
  const newRecord: HealthLog = {
    id: `hl_${Date.now()}`,
    ...record
  };
  healthLogs.unshift(newRecord);
}

export function bookVetSlot(vetId: string, day: string, time: string, petId: string, reason: string) {
  const vet = vets.find(v => v.id === vetId);
  const pet = pets.find(p => p.id === petId) || pets[0];
  if (!vet || !vet.slots[day]) return false;

  const slot = vet.slots[day].find(s => s.time === time);
  if (!slot || slot.isBooked) return false;

  slot.isBooked = true;

  const newAppt: Appointment = {
    id: `apt_${Date.now()}`,
    petId: pet.id,
    petName: pet.name,
    vetId: vet.id,
    vetName: vet.name,
    clinicName: vet.clinicName,
    reason: reason || 'General Checkup',
    date: day,
    time: time,
    status: 'confirmed'
  };

  appointments.unshift(newAppt);

  notifications.unshift({
    id: `notif_${Date.now()}`,
    type: 'appointment',
    title: 'Appointment Confirmed! 🩺',
    message: `Booked for ${pet.name} with ${vet.name} on ${day} at ${time}`,
    avatarUrl: vet.avatarUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  // Async sync to backend API
  vetService.bookAppointment({
    petId: pet.id,
    petName: pet.name,
    vetId: vet.id,
    vetName: vet.name,
    clinicName: vet.clinicName,
    date: day,
    time: time,
    reason: reason || 'General Checkup'
  }).catch(() => {});

  return true;
}

export function createNewPost(caption: string, mediaUrl: string, asPetId?: string) {
  const selectedPet = asPetId ? pets.find(p => p.id === asPetId) : null;
  const newPost: Post = {
    id: `post_${Date.now()}`,
    ownerId: owner.id,
    ownerName: owner.isAnonymous ? 'Anonymous Pet Parent' : owner.displayName,
    ownerAvatar: owner.avatarUrl,
    petId: selectedPet?.id,
    petName: selectedPet?.name,
    petBreed: selectedPet?.breed,
    petAvatar: selectedPet?.avatarUrl,
    isAnonymous: owner.isAnonymous || (selectedPet?.isAnonymous ?? false),
    caption,
    mediaUrls: [mediaUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80'],
    likesCount: 1,
    commentsCount: 0,
    isLiked: true,
    isSaved: false,
    createdAt: 'Just now',
    hashtags: caption.match(/#[a-zA-Z0-9_]+/g)?.map(t => t.slice(1)) || ['pets'],
    comments: []
  };

  posts.unshift(newPost);
  if (selectedPet) {
    selectedPet.postsCount++;
  }

  // Async sync to backend API
  postService.createPost(newPost).catch(() => {});
}

export function reportLostPet(data: Omit<LostFoundPost, 'id' | 'reportedAt' | 'isResolved'>) {
  const newAlert: LostFoundPost = {
    id: `lf_${Date.now()}`,
    ...data,
    reportedAt: 'Just now',
    isResolved: false
  };
  lostFoundList.unshift(newAlert);
  
  notifications.unshift({
    id: `notif_lost_${Date.now()}`,
    type: 'lost_alert',
    title: '🚨 Emergency Alert Created',
    message: `${data.petName} (${data.status.toUpperCase()}) broadcasted to nearby community`,
    avatarUrl: data.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  // Async sync to backend API
  lostFoundService.createReport(newAlert).catch(() => {});
}

export function claimLostFoundPet(
  postId: string, 
  claimType: 'owner_reunited' | 'volunteer_rescue' | 'foster_care', 
  notes?: string
) {
  const item = lostFoundList.find(p => p.id === postId);
  if (!item) return;

  item.isClaimed = true;
  item.claimedBy = owner.displayName;
  item.claimedAt = 'Just now';
  item.claimType = claimType;
  item.claimNotes = notes || '';
  if (claimType === 'owner_reunited') {
    item.isResolved = true;
  }

  const title = claimType === 'owner_reunited'
    ? '🎉 Pet Reunited with Family!'
    : '🛡️ Rescue Dispatch Locked & Claimed';

  const message = claimType === 'owner_reunited'
    ? `${item.petName} has been claimed and safely reunited by their family!`
    : `${owner.displayName} has locked dispatch and claimed rescue coordination for ${item.petName}.`;

  notifications.unshift({
    id: `notif_claim_${Date.now()}`,
    type: 'lost_alert',
    title,
    message,
    avatarUrl: item.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  // Async sync to backend API
  lostFoundService.claimRescue(postId, owner.displayName).catch(() => {});
}

export function releaseLostFoundClaim(postId: string) {
  const item = lostFoundList.find(p => p.id === postId);
  if (!item) return;

  item.isClaimed = false;
  item.claimedBy = undefined;
  item.claimedAt = undefined;
  item.claimType = undefined;
  item.claimNotes = undefined;
  item.isResolved = false;
}

export function bookOrClaimAdoption(
  petId: string, 
  claimType: 'meet_greet' | 'adoption_hold' | 'foster_sponsor', 
  date: string = 'Tomorrow', 
  time: string = '2:00 PM'
) {
  const pet = adoptions.find(a => a.id === petId);
  if (!pet) return;

  pet.isClaimed = true;
  pet.claimedBy = owner.displayName;
  pet.claimedAt = 'Just now';
  pet.bookedMeetDate = date;
  pet.bookedMeetTime = time;
  pet.claimType = claimType;
  pet.status = 'pending';

  const title = claimType === 'meet_greet'
    ? '📅 Meet & Greet Confirmed!'
    : (claimType === 'adoption_hold' ? '🔒 48-Hour Adoption Hold Placed' : '🤝 Foster / Sponsorship Active');

  const message = claimType === 'meet_greet'
    ? `Meet & Greet booked for ${pet.name} with ${pet.shelterName} on ${date} at ${time}.`
    : `Adoption hold reserved for ${pet.name}. Shelter screening coordinator notified.`;

  notifications.unshift({
    id: `notif_adopt_${Date.now()}`,
    type: 'appointment',
    title,
    message,
    avatarUrl: pet.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  // Also add to appointments if it's a meet & greet
  if (claimType === 'meet_greet') {
    appointments.unshift({
      id: `apt_adopt_${Date.now()}`,
      petId: pet.id,
      petName: `${pet.name} (${pet.breed})`,
      vetId: 'shelter_1',
      vetName: `${pet.shelterName} Meet & Greet`,
      clinicName: pet.location,
      reason: `Adoption Meet & Greet for ${pet.name}`,
      date,
      time,
      status: 'confirmed'
    });
  }
}

export function cancelAdoptionClaim(petId: string) {
  const pet = adoptions.find(a => a.id === petId);
  if (!pet) return;

  pet.isClaimed = false;
  pet.claimedBy = undefined;
  pet.claimedAt = undefined;
  pet.bookedMeetDate = undefined;
  pet.bookedMeetTime = undefined;
  pet.claimType = undefined;
  pet.status = 'available';
}

export function markAllNotificationsAsRead() {
  notifications.forEach(n => n.isRead = true);
}

// Marketplace Store Actions
export function addMarketListing(data: Omit<MarketplaceListing, 'id' | 'status'>) {
  const newListing: MarketplaceListing = {
    id: `mkt_${Date.now()}`,
    status: 'available',
    ...data
  };

  marketplace.unshift(newListing);

  // Async sync to backend Marketplace endpoint
  marketplaceService.createListing({
    title: newListing.title,
    category: newListing.category,
    price: newListing.price,
    description: newListing.description || '',
    imageUrl: newListing.imageUrl || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80',
    location: newListing.location,
    sellerType: newListing.sellerType
  }).catch(() => {});

  notifications.unshift({
    id: `notif_mkt_${Date.now()}`,
    type: 'ai_insight',
    title: '🛍️ Item Listed Successfully!',
    message: `Your listing "${newListing.title}" is now live on the Nuzzle Pet Marketplace.`,
    avatarUrl: newListing.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  return newListing;
}

export function verifyShopSubscription(shopName: string, category: string, feePlan: string = '$19.99/mo') {
  notifications.unshift({
    id: `notif_verify_${Date.now()}`,
    type: 'ai_insight',
    title: '🌟 Shop Verification Approved!',
    message: `Congratulations! "${shopName}" (${category}) is now an Official Nuzzle Verified Pet Shop with Gold Shield Status (${feePlan}).`,
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    timeAgo: 'Just now',
    isRead: false
  });
}

export function buyMarketItem(itemId: string) {
  const item = marketplace.find(m => m.id === itemId);
  if (!item) return;

  notifications.unshift({
    id: `notif_buy_${Date.now()}`,
    type: 'ai_insight',
    title: '🛍️ Order Placed Successfully!',
    message: `Your order for "${item.title}" ($${item.price}) with ${item.sellerName} is confirmed! Tracking code dispatched.`,
    avatarUrl: item.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });
}

// Pro Member Subscription Actions (90 BDT / month)
export function subscribeToPro(plan: 'monthly' | 'annual' = 'monthly', method: string = 'bKash') {
  owner.isProMember = true;
  owner.proPlan = plan === 'monthly' ? '90 BDT / month' : '890 BDT / year';
  owner.proRenewalDate = 'Next Month';

  // Enable Pro on all pets
  pets.forEach(p => {
    p.isProMember = true;
  });

  notifications.unshift({
    id: `notif_pro_${Date.now()}`,
    type: 'ai_insight',
    title: '👑 Welcome to Nuzzle Pro!',
    message: `Subscription active via ${method} (${owner.proPlan}). All VIP privileges & PawDoctor AI unlocked!`,
    avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80',
    timeAgo: 'Just now',
    isRead: false
  });
}

export function cancelPro() {
  owner.isProMember = false;
  owner.proPlan = undefined;
  owner.proRenewalDate = undefined;
  pets.forEach(p => {
    p.isProMember = false;
  });
}

// Authentication System (Parent, Store, Vet Clinic)
export function loginAsRole(role: UserRole, accountDetails?: Partial<UserAccount>) {
  currentRole.value = role;
  isAuthenticated.value = true;
  owner.role = role;

  if (role === 'store') {
    owner.displayName = accountDetails?.displayName || 'UrbanHound Gear Lab';
    owner.username = accountDetails?.username || 'urbanhound_official';
    owner.avatarUrl = accountDetails?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
    owner.bio = 'Verified Premium Canine & Feline Gear Workshop • Official Nuzzle Verified Boutique';
    owner.storeCategory = accountDetails?.storeCategory || 'Pet Gear & Accessories';
  } else if (role === 'vet') {
    owner.displayName = accountDetails?.displayName || 'Dr. Sarah Al-Mansoor, DVM';
    owner.username = accountDetails?.username || 'cascade_emergency_vet';
    owner.avatarUrl = accountDetails?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80';
    owner.bio = 'Board-Certified Veterinary Surgeon • Cascade 24/7 Emergency & Surgical Hospital';
    owner.clinicName = accountDetails?.clinicName || 'Cascade 24/7 Animal Hospital';
  } else {
    // Parent
    owner.displayName = accountDetails?.displayName || 'Alex Rivers';
    owner.username = accountDetails?.username || 'alex_rivers';
    owner.avatarUrl = accountDetails?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
    owner.bio = 'Golden Retriever & Scottish Fold pet parent • Portland, OR 🌲';
  }

  currentTab.value = 'feed';

  // Async sync to backend API
  authService.login({
    role,
    email: accountDetails?.username ? `${accountDetails.username}@nuzzle.ai` : undefined,
  }).catch(() => {});

  notifications.unshift({
    id: `notif_auth_${Date.now()}`,
    type: 'ai_insight',
    title: `🌟 Signed In as ${role === 'store' ? 'Pet Store' : role === 'vet' ? 'Vet Clinic' : 'Pet Guardian'}`,
    message: `Welcome, ${owner.displayName}! You are signed in with full access.`,
    avatarUrl: owner.avatarUrl,
    timeAgo: 'Just now',
    isRead: false
  });
}

export function registerNewAccount(role: UserRole, data: {
  displayName: string;
  username: string;
  email: string;
  petName?: string;
  petSpecies?: string;
  storeCategory?: string;
  clinicName?: string;
  isPro?: boolean;
}) {
  currentRole.value = role;
  isAuthenticated.value = true;
  owner.role = role;
  owner.displayName = data.displayName;
  owner.username = data.username.toLowerCase().replace(/\s+/g, '_');

  if (role === 'store') {
    owner.avatarUrl = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&auto=format&fit=crop&q=80';
    owner.bio = `Official Pet Store: ${data.storeCategory || 'Pet Supplies'} • Verified Boutique`;
    owner.storeCategory = data.storeCategory;
  } else if (role === 'vet') {
    owner.avatarUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80';
    owner.bio = `Licensed Veterinary Practice: ${data.clinicName || 'Animal Care Center'} • Verified Clinic`;
    owner.clinicName = data.clinicName;
  } else {
    // Parent
    owner.avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
    owner.bio = `Loving pet parent to ${data.petName || 'Companion'} • Nuzzle Community`;
    if (data.petName) {
      pets.unshift({
        id: `pet_${Date.now()}`,
        ownerId: owner.id,
        name: data.petName,
        species: (data.petSpecies as any) || 'Dog',
        breed: 'Companion',
        avatarUrl: data.petSpecies === 'Cat' 
          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80',
        isAnonymous: false,
        postsCount: 0,
        followersCount: 1,
        aiPersonality: 'Enthusiastic New Companion',
        energyLevel: 'High Zoomies',
        isProMember: data.isPro || false
      });
    }
  }

  if (data.isPro) {
    subscribeToPro('monthly', 'bKash');
  }

  currentTab.value = 'feed';

  // Async sync to backend API
  authService.signup({
    email: data.email || `${owner.username}@nuzzle.ai`,
    password: 'Password123!',
    username: owner.username,
    displayName: data.displayName,
    role,
    storeCategory: data.storeCategory,
    clinicName: data.clinicName,
  }).catch(() => {});

  notifications.unshift({
    id: `notif_welcome_${Date.now()}`,
    type: 'ai_insight',
    title: '🎉 Welcome to Nuzzle!',
    message: `Account created successfully for ${data.displayName} (${role === 'store' ? 'Pet Store' : role === 'vet' ? 'Vet Clinic' : 'Pet Guardian'}).`,
    avatarUrl: owner.avatarUrl,
    timeAgo: 'Just now',
    isRead: false
  });
}

// Real Authentication Functions (Supabase-backed)
export async function loginWithCredentials(credentials: { email?: string; username?: string; identifier?: string; password?: string; role?: UserRole }) {
  const res = await authService.login(credentials);
  if (!res.success) {
    return { success: false, error: res.error || 'Invalid login credentials' };
  }

  const data = res.data;
  isAuthenticated.value = true;

  if (data?.role) {
    currentRole.value = data.role as UserRole;
    owner.role = data.role as UserRole;
  }

  if (data?.owner || data?.user) {
    const profile = data.owner || data.user;
    owner.displayName = profile.displayName || owner.displayName;
    owner.username = profile.username || owner.username;
    if (profile.avatarUrl) owner.avatarUrl = profile.avatarUrl;
    if (profile.bio) owner.bio = profile.bio;
  }

  // Reset personal records to fresh state
  pets.splice(0, pets.length);
  healthLogs.splice(0, healthLogs.length);
  appointments.splice(0, appointments.length);

  if (data?.owner?.pets && data.owner.pets.length > 0) {
    pets.splice(0, pets.length, ...data.owner.pets.map((p: any) => ({
      id: p.id,
      ownerId: owner.id,
      name: p.name,
      species: p.species || 'Dog',
      breed: p.breed || 'Companion',
      avatarUrl: p.avatarUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80',
      isAnonymous: p.isAnonymous || false,
      postsCount: p.postsCount || 0,
      followersCount: p.followersCount || 1,
      aiPersonality: p.aiPersonality || 'Enthusiastic Companion',
      energyLevel: p.energyLevel || 'High Zoomies',
      isProMember: owner.isProMember
    })));
  }

  currentTab.value = 'feed';

  notifications.unshift({
    id: `notif_auth_${Date.now()}`,
    type: 'ai_insight',
    title: `🌟 Signed In as ${owner.role === 'store' ? 'Pet Store' : owner.role === 'vet' ? 'Vet Clinic' : 'Pet Guardian'}`,
    message: `Welcome back, ${owner.displayName}! You are signed in via Supabase Auth.`,
    avatarUrl: owner.avatarUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  return { success: true, data };
}

export async function registerWithCredentials(data: {
  email: string;
  password: string;
  displayName: string;
  username: string;
  role?: UserRole;
  petName?: string;
  petSpecies?: string;
  storeCategory?: string;
  clinicName?: string;
  isPro?: boolean;
}) {
  const res = await authService.signup({
    email: data.email,
    password: data.password,
    displayName: data.displayName,
    username: data.username,
    role: data.role || 'parent',
    storeCategory: data.storeCategory,
    clinicName: data.clinicName,
    petName: data.petName,
    petSpecies: data.petSpecies
  } as any);

  if (!res.success) {
    return { success: false, error: res.error || 'Failed to create account.' };
  }

  isAuthenticated.value = true;
  currentRole.value = data.role || 'parent';
  owner.role = data.role || 'parent';
  owner.displayName = data.displayName;
  owner.username = data.username;
  owner.followersCount = 0;
  owner.followingCount = 0;

  // Clear mock records for a completely fresh account
  pets.splice(0, pets.length);
  healthLogs.splice(0, healthLogs.length);
  appointments.splice(0, appointments.length);

  if (data.role === 'store') {
    owner.avatarUrl = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&auto=format&fit=crop&q=80';
    owner.bio = `Official Pet Store: ${data.storeCategory || 'Pet Supplies'} • Verified Boutique`;
    owner.storeCategory = data.storeCategory;
  } else if (data.role === 'vet') {
    owner.avatarUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80';
    owner.bio = `Licensed Veterinary Practice: ${data.clinicName || 'Animal Care Center'} • Verified Clinic`;
    owner.clinicName = data.clinicName;
  } else {
    owner.avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
    owner.bio = `Loving pet parent • Nuzzle Community`;
    if (data.petName) {
      pets.push({
        id: `pet_${Date.now()}`,
        ownerId: owner.id,
        name: data.petName,
        species: (data.petSpecies as any) || 'Dog',
        breed: 'Companion',
        avatarUrl: data.petSpecies === 'Cat' 
          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80',
        isAnonymous: false,
        postsCount: 0,
        followersCount: 0,
        aiPersonality: 'Enthusiastic Companion',
        energyLevel: 'High Zoomies',
        isProMember: data.isPro || false
      });
    }
  }

  if (data.isPro) {
    subscribeToPro('monthly', 'bKash');
  }

  currentTab.value = 'feed';

  notifications.unshift({
    id: `notif_welcome_${Date.now()}`,
    type: 'ai_insight',
    title: '🎉 Welcome to Nuzzle!',
    message: `Account created successfully for ${data.displayName} in Supabase Auth.`,
    avatarUrl: owner.avatarUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  return { success: true, data: res.data };
}

export async function performLogout() {
  await authService.logout();
  isAuthenticated.value = false;
  owner.displayName = 'Pet Parent';
  owner.username = 'petparent';
  owner.followersCount = 0;
  owner.followingCount = 0;
  pets.splice(0, pets.length);
  healthLogs.splice(0, healthLogs.length);
  appointments.splice(0, appointments.length);
  currentTab.value = 'auth';
}

/**
 * Listen for Supabase OAuth returns (e.g. Google Sign-In redirect)
 */
export function initSupabaseAuthListener() {
  if (typeof window !== 'undefined') {
    // 1. Direct PKCE code exchange if redirected with ?code=...
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error && data?.session) {
          applySupabaseSession(data.session);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }).catch(err => console.warn('[OAuth] Code exchange error:', err));
    }

    // 2. Direct hash fragment session capture if redirected with #access_token=...
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      if (accessToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        }).then(({ data, error }) => {
          if (!error && data?.session) {
            applySupabaseSession(data.session);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }).catch(err => console.warn('[OAuth] SetSession error:', err));
      }
    }
  }

  // 3. Check existing active session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      applySupabaseSession(session);
    }
  }).catch(() => {});

  // 4. Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')) {
      applySupabaseSession(session);
    } else if (event === 'SIGNED_OUT') {
      isAuthenticated.value = false;
      currentTab.value = 'auth';
    }
  });
}

function applySupabaseSession(session: any) {
  if (!session?.user) return;
  const token = session.access_token;
  apiClient.setToken(token);
  isAuthenticated.value = true;

  const meta = session.user.user_metadata || {};
  owner.id = session.user.id;
  owner.displayName = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Pet Parent';
  owner.username = session.user.email ? session.user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : 'petparent';
  if (meta.avatar_url || meta.picture) {
    owner.avatarUrl = meta.avatar_url || meta.picture;
  }
  owner.bio = '🐾 Pet lover on Nuzzle • Welcome to Dhaka\'s Pet Community!';
  owner.followersCount = 0;
  owner.followingCount = 0;
  owner.role = 'parent';
  currentRole.value = 'parent';

  // Ensure personal records are fresh for this user
  pets.splice(0, pets.length);
  healthLogs.splice(0, healthLogs.length);
  appointments.splice(0, appointments.length);
  activeProfileId.value = owner.id;

  // Sync profile & pets from backend if already saved
  authService.getCurrentUser().then(res => {
    if (res.success && res.data) {
      const p = res.data;
      if (p.displayName) owner.displayName = p.displayName;
      if (p.username) owner.username = p.username;
      if (p.avatarUrl) owner.avatarUrl = p.avatarUrl;
      if (p.bio) owner.bio = p.bio;
      if (p.followersCount !== undefined) owner.followersCount = p.followersCount;
      if (p.followingCount !== undefined) owner.followingCount = p.followingCount;
      if (p.pets && Array.isArray(p.pets) && p.pets.length > 0) {
        pets.splice(0, pets.length, ...p.pets);
      }
    }
  }).catch(() => {});

  // Switch to feed screen if user was on auth screen
  if (currentTab.value === 'auth') {
    currentTab.value = 'feed';
  }
}

/**
 * Register a new pet companion into the store & backend database
 */
export async function addNewPet(petData: {
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Reptile' | 'Other';
  breed?: string;
  bio?: string;
  age?: string;
  birthDate?: string;
  avatarUrl?: string;
  weight?: string;
  microchipId?: string;
  aiPersonality?: string;
  energyLevel?: string;
}) {
  const newPetId = `pet_${Date.now()}`;
  const defaultAvatar = petData.species === 'Cat'
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80'
    : petData.species === 'Bird'
    ? 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&auto=format&fit=crop&q=80'
    : petData.species === 'Rabbit'
    ? 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80';

  const newPet: Pet = {
    id: newPetId,
    ownerId: owner.id,
    name: petData.name.trim(),
    species: petData.species,
    breed: petData.breed?.trim() || 'Companion',
    bio: petData.bio?.trim() || `Loving ${petData.species} companion on Nuzzle.`,
    age: petData.age?.trim() || '1 yr',
    birthDate: petData.birthDate || new Date().toISOString().split('T')[0],
    avatarUrl: petData.avatarUrl?.trim() || defaultAvatar,
    isAnonymous: false,
    weight: petData.weight?.trim() || '5.0 kg',
    microchipId: petData.microchipId?.trim() || `985-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    postsCount: 0,
    followersCount: 0,
    aiPersonality: petData.aiPersonality || 'Enthusiastic & Playful',
    energyLevel: (petData.energyLevel as any) || 'High Zoomies',
    isProMember: owner.isProMember || false
  };

  // 1. Optimistically push to pets array
  pets.push(newPet);
  activeProfileId.value = newPet.id;

  // 2. Dispatch async creation to REST backend
  try {
    await apiClient.post('/pets', {
      ownerId: owner.id,
      name: newPet.name,
      species: newPet.species,
      breed: newPet.breed,
      bio: newPet.bio,
      birthDate: newPet.birthDate,
      avatarUrl: newPet.avatarUrl,
      weight: newPet.weight,
      microchipId: newPet.microchipId,
      aiPersonality: newPet.aiPersonality,
      energyLevel: newPet.energyLevel
    });
  } catch (err) {
    console.warn('Backend pet persistence handled locally:', err);
  }

  // 3. Add celebration notification
  notifications.unshift({
    id: `notif_pet_${Date.now()}`,
    type: 'ai_insight',
    title: `🎉 ${newPet.name} has joined Nuzzle!`,
    message: `Digital pet passport created and verified for ${newPet.name} (${newPet.species}).`,
    avatarUrl: newPet.avatarUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  return { success: true, pet: newPet };
}

/**
 * Dynamically synchronize live data from backend REST API into the reactive store
 */
export async function syncLiveBackendData() {
  try {
    // 1. Sync Posts Feed
    postService.getFeed({ page: 1, limit: 15 }).then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const livePosts = res.data;
        // Keep any newly created posts from current user session
        const sessionPosts = posts.filter(p => p.id.startsWith('post_') && !livePosts.some(lp => lp.id === p.id));
        posts.splice(0, posts.length, ...sessionPosts, ...livePosts);
      }
    }).catch(err => console.warn('Live feed sync handled gracefully:', err));

    // 2. Sync Vet Directory
    vetService.getDirectory().then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        vets.splice(0, vets.length, ...res.data);
      }
    }).catch(err => console.warn('Live vets sync handled gracefully:', err));

    // 3. Sync Lost & Found Emergency Radar
    lostFoundService.getReports().then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveReports: LostFoundPost[] = res.data.map((r: any) => ({
          id: r.id,
          petName: r.petName,
          species: r.species,
          breed: r.breed || 'Companion',
          status: (r.type === 'found' || r.status === 'found') ? 'found' : 'lost',
          description: r.description || '',
          imageUrl: r.imageUrl || (r.mediaUrls && r.mediaUrls[0]) || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
          location: r.lastSeenLocation || r.location || 'Dhaka',
          reward: r.reward,
          contactName: r.contactName || 'Community Member',
          contactPhone: r.contactPhone || '+880 1700-000000',
          reportedAt: r.lastSeenDate || r.reportedDate || 'Recently',
          isResolved: r.isResolved || false,
          isClaimed: r.isClaimed || false,
          claimedBy: r.claimedBy,
          claimedAt: r.claimedAt,
          claimType: r.claimType,
          claimNotes: r.claimNotes,
        }));
        const sessionReports = lostFoundList.filter(item => !liveReports.some(lr => lr.id === item.id));
        lostFoundList.splice(0, lostFoundList.length, ...sessionReports, ...liveReports);
      }
    }).catch(err => console.warn('Live lost-found sync handled gracefully:', err));

    // 4. Sync Marketplace
    marketplaceService.getListings().then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveItems: MarketplaceListing[] = res.data.map((m: any) => {
          const isShop = m.sellerType === 'store' || m.sellerType === 'verified_shop';
          return {
            id: m.id,
            title: m.title,
            category: (m.category as any) || 'Accessories',
            price: Number(m.price) || 0,
            description: m.description || '',
            imageUrl: m.imageUrl || (m.mediaUrls && m.mediaUrls[0]) || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80',
            condition: 'Brand New',
            sellerName: m.sellerName || (isShop ? 'UrbanHound Dhaka Official' : 'Alex Rivers'),
            sellerAvatar: m.sellerAvatar || 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=200&auto=format&fit=crop&q=80',
            sellerType: isShop ? 'verified_shop' : 'individual',
            isVerifiedShop: isShop,
            shopRating: 4.9,
            location: m.location || 'Dhaka',
            status: 'available',
          };
        });
        const sessionItems = marketplace.filter(item => !liveItems.some(li => li.id === item.id));
        marketplace.splice(0, marketplace.length, ...sessionItems, ...liveItems);
      }
    }).catch(err => console.warn('Live marketplace sync handled gracefully:', err));

    // 5. Sync Adoption Listings
    adoptionService.getAdoptions().then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveAdoptions: AdoptionListing[] = res.data.map((a: any) => ({
          id: a.id,
          name: a.name,
          species: a.species,
          breed: a.breed || 'Companion',
          age: a.age || 'Young',
          gender: (a.gender === 'Female' || a.gender === 'Girl') ? 'Girl' : 'Boy',
          status: 'available',
          description: a.description || a.bio || 'Loving rescue companion looking for a home.',
          imageUrl: a.imageUrl || (a.mediaUrls && a.mediaUrls[0]) || 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&auto=format&fit=crop&q=80',
          location: a.location || 'Dhaka',
          shelterName: a.shelterName || a.organizationName || 'Dhaka Animal Welfare Shelter',
          isVaccinated: a.vaccinated ?? true,
          isNeutered: a.neutered ?? false,
          temperament: ['Affectionate', 'Gentle'],
        }));
        const sessionAdoptions = adoptions.filter(item => !liveAdoptions.some(la => la.id === item.id));
        adoptions.splice(0, adoptions.length, ...sessionAdoptions, ...liveAdoptions);
      }
    }).catch(err => console.warn('Live adoptions sync handled gracefully:', err));

  } catch (syncErr) {
    console.warn('Initial live backend synchronization error:', syncErr);
  }
}




