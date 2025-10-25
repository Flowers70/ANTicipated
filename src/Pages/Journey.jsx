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

        const P1 = { 
            top: (startStep.top - wrapperRect.top), 
            right: (startStep.right - wrapperRect.left), 
            left: (startStep.left - wrapperRect.left), 
            bottom: (startStep.bottom - wrapperRect.top)
        };

        let P2;

        const P3 = { 
            top: (endStep.top - wrapperRect.top),
            right: (endStep.right - wrapperRect.left),
            bottom: (endStep.bottom - wrapperRect.top),
            left: (endStep.left - wrapperRect.left)
        };

        let C1, C2, C3, C4;

        let pathStart;
        let pathEnd;

        const middleV = (path) => {
            return ((path.bottom - path.top)/2 + path.top);
        }

        let offsetX = 100;


        if((i+1) % 2 == 1){ // Middle
            pathStart = { x: P1.left, y: middleV(P1) };
            pathEnd = { x: P3.left, y : middleV(P3) };

            let offsetY = ((pathEnd.y - pathStart.y)/2 + pathStart.y);

            // Path Middle
            if(P1.left < P3.left){ // Child is to the right
                P2 = {x: (pathStart.x - offsetX), y: offsetY};
            }else{ //Child is to the left
                P2 = {x: (pathEnd.x - offsetX), y: offsetY};
            }

            // Control point for segment P1 -> P2
            C1 = { x: pathStart.x - 75, y: pathStart.y};
            C2 = { x: P2.x, y: P2.y - 50};

            // Control point for segment P2 -> P3
            C3 = { x: C2.x, y: P2.y + 50};
            C4 = { x: pathEnd.x - 75, y: pathEnd.y};

        }else{
            pathStart = { x: P1.right, y: middleV(P1) };
            pathEnd = { x: P3.right, y : middleV(P3) };

            let offsetY = ((pathEnd.y - pathStart.y)/2 + pathStart.y);

            // Path Middle
            if(P1.right < P3.right){ // Child is to the right
                P2 = {x: (P3.right + offsetX), y: offsetY};
            }else{ //Child is to the left
                P2 = {x: (P1.right + offsetX), y: offsetY};
            }

            // Control point for segment P1 -> P2
            C1 = { x: pathStart.x + 75, y: pathStart.y};
            C2 = { x: P2.x, y: P2.y - 50};

            // Control point for segment P2 -> P3
            C3 = { x: C2.x, y: P2.y + 50};
            C4 = { x: pathEnd.x + 75, y: pathEnd.y};

        }

        // const C1 = { x: P1.x + offset, y: P1.y };
        // const C2 = { x: P2.x - offset, y: P2.y };

        // svgPath += `
        //     M ${pathStart.x} ${pathStart.y}
        //     C ${C1.x} ${C1.y}, ${C2.x} ${C2.y}, 
        //     ${pathEnd.x} ${pathEnd.y}
        // `;

        svgPath += `
            M ${pathStart.x} ${pathStart.y}
            C ${C1.x} ${C1.y}, ${C2.x} ${C2.y}, ${P2.x} ${P2.y}
            C ${C3.x} ${C3.y}, ${C4.x} ${C4.y}, ${pathEnd.x} ${pathEnd.y}
        `;


        console.log("Start:", P1.x, P1.y);
        console.log("Curve A:", C1.x, C1.y);
        console.log("Curve B:", C2.x, C2.y);
        console.log("End:", P2.x, P2.y);
    }

    document.querySelector('.journey-path').setAttribute('d', svgPath);
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