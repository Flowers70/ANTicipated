import { useEffect } from "react";
import "./Journey.css";

function Draw_Journey(){
    const steps = document.querySelectorAll(".step");
    let svgPath = '';

    const wrapper = document.querySelector('.journey-lines');
    const wrapperRect = wrapper.getBoundingClientRect();

    console.log("Bouding Box:", wrapperRect.top, wrapperRect.right, wrapperRect.bottom, wrapperRect.left);

    let right = false;

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

        let gap = 10;

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
        console.log("Part", i+1);
        console.log("X:", pathStart.x, "->", C1.x, "->", C2.x, "->", "*"+P2.x, "->", C3.x, "->", C4.x, "->", pathEnd.x);
        console.log("Y:", pathStart.y, "->", C1.y, "->", C2.y, "->", "*"+P2.y, "->", C3.y, "->", C4.y, "->", pathEnd.y);
        console.log()

        const arrow_size = 16;

        svgPath += `
            M ${pathStart.x} ${pathStart.y}
            C ${C1.x} ${C1.y}, ${C2.x} ${C2.y}, ${P2.x} ${P2.y}
            C ${C3.x} ${C3.y}, ${C4.x} ${C4.y}, ${pathEnd.x} ${pathEnd.y}
            M ${pathEnd.x} ${pathEnd.y} L ${middle ? pathEnd.x - arrow_size : pathEnd.x + arrow_size} ${pathEnd.y - arrow_size}
            M ${pathEnd.x} ${pathEnd.y} L ${middle ? pathEnd.x - arrow_size : pathEnd.x + arrow_size} ${pathEnd.y + arrow_size}
        `;

        // const curveOffset = curvature * Math.sqrt(dx*dx + dy*dy);

        
        // svgPath += `
        //     M ${pathStart.x} ${pathStart.y}
        //     C ${C1.x} ${C1.y}, ${C2.x} ${C2.y}, ${P2.x} ${P2.y}
        //     C ${C3.x} ${C3.y}, ${C4.x} ${C4.y}, ${pathEnd.x} ${pathEnd.y}
        // `;
        
    }

    document.querySelector('.journey-path').setAttribute('d', svgPath);
    console.log("\n");
}

export default function Journey(){

    useEffect(() => {
        Draw_Journey();
    }, []);

    return (
        <div className='learning-journey'>
            <h2>Your Learning Journey for Today</h2>
            <div className="journey">
                <svg className="journey-lines">
                    <path className="journey-path" />
                    </svg>
                <div className="step">Watch iOS Video</div>
                <div className="step right">Visit iOS Web Page</div>
                <div className="step">Do iOS Project</div>
                <div className="step left">Watch App Development Video</div>
                <div className="step">Visit App Development Web Page</div>
            </div>
        </div>
    )
}