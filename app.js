const playerFactory = (name, choice) => {
    return {name, choice};
};

const gameBoard = (() => {
    let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    document.addEventListener("click", (event) => {
        if (event.target.getAttribute("id") == "clearBoard") {
            createNewBoard();
            game.isStartedVSAI[0] = false;
            game.isStartedVSFriend[0] = false;
            game.isStartedVSImpossible[0] = false;
            game.currentPlayer[0] = game.playerOne;
            let announcer = document.querySelector("#announcer");
            announcer.setAttribute("style", "display: none;")
        }
    });

    function createBoard() {
        let table = document.querySelector("table");
        let counter = 0;
        for (let i = 0; i < 3; i++) {
            let tr = document.createElement("tr");
            table.appendChild(tr);
            for (let j = 0; j < 3; j++) {
                let td = document.createElement("td");
                td.setAttribute("id", "cell" + counter.toString());
                tr.appendChild(td);
                counter++;
            }
        }
    }

    function removeTable() {
        let table = document.querySelector("table");
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    }

    function resetBoard() {
        for (let i = 0; i < board.length; i++) {
            board[i] = i;
        }
    }

    function createNewBoard() {
        removeTable();
        resetBoard();
        createBoard();
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
    let isStartedVSImpossible = [false];

    function listenForMoves() {
        document.addEventListener("click", (event) => {
            let buttons = document.querySelector("#buttons");
            let clearButton = document.querySelector("#clearBoard");
            let announcer = document.querySelector("#announcer");
            if (event.target.getAttribute("id") == "clearBoard") {
                buttons.setAttribute("style", "display: block;");
                clearButton.setAttribute("style", "display: none;");
            }

            if ((event.target.getAttribute("id") == "playVSFriend" || event.target.getAttribute("id") == "playVSAI" || event.target.getAttribute("id") == "playVSImpossible") && (isStartedVSAI[0] == false && isStartedVSFriend[0] == false && isStartedVSImpossible[0] == false)) {
                gameBoard.createNewBoard();
                buttons.setAttribute("style", "display: none;");
                clearButton.setAttribute("style", "display: block;");
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

            // Playing VS Impossible AI
            if (event.target.getAttribute("id") == "playVSImpossible") {
                isStartedVSImpossible[0] = true;
            }
            if (event.target.getAttribute("id").substr(0, 4) == "cell" && isStartedVSImpossible[0] == true) {
                makeMoveVSImpossible();
                if (isStartedVSImpossible[0] == false) return;
                makeImpossibleMove();
                if (isStartedVSImpossible[0] == false) return;
            }
        });
    }

    function makeMoveVSImpossible() {
        if (!event.target.textContent) {
            makeMove();
            checkOutcome();
            if (isStartedVSImpossible[0] == false) {
                let buttons = document.querySelector("#buttons");
                let clearButton = document.querySelector("#clearBoard");
                buttons.setAttribute("style", "display: block;");
                clearButton.setAttribute("style", "display: none;");
                return;
            }
            currentPlayer[0] = AI;
        }
    }

    function makeMoveVSAI() {
        if (!event.target.textContent) {
            makeMove();
            checkOutcome();
            if (isStartedVSAI[0] == false) {
                let buttons = document.querySelector("#buttons");
                let clearButton = document.querySelector("#clearBoard");
                buttons.setAttribute("style", "display: block;");
                clearButton.setAttribute("style", "display: none;");
                return;
            }
            currentPlayer[0] = AI;
        }
    }

    function makeImpossibleMove() {
        let bestMove = minimaxModule.minimax(gameBoard.board, AI.choice).index;
        gameBoard.board[bestMove] = AI.choice;
        document.querySelector(`${"#cell" + bestMove}`).textContent = AI.choice;
        checkOutcome();
        if (isStartedVSImpossible[0] == false) {
            let buttons = document.querySelector("#buttons");
            let clearButton = document.querySelector("#clearBoard");
            buttons.setAttribute("style", "display: block;");
            clearButton.setAttribute("style", "display: none;");
            return;
        }
        currentPlayer[0] = playerOne;
    }

    function makeAIMove() {
        let randomNumber = getRandomInt(9);
        while (gameBoard.board[randomNumber] == "X" || gameBoard.board[randomNumber] == "O") {
            randomNumber = getRandomInt(9);
        }
        gameBoard.board[randomNumber] = AI.choice;
        document.querySelector(`${"#cell" + randomNumber.toString()}`).textContent = AI.choice;
        checkOutcome();
        if (isStartedVSAI[0] == false) {
            buttons.setAttribute("style", "display: block;");
            clearButton.setAttribute("style", "display: none;");
            return;
        }
        currentPlayer[0] = playerOne;
    }

    function makeMoveVSFriend() {
        if (!event.target.textContent) {
            makeMove();
            checkOutcome();
            if (isStartedVSFriend[0] == false) {
                let buttons = document.querySelector("#buttons");
                let clearButton = document.querySelector("#clearBoard");
                buttons.setAttribute("style", "display: block;");
                clearButton.setAttribute("style", "display: none;");
                return;
            }
            if (currentPlayer[0] == playerOne) currentPlayer[0] = playerTwo;
            else currentPlayer[0] = playerOne;
        }
    }

    function makeMove() {
        let currentChoice = parseInt(event.target.getAttribute("id").substr(4, 1));
        event.target.textContent = currentPlayer[0].choice;
        gameBoard.board[currentChoice] = currentPlayer[0].choice;
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
        if (isStartedVSImpossible[0] == true) {
            checkRows();
            if (isStartedVSImpossible[0] == false) return;
            checkColumns();
            if (isStartedVSImpossible[0] == false) return;
            checkDiagonal();
            if (isStartedVSImpossible[0] == false) return;
            checkTie();
            if (isStartedVSImpossible[0] == false) return;
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function checkRows() {
        for (let i = 0; i < 7; i+=3) {
            if (gameBoard.board[i] == playerOne.choice && gameBoard.board[i+1] == playerOne.choice && gameBoard.board[i+2] == playerOne.choice) {
                announcePlayerOne();
            }
            if (gameBoard.board[i] == playerTwo.choice && gameBoard.board[i+1] == playerTwo.choice && gameBoard.board[i+2] == playerTwo.choice) {
                announceP2AI();
            }
        }
    }

    function checkColumns() {
        for (let i = 0; i < 3; i++) {
            if (gameBoard.board[i] == playerOne.choice && gameBoard.board[i+3] == playerOne.choice && gameBoard.board[i+6] == playerOne.choice) {
                announcePlayerOne();
            }
            if (gameBoard.board[i] == playerTwo.choice && gameBoard.board[i+3] == playerTwo.choice && gameBoard.board[i+6] == playerTwo.choice) {
                announceP2AI();
            }
        }
    }

    function checkDiagonal() {
        if ((gameBoard.board[0] == playerOne.choice && gameBoard.board[4] == playerOne.choice && gameBoard.board[8] == playerOne.choice) || (gameBoard.board[6] == playerOne.choice && gameBoard.board[4] == playerOne.choice && gameBoard.board[2] == playerOne.choice)) {
            announcePlayerOne();
        }
        if ((gameBoard.board[0] == playerTwo.choice && gameBoard.board[4] == playerTwo.choice && gameBoard.board[8] == playerTwo.choice) || (gameBoard.board[6] == playerTwo.choice && gameBoard.board[4] == playerTwo.choice && gameBoard.board[2] == playerTwo.choice)) {
            announceP2AI();
        }
    }

    function checkTie() {
        let tie = true;
        for (let i = 0; i < gameBoard.board.length; i++) {
            if (gameBoard.board[i] != "X" && gameBoard.board[i] != "O") tie = false;
        }
        if (tie == true) {
            let announcer = document.querySelector("#announcer");
            announcer.setAttribute("style", "display: block;");
            announcer.textContent = "Tie!";
            return;
        }
    }

    function announceP2AI() {
        let announcer = document.querySelector("#announcer");
        announcer.setAttribute("style", "display: block;");
        if (isStartedVSAI[0] == true || isStartedVSImpossible[0] == true) {
            announcer.textContent = `${AI.name + " wins!"}`;
        } else {
        announcer.textContent = `${playerTwo.name + " wins!"}`;
        }
        resetModes();
        return;
    }
    
    function announcePlayerOne() {
        let announcer = document.querySelector("#announcer");
        announcer.setAttribute("style", "display: block;");
        announcer.textContent = `${playerOne.name + " wins!"}`;
        resetModes();
        return;
    }

    function resetModes() {
        isStartedVSFriend[0] = false;
        isStartedVSAI[0] = false;
        isStartedVSImpossible[0] = false;
    }
    
    return {listenForMoves, isStartedVSAI, isStartedVSFriend, isStartedVSImpossible, currentPlayer, playerOne, AI};
})();

const minimaxModule = (() => {
    
    //keeps count of function calls
    let fc = 0;

    // finding the ultimate play on the game that favors the computer
    let bestSpot = minimax(gameBoard.board, game.AI.choice);

    // the main minimax function
    function minimax(newBoard, player) {
        //add one to function calls
        fc++;
    
        //available spots
        let availSpots = emptyIndexies(newBoard);

        // checks for the terminal states such as win, lose, and tie and returning a value accordingly
        if (winning(newBoard, game.playerOne.choice)) {
            return {score: -10};
        } else if (winning(newBoard, game.AI.choice)) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }

        // an array to collect all the objects
        let moves = [];

        // loop through available spots
        for (let i = 0; i < availSpots.length; i++) {
            //create an object for each and store the index of that spot that was stored as a number in the object's index key
            let move = {};
            move.index = newBoard[availSpots[i]];

            // set the empty spot to the current player
            newBoard[availSpots[i]] = player;

            //if collect the score resulted from calling minimax on the opponent of the current player
            if (player == game.AI.choice) {
                let result = minimax(newBoard, game.playerOne.choice);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, game.AI.choice);
                move.score = result.score;
            }

            //reset the spot to empty
            newBoard[availSpots[i]] = move.index;

            // push the object to the array
            moves.push(move);
        }

        // if it is the computer's turn loop over the moves and choose the move with the highest score
        let bestMove;
        if( player === game.AI.choice) {
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
        // else loop over the moves and choose the move with the lowest score
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        // return the chosen move (object) from the array to the higher depth
        return moves[bestMove];
    }

    // returns the available spots on the board
    function emptyIndexies(board) {
        let availableSpots = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] != "X" && board[i] != "O") availableSpots.push(board[i]);
        }
        return availableSpots;
    }

    // winning combinations using the board indexies for instace the first win could be 3 xes in a row
    function winning(board, player){ 
        if (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
            ) {
            return true;
        } else {
            return false;
        }
    }

    return {minimax}
})();

gameBoard.createBoard();
game.listenForMoves();