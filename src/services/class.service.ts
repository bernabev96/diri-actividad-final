import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import type { ClassSession, ClassSessionFormData } from '../models/class-session.model';

function getClassesCollection() {
  return collection(db, 'classes');
}

export async function getClasses(): Promise<ClassSession[]> {
  const snapshot = await getDocs(getClassesCollection());
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }) as ClassSession)
    .sort((first, second) => `${first.date}${first.time}`.localeCompare(`${second.date}${second.time}`));
}

export async function getClassSessionById(classId: string): Promise<ClassSession | null> {
  const snapshot = await getDoc(doc(getClassesCollection(), classId));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as ClassSession) : null;
}

export async function createClassSession(data: ClassSessionFormData): Promise<ClassSession> {
  const newClass = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  const document = await addDoc(getClassesCollection(), newClass);
  return { id: document.id, ...newClass };
}

export async function updateClassSession(classId: string, data: ClassSessionFormData): Promise<void> {
  await updateDoc(doc(getClassesCollection(), classId), data);
}

export async function deleteClassSession(classId: string): Promise<void> {
  await deleteDoc(doc(getClassesCollection(), classId));
}
