import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    console.error('[React ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto font-bold text-xl">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">Reinicio de Sesión Administrador</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ocurrió un ajuste de memoria en el navegador. Haz clic para recargar el panel de forma limpia.
            </p>
            {this.state.error && (
              <div className="bg-slate-950 border border-amber-500/30 p-3 rounded-xl text-[11px] text-amber-300 font-mono text-left overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Recargar Panel Creadora 🚀
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
