import { useState } from 'react';
import { useEffect } from 'react';
import './Learning_Recap.css';

import { marked} from 'marked';
import { useRef } from 'react';

export default function Learning_Recap({learnings}){
    const [learningRecapSummary, setLearningRecapSummary] = useState(null);
    const buttonRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleRecapGeneration = () => {
        buttonRef.current.disabled = true;
        setLoading(true);
        recapSummarizer();
    }

    const recapSummarizer = async () => {
        buttonRef.disabled = true;

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
                sharedContext: 'This is a learning article',
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
                    setLearningRecapSummary(marked.parse(summary));
                    console.log("SUMMARY B:", summary);
                }).catch(err => console.log("Summary FAILED:", err));
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
                {learningRecapSummary !== null ? <div dangerouslySetInnerHTML={{__html: learningRecapSummary}} /> : <button ref={buttonRef} onClick={handleRecapGeneration}>Generate Recap!</button>}
                {(learningRecapSummary === null && loading) ? <div>loading...</div> : ""}
                {/* {learningRecapSummary ?? "loading..."} */}
            </div>
        </div>
    );
}