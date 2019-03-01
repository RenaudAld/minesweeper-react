function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export const difficulties = {
    easy: {
        rows: 10, columns: 10, mines: 15
    },
    intermediate: {
        rows: 15, columns: 25, mines: 60
    },
    hard: {
        rows: 40, columns: 60, mines: 300
    },
}

class Cell {

    /*
    Cell class describes a cell of the game:
    row, columns are its coordinates in the game
    is_mine is true if the cell contains a mine
    number tells how many mines are in the adjacent cells
    visibility is the state of the cell:
        hidden => not revealed
        visible => clicked by user
        flag => user put a flag on it, he won't be able to reveal i with a flag on
        unknown => marks a ? on the cell, just as a reminder
    game_over_visible: when the is a game over, we reveal the game (visibility === visible).
    this variable helps to keep track oh the cells that were revealed because of the game over
    */
    constructor(row, column) {
        this.row = row
        this.column = column
        this.is_mine = false
        this.number = 0
        this.visibility = 'hidden'
        this.game_over_visible = false
    }

    /*
    Reveals the cell.
    Returns is_mine to determine if the game is over
            number in case it is 0 => reveal the cell around
    */
    leftClick = () => {
        this.visibility = 'visible'
        return {is_mine: this.is_mine, number: this.number}
    }

    /*
    According to the state of the cell, sets it to fleg/unknown/hidden
    Returns the variation of the flaged cells to update the estimation of remaining mines
    */
    rightClick = () => {
        if (this.visibility === 'hidden') {
            this.visibility = 'flag'
            return 1
        } else if (this.visibility === 'flag') {
            this.visibility = 'unknown'
            return -1
        } else if (this.visibility === 'unknown') {
            this.visibility = 'hidden'
            return 0
        }
        return 0
    }
}

export class Board {

    /*
    A Board is a table of cells
    hauteur, width are the size of the board
    mine_amount is the number of mines it will contain
    remaining counts the cells that remains not visible
        when remaining === mine_amount the game is won
    board is the cell table
    */
    constructor(hauteur, width, mine_amount) {
        this.hauteur = hauteur
        this.width = width
        this.mine_amount = mine_amount
        this.remaining = hauteur*width
        this.board = []
        if (mine_amount > hauteur*width-1) {
            throw Error("Too many mines for this board.")
        }
        this.fillBoard() // fill with empty cells
        this.mineBoard() // fill randomly with mines and update numbers
    }

    /*
    Create the board by filling a 2D table with empty cells
    */
    fillBoard = () => {
        for (var row=0; row<this.hauteur; row++) {
            var row_line = []
            for (var column=0; column<this.width; column++) {
                row_line.push(new Cell(row, column))
            }
            this.board.push(row_line)
        }
    }

    /*
    Randomly put mine in the board
    */
    mineBoard = () => {
        for (var i=0; i<this.mine_amount; i++) {
            const mine_coord = this.noMineCell()
            this.board[mine_coord.row][mine_coord.column].is_mine = true
            this.updateAroundCase(mine_coord.row, mine_coord.column, 1)
        }
    }

    /*
    Sets up the right number in each case
    */
    numberBoard = () => {
        for (var row=0; row<this.hauteur; row++) {
            for (var column=0; column<this.width; column++) {
                if (this.board[row][column].is_mine) { // if we see a mine
                    this.updateAroundCase(row, column, 1) // we increment the number of each cell around
                }
            }
        }
    }

    /*
    Removes a mine from one particular spot and generate one elsewhere
    Updates the numbers
    */
    moveMine = (row, column) => {
        const new_mine_coord = this.noMineCell()
        this.board[row][column].is_mine = false
        this.board[new_mine_coord.row][new_mine_coord.column].is_mine = true
        this.updateAroundCase(row, column, -1)
        this.updateAroundCase(new_mine_coord.row, new_mine_coord.column, 1)
    }

    /*
    Given a cell, will increment/decrement the number of the adjacent cell, according
    if a mine was removed or added
    */
    updateAroundCase(row, column, increment) {
        const around_cases = this.around(row,column)
        for (var c in around_cases) {
            this.board[around_cases[c].row][around_cases[c].column].number += increment
        }
    }

