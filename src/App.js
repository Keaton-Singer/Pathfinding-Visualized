import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [grid, setGrid] = useState([]);
  const [algOpt, setAlgOpt] = useState("none");
  const [speedOpt, setSpeedOpt] = useState("none");
  const [toolsOpt, setToolsOpt] = useState("none");
  const [gridOpt, setGridOpt] = useState("none");
  const [startStop, setStartStop] = useState(["Start!", "green"]);
  const [origin, setOrigin] = useState(975);
  const [dest, setDest] = useState(49);
  const [barriers, setBarriers] = useState([]);
  useEffect(() => {GenerateGrid();}, [pixelClicked]);


  function pixelClicked(order) {
    return;
  }


  function GenerateGrid() {
    let generatedPixels = [];
    for (let index = 0; index < 2000; index++) {
        generatedPixels.push(
          <div id="Pixel" onMouseDown={() => {pixelClicked(index)}}></div>
        );
    };
    setGrid(generatedPixels);
    console.log(generatedPixels);
    return generatedPixels;
  };


  function ToggleCategory(state, setFunction) {
    let categories = [setAlgOpt, setSpeedOpt, setToolsOpt, setGridOpt];
    for (let index = 0; index < 4; index++) {
      categories[index]("none");
    };
    (state === "none") ? setFunction("block") : setFunction("none");
  };


  function StartStop() {
    (startStop[0] === "Start!") ? setStartStop(["Stop!", "red"]) : setStartStop(["Start!", "green"]);
  };


  return (
    <div className="App">
      <div id="Header">
        <div id="HeaderTitle">
          Algorithms Visualized
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
        <div id="OptionsContainer">
          <div className="Options" style={{display: algOpt}}>
            <div className="Option">
              DFS
            </div>
            <div className="Option">
              BFS
            </div>
          </div>
          <div className="Options" style={{display: speedOpt}}>
            <div className="Option">
              Slow
            </div>
            <div className="Option">
              Medium
            </div>
            <div className="Option">
              Fast
            </div>
          </div>
          <div className="Options" style={{display: toolsOpt}}>Algorithm</div>
          <div className="Options" style={{display: gridOpt}}>Grid</div>
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
