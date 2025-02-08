import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit, WardenTool } from "@wardenprotocol/warden-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
// import { ChatOllama } from "@langchain/ollama";
import * as dotenv from "dotenv";
import * as readline from "readline";


import { joinGame, joinGameInput } from "./custom-tools/join_game";
import { makeMove, makeMoveInput } from "./custom-tools/make_move";
import { resignGame, resignGameInput } from "./custom-tools/resign_game";
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

        const joinGameTool = new WardenTool({
            name: "join_game",
            description: "This tool should be called when a user wants to join the game of chess",
            schema: joinGameInput, // there arent any inputs to the function to be called so no schema 
            function :joinGame,
        },agentkit);
        
        const makeMoveTool = new WardenTool({
            name: "make_move",
            description: "This tool should be called when a user wants to make a move, for that he needs to give the initial x and y coordinates which are the from coordinates of the piece and also the final x and y coordinates which are the to coordinates  to which the piece is to be moved ",
            schema: makeMoveInput, // there arent any inputs to the function to be called so no schema 
            function :makeMove,
        },agentkit);
        
        const resignGameTool = new WardenTool({
            name: "resign_game",
            description: "This tool should be called when a user wants to resign from the game",
            schema: resignGameInput, // there arent any inputs to the function to be called so no schema 
            function :resignGame,
        },agentkit);
        
        tools.push(joinGameTool,makeMoveTool,resignGameTool);

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
