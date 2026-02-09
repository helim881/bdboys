"use client";

import { updateUserAction } from "@/actions/action.register";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SingleUserPostsPage from "./[id]/posts";

export default function ProfilePage({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("About");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(
    user?.image || "/avatar-placeholder.png",
  );
  const router = useRouter();

  const memberSince = new Date(user?.createdAt).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.get("name"),

      gender: formData.get("gender"),
      location: formData.get("location"),
      about: formData.get("about"), // Bio/About ডাটা এড করা হয়েছে
      image: preview.startsWith("data:image") ? preview : user.image,
      password: password || undefined,
    };

    const result = await updateUserAction(payload, user.id);

    if (result.success) {
      setActiveTab("About");
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const totalPostsCount = (user?._count?.posts || 0) + (user?._count?.sms || 0);

  return (
    <main className="bg-gray-100 min-h-screen p-2 font-sans">
      <div className="bg-white border border-gray-300 shadow-sm">
        {/* Header Section */}
        <div className="bg-[#eeeeee] p-2 border-b border-gray-300 flex items-start gap-3">
          <div className="relative w-16 h-16 border border-gray-400 bg-white p-0.5">
            <Image
              src={preview}
              alt="Profile"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
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
            <p className="text-[11px] text-gray-500">
              Total {totalPostsCount} Posts
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#f9f9f9] border-b border-gray-300">
          {["About", "Edit Profile", "Posts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-[13px] border-r border-gray-300 transition-colors ${
                activeTab === tab
                  ? "bg-white font-bold text-black border-t-2 border-t-blue-600"
                  : "text-blue-800 hover:underline"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === "About" && (
            <div className="animate-in fade-in duration-300">
              <ProfileRow label="Fullname" value={user?.name} />
              <ProfileRow label="Email" value={user?.email} isBlue underline />
              <ProfileRow label="Rank" value={user?.role} isGray />
              <ProfileRow label="Gender" value={user?.gender} />
              <ProfileRow label="Location" value={user?.location} isGray />
              <ProfileRow label="About" value={user?.about} />

              {/* ID Card */}
              <div className="p-4">
                <div className="w-[280px] border border-blue-400 rounded-lg overflow-hidden shadow-md font-mono">
                  <div className="bg-[#7878ff] p-1.5 flex justify-between items-center text-white text-[10px] font-bold uppercase">
                    <span>BDBOYS.TOP</span>
                    <span>ID: {user?.id?.slice(-5).toUpperCase()}</span>
                  </div>
                  <div className="p-3 space-y-1 bg-white text-[11px] font-bold text-gray-700">
                    <p>Name: {user?.name}</p>
                    <p>Rank: {user?.role}</p>
                    <p>Location: {user?.location || "N/A"}</p>
                    <p>Joined: {memberSince}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Edit Profile" && (
            <div className="p-4 animate-in slide-in-from-left-2 duration-300">
              <h3 className="font-bold text-[#003366] border-b pb-1 mb-4 text-[13px] uppercase">
                Update Account Information
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1 font-bold uppercase text-[10px]">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={user?.name}
                      className="w-full border border-gray-300 p-1.5 text-[13px] outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 font-bold uppercase text-[10px]">
                      Gender
                    </label>
                    <select
                      name="gender"
                      defaultValue={user?.gender}
                      className="w-full border border-gray-300 p-1.5 text-[13px] outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Location & Role */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1 font-bold uppercase text-[10px]">
                      Location
                    </label>
                    <input
                      name="location"
                      type="text"
                      defaultValue={user?.location}
                      placeholder="City, Country"
                      className="w-full border border-gray-300 p-1.5 text-[13px] outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 font-bold uppercase text-[10px]">
                      Rank (Admin Only)
                    </label>
                    <select
                      name="role"
                      disabled={user?.role !== "ADMIN"}
                      defaultValue={user?.role}
                      className="w-full border border-gray-300 p-1.5 text-[13px] outline-none"
                    >
                      <option value="USER">USER</option>
                      <option value="CONTRIBUTOR">CONTRIBUTOR</option>
                      <option value="AUTHOR">AUTHOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>

                {/* About/Bio */}
                <div>
                  <label className="block text-gray-600 mb-1 font-bold uppercase text-[10px]">
                    About Me
                  </label>
                  <textarea
                    name="about"
                    defaultValue={user?.about}
                    rows={3}
                    placeholder="Write something about yourself..."
                    className="w-full border border-gray-300 p-1.5 text-[13px] outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Password Section */}
                <div className="bg-gray-50 p-3 border border-gray-200">
                  <h4 className="font-bold text-gray-700 text-[10px] mb-2 uppercase">
                    Security (Change Password)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="password"
                      type="password"
                      placeholder="New Password"
                      className="border border-gray-300 p-1.5 text-[13px] outline-none"
                    />
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm"
                      className="border border-gray-300 p-1.5 text-[13px] outline-none"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-gray-600 mb-1 font-bold uppercase text-[10px]">
                    Update Profile Photo
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="text-[11px] file:mr-2 file:py-1 file:px-2 file:border file:border-gray-300 file:bg-gray-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#003366] text-white px-6 py-2 rounded-sm text-[12px] font-bold hover:bg-blue-900 disabled:bg-gray-400"
                >
                  {loading ? "SAVING DATA..." : "UPDATE PROFILE"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "Posts" && <SingleUserPostsPage userId={user?.id} />}
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
      <div className="w-24 p-2 text-gray-500 font-bold text-[11px] uppercase border-r border-gray-100">
        {label}
      </div>
      <div
        className={`flex-1 p-2 text-[13px] ${isBlue ? "text-blue-700 font-bold" : "text-black"} ${underline ? "underline" : ""}`}
      >
        {value || "Not Set"}
      </div>
    </div>
  );
}
