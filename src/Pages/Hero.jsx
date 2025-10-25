import './Hero.css';

export default function Hero(){
    function Header(){
        return (
            <div className='logo-title'>
                <img className='flip-ant' src="ant_005.png"></img>
                <div>
                    <h1>ANTicipated</h1>
                    <h2>Curated learning for your career growth</h2>
                </div>
            </div>
        )
    }

    function Card(){
        return (
            <div className='profile-card'>
                <div className='frame4'>
                    <div>
                    <h2>Hello Mary!</h2>
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
                    <div className='yt-video'></div>
                    </div>
                </div>        
            </div>
        </>
    )
}