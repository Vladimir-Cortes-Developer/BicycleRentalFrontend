import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate, validateDto } from '../middlewares';
import { RegisterUserDto, LoginDto } from '../dtos';

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', validateDto(RegisterUserDto), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', validateDto(LoginDto), authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/me', authenticate, authController.getProfile);

export default router;
