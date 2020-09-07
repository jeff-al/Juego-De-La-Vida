var grid = document.getElementById("myTable");
const altura = 50;
const ancho = 50;

console.log(grid);

function crearTablero(){
    for (let externalIterator = 0; externalIterator < altura; externalIterator++) {
        let row = grid.insertRow();
        for (let internalIterator = 0; internalIterator < ancho; internalIterator++) {
          let cell = row.insertCell();
          let text = document.createTextNode("");
          cell.appendChild(text);
        }
      }
}


crearTablero();


document.querySelectorAll('#myTable td')
.forEach(e => e.addEventListener("click", function() {
    // Here, `this` refers to the element the event was hooked on
    console.log("clicked ->"+e.style.backgroundColor);
    if(e.style.backgroundColor == "rgb(255, 0, 0)"){
        e.style.backgroundColor = '#FFF';
    } else {
        e.style.backgroundColor = '#F00';
    }
}));
