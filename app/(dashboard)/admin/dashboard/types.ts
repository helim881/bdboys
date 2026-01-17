// types/admin.ts

export type UserRole = "admin" | "editor" | "author" | "user";
export type UserStatus = "active" | "pending" | "suspended";
export type PostStatus = "draft" | "pending" | "published";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  posts: number;
  joined: string;
  avatar?: string;
}

export interface Post {
  id: number;
  title: string;
  category: string;
  subCategory?: string;
  author: string;
  status: PostStatus;
  views: number;
  likes: number;
  comments: number;
  date: string;
  readTime?: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
}

export interface CategoryStats {
  id: number;
  name: string;
  color: string;
  posts: number;
  published: number;
  pending: number;
  draft: number;
}

export interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  totalComments: number;
}

export interface PostFormData {
  title: string;
  content: string;
  category: string;
  subCategory: string;
  tags: string[];
  featuredImage: string | null;
  status: PostStatus;
}

export type AdminTab =
  | "create-post"
  | "manage-posts"
  | "manage-users"
  | "category-stats"
  | "settings";
