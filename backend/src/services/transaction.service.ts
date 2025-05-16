// backend/src/services/transaction.service.ts
import { OpenAIService } from './openai.service';
import { WormholeService, PreparedBridgeTransactionParams } from './wormhole.service';

export class TransactionService {
    private openaiService: OpenAIService;
    private wormholeService: WormholeService;

    constructor() {
        this.openaiService = new OpenAIService();
        this.wormholeService = new WormholeService();
    }

    async processPromptAndPrepareBridge(
        prompt: string,
        userSepoliaAddress: string
    ): Promise<PreparedBridgeTransactionParams | { error: string; details?: any }> {
        try {
            const parsedIntent = await this.openaiService.parseBridgePrompt(prompt);

            if (!parsedIntent) {
                return { error: "Could not understand your request. Please try again." };
            }
            if (!parsedIntent.tokenSymbolOrAddress || typeof parsedIntent.amount === 'undefined' || parsedIntent.amount === null || !parsedIntent.destinationAddress) {
                // Check for amount being undefined or null specifically
                return { error: "Missing critical information in your request (token, amount, or destination address).", details: parsedIntent };
            }
            if (parsedIntent.sourceChain !== 'Sepolia' || parsedIntent.destinationChain !== 'Solana') {
                return { error: "Bridging is currently only supported from Sepolia to Solana via this prompt." };
            }

            let tokenDetails;
            try {
                tokenDetails = await this.wormholeService.getTokenDetails(parsedIntent.tokenSymbolOrAddress, "Sepolia");
            } catch (tokenError: any) {
                return { error: `Token error: ${tokenError.message}` };
            }

            // Make sure destinationGasAmount is passed correctly
            const deliverNativeGasAmountInSol = parsedIntent.requestDestinationGas ? parsedIntent.destinationGasAmount : undefined;

            const params = await this.wormholeService.prepareTokenBridgeParams(
                tokenDetails.address,
                parsedIntent.amount,
                tokenDetails.decimals,
                userSepoliaAddress,
                parsedIntent.destinationAddress,
                deliverNativeGasAmountInSol // Pass the user-friendly SOL amount
            );

            return params;

        } catch (error: any) {
            console.error("Error in TransactionService:", error);
            // The error message "RangeError: The number 0.01 cannot be converted to a BigInt..."
            // indicates the issue originated deeper, likely in wormhole.service.ts if the conversion wasn't done.
            // This console.error here is good for general service errors.
            return { error: error.message || "An unexpected error occurred while preparing the transaction." };
        }
    }
}