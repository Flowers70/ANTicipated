import React from 'react';
import './GridContainer.css';

export default function GridContainer(props){
    function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
    }

    const childArray = React.Children.toArray(props.children);
    const chunks = chunkArray(childArray, 3);

    return(
        <div className='skills-container'>
            <h2>{props.title}</h2>
            <div className='skills'>
                {chunks.map((chunk, index) => (
                    <div className='row'>
                        {chunk}
                    </div>
                ))}
            </div>
        </div>
    );
}