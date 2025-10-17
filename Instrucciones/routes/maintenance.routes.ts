import { Router } from 'express';
import { MaintenanceLogController } from '../controllers/MaintenanceLogController';
import { authenticate, authorize, validateDto } from '../middlewares';
import { CreateMaintenanceLogDto, UpdateMaintenanceLogDto } from '../dtos';

const router = Router();
const maintenanceLogController = new MaintenanceLogController();

/**
 * @route   POST /api/maintenance
 * @desc    Crear registro de mantenimiento
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateDto(CreateMaintenanceLogDto),
  maintenanceLogController.create
);

/**
 * @route   PUT /api/maintenance/:id
 * @desc    Actualizar registro
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateDto(UpdateMaintenanceLogDto),
  maintenanceLogController.update
);

/**
 * @route   DELETE /api/maintenance/:id
 * @desc    Eliminar registro
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, authorize('admin'), maintenanceLogController.delete);

/**
 * @route   GET /api/maintenance/upcoming
 * @desc    Próximos mantenimientos
 * @access  Private (Admin)
 */
router.get('/upcoming', authenticate, authorize('admin'), maintenanceLogController.getUpcoming);

/**
 * @route   GET /api/maintenance/overdue
 * @desc    Mantenimientos vencidos
 * @access  Private (Admin)
 */
router.get('/overdue', authenticate, authorize('admin'), maintenanceLogController.getOverdue);

/**
 * @route   GET /api/maintenance/stats
 * @desc    Estadísticas
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, authorize('admin'), maintenanceLogController.getStats);

/**
 * @route   GET /api/maintenance/bicycle/:bicycleId
 * @desc    Por bicicleta
 * @access  Private (Admin)
 */
router.get('/bicycle/:bicycleId', authenticate, authorize('admin'), maintenanceLogController.getByBicycle);

/**
 * @route   GET /api/maintenance/:id
 * @desc    Obtener por ID
 * @access  Private (Admin)
 */
router.get('/:id', authenticate, authorize('admin'), maintenanceLogController.getById);

/**
 * @route   GET /api/maintenance
 * @desc    Todos los registros
 * @access  Private (Admin)
 */
router.get('/', authenticate, authorize('admin'), maintenanceLogController.getAll);

/**
 * @route   POST /api/maintenance/:id/complete
 * @desc    Completar mantenimiento
 * @access  Private (Admin)
 */
router.post('/:id/complete', authenticate, authorize('admin'), maintenanceLogController.completeMaintenance);

export default router;
