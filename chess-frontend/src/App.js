import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Chess piece mapping
const PIECES = {
  PAWN: "♟",
  ROOK: "♜",
  KNIGHT: "♞",
  BISHOP: "♝",
  QUEEN: "♛",
  KING: "♚",
};

const CONTRACT_ADDRESS = "0x6299c3cfd00C5e8c11CC0FC07C6c360aC904fCF7";
const CONTRACT_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "blackPlayer",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "board",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "pieceType",
        type: "uint8",
        internalType: "enum OnChessGame.PieceType",
      },
      {
        name: "color",
        type: "uint8",
        internalType: "enum OnChessGame.Color",
      },
      {
        name: "hasMoved",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "currentTurn",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum OnChessGame.Color",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gameOver",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gameStarted",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "joinGame",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "makeMove",
    inputs: [
      {
        name: "move",
        type: "tuple",
        internalType: "struct OnChessGame.Move",
        components: [
          {
            name: "fromX",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "fromY",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "toX",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "toY",
            type: "uint8",
            internalType: "uint8",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "resignGame",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "whitePlayer",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "GameStarted",
    inputs: [
      {
        name: "whitePlayer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "blackPlayer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GameWon",
    inputs: [
      {
        name: "winner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "winningColor",
        type: "uint8",
        indexed: false,
        internalType: "enum OnChessGame.Color",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MoveMade",
    inputs: [
      {
        name: "player",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "move",
        type: "tuple",
        indexed: false,
        internalType: "struct OnChessGame.Move",
        components: [
          {
            name: "fromX",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "fromY",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "toX",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "toY",
            type: "uint8",
            internalType: "uint8",
          },
        ],
      },
    ],
    anonymous: false,
  },
];

export default function ChessGame() {
  const [board, setBoard] = useState(
    Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
  );
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeContract();
  }, []);

  const initializeContract = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        // Connect to the web3 provider (MetaMask)
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Arbitrum Sepolia network details
        const arbitrumSepoliaNetwork = {
          chainId: "0x66eee", // 421614 in hex
          chainName: "Arbitrum Sepolia",
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
          blockExplorerUrls: ["https://sepolia.arbiscan.io/"],
        };

        try {
          // Request to switch to Arbitrum Sepolia
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x66eee" }],
          });
        } catch (switchError) {
          // If the network is not added, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [arbitrumSepoliaNetwork],
              });
            } catch (addError) {
              console.error("Failed to add network", addError);
            }
          }
        }

        const signer = await provider.getSigner();
        const chessContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );

        setContract(chessContract);

        const handleMoveMade = (player, move) => {
          console.log("Move made. Move: ", move);
          updateBoard(move);
        };

        chessContract.on("MoveMade", handleMoveMade);

        // Load initial board state
        await refreshBoard(chessContract);
        setLoading(false);

        // Optional: Clean up listener when component unmounts
        return () => {
          chessContract.off("MoveMade", handleMoveMade);
        };
      }
    } catch (error) {
      console.error("Error initializing contract:", error);
    }
  };

  const refreshBoard = async (chessContract) => {
    const newBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        try {
          const piece = await chessContract.board(y, x);
          if (piece.pieceType !== 0) {
            newBoard[y][x] = {
              type: Object.keys(PIECES)[piece.pieceType],
              color: piece.color === 0 ? "white" : "black",
            };
          }
        } catch (error) {
          console.error(`Error fetching piece at ${x},${y}:`, error);
        }
      }
    }

    setBoard(newBoard);
  };

  const handleSquareClick = async (x, y) => {
    if (!selectedSquare) {
      if (board[y][x]) {
        setSelectedSquare({ x, y });
      }
    } else {
      try {
        // Make move
        const move = {
          fromX: selectedSquare.x,
          fromY: selectedSquare.y,
          toX: x,
          toY: y,
        };

        const tx = await contract.makeMove(move);
        await tx.wait();

        setSelectedSquare(null);
      } catch (error) {
        console.error("Error making move:", error);
        setSelectedSquare(null);
      }
    }
  };

  const updateBoard = (move) => {
    const newBoard = [...board];
    const piece = newBoard[move.fromY][move.fromX];
    newBoard[move.toY][move.toX] = piece;
    newBoard[move.fromY][move.fromX] = null;
    console.log(
      `Piece moved from y: ${move.fromY} to y: ${move.toY} and from x: ${move.fromX} to x: ${move.toX}`
    );
    setBoard(newBoard);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-8 gap-0">
          {board.map((row, y) =>
            row.map((piece, x) => (
              <div
                key={`${x}-${y}`}
                className={`
                  w-16 h-16 flex items-center justify-center text-4xl
                  ${(x + y) % 2 === 0 ? "bg-gray-200" : "bg-gray-400"}
                  ${
                    selectedSquare &&
                    selectedSquare.x === x &&
                    selectedSquare.y === y
                      ? "bg-yellow-200"
                      : ""
                  }
                  cursor-pointer
                `}
                onClick={() => handleSquareClick(x, y)}
              >
                {piece && (
                  <span
                    className={`${
                      piece.color === "white" ? "text-white" : "text-black"
                    }`}
                  >
                    {PIECES[piece.type]}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
