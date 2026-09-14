import { Component, type ErrorInfo, type ReactNode } from 'react';
import { L } from '../../lib/i18n';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level safety net (Phase 15 §134): a component exception must never leave a blank white
 * page. Development shows the real error for debugging; production shows a branded recovery
 * screen only.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Terminal Space: unhandled error', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="auth-loading-shell">
        <div>
          <p className="kicker">{L('Something went wrong', 'حدث خطأ')}</p>
          <h1>{L('Terminal Space hit an unexpected error.', 'واجه تيرمنال سبيس خطأ غير متوقع.')}</h1>
          <p className="lede">
            {L('Reloading usually fixes it. Your saved progress is untouched.', 'عادة يكفي إعادة التحميل. تقدّمك المحفوظ لم يُمس.')}
          </p>
          {import.meta.env.DEV && (
            <pre className="error-detail">{this.state.error.stack ?? this.state.error.message}</pre>
          )}
          <div className="cta-row">
            <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
              {L('Reload Terminal Space', 'إعادة تحميل تيرمنال سبيس')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
