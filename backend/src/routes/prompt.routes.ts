import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { TransactionService } from '../services/transaction.service'; // Ensure this path is correct

const router = Router();
const transactionService = new TransactionService();

// Define the handler with a more explicit RequestHandler type
const prepareBridgeHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Extract body parameters
    const { prompt, userSepoliaAddress } = req.body;

    try {
        // Validate inputs
        if (!prompt || typeof prompt !== 'string') {
            // Send response directly for input validation errors
            res.status(400).json({ error: 'Prompt is required and must be a string.' });
            return;
        }
        if (!userSepoliaAddress || typeof userSepoliaAddress !== 'string' || !userSepoliaAddress.startsWith('0x')) {
            // Send response directly for input validation errors
            res.status(400).json({ error: 'userSepoliaAddress is required and must be a valid EVM address.' });
            return;
        }

        // Call the service
        const result = await transactionService.processPromptAndPrepareBridge(prompt, userSepoliaAddress);

        // Check if the service layer returned an error structure
        // (as defined in transaction.service.ts, where it can return { error: string })
        if (result && typeof result === 'object' && 'error' in result && result.error) {
            res.status(400).json(result); // Send the error from the service (e.g., OpenAI parsing failed)
            return;
        }
        
        // If successful, send the result
        res.status(200).json(result);
        return;

    } catch (error) {
        // For unexpected errors during the process, pass them to the global error handler
        console.error("Error in /prepare-bridge handler:", error);
        next(error); // This will be caught by app.use((err, req, res, next) => ...) in index.ts
    }
};

// Use the explicitly typed handler
router.post('/prepare-bridge', prepareBridgeHandler);

export default router;