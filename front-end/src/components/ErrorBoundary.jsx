import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("UI crashed:", error, info);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div style={{ padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
          <h2 style={{ margin: "0 0 8px" }}>Giao diện bị lỗi khi render</h2>
          <div style={{ whiteSpace: "pre-wrap", color: "#b91c1c" }}>{String(error?.message || error)}</div>
          <div style={{ marginTop: 8, color: "#374151" }}>
            Mở DevTools Console để xem stacktrace chi tiết.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

