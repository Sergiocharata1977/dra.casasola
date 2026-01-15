/**
 * Script para crear usuarios en Firebase Authentication
 * Ejecutar con: npx tsx scripts/create-auth-users.ts
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

const users = [
    {
        email: 'sergio@empresa.com',
        password: 'Sergio123',
        displayName: 'Sergio',
        role: 'admin' as const,
        phone: '+54 9 11 1234-5678'
    },
    {
        email: 'roberto@empresa.com',
        password: 'Roberto123',
        displayName: 'Roberto',
        role: 'editor' as const,
        phone: '+54 9 11 8765-4321'
    }
];

async function createAuthUsers() {
    console.log('🚀 Creando usuarios en Firebase Authentication...\n');

    for (const userData of users) {
        try {
            // Crear usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            console.log(`✅ Usuario creado en Authentication: ${userData.email}`);
            console.log(`   UID: ${userCredential.user.uid}`);

            // Crear documento en Firestore con información adicional
            const now = new Date().toISOString();
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: userData.email,
                displayName: userData.displayName,
                role: userData.role,
                phone: userData.phone,
                isActive: true,
                createdAt: now,
                updatedAt: now,
            });

            console.log(`✅ Documento creado en Firestore para: ${userData.email}\n`);

        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                console.log(`⚠️  El usuario ${userData.email} ya existe en Authentication`);
                console.log(`   Puedes iniciar sesión con la contraseña existente\n`);
            } else {
                console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
            }
        }
    }

    console.log('\n✨ Proceso completado!\n');
    console.log('📋 Credenciales de acceso:');
    console.log('─────────────────────────────────────────');
    users.forEach(u => {
        console.log(`Email:    ${u.email}`);
        console.log(`Password: ${u.password}`);
        console.log(`Rol:      ${u.role}`);
        console.log('─────────────────────────────────────────');
    });
    console.log('\n🔗 Iniciar sesión en: http://localhost:3000/login');

    process.exit(0);
}

createAuthUsers().catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
