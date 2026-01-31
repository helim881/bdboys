"use client";

import Breadcrumb from "@/components/breadcumb";
import {
  Edit,
  Loader2,
  Mail,
  Search,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { User } from "@/interface/type";
import { UserRole } from "@/types/common";
import { UserStatus } from "@prisma/client";
import { UserEditModal } from "./user-model";
// Ensure this path is correct

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  // State for the Update Modal
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("ব্যবহারকারী লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateRole = async (userId: number, role: string) => {
    setProcessingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: role as UserRole } : u,
        ),
      );
      toast.success("রোল আপডেট করা হয়েছে");
    } catch (err) {
      toast.error("রোল আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setProcessingId(null);
    }
  };

  const onUpdateStatus = async (userId: number, status: UserStatus) => {
    setProcessingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setUsers(users.map((u) => (u.id === userId ? { ...u, status } : u)));
      toast.success("স্ট্যাটাস আপডেট করা হয়েছে");
    } catch (err) {
      toast.error("স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-400 font-medium animate-pulse">
          তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 space-y-6">
      <header className="space-y-4">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                ব্যবহারকারী ব্যবস্থাপনা
              </h1>
              <p className="text-sm text-slate-500">
                মোট {filteredUsers.length} জন ব্যবহারকারী পাওয়া গেছে
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="নাম বা ইমেইল খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 outline-none"
            >
              <option value="all">সব রোল</option>
              <option value="admin">অ্যাডমিন</option>
              <option value="editor">এডিটর</option>
              <option value="user">ইউজার</option>
            </select>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-slate-400">
              কোন ব্যবহারকারী খুঁজে পাওয়া যায়নি
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-slate-50/50 ${
                  processingId === user.id
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          className="h-full w-full object-cover"
                          alt=""
                        />
                      ) : (
                        <span className="text-slate-400 font-bold text-xl">
                          {user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[17px] font-bold text-[#1a56a6] hover:text-blue-700 transition-colors cursor-pointer">
                        {user.name}
                      </h4>
                      <button
                        onClick={() => setEditUser(user)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-all"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </span>
                      <span className="hidden sm:block text-slate-300">|</span>
                      <span className="uppercase font-semibold tracking-wider text-[11px] px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                  <button
                    onClick={() =>
                      onUpdateStatus(
                        user.id,
                        user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                      )
                    }
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      user.status === "ACTIVE"
                        ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                    }`}
                  >
                    {user.status === "ACTIVE" ? (
                      <>
                        <UserX size={16} />{" "}
                        <span className="hidden sm:inline">সাসপেন্ড</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} />{" "}
                        <span className="hidden sm:inline">সক্রিয় করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logic for the Modal Component */}
      {editUser && (
        <UserEditModal
          user={editUser}
          isOpen={!!editUser}
          onClose={() => setEditUser(null)}
          onSuccess={(updatedUser) => {
            setUsers(
              users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
            );
          }}
        />
      )}
    </div>
  );
};

export default ManageUsers;
