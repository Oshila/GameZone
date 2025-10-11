"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X, Trophy, Calendar, Wallet, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white w-64 p-5 space-y-6 ${open ? "block" : "hidden"} md:block`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">🎮 GameZone</h2>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 space-y-2">
          <Link href="/user/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <Calendar size={18} /> <span>Upcoming Events</span>
          </Link>
          <Link href="/user/dashboard/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <Trophy size={18} /> <span>My Registrations</span>
          </Link>
          <Link href="/user/dashboard/marketplace" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <Wallet size={18} /> <span>Marketplace</span>
          </Link>
          <Link href="/user/dashboard/profile" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <User size={18} /> <span>Profile</span>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-10 p-2 w-full rounded bg-red-600 hover:bg-red-700 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white shadow p-4 md:hidden">
          <button onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="font-semibold text-lg">Game ZONE</h1>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
