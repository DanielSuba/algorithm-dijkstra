// --- 1. Konfiguracja siatki ---
const ROWS = 20;
const COLS = 40;
const gridContainer = document.getElementById('grid-container');

// Dwuwymiarowa tablica do przechowywania logiki (dla algorytmu)
let gridLogic = []; 

// Pozycje startowa i końcowa 
const START_NODE = { row: 10, col: 5 };
const END_NODE = { row: 10, col: 34 };

// --- 2. Generowanie siatki ---
function createGrid() {
    // Ustawienie liczby kolumn w CSS Grid
    
}

// Uruchomienie generowania siatki po załadowaniu skryptu
createGrid();