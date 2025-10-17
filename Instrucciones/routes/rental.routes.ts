import { Router } from 'express';
import { RentalController } from '../controllers/RentalController';
import { authenticate, authorize, validateDto } from '../middlewares';
import { RentBicycleDto, ReturnBicycleDto } from '../dtos';

const router = Router();
const rentalController = new RentalController();

/**
 * @route   POST /api/rentals
 * @desc    Alquilar bicicleta
 * @access  Private
 */
router.post('/', authenticate, validateDto(RentBicycleDto), rentalController.rentBicycle);

/**
 * @route   PUT /api/rentals/:id/return
 * @desc    Devolver bicicleta
 * @access  Private
 */
router.put('/:id/return', authenticate, validateDto(ReturnBicycleDto), rentalController.returnBicycle);

/**
 * @route   GET /api/rentals/my/active
 * @desc    Mi alquiler activo
 * @access  Private
 */
router.get('/my/active', authenticate, rentalController.getActiveRental);

/**
 * @route   GET /api/rentals/my
 * @desc    Mis alquileres
 * @access  Private
 */
router.get('/my', authenticate, rentalController.getMyRentals);

/**
 * @route   GET /api/rentals/:id
 * @desc    Obtener alquiler por ID
 * @access  Private
 */
router.get('/:id', authenticate, rentalController.getById);

/**
 * @route   GET /api/rentals
 * @desc    Todos los alquileres
 * @access  Private (Admin)
 */
router.get('/', authenticate, authorize('admin'), rentalController.getAll);

/**
 * @route   DELETE /api/rentals/:id
 * @desc    Cancelar alquiler
 * @access  Private
 */
router.delete('/:id', authenticate, rentalController.cancelRental);

export default router;
