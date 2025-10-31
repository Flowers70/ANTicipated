const admin = require("firebase-admin");

if(!admin.apps.length){
  const secretKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  try{
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: secretKey
    };
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
  } catch(error){
    console.error('🔥 Firebase Admin initialization error:', error.stack);
  }
}

// Export Services
const db = admin.firestore();
const adminAuth = admin.auth(); // Used for token verification

module.exports = {
  db,
  adminAuth
}