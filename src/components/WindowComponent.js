import React, { Component } from 'react';
import { difficulties } from '../minesweeper'

class WindowComponent extends Component {

    styleSmiley = () => ({
        marginLeft: (difficulties[this.props.difficulty].columns*12-88)+"px",
    })

    render() {
        return (
            <div>
                <div className="timer">
                    {this.props.remains}
                </div>
                <div className="button">
                    <img className="image" src={this.props.status+".png"} alt="M" onClick={this.props.resetClick} style={this.styleSmiley()}/>
                </div>
            </div>
        );
    }
}

export default WindowComponent;