    /*
    Returns a coordinates of a cell with no mine
    */
    noMineCell = () => {
        while (true) {
            var row = getRandomInt(this.hauteur)
            var column = getRandomInt(this.width)
            if (!this.board[row][column].is_mine) {
                return {row, column}
            }
        }
    }

    /*
    Handles a left click on a cell:
    If it is the fist click and it is a mine:
        we move the mine as it is not cool for the player
    Else, if cell not flaged or already reveal, we set it to visible
        if the cell contains the nuber 0, automatically reveal cells around
        if cell is a mine, return lose to state the party is over
        if remains === mine_amount after click, return win
        else, return palyin as the party is not over
    */
    leftClick = (row, column, first_click=false) => {
        if (first_click & this.board[row][column].is_mine) {
            console.log('oui')
            this.moveMine(row, column)
            const revealed = this.board[row][column].leftClick()
            this.remaining -= 1
            if (revealed.number === 0) {
                this.revealAround(row, column)
            }
            return 'playing'
        } else if (['hidden', 'unknown'].indexOf(this.board[row][column].visibility) > -1) { // click not allowed if visible or flag
            const revealed = this.board[row][column].leftClick()
            this.remaining -= 1
            if (revealed.is_mine) {
                this.gameOver()
                return 'lose'
            } else if (revealed.number === 0) {
                this.revealAround(row, column)
            }
            if (this.remaining === this.mine_amount) {
                this.gameOver()
                return 'win'
            }
        }
        return 'playing'
    }

    /*
    Simply rigth click the cell
    */
    rightClick = (row, column) => {
        return this.board[row][column].rightClick()
    }

    /*
    Set to visible all the cell around a specific one (a zero one)
    If there a zero cells around, the function will be called recursivelly and
    the board will reveal many cells
    */
    revealAround = (row, column) => {
        const around = this.around(row, column)
        for (var c in around) {
            if (this.board[around[c].row][around[c].column].visibility !== 'visible') {
                this.leftClick(around[c].row, around[c].column)
            }
        }
    }

    /*
    When game is over, set to true game_over_visible in all remaining hidden cells
    */
    gameOver = () => {
        for (var row=0; row<this.hauteur; row++) {
            for (var column=0; column<this.width; column++) {
                if (this.board[row][column].visibility !== 'visible') {
                    this.board[row][column].game_over_visible = true
                }
            }
        }
    }

    /*
    Given a coordinates, returns all the adjacent coordinates
    Helps deal with edge effect
    */
    around = (row,column) => {
        var close_cases
        if (row === 0) {
            if (column === 0) {
                close_cases = [[row,column+1], [row+1, column+1], [row+1,column]]
            } else if (column === this.width-1) {
                close_cases = [[row,column-1], [row+1, column-1], [row+1,column]]
            } else {
                close_cases = [[row,column+1], [row+1, column+1], [row+1,column], [row,column-1], [row+1, column-1]]
            }
        } else if (row === this.hauteur-1) {
            if (column === 0) {
                close_cases = [[row,column+1], [row-1, column+1], [row-1,column]]
            } else if (column === this.width-1) {
                close_cases = [[row,column-1], [row-1, column-1], [row-1,column]]
            } else {
                close_cases = [[row,column-1], [row-1, column-1], [row-1,column], [row-1, column+1], [row,column+1]]
            }
        } else if (column === 0) {
            close_cases = [[row-1,column], [row-1, column+1], [row,column+1], [row+1, column+1], [row+1,column]]
        } else if (column === this.width-1) {
            close_cases = [[row-1,column], [row-1, column-1], [row,column-1], [row+1, column-1], [row+1,column]]
        } else {
            close_cases = [[row, column-1], [row+1, column-1], [row+1, column], [row+1, column+1], [row, column+1], [row-1, column-1], [row-1, column], [row-1, column+1]]
        }
        return close_cases.map(tuple => ({row: tuple[0], column: tuple[1]}))
    }

 }
