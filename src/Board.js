import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({
	nrows = 5,
	ncols = 5,
	chanceLightStartsOn = 0.25,
}) {
	const [board, setBoard] = useState(createBoard);

	/** create a board nrows high/ncols wide, each cell randomly lit or unlit */
	function createBoard() {
		let initialBoard = [];
		for (let y = 0; y < nrows; y++) {
			let row = [];
			for (let x = 0; x < ncols; x++) {
				row.push(Math.random() < chanceLightStartsOn);
			}
			initialBoard.push(row);
		}
		return initialBoard;
	}

	function hasWon() {
		return board.every((row) => row.every((cell) => !cell));
	}

	function flipCellsAround(coord) {
		setBoard((oldBoard) => {
			const [y, x] = coord.split("-").map(Number);

			// Make a deep copy of the old baord to not modify the state
			const boardCopy = oldBoard.map((row) => [...row]);

			const flipCell = (y, x, boardCopy) => {
				if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
					boardCopy[y][x] = !boardCopy[y][x];
				}
			};

			// Flip selected cell and its neighbors
			flipCell(y, x, boardCopy);
			flipCell(y, x - 1, boardCopy); // left
			flipCell(y, x + 1, boardCopy); // right
			flipCell(y - 1, x, boardCopy); // above
			flipCell(y + 1, x, boardCopy); // below

			// return copy
			return boardCopy;
		});
	}

	// Rendering the table
	if (hasWon()) {
		return <div>You Won!</div>;
	}

	const tableBoard = board.map((row, y) => (
		<tr key={y} r>
			{row.map((cell, x) => (
				<Cell
					key={`${y}-${x}`}
					isLit={cell}
					flipCellsAroundMe={() =>
						flipCellsAround(`${y}-${x}`)
					}
				/>
			))}
		</tr>
	));

	return (
		<table className='Board'>
			<tbody>{tableBoard}</tbody>
		</table>
	);
}

export default Board;
