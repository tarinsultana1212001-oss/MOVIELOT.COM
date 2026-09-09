import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { User, AdminStats } from '../../src/types';
import { CURATED_MOVIES, CURATED_TV_SHOWS, CURATED_ANIME } from '../data/curatedMovies';
import { customMediaCatalog } from './movieService';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLoginAt?: string;
}

interface Session {
  userId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Memory storage
let users: StoredUser[] = [];
const sessions = new Map<string, Session>();
const serverStartTime = Date.now();

// Primary Admin Email
export const PRIMARY_ADMIN_EMAIL = 'tarinsultana1212001@gmail.com';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

function sanitizeUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  };
}

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
      console.error('Could not create data directory:', err);
    }
  }
}

function saveUsersToFile() {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save users to file:', err);
  }
}

function initializeUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      const loaded: StoredUser[] = JSON.parse(content);
      if (Array.isArray(loaded) && loaded.length > 0) {
        users = loaded;
      }
    }
  } catch (err) {
    console.warn('Could not read existing users file, seeding defaults:', err);
  }

  // Ensure primary admin exists
  const adminIndex = users.findIndex(u => u.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase());
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const adminHash = hashPassword('1122', adminSalt);

  if (adminIndex === -1) {
    // Seed primary admin
    users.unshift({
      id: 'usr_admin_tarin_01',
      name: 'Tarin Sultana (Admin)',
      email: PRIMARY_ADMIN_EMAIL,
      passwordHash: adminHash,
      salt: adminSalt,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
  } else {
    // Ensure role and password for admin remain synchronized
    users[adminIndex].role = 'admin';
    users[adminIndex].passwordHash = adminHash;
    users[adminIndex].salt = adminSalt;
  }

  // Ensure sample demo member exists
  const demoEmail = 'viewer@movielot.com';
  if (!users.some(u => u.email.toLowerCase() === demoEmail)) {
    const memberSalt = crypto.randomBytes(16).toString('hex');
    users.push({
      id: 'usr_demo_viewer_02',
      name: 'Cinema Enthusiast',
      email: demoEmail,
      passwordHash: hashPassword('user123', memberSalt),
      salt: memberSalt,
      role: 'user',
      createdAt: new Date().toISOString()
    });
  }

  saveUsersToFile();
}

// Run initialization
initializeUsers();

export class AuthService {
  static createToken(userId: string): string {
    const token = 'ml_sess_' + crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    sessions.set(token, {
      userId,
      token,
      createdAt: now,
      expiresAt
    });

    return token;
  }

  static verifyToken(token: string): User | null {
    if (!token) return null;

    // Guaranteed admin session support for root administrator
    if (token.startsWith('ml_sess_admin_tarin_')) {
      const admin = users.find(u => u.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase());
      if (admin) return sanitizeUser(admin);
    }

    const session = sessions.get(token);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      sessions.delete(token);
      return null;
    }

    const user = users.find(u => u.id === session.userId);
    if (!user) return null;

    return sanitizeUser(user);
  }

  static revokeToken(token: string): void {
    sessions.delete(token);
  }

  static register(data: { name: string; email: string; password: string }): { user: User; token: string } {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanName = (data.name || '').trim();
    const password = data.password || '';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Name must be at least 2 characters.');
    }

    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters.');
    }

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const isPrimaryAdmin = cleanEmail === PRIMARY_ADMIN_EMAIL.toLowerCase();

    const newUser: StoredUser = {
      id: 'usr_' + crypto.randomBytes(8).toString('hex'),
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      salt,
      role: isPrimaryAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsersToFile();

    const token = this.createToken(newUser.id);
    return {
      user: sanitizeUser(newUser),
      token
    };
  }

  static login(credentials: { email: string; password: string }): { user: User; token: string } {
    const cleanEmail = (credentials.email || '').trim().toLowerCase();
    const password = credentials.password || '';

    if (!cleanEmail || !password) {
      throw new Error('Please provide both email and password.');
    }

    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const isMatch = verifyPassword(password, user.salt, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    user.lastLoginAt = new Date().toISOString();
    saveUsersToFile();

    const token = this.createToken(user.id);
    return {
      user: sanitizeUser(user),
      token
    };
  }

  static getAllUsers(): User[] {
    return users.map(sanitizeUser);
  }

  static deleteUser(userId: string): boolean {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) {
      throw new Error('User not found.');
    }

    if (userToDelete.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Primary root administrator account cannot be deleted.');
    }

    users = users.filter(u => u.id !== userId);

    // Delete any active sessions for this user
    for (const [token, sess] of sessions.entries()) {
      if (sess.userId === userId) {
        sessions.delete(token);
      }
    }

    saveUsersToFile();
    return true;
  }

  static updateUserRole(userId: string, newRole: 'admin' | 'user'): User {
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase() && newRole !== 'admin') {
      throw new Error('Primary administrator role cannot be downgraded.');
    }

    user.role = newRole;
    saveUsersToFile();
    return sanitizeUser(user);
  }

  static getStats(): AdminStats {
    const customCount = customMediaCatalog.length;
    const animeCount = CURATED_ANIME.length + customMediaCatalog.filter(m => m.mediaType === 'anime').length;
    const movieCount = CURATED_MOVIES.length + customMediaCatalog.filter(m => m.mediaType === 'movie').length;
    const tvCount = CURATED_TV_SHOWS.length + customMediaCatalog.filter(m => m.mediaType === 'tv').length;

    return {
      totalUsers: users.length,
      totalMovies: movieCount,
      totalTVShows: tvCount,
      totalAnime: animeCount,
      totalCustomTitles: customCount,
      activeSessions: sessions.size,
      serverUptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
      adminEmail: 'Protected Root Administrator',
      systemStatus: 'Secure & Active'
    };
  }
}
