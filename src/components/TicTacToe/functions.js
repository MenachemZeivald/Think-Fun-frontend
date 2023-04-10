import AImove from './HardLevelFunctions';

var winList = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

export let checkIfWin = (board, sign) => {
	const isWin = winList.some(winCombination => {
		return winCombination.every(index => {
			return board[index] === sign;
		});
	});
	if (isWin) return true;
	if (!board.includes(' ')) return 'tie';
	return false;
};

export let countSign = (board, sign) => {
	return board.filter(board => board === sign).length;
};

export let AIturn = (board, level) => {
	if (level === 'Easy') {
		return randomNum(board);
	} else if (level === 'Medium') {
		return chanceToWin(board) ?? randomNum(board);
	} else if (level === 'Hard') {
		return chanceToWin(board) ?? AImove(board, 'O');
	}
};

let chanceToWin = board => {
	return checkEachOption(board, 'O') ?? checkEachOption(board, 'X');
};

export function checkEachOption(board, sign) {
	let res;
	winList.forEach(winCombination => {
		let temp = winCombination.filter(index => board[index] === sign);
		if (res === undefined && temp.length === 2) {
			res = checkIfEmptyPlace(board, winCombination);
		}
	});
	return res;
}

function checkIfEmptyPlace(board, options) {
	let res;
	options.forEach(i => {
		if (board[i] === ' ') {
			// why not options[i]
			res = i;
		}
	});
	return res;
}

export function findWinArr(board, sign) {
	const winCombination = winList.find(winCombination => {
		return winCombination.every(index => {
			return board[index] === sign;
		});
	});
	return winCombination;
}

function randomNum(board) {
	let randomPlace = Math.floor(Math.random() * 9);
	while (board[randomPlace] !== ' ') {
		randomPlace = Math.floor(Math.random() * 9);
	}
	return randomPlace;
}
