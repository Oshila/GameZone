"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { LogOut, CheckCircle, Calendar, Users, Clock, Trophy, Medal, TrendingUp, Star } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  price: number;
  slots: number;
  registeredCount: number;
};

type PaymentRequest = {
  id: string;
  eventId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp | null;
};

type UserRegistration = {
  id: string;
  eventId: string;
  slot: number;
  teamName?: string;
  position?: number;
  registeredAt: Timestamp | null;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<Record<string, boolean>>({});
  const [paymentRequests, setPaymentRequests] = useState<Record<string, PaymentRequest>>({});
  const [userRegistrations, setUserRegistrations] = useState<Record<string, UserRegistration>>({});
  const [allRegistrations, setAllRegistrations] = useState<UserRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<"tournaments" | "results">("tournaments");
  const router = useRouter();

  const ADMIN_WHATSAPP = "2349057612217";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      await fetchEvents();
      await fetchPayments(u.uid);
      await fetchPaymentRequests(u.uid);
      await fetchUserRegistrations(u.uid);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "events"));
      const list: Event[] = await Promise.all(
        snapshot.docs.map(async (d) => {
          const data = d.data();
          const regSnap = await getDocs(
            query(collection(db, "registrations"), where("eventId", "==", d.id))
          );
          return {
            id: d.id,
            title: data.title,
            description: data.description,
            date: data.date,
            price: data.price ?? 1000,
            slots: data.slots ?? 10,
            registeredCount: regSnap.docs.length,
          };
        })
      );
      setEvents(list);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchPayments = async (uid: string) => {
    try {
      const paidObj: Record<string, boolean> = {};
      const eventsSnap = await getDocs(collection(db, "events"));
      
      for (const eventDoc of eventsSnap.docs) {
        try {
          const paymentDocRef = doc(db, "payments", uid, "events", eventDoc.id);
          const paymentDoc = await getDoc(paymentDocRef);
          
          if (paymentDoc.exists()) {
            paidObj[eventDoc.id] = paymentDoc.data()?.paid ?? false;
          } else {
            paidObj[eventDoc.id] = false;
          }
        } catch (err) {
          console.error(`Error checking payment for event ${eventDoc.id}:`, err);
          paidObj[eventDoc.id] = false;
        }
      }
      
      setPayments(paidObj);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchPaymentRequests = async (uid: string) => {
    try {
      const requestsSnap = await getDocs(
        query(collection(db, "paymentRequests"), where("userId", "==", uid))
      );
      const requestsObj: Record<string, PaymentRequest> = {};
      requestsSnap.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        requestsObj[data.eventId] = {
          id: docSnapshot.id,
          eventId: data.eventId,
          status: data.status,
          createdAt: data.createdAt || null,
        };
      });
      setPaymentRequests(requestsObj);
    } catch (error) {
      console.error("Error fetching payment requests:", error);
    }
  };

  const fetchUserRegistrations = async (uid: string) => {
    try {
      const regsSnap = await getDocs(
        query(collection(db, "registrations"), where("userId", "==", uid))
      );
      const regsObj: Record<string, UserRegistration> = {};
      const regsList: UserRegistration[] = [];
      
      regsSnap.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const reg: UserRegistration = {
          id: docSnapshot.id,
          eventId: data.eventId,
          slot: data.slot,
          teamName: data.teamName,
          position: data.position,
          registeredAt: data.registeredAt || null,
        };
        regsObj[data.eventId] = reg;
        regsList.push(reg);
      });
      
      setUserRegistrations(regsObj);
      setAllRegistrations(regsList);
    } catch (error) {
      console.error("Error fetching user registrations:", error);
    }
  };

  const handleRequestPayment = async (event: Event) => {
    if (!user) return;

    const existingRequest = paymentRequests[event.id];
    if (existingRequest && existingRequest.status === "pending") {
      alert("You already have a pending payment request for this event.");
      return;
    }

    try {
      await addDoc(collection(db, "paymentRequests"), {
        userId: user.uid,
        userEmail: user.email,
        eventId: event.id,
        eventTitle: event.title,
        eventPrice: event.price,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      const message = encodeURIComponent(
        `🔔 New Payment Request\n\nUser: ${user.email}\nEvent: ${event.title}\nPrice: ₦${event.price}\n\nPlease approve from admin dashboard.`
      );
      window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, "_blank");

      alert("✅ Payment request sent! Please wait for admin approval.");
      await fetchPaymentRequests(user.uid);
    } catch (error) {
      console.error("Error requesting payment:", error);
      alert("❌ Failed to send payment request. Please try again.");
    }
  };

  const handleRegister = async (event: Event) => {
    if (!user) return;

    if (userRegistrations[event.id]) {
      alert("❌ You are already registered for this tournament!");
      return;
    }

    if (!payments[event.id]) {
      alert(`Please get payment approved by admin for this event first.`);
      return;
    }

    try {
      const slotSnap = await getDocs(
        query(collection(db, "registrations"), where("eventId", "==", event.id))
      );

      const slotCounts: Record<number, number> = {};
      slotSnap.docs.forEach((d) => {
        const slot = d.data().slot;
        if (slot) slotCounts[slot] = (slotCounts[slot] ?? 0) + 1;
      });

      const availableSlots = Array.from({ length: event.slots }, (_, i) => i + 1).filter(
        (s) => (slotCounts[s] ?? 0) < 4
      );

      if (!availableSlots.length) {
        alert("❌ All slots are full for this event!");
        return;
      }

      const slotInput = prompt(`Choose your slot from available: ${availableSlots.join(", ")}`);
      if (!slotInput) return;

      const slot = parseInt(slotInput);
      if (!availableSlots.includes(slot)) {
        alert("Invalid slot or slot is full.");
        return;
      }

      setRegistering(true);

      await addDoc(collection(db, "registrations"), {
        userId: user.uid,
        userEmail: user.email,
        eventId: event.id,
        slot,
        teamName: `Team ${slot}`,
        position: null,
        registeredAt: serverTimestamp(),
      });

      setRegistering(false);
      alert(`✅ Registered successfully in Team ${slot}!`);
      await fetchEvents();
      await fetchUserRegistrations(user.uid);
    } catch (error) {
      console.error("Error registering:", error);
      setRegistering(false);
      alert("❌ Failed to register. Please try again.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const getEventButtonState = (event: Event) => {
    const paid = payments[event.id] ?? false;
    const request = paymentRequests[event.id];
    const registered = userRegistrations[event.id];

    if (registered) {
      return {
        text: "Already Registered",
        color: "bg-green-600 cursor-not-allowed",
        onClick: () => {},
        disabled: true,
        icon: <CheckCircle size={16} />,
      };
    }

    if (paid) {
      return {
        text: registering ? "Registering..." : "Join Tournament",
        color: "bg-blue-600 hover:bg-blue-700",
        onClick: () => handleRegister(event),
        disabled: registering,
        icon: <CheckCircle size={16} />,
      };
    }

    if (request?.status === "pending") {
      return {
        text: "Payment Pending",
        color: "bg-gray-400 cursor-not-allowed",
        onClick: () => {},
        disabled: true,
        icon: <Clock size={16} />,
      };
    }

    if (request?.status === "rejected") {
      return {
        text: "Request Again",
        color: "bg-yellow-500 hover:bg-yellow-600",
        onClick: () => handleRequestPayment(event),
        disabled: false,
        icon: <CheckCircle size={16} />,
      };
    }

    return {
      text: "Request Payment",
      color: "bg-yellow-500 hover:bg-yellow-600",
      onClick: () => handleRequestPayment(event),
      disabled: false,
      icon: <CheckCircle size={16} />,
    };
  };

  // Stats calculations
  const totalTournaments = allRegistrations.length;
  const completedTournaments = allRegistrations.filter(r => r.position).length;
  const activeTournaments = allRegistrations.filter(r => !r.position).length;
  const bestPosition = allRegistrations.filter(r => r.position).length > 0
    ? Math.min(...allRegistrations.filter(r => r.position).map(r => r.position!))
    : null;

  if (loading) return <p className="text-center py-20 text-gray-500">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Welcome Back! 👋</h1>
          <p className="text-gray-600 mt-1">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Tournaments</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalTournaments}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Trophy className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{completedTournaments}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{activeTournaments}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Best Position</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {bestPosition ? `#${bestPosition}` : "—"}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("tournaments")}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === "tournaments"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Calendar className="inline mr-2" size={20} />
            Available Tournaments
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === "results"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Trophy className="inline mr-2" size={20} />
            My Results
          </button>
        </div>
      </div>

      {/* Tournaments Tab */}
      {activeTab === "tournaments" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <Calendar size={24} className="text-blue-600" /> Available Tournaments
          </h2>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No tournaments available yet.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for upcoming events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {events.map((event) => {
                const buttonState = getEventButtonState(event);
                const request = paymentRequests[event.id];
                const registration = userRegistrations[event.id];

                return (
                  <div key={event.id} className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all hover:border-blue-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-3 mb-3">
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                            📅 {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}
                          </span>
                          <span className="bg-green-100 px-3 py-1 rounded-full text-xs font-semibold text-green-700">
                            💰 ₦{event.price}
                          </span>
                          <span className="bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium text-yellow-700">
                            <Users size={12} className="inline mb-0.5" /> {event.registeredCount}/{event.slots * 4}
                          </span>
                        </div>

                        {registration && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3 mb-3">
                            <p className="text-sm font-bold text-green-800 flex items-center gap-2 mb-1">
                              <Trophy size={16} className="text-green-600" /> You&apos;re Registered!
                            </p>
                            <div className="flex gap-4 text-xs text-green-700">
                              <span>🎯 Team: <strong>{registration.teamName || `Team ${registration.slot}`}</strong></span>
                              <span>📍 Slot: <strong>{registration.slot}</strong></span>
                              {registration.position && (
                                <span className="text-yellow-700 font-bold">
                                  🏆 Position: #{registration.position}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {request?.status === "pending" && !registration && (
                          <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg flex items-center gap-1 mb-3">
                            <Clock size={12} /> Waiting for admin approval...
                          </p>
                        )}
                        {request?.status === "rejected" && !registration && (
                          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">
                            ❌ Payment request rejected. Try again.
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={buttonState.onClick}
                      disabled={buttonState.disabled}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold transition-all ${buttonState.color}`}
                    >
                      {buttonState.icon}
                      {buttonState.text}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === "results" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <Medal size={24} className="text-purple-600" /> My Tournament Results
          </h2>

          {allRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <Medal size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No tournament history yet.</p>
              <p className="text-gray-400 text-sm mt-2">Join a tournament to see your results here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allRegistrations.map((reg) => {
                const event = events.find(e => e.id === reg.eventId);
                return (
                  <div key={reg.id} className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-1">
                          {event?.title || "Tournament"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{event?.description}</p>
                        
                        <div className="flex flex-wrap gap-3">
                          <span className="bg-blue-100 px-3 py-1 rounded-full text-xs font-medium text-blue-700">
                            🎯 {reg.teamName || `Team ${reg.slot}`}
                          </span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                            📍 Slot {reg.slot}
                          </span>
                          {reg.position ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              reg.position === 1 ? "bg-yellow-100 text-yellow-800" :
                              reg.position === 2 ? "bg-gray-200 text-gray-800" :
                              reg.position === 3 ? "bg-orange-100 text-orange-800" :
                              "bg-purple-100 text-purple-800"
                            }`}>
                              🏆 {reg.position === 1 ? "1st" : reg.position === 2 ? "2nd" : reg.position === 3 ? "3rd" : `${reg.position}th`} Place
                            </span>
                          ) : (
                            <span className="bg-green-100 px-3 py-1 rounded-full text-xs font-medium text-green-700">
                              ⏳ In Progress
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {reg.position && (
                        <div className="ml-4">
                          {reg.position === 1 && <div className="text-5xl">🥇</div>}
                          {reg.position === 2 && <div className="text-5xl">🥈</div>}
                          {reg.position === 3 && <div className="text-5xl">🥉</div>}
                          {reg.position > 3 && <div className="text-5xl">🏅</div>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}