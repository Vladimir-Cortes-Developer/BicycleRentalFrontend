import * as yup from 'yup'

// Custom error messages in Spanish
yup.setLocale({
  mixed: {
    required: 'Este campo es requerido',
    notType: 'Formato inválido',
  },
  string: {
    email: 'Correo electrónico inválido',
    min: 'Debe tener al menos ${min} caracteres',
    max: 'Debe tener máximo ${max} caracteres',
  },
  number: {
    min: 'Debe ser al menos ${min}',
    max: 'Debe ser máximo ${max}',
    positive: 'Debe ser un número positivo',
  },
})

// Login validation schema
export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
})

// Register validation schema
export const registerSchema = yup.object({
  documentType: yup.string().oneOf(['CC', 'TI', 'CE']).required(),
  documentNumber: yup.string().min(6).max(20).required(),
  firstName: yup.string().max(100).required(),
  lastName: yup.string().max(100).required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    )
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required(),
  phone: yup.string().min(7).max(15).optional(),
  socioeconomicStratum: yup.number().min(1).max(6).optional(),
  regionalId: yup.string().required('La regional es requerida'),
})

// Bicycle validation schema
export const bicycleSchema = yup.object({
  code: yup.string().max(50).required(),
  brand: yup.string().max(100).required(),
  model: yup.string().max(100).optional(),
  color: yup.string().max(50).required(),
  status: yup.string().oneOf(['available', 'rented', 'maintenance', 'retired']).optional(),
  rentalPricePerHour: yup.number().positive().required('El precio por hora es requerido'),
  regionalId: yup.string().required('La regional es requerida'),
})

// Event validation schema
export const eventSchema = yup.object({
  name: yup.string().max(200).required(),
  description: yup.string().max(1000).optional(),
  eventType: yup.string().max(50).optional(),
  eventDate: yup.date().required('La fecha del evento es requerida'),
  startTime: yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)').required(),
  endTime: yup.string().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)').optional(),
  routeDescription: yup.string().optional(),
  meetingPoint: yup.string().max(255).optional(),
  maxParticipants: yup.number().min(1).optional(),
  regionalId: yup.string().required('La regional es requerida'),
})

// Maintenance validation schema
export const maintenanceSchema = yup.object({
  bicycleId: yup.string().required('La bicicleta es requerida'),
  maintenanceType: yup.string().oneOf(['preventive', 'corrective', 'inspection', 'repair', 'other']).required(),
  description: yup.string().optional(),
  cost: yup.number().min(0).optional(),
  performedBy: yup.string().max(150).optional(),
  maintenanceDate: yup.date().optional(),
  nextMaintenanceDate: yup.date().optional(),
})

export default yup