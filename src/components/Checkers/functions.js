export function getLegalMoves(board, currPosition, color, isKing) {
	const [rowIndex, columnIndex] = currPosition;
	const legalMoves = [];
	const moveDirections = isKing ? [-1, 1] : [color === 'red' ? 1 : -1];

	// Check legal moves in all directions
	for (const moveDir of moveDirections) {
		const leftRow = rowIndex + moveDir;
		const rightRow = rowIndex + moveDir;
		const leftCol = columnIndex - 1;
		const rightCol = columnIndex + 1;

		if (checkMove(board, leftRow, leftCol)) {
			legalMoves.push([leftRow, leftCol]);
		}

		if (checkMove(board, rightRow, rightCol)) {
			legalMoves.push([rightRow, rightCol]);
		}

		let jumpLeft = true;
		if (checkJump(board, moveDir, [rowIndex, columnIndex], color, jumpLeft)) {
			legalMoves.push([rowIndex + moveDir * 2, columnIndex - 2]);
		}

		jumpLeft = false;
		if (checkJump(board, moveDir, [rowIndex, columnIndex], color, jumpLeft)) {
			legalMoves.push([rowIndex + moveDir * 2, columnIndex + 2]);
		}
	}

	return legalMoves;
}

const checkMove = (board, row, col) => {
	return row >= 0 && row < 8 && col >= 0 && col < 8 && board[row][col].piece === null;
};

const checkJump = (board, moveDir, currPosition, color, jumpLeft) => {
	const [row, col] = currPosition;
	const middleRow = row + moveDir;
	const middleCol = col + (jumpLeft ? -1 : 1);
	const jumpRow = row + moveDir * 2;
	const jumpCol = col + (jumpLeft ? -1 : 1) * 2;
	return (
		middleRow < 8 &&
		middleRow >= 0 &&
		middleCol < 8 &&
		middleCol >= 0 &&
		jumpRow >= 0 &&
		jumpRow < 8 &&
		jumpCol < 8 &&
		jumpCol >= 0 &&
		board[middleRow][middleCol].piece !== null &&
		board[middleRow][middleCol].piece !== color &&
		board[jumpRow][jumpCol].piece === null
	);
};

export function movePiece(board, rowIndex, columnIndex, color, isKing, move) {
	// Check if the move is a jump
	if (Math.abs(move[0] - rowIndex) === 2) {
		// Remove the jumped piece
		const jumpedRow = (move[0] + rowIndex) / 2;
		const jumpedCol = (move[1] + columnIndex) / 2;
		board[jumpedRow][jumpedCol].piece = null;
		board[jumpedRow][jumpedCol].isKing = null;
	}

	// Check if the piece has become a king
	if (move[0] === 0 || move[0] === 7) isKing = true;

	// Move the piece
	board[rowIndex][columnIndex].piece = null;
	board[rowIndex][columnIndex].isKing = null;
	board[move[0]][move[1]].piece = color;
	board[move[0]][move[1]].isKing = isKing;

	return board;
}

export function countPieces(board) {
	let redPieces = 0;
	let blackPieces = 0;
	for (const row of board) {
		for (const square of row) {
			if (square.piece === 'red') redPieces++;
			if (square.piece === 'black') blackPieces++;
		}
	}
	return { redPieces, blackPieces };
}

export function checkIfWin(board, color) {
	if (board.length === 0) return false;
	const { redPieces, blackPieces } = countPieces(board);
	if (color === 'red' && redPieces === 0) return 'lose';
	if (color === 'red' && blackPieces === 0) return 'win';
	if (color === 'black' && redPieces === 0) return 'win';
	if (color === 'black' && blackPieces === 0) return 'lose';
	if (checkIfTie(board, color)) {
		if (color === 'red' && redPieces > blackPieces) return 'win';
		if (color === 'red' && redPieces < blackPieces) return 'lose';
		if (color === 'black' && redPieces > blackPieces) return 'lose';
		if (color === 'black' && redPieces < blackPieces) return 'win';
		if (redPieces === blackPieces) return 'tie';
	}
	return false;
}

function checkIfTie(board, color) {
	const { redPieces, blackPieces } = countPieces(board);
	if (redPieces === 1 && blackPieces === 1) return true;

	for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
		for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
			if (board[rowIndex][columnIndex].piece === color) {
				const legalMoves = getLegalMoves(
					board,
					[rowIndex, columnIndex],
					color,
					board[rowIndex][columnIndex].isKing
				);
				if (legalMoves.length > 0) return false;
			}
		}
	}
	return true;
}

