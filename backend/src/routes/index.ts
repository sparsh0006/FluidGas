// backend/src/routes/index.ts
import { Router } from 'express';
import promptRoutes from './prompt.routes';

const router = Router();

router.use('/prompt', promptRoutes);
// Add other routes here later, e.g., router.use('/status', statusRoutes);

export default router;