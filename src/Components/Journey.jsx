import React, { useEffect } from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import "./Journey.css";

function Draw_Journey(){
    const steps = document.querySelectorAll(".step");
    let svgPath = '';
    const pathTemplate = (path, id) => {
        return `<path id='segment-${id}' d='${path}'></path>`;
    }

    const imageSize_W = 53;
    const imageSize_H = 25;
    const antImg = (id) => { return `<image id='segment-pic-${id}' href='ant_005.png' preserveAspectRatio='none' width='${imageSize_W}px' height='${imageSize_H}px'></image>`};

    const wrapper = document.querySelector('.journey-lines');
    const wrapperRect = wrapper.getBoundingClientRect();
    wrapper.innerHTML = "";

    const gap = 10;
    const arrow_size = 12;

    const wrapperM = (wrapperRect.right - wrapperRect.left)/2;
    const firstStepTop = steps[0].getBoundingClientRect().top - wrapperRect.top - gap;

    svgPath = `M ${wrapperM} ${gap}
                L ${wrapperM} ${firstStepTop}`;

    svgPath += `M ${wrapperM} ${firstStepTop} 
                L ${wrapperM - arrow_size} ${firstStepTop - arrow_size}
                M ${wrapperM} ${firstStepTop} 
                L ${wrapperM + arrow_size} ${firstStepTop - arrow_size}`;

    let pathElement = pathTemplate(svgPath, 0);
    wrapper.innerHTML += pathElement;

    // steps.length - 1
    for(let i = 0; i < steps.length - 1; i++){
        const startStep = steps[i].getBoundingClientRect();
        const endStep = steps[i+1].getBoundingClientRect();

        const firstStep = { 
            top: (startStep.top - wrapperRect.top), 
            right: (startStep.right - wrapperRect.left), 
            left: (startStep.left - wrapperRect.left), 
            bottom: (startStep.bottom - wrapperRect.top)
        };

        const lastStep = { 
            top: (endStep.top - wrapperRect.top),
            right: (endStep.right - wrapperRect.left),
            bottom: (endStep.bottom - wrapperRect.top),
            left: (endStep.left - wrapperRect.left)
        };

        let pathStart, pathEnd;

        const stepVMiddle = (step) => {
            return ((step.bottom - step.top)/2 + step.top);
        }

        let middle = false;

        if((i+1) % 2 == 1){ // Odd (Middle)
            pathStart = { x: firstStep.left-gap, y: stepVMiddle(firstStep) };
            pathEnd = { x: lastStep.left-gap, y: stepVMiddle(lastStep) };
            middle = true;
        }else{
            pathStart = { x: firstStep.right+gap, y: stepVMiddle(firstStep) };
            pathEnd = { x: lastStep.right+gap, y: stepVMiddle(lastStep) };
        }        
        
        // Define vector between start and end
        // let dx = rightD ? 0 - Math.abs(pathEnd.x - pathStart.x) : Math.abs(pathEnd.x - pathStart.x);
        let dx = pathEnd.x - pathStart.x;

        let endDeterminesOffset = false;
        if(middle && firstStep.left > lastStep.left || !middle && firstStep.right < lastStep.right){
            dx = -1 * dx;
            endDeterminesOffset = true;
        }

        const dy = pathEnd.y - pathStart.y;

        const curvature = 0.5;
        let curveOffsetX = dx * curvature;
        // This will be the turning point of the "C" curve
        let P2 = {
            x: endDeterminesOffset ? pathEnd.x - curveOffsetX : pathStart.x - curveOffsetX,
            y: (pathStart.y + pathEnd.y)/2,
        };

        // Assuming child to the right
        const offsetWidth = endDeterminesOffset ? pathEnd.x - P2.x : pathStart.x - P2.x;


        // 1st curve handles
        const C1 = {
            x: P2.x + (endDeterminesOffset ? offsetWidth : offsetWidth*0.5),
            y: pathStart.y
        };
        const C2 = {
            x: middle ? P2.x + 0 : P2.x + 0,
            y: pathStart.y + dy * 0.15
        };

        // 2nd curve handles (mirror smooth)
        const C3 = {
            x: P2.x + (C2.x - P2.x),
            y: pathEnd.y - dy * 0.15
        };
        
        const C4 = {
            x: P2.x + (endDeterminesOffset ? offsetWidth*0.75 : offsetWidth*0.5),
            y: pathEnd.y
        };

        svgPath = `
            M ${pathStart.x} ${pathStart.y}
            C ${C1.x} ${C1.y}, ${C2.x} ${C2.y}, ${P2.x} ${P2.y}
            C ${C3.x} ${C3.y}, ${C4.x} ${C4.y}, ${pathEnd.x} ${pathEnd.y}
            M ${pathEnd.x} ${pathEnd.y} L ${middle ? pathEnd.x - arrow_size : pathEnd.x + arrow_size} ${pathEnd.y - arrow_size}
            M ${pathEnd.x} ${pathEnd.y} L ${middle ? pathEnd.x - arrow_size : pathEnd.x + arrow_size} ${pathEnd.y + arrow_size}
        `;

        let pathElement = pathTemplate(svgPath, i+1);
        wrapper.innerHTML += pathElement;
        wrapper.innerHTML += antImg(i+1);

    }
    
    // Add the ant pictures
    for(let i = 1; i <= steps.length - 1; i++){
        const lineElement = document.querySelector(`#segment-${i}`);
        const antImage = document.querySelector(`#segment-pic-${i}`);
        const totalLineLength = lineElement.getTotalLength();

        let antPosition;

        if(i%4 == 1 || i%4 == 2){
            antPosition = lineElement.getPointAtLength(totalLineLength);
        }else{
            antPosition = lineElement.getPointAtLength(0);
        }

        // antImage.setAttribute('x', antPosition.x - (imageSize / 2)); 
        // antImage.setAttribute('y', antPosition.y - imageSize);

        // const imageBound = antImage.getBBox();

        // if(i%4 == 3 || i%4 == 0){
        //     antImage.setAttribute('transform', `translate(${imageBound.x + imageBound.width}, 0) scale(-1, 1)`);
        // }

        // Flip horizontally or not
        const flip = (i % 4 === 1 || i % 4 === 0);
        const even = (i % 2 == 0);
        const firstTwo = (i % 4 === 1 || i % 4 === 2)
        const lineEdgeSpace = 16;

        // Compute the translation
        let transformStr = `translate(${!even ? antPosition.x - imageSize_W - lineEdgeSpace : antPosition.x + lineEdgeSpace}, 
            ${!firstTwo ? antPosition.y - imageSize_H : antPosition.y - imageSize_H - arrow_size})`; 
        if(flip){
            transformStr += ` translate(${imageSize_W}, 0) scale(-1, 1)`; // flip around left edge
        }

        antImage.setAttribute('transform', transformStr);

    }
}

export default function Journey({ children }){
    console.log("Journey effect running...");
    const containerRef = useRef(null);
    const [loadingSteps, setLoadingSteps] = useState(true);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if(!container){
            console.log("No container found");
            return;
        };

        console.log("Container ready:", container);

        const steps = container.querySelectorAll(".step");

        if(steps.length > 0){
            setLoadingSteps(false);
            Draw_Journey();
        }

        // if(React.Children.count(children) > 0){
        //     Draw_Journey();
        // }
    }, [children]);

    return (
        <div className='learning-journey'>
            <h2>Your Learning Journey for Today</h2>
            <div className="journey" ref={containerRef}>
                <svg className="journey-lines"></svg>
                {loadingSteps && <div className="loading">Loading your journey...</div>}
                {React.Children.map(children, (child, index) => {
                    const alternatingClass = (i) => {
                        i += 1;
                        if(i % 4 == 2){
                            return "right";
                        }else if(i % 4 == 0){
                            return "left";
                        }else{
                            return "";
                        }
                    }
                    return React.cloneElement(child, {
                        className: `step ${alternatingClass(index)}`
                    })
                })}
                
            </div>
        </div>
    )
}