"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import {
  Calendar,
  Users,
  PlusCircle,
  Trash2,
  LogOut,
  ClipboardList,
  Edit3,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Award,
} from "lucide-react";
import { saveAs } from "file-saver";

interface EventData extends DocumentData {
  id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  slots: number;
}

interface RegistrationData extends DocumentData {
  id: string;
  userId: string;
  userEmail: string;
  eventId: string;
  slot: number;
  teamName?: string;
  position?: number;
}

interface UserData extends DocumentData {
  id: string;
  email: string;
  uid: string;
  username?: string;
  role?: string;
}

interface PaymentRequestData extends DocumentData {
  id: string;
  userId: string;
  userEmail: string;
  eventId: string;
  eventTitle: string;
  eventPrice: number;
  status: string;
  rejectionReason?: string;
  createdAt?: {
    toDate: () => Date;
  };
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequestData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventForResults, setSelectedEventForResults] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    price: "",
    slots: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);
      const q = query(collection(db, "users"), where("email", "==", u.email));
      const snap = await getDocs(q);
      const roleData = snap.docs[0]?.data();

      if (roleData?.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setIsAdmin(true);
      await fetchData();
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const fetchData = async () => {
    const eventsSnap = await getDocs(collection(db, "events"));
    const regsSnap = await getDocs(collection(db, "registrations"));
    const usersSnap = await getDocs(collection(db, "users"));
    const requestsSnap = await getDocs(collection(db, "paymentRequests"));

    setEvents(eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as EventData)));
    setRegistrations(regsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as RegistrationData)));
    setAllUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as UserData)));
    setPaymentRequests(requestsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentRequestData)));
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.slots)
      return alert("Please fill all fields");

    await addDoc(collection(db, "events"), {
      ...newEvent,
      price: Number(newEvent.price) || 1000,
      slots: Number(newEvent.slots),
      createdAt: new Date(),
    });

    setNewEvent({ title: "", description: "", date: "", price: "", slots: "" });
    await fetchData();
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    await fetchData();
  };

  const handleEditEvent = async (event: EventData) => {
    const title = prompt("Event Title:", event.title) || event.title;
    const description = prompt("Description:", event.description) || event.description;
    const date = prompt("Date (YYYY-MM-DD):", event.date) || event.date;
    const priceStr = prompt("Price:", event.price.toString());
    const price = priceStr ? parseInt(priceStr) : event.price;
    const slotsStr = prompt("Available Slots:", event.slots.toString());
    const slots = slotsStr ? parseInt(slotsStr) : event.slots;

    await updateDoc(doc(db, "events", event.id), { title, description, date, price, slots });
    await fetchData();
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    await deleteDoc(doc(db, "registrations", id));
    await fetchData();
  };

  const handleExportRegistrations = (eventId: string) => {
    const eventRegs = registrations.filter((r) => r.eventId === eventId);
    if (!eventRegs.length) return alert("No registrations for this event.");

    let csv = "Slot,Team,UserID,Email,Position\n";
    eventRegs.forEach((r) => {
      csv += `${r.slot || ""},${r.teamName || ""},${r.userId || ""},${r.userEmail || ""},${r.position || ""}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `event_${eventId}_registrations.csv`);
  };

  const handleApprovePayment = async (request: PaymentRequestData) => {
    if (!confirm(`Approve payment for ${request.userEmail} for event "${request.eventTitle}"?`))
      return;

    try {
      await setDoc(
        doc(db, "payments", request.userId, "events", request.eventId),
        {
          uid: request.userId,
          eventId: request.eventId,
          paid: true,
          paidAt: new Date(),
          reference: "admin-approved",
        }
      );

      await updateDoc(doc(db, "paymentRequests", request.id), {
        status: "approved",
        approvedAt: new Date(),
        approvedBy: user?.uid,
      });

      await fetchData();
      alert("✅ Payment approved successfully!");
    } catch (error) {
      console.error("Error approving payment:", error);
      alert("❌ Failed to approve payment. Please try again.");
    }
  };

  const handleRejectPayment = async (request: PaymentRequestData) => {
    const reason = prompt("Reason for rejection (optional):");

    try {
      await updateDoc(doc(db, "paymentRequests", request.id), {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedBy: user?.uid,
        rejectionReason: reason || "No reason provided",
      });

      await fetchData();
      alert("❌ Payment request rejected.");
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("❌ Failed to reject payment request. Please try again.");
    }
  };

  const handleDeletePaymentRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment request?")) return;
    await deleteDoc(doc(db, "paymentRequests", id));
    await fetchData();
  };

  const handleUpdateResult = async (regId: string, currentPosition: number | null) => {
    const position = prompt(
      "Enter final position (1st, 2nd, 3rd, etc.):",
      currentPosition?.toString() || ""
    );
    
    if (position === null) return;
    
    const positionNum = parseInt(position);
    if (isNaN(positionNum) || positionNum < 1) {
      alert("Please enter a valid position number (1 or higher)");
      return;
    }

    try {
      await updateDoc(doc(db, "registrations", regId), {
        position: positionNum,
        updatedAt: new Date(),
      });

      await fetchData();
      alert(`✅ Position updated to ${positionNum}!`);
    } catch (error) {
      console.error("Error updating result:", error);
      alert("❌ Failed to update result. Please try again.");
    }
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = paymentRequests.filter((r) => r.status === "pending");
  const processedRequests = paymentRequests.filter((r) => r.status !== "pending");

  const eventRegistrations = selectedEventForResults
    ? registrations.filter((r) => r.eventId === selectedEventForResults)
    : [];

  const groupedBySlot = eventRegistrations.reduce((acc: Record<number, RegistrationData[]>, reg) => {
    const slot = reg.slot || 0;
    if (!acc[slot]) acc[slot] = [];
    acc[slot].push(reg);
    return acc;
  }, {});

  if (loading)
    return <p className="text-center py-20 text-gray-400">Loading Admin...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard 🎮</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {pendingRequests.length > 0 && (
        <section className="bg-orange-900/30 border-2 border-orange-500 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="text-orange-400" /> Pending Payment Requests ({pendingRequests.length})
          </h2>
          <ul className="space-y-3">
            {pendingRequests.map((request) => (
              <li
                key={request.id}
                className="bg-gray-900 p-4 rounded-lg border border-orange-500/30 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg">{request.eventTitle}</p>
                  <p className="text-sm text-gray-400">User: {request.userEmail}</p>
                  <p className="text-sm text-green-400">Price: ₦{request.eventPrice}</p>
                  <p className="text-xs text-gray-500">
                    Requested: {request.createdAt?.toDate?.()?.toLocaleString() || "Recently"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprovePayment(request)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleRejectPayment(request)}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {processedRequests.length > 0 && (
        <section className="bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="text-gray-400" /> Processed Payment Requests
          </h2>
          <ul className="space-y-3">
            {processedRequests.map((request) => (
              <li
                key={request.id}
                className="border-b border-gray-700 pb-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm text-gray-300">{request.eventTitle}</p>
                  <p className="text-xs text-gray-500">User: {request.userEmail}</p>
                  <p className="text-xs text-gray-500">Price: ₦{request.eventPrice}</p>
                  <p
                    className={`text-xs font-semibold ${
                      request.status === "approved" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    Status: {request.status.toUpperCase()}
                  </p>
                  {request.rejectionReason && (
                    <p className="text-xs text-red-300">Reason: {request.rejectionReason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeletePaymentRequest(request.id)}
                  className="text-red-400 hover:text-red-500 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PlusCircle className="text-green-400" /> Create Tournament
        </h2>
        <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="p-3 rounded-lg bg-gray-800"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="p-3 rounded-lg bg-gray-800"
            required
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="p-3 rounded-lg bg-gray-800"
            required
          />
          <input
            type="number"
            placeholder="Price (₦)"
            value={newEvent.price}
            onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
            className="p-3 rounded-lg bg-gray-800"
            required
          />
          <input
            type="number"
            placeholder="Available Slots"
            value={newEvent.slots}
            onChange={(e) => setNewEvent({ ...newEvent, slots: e.target.value })}
            className="p-3 rounded-lg bg-gray-800"
            required
          />
          <button
            type="submit"
            className="md:col-span-5 bg-green-600 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Add Tournament
          </button>
        </form>
      </section>

      <section className="bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="text-blue-400" /> Active Tournaments
        </h2>
        {events.length === 0 ? (
          <p className="text-gray-400">No events available.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-gray-400">{event.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-green-400">₦{event.price}</p>
                  <p className="text-sm text-yellow-400">
                    Slots: {event.slots || 0} (Max 4 players per slot)
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedEventForResults(event.id)}
                    className="text-purple-400 hover:text-purple-500 flex items-center gap-1"
                  >
                    <Award size={16} /> Results
                  </button>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="text-blue-400 hover:text-blue-500 flex items-center gap-1"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button
                    onClick={() => handleExportRegistrations(event.id)}
                    className="text-green-400 hover:text-green-500 flex items-center gap-1"
                  >
                    <ClipboardList size={16} /> Export
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedEventForResults && (
        <section className="bg-purple-900/30 border-2 border-purple-500 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Award className="text-purple-400" /> Manage Results - {events.find(e => e.id === selectedEventForResults)?.title}
            </h2>
            <button
              onClick={() => setSelectedEventForResults(null)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕ Close
            </button>
          </div>

          {eventRegistrations.length === 0 ? (
            <p className="text-gray-400">No registrations for this event yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.keys(groupedBySlot).sort((a, b) => Number(a) - Number(b)).map((slot) => (
                <div key={slot} className="bg-gray-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-purple-300">
                    Team {slot} ({groupedBySlot[Number(slot)].length} players)
                  </h3>
                  <ul className="space-y-2">
                    {groupedBySlot[Number(slot)].map((reg) => (
                      <li
                        key={reg.id}
                        className="flex justify-between items-center bg-gray-800 p-3 rounded"
                      >
                        <div>
                          <p className="text-sm text-gray-300">{reg.userEmail}</p>
                          <p className="text-xs text-gray-500">UID: {reg.userId}</p>
                          {reg.position && (
                            <p className="text-sm text-yellow-400 font-semibold mt-1">
                              🏆 Position: {reg.position}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleUpdateResult(reg.id, reg.position || null)}
                          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                        >
                          <Award size={14} /> {reg.position ? "Update" : "Set"} Position
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ClipboardList className="text-purple-400" /> Player Registrations
        </h2>
        {registrations.length === 0 ? (
          <p className="text-gray-400">No registrations yet.</p>
        ) : (
          <ul className="space-y-3">
            {registrations.map((reg) => (
              <li
                key={reg.id}
                className="border-b border-gray-700 pb-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm text-gray-300">
                    Event ID: {reg.eventId} | Team: {reg.teamName || `Team ${reg.slot}`}
                  </p>
                  <p className="text-xs text-gray-500">User: {reg.userEmail || reg.userId}</p>
                  <p className="text-xs text-gray-500">
                    Slot: {reg.slot || "N/A"}
                    {reg.position && ` | Position: ${reg.position}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteRegistration(reg.id)}
                    className="text-red-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="text-yellow-400" /> Users
        </h2>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search by email, username, or UID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 flex-1"
          />
          <Search size={20} className="ml-2 text-gray-400" />
        </div>
        {filteredUsers.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          <ul className="space-y-3">
            {filteredUsers.map((u) => (
              <li
                key={u.id}
                className="border-b border-gray-700 pb-2"
              >
                <p className="font-medium text-sm text-gray-300">{u.username || u.email}</p>
                <p className="text-xs text-gray-500">Email: {u.email}</p>
                <p className="text-xs text-gray-500">UID: {u.uid}</p>
                <p className="text-xs text-gray-500">Role: {u.role || "user"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}