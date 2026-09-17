export type TabType = 'feed' | 'explore' | 'ai' | 'reels' | 'activity' | 'profile' | 'health' | 'vets' | 'adoption' | 'market' | 'lostfound' | 'messages' | 'settings' | 'auth';

export type UserRole = 'parent' | 'store' | 'vet';

export interface UserAccount {
  id: string;
  role: UserRole;
  email: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  isVerified?: boolean;
  isProMember?: boolean;
  storeCategory?: string;
  storeAddress?: string;
  businessLicense?: string;
  clinicName?: string;
  doctorName?: string;
  medicalLicense?: string;
  specialties?: string[];
  phone?: string;
}

export interface Owner {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  role?: UserRole;
  isAnonymous: boolean;
  isPrivate: boolean;
  notifyLikes: boolean;
  notifyComments: boolean;
  notifyFollows: boolean;
  followersCount: number;
  followingCount: number;
  isProMember?: boolean;
  proPlan?: string;
  proRenewalDate?: string;
  storeCategory?: string;
  clinicName?: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Reptile' | 'Other';
  breed?: string;
  bio?: string;
  age?: string;
  birthDate?: string;
  avatarUrl: string;
  isAnonymous: boolean;
  weight?: string;
  microchipId?: string;
  postsCount: number;
  followersCount: number;
  aiPersonality?: string;
  energyLevel?: 'Low & Chill' | 'Moderate' | 'High Zoomies';
  isProMember?: boolean;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  isPet: boolean;
  body: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export type PetReactionType = 'paw' | 'nuzzle' | 'treat' | 'ball' | 'purr';

export interface PetReactionCount {
  paw: number;     // 🐾 Paw Five
  nuzzle: number;  // 💜 Nuzzle
  treat: number;   // 🦴 Treat
  ball: number;    // 🎾 Fetch
  purr: number;    // 😻 Purr
}

export interface Post {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  petId?: string;
  petName?: string;
  petBreed?: string;
  petAvatar?: string;
  isAnonymous: boolean;
  caption: string;
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  comments: PostComment[];
  hashtags: string[];
  location?: string;
  aiGeneratedBadge?: boolean;
  selectedReaction?: PetReactionType | null;
  reactions?: PetReactionCount;
  petMood?: string;
  petSoundBite?: string;
  petDialogue?: string;
}

export interface StorySegment {
  id: string;
  mediaUrl: string;
  caption?: string;
  durationMs: number;
}

export interface Story {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  petName?: string;
  petAvatar?: string;
  hasUnseen: boolean;
  segments: StorySegment[];
}

export interface Reel {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  petName?: string;
  caption: string;
  videoGradient: string;
  videoTitle: string;
  audioTrack: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
}

export interface HealthLog {
  id: string;
  petId: string;
  petName: string;
  type: 'vaccination' | 'vet_visit' | 'medication' | 'allergy' | 'surgery' | 'weight';
  title: string;
  notes?: string;
  date: string;
  reminderAt?: string;
  veterinarian?: string;
  aiAnalysis?: string;
}

export interface LostFoundPost {
  id: string;
  petName: string;
  species: string;
  breed?: string;
  status: 'lost' | 'found';
  description: string;
  imageUrl: string;
  location: string;
  reward?: string;
  contactName: string;
  contactPhone: string;
  reportedAt: string;
  isResolved: boolean;
  isClaimed?: boolean;
  claimedBy?: string;
  claimedAt?: string;
  claimType?: 'owner_reunited' | 'volunteer_rescue' | 'foster_care';
  claimNotes?: string;
}

export interface AdoptionListing {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: 'Boy' | 'Girl';
  status: 'available' | 'pending' | 'adopted';
  description: string;
  imageUrl: string;
  location: string;
  shelterName: string;
  fee?: string;
  temperament: string[];
  isVaccinated: boolean;
  isNeutered: boolean;
  isClaimed?: boolean;
  claimedBy?: string;
  claimedAt?: string;
  bookedMeetDate?: string;
  bookedMeetTime?: string;
  claimType?: 'meet_greet' | 'adoption_hold' | 'foster_sponsor';
}

export interface VetSlot {
  time: string;
  isBooked: boolean;
}

export interface Vet {
  id: string;
  name: string;
  clinicName: string;
  location: string;
  bio: string;
  avatarUrl: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  isProSubscriber?: boolean;
  proBadgeLabel?: string;
  distanceMiles?: number;
  acceptedSpecies?: string[];
  emergencyCare?: boolean;
  phone?: string;
  priceRange?: string;
  slots: { [date: string]: VetSlot[] };
}

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  vetId: string;
  vetName: string;
  clinicName: string;
  reason: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export interface MarketplaceListing {
  id: string;
  title: string;
  category: 'Food & Treats' | 'Toys' | 'Beds & Cages' | 'Grooming' | 'Apparel' | 'Health' | 'Accessories';
  price: number;
  description: string;
  imageUrl: string;
  condition: 'Brand New' | 'Like New' | 'Good Condition';
  sellerName: string;
  sellerAvatar: string;
  sellerType: 'verified_shop' | 'individual';
  isVerifiedShop: boolean;
  shopRating?: number;
  shopBadge?: string;
  location: string;
  status: 'available' | 'sold';
  stock?: number;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  isSelf: boolean;
  body: string;
  timestamp: string;
  isAi?: boolean;
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  petName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'lost_alert' | 'appointment' | 'ai_insight';
  title: string;
  message: string;
  avatarUrl: string;
  timeAgo: string;
  isRead: boolean;
  actionRoute?: string;
}

export interface AiScanResult {
  breedMatch: string;
  confidence: number;
  detectedMood: string;
  healthObservations: string[];
  nutritionAdvice: string;
  funFact: string;
  provider?: string;
}
