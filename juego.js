/*********** CONST VALUES ***********/

const HEIGHT = 10;
const WIDTH = 10;
const GRID_ID = "grid";
const GREEN_COLOR_RGB = "rgb(0, 255, 0)";
const GREEN_COLOR_HEX = "#0F0";
const WHITE_COLOR_HEX = "#FFF";


/*********** PROGRAM VARIABLES ***********/

var grid = document.getElementById(GRID_ID);
var slider = document.getElementById("slider");
var cellMatrix = [];

var cellsNeighbors = [];
var intervalId;

/*********** CONST FUNCTIONS ***********/

const createGrid = () =>{
    for (let externalIterator = 0; externalIterator < HEIGHT; externalIterator++) {
        let row = grid.insertRow();
        let matrixRow = [];
        for (let internalIterator = 0; internalIterator < WIDTH; internalIterator++) {
          let cell = row.insertCell();
          let text = document.createTextNode("");
          cell.appendChild(text);
          matrixRow.push(cell);
        }
        cellMatrix.push(matrixRow);
    }
}

const fillNeighborsMatrix = () => {
    for(let i = 0; i < HEIGHT; i++){
        for(let j = 0; j < WIDTH; j++){
            let cellNeighbors = getNeighbors(i, j);
            cellsNeighbors.push(cellNeighbors);
        }
    }
}

const getNeighbors = (rowIndex, columIndex) => {
    let neighbors = [];
    for(let rowItr = Math.max(0, rowIndex - 1); rowItr <= Math.min(rowIndex + 1, HEIGHT - 1); rowItr++){
        for(let colItr = Math.max(0, columIndex - 1); colItr <= Math.min(columIndex + 1, WIDTH - 1); colItr++){
            if(rowItr !== rowIndex || colItr !== columIndex){
                //console.log(rowItr, colItr);
                neighbors.push(cellMatrix[rowItr][colItr]);
            }
        }
    }
    return neighbors;
}

const clearGrid = () => {
    for(let row of cellMatrix){
        for(let cell of row){
            cell.style.backgroundColor = WHITE_COLOR_HEX;
        }
    }
}

const step = () => {
    let nextState = [];
    for(let rowItr = 0; rowItr < HEIGHT; rowItr++){
        for(let colItr = 0; colItr < WIDTH; colItr++){
            let neighborsArrayIndex = rowItr * HEIGHT  + colItr;
            let neighbors = cellsNeighbors[neighborsArrayIndex];
            let aliveNeighbors = getCountAliveNeighbors(neighbors);
            
            let currentCell = cellMatrix[rowItr][colItr];

            if(currentCell.style.backgroundColor == GREEN_COLOR_RGB){ // CASE 1
                if((aliveNeighbors < 2 || aliveNeighbors > 3)){
                    nextState.push(WHITE_COLOR_HEX);
                    continue;
                }
                nextState.push(GREEN_COLOR_HEX);
                continue;
            } else {
                if(aliveNeighbors == 3){
                    nextState.push(GREEN_COLOR_HEX);
                    continue;
                }
            }
            nextState.push(WHITE_COLOR_HEX);
        }
    }
    setNextState(nextState);
}

const run = () => {
    document.getElementById("stepButton").disabled = true;
    document.getElementById("runButton").disabled = true;
    document.getElementById("clearButton").disabled = true;
    intervalId = setInterval(function(){
        step();
    }, slider.value)
}


const stop = () => {
    document.getElementById("clearButton").disabled = false;
    document.getElementById("runButton").disabled = false;
    document.getElementById("stepButton").disabled = false;
    clearInterval(intervalId);
}

const getCountAliveNeighbors = (neighbors) => {
    let aliveNeighbors = neighbors.reduce(function (result, neighbor) {
    if(neighbor.style.backgroundColor == GREEN_COLOR_RGB){
        return result + 1;
    }
    return result;
    }, 0);
    return aliveNeighbors;
}

const setNextState = (state) => {
    stateIndex = 0;

    for(let rowItr = 0; rowItr < HEIGHT; rowItr++){
        for(let colItr = 0; colItr < WIDTH; colItr++){
            let currentCell = cellMatrix[rowItr][colItr];
            currentCell.style.backgroundColor = state[stateIndex];
            stateIndex++;
        }
    }
}

const changeCellState = (cell) =>{
    if(cell.style.backgroundColor == GREEN_COLOR_RGB){
        cell.style.backgroundColor = WHITE_COLOR_HEX;
    } else {
        cell.style.backgroundColor = GREEN_COLOR_HEX;
    }
}


const changeSimulationSpeed = () =>{
    clearInterval(intervalId);
    intervalId = setInterval(function(){
        step();
    }, slider.value)
}


/*********** INIT ***********/

createGrid();
fillNeighborsMatrix();

// Add event listener to each cell
document.querySelectorAll(`#${GRID_ID} td`)
.forEach(e => e.addEventListener("click", function(){
    changeCellState(e);
}));

// Add event listener to clear button
document.getElementById("clearButton").addEventListener("click", clearGrid);

// Add event listener to step button
document.getElementById("stepButton").addEventListener("click", step);

// Add event listener to run button
document.getElementById("runButton").addEventListener("click", run);

// Add event listener to stop button
document.getElementById("stopButton").addEventListener("click", stop);

// Add event listener to slider
document.getElementById("slider").addEventListener("click", changeSimulationSpeed);