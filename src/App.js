import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [grid, setGrid] = useState([]);
  const [algorithm, setAlogirthm] = useState("DFS");
  const [algOpt, setAlgOpt] = useState("none");
  const [speedOpt, setSpeedOpt] = useState("none");
  const [toolsOpt, setToolsOpt] = useState("none");
  const [gridOpt, setGridOpt] = useState("none");
  const [startStop, setStartStop] = useState(["Start!", "green"]);
  const [origin, setOrigin] = useState(800);
  const [dest, setDest] = useState(288);
  const [path, setPath] = useState([]);
  const [barrier, setBarrier] = useState([]);
  useEffect(() => {
    GenerateGrid();
  }, [origin, dest, path, barrier]);
  useEffect(() => {
    if (startStop[0] === "Stop!" && algorithm === "DFS") {
      if (path.length > 0) DFS(path[path.length - 1]);
      else DFS(origin);
    };
  }, [startStop]);


  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );


  function PixelClicked(index) {
    if (index !== origin && index !== dest && !path.includes(index)) {
      setBarrier(barrier => [...barrier, index]);
      console.log(barrier); 
    };
  };


  function GenerateGrid() {
    let generatedPixels = [];
    for (let index = 0; index < 1089; index++) {
        generatedPixels.push(
          <div id="Pixel" onClick={() => {PixelClicked(index)}} 
            style={{backgroundColor: 
              (index === origin || path.includes(index)) ? "rgb(120, 210, 130)" : (index === dest) ? "rgb(210, 120, 130)" :
              (barrier.includes(index) ? "rgb(40, 40, 40)" : "rgb(40, 100, 140)")
            }}>
          </div>
        );
    };
    setGrid(generatedPixels);
    return generatedPixels;
  };


  function ToggleCategory(state, setFunction) {
    let categories = [setAlgOpt, setSpeedOpt, setToolsOpt, setGridOpt];
    for (let index = 0; index < 4; index++) {
      categories[index]("none");
    };
    (state === "none") ? setFunction("block") : setFunction("none");
  };


  function EmptyPixel(pixel) {
    if (!barrier.includes(pixel) && !path.includes(pixel)) return true;
    else return false;
  };


  async function DFS(pixel) {
    let stack = [pixel];
    while (stack.length !== 0 && stack[stack.length - 1] !== dest && startStop[0] === "Stop!") {
      await sleep(100);
      console.log(path);
      let current = stack.pop()
      setPath(path => [...path, current]);
      if (current % 33 > 0 && EmptyPixel(current - 1)) stack.push(current - 1);
      if (current < 1056 && EmptyPixel(current + 33)) stack.push(current + 33);
      if (current % 33 < 32 && EmptyPixel(current + 1)) stack.push(current + 1);
      if (current > 32 && EmptyPixel(current - 33)) stack.push(current - 33);
    };
  }  


  function StartStop() {
    (startStop[0] === "Start!") ? setStartStop(["Stop!", "red"]) : setStartStop(["Start!", "green"]);
  };
  

  return (
    <div className="App">
      <div id="Header">
        <div id="HeaderTitle">
          Pathfinding Visualized
        </div>
        <div id="Categories">
          <div className="Category" onClick={() => {ToggleCategory(algOpt, setAlgOpt)}}>
            Algorithms
          </div>
          <div className="Category" onClick={() => {ToggleCategory(speedOpt, setSpeedOpt)}}>
            Speed
          </div>
          <div className="Category" onClick={() => {ToggleCategory(toolsOpt, setToolsOpt)}}>
            Tools
          </div>
          <div className="Category" onClick={() => {ToggleCategory(gridOpt, setGridOpt)}}>
            Grid
          </div>
        </div>
      </div>
      <div id="StartStop" onClick={() => {StartStop()}} style={{backgroundColor: startStop[1]}}>
        {startStop[0]}
      </div>
      <div id="Key"></div>
      <div id="GridContainer">
        {grid}
      </div> 
    </div>
  );
} 

export default App;
