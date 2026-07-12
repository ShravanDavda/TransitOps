import api from "./axios";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  organization: string;
}

const TOKEN_KEY = "token";
const USER_KEY = "transitops_auth_user";

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem(TOKEN_KEY, token);

    const currentUser: User = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role,
      organization: "TransitOps",
    };

    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));

    return currentUser;
  },

  async getCurrentUser(): Promise<User | null> {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  },

  async logout(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};