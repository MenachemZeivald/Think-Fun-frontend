export function getLegalMoves(board, currPosition, color, isKing) {
	const [rowIndex, columnIndex] = currPosition;
	const legalMoves = [];
	const jumpMoves = [];
	const doubleJumpMoves = [];
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
			jumpMoves.push([rowIndex + moveDir * 2, columnIndex - 2]);
		}

		jumpLeft = false;
		if (checkJump(board, moveDir, [rowIndex, columnIndex], color, jumpLeft)) {
			legalMoves.push([rowIndex + moveDir * 2, columnIndex + 2]);
			jumpMoves.push([rowIndex + moveDir * 2, columnIndex + 2]);
		}
	}

	// if (jumpMoves.length > 0) doubleJumpMoves.push(...getLegalJumpMoves(board, jumpMoves, color));

	return [legalMoves, doubleJumpMoves];
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

// write a recursive function to get all the double jump moves
const getLegalJumpMoves = (board, jumpMoves, color) => {
	console.log('jumpMoves', jumpMoves);
	let doubleJumpMoves = [];
	for (const move of jumpMoves) {
		const [row, col] = move;
		const moveDirections = [1, -1];
		for (const moveDir of moveDirections) {
			let jumpLeft = true;
			if (checkJump(board, moveDir, [row, col], color, jumpLeft)) {
				doubleJumpMoves.push([row + moveDir * 2, col - 2]);
			}
			jumpLeft = false;
			if (checkJump(board, moveDir, [row, col], color, jumpLeft)) {
				doubleJumpMoves.push([row + moveDir * 2, col + 2]);
			}
		}
	}
	if (doubleJumpMoves.length > 0) {
		doubleJumpMoves = doubleJumpMoves.concat(getLegalJumpMoves(board, doubleJumpMoves, color));
	}
	return doubleJumpMoves;
};

export function movePiece(board, rowIndex, columnIndex, color, isKing, move) {
	// Check if the move is a jump
	if (Math.abs(move[0] - rowIndex) === 2) {
		// Remove the jumped piece
		const jumpedRow = (move[0] + rowIndex) / 2;
		const jumpedCol = (move[1] + columnIndex) / 2;
		board[jumpedRow][jumpedCol].piece = null;
	}

	// Check if the piece has become a king
	if (move[0] === 0 || move[0] === 7) isKing = true;

	// Move the piece
	board[rowIndex][columnIndex].piece = null;
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
	if (checkIfTie(board, color)) return 'tie';
	return false;
}

function checkIfTie(board, color) {
	const { redPieces, blackPieces } = countPieces(board);
	if (redPieces === 1 && blackPieces === 1) return true;

	let canMove = false;
	for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
		for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
			if (board[rowIndex][columnIndex].piece === color) {
				const [legalMoves] = getLegalMoves(
					board,
					[rowIndex, columnIndex],
					color,
					board[rowIndex][columnIndex].isKing
				);
				if (legalMoves.length > 0) {
					canMove = true;
					break;
				}
			}
		}
	}
	if (!canMove) return 'tie';
	return false;
}

export function AiRandomMove(board) {
	let pieces = [];
	let piece = null;
	let legalMoves = [];
	let move = null;

	while (legalMoves.length === 0) {
		for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
			for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
				if (board[rowIndex][columnIndex].piece === 'black') {
					pieces.push([rowIndex, columnIndex]);
				}
			}
		}
		if (pieces.length === 0) return null;
		piece = pieces[Math.floor(Math.random() * pieces.length)];
		[legalMoves] = getLegalMoves(board, piece, 'black', board[piece[0]][piece[1]].isKing);
		move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
	}
	return [piece, move];
}

function AiMove(board, color) {
	let bestMove = null;
	let bestScore = -Infinity;
	for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
		for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
			if (board[rowIndex][columnIndex].piece === color) {
				const [legalMoves] = getLegalMoves(
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
					const [legalMoves] = getLegalMoves(
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
					const [legalMoves] = getLegalMoves(
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

export function AiTurn(board, color) {
	const move = AiMove(board, color);
	return movePiece(board, move[0], move[1], color, board[move[0]][move[1]].isKing, move[2]);
}
