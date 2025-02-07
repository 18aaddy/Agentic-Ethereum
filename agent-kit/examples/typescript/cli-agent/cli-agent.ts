import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit, WardenTool } from "@wardenprotocol/warden-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
// import { ChatOllama } from "@langchain/ollama";
import * as dotenv from "dotenv";
import * as readline from "readline";
import { z } from "zod";
import { createPublicClient, http, createWalletClient, Account, Chain, ChainDisconnectedError } from "viem";
import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
//import { isAddress, getAddress } from 'ethers';

//import { primaryChain } from "@wardenprotocol/warden-agent-kit-core/typescript/src/utils/chains.ts";

dotenv.config();

/**
 * Initialize the agent with Warden Agent Kit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
    try {
        // Initialize LLM
        const llm = new ChatOpenAI({
            model: "gpt-4o-mini",
        });

        // const llm = new ChatOpenAI(
        //     {
        //         modelName: "google/gemini-2.0-flash-exp:free",
        //         openAIApiKey: process.env.OPENROUTER_API_KEY,
        //     },
        //     {
        //         basePath: "https://openrouter.ai/api/v1",
        //     }
        // );

        // const llm = new ChatOllama({
        //     model: "llama-3.2-3b",
        //     temperature: 0,
        //     maxRetries: 2,
        //     baseUrl: "https://ai.devnet.wardenprotocol.org/openai/v1",
        // });

        // const llm = new ChatOpenAI({
        //     modelName: "llama-3.1-8b-instruct-fp8-l4",
        //     temperature: 0,
        //     maxRetries: 2,
        //     apiKey: "thisIsIgnored",
        //     configuration: {
        //         baseURL: "https://ai.devnet.wardenprotocol.org/openai/v1",
        //     },
        // });

        // Configure Warden Agent Kit
        const config = {
            privateKeyOrAccount:
                (process.env.PRIVATE_KEY as `0x${string}`) || undefined,
        };

        // Initialize Warden Agent Kit
        const agentkit = new WardenAgentKit(config);

        // Initialize Warden Agent Kit Toolkit and get tools
        const wardenToolkit = new WardenToolkit(agentkit);
        const tools = wardenToolkit.getTools();

        
        // Add the custom tool
        const customTool = new WardenTool({
            name: "join_game",
            description: "This tool should be called when a user wants to join the game of chess",
            schema: z.object({}), // there arent any inputs to the function to be called so no schema 
            function: async (account: Account) => {
                try {
                    //return `Feature coming soon! Keep an eye out for updates.`;
                    const publicClient = createPublicClient({
                        chain: chains.sepolia,
                        transport: http(),
                    });
                    //createPublicClient is used to create a client for reading data from the blockchain. This is used for tasks like querying blockchain state, reading from smart contracts, fetching account balances, etc. It is a read-only client, meaning it cannot send transactions or modify the blockchain.
            
                    const walletClient = createWalletClient({
                        account,// address of the key of the ai agent will be fetched automatooically
                        chain: chains.sepolia,
                        transport: http(),
                    });
                    //createWalletClient is used to create a client that can send transactions on behalf of a wallet. This is typically used when you want to sign and broadcast transactions, such as deploying contracts, sending Ether, or interacting with smart contracts that modify the blockchain state (i.e., write functions).
                    
                    // const { request } = await publicClient.simulateContract({
                    //     account,
                    //     address: '0x75ac550f6971bee2ef4e19757af8a5de0ba0207d',
                    //     abi: wagmiAbi,
                    //     functionName: 'joinGame',
                    //   });
                    

                    const hash = await walletClient.writeContract({
                        address: '0x75ac550  f6971bee2ef4e19757af8a5de0ba0207d',
                        abi: wagmiAbi,
                        functionName: 'joinGame',
                        account,
                      })
                    //const hash = await walletClient.writeContract(request);

                    // Native token transfer
                    // const hash = await walletClient.sendTransaction({
                    //     to: args.recipient as `0x${string}`,
                    //     value: BigInt(args.amount),
                    // });
            
                    const receipt = await publicClient.waitForTransactionReceipt({
                        hash,
                    });
            
                    if (receipt.status === "success") {
                        return `Successfully sent chess contract. Transaction hash: ${receipt.transactionHash}`;
                    } else {
                        throw new Error("Transaction failed");
                    }
                } catch (error) {
                    return `Error sending tokens: ${error}`;
                } // Implement the tool's logic
            },
        },agentkit);
        tools.push(customTool);

        // Store buffered conversation history in memory
        const memory = new MemorySaver();
        const agentConfig = {
            configurable: { thread_id: "Warden Agent Kit CLI Agent Example!" },
        };

        
        // Create React Agent using the LLM and Warden Agent Kit tools
        const agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier:
                "You're a helpful assistant that can help with a variety of tasks related to web3 tranactions." +
                "You should only use the provided tools to carry out tasks, interperate the users input" +
                "and select the correct tool to use for the required tasks or tasks.",
        });

        return { agent, config: agentConfig };
    } catch (error) {
        console.error("Failed to initialize agent:", error);
        throw error; // Re-throw to be handled by caller
    }
}
// agent initialised till here 



async function runChatMode(agent: any, config: any) {
    console.log("Starting chat mode... Type 'exit' to end.");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const question = (prompt: string): Promise<string> =>
        new Promise((resolve) => rl.question(prompt, resolve));

    try {
        while (true) {
            const userInput = await question("\nPrompt: ");

            if (userInput.toLowerCase() === "exit") {
                break;
            }

            const stream = await agent.stream(
                { messages: [new HumanMessage(userInput)] },
                config
            );

            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    console.log(chunk.agent.messages[0].content);
                } else if ("tools" in chunk) {
                    console.log(chunk.tools.messages[0].content);
                }
                console.log("-------------------");
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        process.exit(1);
    } finally {
        rl.close();
    }
}

/**
 * Start the chatbot agent
 */
async function main() {
    try {
        const { agent, config } = await initializeAgent();
        await runChatMode(agent, config);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        process.exit(1);
    }
}

if (require.main === module) {
    console.log("Starting Agent...");
    main().catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}
