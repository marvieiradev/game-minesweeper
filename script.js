const grid = document.getElementById("grid");
const result = document.getElementById("result")
let lockGame = false;
let win = false;
const testMode = true;
generateGrid();

//Gerar um tabuleiro 10 x 10
function generateGrid() {
    lockGame = false;
    win = false
    result.style.opacity = 0
    result.classList.remove("win", "lost")
    grid.innerHTML = "";
    for (var i = 0; i < 10; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            cell = row.insertCell(j);
            cell.onclick = function () { init(this); }
            var mine = document.createAttribute("mine");
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }
    generateMines();
}

//Função para gerar as minas aleatoriamente
function generateMines() {
    //Adiciona 20 minas ao jogo
    for (var i = 0; i < 20; i++) {
        var row = Math.floor(Math.random() * 10);
        var col = Math.floor(Math.random() * 10);
        var cell = grid.rows[row].cells[col];
        cell.setAttribute("mine", "true");
        if (testMode) {
            cell.innerHTML = "X";
        }
    }
}

//Função para mostrar as minas
function revealMines() {
    result.style.opacity = 1
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var cell = grid.rows[i].cells[j];
            if (cell.getAttribute("mine") == "true") {

                if (win) {
                    cell.className = "win";
                    cell.innerHTML = " &#128681;";
                    result.classList.add("win")
                    result.innerHTML = "VENCEU &#128516;"

                } else {
                    cell.className = "mine";
                    cell.innerHTML = "&#128163;";
                    result.classList.add("lost")
                    result.innerHTML = "FIM DE JOGO &#128542;"
                }
            }
        }
    }
}

//Função que verifica se venceu o jogo
function checkGameComplete() {
    var gameComplete = true;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if ((grid.rows[i].cells[j].getAttribute("mine") == "false") && (grid.rows[i].cells[j].innerHTML == "")) {
                gameComplete = false;
            }
        }
    }
    if (gameComplete) {
        win = true
        revealMines();
    }
}

function init(cell) {
    //Verifica se o jogo está terminado ou não
    if (lockGame) {
        return;
    } else {
        //Verifica se foi clicado em alguma mina
        if (cell.getAttribute("mine") == "true") {
            revealMines();
            lockGame = true;
        } else {
            cell.className = "active";
            //Mostra o numero de minas proximo da celula
            var mineCount = 0;
            var cellRow = cell.parentNode.rowIndex;
            var cellCol = cell.cellIndex;
            for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
                for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                    if (grid.rows[i].cells[j].getAttribute("mine") == "true") {
                        mineCount++;
                    }
                }
            }
            cell.innerHTML = mineCount;
            if (mineCount == 0) {
                //Se não tiver nemhuma mina
                for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
                    for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                        if (grid.rows[i].cells[j].innerHTML == "") {
                            init(grid.rows[i].cells[j]);
                        }
                    }
                }
            }
            checkGameComplete();
        }
    }
}