/**
 * Created by max xu on 9/22/17.
 */

class Board {
    constructor(n = 19) {
        this.map = []
        this.history = []
        for (let m = 0; m < 2; ++m) {
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

    setMap(row, col, color) {
        let c = color === "black"? 0 : 1
        this.history.push([c, row, col])
        this.map[c][row][col] = 1
        return this.checkBoard(row, col, c)
    }

    unsetMap() {
        let lastStep = this.history.pop()
        this.map[lastStep[0]][lastStep[1]][lastStep[2]] = 0
    }

    getMap() {
        return this.map
    }

    checkBoard(row, col, c) {
        return Board.checkRow(this.map[c][row]) || Board.checkCol(this.map[c], col) || Board.checkDiagonal(this.map[c], row, col)
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