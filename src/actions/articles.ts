'use server';

import { apiClient } from '@/lib/api';
import type { Article, ArticleStatus, PageResponse } from '@/types';

export async function getArticles(
  status?: ArticleStatus,
  page: number = 0,
  size: number = 10
): Promise<PageResponse<Article>> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  if (status) {
    params.set('status', status);
  }
  return apiClient<PageResponse<Article>>(`/admin/articles?${params.toString()}`);
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

export async function publishArticle(id: number): Promise<Article> {
  return apiClient<Article>(`/admin/articles/${id}/publish`, {
    method: 'PUT',
  });
}

export async function scheduleArticle(id: number, publishedAt: string): Promise<Article> {
  return apiClient<Article>(`/admin/articles/${id}/schedule`, {
    method: 'PUT',
    body: JSON.stringify({ publishedAt }),
  });
}
