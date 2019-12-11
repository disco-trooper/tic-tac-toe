const playerFactory = (name, choice) => {
    return {name, choice};
};

const gameBoard = (() => {
    let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    document.addEventListener("click", (event) => {
        if (event.target.getAttribute("id") == "clearBoard") {
            createNewBoard();
            game.isStartedVSAI[0] = false;
            game.isStartedVSFriend[0] = false;
            game.currentPlayer[0] = game.playerOne;
        }
    });
    
    function createBoard() {
        let currentRow = 0;
        let currentColumn = 0;
        board.forEach(row => {
            let table = document.querySelector("table");
            let tr = document.createElement("tr");
            table.appendChild(tr);
            row.forEach(value => {
                let td = document.createElement("td");
                td.setAttribute("id", "cell" + currentRow.toString() + currentColumn.toString());
                if (value) td.textContent = value;
                tr.appendChild(td);
                currentColumn++;
            });
            currentRow++;
            currentColumn = 0;
        });
    }

    function createNewBoard() {
        removeTable();
        resetBoard();
        createBoard();
    }

    function removeTable() {
        let table = document.querySelector("table");
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    }

    function resetBoard() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                board[i][j] = 0;
            }
        }
    }

    return {board, createNewBoard, createBoard};
})();

const game = (() => {
    const playerOne = playerFactory("Player 1", "X");
    const playerTwo = playerFactory("Player 2", "O");
    const AI = playerFactory("AI", "O");
    let currentPlayer = [playerOne];
    let isStartedVSAI = [false];
    let isStartedVSFriend = [false];

    function listenForMoves() {
        document.addEventListener("click", (event) => {
            if ((event.target.getAttribute("id") == "playVSFriend" || event.target.getAttribute("id") == "playVSAI") && (isStartedVSAI[0] == false && isStartedVSFriend[0] == false)) {
                gameBoard.createNewBoard();
                currentPlayer[0] = playerOne;
            }

            // Playing VS Friend
            if (event.target.getAttribute("id") == "playVSFriend") {
                isStartedVSFriend[0] = true;
            }
            if (event.target.getAttribute("id").substr(0, 4) == "cell" && isStartedVSFriend[0] == true) {
                makeMoveVSFriend();
                if (isStartedVSFriend[0] == false) return;
            }

            // Playing VS AI
            if (event.target.getAttribute("id") == "playVSAI") {
                isStartedVSAI[0] = true;
            }
            if (event.target.getAttribute("id").substr(0, 4) == "cell" && isStartedVSAI[0] == true) {
                makeMoveVSAI();
                if (isStartedVSAI[0] == false) return;
                makeAIMove();
                if (isStartedVSAI[0] == false) return;
            }
        });
    }

    function makeMoveVSAI() {
        if (!event.target.textContent) {
            makeMove();
            checkOutcome();
            if (isStartedVSAI[0] == false) return;
            currentPlayer[0] = AI;
        }
    }

    function makeAIMove() {
        let randomRow = getRandomInt(3);
        let randomColumn = getRandomInt(3);
        while (gameBoard.board[randomRow][randomColumn] != 0) {
            randomRow = getRandomInt(3);
            randomColumn = getRandomInt(3);
        }
        gameBoard.board[randomRow][randomColumn] = AI.choice;
        document.querySelector(`${"#cell" + randomRow.toString() + randomColumn.toString()}`).textContent = AI.choice;
        checkOutcome();
        if (isStartedVSAI[0] == false) return;
        currentPlayer[0] = playerOne;
    }

    function makeMoveVSFriend() {
        if (!event.target.textContent) {
            makeMove();
            checkOutcome();
            if (isStartedVSFriend[0] == false) return;
            if (currentPlayer[0] == playerOne) currentPlayer[0] = playerTwo;
            else currentPlayer[0] = playerOne;
        }
    }

    function makeMove() {
        let currentRow = parseInt(event.target.getAttribute("id").substr(4, 1));
        let currentColumn = parseInt(event.target.getAttribute("id").substr(5, 1));
        event.target.textContent = currentPlayer[0].choice;
        gameBoard.board[currentRow][currentColumn] = currentPlayer[0].choice;
    }

    function checkOutcome() {
        if (isStartedVSFriend[0] == true) {
            checkRows();
            if (isStartedVSFriend[0] == false) return;
            checkColumns();
            if (isStartedVSFriend[0] == false) return;
            checkDiagonal();
            if (isStartedVSFriend[0] == false) return;
            checkTie();
            if (isStartedVSFriend[0] == false) return;
        }
        if (isStartedVSAI[0] == true) {
            checkRows();
            if (isStartedVSAI[0] == false) return;
            checkColumns();
            if (isStartedVSAI[0] == false) return;
            checkDiagonal();
            if (isStartedVSAI[0] == false) return;
            checkTie();
            if (isStartedVSAI[0] == false) return;
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function checkRows() {
        for (let i = 0; i < gameBoard.board.length; i++) {
            if (gameBoard.board[i][0] == playerOne.choice && gameBoard.board[i][1] == playerOne.choice && gameBoard.board[i][2] == playerOne.choice) {
                alert(playerOne.name + " wins!");
                isStartedVSFriend[0] = false;
                isStartedVSAI[0] = false;
                return;
            }
            if (gameBoard.board[i][0] == playerTwo.choice && gameBoard.board[i][1] == playerTwo.choice && gameBoard.board[i][2] == playerTwo.choice) {
                alert(playerTwo.name + " wins!");
                isStartedVSFriend[0] = false;
                isStartedVSAI[0] = false;
                return;
            }
        }
    }

    function checkColumns() {
        for (let i = 0; i < gameBoard.board.length; i++) {
            if (gameBoard.board[0][i] == playerOne.choice && gameBoard.board[1][i] == playerOne.choice && gameBoard.board[2][i] == playerOne.choice) {
                alert(playerOne.name + " wins!");
                isStartedVSFriend[0] = false;
                isStartedVSAI[0] = false;
                return;
            }
            if (gameBoard.board[0][i] == playerTwo.choice && gameBoard.board[1][i] == playerTwo.choice && gameBoard.board[2][i] == playerTwo.choice) {
                alert(playerTwo.name + " wins!");
                isStartedVSFriend[0] = false;
                isStartedVSAI[0] = false;
                return;
            }
        }
    }

    function checkDiagonal() {
        if ((gameBoard.board[0][0] == playerOne.choice && gameBoard.board[1][1] == playerOne.choice && gameBoard.board[2][2] == playerOne.choice) || (gameBoard.board[2][0] == playerOne.choice && gameBoard.board[1][1] == playerOne.choice && gameBoard.board[0][2] == playerOne.choice)) {
            alert(playerOne.name + " wins!");
            isStartedVSFriend[0] = false;
            isStartedVSAI[0] = false;
            return;
        }
        if ((gameBoard.board[0][0] == playerTwo.choice && gameBoard.board[1][1] == playerTwo.choice && gameBoard.board[2][2] == playerTwo.choice) || (gameBoard.board[2][0] == playerTwo.choice && gameBoard.board[1][1] == playerTwo.choice && gameBoard.board[0][2] == playerTwo.choice)) {
            alert(playerTwo.name + " wins!")
            isStartedVSFriend[0] = false;
            isStartedVSAI[0] = false;
            return;
        }
    }

    function checkTie() {
        let counter = 0;
        for (let i = 0; i < gameBoard.board.length; i++) {
            for (let j = 0; j < gameBoard.board.length; j++) {
                if (gameBoard.board[i][j] != 0) counter ++;
            }
        }
        if (counter == 9) {
            alert("Tie!");
            return;
        }
    }
    
    return {listenForMoves, checkTie, isStartedVSAI, isStartedVSFriend, currentPlayer, playerOne};
})();

gameBoard.createBoard();
game.listenForMoves();