import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  retryText?: string
  fullScreen?: boolean
  className?: string
}

export function ErrorState({ 
  message = "Algo deu errado",
  onRetry,
  retryText = "Tentar novamente",
  fullScreen = true,
  className = ""
}: ErrorStateProps) {
  const errorContent = (
    <div className="text-center">
      <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2 mx-auto">
          <RefreshCw className="h-4 w-4" />
          {retryText}
        </Button>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-20 via-blue-20 to-indigo-20 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            {errorContent}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      {errorContent}
    </div>
  )
}
