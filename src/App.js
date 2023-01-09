import React, { useState, useEffect, useRef } from 'react';
import './App.css';


function App() {
  const stackDFS = useRef([]);
  const [bitmap, setBitmap] = useState([]);
  const [algorithm, setAlogirthm] = useState("DFS");
  const [algOpt, setAlgOpt] = useState("none");
  const [speedOpt, setSpeedOpt] = useState("none");
  const [toolsOpt, setToolsOpt] = useState("none");
  const [gridOpt, setGridOpt] = useState("none");
  const [startStop, setStartStop] = useState(["Start!", "green"]);
  const startP = useRef("Start!");
  const [origin, setOrigin] = useState(288);
  const [target, setTarget] = useState(800);
  const [walls, setWalls] = useState([89, 90, 91, 92, 93, 94, 95]);
  const [pathHead, setPathHead] = useState(-1);
  const path = useRef([]);
  const [tool, setTool] = useState("Place Walls");
  const mouseHeld = useRef("up");
  useEffect(() => {
    GenerateBitmap();
  }, [origin, target, walls, stackDFS.current, path.current, pathHead]);
  useEffect(() => {
    // if (startStop[0] === "Stop!" && algorithm === "BFS") {
    //   if (path.current.length > 0) BFS(path.current[path.current.length - 1]);
    //   else BFS(origin);
    // };
    if (startStop[0] === "Stop!" && algorithm === "DFS") {
      if (path.current.length > 0) DFS(path.current[path.current.length - 1]);
      else DFS(origin);
    };
  }, [startStop]);
  window.addEventListener('mousedown', () => {
    mouseHeld.current = true;
  });
  window.addEventListener('mouseup', () => {
    mouseHeld.current = false;
  });


  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );


  function Draw(bitIndex, action) {
    if (action === "drag" && mouseHeld.current === false) { return; }
    if (startStop[0] !== "Start!" || tool === "" || path.current.length !== 0) { return; }
    else if (tool === "Move Origin" && bitIndex !== target && !walls.includes(bitIndex)) { setOrigin(bitIndex); }
    else if (tool === "Move Target" && bitIndex !== origin && !walls.includes(bitIndex)) { setTarget(bitIndex); }
    else if (bitIndex === origin || bitIndex === target) { return; }
    else if (tool === "Place Walls") { setWalls(walls => [...walls, bitIndex]); }
    else if (tool === "Erase Walls") {
      let wallsCopy = [...walls];
      wallsCopy = wallsCopy.filter((index) => { return index !== bitIndex; });
      setWalls([...wallsCopy]);
    };
  };


  function EmptyBit(bitIndex) {
    if (!walls.includes(bitIndex) && !path.current.includes(bitIndex)) { return true; };
    return false;
  };


  async function DFS(pixel) {
    function stackPush(item) { stackDFS.current = [...stackDFS.current, item]; };
    if (stackDFS.current.length === 0) { stackPush(pixel); };
    let topItem = -1;
    while (stackDFS.current.length && startP.current === "Stop!") {
      await sleep(1)
      let lastIndex = stackDFS.current.length - 1;
      topItem = stackDFS.current[lastIndex];
      stackDFS.current = stackDFS.current.slice(0, lastIndex);
      if (topItem === target) { setPathHead(topItem); break; }
      if (walls.includes(topItem)) { continue; }
      setPathHead(topItem);
      path.current = [...path.current, topItem];
      if (topItem % 33 > 0 && EmptyBit(topItem - 1, path.current)) { stackPush(topItem - 1); };
      if (topItem < 1056 && EmptyBit(topItem + 33, path.current)) { stackPush(topItem + 33); };
      if (topItem % 33 < 32 && EmptyBit(topItem + 1, path.current)) { stackPush(topItem + 1); };
      if (topItem > 32 && EmptyBit(topItem - 33, path.current)) { stackPush(topItem - 33); };
    };
    if (topItem === target) { setStartStop(["Clear Path!", "grey"]); }
    else { setStartStop(["Start!", "green"]); startP.current = "Start!"; };
  };


  // async function BFS(pixel) {
  //   let queue = [pixel];
  //   let pathCopy = path;
  //   while (queue.length !== 0) {
  //     let len = queue.length;
  //     for (let index = 0; index < len; index++) {
  //       await sleep(10)
  //       let current = queue.shift();
  //       if (current === dest) {
  //         setCurr("");
  //         return;
  //       }
  //       pathCopy.push(current);
  //       setPath(path => [...path, current]);
  //       setCurr(current);
  //       if (current % 33 > 0 && EmptyPixel(current - 1, pathCopy) && !queue.includes(current - 1)) queue.push(current - 1);
  //       if (current < 1056 && EmptyPixel(current + 33, pathCopy) && !queue.includes(current + 33)) queue.push(current + 33);
  //       if (current % 33 < 32 && EmptyPixel(current + 1, pathCopy) && !queue.includes(current + 1)) queue.push(current + 1);
  //       if (current > 32 && EmptyPixel(current - 33, pathCopy) && !queue.includes(current - 33)) queue.push(current - 33);
  //     }
  //   }
  //   setCurr("");
  // }


  function GenerateBitmap() {
    let generatedBits = [];
    for (let bitIndex = 0; bitIndex < 1089; bitIndex++) {
        generatedBits.push(
          <div id="Bit" 
            onMouseEnter={() => { Draw(bitIndex, "drag"); }} 
            onMouseDown={() => { Draw(bitIndex, "click"); }} 
            style={{backgroundColor: 
              (bitIndex === pathHead) ? "green" : (bitIndex === origin || path.current.includes(bitIndex)) ? "rgb(120, 210, 130)" : (bitIndex === target) ? "rgb(210, 120, 130)" :
              (walls.includes(bitIndex) ? "rgb(40, 40, 40)" : "rgb(40, 100, 140)")
            }}>
          </div>
        );
    };
    setBitmap(generatedBits);
  };


  function CleanBitmap(extent) {
    stackDFS.current = [];
    path.current = [];
    setPathHead(-1);
  }


  function StartStop() {
    if (startP.current === "Stop!" || startP.current === "Clear Path!") { startP.current = "Start!"; }
    else { startP.current = "Stop!"; }
    if (startStop[0] === "Start!") { setStartStop(["Stop!", "red"]); }
    else if (startStop[1] === "Stop!") { setStartStop(["Start!", "green"]); }
    else { setStartStop(["Start!", "green"]); }
  };
  


  function ToggleCategory(state, setFunction) {
    let categories = [setAlgOpt, setSpeedOpt, setToolsOpt, setGridOpt];
    for (let index = 0; index < 4; index++) {
      categories[index]("none");
    };
    (state === "none") ? setFunction("block") : setFunction("none");
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
      <div id="BitmapContainer">
        {bitmap}
      </div> 
    </div>
  );
} 

export default App;
