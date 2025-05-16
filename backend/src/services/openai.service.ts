// backend/src/services/openai.service.ts
import OpenAI from 'openai';
import { config } from '../config';

// This interface should match what your OpenAI prompt is designed to return
export interface ParsedPrompt {
    tokenSymbolOrAddress: string | null;
    amount: number | null;
    destinationAddress: string | null;
    requestDestinationGas: boolean; // Should be false if not mentioned
    destinationGasAmount?: number;   // Should be undefined if not requested or not specified
    sourceChain: 'Sepolia' | null;
    destinationChain: 'Solana' | null;
    error?: string; // Optional field for OpenAI to indicate parsing issues
}

const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

export class OpenAIService {
    async parseBridgePrompt(prompt: string): Promise<ParsedPrompt | null> {
        if (!config.openaiApiKey) {
            throw new Error("OpenAI API key not configured.");
        }
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-0125",
                messages: [
                    {
                        role: "system",
                        content: `You are an intelligent assistant for a blockchain bridging application.
                        User wants to bridge tokens from Sepolia (EVM) to Solana.
                        Extract the following details:
                        - tokenSymbolOrAddress: The symbol (e.g., "USDC") or contract address (e.g., "0xabc123...") of the token.
                        - amount: The numerical amount of tokens to bridge.
                        - destinationAddress: The recipient's Solana address.
                        - requestDestinationGas: A boolean (true/false). Set to true if the user mentions wanting gas, SOL, or fees on the destination. Otherwise, set to false.
                        - destinationGasAmount: If requestDestinationGas is true and a specific SOL amount is mentioned (e.g., "0.01 SOL"), extract that number. If requestDestinationGas is true but no specific amount is mentioned, default destinationGasAmount to 0.01. If requestDestinationGas is false, destinationGasAmount should be null or not present.
                        Assume sourceChain is "Sepolia" and destinationChain is "Solana".
                        Respond ONLY with a JSON object.
                        If crucial information like token, amount, or destination address is missing, set their values to null and include an "error" field explaining what's missing.
                        Example successful response (with gas requested, default amount):
                        { "tokenSymbolOrAddress": "TestUSDC", "amount": 50, "destinationAddress": "SoLAnAaddRESShERE", "requestDestinationGas": true, "destinationGasAmount": 0.01, "sourceChain": "Sepolia", "destinationChain": "Solana" }
                        Example successful response (no gas requested):
                        { "tokenSymbolOrAddress": "TestUSDC", "amount": 0.1, "destinationAddress": "SoLAnAaddRESShERE", "requestDestinationGas": false, "sourceChain": "Sepolia", "destinationChain": "Solana" }
                        Example if missing info:
                        { "tokenSymbolOrAddress": null, "amount": 10, "destinationAddress": null, "requestDestinationGas": false, "sourceChain": "Sepolia", "destinationChain": "Solana", "error": "Missing token or destination address." }`
                    },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0]?.message?.content;
            if (content) {
                const parsed = JSON.parse(content) as ParsedPrompt; // Cast to your defined interface

                if (parsed.error) {
                    console.warn("OpenAI parsing warning:", parsed.error);
                }

                // Ensure critical fields are at least present, even if null from OpenAI
                const result: ParsedPrompt = {
                    tokenSymbolOrAddress: parsed.tokenSymbolOrAddress || null,
                    amount: parsed.amount === undefined ? null : parsed.amount, // handle 0 amount if needed
                    destinationAddress: parsed.destinationAddress || null,
                    requestDestinationGas: parsed.requestDestinationGas || false, // Default to false
                    destinationGasAmount: parsed.requestDestinationGas ? (parsed.destinationGasAmount || 0.01) : undefined, // Default if requested but not specified
                    sourceChain: "Sepolia", // Assume for now
                    destinationChain: "Solana", // Assume for now
                    error: parsed.error
                };

                // Final validation after structuring
                if (result.tokenSymbolOrAddress === null || result.amount === null || result.destinationAddress === null) {
                     console.error("OpenAI parsing error: Missing critical information after structuring.");
                     // Set a more specific error if not already set by OpenAI
                     result.error = result.error || "Missing critical information (token, amount, or destination address).";
                }
                return result;
            }
            return null;
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            throw new Error("Failed to parse prompt using AI.");
        }
    }
}