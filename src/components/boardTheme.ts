import type { ChessboardOptions } from 'react-chessboard';

export const boardTheme = {
  darkSquareStyle: { backgroundColor: '#769656' },
  lightSquareStyle: { backgroundColor: '#eeeed2' },
  boardStyle: { borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgb(0 0 0 / 0.4)' },
} satisfies ChessboardOptions;
