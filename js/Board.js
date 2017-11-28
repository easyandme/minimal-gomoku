/**
 * Created by max xu on 9/22/17.
 */

class Board {
    constructor(n = 19) {
        this.size = n
        this.map = []
        this.history = []
        this.AI_on = false
        this.AI_move = null
        for (let m = 0; m < 3; ++m) {
            let tem = []
            for (let i = 0; i < n; ++i) {
                let temp = []
                for (let j = 0; j < n; ++j) {
                    temp.push(0)
                }
                tem.push(temp)
            }
            this.map.push(tem)
        }
    }

    getSize() {
        return this.size
    }

    setMap(pos, color) {
        let c = color === "black"? 0 : 1
        let step = [c, pos.x, pos.y]
        this.history.push(step)
        this.map[c][pos.x][pos.y] = 1
        this.map[2][pos.x][pos.y] = c === 0 ? -1 : 1
        console.log(this.map)
        if (Board.checkBoard(this.map, pos, c)) return true
        if (this.AI_on && color === "black") this.triggerAI("white")
        return false
    }

    triggerAI(color) {
        this.AI_move = this.maxi(this.map[2], 2, color).bestMove
        console.log(this.AI_move.x, this.AI_move.y)
    }

    setAI(bool) {
        this.AI_on = bool
    }

    getAI() {
        return this.AI_move
    }

    unsetMap() {
        let lastStep = this.history.pop()
        this.map[lastStep[0]][lastStep[1]][lastStep[2]] = 0
        this.map[2][lastStep[1]][lastStep[2]] = 0
        console.log(this.map)
    }

    getMap() {
        return this.map
    }

    getHistory() {
        return this.history
    }

    maxi(map, depth, color) {
        if (depth === 0) return 0
        let res = {
            bestMove: null,
            maxScore: Number.NEGATIVE_INFINITY
        }
        let nextColor = color === "black" ? "white" : "black"
        for (let legalMove of this.getLegalMoves(map)) {
            this.map[0][legalMove.x][legalMove.y] = 1
            if (Board.checkBoard(this.map, legalMove, 0)) {
                console.log(this.map[2])
                res.bestMove = legalMove
                this.map[0][legalMove.x][legalMove.y] = 0
                return res
            }
            this.map[0][legalMove.x][legalMove.y] = 0
            let temp = this.mini(Board.getNewMap(JSON.parse(JSON.stringify(map)), legalMove, nextColor === "black" ? -1 : 1), depth - 1, nextColor).minScore
            if (temp > res.maxScore) {
                res.maxScore = temp
                res.bestMove = legalMove
            }
        }
        return res
    }

    mini(map, depth, color) {
        if (depth === 0) return 0
        let res = {
            bestMove: null,
            minScore: Number.POSITIVE_INFINITY
        }
        let nextColor = color === "black" ? 1 : -1
        for (let legalMove of this.getLegalMoves(map)) {
            if (Board.checkBoard(this.map, legalMove, 0)) {
                console.log("this!:" + legalMove)
                console.log(this.map[2])
                res.bestMove = legalMove
                return res
            }
            let temp = this.maxi(Board.getNewMap(JSON.parse(JSON.stringify(map)), legalMove, color === "white" ? -1 : 1), depth - 1, nextColor).maxScore
            if (temp < res.minScore) {
                res.minScore = temp
                res.bestMove = legalMove
            }
        }
        return res
    }

    getLegalMoves(map) {
        let legal_moves = []
        for (let i = 1; i < this.size - 1; ++i) {
            for (let j = 1; j < this.size - 1; ++j) {
                if (map[i][j] === 0 && Board.isRelative(map, i, j)) {
                    legal_moves.push({x: i, y: j})
                }
            }
        }
        return legal_moves
    }

    static getNewMap(map, move, color) {
        map[move.x][move.y] = color
        return map
    }

    static isRelative(map, x, y) {
        return Math.abs(map[x-1][y-1]) + Math.abs(map[x][y-1]) + Math.abs(map[x+1][y-1]) +
            Math.abs(map[x-1][y]) + Math.abs(map[x+1][y]) + Math.abs(map[x-1][y+1]) +
            Math.abs(map[x][y+1]) + Math.abs(map[x+1][y+1]) > 0
    }

    static checkBoard(map, pos, c) {
        return Board.checkRow(map[c][pos.x]) || Board.checkCol(map[c], pos.y) || Board.checkDiagonal(map[c], pos.x, pos.y)
    }

    static checkRow(arr, n = 5) {
        let max = 0
        let sum = 0
        for (let i = 0; i < arr.length; ++i) {
            sum += arr[i]
            if (arr[i] === 0) {
                sum = 0
            } else {
                max = Math.max(sum, max)
            }
        }
        return max >= n
    }

    static checkCol(arr, col) {
        let col_arr = arr.map((x) => x[col])
        return Board.checkRow(col_arr)
    }

    static checkDiagonal(arr, row, col) {
        let forward_diagonal = arr.map((x, i) => (col - row + i >= 0 && col - row + i < arr.length) ? x[col - row + i] : 2).filter((el) => el !== 2)
        let back_diagonal = arr.map((x, i) => (col + row - i >= 0 && col + row - i < arr.length) ? x[col - i + row] : 2).filter((el) => el !== 2)
        return Board.checkRow(forward_diagonal) || Board.checkRow(back_diagonal)
    }
}