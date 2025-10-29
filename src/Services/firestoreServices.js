import { collection, query, where, getDocs, doc } from 'firebase/firestore';
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

export {getSkills};