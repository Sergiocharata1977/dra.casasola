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

/**
 * Jerarquia editorial: define que lugar ocupa la nota en la portada.
 * Reemplaza al viejo criterio de "ordenar por fecha".
 */
export type JerarquiaPortada =
    | 'apertura'    // nota principal, una sola por portada
    | 'destacada'   // bloque secundario con foto
    | 'breve'       // columna lateral de titulos
    | 'normal';     // solo aparece en su seccion y en /noticias

/**
 * Estado real de una nota, derivado de `published` + `publishedAt`.
 * No se guarda en Firestore: se calcula. Asi no puede quedar desincronizado.
 */
export type EstadoNota = 'borrador' | 'programada' | 'publicada';

export interface News {
    id: string;
    title: string;
    content: string;
    summary?: string;
    imageUrl?: string;
    author: string;
    published: boolean;
    /**
     * Momento en que la nota sale al aire. Puede estar en el futuro: en ese
     * caso la nota queda programada y no se muestra en ningun lado hasta esa
     * hora. Una nota sin este campo se considera ya salida: son las notas
     * viejas, cargadas antes de que existiera la programacion.
     */
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    tags?: string[];

    // ---- Campos editoriales (Revista No Pauta) ----
    /** Slug de seccion definido en lib/site-config.ts */
    seccion?: string;
    /** URL amigable: /noticias/independencia-periodistica */
    slug?: string;
    /** Volanta: linea corta que va ARRIBA del titulo. */
    volanta?: string;
    /** Bajada: parrafo de entrada que va DEBAJO del titulo. */
    bajada?: string;
    /** Epigrafe de la foto principal. */
    epigrafe?: string;
    /** Credito fotografico. */
    creditoFoto?: string;
    /** Cargo o rol del autor, para la firma. */
    autorCargo?: string;
    /** Posicion en la portada. Por defecto 'normal'. */
    jerarquia?: JerarquiaPortada;
    /** Orden manual dentro de la jerarquia (menor = mas arriba). */
    ordenPortada?: number;
    /** Marca la nota como columna de opinion firmada. */
    esOpinion?: boolean;
    /** Minutos estimados de lectura. */
    tiempoLectura?: number;

    /**
     * Video de la nota, alojado en Firebase Storage (carpeta news-video/).
     * Cuando esta cargado, el video reemplaza a la foto como pieza principal
     * de la nota y la foto pasa a usarse como caratula del reproductor.
     */
    videoUrl?: string;
    /** Epigrafe del video: que se ve y quien lo filmo. */
    videoEpigrafe?: string;
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
