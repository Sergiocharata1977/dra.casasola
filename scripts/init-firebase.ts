/**
 * Script para inicializar las colecciones de Firebase con datos de ejemplo
 * Ejecutar con: node --loader ts-node/esm scripts/init-firebase.ts
 * O con: npx tsx scripts/init-firebase.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA3pNpCpesmqghB80o_jcE7_MMO9DdbtXQ",
    authDomain: "lla-landding.firebaseapp.com",
    projectId: "lla-landding",
    storageBucket: "lla-landding.firebasestorage.app",
    messagingSenderId: "262584332366",
    appId: "1:262584332366:web:0256a8bfdfc917e411931f",
    measurementId: "G-PB7H228XTZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeCollections() {
    console.log('🚀 Inicializando colecciones de Firebase...\n');

    try {
        // ============ USERS ============
        console.log('📝 Creando colección "users"...');
        const usersData = [
            {
                email: 'admin@lla-sudoeste.com',
                displayName: 'Administrador',
                role: 'admin',
                phone: '+54 9 11 1234-5678',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                email: 'editor@lla-sudoeste.com',
                displayName: 'Editor de Contenido',
                role: 'editor',
                phone: '+54 9 11 8765-4321',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        ];

        for (const user of usersData) {
            const docRef = await addDoc(collection(db, 'users'), user);
            console.log(`  ✅ Usuario creado: ${user.displayName} (${docRef.id})`);
        }

        // ============ NOTICIAS ============
        console.log('\n📰 Creando colección "noticias"...');
        const noticiasData = [
            {
                title: 'La Libertad Avanza en el Sudoeste del Chaco',
                content: 'En un evento histórico para la región, La Libertad Avanza presentó sus propuestas para el desarrollo del Sudoeste del Chaco. El encuentro contó con la participación de vecinos, comerciantes y productores locales que expresaron su apoyo a las ideas de libertad económica y reducción del gasto público.',
                summary: 'Presentación de propuestas para el desarrollo regional',
                imageUrl: '/images/news/lla-sudoeste-1.jpg',
                author: 'Redacción LLA Sudoeste',
                published: true,
                publishedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: ['política', 'desarrollo', 'economía']
            },
            {
                title: 'Reunión con Productores Agropecuarios',
                content: 'Representantes de La Libertad Avanza se reunieron con productores agropecuarios de la zona para escuchar sus necesidades y proponer soluciones concretas. Los temas principales fueron la reducción de impuestos, la eliminación de trabas burocráticas y el fomento de la libre competencia.',
                summary: 'Diálogo con el sector productivo de la región',
                imageUrl: '/images/news/productores.jpg',
                author: 'Redacción LLA Sudoeste',
                published: true,
                publishedAt: new Date(Date.now() - 86400000).toISOString(), // Ayer
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                tags: ['agro', 'productores', 'economía']
            },
            {
                title: 'Próxima Asamblea Partidaria',
                content: 'Borrador de noticia sobre la próxima asamblea partidaria. Contenido pendiente de completar.',
                summary: 'Información sobre la próxima asamblea',
                author: 'Editor de Contenido',
                published: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: ['partido', 'asamblea']
            }
        ];

        for (const noticia of noticiasData) {
            const docRef = await addDoc(collection(db, 'noticias'), noticia);
            console.log(`  ✅ Noticia creada: ${noticia.title} (${docRef.id})`);
        }

        // ============ EVENTOS ============
        console.log('\n📅 Creando colección "eventos"...');
        const eventosData = [
            {
                title: 'Encuentro con Vecinos - Villa Ángela',
                description: 'Reunión abierta con vecinos de Villa Ángela para discutir propuestas y escuchar las necesidades de la comunidad. Habrá espacio para preguntas y debate.',
                location: 'Plaza Central de Villa Ángela',
                startDate: new Date(Date.now() + 7 * 86400000).toISOString(), // En 7 días
                endDate: new Date(Date.now() + 7 * 86400000 + 7200000).toISOString(), // 2 horas después
                imageUrl: '/images/events/encuentro-villa-angela.jpg',
                organizer: 'LLA Sudoeste Chaco',
                capacity: 200,
                isPublic: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                title: 'Charla sobre Libertad Económica',
                description: 'Charla educativa sobre los principios de la libertad económica y cómo aplicarlos en el desarrollo regional. Abierto a todo público.',
                location: 'Centro Cultural Municipal',
                startDate: new Date(Date.now() + 14 * 86400000).toISOString(), // En 14 días
                endDate: new Date(Date.now() + 14 * 86400000 + 10800000).toISOString(), // 3 horas después
                imageUrl: '/images/events/charla-economia.jpg',
                organizer: 'LLA Sudoeste Chaco',
                capacity: 150,
                isPublic: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                title: 'Asamblea Interna del Partido',
                description: 'Asamblea interna para miembros del partido. Se tratarán temas organizativos y estratégicos.',
                location: 'Sede partidaria',
                startDate: new Date(Date.now() + 3 * 86400000).toISOString(), // En 3 días
                imageUrl: '/images/events/asamblea.jpg',
                organizer: 'Comisión Directiva',
                capacity: 50,
                isPublic: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        ];

        for (const evento of eventosData) {
            const docRef = await addDoc(collection(db, 'eventos'), evento);
            console.log(`  ✅ Evento creado: ${evento.title} (${docRef.id})`);
        }

        console.log('\n✨ ¡Inicialización completada exitosamente!\n');
        console.log('📊 Resumen:');
        console.log(`   - ${usersData.length} usuarios creados`);
        console.log(`   - ${noticiasData.length} noticias creadas`);
        console.log(`   - ${eventosData.length} eventos creados`);
        console.log('\n🔗 Puedes ver las colecciones en: https://console.firebase.google.com/project/lla-landding/firestore');

    } catch (error) {
        console.error('❌ Error al inicializar colecciones:', error);
        process.exit(1);
    }

    process.exit(0);
}

initializeCollections();
