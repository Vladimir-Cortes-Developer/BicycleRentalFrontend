import { Router } from 'express';
import { BicycleController } from '../controllers/BicycleController';
import { authenticate, authorize, validateDto } from '../middlewares';
import { CreateBicycleDto, UpdateBicycleDto } from '../dtos';

const router = Router();
const bicycleController = new BicycleController();

/**
 * @route   POST /api/bicycles
 * @desc    Crear nueva bicicleta
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateDto(CreateBicycleDto),
  bicycleController.create
);

/**
 * @route   GET /api/bicycles/available
 * @desc    Obtener bicicletas disponibles
 * @access  Public
 */
router.get('/available', bicycleController.getAvailable);

/**
 * @route   GET /api/bicycles/nearby
 * @desc    Encontrar bicicletas cercanas
 * @access  Public
 */
router.get('/nearby', bicycleController.getNearby);

/**
 * @route   GET /api/bicycles/stats/count-by-status
 * @desc    Obtener conteo de bicicletas por estado
 * @access  Private (Admin)
 */
router.get(
  '/stats/count-by-status',
  authenticate,
  authorize('admin'),
  bicycleController.getCountByStatus
);

/**
 * @route   GET /api/bicycles/code/:code
 * @desc    Obtener bicicleta por código
 * @access  Public
 */
router.get('/code/:code', bicycleController.getByCode);

/**
 * @route   GET /api/bicycles/:id
 * @desc    Obtener bicicleta por ID
 * @access  Public
 */
router.get('/:id', bicycleController.getById);

/**
 * @route   GET /api/bicycles
 * @desc    Obtener todas las bicicletas
 * @access  Public
 */
router.get('/', bicycleController.getAll);

/**
 * @route   PUT /api/bicycles/:id
 * @desc    Actualizar bicicleta
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateDto(UpdateBicycleDto),
  bicycleController.update
);

/**
 * @route   PATCH /api/bicycles/:id/status
 * @desc    Actualizar estado de bicicleta
 * @access  Private (Admin)
 */
router.patch('/:id/status', authenticate, authorize('admin'), bicycleController.updateStatus);

/**
 * @route   PATCH /api/bicycles/:id/location
 * @desc    Actualizar ubicación de bicicleta
 * @access  Private (Admin)
 */
router.patch('/:id/location', authenticate, authorize('admin'), bicycleController.updateLocation);

/**
 * @route   DELETE /api/bicycles/:id
 * @desc    Eliminar bicicleta
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, authorize('admin'), bicycleController.delete);

export default router;
