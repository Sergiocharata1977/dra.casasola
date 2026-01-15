// Tipos para el sistema de usuarios
export interface User {
    id: string;
    email: string;
    displayName?: string;
    role: 'admin' | 'editor' | 'viewer';
    phone?: string;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
    isActive: boolean;
}

export interface News {
    id: string;
    title: string;
    content: string;
    summary?: string;
    imageUrl?: string;
    author: string;
    published: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    tags?: string[];
}

export interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate?: string;
    imageUrl?: string;
    organizer: string;
    capacity?: number;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Collaborator {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    department?: string;
    joinDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'backlog' | 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignee?: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}
