import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, Home } from 'lucide-react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-slate-400 mb-6">
              The application encountered an unexpected error. We're sorry for the inconvenience.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-slate-500 text-sm cursor-pointer mb-2">
                  Error Details
                </summary>
                <pre className="bg-slate-900 p-4 rounded-lg text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 min-h-[44px]"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

