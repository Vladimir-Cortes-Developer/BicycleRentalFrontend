import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export const Card = ({ children, className = '', padding = 'md', hover = false }: CardProps) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200' : ''

  return (
    <div className={`card ${paddingStyles[padding]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export const CardTitle = ({ children, className = '' }: CardTitleProps) => {
  return <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export const CardContent = ({ children, className = '' }: CardContentProps) => {
  return <div className={className}>{children}</div>
}