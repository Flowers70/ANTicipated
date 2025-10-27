// https://firebase.google.com/docs/auth/web/google-signin?authuser=2

import Header from '../Components/Header';
import './SignIn.css';

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase'; // Import the initialized auth and provider
import { useEffect } from 'react';

import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignIn(){
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
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