function AiRandomMove(board) {
	if (board.length === 0) return [null];

	let pieces = {};

	for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
		for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
			if (board[rowIndex][columnIndex].piece === 'black') {
				pieces[[rowIndex, columnIndex]] = getLegalMoves(
					board,
					[rowIndex, columnIndex],
					'black',
					board[rowIndex][columnIndex].isKing
				);
			}
			if (pieces[[rowIndex, columnIndex]] && pieces[[rowIndex, columnIndex]].length === 0)
				delete pieces[[rowIndex, columnIndex]];
		}
	}

	if (Object.keys(pieces).length === 0) return [null];

	let piece = Object.keys(pieces)[Math.floor(Math.random() * Object.keys(pieces).length)];
	piece = piece.split(',').map(num => parseInt(num));
	let move = pieces[piece][Math.floor(Math.random() * pieces[piece].length)];
	return [piece, move];
}

function AiTryToEat(board) {
	let pieces = [];
	let legalMoves = [];

	for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
		for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
			if (board[rowIndex][columnIndex].piece === 'black') {
				pieces.push([rowIndex, columnIndex]);
			}
		}
	}
	if (pieces.length === 0) return null;

	for (const piece of pieces) {
		legalMoves = getLegalMoves(board, piece, 'black', board[piece[0]][piece[1]].isKing);
		for (const move of legalMoves) {
			if (Math.abs(move[0] - piece[0]) === 2) {
				return [piece, move];
			}
		}
	}
	return null;
}

function AiMove(board, color) {
	let bestMove = null;
	let bestScore = -Infinity;
	for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
		for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
			if (board[rowIndex][columnIndex].piece === color) {
				const legalMoves = getLegalMoves(
					board,
					[rowIndex, columnIndex],
					color,
					board[rowIndex][columnIndex].isKing
				);
				for (const move of legalMoves) {
					const newBoard = movePiece(
						JSON.parse(JSON.stringify(board)),
						rowIndex,
						columnIndex,
						color,
						board[rowIndex][columnIndex].isKing,
						move
					);
					const score = minimax(newBoard, 3, false, color);
					if (score > bestScore) {
						bestScore = score;
						bestMove = [rowIndex, columnIndex, move];
					}
				}
			}
		}
	}
	return bestMove;
}

function minimax(board, depth, isMaximizing, color) {
	const result = checkIfWin(board, color);
	if (result === 'win') return 10;
	if (result === 'lose') return -10;
	if (result === 'tie') return 0;
	if (depth === 0) return 0;

	if (isMaximizing) {
		let bestScore = -Infinity;
		for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
			for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
				if (board[rowIndex][columnIndex].piece === color) {
					const legalMoves = getLegalMoves(
						board,
						[rowIndex, columnIndex],
						color,
						board[rowIndex][columnIndex].isKing
					);
					for (const move of legalMoves) {
						const newBoard = movePiece(
							JSON.parse(JSON.stringify(board)),
							rowIndex,
							columnIndex,
							color,
							board[rowIndex][columnIndex].isKing,
							move
						);
						const score = minimax(newBoard, depth - 1, false, color);
						bestScore = Math.max(score, bestScore);
					}
				}
			}
		}
		return bestScore;
	} else {
		let bestScore = Infinity;
		for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
			for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
				if (board[rowIndex][columnIndex].piece === color) {
					const legalMoves = getLegalMoves(
						board,
						[rowIndex, columnIndex],

						color,
						board[rowIndex][columnIndex].isKing
					);
					for (const move of legalMoves) {
						const newBoard = movePiece(
							JSON.parse(JSON.stringify(board)),
							rowIndex,
							columnIndex,
							color,
							board[rowIndex][columnIndex].isKing,
							move
						);
						const score = minimax(newBoard, depth - 1, true, color);
						bestScore = Math.min(score, bestScore);
					}
				}
			}
		}
		return bestScore;
	}
}

export function AiTurn(board, level, color = 'black') {
	if (level === 'Easy') return AiRandomMove(board);
	if (level === 'Medium') return AiTryToEat(board) || AiRandomMove(board);
	if (level === 'Hard') return AiTryToEat(board) || AiRandomMove(board);
	//if (level === 'hard') return AiTryToEat(board) || AiMove(board, color);
}
