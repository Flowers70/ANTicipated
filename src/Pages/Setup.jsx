import Header from "../Components/Header";
import { useAuth } from "../Contexts/AuthContext";
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';

import './Setup.css';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Setup(){
    const { currentUserProfile, updateProfileState } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If the profile data is loaded AND setup is complete, navigate to home
        if (currentUserProfile && currentUserProfile.completedSetup === true) {
            navigate('/'); 
        }
    }, [currentUserProfile, navigate]);

    const handleSetup = async () => {
        const dreamJobsInput = document.getElementById("dreamJob").value;
        const currentSkillsInput = document.getElementById("currentSkills").value;

        const dreamJobsA = dreamJobsInput.trim().split(", ");
        const currentSkillsA = currentSkillsInput.trim().split(", ");

        // 1. Get a reference to the user's document using their UID
        const userRef = doc(db, "users", currentUserProfile.uid);

        const skillRef = collection(userRef, "skills");
        const dreamJobRef = collection(userRef, "dreamJobs");

        const dreamJobPromises = dreamJobsA.map(jobName => {
            const newDreamJob = {
                name: jobName
            }

            return addDoc(dreamJobRef, newDreamJob);
        })

        const skillPromises = currentSkillsA.map(skillName => {
            const newSkill = {
                name: skillName,
                progress: 100,
                ranking: 1,
                complete: true
            }

            return addDoc(skillRef, newSkill);
        })

        try {
            await Promise.all([...dreamJobPromises, ...skillPromises]);

            await updateDoc(userRef, {
                completedSetup: true
            });
    
            updateProfileState({
                ...currentUserProfile, // Keep existing profile data
                completedSetup: true   // Force the new value
            });

            navigate("/");
        } catch(error){
            console.log("ERROR:", error);
        }

    }

    return(
        <div className="setup">
            <Header/>
            <div className="form">
                <h3>Hello {currentUserProfile?.displayName ?? "Anonymous"}</h3>
                <div className="value">
                    <label htmlFor="dreamJob">Enter your dream job title(s)</label>
                    <input id="dreamJob" type="text"></input>
                </div>
                <div className="value">
                    <label htmlFor="currentSkills">Enter your current skills (relevant to dream job(s))</label>
                    <input id="currentSkills" type="text"></input>
                </div>
                <button onClick={handleSetup}>Continue</button>              
            </div>
        </div>
    )
}