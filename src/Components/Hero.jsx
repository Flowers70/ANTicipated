import { useAuth } from '../Contexts/AuthContext';
import Header from './Header';
import './Hero.css';

export default function Hero(){
    const { currentUser } = useAuth();

    function Card(){
        return (
            <div className='profile-card'>
                <div className='frame4'>
                    <div>
                    <h2>Hello {currentUser.displayName}!</h2>
                    <div>
                        <h3>Your top skills:</h3>
                        <ul>
                        <li>JavaScript</li>
                        <li>CSS</li>
                        <li>Angular</li>
                        </ul>
                        <h3>Skills In-Progress</h3>
                        <ul>
                        <li>iOS</li>
                        <li>App Development</li>
                        <li>Spring Boot</li>
                        </ul>
                    </div>
                    </div>
                    <img src="Progress_100.png"></img>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='hero'>
                <div className='frame10'>
                    <div className='left'>
                    {/* Site Logo and Title */}
                    <Header/>

                    {/* Profile Card */}
                    <Card/>

                    <button>
                        <span className='half-opacity'>Web Page of the Day:</span>
                        <span>Learn to become an iOS developer</span>
                    </button>
                    </div>
                    <div className='right'>
                    <div>
                        <h2 className='half-opacity'>Video of the Day:</h2>
                        <h2>How I learned iOS Development in 30 Days? 0 to Pro!</h2>
                    </div>          
                    <div className='yt-video'>
                        <iframe src="https://www.youtube.com/embed/CuB3dg8F3sY?si=fU_H1udQhyGG04rj" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </div>
                    </div>
                </div>        
            </div>
        </>
    )
}