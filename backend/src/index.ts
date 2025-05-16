// backend/src/index.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import allRoutes from './routes'; // Main router

const app: Express = express();
const port = config.port;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Basic Health Check Route
app.get('/', (req: Request, res: Response) => {
    res.send('FluidGas Backend is Alive!');
});

// API Routes
app.use('/api', allRoutes); // Prefix all API routes with /api

// Global Error Handler (Simple Example)
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!', message: err.message });
});


app.listen(port, () => {
    console.log(`⚡️[FluidGas Backend]: Server is running at http://localhost:${port}`);
    console.log(`🔑 OpenAI Key Loaded: ${!!config.openaiApiKey}`);
    if (!config.openaiApiKey) {
        console.error("FATAL: OpenAI API Key is not configured. Please set OPENAI_API_KEY in your .env file.");
        // process.exit(1); // Optionally exit if critical config is missing
    }
    // Initialize services if they need async setup not handled in constructor
    // Example: new WormholeService(); // If constructor does async init and it's okay to be unawaited here
});