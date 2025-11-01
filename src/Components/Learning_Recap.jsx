import { useState } from 'react';
import { useEffect } from 'react';
import './Learning_Recap.css';

export default function Learning_Recap({learnings}){
    const [learningRecapSummary, setLearningRecapSummary] = useState("");
    const recapSummarizer = async () => {
        if ('Summarizer' in self && learnings != []) {
            console.log("Summarizer found");
            // The Summarizer API is supported.
            const availability = await Summarizer.availability();
            if (availability === 'unavailable') {
                // The Summarizer API isn't usable.
                console.log("Summarizer is not available");
                return;
            }

            const options = {
                sharedContext: 'This is a scientific article',
                type: 'key-points',
                format: 'markdown',
                length: 'medium',
                monitor(m) {
                    m.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded * 100}%`);
                    });
                }
            }

            // Check for user activation.
            if (navigator.userActivation.isActive) {
                console.log("Active user");
                // Create an instance of a built-in API
                // Proceed to request batch or streaming summarization
                const summarizer = await Summarizer.create(options);

                const longText = learnings[0];
                console.log("Prompt:", longText);
                // const summary = await summarizer.summarize(longText, {
                // context: 'This article is intended for a tech-savvy audience.',
                // });

                let summary;
                summarizer.summarize(longText).then((summarized) => {
                    summary = summarized;
                    console.log("SUMMARY B:", summary);
                })

                console.log("SUMMARY:", summary);
            }
        }
    }
    // useEffect(() => {
        
        
    //     recapSummarizer();
    // }, [learnings])
    return(
        <div className='learning-recap'>
            <h2>Your Learning Recap</h2>
            <div className='recap'>             
                <button onClick={recapSummarizer}>Click Me!</button>
                {learningRecapSummary ?? "loading..."}
            </div>
        </div>
    );
}