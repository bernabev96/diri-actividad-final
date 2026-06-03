export type UserRole = 'user' | 'admin';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
};
