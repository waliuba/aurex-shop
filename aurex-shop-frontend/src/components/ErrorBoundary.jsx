import React from 'react';
import { textStrings } from '../constants/textStrings';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally silent: keep UX clean for presentations.
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="tw-p-6 tw-rounded-2xl tw-border tw-border-slate-200 dark:tw-border-slate-800">
            <div className="tw-font-semibold">{textStrings.errors.boundary.title}</div>
            <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">
              {textStrings.errors.boundary.body}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
