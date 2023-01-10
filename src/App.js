import React, { useState, useEffect, useRef } from 'react';
import './App.css';


function App() {
  const speed = useRef(50);
  const stackDFS = useRef([]);
  const queueBFS = useRef([]);
  const [bitmap, setBitmap] = useState([]);
  const [algorithm, setAlgorithm] = useState("DFS");
  const [algOption, setAlgOption] = useState("hidden");
  const [speedOption, setSpeedOption] = useState("hidden");
  const [toolsOption, setToolsOption] = useState("hidden");
  const [bitmapOption, setBitmapOption] = useState("hidden");
  const [startButton, setStartButton] = useState("Start!");
  const startPersist = useRef("Start!");
  const [origin, setOrigin] = useState(272);
  const [target, setTarget] = useState(816);
  const [walls, setWalls] = useState([]);
  const [pathHead, setPathHead] = useState(-1);
  const path = useRef([]);
  const [tool, setTool] = useState("");
  const mouseHeld = useRef("up");
  useEffect(() => {
    GenerateBitmap();
  }, [origin, target, walls, path.current, pathHead, tool]);
  useEffect(() => {
    if (startButton !== "Stop!") { return; }
    else if (algorithm === "DFS" && path.current.length === 0) { DFS(origin); }
    else if (algorithm === "DFS") { DFS(path.current[path.current.length - 1]); }
    else if (algorithm === "BFS" && path.current.length === 0) { BFS(origin); }
    else if (algorithm === "BFS") { BFS(path.current[path.current.length - 1]); }
  }, [startButton]);
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
    if (startButton !== "Start!" || tool === "") { return; }
    else if (tool === "Move Origin" && path.current.length !== 0) { return; }
    else if (tool === "Move Origin" && bitIndex !== target && !walls.includes(bitIndex) && path.current.length === 0) { setOrigin(bitIndex); }
    else if (tool === "Move Target" && bitIndex !== origin && !walls.includes(bitIndex) && !path.current.includes(bitIndex)) { setTarget(bitIndex); }
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


  async function DFS(currentBit) {
    function stackPush(item) { stackDFS.current = [...stackDFS.current, item]; };
    if (stackDFS.current.length === 0) { stackPush(currentBit); };
    let topItem = -1;
    while (stackDFS.current.length) {
      await sleep(speed.current);
      if (startPersist.current === "Start!") { break; }
      let lastIndex = stackDFS.current.length - 1;
      topItem = stackDFS.current[lastIndex];
      stackDFS.current = stackDFS.current.slice(0, lastIndex);
      if (walls.includes(topItem)) { continue; }
      setPathHead(topItem);
      if (topItem === target) { break; }
      path.current = [...path.current, topItem];
      if (topItem % 33 > 0 && EmptyBit(topItem - 1, path.current)) { stackPush(topItem - 1); };
      if (topItem < 1056 && EmptyBit(topItem + 33, path.current)) { stackPush(topItem + 33); };
      if (topItem % 33 < 32 && EmptyBit(topItem + 1, path.current)) { stackPush(topItem + 1); };
      if (topItem > 32 && EmptyBit(topItem - 33, path.current)) { stackPush(topItem - 33); };
    };
    if (path.current.indexOf(undefined) > -1 || path.current.length === 0) { path.current = []; return; }
    else if (topItem === target || stackDFS.current.length === 0) { setStartButton("Clear Path!"); };
  };


  async function BFS(currentBit) {
    function queueAppend(item) { queueBFS.current = [...queueBFS.current, item]; };
    if (queueBFS.current.length === 0) { queueAppend(currentBit); };
    let nextItem = -1;
    while (queueBFS.length !== 0) {
      await sleep(speed.current)
      if (startPersist.current === "Start!") { break; }
      let lastIndex = queueBFS.current.length - 1;
      nextItem = queueBFS.current[0];
      queueBFS.current = queueBFS.current.slice(1, lastIndex + 1);
      if (walls.includes(nextItem)) { continue; }
      setPathHead(nextItem);
      if (nextItem === target) { break; }
      path.current = [...path.current, nextItem];
      if (nextItem > 32 && EmptyBit(nextItem - 33) && !queueBFS.current.includes(nextItem - 33)) queueAppend(nextItem - 33);
      if (nextItem % 33 < 32 && EmptyBit(nextItem + 1) && !queueBFS.current.includes(nextItem + 1)) queueAppend(nextItem + 1);
      if (nextItem < 1056 && EmptyBit(nextItem + 33) && !queueBFS.current.includes(nextItem + 33)) queueAppend(nextItem + 33);
      if (nextItem % 33 > 0 && EmptyBit(nextItem - 1) && !queueBFS.current.includes(nextItem - 1)) queueAppend(nextItem - 1);
    }
    if (path.current.indexOf(undefined) > -1 || path.current.length === 0) { path.current = []; return; }
    else if (nextItem === target || queueBFS.current.length === 0) { setStartButton("Clear Path!"); };
  }


  function GenerateBitmap() {
    let generatedBits = [];
    for (let bitIndex = 0; bitIndex < 1089; bitIndex++) {
        generatedBits.push(
          <div id="Bit" 
            onMouseEnter={() => { Draw(bitIndex, "drag"); }} 
            onMouseDown={() => { Draw(bitIndex, "click"); }} 
            style={{backgroundColor: 
              (bitIndex === pathHead) ? "green" : 
              (bitIndex === origin || path.current.includes(bitIndex)) ? "rgb(120, 210, 130)" : 
              (bitIndex === target) ? "rgb(210, 120, 130)" :
              (walls.includes(bitIndex) ? "rgb(40, 40, 40)" : "rgb(40, 100, 140)")
            }}>
          </div>
        );
    };
    setBitmap(generatedBits);
  };


  function CleanBitmap(coverage) {
    if (coverage === "full") {
      setOrigin(288);
      setTarget(800);
      setWalls([]);
    }
    startPersist.current = "Start!"; 
    setStartButton("Start!"); 
    stackDFS.current = [];
    queueBFS.current = [];
    path.current = [];
    setPathHead(-1);
  }


  function ChangeButton() {
    if (startPersist.current === "Stop!" ) { startPersist.current = "Start!"; }
    else { startPersist.current = "Stop!"; };
    if (startButton === "Start!") { setStartButton("Stop!"); }
    else if (startButton === "Stop!") { setStartButton("Start!"); }
    else { CleanBitmap("partial"); };
  };


  function ToggleCategory(state, setFunction) {
    let categories = [setAlgOption, setSpeedOption, setToolsOption, setBitmapOption];
    for (let index = 0; index < 4; index++) {
      categories[index]("hidden");
    };
    (state === "hidden") ? setFunction("visible") : setFunction("hidden");
  };

  return (
    <div className="App">
      <div id="Header">
        <div id="HeaderTitle" onMouseEnter={() => { mouseHeld.current = false; }}>
          Pathfinding Visualized
        </div>
        <div id="Categories">
          <div className="Category" 
            onClick={() => {ToggleCategory(algOption, setAlgOption)}}>
            Algorithms
            <div className="Option" 
              onClick={() => { setAlgorithm("DFS"); CleanBitmap("partial"); }}
              style={{visibility: algOption}}>
              DFS
            </div>
            <div className="Option" 
              onClick={() => { setAlgorithm("BFS"); CleanBitmap("partial"); }}
              style={{visibility: algOption}}>
              BFS
            </div>
            <div className="Dummy"
              style={{visibility: algOption}}>
              .
            </div>
          </div>
          <div className="Category" 
            onClick={() => {ToggleCategory(speedOption, setSpeedOption)}}>
            Speed
            <div className="Option" 
              onClick={() => { speed.current = 1000; }}
              style={{visibility: speedOption}}>
              Slow
            </div>
            <div className="Option" 
              onClick={() => { speed.current = 50; }}
              style={{visibility: speedOption}}>
              Medium
            </div>
            <div className="Option" 
              onClick={() => { speed.current = 1; }}
              style={{visibility: speedOption}}>
              Fast
            </div>
          </div>
          <div className="Category" onClick={() => {ToggleCategory(toolsOption, setToolsOption)}}>
            Tools
            <div className="Option" 
              onClick={() => { setTool("Move Origin"); }}
              style={{visibility: toolsOption}}>
              Move Origin
            </div>
            <div className="Option" 
              onClick={() => { setTool("Move Target"); }}
              style={{visibility: toolsOption}}>
              Move Target
            </div>
            <div className="Option" 
              onClick={() => { setTool("Place Walls"); }}
              style={{visibility: toolsOption}}>
              Place Walls
            </div>
            <div className="Option" 
              onClick={() => { setTool("Erase Walls"); }}
              style={{visibility: toolsOption}}>
              Erase Walls
            </div>
          </div>
          <div className="Category" 
            onClick={() => {ToggleCategory(bitmapOption, setBitmapOption)}}>
            Bitmap
            <div className="Option" 
              onClick={() => { CleanBitmap("partial"); }}
              style={{visibility: bitmapOption}}>
              Clear Path
            </div>
            <div className="Option" 
              onClick={() => { CleanBitmap("full"); }}
              style={{visibility: bitmapOption}}>
              Reset Bitmap
            </div>
          </div>
        </div>
      </div>
      <div id="StartStop" 
        onClick={() => { ChangeButton(); }} 
        style={{backgroundColor: (startButton === "Start!") ? "green" : 
                                 (startButton === "Stop!") ? "red" : "grey"}}>
        {startButton}
      </div>
      <div id="Key"></div>
      <div id="BitmapContainer">
        {bitmap}
      </div> 
    </div>
  );
} 

export default App;

