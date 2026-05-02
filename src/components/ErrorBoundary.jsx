import React from 'react';

/**
 * GlobalErrorBoundary
 * Catches any unhandled React render/lifecycle errors in the component tree
 * and renders a friendly fallback UI instead of a blank white screen.
 */
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging / future monitoring integration
    console.error('[GlobalErrorBoundary] Unhandled component error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    // Reset state so the boundary can try again, then navigate home
    this.setState({ hasError: false, error: null, errorInfo: null }, () => {
      window.location.hash = '/';
    });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isDev = import.meta.env.DEV;

    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          {/* Icon */}
          <div style={styles.iconWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>

          <h1 style={styles.title}>Ceva nu a mers bine</h1>
          <p style={styles.subtitle}>
            A apărut o eroare neașteptată în aplicație. Echipa tehnică a fost notificată.
          </p>

          {/* Developer details — shown only in DEV mode */}
          {isDev && this.state.error && (
            <details style={styles.details}>
              <summary style={styles.summary}>Detalii tehnice (dev only)</summary>
              <pre style={styles.pre}>
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={this.handleReload}>
              <svg style={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Reîncarcă pagina
            </button>
            <button style={styles.btnSecondary} onClick={this.handleGoHome}>
              <svg style={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Acasă
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ── Inline styles (no external CSS dependency — intentional for a safety net) ──

const styles = {
  overlay: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    padding: '1rem',
  },
  card: {
    background: 'rgba(30, 41, 59, 0.9)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '1.25rem',
    padding: '2.5rem 3rem',
    maxWidth: '540px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(239,68,68,0.1)',
    backdropFilter: 'blur(12px)',
  },
  iconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.15)',
    marginBottom: '1.5rem',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  icon: {
    width: '36px',
    height: '36px',
    color: '#ef4444',
  },
  title: {
    fontSize: '1.625rem',
    fontWeight: 700,
    color: '#f1f5f9',
    margin: '0 0 0.75rem 0',
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: '0.9375rem',
    color: '#94a3b8',
    lineHeight: 1.7,
    margin: '0 0 2rem 0',
  },
  details: {
    textAlign: 'left',
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    marginBottom: '1.75rem',
  },
  summary: {
    cursor: 'pointer',
    color: '#f87171',
    fontWeight: 600,
    fontSize: '0.875rem',
    userSelect: 'none',
  },
  pre: {
    marginTop: '0.75rem',
    fontSize: '0.75rem',
    color: '#cbd5e1',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    gap: '0.875rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.5rem',
    borderRadius: '0.625rem',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.5rem',
    borderRadius: '0.625rem',
    border: '1px solid rgba(148,163,184,0.3)',
    background: 'rgba(148,163,184,0.08)',
    color: '#94a3b8',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnIcon: {
    width: '16px',
    height: '16px',
  },
};

export default GlobalErrorBoundary;
