export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80';
export const DEFAULT_MEDIA = 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80';
export const DEFAULT_HUMAN_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

export function handleImgError(event: Event, fallbackType: 'avatar' | 'media' | 'human' = 'avatar') {
  const target = event.target as HTMLImageElement;
  if (!target) return;
  const fallback = fallbackType === 'media' ? DEFAULT_MEDIA : (fallbackType === 'human' ? DEFAULT_HUMAN_AVATAR : DEFAULT_AVATAR);
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
