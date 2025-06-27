import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error caught by boundary', { error, errorInfo });
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container">
          <div className="card text-center" style={{ maxWidth: '600px', margin: '100px auto' }}>
            <div className="card-header">
              <h2 className="text-error">Something went wrong</h2>
            </div>
            
            <div className="p-3">
              <p className="body1 text-secondary mb-3">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-3">
                  <summary className="cursor-pointer text-primary">
                    Error Details (Development)
                  </summary>
                  <div className="p-2 mt-2" style={{ 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack:</strong>
                        <pre style={{ 
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          marginTop: '8px'
                        }}>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              <div className="flex gap-2 flex-wrap">
                <button 
                  className="btn btn-primary"
                  onClick={this.handleReload}
                >
                  Reload Page
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={this.handleGoHome}
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 