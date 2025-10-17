import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { User, Pencil, Lock, Save, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { Input } from '../components/common/Input'
import { Select } from '../components/common/Select'
import { Button } from '../components/common/Button'
import { Spinner } from '../components/common/Spinner'
import { DOCUMENT_TYPES, SOCIOECONOMIC_STRATA } from '../constants'
import apiClient from '../api/client'
import toast from 'react-hot-toast'
import { ApiResponse } from '../types'

// Schema for profile update
const profileSchema = yup.object({
  phone: yup.string().optional(),
  socioeconomicStratum: yup.number().min(1).max(6).optional(),
})

// Schema for password change
const passwordSchema = yup.object({
  currentPassword: yup.string().required('La contraseña actual es requerida'),
  newPassword: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La nueva contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
    .required('Debes confirmar la contraseña'),
})

type ProfileFormData = yup.InferType<typeof profileSchema>
type PasswordFormData = yup.InferType<typeof passwordSchema>

interface UserStats {
  totalRentals: number
  activeRentals: number
  totalEvents: number
}

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [stats, setStats] = useState<UserStats>({
    totalRentals: 0,
    activeRentals: 0,
    totalEvents: 0,
  })

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      phone: user?.phone || '',
      socioeconomicStratum: user?.socioeconomicStratum || 1,
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  })

  // Load user statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true)

        // Fetch user rentals
        const rentalsResponse = await apiClient.get<ApiResponse<any>>('/rentals/my')
        const rentals = rentalsResponse.data.data || []

        // Fetch user events
        const eventsResponse = await apiClient.get<ApiResponse<any>>('/events/my-registrations')
        const events = eventsResponse.data.data || []

        setStats({
          totalRentals: rentals.length,
          activeRentals: rentals.filter((r: any) => r.status === 'active').length,
          totalEvents: events.length,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        // Don't show error toast for stats, just set defaults
        setStats({ totalRentals: 0, activeRentals: 0, totalEvents: 0 })
      } finally {
        setIsLoadingStats(false)
      }
    }

    loadStats()
  }, [])

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      const response = await apiClient.put<ApiResponse<any>>('/auth/profile', {
        phone: data.phone,
        socioeconomicStratum: data.socioeconomicStratum,
      })

      if (response.data.data) {
        updateUser(response.data.data)
        toast.success('Perfil actualizado exitosamente')
        setIsEditing(false)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar perfil')
    }
  }

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      await apiClient.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      toast.success('Contraseña cambiada exitosamente')
      resetPassword()
      setIsChangingPassword(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cambiar contraseña')
    }
  }

  const handleCancelEdit = () => {
    resetProfile({
      phone: user?.phone || '',
      socioeconomicStratum: user?.socioeconomicStratum || 1,
    })
    setIsEditing(false)
  }

  const handleCancelPasswordChange = () => {
    resetPassword()
    setIsChangingPassword(false)
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  const documentType = DOCUMENT_TYPES.find((dt) => dt.value === user.documentType)
  const regional = user.regionalId

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-2">Gestiona tu información personal y configuración</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              {isLoadingStats ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-sena-orange">{stats.totalRentals}</div>
                  <div className="text-gray-600 mt-1">Alquileres Totales</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              {isLoadingStats ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-sena-green">{stats.activeRentals}</div>
                  <div className="text-gray-600 mt-1">Alquileres Activos</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              {isLoadingStats ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalEvents}</div>
                  <div className="text-gray-600 mt-1">Eventos Inscritos</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-sena-orange" />
              <CardTitle>Información Personal</CardTitle>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Read-only fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres
                </label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                  {user.firstName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos
                </label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                  {user.lastName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                  {documentType?.label}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Documento
                </label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                  {user.documentNumber}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Regional</label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">
                  {typeof regional === 'object' && regional !== null
                    ? regional.name
                    : 'No asignada'}
                </div>
              </div>

              {/* Editable fields */}
              <Input
                label="Teléfono"
                type="tel"
                {...registerProfile('phone')}
                error={profileErrors.phone?.message}
                disabled={!isEditing}
                placeholder="Ingresa tu teléfono"
              />

              <Select
                label="Estrato Socioeconómico"
                {...registerProfile('socioeconomicStratum')}
                error={profileErrors.socioeconomicStratum?.message}
                disabled={!isEditing}
                options={[...SOCIOECONOMIC_STRATA]}
              />
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-6">
                <Button
                  type="submit"
                  isLoading={isSubmittingProfile}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSubmittingProfile}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-sena-orange" />
              <CardTitle>Seguridad</CardTitle>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Cambiar Contraseña
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isChangingPassword ? (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <div className="space-y-4">
                <Input
                  label="Contraseña Actual"
                  type="password"
                  {...registerPassword('currentPassword')}
                  error={passwordErrors.currentPassword?.message}
                  placeholder="Ingresa tu contraseña actual"
                />

                <Input
                  label="Nueva Contraseña"
                  type="password"
                  {...registerPassword('newPassword')}
                  error={passwordErrors.newPassword?.message}
                  placeholder="Ingresa tu nueva contraseña"
                />

                <Input
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  {...registerPassword('confirmPassword')}
                  error={passwordErrors.confirmPassword?.message}
                  placeholder="Confirma tu nueva contraseña"
                />

                <div className="flex gap-4 mt-6">
                  <Button
                    type="submit"
                    isLoading={isSubmittingPassword}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Cambiar Contraseña
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelPasswordChange}
                    disabled={isSubmittingPassword}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <p className="text-gray-600">
              Puedes cambiar tu contraseña en cualquier momento por seguridad.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage