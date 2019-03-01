import React, { Component } from 'react';

import RowComponent from './RowComponent'

class BoardComponent extends Component {

    renderBoard = () => {
        const board = []
        this.props.board.forEach((row, index) => {
            board.push(<RowComponent
                key={index}
                row={row}
                row_index={index}
                cellWasClicked={this.props.cellWasClicked}/>)

        })
        return board
    }

    render() {
        return (
            <div>
                {this.renderBoard()}
            </div>
        );
    }
}

export default BoardComponent;
