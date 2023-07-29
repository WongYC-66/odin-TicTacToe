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
        // check each rule to have 3 same markers
        winRules.forEach((rule, i) => {
            let marker = board[rule[0]] // e.g. get 'X' from cell 0
            if (!marker) return
            let isWon = rule.every(x => board[x] === marker)
            if (isWon) {
                winStatus = true;
                winner = marker === 'O' ? player1 : player2
                console.log(winner)
                winRuleIndex = i
            }
        })
        // update greencolor UI if winner exists
        if (winRuleIndex !== undefined) updateWinnerUI(winner, winRules, winRuleIndex)
    }
    function updateWinnerUI(winner, winRules, winRuleIndex) {
        gameState = 'pause'
        document.querySelector('.winnerText').textContent = `Winner : ${winner.name}`
        winRules[winRuleIndex].forEach(x => {
            document.querySelector(`[data-index="${x}"]`).classList.add('win')
        })
    }

    function resetGame() {
        board = [
            '', '', '',
            '', '', '',
            '', '', '',
        ]
        document.querySelector('.winnerText').textContent = ''
        currentPlayer = player1
        gameState = 'play'
        displayController()
    }
    // input / button click event
    document.querySelector('button').addEventListener('click', resetGame)
    document.querySelector('#player1Input').addEventListener('input', e => {
        console.log(e.target.value)
        player1.name = e.target.value
    })
    document.querySelector('#player2Input').addEventListener('input', e => {
        player2.name = e.target.value
    })


    displayController()

    return {
        player1,
        player2,
        board,
        displayController
    }
})()






