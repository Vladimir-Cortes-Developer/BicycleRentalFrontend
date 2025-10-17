import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authenticate, authorize } from '../middlewares';

const router = Router();
const reportController = new ReportController();

/**
 * @route   GET /api/reports/revenue/monthly
 * @desc    Ingresos mensuales
 * @access  Private (Admin)
 */
router.get('/revenue/monthly', authenticate, authorize('admin'), reportController.getMonthlyRevenue);

/**
 * @route   GET /api/reports/revenue/range
 * @desc    Ingresos por rango
 * @access  Private (Admin)
 */
router.get('/revenue/range', authenticate, authorize('admin'), reportController.getRevenueByDateRange);

/**
 * @route   GET /api/reports/revenue/regional
 * @desc    Ingresos por regional
 * @access  Private (Admin)
 */
router.get('/revenue/regional', authenticate, authorize('admin'), reportController.getRevenueByRegional);

/**
 * @route   GET /api/reports/bicycles/most-rented
 * @desc    Bicicletas más rentadas
 * @access  Private (Admin)
 */
router.get('/bicycles/most-rented', authenticate, authorize('admin'), reportController.getMostRentedBicycles);

/**
 * @route   GET /api/reports/dashboard
 * @desc    Dashboard stats
 * @access  Private (Admin)
 */
router.get('/dashboard', authenticate, authorize('admin'), reportController.getDashboardStats);

/**
 * @route   GET /api/reports/users/stratum
 * @desc    Usuarios por estrato
 * @access  Private (Admin)
 */
router.get('/users/stratum', authenticate, authorize('admin'), reportController.getUsersByStratum);

/**
 * @route   GET /api/reports/discounts
 * @desc    Reporte de descuentos
 * @access  Private (Admin)
 */
router.get('/discounts', authenticate, authorize('admin'), reportController.getDiscountReport);

export default router;
