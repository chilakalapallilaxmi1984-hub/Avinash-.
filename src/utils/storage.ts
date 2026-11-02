import { VideoCreation, UserProfile } from '../types';

const DB_NAME = 'AvinashAIStudioDB';
const DB_VERSION = 1;
const STORE_VIDEOS = 'creations';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
        db.createObjectStore(STORE_VIDEOS, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVideoCreation(creation: VideoCreation): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_VIDEOS, 'readwrite');
    tx.objectStore(STORE_VIDEOS).put(creation);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllVideoCreations(): Promise<VideoCreation[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_VIDEOS, 'readonly');
      const req = tx.objectStore(STORE_VIDEOS).getAll();
      req.onsuccess = () => {
        const items = (req.result as VideoCreation[]) || [];
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function deleteVideoCreation(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_VIDEOS, 'readwrite');
    tx.objectStore(STORE_VIDEOS).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAllVideoCreations(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_VIDEOS, 'readwrite');
    tx.objectStore(STORE_VIDEOS).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

const USER_STORAGE_KEY = 'avinash_ai_user_profile_v1';

export function loadUserProfile(defaultAvatar: string): UserProfile {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as UserProfile;
    }
  } catch {
    // ignore storage parse issue
  }
  return {
    id: 'usr_avinash_creator',
    name: 'Avinash Studio Creator',
    email: 'creator@avinash.ai',
    avatarUrl: defaultAvatar,
    authMethod: 'guest',
    defaultQuality: '4K',
    defaultAspectRatio: '16:9',
    autoDownload4K: false,
    watermarkEnabled: false,
    privateGallery: true,
    savePromptHistory: true,
  };
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore storage quota errors
  }
}
