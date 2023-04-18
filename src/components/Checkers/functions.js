export function getLegalMoves(board, rowIndex, columnIndex, color, isKing) {
	const legalMoves = [];

	// Determine the direction(s) the piece can move based on its color and king status
	const moveDirections = [];
	if (isKing) {
		moveDirections.push(-1, 1);
	} else {
		moveDirections.push(color === 'red' ? 1 : -1);
	}

	// Check if the piece can move diagonally to the left and right in all possible directions
	for (const moveDirection of moveDirections) {
		if (columnIndex > 0) {
			const leftRow = rowIndex + moveDirection;
			const leftCol = columnIndex - 1;
			if (leftRow < 8 && board[leftRow][leftCol].piece === null) {
				legalMoves.push([leftRow, leftCol]);
			}
		}

		if (columnIndex < 7) {
			const rightRow = rowIndex + moveDirection;
			const rightCol = columnIndex + 1;
			if (rightRow < 8 && board[rightRow][rightCol].piece === null) {
				legalMoves.push([rightRow, rightCol]);
			}
		}

		// Check if the piece can jump diagonally to the left in all possible directions
		if (columnIndex > 1) {
			const leftRow = rowIndex + moveDirection;
			const leftCol = columnIndex - 1;
			const jumpRow = rowIndex + moveDirection * 2;
			const jumpCol = columnIndex - 2;
			if (
				leftRow < 8 &&
				jumpRow < 8 &&
				board[leftRow][leftCol].piece !== null &&
				board[leftRow][leftCol].piece !== color &&
				board[jumpRow][jumpCol].piece === null
			) {
				legalMoves.push([jumpRow, jumpCol]);
			}
		}

		// Check if the piece can jump diagonally to the right in all possible directions
		if (columnIndex < 6) {
			const rightRow = rowIndex + moveDirection;
			const rightCol = columnIndex + 1;
			const jumpRow = rowIndex + moveDirection * 2;
			const jumpCol = columnIndex + 2;
			if (
				rightRow < 8 &&
				jumpRow < 8 &&
				board[rightRow][rightCol].piece !== null &&
				board[rightRow][rightCol].piece !== color &&
				board[jumpRow][jumpCol].piece === null
			) {
				legalMoves.push([jumpRow, jumpCol]);
			}
		}
	}

	return legalMoves;
}

// write a function that change the board if the user choose a legal move
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

//write a function that check if the user can jump again
// export function canJumpAgain(board, rowIndex, columnIndex, color, isKing) {
// 	const legalMoves = getLegalMoves(board, rowIndex, columnIndex, color, isKing);
// 	for (const move of legalMoves) {
// 		if (Math.abs(move[0] - rowIndex) === 2) return true;
// 	}
// 	return false;
// }

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
	console.log(board);
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
				const legalMoves = getLegalMoves(
					board,
					rowIndex,
					columnIndex,
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

function AiMove(board, color) {
	let bestMove = null;
	let bestScore = -Infinity;
	for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
		for (let columnIndex = 0; columnIndex < 8; columnIndex++) {
			if (board[rowIndex][columnIndex].piece === color) {
				const legalMoves = getLegalMoves(
					board,
					rowIndex,
					columnIndex,
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
						rowIndex,
						columnIndex,
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
						rowIndex,
						columnIndex,
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
