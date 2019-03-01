import React, { Component } from 'react';

import CellComponent from './CellComponent'

class RowComponent extends Component {

    renderRow = () => {
        const row = []
        this.props.row.forEach((cell, index) => {
            row.push(<CellComponent
                key={index}
                row={this.props.row_index}
                column={index}
                cell={cell}
                cellWasClicked={this.props.cellWasClicked}/>)
        })
        return row
    }

    render() {
        return (
            <div style={{display: "flex"}}>
                {this.renderRow()}
            </div>
        );
    }
}

export default RowComponent;
