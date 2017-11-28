/**
 * Created by maxim-xu on 9/21/17.
 */
document.addEventListener("DOMContentLoaded", function() {

    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        }, false);
    }

    const board = document.getElementsByClassName('board')[0]
    const cells = document.querySelectorAll('.cell')
    const undo_btn = document.getElementById('back')
    const restart_btn = document.getElementById('restart')
    const ai_btn = document.querySelector('.ai-button')
    const ai_text = document.getElementById('ai')
    const message_text = document.getElementById('message')
    let board_map = new Board()
    let AI_on = ai_text.classList.contains("off")
    let blackPiece = 0, whitePiece = 0
    let currentStep = 0, board_active = true
    let bw = window.getComputedStyle(board).width
    board.style.height = bw

    setTimeout(function() {
        cells.forEach((cell) => {
            cell.className += ' loaded'
        })
    }, 1000)

    for (let i = 0; i < cells.length; ++i) {
        cells[i].dataset.row = Math.floor(i / board_map.getSize())
        cells[i].dataset.col = i % board_map.getSize()
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
        piece.style.zIndex = 9
        return piece
    }

    const placePiece = (e) => {
        let width = e.target.offsetWidth
        let color = "black";
        if (blackPiece > whitePiece) color = "white"
        if (e.target.classList.contains('cell') && e.target.children.length === 0) {
            let row = parseInt(e.target.dataset.row)
            let col = parseInt(e.target.dataset.col)
            let pos = {
                x: row,
                y: col
            }
            e.target.appendChild(createPiece(width, color, ++currentStep))
            if (board_map.setMap(pos, color)) disableBoard()
            else if (board_map.getAI() !== null) {
                let AI_pos = {
                    x: board_map.getAI().x,
                    y: board_map.getAI().y
                }
                if (board_map.setMap(AI_pos, 0)) disableBoard()
                let AI_cell = document.querySelector('[data-row="' + AI_pos.x + '"][data-col="' + AI_pos.y + '"]')
                AI_cell.appendChild(createPiece(width, currentStep % 2 === 0 ? "black" : "white", ++currentStep))
            }
        }
        if (currentStep > 0) {
            undo_btn.disabled = false
            restart_btn.disabled = false
        }
    }

    const unplacePiece = () => {
        let t = board_map.AI_on ? 2 : 1
        for (let i = 0; i < t; ++i) {
            board_map.unsetMap()
            let last_piece = document.querySelector('[data-step="' + currentStep + '"]')
            let last_color = last_piece.dataset.color
            last_piece.remove()
            currentStep--
            if (last_color === "black") blackPiece--
            else whitePiece--
            if (currentStep === 0) {
                undo_btn.disabled = true
                restart_btn.disabled = true
            }
            if (board_active === false) {
                board.addEventListener('click', placePiece, true)
                message_text.innerHTML = "&nbsp"
                board_active = true
            }
        }
    }

    const disableBoard = () => {
        board.removeEventListener('click', placePiece, true)
        board_active = false
        message_text.innerText = board_map.getHistory()[board_map.history.length - 1][0] === 0 ? "Black Won" : "White Won"
        return
    }

    const restartBoard = () => {
        currentStep = 0
        whitePiece = 0
        blackPiece = 0
        AI_on = ai_text.classList.contains("off")
        board_map = new Board()
        board_map.setAI(!AI_on)
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
    ai_btn.addEventListener('click', function () {
        restartBoard()
        board_map.setAI(AI_on)
        ai_text.classList.toggle("off")
        if (AI_on) {
            ai_text.innerText = "Man Vs A.I."
        } else {
            ai_text.innerText = "Man Vs Man"
        }
    }, true)

})
