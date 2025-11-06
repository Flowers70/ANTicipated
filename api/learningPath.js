import {db, adminAuth} from './utils/firebaseAdmin.cjs';
import { performSearch } from './utils/performSearch.js';

// const {db, adminAuth} = require("./utils/firebaseAdmin.cjs");

function getDaysData(learningData){
    const todaysMidnight = new Date().setHours(0, 0, 0, 0);
    const todaysContent = learningData.days.filter(day => {
        // 1. Convert the Firestore Timestamp (day.date) to a JS Date object.
        const dayDate = Object.prototype.toString.call(day.date) !== "[object Date]" ? day.date.toDate() : day.date; 
        
        // 2. Strip the time from the day's date and get its numeric value.
        const dayMidnightTime = dayDate.setHours(0, 0, 0, 0); 
        
        // 3. Compare the two numeric timestamps.
        return dayMidnightTime === todaysMidnight;
    })[0];

    return todaysContent;
}

// This is like the Controller in MVC terms

export default async function handler(req, res){
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or malformed.' });
    }

    const idToken = authHeader.split("Bearer ")[1];
    let userId;

    try{
        const token = await adminAuth.verifyIdToken(idToken);
        userId = token.uid;
    } catch(error){
        return res.status(401).send();
    }

    const { dreamJob, skills } = req.body;
    if (!dreamJob || !skills) {
        return res.status(400).json({ error: 'Missing required fields: dreamJob or skills.' });
    }

    const today = new Date();
    const learningPathsRef = db.collection("learningPaths").doc(userId);

    let learningPath = await learningPathsRef.get();

    if(learningPath.exists){
        const learningPath_data = learningPath.data();
        const endDate = learningPath_data.endDate.toDate();

        learningPath_data.endDate = endDate;
        learningPath_data.startDate = learningPath_data.startDate.toDate();

        if(endDate >= today){
            // Path is still active: send it and stop execution
            const todaysContent = getDaysData(learningPath_data);
            return res.status(200).json({ learningJourney: todaysContent });
        }
    }

    try {

        const allSkills = skills.map(skill => skill.name);
        const nmbrSkills = allSkills.length;

        let Queries = [];

        if(nmbrSkills == 0){
            console.log("No skills recorded to learn");
            Queries =  [
                `"Learn" how to be a ${dreamJob}`, 
                `Skills to be a successful ${dreamJob}`,
                `${dreamJob} "learn"`,
                `${dreamJob} tips and advice`
            ];
        }else if(nmbrSkills == 1){
            Queries = [
                `${dreamJob} "learn" "${allSkills[0]}"`,
                `${dreamJob} Everything to know about "${allSkills[nmbrSkills-1]}"`,
                `${dreamJob} "${allSkills[0]}" "tutorial"`,
                `${dreamJob} "${allSkills[0]}" "learn"`
            ];
        }else{
            Queries = [
                `${dreamJob} "learn" "${allSkills[0]}"`,
                `${dreamJob} "${allSkills[0]}"`,
                `${dreamJob} "learn" "${allSkills[1]}"`,
                `${dreamJob} ${allSkills[1]} "learn"`,
            ]
        }

        let skillsPlanned = [];

        for(let i = 0; i < 6; i++){
            skillsPlanned.push(performSearch(Queries[i%4]));
        }

        // const skillsPlanned = Queries.map(query => {
        //     return performSearch(query);
        // });

        const searchResults = await Promise.all([...skillsPlanned]);

        let web = [];
        let video = [];

        searchResults.forEach(resultObj => {
            web.push(...resultObj.webResults);
            video.push(...resultObj.videoResults);
        })

        const getPageInfo = (page) => {
            return {
                "title": page.title,
                "url": page.link
            }
        }

        const getVidInfo = (vid) => {
            return {
                "title": vid.snippet.title,
                "url": vid.id.videoId
            }
        }

        const today = new Date();
        const endDate_D = new Date(today);

        endDate_D.setDate(today.getDate() + 7);

        let learningJourneyA = {
            startDate: today,
            endDate: endDate_D,
            days: []
        }

        for(let i = 0; i < 7; i++){
            let pages_forTheDay = web.splice(0, 3);
            let vids_forTheDay = video.splice(0, 4);

            let pages = pages_forTheDay.map(page => getPageInfo(page));
            let vids = vids_forTheDay.map(vid => getVidInfo(vid));

            const newDate = new Date(today);
            newDate.setDate(today.getDate() + i);

            let day = {
                date: newDate,
                webResources: pages,
                videoResources: vids
            }

            learningJourneyA["days"].push(day);
        }

        // Maybe make it return with something like { highlights: {web: {}, vid: {}}, days: [{vid}, {page}, {vid}, {page}, {vid}] }

        // For now, let's just return raw results to confirm search works:
        await learningPathsRef.set(learningJourneyA)
        learningPath = getDaysData(learningJourneyA);
        return res.status(200).json({ status: 'Path needed and search successful', learningJourney: learningPath });
        

    } catch (searchError) {
        console.error('Search or Generation Failed:', searchError.message);
        const defaultJourney = db.collection("learningPaths").doc("default");
        const defaultPath = await defaultJourney.get();

        const today = new Date();
        const defaultData = defaultPath.data().days[today.getDay()];
        return res.status(500).json({ error: 'Failed to generate learning path due to external API error.', learningJourney: defaultData});
    }

    // 5. **STORAGE AND FINAL RESPONSE** (When complete, this will write to Firestore)
    // ...

}