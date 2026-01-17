"use client";

import {
  Calendar,
  Loader2,
  Mail,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User, UserRole, UserStatus } from "../dashboard/types";

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");

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
      toast.error("ব্যবহারকারী লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateRole = async (userId: number, role: UserRole) => {
    setProcessingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
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

  const onDelete = async (userId: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ব্যবহারকারীকে মুছতে চান?")) return;
    setProcessingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsers(users.filter((u) => u.id !== userId));
      toast.success("ব্যবহারকারী মুছে ফেলা হয়েছে");
    } catch (err) {
      toast.error("মুছে ফেলতে সমস্যা হয়েছে");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
        <p className="text-slate-500 font-bold animate-pulse text-lg">
          তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            processingId={processingId}
            onUpdateRole={onUpdateRole}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="flex flex-wrap gap-4 pt-4">
        <StatBadge
          label="মোট মেম্বার"
          count={filteredUsers.length}
          color="bg-slate-900"
        />
        <StatBadge
          label="সক্রিয়"
          count={filteredUsers.filter((u) => u.status === "active").length}
          color="bg-emerald-500"
        />
        <StatBadge
          label="সাসপেন্ডেড"
          count={filteredUsers.filter((u) => u.status === "suspended").length}
          color="bg-rose-500"
        />
      </div>
    </div>
  );
};

/* Sub-component for individual User Cards */
const UserCard = ({
  user,
  processingId,
  onUpdateRole,
  onUpdateStatus,
  onDelete,
}: any) => {
  const isUpdating = processingId === user.id;

  return (
    <div
      className={`group relative bg-white border border-slate-100 rounded-[32px] p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 ${
        isUpdating ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-[22px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-inner">
            {user.avatar ? (
              <img
                src={user.avatar}
                className="h-full w-full object-cover"
                alt=""
              />
            ) : (
              <span className="text-slate-400 font-black text-2xl">
                {user.name.charAt(0)}
              </span>
            )}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${
              user.status === "active" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
        </div>
        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors hover:bg-slate-50 rounded-xl">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="space-y-1">
        <h4 className="font-black text-slate-900 text-lg leading-tight group-hover:text-red-600 transition-colors">
          {user.name}
        </h4>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
          <Mail size={12} />
          {user.email}
        </div>
      </div>

      <div className="my-6 grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
          <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
            <ShieldCheck size={12} /> রোল সেট করুন
          </div>
          <select
            value={user.role}
            onChange={(e) => onUpdateRole(user.id, e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="admin">ADMIN</option>
            <option value="editor">EDITOR</option>
            <option value="author">AUTHOR</option>
            <option value="user">USER</option>
          </select>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
            মোট পোস্ট
          </p>
          <p className="text-sm font-black text-slate-900">{user.posts} টি</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 mb-6 px-1">
        <div className="flex items-center gap-1">
          <Calendar size={12} /> {user.joined}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() =>
            onUpdateStatus(
              user.id,
              user.status === "active" ? "suspended" : "active"
            )
          }
          className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            user.status === "active"
              ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
          }`}
        >
          {user.status === "active" ? (
            <>
              <UserX size={14} strokeWidth={3} /> সাসপেন্ড
            </>
          ) : (
            <>
              <UserCheck size={14} strokeWidth={3} /> সক্রিয়
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const StatBadge = ({ label, count, color }: any) => (
  <div className="flex items-center gap-3 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm">
    <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`} />
    <span className="text-sm font-bold text-slate-500">{label}:</span>
    <span className="text-sm font-black text-slate-900">{count}</span>
  </div>
);

export default ManageUsers;
