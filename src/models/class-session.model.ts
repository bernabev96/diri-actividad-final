export type ClassSession = {
  id: string;
  title: string;
  trainer: string;
  date: string;
  time: string;
  capacity: number;
  active: boolean;
  createdAt: string;
};

export type ClassSessionFormData = Omit<ClassSession, 'id' | 'createdAt'>;
