import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http, Account, Chain, ChainDisconnectedError } from "viem";

export const getBlackPlayerInput = z.object({});

/**
 * Gets balance for a specific key ID.
 *
 * @param args - The input arguments for the action.
 * @returns A message containing the balance information.
 */
export async function getBlackPlayer(
    args: z.infer<typeof getBlackPlayerInput>
): Promise<string> {
    try {
        const publicClient = createPublicClient({
            chain: chains.sepolia,
            transport: http()
          });
          const data = await publicClient.readContract({
            address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
            abi: wagmiAbi,
            functionName: 'blackPlayer',
          })
          return `the address of the blackPlayer ${data}`;
    } catch (error) {
        throw new Error(
            `Failed to fetch the address of the blackPlayer`
        );
    }
}

