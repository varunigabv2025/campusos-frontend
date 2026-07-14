import api from './api';
import type { AuthSession, LoginPayload, RegisterPayload, User } from '../types';
import { mockMemberUser, mockLeadUser, mockFacultyUser } from '../utils/mockData';
import { sleep, uid } from '../utils/cn';

// Placeholder MERN API service.
// All calls are simulated locally — swap VITE_API_URL for a real MERN server.

const roleUserMap = {
  member:  mockMemberUser,
  lead:    mockLeadUser,
  faculty: mockFacultyUser,
};

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    await sleep(1100);
    try { await api.post('/auth/login', payload); } catch { /* no backend */ }
    const user: User = { ...roleUserMap[payload.role], email: payload.email };
    const token = `mock.${uid('tok')}.${btoa(payload.role)}`;
    return { token, user };
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    await sleep(1300);
    try { await api.post('/auth/register', payload); } catch { /* no backend */ }
    const base = roleUserMap[payload.role];
    const user: User = {
      ...base,
      id: uid('u'),
      name: payload.name,
      email: payload.email,
      department: payload.department,
      year: payload.year,
      role: payload.role,
    };
    const token = `mock.${uid('tok')}.${btoa(payload.role)}`;
    return { token, user };
  },

  async getProfile(): Promise<User> {
    await sleep(700);
    try {
      const { data } = await api.get('/user/profile');
      return data;
    } catch {
      return mockLeadUser;
    }
  },

  async getDashboard(): Promise<unknown> {
    await sleep(700);
    try {
      const { data } = await api.get('/dashboard');
      return data;
    } catch {
      return null;
    }
  },
};

export default authService;
