'use client';

import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-xl font-bold text-slate-800 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-slate-600 mb-6">
              Don't worry, your data is safe. Please refresh the page to continue.
            </p>
            
            <button
              onClick={this.handleReset}
              className="w-full bg-emerald-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Page
            </button>
            
            <p className="text-xs text-slate-400 mt-4">
              If this keeps happening, try clearing your browser cache.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
