"use client";

import { updateSettingsAction } from "@/actions/actions.setting";
import {
  CheckCircle2,
  Code2,
  Globe,
  Image as ImageIcon,
  Loader2,
  Mail,
  Search,
  Share2,
} from "lucide-react";
import { useState } from "react";

export default function AdminSettings({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(settings?.siteLogo || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await updateSettingsAction(formData);
      if (res.success) alert("Settings synchronized!");
    } catch (error) {
      alert("Error saving settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Management
          </h1>
          <p className="text-slate-500 text-sm">
            Configure your global site variables and SEO metadata.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Branding & Identity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Globe size={18} className="text-blue-500" /> Identity
              </h2>
              <p className="text-xs text-slate-500">
                Website name, URL, and branding assets.
              </p>
            </div>

            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Site Name
                  </label>
                  <input
                    name="siteName"
                    defaultValue={settings?.siteName}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Site URL
                  </label>
                  <input
                    name="siteUrl"
                    defaultValue={settings?.siteUrl}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Site Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-2.5 text-slate-400"
                    size={16}
                  />
                  <input
                    name="siteEmail"
                    type="email"
                    defaultValue={settings?.siteEmail}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">
                  Site Logo
                </label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <div className="h-16 w-16 bg-white rounded-lg border flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        className="object-contain"
                        alt="Logo"
                      />
                    ) : (
                      <ImageIcon className="text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      name="siteLogo"
                      accept="image/*"
                      onChange={(e) =>
                        setLogoPreview(URL.createObjectURL(e.target.files![0]))
                      }
                      className="text-xs file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">
                      Recommended: PNG or SVG with transparent background.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SEO Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
            <div className="space-y-1">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Search size={18} className="text-emerald-500" /> SEO & Meta
              </h2>
              <p className="text-xs text-slate-500">
                How your site appears in Google and search engines.
              </p>
            </div>

            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Meta Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={settings?.description}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Keywords
                </label>
                <input
                  name="keywords"
                  defaultValue={settings?.keywords}
                  placeholder="sms, bangla, status..."
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Code2 size={12} /> Google Verification Code
                </label>
                <input
                  name="googleMeta"
                  defaultValue={settings?.googleMeta}
                  placeholder="<meta name='google-site-verification' ... />"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Social & Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
            <div className="space-y-1">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Share2 size={18} className="text-indigo-500" /> Integrations
              </h2>
              <p className="text-xs text-slate-500">
                Connect tracking IDs and social platform profiles.
              </p>
            </div>

            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Facebook URL
                  </label>
                  <input
                    name="facebookUrl"
                    defaultValue={settings?.facebookUrl}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Analytics ID (GA4)
                  </label>
                  <input
                    name="analyticsId"
                    defaultValue={settings?.analyticsId}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase text-blue-600">
                    FB App ID
                  </label>
                  <input
                    name="fbAppId"
                    defaultValue={settings?.fbAppId}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase text-blue-600">
                    FB Admin ID
                  </label>
                  <input
                    name="fbAdminId"
                    defaultValue={settings?.fbAdminId}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Save Action */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-50">
            <div className="max-w-5xl mx-auto flex justify-end">
              <button
                disabled={loading}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-black transition-all active:scale-95 disabled:bg-slate-400"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                {loading ? "Saving..." : "Save All Settings"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
