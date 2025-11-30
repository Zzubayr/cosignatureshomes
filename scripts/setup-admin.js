// Setup Admin User Script
// Run this script to create the first admin user in Firebase

const admin = require('firebase-admin');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Try to load service account key
let serviceAccount;
const keyPath = path.join(__dirname, './firebase-admin-key.json');

if (fs.existsSync(keyPath)) {
    serviceAccount = require(keyPath);
} else {
    console.error('❌ firebase-admin-key.json not found!');
    console.log('📝 Please download your Firebase service account key:');
    console.log('   1. Go to Firebase Console > Project Settings > Service Accounts');
    console.log('   2. Click "Generate new private key"');
    console.log('   3. Save as firebase-admin-key.json in the project root');
    process.exit(1);
}

// Initialize Firebase Admin
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://your-project-id.firebaseio.com' // Replace with your project URL
    });
    console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    process.exit(1);
}

const auth = admin.auth();
const db = admin.firestore();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function setupAdmin() {
    console.log('🔧 CO Signature Homes - Admin Setup');
    console.log('=====================================\n');

    try {
        // Get admin details
        const email = await askQuestion('Enter admin email: ');
        const password = await askQuestion('Enter admin password (min 6 characters): ');
        const displayName = await askQuestion('Enter admin display name: ');

        console.log('\n🔄 Creating admin user...');

        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: displayName,
            emailVerified: true
        });

        console.log('✅ Admin user created in Firebase Auth');

        // Create user document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: email,
            displayName: displayName,
            photoURL: null,
            phone: null,
            role: 'admin', // This is the key field that makes them an admin
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            preferences: {
                notifications: true,
                emailUpdates: true,
                theme: 'dark'
            }
        });

        console.log('✅ Admin user document created in Firestore');

        // Set custom claims for admin role
        await auth.setCustomUserClaims(userRecord.uid, { admin: true });

        console.log('✅ Admin claims set');

        console.log('\n🎉 Admin setup complete!');
        console.log('=====================================');
        console.log(`Admin UID: ${userRecord.uid}`);
        console.log(`Admin Email: ${email}`);
        console.log(`Admin Name: ${displayName}`);
        console.log('Role: admin');
        console.log('\n📝 The admin can now:');
        console.log('- Access /admin dashboard');
        console.log('- View all bookings');
        console.log('- Confirm/cancel bookings');
        console.log('- Manage user accounts');
        console.log('- Oversee all operations');

    } catch (error) {
        console.error('❌ Error setting up admin:', error.message);
    } finally {
        rl.close();
        process.exit(0);
    }
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

// Run the setup
setupAdmin();
