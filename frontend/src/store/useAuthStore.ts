import { create } from 'zustand';

interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  email_verified_at?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Check if we are on the client side before reading localStorage
  const isClient = typeof window !== 'undefined';
  const initialToken = isClient ? localStorage.getItem('tatamart_token') : null;
  const initialUser = isClient ? localStorage.getItem('tatamart_user') : null;
  const parsedUser = (() => {
    if (!initialUser) return null;
    try {
      const user = JSON.parse(initialUser) as User;
      return {
        ...user,
        role: user.role.toUpperCase() as User['role'],
      };
    } catch {
      localStorage.removeItem('tatamart_user');
      return null;
    }
  })();

  return {
    token: initialToken,
    user: parsedUser,
    isAuthenticated: !!initialToken && !!parsedUser,
    login: (token, user) => {
      const normalizedUser = {
        ...user,
        role: user.role.toUpperCase() as User['role'],
      };
      if (isClient) {
        localStorage.setItem('tatamart_token', token);
        localStorage.setItem('tatamart_user', JSON.stringify(normalizedUser));
      }
      set({ token, user: normalizedUser, isAuthenticated: true });
    },
    logout: () => {
      if (isClient) {
        localStorage.removeItem('tatamart_token');
        localStorage.removeItem('tatamart_user');
      }
      set({ token: null, user: null, isAuthenticated: false });
    },
    updateUser: (updatedUser) => {
      set((state) => {
        if (!state.user) return state;
        const newUser = { ...state.user, ...updatedUser };
        if (isClient) {
          localStorage.setItem('tatamart_user', JSON.stringify(newUser));
        }
        return { user: newUser };
      });
    },
  };
});
