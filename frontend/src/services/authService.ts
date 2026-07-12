// TransitOps Authentication Service simulation
import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

const DELAY_MS = 350;

const KEYS = {
  AUTH_USER: 'transitops_auth_user'
};

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

    // Simple validation
    if (!email || !password) {
      throw new Error('400: Email and password are required');
    }

    // Demo/Hackathon login credentials (shown subtly on the login form)
    if (email.toLowerCase() === 'admin@transitops.com' && password === 'admin123') {
      const demoUser: User = {
        id: 'USR-001',
        name: 'Shravan Kumar',
        email: email,
        role: 'Fleet Director',
        organization: 'TransitOps India'
      };
      localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(demoUser));
      return demoUser;
    } else {
      throw new Error('401: Invalid email or password. Use demo credentials: admin@transitops.com / admin123');
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    // Immediate return for layout sync
    const stored = localStorage.getItem(KEYS.AUTH_USER);
    if (!stored) return null;
    return JSON.parse(stored);
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    localStorage.removeItem(KEYS.AUTH_USER);
  }
};
