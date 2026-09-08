import React from 'react'

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-xl w-full bg-white p-6 rounded-md shadow">
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">An error occurred while rendering the application. Check the console for details.</p>
            <pre className="text-xs text-red-600 whitespace-pre-wrap">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }

    return this.props.children as React.ReactElement
  }
}

export default ErrorBoundary
