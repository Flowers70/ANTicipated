import { useEffect, useRef, useState } from 'react';
import { useLayoutEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import Header from './Header';
import './Hero.css';

export default function Hero({highlights}){
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

    const firstDivRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if(firstDivRef.current){
            const width = firstDivRef.current.offsetWidth;
            setWidth(width);
        }
    }, [highlights]);

    return (
        <>
            <div className='hero'>
                <div className='frame10'>
                    <div className='left'>
                        <div ref={firstDivRef} className='width-determiner'>
                            {/* Site Logo and Title */}
                            <Header/>

                            {/* Profile Card */}
                            <Card/>
                        </div>                    

                        <a href={highlights?.page?.url ?? ""} target="_blank">
                            <button style={{width}} href={highlights?.page?.url ?? ""}>
                                <span className='half-opacity'>Web Page of the Day:</span>
                                <span>{highlights?.page?.title ?? "loading..."}</span>
                            </button>
                        </a>
                    </div>
                    <div className='right'>
                        <div className='vid-name'>
                            <h2 className='half-opacity'>Video of the Day:</h2>
                            <h2>{highlights?.vid?.title ?? "loading..."}</h2>
                        </div>          
                        <div className='yt-video'>
                            <iframe src={`https://www.youtube.com/embed/${highlights?.vid?.url ?? ""}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>        
            </div>
        </>
    )
}