export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  AUTHOR = "AUTHOR",
  CONTRIBUTOR = "CONTRIBUTOR",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
  BANNED = "BANNED",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PUBLISHED = "PUBLISHED",
  SCHEDULED = "SCHEDULED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}

export enum CategoryType {
  POST = "POST",
  SMS = "SMS",
}
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | string | null;
  password?: string | null;
  image: string | null;
  bio: string | null;
  role: UserRole;
  status: UserStatus;
  phone: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  description: string | null;
  type: CategoryType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Post {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  content: string;
  contentHtml: string;
  image: string | null;
  categoryId: string;
  subCategoryId: string | null;
  authorId: string;
  status: PostStatus;
  views: number;
  likeCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  scheduledAt: Date | string | null;
} /** Use this for your PostCard and Post Client components */
export interface PostWithRelations extends Omit<
  Post,
  "category" | "subCategory" | "author"
> {
  category: Category;
  subCategory: SubCategory | null;
  author: Pick<User, "id" | "name" | "image" | "role">;
}
/** Use this for the Category selection logic in MovedForm */
export interface CategoryWithSubCategories extends Category {
  subCategories: SubCategory[];
  _count?: {
    posts: number;
    sms: number;
  };
}

/** Use this for SMS specific views */
export interface SmsWithRelations {
  id: string;
  title: string | null;
  slug: string;
  content: string;
  category: Category;
  subCategory: SubCategory | null;
  author: Partial<User>;
  status: PostStatus;
  views: number;
  likeCount: number;
  disLikeCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
} // For the submission payload
export interface MovePostPayload {
  postId: string;
  categoryId: string;
  subCategoryId: string | null;
}

// For API Response standard
export interface ActionResponse {
  success: boolean;
  message: string;
  error?: string;
}
