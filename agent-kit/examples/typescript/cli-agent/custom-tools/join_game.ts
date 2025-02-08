import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http, createWalletClient, Account, Chain, ChainDisconnectedError } from "viem";
import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit, WardenTool } from "@wardenprotocol/warden-langchain";

// Add the custom tool

//custom tool input schema 
export const joinGameInput = z.object({
    keyId: z.number().positive(),
});


// Add the custom tool
export const joinGame = async (
    account: Account,
    args: z.infer<typeof joinGameInput>
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
  
      // Send the transaction to the blockchain using the wallet client
      const hash = await walletClient.writeContract({
        address: '0x75ac550f6971bee2ef4e19757af8a5de0ba0207d',
        abi: wagmiAbi,
        functionName: 'joinGame',
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
  