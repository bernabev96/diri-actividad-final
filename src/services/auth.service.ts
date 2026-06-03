import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function registerWithEmail(input: RegisterInput): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
  return credential.user;
}

export async function loginWithEmail(input: LoginInput): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, input.email, input.password);
  return credential.user;
}

export async function logoutFromFirebase(): Promise<void> {
  await signOut(auth);
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function subscribeToFirebaseAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
