import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log the error to an external service here
    console.error("Uncaught error in component tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded shadow">
          <h2 className="text-lg font-bold text-red-700">
            Something went wrong.
          </h2>
          <p className="text-sm text-red-600 mt-2">
            An unexpected error occurred while rendering this part of the app.
          </p>
          <details className="mt-2 text-xs text-gray-500">
            {this.state.error && String(this.state.error)}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
