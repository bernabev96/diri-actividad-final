import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import type { AppUser } from '../models/user.model';

function getUsersCollection() {
  return collection(db, 'users');
}

type CreateUserProfileInput = {
  id: string;
  name: string;
  email: string;
};

export async function createUserProfile(input: CreateUserProfileInput): Promise<AppUser> {
  const user: AppUser = {
    id: input.id,
    name: input.name,
    email: input.email,
    phone: '',
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(getUsersCollection(), input.id), user);
  return user;
}

export async function getUserProfile(userId: string): Promise<AppUser | null> {
  const snapshot = await getDoc(doc(getUsersCollection(), userId));
  return snapshot.exists() ? (snapshot.data() as AppUser) : null;
}

export async function getAllUsers(): Promise<AppUser[]> {
  const snapshot = await getDocs(getUsersCollection());
  return snapshot.docs.map((item) => item.data() as AppUser);
}

export async function updateUserProfile(userId: string, data: Pick<AppUser, 'name' | 'phone'>): Promise<void> {
  await updateDoc(doc(getUsersCollection(), userId), data);
}

export async function searchUsersByEmail(email: string): Promise<AppUser[]> {
  const emailQuery = query(getUsersCollection(), where('email', '>=', email), where('email', '<=', `${email}\uf8ff`));
  const snapshot = await getDocs(emailQuery);
  return snapshot.docs.map((item) => item.data() as AppUser);
}

export async function searchUsers(term: string): Promise<AppUser[]> {
  const normalizedTerm = term.trim().toLowerCase();
  const users = await getAllUsers();

  return users.filter(
    (user) => user.email.toLowerCase().includes(normalizedTerm) || user.name.toLowerCase().includes(normalizedTerm),
  );
}
