"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function ProfilePage({
  user,
  postCount,
}: {
  user: any;
  postCount: any;
}) {
  const memberSince = new Date(user?.createdAt).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
  console.log(user);
  return (
    <main className="bg-gray-100 min-h-screen p-2 font-sans">
      <div className="  bg-white border border-gray-300 shadow-sm">
        {/* Header Section */}
        <div className="bg-[#eeeeee] p-2 border-b border-gray-300 flex items-start gap-3">
          <Avatar className="border border-gray-300">
            <AvatarImage src={user?.image} alt="User Profile" />: (
            <AvatarFallback className="flex items-center justify-center bg-gray-100">
              <User className="h-6 w-6 text-gray-500" />
            </AvatarFallback>
            )
          </Avatar>

          <div>
            <h1 className="text-[18px] font-bold text-[#003366] leading-tight">
              {user?.name}
            </h1>
            <p className="text-[11px] text-gray-600">
              Member of{" "}
              <span className="text-blue-700 font-bold uppercase">
                BDBOYs.top
              </span>
            </p>
            <p className="text-[11px] text-gray-500">Total {postCount} Posts</p>
          </div>
        </div>

        {/* Tab Content Rendering */}
        <div className="min-h-[300px]">
          <div className="animate-in fade-in duration-300">
            <div className="text-[13px]">
              <ProfileRow label="Fullname" value={user?.name} />

              <ProfileRow label="Gender" value={user?.gender || "Not Set"} />
              <ProfileRow
                label="Location"
                value={user?.location || "Not Set"}
                isGray
              />
              <ProfileRow label="About" value={user?.bio} />
            </div>

            {/* Visual ID Card Section */}
            <div className="p-4 bg-white">
              <div className="w-[300px] border border-blue-400 rounded-lg overflow-hidden shadow-md font-mono">
                <div className="bg-[#7878ff] p-1.5 flex justify-between items-center text-white text-[12px] font-bold">
                  <span>BDBOYS.TOP</span>
                  <span>ID : {user?.id?.slice(-5).toUpperCase()}</span>
                </div>
                <div className="p-3 space-y-1 bg-white text-[11px] font-bold">
                  <p>Name : {user?.name}</p>
                  <p>Post : {postCount}</p>
                  <p>Member Since : {memberSince}</p>
                </div>
                <div className="bg-[#7878ff] py-1 text-center text-white text-[12px] font-bold tracking-widest">
                  MOBILE TUNES
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileRow({
  label,
  value,
  isGray = false,
  isBlue = false,
  underline = false,
}: any) {
  return (
    <div
      className={`flex border-b border-gray-200 ${isGray ? "bg-[#f9f9f9]" : "bg-white"}`}
    >
      <div className="w-32 p-2 text-gray-700 font-medium border-r border-gray-50">
        {label} :
      </div>
      <div
        className={`flex-1 p-2 ${isBlue ? "text-blue-800" : "text-black"} ${underline ? "underline" : ""}`}
      >
        {value || "N/A"}
      </div>
    </div>
  );
}
