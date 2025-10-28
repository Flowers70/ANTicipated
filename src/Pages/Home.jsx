import Hero from '../Components/Hero';
import Journey from '../Components/Journey';
import Learning_Recap from '../Components/Learning_Recap';
import Skills from '../Components/Skills';

import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogOut from '../Components/LogOut';


export default function Home(){
    const { currentUser } = useAuth();
    
    console.log(currentUser.displayName);
    return (
        <>
            <Hero/>
            <div className='line'></div>

            <Journey>
            <div>Watch iOS Video</div>
            <div>Visit iOS Web Page</div>
            <div>Do iOS Project</div>
            <div>Watch App Development Video</div>
            <div>Visit App Development Web Page</div>
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