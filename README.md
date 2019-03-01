# Minesweeper React App

## Quick launch

Install the packages:

```
npm install
```

Run the app:

```
npm start
```

then go to http://localhost:3000/.

## Structure

```
public/
src/
    App.js
    minesweeper.js
    components/
        WindowComponent.js
        BoardComponent.js
        RowComponent.js
        CellComponent.js
```

#### public/

Contains all the images to make the minesweeper like the cool Windows version

#### src/App.js

The main component, stores the state of the game. Renders the control window and the board game. At the bottom the user can set the difficulty for the next game.

#### src/minesweeper.js

Contains the Board class that implements all the methos to run the minesweeper game

#### src/components/CellComponent

This components renders a cell according to its state and the state of the game.

#### src/components/RowComponent

Renders a row of cell components.

#### src/components/BoardComponent

Renders several row components.

#### src/components/Windows

This component renders a counter of how many mines a remaining and a reset button
