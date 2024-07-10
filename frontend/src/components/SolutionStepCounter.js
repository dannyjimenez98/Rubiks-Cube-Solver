import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";

export function SolutionStepCounter({
  showPreviousMove,
  showCurrentMove,
  solution
}) 
{
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [start, setStart] = useState(false);

  const handleNext = () => {
    if (currentStepIndex < solution.length) {
        showCurrentMove(solution[currentStepIndex])
        setCurrentStepIndex(currentStepIndex + 1);
    }

};

const handlePrevious = () => {
    if (currentStepIndex === 1) {
        setCurrentStepIndex(0);
        showPreviousMove(solution[0])
        toggleStart()
    }
    else if (currentStepIndex > 0 & currentStepIndex !== 1) {
        showPreviousMove(solution[currentStepIndex-1])
        setCurrentStepIndex(currentStepIndex - 1);
    } 
    
};



const toggleStart = () => {
    if (!start) { 
        setStart(true) 
        showCurrentMove(solution[currentStepIndex])
        setCurrentStepIndex(currentStepIndex + 1);
    } else {
        setStart(false)
    }

}

  return (
  <div className="container-fluid">
    <div className="col-12 text-center">
        {start ? <h1 className="p-3">{solution[currentStepIndex - 1]}</h1> : <></>}
          
        <div className="col-12 d-flex justify-content-center">
          {currentStepIndex === 0
          ? 
          <div className="flex-column">
          <h1 className="p-3">{solution.length} total steps</h1>
          <Button onClick={toggleStart} disabled={start}>START SOLVING</Button>
          </div>
          : 
            <>
            <Button onClick={handlePrevious} disabled={start === false || currentStepIndex === 0}>Prev</Button>
            <h4 className="mx-3">({currentStepIndex}/{solution.length})</h4>
            <Button onClick={handleNext} disabled={!start || currentStepIndex === solution.length}>Next</Button>
            </>
          }
        </div>
        <div className="d-flex justify-content-center mt-2 p-2">
          {currentStepIndex === solution.length
          ? 
            <h2>SOLVED</h2>
            :
            <></>
          }
        </div>
    </div>
  </div>
    );
}
  