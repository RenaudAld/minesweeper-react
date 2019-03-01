import React, { Component } from 'react';
import './App.css'

import { Board, difficulties } from './minesweeper'
import BoardComponent from './components/BoardComponent'
import WindowComponent from './components/WindowComponent'

class App extends Component {

    /*
    This state is made of:
        board_game, a Board instance that will be updated after each user action
        first_click, that is true at the begining of the game and set to false after
            the first left click, to move a mine if found on the first attempt
        difficulty: the parameter for the difficulty are in the dict difficulties
        status: wheater the game in playing/lose/win
        next_difficulty: user can choose a difficulty for his next game. The next game
            generated will be this difficult
        remains: the number of actual mines minus the number of flagged cells, to
            have a idea how close the player is to win

    */
    constructor(props) {
        super(props);
        this.state = {
            board_game: new Board(
                difficulties.easy.rows,
                difficulties.easy.columns,
                difficulties.easy.mines
            ),
            first_click: true,
            difficulty: 'easy',
            status: 'playing', // or win or loose
            next_difficulty: 'easy',
            remains: difficulties.easy.mines
        }
    }

    /*
    Just some styles so everything looks nice
    */
    styleGame = () => ({
        width: difficulties[this.state.difficulty].columns*24+"px",
        height: difficulties[this.state.difficulty].rows*24+"px",
        border: "5px solid",
        borderColor: "#7c7a7d #fff #fff #7c7a7d",
        margin: "10px"
    })

    styleContainer = () => ({
        witdh: "100%",
        height: (difficulties[this.state.difficulty].rows*24+96)+"px",
        backgroundColor: "#bdbbbe",
        position: "absolute",
    })

    /*
    Handles when player click on a cell
    */
    cellWasClicked = (e, type, row, column) => {
        e.preventDefault()
        if (this.state.status === 'playing') {
            const new_board = this.state.board_game
            var click = 'playing'
            if (type === 'left') {
                click = new_board.leftClick(row, column, this.state.first_click)
                if (click === 'win') {
                    this.setState({remains: 0}) // if the game is won we set the remaining mine counter to zero
                }
                this.setState({first_click: false, status: click})
            } else if (type === 'right') {
                const count_increment = new_board.rightClick(row, column)
                this.setState({remains: this.state.remains - count_increment}) // update count of remaining mines
            }
            this.setState({board_game: new_board}) // update the board in te state
        }
    }

    /*
    Reset state for a new game
    */
    reset = () => {
        const diff = this.state.next_difficulty
        this.setState({
            board_game: new Board(
                difficulties[diff].rows,
                difficulties[diff].columns,
                difficulties[diff].mines
            ),
            status: 'playing',
            difficulty: diff,
            first_click: true,
            remains: difficulties[diff].mines
        })
    }

    render() {
        return (
            <div style={this.styleContainer()}>
                <div className="console">
                    <WindowComponent remains={this.state.remains} difficulty={this.state.difficulty} status={this.state.status} resetClick={this.reset}/>
                </div>
                <div style={this.styleGame()}>
                    <BoardComponent board={this.state.board_game.board} cellWasClicked={this.cellWasClicked}/>
                </div>
                <input type='radio' checked={this.state.next_difficulty === 'easy'} onChange={() => this.setState({next_difficulty: "easy"})}/> easy <br/>
                <input type='radio' checked={this.state.next_difficulty === 'intermediate'} onChange={() => this.setState({next_difficulty: "intermediate"})}/> intermediate <br/>
                <input type='radio' checked={this.state.next_difficulty === 'hard'} onChange={() => this.setState({next_difficulty: "hard"})}/> hard <br/>
            </div>
        );
    }
}

export default App;
