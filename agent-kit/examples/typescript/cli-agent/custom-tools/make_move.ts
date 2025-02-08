import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http, createWalletClient, Account, Chain, ChainDisconnectedError } from "viem";
import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit, WardenTool } from "@wardenprotocol/warden-langchain";

// move type equivalent to solidity struct 
type Move = {
    fromX: number; // Corresponds to uint8 in Solidity
    fromY: number; // Corresponds to uint8 in Solidity
    toX: number;   // Corresponds to uint8 in Solidity
    toY: number;   // Corresponds to uint8 in Solidity
};

// Zod schema for Move struct
const moveSchema = z.object({
    fromX: z.number().min(1).max(8), // Equivalent to uint8
    fromY: z.number().min(1).max(8), // Equivalent to uint8
    toX: z.number().min(1).max(8),   // Equivalent to uint8
    toY: z.number().min(1).max(8),   // Equivalent to uint8
});
// Add the custom tool

//custom tool input schema 
export const makeMoveInput = z.object({
    keyId: z.number().positive(),
    move: moveSchema,
});


// Add the custom tool
export const makeMove = async (
    account: Account,
    args: z.infer<typeof makeMoveInput>
  ): Promise<string> => {
    try {
      // Create a public client (for reading data from the blockchain)
      const publicClient = createPublicClient({
        chain: chains.sepolia,
        transport: http(),
      });
  
      // Create a wallet client (for signing transactions)
      const walletClient = createWalletClient({
        account, // address of the key of the AI agent will be fetched automatically
        chain: chains.sepolia,
        transport: http(),
      });
      
      const move: Move = args.move;
      console.log(move);
      // Send the transaction to the blockchain using the wallet client
      const hash = await walletClient.writeContract({
        address: '0x75ac550f6971bee2ef4e19757af8a5de0ba0207d',
        abi: wagmiAbi,
        functionName: 'makeMove',
        args: [move],
        account,
      });
  
      // Wait for the transaction receipt using the public client
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });
  
      // Check if the transaction was successful
      if (receipt.status === "success") {
        return `Successfully sent chess contract. Transaction hash: ${receipt.transactionHash}`;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      return `Error sending tokens: ${error}`;
    }
  };
  