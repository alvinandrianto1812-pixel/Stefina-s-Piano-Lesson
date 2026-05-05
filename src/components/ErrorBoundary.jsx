import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center px-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Terjadi kesalahan</h2>
            <p className="text-gray-500 mb-4">Silakan refresh halaman.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-gold text-white rounded"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}