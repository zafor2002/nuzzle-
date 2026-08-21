export type TabType = 'feed' | 'explore' | 'ai' | 'reels' | 'activity' | 'profile' | 'health' | 'vets' | 'adoption' | 'market' | 'lostfound' | 'messages' | 'settings';

export interface Owner {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  isAnonymous: boolean;
  isPrivate: boolean;
  notifyLikes: boolean;
  notifyComments: boolean;
  notifyFollows: boolean;
  followersCount: number;
  followingCount: number;
}

export interface VaccineCertificate {
  vaccine: string;
  dateAdministered: string;
  validUntil: string;
  batchNumber: string;
  vetClinic: string;
  vetSignature: string;
  status: 'valid' | 'due' | 'expired';
}

export interface OwnerLineage {
  primaryGuardian: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyPhone: string;
  primaryVetClinic: string;
  breederOrShelter?: string;
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
  passportNumber?: string;
  gender?: string;
  colorMarkings?: string;
  bloodType?: string;
  registrationAuthority?: string;
  ownerLineage?: OwnerLineage;
  vaccinationCertificates?: VaccineCertificate[];
  healthClearance?: {
    fitForTravel: boolean;
    rabiesTitreClear: boolean;
    lastDeworming: string;
    allergies: string[];
  };
  postsCount: number;
  followersCount: number;
  aiPersonality?: string;
  energyLevel?: 'Low & Chill' | 'Moderate' | 'High Zoomies';
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
  category: 'Food & Treats' | 'Toys' | 'Beds & Cages' | 'Grooming' | 'Apparel' | 'Health';
  price: number;
  description: string;
  imageUrl: string;
  condition: 'Brand New' | 'Like New' | 'Good Condition';
  sellerName: string;
  sellerAvatar: string;
  location: string;
  status: 'available' | 'sold';
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
}
