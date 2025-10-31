import Hero from '../Components/Hero';
import Journey from '../Components/Journey';
import Learning_Recap from '../Components/Learning_Recap';
import Skills from '../Components/Skills';

import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogOut from '../Components/LogOut';
import { useEffect } from 'react';

import { getSkills } from '../Services/firestoreServices';
import { useState } from 'react';


export default function Home(){
    const { currentUser, currentUserProfile, loading } = useAuth();
    const [highlights, setHighlights] = useState(null);
    const [learningJourney, setLearningJourney] = useState([]);
    
    console.log(currentUser.displayName);

    useEffect(() => {
        if(currentUserProfile && !loading){

            try{
                const retrieveSkills = async () => {
                    const inProgress = await getSkills(currentUserProfile.uid, false);
                    console.log("Skills obtained (home):", inProgress);
                    return inProgress;
                }
        
                const sendRequest = async () => {
                    const userSkills = await retrieveSkills();    
                    const userToken = await currentUser.getIdToken();
    
                    const response = await fetch('/api/learningPath', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Send the token in the Authorization header
                            'Authorization': `Bearer ${userToken}`, 
                        },
                        body: JSON.stringify({ 
                            dreamJob: "Software Engineer", 
                            // Ensure skills is sent as an array of objects, as expected by your server code
                            skills: userSkills, // e.g., [{ name: "Python" }, { name: "SQL" }]
                        }),
                    });
        
                    const data = await response.json();
        
                    if (response.ok) {
                        console.log("API Response:", data);
                        // let todaysJourney = data.learningJourney.days.filter(day => new Date((day.date._seconds *1000)) === new Date());
                        let todaysJourney = data.learningJourney;
                        console.log("VIEWING:", todaysJourney);

                        let pages = [];
                        let vids = [];

                        todaysJourney.webResources.forEach(page => pages.push(page));
                        todaysJourney.videoResources.forEach(vid => vids.push(vid));

                        let highlight = {
                            page: pages.splice(0, 1)[0],
                            vid: vids.splice(0, 1)[0]
                        }

                        setHighlights(highlight);
                        console.log("Highlights LOADED");

                        let learningContent = [];
                        for(let i = 0; i < vids.length; i++){
                            if(i < vids.length){
                                vids[i].url = "https://www.youtube.com/watch?v=" + vids[i].url;
                                learningContent.push(vids[i]);
                            }

                            if(i < pages.length){
                                learningContent.push(pages[i]);
                            }                            
                        }
                        setLearningJourney(learningContent);
                        // SUCCESS! data.searchResults contains the raw Google/YouTube data.
                        // You can now inspect this structure to build your 7-day formatter.
                    } else {
                        console.error("API Error:", data.error || "Unknown error");
                    }
                }
    
                sendRequest();
            } catch(error){
                console.log("ERROR (API):", error);
            }
            
        }
    }, [currentUserProfile, loading]);

    return (
        <>
            <Hero highlights={highlights} />
            <div className='line'></div>

            <Journey>
            {
                learningJourney.map((resource, index) => {
                    return <a key={index} href={resource.url} target="_blank"><div>{resource.title}</div></a>
                })
            }
            {/* <div>Watch iOS Video</div>
            <div>Visit iOS Web Page</div>
            <div>Do iOS Project</div>
            <div>Watch App Development Video</div>
            <div>Visit App Development Web Page</div> */}
            </Journey>
            <div className='line'></div>

            <Learning_Recap/>
            <div className='line'></div>

            <Skills/>

            <LogOut/>

            <a className='attribution' href="https://www.vecteezy.com/free-vector/ant" target="_blank">Ant Vectors by Vecteezy</a>
        </>
    );
}