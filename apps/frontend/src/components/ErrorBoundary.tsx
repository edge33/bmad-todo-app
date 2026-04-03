import React, { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  resetKey: number;
}

/**
 * React 19 Error Boundary (best practice)
 * Class component that catches errors during rendering, in lifecycle methods,
 * and in constructors of child components.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, resetKey: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, resetKey: 0 };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details (could send to error tracking service here)
    console.error("ErrorBoundary caught an error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      resetKey: this.state.resetKey + 1,
    });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-surface-lighter p-md">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-text-primary mb-md">
              Something went wrong
            </h1>
            <p className="text-text-secondary mb-lg text-sm">
              {this.state.error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>
            <div className="flex gap-md justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-md py-xs bg-primary-DEFAULT text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-md py-xs bg-text-secondary text-white rounded-lg hover:bg-text-primary transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </main>
      );
    }

    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}
