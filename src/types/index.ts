// API 공통 응답 포맷
export interface ApiResponse<T> {
  data: T;
}

export type ArticleStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';

export interface Article {
  id: number;
  title: string;
  content: string;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}