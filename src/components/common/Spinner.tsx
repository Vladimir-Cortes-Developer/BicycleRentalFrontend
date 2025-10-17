import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export const Spinner = ({ size = 'md', className = '', text }: SpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-sena-orange`} />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  )
}

export const PageSpinner = ({ text = 'Cargando...' }: { text?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" text={text} />
    </div>
  )
}