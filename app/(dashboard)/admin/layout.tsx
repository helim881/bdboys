"use client";

import { useState } from "react";
import MobileHeader from "./dashboard/components/mobile-header";
import Sidebar from "./dashboard/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0">
        <Sidebar />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-72">
        <MobileHeader
          show={isMobileOpen}
          onToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          {/* Page Background Wrapper */}
          <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
