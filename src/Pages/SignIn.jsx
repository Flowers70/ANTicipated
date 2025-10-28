// https://firebase.google.com/docs/auth/web/google-signin?authuser=2

import Header from '../Components/Header';
import './SignIn.css';

import { getAdditionalUserInfo, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from '../firebase'; // Import the initialized auth and provider
import { useEffect } from 'react';

import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function SignIn(){
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            const user = result.user;

            // 1. Get a reference to the user's document using their UID
            const userRef = doc(db, "users", user.uid);
            
            // 2. Attempt to fetch the document
            const userDoc = await getDoc(userRef);

            if(userDoc.exists()){
                // Returning user
                console.log("Welcome back, user document already exists.");
                await updateDoc(userRef, {
                    lastLogin: user.metadata.lastSignInTime, // Updates ONLY this field
                });

            }else{
                console.log("New user! Setting up profile...");

                // This line performs the write operation. 
                // If the 'users' collection doesn't exist yet, Firestore creates it.
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    createdAt: new Date(),
                    lastLogin: new Date(),
                    completedSetup: false
                });
            }

            // The user object is in result.user
            console.log("Sign-in successful!", result.user); 
            // After success, the Auth Listener (Step 3) will handle the redirect.
        } catch (error) {
            // Handle Errors here.
            console.error("Google Sign-In Error:", error.message);
        }
    };

    useEffect(() => {
        if(currentUser){
            navigate("/");
        }
    }, [currentUser, navigate]);

    return (
        <div className='sign-in'>
            <Header/>
            <div className='about-anticipate'>
                ANTicipated compiles free learning resources on valuable skills in a specific field to prepare job seekers for their dream job with help from an AI AssistANT. As a recent graduate, when viewing numerous job postings and repeatedly seeing valued skills that I did not have, my feeling of competence began to slide into doubt. ANTicipated aims to strengthen job seekers' confidence by rewarding them as they actively learn valuable skills relevant to their field of interest.
            </div>
            <button onClick={handleGoogleSignIn}>Sign-In</button>
        </div>
    )
}