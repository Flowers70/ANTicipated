import Header from "../Components/Header";
import { useAuth } from "../Contexts/AuthContext";
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

import './Setup.css';
import { useNavigate } from "react-router-dom";

export default function Setup(){
    const { currentUserProfile, updateProfileState } = useAuth();
    const navigate = useNavigate();

    const handleSetup = async () => {
        const dreamJobsInput = document.getElementById("dreamJob").value;
        const currentSkillsInput = document.getElementById("currentSkills").value;

        const dreamJobsA = dreamJobsInput.split(", ");
        const currentSkillsA = currentSkillsInput.split(", ");

        // 1. Get a reference to the user's document using their UID
        const knowledgeBaseRef = doc(db, "knowledge-base", currentUserProfile.uid);
            
        // 2. Attempt to fetch the document
        const knowledgeBaseDoc = await getDoc(knowledgeBaseRef);

        if(knowledgeBaseDoc.exists()){
            // Update
            await updateDoc(knowledgeBaseRef, {
                dreamJobs: dreamJobsA,
                currentSkills: currentSkillsA
            });
        }else{
            // Create
            await setDoc(knowledgeBaseRef, {
                uid: currentUserProfile.uid,
                dreamJobs: dreamJobsA,
                currentSkills: currentSkillsA
            });

            await updateDoc(doc(db, "users", currentUserProfile.uid), {
                completedSetup: true
            });

            updateProfileState({
                ...currentUserProfile, // Keep existing profile data
                completedSetup: true   // Force the new value
            });

        }

        navigate("/");
    }

    return(
        <div className="setup">
            <Header/>
            <div className="form">
                <h3>Hello {currentUserProfile.displayName}</h3>
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