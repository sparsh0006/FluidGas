// backend/src/services/wormhole.service.ts
import {
    wormhole,
    TokenId,
    ChainAddress,
    TokenTransfer,
    amount,
    Wormhole,
    Contracts, // Stays
    // ChainConfig, // We will define our override structure slightly differently
    Network,   // For Network type "Testnet"
    Chain,     // For Chain types like "Sepolia", "Solana"
    WormholeConfigOverrides, // This is what the wormhole constructor expects
} from "@wormhole-foundation/sdk";

// Import platform modules - this style is correct
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";

import { config } from "../config";

// Official addresses you provided
const SEPOLIA_WORMHOLE_TOKEN_BRIDGE_ADDRESS = "0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78";
const SOLANA_DEVNET_WORMHOLE_TOKEN_BRIDGE_PROGRAM_ID = "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5";

const SEPOLIA_TOKEN_DETAILS_MAP: Record<string, { address: string, decimals: number }> = {
    "TESTUSDC": {
        address: process.env.EXAMPLE_SEPOLIA_TEST_TOKEN_ADDRESS || "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
        decimals: 6
    }
};

export interface PreparedBridgeTransactionParams {
    sourceChain: "Sepolia";
    destinationChain: "Solana";
    tokenAddress: string;
    normalizedAmount: string;
    recipientAddress: string;
    needsApproval: boolean;
    approveToAddress?: string;
    estimatedFees?: any;
    nativeGasAmountForDisplay?: number;
}

export class WormholeService {
    private wh: Awaited<ReturnType<typeof wormhole>> | null = null;

    constructor() {
        // ensureInitialized will be called before SDK use
    }

    private async ensureInitialized() {
        if (!this.wh) {
            // Do not call the platform loader functions here; pass them directly to wormhole
            // Define the overrides according to WormholeConfigOverrides type structure
            // Network is 'Testnet'
            // Chain types are "Sepolia" and "Solana"
            const sdkConfigOverrides: WormholeConfigOverrides<"Testnet"> = {
                chains: {
                    Sepolia: { // This key is a Chain type
                        rpc: config.sepoliaRpcUrl,
                        contracts: {
                            CoreBridge: undefined,
                            TokenBridge: SEPOLIA_WORMHOLE_TOKEN_BRIDGE_ADDRESS,
                        } as Contracts, // Casting to Contracts is fine here
                    },
                    Solana: { // This key is a Chain type
                        rpc: config.solanaDevnetRpcUrl,
                        contracts: {
                            CoreBridge: undefined,
                            TokenBridge: SOLANA_DEVNET_WORMHOLE_TOKEN_BRIDGE_PROGRAM_ID,
                        } as Contracts,
                    },
                },
            };

            this.wh = await wormhole("Testnet", [evm, solana], sdkConfigOverrides);


            const sepoliaCtxTest = this.wh.getChain("Sepolia");
            console.log("Initialized Sepolia Token Bridge from SDK config:", sepoliaCtxTest.config.contracts.TokenBridge);
            const solanaCtxTest = this.wh.getChain("Solana");
            console.log("Initialized Solana Token Bridge from SDK config:", solanaCtxTest.config.contracts.TokenBridge);
        }
    }

    public async getTokenDetails(tokenSymbolOrAddress: string, chain: "Sepolia"): Promise<{ address: string, decimals: number }> {
        // This check is against a literal string, which is fine.
        if (chain !== "Sepolia") throw new Error("getTokenDetails currently only supports Sepolia");

        if (tokenSymbolOrAddress.startsWith("0x")) {
            const entry = Object.values(SEPOLIA_TOKEN_DETAILS_MAP).find(
                val => val.address.toLowerCase() === tokenSymbolOrAddress.toLowerCase()
            );
            if (entry) return entry;
            console.warn(`Decimals for address ${tokenSymbolOrAddress} on ${chain} are not pre-configured. Assuming 6 for ERC20.`);
            return { address: tokenSymbolOrAddress, decimals: 6 };
        }
        const details = SEPOLIA_TOKEN_DETAILS_MAP[tokenSymbolOrAddress.toUpperCase()];
        if (!details) {
            throw new Error(`Unsupported or unknown token symbol: ${tokenSymbolOrAddress} on ${chain}`);
        }
        return details;
    }

    async prepareTokenBridgeParams(
        sourceTokenAddress: string,
        bridgeAmount: number,
        sourceTokenDecimals: number,
        sourceUserEvmAddress: string,
        destinationSolanaAddress: string,
        deliverNativeGasAmountInSol?: number
    ): Promise<PreparedBridgeTransactionParams> {
        await this.ensureInitialized();
        if (!this.wh) throw new Error("Wormhole SDK not initialized");

        const srcChainCtx = this.wh.getChain("Sepolia");
        const dstChainCtx = this.wh.getChain("Solana");

        const tokenBridgeAddressOnSepolia = srcChainCtx.config.contracts.TokenBridge;
        if (!tokenBridgeAddressOnSepolia) {
            console.error("Sepolia config from SDK:", srcChainCtx.config);
            throw new Error("Failed to load TokenBridge contract address for Sepolia from SDK config.");
        }
        console.log(`Using Sepolia Token Bridge address for approval: ${tokenBridgeAddressOnSepolia}`);

        // Use literal chain names "Sepolia" and "Solana" which are valid Chain types
        const token: TokenId = Wormhole.tokenId("Sepolia", sourceTokenAddress);
        const sender: ChainAddress = Wormhole.chainAddress("Sepolia", sourceUserEvmAddress);
        const recipient: ChainAddress = Wormhole.chainAddress("Solana", destinationSolanaAddress);

        // Pass decimals as a number to amount.parse
        const normalizedTokenAmountBigInt = amount.units(
            amount.parse(bridgeAmount.toString(), sourceTokenDecimals)
        );

        let nativeGasInLamports: bigint | undefined = undefined;
        if (deliverNativeGasAmountInSol && deliverNativeGasAmountInSol > 0) {
            const solDecimals = 9;
            try {
                // Pass decimals as a number to amount.parse
                nativeGasInLamports = amount.units(
                    amount.parse(deliverNativeGasAmountInSol.toString(), solDecimals)
                );
            } catch (e) {
                console.error(`Error parsing or converting native gas amount: ${deliverNativeGasAmountInSol}`, e);
                throw new Error(`Invalid native gas amount provided: ${deliverNativeGasAmountInSol}`);
            }
        }

        const xferForQuote = await this.wh.tokenTransfer(
            token,
            normalizedTokenAmountBigInt,
            sender,
            recipient,
            true,
            undefined,
            nativeGasInLamports
        );

        let quote;
        // try {
        //     // Pass ChainContext objects directly if quoteTransfer expects them,
        //     // or their .chain property (which is the Chain name string)
        //     quote = await TokenTransfer.quoteTransfer(
        //         this.wh,
        //         srcChainCtx, // Pass the ChainContext object
        //         dstChainCtx, // Pass the ChainContext object
        //         xferForQuote.transfer
        //     );
        //     console.log("Transfer Quote:", quote);
        // } catch (e: any) {
        //     console.warn("Could not retrieve quote for transfer:", e.message);
        // }

        return {
            sourceChain: "Sepolia",
            destinationChain: "Solana",
            tokenAddress: sourceTokenAddress,
            normalizedAmount: normalizedTokenAmountBigInt.toString(),
            recipientAddress: destinationSolanaAddress,
            needsApproval: true,
            approveToAddress: tokenBridgeAddressOnSepolia,
            estimatedFees: quote,
            nativeGasAmountForDisplay: deliverNativeGasAmountInSol,
        };
    }
}