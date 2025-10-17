import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  className?: string
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    danger: 'badge badge-danger',
    info: 'badge badge-info',
    default: 'badge bg-gray-100 text-gray-800',
  }

  return <span className={`${variants[variant]} ${className}`}>{children}</span>
}