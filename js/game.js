/**
 * Created by maxim-xu on 9/21/17.
 */
document.addEventListener("DOMContentLoaded", function() {

    const board = document.getElementsByClassName('board')[0]
    const cells = document.querySelectorAll('.cell')
    const undo_btn = document.getElementById('back')
    const restart_btn = document.getElementById('restart')
    const step_text = document.getElementById('step')
    const message_text = document.getElementById('message')
    let board_map = new Board()
    let blackPiece = 0, whitePiece = 0
    let currentStep = 0, board_active = true

    setTimeout(function() {
        cells.forEach((cell) => {
            cell.className += ' loaded'
            cell.style.borderStyle = 'solid'
        })
    }, 1000)

    for (let i = 0; i < cells.length; ++i) {
        cells[i].dataset.row = Math.floor(i / 19)
        cells[i].dataset.col = i % 19
    }

    const createPiece = (width, color, step) => {
        if (color === "black") blackPiece++
        else whitePiece++
        let piece = document.createElement('div')
        piece.className += 'piece'
        piece.dataset.step = step
        piece.dataset.color = color
        piece.style.width = width - 2 + 'px'
        piece.style.height = width - 2 + 'px'
        piece.style.backgroundColor = color === "black" ? '#282c34' : '#fff'
        piece.style.position = 'absolute'
        piece.style.top = '50%'
        piece.style.left = '50%'
        piece.style.transform = 'translate(-50%, -50%)'
        piece.style.borderRadius = '50%'
        return piece
    }

    const placePiece = (e) => {
        let width = e.target.offsetWidth
        let color = "black";
        if (blackPiece > whitePiece) color = "white"
        if (e.target.classList.contains('cell') && e.target.children.length === 0) {
            let row = parseInt(e.target.dataset.row)
            let col = parseInt(e.target.dataset.col)
            e.target.appendChild(createPiece(width, color, ++currentStep))
            step_text.innerText = currentStep
            if (board_map.setMap(row, col, color)) {
                board.removeEventListener('click', placePiece, true)
                board_active = false
                message_text.innerText = board_map.getHistory()[board_map.history.length - 1][0] === 0 ? "Black Wins" : "White Wins"
            }
        }
        if (currentStep > 0) {
            undo_btn.disabled = false
            restart_btn.disabled = false
        }
    }

    const unplacePiece = () => {
        board_map.unsetMap()
        let last_piece = document.querySelector('[data-step="' + currentStep + '"]')
        let last_color = last_piece.dataset.color
        last_piece.remove()
        currentStep--
        if (last_color === "black") blackPiece--
        else whitePiece--
        step_text.innerText = currentStep
        if (currentStep === 0) undo_btn.disabled = true
        if (board_active === false) {
            board.addEventListener('click', placePiece, true)
            message_text.innerHTML = "&nbsp"
            board_active = true
        }
    }

    const restartBoard = () => {
        currentStep = 0
        whitePiece = 0
        blackPiece = 0
        board_map = new Board()
        step_text.innerText = currentStep
        undo_btn.disabled = true
        restart_btn.disabled = true
        Array.prototype.forEach.call(cells, function(cell) {
            if (cell.children.length) cell.removeChild(cell.lastChild)
        })
        if (board_active === false) {
            board.addEventListener('click', placePiece, true)
            message_text.innerHTML = "&nbsp"
        }
    }

    board.addEventListener('click', placePiece, true)
    undo_btn.addEventListener('click', unplacePiece, true)
    restart_btn.addEventListener('click', restartBoard, true)

})
