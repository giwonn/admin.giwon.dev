// API 공통 응답 포맷
export interface ApiResponse<T> {
  data: T;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  hidden: boolean;
  password: string | null;
  published: boolean;
  scheduled: boolean;
  passwordProtected: boolean;
  visibleOnBlog: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: {
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}