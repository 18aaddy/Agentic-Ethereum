import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http } from "viem";

// Zod schema for input validation (empty in this case)
export const getCurrentTurnInput = z.object({});

/**
 * Fetches the current turn from the contract.
 *
 * @param args - The input arguments (currently none required).
 * @returns A message containing the current turn (Color).
 */
export async function getCurrentTurn(
    args: z.infer<typeof getCurrentTurnInput>
): Promise<string> {
    try {
        const publicClient = createPublicClient({
            chain: chains.sepolia,
            transport: http(),
        });

        // Read the `currentTurn` from the contract
        const data = await publicClient.readContract({
            address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', // Contract address
            abi: wagmiAbi,  // ABI
            functionName: 'currentTurn',  // Contract function to read
        });

        

        // Return the current turn
        return `The current turn is ${data}`;
    } catch (error) {
        throw new Error(`Failed to fetch the current turn`);
    }
}