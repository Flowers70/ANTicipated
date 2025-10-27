import GridContainer from '../Components/GridContainer';
import './Skills.css';
import Card from '../Components/Card';

export default function Skills(){
    return (
        <div className='all-skills'>
            <div className='section-title'>
                <h2>All Your Skills</h2>
                <img src="Edit.svg"></img>
            </div>
            <div className='section-content'>
                <GridContainer title="Completed">
                    <Card img="Progress_100.png" title="JavaScript" />
                    <Card img="Progress_100.png" title="CSS" />
                    <Card img="Progress_100.png" title="Angular" />
                    <Card img="Progress_100.png" title="Python" />
                </GridContainer>
                <GridContainer title="In Progress">
                    <Card img="Progress_50.svg" title="iOS" />
                    <Card img="Progress_30.svg" title="App Development" />
                    <Card img="Progress_10.svg" title="Spring Boot" />
                    <Card img="Progress_50.svg" title="iOS" />
                    <Card img="Progress_30.svg" title="App Development" />
                    <Card img="Progress_10.svg" title="Spring Boot" />
                </GridContainer>
            </div>
      </div>
    );
}