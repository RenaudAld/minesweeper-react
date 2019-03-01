import React, { Component } from 'react';

class Cell extends Component {

    CellStyle = () => {
        return {
            width: (this.props.cell.visibility === 'visible' | this.props.cell.game_over_visible) ? "22px" : "18px",
            height: (this.props.cell.visibility === 'visible' | this.props.cell.game_over_visible) ? "22px" : "18px",
            textAlign: "center",
            lineHeight: "24px",
            backgroundColor: "#bdbbbe",
            border: (this.props.cell.visibility === 'visible' | this.props.cell.game_over_visible) ? "1px solid" : "3px solid",
            borderColor: (this.props.cell.visibility === 'visible' | this.props.cell.game_over_visible) ? " #7c7c7c" : "#fff #7c7a7d #7c7a7d #fff"
        }
    }

    renderCell = () => {
        // IF WE NEED TO RENDER A VISIBLE CELL
        if (this.props.cell.visibility === 'visible' | this.props.cell.game_over_visible) {
            if (this.props.cell.is_mine) {
                if (!this.props.cell.game_over_visible) {  // this means that this mine was triggerer => RED MINE
                    return <img src="mine_red.png" alt="M" style={{height: "22px", width: "22px"}}/>
                } else { // show mines at the end of the game
                    return <img src="mine.png" alt="M" style={{height: "22px", width: "22px"}}/>
                }
            } else if ((this.props.cell.number > 0)) { // if the cell is not a mine or a zero we render the number
                return <img src={this.props.cell.number+".png"} alt="M" style={{height: "22px", width: "22px"}}/>
            }
        // ELSE IF THE CELL IS FLAGGED OR UNKNOWN
        } else if (this.props.cell.visibility !== 'hidden') {
            return <img src={this.props.cell.visibility+".png"} alt="M" style={{height: "18px", width: "18px"}}/>
        }
        // ELSE THE CELL IS HIDDEN, NOTHING RENDERED INSIDE THE CELL
    }

    render() {
        const row = this.props.row
        const column = this.props.column
        return (
            <div
                style={this.CellStyle()}
                onClick={(e) => this.props.cellWasClicked(e, 'left', row, column)} // leftClick on cell
                onContextMenu={(e) => this.props.cellWasClicked(e, 'right', row, column)} // rightClick on cell
            >
                {this.renderCell()}
            </div>
        );
    }
}

export default Cell;
