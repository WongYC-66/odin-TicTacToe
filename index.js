// factory function
const playerFactory = (name, markerChar) => {
    const marker = markerChar
    return { name, marker };
}

// module with IIFE
const gameBoard = (() => {
    console.log('hi')
    let board = [
        '', '', '',
        '', '', '',
        '', '', '',
    ]

    let player1 = playerFactory('player1', 'O')
    let player2 = playerFactory('player2', 'X')
    let currentPlayer = player1
    let gameState = 'play'
    let aiMode = false


    const displayController = () => {
        // re-render
        document.querySelectorAll('.cell').forEach(x => x.remove()) // delete previous

        let container = document.querySelector('.container')
        board.forEach((char, i) => {
            let newNode = document.createElement('div')
            newNode.classList.add('cell')
            newNode.setAttribute('data-index', i)
            newNode.textContent = char
            newNode.addEventListener('click', addMarker)
            container.appendChild(newNode)
        })
    }
    function addMarker(event) {
        if (gameState == 'pause') return
        let index = event.target.getAttribute('data-index')
        let marker = currentPlayer.marker
        // Error to place on exisiting marker 
        if (board[index]) {
            event.target.classList.toggle('error')
            setTimeout(() => {
                event.target.classList.toggle('error')
            }, 1000)
            return
        }
        // place marker and switch player, re-render
        board[index] = marker
        currentPlayer = currentPlayer === player1 ? player2 : player1
        displayController()
        checkWinner()
        // for Ai mode
        if (aiMode && currentPlayer == player2 && gameState == 'play') {
            setTimeout(() => aiRound(), 300);
        }
    }

    function checkWinner() {
        let winRules = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
            [0, 4, 8], [2, 4, 6], //diagonal
            [1, 4, 7], [3, 4, 5], //cross
        ]
        let winner;
        let winRuleIndex = undefined;
        let isTie;
        // check each rule to have 3 same markers
        winRules.forEach((rule, i) => {
            // if(winRuleIndex !== undefined) return
            let marker = board[rule[0]] // e.g. get 'X' from cell 0
            if (!marker) return
            let isWon = rule.every(x => board[x] === marker)
            if (isWon) {
                winStatus = true;
                winner = marker === player1.marker ? player1 : player2
                console.log(winner)
                winRuleIndex = i
            } else {
                isTie = board.every(x => x !== '')
            }
        })
        // update greencolor UI if winner exists, else  tie
        if (winRuleIndex !== undefined) updateWinnerUI(winner, winRules, winRuleIndex)
        else if (isTie) updateTieUI()
        // ai mode && game won or tie
        if(aiMode && winRuleIndex !== undefined || isTie){
            document.querySelector('#startBtn').disabled = true
            setTimeout(() => resetGame(), 3000)
        }// reset after 3 secs
    }
    function updateWinnerUI(winner, winRules, winRuleIndex) {
        gameState = 'pause'
        winRules[winRuleIndex].forEach(x => {
            document.querySelector(`[data-index="${x}"]`).classList.add('win')
        })
        document.querySelector('.winnerText').textContent = `Winner : ${winner.name}`
        // ai mode 
        if(aiMode) document.querySelector('.winnerText').textContent = `Winner : ${winner.name}. Restart in 3 secs ...`
    }
    function updateTieUI() {
        gameState = 'pause'
        document.querySelector('.winnerText').textContent = `a Tie. Restart!`
        // ai mode 
        if(aiMode) document.querySelector('.winnerText').textContent = `Tie. Restart in 3 secs ...`
    }
    function turnOnAiMode() {
        // update UI
        let x = this.previousElementSibling
        this.setAttribute('disabled', true)
        x.previousSibling.remove()
        x.remove()
        player2.name = 'computer'
        aiMode = true
    }
    function aiRound() {
        console.log('ai mode')
        let randomIndex
        while (true) {
            randomIndex = Math.floor(Math.random() * 9)
            console.log(randomIndex)
            if (board[randomIndex] === '') break;
        }
        let el = document.querySelector(`[data-index="${randomIndex}"]`)
        el.click()
    }

    function resetGame() {
        board = [
            '', '', '',
            '', '', '',
            '', '', '',
        ]
        document.querySelector('.winnerText').textContent = ''
        document.querySelector('#startBtn').disabled = false
        currentPlayer = player1
        gameState = 'play'
        displayController()
    }
    function setMarker(e){
        let marker = e.target.value
        console.log(marker)
        player1.marker = marker
        player2.marker = marker === 'O' ? 'X' : 'O' 
        resetGame()
    }
    // input / button click event
    document.querySelector('#startBtn').addEventListener('click', resetGame)
    document.querySelector('#vsAi').addEventListener('click', turnOnAiMode)
    document.querySelector('#player1Input').addEventListener('input', e => {
        player1.name = e.target.value
    })
    document.querySelector('#player2Input').addEventListener('input', e => {
        player2.name = e.target.value
    })
    document.querySelector('#rBtnO').addEventListener('input', e => setMarker(e))
    document.querySelector('#rBtnX').addEventListener('input', e => setMarker(e))
    

    displayController()

    return {
        player1,
        player2,
        board,
        displayController,
        resetGame,
        checkWinner,
    }
})()





