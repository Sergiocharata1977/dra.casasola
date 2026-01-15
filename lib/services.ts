import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, News, Event, Collaborator, Task } from './types';

// ============ USERS SERVICE ============
const usersCollection = collection(db, 'users');

export const UsersService = {
    async getAll(): Promise<User[]> {
        const q = query(usersCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    },

    async getById(id: string): Promise<User | null> {
        const docRef = doc(db, 'users', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as User;
    },

    async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const now = new Date().toISOString();
        const docRef = await addDoc(usersCollection, {
            ...data,
            createdAt: now,
            updatedAt: now,
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<User>): Promise<void> {
        const docRef = doc(db, 'users', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString(),
        });
    },

    async delete(id: string): Promise<void> {
        const docRef = doc(db, 'users', id);
        await deleteDoc(docRef);
    },
};

// ============ NEWS SERVICE ============
const newsCollection = collection(db, 'news');

export const NewsService = {
    async getAll(): Promise<News[]> {
        const q = query(newsCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
    },

    async getPublished(): Promise<News[]> {
        const q = query(newsCollection, where('published', '==', true), orderBy('publishedAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
    },

    async getById(id: string): Promise<News | null> {
        const docRef = doc(db, 'news', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as News;
    },

    async create(data: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const now = new Date().toISOString();
        const docRef = await addDoc(newsCollection, {
            ...data,
            createdAt: now,
            updatedAt: now,
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<News>): Promise<void> {
        const docRef = doc(db, 'news', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString(),
        });
    },

    async delete(id: string): Promise<void> {
        const docRef = doc(db, 'news', id);
        await deleteDoc(docRef);
    },
};

// ============ EVENTS SERVICE ============
const eventsCollection = collection(db, 'events');

export const EventsService = {
    async getAll(): Promise<Event[]> {
        const q = query(eventsCollection, orderBy('startDate', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    },

    async getUpcoming(): Promise<Event[]> {
        const now = new Date().toISOString();
        const q = query(eventsCollection, where('startDate', '>=', now), orderBy('startDate', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    },

    async getById(id: string): Promise<Event | null> {
        const docRef = doc(db, 'events', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as Event;
    },

    async create(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const now = new Date().toISOString();
        const docRef = await addDoc(eventsCollection, {
            ...data,
            createdAt: now,
            updatedAt: now,
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<Event>): Promise<void> {
        const docRef = doc(db, 'events', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString(),
        });
    },

    async delete(id: string): Promise<void> {
        const docRef = doc(db, 'events', id);
        await deleteDoc(docRef);
    },
};

// ============ COLLABORATORS SERVICE ============
const collaboratorsCollection = collection(db, 'collaborators');

export const CollaboratorsService = {
    async getAll(): Promise<Collaborator[]> {
        const q = query(collaboratorsCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Collaborator));
    },

    async getById(id: string): Promise<Collaborator | null> {
        const docRef = doc(db, 'collaborators', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as Collaborator;
    },

    async create(data: Omit<Collaborator, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const now = new Date().toISOString();
        const docRef = await addDoc(collaboratorsCollection, {
            ...data,
            createdAt: now,
            updatedAt: now,
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<Collaborator>): Promise<void> {
        const docRef = doc(db, 'collaborators', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString(),
        });
    },

    async delete(id: string): Promise<void> {
        const docRef = doc(db, 'collaborators', id);
        await deleteDoc(docRef);
    },
};

// ============ TASKS SERVICE ============
const tasksCollection = collection(db, 'tasks');

export const TasksService = {
    async getAll(): Promise<Task[]> {
        const q = query(tasksCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    },

    async getByStatus(status: Task['status']): Promise<Task[]> {
        const q = query(tasksCollection, where('status', '==', status), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    },

    async getById(id: string): Promise<Task | null> {
        const docRef = doc(db, 'tasks', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as Task;
    },

    async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const now = new Date().toISOString();
        const docRef = await addDoc(tasksCollection, {
            ...data,
            createdAt: now,
            updatedAt: now,
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<Task>): Promise<void> {
        const docRef = doc(db, 'tasks', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString(),
        });
    },

    async delete(id: string): Promise<void> {
        const docRef = doc(db, 'tasks', id);
        await deleteDoc(docRef);
    },
};
