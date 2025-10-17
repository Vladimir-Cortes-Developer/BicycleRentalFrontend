import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authenticate, authorize, validateDto } from '../middlewares';
import { CreateEventDto, UpdateEventDto, RegisterToEventDto } from '../dtos';

const router = Router();
const eventController = new EventController();

/**
 * @route   POST /api/events
 * @desc    Crear evento
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateDto(CreateEventDto),
  eventController.create
);

/**
 * @route   PUT /api/events/:id
 * @desc    Actualizar evento
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateDto(UpdateEventDto),
  eventController.update
);

/**
 * @route   DELETE /api/events/:id
 * @desc    Eliminar evento
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, authorize('admin'), eventController.delete);

/**
 * @route   GET /api/events/upcoming
 * @desc    Eventos próximos
 * @access  Public
 */
router.get('/upcoming', eventController.getUpcoming);

/**
 * @route   GET /api/events/my
 * @desc    Mis eventos
 * @access  Private
 */
router.get('/my', authenticate, eventController.getMyEvents);

/**
 * @route   GET /api/events/:id/participants
 * @desc    Participantes del evento
 * @access  Private (Admin)
 */
router.get('/:id/participants', authenticate, authorize('admin'), eventController.getParticipants);

/**
 * @route   GET /api/events/:id
 * @desc    Obtener evento por ID
 * @access  Public
 */
router.get('/:id', eventController.getById);

/**
 * @route   GET /api/events
 * @desc    Todos los eventos
 * @access  Public
 */
router.get('/', eventController.getAll);

/**
 * @route   POST /api/events/:id/register
 * @desc    Registrarse a evento
 * @access  Private
 */
router.post(
  '/:id/register',
  authenticate,
  validateDto(RegisterToEventDto),
  eventController.registerToEvent
);

/**
 * @route   DELETE /api/events/:id/register
 * @desc    Cancelar registro
 * @access  Private
 */
router.delete('/:id/register', authenticate, eventController.cancelRegistration);

/**
 * @route   POST /api/events/:id/attendance/:userId
 * @desc    Marcar asistencia
 * @access  Private (Admin)
 */
router.post('/:id/attendance/:userId', authenticate, authorize('admin'), eventController.markAttendance);

export default router;
