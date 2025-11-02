import { collection, query, where, getDocs, doc, limit } from 'firebase/firestore';
import { db } from '../firebase';

async function getSkills(userId, completed=true){
    if (!userId) {
        console.error("Query aborted: User ID is required.");
        return [];
    }

    const userRef = doc(db, "users", userId);
    const skillsRef = collection(userRef, "skills");

    // 2. Build the query
    const completedSkillsQuery = query(
        skillsRef,
        where("complete", "==", completed)
    );
    
    // 3. Execute the query
    const querySnapshot = await getDocs(completedSkillsQuery);
    
    // 4. Map and return the results
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

async function getDreamJob(userId){
    if (!userId) {
        console.error("Query aborted: User ID is required.");
        return [];
    }

    const userRef = doc(db, "users", userId);
    const dreamJobsRef = collection(userRef, "dreamJobs");

    const queryDreams = query(
        dreamJobsRef,
        limit(1)
    );

    const dreamJobs = await getDocs(queryDreams);

    if(dreamJobs.empty){
        console.log("Dream jobs is EMPTY");
        return {
            name: "Software Engineer"
        }
    }

    const dreamData = {
        ...dreamJobs.docs[0].data()
    };

    return dreamData;
}

export {
    getSkills,
    getDreamJob
};