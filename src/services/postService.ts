import { apiClient } from './apiClient';
import type { Post, PetReactionType } from '../types';

export const postService = {
  async getFeed(params?: { tag?: string; species?: string; page?: number; limit?: number }) {
    return apiClient.get<Post[]>('/posts', params);
  },

  async createPost(postData: Partial<Post>) {
    return apiClient.post<Post>('/posts', postData);
  },

  async reactToPost(postId: string, reaction: PetReactionType) {
    return apiClient.post(`/posts/${postId}/react`, { reaction });
  },

  async addComment(postId: string, body: string, authorName?: string, isPet?: boolean) {
    return apiClient.post(`/posts/${postId}/comments`, {
      body,
      authorName,
      isPet,
    });
  },

  async toggleSave(postId: string) {
    return apiClient.post(`/posts/${postId}/save`);
  },
};
