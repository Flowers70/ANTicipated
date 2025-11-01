// https://firebase.google.com/docs/auth/web/google-signin?authuser=2

import Header from '../Components/Header';
import './SignIn.css';

import { getAdditionalUserInfo, signInAnonymously, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from '../firebase'; // Import the initialized auth and provider
import { useEffect } from 'react';

import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

export default function SignIn(){
    const { currentUser, currentUserProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const successfulSignIn = async (user) => {
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
        setLoading(false);
         // The user object is in result.user
         console.log("Sign-in successful!"); 
    }

    const handleAnonSignIn = async () => {
        try{
            const result = await signInAnonymously(auth);
            const user = result.user;
            await successfulSignIn(user);
        } catch (error){
            console.error("Anonymous Sign-In Error:", error);
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            await successfulSignIn(user);
           
        } catch (error) {
            // Handle Errors here.
            console.error("Google Sign-In Error:", error.message);
        }
    };

    useEffect(() => {
        // Wait until loading is false and we have an authenticated user
        if (currentUser && !currentUserProfile && !loading) {
            // User is logged in, but we haven't fetched their profile yet (brief moment)
            return; 
        }
        
        if (currentUserProfile && currentUserProfile.completedSetup === false) {
            // Logged-in user needs to finish setup
            navigate("/setup");
        } else if (currentUserProfile && currentUserProfile.completedSetup === true) {
            // Logged-in user is done with setup
            navigate("/");
        }
    }, [currentUser, currentUserProfile, loading]);

    return (
        <div className='sign-in'>
            <Header/>
            <div className='about-anticipate'>
                ANTicipated compiles free learning resources on valuable skills in a specific field to prepare job seekers for their dream job with help from an AI AssistANT. As a recent graduate, when viewing numerous job postings and repeatedly seeing valued skills that I did not have, my feeling of competence began to slide into doubt. ANTicipated aims to strengthen job seekers' confidence by rewarding them as they actively learn valuable skills relevant to their field of interest.
            </div>
            <div className='options'>
                <button onClick={handleGoogleSignIn}>Sign-In</button>
                <button onClick={handleAnonSignIn}>*Sign-In as Guest</button>
            </div>            
            <div className='warning'>*Signing-In as a Guest means the information generated will not be saved.</div>
        </div>
    )
}