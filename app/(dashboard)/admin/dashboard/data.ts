// data/adminData.ts

import { CategoryStats, DashboardStats, Post, User } from "./types";

export const initialUsers: User[] = [
  {
    id: 1,
    name: "আহমেদ রেজা",
    email: "ahmed@example.com",
    role: "admin",
    status: "active",
    posts: 24,
    joined: "২০২৩-০১-১৫",
    avatar: "AR",
  },
  {
    id: 2,
    name: "ফারহানা ইসলাম",
    email: "farhana@example.com",
    role: "editor",
    status: "active",
    posts: 18,
    joined: "২০২৩-০২-২০",
    avatar: "FI",
  },
  {
    id: 3,
    name: "রাকিবুল হাসান",
    email: "rakib@example.com",
    role: "author",
    status: "pending",
    posts: 8,
    joined: "২০২৩-০৩-১০",
    avatar: "RH",
  },
  {
    id: 4,
    name: "নুসরাত জাহান",
    email: "nusrat@example.com",
    role: "author",
    status: "active",
    posts: 12,
    joined: "২০২৩-০৪-০৫",
    avatar: "NJ",
  },
  {
    id: 5,
    name: "তানভীর আহমেদ",
    email: "tanvir@example.com",
    role: "author",
    status: "suspended",
    posts: 6,
    joined: "২০২৩-০৫-১২",
    avatar: "TA",
  },
];

export const initialPosts: Post[] = [
  {
    id: 1,
    title: "আর্টিফিশিয়াল ইন্টেলিজেন্স: ভবিষ্যতের প্রযুক্তি",
    category: "প্রযুক্তি",
    subCategory: "আর্টিফিশিয়াল ইন্টেলিজেন্স",
    author: "আহমেদ রেজা",
    status: "published",
    views: 3245,
    likes: 245,
    comments: 89,
    date: "২০২৪-০১-২৫",
    readTime: "৫ মিনিট",
    excerpt: "কৃত্রিম বুদ্ধিমত্তা কীভাবে আমাদের জীবনকে বদলে দিচ্ছে...",
    tags: ["এআই", "প্রযুক্তি", "ভবিষ্যৎ"],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
  },
  // ... more posts
];

export const categoryStats: CategoryStats[] = [
  {
    id: 1,
    name: "ইসলামের কথা",
    color: "bg-emerald-500",
    posts: 42,
    published: 38,
    pending: 3,
    draft: 1,
  },
  {
    id: 2,
    name: "প্রাত্যহিক আয়োজন",
    color: "bg-amber-500",
    posts: 28,
    published: 25,
    pending: 2,
    draft: 1,
  },
  {
    id: 3,
    name: "বিনোদন",
    color: "bg-purple-500",
    posts: 156,
    published: 142,
    pending: 8,
    draft: 6,
  },
  {
    id: 4,
    name: "খেলাধুলা",
    color: "bg-blue-500",
    posts: 89,
    published: 82,
    pending: 4,
    draft: 3,
  },
  {
    id: 5,
    name: "প্রযুক্তি",
    color: "bg-indigo-500",
    posts: 67,
    published: 60,
    pending: 5,
    draft: 2,
  },
];

export const initialStats: DashboardStats = {
  totalPosts: 382,
  totalUsers: 156,
  totalViews: 245678,
  totalComments: 5678,
};

export const subCategories = {
  প্রযুক্তি: [
    { id: 1, name: "স্মার্টফোন ও গ্যাজেট", count: 18 },
    { id: 2, name: "সফটওয়্যার ও অ্যাপ", count: 22 },
    { id: 3, name: "আর্টিফিশিয়াল ইন্টেলিজেন্স", count: 15 },
    { id: 4, name: "টিপস অ্যান্ড ট্রিকস", count: 12 },
  ],
  "ইসলামের কথা": [
    { id: 1, name: "কুরআন ও তাফসীর", count: 15 },
    { id: 2, name: "হাদিস ও সুন্নাহ", count: 8 },
    { id: 3, name: "ইবাদত ও আমল", count: 12 },
    { id: 4, name: "আখলাক ও আদব", count: 7 },
  ],
  // ... other categories
};
