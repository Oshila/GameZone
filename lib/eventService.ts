import { db } from "./firebase";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

// ===== EVENTS =====
export async function getAllEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createEvent(eventData: any) {
  const eventsRef = collection(db, "events");
  const docRef = await addDoc(eventsRef, {
    ...eventData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateEvent(eventId: string, updatedData: any) {
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, updatedData);
}

export async function deleteEvent(eventId: string) {
  const eventRef = doc(db, "events", eventId);
  await deleteDoc(eventRef);
}

// ===== REGISTRATIONS =====
export async function getUserRegistrations(userId: string) {
  const q = query(collection(db, "registrations"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function registerForEvent(userId: string, eventId: string, reference: any) {
  const registrationsRef = collection(db, "registrations");
  const docRef = await addDoc(registrationsRef, {
    userId,
    eventId,
    paid: false,
    registeredAt: serverTimestamp(),
  });
  return docRef.id;
}
export async function getPaymentStatus(uid: string) {
  const ref = doc(db, "payments", uid);
  const snap = await getDoc(ref);
  return snap.exists() && snap.data().paid;
}

export async function getTeamsForEvent(eventId: string) {
  const teamsRef = collection(db, "events", eventId, "teams");
  const snap = await getDocs(teamsRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function joinTeamOrCreate(uid: string, eventId: string, teamId: string | null) {
  if (teamId) {
    const teamRef = doc(db, "events", eventId, "teams", teamId);
    await updateDoc(teamRef, {
      members: arrayUnion(uid)
    });
  } else {
    const newTeamRef = doc(collection(db, "events", eventId, "teams"));
    await setDoc(newTeamRef, { members: [uid], createdAt: serverTimestamp() });
  }
}
