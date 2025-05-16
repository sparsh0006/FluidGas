// backend/src/config/index.ts
import dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env' }); // Ensure .env is loaded from backend root

export const config = {
    port: process.env.PORT || 3001,
    openaiApiKey: process.env.OPENAI_API_KEY,
    sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL,
    solanaDevnetRpcUrl: process.env.SOLANA_DEVNET_RPC_URL,
    // This is a simplified example. In a real app, you'd have a better token management system.
    supportedTokens: {
        sepolia: {
            // For simplicity, let's assume the user will provide the token address
            // or we map it from a known symbol like "TestUSDC"
            // "TestUSDC": process.env.EXAMPLE_SEPOLIA_TEST_TOKEN_ADDRESS || "0x...",
        },
    },
};

if (!config.openaiApiKey) {
    console.warn("Warning: OPENAI_API_KEY is not set in .env file.");
}