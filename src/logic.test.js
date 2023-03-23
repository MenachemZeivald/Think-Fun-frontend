import { toBeOneOf } from 'jest-extended';
expect.extend({ toBeOneOf });

import { checkIfWin } from './components/TicTacToe/functions';
import AImove from './components/TicTacToe/HardLevelFunctions';

// tests for checkIfWin function
test('checkIfWin should return true when there is a win', () => {
	const board = ['O', 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'X'];
	const sign = 'O';
	expect(checkIfWin(board, sign)).toBe(true);
});

test('checkIfWin should return false when there is no win', () => {
	const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', ' '];
	const sign = 'O';
	expect(checkIfWin(board, sign)).toBe(false);
});

test('checkIfWin should return tie when there is no empty space and no win', () => {
	const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
	const sign = 'O';
	expect(checkIfWin(board, sign)).toBe('tie');
});

test('checkIfWin should throw an error if the board is not an array', () => {
	expect(() => checkIfWin(board)).toThrow(Error);
});

// tests for AImove function
test('AImove should return the last empty place', () => {
	const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', ' '];
	expect(AImove(board)).toBe(8);
});

test('AImove should return the best move', () => {
	const board = ['X', 'O', 'X', 'O', 'X', 'O', ' ', ' ', ' '];
	expect(AImove(board)).toBeOneOf([6, 8]);
});

test('AImove should return 4 if the center is empty in the first turn', () => {
	const board = ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
	expect(AImove(board)).toBe(4);
});

test('AImove should return one of the corners if the center is not empty in the first turn', () => {
	const board = [' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', ' '];
	expect(AImove(board)).toBeOneOf([0, 2, 6, 8]);
});

test("AImove should return one of the sides if there are 'O' in two opposite edges", () => {
	const board = ['X', ' ', ' ', ' ', 'O', ' ', ' ', ' ', 'X'];
	expect(AImove(board)).toBeOneOf([1, 3, 5, 7]);
});

test('AImove should return the best move', () => {
	const board = [' ', ' ', ' ', ' ', 'O', 'X', ' ', 'X', ' '];
	expect(AImove(board)).toBeOneOf([2, 6, 8]);
});

test('AImove should return the best move', () => {
	const board = [' ', ' ', ' ', ' ', 'O', 'X', 'X', ' ', ' '];
	expect(AImove(board)).toBeOneOf([1, 2, 7, 8]);
});

test('AImove should block attempt to win', () => {
	const board = [' ', ' ', ' ', ' ', 'X', 'X', ' ', ' ', 'O'];
	expect(AImove(board)).toBe(3);
});
