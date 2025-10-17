import { Router } from 'express';
import authRoutes from './auth.routes';
import bicycleRoutes from './bicycle.routes';
import rentalRoutes from './rental.routes';
import eventRoutes from './event.routes';
import maintenanceRoutes from './maintenance.routes';
import reportRoutes from './report.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/bicycles', bicycleRoutes);
router.use('/rentals', rentalRoutes);
router.use('/events', eventRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/reports', reportRoutes);

export default router;
