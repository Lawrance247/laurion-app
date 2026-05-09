// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── CHANGE THIS to your deployed backend URL ──────────────────────────────────
export const BASE_URL = 'https://YOUR-LAURION-BACKEND.onrender.com';
// E.g. 'https://laurion-app.onrender.com'  (after deploying your Flask app)
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach session cookie on every request
api.interceptors.request.use(async (config) => {
  const cookie = await AsyncStorage.getItem('session_cookie');
  if (cookie) {
    config.headers['Cookie'] = cookie;
  }
  return config;
});

// Save session cookie from response
api.interceptors.response.use(
  (response) => {
    const setCookie = response.headers['set-cookie'];
    if (setCookie) {
      const cookie = Array.isArray(setCookie) ? setCookie[0] : setCookie;
      const sessionMatch = cookie.match(/session=[^;]+/);
      if (sessionMatch) {
        AsyncStorage.setItem('session_cookie', sessionMatch[0]);
      }
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// ── AUTH ─────────────────────────────────────────────────────────────────────

export interface UserSession {
  username: string;
  role: 'student' | 'teacher' | 'admin';
  isAdmin: boolean;
}

export async function login(username: string, password: string): Promise<UserSession> {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);

  const response = await api.post('/login', form.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    maxRedirects: 0,
    validateStatus: (s) => s < 400,
  });

  // After login, fetch dashboard to confirm session and get role
  const dashRes = await api.get('/dashboard');
  const html: string = dashRes.data;

  // Parse role from HTML (simple string checks)
  let role: UserSession['role'] = 'student';
  if (html.includes('teacher') && html.includes('Upload')) role = 'teacher';
  const isAdmin = html.includes('Developer Admin Panel') || html.includes('/admin');

  const session: UserSession = { username, role: isAdmin ? 'admin' : role, isAdmin };
  await AsyncStorage.setItem('user_session', JSON.stringify(session));
  return session;
}

export async function register(username: string, password: string, role: string): Promise<void> {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);
  form.append('role', role);
  await api.post('/register', form.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    maxRedirects: 5,
  });
}

export async function logout(): Promise<void> {
  try { await api.get('/logout'); } catch (_) {}
  await AsyncStorage.multiRemove(['session_cookie', 'user_session']);
}

export async function getStoredSession(): Promise<UserSession | null> {
  const raw = await AsyncStorage.getItem('user_session');
  return raw ? JSON.parse(raw) : null;
}

// ── MATERIALS ────────────────────────────────────────────────────────────────

export interface Material {
  id: number;
  title: string;
  subject: string;
  grade: number;
  downloads: number;
  filename: string;
}

export async function getMaterials(grade?: number, subject?: string): Promise<Material[]> {
  const params: Record<string, string | number> = {};
  if (grade) params.grade = grade;
  if (subject) params.subject = subject;
  const res = await api.get('/api/materials', { params });
  return res.data;
}

export function getDownloadUrl(id: number): string {
  return `${BASE_URL}/download/${id}`;
}

// ── PLANNER ──────────────────────────────────────────────────────────────────

export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  subject?: string;
}

export async function getTasks(): Promise<Task[]> {
  const res = await api.get('/api/tasks');
  return res.data;
}

export async function addTask(task: { title: string; description: string; date: string; subject?: string }): Promise<void> {
  const form = new URLSearchParams();
  form.append('title', task.title);
  form.append('description', task.description || '');
  form.append('date', task.date);
  if (task.subject) form.append('subject', task.subject);
  await api.post('/planner', form.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    maxRedirects: 5,
  });
}

export async function deleteTask(id: number): Promise<void> {
  await api.get(`/delete_task/${id}`);
}

// ── NOTES ─────────────────────────────────────────────────────────────────────

export async function getNotes(subject: string, grade: number): Promise<string> {
  const res = await api.get('/api/notes', { params: { subject, grade } });
  return res.data.content || '';
}

export async function saveNotes(subject: string, grade: number, content: string): Promise<void> {
  await api.post('/sync-notes', { subject, grade, content });
}

// ── UPLOAD (Teacher) ─────────────────────────────────────────────────────────

export async function uploadMaterial(
  title: string,
  subject: string,
  grade: number,
  file: { uri: string; name: string; type: string }
): Promise<void> {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('subject', subject);
  formData.append('grade', String(grade));
  formData.append('file', file as any);

  await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    maxRedirects: 5,
  });
}

export async function deleteMaterial(id: number): Promise<void> {
  await api.get(`/delete_material/${id}`);
}

export async function getMyMaterials(): Promise<Material[]> {
  // Parse teacher page HTML for materials (fallback approach)
  const res = await api.get('/api/materials');
  return res.data;
}

export default api;
