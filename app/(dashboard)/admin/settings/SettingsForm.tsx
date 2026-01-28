"use client";

import { useState } from "react";

import { updateSettingsAction } from "@/actions/actions.setting";
import { Globe, Image as ImageIcon, Save, Search } from "lucide-react";

export default function AdminSettings({
  settings,
}: {
  settings: {
    siteLogo: string | null;
    siteName: string | null;
    description: string | null;
    keywords: string | null;
    facebookUrl: string | null;
  };
}) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(settings?.siteLogo || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("currentLogo", settings?.siteLogo || "");

    const res = await updateSettingsAction(formData);
    if (res.success) alert("Settings updated!");
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Global Settings</h1>
        <p className="text-sm text-gray-500">
          Manage site-wide identity and SEO configuration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding Section */}
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="p-4 border-b bg-gray-50 flex items-center gap-2 font-semibold">
            <Globe size={18} /> Branding & Identity
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Site Name
                </label>
                <input
                  name="siteName"
                  defaultValue={settings?.siteName || "bdboys"}
                  className="w-full border p-2 rounded outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Facebook URL
                </label>
                <input
                  name="facebookUrl"
                  defaultValue={settings?.facebookUrl || ""}
                  className="w-full border p-2 rounded outline-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 bg-gray-50">
              {preview ? (
                <img
                  src={preview}
                  alt="Logo"
                  className="h-16 mb-2 object-contain"
                />
              ) : (
                <ImageIcon size={40} className="text-gray-300 mb-2" />
              )}
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={(e) =>
                  setPreview(URL.createObjectURL(e.target.files![0]))
                }
                className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
              />
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="p-4 border-b bg-gray-50 flex items-center gap-2 font-semibold">
            <Search size={18} /> SEO Configuration
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={settings?.description || ""}
                className="w-full border p-2 rounded outline-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Keywords (Comma separated)
              </label>
              <input
                name="keywords"
                defaultValue={settings?.keywords || ""}
                className="w-full border p-2 rounded outline-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save size={18} /> {loading ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
}
