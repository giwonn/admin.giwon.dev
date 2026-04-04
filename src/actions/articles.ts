'use server';

import { apiClient } from '@/lib/api';
import type { Article, PageResponse } from '@/types';

export async function getArticles(
  page: number = 0,
  size: number = 10
): Promise<PageResponse<Article>> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  return apiClient<PageResponse<Article>>(`/admin/articles?${params.toString()}`);
}

export async function getArticle(id: number): Promise<Article> {
  return apiClient<Article>(`/admin/articles/${id}`);
}

export async function createArticle(
  title: string,
  content: string,
  publishedAt?: string,
  hidden?: boolean,
  password?: string | null
): Promise<Article> {
  return apiClient<Article>('/admin/articles', {
    method: 'POST',
    body: JSON.stringify({ title, content, publishedAt, hidden, password }),
  });
}

export async function updateArticle(
  id: number,
  title: string,
  content: string,
  publishedAt?: string,
  hidden?: boolean,
  password?: string | null
): Promise<Article> {
  return apiClient<Article>(`/admin/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content, publishedAt, hidden, password }),
  });
}

export async function deleteArticle(id: number): Promise<void> {
  return apiClient<void>(`/admin/articles/${id}`, {
    method: 'DELETE',
  });
}
