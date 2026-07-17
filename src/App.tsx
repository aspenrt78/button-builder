import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ButtonCardApp } from './ButtonCardApp';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info); }
  render() {
    if (this.state.error) return <div className="p-6 text-red-300">Button Builder failed to load: {this.state.error.message}</div>;
    return this.props.children;
  }
}

export default function App() {
  return <div className="h-screen w-screen bg-black text-white overflow-hidden"><ErrorBoundary><ButtonCardApp /></ErrorBoundary></div>;
}
