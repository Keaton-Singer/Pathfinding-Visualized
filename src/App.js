import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [grid, setGrid] = useState([]);
  useEffect(() => {GenerateGrid();}, []);

  function GenerateGrid() {
    let generatedPixels = [];
    for (let i = 0; i < 2000; i++) {
      generatedPixels.push(
        <div id="Pixel"></div>
      );
    };
    setGrid(generatedPixels);
    console.log(generatedPixels);
    return generatedPixels;
  };

  return (
    <div className="App">
      <div id="Header">
        <div id="HeaderTitle">
          Algorithms Visualized
        </div>
        <div id="OptionsPanel">
          <div id="Option">Algorithm</div>
          <div id="Option">Speed</div>
          <div id="Option">Grid</div>
          <div id="Option">Algorithm</div>
          <div id="Option">Algorithm</div>
        </div>
      </div>
      <div id="StartPause">Start</div>
      <div id="GridContainer">
        {grid}
      </div>
    </div>
  );
}

export default App;
