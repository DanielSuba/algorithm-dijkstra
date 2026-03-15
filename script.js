// Poczatkowe zmienne
const rowInput = document.getElementById('row');
const colInput = document.getElementById('col');
const gridContainer = document.getElementById('grid-container');

let gridLogic = []; 

// Pozycje startowa i końcowe 
let START_NODE = { row: 5, col: 2 };
let END_NODE = { row: 5, col: 8 };

// Dla kontrolu stanu algorytmu i animacji
let animationTimer = null;
let isPaused = false;
let currentStep = 0;
let isDrawingPath = false;
let savedVisitedNodes = [];
let savedPathNodes = [];

// Wagi
let showWeights = false;

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

    // Zabezpieczenia 2
    START_NODE.row = parseInt(document.getElementById('startrow').value);
    START_NODE.col = parseInt(document.getElementById('startcol').value);
    END_NODE.row = parseInt(document.getElementById('endrow').value);
    END_NODE.col = parseInt(document.getElementById('endcol').value);

    START_NODE.row = Math.max(0, Math.min(START_NODE.row, ROWS - 1));
    START_NODE.col = Math.max(0, Math.min(START_NODE.col, COLS - 1));
    
    END_NODE.row = Math.max(0, Math.min(END_NODE.row, ROWS - 1));
    END_NODE.col = Math.max(0, Math.min(END_NODE.col, COLS - 1));

    // if (){
        
    // }

    // Ustawienie liczby kolumn w CSS Grid
    gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 25px)`;

    for (let r = 0; r < ROWS; r++) {
        let currentRow = [];
        for (let c = 0; c < COLS; c++) {
            const nodeElement = document.createElement('div');
            nodeElement.classList.add('node');
            // Nadawanie klas dla węzła startowego i końcowego
            if (r === START_NODE.row && c === START_NODE.col) {
                nodeElement.classList.add('start');
            } else if (r === END_NODE.row && c === END_NODE.col) {
                nodeElement.classList.add('end');
            }
            
            // Obsługa kliknięcia dla ścian
            nodeElement.addEventListener('click', () => {
                // Zabezpieczenia 3
                if ((r === START_NODE.row && c === START_NODE.col) || 
                    (r === END_NODE.row && c === END_NODE.col)) return;

                nodeElement.classList.toggle('wall');
                gridLogic[r][c].isWall = !gridLogic[r][c].isWall; // Aktualizacja logiki
            });

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

// @@@@@@@@@@@@@@@@@@@@@@@ ALGORYTM DIJKSTRY @@@@@@@@@@@@@@@@@@@@@@@@@@@@

function dijkstra(grid, startNodeCoords, endNodeCoords) {
    const visitedNodesInOrder = [];
    const unvisitedNodes = [];

    // Inicjalizacja węzłów dla algorytmu
    for (let row of grid) {
        for (let node of row) {
            node.distance = Infinity; // Na początku dystans do wszystkich węzłów to nieskończoność
            node.isVisited = false;
            node.previousNode = null; // Zmienna potrzebna do odtworzenia najkrótszej ścieżki
            unvisitedNodes.push(node);
        }
    }
    
    // Ustawienie dystansu dla punktu startowego na 0
    const startNode = grid[startNodeCoords.row][startNodeCoords.col];
    const endNode = grid[endNodeCoords.row][endNodeCoords.col];
    startNode.distance = 0;

    // Główna pętla algorytmu
    while (unvisitedNodes.length > 0) {
        // Sortujemy węzły po najkrótszym dystansie
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
        
        // Pobieramy węzeł z najmniejszym dystansem
        const closestNode = unvisitedNodes.shift();

        // Jeśli trafiliśmy na ścianę, omijamy ją
        if (closestNode.isWall) continue;

        // Jeśli zostaliśmy zamknięci w ścianach i nie ma drogi do endu
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        // Oznaczamy jako odwiedzony
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        // Jeśli dotarliśmy do endu, kończymy szukanie
        if (closestNode === endNode) return visitedNodesInOrder;

        // Aktualizujemy sąsiadów
        updateUnvisitedNeighbors(closestNode, grid);
    }
    return visitedNodesInOrder;
}

// Funkcja aktualizuje odległości sąsiadów
function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1; // Dystans
        neighbor.previousNode = node; // Zapisujemy skąd przyszliśmy
    }
}

// Funkcja pobiera info od nieodwiedzonych sąsiadów
function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    // Zapobiegamy wyjściu poza tablicę
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Funkcja rekonstruująca najkrótszą ścieżkę do startu
function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    // Cofamy nazad aż trafimy na null (czyli na start)
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!! ANIMACJA !!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Funkcja do czyszczenia śladów po poprzednim wyszukiwaniu
function clearPathsAndVisited() {
    for (let row of gridLogic) {
        for (let node of row) {
            node.element.classList.remove('visited');
            node.element.classList.remove('path');
            // Czysci wagi
            node.element.innerText = '';
        }
    }
}

// ++++++++++++++++++++++++++++++++++ Generate walls ++++++++++++++++++++++++++++++++++

function ramdomizewalls(densityVal) {
    for (let r = 0; r < gridLogic.length; r++) {
        for (let c = 0; c < gridLogic[r].length; c++) {
            const node = gridLogic[r][c];

            // Zabezpieczenie nie zamazujemy punktu Start i Endu
            if ((r === START_NODE.row && c === START_NODE.col) || 
                (r === END_NODE.row && c === END_NODE.col)) {
                continue;
            }

            if (Math.random() * 100 < densityVal) {
                // Stawiamy ścianę
                node.isWall = true;
                node.element.classList.add('wall');
            } else {
                // Usuwamy ścianę (na wypadek, gdyby jakaś już tu stała)
                node.isWall = false;
                node.element.classList.remove('wall');
            }
        }
    }
}


// ++++++++++++++++++++++++++++++++++ Stop/Resume ++++++++++++++++++++++++++++++++++

function animateDijkstraStep() {
    // Pauza
    if (isPaused) return;

    // Predkosc dynamiczna
    const speedVal = parseInt(document.getElementById('speed').value);
    const delay = 501 - speedVal; 

    // Rysowanie odwiedzonych węzłów na niebiesko
    if (!isDrawingPath) {
        if (currentStep < savedVisitedNodes.length) {
            const node = savedVisitedNodes[currentStep];
            
            // Pomijamy kolorowanie startu i endu
            if (!(node.row === START_NODE.row && node.col === START_NODE.col) &&
                !(node.row === END_NODE.row && node.col === END_NODE.col)) {
                node.element.classList.add('visited');
            }
            
            currentStep++;
            animationTimer = setTimeout(animateDijkstraStep, delay); // Planowanie kroku
        } else {
            isDrawingPath = true;
            currentStep = 0; // Resetujemy licznik dla ścieżki
            animationTimer = setTimeout(animateDijkstraStep, delay); // Planowanie kroku
        }
    } 
    // Rysowanie ostatecznej ścieżki na zolto
    else {
        if (currentStep < savedPathNodes.length) {
            const node = savedPathNodes[currentStep];
            
            if (!(node.row === START_NODE.row && node.col === START_NODE.col) &&
                !(node.row === END_NODE.row && node.col === END_NODE.col)) {
                node.element.classList.add('path');
            }
            
            currentStep++;
            animationTimer = setTimeout(animateDijkstraStep, 50); // Ścieżka rysuje się ze stałą prędkością
        } else {
            // Cała animacja zakończona
            document.getElementById('stop').innerText = "Stop";
        }
    }
}

// ======================================== Poczatek programu + przyciski ========================================
createGrid();

// Buttons 

document.getElementById("generate").addEventListener("click", function () {
  createGrid();
});

// Start

document.getElementById('start').addEventListener('click', () => {
    clearTimeout(animationTimer);
    isPaused = false;
    currentStep = 0;
    isDrawingPath = false;
    document.getElementById('stop').innerText = "Stop";

    // Czyścimy siatke ale zostawiamy ściany
    clearPathsAndVisited();

    // Obliczamy Dijkstrę 
    savedVisitedNodes = dijkstra(gridLogic, START_NODE, END_NODE);
    const endNode = gridLogic[END_NODE.row][END_NODE.col];
    savedPathNodes = getNodesInShortestPathOrder(endNode);
    
    // Uruchamiamy animację krok po kroku
    animateDijkstraStep();
});

// Stop

document.getElementById('stop').addEventListener('click', () => {
    const stopBtn = document.getElementById('stop');
    
    // Zabezpieczenie: jeśli nie ma nic do animowania, nic nie rób
    if (savedVisitedNodes.length === 0) return; 

    if (isPaused) {
        // Wznawianie
        isPaused = false;
        stopBtn.innerText = "Stop";
        animateDijkstraStep();      // Odpalamy pętlę z powrotem
    } else {
        // Pauzowanie
        isPaused = true;
        clearTimeout(animationTimer);
        stopBtn.innerText = "Resume"; // Zmiana napisu na przycisku
    }
});

// Ramdomize

document.getElementById('ramdomize').addEventListener('click', () => {
    // Pobieramy wartość gęstości z suwaka Denstity
    const denVal = parseInt(document.getElementById('density').value);

    // Zatrzymujemy trwającą animację 
    clearTimeout(animationTimer);
    isPaused = false;
    document.getElementById('stop').innerText = "Stop";
    clearPathsAndVisited();

    ramdomizewalls(denVal);
});

// Reset

document.getElementById('reset').addEventListener('click', () => {
    // Zatrzymujemy całkowicie animację
    clearTimeout(animationTimer);
    isPaused = false;
    currentStep = 0;
    isDrawingPath = false;
    savedVisitedNodes = [];
    savedPathNodes = [];
    
    document.getElementById('stop').innerText = "Stop";
    
    // Funkcja czyszcząca kolory
    clearPathsAndVisited(); 
});

// TRYB WYSWIETLANIA WAG

document.getElementById('changeMode').addEventListener('click', (e) => {
    showWeights = !showWeights; // Przełączamy stan
    
    // Zmiana tekstu na przycisku
    e.target.innerText = showWeights ? "Show Weights: ON" : "Show Weights: OFF";

    // Pokazuje wagi
    for (let r = 0; r < gridLogic.length; r++) {
        for (let c = 0; c < gridLogic[r].length; c++) {
            const node = gridLogic[r][c];
            
            // Pomijamy Start i koniec
            if ((node.row === START_NODE.row && node.col === START_NODE.col) || 
                (node.row === END_NODE.row && node.col === END_NODE.col)) {
                continue;
            }

            if (showWeights) {
                // Pokazujemy wagi tylko tam, gdzie algorytm już dotarł
                if (node.isVisited && node.distance > 0 && node.distance !== Infinity) {
                    node.element.innerText = node.distance;
                }
            } else {
                node.element.innerText = '';
            }
        }
    }
});