import Hero from '../Components/Hero';
import Journey from '../Components/Journey';
import Learning_Recap from '../Components/Learning_Recap';
import Skills from '../Components/Skills';

import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogOut from '../Components/LogOut';
import { useEffect } from 'react';

import { getDreamJob, getSkills } from '../Services/firestoreServices';
import { useState } from 'react';
import Modal from '../Components/Modal';


export default function Home(){
    const { currentUser, currentUserProfile, loading } = useAuth();
    const [highlights, setHighlights] = useState(null);
    const [learningJourney, setLearningJourney] = useState([]);
    const [learnings, setLearnings] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (content) => {
        console.log("Opening Modal");
        setModalContent(content);
        console.log("SET");
        setIsModalOpen(true);
        console.log("isModalOpen:", isModalOpen);
    }

    const closeModal = () => setIsModalOpen(false);
    
    console.log(currentUser.displayName);

    useEffect(() => {
        if(currentUserProfile && !loading){

            try{
                const retrieveSkills = async () => {
                    const inProgress = await getSkills(currentUserProfile.uid, false);
                    console.log("Skills obtained (home):", inProgress);
                    return inProgress;
                }

                const retrieveDreamJobs = async () => {
                    console.log("CurrentUser:", currentUserProfile.uid);
                    const inProgress = await getDreamJob(currentUserProfile.uid);
                    console.log("DREAM:", inProgress);
                    return inProgress.name;
                }
        
                const sendRequest = async () => {
                    const userSkills = await retrieveSkills();    
                    const userToken = await currentUser.getIdToken();
                    const dreamJobs = await retrieveDreamJobs();
                    console.log("Sent dream:", dreamJobs);
    
                    const response = await fetch('/api/learningPath', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Send the token in the Authorization header
                            'Authorization': `Bearer ${userToken}`, 
                        },
                        body: JSON.stringify({ 
                            dreamJob: dreamJobs, 
                            // Ensure skills is sent as an array of objects, as expected by your server code
                            skills: userSkills, // e.g., [{ name: "Python" }, { name: "SQL" }]
                        }),
                    });

                const populateContents = async () => {
                    console.log("API Response:", data);
                    // let todaysJourney = data.learningJourney.days.filter(day => new Date((day.date._seconds *1000)) === new Date());
                    let todaysJourney = data.learningJourney;
                    console.log("VIEWING:", todaysJourney);

                    let pages = [];
                    let vids = [];

                    todaysJourney.webResources.forEach(page => pages.push(page));
                    todaysJourney.videoResources.forEach(vid => vids.push(vid));

                    // Generate Learning Recap
                    const learningRecap_response = await fetch('/api/learningRecap', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Send the token in the Authorization header
                            'Authorization': `Bearer ${userToken}`, 
                        },
                        body: JSON.stringify({ 
                            pages
                        }),
                    });

                    const learningRecap_data = await learningRecap_response.json();
                    setLearnings(learningRecap_data);

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
                }
        
                const data = await response.json();
        
                    if (response.ok) {
                        await populateContents();
                    } else {
                        console.error("API Error:", data.error || "Unknown error");
                        await populateContents();
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

            <Learning_Recap learnings={learnings} />
            <div className='line'></div>

            <Skills openModal={openModal} />

            <LogOut/>

            <a className='attribution' href="https://www.vecteezy.com/free-vector/ant" target="_blank">Ant Vectors by Vecteezy</a>
        
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {modalContent}
            </Modal>
        </>
    );
}