// components/admin/ManageUsers.tsx

import {
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { User, UserRole, UserStatus } from "../types";

interface ManageUsersProps {
  users: User[];
  onUpdateRole: (userId: number, role: UserRole) => void;
  onUpdateStatus: (userId: number, status: UserStatus) => void;
  onDelete: (userId: number) => void;
}

const ManageUsers = ({
  users,
  onUpdateRole,
  onUpdateStatus,
  onDelete,
}: ManageUsersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "editor":
        return "bg-blue-100 text-blue-800";
      case "author":
        return "bg-indigo-100 text-indigo-800";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "সক্রিয়";
      case "pending":
        return "পেন্ডিং";
      case "suspended":
        return "সাসপেন্ডেড";
      default:
        return status;
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "এডমিন";
      case "editor":
        return "এডিটর";
      case "author":
        return "লেখক";
      case "user":
        return "ব্যবহারকারী";
      default:
        return role;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-gray-900">
          ব্যবহারকারী ম্যানেজমেন্ট
        </h3>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ব্যবহারকারী খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="all">সব রোল</option>
            <option value="admin">এডমিন</option>
            <option value="editor">এডিটর</option>
            <option value="author">লেখক</option>
            <option value="user">ব্যবহারকারী</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as UserStatus | "all")
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="all">সব স্ট্যাটাস</option>
            <option value="active">সক্রিয়</option>
            <option value="pending">পেন্ডিং</option>
            <option value="suspended">সাসপেন্ডেড</option>
          </select>

          <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-500 text-white font-medium rounded-lg hover:shadow-lg flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>নতুন ব্যবহারকারী</span>
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.avatar || user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">রোল</span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getRoleText(user.role)}
                  </span>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      onUpdateRole(user.id, e.target.value as UserRole)
                    }
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="admin">এডমিন</option>
                    <option value="editor">এডিটর</option>
                    <option value="author">লেখক</option>
                    <option value="user">ব্যবহারকারী</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">স্ট্যাটাস</span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {getStatusText(user.status)}
                  </span>
                  <select
                    value={user.status}
                    onChange={(e) =>
                      onUpdateStatus(user.id, e.target.value as UserStatus)
                    }
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="active">সক্রিয়</option>
                    <option value="pending">পেন্ডিং</option>
                    <option value="suspended">সাসপেন্ডেড</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">পোস্ট</span>
                <span className="font-medium">{user.posts}টি</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">যোগদান</span>
                <span className="text-sm">{user.joined}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() =>
                  onUpdateStatus(
                    user.id,
                    user.status === "active" ? "suspended" : "active"
                  )
                }
                className={`flex-1 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-1 ${
                  user.status === "active"
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                }`}
              >
                {user.status === "active" ? (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>সাসপেন্ড</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>সক্রিয় করুন</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onDelete(user.id)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>মুছুন</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              কোন ব্যবহারকারী পাওয়া যায়নি
            </h3>
            <p className="text-gray-600 mb-6">
              আপনার সার্চ ক্রাইটেরিয়ার সাথে মিলে এমন কোন ব্যবহারকারী পাওয়া
              যায়নি।
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
            >
              সব ব্যবহারকারী দেখুন
            </button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">মোট ব্যবহারকারী</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredUsers.length}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">সক্রিয়</p>
              <p className="text-2xl font-bold text-green-700">
                {filteredUsers.filter((u) => u.status === "active").length}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600">পেন্ডিং</p>
              <p className="text-2xl font-bold text-yellow-700">
                {filteredUsers.filter((u) => u.status === "pending").length}
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600">সাসপেন্ডেড</p>
              <p className="text-2xl font-bold text-red-700">
                {filteredUsers.filter((u) => u.status === "suspended").length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
