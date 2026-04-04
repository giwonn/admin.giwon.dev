'use server';

import { apiClient } from '@/lib/api';
import type { Article, PageResponse } from '@/types';

export async function getArticles(page: number = 0, size: number = 10): Promise<PageResponse<Article>> {
  return apiClient<PageResponse<Article>>(`/admin/articles?page=${page}&size=${size}`);
}

export async function getArticle(id: number): Promise<Article> {
  return apiClient<Article>(`/admin/articles/${id}`);
}

export async function createArticle(title: string, content: string): Promise<Article> {
  return apiClient<Article>('/admin/articles', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
}

export async function updateArticle(id: number, title: string, content: string): Promise<Article> {
  return apiClient<Article>(`/admin/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
}

export async function deleteArticle(id: number): Promise<void> {
  return apiClient<void>(`/admin/articles/${id}`, {
    method: 'DELETE',
  });
}
