import {
  FilePlus,
  Home,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";

export const menuItems = [
  {
    href: "/",
    label: "হোম",
    icon: Home,
  },
  {
    href: "/admin/dashboard",
    label: "ড্যাশবোর্ড",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/category",
    label: "ক্যাটেগরি",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/subcategory",
    label: "সাব-ক্যাটেগরি",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/posts",
    label: "পোস্ট পরিচালনা", // 'ম্যানেজমেন্ট' can be 'পরিচালনা' for better Bangla
    icon: LayoutDashboard,
  },
  {
    href: "/admin/posts/create",
    label: "নতুন পোস্ট", // Simplified 'নতুন পোস্ট তৈরি' to 'নতুন পোস্ট'
    icon: FilePlus,
  },
  {
    href: "/admin/users",
    label: "ব্যবহারকারী",
    icon: Users,
  },
  {
    href: "/admin/sms",
    label: "এসএমএস",
    icon: MessageCircle,
  },
  {
    href: "/admin/settings",
    label: "সেটিংস",
    icon: Settings,
  },
];
