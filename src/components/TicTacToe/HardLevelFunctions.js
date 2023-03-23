import { checkEachOption, checkIfWin, countSign } from './functions';

export default function AImove(board) {
	return manualMoves4FirstTurn(board) || buildGameTree(board);
}

function manualMoves4FirstTurn(board) {
	if (countSign(board, 'O') === 0) {
		if (board[4] === ' ') {
			return 4;
		}
		return [0, 2, 6, 8][Math.floor(Math.random() * 4)];
	}

	return false;
}

/**
 * It checks all the possible moves and assigns a score to each move. Then it chooses the best move.
 * @param board - The current state of the board.
 * @returns a number between 1 and 9.
 */
function buildGameTree(board) {
	/* Checking all the possible moves and assigning a score to each move. */
	let avialbleOptions = {};
	for (let place = 0; place < 9; place++) {
		let tempArr = [...board];
		if (board[place] === ' ') {
			tempArr[place] = 'O';
			avialbleOptions[place] = checkBranch(tempArr, 'X');
		}
	}

	/* Choosing the best move. */
	let max = Math.max(...Object.values(avialbleOptions));
	let chooseRandom = Object.keys(avialbleOptions).filter(key => {
		return avialbleOptions[key] === max;
	});
	return chooseRandom[Math.floor(Math.random() * chooseRandom.length)] * 1;
}

function checkBranch(board, sign) {
	let res = checkIfWin(board, sign === 'X' ? 'O' : 'X');
	if (res) {
		if (res === 'tie') {
			return 0;
		}
		return sign === 'O' ? -1 : 1;
	}

	/* Checking if there is a winning move for the AI or the player. If there is, it returns the score
    of that move. */
	let goodOption, tempArr;
	if (sign === 'X') {
		goodOption = checkEachOption(board, 'X') ?? checkEachOption(board, 'O');
	} else {
		goodOption = checkEachOption(board, 'O') ?? checkEachOption(board, 'X');
	}
	if (goodOption) {
		tempArr = [...board];
		tempArr[goodOption] = sign;
		return checkBranch(tempArr, sign === 'X' ? 'O' : 'X');
	}

	/* Checking all the possible moves and assigning a score to each move. */
	let avialbleOptions = {};
	for (let place = 0; place < 9; place++) {
		tempArr = [...board];
		if (board[place] === ' ') {
			tempArr[place] = sign;
			avialbleOptions[place] = checkBranch(tempArr, sign === 'X' ? 'O' : 'X');
		}
	}

	return sign === 'X'
		? Math.min(...Object.values(avialbleOptions))
		: Math.max(...Object.values(avialbleOptions));
}
