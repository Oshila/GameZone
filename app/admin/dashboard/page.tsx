"use client";

import React, { useEffect, useState } from "react";
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
  MoreHorizontal,
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
  createdAt?: { toDate?: () => Date } | Date | null;
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
  const [openRequestId, setOpenRequestId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);

      try {
        const q = query(collection(db, "users"), where("email", "==", u.email || ""));
        const snap = await getDocs(q);
        const roleData = snap.docs[0]?.data() as Partial<UserData> | undefined;

        if (roleData?.role !== "admin") {
          router.push("/dashboard");
          return;
        }

        setIsAdmin(true);
        await fetchData();
      } catch (err) {
        // fallback: redirect if something goes wrong
        // eslint-disable-next-line no-console
        console.error("Auth/role check error:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
    // router intentionally not in deps to avoid repeated subscriptions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (): Promise<void> => {
    const [eventsSnap, regsSnap, usersSnap, requestsSnap] = await Promise.all([
      getDocs(collection(db, "events")),
      getDocs(collection(db, "registrations")),
      getDocs(collection(db, "users")),
      getDocs(collection(db, "paymentRequests")),
    ]);

    setEvents(eventsSnap.docs.map((d) => ({ ...(d.data() as EventData), id: d.id })));
setRegistrations(regsSnap.docs.map((d) => ({ ...(d.data() as RegistrationData), id: d.id })));
setAllUsers(usersSnap.docs.map((d) => ({ ...(d.data() as UserData), id: d.id })));
setPaymentRequests(
  requestsSnap.docs.map((d) => ({ ...(d.data() as PaymentRequestData), id: d.id }))
);
  };

  const handleLogout = async (): Promise<void> => {
    await signOut(auth);
    router.push("/login");
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.slots) {
      // eslint-disable-next-line no-alert
      alert("Please fill all required fields");
      return;
    }

    await addDoc(collection(db, "events"), {
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      price: Number(newEvent.price) || 1000,
      slots: Number(newEvent.slots),
      createdAt: new Date(),
    });

    setNewEvent({ title: "", description: "", date: "", price: "", slots: "" });
    await fetchData();
  };

  const handleDeleteEvent = async (id: string): Promise<void> => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    await fetchData();
  };

  const handleEditEvent = async (eventData: EventData): Promise<void> => {
    const title = window.prompt("Event Title:", eventData.title) ?? eventData.title;
    const description =
      window.prompt("Description:", eventData.description) ?? eventData.description;
    const date = window.prompt("Date (YYYY-MM-DD):", eventData.date) ?? eventData.date;
    const priceStr = window.prompt("Price:", eventData.price.toString());
    const price = priceStr ? parseInt(priceStr, 10) : eventData.price;
    const slotsStr = window.prompt("Available Slots:", eventData.slots.toString());
    const slots = slotsStr ? parseInt(slotsStr, 10) : eventData.slots;

    await updateDoc(doc(db, "events", eventData.id), { title, description, date, price, slots });
    await fetchData();
  };

  const handleDeleteRegistration = async (id: string): Promise<void> => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this registration?")) return;
    await deleteDoc(doc(db, "registrations", id));
    await fetchData();
  };

  const handleExportRegistrations = (eventId: string): void => {
    const eventRegs = registrations.filter((r) => r.eventId === eventId);
    if (!eventRegs.length) {
      // eslint-disable-next-line no-alert
      alert("No registrations for this event.");
      return;
    }

    const header = "Slot,Team,UserID,Email,Position\n";
    const body = eventRegs
      .map(
        (r) =>
          `${r.slot ?? ""},${(r.teamName ?? "").replace(/,/g, "")},${r.userId ?? ""},${
            r.userEmail ?? ""
          },${r.position ?? ""}`
      )
      .join("\n");

    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `event_${eventId}_registrations.csv`);
  };

  const handleApprovePayment = async (request: PaymentRequestData): Promise<void> => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Approve payment for ${request.userEmail} for event "${request.eventTitle}"?`))
      return;

    try {
      if (!request.userId || !request.eventId) {
        // eslint-disable-next-line no-alert
        alert("Invalid payment request data.");
        return;
      }

      // store payment record
      await setDoc(
        doc(db, "payments", request.userId, "events", request.eventId),
        {
          uid: request.userId,
          eventId: request.eventId,
          paid: true,
          paidAt: new Date(),
          reference: "admin-approved",
        },
        { merge: true }
      );

      // update request status
      await updateDoc(doc(db, "paymentRequests", request.id), {
        status: "approved",
        approvedAt: new Date(),
        approvedBy: user?.uid ?? null,
      });

      await fetchData();
      // eslint-disable-next-line no-alert
      alert("✅ Payment approved successfully!");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error approving payment:", err);
      // eslint-disable-next-line no-alert
      alert("❌ Failed to approve payment. Please try again.");
    } finally {
      setOpenRequestId(null);
    }
  };

  const handleRejectPayment = async (request: PaymentRequestData): Promise<void> => {
    const reason = window.prompt("Reason for rejection (optional):") ?? "No reason provided";

    try {
      await updateDoc(doc(db, "paymentRequests", request.id), {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedBy: user?.uid ?? null,
        rejectionReason: reason,
      });

      await fetchData();
      // eslint-disable-next-line no-alert
      alert("❌ Payment request rejected.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error rejecting payment:", err);
      // eslint-disable-next-line no-alert
      alert("❌ Failed to reject payment request. Please try again.");
    } finally {
      setOpenRequestId(null);
    }
  };

  const handleDeletePaymentRequest = async (id: string): Promise<void> => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this payment request?")) return;
    await deleteDoc(doc(db, "paymentRequests", id));
    await fetchData();
    setOpenRequestId(null);
  };

  const handleUpdateResult = async (
    regId: string,
    currentPosition: number | null
  ): Promise<void> => {
    const position = window.prompt(
      "Enter final position (1, 2, 3, etc.):",
      currentPosition?.toString() ?? ""
    );

    if (position === null) return;

    const positionNum = parseInt(position, 10);
    if (Number.isNaN(positionNum) || positionNum < 1) {
      // eslint-disable-next-line no-alert
      alert("Please enter a valid position number (1 or higher)");
      return;
    }

    try {
      await updateDoc(doc(db, "registrations", regId), {
        position: positionNum,
        updatedAt: new Date(),
      });

      await fetchData();
      // eslint-disable-next-line no-alert
      alert(`✅ Position updated to ${positionNum}!`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error updating result:", err);
      // eslint-disable-next-line no-alert
      alert("❌ Failed to update result. Please try again.");
    }
  };

  const handleMakeAdmin = async (u: UserData): Promise<void> => {
    if (u.role === "admin") return;
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Make ${u.email ?? u.username} an admin?`)) return;

    try {
      await updateDoc(doc(db, "users", u.id), { role: "admin" });
      await fetchData();
      // eslint-disable-next-line no-alert
      alert(`${u.email ?? u.username} is now an admin.`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error making admin:", err);
      // eslint-disable-next-line no-alert
      alert("Failed to update role. Please try again.");
    }
  };

  const filteredUsers = allUsers.filter((u) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.uid ?? "").toLowerCase().includes(q) ||
      (u.username ?? "").toLowerCase().includes(q)
    );
  });

  const pendingRequests = paymentRequests.filter((r) => r.status === "pending");
  const processedRequests = paymentRequests.filter((r) => r.status !== "pending");

  const eventRegistrations = selectedEventForResults
    ? registrations.filter((r) => r.eventId === selectedEventForResults)
    : [];

  const groupedBySlot = eventRegistrations.reduce<Record<number, RegistrationData[]>>((acc, reg) => {
    const slot = reg.slot ?? 0;
    if (!acc[slot]) acc[slot] = [];
    acc[slot].push(reg);
    return acc;
  }, {});

  if (loading) {
    return <p className="text-center py-20 text-gray-400">Loading Admin...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard 🎮</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300 mr-2">Users: {allUsers.length}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
            type="button"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <section className="bg-orange-900/30 border-2 border-orange-500 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="text-orange-400" /> Pending Payment Requests ({pendingRequests.length})
          </h2>

          <ul className="space-y-3">
            {pendingRequests.map((request) => {
              const createdAtDate =
                request.createdAt && typeof request.createdAt !== "string"
                  ? // if Firestore timestamp-like
                    (request.createdAt as { toDate?: () => Date }).toDate?.() ?? null
                  : request.createdAt instanceof Date
                  ? (request.createdAt as Date)
                  : null;

              return (
                <li
                  key={request.id}
                  className="bg-gray-900 p-4 rounded-lg border border-orange-500/30 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg">{request.eventTitle}</p>
                    <p className="text-sm text-gray-400">User: {request.userEmail}</p>
                    <p className="text-sm text-green-400">Price: ₦{request.eventPrice}</p>
                    <p className="text-xs text-gray-500">
                      Requested: {createdAtDate ? createdAtDate.toLocaleString() : "Recently"}
                    </p>
                  </div>

                  {/* Dropdown manage menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenRequestId((prev) => (prev === request.id ? null : request.id))}
                      className="flex items-center gap-2 bg-gray-800/60 px-3 py-2 rounded-lg hover:bg-gray-800"
                      aria-expanded={openRequestId === request.id}
                      aria-controls={`manage-${request.id}`}
                    >
                      <MoreHorizontal size={16} /> Manage
                    </button>

                    {openRequestId === request.id && (
                      <div
                        id={`manage-${request.id}`}
                        role="menu"
                        className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded shadow-md z-20"
                      >
                        <button
                          type="button"
                          onClick={() => handleApprovePayment(request)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectPayment(request)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePaymentRequest(request.id)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center gap-2 text-red-400"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
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
                  type="button"
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
            {events.map((ev) => (
              <li
                key={ev.id}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <div>
                  <p className="font-semibold">{ev.title}</p>
                  <p className="text-sm text-gray-400">{ev.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(ev.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-green-400">₦{ev.price}</p>
                  <p className="text-sm text-yellow-400">
                    Slots: {ev.slots ?? 0} (Max 4 players per slot)
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEventForResults(ev.id)}
                    className="text-purple-400 hover:text-purple-500 flex items-center gap-1"
                  >
                    <Award size={16} /> Results
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditEvent(ev)}
                    className="text-blue-400 hover:text-blue-500 flex items-center gap-1"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="text-red-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportRegistrations(ev.id)}
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
              <Award className="text-purple-400" /> Manage Results -{" "}
              {events.find((e) => e.id === selectedEventForResults)?.title ?? ""}
            </h2>
            <button
              type="button"
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
              {Object.keys(groupedBySlot)
                .sort((a, b) => Number(a) - Number(b))
                .map((slotKey) => {
                  const slotNum = Number(slotKey);
                  const list = groupedBySlot[slotNum] ?? [];
                  return (
                    <div key={slotKey} className="bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-purple-300">
                        Team {slotNum} ({list.length} players)
                      </h3>
                      <ul className="space-y-2">
                        {list.map((reg) => (
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
                              type="button"
                              onClick={() => handleUpdateResult(reg.id, reg.position ?? null)}
                              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                            >
                              <Award size={14} /> {reg.position ? "Update" : "Set"} Position
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
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
                    Event ID: {reg.eventId} | Team: {reg.teamName ?? `Team ${reg.slot}`}
                  </p>
                  <p className="text-xs text-gray-500">User: {reg.userEmail ?? reg.userId}</p>
                  <p className="text-xs text-gray-500">
                    Slot: {reg.slot ?? "N/A"}
                    {reg.position && ` | Position: ${reg.position}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
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
          <Users className="text-yellow-400" /> Users ({allUsers.length})
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
              <li key={u.id} className="border-b border-gray-700 pb-2 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm text-gray-300">{u.username ?? u.email}</p>
                  <p className="text-xs text-gray-500">Email: {u.email}</p>
                  <p className="text-xs text-gray-500">UID: {u.uid}</p>
                  <p className="text-xs text-gray-500">Role: {u.role ?? "user"}</p>
                </div>

                <div className="flex gap-2">
                  {u.role !== "admin" && (
                    <button
                      type="button"
                      onClick={() => handleMakeAdmin(u)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs font-semibold"
                    >
                      Make Admin
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
