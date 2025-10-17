import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-sena-orange hover:bg-orange-600 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-sena-green hover:bg-green-600 text-white shadow-sm hover:shadow-md',
    outline: 'border-2 border-sena-orange text-sena-orange hover:bg-sena-orange hover:text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md',
    ghost: 'text-gray-700 hover:bg-gray-100',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  )
}