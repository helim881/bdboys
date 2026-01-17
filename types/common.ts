// types/common.ts
export type UserRole = "USER" | "ADMIN" | "EDITOR" | "AUTHOR" | "USER";

export interface SearchParams {
  search?: string;
  serialNumber?: string;
  sortBy?: "rating" | "experience" | "fee" | "name";
  sortOrder?: "asc" | "desc";
  page?: string | number;
  limit?: string | number;
}
