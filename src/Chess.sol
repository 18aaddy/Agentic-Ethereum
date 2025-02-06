// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract OnChessGame {
    enum PieceType { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING }
    enum Color { WHITE, BLACK }

    struct Piece {
        PieceType pieceType;
        Color color;
        bool hasMoved;
    }

    struct Move {
        uint8 fromX;
        uint8 fromY;
        uint8 toX;
        uint8 toY;
    }

    Piece[8][8] public board;
    Color public currentTurn;
    address public whitePlayer;
    address public blackPlayer;
    bool public gameStarted;
    bool public gameOver;

    event GameStarted(address whitePlayer, address blackPlayer);
    event MoveMade(address player, Move move);
    event GameWon(address winner, Color winningColor);

    constructor() {

        initializeBoard();
    }

    function initializeBoard() private {
        // Initialize pawns
        for (uint8 x = 0; x < 8; x++) {
            board[1][x] = Piece(PieceType.PAWN, Color.WHITE, false);
            board[6][x] = Piece(PieceType.PAWN, Color.BLACK, false);
        }

        // Initialize other pieces for white
        board[0][0] = Piece(PieceType.ROOK, Color.WHITE, false);
        board[0][1] = Piece(PieceType.KNIGHT, Color.WHITE, false);
        board[0][2] = Piece(PieceType.BISHOP, Color.WHITE, false);
        board[0][3] = Piece(PieceType.QUEEN, Color.WHITE, false);
        board[0][4] = Piece(PieceType.KING, Color.WHITE, false);
        board[0][5] = Piece(PieceType.BISHOP, Color.WHITE, false);
        board[0][6] = Piece(PieceType.KNIGHT, Color.WHITE, false);
        board[0][7] = Piece(PieceType.ROOK, Color.WHITE, false);

        // Initialize other pieces for black
        board[7][0] = Piece(PieceType.ROOK, Color.BLACK, false);
        board[7][1] = Piece(PieceType.KNIGHT, Color.BLACK, false);
        board[7][2] = Piece(PieceType.BISHOP, Color.BLACK, false);
        board[7][3] = Piece(PieceType.QUEEN, Color.BLACK, false);
        board[7][4] = Piece(PieceType.KING, Color.BLACK, false);
        board[7][5] = Piece(PieceType.BISHOP, Color.BLACK, false);
        board[7][6] = Piece(PieceType.KNIGHT, Color.BLACK, false);
        board[7][7] = Piece(PieceType.ROOK, Color.BLACK, false);
    }

    function joinGame() external {
        require(!gameStarted, "Game already started");
        
        if (whitePlayer == address(0)) {
            whitePlayer = msg.sender;
        } else if (blackPlayer == address(0)) {
            blackPlayer = msg.sender;
            gameStarted = true;
            currentTurn = Color.WHITE;
            emit GameStarted(whitePlayer, blackPlayer);
        } else {
            revert("Game is full");
        }
    }

    function makeMove(Move memory move) external {
        require(gameStarted && !gameOver, "Game not active");
        require(msg.sender == (currentTurn == Color.WHITE ? whitePlayer : blackPlayer), "Not your turn");
        
        Piece memory movingPiece = board[move.fromY][move.fromX];
        require(movingPiece.color == currentTurn, "Invalid piece color");

        // Basic move validation (to be expanded with full chess rules)
        require(isValidMove(move, movingPiece), "Invalid move");

        // Execute move
        board[move.toY][move.toX] = movingPiece;
        delete board[move.fromY][move.fromX];
        movingPiece.hasMoved = true;

        // Check for checkmate or other game-ending conditions
        checkGameState();

        // Switch turns
        currentTurn = (currentTurn == Color.WHITE) ? Color.BLACK : Color.WHITE;

        emit MoveMade(msg.sender, move);
    }

    function resignGame() external {
        require(gameStarted && !gameOver, "Invalid game state");
        require(msg.sender == whitePlayer || msg.sender == blackPlayer, "Not a player");

        gameOver = true;
        Color losingColor = (msg.sender == whitePlayer) ? Color.WHITE : Color.BLACK;
        address winner = (losingColor == Color.WHITE) ? blackPlayer : whitePlayer;

        emit GameWon(winner, losingColor == Color.WHITE ? Color.BLACK : Color.WHITE);
    }

    function isValidMove(Move memory move, Piece memory piece) private view returns (bool) {
        // Ensure move is within board bounds
        if (move.toX >= 8 || move.toY >= 8 || move.fromX >= 8 || move.fromY >= 8) {
            return false;
        }
    
        // Prevent moving to a square with a piece of the same color
        Piece memory targetPiece = board[move.toY][move.toX];
        if (targetPiece.color == piece.color) {
            return false;
        }
    
        // Validate moves based on piece type
        int8 dx = int8(move.toX) - int8(move.fromX);
        int8 dy = int8(move.toY) - int8(move.fromY);
        
        if (piece.pieceType == PieceType.PAWN) {
            return validatePawnMove(move, piece, dx, dy);
        } else if (piece.pieceType == PieceType.ROOK) {
            return validateRookMove(move, dx, dy);
        } else if (piece.pieceType == PieceType.KNIGHT) {
            return validateKnightMove(dx, dy);
        } else if (piece.pieceType == PieceType.BISHOP) {
            return validateBishopMove(move, dx, dy);
        } else if (piece.pieceType == PieceType.QUEEN) {
            return validateQueenMove(move, dx, dy);
        } else if (piece.pieceType == PieceType.KING) {
            return validateKingMove(dx, dy);
        }
    
        return false;
    }
    
    function validatePawnMove(Move memory move, Piece memory piece, int8 dx, int8 dy) private view returns (bool) {
        int8 direction = (piece.color == Color.WHITE) ? int8(1) : -1;
        
        // Forward movement
        if (dx == 0) {
            // One square forward
            if (dy == direction) {
                return board[move.toY][move.toX].pieceType == PieceType(0); // Empty square
            }
            
            // Initial two-square move
            if (!piece.hasMoved && dy == 2 * direction) {
                // Check that both squares are empty
                if (int8(move.fromY) + 2 * direction < 0) {
                    return false;
                }
                
                return board[uint256(int256(int8(move.fromY) + direction))][move.fromX].pieceType == PieceType(0) &&
                       board[move.toY][move.toX].pieceType == PieceType(0);
            }
        }
        
        // Capture diagonally
        if (abs(dx) == 1 && dy == direction) {
            Piece memory capturedPiece = board[move.toY][move.toX];
            return capturedPiece.color != piece.color && capturedPiece.pieceType != PieceType(0);
        }
    
        return false;
    }
    
    function validateRookMove(Move memory move, int8 dx, int8 dy) private view returns (bool) {
        // Must move either horizontally or vertically
        if (dx != 0 && dy != 0) return false;
    
        // Check for pieces blocking the path
        return checkClearPath(move.fromX, move.fromY, move.toX, move.toY);
    }
    
    function validateBishopMove(Move memory move, int8 dx, int8 dy) private view returns (bool) {
        // Must move diagonally (equal absolute movement)
        if (abs(dx) != abs(dy)) return false;
    
        // Check for pieces blocking the path
        return checkClearPath(move.fromX, move.fromY, move.toX, move.toY);
    }
    
    function validateQueenMove(Move memory move, int8 dx, int8 dy) private view returns (bool) {
        // Queen moves like rook or bishop
        if (dx != 0 && dy != 0 && abs(dx) != abs(dy)) return false;
    
        // Check for pieces blocking the path
        return checkClearPath(move.fromX, move.fromY, move.toX, move.toY);
    }
    
    function validateKnightMove(int8 dx, int8 dy) private pure returns (bool) {
        // Knight moves in L-shape: 2 squares in one direction, 1 in perpendicular
        return (abs(dx) == 2 && abs(dy) == 1) || (abs(dx) == 1 && abs(dy) == 2);
    }
    
    function validateKingMove(int8 dx, int8 dy) private pure returns (bool) {
        // King can move one square in any direction
        return abs(dx) <= 1 && abs(dy) <= 1;
    }
    
    function checkClearPath(uint8 fromX, uint8 fromY, uint8 toX, uint8 toY) private view returns (bool) {
        int8 dx = toX > fromX ? int8(1) : (toX < fromX ? -1 : int8(0));
        int8 dy = toY > fromY ? int8(1) : (toY < fromY ? -1 : int8(0));
    
        uint8 x = fromX + uint8(dx);
        uint8 y = fromY + uint8(dy);
    
        while (x != toX || y != toY) {
            if (board[y][x].pieceType != PieceType(0)) {
                return false; // Path is blocked
            }
            x += uint8(dx);
            y += uint8(dy);
        }
    
        return true;
    }
    
    function abs(int8 x) private pure returns (uint8) {
        return x >= 0 ? uint8(x) : uint8(-x);
    }

    function checkGameState() private {
        Color currentColor = currentTurn;
        Color opponentColor = (currentColor == Color.WHITE) ? Color.BLACK : Color.WHITE;
    
        // Find the king's position
        uint8 kingX;
        uint8 kingY;
        bool kingFound = false;
        for (uint8 y = 0; y < 8; y++) {
            for (uint8 x = 0; x < 8; x++) {
                if (board[y][x].pieceType == PieceType.KING && board[y][x].color == currentColor) {
                    kingX = x;
                    kingY = y;
                    kingFound = true;
                    break;
                }
            }
            if (kingFound) break;
        }
    
        // Check if king is in check
        bool inCheck = isSquareUnderAttack(kingX, kingY, opponentColor);
    
        // Check if any move can get the king out of check
        if (inCheck) {
            if (!canEscapeCheck(currentColor, kingX, kingY)) {
                // Checkmate
                gameOver = true;
                address winner = (currentColor == Color.WHITE) ? blackPlayer : whitePlayer;
                emit GameWon(winner, opponentColor);
                return;
            }
        } else {
            // Check for stalemate
            if (!hasAnyValidMove(currentColor)) {
                gameOver = true;
                // Stalemate is a draw
                emit GameWon(address(0), Color.WHITE); // Indicates a draw
                return;
            }
        }
    }
    
    function isSquareUnderAttack(uint8 x, uint8 y, Color attackerColor) private view returns (bool) {
        for (uint8 fromY = 0; fromY < 8; fromY++) {
            for (uint8 fromX = 0; fromX < 8; fromX++) {
                Piece memory attacker = board[fromY][fromX];
                
                // Skip if not an attacker piece
                if (attacker.color != attackerColor || attacker.pieceType == PieceType(0)) continue;
    
                Move memory testMove = Move(fromX, fromY, x, y);
                
                // Check if this piece can theoretically move to the target square
                if (isValidMove(testMove, attacker)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    function canEscapeCheck(Color color, uint8 kingX, uint8 kingY) private returns (bool) {
        for (uint8 fromY = 0; fromY < 8; fromY++) {
            for (uint8 fromX = 0; fromX < 8; fromX++) {
                Piece memory piece = board[fromY][fromX];
                
                // Skip if not a piece of the current color
                if (piece.color != color || piece.pieceType == PieceType(0)) continue;
    
                // Try all possible moves for this piece
                for (uint8 toY = 0; toY < 8; toY++) {
                    for (uint8 toX = 0; toX < 8; toX++) {
                        Move memory testMove = Move(fromX, fromY, toX, toY);
                        
                        // If this move is valid, simulate it
                        if (isValidMove(testMove, piece)) {
                            // Temporarily apply the move
                            Piece memory originalTarget = board[toY][toX];
                            board[toY][toX] = piece;
                            delete board[fromY][fromX];
    
                            // Check if king is still in check after this move
                            bool stillInCheck = isSquareUnderAttack(kingX, kingY, 
                                (color == Color.WHITE) ? Color.BLACK : Color.WHITE);
    
                            // Restore the board
                            board[fromY][fromX] = piece;
                            board[toY][toX] = originalTarget;
    
                            // If move removes check, return true
                            if (!stillInCheck) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    
    function hasAnyValidMove(Color color) private view returns (bool) {
        for (uint8 fromY = 0; fromY < 8; fromY++) {
            for (uint8 fromX = 0; fromX < 8; fromX++) {
                Piece memory piece = board[fromY][fromX];
                
                // Skip if not a piece of the current color
                if (piece.color != color || piece.pieceType == PieceType(0)) continue;
    
                // Try all possible moves for this piece
                for (uint8 toY = 0; toY < 8; toY++) {
                    for (uint8 toX = 0; toX < 8; toX++) {
                        Move memory testMove = Move(fromX, fromY, toX, toY);
                        
                        // If this move is valid, return true
                        if (isValidMove(testMove, piece)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}