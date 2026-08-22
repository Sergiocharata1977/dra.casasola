/**
 * Fuente unica de verdad de la identidad editorial.
 *
 * El nombre juega con la "pauta oficial": No Pauta es la revista que no la
 * recibe, y por eso el lema la explica. Masthead, header, footer, metadata y
 * OpenGraph leen de aca, asi que cambiar la marca es cambiar este objeto.
 */
export const siteConfig = {
    tipo: 'Revista',
    marca: 'No Pauta',
    nombreCompleto: 'Revista No Pauta',
    lema: 'El periodismo que no se puede comprar',
    descripcion:
        'Revista No Pauta. Periodismo independiente del Chaco: politica, economia, sociedad, judiciales, cultura y opinion.',
    url: 'https://revistanopauta.vercel.app',
    locale: 'es_AR',
    ciudad: 'Charata, Chaco',
    email: 'redaccion@revistanopauta.com.ar',
    fundado: 2026,
} as const;

export type SeccionSlug =
    | 'editorial'
    | 'politica'
    | 'economia'
    | 'sociedad'
    | 'judiciales'
    | 'regionales'
    | 'cultura'
    | 'deportes'
    | 'opinion';

export type Seccion = {
    slug: SeccionSlug;
    nombre: string;
    /** Se muestra como bajada en la portada de seccion. */
    descripcion: string;
    /** Aparece en la barra de navegacion principal. */
    enNav: boolean;
};

export const secciones: Seccion[] = [
    {
        slug: 'politica',
        nombre: 'Politica',
        descripcion: 'Poder, gestion publica y la disputa por las decisiones que afectan a todos.',
        enNav: true,
    },
    {
        slug: 'economia',
        nombre: 'Economia',
        descripcion: 'Precios, produccion, trabajo y el impacto real de las medidas economicas.',
        enNav: true,
    },
    {
        slug: 'sociedad',
        nombre: 'Sociedad',
        descripcion: 'Salud, educacion, seguridad y la vida cotidiana de la gente.',
        enNav: true,
    },
    {
        slug: 'judiciales',
        nombre: 'Judiciales',
        descripcion: 'Causas, fallos y el funcionamiento del sistema de justicia.',
        enNav: true,
    },
    {
        slug: 'regionales',
        nombre: 'Regionales',
        descripcion: 'Lo que pasa en el interior del Chaco y en el sudoeste chaqueno.',
        enNav: true,
    },
    {
        slug: 'cultura',
        nombre: 'Cultura',
        descripcion: 'Libros, musica, artes visuales y la produccion cultural de la region.',
        enNav: true,
    },
    {
        slug: 'deportes',
        nombre: 'Deportes',
        descripcion: 'Competencia, clubes y protagonistas del deporte local.',
        enNav: true,
    },
    {
        slug: 'editorial',
        nombre: 'Editorial',
        descripcion:
            'La posicion de la revista. A diferencia de Opinion, aca no habla un columnista: habla No Pauta.',
        enNav: true,
    },
    {
        slug: 'opinion',
        nombre: 'Opinion',
        descripcion: 'Columnas firmadas. Las ideas son de quien las firma.',
        enNav: true,
    },
];

export const seccionesNav = secciones.filter((s) => s.enNav);

export function getSeccion(slug: string): Seccion | undefined {
    return secciones.find((s) => s.slug === slug);
}

export function nombreSeccion(slug?: string): string {
    if (!slug) return 'Actualidad';
    return getSeccion(slug)?.nombre ?? 'Actualidad';
}
