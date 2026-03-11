// Poczatkowe zmienne
const rowInput = document.getElementById('row');
const colInput = document.getElementById('col');
const gridContainer = document.getElementById('grid-container');

let gridLogic = []; 

// Pozycje startowa i końcowe 
let START_NODE = { row: 5, col: 2 };
let END_NODE = { row: 5, col: 8 };

// ------------------------ Generowanie siatki ----------------------
function createGrid() {
    // Pobranie aktualnych wartości
    let ROWS=1;
    let COLS=1;
    // Zabezpieczenia

    if (parseInt(rowInput.value) <2 ) {
        ROWS = 2;
    }  
    else {
        ROWS = parseInt(rowInput.value);
    }
    if (parseInt(colInput.value) <2 ){
        COLS = 2;
    }  
    else {
        COLS = parseInt(colInput.value);
    }

    // Wyczyśczenie siatki
    gridContainer.innerHTML = '';
    gridLogic = [];

    

    // Ustawienie liczby kolumn w CSS Grid
    gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 25px)`;

    for (let r = 0; r < ROWS; r++) {
        let currentRow = [];
        for (let c = 0; c < COLS; c++) {
            const nodeElement = document.createElement('div');
            nodeElement.classList.add('node');
            
            

            gridContainer.appendChild(nodeElement);

            // Zapisywanie danych do tablicy
            currentRow.push({
                row: r,
                col: c,
                isWall: false,
                element: nodeElement // Przechowujemy referencję do HTML
            });
        }
        gridLogic.push(currentRow);
    }
}

createGrid();

// Buttons 

document.getElementById("generate").addEventListener("click", function () {
  createGrid();
});
