"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, updateProfile, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { LogOut, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);

      // Fetch username from Firestore if exists
      const userDoc = await getDoc(doc(db, "users", u.uid));
      setUsername(userDoc.exists() ? userDoc.data()?.username || "" : "");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleUpdateUsername = async () => {
    if (!user) return;
    if (!username.trim()) return alert("Username cannot be empty.");

    // Update Firestore
    await setDoc(
      doc(db, "users", user.uid),
      { username },
      { merge: true }
    );

    // Update Firebase Auth displayName
    await updateProfile(user, { displayName: username });

    alert("✅ Username updated successfully!");
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-gray-800 font-medium">{user?.email}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">UID</p>
          <p className="text-gray-800 font-medium">{user?.uid}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">Username</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 flex-1"
              placeholder="Enter your username"
            />
            <button
              onClick={handleUpdateUsername}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <Edit3 size={16} /> Save
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex justify-center items-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
