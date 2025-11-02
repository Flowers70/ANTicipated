import GridContainer from '../Components/GridContainer';
import './Skills.css';
import Card from '../Components/Card';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { getSkills } from '../Services/firestoreServices';

export default function Skills({openModal}){
    const [completedSkills, setCompletedSkills] = useState([]);
    const [skillsInProgress, setSkillsInProgress] = useState([]);

    const { currentUserProfile, loading } = useAuth();

    const retrieveModal = () => {
        console.log("Edit clicked!");
        openModal(
            <div>
                <h2>Edit/Add Skill</h2>
                <input type="text"></input>
            </div>
        )
    }

    useEffect(() => {
        if(currentUserProfile && !loading){
            const retrieveSkills = async () => {
                const skillsList = await getSkills(currentUserProfile.uid, true);
                setCompletedSkills(skillsList);

                const inProgress = await getSkills(currentUserProfile.uid, false);
                setSkillsInProgress(inProgress);
            }
            retrieveSkills();
        }else if(!currentUserProfile && !loading){
            setCompletedSkills([]);
        }
    }, [currentUserProfile, loading]);

    return (
        <div className='all-skills'>
            <div className='section-title'>
                <h2>All Your Skills</h2>
                <img src="Edit.svg" onClick={retrieveModal}></img>
            </div>
            <div className='section-content'>
                <GridContainer title="Completed">
                    {completedSkills.map(skill => {
                        return <Card key={skill.id} data-skill-id={skill.id} img="Progress_100.png" title={skill.name}></Card>;
                    })}
                    {/* <Card img="Progress_100.png" title="JavaScript" />
                    <Card img="Progress_100.png" title="CSS" />
                    <Card img="Progress_100.png" title="Angular" />
                    <Card img="Progress_100.png" title="Python" /> */}
                </GridContainer>
                <GridContainer title="In Progress">
                    {skillsInProgress.map(skill => {
                        let progress_imgs = [0, 10, 30, 50, 80, 100];

                        let smallest = 100;
                        let smallest_img_i;
                        for(let i = 0; i < progress_imgs.length; i++){
                            if(Math.abs(skill.progress - progress_imgs[i]) <= smallest){
                                smallest = Math.abs(skill.progress - progress_imgs[i]);
                                smallest_img_i = i;
                            }
                        }

                        let progress_img = `Progress_${progress_imgs[smallest_img_i]}.svg`;

                        return <Card key={skill.id} data-skill-id={skill.id} img={progress_img} title={skill.name}></Card>
                    })}
                    {/* <Card img="Progress_50.svg" title="iOS" />
                    <Card img="Progress_30.svg" title="App Development" />
                    <Card img="Progress_10.svg" title="Spring Boot" />
                    <Card img="Progress_50.svg" title="iOS" />
                    <Card img="Progress_30.svg" title="App Development" />
                    <Card img="Progress_10.svg" title="Spring Boot" /> */}
                </GridContainer>
            </div>
      </div>
    );
}