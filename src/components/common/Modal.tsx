import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-lg shadow-xl ${sizes[size]} w-full max-h-[90vh] overflow-hidden`}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">{children}</div>
        </div>
      </div>
    </div>
  )
}

interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export const ModalFooter = ({ children, className = '' }: ModalFooterProps) => {
  return (
    <div className={`flex items-center justify-end gap-3 pt-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  isLoading?: boolean
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600">{message}</p>
      <ModalFooter className="mt-6">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}