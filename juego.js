/*********** CONST VALUES ***********/

const HEIGHT = 50;
const WIDTH = 50;
const GRID_ID = "grid";
const SLIDER_ID = "slider";
const GREEN_COLOR_RGB = "rgb(0, 255, 0)";
const GREEN_COLOR_HEX = "#0F0";
const WHITE_COLOR_HEX = "#FFF";

/*** BUTTONS ***/
const CLEAR_BUTTON_ID = "clearButton";
const STEP_BUTTON_ID = "stepButton";
const RUN_BUTTON_ID = "runButton";
const STOP_BUTTON_ID = "stopButton";

/*********** PROGRAM VARIABLES ***********/

var grid = document.getElementById(GRID_ID);
var slider = document.getElementById(SLIDER_ID);

// It is an array that replicates the html collection
var cellMatrix = [];
// It is an array of neighbors of each cell
var neighboringCells = [];
// It is the intervalID, used to stop intervals
var intervalId;

/*********** CONST FUNCTIONS ***********/


// Create a complete grid
const createGrid = () =>{
    for (let rowIterator = 0; rowIterator < HEIGHT; rowIterator++) {
        // Its the row for the HTML element
        let row = grid.insertRow();
        // Its the row for the JS matrix
        let matrixRow = [];
        for (let columIterator = 0; columIterator < WIDTH; columIterator++) {
          // Its the cell for the HTML element
          let cell = row.insertCell();
          // Its the cell for the JS matrix
          matrixRow.push(cell);
        }
        cellMatrix.push(matrixRow);
    }
}


// Fill in the array of neighbors for each cell
const fillNeighborsArray = () => {
    for(let i = 0; i < HEIGHT; i++){
        for(let j = 0; j < WIDTH; j++){
            let cellNeighbors = getNeighbors(i, j);
            neighboringCells.push(cellNeighbors);
        }
    }
}

// Fill get the array of neighbors for an specific cell
const getNeighbors = (rowIndex, columIndex) => {
    let neighbors = [];
    for(let rowItr = Math.max(0, rowIndex - 1); rowItr <= Math.min(rowIndex + 1, HEIGHT - 1); rowItr++){
        for(let colItr = Math.max(0, columIndex - 1); colItr <= Math.min(columIndex + 1, WIDTH - 1); colItr++){
            if(rowItr !== rowIndex || colItr !== columIndex){
                neighbors.push(cellMatrix[rowItr][colItr]);
            }
        }
    }
    return neighbors;
}


// Clear the grid
const clearGrid = () => {
    for(let row of cellMatrix){
        for(let cell of row){
            cell.style.backgroundColor = WHITE_COLOR_HEX;
        }
    }
}

// Makes a simulation step
const step = () => {
    let nextState = [];
    for(let rowItr = 0; rowItr < HEIGHT; rowItr++){
        for(let colItr = 0; colItr < WIDTH; colItr++){
            let neighborsArrayIndex = rowItr * HEIGHT  + colItr;
            let neighbors = neighboringCells[neighborsArrayIndex];
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

// Runs the simulation
const run = () => {
    document.getElementById(STEP_BUTTON_ID).disabled = true;
    document.getElementById(RUN_BUTTON_ID).disabled = true;
    document.getElementById(CLEAR_BUTTON_ID).disabled = true;
    intervalId = setInterval(function(){
        step();
    }, slider.value)
}

// Stop the simulation
const stop = () => {
    document.getElementById(CLEAR_BUTTON_ID).disabled = false;
    document.getElementById(RUN_BUTTON_ID).disabled = false;
    document.getElementById(STEP_BUTTON_ID).disabled = false;
    clearInterval(intervalId);
}


// Get the count of alive neighbors from an array
const getCountAliveNeighbors = (neighbors) => {
    let aliveNeighbors = neighbors.reduce(function (result, neighbor) {
    if(neighbor.style.backgroundColor == GREEN_COLOR_RGB){
        return result + 1;
    }
    return result;
    }, 0);
    return aliveNeighbors;
}


// Change the grid in order to set the next state
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

// Change cell state manually
const changeCellState = (cell) =>{
    if(cell.style.backgroundColor == GREEN_COLOR_RGB){
        cell.style.backgroundColor = WHITE_COLOR_HEX;
    } else {
        cell.style.backgroundColor = GREEN_COLOR_HEX;
    }
}

// Change the simulation speed (need changes)
const changeSimulationSpeed = () =>{
    clearInterval(intervalId);
    intervalId = setInterval(function(){
        step();
    }, slider.value)
}


/*********** INIT ***********/

// Create the grid and fill the neighbors array
createGrid();
fillNeighborsArray();

// Add event listener to each cell to change states
document.querySelectorAll(`#${GRID_ID} td`)
.forEach(e => e.addEventListener("click", function(){
    changeCellState(e);
}));

// Add event listener to clear button
document.getElementById(CLEAR_BUTTON_ID).addEventListener("click", clearGrid);

// Add event listener to step button
document.getElementById(STEP_BUTTON_ID).addEventListener("click", step);

// Add event listener to run button
document.getElementById(RUN_BUTTON_ID).addEventListener("click", run);

// Add event listener to stop button
document.getElementById(STOP_BUTTON_ID).addEventListener("click", stop);

// Add event listener to slider
document.getElementById(SLIDER_ID).addEventListener("click", changeSimulationSpeed);